/**
 * AI Agent Interview Service
 * Uses Gemini's native chat API (model.startChat + chat.sendMessage)
 * Supports both Technical (coding + conceptual) and Business Sector (scenario-based voice) interviews.
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../config/logger');
const { isSector, getSectorLevelSpec, SECTOR_LEVEL_SPECS } = require('../config/sectors');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/* ─── Tech Level Specs (unchanged) ───────────────────────── */
const LEVEL_SPECS = {
  1: {
    name: 'Junior',
    description: 'Foundational concepts, basic syntax, common patterns, simple problem-solving.',
    topics: ['Core language basics', 'Data types & structures', 'Functions & control flow', 'Basic OOP / FP concepts', 'Simple algorithms'],
    questionCount: 5,
    estimatedMinutes: '10–15',
    passMark: 60,
  },
  2: {
    name: 'Mid-level',
    description: 'System design basics, optimization, architectural patterns, debugging skills.',
    topics: ['Design patterns', 'API design', 'Performance & optimization', 'Error handling', 'Testing strategies', 'Database design basics'],
    questionCount: 7,
    estimatedMinutes: '15–20',
    passMark: 65,
  },
  3: {
    name: 'Senior',
    description: 'Complex system architecture, scalability, leadership decisions, deep-dive analysis.',
    topics: ['Distributed systems', 'Scalability & caching', 'Security best practices', 'CI/CD & DevOps', 'Code review & team standards', 'Complex algorithm design'],
    questionCount: 10,
    estimatedMinutes: '20–30',
    passMark: 70,
  },
};

const getLevelSpec = (stackOrSector, level) => {
  if (isSector(stackOrSector)) {
    const spec = getSectorLevelSpec(stackOrSector, level);
    if (spec) return spec;
  }
  return LEVEL_SPECS[level] || LEVEL_SPECS[1];
};

/* ─── Model Factory ───────────────────────────────────────── */
function getModel() {
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

/* ─── Tech Stack System Prompt ────────────────────────────── */
function buildTechSystemPrompt(stack, level) {
  const spec = LEVEL_SPECS[level] || LEVEL_SPECS[1];
  const codingCount = Math.ceil(spec.questionCount / 2);
  const conceptCount = spec.questionCount - codingCount;

  return `You are InterviewAI — an autonomous, professional technical interviewer for ${stack} at ${spec.name} level (Level ${level}).

## Your Role
You manage the entire interview independently. You decide when to ask follow-ups, when to move on, and when to end.

## Interview Structure (MANDATORY ORDER)
1. First ${codingCount} questions: Practical CODING challenges only (write code, trace logic, debug, time complexity)
2. Last ${conceptCount} questions: CONCEPTUAL / theory questions (design decisions, trade-offs, best practices)

## Topics to Cover
${spec.topics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

## Agent Rules
- Ask ONE question at a time
- After each answer, deeply analyze it:
  → If WEAK/VAGUE/INCOMPLETE: ask a targeted follow-up referencing what they said (set isFollowUp: true)
  → If STRONG/COMPLETE: move to the next planned question
- Never repeat a question
- Keep questions direct and clear
- Total questions to ask: ${spec.questionCount}
- After all questions are done, close the interview professionally (set done: true)

## ALWAYS respond in this exact JSON format (no markdown, no code fences):
{
  "message": "Your question or closing statement",
  "isCodingQuestion": true or false,
  "questionNumber": <current question number>,
  "totalQuestions": ${spec.questionCount},
  "isFollowUp": true or false,
  "done": true or false
}`;
}

/* ─── Business Sector System Prompt ──────────────────────── */
function buildSectorSystemPrompt(sector, level) {
  const spec = getSectorLevelSpec(sector, level) || LEVEL_SPECS[level] || LEVEL_SPECS[1];
  const aiRole = spec.aiRole || 'interviewer';
  const topicsList = (spec.topics || []).map((t, i) => `${i + 1}. ${t}`).join('\n');
  const scenario = (spec.scenarios || [])[0] || '';

  let roleInstructions = '';
  if (aiRole === 'customer') {
    roleInstructions = `## Your Role: AI Customer / Client
You play a REAL CUSTOMER or CLIENT throughout this entire interview. The candidate is the ${sector} professional trying to handle/sell/support you.
- Start by presenting yourself as a customer with a problem, objection, or situation relevant to ${sector}.
- React REALISTICALLY to the candidate's responses — be challenging but fair. Push back if their response is weak.
- If their response is strong and resolves the situation, acknowledge it and escalate to a new challenge or a follow-up scenario.
- Do NOT break character to give feedback — stay in character as the customer throughout.
- After ${spec.questionCount} scenarios/exchanges, wrap up professionally and set done: true.

Opening scenario to present:
${scenario}`;
  } else if (aiRole === 'manager') {
    roleInstructions = `## Your Role: Senior Manager / Business Leader
You play a SENIOR MANAGER posing business problems and scenarios to the candidate.
- Present one business scenario or problem at a time.
- After the candidate responds, evaluate their thinking: if weak or vague, probe deeper with a follow-up question.
- If their response is strong, move to the next business scenario.
- Keep the scenarios grounded in real ${sector} situations at ${spec.name} level.
- After ${spec.questionCount} scenarios, close professionally and set done: true.`;
  } else {
    roleInstructions = `## Your Role: Professional Interviewer
You conduct a structured professional interview focused on ${sector} competencies at ${spec.name} level.
- Ask scenario-based and behavioral questions (no coding).
- After each answer, probe deeper if the answer is weak or vague (set isFollowUp: true).
- Move forward if the answer is strong and complete.
- After ${spec.questionCount} questions, close professionally and set done: true.`;
  }

  return `You are InterviewAI — an autonomous professional AI conducting a ${sector} interview at ${spec.name} level (Level ${level}).

${roleInstructions}

## Topics / Competencies to Cover
${topicsList}

## Interview Rules
- This is a VOICE / CONVERSATIONAL interview — NO coding questions whatsoever.
- Ask or present ONE scenario / question at a time.
- Total exchanges: ${spec.questionCount}
- Be professional, realistic, and challenging but fair.
- Never repeat a scenario.
- isCodingQuestion must ALWAYS be false for business sector interviews.

## ALWAYS respond in this exact JSON format (no markdown, no code fences):
{
  "message": "Your question, scenario, or customer statement",
  "isCodingQuestion": false,
  "questionNumber": <current question number>,
  "totalQuestions": ${spec.questionCount},
  "isFollowUp": true or false,
  "done": true or false
}`;
}

/* ─── Unified System Prompt Builder ──────────────────────── */
function buildSystemPrompt(stackOrSector, level) {
  if (isSector(stackOrSector)) {
    return buildSectorSystemPrompt(stackOrSector, level);
  }
  return buildTechSystemPrompt(stackOrSector, level);
}

/* ─── Convert DB transcript to Gemini chat history format ─── */
function transcriptToGeminiHistory(transcript) {
  return transcript.map((entry) => ({
    role: entry.role === 'interviewer' ? 'model' : 'user',
    parts: [{ text: entry.content }],
  }));
}

/* ─── Parse Gemini response text → structured object ─────── */
function parseAgentResponse(text, questionNumber, totalQuestions) {
  try {
    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      message: parsed.message || 'Please continue.',
      isCodingQuestion: parsed.isCodingQuestion === true,
      questionNumber: parsed.questionNumber || questionNumber,
      totalQuestions: parsed.totalQuestions || totalQuestions,
      isFollowUp: parsed.isFollowUp === true,
      done: parsed.done === true,
    };
  } catch {
    const plain = text.replace(/```json|```/g, '').trim().slice(0, 600);
    return {
      message: plain || 'Please continue with your answer.',
      isCodingQuestion: false,
      questionNumber,
      totalQuestions,
      isFollowUp: false,
      done: false,
    };
  }
}

/* ─── Fallback questions ──────────────────────────────────── */
function fallbackFirstQuestion(stackOrSector, level) {
  const spec = getLevelSpec(stackOrSector, level);
  const isBusiness = isSector(stackOrSector);
  const scenario = isBusiness && spec.scenarios ? spec.scenarios[0] : null;
  return {
    message: scenario
      ? `Let's begin! Here's your first scenario: ${scenario}`
      : `Let's begin! Write a function in ${stackOrSector} that takes an array of integers and returns all pairs that sum to a given target value. Explain your approach and its time complexity.`,
    isCodingQuestion: !isBusiness,
    questionNumber: 1,
    totalQuestions: spec.questionCount || 6,
    isFollowUp: false,
    done: false,
  };
}

function fallbackNextQuestion(stackOrSector, level, questionNumber) {
  const spec = getLevelSpec(stackOrSector, level);
  const isBusiness = isSector(stackOrSector);
  const isDone = questionNumber > (spec.questionCount || 6);
  return {
    message: isDone
      ? 'Thank you for completing the interview! I will now evaluate your responses.'
      : isBusiness
        ? `Tell me about a time you faced a significant challenge in ${stackOrSector} and how you handled it.`
        : `Question ${questionNumber}: How do you approach error handling in production ${stackOrSector} applications?`,
    isCodingQuestion: false,
    questionNumber,
    totalQuestions: spec.questionCount || 6,
    isFollowUp: false,
    done: isDone,
  };
}

/* ══════════════════════════════════════════════════════════════
   PUBLIC API
═══════════════════════════════════════════════════════════════ */

/**
 * Start a new interview session.
 */
const startSession = async (stackOrSector, level) => {
  const spec = getLevelSpec(stackOrSector, level);
  const isBusiness = isSector(stackOrSector);

  try {
    const model = getModel();
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: buildSystemPrompt(stackOrSector, level) }],
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I am ready to begin the interview.' }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    });

    const openingPrompt = isBusiness
      ? `Start the interview now. Present your first scenario or question for a ${stackOrSector} professional at ${spec.name} level. Be direct and realistic.`
      : `Start the interview now. Ask Question 1 — a practical ${stackOrSector} coding challenge appropriate for ${spec.name} level. Be direct, no preamble.`;

    const result = await chat.sendMessage(openingPrompt);
    const text = result.response.text();
    return parseAgentResponse(text, 1, spec.questionCount);
  } catch (err) {
    logger.error(`aiAgentService startSession error: ${err.message}`);
    return fallbackFirstQuestion(stackOrSector, level);
  }
};

/**
 * Get the next AI response given the full conversation transcript.
 */
const getNextResponse = async (stackOrSector, level, transcript, questionNumber, latestAnswer) => {
  const spec = getLevelSpec(stackOrSector, level);
  const isDone = questionNumber > spec.questionCount;
  const isBusiness = isSector(stackOrSector);

  try {
    const model = getModel();
    const history = [
      {
        role: 'user',
        parts: [{ text: buildSystemPrompt(stackOrSector, level) }],
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I am ready to conduct this interview.' }],
      },
      {
        role: 'user',
        parts: [{
          text: isBusiness
            ? `Start the interview now. Present your first scenario for a ${stackOrSector} professional at ${spec.name} level.`
            : `Start the interview now. Ask Question 1 — a practical ${stackOrSector} coding challenge.`,
        }],
      },
      ...transcriptToGeminiHistory(transcript),
    ];

    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    });

    const messageToSend = isDone
      ? 'The interview is complete. Please give your professional closing statement and set done: true in your JSON response.'
      : latestAnswer;

    const result = await chat.sendMessage(messageToSend);
    const text = result.response.text();
    return parseAgentResponse(text, questionNumber, spec.questionCount);
  } catch (err) {
    logger.error(`aiAgentService getNextResponse error: ${err.message}`);
    return fallbackNextQuestion(stackOrSector, level, questionNumber);
  }
};

/**
 * Evaluate the completed interview.
 * Adapts scoring criteria based on whether this is a tech or business sector interview.
 */
const evaluateInterview = async (stackOrSector, level, transcript) => {
  const spec = getLevelSpec(stackOrSector, level);
  const isBusiness = isSector(stackOrSector);

  const formattedHistory = transcript
    .map((t, i) => {
      const role = t.role === 'interviewer' ? '🤖 Interviewer' : '👤 Candidate';
      return `[Turn ${i + 1}] ${role}:\n${t.content}`;
    })
    .join('\n\n---\n\n');

  let evaluationPrompt;

  if (isBusiness) {
    const topicsList = (spec.topics || []).join(', ');
    const aiRole = spec.aiRole || 'interviewer';
    const roleContext = aiRole === 'customer'
      ? 'The interviewer was playing a customer/client and the candidate was handling scenarios in their professional role.'
      : aiRole === 'manager'
        ? 'The interviewer was playing a senior manager posing business scenarios and problems.'
        : 'This was a structured behavioral/scenario-based professional interview.';

    evaluationPrompt = `You are a senior ${stackOrSector} professional evaluator. Evaluate this completed ${spec.name} (Level ${level}) ${stackOrSector} interview.

## Context
${roleContext}

## Evaluation Criteria
- Level: ${spec.name}
- Competencies tested: ${topicsList}
- Pass mark: ${spec.passMark}%
- Interview type: Scenario-based / Voice only (no coding)

## Scoring Guide
- Communication clarity and professionalism
- Practical knowledge and real-world awareness
- Problem-solving and decision-making quality
- Handling of follow-ups and probing questions
- Confidence, empathy (where relevant), and leadership presence
- Empty or very weak answers significantly reduce the score

## Full Interview Transcript
${formattedHistory}

## Task
Score the candidate based on ALL their responses. Be fair but rigorous.

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "totalScore": 0-100,
  "passed": true or false,
  "codingScore": 0,
  "conceptScore": 0-100,
  "feedback": "2-3 sentence overall evaluation referencing specific answers",
  "strengths": ["specific strength 1", "specific strength 2"],
  "weaknesses": ["specific weakness 1", "specific weakness 2"],
  "recommendations": "Concrete advice tailored to what this candidate struggled with"
}`;
  } else {
    const codingCount = Math.ceil(spec.questionCount / 2);
    const conceptCount = spec.questionCount - codingCount;
    evaluationPrompt = `You are a senior ${stackOrSector} technical interviewer. Evaluate this completed ${spec.name} (Level ${level}) interview.

## Evaluation Criteria
- Level: ${spec.name}
- Topics tested: ${(spec.topics || []).join(', ')}
- Pass mark: ${spec.passMark}%
- Structure: ${codingCount} coding questions + ${conceptCount} conceptual questions

## Scoring Guide
- Coding answers: correctness, efficiency, edge cases, code quality
- Conceptual answers: depth of understanding, trade-offs, real-world awareness
- Follow-up quality: ability to improve/refine under pressure
- Empty or very weak answers significantly reduce the score

## Full Interview Transcript
${formattedHistory}

## Task
Score the candidate based on ALL answers above. Be fair but rigorous.

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "totalScore": 0-100,
  "passed": true or false,
  "codingScore": 0-100,
  "conceptScore": 0-100,
  "feedback": "2-3 sentence overall evaluation referencing specific answers",
  "strengths": ["specific strength 1", "specific strength 2"],
  "weaknesses": ["specific weakness 1", "specific weakness 2"],
  "recommendations": "Concrete advice tailored to what this candidate struggled with"
}`;
  }

  const fallback = {
    totalScore: 50,
    passed: false,
    codingScore: isBusiness ? 0 : 50,
    conceptScore: 50,
    feedback: 'Interview completed. Unable to auto-evaluate at this time.',
    strengths: ['Completed the full interview'],
    weaknesses: ['Review core concepts and practice more scenarios'],
    recommendations: isBusiness
      ? `Study ${stackOrSector} best practices and practice scenario-based questions.`
      : 'Practice LeetCode-style problems and review system design fundamentals.',
  };

  try {
    const model = getModel();
    const result = await model.generateContent(evaluationPrompt);
    const text = result.response.text();

    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in evaluation response');

    const parsed = JSON.parse(jsonMatch[0]);
    parsed.passed = (parsed.totalScore || 0) >= spec.passMark;
    parsed.totalScore = Math.min(100, Math.max(0, parsed.totalScore || 0));
    parsed.codingScore = Math.min(100, Math.max(0, parsed.codingScore || (isBusiness ? 0 : parsed.totalScore)));
    parsed.conceptScore = Math.min(100, Math.max(0, parsed.conceptScore || parsed.totalScore));
    return parsed;
  } catch (err) {
    logger.error(`aiAgentService evaluateInterview error: ${err.message}`);
    return fallback;
  }
};

module.exports = { startSession, getNextResponse, evaluateInterview, getLevelSpec, LEVEL_SPECS, isSector };
