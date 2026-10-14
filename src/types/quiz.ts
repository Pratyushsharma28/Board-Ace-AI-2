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
  examDurationMinutes?: number;
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

export type AppView = 'landing' | 'dashboard' | 'quiz' | 'results' | 'analytics' | 'tutor' | 'smart-practice' | 'revision';

export type RevisionSaveReason = 'incorrect_answer' | 'bookmarked' | 'manual_save' | 'recommended';

export interface RevisionItem {
  id: string; // question id
  question: Question;
  savedReason: RevisionSaveReason;
  subject: SubjectId;
  chapter: string;
  topic: string;
  savedAt: string; // ISO string
  lastAttemptedAt?: string;
  lastReviewedAt?: string;
  reviewCount: number; // times revised/retried
  isRevised: boolean;
  revisedAt?: string;
  srsStage: number; // 0 = Due now, 1 = 1 day, 2 = 3 days, 3 = 7 days, 4 = Mastered (14 days)
  nextReviewDate: string; // ISO date string
  incorrectCount: number; // times answered wrong
  userLastWrongAnswer?: string;
  userLastMistakeCategory?: MistakeCategory;
  notes?: string;
}

export interface RevisionSummary {
  totalItems: number;
  dueCount: number;
  masteredCount: number;
  incorrectSavedCount: number;
  bookmarkedCount: number;
  subjectCounts: {
    mathematics: number;
    physics: number;
    chemistry: number;
  };
}

export interface SmartPracticeRecommendation {
  id: string;
  subject: SubjectId;
  chapter: string;
  topic: string;
  targetDifficulty: DifficultyLevel;
  reasonType: 'repeated_mistakes' | 'low_accuracy' | 'mastery_progression' | 'unattempted_high_weightage';
  reasonHeadline: string;
  reasonHeadlineHi: string;
  reasonDetail: string;
  reasonDetailHi: string;
  metrics: {
    attempted: number;
    correct: number;
    accuracy: number | null;
    recentTrend?: 'declining' | 'improving' | 'steady' | 'new';
  };
  recommendedQuestions: Question[];
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  subject?: SubjectId;
  action?: 'explain_simply' | 'another_example' | 'explain_formula' | 'summarize';
  imagePreview?: string;
}

export interface SavedDoubt {
  id: string;
  subject: SubjectId;
  question: string;
  answer: string;
  savedAt: string;
  imagePreview?: string;
}
