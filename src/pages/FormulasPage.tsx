import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useClass } from '../context/ClassContext';
import { getFormulasForGrade, FormulaItem } from '../data/formulasData';
import { SubjectId } from '../types/quiz';
import {
  FileCode,
  Search,
  Copy,
  Check,
  BookOpen,
  Sparkles,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

export const FormulasPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { grade, subjects, gradeLabel, stream, setStream, isClass12 } = useClass();

  const [selectedSubject, setSelectedSubject] = useState<'all' | SubjectId>('all');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const gradeFormulas = useMemo(() => getFormulasForGrade(grade, stream), [grade, stream]);

  const handleCopy = (formula: string, id: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  const filteredFormulas = useMemo(() => {
    return gradeFormulas.filter((item) => {
      if (selectedSubject !== 'all' && item.subject !== selectedSubject) return false;
      if (selectedChapter !== 'all' && item.chapter !== selectedChapter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q) || (item.nameHi && item.nameHi.toLowerCase().includes(q));
        const matchesFormula = item.formula.toLowerCase().includes(q);
        const matchesExplanation = item.explanation.toLowerCase().includes(q);
        if (!matchesName && !matchesFormula && !matchesExplanation) return false;
      }
      return true;
    });
  }, [gradeFormulas, selectedSubject, selectedChapter, searchQuery]);

  const availableChapters = useMemo(() => {
    const list = new Set<string>();
    gradeFormulas.forEach((item) => {
      if (selectedSubject === 'all' || item.subject === selectedSubject) {
        list.add(item.chapter);
      }
    });
    return Array.from(list);
  }, [gradeFormulas, selectedSubject]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'सीबीएसई सूत्र पुस्तकालय' : 'CBSE Formula Library'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'hi'
              ? `${gradeLabel} के प्रमाणित सूत्र, चर परिभाषाएं और परीक्षक सुझाव (सत्र 2026–27)।`
              : `Verified equations, variable breakdowns, and examiner tips for ${gradeLabel} (Session 2026–27).`}
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
          <span className="font-mono tabular-nums font-bold">{filteredFormulas.length}</span> Formulas Available
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
        {/* Subject Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: language === 'hi' ? 'सभी विषय' : 'All Subjects' },
            ...subjects.map(s => ({ id: s.id, label: s.name }))
          ].map((sub) => (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubject(sub.id as any);
                setSelectedChapter('all');
              }}
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

        {/* Chapter & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">
              {language === 'hi' ? 'सभी अध्याय (All Chapters)' : 'All Chapters'}
            </option>
            {availableChapters.map((ch) => (
              <option key={ch} value={ch}>
                {ch}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'सूत्र, नियम या समीकरण खोजें...' : 'Search formula, equation, theorem...'}
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Formulas Grid */}
      {filteredFormulas.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <FileCode className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'कोई सूत्र नहीं मिला' : 'No formulas found for this search'}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFormulas.map((item) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                {/* Subject & Chapter unboxed metadata */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                      {item.subject}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{item.chapter}</span>
                  </div>
                </div>

                {/* Formula Name */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {language === 'hi' && item.nameHi ? item.nameHi : item.name}
                </h3>

                {/* Formula Equation Box */}
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 font-mono text-sm sm:text-base font-bold text-indigo-900 dark:text-indigo-300 overflow-x-auto">
                  <span className="whitespace-pre-line">{item.formula}</span>
                  <button
                    onClick={() => handleCopy(item.formula, item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0 cursor-pointer"
                    title="Copy formula text"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Explanation */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {language === 'hi' && item.explanationHi ? item.explanationHi : item.explanation}
                </p>

                {/* Variable Breakdown */}
                {item.variables && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Variables:</span> {item.variables}
                  </div>
                )}
              </div>

              {/* Examiner Tip */}
              {item.examTip && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-bold">CBSE Board Tip:</strong> {item.examTip}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
