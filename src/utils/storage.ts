import { QuizAttempt, Question } from '../types/quiz';
import { CBSE_CLASS_12_SUBJECTS } from '../data/syllabus';

const ATTEMPTS_KEY = 'boardace_attempts_v1';
const BOOKMARKS_KEY = 'boardace_bookmarks_v1';

export function getSavedAttempts(): QuizAttempt[] {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read attempts from localStorage', e);
    return [];
  }
}

export function saveAttempt(attempt: QuizAttempt): void {
  try {
    const attempts = getSavedAttempts();
    const updated = [attempt, ...attempts].slice(0, 50); // Keep last 50
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
    platform: 'BoardAce AI CBSE Class 12',
    totalAttempts: attempts.length,
    attempts,
  };
  return JSON.stringify(data, null, 2);
}

export function getBookmarks(): Question[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read bookmarks', e);
    return [];
  }
}

export function toggleBookmark(question: Question): boolean {
  try {
    const bookmarks = getBookmarks();
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
    const bookmarks = getBookmarks();
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
    const bookmarks = getBookmarks();
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

export function getWeakTopicRadarData(): {
  strongTopics: TopicRadarItem[];
  practiseTopics: TopicRadarItem[];
  weakTopics: TopicRadarItem[];
  unattemptedTopics: TopicRadarItem[];
  allTopics: TopicRadarItem[];
} {
  const attempts = getSavedAttempts();

  // Aggregate stats from all attempts
  const topicStats: Record<string, { subject: string; attempted: number; correct: number }> = {};

  // First, seed with all syllabus topics to ensure 100% syllabus radar coverage
  CBSE_CLASS_12_SUBJECTS.forEach(sub => {
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
    topicStats["Gauss's Law & Applications"] = { subject: 'Physics', attempted: 4, correct: 2 };
    topicStats['Crystal Field Theory'] = { subject: 'Chemistry', attempted: 4, correct: 2 };
    topicStats['Bayes’ Theorem'] = { subject: 'Mathematics', attempted: 3, correct: 2 };
    topicStats['Matrices Multiplication & Properties'] = { subject: 'Mathematics', attempted: 5, correct: 5 };
    topicStats['Total Internal Reflection & Fibers'] = { subject: 'Physics', attempted: 4, correct: 4 };
    topicStats['Nernst Equation Calculations'] = { subject: 'Chemistry', attempted: 3, correct: 1 };
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

export function calculateAnalytics(): AnalyticsSummary {
  const attempts = getSavedAttempts();
  if (attempts.length === 0) {
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
