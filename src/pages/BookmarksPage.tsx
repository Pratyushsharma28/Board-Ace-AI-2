import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getBookmarks, removeBookmark } from '../utils/storage';
import { Question, SubjectId } from '../types/quiz';
import { MistakeDetectiveModal } from '../components/MistakeDetectiveModal';
import {
  Bookmark,
  Search,
  Trash2,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Brain,
  CheckCircle2,
} from 'lucide-react';

export const BookmarksPage: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [bookmarks, setBookmarks] = useState<Question[]>(() => getBookmarks());
  const [selectedSubject, setSelectedSubject] = useState<'all' | SubjectId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Mistake Detective Modal
  const [mistakeModalData, setMistakeModalData] = useState<{
    question: Question;
    selectedAnswer: string;
  } | null>(null);

  const handleRemove = (id: string) => {
    removeBookmark(id);
    setBookmarks(getBookmarks());
  };

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((q) => {
      if (selectedSubject !== 'all' && q.subject?.toLowerCase() !== selectedSubject) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQ = q.question.toLowerCase().includes(query);
        const matchesTopic = q.topic?.toLowerCase().includes(query) || false;
        const matchesChapter = q.chapter?.toLowerCase().includes(query) || false;
        if (!matchesQ && !matchesTopic && !matchesChapter) return false;
      }
      return true;
    });
  }, [bookmarks, selectedSubject, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'सहेजे गए प्रश्न (बुकमार्क)' : 'Saved Questions & Bookmarks'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'hi'
              ? 'क्विज़ और अभ्यास के दौरान सहेजे गए कठिन प्रश्नों की पुनरावृत्ति करें।'
              : 'Archive of challenging board questions bookmarked during practice sessions for focused review.'}
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
          <span className="font-mono tabular-nums font-bold">{bookmarks.length}</span> Saved Questions
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: language === 'hi' ? 'सभी विषय' : 'All Subjects' },
              { id: 'mathematics', label: language === 'hi' ? 'गणित' : 'Mathematics' },
              { id: 'physics', label: language === 'hi' ? 'भौतिकी' : 'Physics' },
              { id: 'chemistry', label: language === 'hi' ? 'रसायन विज्ञान' : 'Chemistry' },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSubject === sub.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'प्रश्न या टॉपिक खोजें...' : 'Search question or topic...'}
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Bookmarks List */}
      {filteredBookmarks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'कोई बुकमार्क प्रश्न नहीं मिला' : 'No saved questions found'}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {language === 'hi'
              ? 'क्विज़ हल करते समय किसी भी कठिन प्रश्न को बुकमार्क करें ताकि वह यहाँ सुरक्षित रहे।'
              : 'While taking quizzes or simulated exams, click the bookmark icon on any difficult question to review it here anytime.'}
          </p>
          <div className="pt-2">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>{language === 'hi' ? 'क्विज़ प्रारंभ करें' : 'Start a Quiz'}</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookmarks.map((q) => {
            const isExpanded = expandedId === q.id;
            return (
              <div
                key={q.id}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                {/* Metadata Header */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      {q.subject}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{q.chapter}</span>
                    {q.topic && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="truncate font-semibold">{q.topic}</span>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemove(q.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer shrink-0"
                    title="Remove from bookmarks"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Question Body */}
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                  {q.question}
                </h3>

                {/* Options (Expandable) */}
                {isExpanded && (
                  <div className="space-y-3 pt-2 animate-fadeIn border-t border-slate-100 dark:border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, i) => {
                        const isCorrect = opt === q.correctAnswer;
                        return (
                          <div
                            key={i}
                            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 ${
                              isCorrect
                                ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>{opt}</span>
                            {isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
                        <strong className="font-bold">NCERT Official Explanation:</strong> {q.explanation}
                      </div>
                    )}

                    {/* Pitfall */}
                    {q.pitfall && (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                        <strong className="font-bold">Common Board Pitfall:</strong> {q.pitfall}
                      </div>
                    )}
                  </div>
                )}

                {/* Card Actions Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="inline-flex items-center gap-1 font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Hide Details</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>View Explanation &amp; Options</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMistakeModalData({ question: q, selectedAnswer: q.options[0] })}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      <span>Mistake Detective</span>
                    </button>

                    <Link
                      to={`/quiz?subject=${q.subject || 'physics'}&chapter=${encodeURIComponent(q.chapter || 'all')}`}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Practice Chapter</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mistake Detective Modal */}
      {mistakeModalData && (
        <MistakeDetectiveModal
          onClose={() => setMistakeModalData(null)}
          question={mistakeModalData.question}
          selectedAnswer={mistakeModalData.selectedAnswer}
          onPracticeTopic={(topic, chapter, subject) => {
            setMistakeModalData(null);
            navigate(`/quiz?subject=${subject}&chapter=${encodeURIComponent(chapter)}`);
          }}
        />
      )}
    </div>
  );
};
