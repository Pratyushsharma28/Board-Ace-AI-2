import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getSavedAttempts } from '../utils/storage';
import { getRevisionItems, markItemAsRevised } from '../utils/revisionEngine';
import { classifyMistake, getRevisionTip } from '../utils/mistakeDetective';
import { SubjectId, Question, MistakeCategory } from '../types/quiz';
import { MistakeDetectiveModal } from '../components/MistakeDetectiveModal';
import {
  Brain,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Search,
  Filter,
} from 'lucide-react';

interface RecordedMistake {
  id: string;
  question: Question;
  selectedAnswer: string;
  category: MistakeCategory;
  subject: SubjectId;
  chapter: string;
  attemptedAt: string;
  resolved: boolean;
}

export const MistakeDetectivePage: React.FC = () => {
  const { language, t, translateSubject } = useLanguage();
  const navigate = useNavigate();

  const [selectedSubject, setSelectedSubject] = useState<'all' | SubjectId>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active modal
  const [activeModalData, setActiveModalData] = useState<{
    question: Question;
    selectedAnswer: string;
  } | null>(null);

  // Extract real mistakes from actual attempts and revision items
  const mistakes = useMemo(() => {
    const list: RecordedMistake[] = [];
    const seenQIds = new Set<string>();

    // 1. From revision items (these track incorrect answers)
    const revItems = getRevisionItems();
    revItems.forEach((item) => {
      if (item.savedReason === 'incorrect_answer' && !seenQIds.has(item.question.id)) {
        seenQIds.add(item.question.id);
        const wrongAns = item.userLastWrongAnswer || item.question.options[0];
        const category = item.userLastMistakeCategory || classifyMistake(item.question, wrongAns);
        list.push({
          id: `rev-${item.id}`,
          question: item.question,
          selectedAnswer: wrongAns,
          category,
          subject: (['mathematics', 'physics', 'chemistry'].includes(item.question.subject?.toLowerCase())
            ? item.question.subject.toLowerCase()
            : 'physics') as SubjectId,
          chapter: item.question.chapter,
          attemptedAt: item.savedAt,
          resolved: item.isRevised,
        });
      }
    });

    // 2. From actual quiz attempts
    const attempts = getSavedAttempts();
    attempts.forEach((att) => {
      att.questions.forEach((q) => {
        const userAns = att.userAnswers[q.id];
        if (userAns && userAns !== q.correctAnswer && !seenQIds.has(q.id)) {
          seenQIds.add(q.id);
          const category = classifyMistake(q, userAns);
          list.push({
            id: `att-${att.id}-${q.id}`,
            question: q,
            selectedAnswer: userAns,
            category,
            subject: att.quizConfig.subject,
            chapter: q.chapter,
            attemptedAt: att.completedAt,
            resolved: false,
          });
        }
      });
    });

    return list;
  }, []);

  const filteredMistakes = useMemo(() => {
    return mistakes.filter((m) => {
      if (selectedSubject !== 'all' && m.subject !== selectedSubject) return false;
      if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQ = m.question.question.toLowerCase().includes(q);
        const matchesTopic = m.question.topic?.toLowerCase().includes(q) || false;
        if (!matchesQ && !matchesTopic) return false;
      }
      return true;
    });
  }, [mistakes, selectedSubject, selectedCategory, searchQuery]);

  // Aggregate category stats
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    mistakes.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return counts;
  }, [mistakes]);

  const resolvedCount = mistakes.filter((m) => m.resolved).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'गलती जासूस 2.0 (Mistake Detective)' : 'Mistake Detective 2.0'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'hi'
              ? 'क्विज़ में हुई गलतियों का विश्लेषण, वैचारिक भ्रांतियों की पहचान और सुधारात्मक अभ्यास।'
              : 'Forensic diagnosis of recorded quiz mistakes, misconception classification, and targeted practice recommendations.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 shrink-0">
          <Brain className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <span className="font-mono tabular-nums font-bold">{mistakes.length}</span> Mistakes Recorded
        </div>
      </div>

      {mistakes.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'कोई दर्ज गलती नहीं मिली' : 'Zero Quiz Mistakes on Record'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              {language === 'hi'
                ? 'जैसे ही आप क्विज़ हल करेंगे, गलत हुए प्रश्न स्वतः यहाँ आकर उनकी वैचारिक भ्रांतियों का विश्लेषण करेंगे।'
                : 'Take an AI chapter quiz or timed board mock. Any questions you answer incorrectly will automatically appear here for step-by-step misconception forensics.'}
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>{language === 'hi' ? 'क्विज़ प्रारंभ करें' : 'Start a Quiz'}</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-400">Total Mistakes</span>
              <div className="mt-1 text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
                {mistakes.length}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-400">Mastered on Retry</span>
              <div className="mt-1 text-2xl font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                {resolvedCount}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-400">Pending Review</span>
              <div className="mt-1 text-2xl font-black font-mono tabular-nums text-amber-600 dark:text-amber-400">
                {mistakes.length - resolvedCount}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-400">Resolution Rate</span>
              <div className="mt-1 text-2xl font-black font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                {mistakes.length > 0 ? Math.round((resolvedCount / mistakes.length) * 100) : 0}%
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Subjects' },
                  { id: 'mathematics', label: 'Mathematics' },
                  { id: 'physics', label: 'Physics' },
                  { id: 'chemistry', label: 'Chemistry' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSubject(s.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedSubject === s.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search mistake or topic..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Mistakes Feed */}
          <div className="space-y-4">
            {filteredMistakes.map((m) => {
              const tip = getRevisionTip(m.question, m.category);

              return (
                <div
                  key={m.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs"
                >
                  {/* Top unboxed metadata */}
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                        {m.subject}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{m.chapter}</span>
                      {m.question.topic && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="truncate font-semibold">{m.question.topic}</span>
                        </>
                      )}
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0">
                      {m.category}
                    </span>
                  </div>

                  {/* Question Prompt */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                    {m.question.question}
                  </h3>

                  {/* Options Comparison Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-xs">
                      <div className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400">
                        You Selected (Tempting Trap):
                      </div>
                      <div className="font-semibold text-rose-900 dark:text-rose-200 mt-0.5">
                        {m.selectedAnswer}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 text-xs">
                      <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                        Official CBSE Correct Answer:
                      </div>
                      <div className="font-semibold text-emerald-900 dark:text-emerald-200 mt-0.5">
                        {m.question.correctAnswer}
                      </div>
                    </div>
                  </div>

                  {/* Pedagogical Rule of Thumb */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <div className="font-bold text-indigo-700 dark:text-indigo-300">
                      Mistake Detective Diagnosis &amp; Memory Anchor:
                    </div>
                    <p>{tip}</p>
                    {m.question.explanation && (
                      <p className="pt-1 text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-700">
                        <strong>Official NCERT Reason:</strong> {m.question.explanation}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">
                      Logged from verified student session
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveModalData({ question: m.question, selectedAnswer: m.selectedAnswer })}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Brain className="w-3.5 h-3.5" />
                        <span>AI Deep Dive</span>
                      </button>

                      <Link
                        to={`/quiz?subject=${m.subject}&chapter=${encodeURIComponent(m.chapter)}`}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Drill Chapter</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Mistake Detective Modal */}
      {activeModalData && (
        <MistakeDetectiveModal
          onClose={() => setActiveModalData(null)}
          question={activeModalData.question}
          selectedAnswer={activeModalData.selectedAnswer}
          onPracticeTopic={(topic, chapter, subject) => {
            setActiveModalData(null);
            navigate(`/quiz?subject=${subject}&chapter=${encodeURIComponent(chapter)}`);
          }}
        />
      )}
    </div>
  );
};
