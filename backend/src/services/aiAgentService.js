/**
 * AI Agent Interview Service
 * Uses Gemini's native chat API (model.startChat + chat.sendMessage)
 * instead of raw string prompts — this is the correct production pattern.
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../config/logger');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/* ─── Level Specs ─────────────────────────────────────────── */
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

const getLevelSpec = (level) => LEVEL_SPECS[level] || LEVEL_SPECS[1];

/* ─── Model Factory ───────────────────────────────────────── */
// Models confirmed working with this API key:
//   gemini-2.5-flash       (best quality, primary)
//   gemini-flash-lite-latest (lite fallback)
// NOTE: gemini-1.5-flash is NOT available on this key's project.
// NOTE: gemini-2.0-flash quota is currently exhausted.
function getModel() {
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

/* ─── System Prompt ───────────────────────────────────────── */
function buildSystemPrompt(stack, level) {
  const spec = getLevelSpec(level);
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

/* ─── Convert DB transcript to Gemini chat history format ─── */
function transcriptToGeminiHistory(transcript) {
  // Gemini chat history: alternating user/model roles
  // Interviewer messages → 'model', Candidate messages → 'user'
  return transcript.map((entry) => ({
    role: entry.role === 'interviewer' ? 'model' : 'user',
    parts: [{ text: entry.content }],
  }));
}

/* ─── Parse Gemini response text → structured object ─────── */
function parseAgentResponse(text, questionNumber, totalQuestions) {
  try {
    // Strip markdown code fences if Gemini wraps response in them
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
    // Graceful degradation: return the raw text as the message
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

/* ─── Fallback first question (no API) ───────────────────── */
function fallbackFirstQuestion(stack, level) {
  const spec = getLevelSpec(level);
  return {
    message: `Let's begin! Write a function in ${stack} that takes an array of integers and returns all pairs that sum to a given target value. Explain your approach and its time complexity.`,
    isCodingQuestion: true,
    questionNumber: 1,
    totalQuestions: spec.questionCount,
    isFollowUp: false,
    done: false,
  };
}

/* ─── Fallback next question (no API) ────────────────────── */
function fallbackNextQuestion(stack, level, questionNumber) {
  const spec = getLevelSpec(level);
  const codingPhase = questionNumber <= Math.ceil(spec.questionCount / 2);
  const isDone = questionNumber > spec.questionCount;
  return {
    message: isDone
      ? 'Thank you for completing the interview! I will now evaluate your answers.'
      : codingPhase
        ? `Question ${questionNumber}: Write a ${stack} function that implements a simple LRU cache. Explain your design choices.`
        : `Question ${questionNumber}: How do you approach error handling in production ${stack} applications? What are the best practices you follow?`,
    isCodingQuestion: codingPhase && !isDone,
    questionNumber,
    totalQuestions: spec.questionCount,
    isFollowUp: false,
    done: isDone,
  };
}

/* ══════════════════════════════════════════════════════════════
   PUBLIC API
═══════════════════════════════════════════════════════════════ */

/**
 * Start a new interview session.
 * Uses model.startChat() — no prior history yet.
 */
const startSession = async (stack, level) => {
  const spec = getLevelSpec(level);

  try {
    const model = getModel();

    // Start a fresh chat with the system instruction as the first exchange
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: buildSystemPrompt(stack, level) }],
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

    // Trigger the first question
    const result = await chat.sendMessage(
      `Start the interview now. Ask Question 1 — a practical ${stack} coding challenge appropriate for ${spec.name} level. Be direct, no preamble.`
    );
    const text = result.response.text();
    return parseAgentResponse(text, 1, spec.questionCount);
  } catch (err) {
    logger.error(`aiAgentService startSession error: ${err.message}`);
    return fallbackFirstQuestion(stack, level);
  }
};

/**
 * Get the next AI response given the full conversation transcript.
 * Rebuilds the Gemini chat history from the transcript every turn.
 * This is the correct pattern: chat history is stateless on our side,
 * Gemini handles context via the structured history array.
 */
const getNextResponse = async (stack, level, transcript, questionNumber, latestAnswer) => {
  const spec = getLevelSpec(level);
  const isDone = questionNumber > spec.questionCount;

  try {
    const model = getModel();

    // Build full chat history from transcript
    // Format: system prompt exchange first, then the actual conversation
    const history = [
      {
        role: 'user',
        parts: [{ text: buildSystemPrompt(stack, level) }],
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. I am ready to conduct this interview.' }],
      },
      // Add initial trigger for first question (always the first real message)
      {
        role: 'user',
        parts: [{ text: `Start the interview now. Ask Question 1 — a practical ${stack} coding challenge.` }],
      },
      // Then the actual conversation transcript (excluding the very last candidate answer)
      ...transcriptToGeminiHistory(transcript),
    ];

    // Start a chat with the full history (this gives Gemini full context)
    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    });

    // Send the latest candidate answer as the new message
    const messageToSend = isDone
      ? 'The interview is complete. Please give your professional closing statement and set done: true in your JSON response.'
      : latestAnswer;

    const result = await chat.sendMessage(messageToSend);
    const text = result.response.text();
    return parseAgentResponse(text, questionNumber, spec.questionCount);
  } catch (err) {
    logger.error(`aiAgentService getNextResponse error: ${err.message}`);
    return fallbackNextQuestion(stack, level, questionNumber);
  }
};

/**
 * Evaluate the completed interview.
 * Sends full transcript to Gemini for scoring.
 */
const evaluateInterview = async (stack, level, transcript) => {
  const spec = getLevelSpec(level);
  const codingCount = Math.ceil(spec.questionCount / 2);
  const conceptCount = spec.questionCount - codingCount;

  // Format the full transcript for evaluation
  const formattedHistory = transcript
    .map((t, i) => {
      const role = t.role === 'interviewer' ? '🤖 Interviewer' : '👤 Candidate';
      return `[Turn ${i + 1}] ${role}:\n${t.content}`;
    })
    .join('\n\n---\n\n');

  const evaluationPrompt = `You are a senior ${stack} technical interviewer. Evaluate this completed ${spec.name} (Level ${level}) interview.

## Evaluation Criteria
- Level: ${spec.name}
- Topics tested: ${spec.topics.join(', ')}
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

  const fallback = {
    totalScore: 50,
    passed: false,
    codingScore: 50,
    conceptScore: 50,
    feedback: 'Interview completed. Unable to auto-evaluate at this time.',
    strengths: ['Completed the full interview'],
    weaknesses: ['Review core concepts and practice coding problems'],
    recommendations: 'Practice LeetCode-style problems and review system design fundamentals.',
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
    parsed.codingScore = Math.min(100, Math.max(0, parsed.codingScore || parsed.totalScore));
    parsed.conceptScore = Math.min(100, Math.max(0, parsed.conceptScore || parsed.totalScore));
    return parsed;
  } catch (err) {
    logger.error(`aiAgentService evaluateInterview error: ${err.message}`);
    return fallback;
  }
};

module.exports = { startSession, getNextResponse, evaluateInterview, getLevelSpec, LEVEL_SPECS };
