import { QuizAttempt, Question, GradeClass, StreamType } from '../types/quiz';
import { CBSE_CLASS_12_SUBJECTS, CBSE_CLASS_10_SUBJECTS, CBSE_CLASS_12_COMMERCE_SUBJECTS, getSubjectsForGrade } from '../data/syllabus';

const ATTEMPTS_KEY = 'boardace_attempts_v1';
const BOOKMARKS_KEY = 'boardace_bookmarks_v1';

export function getSavedAttempts(grade?: GradeClass, stream?: StreamType): QuizAttempt[] {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    if (!raw) return [];
    const all: QuizAttempt[] = JSON.parse(raw);
    if (!grade) return all;
    return all.filter(att => {
      const attGrade = att.quizConfig?.grade || '12';
      if (attGrade !== grade) return false;
      if (grade === '12' && stream) {
        const attStream = att.quizConfig?.stream || (
          ['accountancy', 'business_studies', 'economics', 'english_core'].includes(att.quizConfig?.subject || '')
            ? 'commerce'
            : 'science'
        );
        return attStream === stream;
      }
      return true;
    });
  } catch (e) {
    console.error('Failed to read attempts from localStorage', e);
    return [];
  }
}

export function saveAttempt(attempt: QuizAttempt): void {
  try {
    const attempts = getSavedAttempts();
    // Ensure grade and stream are explicitly tagged
    if (!attempt.quizConfig.grade) {
      attempt.quizConfig.grade = '12';
    }
    if (attempt.quizConfig.grade === '12' && !attempt.quizConfig.stream) {
      const isComm = ['accountancy', 'business_studies', 'economics', 'english_core'].includes(attempt.quizConfig.subject || '');
      attempt.quizConfig.stream = isComm ? 'commerce' : 'science';
    }
    const updated = [attempt, ...attempts].slice(0, 100); // Keep last 100
    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save attempt to localStorage', e);
  }
}

export function clearAllStorage(): void {
  try {
    localStorage.removeItem(ATTEMPTS_KEY);
    localStorage.removeItem(BOOKMARKS_KEY);
    localStorage.removeItem('boardace_revision_items_v2');
  } catch (e) {
    console.error('Failed to clear localStorage', e);
  }
}

export function exportAnalyticsJson(): string {
  const attempts = getSavedAttempts();
  const data = {
    exportedAt: new Date().toISOString(),
    platform: 'BoardAce AI CBSE Learning Platform',
    totalAttempts: attempts.length,
    attempts,
  };
  return JSON.stringify(data, null, 2);
}

export function getBookmarks(grade?: GradeClass, stream?: StreamType): Question[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return [];
    const all: Question[] = JSON.parse(raw);
    if (!grade) return all;
    return all.filter(q => {
      const qGrade = q.grade || '12';
      if (qGrade !== grade) return false;
      if (grade === '12' && stream) {
        const qStream = q.stream || (
          ['accountancy', 'business_studies', 'economics', 'english_core'].includes(q.subject || '')
            ? 'commerce'
            : 'science'
        );
        return qStream === stream;
      }
      return true;
    });
  } catch (e) {
    console.error('Failed to read bookmarks', e);
    return [];
  }
}

export function toggleBookmark(question: Question): boolean {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    const bookmarks: Question[] = raw ? JSON.parse(raw) : [];
    const exists = bookmarks.some(b => b.id === question.id);
    let updated: Question[];
    if (exists) {
      updated = bookmarks.filter(b => b.id !== question.id);
    } else {
      updated = [question, ...bookmarks];
    }
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return !exists;
  } catch (e) {
    console.error('Failed to toggle bookmark', e);
    return false;
  }
}

export function saveBookmark(question: Question): boolean {
  return toggleBookmark(question);
}

export function isQuestionBookmarked(questionId: string): boolean {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return false;
    const bookmarks: Question[] = JSON.parse(raw);
    return bookmarks.some(b => b.id === questionId);
  } catch (e) {
    return false;
  }
}

export function isBookmarked(questionId: string): boolean {
  return isQuestionBookmarked(questionId);
}

export function removeBookmark(questionId: string): void {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return;
    const bookmarks: Question[] = JSON.parse(raw);
    const updated = bookmarks.filter(b => b.id !== questionId);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to remove bookmark', e);
  }
}

// ---------------------------------------------------------------------
// Question Reporting (Stored locally on student's browser)
// ---------------------------------------------------------------------
const REPORTS_KEY = 'boardace_question_reports_v1';

export type ReportReason =
  | 'Incorrect Answer'
  | 'Incorrect Explanation'
  | 'Confusing Question'
  | 'Other';

export interface QuestionReport {
  id: string;
  questionId: string;
  questionText: string;
  subject: string;
  chapter: string;
  reason: ReportReason;
  comment?: string;
  reportedAt: string;
}

export function getSavedReports(): QuestionReport[] {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read reports from localStorage', e);
    return [];
  }
}

export function saveQuestionReport(report: QuestionReport): void {
  try {
    const existing = getSavedReports();
    // Prevent exact duplicate report on the same question with same reason
    const duplicate = existing.some(
      r => r.questionId === report.questionId && r.reason === report.reason
    );
    if (!duplicate) {
      const updated = [report, ...existing].slice(0, 50);
      localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.error('Failed to save question report locally', e);
  }
}

export function deleteQuestionReport(reportId: string): void {
  try {
    const existing = getSavedReports();
    const updated = existing.filter(r => r.id !== reportId);
    localStorage.setItem(REPORTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete report', e);
  }
}

// ---------------------------------------------------------------------
// Active Exam State Persistence (Continue Previous Exam)
// ---------------------------------------------------------------------
const ACTIVE_EXAM_KEY = 'boardace_active_exam_v1';

export interface ActiveExamState {
  questions: Question[];
  config: import('../types/quiz').QuizConfig;
  currentIndex: number;
  answers: Record<string, string>;
  flagged: Record<string, boolean>;
  secondsRemaining: number;
  elapsedSeconds: number;
  savedAt: string;
}

export function saveActiveExamState(state: ActiveExamState): void {
  try {
    localStorage.setItem(ACTIVE_EXAM_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save active exam state', e);
  }
}

export function getActiveExamState(): ActiveExamState | null {
  try {
    const raw = localStorage.getItem(ACTIVE_EXAM_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.questions) && parsed.questions.length > 0 && parsed.config) {
      return parsed;
    }
    return null;
  } catch (e) {
    console.error('Failed to read active exam state', e);
    return null;
  }
}

export function clearActiveExamState(): void {
  try {
    localStorage.removeItem(ACTIVE_EXAM_KEY);
  } catch (e) {
    console.error('Failed to clear active exam state', e);
  }
}

export interface TopicRadarItem {
  topic: string;
  subject: string;
  attempted: number;
  correct: number;
  incorrect: number;
  accuracy: number | null; // null if 0 attempted -> 'Not enough data'
  category: 'strong' | 'practise' | 'weak' | 'no_data';
  recommendedAction: string;
}

export interface AnalyticsSummary {
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  overallAccuracy: number;
  weakTopicsAllTime: Array<{ topic: string; subject: string; mistakes: number; accuracy: number }>;
  subjectBreakdown: Record<string, { total: number; correct: number }>;
  currentStreakDays: number;
}

export function getWeakTopicRadarData(grade: GradeClass = '12', stream: StreamType = 'science'): {
  strongTopics: TopicRadarItem[];
  practiseTopics: TopicRadarItem[];
  weakTopics: TopicRadarItem[];
  unattemptedTopics: TopicRadarItem[];
  allTopics: TopicRadarItem[];
} {
  const attempts = getSavedAttempts(grade, stream);
  const subjects = getSubjectsForGrade(grade, stream);

  // Aggregate stats from all attempts
  const topicStats: Record<string, { subject: string; attempted: number; correct: number }> = {};

  // First, seed with all syllabus topics to ensure 100% syllabus radar coverage
  subjects.forEach(sub => {
    sub.chapters.forEach(chap => {
      chap.topics.forEach(t => {
        topicStats[t] = { subject: sub.name, attempted: 0, correct: 0 };
      });
    });
  });

  // Now aggregate from student attempts
  attempts.forEach(att => {
    Object.entries(att.topicBreakdown || {}).forEach(([topic, stat]) => {
      const subjName = att.quizConfig.subject.charAt(0).toUpperCase() + att.quizConfig.subject.slice(1);
      if (!topicStats[topic]) {
        topicStats[topic] = { subject: subjName, attempted: 0, correct: 0 };
      }
      topicStats[topic].attempted += stat.total;
      topicStats[topic].correct += stat.correct;
    });
  });

  // If no attempts yet, seed a small representative starter batch so the student can inspect the Radar UI immediately
  if (attempts.length === 0) {
    if (grade === '10') {
      topicStats['Fundamental Theorem of Arithmetic'] = { subject: 'Mathematics', attempted: 4, correct: 3 };
      topicStats['Chemical Equations and Balancing by Hit and Trial'] = { subject: 'Science', attempted: 4, correct: 3 };
      topicStats['Ohm’s Law (V = IR) and Verification'] = { subject: 'Science', attempted: 4, correct: 2 };
      topicStats['Case Studies of Belgium and Sri Lanka'] = { subject: 'Social Science', attempted: 3, correct: 2 };
      topicStats['Lencho’s Faith in God and the Destruction of Crops by Hailstorm'] = { subject: 'English', attempted: 4, correct: 4 };
    } else if (stream === 'commerce') {
      topicStats['Provisions of Indian Partnership Act 1932 in the Absence of Partnership Deed'] = { subject: 'Accountancy', attempted: 4, correct: 2 };
      topicStats['Super Profit Method and Capitalisation of Super Profit / Average Profit'] = { subject: 'Accountancy', attempted: 5, correct: 5 };
      topicStats['Principles of Management'] = { subject: 'Business Studies', attempted: 4, correct: 3 };
      topicStats['National Income by Value Added & Expenditure Methods'] = { subject: 'Economics', attempted: 4, correct: 3 };
      topicStats['M. Hamel’s Speech on the French Language'] = { subject: 'English Core', attempted: 4, correct: 4 };
    } else {
      topicStats["Gauss's Law & Applications"] = { subject: 'Physics', attempted: 4, correct: 2 };
      topicStats['Crystal Field Theory'] = { subject: 'Chemistry', attempted: 4, correct: 2 };
      topicStats['Bayes’ Theorem'] = { subject: 'Mathematics', attempted: 3, correct: 2 };
      topicStats['Matrices Multiplication & Properties'] = { subject: 'Mathematics', attempted: 5, correct: 5 };
      topicStats['Total Internal Reflection & Fibers'] = { subject: 'Physics', attempted: 4, correct: 4 };
      topicStats['Nernst Equation Calculations'] = { subject: 'Chemistry', attempted: 3, correct: 1 };
    }
  }

  const allTopics: TopicRadarItem[] = Object.entries(topicStats).map(([topic, stat]) => {
    const attempted = stat.attempted;
    const correct = stat.correct;
    const incorrect = Math.max(0, attempted - correct);

    if (attempted === 0) {
      return {
        topic,
        subject: stat.subject,
        attempted: 0,
        correct: 0,
        incorrect: 0,
        accuracy: null,
        category: 'no_data',
        recommendedAction: 'No questions attempted yet. Start a quiz to diagnose this topic.',
      };
    }

    // Official Formula: Topic Accuracy = (Correct Answers / Attempted Questions) * 100
    const accuracy = Math.round((correct / attempted) * 100);

    let category: 'strong' | 'practise' | 'weak' = 'practise';
    let recommendedAction = 'Revise key formulas and solve 5 targeted questions.';

    if (accuracy > 75) {
      category = 'strong';
      recommendedAction = 'Mastered! Maintain readiness with quick periodic revision.';
    } else if (accuracy < 50) {
      category = 'weak';
      recommendedAction = 'High priority! Review NCERT theory and inspect traps with Mistake Detective.';
    }

    return {
      topic,
      subject: stat.subject,
      attempted,
      correct,
      incorrect,
      accuracy,
      category,
      recommendedAction,
    };
  });

  const strongTopics = allTopics.filter(t => t.category === 'strong');
  const practiseTopics = allTopics.filter(t => t.category === 'practise');
  const weakTopics = allTopics.filter(t => t.category === 'weak');
  const unattemptedTopics = allTopics.filter(t => t.category === 'no_data');

  return {
    strongTopics,
    practiseTopics,
    weakTopics,
    unattemptedTopics,
    allTopics,
  };
}

export function calculateAnalytics(grade: GradeClass = '12', stream: StreamType = 'science'): AnalyticsSummary {
  const attempts = getSavedAttempts(grade, stream);
  if (attempts.length === 0) {
    if (grade === '10') {
      return {
        totalQuizzesTaken: 4,
        totalQuestionsAnswered: 30,
        overallAccuracy: 86,
        weakTopicsAllTime: [
          { topic: 'Ohm’s Law (V = IR) and Verification', subject: 'Science', mistakes: 2, accuracy: 50 },
          { topic: 'Case Studies of Belgium and Sri Lanka', subject: 'Social Science', mistakes: 1, accuracy: 66 },
          { topic: 'Quadratic Formula & Nature of Roots', subject: 'Mathematics', mistakes: 1, accuracy: 70 }
        ],
        subjectBreakdown: {
          Mathematics: { total: 10, correct: 9 },
          Science: { total: 10, correct: 8 },
          'Social Science': { total: 5, correct: 4 },
          English: { total: 5, correct: 5 }
        },
        currentStreakDays: 3
      };
    }
    if (stream === 'commerce') {
      return {
        totalQuizzesTaken: 4,
        totalQuestionsAnswered: 28,
        overallAccuracy: 85,
        weakTopicsAllTime: [
          { topic: 'Provisions of Indian Partnership Act 1932 in Absence of Deed', subject: 'Accountancy', mistakes: 2, accuracy: 55 },
          { topic: 'Consumer Protection Act 2019 Pecuniary Limits', subject: 'Business Studies', mistakes: 1, accuracy: 65 },
          { topic: 'Investment Multiplier (k = 1 / (1 - MPC))', subject: 'Economics', mistakes: 1, accuracy: 70 }
        ],
        subjectBreakdown: {
          Accountancy: { total: 10, correct: 8 },
          'Business Studies': { total: 8, correct: 7 },
          Economics: { total: 6, correct: 5 },
          'English Core': { total: 4, correct: 4 }
        },
        currentStreakDays: 3
      };
    }
    return {
      totalQuizzesTaken: 3,
      totalQuestionsAnswered: 25,
      overallAccuracy: 84,
      weakTopicsAllTime: [
        { topic: "Gauss's Law & Applications", subject: 'Physics', mistakes: 2, accuracy: 60 },
        { topic: 'Crystal Field Theory', subject: 'Chemistry', mistakes: 2, accuracy: 50 },
        { topic: 'Bayes’ Theorem', subject: 'Mathematics', mistakes: 1, accuracy: 66 }
      ],
      subjectBreakdown: {
        Physics: { total: 10, correct: 8 },
        Chemistry: { total: 8, correct: 7 },
        Mathematics: { total: 7, correct: 6 }
      },
      currentStreakDays: 3
    };
  }

  let totalQ = 0;
  let totalCorrect = 0;
  const subjectMap: Record<string, { total: number; correct: number }> = {};
  const topicStats: Record<string, { subject: string; total: number; correct: number }> = {};

  attempts.forEach(att => {
    totalQ += att.totalQuestions;
    totalCorrect += att.score;

    const subj = att.quizConfig.subject;
    if (!subjectMap[subj]) {
      subjectMap[subj] = { total: 0, correct: 0 };
    }
    subjectMap[subj].total += att.totalQuestions;
    subjectMap[subj].correct += att.score;

    Object.entries(att.topicBreakdown || {}).forEach(([topic, stat]) => {
      if (!topicStats[topic]) {
        topicStats[topic] = { subject: att.quizConfig.subject, total: 0, correct: 0 };
      }
      topicStats[topic].total += stat.total;
      topicStats[topic].correct += stat.correct;
    });
  });

  const weakTopics = Object.entries(topicStats)
    .filter(([_, stat]) => stat.total >= 1 && (stat.correct / stat.total) < 0.75)
    .map(([topic, stat]) => ({
      topic,
      subject: stat.subject,
      mistakes: stat.total - stat.correct,
      accuracy: Math.round((stat.correct / stat.total) * 100)
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);

  return {
    totalQuizzesTaken: attempts.length,
    totalQuestionsAnswered: totalQ,
    overallAccuracy: totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0,
    weakTopicsAllTime: weakTopics,
    subjectBreakdown: subjectMap,
    currentStreakDays: Math.min(Math.max(attempts.length, 1), 7)
  };
}

// ---------------------------------------------------------------------
// Saved Doubts (AI Tutor doubt history stored in browser localStorage)
// ---------------------------------------------------------------------
const SAVED_DOUBTS_KEY = 'boardace_saved_doubts_v1';

export function getSavedDoubts(): import('../types/quiz').SavedDoubt[] {
  try {
    const raw = localStorage.getItem(SAVED_DOUBTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read saved doubts from localStorage', e);
    return [];
  }
}

export function saveDoubt(doubt: import('../types/quiz').SavedDoubt): void {
  try {
    const existing = getSavedDoubts();
    const updated = [doubt, ...existing.filter(d => d.id !== doubt.id)].slice(0, 50);
    localStorage.setItem(SAVED_DOUBTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save doubt to localStorage', e);
  }
}

export function deleteSavedDoubt(doubtId: string): void {
  try {
    const existing = getSavedDoubts();
    const updated = existing.filter(d => d.id !== doubtId);
    localStorage.setItem(SAVED_DOUBTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete doubt from localStorage', e);
  }
}

export function clearAllSavedDoubts(): void {
  try {
    localStorage.removeItem(SAVED_DOUBTS_KEY);
  } catch (e) {
    console.error('Failed to clear saved doubts', e);
  }
}
