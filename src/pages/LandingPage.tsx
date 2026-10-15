import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
  Zap,
  BarChart3,
  RotateCcw,
  Layers,
  FileCode,
  Calendar,
  Bookmark,
  CheckCircle2,
  ShieldCheck,
  Brain,
  Sun,
  Moon,
  ChevronRight,
  Target,
} from 'lucide-react';
import { CBSE_CLASS_12_SUBJECTS } from '../data/syllabus';

export const LandingPage: React.FC = () => {
  const { language, setLanguage, t, translateSubject, translateChapter } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featureCards = [
    {
      to: '/quiz',
      title: language === 'hi' ? 'AI क्विज़ जनरेटर' : 'AI Quiz Generator',
      desc: language === 'hi'
        ? 'कक्षा 12 एनसीईआरटी पाठ्यक्रम के अनुसार बहुविकल्पीय प्रश्न और विस्तृत समाधान।'
        : 'CBSE Class 12 board-aligned MCQs, Section A drill items, and step-by-step NCERT solutions.',
      icon: BookOpen,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60',
    },
    {
      to: '/exam',
      title: language === 'hi' ? 'बोर्ड परीक्षा सिम्युलेटर' : 'Board Exam Simulator',
      desc: language === 'hi'
        ? 'वास्तविक समय सीमा, प्रश्न पैलेट और स्वतः मूल्यांकन के साथ परीक्षा अभ्यास।'
        : 'Timed CBSE examination environment with question navigation palette, mark for review, and instant scorecard.',
      icon: Clock,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60',
    },
    {
      to: '/ai-tutor',
      title: language === 'hi' ? '24/7 AI पर्सनल ट्यूटर' : '24/7 AI Personal Tutor',
      desc: language === 'hi'
        ? 'गणित, भौतिकी एवं रसायन विज्ञान में संदेह समाधान, सूत्र विश्लेषण और चरणबद्ध हल।'
        : 'Instant doubt solver, step-by-step derivations, chemical mechanisms, and image-based question inquiry.',
      icon: GraduationCap,
      color: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60',
    },
    {
      to: '/revision',
      title: language === 'hi' ? 'स्मार्ट पुनरावलोकन केंद्र' : 'Smart Revision Center',
      desc: language === 'hi'
        ? 'वैज्ञानिक अंतराल दोहराव (1d → 3d → 7d) द्वारा गलतियों पर पकड़ बनाएं।'
        : 'Science-backed spaced repetition schedule automatically tracking missed items until verified mastery.',
      icon: RotateCcw,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60',
    },
    {
      to: '/analytics',
      title: language === 'hi' ? 'कमजोर टॉपिक रडार एवं विश्लेषण' : 'Weak Topic Radar & Analytics',
      desc: language === 'hi'
        ? 'अध्यायवार सटीकता, प्रदर्शन रुझान और परीक्षा पूर्व सुधार हेतु अंतर्दृष्टि।'
        : 'Real performance metrics, chapter accuracy distribution, and targeted focus areas without fake scoreboards.',
      icon: BarChart3,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60',
    },
    {
      to: '/practice',
      title: language === 'hi' ? 'अनुकूली स्मार्ट अभ्यास' : 'Adaptive Smart Practice',
      desc: language === 'hi'
        ? 'आपकी गलतियों और सटीकता के आधार पर व्यक्तिगत अभ्यास सुझाव।'
        : 'Automated step-up difficulty drills generated dynamically from your past quiz attempts.',
      icon: Zap,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60',
    },
  ];

  const steps = [
    {
      num: '01',
      title: language === 'hi' ? 'विषय एवं अध्याय चुनें' : 'Select Subject & Chapter',
      desc: language === 'hi'
        ? 'गणित, भौतिकी या रसायन विज्ञान में से किसी भी आधिकारिक 2026–27 अध्याय का चयन करें।'
        : 'Choose from verified CBSE Class 12 syllabus chapters across Mathematics, Physics, and Chemistry.',
    },
    {
      num: '02',
      title: language === 'hi' ? 'सक्रिय परीक्षण हल करें' : 'Solve Real Exam Items',
      desc: language === 'hi'
        ? 'बोर्ड पैटर्न आधारित प्रश्नों को हल करें और प्रत्येक विकल्प का विस्तृत कारण समझें।'
        : 'Engage with board-standard Section A MCQs, conceptual derivations, and numerical problems.',
    },
    {
      num: '03',
      title: language === 'hi' ? 'गलतियों का स्वतः दोहराव' : 'Automatic Spaced Revision',
      desc: language === 'hi'
        ? 'जिन प्रश्नों में त्रुटि होती है, वे स्मार्ट रिवीजन में दर्ज हो जाते हैं और 24h/72h बाद पुनः आते हैं।'
        : 'Every incorrect answer is preserved locally and scheduled for spaced retry until mastery is confirmed.',
    },
    {
      num: '04',
      title: language === 'hi' ? 'बोर्ड परीक्षा में उत्कृष्ट अंक' : 'Master Board Readiness',
      desc: language === 'hi'
        ? 'समयबद्ध सिम्युलेटर और निरंतर अभ्यास से परीक्षा कक्ष में 100% आत्मविश्वास।'
        : 'Identify knowledge gaps beforehand and walk into the examination hall with peak confidence.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar Contract (1 line brand wordmark, nav links, primary action) */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span>
              BoardAce <span className="text-violet-600 dark:text-violet-400">AI</span>
            </span>
          </Link>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <button
              onClick={scrollToFeatures}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {language === 'hi' ? 'सुविधाएं' : 'Features'}
            </button>
            <a
              href="#how-it-works"
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {language === 'hi' ? 'कार्यप्रणाली' : 'How It Works'}
            </a>
            <a
              href="#subjects"
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {language === 'hi' ? 'पाठ्यक्रम' : 'Subjects'}
            </a>
            <a
              href="#why-choose"
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {language === 'hi' ? 'विशेषताएं' : 'Why BoardAce'}
            </a>
          </nav>

          {/* Zone 3: Actions (Language, Theme, Primary Button) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language Toggle */}
            <div className="inline-flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs font-bold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  language === 'hi'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Primary Action Button */}
            <Link
              to="/dashboard"
              className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 rounded-xl shadow-xs transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>{language === 'hi' ? 'डैशबोर्ड खोलें' : 'Dashboard'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Unboxed editorial kicker */}
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
              <span>CBSE Class 12</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>Academic Session 2026–27</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>100% Free &amp; Private</span>
            </div>

            {/* Prompt exact required headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              {language === 'hi' ? (
                <>बोर्ड परीक्षा में सफलता का <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">स्मार्ट माध्यम</span></>
              ) : (
                <>Your Smarter Way to <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Ace Board Exams.</span></>
              )}
            </h1>

            {/* Prompt exact required subheading */}
            <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {language === 'hi'
                ? 'कक्षा 12 सीबीएसई के लिए एआई-संचालित क्विज़, व्यक्तिगत अभ्यास और वैज्ञानिक रूप से सुदृढ़ पुनरावलोकन।'
                : 'AI-powered quizzes, personalized practice, and smarter revision for CBSE Class 12.'}
            </p>

            {/* Primary & Secondary Buttons as explicitly requested */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4">
              <Link
                to="/dashboard"
                className="px-7 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{language === 'hi' ? 'अध्ययन शुरू करें' : 'Start Learning'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={scrollToFeatures}
                className="px-6 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-sm sm:text-base rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span>{language === 'hi' ? 'सुविधाएं देखें' : 'Explore Features'}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Proof & Reliability strip */}
            <div className="pt-8 grid grid-cols-3 gap-4 max-w-lg mx-auto text-center border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <div>
                <div className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg tabular-nums">3 Subjects</div>
                <div className="mt-0.5">Math, Physics, Chem</div>
              </div>
              <div>
                <div className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg tabular-nums">100% Free</div>
                <div className="mt-0.5">No login or signup required</div>
              </div>
              <div>
                <div className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg tabular-nums">On-Device</div>
                <div className="mt-0.5">Progress saved locally</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KEY FEATURES OVERVIEW */}
      <section id="features" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
              {language === 'hi' ? 'प्लेटफ़ॉर्म विशेषताएं' : 'Core Architecture'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {language === 'hi'
                ? 'प्रत्येक सुविधा के लिए समर्पित पृष्ठ और उपकरण'
                : 'Built for High-Yield CBSE Board Preparation'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {language === 'hi'
                ? 'कोई अव्यवस्था नहीं। हर अध्ययन उपकरण अपने समर्पित पृष्ठ पर व्यवस्थित रूप से उपलब्ध है।'
                : 'No cluttered infinite scroll. Every tool has its own dedicated workstation designed for focused learning.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.to}
                  className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${feat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {feat.title}
                      </h3>
                      <p className="mt-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-200/60 dark:border-slate-800/80">
                    <Link
                      to={feat.to}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      <span>{language === 'hi' ? 'खोलें' : 'Open Workspace'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Links to Supplementary Tools */}
          <div className="mt-10 p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 font-medium">
              <span className="font-bold">{language === 'hi' ? 'अतिरिक्त अध्ययन संसाधन:' : 'Additional Dedicated Tools:'}</span>{' '}
              <span className="text-slate-600 dark:text-slate-400">
                {language === 'hi'
                  ? 'फ्लैशकार्ड्स, सूत्र लाइब्रेरी, 30-दिवसीय अध्ययन योजनाकार और बुकमार्क'
                  : 'Flashcards, Formula Cheat-Sheets, 30-Day Study Planner, and Saved Bookmarks'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/flashcards"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {t.nav.flashcards}
              </Link>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <Link
                to="/formulas"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {t.nav.formulas}
              </Link>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <Link
                to="/study-planner"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {t.nav.studyPlanner}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW BOARDACE AI WORKS */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
              {language === 'hi' ? 'प्रक्रिया' : 'Scientific Methodology'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {language === 'hi' ? 'बोर्ड परीक्षा की वैज्ञानिक तैयारी' : 'How BoardAce AI Drives 95%+ Board Readiness'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {language === 'hi'
                ? 'रटने के बजाय संकल्पनात्मक समझ और सुधारात्मक अभ्यास पर केंद्रित।'
                : 'Engineered around deliberate practice, instant misconception diagnosis, and spaced retrieval intervals.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st) => (
              <div
                key={st.num}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3"
              >
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums font-mono">
                  {st.num}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {st.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SUBJECTS SUPPORTED */}
      <section id="subjects" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
              {language === 'hi' ? 'सत्यापित पाठ्यक्रम' : 'Class 12 Syllabus'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {language === 'hi' ? 'संबद्ध सीबीएसई विषय' : 'Comprehensive Coverage for Science Stream'}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {language === 'hi'
                ? 'कक्षा 12 सत्र 2026–27 के संपूर्ण एनसीईआरटी अध्याय और अंक विभाजन।'
                : 'Rigorous NCERT alignment with official board weightage across all 3 key disciplines.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CBSE_CLASS_12_SUBJECTS.map((sub) => (
              <div
                key={sub.id}
                className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                    CODE {sub.code}
                  </span>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {sub.chapters.length} Chapters
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {translateSubject(sub.id)}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {sub.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === 'hi' ? 'प्रमुख अध्याय:' : 'Sample High-Yield Topics:'}
                  </div>
                  <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    {sub.chapters.slice(0, 4).map((ch) => (
                      <li key={ch.id} className="flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        <span className="truncate">{translateChapter(ch.name)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800">
                  <Link
                    to={`/quiz?subject=${sub.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <span>{language === 'hi' ? 'अभ्यास शुरू करें' : 'Practice Chapter Drills'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE BOARDACE AI */}
      <section id="why-choose" className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">
              {language === 'hi' ? 'अंतर समझें' : 'The BoardAce Standard'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {language === 'hi' ? 'विद्यार्थी बोर्डएस एआई को क्यों चुनते हैं' : 'Why Students Trust BoardAce AI'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? 'सख्त पाठ्यक्रम सत्यापन' : 'Verified Syllabus Standard'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'hi'
                  ? 'कोई पुराने या अप्रासंगिक प्रश्न नहीं। प्रत्येक प्रश्न सीबीएसई 2026–27 पाठ्यक्रम के अनुसार परखा जाता है।'
                  : 'Zero deleted syllabus questions. AI generation runs through strict mathematical and curriculum validation.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? 'गलती जासूस (Mistake Detective)' : 'Mistake Detective Engine'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'hi'
                  ? 'केवल सही उत्तर नहीं, बल्कि यह समझें कि आपने गलत विकल्प क्यों चुना और बोर्ड परीक्षा में जाल से कैसे बचें।'
                  : 'Does not just show the correct option. It diagnoses why students fall for tempting traps and provides memory anchors.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? 'गोपनीय और बिना विज्ञापन' : '100% Free & Private'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'hi'
                  ? 'कोई लॉगिन या क्रेडिट कार्ड की आवश्यकता नहीं। आपकी प्रगति आपके ब्राउज़र में सुरक्षित रहती है।'
                  : 'Zero sign-up friction, zero ads, and zero subscriptions. Your progress stays securely in your local browser.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CALL TO ACTION */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi'
              ? 'क्या आप आज अभ्यास करने के लिए तैयार हैं?'
              : 'Ready to Make Real Progress Today?'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {language === 'hi'
              ? 'बिना किसी पंजीकरण के सीधे अपने छात्र डैशबोर्ड पर जाएँ और अपनी पहली बोर्ड क्विज़ शुरू करें।'
              : 'Jump straight into your personalized student workstation. No registration or credit card needed.'}
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-indigo-200 transition-all cursor-pointer"
            >
              <span>{language === 'hi' ? 'डैशबोर्ड खोलें' : 'Open Student Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-8 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-2">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            BoardAce AI · CBSE Class 12 (Session 2026–27)
          </p>
          <p>
            Made with ❤️ by Pratyush Sharma
          </p>
        </div>
      </footer>
    </div>
  );
};
