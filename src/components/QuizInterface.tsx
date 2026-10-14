import React, { useState, useEffect, useCallback } from 'react';
import { Question, QuizConfig } from '../types/quiz';
import { useLanguage } from '../context/LanguageContext';
import {
  toggleBookmark,
  isQuestionBookmarked,
  saveQuestionReport,
  ReportReason,
  QuestionReport,
  saveActiveExamState,
  clearActiveExamState,
} from '../utils/storage';
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Search,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  Languages,
  Bookmark,
  AlertOctagon,
  MessageSquare,
  ShieldCheck,
  FileText,
  CheckSquare,
  Info,
  ListFilter,
} from 'lucide-react';

interface QuizInterfaceProps {
  questions: Question[];
  config: QuizConfig;
  onSubmitQuiz: (answers: Record<string, string>, flagged: Record<string, boolean>, timeSpentSeconds: number) => void;
  onExit: () => void;
  onOpenMistakeDetective: (question: Question, selectedAnswer: string) => void;
  initialState?: {
    currentIndex?: number;
    answers?: Record<string, string>;
    flagged?: Record<string, boolean>;
    secondsRemaining?: number;
    elapsedSeconds?: number;
  };
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({
  questions,
  config,
  onSubmitQuiz,
  onExit,
  onOpenMistakeDetective,
  initialState,
}) => {
  const { language, t, translateSubject, translateChapter } = useLanguage();

  const [currentIndex, setCurrentIndex] = useState(initialState?.currentIndex ?? 0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialState?.answers ?? {});
  const [flagged, setFlagged] = useState<Record<string, boolean>>(initialState?.flagged ?? {});
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [hasAcknowledgedInstructions, setHasAcknowledgedInstructions] = useState<boolean>(
    Boolean(initialState) || config.mode !== 'exam'
  );
  const [instructionsAgreed, setInstructionsAgreed] = useState<boolean>(false);
  const [paletteFilter, setPaletteFilter] = useState<'all' | 'unattempted' | 'review'>('all');

  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    if (initialState?.secondsRemaining !== undefined) return initialState.secondsRemaining;
    if (config.mode === 'exam') {
      if (config.examDurationMinutes && config.examDurationMinutes > 0) {
        return config.examDurationMinutes * 60;
      }
      return questions.length * 120;
    }
    return 0;
  });
  const [elapsedSeconds, setElapsedSeconds] = useState(initialState?.elapsedSeconds ?? 0);

  // Bookmark State
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkToast, setBookmarkToast] = useState<string | null>(null);

  // Question Reporting Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState<ReportReason>('Incorrect Answer');
  const [reportComment, setReportComment] = useState('');
  const [reportToast, setReportToast] = useState<string | null>(null);

  // In-quiz question language toggle (defaults to global language)
  const [questionLang, setQuestionLang] = useState<'en' | 'hi'>(language);

  // Keep synced if global language changes
  useEffect(() => {
    setQuestionLang(language);
  }, [language]);

  const currentQ = questions[currentIndex];
  const isPractice = config.mode === 'practice';
  const selectedOption = answers[currentQ?.id] || null;
  const isAnswered = Boolean(selectedOption);
  const isFlagged = Boolean(flagged[currentQ?.id]);

  // Sync bookmark status when current question changes
  useEffect(() => {
    if (currentQ?.id) {
      setIsBookmarked(isQuestionBookmarked(currentQ.id));
    }
  }, [currentQ?.id]);

  // Continuously persist in-progress Exam state to localStorage
  useEffect(() => {
    if (config.mode === 'exam' && hasAcknowledgedInstructions && questions.length > 0) {
      saveActiveExamState({
        questions,
        config,
        currentIndex,
        answers,
        flagged,
        secondsRemaining,
        elapsedSeconds,
        savedAt: new Date().toISOString(),
      });
    }
  }, [config, questions, currentIndex, answers, flagged, secondsRemaining, elapsedSeconds, hasAcknowledgedInstructions]);

  // Overall timer - only runs once instructions are acknowledged in Exam mode
  useEffect(() => {
    if (config.mode === 'exam' && !hasAcknowledgedInstructions) return;

    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
      if (config.mode === 'exam') {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            // Auto submit when time is up
            handleFinalSubmit();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [config.mode, hasAcknowledgedInstructions]);

  const handleSelectOption = useCallback((option: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: option,
    }));
  }, [currentQ?.id]);

  const handleToggleFlag = useCallback(() => {
    setFlagged(prev => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  }, [currentQ?.id]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, questions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleFinalSubmit = () => {
    setShowConfirmSubmit(false);
    clearActiveExamState();
    onSubmitQuiz(answers, flagged, elapsedSeconds);
  };

  const handleToggleBookmark = () => {
    if (!currentQ) return;
    const nowBookmarked = toggleBookmark(currentQ);
    setIsBookmarked(nowBookmarked);
    setBookmarkToast(nowBookmarked ? t.quiz.bookmarked : (language === 'hi' ? 'बुकमार्क हटाया गया' : 'Bookmark removed'));
    setTimeout(() => setBookmarkToast(null), 3000);
  };

  const handleOpenReport = () => {
    setReportReason('Incorrect Answer');
    setReportComment('');
    setIsReportModalOpen(true);
  };

  const handleSaveReport = () => {
    if (!currentQ) return;
    const report: QuestionReport = {
      id: `rep-${Date.now()}`,
      questionId: currentQ.id,
      questionText: currentQ.question,
      subject: currentQ.subject,
      chapter: currentQ.chapter,
      reason: reportReason,
      comment: reportComment.trim() || undefined,
      reportedAt: new Date().toISOString(),
    };
    saveQuestionReport(report);
    setIsReportModalOpen(false);
    setReportToast(t.quiz.reportSavedToast);
    setTimeout(() => setReportToast(null), 3500);
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
        handlePrev();
      } else if (e.key === 'f' || e.key === 'F') {
        handleToggleFlag();
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentQ?.options[idx]) {
          handleSelectOption(currentQ.options[idx]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleToggleFlag, handleSelectOption, currentQ]);

  const handleJumpToUnanswered = () => {
    setShowConfirmSubmit(false);
    const unansIdx = questions.findIndex(q => !answers[q.id]);
    if (unansIdx !== -1) {
      setCurrentIndex(unansIdx);
    }
  };

  const handleJumpToFlagged = () => {
    setShowConfirmSubmit(false);
    const flagIdx = questions.findIndex(q => flagged[q.id]);
    if (flagIdx !== -1) {
      setCurrentIndex(flagIdx);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const flaggedCount = Object.values(flagged).filter(Boolean).length;

  // Format Timer string
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Determine localized text for current question
  const isHindiQ = questionLang === 'hi' && Boolean(currentQ?.questionHi);
  const displayQText = isHindiQ ? currentQ?.questionHi! : currentQ?.question;
  const displayOptions = isHindiQ && currentQ?.optionsHi && currentQ.optionsHi.length === currentQ.options.length
    ? currentQ.optionsHi
    : (currentQ?.options || []);
  const displayCorrectAnswer = isHindiQ && currentQ?.correctAnswerHi
    ? currentQ.correctAnswerHi
    : currentQ?.correctAnswer;
  const displayExplanation = isHindiQ && currentQ?.explanationHi
    ? currentQ.explanationHi
    : currentQ?.explanation;
  const displayPitfall = isHindiQ && currentQ?.pitfallHi
    ? currentQ.pitfallHi
    : currentQ?.pitfall;
  const displayBoardTip = isHindiQ && currentQ?.boardTipHi
    ? currentQ.boardTipHi
    : currentQ?.boardTip;

  // -------------------------------------------------------------
  // Examination Instructions Screen (Exam Mode First View)
  // -------------------------------------------------------------
  if (config.mode === 'exam' && !hasAcknowledgedInstructions) {
    const allocatedMinutes = config.examDurationMinutes && config.examDurationMinutes > 0
      ? config.examDurationMinutes
      : Math.round(questions.length * 2);

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 transition-colors flex flex-col justify-center">
        <div className="max-w-3xl mx-auto w-full bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden animate-fadeIn">
          {/* Instructions Header */}
          <div className="px-6 sm:px-8 py-6 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-amber-100">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.quiz.simulatedExamBadge}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {t.quiz.instructionsTitle}
              </h1>
              <p className="text-xs text-amber-100">
                {t.quiz.instructionsSubtitle} · {config.board} Class {config.grade}
              </p>
            </div>

            <button
              onClick={() => setQuestionLang(questionLang === 'en' ? 'hi' : 'en')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Languages className="w-4 h-4" />
              <span>{questionLang === 'en' ? 'हिंदी में पढ़ें' : 'Read in English'}</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Disclaimer notice */}
            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {t.quiz.instructionsDisclaimer}
              </p>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-400 font-medium uppercase">{t.quiz.instructionsItemSubject}</div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                  {translateSubject(config.subject)}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {translateChapter(config.chapter)}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-400 font-medium uppercase">{t.quiz.instructionsItemTotalQuestions}</div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {questions.length} Qs
                </div>
                <div className="text-[10px] text-slate-500 uppercase">
                  {config.difficulty} {language === 'hi' ? 'स्तर' : 'level'}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-400 font-medium uppercase">{t.quiz.instructionsItemDuration}</div>
                <div className="text-sm font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                  {allocatedMinutes} {t.config.examDurationMinutesUnit}
                </div>
                <div className="text-[10px] text-slate-500">
                  ~{Math.round((allocatedMinutes * 60) / questions.length)}s {language === 'hi' ? 'प्रति प्रश्न' : 'per question'}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                <div className="text-[11px] text-slate-400 font-medium uppercase">{t.quiz.instructionsItemMarking}</div>
                <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                  +1 / 0
                </div>
                <div className="text-[10px] text-slate-500">
                  {language === 'hi' ? 'नेगेटिव मार्किंग नहीं' : 'No negative marking'}
                </div>
              </div>
            </div>

            {/* Question Palette Legend Explanation */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {t.quiz.questionPalette} - {language === 'hi' ? 'स्थिति संकेत' : 'Status Legend'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-md bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                  <span className="font-semibold">{t.quiz.paletteAttempted}</span>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-md bg-slate-300 dark:bg-slate-600" />
                  <span className="font-semibold">{t.quiz.paletteUnattempted}</span>
                </div>
                <div className="p-2.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Flag className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span className="font-semibold">{t.quiz.paletteFlagged}</span>
                </div>
                <div className="p-2.5 rounded-xl border border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-md bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">★</span>
                  <span className="font-semibold">{t.quiz.paletteAnsweredReview}</span>
                </div>
              </div>
            </div>

            {/* Rules List */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {t.quiz.instructionsItemRulesTitle}
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{t.quiz.instructionsRuleTimer}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ChevronRight className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{t.quiz.instructionsRuleNav}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t.quiz.instructionsRuleSave}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Flag className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{t.quiz.instructionsRuleReview}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{t.quiz.instructionsRuleSubmit}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>{t.quiz.instructionsRuleIntegrity}</span>
                </li>
              </ul>
            </div>

            {/* Agreement Checkbox */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-start gap-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <input
                type="checkbox"
                id="instructionsAgreement"
                checked={instructionsAgreed}
                onChange={(e) => setInstructionsAgreed(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-500 mt-0.5 cursor-pointer"
              />
              <label htmlFor="instructionsAgreement" className="text-xs text-slate-800 dark:text-slate-200 font-semibold cursor-pointer select-none leading-relaxed">
                {t.quiz.instructionsAcknowledge}
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={onExit}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {t.quiz.instructionsBackBtn}
              </button>

              <button
                onClick={() => setHasAcknowledgedInstructions(true)}
                disabled={!instructionsAgreed}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              >
                <span>{t.quiz.instructionsStartBtn}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-between transition-colors">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onExit}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs font-bold"
            >
              ← {language === 'hi' ? 'बाहर निकलें' : 'Exit'}
            </button>
            <div className="hidden sm:block h-4 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                {translateSubject(config.subject)} · {translateChapter(config.chapter)}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                {config.board} Class {config.grade} · {config.mode === 'exam' ? t.quiz.simulatedExamBadge : t.quiz.practiceModeBadge}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* In-quiz Question Language Switcher */}
            <button
              onClick={() => setQuestionLang(questionLang === 'en' ? 'hi' : 'en')}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
              title="Toggle question language"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{questionLang === 'en' ? t.quiz.viewInHindi : t.quiz.viewInEnglish}</span>
            </button>

            {/* Timer */}
            {config.mode === 'exam' ? (
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs sm:text-sm font-bold border ${
                  secondsRemaining < 300
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 animate-pulse'
                    : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(elapsedSeconds)}</span>
              </div>
            )}

            {/* Submit Quiz button */}
            <button
              onClick={() => setShowConfirmSubmit(true)}
              className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              {t.quiz.submitQuiz}
            </button>
          </div>
        </div>
      </div>

      {/* Exam Mode Time Alerts */}
      {config.mode === 'exam' && secondsRemaining > 0 && secondsRemaining <= 300 && secondsRemaining > 295 && (
        <div className="bg-amber-500 text-white text-xs font-bold text-center py-2 px-4 shadow-sm animate-fadeIn">
          {t.quiz.timeAlert5Min}
        </div>
      )}
      {config.mode === 'exam' && secondsRemaining > 0 && secondsRemaining <= 60 && secondsRemaining > 55 && (
        <div className="bg-rose-600 text-white text-xs font-bold text-center py-2 px-4 shadow-sm animate-pulse">
          {t.quiz.timeAlert1Min}
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Question Card & Explanations */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
              {/* Question Meta Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs">
                    {t.quiz.questionLabel} {currentIndex + 1} {t.quiz.of} {questions.length}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                    • {currentQ.topic}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                    {currentQ.source === 'curated' ? t.quiz.curatedSourceBadge : t.quiz.aiSourceBadge}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 uppercase">
                    {currentQ.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* Bookmark Question Button */}
                  <button
                    onClick={handleToggleBookmark}
                    title={isBookmarked ? t.quiz.bookmarked : t.quiz.bookmark}
                    aria-label={isBookmarked ? t.quiz.bookmarked : t.quiz.bookmark}
                    className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isBookmarked
                        ? 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-indigo-600 dark:fill-indigo-400 text-indigo-600 dark:text-indigo-400' : ''}`} />
                    <span className="hidden sm:inline">{isBookmarked ? t.quiz.bookmarked : t.quiz.bookmark}</span>
                  </button>

                  {/* Flag for Review */}
                  <button
                    onClick={handleToggleFlag}
                    title={isFlagged ? t.quiz.flagged : t.quiz.flagReview}
                    aria-label={isFlagged ? t.quiz.flagged : t.quiz.flagReview}
                    className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isFlagged
                        ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-600 text-amber-600' : ''}`} />
                    <span className="hidden sm:inline">{isFlagged ? t.quiz.flagged : t.quiz.flagReview}</span>
                  </button>

                  {/* Report Question Button */}
                  <button
                    onClick={handleOpenReport}
                    title={t.quiz.reportQuestion}
                    aria-label={t.quiz.reportQuestion}
                    className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">{t.quiz.reportQuestion}</span>
                  </button>
                </div>
              </div>

              {/* Case-based Passage if present */}
              {currentQ.casePassage && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
                  <div className="font-bold text-slate-900 dark:text-white not-italic mb-1">
                    {language === 'hi' ? 'केस संदर्भ / अनुच्छेद:' : 'Case Passage / Context:'}
                  </div>
                  {currentQ.casePassage}
                </div>
              )}

              {/* Question Text */}
              <div className="space-y-4">
                <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                  {displayQText}
                </p>

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === opt;
                    const optLabel = String.fromCharCode(65 + idx); // A, B, C, D
                    const displayOptText = displayOptions[idx] || opt;

                    let optionClasses = 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 text-slate-700 dark:text-slate-200';

                    if (isSelected) {
                      optionClasses = 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/70 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20 font-bold';
                    }

                    // In Practice mode with answer revealed
                    if (isPractice && isAnswered) {
                      const isCorrect = opt === currentQ.correctAnswer;
                      if (isCorrect) {
                        optionClasses = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 font-bold';
                      } else if (isSelected && !isCorrect) {
                        optionClasses = 'border-rose-400 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-200 font-semibold';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(opt)}
                        className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between group cursor-pointer ${optionClasses}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 group-hover:text-indigo-700 dark:group-hover:text-indigo-300'
                            }`}
                          >
                            {optLabel}
                          </span>
                          <span className="leading-snug">{displayOptText}</span>
                        </div>

                        {isPractice && isAnswered && opt === currentQ.correctAnswer && (
                          <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                        {isPractice && isAnswered && isSelected && opt !== currentQ.correctAnswer && (
                          <X className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Card Controls: Clear, Prev, Next */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    if (selectedOption) {
                      setAnswers(prev => {
                        const copy = { ...prev };
                        delete copy[currentQ.id];
                        return copy;
                      });
                    }
                  }}
                  disabled={!isAnswered}
                  className="px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                >
                  {t.quiz.clearChoice}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{t.quiz.previous}</span>
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={currentIndex === questions.length - 1}
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white font-bold text-xs hover:bg-slate-800 dark:hover:bg-indigo-700 disabled:opacity-30 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t.quiz.next}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Practice Mode: Instant Explanation & Mistake Detective trigger */}
            {isPractice && isAnswered && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-7 shadow-xs space-y-4 animate-fadeIn transition-colors">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{t.quiz.officialExplanation}</span>
                  </div>
                  {selectedOption && selectedOption !== currentQ.correctAnswer && (
                    <button
                      onClick={() => onOpenMistakeDetective(currentQ, selectedOption)}
                      className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>{t.landing.analyzeMistakeBtn}</span>
                    </button>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {displayExplanation}
                </p>

                {displayPitfall && (
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-950/50 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{t.quiz.pitfallWarning}</span>
                    </div>
                    <p>{displayPitfall}</p>
                  </div>
                )}

                {displayBoardTip && (
                  <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-indigo-800 dark:text-indigo-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t.quiz.boardTip}</span>
                    </div>
                    <p>{displayBoardTip}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Question Palette & Test Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-5 transition-colors">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ListFilter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{t.quiz.questionPalette}</span>
                </h3>
                <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                  {answeredCount}/{questions.length}
                </span>
              </div>

              {/* Status Counters */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300">{t.quiz.paletteAttempted}</div>
                  <div className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums">{answeredCount}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">{t.quiz.paletteUnattempted}</div>
                  <div className="text-base font-extrabold text-slate-700 dark:text-slate-300 tabular-nums">{unansweredCount}</div>
                </div>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                  <div className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300">{t.quiz.paletteFlagged}</div>
                  <div className="text-base font-extrabold text-amber-700 dark:text-amber-400 tabular-nums">{flaggedCount}</div>
                </div>
              </div>

              {/* Quick Filter Tabs for Question Palette */}
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900/80 rounded-xl text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setPaletteFilter('all')}
                  className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
                    paletteFilter === 'all'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {t.quiz.filterPaletteAll} ({questions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPaletteFilter('unattempted')}
                  className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
                    paletteFilter === 'unattempted'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {t.quiz.filterPaletteUnattempted} ({unansweredCount})
                </button>
                <button
                  type="button"
                  onClick={() => setPaletteFilter('review')}
                  className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
                    paletteFilter === 'review'
                      ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {t.quiz.filterPaletteReview} ({flaggedCount})
                </button>
              </div>

              {/* 4-State Status Indicator Legend */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>{t.quiz.paletteAttempted}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600" />
                  <span>{t.quiz.paletteUnattempted}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span>{t.quiz.paletteFlagged}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-purple-600" />
                  <span>{t.quiz.paletteAnsweredReview}</span>
                </div>
              </div>

              {/* Question Number Buttons Grid */}
              <div className="grid grid-cols-5 gap-2 pt-2">
                {questions.map((q, idx) => {
                  const answered = Boolean(answers[q.id]);
                  const isFlag = Boolean(flagged[q.id]);
                  const isCur = idx === currentIndex;

                  // 4 Distinct Visual States
                  let btnBg = 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600';

                  if (answered && !isFlag) {
                    btnBg = 'bg-emerald-500 text-white font-bold hover:bg-emerald-600 border border-emerald-600';
                  } else if (!answered && isFlag) {
                    btnBg = 'bg-amber-400 text-amber-950 font-bold hover:bg-amber-500 border border-amber-500';
                  } else if (answered && isFlag) {
                    btnBg = 'bg-purple-600 text-white font-bold hover:bg-purple-700 border border-purple-500 ring-1 ring-purple-300';
                  }

                  // Dim non-matching items if filtered
                  const isFilteredOut =
                    (paletteFilter === 'unattempted' && answered) ||
                    (paletteFilter === 'review' && !isFlag);

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-10 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center cursor-pointer ${btnBg} ${
                        isCur
                          ? 'ring-3 ring-indigo-600 dark:ring-indigo-400 ring-offset-2 dark:ring-offset-slate-800 scale-105 z-10'
                          : ''
                      } ${isFilteredOut ? 'opacity-30' : 'opacity-100'}`}
                      title={`Question ${idx + 1}: ${answered ? 'Answered' : 'Unanswered'}${isFlag ? ' (Flagged)' : ''}`}
                    >
                      <span>{idx + 1}</span>

                      {/* Flag Indicator for Review */}
                      {isFlag && (
                        <Flag className="w-2.5 h-2.5 absolute top-1 right-1 text-amber-200 fill-amber-300" />
                      )}

                      {/* Answered check mark dot */}
                      {answered && (
                        <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-white/90" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <span>{language === 'hi' ? 'प्रगति' : 'Progress'}</span>
                  <span>
                    {answeredCount} / {questions.length} ({Math.round((answeredCount / questions.length) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(answeredCount / questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 dark:shadow-none active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.quiz.submitQuiz}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Submit Modal with Itemized Safeguards */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              {config.mode === 'exam' && (
                <div className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold font-mono">
                  {formatTime(secondsRemaining)} {language === 'hi' ? 'शेष' : 'left'}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.quiz.confirmSubmitTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.quiz.confirmSubmitDesc}
              </p>
            </div>

            {/* Summary Grid */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-3 text-xs">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-slate-400 font-medium text-[11px]">{t.quiz.paletteAttempted}</div>
                <div className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base tabular-nums">
                  {answeredCount}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-slate-400 font-medium text-[11px]">{t.quiz.paletteUnattempted}</div>
                <div className="font-extrabold text-slate-700 dark:text-slate-300 text-base tabular-nums">
                  {unansweredCount}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-slate-400 font-medium text-[11px]">{t.quiz.paletteFlagged}</div>
                <div className="font-extrabold text-amber-600 dark:text-amber-400 text-base tabular-nums">
                  {flaggedCount}
                </div>
              </div>
            </div>

            {/* Warning Callout for Unanswered Questions */}
            {unansweredCount > 0 && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 rounded-2xl border border-rose-200 dark:border-rose-900/60 flex items-start justify-between gap-3 text-xs animate-fadeIn">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-rose-800 dark:text-rose-200 font-semibold leading-relaxed">
                    {t.quiz.warnUnanswered} ({unansweredCount} {language === 'hi' ? 'शेष' : 'remaining'})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleJumpToUnanswered}
                  className="px-3 py-1 bg-white dark:bg-rose-900 text-rose-700 dark:text-rose-200 rounded-lg font-bold hover:bg-rose-100 transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  {t.quiz.btnReviewUnanswered}
                </button>
              </div>
            )}

            {/* Note Callout for Flagged Review Questions */}
            {flaggedCount > 0 && (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/50 rounded-2xl border border-amber-200 dark:border-amber-900/60 flex items-start justify-between gap-3 text-xs animate-fadeIn">
                <div className="flex items-start gap-2.5">
                  <Flag className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-amber-800 dark:text-amber-200 font-semibold leading-relaxed">
                    {t.quiz.warnFlagged} ({flaggedCount} {language === 'hi' ? 'चिह्नित' : 'flagged'})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleJumpToFlagged}
                  className="px-3 py-1 bg-white dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-lg font-bold hover:bg-amber-100 transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  {t.quiz.btnReviewFlagged}
                </button>
              </div>
            )}

            {/* Submit Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {t.quiz.cancel}
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {t.quiz.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback for Bookmark / Report */}
      {(bookmarkToast || reportToast) && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border border-slate-700 dark:border-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{bookmarkToast || reportToast}</span>
          </div>
        </div>
      )}

      {/* Question Reporting Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-700 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {t.quiz.reportModalTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.quiz.reportModalDesc}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Question Snapshot */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
              <span className="font-bold text-slate-900 dark:text-white mr-1.5">
                Q{currentIndex + 1}:
              </span>
              {currentQ.question}
            </div>

            {/* Reason Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'hi' ? 'रिपोर्ट का कारण चुनें:' : 'Select Reason for Report:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(
                  [
                    { key: 'Incorrect Answer', label: t.quiz.reportReason1 },
                    { key: 'Incorrect Explanation', label: t.quiz.reportReason2 },
                    { key: 'Confusing Question', label: t.quiz.reportReason3 },
                    { key: 'Other', label: t.quiz.reportReason4 },
                  ] as const
                ).map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setReportReason(r.key)}
                    className={`p-2.5 rounded-xl border text-left font-medium transition-all cursor-pointer flex items-center gap-2 ${
                      reportReason === r.key
                        ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/60 text-rose-950 dark:text-rose-200 font-bold'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        reportReason === r.key
                          ? 'border-rose-600 bg-rose-600'
                          : 'border-slate-400'
                      }`}
                    >
                      {reportReason === r.key && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span className="truncate">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Comment */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'hi' ? 'अतिरिक्त टिप्पणी (वैकल्पिक):' : 'Additional Feedback (Optional):'}
              </label>
              <textarea
                value={reportComment}
                onChange={(e) => setReportComment(e.target.value)}
                placeholder={t.quiz.reportCommentPlaceholder}
                rows={2}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              />
            </div>

            {/* Local Storage Disclosure Notice */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/80 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>{t.quiz.reportNotice}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {t.quiz.reportCancelBtn}
              </button>
              <button
                type="button"
                onClick={handleSaveReport}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {t.quiz.reportSubmitBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
