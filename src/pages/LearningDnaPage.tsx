import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getSavedAttempts, calculateAnalytics } from '../utils/storage';
import { getRevisionItems } from '../utils/revisionEngine';
import { SubjectId, QuizAttempt } from '../types/quiz';
import {
  Dna,
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  Calendar,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const LearningDnaPage: React.FC = () => {
  const { language, t, translateSubject } = useLanguage();
  const navigate = useNavigate();

  const attempts: QuizAttempt[] = useMemo(() => getSavedAttempts(), []);
  const revItems = useMemo(() => getRevisionItems(), []);
  const analytics = useMemo(() => calculateAnalytics(), []);

  const hasData = attempts.length > 0;

  // 1. Subject-wise Strengths Analysis
  const subjectBreakdown = useMemo(() => {
    const map: Record<SubjectId, { attempted: number; correct: number; chapters: Set<string> }> = {
      mathematics: { attempted: 0, correct: 0, chapters: new Set() },
      physics: { attempted: 0, correct: 0, chapters: new Set() },
      chemistry: { attempted: 0, correct: 0, chapters: new Set() },
    };

    attempts.forEach((att) => {
      const subj = (att.quizConfig?.subject?.toLowerCase() || 'physics') as SubjectId;
      if (map[subj]) {
        map[subj].attempted += att.totalQuestions;
        map[subj].correct += att.score;
        if (att.quizConfig.chapter && att.quizConfig.chapter !== 'all') {
          map[subj].chapters.add(att.quizConfig.chapter);
        }
      }
    });

    return (['mathematics', 'physics', 'chemistry'] as SubjectId[]).map((subj) => {
      const data = map[subj];
      const acc = data.attempted > 0 ? Math.round((data.correct / data.attempted) * 100) : 0;
      let strengthLevel: 'Strong' | 'Developing' | 'Needs Attention' | 'Unattempted' = 'Unattempted';
      if (data.attempted > 0) {
        if (data.attempted < 3) strengthLevel = 'Developing';
        else if (acc >= 75) strengthLevel = 'Strong';
        else if (acc >= 50) strengthLevel = 'Developing';
        else strengthLevel = 'Needs Attention';
      }

      return {
        subject: subj,
        attempted: data.attempted,
        correct: data.correct,
        accuracy: acc,
        chaptersCount: data.chapters.size,
        strengthLevel,
      };
    });
  }, [attempts]);

  // 2. Topics Needing Improvement (Real data only: topics where accuracy < 70% or errors recorded)
  const weakTopics = useMemo(() => {
    const topicMap: Record<string, { subject: SubjectId; total: number; mistakes: number; chapter?: string }> = {};

    attempts.forEach((att) => {
      const subj = (att.quizConfig?.subject?.toLowerCase() || 'physics') as SubjectId;
      att.questions.forEach((q, idx) => {
        const topic = q.topic || 'General Topic';
        if (!topicMap[topic]) {
          topicMap[topic] = { subject: subj, total: 0, mistakes: 0, chapter: q.chapter };
        }
        topicMap[topic].total++;
        const userAns = att.userAnswers ? att.userAnswers[q.id] : undefined;
        if (userAns !== q.correctAnswer) {
          topicMap[topic].mistakes++;
        }
      });
    });

    return Object.entries(topicMap)
      .filter(([_, stat]) => stat.total >= 1 && (stat.mistakes / stat.total) > 0.3)
      .map(([topic, stat]) => ({
        topic,
        subject: stat.subject,
        chapter: stat.chapter,
        accuracy: Math.round(((stat.total - stat.mistakes) / stat.total) * 100),
        mistakes: stat.mistakes,
        total: stat.total,
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 6);
  }, [attempts]);

  // 3. Practised Chapters
  const practicedChapters = useMemo(() => {
    const chapterMap: Record<string, { subject: SubjectId; total: number; correct: number }> = {};

    attempts.forEach((att) => {
      const subj = (att.quizConfig?.subject?.toLowerCase() || 'physics') as SubjectId;
      att.questions.forEach((q) => {
        if (!q.chapter) return;
        if (!chapterMap[q.chapter]) {
          chapterMap[q.chapter] = { subject: subj, total: 0, correct: 0 };
        }
        chapterMap[q.chapter].total++;
        const userAns = att.userAnswers ? att.userAnswers[q.id] : undefined;
        if (userAns === q.correctAnswer) {
          chapterMap[q.chapter].correct++;
        }
      });
    });

    return Object.entries(chapterMap).map(([chapter, stat]) => ({
      chapter,
      subject: stat.subject,
      total: stat.total,
      accuracy: Math.round((stat.correct / stat.total) * 100),
    }));
  }, [attempts]);

  // 4. Accuracy Trends & Recent Improvement
  const { trendData, improvementRate, isImproving } = useMemo(() => {
    if (attempts.length < 2) {
      return { trendData: [], improvementRate: 0, isImproving: null };
    }

    // Sort chronologically
    const sorted = [...attempts].sort(
      (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    );

    const trends = sorted.map((att, idx) => ({
      index: idx + 1,
      date: new Date(att.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      accuracy: att.accuracy,
      score: att.score,
      total: att.totalQuestions,
      subject: att.quizConfig?.subject,
    }));

    // Compare earliest 50% attempts vs latest 50% attempts
    const mid = Math.floor(sorted.length / 2);
    const early = sorted.slice(0, mid);
    const recent = sorted.slice(mid);

    const earlyAvg = early.reduce((acc, a) => acc + a.accuracy, 0) / early.length;
    const recentAvg = recent.reduce((acc, a) => acc + a.accuracy, 0) / recent.length;
    const diff = Math.round(recentAvg - earlyAvg);

    return {
      trendData: trends,
      improvementRate: Math.abs(diff),
      isImproving: diff >= 0,
    };
  }, [attempts]);

  // 5. Dynamic Recommendations
  const recommendations = useMemo(() => {
    const list: string[] = [];

    if (!hasData) return list;

    // Check lowest subject
    const attemptedSubjects = subjectBreakdown.filter((s) => s.attempted > 0);
    if (attemptedSubjects.length > 0) {
      const lowestSubj = [...attemptedSubjects].sort((a, b) => a.accuracy - b.accuracy)[0];
      if (lowestSubj.accuracy < 70) {
        list.push(
          language === 'hi'
            ? `${translateSubject(lowestSubj.subject)} में आपकी औसत सटीकता ${lowestSubj.accuracy}% है। बुनियादी सूत्रों और एनसीईआरटी अभ्यासों पर ध्यान दें।`
            : `Priority Area: Your accuracy in ${translateSubject(lowestSubj.subject)} is currently ${lowestSubj.accuracy}%. Allocate focused practice blocks here.`
        );
      }
    }

    if (weakTopics.length > 0) {
      list.push(
        language === 'hi'
          ? `शीर्ष कमजोर टॉपिक "${weakTopics[0].topic}" (${weakTopics[0].accuracy}% सटीकता)। गलती जासूस और स्मार्ट पुनः प्रयास का उपयोग करें।`
          : `Targeted remediation recommended for "${weakTopics[0].topic}" (${weakTopics[0].accuracy}% accuracy). Review NCERT proofs before retrying.`
      );
    }

    if (revItems.filter((i) => !i.isRevised).length > 0) {
      const dueCount = revItems.filter((i) => !i.isRevised).length;
      list.push(
        language === 'hi'
          ? `आपके पास ${dueCount} प्रश्न दोहराव हेतु देय हैं। वैज्ञानिक अंतराल दोहराव के साथ अभ्यास करें।`
          : `Active retention queue: You have ${dueCount} saved quiz mistakes due for spaced-repetition revision.`
      );
    }

    if (list.length === 0) {
      list.push(
        language === 'hi'
          ? 'उत्कृष्ट प्रगति! पूर्ण बोर्ड सिमुलेशन के लिए परीक्षा मोड (Exam Mode) में 70 अंकों का पेपर हल करें।'
          : 'High conceptual momentum! Take a full 70-mark timed mock exam to test sustained exam velocity.'
      );
    }

    return list;
  }, [hasData, subjectBreakdown, weakTopics, revItems, language, translateSubject]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-violet-600 dark:text-violet-400">
            <Dna className="w-4 h-4" />
            <span>COGNITIVE LEARNING GENOME · CBSE CLASS 12</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'AI शिक्षण डीएनए' : 'AI Learning DNA'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {language === 'hi'
              ? 'आपके वास्तविक क्विज़ प्रदर्शन का गहरा विश्लेषण। वास्तविक डेटा पर आधारित ताकतें, कमजोरियां और सीखने की अनुकूली सिफारिशें।'
              : 'A personalized diagnostic fingerprint of your learning patterns, cognitive retention, and subject mastery derived exclusively from authentic quiz attempts.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/quiz"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 dark:shadow-none transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'hi' ? 'क्विज़ हल करें' : 'Take a Quiz'}</span>
          </Link>
        </div>
      </div>

      {!hasData ? (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Dna className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'अभी तक कोई क्विज़ डेटा उपलब्ध नहीं है' : 'No Quiz Data Recorded Yet'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {language === 'hi'
              ? 'आपका AI लर्निंग डीएनए वास्तविक छात्र प्रदर्शन पर आधारित होता है। अपनी पहली अध्याय क्विज़ शुरू करें ताकि आपका अनूठा प्रोफाइल बन सके।'
              : 'Your AI Learning DNA maps real academic performance without fabricated statistics. Complete your first practice quiz to generate your genome profile.'}
          </p>
          <div className="pt-2">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{language === 'hi' ? 'पहला क्विज़ प्रारंभ करें' : 'Start First Practice Quiz'}</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Real Learning DNA Dashboard */
        <div className="space-y-8">
          {/* Top High-level Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-400">
                {language === 'hi' ? 'कुल हल किए प्रश्न' : 'Questions Attempted'}
              </span>
              <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                {attempts.reduce((acc, a) => acc + a.totalQuestions, 0)}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                {attempts.length} {language === 'hi' ? 'सत्रों में' : 'completed sessions'}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-400">
                {language === 'hi' ? 'सटीकता दर' : 'Cumulative Accuracy'}
              </span>
              <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400">
                {analytics.overallAccuracy}%
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                {language === 'hi' ? 'समग्र प्रदर्शन' : 'Across all verified attempts'}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-400">
                {language === 'hi' ? 'अभ्यास किए गए अध्याय' : 'Chapters Covered'}
              </span>
              <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                {practicedChapters.length}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                {language === 'hi' ? '37 सीबीएसई अध्यायों में से' : 'out of 37 CBSE chapters'}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-semibold text-slate-400">
                {language === 'hi' ? 'हालिया सुधार दर' : 'Recent Trajectory'}
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span
                  className={`text-2xl sm:text-3xl font-black font-mono ${
                    isImproving ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isImproving !== null ? `${isImproving ? '+' : '-'}${improvementRate}%` : 'Stable'}
                </span>
                {isImproving && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                {isImproving === false && <TrendingDown className="w-4 h-4 text-amber-500" />}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                {language === 'hi' ? 'आरंभिक बनाम हाल के सत्र' : 'Early vs recent quizzes'}
              </div>
            </div>
          </div>

          {/* Section 1: Subject-wise Strengths */}
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>{language === 'hi' ? 'विषयवार क्षमता एवं पकड़' : 'Subject-Wise Strengths'}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subjectBreakdown.map((item) => (
                <div
                  key={item.subject}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      {translateSubject(item.subject)}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        item.strengthLevel === 'Strong'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : item.strengthLevel === 'Developing'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : item.strengthLevel === 'Needs Attention'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {item.strengthLevel}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                        {item.attempted > 0 ? `${item.accuracy}%` : '—'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {item.correct} / {item.attempted} correct
                      </span>
                    </div>

                    <div className="mt-2 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.accuracy >= 75
                            ? 'bg-emerald-500'
                            : item.accuracy >= 50
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${item.attempted > 0 ? item.accuracy : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                    <span>{item.chaptersCount} chapters active</span>
                    <Link
                      to={`/quiz?subject=${item.subject}`}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <span>{language === 'hi' ? 'अभ्यास' : 'Practice'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Topics Needing Improvement */}
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>{language === 'hi' ? 'सुधार योग्य कमजोर टॉपिक्स' : 'Topics Needing Improvement'}</span>
            </h2>

            {weakTopics.length === 0 ? (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3 text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>
                  {language === 'hi'
                    ? 'शानदार! आपके द्वारा हल किए गए सभी टॉपिक्स में 70% से अधिक सटीकता दर्ज है। नए अध्यायों का अभ्यास करें।'
                    : 'All attempted topics maintain solid accuracy (≥70%). Continue broadening your syllabus coverage!'}
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {weakTopics.map((wt, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/40 space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase text-slate-400">
                      <span>{translateSubject(wt.subject)}</span>
                      <span className="text-rose-600 dark:text-rose-400">{wt.accuracy}% acc</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {wt.topic}
                    </h3>
                    {wt.chapter && (
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        {wt.chapter}
                      </div>
                    )}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        {wt.mistakes} errors logged
                      </span>
                      <Link
                        to={`/quiz?subject=${wt.subject}&chapter=${encodeURIComponent(wt.chapter || '')}`}
                        className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{language === 'hi' ? 'सुधारें' : 'Target Drill'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Learning Recommendations */}
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>{language === 'hi' ? 'अनुकूली अध्ययन सिफारिशें' : 'Adaptive Learning Recommendations'}</span>
            </h2>

            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3.5 text-xs sm:text-sm text-indigo-950 dark:text-indigo-200"
                >
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Practised Chapters Log */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <span>{language === 'hi' ? 'सक्रिय अभ्यास किए गए अध्याय' : 'Practised Chapters'}</span>
              </h2>
              <Link
                to="/mastery-map"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {language === 'hi' ? 'दक्षता मानचित्र देखें →' : 'View Full Mastery Map →'}
              </Link>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {practicedChapters.map((ch, idx) => (
                  <div
                    key={idx}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs font-mono font-bold uppercase text-slate-400">
                        {translateSubject(ch.subject)}
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {ch.chapter}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="text-sm font-black font-mono text-slate-900 dark:text-white">
                          {ch.accuracy}%
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {ch.total} questions
                        </div>
                      </div>

                      <Link
                        to={`/quiz?subject=${ch.subject}&chapter=${encodeURIComponent(ch.chapter)}`}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        {language === 'hi' ? 'पुनः हल करें' : 'Practice'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
