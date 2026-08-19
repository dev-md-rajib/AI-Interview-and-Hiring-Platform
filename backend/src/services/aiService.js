const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../config/logger');
const { isSector, getSectorLevelSpec } = require('../config/sectors');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'placeholder');

const getModel = () => {
  try {
    return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  } catch (e) {
    logger.warn('Gemini model init failed, using fallback questions');
    return null;
  }
};

// Level descriptions for tech stacks
const TECH_LEVEL_DESCRIPTIONS = {
  1: 'Junior level — foundational concepts, basic syntax, common patterns',
  2: 'Mid level — system design basics, optimization, architecture patterns',
  3: 'Senior level — complex architecture, deep analysis, leadership decisions',
};

// Generate interview questions via Gemini
const generateQuestions = async (stackOrSector, level, count = 10) => {
  const sectorMode = isSector(stackOrSector);

  let prompt;

  if (sectorMode) {
    const spec = getSectorLevelSpec(stackOrSector, level);
    const topicsList = spec ? spec.topics.join(', ') : stackOrSector;
    const levelName = spec ? spec.name : `Level ${level}`;
    const scenario = spec && spec.scenarios ? spec.scenarios[0] : '';

    prompt = `You are an expert ${stackOrSector} professional interviewer. Generate exactly ${count} interview questions for a ${levelName} ${stackOrSector} professional.

Context about this level: ${spec ? spec.description : ''}
Key topics to cover: ${topicsList}
${scenario ? `Example scenario to draw inspiration from: "${scenario}"` : ''}

Return ONLY a valid JSON array with this exact structure:
[
  {
    "questionText": "question or scenario text here",
    "questionType": "scenario" | "text",
    "options": [],
    "correctAnswer": "",
    "skill": "specific competency being tested",
    "difficulty": "easy" | "medium" | "hard"
  }
]

Rules:
- NO coding or MCQ questions — this is a business/professional interview
- Mix question types: 60% scenario-based, 40% behavioral/knowledge text
- Questions should be realistic, workplace-relevant, and appropriate for ${levelName} level
- skill field should be a specific competency like "Objection Handling", "Campaign Strategy", "Root Cause Analysis"
- Scenario questions should be concrete situational challenges`;
  } else {
    prompt = `You are an expert technical interviewer. Generate exactly ${count} interview questions for a ${stackOrSector} developer at ${TECH_LEVEL_DESCRIPTIONS[level]}.

Return ONLY a valid JSON array with this exact structure:
[
  {
    "questionText": "question text here",
    "questionType": "mcq" | "coding" | "text" | "scenario",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A",
    "skill": "skill being tested",
    "difficulty": "easy" | "medium" | "hard"
  }
]

Rules:
- For MCQ: include options (4 choices) and correctAnswer
- For coding/text/scenario: options and correctAnswer should be empty strings/arrays
- Mix question types: 3 MCQ, 3 coding, 2 text, 2 scenario
- Focus specifically on ${stackOrSector} technologies
- skill field should be a specific sub-skill like "React Hooks", "SQL Joins", "REST API Design"`;
  }

  try {
    const model = getModel();
    if (!model) return getFallbackQuestions(stackOrSector, level, count, sectorMode);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array in AI response');

    const questions = JSON.parse(jsonMatch[0]);
    logger.info(`Generated ${questions.length} questions for ${stackOrSector} Level ${level}`);
    return questions;
  } catch (err) {
    logger.error(`AI question generation error: ${err.message}`);
    return getFallbackQuestions(stackOrSector, level, count, sectorMode);
  }
};

// Score a single answer via Gemini
const scoreAnswer = async (question, userAnswer, stackOrSector) => {
  if (!userAnswer || userAnswer.trim() === '') {
    return { score: 0, feedback: 'No answer provided.' };
  }

  // MCQ — score directly
  if (question.questionType === 'mcq') {
    const correct = question.correctAnswer === userAnswer;
    return {
      score: correct ? 100 : 0,
      feedback: correct ? 'Correct answer!' : `Incorrect. The correct answer was: ${question.correctAnswer}`,
    };
  }

  const isBusiness = isSector(stackOrSector);
  const context = isBusiness
    ? `You are a senior ${stackOrSector} professional evaluator.`
    : `You are an expert ${stackOrSector} technical interviewer.`;

  const prompt = `${context} Score the following answer:

Question: ${question.questionText}
Question Type: ${question.questionType}
Competency / Skill Being Tested: ${question.skill}
Candidate's Answer: ${userAnswer}

Score the answer from 0-100 based on:
- ${isBusiness ? 'Professional knowledge and real-world awareness' : 'Technical accuracy'}
- Completeness and depth
- Clarity and communication
${isBusiness ? '- Practical applicability and decision quality' : '- Code quality and efficiency (if applicable)'}

Return ONLY valid JSON:
{
  "score": 0-100,
  "feedback": "specific, helpful feedback explaining the score"
}`;

  try {
    const model = getModel();
    if (!model) return { score: 50, feedback: 'Answer recorded. Manual review required.' };

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in scoring response');

    const parsed = JSON.parse(jsonMatch[0]);
    return { score: Math.min(100, Math.max(0, parsed.score || 0)), feedback: parsed.feedback || '' };
  } catch (err) {
    logger.error(`AI scoring error: ${err.message}`);
    return { score: 50, feedback: 'Answer recorded.' };
  }
};

// Generate final feedback summary
const generateFeedback = async (stackOrSector, level, skillScores, passed, totalScore) => {
  const isBusiness = isSector(stackOrSector);
  const skillBreakdown = Object.entries(skillScores)
    .map(([skill, score]) => `${skill}: ${score}/100`)
    .join(', ');

  const context = isBusiness
    ? `You are a senior ${stackOrSector} professional evaluator. A candidate just completed a ${stackOrSector} Level ${level} professional interview.`
    : `You are a senior technical interviewer. A candidate just completed a ${stackOrSector} Level ${level} interview.`;

  const prompt = `${context}

Overall Score: ${totalScore}/100
Result: ${passed ? 'PASSED' : 'FAILED'}
Competency Scores: ${skillBreakdown || 'N/A'}

Generate a professional feedback summary. Return ONLY valid JSON:
{
  "summary": "2-3 sentence overall feedback",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": "specific advice for improvement"
}`;

  try {
    const model = getModel();
    if (!model) {
      return {
        summary: `You scored ${totalScore}/100 on the ${stackOrSector} Level ${level} interview.`,
        strengths: ['Professional knowledge demonstrated'],
        weaknesses: ['Continue practicing'],
        recommendations: 'Keep learning and practicing.',
      };
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in feedback response');

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    logger.error(`AI feedback error: ${err.message}`);
    return {
      summary: `You scored ${totalScore}/100 on this interview.`,
      strengths: ['Keep practicing'],
      weaknesses: ['Review core concepts'],
      recommendations: 'Study more and retry.',
    };
  }
};

// Fallback static questions if AI is unavailable
const getFallbackQuestions = (stackOrSector, level, count, sectorMode = false) => {
  if (sectorMode) {
    const spec = getSectorLevelSpec(stackOrSector, level);
    const scenario = spec && spec.scenarios ? spec.scenarios[0] : `Describe a challenging ${stackOrSector} situation you have faced.`;
    const templates = [
      { questionText: scenario, questionType: 'scenario', options: [], correctAnswer: '', skill: `${stackOrSector} Problem Solving`, difficulty: 'medium' },
      { questionText: `Describe a time you had to handle a difficult situation in your ${stackOrSector} role. What did you do?`, questionType: 'text', options: [], correctAnswer: '', skill: `${stackOrSector} Experience`, difficulty: 'easy' },
      { questionText: `What are the most important skills for a professional working in ${stackOrSector}?`, questionType: 'text', options: [], correctAnswer: '', skill: `${stackOrSector} Fundamentals`, difficulty: 'easy' },
      { questionText: `How do you prioritize competing tasks in a ${stackOrSector} environment?`, questionType: 'scenario', options: [], correctAnswer: '', skill: 'Prioritization', difficulty: 'medium' },
      { questionText: `Walk me through how you would approach a major challenge in ${stackOrSector}.`, questionType: 'scenario', options: [], correctAnswer: '', skill: 'Strategic Thinking', difficulty: 'hard' },
      { questionText: `How do you measure success in your ${stackOrSector} role?`, questionType: 'text', options: [], correctAnswer: '', skill: 'Performance Metrics', difficulty: 'medium' },
      { questionText: `Describe how you collaborate with other teams in a ${stackOrSector} context.`, questionType: 'text', options: [], correctAnswer: '', skill: 'Collaboration', difficulty: 'easy' },
      { questionText: `What would you do if a key stakeholder disagreed with your ${stackOrSector} recommendation?`, questionType: 'scenario', options: [], correctAnswer: '', skill: 'Stakeholder Management', difficulty: 'hard' },
    ];
    return templates.slice(0, count);
  }
  const templates = [
    { questionText: `What are the core principles of ${stackOrSector}?`, questionType: 'text', options: [], correctAnswer: '', skill: `${stackOrSector} Fundamentals`, difficulty: 'easy' },
    { questionText: `Explain how state management works in ${stackOrSector}.`, questionType: 'text', options: [], correctAnswer: '', skill: 'State Management', difficulty: 'medium' },
    { questionText: `Write a simple ${stackOrSector} function that returns a sorted array.`, questionType: 'coding', options: [], correctAnswer: '', skill: 'Algorithms', difficulty: 'medium' },
    { questionText: `What is your approach to error handling in ${stackOrSector}?`, questionType: 'text', options: [], correctAnswer: '', skill: 'Error Handling', difficulty: 'medium' },
    { questionText: `Describe a scenario where you optimized a ${stackOrSector} application.`, questionType: 'scenario', options: [], correctAnswer: '', skill: 'Performance', difficulty: 'hard' },
    { questionText: `Which of these is NOT a valid concept in ${stackOrSector}?`, questionType: 'mcq', options: ['Option A', 'Option B', 'Option C', 'None of the above'], correctAnswer: 'Option A', skill: `${stackOrSector} Concepts`, difficulty: 'easy' },
    { questionText: `How do you handle asynchronous operations in ${stackOrSector}?`, questionType: 'text', options: [], correctAnswer: '', skill: 'Async Programming', difficulty: 'medium' },
    { questionText: `Describe the difference between ${stackOrSector} patterns.`, questionType: 'text', options: [], correctAnswer: '', skill: 'Design Patterns', difficulty: 'hard' },
    { questionText: `Write code to implement a basic CRUD operation in ${stackOrSector}.`, questionType: 'coding', options: [], correctAnswer: '', skill: 'CRUD Operations', difficulty: 'medium' },
    { questionText: `How would you architect a scalable ${stackOrSector} system?`, questionType: 'scenario', options: [], correctAnswer: '', skill: 'System Design', difficulty: 'hard' },
  ];
  return templates.slice(0, count);
};

module.exports = { generateQuestions, scoreAnswer, generateFeedback };
