import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useClass } from '../context/ClassContext';
import { getCuratedQuestions } from '../data/sampleQuestions';
import {
  saveAttempt,
  getActiveExamState,
  clearActiveExamState,
  ActiveExamState,
} from '../utils/storage';
import { saveToRevision } from '../utils/revisionEngine';
import { classifyMistake } from '../utils/mistakeDetective';
import {
  SubjectId,
  QuizConfig,
  Question,
  QuizAttempt,
} from '../types/quiz';
import { QuizInterface } from '../components/QuizInterface';
import { ResultsDashboard } from '../components/ResultsDashboard';
import {
  Clock,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Trash2,
  ArrowRight,
  FileText,
} from 'lucide-react';

export const ExamPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language, t, translateSubject } = useLanguage();
  const { grade, subjects, gradeLabel } = useClass();

  const resumeRequested = searchParams.get('resume') === 'true';

  // Config form state
  const [subject, setSubject] = useState<SubjectId>(() => subjects[0]?.id || 'mathematics');

  useEffect(() => {
    if (!subjects.some((s) => s.id === subject)) {
      setSubject(subjects[0]?.id || 'mathematics');
    }
  }, [grade, subjects]);

  const [paperType, setPaperType] = useState<'standard' | 'full'>('standard'); // standard: 15 Qs (30m), full: 30 Qs (60m)
  const [rulesAcknowledged, setRulesAcknowledged] = useState(false);

  // Active exam state
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [activeConfig, setActiveConfig] = useState<QuizConfig | null>(null);
  const [initialState, setInitialState] = useState<{
    currentIndex?: number;
    answers?: Record<string, string>;
    flagged?: Record<string, boolean>;
    secondsRemaining?: number;
    elapsedSeconds?: number;
  } | undefined>(undefined);

  // Results state
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);

  // Saved exam detection
  const [savedExam, setSavedExam] = useState<ActiveExamState | null>(() => getActiveExamState());

  // Auto-resume if query param requested
  useEffect(() => {
    if (resumeRequested && savedExam) {
      handleResumeExam();
    }
  }, [resumeRequested]);

  const handleResumeExam = () => {
    if (!savedExam) return;
    setActiveConfig(savedExam.config);
    setActiveQuestions(savedExam.questions);
    setInitialState({
      currentIndex: savedExam.currentIndex,
      answers: savedExam.answers,
      flagged: savedExam.flagged,
      secondsRemaining: savedExam.secondsRemaining,
      elapsedSeconds: savedExam.elapsedSeconds,
    });
    setSearchParams({});
  };

  const handleDiscardSavedExam = () => {
    clearActiveExamState();
    setSavedExam(null);
  };

  const handleStartExam = () => {
    const qCount = paperType === 'standard' ? 15 : 30;
    const questions = getCuratedQuestions(subject, undefined, qCount, 'mixed', grade);

    const config: QuizConfig = {
      board: 'CBSE',
      grade,
      subject,
      chapter: 'all',
      difficulty: 'mixed',
      questionCount: questions.length,
      questionType: 'mixed',
      mode: 'exam',
      useAi: false,
    };

    setActiveConfig(config);
    setActiveQuestions(questions);
    setInitialState(undefined);
  };

  const handleSubmitExam = (
    answers: Record<string, string>,
    flagged: Record<string, boolean>,
    timeSpentSeconds: number
  ) => {
    if (!activeConfig || activeQuestions.length === 0) return;

    let score = 0;
    const topicBreakdown: Record<string, { total: number; correct: number; percentage: number }> = {};

    activeQuestions.forEach((q) => {
      const isCorrect = answers[q.id] === q.correctAnswer;
      if (isCorrect) score += 1;

      const topicName = q.topic || 'Core Concept';
      if (!topicBreakdown[topicName]) {
        topicBreakdown[topicName] = { total: 0, correct: 0, percentage: 0 };
      }
      topicBreakdown[topicName].total += 1;
      if (isCorrect) {
        topicBreakdown[topicName].correct += 1;
      }
    });

    Object.keys(topicBreakdown).forEach((tName) => {
      const stat = topicBreakdown[tName];
      stat.percentage = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
    });

    const weakTopics = Object.keys(topicBreakdown).filter((tName) => topicBreakdown[tName].percentage < 75);
    const accuracy = Math.round((score / activeQuestions.length) * 100);

    const attempt: QuizAttempt = {
      id: `exam-${Date.now()}`,
      quizConfig: activeConfig,
      questions: activeQuestions,
      userAnswers: answers,
      flaggedQuestions: flagged,
      timeSpentSeconds,
      completedAt: new Date().toISOString(),
      score,
      totalQuestions: activeQuestions.length,
      accuracy,
      topicBreakdown,
      weakTopics,
    };

    saveAttempt(attempt);

    // Save incorrect questions into Smart Revision
    activeQuestions.forEach((q) => {
      const userAns = answers[q.id];
      if (userAns && userAns !== q.correctAnswer) {
        saveToRevision(q, 'incorrect_answer', {
          wrongAnswer: userAns,
          mistakeCategory: classifyMistake(q, userAns),
        });
      }
    });

    clearActiveExamState();
    setSavedExam(null);
    setCurrentAttempt(attempt);
    setActiveQuestions([]);
  };

  // 1. Result screen
  if (currentAttempt) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <ResultsDashboard
          attempt={currentAttempt}
          onRetryQuiz={() => {
            setCurrentAttempt(null);
            handleStartExam();
          }}
          onPracticeWeakTopics={() => navigate('/practice')}
          onOpenMistakeDetective={() => {}}
          onOpenRevision={() => navigate('/revision')}
          onHome={() => {
            setCurrentAttempt(null);
            setActiveQuestions([]);
          }}
        />
      </div>
    );
  }

  // 2. Running Exam interface
  if (activeQuestions.length > 0 && activeConfig) {
    return (
      <div className="animate-fadeIn">
        <QuizInterface
          questions={activeQuestions}
          config={activeConfig}
          onSubmitQuiz={handleSubmitExam}
          onExit={() => {
            setActiveQuestions([]);
            setActiveConfig(null);
            setSavedExam(getActiveExamState());
          }}
          onOpenMistakeDetective={() => {}}
          initialState={initialState}
        />
      </div>
    );
  }

  // 3. Exam Setup Screen
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
          <Clock className="w-4 h-4" />
          <span>{gradeLabel.toUpperCase()} EXAMINATION PROTOCOL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {language === 'hi' ? 'बोर्ड परीक्षा सिम्युलेटर' : 'Board Exam Simulator'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {language === 'hi'
            ? 'सख्त समय सीमा, प्रश्न पैलेट और स्वतः मूल्यांकन के साथ प्रामाणिक बोर्ड परीक्षा माहौल।'
            : 'Standardized timed board mock paper with navigation palette, question flags, and instant official evaluation.'}
        </p>
      </div>

      {/* In-Progress Exam Banner */}
      {savedExam && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-amber-900 dark:text-amber-200">
                {language === 'hi' ? 'पूर्व सुरक्षित परीक्षा सत्र उपलब्ध है' : 'Preserved Exam Session Available'}
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                {savedExam.config.subject.toUpperCase()} · {savedExam.questions.length} Questions ·{' '}
                {Math.floor(savedExam.secondsRemaining / 60)} minutes remaining
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResumeExam}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'सत्र पुनः शुरू करें' : 'Resume Session'}</span>
            </button>
            <button
              onClick={handleDiscardSavedExam}
              className="p-2 text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-white rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors cursor-pointer"
              title="Discard saved exam"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Exam Configuration Deck */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-8 shadow-xs">
        {/* Step 1: Select Subject */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {language === 'hi' ? '1. परीक्षा विषय चुनें' : '1. Select Exam Subject'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {subjects.map((sub) => {
              const isSelected = subject === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSubject(sub.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-600 dark:border-amber-400 bg-amber-50/60 dark:bg-amber-950/40 ring-2 ring-amber-600/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
                    CODE {sub.code}
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {translateSubject(sub.id)}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Full Syllabus Mock
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Paper Duration & Length */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {language === 'hi' ? '2. परीक्षा प्रारूप एवं समयावधि' : '2. Paper Format & Duration'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaperType('standard')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                paperType === 'standard'
                  ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Standard Section A Board Mock
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                15 Questions · 30 Minutes · 1 Mark each
              </div>
              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-2">
                Ideal for daily speed &amp; accuracy drills
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaperType('full')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                paperType === 'full'
                  ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Full-Length Board Examination Drill
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                30 Questions · 60 Minutes · 1 Mark each
              </div>
              <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-2">
                Simulates real examination endurance
              </div>
            </button>
          </div>
        </div>

        {/* Official CBSE Instructions */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>CBSE Examination Guidelines (Session 2026–27)</span>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
            <li>All questions carry 1 mark. There is no negative marking for incorrect attempts.</li>
            <li>Use the question palette to jump between questions or mark tricky items for review.</li>
            <li>Your exam progress is automatically saved every 5 seconds. If you accidentally refresh, you will not lose your answers.</li>
            <li>Once the timer reaches 00:00, your paper will automatically submit for evaluation.</li>
          </ul>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <input
              type="checkbox"
              id="ack"
              checked={rulesAcknowledged}
              onChange={(e) => setRulesAcknowledged(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="ack" className="text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer">
              I have read and agree to follow official board examination conditions.
            </label>
          </div>
        </div>

        {/* Start Button */}
        <div>
          <button
            type="button"
            disabled={!rulesAcknowledged}
            onClick={handleStartExam}
            className="w-full py-4 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-extrabold text-sm sm:text-base rounded-2xl shadow-md disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Clock className="w-5 h-5 text-amber-400 dark:text-amber-600" />
            <span>{language === 'hi' ? 'समयबद्ध परीक्षा शुरू करें' : 'Begin Timed Board Exam'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
