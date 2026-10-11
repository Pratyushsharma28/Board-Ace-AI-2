export type EducationBoard = 'CBSE' | 'CISCE' | 'STATE';
export type GradeClass = '12';

export type SubjectId = 'mathematics' | 'physics' | 'chemistry';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'mixed';

export type QuestionType = 'mcq' | 'numerical' | 'conceptual' | 'mixed' | 'assertion_reason' | 'case_based';

export type QuizMode = 'practice' | 'exam';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  subject: string;
  chapter: string;
  topic: string;
  difficulty: DifficultyLevel;
  questionType: QuestionType;
  casePassage?: string;
  assertion?: string;
  reason?: string;
  pitfall?: string;
  boardTip?: string;
  formula?: string;
  solutionSteps?: string[];
  source?: 'curated' | 'ai';
  questionHi?: string;
  optionsHi?: string[];
  correctAnswerHi?: string;
  explanationHi?: string;
  pitfallHi?: string;
  boardTipHi?: string;
  validationMetadata?: {
    passedChecks: string[];
    warnings: string[];
    confidenceScore: number;
  };
}

export type MistakeCategory =
  | 'Conceptual misunderstanding'
  | 'Calculation error'
  | 'Formula selection'
  | 'Unit or sign error'
  | 'Incorrect factual understanding'
  | 'Needs further review'
  | 'Review this concept';

export interface QuizConfig {
  board: EducationBoard;
  grade: GradeClass;
  subject: SubjectId;
  chapter: string;
  difficulty: DifficultyLevel;
  questionCount: number;
  questionType: QuestionType;
  mode: QuizMode;
  useAi: boolean;
}

export interface QuizAttempt {
  id: string;
  quizConfig: QuizConfig;
  questions: Question[];
  userAnswers: Record<string, string>; // questionId -> selectedOption
  flaggedQuestions: Record<string, boolean>; // questionId -> boolean
  timeSpentSeconds: number;
  completedAt: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  topicBreakdown: Record<string, { total: number; correct: number; percentage: number }>;
  weakTopics: string[];
}

export interface MistakeAnalysis {
  coreConcept: string;
  whyCorrectIsRight: string;
  whySelectedIsWrong: string;
  memoryAnchor?: string;
  followUpQuestion?: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
}

export interface ChapterInfo {
  id: string;
  name: string;
  unit: string;
  weightageEstimate: string; // e.g. "8-10 marks"
  topics: string[];
}

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  code: string;
  totalChapters: number;
  description: string;
  iconName: string;
  chapters: ChapterInfo[];
}

export type AppView = 'landing' | 'dashboard' | 'quiz' | 'results' | 'analytics';
