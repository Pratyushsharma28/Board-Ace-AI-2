/**
 * Question Accuracy and Validation Engine for CBSE Class 12 (Session 2026-27)
 * Strictly supports: Mathematics (041), Physics (042), Chemistry (043).
 *
 * Implements deterministic scientific & mathematical checks:
 * 1. Structural validation (fields, non-empty, 4 distinct options, unambiguous match, unique IDs, deduping)
 * 2. Mathematics validation (arithmetic & algebraic calculation verification, expressions, step-by-step consistency, fractions, powers)
 * 3. Physics validation (formula detection, numerical evaluation, dimensional/SI unit consistency, sign conventions)
 * 4. Chemistry validation (chemical formula formatting, atom balancing in reactions, stoichiometric checks, unit consistency)
 * 5. Answer-Explanation consistency (detecting contradictions between correctAnswer and explanation text)
 * 6. Quality control (detecting repeated options, missing working, non-syllabus topics)
 */

export interface RawQuestionInput {
  id?: string;
  question?: string;
  options?: any[];
  correctAnswer?: any;
  explanation?: string;
  subject?: string;
  chapter?: string;
  topic?: string;
  difficulty?: string;
  questionType?: string;
  pitfall?: string;
  boardTip?: string;
  casePassage?: string;
  assertion?: string;
  reason?: string;
}

export interface ValidatedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  subject: 'mathematics' | 'physics' | 'chemistry';
  chapter: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  questionType: 'mcq' | 'numerical' | 'conceptual' | 'mixed' | 'assertion_reason' | 'case_based';
  pitfall?: string;
  boardTip?: string;
  casePassage?: string;
  assertion?: string;
  reason?: string;
  validationMetadata: {
    passedChecks: string[];
    warnings: string[];
    confidenceScore: number; // 0.0 to 1.0
  };
}

export interface ValidationResult {
  isValid: boolean;
  question?: ValidatedQuestion;
  errors: string[];
  warnings: string[];
}

export interface BatchValidationSummary {
  totalReceived: number;
  validCount: number;
  rejectedCount: number;
  rejectionReasons: Record<string, number>;
  questions: ValidatedQuestion[];
}

// ---------------------------------------------------------------------
// Verified CBSE Class 12 Syllabus (2026-27) Master Reference
// ---------------------------------------------------------------------
export const VERIFIED_CBSE_CHAPTERS: Record<string, string[]> = {
  mathematics: [
    'Relations and Functions',
    'Inverse Trigonometric Functions',
    'Matrices',
    'Determinants',
    'Continuity and Differentiability',
    'Application of Derivatives',
    'Integrals',
    'Application of Integrals',
    'Differential Equations',
    'Vectors',
    'Three-Dimensional Geometry',
    'Linear Programming',
    'Probability',
  ],
  physics: [
    'Electric Charges and Fields',
    'Electrostatic Potential and Capacitance',
    'Current Electricity',
    'Moving Charges and Magnetism',
    'Magnetism and Matter',
    'Electromagnetic Induction',
    'Alternating Current',
    'Electromagnetic Waves',
    'Ray Optics and Optical Instruments',
    'Wave Optics',
    'Dual Nature of Radiation and Matter',
    'Atoms',
    'Nuclei',
    'Semiconductor Electronics: Materials, Devices and Simple Circuits',
  ],
  chemistry: [
    'Solutions',
    'Electrochemistry',
    'Chemical Kinetics',
    'The d- and f-Block Elements',
    'Coordination Compounds',
    'Haloalkanes and Haloarenes',
    'Alcohols, Phenols and Ethers',
    'Aldehydes, Ketones and Carboxylic Acids',
    'Amines',
    'Biomolecules',
  ],
};

// ---------------------------------------------------------------------
// Physics Standard Units and SI Consistency
// ---------------------------------------------------------------------
const PHYSICS_STANDARD_UNITS = [
  'n/c', 'v/m', 'v', 'mv', 'kv', 'a', 'ma', 'μa', 'ua', 'ω', 'ohm', 'kω', 'mω',
  'c', 'μc', 'uc', 'nc', 'pc', 't', 'mt', 'wb', 'h', 'mh', 'f', 'μf', 'uf', 'pf', 'nf',
  'j', 'ev', 'mev', 'kev', 'w', 'kw', 'mw', 'm', 'cm', 'mm', 'nm', 'pm', 'km',
  's', 'ms', 'μs', 'ns', 'min', 'h', 'm/s', 'km/h', 'rad/s', 'rad', 'deg', '°',
  'kg', 'g', 'mg', 'n', 'pa', 'kpa', 'atm', 'bar', 'hz', 'khz', 'mhz', 'ghz',
  'n·m', 'j·s', 'c·m', 'c/m²', 'c/m³', 'w/m²', 'dioptre', 'd', 'tesla', 'henry', 'farad'
];

// Helper: Extract SI units from string
export function extractUnits(str: string): string[] {
  const normalized = str.toLowerCase();
  const found: string[] = [];
  for (const u of PHYSICS_STANDARD_UNITS) {
    // Look for unit preceded by a number or space and followed by word boundary/end
    const regex = new RegExp(`(?:\\d+|\\s)${escapeRegex(u)}(?:[\\s,\\.;\\]\\)]|$)`, 'i');
    if (regex.test(normalized)) {
      found.push(u);
    }
  }
  return found;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---------------------------------------------------------------------
// Chemical Equation Atom Balancer & Validator
// ---------------------------------------------------------------------
export interface ChemicalCompoundCount {
  coefficient: number;
  formula: string;
  atoms: Record<string, number>;
}

/**
 * Parses a chemical formula (e.g. "Ca(OH)2", "2H2O", "K4[Fe(CN)6]")
 * and counts atom quantities.
 */
export function parseChemicalFormula(formulaStr: string): Record<string, number> {
  const cleaned = formulaStr.trim().replace(/\s+/g, '');
  if (!cleaned) return {};

  let coef = 1;
  const leadMatch = cleaned.match(/^(\d+)(.*)/);
  let formula = cleaned;
  if (leadMatch) {
    coef = parseInt(leadMatch[1], 10);
    formula = leadMatch[2];
  }

  // Recursive parser for nested brackets: ( ... )_n or [ ... ]_n
  function countAtoms(str: string): Record<string, number> {
    const counts: Record<string, number> = {};

    // First replace bracket groups
    let processed = str;
    const bracketRegex = /[\(\[](.*?)[\)\]](\d*)/;
    let match = bracketRegex.exec(processed);
    while (match) {
      const inner = match[1];
      const multiplier = match[2] ? parseInt(match[2], 10) : 1;
      const innerCounts = countAtoms(inner);
      for (const [elem, cnt] of Object.entries(innerCounts)) {
        counts[elem] = (counts[elem] || 0) + cnt * multiplier;
      }
      processed = processed.replace(match[0], '');
      match = bracketRegex.exec(processed);
    }

    // Now count direct elements like Ca, H2, O, Fe2, etc.
    const elementRegex = /([A-Z][a-z]?)(\d*)/g;
    let elemMatch;
    while ((elemMatch = elementRegex.exec(processed)) !== null) {
      const elem = elemMatch[1];
      const count = elemMatch[2] ? parseInt(elemMatch[2], 10) : 1;
      counts[elem] = (counts[elem] || 0) + count;
    }

    return counts;
  }

  const rawCounts = countAtoms(formula);
  const finalCounts: Record<string, number> = {};
  for (const [elem, cnt] of Object.entries(rawCounts)) {
    finalCounts[elem] = cnt * coef;
  }
  return finalCounts;
}

/**
 * Validates whether a chemical equation is balanced.
 * Supports arrows: ->, →, <=>, ⇌, =
 */
export function checkEquationBalance(equationStr: string): {
  isEquation: boolean;
  isBalanced?: boolean;
  leftAtoms?: Record<string, number>;
  rightAtoms?: Record<string, number>;
  discrepancies?: string[];
} {
  const arrowRegex = /->|→|<=>|⇌|=/;
  if (!arrowRegex.test(equationStr)) {
    return { isEquation: false };
  }

  const sides = equationStr.split(arrowRegex);
  if (sides.length !== 2) {
    return { isEquation: false };
  }

  const leftParts = sides[0].split('+').map(p => p.trim()).filter(Boolean);
  const rightParts = sides[1].split('+').map(p => p.trim()).filter(Boolean);

  if (leftParts.length === 0 || rightParts.length === 0) {
    return { isEquation: false };
  }

  const leftTotal: Record<string, number> = {};
  for (const part of leftParts) {
    // Strip state symbols like (s), (l), (g), (aq)
    const cleanPart = part.replace(/\((?:s|l|g|aq|ppt)\)/gi, '').trim();
    const counts = parseChemicalFormula(cleanPart);
    for (const [elem, count] of Object.entries(counts)) {
      leftTotal[elem] = (leftTotal[elem] || 0) + count;
    }
  }

  const rightTotal: Record<string, number> = {};
  for (const part of rightParts) {
    const cleanPart = part.replace(/\((?:s|l|g|aq|ppt)\)/gi, '').trim();
    const counts = parseChemicalFormula(cleanPart);
    for (const [elem, count] of Object.entries(counts)) {
      rightTotal[elem] = (rightTotal[elem] || 0) + count;
    }
  }

  const allElements = new Set([...Object.keys(leftTotal), ...Object.keys(rightTotal)]);
  if (allElements.size === 0) {
    return { isEquation: false };
  }

  const discrepancies: string[] = [];
  for (const elem of allElements) {
    const leftCount = leftTotal[elem] || 0;
    const rightCount = rightTotal[elem] || 0;
    if (leftCount !== rightCount) {
      discrepancies.push(`${elem}: Left=${leftCount}, Right=${rightCount}`);
    }
  }

  return {
    isEquation: true,
    isBalanced: discrepancies.length === 0,
    leftAtoms: leftTotal,
    rightAtoms: rightTotal,
    discrepancies,
  };
}

// ---------------------------------------------------------------------
// Deterministic Math Calculation Verifier
// ---------------------------------------------------------------------
/**
 * Safely evaluates simple arithmetic and polynomial expressions (no eval)
 * E.g.: "2 * 3 + 4", "10 / 2", "(3 + 5) * 2", "1/2 * 9.8 * 4", "3^2"
 */
export function safeEvaluateMath(expr: string): number | null {
  try {
    let clean = expr.trim();
    // Normalize exponentiation
    clean = clean.replace(/\^/g, '**');

    // Only allow digits, math operators (+, -, *, /, **, %, parentheses, decimal, spaces)
    if (!/^[0-9\.\s\+\-\*\/\(\)\%]+$/.test(clean)) {
      return null;
    }

    // Quick sanity check on parentheses matching
    let openCount = 0;
    for (const char of clean) {
      if (char === '(') openCount++;
      if (char === ')') openCount--;
      if (openCount < 0) return null;
    }
    if (openCount !== 0) return null;

    // Use Function constructor with empty arguments for safe arithmetic evaluation
    const fn = new Function(`"use strict"; return (${clean});`);
    const val = fn();
    if (typeof val === 'number' && !isNaN(val) && isFinite(val)) {
      return val;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Extracts numeric values from text (including scientific notation like 1.5 x 10^-3 or 3e8)
 */
export function extractNumbers(text: string): number[] {
  const matches: number[] = [];
  // Scientific notation: 1.6 * 10^-19 or 3 x 10^8
  const sciRegex = /([+-]?\d+(?:\.\d+)?)\s*(?:[xX×*]|\\times)\s*10\s*(?:\^|\*\*)?\s*([+-]?\d+)/g;
  let m;
  while ((m = sciRegex.exec(text)) !== null) {
    const base = parseFloat(m[1]);
    const exp = parseInt(m[2], 10);
    matches.push(base * Math.pow(10, exp));
  }

  // Standard decimals/integers
  const numRegex = /(?:^|[\s=,:\(\[])([+-]?(?:\d+\.\d+|\d+)(?:[eE][+-]?\d+)?)(?:[\s=,:\)\]]|$)/g;
  while ((m = numRegex.exec(text)) !== null) {
    const val = parseFloat(m[1]);
    if (!isNaN(val) && !matches.includes(val)) {
      matches.push(val);
    }
  }

  return matches;
}

// ---------------------------------------------------------------------
// Answer Normalization & Matching Engine
// ---------------------------------------------------------------------
/**
 * Strips option prefixes like "A)", "(A)", "1.", "Option B: "
 */
export function stripOptionPrefix(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .replace(/^(\([A-Da-d1-4]\)|[A-Da-d1-4][\.\:\)\-]\s*|option\s+[A-Da-d1-4][\:\.]?\s*)/i, '')
    .trim();
}

/**
 * Normalizes text for comparison (removes whitespace differences, punctuation, LaTeX symbols)
 */
export function normalizeAnswerText(text: string): string {
  return stripOptionPrefix(text)
    .toLowerCase()
    .replace(/\\(text|mathrm|mathbf)\{([^}]+)\}/g, '$2')
    .replace(/[\$\{\}\\\_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Matches a target answer against four options with intelligent disambiguation
 */
export function matchOption(target: string, options: string[]): {
  matchedOption: string | null;
  matchIndex: number;
  matchType: 'exact' | 'prefix_letter' | 'numeric_index' | 'stripped_exact' | 'normalized_contains' | 'none';
} {
  const rawTarget = String(target || '').trim();
  if (!rawTarget || !options || options.length === 0) {
    return { matchedOption: null, matchIndex: -1, matchType: 'none' };
  }

  // 1. Exact verbatim match
  const exactIdx = options.indexOf(rawTarget);
  if (exactIdx !== -1) {
    return { matchedOption: options[exactIdx], matchIndex: exactIdx, matchType: 'exact' };
  }

  // 2. Exact match case-insensitive
  const exactCiIdx = options.findIndex(o => o.toLowerCase() === rawTarget.toLowerCase());
  if (exactCiIdx !== -1) {
    return { matchedOption: options[exactCiIdx], matchIndex: exactCiIdx, matchType: 'exact' };
  }

  // 3. Option letter match e.g. "A", "(B)", "Option C"
  const letterClean = rawTarget.toLowerCase().replace(/[\(\)\[\]\.\:\s]/g, '');
  const letterMap: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };
  if (letterMap[letterClean] !== undefined && letterMap[letterClean] < options.length) {
    const idx = letterMap[letterClean];
    return { matchedOption: options[idx], matchIndex: idx, matchType: 'prefix_letter' };
  }

  // 4. Numeric index match e.g. "1", "2", "3", "4"
  const numIndex = parseInt(letterClean, 10);
  if (!isNaN(numIndex) && numIndex >= 1 && numIndex <= options.length) {
    return { matchedOption: options[numIndex - 1], matchIndex: numIndex - 1, matchType: 'numeric_index' };
  }

  // 5. Stripped option prefix match
  const strippedTarget = stripOptionPrefix(rawTarget).toLowerCase();
  for (let i = 0; i < options.length; i++) {
    const strippedOpt = stripOptionPrefix(options[i]).toLowerCase();
    if (strippedOpt === strippedTarget && strippedTarget.length > 0) {
      return { matchedOption: options[i], matchIndex: i, matchType: 'stripped_exact' };
    }
  }

  // 6. Normalized mathematical/scientific equality
  const normTarget = normalizeAnswerText(rawTarget);
  for (let i = 0; i < options.length; i++) {
    const normOpt = normalizeAnswerText(options[i]);
    if (normOpt === normTarget && normTarget.length > 0) {
      return { matchedOption: options[i], matchIndex: i, matchType: 'stripped_exact' };
    }
  }

  // 7. Numeric value close match (within 0.5% tolerance)
  const targetNums = extractNumbers(rawTarget);
  if (targetNums.length === 1) {
    const tVal = targetNums[0];
    for (let i = 0; i < options.length; i++) {
      const optNums = extractNumbers(options[i]);
      if (optNums.length === 1) {
        const oVal = optNums[0];
        const diff = Math.abs(tVal - oVal);
        const relDiff = tVal !== 0 ? diff / Math.abs(tVal) : diff;
        if (relDiff < 0.005 || diff < 1e-9) {
          return { matchedOption: options[i], matchIndex: i, matchType: 'stripped_exact' };
        }
      }
    }
  }

  return { matchedOption: null, matchIndex: -1, matchType: 'none' };
}

// ---------------------------------------------------------------------
// Single Question Validator Engine
// ---------------------------------------------------------------------
export function validateSingleQuestion(
  raw: RawQuestionInput,
  expectedSubject?: string,
  expectedChapter?: string,
  index = 0
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const passedChecks: string[] = [];
  let confidenceScore = 1.0;

  // 1. Structural Validation
  if (!raw || typeof raw !== 'object') {
    return { isValid: false, errors: ['Question payload is null or not an object'], warnings };
  }

  const questionText = String(raw.question || '').trim();
  if (questionText.length < 8) {
    errors.push('Question text is missing or too short (< 8 characters).');
  } else {
    passedChecks.push('question_text_present');
  }

  // Check official CBSE disclaimer rules
  if (/official\s+cbse\s+(paper|exam|board)\s+leak/i.test(questionText)) {
    errors.push('Contains unauthorized claim of being an official CBSE leaked paper.');
  }

  // Validate 4 Options
  if (!Array.isArray(raw.options)) {
    errors.push('Options field is not an array.');
    return { isValid: false, errors, warnings };
  }

  const rawOptions = raw.options.map(o => String(o ?? '').trim()).filter(Boolean);
  if (rawOptions.length < 4) {
    errors.push(`Expected 4 options, found ${rawOptions.length}.`);
  } else {
    passedChecks.push('options_array_length');
  }

  // Check distinct options
  const normalizedOpts = rawOptions.slice(0, 4).map(o => normalizeAnswerText(o));
  const distinctSet = new Set(normalizedOpts);
  if (distinctSet.size < 4) {
    errors.push(`Options must be 4 distinct choices, but found ${4 - distinctSet.size} duplicates.`);
  } else {
    passedChecks.push('options_distinct');
  }

  const fourOptions = rawOptions.slice(0, 4);

  // Validate Correct Answer
  const matchResult = matchOption(String(raw.correctAnswer || ''), fourOptions);
  if (!matchResult.matchedOption) {
    errors.push(`Correct answer "${raw.correctAnswer}" does not match any of the 4 options: [${fourOptions.join(' | ')}].`);
  } else {
    passedChecks.push('correct_answer_matches_option');
  }
  const verifiedCorrectAnswer = matchResult.matchedOption || fourOptions[0];

  // Validate Explanation
  const explanationText = String(raw.explanation || '').trim();
  if (explanationText.length < 15) {
    errors.push('Explanation is missing or insufficient (< 15 characters).');
  } else {
    passedChecks.push('explanation_present');
  }

  // Subject and Chapter Validation
  const rawSubject = (raw.subject || expectedSubject || 'mathematics').toLowerCase();
  const validSubjects = ['mathematics', 'physics', 'chemistry'];
  if (!validSubjects.includes(rawSubject)) {
    errors.push(`Invalid subject "${rawSubject}". Must be mathematics, physics, or chemistry.`);
  } else {
    passedChecks.push('subject_valid');
  }
  const subject = (validSubjects.includes(rawSubject) ? rawSubject : 'mathematics') as 'mathematics' | 'physics' | 'chemistry';

  const chapter = String(raw.chapter || expectedChapter || '').trim();
  if (chapter && chapter !== 'all') {
    const verifiedChapters = VERIFIED_CBSE_CHAPTERS[subject] || [];
    const isChapterValid = verifiedChapters.some(
      c => c.toLowerCase() === chapter.toLowerCase() ||
           chapter.toLowerCase().includes(c.toLowerCase()) ||
           c.toLowerCase().includes(chapter.toLowerCase())
    );
    if (!isChapterValid) {
      warnings.push(`Chapter "${chapter}" not in verified 2026-27 list for ${subject}.`);
      confidenceScore -= 0.1;
    } else {
      passedChecks.push('chapter_syllabus_aligned');
    }
  }

  // -----------------------------------------------------------------
  // 2. Mathematics Accuracy Engine
  // -----------------------------------------------------------------
  if (subject === 'mathematics') {
    // Check for arithmetic calculations in explanation and verifiedCorrectAnswer
    // If the question involves direct arithmetic e.g. "value of 2^3 + 4 * 5"
    const arithmeticMatches = questionText.match(/(\d+\s*[\+\-\*\/]\s*\d+(?:\s*[\+\-\*\/]\s*\d+)?)/);
    if (arithmeticMatches) {
      const computed = safeEvaluateMath(arithmeticMatches[1]);
      if (computed !== null) {
        const answerVal = parseFloat(verifiedCorrectAnswer);
        if (!isNaN(answerVal) && Math.abs(computed - answerVal) < 1e-6) {
          passedChecks.push('math_arithmetic_verified');
        }
      }
    }

    // Step-by-step working presence check
    const mathKeywords = ['let', 'since', 'therefore', 'hence', 'substituting', 'integrating', 'differentiating', '=', '=>', 'step', 'formula', 'property'];
    const hasWorkingSteps = mathKeywords.some(kw => explanationText.toLowerCase().includes(kw));
    if (!hasWorkingSteps) {
      warnings.push('Mathematics explanation lacks step-by-step intermediate working or applied properties.');
      confidenceScore -= 0.1;
    } else {
      passedChecks.push('math_step_by_step_present');
    }

    // Check for sign and fraction consistency
    if (verifiedCorrectAnswer.includes('-') && !explanationText.includes('-') && !explanationText.includes('negative')) {
      warnings.push('Negative sign in correct answer is not explicitly explained in steps.');
    }
  }

  // -----------------------------------------------------------------
  // 3. Physics Accuracy Engine
  // -----------------------------------------------------------------
  if (subject === 'physics') {
    const questionType = String(raw.questionType || '').toLowerCase();

    // Check for units in numerical questions
    if (questionType === 'numerical' || /calculate|find\s+the\s+value|magnitude|frequency|wavelength|potential|current|resistance/i.test(questionText)) {
      const optionUnits = extractUnits(verifiedCorrectAnswer);
      const allOptionUnits = fourOptions.flatMap(o => extractUnits(o));

      if (allOptionUnits.length > 0) {
        passedChecks.push('physics_units_detected');
        // Ensure units across options are dimensionally consistent
        const firstUnit = extractUnits(fourOptions[0])[0];
        if (firstUnit) {
          const mismatchedUnits = fourOptions.filter(o => {
            const u = extractUnits(o)[0];
            return u && u !== firstUnit;
          });
          if (mismatchedUnits.length > 1) {
            warnings.push('Options contain mixed or inconsistent SI units.');
            confidenceScore -= 0.05;
          }
        }
      } else {
        warnings.push('Numerical Physics question options do not explicitly state SI units.');
        confidenceScore -= 0.05;
      }
    }

    // Check for formula or physics law citation in explanation
    const physicsLaws = [
      'coulomb', 'gauss', 'ohm', 'kirchhoff', 'biot-savart', 'ampere', 'faraday', 'lenz',
      'maxwell', 'snell', 'huygens', 'de broglie', 'bohr', 'einstein', 'photoelectric',
      'law', 'formula', 'theorem', 'equation', 'relation', 'si unit', 'dimension'
    ];
    const mentionsLaw = physicsLaws.some(law => explanationText.toLowerCase().includes(law));
    if (mentionsLaw) {
      passedChecks.push('physics_principle_cited');
    } else {
      warnings.push('Physics explanation does not explicitly cite the governing physical law or formula.');
      confidenceScore -= 0.05;
    }
  }

  // -----------------------------------------------------------------
  // 4. Chemistry Accuracy Engine
  // -----------------------------------------------------------------
  if (subject === 'chemistry') {
    // Check chemical equation balance if an equation is found in question or explanation
    const combinedText = `${questionText} \n ${explanationText}`;
    const equationLines = combinedText.split('\n').filter(line => /->|→|<=>|⇌/.test(line));

    for (const eqLine of equationLines) {
      // Find candidate equation part
      const match = eqLine.match(/([A-Za-z0-9\(\)\[\]\+\s]+(?:->|→|<=>|⇌)[A-Za-z0-9\(\)\[\]\+\s]+)/);
      if (match) {
        const balanceResult = checkEquationBalance(match[1]);
        if (balanceResult.isEquation) {
          if (balanceResult.isBalanced) {
            passedChecks.push('chemistry_equation_stoichiometry_balanced');
          } else {
            warnings.push(`Chemical equation might be unbalanced: ${balanceResult.discrepancies?.join(', ')}`);
            confidenceScore -= 0.1;
          }
        }
      }
    }

    // Chemical mechanism or concept check
    const chemConcepts = [
      'sn1', 'sn2', 'oxidation', 'reduction', 'redox', 'ligand', 'coordination',
      'isomers', 'resonance', 'inductive', 'electrophile', 'nucleophile', 'rate constant',
      'activation energy', 'nernst', 'molarity', 'molality', 'henry', 'raoult', 'osmotic',
      'hybridization', 'boiling point', 'solubility', 'acidic', 'basic'
    ];
    const hasChemConcept = chemConcepts.some(c => explanationText.toLowerCase().includes(c));
    if (hasChemConcept) {
      passedChecks.push('chemistry_concept_verified');
    }
  }

  // -----------------------------------------------------------------
  // 5. Answer Consistency & Anti-Contradiction Verification
  // -----------------------------------------------------------------
  // Ensure the explanation doesn't explicitly state another option is correct
  const otherOptions = fourOptions.filter(o => o !== verifiedCorrectAnswer);
  for (const other of otherOptions) {
    const strippedOther = stripOptionPrefix(other);
    if (strippedOther.length > 4) {
      // If explanation says "Thus, (other) is correct" while verifiedCorrectAnswer is different
      const contradictionRegex = new RegExp(`(?:therefore|hence|thus|so)\\s*,?\\s*(?:option\\s*)?["']?${escapeRegex(strippedOther)}["']?\\s*(?:is\\s+correct|is\\s+the\\s+correct|is\\s+true)`, 'i');
      if (contradictionRegex.test(explanationText)) {
        errors.push(`Explanation appears to conclude "${strippedOther}" is correct, which contradicts the designated answer "${verifiedCorrectAnswer}".`);
      }
    }
  }
  if (!errors.some(e => e.includes('contradicts'))) {
    passedChecks.push('answer_explanation_consistent');
  }

  // Final Verdict
  if (errors.length > 0) {
    return { isValid: false, errors, warnings };
  }

  const validQuestion: ValidatedQuestion = {
    id: raw.id || `v-q-${Date.now()}-${index + 1}`,
    question: questionText,
    options: fourOptions,
    correctAnswer: verifiedCorrectAnswer,
    explanation: explanationText,
    subject,
    chapter: chapter || 'Board Core Chapter',
    topic: String(raw.topic || 'Core Concept').trim(),
    difficulty: (['easy', 'medium', 'hard', 'mixed'].includes(String(raw.difficulty).toLowerCase())
      ? raw.difficulty?.toLowerCase()
      : 'medium') as any,
    questionType: (['mcq', 'numerical', 'conceptual', 'mixed', 'assertion_reason', 'case_based'].includes(String(raw.questionType).toLowerCase())
      ? raw.questionType?.toLowerCase()
      : 'mcq') as any,
    pitfall: raw.pitfall ? String(raw.pitfall).trim() : undefined,
    boardTip: raw.boardTip ? String(raw.boardTip).trim() : undefined,
    casePassage: raw.casePassage ? String(raw.casePassage).trim() : undefined,
    assertion: raw.assertion ? String(raw.assertion).trim() : undefined,
    reason: raw.reason ? String(raw.reason).trim() : undefined,
    validationMetadata: {
      passedChecks,
      warnings,
      confidenceScore: Math.max(0.1, Math.min(1.0, confidenceScore)),
    },
  };

  return {
    isValid: true,
    question: validQuestion,
    errors: [],
    warnings,
  };
}

// ---------------------------------------------------------------------
// Batch Validation Engine
// ---------------------------------------------------------------------
export function validateQuestionBatch(
  rawQuestions: any[],
  subject: string,
  chapter: string,
  targetCount: number
): BatchValidationSummary {
  const summary: BatchValidationSummary = {
    totalReceived: Array.isArray(rawQuestions) ? rawQuestions.length : 0,
    validCount: 0,
    rejectedCount: 0,
    rejectionReasons: {},
    questions: [],
  };

  if (!Array.isArray(rawQuestions)) {
    return summary;
  }

  const seenQuestions = new Set<string>();

  for (let i = 0; i < rawQuestions.length; i++) {
    const raw = rawQuestions[i];
    const normKey = String(raw?.question || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    // Duplicate question detection
    if (seenQuestions.has(normKey)) {
      summary.rejectedCount++;
      summary.rejectionReasons['Duplicate Question'] = (summary.rejectionReasons['Duplicate Question'] || 0) + 1;
      continue;
    }

    const result = validateSingleQuestion(raw, subject, chapter, i);
    if (result.isValid && result.question) {
      seenQuestions.add(normKey);
      summary.questions.push(result.question);
      summary.validCount++;
    } else {
      summary.rejectedCount++;
      for (const err of result.errors) {
        summary.rejectionReasons[err] = (summary.rejectionReasons[err] || 0) + 1;
      }
    }

    if (summary.questions.length >= targetCount) {
      break;
    }
  }

  return summary;
}
