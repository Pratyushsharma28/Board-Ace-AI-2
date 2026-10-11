import React, { useState } from 'react';
import {
  calculateAnalytics,
  getSavedAttempts,
  getWeakTopicRadarData,
  exportAnalyticsJson,
  clearAllStorage,
  TopicRadarItem
} from '../utils/storage';
import { QuizAttempt } from '../types/quiz';
import { useLanguage } from '../context/LanguageContext';
import {
  Trophy,
  Target,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Calendar,
  Download,
  Trash2,
  HelpCircle,
  ShieldCheck,
  Filter
} from 'lucide-react';

interface AnalyticsViewProps {
  onStartQuiz: () => void;
  onPracticeWeakTopics: (weakTopics: string[]) => void;
  onReviewAttempt: (attempt: QuizAttempt) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  onStartQuiz,
  onPracticeWeakTopics,
  onReviewAttempt,
}) => {
  const { language, t, translateSubject } = useLanguage();
  const analytics = calculateAnalytics();
  const attempts = getSavedAttempts();
  const radarData = getWeakTopicRadarData();

  const [filterCategory, setFilterCategory] = useState<'all' | 'weak' | 'practise' | 'strong' | 'no_data'>('all');
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleExport = () => {
    const jsonStr = exportAnalyticsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boardace-ai-cbse-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    clearAllStorage();
    setResetConfirmOpen(false);
    window.location.reload();
  };

  const filteredTopics = radarData.allTopics.filter(item => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Target className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            <span>{t.radar.pageTitle}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.radar.pageSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Download your study progress JSON"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{t.radar.exportData}</span>
          </button>

          <button
            onClick={() => setResetConfirmOpen(true)}
            className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            title="Reset browser study progress"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.radar.resetData}</span>
          </button>

          <button
            onClick={onStartQuiz}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.radar.newQuizBtn}</span>
          </button>
        </div>
      </div>

      {/* Formula & Policy Card */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-50/80 via-violet-50/60 to-blue-50/80 dark:from-indigo-950/40 dark:via-violet-950/30 dark:to-blue-950/40 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shrink-0">
            %
          </div>
          <div>
            <div className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
              {t.radar.formulaTitle}
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-indigo-900 dark:text-indigo-300 font-mono mt-0.5">
              {t.radar.formulaText}
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          {language === 'hi'
            ? '0 हल किए गए प्रश्नों वाले टॉपिक्स पर "अपर्याप्त डेटा" प्रदर्शित होता है।'
            : 'Unattempted topics display "Not enough data" until practiced.'}
        </div>
      </div>

      {/* 3 Categories Radar Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Strong Topics */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 p-6 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {t.radar.categoryStrong}
              </span>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
                {radarData.strongTopics.length}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {language === 'hi'
                ? 'सटीकता > 75%। इन टॉपिक्स पर आपका अच्छा नियंत्रण है।'
                : 'Accuracy > 75%. Concepts mastered with solid board readiness.'}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            {t.radar.actionStrong}
          </div>
        </div>

        {/* Card 2: Topics to Practise */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-200 dark:border-amber-800/80 p-6 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                {t.radar.categoryPractise}
              </span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
                {radarData.practiseTopics.length}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {language === 'hi'
                ? 'सटीकता 50% से 75% के बीच। मामूली गलतियाँ दूर करने के लिए अभ्यास करें।'
                : 'Accuracy between 50% and 75%. Occasional calculation or sign slips.'}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
            {t.radar.actionPractise}
          </div>
        </div>

        {/* Card 3: Topics Needing More Attention */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-rose-200 dark:border-rose-800/80 p-6 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                {t.radar.categoryWeak}
              </span>
              <span className="text-2xl font-black text-rose-600 dark:text-rose-400 tabular-nums">
                {radarData.weakTopics.length}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {language === 'hi'
                ? 'सटीकता < 50%। इन टॉपिक्स पर वैचारिक सुधार की सख्त आवश्यकता है।'
                : 'Accuracy < 50%. High priority for NCERT revision & forensics.'}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
            <span className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">
              {t.radar.actionWeak}
            </span>
            {radarData.weakTopics.length > 0 && (
              <button
                onClick={() => onPracticeWeakTopics(radarData.weakTopics.map(w => w.topic))}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold shrink-0 transition-colors cursor-pointer"
              >
                Drill All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Topic Performance Radar Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'विस्तृत टॉपिक प्रदर्शन तालिका' : 'Comprehensive Topic Performance Breakdown'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'hi'
                ? 'प्रत्येक टॉपिक के प्रयास, शुद्धता, सटीकता प्रतिशत और सुझाई गई कार्रवाई।'
                : 'Real-time accuracy and recommended next actions computed from your local quiz records.'}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              All ({radarData.allTopics.length})
            </button>
            <button
              onClick={() => setFilterCategory('weak')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterCategory === 'weak'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900'
              }`}
            >
              Needs Attention ({radarData.weakTopics.length})
            </button>
            <button
              onClick={() => setFilterCategory('practise')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterCategory === 'practise'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900'
              }`}
            >
              Practise ({radarData.practiseTopics.length})
            </button>
            <button
              onClick={() => setFilterCategory('strong')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterCategory === 'strong'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900'
              }`}
            >
              Strong ({radarData.strongTopics.length})
            </button>
            <button
              onClick={() => setFilterCategory('no_data')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterCategory === 'no_data'
                  ? 'bg-slate-700 dark:bg-slate-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              No Data ({radarData.unattemptedTopics.length})
            </button>
          </div>
        </div>

        {filteredTopics.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">{t.radar.tableTopic}</th>
                  <th className="py-3 px-4">{t.radar.tableSubject}</th>
                  <th className="py-3 px-4">{t.radar.tableAttempted}</th>
                  <th className="py-3 px-4">{t.radar.tableAccuracy}</th>
                  <th className="py-3 px-4">{t.radar.tableStatus}</th>
                  <th className="py-3 px-4">{t.radar.tableAction}</th>
                  <th className="py-3 px-4 text-right">Drill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredTopics.slice(0, 30).map((item, idx) => {
                  let statusBadge = (
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                      {t.radar.statusNoData}
                    </span>
                  );
                  if (item.category === 'strong') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200">
                        {t.radar.statusStrong}
                      </span>
                    );
                  } else if (item.category === 'practise') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200">
                        {t.radar.statusPractise}
                      </span>
                    );
                  } else if (item.category === 'weak') {
                    statusBadge = (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-200">
                        {t.radar.statusWeak}
                      </span>
                    );
                  }

                  return (
                    <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white max-w-xs truncate">
                        {item.topic}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {translateSubject(item.subject)}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300 tabular-nums">
                        {item.attempted > 0 ? `${item.correct}/${item.attempted}` : '0'}
                      </td>
                      <td className="py-3 px-4 font-bold tabular-nums">
                        {item.accuracy !== null ? (
                          <span
                            className={
                              item.accuracy >= 75
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : item.accuracy >= 50
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-rose-600 dark:text-rose-400'
                            }
                          >
                            {item.accuracy}%
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 font-normal italic">
                            {t.radar.statusNoData}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">{statusBadge}</td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px] max-w-sm">
                        {item.category === 'strong'
                          ? t.radar.actionStrong
                          : item.category === 'practise'
                          ? t.radar.actionPractise
                          : item.category === 'weak'
                          ? t.radar.actionWeak
                          : t.radar.actionNoData}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onPracticeWeakTopics([item.topic])}
                          className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          {t.radar.targetDrillBtn}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-slate-500 dark:text-slate-400">
            {t.radar.emptyRadar}
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.radar.resetData}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {t.radar.resetConfirm}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
              >
                {t.config.cancelBtn}
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-sm cursor-pointer"
              >
                {language === 'hi' ? 'हाँ, रीसेट करें' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
