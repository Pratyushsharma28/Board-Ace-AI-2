import { Question, SubjectId, RevisionItem, RevisionSaveReason, RevisionSummary, MistakeCategory, QuizAttempt, GradeClass, StreamType } from '../types/quiz';
import { getSavedAttempts, getBookmarks } from './storage';
import { CBSE_CLASS_12_SUBJECTS } from '../data/syllabus';
import { CURATED_BOARD_QUESTIONS } from '../data/sampleQuestions';

export type { RevisionItem, RevisionSaveReason, RevisionSummary };

export const REVISION_STORAGE_KEY = 'boardace_revision_items_v2';

// Spaced-Repetition Intervals in Milliseconds
// Stage 0: 0 hours (Due immediately)
// Stage 1: 24 hours (1 day)
// Stage 2: 72 hours (3 days)
// Stage 3: 7 days (168 hours)
// Stage 4: 14 days (336 hours - Mastered)
export const SRS_INTERVALS_MS: Record<number, number> = {
  0: 0,
  1: 24 * 60 * 60 * 1000,
  2: 3 * 24 * 60 * 60 * 1000,
  3: 7 * 24 * 60 * 60 * 1000,
  4: 14 * 24 * 60 * 60 * 1000,
};

export const SRS_STAGE_LABELS_EN: Record<number, string> = {
  0: 'Due Today (Stage 0)',
  1: 'Stage 1 (1 Day Interval)',
  2: 'Stage 2 (3 Days Interval)',
  3: 'Stage 3 (7 Days Interval)',
  4: 'Mastered (14 Days Interval)',
};

export const SRS_STAGE_LABELS_HI: Record<number, string> = {
  0: 'आज देय (चरण 0)',
  1: 'चरण 1 (1 दिन का अंतराल)',
  2: 'चरण 2 (3 दिन का अंतराल)',
  3: 'चरण 3 (7 दिन का अंतराल)',
  4: 'सिद्ध/कंठस्थ (14 दिन का अंतराल)',
};

export interface RevisionRecommendation {
  id: string;
  subject: SubjectId;
  chapter: string;
  topic: string;
  reason: string;
  reasonHi: string;
  mistakeCount: number;
  accuracy: number;
  sampleQuestion?: Question;
}

/**
 * Checks whether an item is currently due for revision.
 */
export function isItemDueForRevision(item: RevisionItem): boolean {
  if (!item.isRevised) return true;
  if (item.srsStage === 0) return true;
  const reviewTime = new Date(item.nextReviewDate).getTime();
  // If review date has passed or within 1 minute of now
  return reviewTime <= Date.now() + 60000;
}

/**
 * Normalizes subject string into SubjectId
 */
export function normalizeSubjectId(subj: string): SubjectId {
  const s = subj?.toLowerCase().trim() || '';
  if (s.includes('math')) return 'mathematics';
  if (s.includes('phys')) return 'physics';
  if (s.includes('chem')) return 'chemistry';
  if (s.includes('account')) return 'accountancy';
  if (s.includes('business')) return 'business_studies';
  if (s.includes('econom')) return 'economics';
  if (s.includes('english_core') || (s.includes('english') && s.includes('core'))) return 'english_core';
  if (s.includes('social')) return 'social_science';
  if (s.includes('science')) return 'science';
  if (s.includes('english')) return 'english';
  return (s || 'physics') as SubjectId;
}

/**
 * Loads all saved revision items from localStorage.
 * If empty, automatically seeds from existing bookmarks and attempts
 * so no existing student data is lost.
 */
export function getRevisionItems(): RevisionItem[] {
  try {
    const raw = localStorage.getItem(REVISION_STORAGE_KEY);
    if (raw) {
      const parsed: RevisionItem[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read revision items from localStorage', e);
  }

  // Fallback seed from bookmarks and historical mistakes
  const initialItems: RevisionItem[] = [];
  const seenIds = new Set<string>();

  // 1. Seed from existing bookmarks
  const bookmarks = getBookmarks();
  bookmarks.forEach(q => {
    if (!seenIds.has(q.id)) {
      seenIds.add(q.id);
      initialItems.push({
        id: q.id,
        question: q,
        savedReason: 'bookmarked',
        subject: normalizeSubjectId(q.subject),
        chapter: q.chapter || 'Class 12 Chapter',
        topic: q.topic || 'Core Concept',
        savedAt: new Date().toISOString(),
        reviewCount: 0,
        isRevised: false,
        srsStage: 0,
        nextReviewDate: new Date().toISOString(),
        incorrectCount: 0,
      });
    }
  });

  // 2. Seed from historical quiz mistakes
  const attempts = getSavedAttempts();
  attempts.forEach(att => {
    att.questions.forEach(q => {
      const userAns = att.userAnswers[q.id];
      if (userAns && userAns !== q.correctAnswer && !seenIds.has(q.id)) {
        seenIds.add(q.id);
        initialItems.push({
          id: q.id,
          question: q,
          savedReason: 'incorrect_answer',
          subject: normalizeSubjectId(q.subject || att.quizConfig.subject),
          chapter: q.chapter || att.quizConfig.chapter,
          topic: q.topic || 'Core Concept',
          savedAt: att.completedAt || new Date().toISOString(),
          lastAttemptedAt: att.completedAt,
          reviewCount: 0,
          isRevised: false,
          srsStage: 0,
          nextReviewDate: new Date().toISOString(),
          incorrectCount: 1,
          userLastWrongAnswer: userAns,
        });
      }
    });
  });

  // If seeded items were generated, persist them
  if (initialItems.length > 0) {
    saveRevisionItemsList(initialItems);
  }

  return initialItems;
}

/**
 * Directly overwrites the stored list of revision items.
 */
export function saveRevisionItemsList(items: RevisionItem[]): void {
  try {
    localStorage.setItem(REVISION_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to persist revision items', e);
  }
}

/**
 * Saves a question to the Revision System.
 * Deduplicates strictly by question.id or normalized question text.
 * If already present, updates metrics and resets SRS if a new mistake occurred.
 */
export function saveToRevision(
  question: Question,
  reason: RevisionSaveReason = 'incorrect_answer',
  extra?: {
    wrongAnswer?: string;
    mistakeCategory?: MistakeCategory;
    notes?: string;
  }
): RevisionItem {
  const items = getRevisionItems();
  const normQ = question.question.trim().toLowerCase();
  const existingIdx = items.findIndex(
    item => item.id === question.id || item.question.id === question.id || item.question.question.trim().toLowerCase() === normQ
  );

  const nowIso = new Date().toISOString();

  if (existingIdx !== -1) {
    const existing = items[existingIdx];
    const isNewMistake = reason === 'incorrect_answer';

    const updated: RevisionItem = {
      ...existing,
      question: { ...existing.question, ...question },
      savedReason: isNewMistake ? 'incorrect_answer' : existing.savedReason,
      incorrectCount: isNewMistake ? existing.incorrectCount + 1 : existing.incorrectCount,
      userLastWrongAnswer: extra?.wrongAnswer || existing.userLastWrongAnswer,
      userLastMistakeCategory: extra?.mistakeCategory || existing.userLastMistakeCategory,
      notes: extra?.notes || existing.notes,
      lastAttemptedAt: nowIso,
      // If student answered incorrectly again, reset to stage 0 so it's due immediately
      srsStage: isNewMistake ? 0 : existing.srsStage,
      nextReviewDate: isNewMistake ? nowIso : existing.nextReviewDate,
      isRevised: isNewMistake ? false : existing.isRevised,
    };

    items[existingIdx] = updated;
    saveRevisionItemsList(items);
    return updated;
  }

  // Create new entry
  const newItem: RevisionItem = {
    id: question.id,
    question,
    savedReason: reason,
    subject: normalizeSubjectId(question.subject),
    chapter: question.chapter || 'Class 12 Chapter',
    topic: question.topic || 'Core Concept',
    savedAt: nowIso,
    lastAttemptedAt: nowIso,
    reviewCount: 0,
    isRevised: false,
    srsStage: 0,
    nextReviewDate: nowIso,
    incorrectCount: reason === 'incorrect_answer' ? 1 : 0,
    userLastWrongAnswer: extra?.wrongAnswer,
    userLastMistakeCategory: extra?.mistakeCategory,
    notes: extra?.notes,
  };

  const updatedList = [newItem, ...items];
  saveRevisionItemsList(updatedList);
  return newItem;
}

/**
 * Marks a concept/question as revised.
 * Advances SRS stage, calculates next spaced-repetition review date.
 */
export function markItemAsRevised(questionId: string): RevisionItem | null {
  const items = getRevisionItems();
  const idx = items.findIndex(item => item.id === questionId);
  if (idx === -1) return null;

  const current = items[idx];
  const newStage = Math.min(4, current.srsStage + 1);
  const intervalMs = SRS_INTERVALS_MS[newStage] || (14 * 24 * 60 * 60 * 1000);
  const nextDate = new Date(Date.now() + intervalMs).toISOString();

  const updated: RevisionItem = {
    ...current,
    isRevised: true,
    revisedAt: new Date().toISOString(),
    lastReviewedAt: new Date().toISOString(),
    reviewCount: current.reviewCount + 1,
    srsStage: newStage,
    nextReviewDate: nextDate,
  };

  items[idx] = updated;
  saveRevisionItemsList(items);
  return updated;
}

/**
 * Toggles an item back to unrevised (due immediately).
 */
export function markItemAsUnrevised(questionId: string): RevisionItem | null {
  const items = getRevisionItems();
  const idx = items.findIndex(item => item.id === questionId);
  if (idx === -1) return null;

  const current = items[idx];
  const updated: RevisionItem = {
    ...current,
    isRevised: false,
    srsStage: 0,
    nextReviewDate: new Date().toISOString(),
  };

  items[idx] = updated;
  saveRevisionItemsList(items);
  return updated;
}

/**
 * Removes a revision item.
 */
export function removeRevisionItem(questionId: string): void {
  const items = getRevisionItems();
  const updated = items.filter(item => item.id !== questionId);
  saveRevisionItemsList(updated);
}

/**
 * Updates personal student notes on a specific revision/mistake item.
 */
export function updateRevisionItemNotes(questionId: string, notes: string): RevisionItem | null {
  const items = getRevisionItems();
  const idx = items.findIndex(item => item.id === questionId);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], notes };
  saveRevisionItemsList(items);
  return items[idx];
}

/**
 * Clears all mastered revision items.
 */
export function clearMasteredItems(): void {
  const items = getRevisionItems();
  const updated = items.filter(item => item.srsStage < 4);
  saveRevisionItemsList(updated);
}

/**
 * Submits an interactive retry answer for a saved question.
 * Evaluates correctness, updates spaced-repetition stage, and returns diagnostic.
 */
export function submitRetryAnswer(
  questionId: string,
  selectedOption: string
): { isCorrect: boolean; updatedItem: RevisionItem | null; explanation: string } {
  const items = getRevisionItems();
  const idx = items.findIndex(item => item.id === questionId);
  if (idx === -1) {
    return { isCorrect: false, updatedItem: null, explanation: 'Question not found' };
  }

  const current = items[idx];
  const isCorrect = selectedOption.trim() === current.question.correctAnswer.trim();
  const nowIso = new Date().toISOString();

  let updated: RevisionItem;

  if (isCorrect) {
    // Advance SRS stage
    const newStage = Math.min(4, current.srsStage + 1);
    const intervalMs = SRS_INTERVALS_MS[newStage] || (14 * 24 * 60 * 60 * 1000);
    const nextDate = new Date(Date.now() + intervalMs).toISOString();

    updated = {
      ...current,
      isRevised: true,
      revisedAt: nowIso,
      lastReviewedAt: nowIso,
      lastAttemptedAt: nowIso,
      reviewCount: current.reviewCount + 1,
      srsStage: newStage,
      nextReviewDate: nextDate,
      userLastWrongAnswer: undefined,
    };
  } else {
    // Mistake on retry: reset SRS stage to 0 (Due immediately)
    updated = {
      ...current,
      isRevised: false,
      lastAttemptedAt: nowIso,
      incorrectCount: current.incorrectCount + 1,
      userLastWrongAnswer: selectedOption,
      srsStage: 0,
      nextReviewDate: nowIso,
    };
  }

  items[idx] = updated;
  saveRevisionItemsList(items);

  return {
    isCorrect,
    updatedItem: updated,
    explanation: current.question.explanation,
  };
}

/**
 * Calculates high-level summary metrics for the revision dashboard.
 */
export function getRevisionSummary(items: RevisionItem[] = getRevisionItems()): RevisionSummary {
  let dueCount = 0;
  let masteredCount = 0;
  let incorrectSavedCount = 0;
  let bookmarkedCount = 0;

  const subjectCounts: Record<string, number> = {
    mathematics: 0,
    physics: 0,
    chemistry: 0,
  };

  items.forEach(item => {
    if (isItemDueForRevision(item)) {
      dueCount += 1;
    }
    if (item.srsStage >= 4) {
      masteredCount += 1;
    }
    if (item.savedReason === 'incorrect_answer') {
      incorrectSavedCount += 1;
    }
    if (item.savedReason === 'bookmarked') {
      bookmarkedCount += 1;
    }

    const sub = item.subject || 'physics';
    subjectCounts[sub] = (subjectCounts[sub] || 0) + 1;
  });

  return {
    totalItems: items.length,
    dueCount,
    masteredCount,
    incorrectSavedCount,
    bookmarkedCount,
    subjectCounts: subjectCounts as any,
  };
}

/**
 * Recommends topics and questions for revision based on actual mistakes
 * and historical quiz attempts strictly within active academic track.
 */
export function getRevisionRecommendations(
  attempts: QuizAttempt[] = getSavedAttempts(),
  revisionItemsOrGrade: RevisionItem[] | GradeClass = getRevisionItems(),
  gradeArg: GradeClass | StreamType = '12',
  streamArg: StreamType = 'science'
): RevisionRecommendation[] {
  let revisionItems: RevisionItem[];
  let grade: GradeClass;
  let stream: StreamType;

  if (typeof revisionItemsOrGrade === 'string') {
    revisionItems = getRevisionItems();
    grade = (revisionItemsOrGrade as GradeClass) === '10' ? '10' : '12';
    stream = (gradeArg as StreamType) || 'science';
  } else {
    revisionItems = Array.isArray(revisionItemsOrGrade) ? revisionItemsOrGrade : getRevisionItems();
    grade = (gradeArg as GradeClass) === '10' ? '10' : '12';
    stream = streamArg || 'science';
  }

  const recommendations: RevisionRecommendation[] = [];
  const topicStats: Record<
    string,
    { subject: SubjectId; chapter: string; total: number; correct: number; incorrect: number }
  > = {};

  // Restrict curated question search strictly to active grade and stream
  let validCurated = CURATED_BOARD_QUESTIONS.filter(q => (q.grade || '12') === grade);
  if (grade === '12') {
    if (stream === 'commerce') {
      validCurated = validCurated.filter(q => ['accountancy', 'business_studies', 'economics', 'english_core'].includes(q.subject.toLowerCase()));
    } else {
      validCurated = validCurated.filter(q => ['mathematics', 'physics', 'chemistry'].includes(q.subject.toLowerCase()));
    }
  } else if (grade === '10') {
    validCurated = validCurated.filter(q => ['mathematics', 'science', 'social_science', 'english'].includes(q.subject.toLowerCase()));
  }

  // 1. Tally stats from actual attempts
  attempts.forEach(att => {
    const sub = normalizeSubjectId(att.quizConfig.subject);
    att.questions.forEach(q => {
      const top = q.topic || 'Core Concept';
      if (!topicStats[top]) {
        topicStats[top] = {
          subject: sub,
          chapter: q.chapter || att.quizConfig.chapter,
          total: 0,
          correct: 0,
          incorrect: 0,
        };
      }
      topicStats[top].total += 1;
      const userAns = att.userAnswers[q.id];
      if (userAns === q.correctAnswer) {
        topicStats[top].correct += 1;
      } else if (userAns) {
        topicStats[top].incorrect += 1;
      }
    });
  });

  // 2. Also account for incorrect counts in revision items
  revisionItems.forEach(item => {
    const top = item.topic || 'Core Concept';
    if (!topicStats[top]) {
      topicStats[top] = {
        subject: item.subject,
        chapter: item.chapter,
        total: 1,
        correct: 0,
        incorrect: item.incorrectCount || 1,
      };
    } else {
      topicStats[top].incorrect = Math.max(topicStats[top].incorrect, item.incorrectCount || 0);
    }
  });

  // 3. Find topics needing urgent revision (mistakes >= 1 or accuracy < 75%)
  Object.entries(topicStats).forEach(([topic, stat]) => {
    if (stat.incorrect > 0 || (stat.total >= 2 && stat.correct / stat.total < 0.75)) {
      const accuracy = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
      
      // Find an authentic curated question for this topic within active grade/stream pool
      const sampleQ = validCurated.find(
        cq => cq.topic === topic || (cq.subject.toLowerCase() === stat.subject && cq.chapter === stat.chapter)
      ) || validCurated.find(cq => cq.subject.toLowerCase() === stat.subject);

      recommendations.push({
        id: `rec-${topic.replace(/\s+/g, '-').toLowerCase()}`,
        subject: stat.subject,
        chapter: stat.chapter,
        topic,
        reason: `${stat.incorrect} mistakes recorded (${accuracy}% accuracy). Review high-yield board concepts.`,
        reasonHi: `${stat.incorrect} त्रुटियां दर्ज (${accuracy}% सटीकता)। मुख्य बोर्ड अवधारणाओं का पुनरावलोकन करें।`,
        mistakeCount: stat.incorrect,
        accuracy,
        sampleQuestion: sampleQ,
      });
    }
  });

  // If no mistake-driven recommendations yet, provide high-yield syllabus starter recommendations
  if (recommendations.length === 0 && validCurated.length > 0) {
    const distinctSubjects = Array.from(new Set(validCurated.map(q => q.subject)));
    distinctSubjects.slice(0, 3).forEach(sub => {
      const q = validCurated.find(cq => cq.subject === sub);
      if (q) {
        recommendations.push({
          id: `starter-${sub}-${q.id}`,
          subject: sub as SubjectId,
          chapter: q.chapter,
          topic: q.topic || 'Core High-Yield Topic',
          reason: 'High-yield board exam topic. Master key concepts and numerical formulas.',
          reasonHi: 'उच्च-अंक बोर्ड परीक्षा विषय। मुख्य अवधारणाओं और सूत्रों का अभ्यास करें।',
          mistakeCount: 0,
          accuracy: 100,
          sampleQuestion: q,
        });
      }
    });
  }

  // Sort by highest mistakes first
  return recommendations.sort((a, b) => b.mistakeCount - a.mistakeCount).slice(0, 4);
}
