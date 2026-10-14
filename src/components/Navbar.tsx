import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Clock,
  BarChart3,
  Menu,
  X,
  LayoutDashboard,
  Home,
  HardDrive,
  Globe,
  Sun,
  Moon,
  GraduationCap,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { AppView } from '../types/quiz';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onStartPractice: () => void;
  onStartExam: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onStartPractice,
  onStartExam,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const navItems: Array<{ label: string; view: AppView; icon: React.ReactNode }> = [
    { label: t.nav.home, view: 'landing', icon: <Home className="w-4 h-4" /> },
    { label: t.nav.dashboard, view: 'dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: t.nav.revision, view: 'revision', icon: <RotateCcw className="w-4 h-4 text-emerald-500" /> },
    { label: t.nav.smartPractice, view: 'smart-practice', icon: <Zap className="w-4 h-4 text-amber-500" /> },
    { label: t.nav.aiTutor, view: 'tutor', icon: <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> },
    { label: t.nav.weakTopicRadar, view: 'analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  BoardAce <span className="text-violet-600 dark:text-violet-400">AI</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider -mt-1 hidden sm:block">
                  {t.nav.brandSubtitle}
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5 ml-2">
              {navItems.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => handleNavClick(item.view)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/60 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  onStartPractice();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span>{t.nav.practiceQuiz}</span>
              </button>

              <button
                onClick={() => {
                  onStartExam();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{t.nav.examMode}</span>
              </button>
            </nav>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language Selector: 🌐 English | हिन्दी */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors shadow-xs">
              <span className="pl-2 pr-1 text-slate-500 dark:text-slate-400 text-xs hidden sm:inline-flex items-center gap-1 font-medium">
                <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              </span>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                aria-label="Select English language"
              >
                English
              </button>
              <span className="text-slate-300 dark:text-slate-600 text-xs font-light">|</span>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                aria-label="Select Hindi language"
              >
                हिन्दी
              </button>
            </div>

            {/* Theme Toggle Button: ☀️ Light Mode / 🌙 Dark Mode */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? t.nav.lightMode : t.nav.darkMode}
              aria-label={theme === 'dark' ? t.nav.lightMode : t.nav.darkMode}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline font-semibold">{t.nav.lightMode}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline font-semibold">{t.nav.darkMode}</span>
                </>
              )}
            </button>

            {/* Offline status badge */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
              <HardDrive className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.nav.offlineSaved}</span>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={onStartPractice}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-sm shadow-indigo-200 dark:shadow-none active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.nav.launchQuiz}</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {/* Mobile Theme & Language Controls Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>भाषा / Language</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    language === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    language === 'hi' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            {/* Mobile Theme Switcher */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 text-indigo-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <span>{theme === 'dark' ? t.nav.darkMode : t.nav.lightMode}</span>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 shadow-xs cursor-pointer"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.nav.lightMode}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{t.nav.darkMode}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                onStartPractice();
                setMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.nav.practiceQuiz}</span>
            </button>
            <button
              onClick={() => {
                onStartExam();
                setMobileMenuOpen(false);
              }}
              className="p-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:dark:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-amber-300" />
              <span>{t.nav.examMode}</span>
            </button>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between cursor-pointer ${
                  currentView === item.view
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.nav.storageNote}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
