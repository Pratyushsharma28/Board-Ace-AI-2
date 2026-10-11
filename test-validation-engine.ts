/**
 * Comprehensive Test Suite for Question Accuracy and Validation Engine
 * Validates:
 * 1. Missing question fields
 * 2. Duplicate questions
 * 3. Invalid answer options (< 4 options, duplicate options)
 * 4. Correct answers that do not match an option
 * 5. Arithmetic validation (Math expressions and answers)
 * 6. Physics SI units and dimensional consistency
 * 7. Chemistry balanced vs unbalanced chemical equations
 * 8. Contradiction between answer and explanation
 * 9. Real valid questions across Mathematics, Physics, and Chemistry
 */

import {
  validateSingleQuestion,
  validateQuestionBatch,
  checkEquationBalance,
  safeEvaluateMath,
  matchOption,
} from './src/utils/questionValidator.ts';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName}${detail ? ' - ' + detail : ''}`);
  }
}

console.log('--- STARTING QUESTION ACCURACY & VALIDATION ENGINE TESTS ---\n');

// 1. Missing fields test
{
  const result = validateSingleQuestion({
    question: '',
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 'A',
  });
  assert(!result.isValid, 'Rejects question with empty question text');
}

{
  const result = validateSingleQuestion({
    question: 'What is the SI unit of electric flux in electrostatics?',
    options: ['V·m', 'N/C'],
    correctAnswer: 'V·m',
    explanation: 'Electric flux = E * A = (N/C) * m^2 = V*m.',
  });
  assert(!result.isValid, 'Rejects question with fewer than 4 options');
}

// 2. Duplicate options test
{
  const result = validateSingleQuestion({
    question: 'Which of the following is a diamagnetic material in CBSE physics?',
    options: ['Bismuth', 'Copper', 'Bismuth', 'Water'],
    correctAnswer: 'Bismuth',
    explanation: 'Bismuth is the most diamagnetic material.',
  });
  assert(!result.isValid, 'Rejects question with duplicate options');
}

// 3. Correct answer that does not match any option
{
  const result = validateSingleQuestion({
    question: 'What is the order of reaction for radioactive decay?',
    options: ['Zero order', 'Second order', 'Pseudo first order', 'Third order'],
    correctAnswer: 'First order',
    explanation: 'Radioactive decay always follows first order kinetics.',
  });
  assert(!result.isValid, 'Rejects question when correct answer does not match any option');
}

// 4. Inconsistent explanation contradictory to designated answer
{
  const result = validateSingleQuestion({
    question: 'What is the derivative of sin(x) with respect to x?',
    options: ['cos(x)', '-cos(x)', 'tan(x)', '-sin(x)'],
    correctAnswer: '-cos(x)',
    explanation: 'By standard calculus formula, d/dx(sin x) = cos x. Hence, option cos(x) is correct.',
    subject: 'mathematics',
  });
  assert(!result.isValid, 'Rejects question where explanation explicitly contradicts the assigned answer');
}

// 5. Arithmetic validation
{
  const eval1 = safeEvaluateMath('2 * 3 + 4');
  assert(eval1 === 10, 'safeEvaluateMath correctly calculates 2 * 3 + 4 = 10');

  const eval2 = safeEvaluateMath('(10 - 2) / 4');
  assert(eval2 === 2, 'safeEvaluateMath correctly calculates (10 - 2) / 4 = 2');

  const eval3 = safeEvaluateMath('3^2 + 1');
  assert(eval3 === 10, 'safeEvaluateMath handles power notation 3^2 = 9 + 1 = 10');
}

// 6. Chemical equation atom balancing
{
  // Balanced: 2H2 + O2 -> 2H2O
  const eq1 = checkEquationBalance('2H2 + O2 -> 2H2O');
  assert(eq1.isBalanced === true, 'Accurately validates balanced equation 2H2 + O2 -> 2H2O');

  // Unbalanced: H2 + O2 -> H2O
  const eq2 = checkEquationBalance('H2 + O2 -> H2O');
  assert(eq2.isBalanced === false, 'Detects unbalanced equation H2 + O2 -> H2O');

  // Complex balanced: CaCO3 + 2HCl -> CaCl2 + H2O + CO2
  const eq3 = checkEquationBalance('CaCO3 + 2HCl -> CaCl2 + H2O + CO2');
  assert(eq3.isBalanced === true, 'Accurately validates CaCO3 + 2HCl -> CaCl2 + H2O + CO2');
}

// 7. Duplicate question rejection in batch
{
  const batch = [
    {
      question: 'What is the SI unit of capacitance in electrostatics?',
      options: ['Farad', 'Henry', 'Tesla', 'Volt'],
      correctAnswer: 'Farad',
      explanation: 'Capacitance C = Q/V has the SI unit Farad (F).',
      subject: 'physics',
      chapter: 'Electrostatic Potential and Capacitance',
    },
    {
      question: 'What is the SI unit of capacitance in electrostatics?',
      options: ['Farad', 'Henry', 'Tesla', 'Volt'],
      correctAnswer: 'Farad',
      explanation: 'Capacitance C = Q/V has the SI unit Farad (F).',
      subject: 'physics',
      chapter: 'Electrostatic Potential and Capacitance',
    },
  ];
  const summary = validateQuestionBatch(batch, 'physics', 'Electrostatic Potential and Capacitance', 2);
  assert(summary.validCount === 1, 'Rejects duplicate question in batch');
  assert(summary.rejectedCount === 1, 'Records rejected count correctly');
}

// 8. Valid Mathematics Question
{
  const mathQ = {
    question: 'If A is a 3 × 3 matrix such that |A| = 5, then the value of |adj(A)| is:',
    options: ['25', '5', '125', '1/5'],
    correctAnswer: '25',
    explanation: 'By the standard NCERT property of determinants, |adj(A)| = |A|^(n-1). For a 3 × 3 matrix n = 3, so |adj(A)| = 5^(3-1) = 5^2 = 25.',
    subject: 'mathematics',
    chapter: 'Determinants',
    topic: 'Adjoint and Inverse of a Matrix',
    difficulty: 'medium',
    questionType: 'mcq',
  };
  const res = validateSingleQuestion(mathQ, 'mathematics', 'Determinants');
  assert(res.isValid, 'Accepts valid Mathematics question with determinant formula steps');
  assert(res.question?.validationMetadata.passedChecks.includes('correct_answer_matches_option') === true, 'Validates correct answer matching');
}

// 9. Valid Physics Question with SI units
{
  const physQ = {
    question: 'Two point charges of +2 μC and +6 μC repel each other with a force of 12 N. If each is given an additional charge of -4 μC, what is the new force between them?',
    options: ['4 N attractive', '4 N repulsive', '8 N attractive', '12 N repulsive'],
    correctAnswer: '4 N attractive',
    explanation: 'New charges are q1 = 2 - 4 = -2 μC and q2 = 6 - 4 = +2 μC. Initial force F1 ∝ |q1 * q2| = 2 * 6 = 12. New force F2 ∝ |-2 * 2| = 4. Since charges have opposite signs, the new force is 4 N attractive.',
    subject: 'physics',
    chapter: 'Electric Charges and Fields',
    topic: 'Coulomb Law and Superposition Principle',
    difficulty: 'medium',
    questionType: 'numerical',
  };
  const res = validateSingleQuestion(physQ, 'physics', 'Electric Charges and Fields');
  assert(res.isValid, 'Accepts valid Physics numerical question with units and sign convention');
}

// 10. Valid Chemistry Question with mechanism
{
  const chemQ = {
    question: 'Which of the following alkyl halides undergoes nucleophilic substitution primarily via the SN1 mechanism at the fastest rate?',
    options: ['(CH3)3C-Br', '(CH3)2CH-Br', 'CH3-CH2-Br', 'CH3-Br'],
    correctAnswer: '(CH3)3C-Br',
    explanation: 'SN1 reaction proceeds via carbocation intermediate. Tertiary carbocations (CH3)3C+ are most stable due to hyperconjugation and inductive effect (+I), making tertiary alkyl halides react fastest.',
    subject: 'chemistry',
    chapter: 'Haloalkanes and Haloarenes',
    topic: 'Nucleophilic Substitution Mechanisms (SN1 vs SN2)',
    difficulty: 'medium',
    questionType: 'conceptual',
  };
  const res = validateSingleQuestion(chemQ, 'chemistry', 'Haloalkanes and Haloarenes');
  assert(res.isValid, 'Accepts valid Chemistry conceptual question with SN1 mechanism');
}

console.log(`\n--- TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED ---`);
if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL VALIDATION ENGINE TESTS PASSED SUCCESSFULLY!\n');
}
