import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getSavedAttempts } from '../utils/storage';
import { getRevisionItems, submitRetryAnswer, saveToRevision } from '../utils/revisionEngine';
import { Question, SubjectId } from '../types/quiz';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  Bookmark,
  AlertTriangle,
  Lightbulb,
  Check,
  ChevronRight,
  Layers,
} from 'lucide-react';

interface RetryQuestionItem {
  id: string;
  question: Question;
  originalWrongAnswer?: string;
  subject: SubjectId;
  chapter: string;
  source: 'quiz_attempt' | 'revision_item';
  attemptedDate: string;
}

export const SmartRetryPage: React.FC = () => {
  const { language, t, translateSubject } = useLanguage();
  const navigate = useNavigate();

  const [activeSubject, setActiveSubject] = useState<'all' | SubjectId>('all');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Similar question generator state
  const [similarQuestion, setSimilarQuestion] = useState<Question | null>(null);
  const [isGeneratingSimilar, setIsGeneratingSimilar] = useState(false);
  const [similarSelectedOption, setSimilarSelectedOption] = useState<string | null>(null);
  const [similarEvaluated, setSimilarEvaluated] = useState(false);

  // Toast / feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Extract all historically missed questions without modifying or erasing original attempts
  const missedQuestions = useMemo<RetryQuestionItem[]>(() => {
    const list: RetryQuestionItem[] = [];
    const seenQIds = new Set<string>();

    // 1. Collect from saved revision items
    const revItems = getRevisionItems();
    revItems.forEach((item) => {
      if (item.savedReason === 'incorrect_answer' && !seenQIds.has(item.question.id)) {
        seenQIds.add(item.question.id);
        list.push({
          id: `rev-${item.id}`,
          question: item.question,
          originalWrongAnswer: item.userLastWrongAnswer,
          subject: (['mathematics', 'physics', 'chemistry'].includes(item.question.subject?.toLowerCase())
            ? item.question.subject.toLowerCase()
            : 'physics') as SubjectId,
          chapter: item.question.chapter,
          source: 'revision_item',
          attemptedDate: item.savedAt,
        });
      }
    });

    // 2. Collect from actual quiz attempts
    const attempts = getSavedAttempts();
    attempts.forEach((att) => {
      const subj = (att.quizConfig?.subject?.toLowerCase() || 'physics') as SubjectId;
      att.questions.forEach((q) => {
        const userAns = att.userAnswers ? att.userAnswers[q.id] : undefined;
        if (userAns && userAns !== q.correctAnswer && !seenQIds.has(q.id)) {
          seenQIds.add(q.id);
          list.push({
            id: `att-${q.id}`,
            question: q,
            originalWrongAnswer: userAns,
            subject: subj,
            chapter: q.chapter,
            source: 'quiz_attempt',
            attemptedDate: att.completedAt,
          });
        }
      });
    });

    return list;
  }, []);

  const filteredMissed = useMemo(() => {
    if (activeSubject === 'all') return missedQuestions;
    return missedQuestions.filter((item) => item.subject === activeSubject);
  }, [missedQuestions, activeSubject]);

  const currentItem = filteredMissed[activeQuestionIndex];

  const handleSelectOption = (opt: string) => {
    if (hasEvaluated) return;
    setSelectedOption(opt);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || !currentItem) return;

    const correct = selectedOption.trim() === currentItem.question.correctAnswer.trim();
    setIsCorrect(correct);
    setHasEvaluated(true);
    setShowExplanation(true);

    // Sync spaced-repetition progress through revision engine
    submitRetryAnswer(currentItem.question.id, selectedOption);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setHasEvaluated(false);
    setShowExplanation(false);
    setSimilarQuestion(null);
    setSimilarSelectedOption(null);
    setSimilarEvaluated(false);
    if (activeQuestionIndex < filteredMissed.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    setSelectedOption(null);
    setHasEvaluated(false);
    setShowExplanation(false);
    setSimilarQuestion(null);
    setSimilarSelectedOption(null);
    setSimilarEvaluated(false);
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSaveToRevision = () => {
    if (!currentItem) return;
    saveToRevision(currentItem.question, 'manual_save');
    setToastMessage(
      language === 'hi'
        ? 'अवधारणा को दोहराव केंद्र (Revision Center) में सुरक्षित किया गया!'
        : 'Concept saved to your Spaced-Repetition Revision list!'
    );
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Generate similar practice question via Gemini
  const handleGenerateSimilar = async () => {
    if (!currentItem) return;
    setIsGeneratingSimilar(true);

    try {
      const res = await fetch('/api/generate-similar-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: currentItem.subject,
          chapter: currentItem.chapter,
          topic: currentItem.question.topic || currentItem.chapter,
          difficulty: currentItem.question.difficulty || 'medium',
          questionType: currentItem.question.questionType || 'mcq',
          originalQuestion: currentItem.question.question,
        }),
      });

      const data = await res.json();
      if (data.success && data.question) {
        setSimilarQuestion(data.question);
        setSimilarSelectedOption(null);
        setSimilarEvaluated(false);
      } else {
        setToastMessage(data.error || 'Could not generate follow-up question. Reviewing verified explanation.');
        setTimeout(() => setToastMessage(null), 3500);
      }
    } catch {
      setToastMessage('Network issue generating follow-up question.');
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setIsGeneratingSimilar(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
            <RotateCcw className="w-4 h-4" />
            <span>ADAPTIVE QUESTION REDEMPTION ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'स्मार्ट पुनः प्रयास मोड' : 'Smart Retry Mode'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {language === 'hi'
              ? 'पिछली क्विज़ में गलत हुए प्रश्नों का पुनः अभ्यास करें, चरणबद्ध हल देखें और समान प्रकार के नए प्रश्न जनरेट करके पकड़ मजबूत करें।'
              : 'Retry previously missed CBSE board questions, review step-by-step NCERT reasoning, and generate fresh parallel questions to solidify mastery.'}
          </p>
        </div>

        {/* Subject Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
          {(['all', 'mathematics', 'physics', 'chemistry'] as const).map((sub) => (
            <button
              key={sub}
              onClick={() => {
                setActiveSubject(sub);
                setActiveQuestionIndex(0);
                setSelectedOption(null);
                setHasEvaluated(false);
                setShowExplanation(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubject === sub
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {sub === 'all' ? (language === 'hi' ? 'सभी विषय' : 'All') : translateSubject(sub)}
            </button>
          ))}
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-2 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {filteredMissed.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'कोई गलत प्रश्न लंबित नहीं है!' : 'No Missed Questions in Queue!'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {language === 'hi'
              ? 'शानदार! आपने सभी गलत प्रश्नों को सफलतापूर्वक हल कर लिया है अथवा अभी तक कोई गलती दर्ज नहीं है।'
              : 'You have resolved all previously missed questions or have zero errors recorded. Continue taking chapter quizzes to maintain momentum.'}
          </p>
          <div className="pt-2">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white text-xs sm:text-sm font-bold shadow-md hover:bg-indigo-500 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{language === 'hi' ? 'नया क्विज़ प्रारंभ करें' : 'Practice New Quiz'}</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Active Retry Runner */
        <div className="space-y-6">
          {/* Progress Toolbar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">
                {language === 'hi' ? 'गलत प्रश्न' : 'Missed Question'}
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {activeQuestionIndex + 1} / {filteredMissed.length}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">
              {translateSubject(currentItem.subject)} · {currentItem.chapter}
            </div>
          </div>

          {/* Question Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            {/* Previous error banner */}
            {currentItem.originalWrongAnswer && !hasEvaluated && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
                <span>
                  {language === 'hi' ? 'पिछला गलत चयन:' : 'Previous Incorrect Selection:'}{' '}
                  <span className="font-bold font-mono">"{currentItem.originalWrongAnswer}"</span>
                </span>
                <span className="text-[10px] font-bold text-amber-600">Retry Now</span>
              </div>
            )}

            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentItem.question.question}
            </h2>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentItem.question.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrectOption = option === currentItem.question.correctAnswer;

                let optStyles =
                  'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300';
                if (hasEvaluated) {
                  if (isCorrectOption) {
                    optStyles =
                      'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                  } else if (isSelected && !isCorrectOption) {
                    optStyles =
                      'border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 line-through';
                  }
                } else if (isSelected) {
                  optStyles =
                    'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 font-bold shadow-xs';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={hasEvaluated}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all text-xs sm:text-sm flex items-center justify-between gap-3 cursor-pointer ${optStyles}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {hasEvaluated && isCorrectOption && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    {hasEvaluated && isSelected && !isCorrectOption && (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Check / Next Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                disabled={activeQuestionIndex === 0}
                onClick={handlePrevQuestion}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'पिछला' : 'Previous'}
              </button>

              <div className="flex items-center gap-2">
                {!hasEvaluated ? (
                  <button
                    disabled={!selectedOption}
                    onClick={handleCheckAnswer}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-200 dark:shadow-none cursor-pointer"
                  >
                    {language === 'hi' ? 'उत्तर जांचें' : 'Check Answer'}
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-200 dark:shadow-none cursor-pointer"
                  >
                    <span>{language === 'hi' ? 'अगला प्रश्न' : 'Next Question'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Evaluated Explanation & Parallel Tools */}
            {hasEvaluated && showExplanation && (
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
                <div
                  className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2 ${
                    isCorrect
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                      : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200'
                  }`}
                >
                  <div className="font-bold flex items-center gap-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{language === 'hi' ? 'शानदार! आपने सही हल कर लिया।' : 'Great job! You answered correctly on retry.'}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>{language === 'hi' ? 'अभी भी गलत है। नीचे दी गई एनसीईआरटी व्याख्या को ध्यान से पढ़ें:' : 'Still incorrect. Review the step-by-step NCERT reasoning below:'}</span>
                      </>
                    )}
                  </div>
                  <p className="leading-relaxed">{currentItem.question.explanation}</p>
                  {currentItem.question.pitfall && (
                    <div className="pt-1 text-xs opacity-90">
                      ⚠️ <span className="font-bold">Common Pitfall:</span> {currentItem.question.pitfall}
                    </div>
                  )}
                </div>

                {/* Parallel Action Row */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={handleGenerateSimilar}
                    disabled={isGeneratingSimilar}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 dark:hover:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isGeneratingSimilar ? 'animate-spin' : ''}`} />
                    <span>
                      {isGeneratingSimilar
                        ? language === 'hi'
                          ? 'समान प्रश्न जनरेट हो रहा है...'
                          : 'Generating Parallel Question...'
                        : language === 'hi'
                        ? 'समान अभ्यास प्रश्न जनरेट करें'
                        : 'Generate Similar Practice Question'}
                    </span>
                  </button>

                  <button
                    onClick={handleSaveToRevision}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'दोहराव हेतु चिन्हित करें' : 'Mark for Spaced Revision'}</span>
                  </button>
                </div>

                {/* Rendered Similar Question (if generated) */}
                {similarQuestion && (
                  <div className="p-5 rounded-2xl bg-violet-50/40 dark:bg-violet-950/20 border border-violet-200/80 dark:border-violet-900/50 space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                      <span>Parallel Follow-up Question</span>
                      <span>Targeting Same Concept</span>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {similarQuestion.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {similarQuestion.options.map((opt, oIdx) => {
                        const isSimSelected = similarSelectedOption === opt;
                        const isSimCorrect = opt === similarQuestion.correctAnswer;

                        let sClass = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900';
                        if (similarEvaluated) {
                          if (isSimCorrect) sClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 font-bold';
                          else if (isSimSelected) sClass = 'border-rose-500 bg-rose-50 text-rose-900 line-through';
                        } else if (isSimSelected) {
                          sClass = 'border-violet-600 bg-violet-50 font-bold';
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={similarEvaluated}
                            onClick={() => setSimilarSelectedOption(opt)}
                            className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${sClass}`}
                          >
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {!similarEvaluated ? (
                      <button
                        disabled={!similarSelectedOption}
                        onClick={() => setSimilarEvaluated(true)}
                        className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
                      >
                        Check Follow-up Answer
                      </button>
                    ) : (
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border text-xs text-slate-700 dark:text-slate-300 space-y-1">
                        <div className="font-bold text-violet-600">Explanation:</div>
                        <p>{similarQuestion.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
