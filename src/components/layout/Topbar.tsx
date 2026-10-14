import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Sun,
  Moon,
  Globe,
  Search,
  Sparkles,
  Clock,
  BookOpen,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface TopbarProps {
  onOpenMobileSidebar: () => void;
  onOpenQuickQuiz?: () => void;
  onOpenQuickExam?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobileSidebar,
  onOpenQuickQuiz,
  onOpenQuickExam,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Page title mapping based on route
  const getPageInfo = () => {
    switch (pathname) {
      case '/dashboard':
        return { title: t.nav.dashboard, subtitle: 'CBSE Class 12 Performance Hub' };
      case '/quiz':
        return { title: t.nav.quiz, subtitle: 'Generate Board MCQs & Section A Drills' };
      case '/exam':
        return { title: t.nav.exam, subtitle: 'Timed CBSE Board Exam Simulation' };
      case '/ai-tutor':
        return { title: t.nav.aiTutor, subtitle: '24/7 NCERT Master Teacher & Doubt Forensics' };
      case '/practice':
        return { title: t.nav.smartPractice, subtitle: 'Adaptive Recommendations & Step-Up Drills' };
      case '/analytics':
        return { title: t.nav.analytics, subtitle: 'Weak Topic Radar & Chapter Performance' };
      case '/revision':
        return { title: t.nav.revision, subtitle: 'Science-Backed Spaced Repetition (1d → 3d → 7d)' };
      case '/flashcards':
        return { title: t.nav.flashcards, subtitle: 'High-Yield Concept & Definition Cards' };
      case '/formulas':
        return { title: t.nav.formulas, subtitle: 'Verified Formula Cheat-Sheet & Derivations' };
      case '/study-planner':
        return { title: t.nav.studyPlanner, subtitle: '30-Day CBSE Board Exam Strategy & Checklists' };
      case '/bookmarks':
        return { title: t.nav.bookmarks, subtitle: 'Saved Tricky Questions & Explanations' };
      case '/settings':
        return { title: t.nav.settings, subtitle: 'Preferences, Language & Local Data Management' };
      default:
        return { title: 'BoardAce AI', subtitle: 'CBSE Class 12 Preparation' };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <header className="sticky top-0 z-20 h-16 sm:h-18 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle + Page Title / Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                {pageInfo.title}
              </h1>
            </div>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 hidden sm:block truncate max-w-md">
              {pageInfo.subtitle}
            </span>
          </div>
        </div>

        {/* Right Actions: Quick Actions, Language, Theme */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Quiz Shortcut (desktop) */}
          <Link
            to="/quiz"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-700 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>{t.nav.practiceQuiz}</span>
          </Link>

          {/* Quick Exam Shortcut (desktop) */}
          <Link
            to="/exam"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-slate-700 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.nav.examMode}</span>
          </Link>

          {/* Language Toggle */}
          <div className="inline-flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                language === 'hi'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700"
            title={theme === 'dark' ? t.nav.lightMode : t.nav.darkMode}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
