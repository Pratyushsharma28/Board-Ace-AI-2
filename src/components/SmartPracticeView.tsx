import React, { useState, useMemo } from 'react';
import { SubjectId, Question, SmartPracticeRecommendation, DifficultyLevel } from '../types/quiz';
import { useLanguage } from '../context/LanguageContext';
import {
  generateSmartRecommendations,
  analyzeStudentPerformance,
  getSmartPracticePreferences,
  saveSmartPracticePreferences,
  SmartPracticePreferences,
} from '../utils/smartPracticeEngine';
import { getSavedAttempts } from '../utils/storage';
import {
  Sparkles,
  Target,
  TrendingUp,
  AlertTriangle,
  Award,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Filter,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Flame,
  Zap,
} from 'lucide-react';

interface SmartPracticeViewProps {
  onStartDrill: (questions: Question[], config: { subject: SubjectId; chapter: string; difficulty: DifficultyLevel; topic: string }) => void;
  onNavigateHome: () => void;
}

export const SmartPracticeView: React.FC<SmartPracticeViewProps> = ({
  onStartDrill,
  onNavigateHome,
}) => {
  const { language, t, translateSubject, translateChapter } = useLanguage();
  const attempts = useMemo(() => getSavedAttempts(), []);

  // Performance Analysis
  const performance = useMemo(() => analyzeStudentPerformance(attempts), [attempts]);

  // Preferences from Local Storage
  const [prefs, setPrefs] = useState<SmartPracticePreferences>(() => getSmartPracticePreferences());

  // Filter and Inspect States
  const [selectedSubject, setSelectedSubject] = useState<'all' | SubjectId>(prefs.targetSubject);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | DifficultyLevel>('all');
  const [expandedRecId, setExpandedRecId] = useState<string | null>(null);

  // Auto Step-Up Preference Toggle
  const handleToggleStepUp = () => {
    const updated: SmartPracticePreferences = {
      ...prefs,
      autoStepUp: !prefs.autoStepUp,
    };
    setPrefs(updated);
    saveSmartPracticePreferences(updated);
  };

  const handleSubjectChange = (newSub: 'all' | SubjectId) => {
    setSelectedSubject(newSub);
    const updated: SmartPracticePreferences = {
      ...prefs,
      targetSubject: newSub,
    };
    setPrefs(updated);
    saveSmartPracticePreferences(updated);
  };

  // Generate Deterministic Recommendations
  const allRecommendations = useMemo(() => {
    return generateSmartRecommendations(attempts, selectedSubject);
  }, [attempts, selectedSubject]);

  // Filter recommendations by difficulty if user selected one
  const filteredRecommendations = useMemo(() => {
    if (selectedDifficulty === 'all') return allRecommendations;
    return allRecommendations.filter(r => r.targetDifficulty === selectedDifficulty);
  }, [allRecommendations, selectedDifficulty]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fadeIn">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-violet-800 dark:from-indigo-950 dark:via-blue-950 dark:to-violet-950 text-white p-6 sm:p-10 shadow-xl border border-transparent dark:border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 w-48 h-48 bg-violet-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-blue-100 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.smartPractice.kicker}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-200 border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>100% Deterministic & Data-Driven</span>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {t.smartPractice.heroHeading}
              </h1>
              <p className="text-xs text-blue-200 font-medium">
                {t.hero.sessionBadgeSub} · Mathematics (041) · Physics (042) · Chemistry (043)
              </p>
            </div>

            <p className="text-sm sm:text-base text-blue-100 leading-relaxed pt-1">
              {t.smartPractice.heroSub}
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-3 shrink-0 lg:min-w-[260px]">
            <div className="text-xs font-bold text-blue-200 uppercase tracking-wider">
              {t.smartPractice.progressSummaryTitle}
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 bg-black/20 rounded-xl">
                <div className="text-xl font-extrabold text-white tabular-nums">
                  {performance.totalQuestionsAnswered}
                </div>
                <div className="text-[10px] text-blue-200 font-medium">
                  {t.dashboard.statQuestions}
                </div>
              </div>
              <div className="p-2.5 bg-black/20 rounded-xl">
                <div className="text-xl font-extrabold text-emerald-300 tabular-nums">
                  {performance.overallAccuracy}%
                </div>
                <div className="text-[10px] text-blue-200 font-medium">
                  {t.results.accuracyLabel}
                </div>
              </div>
            </div>

            {performance.repeatedMistakesCount > 0 ? (
              <div className="flex items-center gap-2 text-xs text-amber-200 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{performance.repeatedMistakesCount} {t.smartPractice.repeatedMistakesFound}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-200 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>{t.smartPractice.adaptiveEngineActive}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Control Strip: Subject Filter, Difficulty Filter & Adaptive Step-Up Switch */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        {/* Subject Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>{t.smartPractice.subjectFilterLabel}:</span>
          </span>
          <button
            onClick={() => handleSubjectChange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedSubject === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            {t.smartPractice.allSubjects}
          </button>
          {(['mathematics', 'physics', 'chemistry'] as SubjectId[]).map(s => (
            <button
              key={s}
              onClick={() => handleSubjectChange(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSubject === s
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {translateSubject(s)}
            </button>
          ))}
        </div>

        {/* Difficulty Filter & Adaptive Step-Up Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
            {(['all', 'easy', 'medium', 'hard'] as Array<'all' | DifficultyLevel>).map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {diff === 'all' ? (language === 'hi' ? 'सभी स्तर' : 'All Levels') : diff}
              </button>
            ))}
          </div>

          {/* Auto Step-Up Toggle */}
          <button
            onClick={handleToggleStepUp}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              prefs.autoStepUp
                ? 'bg-violet-50 dark:bg-violet-950/70 border-violet-300 text-violet-700 dark:text-violet-300'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
            title={t.smartPractice.autoStepUpDesc}
          >
            <TrendingUp className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            <span>{t.smartPractice.autoStepUpLabel}: {prefs.autoStepUp ? (language === 'hi' ? 'चालू' : 'ON') : (language === 'hi' ? 'बंद' : 'OFF')}</span>
          </button>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      {filteredRecommendations.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {t.smartPractice.emptyTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {t.smartPractice.emptyDesc}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((rec) => {
            const isExpanded = expandedRecId === rec.id;
            const translatedSub = translateSubject(rec.subject);
            const translatedChap = translateChapter(rec.chapter);

            // Badge color scheme based on reasonType
            const badgeStyle = {
              repeated_mistakes: {
                bg: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900',
                label: language === 'hi' ? rec.reasonHeadlineHi : rec.reasonHeadline,
                icon: <RotateCcw className="w-3.5 h-3.5 text-rose-600 shrink-0" />,
              },
              low_accuracy: {
                bg: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900',
                label: language === 'hi' ? rec.reasonHeadlineHi : rec.reasonHeadline,
                icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />,
              },
              mastery_progression: {
                bg: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
                label: language === 'hi' ? rec.reasonHeadlineHi : rec.reasonHeadline,
                icon: <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />,
              },
              unattempted_high_weightage: {
                bg: 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900',
                label: language === 'hi' ? rec.reasonHeadlineHi : rec.reasonHeadline,
                icon: <Target className="w-3.5 h-3.5 text-blue-600 shrink-0" />,
              },
            }[rec.reasonType];

            // Difficulty tag style
            const diffTagStyle = {
              easy: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
              medium: 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
              hard: 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
              mixed: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
            }[rec.targetDifficulty];

            return (
              <div
                key={rec.id}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Top Badge Strip */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">
                      {translatedSub}
                    </span>

                    <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border uppercase ${diffTagStyle}`}>
                      {rec.targetDifficulty}
                    </span>
                  </div>

                  {/* Recommendation Reason Banner */}
                  <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold ${badgeStyle.bg}`}>
                    {badgeStyle.icon}
                    <span className="truncate">{badgeStyle.label}</span>
                  </div>

                  {/* Chapter and Topic Titles */}
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 truncate">
                      {translatedChap}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {rec.topic}
                    </h3>
                  </div>

                  {/* Why this topic was recommended */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-indigo-500" />
                      <span>{t.smartPractice.whyRecommendedHeading}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {language === 'hi' ? rec.reasonDetailHi : rec.reasonDetail}
                    </p>
                  </div>

                  {/* Diagnostic Metrics Strip */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">{t.smartPractice.metricsAttempted}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {rec.metrics.attempted} questions
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">{t.smartPractice.metricsAccuracy}</span>
                      <span className="font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {rec.metrics.accuracy !== null ? `${rec.metrics.accuracy}%` : (language === 'hi' ? 'नया अध्याय' : 'New Topic')}
                      </span>
                    </div>
                  </div>

                  {/* Expand Questions Preview */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2 animate-fadeIn">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Curated Board Questions ({rec.recommendedQuestions.length})
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                        {rec.recommendedQuestions.map((q, qIdx) => (
                          <div
                            key={q.id}
                            className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-slate-700 dark:text-slate-300"
                          >
                            <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-1.5">Q{qIdx + 1}.</span>
                            <span>{language === 'hi' && q.questionHi ? q.questionHi : q.question}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2">
                  <button
                    onClick={() => setExpandedRecId(isExpanded ? null : rec.id)}
                    className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {isExpanded ? (language === 'hi' ? 'छिपाएं' : 'Hide') : t.smartPractice.viewQuestionsBtn}
                  </button>

                  <button
                    onClick={() =>
                      onStartDrill(rec.recommendedQuestions, {
                        subject: rec.subject,
                        chapter: rec.chapter,
                        difficulty: rec.targetDifficulty,
                        topic: rec.topic,
                      })
                    }
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span>{t.smartPractice.startSessionBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
