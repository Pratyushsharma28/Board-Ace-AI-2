import React, { useState, useEffect, useCallback } from 'react';
import { Question, QuizConfig } from '../types/quiz';
import { useLanguage } from '../context/LanguageContext';
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
  Languages
} from 'lucide-react';

interface QuizInterfaceProps {
  questions: Question[];
  config: QuizConfig;
  onSubmitQuiz: (answers: Record<string, string>, flagged: Record<string, boolean>, timeSpentSeconds: number) => void;
  onExit: () => void;
  onOpenMistakeDetective: (question: Question, selectedAnswer: string) => void;
}

export const QuizInterface: React.FC<QuizInterfaceProps> = ({
  questions,
  config,
  onSubmitQuiz,
  onExit,
  onOpenMistakeDetective,
}) => {
  const { language, t, translateSubject, translateChapter } = useLanguage();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    // 2 minutes per question in Exam mode
    return config.mode === 'exam' ? questions.length * 120 : 0;
  });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

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

  // Overall timer
  useEffect(() => {
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
  }, [config.mode]);

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
    onSubmitQuiz(answers, flagged, elapsedSeconds);
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

  // Format Timer string
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Determine localized text for current question
  const isHindiQ = questionLang === 'hi' && Boolean(currentQ.questionHi);
  const displayQText = isHindiQ ? currentQ.questionHi! : currentQ.question;
  const displayOptions = isHindiQ && currentQ.optionsHi && currentQ.optionsHi.length === currentQ.options.length
    ? currentQ.optionsHi
    : currentQ.options;
  const displayCorrectAnswer = isHindiQ && currentQ.correctAnswerHi
    ? currentQ.correctAnswerHi
    : currentQ.correctAnswer;
  const displayExplanation = isHindiQ && currentQ.explanationHi
    ? currentQ.explanationHi
    : currentQ.explanation;
  const displayPitfall = isHindiQ && currentQ.pitfallHi
    ? currentQ.pitfallHi
    : currentQ.pitfall;
  const displayBoardTip = isHindiQ && currentQ.boardTipHi
    ? currentQ.boardTipHi
    : currentQ.boardTip;

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
                {config.board} Class {config.grade} · {config.mode === 'exam' ? t.quiz.examModeBadge : t.quiz.practiceModeBadge}
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
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-extrabold text-xs">
                    {t.quiz.questionLabel} {currentIndex + 1} {t.quiz.of} {questions.length}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                    • {currentQ.topic}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleFlag}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isFlagged
                        ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-600 text-amber-600' : ''}`} />
                    <span>{isFlagged ? t.quiz.flagged : t.quiz.flagReview}</span>
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
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-700">
                {t.quiz.questionPalette}
              </h3>

              {/* Status Indicator Legend */}
              <div className="grid grid-cols-3 gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>{t.quiz.paletteAttempted}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <span>{t.quiz.paletteUnattempted}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span>{t.quiz.paletteFlagged}</span>
                </div>
              </div>

              {/* Question Number Buttons Grid */}
              <div className="grid grid-cols-5 gap-2 pt-2">
                {questions.map((q, idx) => {
                  const answered = Boolean(answers[q.id]);
                  const isFlag = Boolean(flagged[q.id]);
                  const isCur = idx === currentIndex;

                  let btnBg = 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600';
                  if (answered) {
                    btnBg = 'bg-emerald-500 text-white font-bold hover:bg-emerald-600';
                  }
                  if (isFlag) {
                    btnBg = 'bg-amber-400 text-amber-950 font-bold hover:bg-amber-500';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-10 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center cursor-pointer ${btnBg} ${
                        isCur ? 'ring-2 ring-indigo-600 dark:ring-indigo-400 ring-offset-2 dark:ring-offset-slate-800' : ''
                      }`}
                    >
                      <span>{idx + 1}</span>
                      {isFlag && answered && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-700" />
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
                    {Object.keys(answers).length} / {questions.length} ({Math.round((Object.keys(answers).length / questions.length) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(Object.keys(answers).length / questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-100 dark:shadow-none active:scale-98 transition-all cursor-pointer"
              >
                {t.quiz.submitQuiz}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.quiz.confirmSubmitTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.quiz.confirmSubmitDesc}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-slate-400 font-medium">{t.quiz.paletteAttempted}</div>
                <div className="font-bold text-slate-900 dark:text-white text-base">
                  {Object.keys(answers).length} / {questions.length}
                </div>
              </div>
              <div>
                <div className="text-slate-400 font-medium">{t.quiz.paletteFlagged}</div>
                <div className="font-bold text-amber-600 dark:text-amber-400 text-base">
                  {Object.values(flagged).filter(Boolean).length}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {t.quiz.cancel}
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {t.quiz.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
