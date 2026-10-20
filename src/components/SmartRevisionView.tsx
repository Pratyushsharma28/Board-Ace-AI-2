import React, { useState, useMemo, useEffect } from 'react';
import { SubjectId, Question, RevisionItem, RevisionSaveReason } from '../types/quiz';
import { useLanguage } from '../context/LanguageContext';
import { useClass } from '../context/ClassContext';
import {
  getRevisionItems,
  isItemDueForRevision,
  markItemAsRevised,
  markItemAsUnrevised,
  removeRevisionItem,
  submitRetryAnswer,
  getRevisionSummary,
  getRevisionRecommendations,
  SRS_STAGE_LABELS_EN,
  SRS_STAGE_LABELS_HI,
  RevisionRecommendation,
} from '../utils/revisionEngine';
import { getSavedAttempts } from '../utils/storage';
import {
  RotateCcw,
  BookOpen,
  Bookmark,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Search,
  Filter,
  Trash2,
  AlertTriangle,
  Play,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Brain,
  ShieldCheck,
  Check,
  Award,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface SmartRevisionViewProps {
  onPracticeQuestions: (questions: Question[]) => void;
  onNavigateHome: () => void;
  onStartQuiz: () => void;
}

export const SmartRevisionView: React.FC<SmartRevisionViewProps> = ({
  onPracticeQuestions,
  onNavigateHome,
  onStartQuiz,
}) => {
  const { language, t, translateSubject, translateChapter } = useLanguage();
  const { grade, stream, subjects } = useClass();

  // Storage state
  const [items, setItems] = useState<RevisionItem[]>(() => getRevisionItems());
  const attempts = useMemo(() => getSavedAttempts(grade, stream), [grade, stream]);

  // Filter states
  const [selectedSubject, setSelectedSubject] = useState<'all' | SubjectId>('all');
  const [statusTab, setStatusTab] = useState<'due' | 'all' | 'incorrect' | 'bookmarked' | 'mastered'>('due');
  const [searchQuery, setSearchQuery] = useState('');

  // Expandable explanations
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  // Reset selectedSubject if not in active subjects
  useEffect(() => {
    if (selectedSubject !== 'all' && !subjects.some(s => s.id === selectedSubject)) {
      setSelectedSubject('all');
    }
  }, [subjects, selectedSubject]);

  // Filter items by active class & stream
  const activeItems = useMemo(() => {
    return items.filter(item => {
      const qGrade = item.question?.grade || '12';
      if (qGrade !== grade) return false;
      if (grade === '12') {
        const sub = item.subject?.toLowerCase() || '';
        if (stream === 'commerce') {
          return ['accountancy', 'business_studies', 'economics', 'english_core', 'english'].includes(sub);
        }
        return ['mathematics', 'physics', 'chemistry'].includes(sub);
      }
      return true;
    });
  }, [items, grade, stream]);

  // Active in-card interactive retry
  const [activeRetryId, setActiveRetryId] = useState<string | null>(null);
  const [retrySelectedOption, setRetrySelectedOption] = useState<string | null>(null);
  const [retryFeedback, setRetryFeedback] = useState<{
    id: string;
    isCorrect: boolean;
    explanation: string;
  } | null>(null);

  // Toast / notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Summary Metrics
  const summary = useMemo(() => getRevisionSummary(activeItems), [activeItems]);

  // Recommendations based on real mistakes & attempts strictly within active academic track
  const recommendations = useMemo(() => {
    return getRevisionRecommendations(attempts, activeItems, grade, stream);
  }, [attempts, activeItems, grade, stream]);

  // Toggle item expanded explanation
  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Mark as revised
  const handleMarkRevised = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    if (item.isRevised) {
      markItemAsUnrevised(id);
      showToast(language === 'hi' ? 'दोहराव फिर से निर्धारित किया गया' : 'Rescheduled for revision');
    } else {
      markItemAsRevised(id);
      showToast(t.revision.revisedToast);
    }
    setItems(getRevisionItems());
  };

  // Remove item
  const handleRemove = (id: string) => {
    removeRevisionItem(id);
    setItems(getRevisionItems());
    showToast(t.revision.itemDeletedToast);
  };

  // Start retry mode
  const handleStartRetry = (id: string) => {
    setActiveRetryId(id);
    setRetrySelectedOption(null);
    setRetryFeedback(null);
  };

  const handleCancelRetry = () => {
    setActiveRetryId(null);
    setRetrySelectedOption(null);
    setRetryFeedback(null);
  };

  // Submit retry answer
  const handleSubmitRetry = (id: string) => {
    if (!retrySelectedOption) return;
    const result = submitRetryAnswer(id, retrySelectedOption);
    setRetryFeedback({
      id,
      isCorrect: result.isCorrect,
      explanation: result.explanation,
    });
    setItems(getRevisionItems());

    if (result.isCorrect) {
      showToast(t.revision.correctCelebration);
    } else {
      showToast(t.revision.incorrectRetryNote);
    }
  };

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Subject filter
      if (selectedSubject !== 'all' && item.subject !== selectedSubject) {
        return false;
      }

      // 2. Status tab filter
      if (statusTab === 'due' && !isItemDueForRevision(item)) {
        return false;
      }
      if (statusTab === 'incorrect' && item.savedReason !== 'incorrect_answer') {
        return false;
      }
      if (statusTab === 'bookmarked' && item.savedReason !== 'bookmarked') {
        return false;
      }
      if (statusTab === 'mastered' && item.srsStage < 4) {
        return false;
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const qLower = searchQuery.toLowerCase();
        const matchesQuestion =
          item.question.question.toLowerCase().includes(qLower) ||
          (item.question.questionHi && item.question.questionHi.toLowerCase().includes(qLower));
        const matchesChapter = item.chapter?.toLowerCase().includes(qLower);
        const matchesTopic = item.topic?.toLowerCase().includes(qLower);
        if (!matchesQuestion && !matchesChapter && !matchesTopic) {
          return false;
        }
      }

      return true;
    });
  }, [items, selectedSubject, statusTab, searchQuery]);

  // Extract Question array for batch practice
  const handlePracticeFiltered = () => {
    if (filteredItems.length === 0) return;
    const questions = filteredItems.map(i => i.question);
    onPracticeQuestions(questions);
  };

  const handlePracticeDue = () => {
    const dueQuestions = items.filter(isItemDueForRevision).map(i => i.question);
    if (dueQuestions.length === 0) return;
    onPracticeQuestions(dueQuestions);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className="bg-indigo-600 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-indigo-700">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-300" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-bold uppercase tracking-wider">
            <Brain className="w-3.5 h-3.5 text-indigo-300" />
            <span>{t.revision.brandKicker}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {t.revision.pageTitle}
          </h1>

          <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
            {t.revision.pageSubtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            {summary.dueCount > 0 ? (
              <button
                onClick={handlePracticeDue}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>
                  {t.revision.practiceDueBtn} ({summary.dueCount})
                </span>
              </button>
            ) : (
              <button
                onClick={onStartQuiz}
                className="px-5 py-2.5 bg-white/15 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{t.revision.startQuizPrompt}</span>
              </button>
            )}

            <button
              onClick={onNavigateHome}
              className="px-4 py-2.5 text-xs text-indigo-200 hover:text-white font-semibold transition-colors cursor-pointer"
            >
              ← {language === 'hi' ? 'वापस जाएं' : 'Back to Home'}
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-1 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.revision.totalSaved}
            </span>
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {summary.totalItems}
          </div>
          <p className="text-[11px] text-slate-400">
            {summary.subjectCounts.mathematics} M · {summary.subjectCounts.physics} P · {summary.subjectCounts.chemistry} C
          </p>
        </div>

        <div
          className={`p-4 sm:p-5 rounded-2xl border shadow-xs space-y-1 transition-colors ${
            summary.dueCount > 0
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
              : 'bg-white dark:bg-slate-800 border-slate-200/90 dark:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold ${
                summary.dueCount > 0
                  ? 'text-amber-800 dark:text-amber-300 font-bold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {t.revision.dueForRevision}
            </span>
            <Clock
              className={`w-4 h-4 ${
                summary.dueCount > 0
                  ? 'text-amber-600 dark:text-amber-400 animate-pulse'
                  : 'text-slate-400'
              }`}
            />
          </div>
          <div
            className={`text-2xl sm:text-3xl font-extrabold ${
              summary.dueCount > 0
                ? 'text-amber-900 dark:text-amber-200'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            {summary.dueCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {summary.dueCount > 0
              ? language === 'hi'
                ? 'आज दोहराव आवश्यक'
                : 'Scheduled for today'
              : language === 'hi'
              ? 'कोई प्रश्न देय नहीं'
              : 'All caught up'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-1 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.revision.mastered}
            </span>
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {summary.masteredCount}
          </div>
          <p className="text-[11px] text-slate-400">
            {language === 'hi' ? 'चरण 4 (14+ दिन)' : 'Stage 4 (14+ days)'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-1 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {t.revision.autoSavedMistakes}
            </span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400">
            {summary.incorrectSavedCount}
          </div>
          <p className="text-[11px] text-slate-400">
            {summary.bookmarkedCount} {language === 'hi' ? 'बुकमार्क किए गए' : 'bookmarked'}
          </p>
        </div>
      </div>

      {/* Spaced-Repetition Algorithm Banner */}
      <div className="bg-indigo-50/80 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/80 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-indigo-900 dark:text-indigo-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold block sm:inline">{t.revision.srsBannerTitle}: </span>
            <span className="text-indigo-700 dark:text-indigo-300">{t.revision.srsBannerDesc}</span>
          </div>
        </div>
      </div>

      {/* Recommended Revisions from Real Mistakes */}
      {recommendations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>{t.revision.recommendedHeader}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.revision.recommendedSub}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.map(rec => (
              <div
                key={rec.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-200 dark:border-amber-900/60 p-4 shadow-xs flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                      {translateSubject(rec.subject)}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {translateChapter(rec.chapter)}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {rec.topic}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {language === 'hi' ? rec.reasonHi : rec.reason}
                  </p>
                </div>

                {rec.sampleQuestion && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onPracticeQuestions([rec.sampleQuestion!])}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{t.revision.practiceRecommendedBtn}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-4 shadow-xs space-y-4 transition-colors">
        {/* Subject Pills & Search Input */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: 'all', label: t.revision.subjectFilterAll },
                { id: 'mathematics', label: language === 'hi' ? 'गणित' : 'Mathematics' },
                { id: 'physics', label: language === 'hi' ? 'भौतिक विज्ञान' : 'Physics' },
                { id: 'chemistry', label: language === 'hi' ? 'रसायन विज्ञान' : 'Chemistry' },
              ] as const
            ).map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedSubject(tab.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                  selectedSubject === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.revision.searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Status Tabs Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-700/80">
          <div className="inline-flex bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl text-xs font-semibold gap-1">
            <button
              onClick={() => setStatusTab('due')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                statusTab === 'due'
                  ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>{t.revision.tabDue}</span>
              {summary.dueCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                  {summary.dueCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setStatusTab('all')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                statusTab === 'all'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.revision.tabAll} ({items.length})
            </button>

            <button
              onClick={() => setStatusTab('incorrect')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                statusTab === 'incorrect'
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.revision.tabIncorrect} ({summary.incorrectSavedCount})
            </button>

            <button
              onClick={() => setStatusTab('bookmarked')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                statusTab === 'bookmarked'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.revision.tabBookmarked} ({summary.bookmarkedCount})
            </button>

            <button
              onClick={() => setStatusTab('mastered')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                statusTab === 'mastered'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.revision.tabMastered} ({summary.masteredCount})
            </button>
          </div>

          {filteredItems.length > 0 && (
            <button
              onClick={handlePracticeFiltered}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>
                {t.revision.practiceAllBtn} ({filteredItems.length})
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => {
            const q = item.question;
            const isDue = isItemDueForRevision(item);
            const isExpanded = expandedIds[item.id];
            const isRetrying = activeRetryId === item.id;
            const hasFeedback = retryFeedback && retryFeedback.id === item.id;

            // Spaced Repetition Label
            const srsLabel =
              language === 'hi'
                ? SRS_STAGE_LABELS_HI[item.srsStage] || `चरण ${item.srsStage}`
                : SRS_STAGE_LABELS_EN[item.srsStage] || `Stage ${item.srsStage}`;

            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-slate-800 rounded-2xl border p-5 shadow-xs transition-colors space-y-4 ${
                  isDue
                    ? 'border-amber-300/80 dark:border-amber-800/80 ring-1 ring-amber-400/20'
                    : 'border-slate-200/90 dark:border-slate-700'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
                      {translateSubject(item.subject)}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {translateChapter(item.chapter)} · {item.topic}
                    </span>

                    {/* Source Tag */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        item.savedReason === 'incorrect_answer'
                          ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300'
                          : 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                      }`}
                    >
                      {item.savedReason === 'incorrect_answer'
                        ? t.revision.savedBecauseIncorrect
                        : t.revision.savedBecauseBookmark}
                    </span>

                    {/* SRS Stage Badge */}
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isDue
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-extrabold'
                          : item.srsStage >= 4
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{srsLabel}</span>
                    </span>
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => handleMarkRevised(item.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        item.isRevised
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                      }`}
                      title="Advance Spaced Repetition stage"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{item.isRevised ? t.revision.markedRevised : t.revision.markAsRevised}</span>
                    </button>

                    <button
                      onClick={() => (isRetrying ? handleCancelRetry() : handleStartRetry(item.id))}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isRetrying ? t.revision.cancelRetry : t.revision.retryBtn}</span>
                    </button>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                      title={t.revision.deleteItem}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
                    {language === 'hi' && q.questionHi ? q.questionHi : q.question}
                  </p>

                  {/* Previous wrong answer indicator if logged */}
                  {item.userLastWrongAnswer && !isRetrying && (
                    <div className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1.5 pt-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>
                        {language === 'hi' ? 'पिछली गलती: ' : 'Previous mistake: '}"{item.userLastWrongAnswer}"
                        {item.userLastMistakeCategory && ` (${item.userLastMistakeCategory})`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Interactive Retry Mode */}
                {isRetrying ? (
                  <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-indigo-200">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span>{language === 'hi' ? 'इंटरैक्टिव पुनः प्रयास' : 'Interactive Quick Re-Attempt'}</span>
                      </div>
                      <span className="text-slate-500">{language === 'hi' ? 'उत्तर चुनें और जांचें' : 'Select option & check'}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, oIdx) => {
                        const optLabel = String.fromCharCode(65 + oIdx);
                        const isSelected = retrySelectedOption === opt;
                        const isCorrectAnswer = opt === q.correctAnswer;

                        let borderClass = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200';
                        if (hasFeedback) {
                          if (isCorrectAnswer) {
                            borderClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 font-bold';
                          } else if (isSelected && !retryFeedback.isCorrect) {
                            borderClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/70 text-rose-900 dark:text-rose-200 font-bold';
                          }
                        } else if (isSelected) {
                          borderClass = 'border-indigo-600 bg-indigo-100/70 dark:bg-indigo-900/60 font-bold';
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={Boolean(hasFeedback)}
                            onClick={() => setRetrySelectedOption(opt)}
                            className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all cursor-pointer ${borderClass}`}
                          >
                            <span
                              className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {optLabel}
                            </span>
                            <span className="text-xs leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Retry Feedback display */}
                    {hasFeedback && (
                      <div
                        className={`p-3 rounded-xl text-xs space-y-1.5 ${
                          retryFeedback.isCorrect
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border border-rose-300'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5">
                          {retryFeedback.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-600" />
                          )}
                          <span>
                            {retryFeedback.isCorrect
                              ? t.revision.retryCorrectFeedback
                              : t.revision.retryIncorrectFeedback}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed pt-1">
                          {language === 'hi' && q.explanationHi ? q.explanationHi : q.explanation}
                        </p>
                      </div>
                    )}

                    {!hasFeedback && (
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={handleCancelRetry}
                          className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 font-semibold cursor-pointer"
                        >
                          {t.revision.cancelRetry}
                        </button>
                        <button
                          disabled={!retrySelectedOption}
                          onClick={() => handleSubmitRetry(item.id)}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          {t.revision.checkAnswer}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Standard Options Preview */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const optLabel = String.fromCharCode(65 + oIdx);
                      const isCorrect = opt === q.correctAnswer;
                      const isPastWrong = opt === item.userLastWrongAnswer;

                      let optClass = 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                      if (isCorrect) {
                        optClass = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                      } else if (isPastWrong) {
                        optClass = 'border-rose-300 bg-rose-50/50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300';
                      }

                      return (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 ${optClass}`}
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
                )}

                {/* Footer details toggle & revision stats */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span>
                      {t.revision.reviewCountLabel}: <strong className="text-slate-800 dark:text-slate-200">{item.reviewCount}</strong>
                    </span>
                    {item.incorrectCount > 0 && (
                      <span>
                        {t.revision.incorrectCountLabel}: <strong className="text-rose-600 dark:text-rose-400">{item.incorrectCount}</strong>
                      </span>
                    )}
                    {item.lastReviewedAt && (
                      <span className="hidden sm:inline">
                        {language === 'hi' ? 'अंतिम दोहराव: ' : 'Last reviewed: '}
                        {new Date(item.lastReviewedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    <span>{isExpanded ? t.revision.hideExplanation : t.revision.viewExplanation}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Expanded Explanation Section */}
                {isExpanded && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-2.5 animate-fadeIn">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{t.quiz.officialExplanation}:</span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {language === 'hi' && q.explanationHi ? q.explanationHi : q.explanation}
                    </p>

                    {q.formula && (
                      <div className="p-2 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-lg border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 font-mono text-[11px]">
                        <strong>Formula: </strong> {q.formula}
                      </div>
                    )}

                    {q.pitfall && (
                      <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                        <strong className="font-bold">{t.quiz.pitfallWarning}: </strong>
                        <span>{language === 'hi' && q.pitfallHi ? q.pitfallHi : q.pitfall}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          /* Empty States */
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center space-y-3 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center font-bold">
              {statusTab === 'due' ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <RotateCcw className="w-6 h-6" />}
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {statusTab === 'due'
                ? t.revision.emptyDueTitle
                : items.length === 0
                ? t.revision.emptyAllTitle
                : t.revision.emptyFilterTitle}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              {statusTab === 'due'
                ? t.revision.emptyDueDesc
                : items.length === 0
                ? t.revision.emptyAllDesc
                : t.revision.emptyFilterDesc}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              {statusTab === 'due' && items.length > 0 && (
                <button
                  onClick={() => setStatusTab('all')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  {t.revision.tabAll} ({items.length})
                </button>
              )}

              <button
                onClick={onStartQuiz}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.revision.startQuizPrompt}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
