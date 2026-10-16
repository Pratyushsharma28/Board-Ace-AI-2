import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useClass } from '../context/ClassContext';
import {
  Settings,
  Sun,
  Moon,
  Globe,
  HardDrive,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  GraduationCap,
  Sparkles,
  Atom,
  Briefcase,
  Layers,
} from 'lucide-react';
import { clearAllStorage, getSavedAttempts, getBookmarks } from '../utils/storage';
import { getRevisionItems } from '../utils/revisionEngine';

export const SettingsPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { grade, setGrade, gradeLabel, subjects, stream, setStream, isClass12 } = useClass();

  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [clearedToast, setClearedToast] = useState(false);

  const attempts = getSavedAttempts();
  const bookmarks = getBookmarks();
  const revisionItems = getRevisionItems();

  const handleExportData = () => {
    try {
      const data = {
        exportedAt: new Date().toISOString(),
        board: 'CBSE Class 12 (2026–27)',
        attempts,
        bookmarks,
        revisionItems,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `boardace-study-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleClearData = () => {
    clearAllStorage();
    setConfirmClearOpen(false);
    setClearedToast(true);
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'सेटिंग्स एवं प्राथमिकताएँ' : 'Settings & Preferences'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'hi'
              ? 'थीम, भाषा और ऑन-डिवाइस अध्ययन डेटा प्रबंधित करें।'
              : 'Customize reading appearance, interface language, and local storage data.'}
          </p>
        </div>
      </div>

      {clearedToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Local study data reset successfully. Reloading platform...</span>
        </div>
      )}

      {/* Class / Academic Standard Selection */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            <span>{language === 'hi' ? 'कक्षा चयन (Academic Class)' : 'Academic Class / Grade Selection'}</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            CBSE 2026–27
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {language === 'hi'
            ? 'अपनी कक्षा चुनें। पाठ्यक्रम, अध्याय, मॉक प्रश्न और सूत्र बैंक स्वचालित रूप से अपडेट हो जाएंगे।'
            : 'Select your enrolled board class. Syllabus, chapters, mock questions, and formula banks update instantly.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setGrade('10')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              grade === '10'
                ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                  CBSE Class X
                </div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white">
                  CBSE Class 10
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Secondary School Examination
                </div>
              </div>
              {grade === '10' && <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-1" />}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {language === 'hi' ? 'शामिल विषय:' : 'Active Subjects:'}
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300 font-medium">Maths (041)</span>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300 font-medium">Science (086)</span>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300 font-medium">Social Science (087)</span>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300 font-medium">English (184)</span>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setGrade('12')}
            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              grade === '12'
                ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                  CBSE Class XII
                </div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white">
                  CBSE Class 12
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Senior School Certificate Examination
                </div>
              </div>
              {grade === '12' && <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-1" />}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                {language === 'hi' ? 'शामिल विषय:' : 'Active Subjects:'}
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300 font-medium">Mathematics (041)</span>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300 font-medium">Physics (042)</span>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300 font-medium">Chemistry (043)</span>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300 font-medium">Commerce Stream</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Class 12 Stream Selection (Shown when Class 12 is active) */}
      {grade === '12' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>{language === 'hi' ? 'सीबीएसई कक्षा 12 स्ट्रीम चयन' : 'CBSE Class 12 Stream Selection'}</span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800">
              {stream === 'commerce'
                ? (language === 'hi' ? 'कॉमर्स स्ट्रीम सक्रिय' : 'Commerce Stream Active')
                : (language === 'hi' ? 'साइंस स्ट्रीम सक्रिय' : 'Science Stream Active')}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'hi'
              ? 'अपनी शैक्षणिक स्ट्रीम चुनें। अध्ययन सामग्री, अध्याय, सूत्र और मॉक पेपर आपकी स्ट्रीम के अनुसार अनुकूलित होंगे।'
              : 'Choose your academic stream. Study modules, chapter banks, formula sheets, and practice drills adapt automatically.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Science Stream Card */}
            <button
              type="button"
              onClick={() => setStream('science')}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                stream === 'science'
                  ? 'border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-600/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-105 transition-transform">
                    <Atom className="w-5 h-5" />
                  </div>
                  <div className="text-base font-extrabold text-slate-900 dark:text-white">
                    {language === 'hi' ? 'साइंस (Science)' : 'Science'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {language === 'hi'
                      ? 'गणित, भौतिकी, रसायन विज्ञान और वैज्ञानिक अवधारणाओं का अभ्यास करें।'
                      : 'Explore Mathematics, Physics, Chemistry and scientific concepts.'}
                  </div>
                </div>
                {stream === 'science' && <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-1" />}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                  {language === 'hi' ? 'शामिल विषय:' : 'Core Subjects:'}
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300 font-medium">Mathematics (041)</span>
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300 font-medium">Physics (042)</span>
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300 font-medium">Chemistry (043)</span>
                </div>
              </div>
            </button>

            {/* Commerce Stream Card */}
            <button
              type="button"
              onClick={() => setStream('commerce')}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                stream === 'commerce'
                  ? 'border-amber-600 dark:border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 ring-2 ring-amber-600/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-3 group-hover:scale-105 transition-transform">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="text-base font-extrabold text-slate-900 dark:text-white">
                    {language === 'hi' ? 'कॉमर्स (Commerce)' : 'Commerce'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {language === 'hi'
                      ? 'लेखाशास्त्र, व्यावसायिक अध्ययन, अर्थशास्त्र और अंग्रेजी में महारत हासिल करें।'
                      : 'Master Accountancy, Business Studies, Economics and English.'}
                  </div>
                </div>
                {stream === 'commerce' && <CheckCircle2 className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-1" />}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                  {language === 'hi' ? 'शामिल विषय:' : 'Core Subjects:'}
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300 font-medium">Accountancy (055)</span>
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300 font-medium">Business Studies (054)</span>
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300 font-medium">Economics (030)</span>
                  <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300 font-medium">English Core (301)</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 1. Theme Configuration */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>{language === 'hi' ? 'दिखावट एवं थीम' : 'Appearance & Theme'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              if (theme !== 'light') toggleTheme();
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              theme === 'light'
                ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-amber-500" />
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? 'लाइट मोड (दिन)' : 'Light Theme'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Clean crisp high-contrast off-white
                </div>
              </div>
            </div>
            {theme === 'light' && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
          </button>

          <button
            type="button"
            onClick={() => {
              if (theme !== 'dark') toggleTheme();
            }}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              theme === 'dark'
                ? 'border-indigo-400 bg-indigo-950/40 ring-2 ring-indigo-400/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-indigo-400" />
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? 'डार्क मोड (रात)' : 'Dark Theme'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Deep charcoal with soft violet highlights
                </div>
              </div>
            </div>
            {theme === 'dark' && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
          </button>
        </div>
      </div>

      {/* 2. Language Configuration */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Globe className="w-4 h-4 text-indigo-500" />
          <span>{language === 'hi' ? 'भाषा प्राथमिकता (Language)' : 'Language Selection'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              language === 'en'
                ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">English</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Standard CBSE English-Medium Terminology
              </div>
            </div>
            {language === 'en' && <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          </button>

          <button
            type="button"
            onClick={() => setLanguage('hi')}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
              language === 'hi'
                ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">हिन्दी (Hindi)</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                प्रमाणित एनसीईआरटी हिन्दी माध्यम शब्दावली
              </div>
            </div>
            {language === 'hi' && <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
          </button>
        </div>
      </div>

      {/* 3. On-Device Storage & Data Privacy */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <HardDrive className="w-4 h-4 text-emerald-500" />
          <span>{language === 'hi' ? 'स्थानीय डेटा एवं गोपनीयता' : 'On-Device Storage & Backup'}</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          BoardAce AI stores 100% of your quiz attempts, bookmarks, and revision intervals locally on this browser. No personal information or tracking telemetry is sent to any external database.
        </p>

        {/* Data summary */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center text-xs">
          <div>
            <div className="text-base font-black font-mono text-slate-900 dark:text-white tabular-nums">
              {attempts.length}
            </div>
            <div className="text-slate-500 dark:text-slate-400 mt-0.5">Quiz Attempts</div>
          </div>
          <div>
            <div className="text-base font-black font-mono text-slate-900 dark:text-white tabular-nums">
              {revisionItems.length}
            </div>
            <div className="text-slate-500 dark:text-slate-400 mt-0.5">Revision Items</div>
          </div>
          <div>
            <div className="text-base font-black font-mono text-slate-900 dark:text-white tabular-nums">
              {bookmarks.length}
            </div>
            <div className="text-slate-500 dark:text-slate-400 mt-0.5">Saved Bookmarks</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Study Data (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmClearOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Local Progress</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmClearOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md w-full space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Reset All Local Study Progress?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This will remove all your saved quiz attempts, spaced repetition stages, and bookmarked questions from this browser. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmClearOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer"
              >
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Curriculum & Academic Verification */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Curriculum Standards Specification</span>
        </div>
        <p>
          BoardAce AI is built strictly according to the Central Board of Secondary Education (CBSE) Senior School Certificate Examination curriculum for Academic Session 2026–27. Covered subjects include Mathematics (Code 041), Physics (Code 042), and Chemistry (Code 043).
        </p>
        <p className="pt-2 border-t border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">
          Made with ❤️ by Pratyush Sharma
        </p>
      </div>
    </div>
  );
};
