import React, { useState } from 'react';
import { CBSE_CLASS_12_SUBJECTS } from '../data/syllabus';
import { QuizConfig, SubjectId, DifficultyLevel, QuestionType, QuizMode, EducationBoard } from '../types/quiz';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, BookOpen, Clock, ShieldCheck, Flame, Sliders, AlertCircle, RefreshCw, X } from 'lucide-react';

interface QuizConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuiz: (config: QuizConfig) => void;
  initialConfig?: Partial<QuizConfig>;
  isGenerating?: boolean;
  generationError?: string | null;
  onFallbackToCurated?: () => void;
}

export const QuizConfigModal: React.FC<QuizConfigModalProps> = ({
  isOpen,
  onClose,
  onStartQuiz,
  initialConfig,
  isGenerating = false,
  generationError = null,
  onFallbackToCurated,
}) => {
  const { language, t, translateSubject, translateChapter } = useLanguage();

  const [board, setBoard] = useState<EducationBoard>(initialConfig?.board || 'CBSE');
  const [subjectId, setSubjectId] = useState<SubjectId>(initialConfig?.subject || 'mathematics');
  const currentSubjectInfo = CBSE_CLASS_12_SUBJECTS.find(s => s.id === subjectId) || CBSE_CLASS_12_SUBJECTS[0];

  const [chapter, setChapter] = useState<string>(
    initialConfig?.chapter || currentSubjectInfo.chapters[0]?.name || 'Relations and Functions'
  );
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialConfig?.difficulty || 'medium');
  const [questionCount, setQuestionCount] = useState<number>(initialConfig?.questionCount || 5);
  const [questionType, setQuestionType] = useState<QuestionType>(initialConfig?.questionType || 'mcq');
  const [mode, setMode] = useState<QuizMode>(initialConfig?.mode || 'practice');
  const [useAi, setUseAi] = useState<boolean>(initialConfig?.useAi !== undefined ? initialConfig.useAi : true);

  // Sync state if initialConfig is updated
  React.useEffect(() => {
    if (initialConfig?.subject) {
      setSubjectId(initialConfig.subject);
      const subj = CBSE_CLASS_12_SUBJECTS.find(s => s.id === initialConfig.subject);
      if (initialConfig.chapter) {
        setChapter(initialConfig.chapter);
      } else if (subj && subj.chapters.length > 0) {
        setChapter(subj.chapters[0].name);
      }
    } else if (initialConfig?.chapter) {
      setChapter(initialConfig.chapter);
    }
    if (initialConfig?.difficulty) setDifficulty(initialConfig.difficulty);
    if (initialConfig?.questionCount) setQuestionCount(initialConfig.questionCount);
    if (initialConfig?.questionType) setQuestionType(initialConfig.questionType);
    if (initialConfig?.mode) setMode(initialConfig.mode);
  }, [initialConfig]);

  if (!isOpen) return null;

  const handleSubjectChange = (newSubjectId: SubjectId) => {
    setSubjectId(newSubjectId);
    const subj = CBSE_CLASS_12_SUBJECTS.find(s => s.id === newSubjectId);
    if (subj && subj.chapters.length > 0) {
      setChapter(subj.chapters[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartQuiz({
      board,
      grade: '12',
      subject: subjectId,
      chapter,
      difficulty,
      questionCount,
      questionType,
      mode,
      useAi,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors">
        {/* Header */}
        <div className="px-6 py-5 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-900 flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.config.modalTitle}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.config.modalSubtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white p-1.5 rounded-lg transition-colors focus:outline-none cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Error Banner */}
          {generationError && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl text-xs space-y-2">
              <div className="flex items-start gap-2 text-amber-900 dark:text-amber-200 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>Notice: {generationError}</span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setUseAi(false);
                    onStartQuiz({
                      board,
                      grade: '12',
                      subject: subjectId,
                      chapter,
                      difficulty,
                      questionCount,
                      questionType,
                      mode,
                      useAi: false,
                    });
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition-all shadow-xs cursor-pointer"
                >
                  {t.config.fallbackBtn}
                </button>
              </div>
            </div>
          )}

          {/* 1. Mode Selector (Practice vs CBSE Exam Mode) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {t.config.modeLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('practice')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  mode === 'practice'
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/70 text-indigo-950 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    {t.config.modePractice}
                  </span>
                  {mode === 'practice' && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.config.modePracticeDesc}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode('exam')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  mode === 'exam'
                    ? 'border-amber-500 dark:border-amber-400 bg-amber-50/70 dark:bg-amber-950/70 text-amber-950 dark:text-amber-200 ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    {t.config.modeExam}
                  </span>
                  {mode === 'exam' && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t.config.modeExamDesc}
                </p>
              </button>
            </div>
          </div>

          {/* 2. Subject Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {t.config.subjectLabel}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {CBSE_CLASS_12_SUBJECTS.map((sub) => {
                const isSelected = subjectId === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleSubjectChange(sub.id)}
                    className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white font-bold shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold'
                    }`}
                  >
                    <div className="text-xs sm:text-sm">{translateSubject(sub.id)}</div>
                    <div
                      className={`text-[10px] mt-0.5 ${
                        isSelected ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      CODE {sub.code}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Chapter Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {t.config.chapterLabel} ({CBSE_CLASS_12_SUBJECTS.find(s => s.id === subjectId)?.chapters.length || 0} {t.dashboard.chaptersCount})
            </label>
            <select
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">{t.config.allChapters}</option>
              {currentSubjectInfo.chapters.map((ch) => (
                <option key={ch.id} value={ch.name}>
                  {translateChapter(ch.name)} ({ch.weightageEstimate})
                </option>
              ))}
            </select>
          </div>

          {/* 4. Question Format & Difficulty Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Format */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {t.config.typeLabel}
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="mcq">{t.config.typeMcq}</option>
                <option value="numerical">{t.config.typeNumerical}</option>
                <option value="conceptual">{t.config.typeConceptual}</option>
                <option value="assertion_reason">{t.config.typeAssertionReason}</option>
                <option value="case_based">{t.config.typeCaseBased}</option>
                <option value="mixed">{t.config.typeMixed}</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {t.config.difficultyLabel}
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs sm:text-sm bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="medium">{t.config.medium}</option>
                <option value="easy">{t.config.easy}</option>
                <option value="hard">{t.config.hard}</option>
                <option value="mixed">{t.config.mixed}</option>
              </select>
            </div>
          </div>

          {/* 5. Question Count & AI Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1 border-t border-slate-100 dark:border-slate-700">
            {/* Question count */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {t.config.questionCountLabel}: <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{questionCount}</span>
              </label>
              <div className="flex items-center gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      questionCount === num
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {num} Q
                  </button>
                ))}
              </div>
            </div>

            {/* AI Toggle */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Gemini AI Engine</span>
                </span>
                <input
                  type="checkbox"
                  id="useAiCheckbox"
                  checked={useAi}
                  onChange={(e) => setUseAi(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500"
                />
              </div>
              <label htmlFor="useAiCheckbox" className="text-[11px] text-slate-500 dark:text-slate-400 block cursor-pointer">
                {useAi ? t.config.aiToggleDesc : t.config.curatedBadge}
              </label>
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {t.config.cancelBtn}
            </button>

            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 dark:shadow-none transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t.config.generatingMsg}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t.config.startBtn}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
