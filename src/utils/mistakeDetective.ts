/**
 * Mistake Detective Engine for CBSE Class 12 (Session 2026-27)
 * Strictly supports: Mathematics (041), Physics (042), Chemistry (043).
 *
 * Provides:
 * 1. Deterministic classification of incorrect student choices:
 *    - Conceptual misunderstanding
 *    - Calculation error
 *    - Formula selection
 *    - Unit or sign error
 *    - Incorrect factual understanding
 *    - Review this concept (default when not confidently supported)
 * 2. Subject-specific explanation decomposition (Mathematics calculation steps, Physics formulas/units, Chemistry equations/reactions)
 * 3. High-yield board revision tips and exam hall recommendations
 * 4. Local scoring and mistake breakdown summary (zero additional Gemini calls needed for review)
 */

import { Question, QuizAttempt, MistakeCategory } from '../types/quiz';

export const MISTAKE_CATEGORY_HI: Record<MistakeCategory, string> = {
  'Conceptual misunderstanding': 'अवधारणात्मक गलतफहमी',
  'Calculation error': 'गणना संबंधी त्रुटि',
  'Formula selection': 'गलत सूत्र का चयन',
  'Unit or sign error': 'इकाई अथवा चिह्न की त्रुटि',
  'Incorrect factual understanding': 'तथ्यात्मक समझ में त्रुटि',
  'Needs further review': 'पुनरावलोकन आवश्यक',
  'Review this concept': 'इस अवधारणा की समीक्षा करें',
};

export interface SubjectBreakdown {
  subject: 'mathematics' | 'physics' | 'chemistry';
  calculationSteps?: string[];
  mathematicalReasoning?: string;
  formula?: string;
  substitutionsAndUnits?: string;
  physicsReasoning?: string;
  chemicalEquation?: string;
  reactionReasoning?: string;
  stoichiometryOrConcept?: string;
  examinerWarning?: string;
  isDetailedAvailable: boolean;
  notes?: string;
}

export interface MistakeDetail {
  questionNumber: number;
  question: Question;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  topic: string;
  category: MistakeCategory;
  categoryBadge: string;
  revisionTip: string;
  subjectBreakdown: SubjectBreakdown;
}

export interface MistakeSummary {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  score: number;
  accuracy: number;
  mistakes: MistakeDetail[];
  topicsWithMistakes: string[];
  categoryCounts: Record<string, number>;
  revisionRecommendation: string;
}

/**
 * Classifies an incorrect answer deterministically using existing question metadata.
 * Only assigns a specific category when the metadata confidently supports it.
 * Otherwise returns 'Review this concept'.
 */
export function classifyMistake(question: Question, selectedAnswer: string): MistakeCategory {
  if (!selectedAnswer || selectedAnswer.trim() === '') {
    return 'Review this concept';
  }

  const selNorm = selectedAnswer.trim().toLowerCase();
  const corrNorm = question.correctAnswer.trim().toLowerCase();
  const explNorm = (question.explanation || '').toLowerCase();
  const pitfallNorm = (question.pitfall || '').toLowerCase();
  const questionNorm = (question.question || '').toLowerCase();
  const topicNorm = (question.topic || '').toLowerCase();

  // 1. Check for Unit or Sign error
  // Opposite sign check (e.g. -5 vs 5, -3.2 V vs +3.2 V, etc.)
  const isOppositeSign =
    (selNorm.startsWith('-') && !corrNorm.startsWith('-') && selNorm.slice(1).trim() === corrNorm) ||
    (!selNorm.startsWith('-') && corrNorm.startsWith('-') && '-' + selNorm === corrNorm) ||
    /sign\s+convention|minus\s+sign|negative\s+sign|inverted\s+sign|direction\s+of\s+field|opposite\s+direction|vector\s+vs\s+scalar|scalar\s+quantity/i.test(
      pitfallNorm + ' ' + explNorm
    );

  // Differing unit check (same numeric root but different unit: cm vs m, mA vs A, etc.)
  const hasUnitMismatch =
    /unit\s+conversion|si\s+unit|dimensional\s+error|cm\s+instead\s+of\s+m|ma\s+instead\s+of\s+a|micro|nano|pico|angstrom|in\s+joules\s+instead\s+of\s+ev/i.test(
      pitfallNorm + ' ' + explNorm
    );

  if (isOppositeSign || hasUnitMismatch) {
    return 'Unit or sign error';
  }

  // 2. Check for Formula selection error (checked before calculation to catch wrong formula in numericals)
  const hasFormulaIndicators =
    /wrong\s+formula|formula\s+selection|chose\s+the\s+wrong\s+formula|confused\s+with\s+formula|used\s+v\s*=\s*ir|series\s+(?:instead\s+of|formula\s+instead\s+of)\s+parallel|parallel\s+(?:instead\s+of|formula\s+instead\s+of)\s+series|differentiating\s+instead\s+of\s+integrating|inverse\s+relationship|applied\s+gauss|formula\s+for/i.test(
      pitfallNorm + ' ' + explNorm
    ) ||
    (Boolean(question.formula) && /confused|swapped|inversion|applied/i.test(pitfallNorm));

  if (hasFormulaIndicators) {
    return 'Formula selection';
  }

  // 3. Check for Calculation error (requires explicit calculation/arithmetic indicators)
  const hasExplicitCalculation =
    /calculation\s+error|arithmetic|algebraic\s+simplification|arithmetical|multiplication|factor\s+of\s+2|factor\s+of\s+1\/2|square\s+root|reciprocal\s+error|decimal\s+place|algebraic\s+sign/i.test(
      pitfallNorm + ' ' + explNorm
    );

  const isBothNumeric =
    /^[\d\.\-\+\s\/e^×*]+[a-z%°ωμ]*$/i.test(selNorm) &&
    /^[\d\.\-\+\s\/e^×*]+[a-z%°ωμ]*$/i.test(corrNorm);

  if (
    hasExplicitCalculation ||
    (question.subject === 'mathematics' && isBothNumeric && /evaluat|integrat|differentiat|product|determinant/i.test(explNorm))
  ) {
    return 'Calculation error';
  }

  // 4. Check for Incorrect factual understanding
  const hasFactualIndicators =
    /definition|factual|nomenclature|iupac|named\s+reaction|catalyst|reagent|coordination\s+number|oxidation\s+state|electronic\s+configuration|periodic\s+trend|statement\s+is\s+false|factual\s+recollection|law\s+states/i.test(
      pitfallNorm + ' ' + explNorm
    ) ||
    /naming|reagents|identification|statement\s+analysis/i.test(topicNorm);

  if (hasFactualIndicators) {
    return 'Incorrect factual understanding';
  }

  // 5. Check for Conceptual misunderstanding
  const hasConceptualIndicators =
    question.questionType === 'conceptual' ||
    question.questionType === 'assertion_reason' ||
    /conceptual\s+misunderstanding|misconception|fundamental\s+concept|assumed\s+that|confuses|fails\s+to\s+realize|nature\s+of|physical\s+significance|principle/i.test(
      pitfallNorm + ' ' + explNorm
    );

  if (hasConceptualIndicators) {
    return 'Conceptual misunderstanding';
  }

  // Default fallback when information does not confidently single out one category
  return 'Review this concept';
}

/**
 * Generates subject-specific breakdown based on the available question data.
 * Does not fabricate missing steps.
 */
export function getSubjectSpecificBreakdown(question: Question): SubjectBreakdown {
  const subj = (question.subject || 'physics').toLowerCase() as 'mathematics' | 'physics' | 'chemistry';
  const explanation = question.explanation || '';
  const pitfall = question.pitfall;

  if (subj === 'mathematics') {
    // Check if explicit solutionSteps exist
    if (question.solutionSteps && question.solutionSteps.length > 0) {
      return {
        subject: 'mathematics',
        calculationSteps: question.solutionSteps,
        mathematicalReasoning: explanation,
        examinerWarning: pitfall,
        isDetailedAvailable: true,
      };
    }

    // Attempt to split structured steps from explanation if delimited
    const stepMatches = explanation.split(/(?:Step\s*\d+:|\d+\.\s+(?=[A-Z])|\([i|v|x]+\)\s+)/gi).map(s => s.trim()).filter(Boolean);
    if (stepMatches.length >= 2) {
      return {
        subject: 'mathematics',
        calculationSteps: stepMatches,
        mathematicalReasoning: explanation,
        examinerWarning: pitfall,
        isDetailedAvailable: true,
      };
    }

    // When detailed calculation steps are not segmented, display available explanation faithfully
    return {
      subject: 'mathematics',
      calculationSteps: [explanation],
      mathematicalReasoning: explanation,
      examinerWarning: pitfall,
      isDetailedAvailable: true,
      notes: 'Detailed step breakdown is summarized in the verified board solution above. Review NCERT Class 12 for extended proofs.',
    };
  }

  if (subj === 'physics') {
    // Extract formulas and substitutions
    const formula = question.formula || extractFormulaFromText(explanation) || undefined;
    const substitutionSnippet = extractSubstitutionsFromText(explanation);

    return {
      subject: 'physics',
      formula,
      substitutionsAndUnits: substitutionSnippet,
      physicsReasoning: explanation,
      examinerWarning: pitfall,
      isDetailedAvailable: Boolean(formula || substitutionSnippet || explanation.length > 40),
      notes: formula
        ? undefined
        : 'Governing relationship is outlined in the explanation. Verify SI units and vector conventions.',
    };
  }

  // Chemistry
  const chemicalEquation = extractChemicalEquation(explanation) || extractChemicalEquation(question.question);
  return {
    subject: 'chemistry',
    chemicalEquation,
    reactionReasoning: explanation,
    stoichiometryOrConcept: extractStoichiometryConcept(explanation, question.topic),
    examinerWarning: pitfall,
    isDetailedAvailable: true,
    notes: chemicalEquation
      ? undefined
      : 'Reaction principles and condition subtleties are detailed in the board explanation above.',
  };
}

/**
 * Extracts candidate formulas from text (e.g. E = -dV/dr, V = IR, F = qvB)
 */
function extractFormulaFromText(text: string): string | undefined {
  const match = text.match(/(?:[A-Za-zΔλνεμσπερΦθΩ]+(?:\s*=\s*)[A-Za-z0-9\s\+\-\*\/\^\(\)\.\√]+)/);
  if (match && match[0].length >= 5 && match[0].length <= 50) {
    return match[0].trim();
  }
  return undefined;
}

/**
 * Extracts numeric substitutions with SI units
 */
function extractSubstitutionsFromText(text: string): string | undefined {
  const matches = text.match(/(?:substitut(?:ing|ion)|putting|we get|where)\s*[:=]?\s*([^.]+?\b(?:v|a|j|n|c|m|ω|hz|t|kg|s)\b[^.]+)/i);
  if (matches && matches[1]) {
    return matches[1].trim();
  }
  return undefined;
}

/**
 * Extracts chemical equations like A + B -> C or [Fe(CN)6]4-
 */
function extractChemicalEquation(text: string): string | undefined {
  const eqMatch = text.match(/[A-Z][a-z0-9\(\)\[\]\+\-]*\s*(?:\+\s*[A-Z][a-z0-9\(\)\[\]\+\-]*\s*)*\s*(?:->|→|⇌|==)\s*[A-Z][a-z0-9\(\)\[\]\+\-]*(\s*\+\s*[A-Z][a-z0-9\(\)\[\]\+\-]*)*/);
  if (eqMatch) {
    return eqMatch[0].trim();
  }
  return undefined;
}

/**
 * Extracts stoichiometry or concept snippet
 */
function extractStoichiometryConcept(text: string, topic: string): string {
  const sent = text.split('.').find(s =>
    /mole|molar|stoichiometr|oxidation|electrochemical|rate|activation|hybridization|isomer/i.test(s)
  );
  if (sent && sent.trim().length > 10) {
    return sent.trim() + '.';
  }
  return `Tested concept in ${topic}: verify reaction conditions and balance.`;
}

/**
 * Generates a short, high-yield board revision tip.
 */
export function getRevisionTip(question: Question, category: MistakeCategory): string {
  if (question.boardTip && question.boardTip.trim().length > 15) {
    return question.boardTip.trim();
  }

  const subj = (question.subject || '').toLowerCase();

  switch (category) {
    case 'Unit or sign error':
      return subj === 'physics'
        ? 'Always convert all quantities to standard SI units (e.g. cm → m, mA → A) before substituting into the equation.'
        : 'Write out the negative sign explicitly in your working margin to prevent sign inversion traps.';

    case 'Calculation error':
      return subj === 'mathematics'
        ? 'Re-calculate arithmetic on rough paper; verify fractional roots and sign distribution before picking your option.'
        : 'Perform a quick order-of-magnitude estimation to verify decimal placement before selecting your answer.';

    case 'Formula selection':
      return 'State the governing formula and its boundary conditions before plugging in values (e.g. series vs parallel rules).';

    case 'Incorrect factual understanding':
      return 'Review the corresponding NCERT chapter summary table and definitions to lock in accurate recall for direct board MCQs.';

    case 'Conceptual misunderstanding':
      return 'Focus on physical interpretation and underlying assumptions rather than rote formula memorization.';

    case 'Needs further review':
    case 'Review this concept':
    default:
      if (subj === 'mathematics') {
        return 'Review NCERT textbook solved examples for this chapter and practice 3-5 similar numerical problems.';
      }
      if (subj === 'physics') {
        return 'Re-read the NCERT theory section on this topic and sketch a clear field or circuit diagram.';
      }
      return 'Review the reaction conditions, catalyst requirements, and NCERT in-text questions for this topic.';
  }
}

/**
 * Generates a revision recommendation summarizing the quiz attempt.
 */
export function generateRevisionRecommendation(
  subject: string,
  accuracy: number,
  weakTopics: string[]
): string {
  const subjName = subject.charAt(0).toUpperCase() + subject.slice(1);

  if (accuracy === 100) {
    return `Flawless mastery in CBSE Class 12 ${subjName}! All tested concepts were answered with 100% precision. Continue practicing with full-length timed mock tests.`;
  }

  if (weakTopics.length > 0) {
    const topicList = weakTopics.slice(0, 3).join(', ');
    if (accuracy >= 75) {
      return `Solid foundational clarity. Strengthen high-yield accuracy by reviewing ${topicList} in the NCERT Class 12 textbook before your next test.`;
    }
    return `Priority revision needed for: ${topicList}. Focus on understanding core definitions, working through NCERT exemplar problems, and noting common examiner traps.`;
  }

  if (accuracy >= 80) {
    return `Strong overall performance in ${subjName}. Review the specific mistake breakdown cards below to eliminate remaining board exam pitfalls.`;
  }

  return `Work through the Mistake Detective cards below to identify whether errors were conceptual or calculation-based, then try the targeted similar questions.`;
}

/**
 * Produces a complete Mistake Diagnostic Summary for a quiz attempt locally.
 * Zero external API calls required.
 */
export function computeMistakeDetectiveSummary(attempt: QuizAttempt): MistakeSummary {
  const mistakes: MistakeDetail[] = [];
  const categoryCounts: Record<string, number> = {
    'Conceptual misunderstanding': 0,
    'Calculation error': 0,
    'Formula selection': 0,
    'Unit or sign error': 0,
    'Incorrect factual understanding': 0,
    'Review this concept': 0,
  };

  const topicsWithMistakesSet = new Set<string>();

  attempt.questions.forEach((q, idx) => {
    const selected = attempt.userAnswers[q.id] || '';
    const isCorrect = selected === q.correctAnswer;

    if (!isCorrect) {
      const category = classifyMistake(q, selected);
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;

      if (q.topic) {
        topicsWithMistakesSet.add(q.topic);
      }

      const revisionTip = getRevisionTip(q, category);
      const subjectBreakdown = getSubjectSpecificBreakdown(q);

      mistakes.push({
        questionNumber: idx + 1,
        question: q,
        selectedAnswer: selected || '(Unanswered)',
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        topic: q.topic || 'Core Syllabus Concept',
        category,
        categoryBadge: category,
        revisionTip,
        subjectBreakdown,
      });
    }
  });

  const topicsWithMistakes = Array.from(topicsWithMistakesSet);
  const revisionRecommendation = generateRevisionRecommendation(
    attempt.quizConfig.subject,
    attempt.accuracy,
    topicsWithMistakes.length > 0 ? topicsWithMistakes : attempt.weakTopics
  );

  return {
    totalQuestions: attempt.totalQuestions,
    correctCount: attempt.score,
    incorrectCount: attempt.totalQuestions - attempt.score,
    score: attempt.score,
    accuracy: attempt.accuracy,
    mistakes,
    topicsWithMistakes,
    categoryCounts,
    revisionRecommendation,
  };
}
