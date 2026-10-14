import React, { useState } from 'react';
import { QuizAttempt, Question } from '../types/quiz';
import { useLanguage } from '../context/LanguageContext';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  Search,
  Flag,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Target,
  Bookmark,
  ShieldCheck,
  Brain,
} from 'lucide-react';
import { MistakeDetectiveSection } from './MistakeDetectiveSection';
import { toggleBookmark, isQuestionBookmarked } from '../utils/storage';

interface ResultsDashboardProps {
  attempt: QuizAttempt;
  onRetryQuiz: () => void;
  onPracticeWeakTopics: (weakTopics: string[]) => void;
  onOpenMistakeDetective: (question: Question, selectedAnswer: string) => void;
  onOpenRevision?: () => void;
  onHome: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  attempt,
  onRetryQuiz,
  onPracticeWeakTopics,
  onOpenMistakeDetective,
  onOpenRevision,
  onHome,
}) => {
  const { language, t, translateSubject, translateChapter } = useLanguage();

  const answeredCount = Object.keys(attempt.userAnswers).length;
  const unansweredCount = attempt.totalQuestions - answeredCount;
  const correctCount = attempt.score;
  const incorrectCount = attempt.totalQuestions - attempt.score;
  const incorrectAttemptedCount = Math.max(0, answeredCount - correctCount);

  const [activeTab, setActiveTab] = useState<'mistake-detective' | 'all-questions' | 'radar'>(
    incorrectCount > 0 ? 'mistake-detective' : 'all-questions'
  );
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'unanswered' | 'flagged'>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    attempt.questions.forEach(q => {
      map[q.id] = isQuestionBookmarked(q.id);
    });
    return map;
  });

  const handleToggleBookmark = (q: Question) => {
    const nowBookmarked = toggleBookmark(q);
    setBookmarkedMap(prev => ({
      ...prev,
      [q.id]: nowBookmarked,
    }));
  };

  const toggleExpand = (id: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatSeconds = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const filteredQuestions = attempt.questions.filter(q => {
    const userAns = attempt.userAnswers[q.id];
    const isAnswered = Boolean(userAns);
    const isCorrect = userAns === q.correctAnswer;
    const isFlagged = attempt.flaggedQuestions[q.id];

    if (filter === 'incorrect') return isAnswered && !isCorrect;
    if (filter === 'unanswered') return !isAnswered;
    if (filter === 'flagged') return isFlagged;
    return true;
  });

  // Calculate Weak Topic Radar for this specific attempt
  const topicBreakdownEntries = Object.entries(attempt.topicBreakdown || {});
  const strongTopics = topicBreakdownEntries.filter(([_, stat]) => stat.percentage > 75);
  const practiseTopics = topicBreakdownEntries.filter(([_, stat]) => stat.percentage >= 50 && stat.percentage <= 75);
  const weakTopics = topicBreakdownEntries.filter(([_, stat]) => stat.percentage < 50);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t.results.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              CBSE Class 12 · {translateSubject(attempt.quizConfig.subject)} · {translateChapter(attempt.quizConfig.chapter)}
            </p>
          </div>
          <button
            onClick={onHome}
            className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl transition-all shadow-xs self-start sm:self-auto cursor-pointer"
          >
            ← {t.results.backToDashboard}
          </button>
        </div>

        {/* Simulated Board Exam Mode Header Banner */}
        {attempt.quizConfig.mode === 'exam' && (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-300 dark:border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-[11px] font-bold uppercase tracking-wider">
                  {t.quiz.simulatedExamBadge}
                </div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {language === 'hi' ? 'सीबीएसई कक्षा 12 परीक्षा सिम्युलेशन परिणाम' : 'CBSE Class 12 Examination Simulation Diagnostic'}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {t.results.simulatedExamNotice}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 text-[11px] font-bold text-amber-800 dark:text-amber-200 font-mono">
                {attempt.quizConfig.examDurationMinutes ? `${attempt.quizConfig.examDurationMinutes}m allocated` : `${Math.round(attempt.questions.length * 2)}m allocated`}
              </div>
            </div>
          </div>
        )}

        {/* Auto-saved to Smart Revision Notice */}
        {incorrectAttemptedCount > 0 && (
          <div className="p-4 sm:p-5 rounded-3xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-indigo-900 dark:text-indigo-200 animate-fadeIn">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-sm block text-slate-900 dark:text-white">
                  {language === 'hi'
                    ? `${incorrectAttemptedCount} गलत प्रश्न स्मार्ट दोहराव में स्वतः सहेजे गए`
                    : `${incorrectAttemptedCount} incorrect questions auto-saved to Smart Revision`}
                </span>
                <span className="text-slate-600 dark:text-slate-300 text-xs">
                  {language === 'hi'
                    ? 'अंतराल दोहराव (1d → 3d → 7d) के साथ तैयार। आप कभी भी पुनः अभ्यास कर सकते हैं।'
                    : 'Scheduled with spaced repetition (1d → 3d → 7d). Practice them anytime to master the concepts.'}
                </span>
              </div>
            </div>

            {onOpenRevision && (
              <button
                onClick={onOpenRevision}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'स्मार्ट दोहराव देखें' : 'Open Smart Revision'}</span>
              </button>
            )}
          </div>
        )}

        {/* Hero Scorecard Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main Score Box */}
          <div className="md:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 flex items-center gap-6 shadow-xs transition-colors">
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={attempt.accuracy >= 75 ? 'text-emerald-500' : attempt.accuracy >= 50 ? 'text-amber-500' : 'text-rose-500'}
                  strokeDasharray={`${attempt.accuracy}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
                  {attempt.accuracy}%
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold">
                  {t.results.accuracyLabel}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t.results.scoreLabel}
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                {attempt.score} <span className="text-lg text-slate-400 dark:text-slate-500 font-normal">/ {attempt.totalQuestions}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                {attempt.accuracy >= 80 ? t.results.gradeGreat : attempt.accuracy >= 50 ? t.results.gradeGood : t.results.gradeNeedsWork}
              </p>

              {/* Status Breakdown Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {t.results.correctCount}: {correctCount}
                </span>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  {t.results.incorrectCount}: {incorrectAttemptedCount}
                </span>
                {unansweredCount > 0 && (
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600">
                    {t.results.unansweredCount}: {unansweredCount}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Time spent */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between shadow-xs transition-colors">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{t.results.timeSpent}</span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums font-mono">
              {formatSeconds(attempt.timeSpentSeconds)}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              ~{Math.round(attempt.timeSpentSeconds / attempt.totalQuestions)}s {language === 'hi' ? 'प्रति प्रश्न' : 'per question'}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between shadow-xs transition-colors">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{language === 'hi' ? 'पुनः प्रयास' : 'Next Step'}</span>
            </div>
            <button
              onClick={onRetryQuiz}
              className="w-full py-2.5 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.results.retakeBtn}</span>
            </button>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 text-center">
              {language === 'hi' ? 'समान प्रश्नों का नया सेट' : 'Fresh attempt with new values'}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          {incorrectCount > 0 && (
            <button
              onClick={() => setActiveTab('mistake-detective')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'mistake-detective'
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>{t.results.analyzeMistakeBtn} ({incorrectCount})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('radar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{t.results.radarHeading}</span>
          </button>

          <button
            onClick={() => setActiveTab('all-questions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'all-questions'
                ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.results.filterAll} ({attempt.questions.length})</span>
          </button>
        </div>

        {/* TAB 1: WEAK TOPIC RADAR BREAKDOWN FOR THIS ATTEMPT */}
        {activeTab === 'radar' && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn transition-colors">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>{t.results.radarHeading}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.radar.formulaText}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Strong Topics */}
              <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t.results.strongTopicsTitle}</span>
                </div>
                {strongTopics.length > 0 ? (
                  <ul className="space-y-2">
                    {strongTopics.map(([topic, stat]) => (
                      <li key={topic} className="text-xs text-slate-700 dark:text-slate-200 flex items-center justify-between">
                        <span className="truncate pr-2 font-medium">• {topic}</span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 shrink-0">{stat.percentage}%</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">{language === 'hi' ? 'कोई मजबूत विषय नहीं' : 'No topics in this tier yet'}</p>
                )}
              </div>

              {/* Topics to Practise */}
              <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>{t.results.practiseTopicsTitle}</span>
                </div>
                {practiseTopics.length > 0 ? (
                  <ul className="space-y-2">
                    {practiseTopics.map(([topic, stat]) => (
                      <li key={topic} className="text-xs text-slate-700 dark:text-slate-200 flex items-center justify-between">
                        <span className="truncate pr-2 font-medium">• {topic}</span>
                        <span className="font-bold text-amber-700 dark:text-amber-400 shrink-0">{stat.percentage}%</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">{language === 'hi' ? 'कोई विषय नहीं' : 'None in this category'}</p>
                )}
              </div>

              {/* Weak Topics */}
              <div className="bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>{t.results.weakTopicsTitle}</span>
                </div>
                {weakTopics.length > 0 ? (
                  <ul className="space-y-2">
                    {weakTopics.map(([topic, stat]) => (
                      <li key={topic} className="text-xs text-slate-700 dark:text-slate-200 flex items-center justify-between">
                        <span className="truncate pr-2 font-medium">• {topic}</span>
                        <span className="font-bold text-rose-700 dark:text-rose-400 shrink-0">{stat.percentage}%</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">{language === 'hi' ? 'कोई कमज़ोर टॉपिक नहीं!' : 'No weak topics detected!'}</p>
                )}
              </div>
            </div>

            {weakTopics.length > 0 && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onPracticeWeakTopics(weakTopics.map(([t]) => t))}
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.radar.practiceAllWeakBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MISTAKE DETECTIVE FORENSICS */}
        {activeTab === 'mistake-detective' && (
          <div className="space-y-6 animate-fadeIn">
            <MistakeDetectiveSection
              attempt={attempt}
              onOpenModal={onOpenMistakeDetective}
            />
          </div>
        )}

        {/* TAB 3: ALL QUESTIONS REVIEW */}
        {activeTab === 'all-questions' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  filter === 'all'
                    ? 'bg-slate-900 dark:bg-indigo-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {t.results.filterAll} ({attempt.questions.length})
              </button>
              <button
                onClick={() => setFilter('incorrect')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  filter === 'incorrect'
                    ? 'bg-rose-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {t.results.filterIncorrect} ({incorrectAttemptedCount})
              </button>
              {unansweredCount > 0 && (
                <button
                  onClick={() => setFilter('unanswered')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    filter === 'unanswered'
                      ? 'bg-slate-700 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {t.results.filterUnanswered} ({unansweredCount})
                </button>
              )}
              <button
                onClick={() => setFilter('flagged')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                  filter === 'flagged'
                    ? 'bg-amber-500 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {t.results.filterFlagged} ({attempt.questions.filter(q => attempt.flaggedQuestions[q.id]).length})
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredQuestions.map((q, idx) => {
                const userAns = attempt.userAnswers[q.id];
                const isCorrect = userAns === q.correctAnswer;
                const isExpanded = expandedQuestions[q.id] || false;

                const displayQ = language === 'hi' && q.questionHi ? q.questionHi : q.question;
                const displayExpl = language === 'hi' && q.explanationHi ? q.explanationHi : q.explanation;

                return (
                  <div
                    key={q.id}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4 shadow-xs transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                              isCorrect ? 'bg-emerald-500' : !userAns ? 'bg-slate-400 dark:bg-slate-600' : 'bg-rose-500'
                            }`}
                          >
                            {isCorrect ? '✓' : !userAns ? '—' : '✗'}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {t.quiz.questionLabel} {idx + 1}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">
                            • {q.topic}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                            {q.source === 'curated' ? t.quiz.curatedSourceBadge : t.quiz.aiSourceBadge}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 uppercase">
                            {q.difficulty}
                          </span>
                          {!userAns && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                              {language === 'hi' ? 'अनुत्तरित (0 अंक)' : 'Unanswered (0 marks)'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 pt-1 leading-relaxed">
                          {displayQ}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleToggleBookmark(q)}
                          title={bookmarkedMap[q.id] ? t.quiz.bookmarked : t.quiz.bookmark}
                          aria-label={bookmarkedMap[q.id] ? t.quiz.bookmarked : t.quiz.bookmark}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            bookmarkedMap[q.id]
                              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70'
                              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarkedMap[q.id] ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => toggleExpand(q.id)}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className={`p-3 rounded-xl border ${
                        !userAns
                          ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700'
                          : isCorrect
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                      }`}>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">{language === 'hi' ? 'आपका उत्तर:' : 'Your Answer:'} </span>
                        <span className={isCorrect ? 'font-bold text-emerald-700 dark:text-emerald-400' : !userAns ? 'font-bold text-slate-600 dark:text-slate-400 italic' : 'font-bold text-rose-700 dark:text-rose-400'}>
                          {userAns || (language === 'hi' ? '(अनुत्तरित - हल नहीं किया)' : '(Unanswered - Skipped)')}
                        </span>
                      </div>
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <span className="text-emerald-700 dark:text-emerald-300 font-medium">{language === 'hi' ? 'प्रमाणित उत्तर कुंजी:' : 'Verified Answer Key:'} </span>
                        <span className="font-bold text-emerald-900 dark:text-emerald-100">
                          {q.correctAnswer}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Explanation */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-3 text-xs text-slate-700 dark:text-slate-200 animate-fadeIn">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white mb-1">{t.quiz.officialExplanation}</div>
                          <p className="leading-relaxed whitespace-pre-line text-slate-600 dark:text-slate-300">{displayExpl}</p>
                        </div>

                        {!isCorrect && userAns && (
                          <button
                            onClick={() => onOpenMistakeDetective(q, userAns)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 rounded-lg font-bold border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
                          >
                            <Search className="w-3.5 h-3.5" />
                            <span>{t.results.analyzeMistakeBtn}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
