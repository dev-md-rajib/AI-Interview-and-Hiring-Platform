const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../config/logger');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'placeholder');

const getModel = () => {
  try {
    return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  } catch (e) {
    logger.warn('Gemini model init failed, using fallback questions');
    return null;
  }
};

// Generate interview questions via Gemini
const generateQuestions = async (stack, level, count = 10) => {
  const levelDescriptions = {
    1: 'Junior level — foundational concepts, basic syntax, common patterns',
    2: 'Mid level — system design basics, optimization, architecture patterns',
    3: 'Senior level — complex architecture, deep analysis, leadership decisions',
  };

  const prompt = `You are an expert technical interviewer. Generate exactly ${count} interview questions for a ${stack} developer at ${levelDescriptions[level]}.

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
- Focus specifically on ${stack} technologies
- skill field should be a specific sub-skill like "React Hooks", "SQL Joins", "REST API Design"`;

  try {
    const model = getModel();
    if (!model) return getFallbackQuestions(stack, level, count);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array in AI response');

    const questions = JSON.parse(jsonMatch[0]);
    logger.info(`Generated ${questions.length} questions for ${stack} Level ${level}`);
    return questions;
  } catch (err) {
    logger.error(`AI question generation error: ${err.message}`);
    return getFallbackQuestions(stack, level, count);
  }
};

// Score a single answer via Gemini
const scoreAnswer = async (question, userAnswer, stack) => {
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

  const prompt = `You are an expert ${stack} technical interviewer. Score the following answer:

Question: ${question.questionText}
Question Type: ${question.questionType}
Skill Being Tested: ${question.skill}
Candidate's Answer: ${userAnswer}

Score the answer from 0-100 based on:
- Technical accuracy
- Completeness
- Clarity

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
const generateFeedback = async (stack, level, skillScores, passed, totalScore) => {
  const skillBreakdown = Object.entries(skillScores)
    .map(([skill, score]) => `${skill}: ${score}/100`)
    .join(', ');

  const prompt = `You are a senior technical interviewer. A candidate just completed a ${stack} Level ${level} interview.

Overall Score: ${totalScore}/100
Result: ${passed ? 'PASSED' : 'FAILED'}
Skill Scores: ${skillBreakdown}

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
        summary: `You scored ${totalScore}/100 on the ${stack} Level ${level} interview.`,
        strengths: ['Technical knowledge demonstrated'],
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
const getFallbackQuestions = (stack, level, count) => {
  const templates = [
    { questionText: `What are the core principles of ${stack}?`, questionType: 'text', options: [], correctAnswer: '', skill: `${stack} Fundamentals`, difficulty: 'easy' },
    { questionText: `Explain how state management works in ${stack}.`, questionType: 'text', options: [], correctAnswer: '', skill: 'State Management', difficulty: 'medium' },
    { questionText: `Write a simple ${stack} function that returns a sorted array.`, questionType: 'coding', options: [], correctAnswer: '', skill: 'Algorithms', difficulty: 'medium' },
    { questionText: `What is your approach to error handling in ${stack}?`, questionType: 'text', options: [], correctAnswer: '', skill: 'Error Handling', difficulty: 'medium' },
    { questionText: `Describe a scenario where you optimized a ${stack} application.`, questionType: 'scenario', options: [], correctAnswer: '', skill: 'Performance', difficulty: 'hard' },
    { questionText: `Which of these is NOT a valid concept in ${stack}?`, questionType: 'mcq', options: ['Option A', 'Option B', 'Option C', 'None of the above'], correctAnswer: 'Option A', skill: `${stack} Concepts`, difficulty: 'easy' },
    { questionText: `How do you handle asynchronous operations in ${stack}?`, questionType: 'text', options: [], correctAnswer: '', skill: 'Async Programming', difficulty: 'medium' },
    { questionText: `Describe the difference between ${stack} patterns.`, questionType: 'text', options: [], correctAnswer: '', skill: 'Design Patterns', difficulty: 'hard' },
    { questionText: `Write code to implement a basic CRUD operation in ${stack}.`, questionType: 'coding', options: [], correctAnswer: '', skill: 'CRUD Operations', difficulty: 'medium' },
    { questionText: `How would you architect a scalable ${stack} system?`, questionType: 'scenario', options: [], correctAnswer: '', skill: 'System Design', difficulty: 'hard' },
  ];
  return templates.slice(0, count);
};

module.exports = { generateQuestions, scoreAnswer, generateFeedback };
