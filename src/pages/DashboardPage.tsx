import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  calculateAnalytics,
  getSavedAttempts,
  getActiveExamState,
  clearActiveExamState,
  ActiveExamState,
} from '../utils/storage';
import { getRevisionSummary } from '../utils/revisionEngine';
import { CBSE_CLASS_12_SUBJECTS } from '../data/syllabus';
import { SubjectId, QuizAttempt } from '../types/quiz';
import {
  Sparkles,
  BookOpen,
  Clock,
  GraduationCap,
  RotateCcw,
  BarChart3,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  FileCode,
  Zap,
  Play,
  Trash2,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { language, t, translateSubject } = useLanguage();
  const navigate = useNavigate();

  const analytics = useMemo(() => calculateAnalytics(), []);
  const attempts = useMemo(() => getSavedAttempts(), []);
  const revisionSummary = useMemo(() => getRevisionSummary(), []);
  const [activeExam, setActiveExam] = React.useState<ActiveExamState | null>(() => getActiveExamState());

  const hasData = attempts.length > 0;

  // Real Subject breakdown
  const subjectStats = useMemo(() => {
    return CBSE_CLASS_12_SUBJECTS.map((sub) => {
      const subAttempts = attempts.filter((a) => a.quizConfig.subject === sub.id);
      const totalQ = subAttempts.reduce((acc, a) => acc + a.totalQuestions, 0);
      const correctQ = subAttempts.reduce((acc, a) => acc + a.score, 0);
      const accuracy = totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0;
      return {
        id: sub.id,
        name: translateSubject(sub.id),
        code: sub.code,
        chaptersCount: sub.chapters.length,
        attemptsCount: subAttempts.length,
        totalQ,
        accuracy,
      };
    });
  }, [attempts, translateSubject]);

  // Real weak topics / recommendations
  const recommendations = useMemo(() => {
    const list: Array<{ title: string; subtitle: string; subject: SubjectId; to: string; type: 'revision' | 'weak' | 'suggested' }> = [];

    // If revision items are due today
    if (revisionSummary.dueCount > 0) {
      list.push({
        title: language === 'hi' ? `${revisionSummary.dueCount} प्रश्न दोहराव हेतु देय हैं` : `${revisionSummary.dueCount} Questions Due for Revision`,
        subtitle: language === 'hi'
          ? 'अंतराल दोहराव प्रणाली (Spaced Repetition) के अनुसार आज हल करें।'
          : 'Spaced repetition schedule recommends reviewing these items today.',
        subject: 'physics',
        to: '/revision',
        type: 'revision',
      });
    }

    // Top weak topics from actual attempts
    if (analytics.weakTopicsAllTime && analytics.weakTopicsAllTime.length > 0) {
      analytics.weakTopicsAllTime.slice(0, 2).forEach((wt) => {
        const subId = (['mathematics', 'physics', 'chemistry'].includes(wt.subject.toLowerCase()) ? wt.subject.toLowerCase() : 'physics') as SubjectId;
        list.push({
          title: language === 'hi' ? `कमजोर टॉपिक: ${wt.topic}` : `Target Topic: ${wt.topic}`,
          subtitle: language === 'hi'
            ? `सटीकता ${wt.accuracy}% है। बोर्ड परीक्षा में गलतियों से बचने हेतु पुनः अभ्यास करें।`
            : `${wt.accuracy}% accuracy in recent attempts. Run targeted practice drill.`,
          subject: subId,
          to: `/quiz?subject=${subId}`,
          type: 'weak',
        });
      });
    }

    // If no weak topics or fewer than 2, suggest exploring formulas / flashcards
    if (list.length < 3) {
      list.push({
        title: language === 'hi' ? 'उच्च-महत्व सूत्र पुस्तकालय' : 'High-Yield Formula Library',
        subtitle: language === 'hi'
          ? 'बोर्ड परीक्षा में बार-बार पूछे जाने वाले आवश्यक सूत्र और नियम दोहराएं।'
          : 'Review essential derivations and formulas verified for CBSE 2026–27.',
        subject: 'mathematics',
        to: '/formulas',
        type: 'suggested',
      });
    }

    return list;
  }, [revisionSummary, analytics, language]);

  const handleDiscardExam = () => {
    clearActiveExamState();
    setActiveExam(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'नमस्ते! आज बोर्ड परीक्षा की क्या तैयारी है?' : 'Ready to make progress today?'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'hi'
              ? 'सीबीएसई कक्षा 12 (सत्र 2026–27) · व्यक्तिगत छात्र कार्यक्षेत्र'
              : 'CBSE Class 12 (Session 2026–27) · Your personalized preparation workstation'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/quiz"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>{language === 'hi' ? 'नया क्विज़' : 'New Quiz'}</span>
          </Link>
          <Link
            to="/exam"
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{language === 'hi' ? 'परीक्षा सिम्युलेटर' : 'Exam Mode'}</span>
          </Link>
        </div>
      </div>

      {/* Active Exam Resume Alert (if user closed exam prematurely) */}
      {activeExam && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-amber-900 dark:text-amber-200">
                {language === 'hi' ? 'अधूरी परीक्षा सत्र सुरक्षित है' : 'In-Progress Board Exam Preserved'}
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                {language === 'hi'
                  ? `${activeExam.config.subject.toUpperCase()} - ${activeExam.questions.length} प्रश्न (${Math.floor(activeExam.secondsRemaining / 60)} मिनट शेष)`
                  : `${activeExam.config.subject.toUpperCase()} - ${activeExam.questions.length} Questions (${Math.floor(activeExam.secondsRemaining / 60)} mins remaining)`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/exam?resume=true"
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'परीक्षा जारी रखें' : 'Resume Exam'}</span>
            </Link>
            <button
              onClick={handleDiscardExam}
              className="p-1.5 text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-white rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors"
              title="Discard saved session"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. QUICK ACTIONS GRID */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          {language === 'hi' ? 'त्वरित कार्यवाहियाँ' : 'Quick Actions'}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link
            to="/quiz"
            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {language === 'hi' ? 'क्विज़ जनरेटर' : 'Generate Quiz'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'hi' ? 'अध्यायवार अभ्यास' : 'Chapter-wise MCQs'}
              </div>
            </div>
          </Link>

          <Link
            to="/exam"
            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {language === 'hi' ? 'परीक्षा शुरू करें' : 'Start Exam'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'hi' ? 'समयबद्ध मॉक पेपर' : 'Timed board simulator'}
              </div>
            </div>
          </Link>

          <Link
            to="/ai-tutor"
            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-600 hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                {language === 'hi' ? 'AI ट्यूटर से पूछें' : 'Ask AI Tutor'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'hi' ? 'संदेह व चरणबद्ध हल' : 'Step-by-step doubt solver'}
              </div>
            </div>
          </Link>

          <Link
            to="/revision"
            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-600 hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                {language === 'hi' ? 'रिवीजन शुरू करें' : 'Start Revision'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {revisionSummary.dueCount > 0 ? `${revisionSummary.dueCount} items due` : 'Spaced repetition'}
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 2.5 NEXT-GEN AI LEARNING TOOLS SUITE */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'अगली पीढ़ी के AI अध्ययन उपकरण' : 'Next-Generation AI Learning Suite'}</span>
          </h2>
          <span className="text-[11px] text-slate-400">CBSE Class 12 AI Powered</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/daily-challenge"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base">🔥</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                Daily
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {language === 'hi' ? 'दैनिक अभ्यास चुनौती' : 'Daily Challenge'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              5-question quick sprint
            </div>
          </Link>

          <Link
            to="/pdf-to-quiz"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base">📄</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                PDF AI
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {language === 'hi' ? 'PDF से क्विज़ जनरेटर' : 'PDF to Quiz'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Upload notes or sample PDF
            </div>
          </Link>

          <Link
            to="/answer-checker"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base">✍️</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Grading
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {language === 'hi' ? 'मॉक बोर्ड परीक्षक' : 'Mock Board Examiner'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              CBSE step-marking evaluation
            </div>
          </Link>

          <Link
            to="/mistake-detective"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-500 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base">🕵️‍♂️</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                Analysis
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {language === 'hi' ? 'गलती जासूस 2.0' : 'Mistake Detective'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Deep pitfall diagnosis
            </div>
          </Link>

          <Link
            to="/mastery-map"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base">🗺️</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Syllabus
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {language === 'hi' ? 'दक्षता मानचित्र' : 'Mastery Map'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              37 chapter diagnostic status
            </div>
          </Link>

          <Link
            to="/study-roadmap"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base">🧭</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                Planner
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {language === 'hi' ? 'AI अध्ययन रोडमैप' : 'AI Study Roadmap'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Personalized target exam plan
            </div>
          </Link>

          <Link
            to="/notes-generator"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base">📝</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                Notes
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              {language === 'hi' ? 'AI त्वरित नोट्स' : 'AI Notes Generator'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Key formulas & traps sheets
            </div>
          </Link>

          <Link
            to="/question-paper"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-pink-400 dark:hover:border-pink-500 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base">📑</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300">
                Blueprint
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
              {language === 'hi' ? 'प्रश्न पत्र जनरेटर' : 'Question Paper'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Section A-E practice paper
            </div>
          </Link>

          {/* AI Learning Intelligence System Features */}
          <Link
            to="/learning-dna"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-500 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base">🧬</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                Genome
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {language === 'hi' ? 'AI शिक्षण डीएनए' : 'AI Learning DNA'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Cognitive diagnostic profile
            </div>
          </Link>

          <Link
            to="/weak-chapters"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base">⚠️</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                Syllabus
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              {language === 'hi' ? 'कमजोर अध्याय संसूचक' : 'Weak Chapter Detector'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Pinpoint high-risk chapters
            </div>
          </Link>

          <Link
            to="/study-coach"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base">🤖</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Mentor
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {language === 'hi' ? 'AI अध्ययन कोच' : 'AI Study Coach'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Daily goals & mentor guidance
            </div>
          </Link>

          <Link
            to="/smart-retry"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base">🔄</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Redeem
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {language === 'hi' ? 'स्मार्ट पुनः प्रयास' : 'Smart Retry Mode'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Solve missed questions
            </div>
          </Link>

          <Link
            to="/mistake-notebook"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base">📓</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                Notes
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {language === 'hi' ? 'मेरी गलती नोटबुक' : 'My Mistake Notebook'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Auto-archived with notes
            </div>
          </Link>

          <Link
            to="/chapter-tracker"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base">📊</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                37 Chs
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {language === 'hi' ? 'अध्याय ट्रैकर' : 'Chapter Tracker'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Class 12 syllabus tracking
            </div>
          </Link>

          <Link
            to="/progress-timeline"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base">⏳</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                History
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              {language === 'hi' ? 'प्रगति समयरेखा' : 'Progress Timeline'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Milestones & trajectories
            </div>
          </Link>

          <Link
            to="/focus-mode"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-base">🎯</span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                Timer
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {language === 'hi' ? 'फोकस मोड' : 'Focus Mode'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
              Distraction-free study sprint
            </div>
          </Link>
        </div>
      </div>

      {/* 3. REAL STATISTICS (Tabular Numerals) */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          {language === 'hi' ? 'वास्तविक अध्ययन आंकड़े' : 'Real Performance Metrics'}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'हल किए गए प्रश्न' : 'Questions Attempted'}
            </span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
              {analytics.totalQuestionsAnswered}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              {language === 'hi' ? 'अभ्यास व मॉक परीक्षा में' : 'Across quizzes and mocks'}
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'औसत सटीकता' : 'Average Accuracy'}
            </span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
              {analytics.overallAccuracy}%
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              {analytics.totalQuizzesTaken > 0 ? `${analytics.totalQuestionsAnswered} questions solved` : 'No attempts yet'}
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'पूर्ण किए गए क्विज़' : 'Quizzes Completed'}
            </span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
              {analytics.totalQuizzesTaken}
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              {language === 'hi' ? 'सहेजे गए सत्र' : 'Saved locally'}
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'रिवीजन प्रगति' : 'Revision Progress'}
            </span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
              {revisionSummary.totalItems} <span className="text-sm font-semibold text-slate-400">saved</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-400">
              {revisionSummary.masteredCount} mastered · {revisionSummary.dueCount} due today
            </div>
          </div>
        </div>
      </div>

      {/* 4. SUBJECT CARDS & SMART RECOMMENDATIONS (2 Columns on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Subject Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'विषयवार प्रगति' : 'Subject Overview'}
            </h2>
            <Link
              to="/analytics"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {language === 'hi' ? 'विस्तृत विश्लेषण →' : 'Full Analytics →'}
            </Link>
          </div>

          <div className="space-y-3">
            {subjectStats.map((sub) => (
              <div
                key={sub.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                      CODE {sub.code}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {sub.name}
                    </h3>
                  </div>
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {sub.attemptsCount} quizzes completed · {sub.chaptersCount} NCERT chapters
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-lg font-black text-slate-900 dark:text-white font-mono tabular-nums">
                      {sub.accuracy}%
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {language === 'hi' ? 'सटीकता' : 'Accuracy'}
                    </div>
                  </div>

                  <Link
                    to={`/quiz?subject=${sub.id}`}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                  >
                    {language === 'hi' ? 'अभ्यास' : 'Drill'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Smart Recommendations (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'स्मार्ट अनुशंसाएँ' : 'Smart Recommendations'}
            </h2>
            <Link
              to="/practice"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {language === 'hi' ? 'अभ्यास इंजन →' : 'Practice Engine →'}
            </Link>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {rec.title}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {rec.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {rec.subtitle}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <Link
                    to={rec.to}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>{language === 'hi' ? 'अभी हल करें' : 'Open Target Tool'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. RECENT ACTIVITY (Actual Previous Activity) */}
      <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {language === 'hi' ? 'हाल की प्रश्नोत्तरी गतिविधि' : 'Recent Activity'}
          </h2>
          <Link
            to="/analytics"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {language === 'hi' ? 'सम्पूर्ण इतिहास' : 'View Full History'}
          </Link>
        </div>

        {attempts.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'अभी तक कोई क्विज़ हल नहीं किया गया' : 'No quizzes completed yet'}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {language === 'hi'
                ? 'अपनी पहली बोर्ड क्विज़ शुरू करें। आपकी सटीकता और कमजोर टॉपिक यहाँ स्वचालित रूप से दिखाई देंगे।'
                : 'Start your first CBSE chapter quiz. Your accuracy, topic breakdowns, and mistaken questions will appear here.'}
            </p>
            <div className="pt-2">
              <Link
                to="/quiz"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                <span>{language === 'hi' ? 'क्विज़ प्रारंभ करें' : 'Start First Quiz'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden">
            {attempts.slice(0, 5).map((att) => (
              <div
                key={att.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      {att.quizConfig.subject}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">·</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {att.quizConfig.chapter === 'all' ? 'All Chapters' : att.quizConfig.chapter}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(att.completedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                      {att.score}/{att.totalQuestions}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400 tabular-nums">
                      {att.accuracy}% accuracy
                    </div>
                  </div>

                  <Link
                    to={`/quiz?review=${att.id}`}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    {language === 'hi' ? 'समीक्षा' : 'Review'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
