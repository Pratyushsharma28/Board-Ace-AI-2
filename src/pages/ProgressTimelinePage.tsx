import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getSavedAttempts, calculateAnalytics } from '../utils/storage';
import { getRevisionItems } from '../utils/revisionEngine';
import { SubjectId, QuizAttempt } from '../types/quiz';
import {
  Clock,
  CheckCircle2,
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Layers,
  Zap,
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  unlockedDate?: string;
  iconName: string;
}

export const ProgressTimelinePage: React.FC = () => {
  const { language, t, translateSubject } = useLanguage();

  const attempts: QuizAttempt[] = useMemo(() => getSavedAttempts(), []);
  const revItems = useMemo(() => getRevisionItems(), []);
  const analytics = useMemo(() => calculateAnalytics(), []);

  const hasData = attempts.length > 0;

  // Chronologically sorted attempts
  const sortedAttempts = useMemo(() => {
    return [...attempts].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
  }, [attempts]);

  // Real Subject trajectory (Early vs Recent)
  const subjectTrajectories = useMemo(() => {
    return (['mathematics', 'physics', 'chemistry'] as SubjectId[]).map((subj) => {
      const subjAttempts = attempts.filter((a) => a.quizConfig?.subject === subj);
      if (subjAttempts.length === 0) {
        return {
          subject: subj,
          totalAttempts: 0,
          currentAccuracy: 0,
          growthRate: 0,
          status: 'No activity yet',
        };
      }

      const totalQ = subjAttempts.reduce((acc, a) => acc + a.totalQuestions, 0);
      const totalCorrect = subjAttempts.reduce((acc, a) => acc + a.score, 0);
      const overallAcc = Math.round((totalCorrect / totalQ) * 100);

      // Early vs Recent diff
      let growth = 0;
      if (subjAttempts.length >= 2) {
        const sorted = [...subjAttempts].sort(
          (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
        );
        const first = sorted[0].accuracy;
        const last = sorted[sorted.length - 1].accuracy;
        growth = last - first;
      }

      return {
        subject: subj,
        totalAttempts: subjAttempts.length,
        currentAccuracy: overallAcc,
        growthRate: growth,
        status: growth >= 0 ? `+${growth}% trajectory` : `${growth}% trajectory`,
      };
    });
  }, [attempts]);

  // Derived Real Milestones based on actual stored student data
  const milestones = useMemo<Milestone[]>(() => {
    const totalQ = attempts.reduce((acc, a) => acc + a.totalQuestions, 0);
    const hasHighScore = attempts.some((a) => a.accuracy >= 80);
    const hasMasteredItem = revItems.some((r) => r.srsStage >= 4);

    return [
      {
        id: 'm1',
        title: language === 'hi' ? 'पहला कदम: प्रथम क्विज़ पूर्ण' : 'First Step: First Quiz Completed',
        description: language === 'hi' ? 'सीबीएसई बोर्ड परीक्षा की तैयारी का शुभारंभ।' : 'Started the CBSE Class 12 preparation journey.',
        isUnlocked: attempts.length >= 1,
        unlockedDate: attempts.length >= 1 ? new Date(attempts[attempts.length - 1].completedAt).toLocaleDateString() : undefined,
        iconName: 'Sparkles',
      },
      {
        id: 'm2',
        title: language === 'hi' ? 'क्विज़ धावक: 5 अभ्यास सत्र' : 'Consistent Learner: 5 Completed Quizzes',
        description: language === 'hi' ? 'नियमित रूप से 5 क्विज़ सत्र पूरे किए।' : 'Completed 5 structured practice or mock sessions.',
        isUnlocked: attempts.length >= 5,
        iconName: 'BookOpen',
      },
      {
        id: 'm3',
        title: language === 'hi' ? 'सटीकता विजय: 80%+ स्कोर' : 'Precision Marksman: 80%+ Accuracy',
        description: language === 'hi' ? 'किसी बोर्ड अभ्यास में 80% से अधिक अंक प्राप्त किए।' : 'Achieved 80%+ accuracy on a board examination drill.',
        isUnlocked: hasHighScore,
        iconName: 'Award',
      },
      {
        id: 'm4',
        title: language === 'hi' ? 'कंठस्थ सिद्ध: स्टेज 4 दोहराव' : 'Retention Master: Stage 4 Mastered',
        description: language === 'hi' ? 'अंतराल दोहराव में किसी अवधारणा को सिद्ध किया।' : 'Mastered a concept through the 14-day spaced repetition cycle.',
        isUnlocked: hasMasteredItem,
        iconName: 'RotateCcw',
      },
      {
        id: 'm5',
        title: language === 'hi' ? 'प्रश्न शतक: 50+ प्रश्न हल' : 'Centurion: 50+ Questions Solved',
        description: language === 'hi' ? 'कुल 50 से अधिक बोर्ड प्रश्नों का अभ्यास किया।' : 'Solved over 50 authentic CBSE Class 12 board problems.',
        isUnlocked: totalQ >= 50,
        iconName: 'Zap',
      },
    ];
  }, [attempts, revItems, language]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
            <Calendar className="w-4 h-4" />
            <span>HISTORICAL LEARNING TIMELINE & MILESTONES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'AI प्रगति समयरेखा' : 'AI Progress Timeline'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {language === 'hi'
              ? 'समय के साथ आपकी सीखने की प्रगति, हल की गई क्विज़ का कालानुक्रमिक इतिहास, सटीकता के रुझान और अर्जित मील के पत्थर।'
              : 'Chronological timeline of verified quiz completions, accuracy trajectories, spaced-repetition activity, and academic milestones.'}
          </p>
        </div>

        <Link
          to="/analytics"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
        >
          <span>{language === 'hi' ? 'पूर्ण विश्लेषण' : 'Analytics View'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {!hasData ? (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <Clock className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'अभी तक कोई गतिविधि इतिहास नहीं है' : 'No Activity Records Found'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {language === 'hi'
              ? 'प्रगति समयरेखा वास्तविक अध्ययन डेटा का उपयोग करती है। अपनी पहली क्विज़ पूरा करते ही समयरेखा स्वतः प्रारंभ हो जाएगी।'
              : 'Your progress timeline tracks authentic practice milestones without generating fabricated records. Complete your first quiz to begin your history.'}
          </p>
          <div className="pt-2">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white text-xs sm:text-sm font-bold shadow-md hover:bg-indigo-500 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{language === 'hi' ? 'पहला क्विज़ प्रारंभ करें' : 'Start First Quiz Drill'}</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Milestones Horizontal Bar */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span>{language === 'hi' ? 'सीखने के मील के पत्थर (Study Milestones)' : 'Verified Study Milestones'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {milestones.map((m) => (
                <div
                  key={m.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    m.isUnlocked
                      ? 'bg-white dark:bg-slate-900 border-indigo-200/80 dark:border-indigo-900/40 shadow-xs'
                      : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800/60 opacity-50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{m.isUnlocked ? '🏆' : '🔒'}</span>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full ${
                          m.isUnlocked
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {m.isUnlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                      {m.title}
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {m.description}
                    </p>
                  </div>

                  {m.unlockedDate && (
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400">
                      {m.unlockedDate}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Subject-wise Growth Trajectory */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>{language === 'hi' ? 'विषयवार सुधार दिशा' : 'Subject-Wise Improvement'}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subjectTrajectories.map((st) => (
                <div
                  key={st.subject}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase text-slate-400">
                      {translateSubject(st.subject)}
                    </span>
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      {st.status}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                      {st.currentAccuracy}%
                    </span>
                    <span className="text-xs text-slate-400">
                      {st.totalAttempts} {st.totalAttempts === 1 ? 'quiz' : 'quizzes'}
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                      style={{ width: `${st.currentAccuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chronological History Feed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>{language === 'hi' ? 'कालानुक्रमिक सत्र इतिहास' : 'Chronological Session Feed'}</span>
              </h2>
              <span className="text-xs text-slate-400">
                {sortedAttempts.length} {sortedAttempts.length === 1 ? 'record' : 'records'}
              </span>
            </div>

            <div className="relative border-l-2 border-indigo-100 dark:border-indigo-950/80 ml-4 pl-6 space-y-6">
              {sortedAttempts.map((att) => {
                const isGreat = att.accuracy >= 80;
                return (
                  <div key={att.id} className="relative group">
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                        isGreat ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                    />

                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
                          <span className="uppercase text-indigo-600 dark:text-indigo-400">
                            {translateSubject(att.quizConfig?.subject as SubjectId)}
                          </span>
                          <span>·</span>
                          <span>
                            {new Date(att.completedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                          {att.quizConfig?.chapter === 'all'
                            ? language === 'hi'
                              ? 'सम्पूर्ण पाठ्यक्रम क्विज़'
                              : 'Full Syllabus Practice Quiz'
                            : att.quizConfig?.chapter}
                        </h3>

                        <div className="text-xs text-slate-500 mt-0.5">
                          Mode: {att.quizConfig?.mode || 'standard'} · {att.quizConfig?.difficulty || 'medium'}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right shrink-0">
                        <div>
                          <div
                            className={`text-xl font-black font-mono ${
                              isGreat ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {att.score} / {att.totalQuestions}
                          </div>
                          <div className="text-[11px] text-slate-400 font-semibold font-mono">
                            {att.accuracy}% accuracy
                          </div>
                        </div>

                        <Link
                          to={`/quiz?review=${att.id}`}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                        >
                          {language === 'hi' ? 'समीक्षा' : 'Review'}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
