import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { CBSE_CLASS_12_SUBJECTS } from '../data/syllabus';
import { getSavedAttempts } from '../utils/storage';
import { getRevisionItems } from '../utils/revisionEngine';
import { SubjectId } from '../types/quiz';
import {
  Layers,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Search,
  Filter,
  Sparkles,
  Zap,
  RotateCcw,
  FileCode,
  FileText,
} from 'lucide-react';

interface ChapterTrackerItem {
  id: string;
  name: string;
  unit: string;
  subject: SubjectId;
  weightageEstimate: string;
  totalTopics: number;
  topics: string[];
  attempted: number;
  correct: number;
  accuracy: number;
  dueRevisionCount: number;
  masteredRevisionCount: number;
  status: 'not_started' | 'in_progress' | 'mastered';
  recommendedNextActivity: string;
}

export const ChapterTrackerPage: React.FC = () => {
  const { language, t, translateSubject } = useLanguage();
  const navigate = useNavigate();

  const [activeSubject, setActiveSubject] = useState<'all' | SubjectId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not_started' | 'in_progress' | 'mastered'>('all');

  const attempts = useMemo(() => getSavedAttempts(), []);
  const revItems = useMemo(() => getRevisionItems(), []);

  // Compute chapter-wise progress strictly based on authentic CBSE syllabus
  const trackerItems = useMemo<ChapterTrackerItem[]>(() => {
    const list: ChapterTrackerItem[] = [];

    CBSE_CLASS_12_SUBJECTS.forEach((subj) => {
      subj.chapters.forEach((ch) => {
        let total = 0;
        let correct = 0;

        // Match from attempts
        attempts.forEach((att) => {
          if (att.quizConfig?.subject === subj.id) {
            att.questions.forEach((q) => {
              const matches =
                q.chapter?.toLowerCase() === ch.name.toLowerCase() ||
                q.chapter?.toLowerCase().includes(ch.name.toLowerCase()) ||
                ch.name.toLowerCase().includes(q.chapter?.toLowerCase() || '');

              if (matches) {
                total++;
                const userAns = att.userAnswers ? att.userAnswers[q.id] : undefined;
                if (userAns === q.correctAnswer) {
                  correct++;
                }
              }
            });
          }
        });

        // Revision items status for this chapter
        let dueRev = 0;
        let masteredRev = 0;
        revItems.forEach((r) => {
          if (r.subject === subj.id && r.chapter) {
            const matches =
              r.chapter.toLowerCase() === ch.name.toLowerCase() ||
              r.chapter.toLowerCase().includes(ch.name.toLowerCase());
            if (matches) {
              if (r.srsStage >= 4) masteredRev++;
              else if (!r.isRevised) dueRev++;
            }
          }
        });

        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

        let status: ChapterTrackerItem['status'] = 'not_started';
        if (total === 0) status = 'not_started';
        else if (total >= 3 && accuracy >= 80) status = 'mastered';
        else status = 'in_progress';

        let recommendedNextActivity = '';
        if (total === 0) {
          recommendedNextActivity =
            language === 'hi'
              ? 'प्रारंभिक 5-प्रश्नों का डायग्नोस्टिक क्विज़ हल करें'
              : 'Complete first 5-question diagnostic drill';
        } else if (dueRev > 0) {
          recommendedNextActivity =
            language === 'hi'
              ? `दोहराव केंद्र में देय ${dueRev} प्रश्नों की समीक्षा करें`
              : `Clear ${dueRev} due questions in Revision Center`;
        } else if (accuracy < 60) {
          recommendedNextActivity =
            language === 'hi'
              ? 'सूत्र पुस्तकालय और एनसीईआरटी उदाहरण पुनः देखें'
              : 'Review core formulas & solve NCERT in-text examples';
        } else if (status === 'mastered') {
          recommendedNextActivity =
            language === 'hi'
              ? 'उच्च स्तर (HOTS) और पिछले वर्षों के बोर्ड प्रश्न हल करें'
              : 'Challenge with hard HOTS & previous years board questions';
        } else {
          recommendedNextActivity =
            language === 'hi'
              ? 'सटीकता को 80%+ तक पहुंचाने हेतु अभ्यास जारी रखें'
              : 'Complete targeted practice drill to reach 80%+ mastery';
        }

        list.push({
          id: `${subj.id}-${ch.id}`,
          name: ch.name,
          unit: ch.unit,
          subject: subj.id,
          weightageEstimate: ch.weightageEstimate,
          totalTopics: ch.topics.length,
          topics: ch.topics,
          attempted: total,
          correct,
          accuracy,
          dueRevisionCount: dueRev,
          masteredRevisionCount: masteredRev,
          status,
          recommendedNextActivity,
        });
      });
    });

    return list;
  }, [attempts, revItems, language]);

  // High-level completion stats
  const stats = useMemo(() => {
    const total = trackerItems.length;
    const completed = trackerItems.filter((c) => c.status === 'mastered').length;
    const inProgress = trackerItems.filter((c) => c.status === 'in_progress').length;
    const notStarted = trackerItems.filter((c) => c.status === 'not_started').length;
    return { total, completed, inProgress, notStarted };
  }, [trackerItems]);

  const filteredItems = useMemo(() => {
    return trackerItems.filter((c) => {
      if (activeSubject !== 'all' && c.subject !== activeSubject) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.unit.toLowerCase().includes(q) ||
          c.topics.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [trackerItems, activeSubject, statusFilter, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
            <Layers className="w-4 h-4" />
            <span>CBSE CLASS 12 CURRICULUM SYLLABUS TRACKER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'अध्याय ट्रैकर' : 'Chapter Tracker'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {language === 'hi'
              ? 'आधिकारिक 37 अध्यायों की विस्तृत प्रगति। अभ्यास स्थिति, सटीकता, दोहराव देयता और प्रत्येक अध्याय के लिए सुझाई गई अगली गतिविधि।'
              : 'Track progress across all 37 official CBSE Class 12 chapters with verified syllabus weightages, accuracy metrics, and direct tool actions.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/study-planner"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <span>{language === 'hi' ? 'अध्ययन योजनाकार' : 'Study Planner'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Aggregate Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {language === 'hi' ? 'कुल सीबीएसई अध्याय' : 'Total Chapters'}
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
            {stats.total}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            3 Core Subjects (041, 042, 043)
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {language === 'hi' ? 'कंठस्थ (Mastered)' : 'Mastered (80%+)'}
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {stats.completed}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {Math.round((stats.completed / stats.total) * 100)}% of Class 12 Syllabus
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {language === 'hi' ? 'प्रगति में' : 'In Progress'}
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-amber-500">
            {stats.inProgress}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {language === 'hi' ? 'अभ्यास प्रारंभ किया गया' : 'Active diagnostic data'}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {language === 'hi' ? 'अछूते अध्याय' : 'Unattempted'}
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-slate-400">
            {stats.notStarted}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {language === 'hi' ? 'शुरुआत की प्रतीक्षा' : 'Awaiting first drill'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Subject Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl overflow-x-auto custom-scrollbar">
          {(['all', 'mathematics', 'physics', 'chemistry'] as const).map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeSubject === sub
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {sub === 'all'
                ? language === 'hi'
                  ? 'सभी विषय (All 37)'
                  : 'All Subjects (37 Chapters)'
                : translateSubject(sub)}
            </button>
          ))}
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'अध्याय या टॉपिक खोजें...' : 'Search chapter or topic...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">{language === 'hi' ? 'सभी स्थितियाँ' : 'All Statuses'}</option>
            <option value="mastered">{language === 'hi' ? 'कंठस्थ (Mastered)' : 'Mastered'}</option>
            <option value="in_progress">{language === 'hi' ? 'प्रगति में' : 'In Progress'}</option>
            <option value="not_started">{language === 'hi' ? 'अछूता' : 'Unattempted'}</option>
          </select>
        </div>
      </div>

      {/* Chapter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isMastered = item.status === 'mastered';
          const isInProgress = item.status === 'in_progress';
          const isNotStarted = item.status === 'not_started';

          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all hover:shadow-md flex flex-col justify-between ${
                isMastered
                  ? 'border-emerald-200/80 dark:border-emerald-900/40'
                  : isInProgress
                  ? 'border-indigo-200/80 dark:border-indigo-900/40'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-slate-400">
                  <span>{translateSubject(item.subject)}</span>
                  <span>{item.weightageEstimate}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5 line-clamp-2">
                  {item.name}
                </h3>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {item.unit}
                </div>

                {/* Accuracy progress bar */}
                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold">
                      {item.attempted > 0 ? `${item.accuracy}% accuracy` : 'Not attempted'}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {item.correct} / {item.attempted} Qs
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isMastered ? 'bg-emerald-500' : isInProgress ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      style={{ width: `${item.attempted > 0 ? item.accuracy : 0}%` }}
                    />
                  </div>
                </div>

                {/* Revision Status */}
                {item.dueRevisionCount > 0 && (
                  <div className="mt-3 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-300 flex items-center justify-between">
                    <span>{item.dueRevisionCount} questions due for revision</span>
                    <Link to="/revision" className="font-bold underline">
                      Review
                    </Link>
                  </div>
                )}

                {/* Recommended Next Action */}
                <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    💡 Next Activity:
                  </span>
                  <p className="leading-snug">{item.recommendedNextActivity}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Link
                  to={`/quiz?subject=${item.subject}&chapter=${encodeURIComponent(item.name)}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold text-center transition-colors shadow-xs"
                >
                  {language === 'hi' ? 'क्विज़ हल करें' : 'Practice Drill'}
                </Link>

                <Link
                  to="/notes-generator"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                  title="Generate Chapter Revision Notes"
                >
                  <FileText className="w-4 h-4" />
                </Link>

                <Link
                  to="/formulas"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                  title="Formulas"
                >
                  <FileCode className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
