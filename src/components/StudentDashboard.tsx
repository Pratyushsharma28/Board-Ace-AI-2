import React, { useState, useMemo } from 'react';
import { CBSE_CLASS_12_SUBJECTS } from '../data/syllabus';
import { SubjectId, QuizAttempt, Question } from '../types/quiz';
import {
  calculateAnalytics,
  getSavedAttempts,
  getActiveExamState,
  clearActiveExamState,
  getBookmarks,
  removeBookmark,
  getSavedReports,
  deleteQuestionReport,
  ActiveExamState,
  QuestionReport,
} from '../utils/storage';
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
  HardDrive,
  Bookmark,
  AlertOctagon,
  Trash2,
  Play,
  ChevronDown,
  ChevronUp,
  FileText,
  GraduationCap,
  Brain,
  Check,
} from 'lucide-react';
import {
  getRevisionItems,
  isItemDueForRevision,
  markItemAsRevised,
  markItemAsUnrevised,
  removeRevisionItem,
  getRevisionSummary,
  RevisionItem,
} from '../utils/revisionEngine';

interface StudentDashboardProps {
  onStartQuiz: (prefill?: { subject?: SubjectId; chapter?: string; mode?: 'practice' | 'exam' }) => void;
  onPracticeWeakTopics: (weakTopics: string[]) => void;
  onReviewAttempt: (attempt: QuizAttempt) => void;
  onOpenMistakeDetective: (question: any, selectedAnswer: string) => void;
  onContinueExam?: (savedExam: ActiveExamState) => void;
  onPracticeSavedQuestions?: (questions: Question[]) => void;
  onOpenTutor?: (subject?: SubjectId) => void;
  onOpenSmartPractice?: () => void;
  onOpenRevision?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onStartQuiz,
  onPracticeWeakTopics,
  onReviewAttempt,
  onContinueExam,
  onPracticeSavedQuestions,
  onOpenTutor,
  onOpenSmartPractice,
  onOpenRevision,
}) => {
  const { language, t, translateSubject, translateChapter } = useLanguage();
  const analytics = calculateAnalytics();
  const attempts = getSavedAttempts();
  const hasAttempts = attempts.length > 0;

  // Active Exam state
  const [activeExam, setActiveExam] = useState<ActiveExamState | null>(() => getActiveExamState());

  // Bookmarks & Reports & Revision
  const [revisionItems, setRevisionItems] = useState<RevisionItem[]>(() => getRevisionItems());
  const revisionSummary = useMemo(() => getRevisionSummary(revisionItems), [revisionItems]);
  const [bookmarks, setBookmarks] = useState<Question[]>(() => getBookmarks());
  const [reports, setReports] = useState<QuestionReport[]>(() => getSavedReports());
  const [selectedBookmarkSubject, setSelectedBookmarkSubject] = useState<'all' | SubjectId>('all');
  const [expandedBookmarkId, setExpandedBookmarkId] = useState<string | null>(null);
  const [savedSectionTab, setSavedSectionTab] = useState<'revision' | 'bookmarks' | 'reports'>('revision');

  const handleDiscardExam = () => {
    clearActiveExamState();
    setActiveExam(null);
  };

  const handleRemoveBookmark = (id: string) => {
    removeBookmark(id);
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const handleDeleteReport = (id: string) => {
    deleteQuestionReport(id);
    setReports(prev => prev.filter(r => r.id !== id));
  };

  const handleMarkRevisionItem = (id: string) => {
    const item = revisionItems.find(i => i.id === id);
    if (!item) return;
    if (item.isRevised) {
      markItemAsUnrevised(id);
    } else {
      markItemAsRevised(id);
    }
    setRevisionItems(getRevisionItems());
  };

  const handleRemoveRevisionItem = (id: string) => {
    removeRevisionItem(id);
    setRevisionItems(getRevisionItems());
  };

  // Weak chapters computed strictly from actual saved attempts
  const weakChapters = useMemo(() => {
    const chapterMap: Record<string, { subject: SubjectId; chapter: string; total: number; correct: number }> = {};
    attempts.forEach(att => {
      const ch = att.quizConfig.chapter;
      if (ch && ch !== 'all') {
        if (!chapterMap[ch]) {
          chapterMap[ch] = {
            subject: att.quizConfig.subject,
            chapter: ch,
            total: 0,
            correct: 0,
          };
        }
        chapterMap[ch].total += att.totalQuestions;
        chapterMap[ch].correct += att.score;
      }
    });

    return Object.values(chapterMap)
      .map(item => {
        const accuracy = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
        return { ...item, accuracy };
      })
      .filter(item => item.accuracy < 75);
  }, [attempts]);

  // Filtered bookmarks by subject
  const filteredBookmarks = useMemo(() => {
    if (selectedBookmarkSubject === 'all') return bookmarks;
    return bookmarks.filter(b => b.subject?.toLowerCase() === selectedBookmarkSubject);
  }, [bookmarks, selectedBookmarkSubject]);

  // Filtered revision items by subject
  const filteredRevisionItems = useMemo(() => {
    if (selectedBookmarkSubject === 'all') return revisionItems;
    return revisionItems.filter(r => r.subject === selectedBookmarkSubject);
  }, [revisionItems, selectedBookmarkSubject]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* Continue Previous Exam Banner (if active exam state exists) */}
      {activeExam && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 dark:from-amber-600 dark:via-orange-700 dark:to-amber-700 text-white rounded-3xl p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold tracking-wide uppercase">
                {t.quiz.examModeBadge} · {language === 'hi' ? 'अधूरी परीक्षा' : 'In Progress'}
              </div>
              <h2 className="text-base sm:text-lg font-extrabold mt-0.5">
                {t.dashboard.continueExamBtn}: {translateSubject(activeExam.config.subject)}
              </h2>
              <p className="text-xs text-amber-100 font-medium">
                {translateChapter(activeExam.config.chapter)} · {Object.keys(activeExam.answers).length} / {activeExam.questions.length} {language === 'hi' ? 'उत्तर दिए गए' : 'questions answered'} · {Math.floor(activeExam.secondsRemaining / 60)}m {activeExam.secondsRemaining % 60}s {language === 'hi' ? 'शेष' : 'remaining'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleDiscardExam}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-100 hover:text-white bg-black/20 hover:bg-black/30 transition-colors cursor-pointer"
            >
              {t.dashboard.discardExamBtn}
            </button>
            <button
              onClick={() => onContinueExam && onContinueExam(activeExam)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-amber-50 transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-slate-900" />
              <span>{t.dashboard.continueExamBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* Spaced-Repetition Due Reminder Banner */}
      {revisionSummary.dueCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-300 dark:border-amber-800/80 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <RotateCcw className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-[11px] font-bold uppercase tracking-wider">
                {language === 'hi' ? 'स्मार्ट अंतराल दोहराव' : 'Smart Spaced Repetition'}
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                {language === 'hi'
                  ? `${revisionSummary.dueCount} प्रश्न आज दोहराव हेतु देय हैं!`
                  : `${revisionSummary.dueCount} questions due for spaced revision today!`}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {language === 'hi'
                  ? 'अवधारणाओं को स्थायी स्मृति में सुरक्षित करने के लिए अभी दोहराएं।'
                  : 'Review difficult concepts now to reinforce retention for your CBSE board exams.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            {onOpenRevision && (
              <button
                onClick={onOpenRevision}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Brain className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'दोहराव प्रणाली खोलें' : 'Open Revision'}</span>
              </button>
            )}
            {onPracticeSavedQuestions && (
              <button
                onClick={() =>
                  onPracticeSavedQuestions(
                    revisionItems.filter(isItemDueForRevision).map(r => r.question)
                  )
                }
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{language === 'hi' ? 'देय प्रश्न हल करें' : 'Practice Due'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 dark:from-blue-900 dark:via-indigo-950 dark:to-violet-950 text-white p-6 sm:p-10 shadow-xl border border-transparent dark:border-slate-800">
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
            {onOpenSmartPractice && (
              <button
                onClick={onOpenSmartPractice}
                className="px-5 py-3.5 bg-amber-500/20 hover:bg-amber-500/30 text-white font-bold text-sm rounded-xl border border-amber-300/40 backdrop-blur-sm transition-all flex items-center gap-2 shrink-0 active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>{t.nav.smartPractice}</span>
              </button>
            )}
            {onOpenTutor && (
              <button
                onClick={() => onOpenTutor()}
                className="px-5 py-3.5 bg-indigo-500/30 hover:bg-indigo-500/40 text-white font-bold text-sm rounded-xl border border-white/30 backdrop-blur-sm transition-all flex items-center gap-2 shrink-0 active:scale-95 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-indigo-200" />
                <span>{t.nav.aiTutor}</span>
              </button>
            )}
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

        {/* Overall Accuracy */}
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

      {/* Highlight Weak Chapters Section (Actual Saved Student Data Only) */}
      {weakChapters.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <span>{t.dashboard.weakChaptersHeading}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {t.dashboard.weakChaptersSub}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {weakChapters.map((wc, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-rose-200 dark:border-rose-900/60 p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 uppercase">
                      {translateSubject(wc.subject)}
                    </span>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 tabular-nums">
                      {wc.accuracy}% {language === 'hi' ? 'सटीकता' : 'accuracy'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {translateChapter(wc.chapter)}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {wc.total - wc.correct} {language === 'hi' ? 'गलत उत्तर' : 'mistakes'} {language === 'hi' ? 'में से' : 'out of'} {wc.total} {language === 'hi' ? 'प्रश्नों में' : 'questions'}
                  </p>
                </div>

                <button
                  onClick={() => onStartQuiz({ subject: wc.subject, chapter: wc.chapter, mode: 'practice' })}
                  className="w-full py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'इस अध्याय का अभ्यास करें' : 'Practice This Chapter'}</span>
                </button>
              </div>
            ))}
          </div>
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

                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onStartQuiz({ subject: subject.id, mode: 'practice' })}
                    className="flex-1 min-w-[100px] py-2 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
                  {onOpenTutor && (
                    <button
                      onClick={() => onOpenTutor(subject.id)}
                      className="py-2 px-3 bg-violet-50 dark:bg-violet-950/70 hover:bg-violet-100 dark:hover:bg-violet-900 text-violet-700 dark:text-violet-300 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      title={language === 'hi' ? 'इस विषय के AI ट्यूटर से पूछें' : `Ask AI Tutor about ${translatedSubject}`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'ट्यूटर' : 'Tutor'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bookmarks & Saved Questions Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>{t.dashboard.savedQuestionsHeading}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.dashboard.savedQuestionsSub}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Tabs for Revision vs Bookmarks vs Reports */}
            <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <button
                onClick={() => setSavedSectionTab('revision')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  savedSectionTab === 'revision'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'स्मार्ट दोहराव' : 'Smart Revision'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px]">
                  {revisionItems.length}
                </span>
                {revisionSummary.dueCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>
              <button
                onClick={() => setSavedSectionTab('bookmarks')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  savedSectionTab === 'bookmarks'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {language === 'hi' ? 'बुकमार्क' : 'Bookmarks'} ({bookmarks.length})
              </button>
              <button
                onClick={() => setSavedSectionTab('reports')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  savedSectionTab === 'reports'
                    ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {language === 'hi' ? 'स्थानीय रिपोर्ट' : 'Saved Reports'} ({reports.length})
              </button>
            </div>

            {savedSectionTab === 'revision' && onOpenRevision && (
              <button
                onClick={onOpenRevision}
                className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'पूर्ण दोहराव केंद्र' : 'Full Revision Hub'}</span>
              </button>
            )}

            {savedSectionTab === 'revision' && revisionItems.length > 0 && onPracticeSavedQuestions && (
              <button
                onClick={() => onPracticeSavedQuestions(filteredRevisionItems.map(r => r.question))}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{language === 'hi' ? 'सभी हल करें' : 'Practice Revision'}</span>
              </button>
            )}

            {savedSectionTab === 'bookmarks' && bookmarks.length > 0 && onPracticeSavedQuestions && (
              <button
                onClick={() => onPracticeSavedQuestions(filteredBookmarks)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{language === 'hi' ? 'सभी हल करें' : 'Practice Saved'}</span>
              </button>
            )}
          </div>
        </div>

        {savedSectionTab === 'revision' ? (
          <div className="space-y-4">
            {/* Subject Filter Pills */}
            {revisionItems.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    { id: 'all', label: language === 'hi' ? 'सभी विषय' : 'All Subjects' },
                    { id: 'mathematics', label: language === 'hi' ? 'गणित' : 'Mathematics' },
                    { id: 'physics', label: language === 'hi' ? 'भौतिक विज्ञान' : 'Physics' },
                    { id: 'chemistry', label: language === 'hi' ? 'रसायन विज्ञान' : 'Chemistry' },
                  ] as const
                ).map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setSelectedBookmarkSubject(pill.id)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      selectedBookmarkSubject === pill.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            )}

            {filteredRevisionItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredRevisionItems.map((rev) => {
                  const q = rev.question;
                  const isExpanded = expandedBookmarkId === rev.id;
                  const isDue = isItemDueForRevision(rev);
                  return (
                    <div
                      key={rev.id}
                      className={`bg-white dark:bg-slate-800 rounded-2xl border p-5 shadow-xs transition-colors space-y-3 ${
                        isDue
                          ? 'border-amber-300 dark:border-amber-800 ring-1 ring-amber-400/20'
                          : 'border-slate-200/90 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
                              {translateSubject(rev.subject)}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                              {translateChapter(rev.chapter)} · {rev.topic}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                rev.savedReason === 'incorrect_answer'
                                  ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300'
                                  : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                              }`}
                            >
                              {rev.savedReason === 'incorrect_answer'
                                ? language === 'hi' ? 'क्विज़ गलती' : 'Quiz Mistake'
                                : language === 'hi' ? 'बुकमार्क' : 'Bookmarked'}
                            </span>
                            {isDue && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                                {language === 'hi' ? 'आज दोहराव देय' : 'Due for Revision'}
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white pt-1 whitespace-pre-line">
                            {language === 'hi' && q.questionHi ? q.questionHi : q.question}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleMarkRevisionItem(rev.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              rev.isRevised
                                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-50'
                            }`}
                            title="Toggle Revised"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{rev.isRevised ? (language === 'hi' ? 'दोहराया गया' : 'Revised') : (language === 'hi' ? 'दोहराएं' : 'Mark Revised')}</span>
                          </button>
                          <button
                            onClick={() => setExpandedBookmarkId(isExpanded ? null : rev.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            title={isExpanded ? 'Hide Details' : 'View Explanation'}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleRemoveRevisionItem(rev.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Options preview */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        {(q.options || []).map((opt: string, oIdx: number) => {
                          const isCorrect = opt === q.correctAnswer;
                          const optLabel = String.fromCharCode(65 + oIdx);
                          return (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                                isCorrect
                                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center shrink-0 ${
                                  isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700'
                                }`}
                              >
                                {optLabel}
                              </span>
                              <span className="truncate">{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Expandable Explanation */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-xs space-y-2 animate-fadeIn">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{t.quiz.officialExplanation}:</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {language === 'hi' && q.explanationHi ? q.explanationHi : q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center space-y-2 transition-colors">
                <Brain className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? 'कोई दोहराव प्रश्न नहीं' : 'No Revision Questions Saved'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {language === 'hi'
                    ? 'क्विज़ के दौरान गलत होने वाले प्रश्न स्वतः यहाँ दर्ज हो जाते हैं।'
                    : 'Questions you miss in quizzes are automatically saved here for spaced repetition.'}
                </p>
              </div>
            )}
          </div>
        ) : savedSectionTab === 'bookmarks' ? (
          <div className="space-y-4">
            {/* Subject Filter Pills */}
            {bookmarks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    { id: 'all', label: language === 'hi' ? 'सभी विषय' : 'All Subjects' },
                    { id: 'mathematics', label: language === 'hi' ? 'गणित' : 'Mathematics' },
                    { id: 'physics', label: language === 'hi' ? 'भौतिक विज्ञान' : 'Physics' },
                    { id: 'chemistry', label: language === 'hi' ? 'रसायन विज्ञान' : 'Chemistry' },
                  ] as const
                ).map((pill) => (
                  <button
                    key={pill.id}
                    onClick={() => setSelectedBookmarkSubject(pill.id)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      selectedBookmarkSubject === pill.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            )}

            {filteredBookmarks.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredBookmarks.map((q) => {
                  const isExpanded = expandedBookmarkId === q.id;
                  return (
                    <div
                      key={q.id}
                      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-5 shadow-xs transition-colors space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
                              {translateSubject(q.subject)}
                            </span>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                              {translateChapter(q.chapter)} · {q.topic}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white pt-1 whitespace-pre-line">
                            {language === 'hi' && q.questionHi ? q.questionHi : q.question}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setExpandedBookmarkId(isExpanded ? null : q.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            title={isExpanded ? 'Hide Details' : 'View Explanation'}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleRemoveBookmark(q.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                            title="Remove Bookmark"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Options preview */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        {q.options.map((opt, oIdx) => {
                          const isCorrect = opt === q.correctAnswer;
                          const optLabel = String.fromCharCode(65 + oIdx);
                          return (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                                isCorrect
                                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center shrink-0 ${
                                  isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700'
                                }`}
                              >
                                {optLabel}
                              </span>
                              <span className="truncate">{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Expandable Explanation & Notes */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-xs space-y-2 animate-fadeIn">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{t.quiz.officialExplanation}:</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {language === 'hi' && q.explanationHi ? q.explanationHi : q.explanation}
                          </p>

                          {q.pitfall && (
                            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                              <span className="font-bold">{t.quiz.pitfallWarning}: </span>
                              <span>{language === 'hi' && q.pitfallHi ? q.pitfallHi : q.pitfall}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center space-y-2 transition-colors">
                <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.dashboard.noBookmarksTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {t.dashboard.noBookmarksDesc}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Reports Sub-section */
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <span className="font-bold">{language === 'hi' ? 'स्थानीय गोपनीयता सूचना: ' : 'Local Storage Notice: '}</span>
              {t.quiz.reportNotice}
            </div>

            {reports.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-4 shadow-xs flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300">
                          {rep.reason}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {translateSubject(rep.subject)} · {translateChapter(rep.chapter)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(rep.reportedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-900 dark:text-white font-medium line-clamp-2">
                        {rep.questionText}
                      </p>
                      {rep.comment && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                          "{rep.comment}"
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteReport(rep.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer shrink-0"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center space-y-2 transition-colors">
                <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? 'कोई प्रश्न रिपोर्ट नहीं' : 'No question reports logged'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {language === 'hi'
                    ? 'यदि आप किसी प्रश्न में कोई विसंगति पाते हैं, तो वह यहाँ दर्ज होगी।'
                    : 'If you flag questions as confusing or incorrect during quizzes, they are saved locally here.'}
                </p>
              </div>
            )}
          </div>
        )}
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
