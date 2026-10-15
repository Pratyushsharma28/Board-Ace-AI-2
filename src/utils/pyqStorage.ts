import { GradeClass } from '../types/quiz';

export interface PYQAttemptRecord {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timestamp: string;
  year: number;
  subject: string;
  chapter: string;
  marks: number;
}

export interface PYQPerformanceStats {
  totalAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  accuracy: number;
  chaptersPractised: string[];
  recentAttempts: PYQAttemptRecord[];
  bookmarkedIds: string[];
}

const getStorageKey = (grade: GradeClass) => `boardace_pyq_progress_v1_class${grade}`;
const getBookmarksKey = (grade: GradeClass) => `boardace_pyq_bookmarks_v1_class${grade}`;

export function getPYQStats(grade: GradeClass): PYQPerformanceStats {
  try {
    const raw = localStorage.getItem(getStorageKey(grade));
    const rawBookmarks = localStorage.getItem(getBookmarksKey(grade));
    const bookmarks: string[] = rawBookmarks ? JSON.parse(rawBookmarks) : [];

    if (!raw) {
      return {
        totalAttempted: 0,
        totalCorrect: 0,
        totalIncorrect: 0,
        accuracy: 0,
        chaptersPractised: [],
        recentAttempts: [],
        bookmarkedIds: bookmarks,
      };
    }

    const data = JSON.parse(raw);
    const attempts: PYQAttemptRecord[] = data.attempts || [];
    const chapters = Array.from(new Set(attempts.map((a) => a.chapter)));
    const correct = attempts.filter((a) => a.isCorrect).length;
    const incorrect = attempts.length - correct;
    const accuracy = attempts.length > 0 ? Math.round((correct / attempts.length) * 100) : 0;

    return {
      totalAttempted: attempts.length,
      totalCorrect: correct,
      totalIncorrect: incorrect,
      accuracy,
      chaptersPractised: chapters,
      recentAttempts: attempts,
      bookmarkedIds: bookmarks,
    };
  } catch (e) {
    console.error('Error loading PYQ stats', e);
    return {
      totalAttempted: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      accuracy: 0,
      chaptersPractised: [],
      recentAttempts: [],
      bookmarkedIds: [],
    };
  }
}

export function savePYQAttempt(grade: GradeClass, attempt: PYQAttemptRecord): void {
  try {
    const key = getStorageKey(grade);
    const raw = localStorage.getItem(key);
    const existing = raw ? JSON.parse(raw) : { attempts: [] };
    const attempts: PYQAttemptRecord[] = existing.attempts || [];

    // Filter out previous attempt for same question to keep latest, or append
    const updated = [attempt, ...attempts.filter((a) => a.questionId !== attempt.questionId)].slice(0, 500);
    localStorage.setItem(key, JSON.stringify({ attempts: updated }));
  } catch (e) {
    console.error('Failed to save PYQ attempt', e);
  }
}

export function togglePYQBookmark(grade: GradeClass, questionId: string): boolean {
  try {
    const key = getBookmarksKey(grade);
    const raw = localStorage.getItem(key);
    let bookmarks: string[] = raw ? JSON.parse(raw) : [];

    let isNowBookmarked = false;
    if (bookmarks.includes(questionId)) {
      bookmarks = bookmarks.filter((id) => id !== questionId);
      isNowBookmarked = false;
    } else {
      bookmarks = [questionId, ...bookmarks];
      isNowBookmarked = true;
    }

    localStorage.setItem(key, JSON.stringify(bookmarks));
    return isNowBookmarked;
  } catch (e) {
    console.error('Failed to toggle PYQ bookmark', e);
    return false;
  }
}

export function isPYQBookmarked(grade: GradeClass, questionId: string): boolean {
  try {
    const key = getBookmarksKey(grade);
    const raw = localStorage.getItem(key);
    const bookmarks: string[] = raw ? JSON.parse(raw) : [];
    return bookmarks.includes(questionId);
  } catch {
    return false;
  }
}
