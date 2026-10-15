import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { CBSE_CLASS_12_SUBJECTS } from '../data/syllabus';
import { getSavedAttempts } from '../utils/storage';
import { getRevisionItems } from '../utils/revisionEngine';
import { classifyMistake } from '../utils/mistakeDetective';
import { SubjectId, Question } from '../types/quiz';
import {
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Search,
  Filter,
  Zap,
  Target,
  ShieldAlert,
} from 'lucide-react';

interface WeakChapterReport {
  subject: SubjectId;
  chapterName: string;
  unit: string;
  weightageEstimate: string;
  attempted: number;
  correct: number;
  accuracy: number;
  isInsufficientData: boolean;
  severity: 'high' | 'moderate' | 'strong' | 'unattempted';
  commonMistakes: string[];
  sampleMistakeQuestion?: Question;
  recommendedAction: string;
}

export const WeakChaptersPage: React.FC = () => {
  const { language, t, translateSubject } = useLanguage();
  const navigate = useNavigate();

  const [activeSubject, setActiveSubject] = useState<'all' | SubjectId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'weak_only'>('weak_only');

  const attempts = useMemo(() => getSavedAttempts(), []);
  const revItems = useMemo(() => getRevisionItems(), []);

  // Compute chapter-wise weaknesses using real attempts and mistake records
  const chapterReports = useMemo<WeakChapterReport[]>(() => {
    const list: WeakChapterReport[] = [];

    CBSE_CLASS_12_SUBJECTS.forEach((subj) => {
      subj.chapters.forEach((ch) => {
        let total = 0;
        let correct = 0;
        const recordedMistakeExplanations: string[] = [];
        let sampleQ: Question | undefined;

        // 1. From Quiz Attempts
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
                } else {
                  if (q.pitfall && !recordedMistakeExplanations.includes(q.pitfall)) {
                    recordedMistakeExplanations.push(q.pitfall);
                  }
                  if (!sampleQ) sampleQ = q;
                }
              }
            });
          }
        });

        // 2. From Revision Items
        revItems.forEach((item) => {
          if (item.subject === subj.id && item.chapter) {
            const matches =
              item.chapter.toLowerCase() === ch.name.toLowerCase() ||
              item.chapter.toLowerCase().includes(ch.name.toLowerCase());
            if (matches && item.question.pitfall && !recordedMistakeExplanations.includes(item.question.pitfall)) {
              recordedMistakeExplanations.push(item.question.pitfall);
            }
          }
        });

        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
        const isInsufficientData = total > 0 && total < 3;

        let severity: WeakChapterReport['severity'] = 'unattempted';
        if (total === 0) {
          severity = 'unattempted';
        } else if (isInsufficientData) {
          severity = 'moderate';
        } else if (accuracy < 60) {
          severity = 'high';
        } else if (accuracy < 75) {
          severity = 'moderate';
        } else {
          severity = 'strong';
        }

        let recommendedAction = '';
        if (severity === 'high') {
          recommendedAction =
            language === 'hi'
              ? 'उच्च प्राथमिकता: मुख्य सूत्र और एनसीईआरटी हल उदाहरण पुनः देखें, फिर 5 प्रश्नों का केंद्रित अभ्यास करें।'
              : 'High Priority: Review foundational NCERT theory & definitions, then take a targeted 5-question chapter quiz.';
        } else if (isInsufficientData) {
          recommendedAction =
            language === 'hi'
              ? 'अपूर्ण डेटा: विश्वसनीय निदान के लिए कम से कम 3 प्रश्न हल करना अनिवार्य है।'
              : 'Insufficient Data: Solve at least 3 questions in this chapter to establish reliable diagnostic accuracy.';
        } else if (severity === 'moderate') {
          recommendedAction =
            language === 'hi'
              ? 'मध्यम सुधार: गणना की गलतियों से बचें और पिछले वर्षों के बोर्ड प्रश्न हल करें।'
              : 'Moderate Focus: Reinforce calculation steps and solve recent CBSE 2026-27 practice problems.';
        } else if (severity === 'strong') {
          recommendedAction =
            language === 'hi'
              ? 'मजबूत पकड़: समय-समय पर दोहराव बनाए रखें।'
              : 'Strong conceptual readiness! Maintain readiness with periodic revision.';
        } else {
          recommendedAction =
            language === 'hi'
              ? 'अभी तक कोई प्रश्न हल नहीं किया गया। पहली क्विज़ लें।'
              : 'No questions attempted yet. Start your first chapter quiz drill.';
        }

        list.push({
          subject: subj.id,
          chapterName: ch.name,
          unit: ch.unit,
          weightageEstimate: ch.weightageEstimate,
          attempted: total,
          correct,
          accuracy,
          isInsufficientData,
          severity,
          commonMistakes: recordedMistakeExplanations.slice(0, 3),
          sampleMistakeQuestion: sampleQ,
          recommendedAction,
        });
      });
    });

    return list;
  }, [attempts, revItems, language]);

  // Filtered list
  const filteredChapters = useMemo(() => {
    return chapterReports.filter((c) => {
      if (activeSubject !== 'all' && c.subject !== activeSubject) return false;
      if (severityFilter === 'weak_only') {
        if (c.severity !== 'high' && c.severity !== 'moderate') return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.chapterName.toLowerCase().includes(q) ||
          c.unit.toLowerCase().includes(q) ||
          c.commonMistakes.some((m) => m.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [chapterReports, activeSubject, severityFilter, searchQuery]);

  const highWeakCount = useMemo(() => {
    return chapterReports.filter((c) => c.severity === 'high' && !c.isInsufficientData).length;
  }, [chapterReports]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <span>DIAGNOSTIC WEAK CHAPTER DETECTOR · CBSE 2026–27</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'स्मार्ट कमजोर अध्याय संसूचक' : 'Smart Weak Chapter Detector'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {language === 'hi'
              ? 'आपके वास्तविक गलत उत्तरों का स्वतः विश्लेषण। उन अध्यायों की पहचान करें जहां बोर्ड परीक्षा में अंक कटने का सर्वाधिक जोखिम है।'
              : 'Automated diagnostic analysis of actual incorrect quiz answers across CBSE Class 12 chapters, pinpointing exact syllabus vulnerabilities.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/smart-retry"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-200 dark:shadow-none transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>{language === 'hi' ? 'स्मार्ट पुनः प्रयास' : 'Retry Missed Questions'}</span>
          </Link>
        </div>
      </div>

      {/* Policy banner: Insufficient data honesty */}
      <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200 shadow-xs">
        <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">
            {language === 'hi' ? 'सीबीएसई डेटा ईमानदारी नियम: ' : 'Data Integrity Standard: '}
          </span>
          {language === 'hi'
            ? 'किसी अध्याय में 3 से कम प्रश्न हल होने पर उसे "अपूर्ण डेटा" के रूप में चिन्हित किया जाता है ताकि बिना पर्याप्त प्रमाण के गलत निष्कर्ष न निकले।'
            : 'Chapters with fewer than 3 attempted questions are clearly labeled as "Insufficient Data" to prevent false weakness conclusions.'}
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Subject Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl overflow-x-auto custom-scrollbar">
          {(['all', 'mathematics', 'physics', 'chemistry'] as const).map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeSubject === sub
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {sub === 'all'
                ? language === 'hi'
                  ? 'सभी विषय (All)'
                  : 'All Subjects'
                : translateSubject(sub)}
            </button>
          ))}
        </div>

        {/* Search & Severity Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'अध्याय खोजें...' : 'Search chapters...'}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-rose-500 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-rose-500 cursor-pointer"
          >
            <option value="weak_only">
              {language === 'hi' ? 'केवल कमजोर अध्याय (Weak Only)' : 'Weak & Developing Only'}
            </option>
            <option value="all">
              {language === 'hi' ? 'सभी 37 अध्याय (All 37 Chapters)' : 'All 37 Chapters'}
            </option>
          </select>
        </div>
      </div>

      {/* Chapters Diagnostic Feed */}
      {filteredChapters.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'कोई कमजोर अध्याय नहीं मिला' : 'No Critical Weaknesses Detected'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {language === 'hi'
              ? 'वर्तमान फ़िल्टर में कोई कमजोर अध्याय नहीं है। सभी अध्यायों को देखने के लिए फ़िल्टर में "सभी 37 अध्याय" चुनें।'
              : 'No chapters match the current weak filter. Toggle to "All 37 Chapters" to review full syllabus status.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredChapters.map((ch, idx) => {
            const isHigh = ch.severity === 'high' && !ch.isInsufficientData;
            const isInsufficient = ch.isInsufficientData;

            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all hover:shadow-md space-y-4 ${
                  isHigh
                    ? 'border-rose-200/90 dark:border-rose-900/40 bg-rose-50/10'
                    : isInsufficient
                    ? 'border-amber-200/80 dark:border-amber-900/40'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        {translateSubject(ch.subject)} · {ch.weightageEstimate}
                      </span>
                      {isHigh && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                          {language === 'hi' ? 'उच्च जोखिम' : 'High Priority Weakness'}
                        </span>
                      )}
                      {isInsufficient && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" />
                          <span>{language === 'hi' ? 'अपूर्ण डेटा (< 3 प्रश्न)' : 'Insufficient Data (< 3 Qs)'}</span>
                        </span>
                      )}
                      {ch.severity === 'strong' && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          {language === 'hi' ? 'मजबूत पकड़' : 'Mastered'}
                        </span>
                      )}
                      {ch.severity === 'unattempted' && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {language === 'hi' ? 'अछूता' : 'Unattempted'}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                      {ch.chapterName}
                    </h3>
                    <div className="text-xs text-slate-400">
                      {ch.unit}
                    </div>
                  </div>

                  {/* Quantitative Stats */}
                  <div className="flex items-center gap-4 text-right shrink-0">
                    <div>
                      <div
                        className={`text-2xl font-black font-mono ${
                          isHigh
                            ? 'text-rose-600 dark:text-rose-400'
                            : isInsufficient
                            ? 'text-amber-500 dark:text-amber-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {ch.attempted > 0 ? `${ch.accuracy}%` : '—'}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">
                        {ch.correct} / {ch.attempted} {language === 'hi' ? 'सही' : 'Correct'}
                      </div>
                    </div>

                    <Link
                      to={`/quiz?subject=${ch.subject}&chapter=${encodeURIComponent(ch.chapterName)}`}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isHigh
                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
                      }`}
                    >
                      <span>{language === 'hi' ? 'अभ्यास करें' : 'Target Practice'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Common Mistakes identified from real attempts */}
                {ch.commonMistakes.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-1.5 text-xs">
                    <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'पहचाने गए सामान्य भ्रम / गलतियां:' : 'Identified Traps & Recurring Misconceptions:'}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-rose-950 dark:text-rose-200">
                      {ch.commonMistakes.map((mistake, mIdx) => (
                        <li key={mIdx}>{mistake}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Practice & Actionable Step */}
                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800/80 text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      💡 {language === 'hi' ? 'परीक्षक सलाह:' : 'Recommended Action:'}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ch.recommendedAction}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
