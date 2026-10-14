import { QuizAttempt, Question, SubjectId, DifficultyLevel, SmartPracticeRecommendation } from '../types/quiz';
import { CBSE_CLASS_12_SUBJECTS } from '../data/syllabus';
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

export function getSmartPracticePreferences(): SmartPracticePreferences {
  try {
    const raw = localStorage.getItem(SMART_PREFERENCES_KEY);
    if (!raw) {
      return {
        targetSubject: 'all',
        preferredDifficulty: 'adaptive',
        autoStepUp: true,
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    return {
      targetSubject: 'all',
      preferredDifficulty: 'adaptive',
      autoStepUp: true,
    };
  }
}

export function saveSmartPracticePreferences(prefs: SmartPracticePreferences): void {
  try {
    localStorage.setItem(SMART_PREFERENCES_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save smart practice preferences', e);
  }
}

/**
 * Analyzes real quiz attempts, incorrect answers, accuracy, and chapter-wise performance.
 * Does not fabricate data.
 */
export function analyzeStudentPerformance(attempts: QuizAttempt[] = getSavedAttempts()): {
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

  // Build lookup index from CBSE Class 12 Syllabus
  CBSE_CLASS_12_SUBJECTS.forEach(sub => {
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

  // Sort attempts chronologically (oldest to newest) to track improvement and difficulty progression
  const sortedAttempts = [...attempts].sort(
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
  subjectFilter: 'all' | SubjectId = 'all'
): SmartPracticeRecommendation[] {
  const { topicPerformances } = analyzeStudentPerformance(attempts);
  const recommendations: SmartPracticeRecommendation[] = [];

  const topicsList = Object.values(topicPerformances).filter(tp => {
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
    const recQuestions = findQuestionsForRecommendation(tp.subject, tp.chapter, tp.topic, targetDifficulty);

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
    const recQuestions = findQuestionsForRecommendation(tp.subject, tp.chapter, tp.topic, targetDifficulty);

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
    const recQuestions = findQuestionsForRecommendation(tp.subject, tp.chapter, tp.topic, targetDifficulty);

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

  // 4. UNATTEMPTED OR STARTER TOPICS (if user has few recommendations or new session)
  if (recommendations.length < 3) {
    const highWeightageChaps = [
      { subject: 'mathematics' as SubjectId, chapter: 'Matrices', topic: 'Symmetric & Skew-Symmetric Matrices', weight: '5-6 marks' },
      { subject: 'physics' as SubjectId, chapter: 'Electric Charges and Fields', topic: "Gauss’s Law and Applications", weight: '7-8 marks' },
      { subject: 'chemistry' as SubjectId, chapter: 'Electrochemistry', topic: 'Nernst Equation and Cell Potential Calculations', weight: '7-8 marks' },
      { subject: 'physics' as SubjectId, chapter: 'Current Electricity', topic: 'Drift Velocity & Mobility (Ohm’s Law Derivation)', weight: '8-9 marks' },
      { subject: 'mathematics' as SubjectId, chapter: 'Continuity and Differentiability', topic: 'Second Order Derivatives', weight: '8-9 marks' },
    ];

    highWeightageChaps.forEach(hw => {
      if (subjectFilter !== 'all' && hw.subject !== subjectFilter) return;
      if (recommendations.some(r => r.topic === hw.topic)) return;

      const tp = topicPerformances[hw.topic];
      const attempted = tp ? tp.attempted : 0;
      if (attempted === 0) {
        const targetDifficulty: DifficultyLevel = 'medium';
        const recQuestions = findQuestionsForRecommendation(hw.subject, hw.chapter, hw.topic, targetDifficulty);

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
 * Falls back to same subject & difficulty if exact topic is not available.
 */
function findQuestionsForRecommendation(
  subject: SubjectId,
  chapter: string,
  topic: string,
  difficulty: DifficultyLevel
): Question[] {
  // 1. Exact match on subject, chapter/topic, and difficulty
  let matches = CURATED_BOARD_QUESTIONS.filter(
    q =>
      q.subject.toLowerCase() === subject.toLowerCase() &&
      (q.chapter.toLowerCase().includes(chapter.toLowerCase()) ||
        q.topic.toLowerCase().includes(topic.toLowerCase()) ||
        topic.toLowerCase().includes(q.topic.toLowerCase())) &&
      q.difficulty === difficulty
  );

  // 2. If not enough exact matches, find same subject & chapter with any difficulty
  if (matches.length < 3) {
    const chapterMatches = CURATED_BOARD_QUESTIONS.filter(
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
    const diffMatches = CURATED_BOARD_QUESTIONS.filter(
      q =>
        q.subject.toLowerCase() === subject.toLowerCase() &&
        q.difficulty === difficulty &&
        !matches.some(m => m.id === q.id)
    );
    matches = [...matches, ...diffMatches];
  }

  // 4. Fallback to same subject
  if (matches.length === 0) {
    matches = CURATED_BOARD_QUESTIONS.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
  }

  return matches.slice(0, 5);
}
