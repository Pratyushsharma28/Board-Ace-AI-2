import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useClass } from '../context/ClassContext';
import { getRevisionItems, updateRevisionItemNotes, markItemAsRevised } from '../utils/revisionEngine';
import { RevisionItem, SubjectId, DifficultyLevel } from '../types/quiz';
import {
  BookOpen,
  Edit3,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  Save,
  Check,
  AlertTriangle,
  XCircle,
  Layers,
} from 'lucide-react';

export const MistakeNotebookPage: React.FC = () => {
  const { language, t, translateSubject } = useLanguage();
  const { grade, stream, subjects } = useClass();

  const [revisionItems, setRevisionItems] = useState<RevisionItem[]>(() => getRevisionItems());

  // Filter states
  const [selectedSubject, setSelectedSubject] = useState<'all' | SubjectId>('all');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | DifficultyLevel>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'due' | 'revised'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Reset selectedSubject if not present in current class/stream
  useEffect(() => {
    if (selectedSubject !== 'all' && !subjects.some((s) => s.id === selectedSubject)) {
      setSelectedSubject('all');
      setSelectedChapter('all');
    }
  }, [grade, stream, subjects]);

  // Editing notes state: questionId -> draft notes
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [savedNotesIndicator, setSavedNotesIndicator] = useState<Record<string, boolean>>({});

  // Filtered mistake questions strictly within active academic track
  const mistakeList = useMemo(() => {
    const activeSubjectIds = new Set(subjects.map((s) => s.id));

    return revisionItems.filter((item) => {
      // Must match active grade & stream subjects
      const qGrade = item.question?.grade || '12';
      if (qGrade !== grade || !activeSubjectIds.has(item.subject)) {
        return false;
      }

      // Keep only incorrect answers
      if (item.savedReason !== 'incorrect_answer' && item.incorrectCount === 0) {
        return false;
      }

      if (selectedSubject !== 'all' && item.subject !== selectedSubject) return false;
      if (selectedChapter !== 'all' && item.chapter !== selectedChapter) return false;
      if (
        selectedDifficulty !== 'all' &&
        item.question.difficulty?.toLowerCase() !== selectedDifficulty.toLowerCase()
      ) {
        return false;
      }
      if (selectedStatus === 'due' && item.isRevised) return false;
      if (selectedStatus === 'revised' && !item.isRevised) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQ = item.question.question.toLowerCase().includes(q);
        const matchesTopic = item.topic?.toLowerCase().includes(q);
        const matchesChapter = item.chapter?.toLowerCase().includes(q);
        const matchesNotes = item.notes?.toLowerCase().includes(q);
        return matchesQ || matchesTopic || matchesChapter || matchesNotes;
      }

      return true;
    });
  }, [revisionItems, selectedSubject, selectedChapter, selectedDifficulty, selectedStatus, searchQuery, grade, subjects]);

  const availableChapters = useMemo(() => {
    if (selectedSubject === 'all') {
      const set = new Set<string>();
      subjects.forEach((s) => s.chapters.forEach((c) => set.add(c.name)));
      return Array.from(set);
    }
    const subj = subjects.find((s) => s.id === selectedSubject);
    return subj ? subj.chapters.map((c) => c.name) : [];
  }, [selectedSubject, subjects]);

  const handleNotesChange = (questionId: string, value: string) => {
    setEditingNotes((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSaveNotes = (questionId: string) => {
    const draft = editingNotes[questionId];
    if (draft === undefined) return;

    updateRevisionItemNotes(questionId, draft);
    setRevisionItems(getRevisionItems());

    setSavedNotesIndicator((prev) => ({ ...prev, [questionId]: true }));
    setTimeout(() => {
      setSavedNotesIndicator((prev) => ({ ...prev, [questionId]: false }));
    }, 2000);
  };

  const handleToggleRevised = (questionId: string) => {
    markItemAsRevised(questionId);
    setRevisionItems(getRevisionItems());
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
            <Edit3 className="w-4 h-4" />
            <span>PERSONALIZED INCORRECT QUESTION ARCHIVE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'मेरी गलती नोटबुक' : 'My Mistake Notebook'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {language === 'hi'
              ? 'क्विज़ में गलत हुए प्रश्नों की स्वचालित डायरी। अपनी व्यक्तिगत अध्ययन टिप्पणियां जोड़ें और बोर्ड परीक्षा से पहले कमजोरियों को दूर करें।'
              : 'Automated notebook organizing every question you have answered incorrectly. Annotate with personal notes and track spaced revision.'}
          </p>
        </div>

        <Link
          to="/smart-retry"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 dark:shadow-none transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{language === 'hi' ? 'स्मार्ट पुनः प्रयास' : 'Smart Retry Mode'}</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>{language === 'hi' ? 'फ़िल्टर एवं खोज:' : 'Filter & Search Mistake Archive:'}</span>
          <span>{mistakeList.length} {mistakeList.length === 1 ? 'entry' : 'entries'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value as any);
              setSelectedChapter('all');
            }}
            className="p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">{language === 'hi' ? 'सभी विषय' : 'All Subjects'}</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {translateSubject(s.id)}
              </option>
            ))}
          </select>

          {/* Chapter Filter */}
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">{language === 'hi' ? 'सभी अध्याय' : 'All Chapters'}</option>
            {availableChapters.map((ch) => (
              <option key={ch} value={ch}>
                {ch}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as any)}
            className="p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">{language === 'hi' ? 'सभी कठिनाई स्तर' : 'All Difficulties'}</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {/* Revision Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">{language === 'hi' ? 'सभी दोहराव स्थितियाँ' : 'All Statuses'}</option>
            <option value="due">{language === 'hi' ? 'दोहराव देय' : 'Due for Revision'}</option>
            <option value="revised">{language === 'hi' ? 'सिद्ध / संशोधित' : 'Revised / Mastered'}</option>
          </select>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'प्रश्न, टॉपिक अथवा अपनी व्यक्तिगत टिप्पणी खोजें...'
                : 'Search question text, topic, or your personal notes...'
            }
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Mistake List */}
      {mistakeList.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'कोई गलती दर्ज नहीं मिली' : 'No Mistakes Matching Filters'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'hi'
              ? 'वर्तमान फ़िल्टर में कोई प्रश्न नहीं है। फ़िल्टर रीसेट करें अथवा नए क्विज़ हल करें।'
              : 'No missed questions match your active filter settings. Reset filters or complete more chapter quizzes.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {mistakeList.map((item) => {
            const currentDraftNotes =
              editingNotes[item.id] !== undefined ? editingNotes[item.id] : item.notes || '';
            const isSaved = savedNotesIndicator[item.id];

            return (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                {/* Meta header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {translateSubject(item.subject)} · {item.chapter}
                    </span>
                    {item.question.difficulty && (
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                        {item.question.difficulty}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        item.isRevised
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {item.isRevised ? 'Revised (Stage ' + item.srsStage + ')' : 'Due for Revision'}
                    </span>

                    <button
                      onClick={() => handleToggleRevised(item.id)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
                    >
                      {item.isRevised ? 'Mark Unrevised' : 'Mark Revised'}
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                  {item.question.question}
                </h3>

                {/* Answer Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {item.userLastWrongAnswer && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 text-rose-950 dark:text-rose-200">
                      <div className="font-bold flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'आपकी पिछली गलत पसंद:' : 'Your Incorrect Answer:'}</span>
                      </div>
                      <div className="mt-1 font-semibold">{item.userLastWrongAnswer}</div>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'सही बोर्ड उत्तर:' : 'Correct CBSE Answer:'}</span>
                    </div>
                    <div className="mt-1 font-semibold">{item.question.correctAnswer}</div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>NCERT Step-by-Step Reason:</span>
                  </div>
                  <p className="leading-relaxed">{item.question.explanation}</p>
                </div>

                {/* Personal Notes Section */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{language === 'hi' ? 'मेरी व्यक्तिगत अध्ययन टिप्पणी (Personal Notes):' : 'My Personal Study Note:'}</span>
                    </span>
                    {isSaved && (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                        <Check className="w-3 h-3" />
                        <span>Saved to storage</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <textarea
                      rows={2}
                      value={currentDraftNotes}
                      onChange={(e) => handleNotesChange(item.id, e.target.value)}
                      placeholder={
                        language === 'hi'
                          ? 'इस प्रश्न में आपने क्या भूल की? भविष्य में याद रखने के लिए अपनी टिप्पणी लिखें...'
                          : 'What was your exact thought process or formula slip? Write a memory anchor here...'
                      }
                      className="flex-1 p-3 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
                    />

                    <button
                      onClick={() => handleSaveNotes(item.id)}
                      className="px-4 py-2 self-end sm:self-auto rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'टिप्पणी सहेजें' : 'Save Note'}</span>
                    </button>
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
