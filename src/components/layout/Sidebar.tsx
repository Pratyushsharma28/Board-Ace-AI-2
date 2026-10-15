import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Clock,
  GraduationCap,
  Zap,
  BarChart3,
  RotateCcw,
  Layers,
  FileCode,
  Calendar,
  Bookmark,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
  Flame,
  FileUp,
  FileCheck,
  Brain,
  Map,
  Compass,
  FileText,
  PenTool,
  Dna,
  AlertTriangle,
  Bot,
  Edit3,
  Target,
  Award,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useClass } from '../../context/ClassContext';
import { getRevisionSummary } from '../../utils/revisionEngine';
import { getBookmarks } from '../../utils/storage';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { t, language } = useLanguage();
  const { grade, setGrade, gradeLabel } = useClass();

  // Metrics for badges
  const revSummary = React.useMemo(() => {
    try {
      return getRevisionSummary();
    } catch {
      return { dueCount: 0 };
    }
  }, []);

  const bookmarksCount = React.useMemo(() => {
    try {
      return getBookmarks().length;
    } catch {
      return 0;
    }
  }, []);

  const navSections = [
    {
      title: language === 'hi' ? 'अभ्यास एवं परीक्षा' : 'Core Practice',
      items: [
        {
          to: '/dashboard',
          label: t.nav.dashboard,
          icon: LayoutDashboard,
          badge: null,
        },
        {
          to: '/daily-challenge',
          label: t.nav.dailyChallenge || (language === 'hi' ? 'दैनिक चुनौती' : 'Daily Challenge'),
          icon: Flame,
          badge: 'Daily',
          badgeColor: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300',
        },
        {
          to: '/smart-retry',
          label: t.nav.smartRetry || (language === 'hi' ? 'स्मार्ट पुनः प्रयास' : 'Smart Retry'),
          icon: RotateCcw,
          badge: 'Retry',
          badgeColor: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300',
        },
        {
          to: '/focus-mode',
          label: t.nav.focusMode || (language === 'hi' ? 'फोकस मोड' : 'Focus Mode'),
          icon: Target,
          badge: null,
        },
        {
          to: '/quiz',
          label: t.nav.quiz,
          icon: BookOpen,
          badge: null,
        },
        {
          to: '/exam',
          label: t.nav.exam,
          icon: Clock,
          badge: null,
        },
        {
          to: '/practice',
          label: t.nav.smartPractice,
          icon: Zap,
          badge: null,
        },
        {
          to: '/pyq-hub',
          label: t.nav.pyqHub || (language === 'hi' ? 'CBSE पिछले वर्ष प्रश्न' : 'CBSE PYQ Hub'),
          icon: Award,
          badge: 'PYQ',
          badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300',
        },
        {
          to: '/competency-practice',
          label: t.nav.competencyPractice || (language === 'hi' ? 'योग्यता-आधारित अभ्यास' : 'Competency Practice'),
          icon: ShieldCheck,
          badge: 'NEP 2020',
          badgeColor: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300',
        },
      ],
    },
    {
      title: language === 'hi' ? 'AI शिक्षण इंटेलिजेंस' : 'AI Learning Intelligence',
      items: [
        {
          to: '/learning-dna',
          label: t.nav.learningDna || (language === 'hi' ? 'AI शिक्षण डीएनए' : 'Learning DNA'),
          icon: Dna,
          badge: 'New',
          badgeColor: 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300',
        },
        {
          to: '/weak-chapters',
          label: t.nav.weakChapters || (language === 'hi' ? 'कमजोर अध्याय संसूचक' : 'Weak Chapters'),
          icon: AlertTriangle,
          badge: null,
        },
        {
          to: '/study-coach',
          label: t.nav.studyCoach || (language === 'hi' ? 'AI अध्ययन कोच' : 'Study Coach'),
          icon: Bot,
          badge: null,
        },
        {
          to: '/mistake-notebook',
          label: t.nav.mistakeNotebook || (language === 'hi' ? 'मेरी गलती नोटबुक' : 'Mistake Notebook'),
          icon: Edit3,
          badge: null,
        },
        {
          to: '/chapter-tracker',
          label: t.nav.chapterTracker || (language === 'hi' ? 'अध्याय ट्रैकर' : 'Chapter Tracker'),
          icon: Layers,
          badge: null,
        },
        {
          to: '/progress-timeline',
          label: t.nav.progressTimeline || (language === 'hi' ? 'प्रगति समयरेखा' : 'Progress Timeline'),
          icon: Calendar,
          badge: null,
        },
        {
          to: '/ai-tutor',
          label: t.nav.aiTutor,
          icon: GraduationCap,
          badge: null,
        },
        {
          to: '/pdf-to-quiz',
          label: t.nav.pdfToQuiz || (language === 'hi' ? 'PDF से क्विज़' : 'PDF to Quiz'),
          icon: FileUp,
          badge: null,
        },
        {
          to: '/answer-checker',
          label: t.nav.answerChecker || (language === 'hi' ? 'मॉक बोर्ड परीक्षक' : 'Mock Examiner'),
          icon: FileCheck,
          badge: null,
        },
        {
          to: '/mistake-detective',
          label: t.nav.mistakeDetective || (language === 'hi' ? 'गलती जासूस 2.0' : 'Mistake Detective'),
          icon: Brain,
          badge: null,
        },
        {
          to: '/mastery-map',
          label: t.nav.masteryMap || (language === 'hi' ? 'दक्षता मानचित्र' : 'Mastery Map'),
          icon: Map,
          badge: null,
        },
        {
          to: '/study-roadmap',
          label: t.nav.studyRoadmap || (language === 'hi' ? 'अध्ययन रोडमैप' : 'Study Roadmap'),
          icon: Compass,
          badge: null,
        },
        {
          to: '/notes-generator',
          label: t.nav.notesGenerator || (language === 'hi' ? 'AI त्वरित नोट्स' : 'Notes Generator'),
          icon: FileText,
          badge: null,
        },
        {
          to: '/question-paper',
          label: t.nav.questionPaper || (language === 'hi' ? 'प्रश्न पत्र जनरेटर' : 'Question Paper'),
          icon: PenTool,
          badge: null,
        },
      ],
    },
    {
      title: language === 'hi' ? 'संसाधन एवं सेटिंग्स' : 'Resources & Settings',
      items: [
        {
          to: '/revision',
          label: t.nav.revision,
          icon: RotateCcw,
          badge: revSummary.dueCount > 0 ? `${revSummary.dueCount}` : null,
          badgeColor: 'bg-amber-500 text-white',
        },
        {
          to: '/analytics',
          label: t.nav.analytics,
          icon: BarChart3,
          badge: null,
        },
        {
          to: '/flashcards',
          label: t.nav.flashcards,
          icon: Layers,
          badge: null,
        },
        {
          to: '/formulas',
          label: t.nav.formulas,
          icon: FileCode,
          badge: null,
        },
        {
          to: '/study-planner',
          label: t.nav.studyPlanner,
          icon: Calendar,
          badge: null,
        },
        {
          to: '/bookmarks',
          label: t.nav.bookmarks,
          icon: Bookmark,
          badge: bookmarksCount > 0 ? `${bookmarksCount}` : null,
          badgeColor: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300',
        },
        {
          to: '/settings',
          label: t.nav.settings,
          icon: Settings,
          badge: null,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-colors">
      {/* Brand Header */}
      <div
        className={`flex items-center h-16 sm:h-18 px-4 border-b border-slate-200/80 dark:border-slate-800 ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        <NavLink
          to="/"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 focus:outline-none group overflow-hidden"
          title="BoardAce AI - Home"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform duration-200 shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col transition-opacity duration-200">
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                BoardAce <span className="text-violet-600 dark:text-violet-400">AI</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider -mt-0.5">
                {gradeLabel}
              </span>
            </div>
          )}
        </NavLink>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Class Switcher in Sidebar (when not collapsed) */}
      {!isCollapsed && (
        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between gap-1 p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl text-xs font-bold">
            <button
              onClick={() => setGrade('10')}
              className={`flex-1 py-1 px-2 rounded-lg text-center transition-all cursor-pointer ${
                grade === '10'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Class 10
            </button>
            <button
              onClick={() => setGrade('12')}
              className={`flex-1 py-1 px-2 rounded-lg text-center transition-all cursor-pointer ${
                grade === '12'
                  ? 'bg-indigo-600 text-white shadow-xs font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Class 12
            </button>
          </div>
        </div>
      )}

      {/* Navigation Links with Categorized Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  title={isCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                    } ${isCollapsed ? 'justify-center px-2' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                          isActive
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                        }`}
                      />

                      {!isCollapsed && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}

                      {!isCollapsed && item.badge && (
                        <span
                          className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ${
                            item.badgeColor ||
                            'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Collapsed mode dot badge */}
                      {isCollapsed && item.badge && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer / Collapse Toggle */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800">
        <div className="hidden lg:flex items-center justify-between">
          <button
            onClick={onToggleCollapse}
            className={`w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? t.nav.expandSidebar : t.nav.collapseSidebar}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>{t.nav.collapseSidebar}</span>
              </>
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div className="mt-2 text-center">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Made with ❤️ by Pratyush Sharma
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={`hidden lg:block fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden animate-fadeIn">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
