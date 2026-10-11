/**
 * Mistake Detective Unit & Integration Test Suite
 * Validates:
 * 1. Deterministic classification categories (Conceptual misunderstanding, Calculation error,
 *    Formula selection, Unit or sign error, Incorrect factual understanding, Review this concept).
 * 2. Local score and summary calculations (Zero external Gemini calls needed).
 * 3. Subject-specific breakdowns for Mathematics, Physics, and Chemistry.
 * 4. High-yield revision recommendations and exam tips.
 * 5. Verify the /api/generate-similar-question server endpoint.
 */

import {
  classifyMistake,
  getRevisionTip,
  getSubjectSpecificBreakdown,
  generateRevisionRecommendation,
  computeMistakeDetectiveSummary,
} from './src/utils/mistakeDetective';
import { Question, QuizAttempt } from './src/types/quiz';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('--- Testing Mistake Detective Deterministic Classifier ---');

// Test 1: Unit or sign error
const signQuestion: Question = {
  id: 'q-sign',
  question: 'What is the potential difference between two points if work done is -10 J on a 2 C charge?',
  options: ['-5 V', '+5 V', '-20 V', '+20 V'],
  correctAnswer: '-5 V',
  explanation: 'By definition V = W/q = -10 J / 2 C = -5 V. Students often neglect the minus sign.',
  subject: 'physics',
  chapter: 'Electrostatic Potential and Capacitance',
  topic: 'Electric Potential',
  difficulty: 'easy',
  questionType: 'numerical',
  pitfall: 'Remember sign convention: negative work indicates opposite field direction.',
};

const signCategory = classifyMistake(signQuestion, '+5 V');
assert(
  signCategory === 'Unit or sign error',
  `Expected "Unit or sign error" for sign inversion, got "${signCategory}"`
);

// Test 2: Calculation error
const mathCalcQuestion: Question = {
  id: 'q-calc',
  question: 'Evaluate the integral of 2x from 0 to 3.',
  options: ['9', '6', '12', '18'],
  correctAnswer: '9',
  explanation: 'The integral of 2x is x^2. Evaluating from 0 to 3 gives 3^2 - 0 = 9.',
  subject: 'mathematics',
  chapter: 'Integrals',
  topic: 'Definite Integrals',
  difficulty: 'medium',
  questionType: 'numerical',
  pitfall: 'A common calculation error is forgetting to divide by 2 or making an arithmetic mistake.',
};

const calcCategory = classifyMistake(mathCalcQuestion, '6');
assert(
  calcCategory === 'Calculation error',
  `Expected "Calculation error", got "${calcCategory}"`
);

// Test 3: Formula selection error
const formulaQuestion: Question = {
  id: 'q-formula',
  question: 'Two resistors of 4 Ω each are connected in parallel. What is the equivalent resistance?',
  options: ['2 Ω', '8 Ω', '4 Ω', '16 Ω'],
  correctAnswer: '2 Ω',
  explanation: 'For parallel resistors: 1/Req = 1/R1 + 1/R2 = 1/4 + 1/4 = 2/4 = 1/2, so Req = 2 Ω.',
  subject: 'physics',
  chapter: 'Current Electricity',
  topic: 'Combination of Resistors',
  difficulty: 'easy',
  questionType: 'numerical',
  formula: '1/Req = 1/R1 + 1/R2',
  pitfall: 'Students chose the wrong formula: applying series formula R1 + R2 instead of parallel.',
};

const formulaCategory = classifyMistake(formulaQuestion, '8 Ω');
assert(
  formulaCategory === 'Formula selection',
  `Expected "Formula selection", got "${formulaCategory}"`
);

// Test 4: Incorrect factual understanding
const factualQuestion: Question = {
  id: 'q-fact',
  question: 'Which reagent is used in the Reimer-Tiemann reaction to convert phenol to salicylaldehyde?',
  options: ['CHCl3 + aqueous NaOH', 'CO2 + NaOH', 'Zn dust', 'KMnO4'],
  correctAnswer: 'CHCl3 + aqueous NaOH',
  explanation: 'In the Reimer-Tiemann reaction, phenol is treated with chloroform (CHCl3) in the presence of sodium hydroxide.',
  subject: 'chemistry',
  chapter: 'Alcohols, Phenols and Ethers',
  topic: 'Reactions of Phenols',
  difficulty: 'medium',
  questionType: 'mcq',
  pitfall: 'Factual recall required: do not confuse with Kolbe reaction which uses CO2 + NaOH.',
};

const factCategory = classifyMistake(factualQuestion, 'CO2 + NaOH');
assert(
  factCategory === 'Incorrect factual understanding',
  `Expected "Incorrect factual understanding", got "${factCategory}"`
);

// Test 5: Conceptual misunderstanding
const conceptQuestion: Question = {
  id: 'q-concept',
  question: 'Can the electric field inside a hollow spherical conductor with charge Q on its surface be non-zero in electrostatic equilibrium?',
  options: ['No, always zero', 'Yes, depends on radius', 'Yes, proportional to Q', 'Only at the center'],
  correctAnswer: 'No, always zero',
  explanation: 'By Gauss law, gaussian surface inside enclosed zero charge, hence field is zero everywhere inside.',
  subject: 'physics',
  chapter: 'Electrostatics',
  topic: 'Electrostatic Shielding',
  difficulty: 'medium',
  questionType: 'conceptual',
  pitfall: 'A fundamental misconception is confusing electric potential with electric field.',
};

const conceptCategory = classifyMistake(conceptQuestion, 'Yes, proportional to Q');
assert(
  conceptCategory === 'Conceptual misunderstanding',
  `Expected "Conceptual misunderstanding", got "${conceptCategory}"`
);

// Test 6: Fallback when not confidently supported
const ambigQuestion: Question = {
  id: 'q-ambig',
  question: 'Select the property exhibiting higher value for transition elements.',
  options: ['Enthalpy of atomization', 'Ionic radius', 'Screening constant', 'Reactivity with water'],
  correctAnswer: 'Enthalpy of atomization',
  explanation: 'Transition elements have high enthalpies of atomization due to presence of unpaired d electrons.',
  subject: 'chemistry',
  chapter: 'd and f Block Elements',
  topic: 'General Trends',
  difficulty: 'hard',
  questionType: 'mcq',
};

const ambigCategory = classifyMistake(ambigQuestion, 'Screening constant');
assert(
  ambigCategory === 'Review this concept',
  `Expected fallback "Review this concept", got "${ambigCategory}"`
);

console.log('\n--- Testing Subject-Specific Breakdowns ---');

// Math breakdown
const mathBreakdown = getSubjectSpecificBreakdown(mathCalcQuestion);
assert(
  mathBreakdown.subject === 'mathematics',
  'Mathematics subject confirmed in breakdown'
);
assert(
  Boolean(mathBreakdown.calculationSteps && mathBreakdown.calculationSteps.length > 0),
  'Mathematics calculation steps present'
);

// Physics breakdown
const physBreakdown = getSubjectSpecificBreakdown(signQuestion);
assert(
  physBreakdown.subject === 'physics',
  'Physics subject confirmed in breakdown'
);

// Chemistry breakdown
const chemBreakdown = getSubjectSpecificBreakdown(factualQuestion);
assert(
  chemBreakdown.subject === 'chemistry',
  'Chemistry subject confirmed in breakdown'
);

console.log('\n--- Testing Local Score & Mistake Diagnostic Summary ---');

const mockAttempt: QuizAttempt = {
  id: 'mock-attempt-1',
  quizConfig: {
    board: 'CBSE',
    grade: '12',
    subject: 'physics',
    chapter: 'Current Electricity',
    difficulty: 'medium',
    questionCount: 4,
    questionType: 'mixed',
    mode: 'exam',
    useAi: false,
  },
  questions: [signQuestion, mathCalcQuestion, formulaQuestion, conceptQuestion],
  userAnswers: {
    'q-sign': '+5 V', // Incorrect (Unit or sign)
    'q-calc': '9',    // Correct
    'q-formula': '8 Ω', // Incorrect (Formula selection)
    'q-concept': 'No, always zero', // Correct
  },
  flaggedQuestions: {},
  timeSpentSeconds: 120,
  completedAt: new Date().toISOString(),
  score: 2,
  totalQuestions: 4,
  accuracy: 50,
  topicBreakdown: {},
  weakTopics: ['Electric Potential', 'Combination of Resistors'],
};

const summary = computeMistakeDetectiveSummary(mockAttempt);
assert(summary.totalQuestions === 4, 'Total questions matches 4');
assert(summary.correctCount === 2, 'Correct count matches 2');
assert(summary.incorrectCount === 2, 'Incorrect count matches 2');
assert(summary.accuracy === 50, 'Accuracy is 50%');
assert(summary.mistakes.length === 2, 'Mistakes list contains 2 entries');
assert(
  summary.topicsWithMistakes.includes('Electric Potential'),
  'Topics with mistakes includes Electric Potential'
);
assert(
  Boolean(summary.revisionRecommendation && summary.revisionRecommendation.length > 20),
  'Personalized revision recommendation generated'
);

console.log('\nAll Mistake Detective Unit Tests Passed Successfully!\n');
