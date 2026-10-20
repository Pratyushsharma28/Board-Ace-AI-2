import { QuizAttempt, Question, SubjectId, DifficultyLevel, SmartPracticeRecommendation, GradeClass, StreamType } from '../types/quiz';
import { getSubjectsForGrade } from '../data/syllabus';
import { CURATED_BOARD_QUESTIONS } from '../data/sampleQuestions';
import { getSavedAttempts } from './storage';

export interface StudentTopicPerformance {
  topic: string;
  chapter: string;
  subject: SubjectId;
  attempted: number;
  correct: number;
  incorrect: number;
  accuracy: number | null;
  consecutiveMistakes: number;
  lastAttemptedDate?: string;
  historicalAccuracy: number[]; // accuracy in last chronological attempts
}

export interface SmartPracticePreferences {
  targetSubject: 'all' | SubjectId;
  preferredDifficulty: 'adaptive' | 'easy' | 'medium' | 'hard';
  autoStepUp: boolean; // Gradually recommend harder questions when student demonstrates improved understanding
}

const SMART_PREFERENCES_KEY = 'boardace_smart_practice_prefs_v1';

export function getSmartPracticePreferences(grade: GradeClass = '12', stream: StreamType = 'science'): SmartPracticePreferences {
  try {
    const key = `boardace_smart_practice_prefs_${grade}_${grade === '12' ? stream : 'general'}_v1`;
    let raw = localStorage.getItem(key);
    if (!raw) {
      raw = localStorage.getItem(SMART_PREFERENCES_KEY);
    }
    if (!raw) {
      return {
        targetSubject: 'all',
        preferredDifficulty: 'adaptive',
        autoStepUp: true,
      };
    }
    const parsed = JSON.parse(raw);
    const validSubs = getSubjectsForGrade(grade, stream).map(s => s.id);
    if (parsed.targetSubject !== 'all' && !validSubs.includes(parsed.targetSubject)) {
      parsed.targetSubject = 'all';
    }
    return parsed;
  } catch (e) {
    return {
      targetSubject: 'all',
      preferredDifficulty: 'adaptive',
      autoStepUp: true,
    };
  }
}

export function saveSmartPracticePreferences(
  prefs: SmartPracticePreferences,
  grade: GradeClass = '12',
  stream: StreamType = 'science'
): void {
  try {
    const key = `boardace_smart_practice_prefs_${grade}_${grade === '12' ? stream : 'general'}_v1`;
    localStorage.setItem(key, JSON.stringify(prefs));
    localStorage.setItem(SMART_PREFERENCES_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save smart practice preferences', e);
  }
}

/**
 * Analyzes real quiz attempts, incorrect answers, accuracy, and chapter-wise performance.
 * Does not fabricate data.
 */
export function analyzeStudentPerformance(
  attempts: QuizAttempt[] = getSavedAttempts(),
  grade: GradeClass = '12',
  stream: StreamType = 'science'
): {
  topicPerformances: Record<string, StudentTopicPerformance>;
  chapterAccuracy: Record<string, { subject: SubjectId; total: number; correct: number; accuracy: number }>;
  overallAccuracy: number;
  totalQuestionsAnswered: number;
  repeatedMistakesCount: number;
} {
  const topicMap: Record<string, StudentTopicPerformance> = {};
  const chapterMap: Record<string, { subject: SubjectId; total: number; correct: number; accuracy: number }> = {};
  let totalAnswered = 0;
  let totalCorrect = 0;
  let repeatedMistakesCount = 0;

  // Build lookup index from active CBSE Grade/Stream Syllabus
  const activeSubjects = getSubjectsForGrade(grade, stream);
  const activeSubjectIds = new Set(activeSubjects.map(s => s.id));
  activeSubjects.forEach(sub => {
    sub.chapters.forEach(chap => {
      chap.topics.forEach(t => {
        topicMap[t] = {
          topic: t,
          chapter: chap.name,
          subject: sub.id,
          attempted: 0,
          correct: 0,
          incorrect: 0,
          accuracy: null,
          consecutiveMistakes: 0,
          historicalAccuracy: [],
        };
      });
    });
  });

  // Filter attempts strictly by the requested class and stream
  const relevantAttempts = attempts.filter(att => {
    const attGrade = att.quizConfig?.grade || '12';
    if (attGrade !== grade) return false;
    if (grade === '12') {
      const attStream = att.quizConfig?.stream || (
        ['accountancy', 'business_studies', 'economics', 'english_core'].includes(att.quizConfig?.subject || '')
          ? 'commerce'
          : 'science'
      );
      if (attStream !== stream) return false;
    }
    const subId = (att.quizConfig?.subject || '').toLowerCase();
    if (!activeSubjectIds.has(subId as SubjectId)) return false;
    return true;
  });

  // Sort attempts chronologically (oldest to newest) to track improvement and difficulty progression
  const sortedAttempts = [...relevantAttempts].sort(
    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  );

  sortedAttempts.forEach(att => {
    const subId = att.quizConfig.subject;

    // Track chapter performance
    const chapName = att.quizConfig.chapter === 'all' ? 'Mixed Chapters' : att.quizConfig.chapter;
    if (!chapterMap[chapName]) {
      chapterMap[chapName] = { subject: subId, total: 0, correct: 0, accuracy: 0 };
    }

    // Process questions answered in this attempt
    att.questions.forEach(q => {
      const userAnswer = att.userAnswers[q.id];
      if (!userAnswer) return; // unattempted

      totalAnswered += 1;
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) totalCorrect += 1;

      // Update chapter metrics
      chapterMap[chapName].total += 1;
      if (isCorrect) chapterMap[chapName].correct += 1;

      // Match topic
      const topicName = q.topic || 'Core Concept';
      if (!topicMap[topicName]) {
        topicMap[topicName] = {
          topic: topicName,
          chapter: q.chapter || 'Syllabus Chapter',
          subject: subId,
          attempted: 0,
          correct: 0,
          incorrect: 0,
          accuracy: null,
          consecutiveMistakes: 0,
          historicalAccuracy: [],
        };
      }

      const tPerf = topicMap[topicName];
      tPerf.attempted += 1;
      if (isCorrect) {
        tPerf.correct += 1;
        tPerf.consecutiveMistakes = 0;
      } else {
        tPerf.incorrect += 1;
        tPerf.consecutiveMistakes += 1;
      }
      tPerf.lastAttemptedDate = att.completedAt;
    });

    // Record historical accuracy at each attempt milestone
    Object.values(topicMap).forEach(tp => {
      if (tp.attempted > 0) {
        tp.accuracy = Math.round((tp.correct / tp.attempted) * 100);
        tp.historicalAccuracy.push(tp.accuracy);
      }
    });
  });

  // Calculate chapter percentages
  Object.keys(chapterMap).forEach(k => {
    const ch = chapterMap[k];
    ch.accuracy = ch.total > 0 ? Math.round((ch.correct / ch.total) * 100) : 0;
  });

  // Calculate repeated mistakes (consecutive mistakes >= 2 or total incorrect >= 2 with accuracy < 50%)
  Object.values(topicMap).forEach(tp => {
    if (tp.consecutiveMistakes >= 2 || (tp.incorrect >= 2 && (tp.accuracy ?? 100) < 50)) {
      repeatedMistakesCount += 1;
    }
  });

  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return {
    topicPerformances: topicMap,
    chapterAccuracy: chapterMap,
    overallAccuracy,
    totalQuestionsAnswered: totalAnswered,
    repeatedMistakesCount,
  };
}

/**
 * Deterministic Adaptive Recommendation Algorithm:
 * 1. Analyzes real quiz performance.
 * 2. Identifies:
 *    - Topics with repeated mistakes (Requires urgent revision -> Easy/Medium drill with explanations).
 *    - Topics with low accuracy (< 75%) (Requires consolidation -> Medium difficulty).
 *    - Topics with high accuracy (>= 80% with >= 2 attempts) (Mastery demonstrated -> Hard questions to push board rank).
 *    - Unattempted high-weightage topics (Curriculum completeness -> Starter Medium questions).
 * 3. Dynamically pulls matching curated questions from authentic repository.
 */
export function generateSmartRecommendations(
  attempts: QuizAttempt[] = getSavedAttempts(),
  subjectFilterOrOptions: 'all' | SubjectId | { targetSubject?: string; subject?: string; grade?: GradeClass; stream?: StreamType } = 'all',
  gradeArg: GradeClass = '12',
  streamArg: StreamType = 'science'
): SmartPracticeRecommendation[] {
  let subjectFilter: 'all' | SubjectId = 'all';
  let grade: GradeClass = gradeArg;
  let stream: StreamType = streamArg;

  if (typeof subjectFilterOrOptions === 'object' && subjectFilterOrOptions !== null) {
    subjectFilter = (subjectFilterOrOptions.targetSubject || subjectFilterOrOptions.subject || 'all') as any;
    grade = subjectFilterOrOptions.grade || gradeArg;
    stream = subjectFilterOrOptions.stream || streamArg;
  } else {
    subjectFilter = subjectFilterOrOptions as any;
  }

  const { topicPerformances } = analyzeStudentPerformance(attempts, grade, stream);
  const recommendations: SmartPracticeRecommendation[] = [];

  const activeSubjects = getSubjectsForGrade(grade, stream);
  const activeSubjectIds = new Set(activeSubjects.map(s => s.id));

  const topicsList = Object.values(topicPerformances).filter(tp => {
    if (!activeSubjectIds.has(tp.subject)) return false;
    if (subjectFilter === 'all') return true;
    return tp.subject === subjectFilter;
  });

  // 1. REPEATED MISTAKES: Consecutive mistakes >= 2 OR (incorrect >= 2 with accuracy < 50%)
  const repeatedMistakeTopics = topicsList
    .filter(tp => tp.attempted >= 2 && (tp.consecutiveMistakes >= 2 || (tp.accuracy !== null && tp.accuracy < 50)))
    .sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0));

  repeatedMistakeTopics.forEach(tp => {
    // Recommend revision: start with easy or medium questions to rebuild fundamentals
    const targetDifficulty: DifficultyLevel = 'easy';
    const recQuestions = findQuestionsForRecommendation(tp.subject, tp.chapter, tp.topic, targetDifficulty, grade, stream);

    recommendations.push({
      id: `rec-mistake-${tp.subject}-${encodeURIComponent(tp.topic)}`,
      subject: tp.subject,
      chapter: tp.chapter,
      topic: tp.topic,
      targetDifficulty,
      reasonType: 'repeated_mistakes',
      reasonHeadline: `Repeated Mistakes Detected: Revision Recommended`,
      reasonHeadlineHi: `बार-बार गलतियां: बुनियादी दोहराव की सिफारिश`,
      reasonDetail: `You encountered ${tp.incorrect} mistakes in this topic with ${tp.accuracy ?? 0}% accuracy. Step-by-step revision at ${targetDifficulty.toUpperCase()} level is recommended to clear fundamental misconceptions before board exams.`,
      reasonDetailHi: `इस विषय में आपने ${tp.incorrect} गलतियां की हैं (${tp.accuracy ?? 0}% सटीकता)। बोर्ड परीक्षा से पूर्व बुनियादी अवधारणाओं को स्पष्ट करने के लिए ${targetDifficulty.toUpperCase()} स्तर से अभ्यास की सिफारिश की जाती है।`,
      metrics: {
        attempted: tp.attempted,
        correct: tp.correct,
        accuracy: tp.accuracy,
        recentTrend: 'declining',
      },
      recommendedQuestions: recQuestions,
    });
  });

  // 2. LOW ACCURACY TOPICS: Accuracy between 50% and 74%
  const lowAccuracyTopics = topicsList
    .filter(
      tp =>
        tp.attempted >= 2 &&
        tp.accuracy !== null &&
        tp.accuracy >= 50 &&
        tp.accuracy < 75 &&
        !recommendations.some(r => r.topic === tp.topic)
    )
    .sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0));

  lowAccuracyTopics.forEach(tp => {
    const targetDifficulty: DifficultyLevel = 'medium';
    const recQuestions = findQuestionsForRecommendation(tp.subject, tp.chapter, tp.topic, targetDifficulty, grade, stream);

    recommendations.push({
      id: `rec-accuracy-${tp.subject}-${encodeURIComponent(tp.topic)}`,
      subject: tp.subject,
      chapter: tp.chapter,
      topic: tp.topic,
      targetDifficulty,
      reasonType: 'low_accuracy',
      reasonHeadline: `Strengthen Concept: Medium Board Practice`,
      reasonHeadlineHi: `अवधारणा सुदृढ़ीकरण: मध्यम स्तर का अभ्यास`,
      reasonDetail: `Your accuracy is currently ${tp.accuracy}%. Targeted ${targetDifficulty.toUpperCase()} questions will help you convert this topic into a guaranteed 100% scoring area.`,
      reasonDetailHi: `आपकी सटीकता वर्तमान में ${tp.accuracy}% है। लक्षित ${targetDifficulty.toUpperCase()} प्रश्नों से अभ्यास करने पर आप इस अध्याय में पूर्ण अंक प्राप्त कर सकेंगे।`,
      metrics: {
        attempted: tp.attempted,
        correct: tp.correct,
        accuracy: tp.accuracy,
        recentTrend: 'steady',
      },
      recommendedQuestions: recQuestions,
    });
  });

  // 3. MASTERY PROGRESSION (Gradually recommend harder questions)
  // When student demonstrates high understanding (>= 80% accuracy with >= 2 attempts)
  const masteryTopics = topicsList
    .filter(
      tp =>
        tp.attempted >= 2 &&
        tp.accuracy !== null &&
        tp.accuracy >= 80 &&
        !recommendations.some(r => r.topic === tp.topic)
    )
    .sort((a, b) => (b.accuracy ?? 0) - (a.accuracy ?? 0));

  masteryTopics.forEach(tp => {
    const targetDifficulty: DifficultyLevel = 'hard';
    const recQuestions = findQuestionsForRecommendation(tp.subject, tp.chapter, tp.topic, targetDifficulty, grade, stream);

    recommendations.push({
      id: `rec-mastery-${tp.subject}-${encodeURIComponent(tp.topic)}`,
      subject: tp.subject,
      chapter: tp.chapter,
      topic: tp.topic,
      targetDifficulty,
      reasonType: 'mastery_progression',
      reasonHeadline: `Mastery Demonstrated: Step Up to Hard / HOTS`,
      reasonHeadlineHi: `उत्कृष्ट समझ: कठिन (HOTS) स्तर पर आगे बढ़ें`,
      reasonDetail: `Outstanding ${tp.accuracy}% accuracy achieved! Step up to challenging CBSE High-Order Thinking Skills (HOTS) and derivation traps to achieve top rank.`,
      reasonDetailHi: `शानदार ${tp.accuracy}% सटीकता! बोर्ड परीक्षा में उच्चतम अंक हासिल करने के लिए उच्च स्तरीय (HOTS) और कठिन प्रश्नों का अभ्यास करें।`,
      metrics: {
        attempted: tp.attempted,
        correct: tp.correct,
        accuracy: tp.accuracy,
        recentTrend: 'improving',
      },
      recommendedQuestions: recQuestions,
    });
  });

  // 4. UNATTEMPTED OR STARTER TOPICS (Strictly aligned with Class & Stream)
  if (recommendations.length < 3) {
    let highWeightageChaps: Array<{ subject: SubjectId; chapter: string; topic: string; weight: string }> = [];

    if (grade === '10') {
      highWeightageChaps = [
        { subject: 'mathematics', chapter: 'Quadratic Equations', topic: 'Nature of Roots & Discriminant Analysis', weight: '5-6 marks' },
        { subject: 'science', chapter: 'Chemical Reactions and Equations', topic: 'Redox Reactions (Oxidation and Reduction)', weight: '5-6 marks' },
        { subject: 'science', chapter: 'Life Processes', topic: 'Double Circulation of Blood in Human Heart', weight: '6-7 marks' },
        { subject: 'social_science', chapter: 'The Rise of Nationalism in Europe', topic: 'Unification of Germany and Italy', weight: '5 marks' },
        { subject: 'mathematics', chapter: 'Triangles', topic: 'Basic Proportionality Theorem (Thales Theorem)', weight: '6 marks' },
        { subject: 'english', chapter: 'A Letter to God (G.L. Fuentes)', topic: 'Lencho’s Faith and Irony of the Situation', weight: '4-5 marks' },
      ];
    } else if (stream === 'commerce') {
      highWeightageChaps = [
        { subject: 'accountancy', chapter: 'Accounting for Partnership Firms - Fundamentals', topic: 'Interest on Partner Drawings (Average Period Method)', weight: '6-8 marks' },
        { subject: 'business_studies', chapter: 'Principles of Management', topic: 'Unity of Command vs Unity of Direction', weight: '5-6 marks' },
        { subject: 'economics', chapter: 'National Income and Related Aggregates', topic: 'Factor Income vs Transfer Receipts', weight: '6-8 marks' },
        { subject: 'accountancy', chapter: 'Accounting for Share Capital', topic: 'Forfeiture & Maximum Permissible Discount on Reissue', weight: '8 marks' },
        { subject: 'business_studies', chapter: 'Financial Management', topic: 'Trading on Equity & Financial Leverage', weight: '6 marks' },
        { subject: 'economics', chapter: 'Money and Banking', topic: 'Credit Creation & Legal Reserve Ratio', weight: '6 marks' },
        { subject: 'english_core', chapter: 'The Last Lesson', topic: 'M. Hamel’s Speech on the French Language', weight: '5 marks' },
      ];
    } else {
      // Class 12 Science
      highWeightageChaps = [
        { subject: 'mathematics', chapter: 'Matrices', topic: 'Symmetric & Skew-Symmetric Matrices', weight: '5-6 marks' },
        { subject: 'physics', chapter: 'Electric Charges and Fields', topic: "Gauss’s Law and Applications", weight: '7-8 marks' },
        { subject: 'chemistry', chapter: 'Electrochemistry', topic: 'Nernst Equation and Cell Potential Calculations', weight: '7-8 marks' },
        { subject: 'physics', chapter: 'Current Electricity', topic: 'Drift Velocity & Mobility (Ohm’s Law Derivation)', weight: '8-9 marks' },
        { subject: 'mathematics', chapter: 'Continuity and Differentiability', topic: 'Second Order Derivatives', weight: '8-9 marks' },
      ];
    }

    highWeightageChaps.forEach(hw => {
      if (subjectFilter !== 'all' && hw.subject !== subjectFilter) return;
      if (recommendations.some(r => r.topic === hw.topic)) return;

      const tp = topicPerformances[hw.topic];
      const attempted = tp ? tp.attempted : 0;
      if (attempted === 0) {
        const targetDifficulty: DifficultyLevel = 'medium';
        const recQuestions = findQuestionsForRecommendation(hw.subject, hw.chapter, hw.topic, targetDifficulty, grade, stream);

        recommendations.push({
          id: `rec-unattempted-${hw.subject}-${encodeURIComponent(hw.topic)}`,
          subject: hw.subject,
          chapter: hw.chapter,
          topic: hw.topic,
          targetDifficulty,
          reasonType: 'unattempted_high_weightage',
          reasonHeadline: `High-Yield Topic: High Board Weightage (${hw.weight})`,
          reasonHeadlineHi: `महत्वपूर्ण अध्याय: उच्च अंक भार (${hw.weight})`,
          reasonDetail: `This core concept carries significant weightage (${hw.weight}) in the CBSE 2026–27 blueprint. Practice these verified board questions to build immediate coverage.`,
          reasonDetailHi: `यह अध्याय सीबीएसई 2026–27 ब्लूप्रिंट में महत्वपूर्ण अंक भार (${hw.weight}) रखता है। पूर्ण पाठ्यक्रम तैयारी के लिए इन प्रमाणित प्रश्नों का अभ्यास करें।`,
          metrics: {
            attempted: 0,
            correct: 0,
            accuracy: null,
            recentTrend: 'new',
          },
          recommendedQuestions: recQuestions,
        });
      }
    });
  }

  return recommendations;
}

/**
 * Reuses existing question data from CURATED_BOARD_QUESTIONS whenever possible.
 * Strictly filters by target grade and stream to prevent cross-stream/grade question contamination.
 */
function findQuestionsForRecommendation(
  subject: SubjectId,
  chapter: string,
  topic: string,
  difficulty: DifficultyLevel,
  grade: GradeClass = '12',
  stream: StreamType = 'science'
): Question[] {
  // Restrict pool strictly to the requested class grade and stream
  let pool = CURATED_BOARD_QUESTIONS.filter(q => (q.grade || '12') === grade);
  if (grade === '12') {
    if (stream === 'commerce' || ['accountancy', 'business_studies', 'economics', 'english_core'].includes(subject.toLowerCase())) {
      pool = pool.filter(q => ['accountancy', 'business_studies', 'economics', 'english_core'].includes(q.subject.toLowerCase()));
    } else {
      pool = pool.filter(q => ['mathematics', 'physics', 'chemistry'].includes(q.subject.toLowerCase()));
    }
  } else if (grade === '10') {
    pool = pool.filter(q => ['mathematics', 'science', 'social_science', 'english'].includes(q.subject.toLowerCase()));
  }

  // 1. Exact match on subject, chapter/topic, and difficulty
  let matches = pool.filter(
    q =>
      q.subject.toLowerCase() === subject.toLowerCase() &&
      (q.chapter.toLowerCase().includes(chapter.toLowerCase()) ||
        q.topic.toLowerCase().includes(topic.toLowerCase()) ||
        topic.toLowerCase().includes(q.topic.toLowerCase())) &&
      q.difficulty === difficulty
  );

  // 2. If not enough exact matches, find same subject & chapter with any difficulty
  if (matches.length < 3) {
    const chapterMatches = pool.filter(
      q =>
        q.subject.toLowerCase() === subject.toLowerCase() &&
        (q.chapter.toLowerCase().includes(chapter.toLowerCase()) ||
          chapter.toLowerCase().includes(q.chapter.toLowerCase())) &&
        !matches.some(m => m.id === q.id)
    );
    matches = [...matches, ...chapterMatches];
  }

  // 3. If still needed, match same subject and targeted difficulty
  if (matches.length < 3) {
    const diffMatches = pool.filter(
      q =>
        q.subject.toLowerCase() === subject.toLowerCase() &&
        q.difficulty === difficulty &&
        !matches.some(m => m.id === q.id)
    );
    matches = [...matches, ...diffMatches];
  }

  // 4. Fallback to same subject strictly within this grade and stream pool
  if (matches.length === 0) {
    matches = pool.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
  }

  // 5. Final fallback strictly within this grade and stream pool (never mix grades or streams)
  if (matches.length === 0) {
    matches = pool;
  }

  return matches.slice(0, 5);
}
