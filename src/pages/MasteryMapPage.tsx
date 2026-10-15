import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { CBSE_CLASS_12_SUBJECTS } from '../data/syllabus';
import { getSavedAttempts } from '../utils/storage';
import { SubjectId } from '../types/quiz';
import {
  Map,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Award,
  Search,
  Filter,
  Sparkles,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface ChapterMasteryStats {
  id: string;
  name: string;
  unit: string;
  subject: SubjectId;
  weightageEstimate: string;
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  status: 'not_attempted' | 'insufficient_data' | 'mastered' | 'developing' | 'needs_practice';
  practicedTopics: string[];
  totalTopics: number;
  lastAttemptedDate?: string;
}

export const MasteryMapPage: React.FC = () => {
  const { language, t, translateSubject } = useLanguage();
  const navigate = useNavigate();

  const [activeSubject, setActiveSubject] = useState<'all' | SubjectId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  const attempts = useMemo(() => getSavedAttempts(), []);

  // Compute chapter-wise mastery using verified actual attempts
  const chapterStats = useMemo(() => {
    const list: ChapterMasteryStats[] = [];

    CBSE_CLASS_12_SUBJECTS.forEach((subj) => {
      subj.chapters.forEach((ch) => {
        // Find matching questions across attempts
        let total = 0;
        let correct = 0;
        const practicedTopicsSet = new Set<string>();
        let latestDate: string | undefined;

        attempts.forEach((att) => {
          if (att.quizConfig?.subject === subj.id) {
            att.questions.forEach((q) => {
              const matchesChapter =
                q.chapter?.toLowerCase() === ch.name.toLowerCase() ||
                q.chapter?.toLowerCase().includes(ch.name.toLowerCase()) ||
                ch.name.toLowerCase().includes(q.chapter?.toLowerCase() || '');

              if (matchesChapter) {
                total++;
                if (q.topic) practicedTopicsSet.add(q.topic);
                const userAns = att.userAnswers ? att.userAnswers[q.id] : undefined;
                if (userAns === q.correctAnswer) {
                  correct++;
                }
                if (!latestDate || new Date(att.completedAt) > new Date(latestDate)) {
                  latestDate = att.completedAt;
                }
              }
            });
          }
        });

        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

        let status: ChapterMasteryStats['status'] = 'not_attempted';
        if (total === 0) {
          status = 'not_attempted';
        } else if (total < 3) {
          // Do not claim mastery from insufficient data (< 3 questions)
          status = 'insufficient_data';
        } else if (accuracy >= 80) {
          status = 'mastered';
        } else if (accuracy >= 55) {
          status = 'developing';
        } else {
          status = 'needs_practice';
        }

        list.push({
          id: `${subj.id}-${ch.id}`,
          name: ch.name,
          unit: ch.unit,
          subject: subj.id,
          weightageEstimate: ch.weightageEstimate,
          totalAttempts: total,
          correctAttempts: correct,
          accuracy,
          status,
          practicedTopics: Array.from(practicedTopicsSet),
          totalTopics: ch.topics.length,
          lastAttemptedDate: latestDate,
        });
      });
    });

    return list;
  }, [attempts]);

  // High-level aggregates
  const summary = useMemo(() => {
    const totalChapters = chapterStats.length;
    const mastered = chapterStats.filter((c) => c.status === 'mastered').length;
    const developing = chapterStats.filter((c) => c.status === 'developing').length;
    const needsPractice = chapterStats.filter((c) => c.status === 'needs_practice').length;
    const insufficient = chapterStats.filter((c) => c.status === 'insufficient_data').length;
    const notAttempted = chapterStats.filter((c) => c.status === 'not_attempted').length;

    const attemptedChapters = totalChapters - notAttempted;
    const overallProgress = Math.round((attemptedChapters / totalChapters) * 100);

    return {
      totalChapters,
      mastered,
      developing,
      needsPractice,
      insufficient,
      notAttempted,
      overallProgress,
    };
  }, [chapterStats]);

  // Filtering
  const filteredChapters = useMemo(() => {
    return chapterStats.filter((c) => {
      if (activeSubject !== 'all' && c.subject !== activeSubject) return false;
      if (selectedStatusFilter !== 'all' && c.status !== selectedStatusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.unit.toLowerCase().includes(q) ||
          c.practicedTopics.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [chapterStats, activeSubject, selectedStatusFilter, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
            <Map className="w-4 h-4" />
            <span>CBSE SYLLABUS DIAGNOSTIC MATRIX</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'अवधारणा दक्षता मानचित्र' : 'Concept Mastery Map'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {language === 'hi'
              ? 'आपके वास्तविक क्विज़ परिणामों से विश्लेषित अध्याय-वार ज्ञान का प्रामाणिक मानचित्र। कम डेटा (< 3 प्रश्न) होने पर निष्पक्ष समीक्षा।'
              : 'Real-time diagnostic map across all 37 CBSE Class 12 chapters. Driven purely by authentic student quiz attempts.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/quiz"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 dark:shadow-none transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'hi' ? 'क्विज़ प्रारंभ करें' : 'Practice Chapter Quiz'}</span>
          </Link>
        </div>
      </div>

      {/* High-Level Diagnostic Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {language === 'hi' ? 'कंठस्थ अध्याय' : 'Mastered (≥80%)'}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {summary.mastered}
            </span>
            <span className="text-xs text-slate-400">/ {summary.totalChapters}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {language === 'hi' ? 'बोर्ड परीक्षा हेतु तैयार' : 'Board Exam Ready'}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {language === 'hi' ? 'विकासशील पकड़' : 'Developing (55-79%)'}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400">
              {summary.developing}
            </span>
            <span className="text-xs text-slate-400">/ {summary.totalChapters}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {language === 'hi' ? 'थोड़े अभ्यास की आवश्यकता' : 'Moderate confidence'}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {language === 'hi' ? 'ध्यान योग्य' : 'Needs Practice (<55%)'}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
              {summary.needsPractice}
            </span>
            <span className="text-xs text-slate-400">/ {summary.totalChapters}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {language === 'hi' ? 'कमजोर अध्याय' : 'Requires remediation'}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {language === 'hi' ? 'अपूर्ण डेटा' : 'Insufficient Data'}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-500 dark:text-blue-400">
              {summary.insufficient}
            </span>
            <span className="text-xs text-slate-400">/ {summary.totalChapters}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {language === 'hi' ? '< 3 प्रश्न हल किए' : '< 3 questions attempted'}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs col-span-2 lg:col-span-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {language === 'hi' ? 'अछूते अध्याय' : 'Not Attempted'}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-400 dark:text-slate-500">
              {summary.notAttempted}
            </span>
            <span className="text-xs text-slate-400">/ {summary.totalChapters}</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            {language === 'hi' ? '0 अभ्यास सत्र' : 'No quiz taken yet'}
          </div>
        </div>
      </div>

      {/* Policy Notice: Strict Data Honesty */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3 text-xs text-indigo-900 dark:text-indigo-200">
        <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">
            {language === 'hi' ? 'डेटा सत्यनिष्ठा मानक: ' : 'CBSE Evaluation Integrity Notice: '}
          </span>
          {language === 'hi'
            ? 'बोर्डऐस एआई कभी भी बिना वास्तविक अभ्यास के "मास्टरी" का दावा नहीं करता है। किसी अध्याय को सिद्ध मानने के लिए कम से कम 3 प्रश्न और 80% से अधिक शुद्धता आवश्यक है।'
            : 'BoardAce AI will never claim conceptual mastery from insufficient data. A minimum of 3 questions with 80%+ accuracy is strictly required before designating an authentic mastery status.'}
        </div>
      </div>

      {/* Filters & Search */}
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
                  ? 'सभी विषय (All)'
                  : 'All Subjects (37 Chapters)'
                : translateSubject(sub)}
            </button>
          ))}
        </div>

        {/* Search & Status Filters */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'अध्याय खोजें...' : 'Search chapters...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">{language === 'hi' ? 'सभी स्थितियाँ' : 'All Statuses'}</option>
            <option value="mastered">{language === 'hi' ? 'मास्टर्ड (Mastered)' : 'Mastered'}</option>
            <option value="developing">{language === 'hi' ? 'विकासशील (Developing)' : 'Developing'}</option>
            <option value="needs_practice">{language === 'hi' ? 'अभ्यास योग्य (Needs Focus)' : 'Needs Focus'}</option>
            <option value="insufficient_data">{language === 'hi' ? 'अपूर्ण डेटा' : 'Insufficient Data'}</option>
            <option value="not_attempted">{language === 'hi' ? 'अछूते (Unattempted)' : 'Not Attempted'}</option>
          </select>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChapters.map((ch) => {
          const isMastered = ch.status === 'mastered';
          const isNeedsPractice = ch.status === 'needs_practice';
          const isDeveloping = ch.status === 'developing';
          const isInsufficient = ch.status === 'insufficient_data';
          const isNotAttempted = ch.status === 'not_attempted';

          return (
            <div
              key={ch.id}
              className={`p-5 rounded-3xl bg-white dark:bg-slate-900 border transition-all hover:shadow-md flex flex-col justify-between ${
                isMastered
                  ? 'border-emerald-200/80 dark:border-emerald-900/40 hover:border-emerald-300'
                  : isNeedsPractice
                  ? 'border-rose-200/80 dark:border-rose-900/40 hover:border-rose-300'
                  : isDeveloping
                  ? 'border-amber-200/80 dark:border-amber-900/40 hover:border-amber-300'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {translateSubject(ch.subject)} · {ch.weightageEstimate}
                  </span>

                  {isMastered && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      {language === 'hi' ? 'कंठस्थ' : 'Mastered'}
                    </span>
                  )}
                  {isDeveloping && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                      <TrendingUp className="w-3 h-3" />
                      {language === 'hi' ? 'विकासशील' : 'Developing'}
                    </span>
                  )}
                  {isNeedsPractice && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400">
                      <AlertTriangle className="w-3 h-3" />
                      {language === 'hi' ? 'अभ्यास चाहिए' : 'Needs Focus'}
                    </span>
                  )}
                  {isInsufficient && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
                      <Clock className="w-3 h-3" />
                      {language === 'hi' ? 'कम डेटा' : 'Insufficient'}
                    </span>
                  )}
                  {isNotAttempted && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {language === 'hi' ? 'अछूता' : 'Unattempted'}
                    </span>
                  )}
                </div>

                {/* Chapter Title */}
                <h3 className="mt-2 text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                  {ch.name}
                </h3>
                <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {ch.unit}
                </div>

                {/* Accuracy progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500 dark:text-slate-400">
                      {language === 'hi' ? 'सटीकता (Accuracy)' : 'Accuracy'}
                    </span>
                    <span
                      className={`font-black ${
                        isMastered
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : isNeedsPractice
                          ? 'text-rose-600 dark:text-rose-400'
                          : isDeveloping
                          ? 'text-amber-500 dark:text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {ch.totalAttempts > 0 ? `${ch.accuracy}%` : '—'}
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isMastered
                          ? 'bg-emerald-500'
                          : isNeedsPractice
                          ? 'bg-rose-500'
                          : isDeveloping
                          ? 'bg-amber-500'
                          : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      style={{ width: `${ch.totalAttempts > 0 ? ch.accuracy : 0}%` }}
                    />
                  </div>
                </div>

                {/* Practiced concepts count */}
                <div className="mt-3.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <span>
                    {language === 'hi' ? 'हल किए प्रश्न:' : 'Questions Attempted:'}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {ch.correctAttempts} / {ch.totalAttempts} correct
                  </span>
                </div>
              </div>

              {/* Action Recommendation footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                {isNeedsPractice && (
                  <button
                    onClick={() => navigate(`/quiz?subject=${ch.subject}&chapter=${encodeURIComponent(ch.name)}`)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'कमजोरी सुधारें (Practice)' : 'Target Weak Concepts'}</span>
                  </button>
                )}

                {isInsufficient && (
                  <button
                    onClick={() => navigate(`/quiz?subject=${ch.subject}&chapter=${encodeURIComponent(ch.name)}`)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? '3+ प्रश्न हल करें' : 'Take 3+ Questions'}</span>
                  </button>
                )}

                {isNotAttempted && (
                  <button
                    onClick={() => navigate(`/quiz?subject=${ch.subject}&chapter=${encodeURIComponent(ch.name)}`)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'पहला अभ्यास प्रारंभ करें' : 'Start First Quiz'}</span>
                  </button>
                )}

                {isMastered && (
                  <button
                    onClick={() => navigate(`/quiz?subject=${ch.subject}&chapter=${encodeURIComponent(ch.name)}&difficulty=hard`)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'कठिन प्रश्न हल करें (HOTS)' : 'Challenge with HOTS'}</span>
                  </button>
                )}

                {isDeveloping && (
                  <button
                    onClick={() => navigate(`/quiz?subject=${ch.subject}&chapter=${encodeURIComponent(ch.name)}`)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? '80% तक पहुंचाएं' : 'Boost to 80%+'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredChapters.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <Map className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'कोई अध्याय नहीं मिला' : 'No matching chapters found'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'hi' ? 'कृपया अपना खोज शब्द या फ़िल्टर बदलें।' : 'Try adjusting your search query or status filter.'}
          </p>
        </div>
      )}
    </div>
  );
};
