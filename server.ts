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
  getVerifiedChapters,
} from './src/utils/questionValidator.ts';
import { getCuratedQuestions } from './src/data/sampleQuestions.ts';

// Master List of Valid Official CBSE Subjects across Class 10 and Class 12 (Science & Commerce)
const ALL_VALID_SUBJECTS = [
  // Class 12 Science
  'mathematics',
  'physics',
  'chemistry',
  // Class 12 Commerce
  'accountancy',
  'business_studies',
  'economics',
  'english_core',
  // Class 10
  'science',
  'social_science',
  'english',
];

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

    // Strict validation: Supports Class 10 and Class 12 official subjects (Science & Commerce)
    const validSubjects = ALL_VALID_SUBJECTS;
    const subject = validSubjects.includes(String(rawSubject).toLowerCase())
      ? String(rawSubject).toLowerCase()
      : 'mathematics';

    // Verify Chapter against CBSE 2026-27 Syllabus for the specific grade
    if (chapter !== 'all') {
      const verifiedList = getVerifiedChapters(subject, String(grade));
      const isVerified = verifiedList.length === 0 || verifiedList.some(
        ch => ch.toLowerCase() === chapter.toLowerCase() ||
              chapter.toLowerCase().includes(ch.toLowerCase()) ||
              ch.toLowerCase().includes(chapter.toLowerCase())
      );
      if (!isVerified) {
        return res.status(400).json({
          success: false,
          error: `The selected chapter "${chapter}" is not supported by verified CBSE Class ${grade} (2026–27) syllabus data for ${subject}. Please select a verified chapter.`,
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

    let typeGuidance = `Generate standard CBSE Class ${grade} Multiple Choice Questions (Section A board format) with 4 distinct options.`;
    if (questionType === 'numerical') {
      typeGuidance = `Generate numerical calculation problems requiring students to compute values. For Mathematics, provide mathematical evaluations; for Physics and Science, include formulas, substitutions, and explicit SI units in the options; for Chemistry, include electrochemical, kinetic, or solution calculations with units; for Accountancy, include journal entry amounts, ratio percentages, share forfeiture balances, or cash flow values with ₹ symbols; for Economics, include national income aggregates, investment multiplier k, and propensity values. All questions must have 4 distinct numerical options.`;
    } else if (questionType === 'conceptual') {
      typeGuidance = `Generate conceptual and theoretical problems testing definitions, laws, properties, theorems, and mechanisms. Every question must have 4 distinct options.`;
    } else if (questionType === 'mixed') {
      typeGuidance = `Generate a balanced mix of conceptual MCQs, formula-based numericals, and application questions reflecting a standard CBSE Class ${grade} board examination.`;
    } else if (questionType === 'assertion_reason') {
      typeGuidance = `Generate Assertion-Reason questions in CBSE format where each question has Assertion (A) and Reason (R), and options are strictly:
         1. Both (A) and (R) are true and (R) is the correct explanation of (A)
         2. Both (A) and (R) are true but (R) is not the correct explanation of (A)
         3. (A) is true but (R) is false
         4. (A) is false but (R) is true.`;
    } else if (questionType === 'case_based') {
      typeGuidance = `Generate Case-Based MCQs with a short authentic scientific, business, economic, or literary passage/scenario in casePassage, followed by a conceptual application MCQ with 4 distinct options.`;
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
    } else if (subject === 'accountancy') {
      subjectSpecificInstructions = `
Subject Requirements for Class 12 Accountancy (CBSE Code 055, Session 2026–27):
- Strict adherence to official CBSE 2026–27 syllabus, Indian Partnership Act 1932, Companies Act 2013 (Schedule III Division I), and AS-3 (Revised).
- For Partnership: test P&L Appropriation, guarantee, past adjustments, sacrificing/gaining ratio, goodwill valuation methods, revaluation, and dissolution realisation.
- For Company Accounts: test share capital pro-rata allotment, forfeiture, reissue, capital reserve, and debentures issued at par/premium/discount and as collateral security.
- For Financial Ratios & Cash Flow: test exact standard ratio formulas and cash flows classified into Operating, Investing, and Financing.
- In numerical problems, display calculations clearly with currency symbols (₹) and clear debits/credits.`;
    } else if (subject === 'business_studies') {
      subjectSpecificInstructions = `
Subject Requirements for Class 12 Business Studies (CBSE Code 054, Session 2026–27):
- Strict alignment with NCERT Class 12 Business Studies curriculum.
- Test Fayol's 14 principles of management and Taylor's scientific techniques (functional foremanship, time/motion/fatigue/method studies).
- Feature realistic corporate, managerial, and startup case scenarios testing planning, organising, staffing, directing, and controlling.
- Test financial management (investment, financing, dividend decisions; trading on equity), financial markets (money market instruments, SEBI functions), marketing 4 Ps mix, and Consumer Protection Act 2019.`;
    } else if (subject === 'economics') {
      subjectSpecificInstructions = `
Subject Requirements for Class 12 Economics (CBSE Code 030, Session 2026–27):
- Strict alignment with NCERT Class 12 Introductory Macroeconomics and Indian Economic Development.
- Macroeconomics: National Income aggregates (GDP, NNP at MP/FC, Value Added, Income, Expenditure methods), Money & Banking (credit creation multiplier = 1/LRR, RBI monetary policy), Income & Employment (AD = C + I, AS = C + S, multiplier k = 1/(1-MPC), inflationary/deflationary gap), Government Budget (Revenue, Fiscal, Primary Deficits), and BOP.
- Indian Economic Development: 1947-90 policies, 1991 LPG reforms, Human capital formation, Rural development (SHGs, NABARD, agricultural marketing), Employment (informalisation), Sustainable development, and comparative study with China and Pakistan.`;
    } else if (subject === 'english_core') {
      subjectSpecificInstructions = `
Subject Requirements for Class 12 English Core (CBSE Code 301, Session 2026–27):
- Ground strictly in official NCERT Flamingo (Prose & Poetry) and Vistas texts.
- Test textual comprehension, central themes, character motivations, nuances, irony, symbolism, and poetic devices.
- Include Reference to Context (RTC) analytical questions testing subtext and authorial perspective.`;
    } else if (subject === 'science') {
      subjectSpecificInstructions = `
Subject Requirements for Class 10 Science (CBSE Code 086, Session 2026–27):
- Questions cover official CBSE NCERT units: Chemical Substances, World of Living, Natural Phenomena, and Effects of Current.
- For light and electricity: include standard formulas (1/f = 1/v - 1/u, V = IR, P = VI) and explicit SI units.
- For chemistry: ensure balanced reactions and real observations (e.g., precipitate colors, gas evolution).
- For biology: ensure precise anatomical and physiological terminology (nephron, reflex arc, Mendel crosses 3:1/9:3:3:1).`;
    } else if (subject === 'social_science') {
      subjectSpecificInstructions = `
Subject Requirements for Class 10 Social Science (CBSE Code 087, Session 2026–27):
- Covers History (Nationalism in India/Europe, Making of Global World), Geography (Resources, Agriculture, Minerals), Democratic Politics (Power Sharing, Federalism), and Economics (Development, Sectors, Money & Credit).
- Ensure strict alignment with NCERT facts, constitutional provisions, and economic definitions.`;
    } else if (subject === 'english') {
      subjectSpecificInstructions = `
Subject Requirements for Class 10 English Language & Literature (CBSE Code 184, Session 2026–27):
- Covers First Flight (Prose & Poetry), Footprints Without Feet, and integrated grammar (tenses, modals, reported speech, subject-verb concord).
- Focus on textual analysis, literary themes, character traits, poetic devices, and grammar rules.`;
    }

    const prompt = `You are a senior CBSE Class ${grade} Board Exam Chief Paper Setter for Academic Session 2026–27.
Generate exactly ${count} high-quality, authentic examination questions for:
- Education Board: ${board}
- Standard: Class ${grade} (Academic Session 2026–27)
- Subject: ${subject.toUpperCase()}
- Chapter: "${chapter}"
- Target Difficulty: ${difficulty} (easy = direct definition/formula, medium = standard CBSE board question, hard = Exemplar/HOTS level, mixed = balanced distribution)
- Question Format: ${questionType}

${typeGuidance}
${subjectSpecificInstructions}

Academic Requirements:
1. All scientific, chemical, literary, and mathematical concepts must be 100% accurate as per the verified NCERT CBSE Class ${grade} (2026–27) curriculum.
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
    const validationSummary = validateQuestionBatch(questionsArray, subject, chapter, count, String(grade));

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
      grade = '12',
      chapter,
      topic,
      difficulty,
      questionType,
      originalQuestion,
    } = req.body;

    const normalizedSubject = String(subject || 'physics').toLowerCase();
    const validSubjects = ALL_VALID_SUBJECTS;
    if (!validSubjects.includes(normalizedSubject)) {
      return res.status(400).json({
        success: false,
        error: `Subject ${normalizedSubject} is not supported.`,
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'AI service is temporarily unavailable. Please continue reviewing the official board explanation above.',
      });
    }

    const prompt = `You are an expert CBSE Class ${grade} Examination Item Writer for the 2026-27 academic session.
Generate EXACTLY 1 new, high-yield practice question for a student who made a mistake on this syllabus concept.

Context:
- Board: CBSE Class ${grade} (Session 2026–27)
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
7. For Physics and Science, include SI units, governing formula, and substitution.
8. For Chemistry, ensure chemical formulas and equations are balanced.
9. For Social Science and English, ensure alignment with NCERT textbooks and curriculum.
10. Include "pitfall" (common board trap) and "boardTip" (short exam memory anchor).

Return a single JSON object.`;

    const buildPayload = (modelName: string) => ({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: `You are an official CBSE Class ${grade} Master Item Writer for the 2026-27 session. Produce mathematically rigorous and scientifically accurate questions with zero errors.`,
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
    const validationResult = validateSingleQuestion(parsedQuestion, normalizedSubject, chapter, 0, String(grade));
    if (!validationResult.isValid || !validationResult.question) {
      console.warn('[Mistake Detective] Generated similar question failed validation:', validationResult.errors);
      const reqStream = req.body.stream || (
        ['accountancy', 'business_studies', 'economics', 'english_core'].includes(normalizedSubject)
          ? 'commerce'
          : 'science'
      );
      let curatedFallback = getCuratedQuestions(normalizedSubject, chapter, 1, difficulty, String(grade) as any, reqStream as any);
      if (!curatedFallback || curatedFallback.length === 0) {
        curatedFallback = getCuratedQuestions(normalizedSubject, undefined, 1, difficulty, String(grade) as any, reqStream as any);
      }
      if (curatedFallback && curatedFallback.length > 0) {
        return res.json({
          success: true,
          question: {
            ...curatedFallback[0],
            source: 'curated',
          },
        });
      }
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
      grade = '12',
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
A Class ${grade} student answered a board exam question incorrectly.

Context:
- Subject: ${subject}
- Standard: CBSE Class ${grade} (Session 2026–27)
- Chapter: ${chapter}
- Topic: ${topic}
- Question: "${question}"
- Options: ${JSON.stringify(options)}
- Student Selected: "${selectedAnswer}"
- Correct Answer: "${correctAnswer}"
- Standard Explanation: "${explanation}"
${studentQuery ? `- Specific Student Question: "${studentQuery}"` : ''}
${language === 'hi' ? `- Language Requirement: Provide coreConcept, whyCorrectIsRight, whySelectedIsWrong, memoryAnchor, and followUpQuestion in clear, natural Hindi (हिन्दी) using standard CBSE Class ${grade} NCERT terminology.` : ''}

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
        systemInstruction: `You are the Mistake Detective for CBSE Class ${grade} boards. Be encouraging, academically rigorous, and pedagogical.`,
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
      grade = '12',
      question = '',
      action = 'standard',
      conversationHistory = [],
      language = 'en',
      image,
    } = req.body;

    const validSubjects = ALL_VALID_SUBJECTS;
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

    const systemInstruction = `You are "BoardAce Tutor", a dedicated, empathetic, and academically rigorous CBSE Class ${grade} Master Teacher and Examination Mentor for the 2026–27 academic session.
You specialize strictly in:
1. Mathematics (CBSE Subject Code: 041)
2. Physics (CBSE Subject Code: 042)
3. Chemistry (CBSE Subject Code: 043)
4. Accountancy (Class 12 Commerce CBSE Subject Code: 055)
5. Business Studies (Class 12 Commerce CBSE Subject Code: 054)
6. Economics (Class 12 Commerce CBSE Subject Code: 030)
7. English Core (Class 12 CBSE Subject Code: 301)
8. Science (Class 10 CBSE Subject Code: 086)
9. Social Science (Class 10 CBSE Subject Code: 087)
10. English Language & Literature (Class 10 CBSE Subject Code: 184)

Pedagogical Rules:
- Deliver clear, well-structured step-by-step explanations directly aligned with the official NCERT CBSE Class ${grade} curriculum.
- For Mathematics (041):
  * State the governing definition, formula, or theorem.
  * Show intermediate calculations step-by-step so the student understands each algebraic step.
  * Point out common calculation traps (e.g., negative signs, constant of integration + C, domain/range restrictions).
- For Physics (042) and Class 10 Science (086):
  * State the underlying physical law or concept (e.g., Ohm's law, Snell's law, Fleming's rules).
  * State the formula and show numerical substitution with explicit SI units.
  * Explain the physical intuition, ray diagrams, and sign conventions.
- For Chemistry (043) and Chemical Reactions in Science:
  * Write balanced chemical equations with state symbols and reaction conditions.
  * Clearly explain reaction mechanisms, observations (color changes, precipitates, gases).
- For Accountancy (055):
  * State relevant accounting provisions (Partnership Act 1932, Companies Act 2013 Schedule III, AS-3).
  * Present journal entries in clean tabular form with Dr. and Cr. amounts and concise narrations.
  * Show working notes clearly for goodwill, sacrificing ratio, revaluation, and pro-rata allotments.
- For Business Studies (054):
  * Ground answers in Fayol's 14 principles, Taylor's scientific techniques, the 5 management functions, and Consumer Protection Act 2019.
  * Provide structured headings: Concept, Key Features, Real-world Corporate Application, and Board Exam Tip.
- For Economics (030):
  * For Macroeconomics: Show formulas (National Income, Multiplier k = 1/(1-MPC), credit creation = 1/LRR), show step-by-step calculations, and explain economic implications.
  * For Indian Economic Development: Ground answers in historical milestones, five-year plan goals, 1991 reforms, and comparative data with China/Pakistan.
- For English Core (301) and English (184):
  * Analyze textual themes, character sketches, poetic devices, and standard CBSE marking rubrics.
- Format with clean Markdown:
  * Use bold headers for structure (e.g., ### Concept Overview, ### Step-by-Step Solution / Journal Entries, ### Key Principles & Formulas, ### Common Board Trap, ### CBSE 2026–27 Examiner Tip).
  * Use clear numbered steps for derivations, numericals, or accounting entries.
${language === 'hi' ? `- Language Requirement: Provide the entire response in clear, student-friendly Hindi (हिन्दी) using standard CBSE NCERT Hindi-medium terminology, while keeping mathematical formulas, chemical equations, accounting terms, and SI units intact.` : '- Language Requirement: Provide the response in clear, student-friendly English.'}
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

    const promptMessage = `Subject: ${subject.toUpperCase()} (CBSE Class ${grade})
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

// Endpoint 1: PDF To Quiz Generator
app.post('/api/pdf-to-quiz', async (req: Request, res: Response) => {
  try {
    const {
      pdfBase64,
      filename = 'document.pdf',
      grade = '12',
      subject: rawSubject = 'physics',
      difficulty = 'medium',
      questionCount = 5,
      language = 'en',
    } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({
        success: false,
        error: language === 'hi' ? 'कृपया एक वैध पीडीएफ फाइल अपलोड करें।' : 'Please upload a valid PDF study file.',
      });
    }

    // Validate size (base64 string size max ~14MB corresponds to ~10MB PDF)
    const cleanBase64 = String(pdfBase64).replace(/^data:application\/pdf;base64,/, '').trim();
    if (cleanBase64.length > 14 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: language === 'hi' ? 'पीडीएफ फाइल का आकार 10MB से अधिक नहीं होना चाहिए।' : 'PDF file size exceeds 10MB limit.',
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'Gemini API key is not configured on the server.',
      });
    }

    const validSubjects = ALL_VALID_SUBJECTS;
    const subject = validSubjects.includes(String(rawSubject).toLowerCase())
      ? String(rawSubject).toLowerCase()
      : 'physics';

    const count = Math.min(Math.max(parseInt(questionCount, 10) || 5, 1), 15);

    const prompt = `You are an expert CBSE Class ${grade} Senior Examiner for Academic Session 2026–27.
Analyze the attached study document (${filename}) thoroughly.
Extract readable core concepts, definitions, formulas, and laws, and generate EXACTLY ${count} high-quality, authentic CBSE-standard multiple-choice questions directly grounded in this document.

Target Subject: ${subject.toUpperCase()}
Target Standard: CBSE Class ${grade}
Target Difficulty: ${difficulty}

Rules:
1. Every question must be directly grounded in the content of the provided document.
2. In "sourceSection", specify the exact heading, section name, or page reference found in the text where this concept appears (e.g., "Section 2.3: Electric Flux", or "Page 4, Colligative Properties"). If no reliable section name can be determined, return an empty string. Do NOT invent fake page numbers or hallucinated headings.
3. Every question must have EXACTLY 4 distinct, unambiguous options.
4. "correctAnswer" must match one of the 4 options verbatim.
5. "explanation" must provide step-by-step reasoning citing the text.
6. "pitfall" should highlight the common misconception or trap.
7. If the document is purely unreadable, blank, or completely unrelated to CBSE Class ${grade}, indicate so.
${language === 'hi' ? `8. Language Requirement: Provide question, options, explanation, and pitfall in clear, student-friendly Hindi (हिन्दी) using standard CBSE NCERT Class ${grade} terminology.` : ''}`;

    const buildPdfPayload = (modelName: string) => ({
      model: modelName,
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: cleanBase64,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
      config: {
        systemInstruction: 'You are an expert CBSE Class 12 Chief Paper Setter. Ground all questions strictly in the provided PDF material and extract accurate source citations.',
        temperature: 0.25,
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
              sourceSection: { type: Type.STRING },
              pitfall: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              questionType: { type: Type.STRING },
            },
            required: ['id', 'question', 'options', 'correctAnswer', 'explanation', 'subject', 'chapter', 'topic'],
          },
        },
      },
    });

    const generatePromise = callGeminiWithModelFallback(ai, buildPdfPayload);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('PDF analysis and question generation timed out after 55 seconds.')), 55000)
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

    const parsed = JSON.parse(rawText);
    const questions = (Array.isArray(parsed) ? parsed : (parsed.questions || [])).map((q: any, i: number) => ({
      ...q,
      id: q.id || `pdf-q-${Date.now()}-${i}`,
      difficulty: q.difficulty || difficulty,
      questionType: q.questionType || 'mcq',
      source: 'ai',
    }));

    return res.json({
      success: true,
      questions,
      filename,
    });
  } catch (error: any) {
    console.error('PDF to Quiz Error:', error);
    const friendlyError = formatErrorMessage(error);
    return res.status(500).json({
      success: false,
      error: friendlyError || 'Could not process PDF. If this is an image-only scanned document, please ensure text is legible or try a text-based notes PDF.',
    });
  }
});

// Endpoint 2: AI Mock Board Examiner (Written Answer Evaluator)
app.post('/api/check-answer', async (req: Request, res: Response) => {
  try {
    const {
      subject: rawSubject = 'physics',
      grade = '12',
      chapter = 'General',
      questionText,
      studentAnswer,
      maxMarks = 3,
      language = 'en',
    } = req.body;

    if (!questionText || !studentAnswer) {
      return res.status(400).json({
        success: false,
        error: language === 'hi' ? 'कृपया प्रश्न और अपना उत्तर दोनों दर्ज करें।' : 'Please provide both the question text and student answer.',
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'Gemini API key is not configured on the server.',
      });
    }

    const marks = Math.min(Math.max(parseInt(maxMarks, 10) || 3, 1), 5);

    const prompt = `You are a Senior CBSE Class ${grade} Board Exam Evaluator and Head Examiner for Academic Session 2026–27.
Evaluate the following student's written response against official CBSE marking schemes.

Subject: ${rawSubject.toUpperCase()} (CBSE Class ${grade})
Chapter: ${chapter}
Question (${marks} Marks):
"${questionText}"

Student's Written Response:
"${studentAnswer}"

Evaluate strictly according to CBSE Class ${grade} standards:
1. estimatedScore: An integer or half-mark score between 0 and ${marks} based on CBSE step-marking rubrics.
2. conceptAccuracy: A concise paragraph analyzing the accuracy of definitions, formulas, substitutions, and chemical/physical logic.
3. keyPointsHit: An array of specific concepts, formulas, or steps the student stated correctly.
4. keyPointsMissed: An array of essential CBSE marking points, SI units, diagram labels, or formula conditions the student omitted or got wrong.
5. improvementSuggestions: 2-3 specific, actionable examiner recommendations to secure full marks on exam day.
6. modelAnswer: The ideal CBSE board-topper answer that would earn full ${marks}/${marks} marks with clean formatting.
${language === 'hi' ? `7. Language Requirement: Provide the entire evaluation in clear Hindi (हिन्दी) using official NCERT CBSE Class ${grade} terminology while retaining formulas.` : ''}`;

    const buildCheckerPayload = (modelName: string) => ({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: `You are an official CBSE Class ${grade} Chief Examiner evaluating board answer sheets. Be constructive, step-marking oriented, and academically rigorous.`,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedScore: { type: Type.NUMBER },
            maxMarks: { type: Type.NUMBER },
            conceptAccuracy: { type: Type.STRING },
            keyPointsHit: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            keyPointsMissed: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            improvementSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            modelAnswer: { type: Type.STRING },
          },
          required: [
            'estimatedScore',
            'maxMarks',
            'conceptAccuracy',
            'keyPointsHit',
            'keyPointsMissed',
            'improvementSuggestions',
            'modelAnswer',
          ],
        },
      },
    });

    const response = await callGeminiWithModelFallback(ai, buildCheckerPayload);
    let rawText = (response.text || '').trim();
    if (rawText.startsWith('```json')) rawText = rawText.slice(7);
    if (rawText.startsWith('```')) rawText = rawText.slice(3);
    if (rawText.endsWith('```')) rawText = rawText.slice(0, -3);

    const evaluation = JSON.parse(rawText.trim());
    return res.json({
      success: true,
      evaluation: {
        ...evaluation,
        maxMarks: marks,
        disclaimer: 'Note: AI evaluation is an automated pedagogical estimate based on CBSE step-marking rubrics, not official board certification.',
      },
    });
  } catch (error: any) {
    console.error('Answer Checker Error:', error);
    const friendlyError = formatErrorMessage(error);
    return res.status(500).json({
      success: false,
      error: friendlyError,
    });
  }
});

// Endpoint 3: AI Notes Generator
app.post('/api/generate-notes', async (req: Request, res: Response) => {
  try {
    const {
      subject: rawSubject = 'physics',
      grade = '12',
      chapter = 'Electric Charges and Fields',
      language = 'en',
    } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'Gemini API key is not configured on the server.',
      });
    }

    const prompt = `You are a CBSE Class ${grade} Master Teacher and NCERT Textbook Author for Session 2026–27.
Generate high-yield, comprehensive chapter revision notes for:
Subject: ${rawSubject.toUpperCase()} (CBSE Class ${grade})
Chapter: "${chapter}"

Structure the response as structured JSON:
1. chapterSummary: 2-3 paragraph foundational overview explaining the big picture and exam significance.
2. keyFormulas: Array of objects with "name", "formula", "variables", and "examTip" (for science/maths) or key literary/historical terms.
3. coreTheoremsAndConcepts: Array of objects with "title", "content", and "importance".
4. commonBoardTraps: Array of classic mistakes students make in Section A/B/C.
5. quickRevisionChecklist: 6-8 rapid-fire bullet points for the night before the board exam.
${language === 'hi' ? `Language Requirement: Provide all explanations in clear Hindi (हिन्दी) using official CBSE NCERT Class ${grade} terminology while preserving math notation and equations.` : ''}`;

    const buildNotesPayload = (modelName: string) => ({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: `You are an author of premier CBSE Class ${grade} exam revision guides. Provide dense, accurate, highly organized notes.`,
        temperature: 0.25,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chapter: { type: Type.STRING },
            subject: { type: Type.STRING },
            chapterSummary: { type: Type.STRING },
            keyFormulas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  formula: { type: Type.STRING },
                  variables: { type: Type.STRING },
                  examTip: { type: Type.STRING },
                },
                required: ['name', 'formula', 'variables', 'examTip'],
              },
            },
            coreTheoremsAndConcepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  importance: { type: Type.STRING },
                },
                required: ['title', 'content', 'importance'],
              },
            },
            commonBoardTraps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            quickRevisionChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'chapter',
            'subject',
            'chapterSummary',
            'keyFormulas',
            'coreTheoremsAndConcepts',
            'commonBoardTraps',
            'quickRevisionChecklist',
          ],
        },
      },
    });

    const response = await callGeminiWithModelFallback(ai, buildNotesPayload);
    let rawText = (response.text || '').trim();
    if (rawText.startsWith('```json')) rawText = rawText.slice(7);
    if (rawText.startsWith('```')) rawText = rawText.slice(3);
    if (rawText.endsWith('```')) rawText = rawText.slice(0, -3);

    const notes = JSON.parse(rawText.trim());
    return res.json({
      success: true,
      notes,
    });
  } catch (error: any) {
    console.error('Notes Generation Error:', error);
    const friendlyError = formatErrorMessage(error);
    return res.status(500).json({
      success: false,
      error: friendlyError,
    });
  }
});

// Endpoint 4: AI Question Paper Generator
app.post('/api/generate-question-paper', async (req: Request, res: Response) => {
  try {
    const {
      subject: rawSubject = 'physics',
      grade = '12',
      chapters = ['all'],
      difficulty = 'mixed',
      paperFormat = 'standard', // 'standard' = mini board, 'full' = full board
      language = 'en',
    } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'Gemini API key is not configured on the server.',
      });
    }

    const subjectCodeMap: Record<string, string> = {
      mathematics: '041',
      physics: '042',
      chemistry: '043',
      science: '086',
      social_science: '087',
      english: '184',
    };
    const subjCode = subjectCodeMap[String(rawSubject).toLowerCase()] || '041';

    const isClass10 = String(grade) === '10';
    const totalMarks = paperFormat === 'full'
      ? (isClass10 || rawSubject === 'mathematics' ? 80 : 70)
      : (isClass10 ? 40 : 35);
    const timeMinutes = paperFormat === 'full' ? 180 : 90;

    const prompt = `You are the Chief Question Paper Setter for the Central Board of Secondary Education (CBSE) Class ${grade} Board Examination (Session 2026–27).
Construct an authentic, balanced board practice examination paper.

Subject: ${String(rawSubject).toUpperCase()} (CBSE Code: ${subjCode})
Class / Standard: CBSE Class ${grade}
Target Marks: ${totalMarks} Marks (${timeMinutes} Minutes)
Difficulty: ${difficulty}
Selected Chapters: ${JSON.stringify(chapters)}

Blueprint Requirements:
- Section A: MCQs and Assertion-Reason (1 mark each)
- Section B: Short Answer Type I (2 marks each)
- Section C: Short Answer Type II (3 marks each)
- Section D: Long Answer Type / Derivations (5 marks each)
- Section E: Case-Based Integrated Study (4 marks)

For every question across all sections, provide:
1. questionNumber: Integer
2. section: "A" | "B" | "C" | "D" | "E"
3. marks: Integer
4. questionText: String
5. options: Array of 4 strings (for Section A MCQs) or empty array
6. answerKeyAndMarkingScheme: Step-by-step point allocation detailing how marks are distributed (e.g., "Formula: 1 mark, Substitution: 1 mark, Final answer with unit: 1 mark").
7. topic: Subtopic name
${language === 'hi' ? `Language Requirement: Generate question paper, instructions, and marking scheme in clear Hindi (हिन्दी) using standard CBSE Class ${grade} NCERT terminology while keeping math notation and equations intact.` : ''}`;

    const buildPaperPayload = (modelName: string) => ({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: `You are the official CBSE Class ${grade} Chief Moderator. Generate a flawless, curriculum-accurate, mathematically sound board examination paper.`,
        temperature: 0.25,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subject: { type: Type.STRING },
            totalMarks: { type: Type.NUMBER },
            timeAllowedMinutes: { type: Type.NUMBER },
            generalInstructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionNumber: { type: Type.NUMBER },
                  section: { type: Type.STRING },
                  marks: { type: Type.NUMBER },
                  questionText: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  answerKeyAndMarkingScheme: { type: Type.STRING },
                  topic: { type: Type.STRING },
                },
                required: ['questionNumber', 'section', 'marks', 'questionText', 'answerKeyAndMarkingScheme'],
              },
            },
          },
          required: ['title', 'subject', 'totalMarks', 'timeAllowedMinutes', 'generalInstructions', 'questions'],
        },
      },
    });

    const response = await callGeminiWithModelFallback(ai, buildPaperPayload);
    let rawText = (response.text || '').trim();
    if (rawText.startsWith('```json')) rawText = rawText.slice(7);
    if (rawText.startsWith('```')) rawText = rawText.slice(3);
    if (rawText.endsWith('```')) rawText = rawText.slice(0, -3);

    const paper = JSON.parse(rawText.trim());
    return res.json({
      success: true,
      paper: {
        ...paper,
        disclaimer: 'Unofficial Board Practice Material created by BoardAce AI for student preparation. Not an official CBSE leaked paper.',
      },
    });
  } catch (error: any) {
    console.error('Question Paper Error:', error);
    const friendlyError = formatErrorMessage(error);
    return res.status(500).json({
      success: false,
      error: friendlyError,
    });
  }
});

// Endpoint 5: CBSE Competency-Based Practice Generator (NEP 2020 & CBSE 2026-27 Guidelines)
app.post('/api/generate-competency', async (req: Request, res: Response) => {
  try {
    const {
      grade = '12',
      subject: rawSubject = 'physics',
      chapter = 'all',
      questionType = 'application_mcq',
      difficulty = 'medium',
      questionCount = 5,
      language = 'en',
    } = req.body;

    const validSubjects = ALL_VALID_SUBJECTS;
    const subject = validSubjects.includes(String(rawSubject).toLowerCase())
      ? String(rawSubject).toLowerCase()
      : 'physics';

    // Verify Chapter if specific
    if (chapter !== 'all') {
      const verifiedList = getVerifiedChapters(subject, String(grade));
      const isVerified = verifiedList.length === 0 || verifiedList.some(
        ch => ch.toLowerCase() === chapter.toLowerCase() ||
              chapter.toLowerCase().includes(ch.toLowerCase()) ||
              ch.toLowerCase().includes(chapter.toLowerCase())
      );
      if (!isVerified) {
        return res.status(400).json({
          success: false,
          error: `The selected chapter "${chapter}" is not supported by verified CBSE Class ${grade} (2026–27) syllabus data for ${subject}.`,
        });
      }
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'Gemini API key is not configured on the server.',
      });
    }

    const count = Math.min(Math.max(parseInt(questionCount, 10) || 5, 1), 10);

    let formatGuidance = '';
    if (questionType === 'case_based') {
      formatGuidance = `Generate Case-Based Competency questions. Provide a realistic 120-180 word authentic scientific, technological, social, or real-world scenario/passage in "casePassage". Then pose a high-order application question based directly on that passage with 4 distinct options.`;
    } else if (questionType === 'assertion_reason') {
      formatGuidance = `Generate Assertion-Reason questions in strict CBSE format with Assertion (A) and Reason (R) and standard 4 options:
        1. Both (A) and (R) are true and (R) is the correct explanation of (A)
        2. Both (A) and (R) are true but (R) is not the correct explanation of (A)
        3. (A) is true but (R) is false
        4. (A) is false but (R) is true.`;
    } else if (questionType === 'numerical') {
      formatGuidance = `Generate realistic applied numerical computation problems testing formula synthesis, explicit SI units, and multi-step deduction with 4 distinct options with accurate units.`;
    } else if (questionType === 'analytical' || questionType === 'problem_solving') {
      formatGuidance = `Generate Analytical & Problem-Solving questions requiring students to evaluate data, compare scenarios, predict outcomes, or synthesize concepts, with 4 distinct options.`;
    } else if (questionType === 'source_based') {
      formatGuidance = `Generate Source-Based questions featuring an experimental observation table, historical document excerpt, data chart description, or graph interpretation in "casePassage" with 4 distinct analytical options.`;
    } else {
      formatGuidance = `Generate Application-Based Multiple Choice Questions testing higher-order conceptual understanding (Bloom's taxonomy: Application & Analysis) rather than rote recall, with 4 distinct options.`;
    }

    const prompt = `You are a Senior CBSE Curriculum Specialist and Competency-Focused Assessment Designer for Academic Session 2026–27.
In alignment with NEP 2020 and CBSE 2026–27 guidelines (which require ≥50% competency-focused questions), generate EXACTLY ${count} original, syllabus-aligned competency practice questions.

Academic Context:
- Board: CBSE Class ${grade} (Academic Session 2026–27)
- Subject: ${subject.toUpperCase()}
- Chapter / Domain: ${chapter}
- Competency Format: ${questionType}
- Target Difficulty: ${difficulty}
- Assessment Goal: Test conceptual reasoning, real-world application, critical thinking, and problem solving.

Format Rules:
${formatGuidance}

Mandatory per question:
1. "id": unique string ID.
2. "question": clearly worded question statement.
3. "casePassage": scenario/passage text if case_based or source_based, else empty string.
4. "options": array of EXACTLY 4 distinct, plausible options (A, B, C, D).
5. "correctAnswer": must match one of the 4 options verbatim.
6. "explanation": rigorous step-by-step reasoning explaining why the correct answer is valid.
7. "conceptTested": concise name of the core competency learning outcome (e.g. "Application of Snell's Law in Optical Fibers", "Ohmic Dissipation in Household Circuits").
8. "commonMisconception": specific conceptual trap or board pitfall students make on this type of question.
9. "suggestedRevisionTopic": specific NCERT chapter subtopic to revisit.
${language === 'hi' ? `10. Language Requirement: Provide question, passage, options, explanation, conceptTested, and commonMisconception in clear, student-friendly Hindi (हिन्दी) using official CBSE NCERT Class ${grade} terminology.` : ''}

Note: Do not claim these are leaked or official past year papers. These are original competency-based practice items.`;

    const buildPayload = (modelName: string) => ({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: `You are an official CBSE Class ${grade} Competency Item Writer for session 2026–27. Produce pristine, scientifically and mathematically sound questions.`,
        temperature: 0.25,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  casePassage: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  conceptTested: { type: Type.STRING },
                  commonMisconception: { type: Type.STRING },
                  suggestedRevisionTopic: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  marks: { type: Type.NUMBER },
                },
                required: ['id', 'question', 'options', 'correctAnswer', 'explanation', 'conceptTested', 'commonMisconception', 'suggestedRevisionTopic'],
              },
            },
          },
          required: ['questions'],
        },
      },
    });

    const response = await callGeminiWithModelFallback(ai, buildPayload);
    let rawText = (response.text || '').trim();
    if (rawText.startsWith('```json')) rawText = rawText.slice(7);
    if (rawText.startsWith('```')) rawText = rawText.slice(3);
    if (rawText.endsWith('```')) rawText = rawText.slice(0, -3);

    const parsed = JSON.parse(rawText.trim());
    const rawQuestions = Array.isArray(parsed) ? parsed : (parsed.questions || []);

    // Validate each question
    const validatedQuestions = rawQuestions.filter((q: any) => {
      if (!q.question || !q.correctAnswer || !q.explanation) return false;
      if (!Array.isArray(q.options) || q.options.length < 2) return false;
      if (!q.options.includes(q.correctAnswer)) {
        const matched = q.options.find((o: string) => o.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase());
        if (matched) {
          q.correctAnswer = matched;
        } else {
          return false;
        }
      }
      return true;
    }).map((q: any, idx: number) => ({
      ...q,
      id: q.id || `comp-${Date.now()}-${idx}`,
      grade,
      subject,
      chapter,
      questionType,
      difficulty: q.difficulty || difficulty,
      marks: q.marks || (questionType === 'case_based' ? 4 : 1),
      source: 'ai_competency',
    }));

    if (validatedQuestions.length === 0) {
      throw new Error('Generated questions failed validation checks. Please retry.');
    }

    return res.json({
      success: true,
      questions: validatedQuestions,
      metadata: {
        grade,
        subject,
        chapter,
        questionType,
        count: validatedQuestions.length,
        framework: 'CBSE Competency-Focused Education (NEP 2020)',
      },
    });
  } catch (error: any) {
    console.error('Competency Practice Generator Error:', error);
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
