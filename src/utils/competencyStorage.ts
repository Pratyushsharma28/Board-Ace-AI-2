import { GradeClass } from '../types/quiz';

export interface CompetencyAttempt {
  id: string;
  timestamp: string;
  grade: GradeClass;
  subject: string;
  chapter: string;
  questionType: string;
  totalQuestions: number;
  score: number;
  accuracy: number;
  conceptsTested: string[];
  weakConcepts: string[];
}

export interface CompetencyStats {
  totalAttempts: number;
  totalQuestionsPractised: number;
  totalCorrect: number;
  overallAccuracy: number;
  typeBreakdown: Record<string, { attempted: number; correct: number }>;
  weakConceptsList: string[];
  recentSessions: CompetencyAttempt[];
}

const getStorageKey = (grade: GradeClass) => `boardace_competency_progress_v1_class${grade}`;

export function getCompetencyStats(grade: GradeClass): CompetencyStats {
  try {
    const raw = localStorage.getItem(getStorageKey(grade));
    if (!raw) {
      return {
        totalAttempts: 0,
        totalQuestionsPractised: 0,
        totalCorrect: 0,
        overallAccuracy: 0,
        typeBreakdown: {},
        weakConceptsList: [],
        recentSessions: [],
      };
    }

    const data = JSON.parse(raw);
    const sessions: CompetencyAttempt[] = data.sessions || [];

    let totalQ = 0;
    let totalC = 0;
    const typeMap: Record<string, { attempted: number; correct: number }> = {};
    const weakSet = new Set<string>();

    sessions.forEach((s) => {
      totalQ += s.totalQuestions;
      totalC += s.score;
      if (!typeMap[s.questionType]) {
        typeMap[s.questionType] = { attempted: 0, correct: 0 };
      }
      typeMap[s.questionType].attempted += s.totalQuestions;
      typeMap[s.questionType].correct += s.score;

      (s.weakConcepts || []).forEach((c) => weakSet.add(c));
    });

    return {
      totalAttempts: sessions.length,
      totalQuestionsPractised: totalQ,
      totalCorrect: totalC,
      overallAccuracy: totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0,
      typeBreakdown: typeMap,
      weakConceptsList: Array.from(weakSet).slice(0, 8),
      recentSessions: sessions.slice(0, 10),
    };
  } catch (e) {
    console.error('Error fetching competency stats', e);
    return {
      totalAttempts: 0,
      totalQuestionsPractised: 0,
      totalCorrect: 0,
      overallAccuracy: 0,
      typeBreakdown: {},
      weakConceptsList: [],
      recentSessions: [],
    };
  }
}

export function saveCompetencySession(grade: GradeClass, session: CompetencyAttempt): void {
  try {
    const key = getStorageKey(grade);
    const raw = localStorage.getItem(key);
    const existing = raw ? JSON.parse(raw) : { sessions: [] };
    const sessions: CompetencyAttempt[] = [session, ...(existing.sessions || [])].slice(0, 100);
    localStorage.setItem(key, JSON.stringify({ sessions }));
  } catch (e) {
    console.error('Failed to save competency session', e);
  }
}
