import React from 'react';
import { CBSE_CLASS_12_SUBJECTS } from '../data/syllabus';
import { SubjectId, QuizAttempt } from '../types/quiz';
import { calculateAnalytics, getSavedAttempts } from '../utils/storage';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  BookOpen,
  Clock,
  Target,
  Trophy,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Flame,
  Search,
  Zap,
  BarChart2,
  TrendingUp,
  ShieldCheck,
  Award,
  HardDrive
} from 'lucide-react';

interface StudentDashboardProps {
  onStartQuiz: (prefill?: { subject?: SubjectId; chapter?: string; mode?: 'practice' | 'exam' }) => void;
  onPracticeWeakTopics: (weakTopics: string[]) => void;
  onReviewAttempt: (attempt: QuizAttempt) => void;
  onOpenMistakeDetective: (question: any, selectedAnswer: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onStartQuiz,
  onPracticeWeakTopics,
  onReviewAttempt,
}) => {
  const { language, t, translateSubject, translateChapter } = useLanguage();
  const analytics = calculateAnalytics();
  const attempts = getSavedAttempts();
  const hasAttempts = attempts.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 dark:from-blue-900 dark:via-indigo-950 dark:to-violet-950 text-white p-6 sm:p-10 shadow-xl border border-transparent dark:border-slate-800">
        {/* Decorative subtle circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 w-48 h-48 bg-violet-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-blue-100 border border-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
                <span>{t.hero.kicker}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-200 border border-emerald-400/30">
                <HardDrive className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t.dashboard.storageBadge}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {t.dashboard.welcomeTitle}
              </h1>
              <p className="text-xs text-blue-200 font-medium">
                {t.hero.freeBadgeSub}
              </p>
            </div>

            <p className="text-sm sm:text-base text-blue-100 leading-relaxed pt-1">
              {t.dashboard.welcomeSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => onStartQuiz({ mode: 'practice' })}
              className="px-5 py-3.5 bg-white text-indigo-900 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>{t.dashboard.btnStartPractice}</span>
            </button>
            <button
              onClick={() => onStartQuiz({ mode: 'exam' })}
              className="px-5 py-3.5 bg-slate-900/80 hover:bg-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2 shrink-0 active:scale-95 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-amber-300" />
              <span>{t.dashboard.btnStartExam}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Quizzes */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-6 shadow-xs flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.dashboard.statQuizzes}
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {analytics.totalQuizzesTaken}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500">
              {t.hero.sessionBadgeSub}
            </div>
          </div>
        </div>

        {/* Questions Solved */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-6 shadow-xs flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.dashboard.statQuestions}
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {analytics.totalQuestionsAnswered}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500">
              Section A & HOTS
            </div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-6 shadow-xs flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.dashboard.statAccuracy}
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {analytics.overallAccuracy}%
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Target: &gt; 85%
            </div>
          </div>
        </div>

        {/* Study Streak */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-6 shadow-xs flex items-center gap-4 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.dashboard.statStreak}
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {analytics.currentStreakDays} {language === 'hi' ? 'दिन' : 'Days'}
            </div>
            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
              {t.dashboard.statStreakSub}
            </div>
          </div>
        </div>
      </div>

      {/* Weak Topics Quick Callout */}
      {analytics.weakTopicsAllTime.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-rose-950/30 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {t.radar.pageTitle}: {analytics.weakTopicsAllTime.length} {t.dashboard.statWeakTopics}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                {language === 'hi'
                  ? 'इन टॉपिक्स पर आपकी सटीकता 75% से कम है। बोर्ड परीक्षा में पूर्ण अंक प्राप्त करने के लिए अभी अभ्यास करें।'
                  : 'Topics where accuracy is below 75%. Strengthen these specific concepts to secure top marks.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onPracticeWeakTopics(analytics.weakTopicsAllTime.map(w => w.topic))}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-slate-950 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 dark:text-slate-950" />
            <span>{t.radar.practiceAllWeakBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Core Subjects Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {t.dashboard.subjectsHeading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.dashboard.subjectsSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CBSE_CLASS_12_SUBJECTS.map((subject) => {
            const translatedSubject = translateSubject(subject.id);
            return (
              <div
                key={subject.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-mono">
                      CODE {subject.code}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {subject.totalChapters} {t.dashboard.chaptersCount}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {translatedSubject}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {subject.description}
                  </p>

                  <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {language === 'hi' ? 'महत्वपूर्ण अध्याय' : 'Featured Chapters'}
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      {subject.chapters.slice(0, 4).map((ch) => (
                        <li key={ch.id} className="truncate flex items-center justify-between">
                          <span className="truncate pr-2">• {translateChapter(ch.name)}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-medium">
                            {ch.weightageEstimate}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2">
                  <button
                    onClick={() => onStartQuiz({ subject: subject.id, mode: 'practice' })}
                    className="flex-1 py-2 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{t.nav.practiceQuiz}</span>
                  </button>
                  <button
                    onClick={() => onStartQuiz({ subject: subject.id, mode: 'exam' })}
                    className="py-2 px-3 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>{t.nav.examMode}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Attempts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>{t.dashboard.recentHeading}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.dashboard.recentSub}
            </p>
          </div>
        </div>

        {hasAttempts ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 overflow-hidden shadow-xs transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">{t.config.subjectLabel} / {t.config.chapterLabel}</th>
                    <th className="py-3 px-4">{t.config.modeLabel}</th>
                    <th className="py-3 px-4">{t.results.scoreLabel}</th>
                    <th className="py-3 px-4">{t.results.accuracyLabel}</th>
                    <th className="py-3 px-4">{t.results.timeSpent}</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {attempts.slice(0, 8).map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white capitalize">
                          {translateSubject(att.quizConfig.subject)}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 truncate max-w-xs">
                          {translateChapter(att.quizConfig.chapter)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                            att.quizConfig.mode === 'exam'
                              ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200'
                              : 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-200'
                          }`}
                        >
                          {att.quizConfig.mode === 'exam' ? t.quiz.examModeBadge : t.quiz.practiceModeBadge}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white tabular-nums">
                        {att.score} / {att.totalQuestions}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold tabular-nums ${
                            att.accuracy >= 75
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : att.accuracy >= 50
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {att.accuracy}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 tabular-nums font-mono">
                        {Math.floor(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onReviewAttempt(att)}
                          className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg font-bold transition-colors cursor-pointer"
                        >
                          {t.dashboard.reviewBtn}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center space-y-3 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.dashboard.noAttemptsTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {t.dashboard.noAttemptsDesc}
            </p>
            <button
              onClick={() => onStartQuiz()}
              className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.dashboard.btnStartPractice}</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer / Privacy note */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center space-y-2 transition-colors">
        <p className="text-xs text-slate-400 dark:text-slate-500">
          {t.landing.madeBy}
        </p>
      </div>
    </div>
  );
};
