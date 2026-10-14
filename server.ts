import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Candidate models in order of priority (gemini-3.1-flash-lite has higher rate limit & quota)
const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

function formatErrorMessage(err: any): string {
  if (!err) return 'Failed to generate quiz with AI.';
  const msg = typeof err === 'string' ? err : err.message || String(err);
  try {
    const parsed = JSON.parse(msg);
    if (parsed.error?.message) {
      if (parsed.error.code === 429 || parsed.error.status === 'RESOURCE_EXHAUSTED') {
        return 'AI generation is temporarily reaching quota limits. You can start immediately with our verified CBSE NCERT question bank below.';
      }
      return parsed.error.message;
    }
  } catch {
    // not JSON string
  }
  if (msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('resource_exhausted')) {
    return 'AI generation rate limit reached on free tier. You can practice immediately using our verified board question bank!';
  }
  return msg;
}

// Model fallback executor
async function callGeminiWithModelFallback(
  ai: GoogleGenAI,
  buildPayload: (modelName: string) => any
) {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const payload = buildPayload(model);
      const res = await ai.models.generateContent(payload);
      if (res && res.text) {
        return res;
      }
    } catch (err: any) {
      lastError = err;
      const isQuotaOrBusy =
        err?.status === 429 ||
        err?.status === 503 ||
        String(err?.message || '').includes('429') ||
        String(err?.message || '').toLowerCase().includes('quota') ||
        String(err?.message || '').toLowerCase().includes('resource_exhausted');

      console.warn(`[Gemini Engine] Model "${model}" failed (${isQuotaOrBusy ? 'Quota/Busy' : err?.message}). Trying fallback model...`);
      continue;
    }
  }

  throw lastError || new Error('All AI models are currently unavailable.');
}

interface QuestionPayload {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  questionType: 'mcq' | 'numerical' | 'conceptual' | 'mixed' | 'assertion_reason' | 'case_based';
  pitfall?: string;
  boardTip?: string;
  casePassage?: string;
  assertion?: string;
  reason?: string;
}

import {
  validateSingleQuestion,
  validateQuestionBatch,
  VERIFIED_CBSE_CHAPTERS,
} from './src/utils/questionValidator.ts';


// Endpoint: Generate Quiz
app.post('/api/generate-quiz', async (req: Request, res: Response) => {
  try {
    const {
      board = 'CBSE',
      grade = '12',
      subject: rawSubject = 'mathematics',
      chapter = 'Relations and Functions',
      difficulty = 'medium',
      questionCount = 5,
      questionType = 'mcq',
      language = 'en',
    } = req.body;

    // Strict validation: Only Mathematics, Physics, Chemistry allowed
    const validSubjects = ['mathematics', 'physics', 'chemistry'];
    const subject = validSubjects.includes(String(rawSubject).toLowerCase())
      ? String(rawSubject).toLowerCase()
      : 'mathematics';

    // Verify Chapter against CBSE 2026-27 Syllabus
    if (chapter !== 'all') {
      const verifiedList = VERIFIED_CBSE_CHAPTERS[subject] || [];
      const isVerified = verifiedList.some(
        ch => ch.toLowerCase() === chapter.toLowerCase() ||
              chapter.toLowerCase().includes(ch.toLowerCase()) ||
              ch.toLowerCase().includes(chapter.toLowerCase())
      );
      if (!isVerified) {
        return res.status(400).json({
          success: false,
          error: `The selected chapter "${chapter}" is not supported by verified CBSE Class 12 (2026–27) syllabus data for ${subject}. Please select a verified chapter.`,
          fallbackAvailable: false,
        });
      }
    }

    const count = Math.min(Math.max(parseInt(questionCount, 10) || 5, 1), 20);

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'Gemini API key is not configured on the server. Please check your environment settings or use the verified curated board question bank.',
        fallbackAvailable: true,
      });
    }

    let typeGuidance = `Generate standard CBSE Class 12 Multiple Choice Questions (Section A board format) with 4 distinct options.`;
    if (questionType === 'numerical') {
      typeGuidance = `Generate numerical calculation problems requiring students to compute values. For Mathematics, provide mathematical evaluations; for Physics, include formulas, substitutions, and explicit SI units in the options; for Chemistry, include electrochemical, kinetic, or solution calculations with units. All questions must have 4 distinct numerical options.`;
    } else if (questionType === 'conceptual') {
      typeGuidance = `Generate conceptual and theoretical problems testing definitions, laws, properties, theorems, and mechanisms. Every question must have 4 distinct options.`;
    } else if (questionType === 'mixed') {
      typeGuidance = `Generate a balanced mix of conceptual MCQs, formula-based numericals, and application questions reflecting a standard CBSE Class 12 board examination.`;
    } else if (questionType === 'assertion_reason') {
      typeGuidance = `Generate Assertion-Reason questions in CBSE format where each question has Assertion (A) and Reason (R), and options are strictly:
         1. Both (A) and (R) are true and (R) is the correct explanation of (A)
         2. Both (A) and (R) are true but (R) is not the correct explanation of (A)
         3. (A) is true but (R) is false
         4. (A) is false but (R) is true.`;
    } else if (questionType === 'case_based') {
      typeGuidance = `Generate Case-Based MCQs with a short authentic scientific or mathematical passage/scenario in casePassage, followed by a conceptual application MCQ with 4 distinct options.`;
    }

    let subjectSpecificInstructions = '';
    if (subject === 'mathematics') {
      subjectSpecificInstructions = `
Subject Requirements for Mathematics (CBSE Code 041, Session 2026–27):
- Questions MUST support rigorous mathematical calculations and step-by-step solutions.
- Include proper mathematical notation (e.g., integrals, limits, derivatives, vectors, matrices, determinants, probability).
- In "explanation", provide intermediate calculation steps and applied theorems showing how the answer was evaluated.`;
    } else if (subject === 'physics') {
      subjectSpecificInstructions = `
Subject Requirements for Physics (CBSE Code 042, Session 2026–27):
- Questions MUST support physics formulas, standard numerical problems, explicit SI units (e.g. N/C, V, A, Ω, T, Wb, m, s, rad/s), and physical principles.
- Numerical options MUST specify units where applicable.
- In "explanation", state the formula, show step-by-step substitution, and specify unit analysis.`;
    } else if (subject === 'chemistry') {
      subjectSpecificInstructions = `
Subject Requirements for Chemistry (CBSE Code 043, Session 2026–27):
- Questions MUST support conceptual questions, balanced chemical equations, reaction conditions/reagents, and numerical problems where appropriate (e.g., Nernst equation, colligative properties, rate laws).
- Options with chemical formulas or IUPAC names MUST be chemically consistent and accurate.
- In "explanation", explain chemical principles, mechanisms (e.g., SN1, SN2, aldol, Cannizzaro), or numerical calculation steps with units.`;
    }

    const prompt = `You are a senior CBSE Class 12 Board Exam Chief Paper Setter for Academic Session 2026–27.
Generate exactly ${count} high-quality, authentic examination questions for:
- Education Board: ${board}
- Standard: Class ${grade} (Academic Session 2026–27)
- Subject: ${subject.toUpperCase()} (CBSE Code: ${subject === 'mathematics' ? '041' : subject === 'physics' ? '042' : '043'})
- Chapter: "${chapter}"
- Target Difficulty: ${difficulty} (easy = direct definition/formula, medium = standard CBSE board question, hard = Exemplar/HOTS level, mixed = balanced distribution)
- Question Format: ${questionType}

${typeGuidance}
${subjectSpecificInstructions}

Academic Requirements:
1. All scientific, chemical, and mathematical formulas must be 100% accurate as per the verified NCERT CBSE Class 12 (2026–27) curriculum.
2. Every question must have EXACTLY 4 distinct, unambiguous options.
3. The "correctAnswer" MUST exactly match one of the 4 options verbatim.
4. "explanation" must be a concise (2-4 sentences) step-by-step NCERT-aligned justification with intermediate working.
5. "pitfall" should highlight the common trap or misconception students fall into.
6. "boardTip" should provide advice for securing full marks in CBSE 2026–27 board exams.
7. "topic" should state the exact syllabus subtopic.
8. Do not generate trivial or repetitive questions.${language === 'hi' ? '\n9. Language Requirement: Generate question text, options, explanation, pitfall, and boardTip in clear, natural Hindi (हिन्दी) using standard CBSE NCERT Class 12 Hindi-medium terminology while retaining mathematical and chemical formulas intact.' : ''}`;

    const buildQuizPayload = (modelName: string) => ({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: 'You are a senior CBSE Class 12 Chief Examiner. Produce authentic, curriculum-accurate, mathematically and conceptually rigorous board exam questions in strict structured JSON. Keep explanations concise.',
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING },
              subject: { type: Type.STRING },
              chapter: { type: Type.STRING },
              topic: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              questionType: { type: Type.STRING },
              pitfall: { type: Type.STRING },
              boardTip: { type: Type.STRING },
              casePassage: { type: Type.STRING },
              assertion: { type: Type.STRING },
              reason: { type: Type.STRING },
            },
            required: [
              'id',
              'question',
              'options',
              'correctAnswer',
              'explanation',
              'subject',
              'chapter',
              'topic',
              'difficulty',
              'questionType',
            ],
          },
        },
      },
    });

    const generatePromise = callGeminiWithModelFallback(ai, buildQuizPayload);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timed out after 50 seconds.')), 50000)
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);

    let rawText = (response.text || '').trim();
    if (rawText.startsWith('```json')) {
      rawText = rawText.slice(7);
    } else if (rawText.startsWith('```')) {
      rawText = rawText.slice(3);
    }
    if (rawText.endsWith('```')) {
      rawText = rawText.slice(0, -3);
    }
    rawText = rawText.trim();

    if (!rawText) {
      throw new Error('Received empty response from Gemini API.');
    }

    const parsed = JSON.parse(rawText);
    const questionsArray = Array.isArray(parsed) ? parsed : (parsed.questions || parsed.data || []);
    
    // Run Question Accuracy and Validation Engine
    const validationSummary = validateQuestionBatch(questionsArray, subject, chapter, count);

    if (validationSummary.validCount === 0) {
      console.warn('[Validation Engine] All questions rejected. Reasons:', validationSummary.rejectionReasons);
      throw new Error('AI-generated questions did not meet verified CBSE 2026-27 mathematical and scientific accuracy standards.');
    }

    console.log(`[Validation Engine] Successfully validated ${validationSummary.validCount}/${validationSummary.totalReceived} questions for ${subject} - ${chapter}.`);

    return res.json({
      success: true,
      questions: validationSummary.questions.map(q => ({ ...q, source: 'ai' })),
      source: 'ai',
      meta: {
        board,
        grade,
        subject,
        chapter,
        count: validationSummary.questions.length,
        validationSummary: {
          totalReceived: validationSummary.totalReceived,
          validCount: validationSummary.validCount,
          rejectedCount: validationSummary.rejectedCount,
        },
      },
    });
  } catch (error: any) {
    console.error('Quiz Generation Error:', error);
    const friendlyError = formatErrorMessage(error);
    return res.status(500).json({
      success: false,
      error: friendlyError,
      fallbackAvailable: true,
    });
  }
});

// Endpoint: Mistake Detective - Generate 1 Similar Question for targeted topic drill
app.post('/api/generate-similar-question', async (req: Request, res: Response) => {
  try {
    const {
      subject,
      chapter,
      topic,
      difficulty,
      questionType,
      originalQuestion,
    } = req.body;

    const normalizedSubject = String(subject || 'physics').toLowerCase();
    if (!['mathematics', 'physics', 'chemistry'].includes(normalizedSubject)) {
      return res.status(400).json({
        success: false,
        error: 'Only CBSE Class 12 Mathematics, Physics, and Chemistry are supported.',
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'AI service is temporarily unavailable. Please continue reviewing the official board explanation above.',
      });
    }

    const prompt = `You are an expert CBSE Class 12 Examination Item Writer for the 2026-27 academic session.
Generate EXACTLY 1 new, high-yield practice question for a student who made a mistake on this syllabus concept.

Context:
- Board: CBSE Class 12 (Session 2026–27)
- Subject: ${normalizedSubject}
- Chapter: ${chapter}
- Topic: ${topic}
- Target Difficulty: ${difficulty || 'medium'}
- Target Question Type: ${questionType || 'mcq'}
- Original question they struggled with: "${originalQuestion || ''}"

Strict Guidelines:
1. Generate 1 fresh question targeting the EXACT same concept/topic (${topic}) with different values, setup, or parameters.
2. Provide exactly 4 distinct options (A, B, C, D).
3. Exactly ONE option must be mathematically and scientifically correct.
4. "correctAnswer" must match the correct option verbatim.
5. Provide a rigorous, step-by-step explanation.
6. For Mathematics, include clear algebraic working and calculations.
7. For Physics, include SI units, governing formula, and substitution.
8. For Chemistry, ensure chemical formulas and equations are balanced.
9. Include "pitfall" (common board trap) and "boardTip" (short exam memory anchor).

Return a single JSON object.`;

    const buildPayload = (modelName: string) => ({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: 'You are an official CBSE Class 12 Master Item Writer for the 2026-27 session. Produce mathematically rigorous and scientifically accurate questions with zero errors.',
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
            subject: { type: Type.STRING },
            chapter: { type: Type.STRING },
            topic: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            questionType: { type: Type.STRING },
            formula: { type: Type.STRING },
            pitfall: { type: Type.STRING },
            boardTip: { type: Type.STRING },
          },
          required: [
            'id',
            'question',
            'options',
            'correctAnswer',
            'explanation',
            'subject',
            'chapter',
            'topic',
            'difficulty',
            'questionType',
          ],
        },
      },
    });

    const aiPromise = callGeminiWithModelFallback(ai, buildPayload);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Question generation timed out.')), 25000)
    );

    const response = await Promise.race([aiPromise, timeoutPromise]);
    let rawText = (response.text || '').trim();
    if (rawText.startsWith('```json')) {
      rawText = rawText.slice(7);
    } else if (rawText.startsWith('```')) {
      rawText = rawText.slice(3);
    }
    if (rawText.endsWith('```')) {
      rawText = rawText.slice(0, -3);
    }
    rawText = rawText.trim();

    if (!rawText) {
      throw new Error('Received empty response from Gemini API.');
    }

    const parsedQuestion = JSON.parse(rawText);
    parsedQuestion.id = `similar-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    parsedQuestion.subject = normalizedSubject;
    parsedQuestion.chapter = chapter;
    parsedQuestion.topic = topic || parsedQuestion.topic;

    // Run Question Accuracy and Validation Engine
    const validationResult = validateSingleQuestion(parsedQuestion, normalizedSubject, chapter);
    if (!validationResult.isValid || !validationResult.question) {
      console.warn('[Mistake Detective] Generated similar question failed validation:', validationResult.errors);
      return res.status(422).json({
        success: false,
        error: 'The generated follow-up question did not pass board verification. Please continue reviewing the verified explanation above.',
        fallbackAvailable: true,
      });
    }

    return res.json({
      success: true,
      question: {
        ...validationResult.question,
        source: 'ai',
      },
    });
  } catch (error: any) {
    console.error('Similar Question Generation Error:', error);
    const friendlyError = formatErrorMessage(error);
    return res.status(500).json({
      success: false,
      error: friendlyError || 'Question generation is temporarily reaching quota limits. Please continue reviewing the verified explanation above.',
      fallbackAvailable: true,
    });
  }
});

// Endpoint: Mistake Detective Deep Dive
app.post('/api/mistake-deepdive', async (req: Request, res: Response) => {
  try {
    const {
      question,
      options,
      selectedAnswer,
      correctAnswer,
      explanation,
      subject,
      chapter,
      topic,
      studentQuery,
      language = 'en',
    } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'Gemini API key is not configured on the server.',
      });
    }

    const prompt = `You are "Mistake Detective", an empathetic and deeply analytical CBSE Master Teacher.
A Class 12 student answered a board exam question incorrectly.

Context:
- Subject: ${subject}
- Chapter: ${chapter}
- Topic: ${topic}
- Question: "${question}"
- Options: ${JSON.stringify(options)}
- Student Selected: "${selectedAnswer}"
- Correct Answer: "${correctAnswer}"
- Standard Explanation: "${explanation}"
${studentQuery ? `- Specific Student Question: "${studentQuery}"` : ''}
${language === 'hi' ? '- Language Requirement: Provide coreConcept, whyCorrectIsRight, whySelectedIsWrong, memoryAnchor, and followUpQuestion in clear, natural Hindi (हिन्दी) using standard CBSE Class 12 NCERT terminology.' : ''}

Your Task:
1. "coreConcept": Explain the underlying principle in crystal-clear, intuitive language (max 3-4 sentences).
2. "whyCorrectIsRight": Rigorous, step-by-step scientific or mathematical justification of why "${correctAnswer}" is true.
3. "whySelectedIsWrong": Explain why choosing "${selectedAnswer}" is a classic, tempting trap (e.g., misapplying a formula, sign error, confusing definitions). Do NOT claim certainty about their personal thoughts; use phrases like "A common pitfall that leads to this option is..." or "Students often confuse X with Y because...".
4. "memoryAnchor": A memorable rule of thumb, mnemonic, or quick mental check to avoid this trap on exam day.
5. "followUpQuestion": A targeted 1-question check-in to confirm they now grasp the concept. Provide question, 4 options, correctAnswer, and a short explanation.`;

    const buildMistakePayload = (modelName: string) => ({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: 'You are the Mistake Detective for CBSE Class 12 boards. Be encouraging, academically rigorous, and pedagogical.',
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coreConcept: { type: Type.STRING },
            whyCorrectIsRight: { type: Type.STRING },
            whySelectedIsWrong: { type: Type.STRING },
            memoryAnchor: { type: Type.STRING },
            followUpQuestion: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING },
              },
              required: ['question', 'options', 'correctAnswer', 'explanation'],
            },
          },
          required: ['coreConcept', 'whyCorrectIsRight', 'whySelectedIsWrong', 'memoryAnchor', 'followUpQuestion'],
        },
      },
    });

    const deepDivePromise = callGeminiWithModelFallback(ai, buildMistakePayload);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Mistake Detective analysis timed out.')), 25000)
    );

    const response = await Promise.race([deepDivePromise, timeoutPromise]);

    let rawText = (response.text || '').trim();
    if (rawText.startsWith('```json')) {
      rawText = rawText.slice(7);
    } else if (rawText.startsWith('```')) {
      rawText = rawText.slice(3);
    }
    if (rawText.endsWith('```')) {
      rawText = rawText.slice(0, -3);
    }
    rawText = rawText.trim();

    if (!rawText) {
      throw new Error('Received empty response from Gemini API.');
    }

    const analysis = JSON.parse(rawText);
    return res.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error('Mistake Detective Error:', error);
    const friendlyError = formatErrorMessage(error);
    return res.status(500).json({
      success: false,
      error: friendlyError,
    });
  }
});

// Endpoint: AI Personal Tutor
app.post('/api/tutor', async (req: Request, res: Response) => {
  try {
    const {
      subject: rawSubject = 'physics',
      question = '',
      action = 'standard',
      conversationHistory = [],
      language = 'en',
      image,
    } = req.body;

    const validSubjects = ['mathematics', 'physics', 'chemistry'];
    const subject = validSubjects.includes(String(rawSubject).toLowerCase())
      ? String(rawSubject).toLowerCase()
      : 'physics';

    if (!question && (!image || !image.data)) {
      return res.status(400).json({
        success: false,
        error:
          language === 'hi'
            ? 'कृपया अपना प्रश्न लिखें या प्रश्न की फोटो अपलोड करें।'
            : 'Please provide your question text or upload a question image.',
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        success: false,
        error:
          language === 'hi'
            ? 'AI ट्यूटर सेवा वर्तमान में उपलब्ध नहीं है। कृपया कुछ समय बाद पुनः प्रयास करें।'
            : 'Gemini API key is not configured on the server. AI Tutor is currently offline.',
      });
    }

    const systemInstruction = `You are "BoardAce Tutor", a dedicated, empathetic, and academically rigorous CBSE Class 12 Master Teacher and Examination Mentor for the 2026–27 academic session.
You specialize strictly in:
1. Mathematics (CBSE Subject Code: 041)
2. Physics (CBSE Subject Code: 042)
3. Chemistry (CBSE Subject Code: 043)

Pedagogical Rules:
- Deliver clear, well-structured step-by-step explanations directly aligned with the official NCERT CBSE Class 12 curriculum.
- For Mathematics (041):
  * State the governing definition, formula, or theorem (e.g. Chain Rule, Integration by Parts, Matrix Properties, Bayes' Theorem, Vector Cross Product).
  * Show intermediate calculations step-by-step so the student understands each algebraic step.
  * Point out common calculation traps (e.g., negative signs, constant of integration + C, domain/range restrictions).
- For Physics (042):
  * State the underlying physical law or concept (e.g., Gauss's Law, Biot-Savart Law, Faraday-Lenz Law, Total Internal Reflection, de Broglie relation).
  * State the formula and show numerical substitution with explicit SI units (e.g., N/C, V, A, Ω, T, Wb, rad/s).
  * Explain the physical intuition, direction (rules like Fleming's Left/Right hand, Right hand thumb rule), and sign conventions.
- For Chemistry (043):
  * Write balanced chemical equations with state symbols and reaction conditions (temperature, catalyst, acid/base medium).
  * For Organic Chemistry: Clearly explain reaction mechanisms or reagent roles (e.g., nucleophilic addition, elimination, electrophilic substitution, Aldol, Cannizzaro, Williamson ether synthesis, Sandmeyer reaction).
  * For Physical Chemistry: Write formulas (Nernst equation, Arrhenius equation, Colligative property formulas) and perform step-by-step calculations with units.
  * For Coordination Compounds: Use correct IUPAC nomenclature and Crystal Field Theory reasoning.
- Format with clean Markdown:
  * Use bold headers for structure (e.g., ### Concept Overview, ### Step-by-Step Solution, ### Key Formula & Units, ### Common Board Trap, ### CBSE 2026–27 Examiner Tip).
  * Use clear numbered steps for derivations or numericals.
${language === 'hi' ? '- Language Requirement: Provide the entire response in clear, student-friendly Hindi (हिन्दी) using standard CBSE NCERT Hindi-medium terminology, while keeping mathematical formulas, chemical equations, and SI units intact.' : '- Language Requirement: Provide the response in clear, student-friendly English.'}
- Keep explanations encouraging and academically authoritative.`;

    let actionPrompt = '';
    if (action === 'explain_simply') {
      actionPrompt = `\n[STUDENT ACTION REQUEST: Please explain this concept in the simplest possible terms using an intuitive everyday analogy. Avoid intimidating jargon, and explain the core intuition step-by-step.]`;
    } else if (action === 'another_example') {
      actionPrompt = `\n[STUDENT ACTION REQUEST: Please provide a fresh, high-yield CBSE Class 12 exam-style solved example on this exact topic with complete numerical steps or reaction steps.]`;
    } else if (action === 'explain_formula') {
      actionPrompt = `\n[STUDENT ACTION REQUEST: Please break down the governing formula(s) in detail. Explain what each symbol represents, their SI units, dimensional formula if relevant, when to apply it, and common rearrangement tricks in board exams.]`;
    } else if (action === 'summarize') {
      actionPrompt = `\n[STUDENT ACTION REQUEST: Please provide a concise, high-impact summary (4-6 key bullet points) of this concept for last-minute revision before the board exam.]`;
    }

    const contents: any[] = [];

    // Prior conversation history (up to last 6 turns for optimal context & latency)
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const recent = conversationHistory.slice(-6);
      for (const turn of recent) {
        if (turn.content && (turn.role === 'user' || turn.role === 'model' || turn.role === 'assistant')) {
          contents.push({
            role: turn.role === 'user' ? 'user' : 'model',
            parts: [{ text: String(turn.content) }],
          });
        }
      }
    }

    const userParts: any[] = [];
    if (image && image.data && image.mimeType) {
      userParts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data.replace(/^data:image\/[a-zA-Z]+;base64,/, ''),
        },
      });
    }

    const promptMessage = `Subject: ${subject.toUpperCase()} (CBSE Class 12)
${question ? `Student Question: ${question}` : 'Please review and solve the question in the uploaded image.'}
${actionPrompt}`;

    userParts.push({ text: promptMessage });

    contents.push({
      role: 'user',
      parts: userParts,
    });

    const buildTutorPayload = (modelName: string) => ({
      model: modelName,
      contents,
      config: {
        systemInstruction,
        temperature: 0.25,
      },
    });

    const generatePromise = callGeminiWithModelFallback(ai, buildTutorPayload);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI Tutor request timed out after 40 seconds.')), 40000)
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const answer = (response.text || '').trim();

    if (!answer) {
      throw new Error('Received empty response from AI Tutor.');
    }

    return res.json({
      success: true,
      answer,
      subject,
      action,
    });
  } catch (error: any) {
    console.error('AI Tutor Endpoint Error:', error);
    const friendlyError = formatErrorMessage(error);
    return res.status(500).json({
      success: false,
      error: friendlyError,
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BoardAce AI full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
