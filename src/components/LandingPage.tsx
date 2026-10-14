import React, { useState } from 'react';
import { CBSE_CLASS_12_SUBJECTS } from '../data/syllabus';
import { SubjectId, Question } from '../types/quiz';
import { CURATED_BOARD_QUESTIONS } from '../data/sampleQuestions';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  ArrowRight,
  Target,
  CheckCircle2,
  BookOpen,
  Search,
  ShieldCheck,
  Zap,
  BarChart3,
  Flame,
  Award,
  Layers,
  HelpCircle,
  Clock,
  Compass,
  Check,
  X,
  Play,
  RotateCcw,
  LayoutDashboard,
  GraduationCap
} from 'lucide-react';

interface LandingPageProps {
  onStartQuiz: (prefill?: { subject?: SubjectId; chapter?: string; mode?: 'practice' | 'exam' }) => void;
  onOpenMistakeDetective: (question: Question, selectedAnswer: string) => void;
  onNavigateToDashboard: () => void;
  onNavigateToTutor?: () => void;
  onNavigateToSmartPractice?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartQuiz,
  onOpenMistakeDetective,
  onNavigateToDashboard,
  onNavigateToTutor,
  onNavigateToSmartPractice,
}) => {
  const { language, t, translateSubject, translateChapter } = useLanguage();

  // Quick Quiz interactive widget state (Physics Chapter 1)
  const quickQuestion = CURATED_BOARD_QUESTIONS[0];
  const [quickSelected, setQuickSelected] = useState<string | null>(null);
  const [quickAnswerSubmitted, setQuickAnswerSubmitted] = useState(false);

  const displayQuestionText = language === 'hi' && quickQuestion.questionHi
    ? quickQuestion.questionHi
    : quickQuestion.question;

  const displayOptions = language === 'hi' && quickQuestion.optionsHi
    ? quickQuestion.optionsHi
    : quickQuestion.options;

  const displayCorrectAnswer = language === 'hi' && quickQuestion.correctAnswerHi
    ? quickQuestion.correctAnswerHi
    : quickQuestion.correctAnswer;

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 sm:pt-16 pb-14 sm:pb-20 overflow-hidden bg-gradient-to-b from-blue-50/60 via-indigo-50/30 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 transition-colors">
        {/* Subtle decorative glowing mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-blue-400/10 via-indigo-400/10 to-violet-400/10 dark:from-blue-600/10 dark:via-indigo-600/10 dark:to-violet-600/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Kicker badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>{t.hero.kicker}</span>
              </div>

              {/* Required Heading & Subtitle */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                  {t.hero.titleLine1} <br />
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent">
                    {t.hero.titleGradient}
                  </span>
                </h1>

                <p className="text-lg sm:text-xl font-bold text-indigo-900 dark:text-indigo-200 max-w-xl">
                  {t.hero.subtitle}
                </p>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                  {t.hero.description}
                </p>
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => onStartQuiz()}
                  className="px-6 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-indigo-300 active:scale-[0.98] transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-indigo-100" />
                  <span>{t.hero.btnPractice}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onStartQuiz({ mode: 'exam' })}
                  className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm sm:text-base rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-amber-300" />
                  <span>{t.hero.btnExam}</span>
                </button>

                <button
                  onClick={onNavigateToDashboard}
                  className="px-5 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 font-bold text-sm sm:text-base rounded-2xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{t.hero.btnDashboard}</span>
                </button>

                {onNavigateToTutor && (
                  <button
                    onClick={onNavigateToTutor}
                    className="px-5 py-3.5 bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 dark:hover:bg-violet-900 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 font-bold text-sm sm:text-base rounded-2xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    <span>{t.nav.aiTutor}</span>
                  </button>
                )}
              </div>

              {/* Trust Metric Strip */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-base sm:text-xl tabular-nums">{t.hero.sessionBadge}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs">{t.hero.sessionBadgeSub}</div>
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-base sm:text-xl tabular-nums">{t.hero.coverageBadge}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs">{t.hero.coverageBadgeSub}</div>
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-base sm:text-xl tabular-nums">{t.hero.freeBadge}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-xs">{t.hero.freeBadgeSub}</div>
                </div>
              </div>
            </div>

            {/* Right Column Visual Banner */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-700 shadow-2xl bg-slate-900 group">
                <img
                  src="/src/assets/images/hero_boardace_study_1791644545033.jpg"
                  alt="BoardAce AI Class 12 board study workstation with physics notes and circuit formulas"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                  <div className="flex items-center gap-2 text-violet-300 text-xs font-bold mb-1">
                    <ShieldCheck className="w-4 h-4 text-violet-400" />
                    <span>{t.hero.bannerTag}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {t.hero.bannerTitle}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {t.hero.bannerDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>Smart Exam Technology</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.landing.featuresTitle}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            {t.landing.featuresSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Weak Topic Radar */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-6 shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.landing.feature1Title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.landing.feature1Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-1 text-xs font-bold text-violet-600 dark:text-violet-400">
              <span>(Correct / Attempted) × 100</span>
            </div>
          </div>

          {/* Card 2: Mistake Detective */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-6 shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.landing.feature2Title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.landing.feature2Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
              <span>Concept Autopsy & Anchors</span>
            </div>
          </div>

          {/* Card 3: CBSE Exam Mode */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-6 shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.landing.feature3Title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.landing.feature3Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>Countdown & Warnings</span>
            </div>
          </div>

          {/* Card 4: Full Syllabus Coverage */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-6 shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.landing.feature4Title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.landing.feature4Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
              <span>Maths (041), Phys (042), Chem (043)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE LIVE QUIZ PREVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-3xl border-2 border-indigo-100 dark:border-slate-700 p-6 sm:p-8 shadow-xl shadow-indigo-50/50 dark:shadow-none space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>{t.landing.sampleChallengeTitle}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {t.landing.sampleChallengeSubtitle}
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 self-start sm:self-auto">
              NCERT Section A
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
              {displayQuestionText}
            </p>

            {/* Options */}
            <div className="space-y-2.5">
              {displayOptions.map((opt, idx) => {
                const isSelected = quickSelected === opt;
                const isCorrect = opt === displayCorrectAnswer;

                let btnStyle = 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-200';
                if (quickAnswerSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'border-rose-400 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200 font-semibold';
                }

                return (
                  <button
                    key={idx}
                    disabled={quickAnswerSubmitted}
                    onClick={() => setQuickSelected(opt)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {quickAnswerSubmitted && isCorrect && (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    {quickAnswerSubmitted && isSelected && !isCorrect && (
                      <X className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Actions */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {!quickAnswerSubmitted ? (
              <button
                disabled={!quickSelected}
                onClick={() => setQuickAnswerSubmitted(true)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
              >
                Submit Answer
              </button>
            ) : (
              <div className="w-full space-y-4 animate-fadeIn">
                <div
                  className={`p-3.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 ${
                    quickSelected === displayCorrectAnswer
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {quickSelected === displayCorrectAnswer ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <HelpCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>
                    {quickSelected === displayCorrectAnswer
                      ? t.landing.correctAnswerMsg
                      : t.landing.wrongAnswerMsg}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() =>
                      onOpenMistakeDetective(quickQuestion, quickSelected || displayOptions[1])
                    }
                    className="px-4 py-2 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{t.landing.analyzeMistakeBtn}</span>
                  </button>

                  <button
                    onClick={() => {
                      setQuickSelected(null);
                      setQuickAnswerSubmitted(false);
                    }}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. SUBJECT SELECTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.landing.subjectsTitle}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
            {t.landing.subjectsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CBSE_CLASS_12_SUBJECTS.map((subject) => {
            const translatedName = translateSubject(subject.id);
            const desc =
              subject.id === 'mathematics'
                ? t.landing.mathsDesc
                : subject.id === 'physics'
                ? t.landing.physicsDesc
                : t.landing.chemDesc;

            return (
              <div
                key={subject.id}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-500 transition-all flex flex-col justify-between group"
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

                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {translatedName}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed min-h-[40px]">
                    {desc}
                  </p>

                  <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Key Syllabus Chapters
                    </div>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      {subject.chapters.slice(0, 3).map((ch) => (
                        <li key={ch.id} className="truncate flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                          <span>{translateChapter(ch.name)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-4 flex items-center gap-2 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => onStartQuiz({ subject: subject.id, mode: 'practice' })}
                    className="flex-1 py-2.5 px-3 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{t.landing.practiceNow}</span>
                  </button>
                  <button
                    onClick={() => onStartQuiz({ subject: subject.id, mode: 'exam' })}
                    className="py-2.5 px-3 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-300" />
                    <span>{t.landing.launchExam}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pt-10 pb-8 mt-16 text-center space-y-3 transition-colors">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {t.landing.footerText}
        </p>
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1">
          <span>{t.landing.madeBy}</span>
        </p>
      </footer>
    </div>
  );
};
