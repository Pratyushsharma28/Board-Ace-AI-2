import React, { useState } from 'react';
import { Question, QuizAttempt } from '../types/quiz';
import {
  computeMistakeDetectiveSummary,
  MistakeDetail,
  MISTAKE_CATEGORY_HI,
} from '../utils/mistakeDetective';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Send,
  HelpCircle,
} from 'lucide-react';

interface MistakeDetectiveSectionProps {
  attempt: QuizAttempt;
  onOpenModal?: (question: Question, selectedAnswer: string) => void;
  onPracticeTopic?: (topic: string, chapter: string, subject: string) => void;
}

interface SimilarQuestionState {
  loading: boolean;
  error: string | null;
  question: Question | null;
  selectedAnswer: string | null;
  submitted: boolean;
}

export const MistakeDetectiveSection: React.FC<MistakeDetectiveSectionProps> = ({
  attempt,
  onOpenModal,
  onPracticeTopic,
}) => {
  const { language, t, translateSubject, translateChapter } = useLanguage();
  const summary = computeMistakeDetectiveSummary(attempt);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>(() => {
    // Expand the first mistake by default for immediate visibility
    const initial: Record<number, boolean> = {};
    if (summary.mistakes.length > 0) {
      initial[summary.mistakes[0].questionNumber] = true;
    }
    return initial;
  });

  const [similarQuestions, setSimilarQuestions] = useState<Record<string, SimilarQuestionState>>({});

  const toggleExpand = (qNum: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [qNum]: !prev[qNum],
    }));
  };

  const handleFetchSimilarQuestion = async (mistake: MistakeDetail) => {
    const qId = mistake.question.id;
    setSimilarQuestions(prev => ({
      ...prev,
      [qId]: {
        loading: true,
        error: null,
        question: null,
        selectedAnswer: null,
        submitted: false,
      },
    }));

    try {
      const res = await fetch('/api/generate-similar-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: mistake.question.subject,
          chapter: mistake.question.chapter,
          topic: mistake.topic,
          difficulty: mistake.question.difficulty,
          questionType: mistake.question.questionType,
          originalQuestion: mistake.question.question,
        }),
      });

      const data = await res.json();
      if (data.success && data.question) {
        setSimilarQuestions(prev => ({
          ...prev,
          [qId]: {
            loading: false,
            error: null,
            question: data.question,
            selectedAnswer: null,
            submitted: false,
          },
        }));
      } else {
        const errorMsg =
          data.error ||
          'The question generator is temporarily reaching free-tier limits. Please continue reviewing the verified board explanation and revision tip above.';
        setSimilarQuestions(prev => ({
          ...prev,
          [qId]: {
            loading: false,
            error: errorMsg,
            question: null,
            selectedAnswer: null,
            submitted: false,
          },
        }));
      }
    } catch (err) {
      console.error('Error fetching similar question:', err);
      setSimilarQuestions(prev => ({
        ...prev,
        [qId]: {
          loading: false,
          error:
            'Network issue connecting to question generator. Please continue reviewing the official board explanation above.',
          question: null,
          selectedAnswer: null,
          submitted: false,
        },
      }));
    }
  };

  const handleSelectSimilarAnswer = (qId: string, answer: string) => {
    setSimilarQuestions(prev => {
      const curr = prev[qId];
      if (!curr || curr.submitted) return prev;
      return {
        ...prev,
        [qId]: {
          ...curr,
          selectedAnswer: answer,
        },
      };
    });
  };

  const handleSubmitSimilarAnswer = (qId: string) => {
    setSimilarQuestions(prev => {
      const curr = prev[qId];
      if (!curr) return prev;
      return {
        ...prev,
        [qId]: {
          ...curr,
          submitted: true,
        },
      };
    });
  };

  // Badge stylings per Mistake Category
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Calculation error':
        return 'bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800';
      case 'Formula selection':
        return 'bg-violet-50 dark:bg-violet-950/70 text-violet-800 dark:text-violet-200 border-violet-200 dark:border-violet-800';
      case 'Unit or sign error':
        return 'bg-cyan-50 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-200 border-cyan-200 dark:border-cyan-800';
      case 'Conceptual misunderstanding':
        return 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800';
      case 'Incorrect factual understanding':
        return 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800';
      case 'Needs further review':
      case 'Review this concept':
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700';
    }
  };

  if (summary.incorrectCount === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 p-6 sm:p-7 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Mistake Detective: Perfect Score!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No incorrect answers detected in this quiz attempt.
            </p>
          </div>
        </div>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed border border-emerald-200 dark:border-emerald-800">
          {summary.revisionRecommendation}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mistake Detective Header Banner & Results Summary */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs transition-colors">
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-violet-950 dark:from-slate-950 dark:to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Mistake Detective</h2>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-violet-500/30 text-violet-200 border border-violet-400/30">
                  Concept Remediation
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Understand why an answer was incorrect instead of just memorizing the solution.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-violet-200 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 shrink-0">
            <span className="font-bold text-white tabular-nums">{summary.incorrectCount}</span>
            <span>mistake{summary.incorrectCount > 1 ? 's' : ''} to review</span>
          </div>
        </div>

        {/* Results Summary Strip */}
        <div className="p-6 bg-slate-50/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-700 space-y-4 transition-colors">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Total Questions</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">
                {summary.totalQuestions}
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Correct Answers</div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 tabular-nums">
                {summary.correctCount}
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Incorrect Answers</div>
              <div className="text-lg font-bold text-red-600 dark:text-rose-400 mt-0.5 tabular-nums">
                {summary.incorrectCount}
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Score & Accuracy</div>
              <div className="text-lg font-bold text-violet-700 dark:text-violet-400 mt-0.5 tabular-nums">
                {summary.score} / {summary.totalQuestions} ({summary.accuracy}%)
              </div>
            </div>
          </div>

          {/* Topics Associated with Incorrect Answers */}
          {summary.topicsWithMistakes.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Topics Associated with Mistakes:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {summary.topicsWithMistakes.map(topic => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 dark:bg-rose-950/60 text-red-800 dark:text-rose-300 border border-red-200 dark:border-rose-900"
                  >
                    <span>{topic}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Active Mistake Category Pills */}
          <div className="space-y-1.5 pt-1">
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Mistake Classifications Detected:
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(summary.categoryCounts)
                .filter(([_, count]) => count > 0)
                .map(([category, count]) => (
                  <span
                    key={category}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${getCategoryBadgeClass(
                      category
                    )}`}
                  >
                    <span className="font-bold tabular-nums">{count}</span>
                    <span>{category}</span>
                  </span>
                ))}
            </div>
          </div>

          {/* Revision Recommendation Box */}
          <div className="p-4 bg-violet-50/70 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/60 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-violet-900 dark:text-violet-300">
              <Lightbulb className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
              <span>Revision Recommendation:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed pl-5">
              {summary.revisionRecommendation}
            </p>
          </div>
        </div>
      </div>

      {/* Expandable Mistake Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Reviewing {summary.mistakes.length} Incorrect Answer{summary.mistakes.length > 1 ? 's' : ''}
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            Click cards to expand or collapse
          </span>
        </div>

        {summary.mistakes.map(mistake => {
          const isExpanded = Boolean(expandedCards[mistake.questionNumber]);
          const qId = mistake.question.id;
          const similarState = similarQuestions[qId];

          return (
            <div
              key={mistake.questionNumber}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs transition-all"
            >
              {/* Card Header Strip */}
              <div
                onClick={() => toggleExpand(mistake.questionNumber)}
                className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/60 dark:hover:bg-slate-700/40 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5">
                    <XCircle className="w-5 h-5 text-red-600 dark:text-rose-400 shrink-0" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {language === 'hi' ? 'प्रश्न' : 'Question'} {mistake.questionNumber}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">·</span>
                      <span className="text-slate-600 dark:text-slate-300 font-medium">{mistake.topic}</span>
                      <span className="text-slate-300 dark:text-slate-600">·</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getCategoryBadgeClass(
                          mistake.category
                        )}`}
                      >
                        {language === 'hi' && MISTAKE_CATEGORY_HI[mistake.category]
                          ? MISTAKE_CATEGORY_HI[mistake.category]
                          : mistake.category}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {language === 'hi' && mistake.question.questionHi
                        ? mistake.question.questionHi
                        : mistake.question.question}
                    </p>

                    {/* Quick Answer Summary in header */}
                    <div className="flex flex-wrap items-center gap-3 text-xs pt-0.5">
                      <div className="inline-flex items-center gap-1 text-red-700 dark:text-rose-300 bg-red-50/80 dark:bg-rose-950/50 px-2 py-0.5 rounded border border-red-200 dark:border-rose-900">
                        <span className="font-semibold">{language === 'hi' ? 'चुना हुआ:' : 'Selected:'}</span>
                        <span className="max-w-[200px] truncate">{mistake.selectedAnswer}</span>
                      </div>
                      <div className="inline-flex items-center gap-1 text-emerald-800 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                        <span className="font-semibold">{language === 'hi' ? 'सही उत्तर:' : 'Correct:'}</span>
                        <span className="max-w-[200px] truncate">{mistake.correctAnswer}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Card Details */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-5 bg-slate-50/30 dark:bg-slate-900/40">
                  {/* Full Question Text */}
                  <div className="p-4 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Full Examination Question
                    </div>
                    <p className="text-sm text-slate-900 dark:text-white leading-relaxed font-medium">
                      {mistake.question.question}
                    </p>
                  </div>

                  {/* Options Comparison Grid */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Options & Answer Selection
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {mistake.question.options.map((opt, oIdx) => {
                        const optLetter = String.fromCharCode(65 + oIdx);
                        const isChosen = opt === mistake.selectedAnswer;
                        const isRight = opt === mistake.correctAnswer;

                        let cardStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200';
                        if (isRight) {
                          cardStyle = 'bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100 font-medium ring-1 ring-emerald-300 dark:ring-emerald-700';
                        } else if (isChosen) {
                          cardStyle = 'bg-red-50/90 dark:bg-rose-950/60 border-red-300 dark:border-rose-700 text-red-950 dark:text-rose-100 font-medium ring-1 ring-red-300 dark:ring-rose-700';
                        }

                        return (
                          <div
                            key={oIdx}
                            className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${cardStyle}`}
                          >
                            <span className="font-mono font-bold shrink-0">{optLetter}.</span>
                            <div className="flex-1 space-y-0.5">
                              <div>{opt}</div>
                              {isRight && (
                                <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                                  Board-Approved Correct Answer
                                </div>
                              )}
                              {isChosen && !isRight && (
                                <div className="text-[10px] font-bold text-red-700 dark:text-rose-300 uppercase tracking-wide">
                                  Your Selected Answer
                                </div>
                              )}
                            </div>
                            {isRight && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                            {isChosen && !isRight && <XCircle className="w-4 h-4 text-red-600 dark:text-rose-400 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Subject-Specific Explanation Breakdown */}
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {mistake.question.subject === 'mathematics' && 'Mathematics Calculation Steps & Reasoning'}
                          {mistake.question.subject === 'physics' && 'Physics Formula, Substitution & Reasoning'}
                          {mistake.question.subject === 'chemistry' && 'Chemistry Reaction & Concept Explanation'}
                          {!['mathematics', 'physics', 'chemistry'].includes(mistake.question.subject) &&
                            'Official Board Reasoning'}
                        </h4>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400">
                        CBSE Class 12 (Session 2026-27)
                      </span>
                    </div>

                    {/* Mathematics Specific */}
                    {mistake.question.subject === 'mathematics' && (
                      <div className="space-y-3">
                        {mistake.subjectBreakdown.calculationSteps && mistake.subjectBreakdown.calculationSteps.length > 0 && (
                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Calculation Steps:</div>
                            <div className="space-y-1.5 pl-1">
                              {mistake.subjectBreakdown.calculationSteps.map((step, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700"
                                >
                                  <span className="font-mono font-bold text-violet-600 dark:text-violet-400 shrink-0">
                                    {sIdx + 1}.
                                  </span>
                                  <span className="leading-relaxed">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {mistake.subjectBreakdown.notes && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                            {mistake.subjectBreakdown.notes}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Physics Specific */}
                    {mistake.question.subject === 'physics' && (
                      <div className="space-y-3">
                        {mistake.subjectBreakdown.formula && (
                          <div className="p-3 bg-violet-50/60 dark:bg-violet-950/40 rounded-lg border border-violet-100 dark:border-violet-900/60 flex items-center justify-between gap-2">
                            <div className="text-xs text-violet-900 dark:text-violet-200">
                              <span className="font-bold">Governing Formula: </span>
                              <code className="font-mono font-semibold bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-violet-200 dark:border-violet-800">
                                {mistake.subjectBreakdown.formula}
                              </code>
                            </div>
                          </div>
                        )}
                        {mistake.subjectBreakdown.substitutionsAndUnits && (
                          <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200">
                            <span className="font-semibold text-slate-900 dark:text-white">Values & Substitution: </span>
                            {mistake.subjectBreakdown.substitutionsAndUnits}
                          </div>
                        )}
                        <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                          {mistake.explanation}
                        </div>
                        {mistake.subjectBreakdown.notes && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                            {mistake.subjectBreakdown.notes}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Chemistry Specific */}
                    {mistake.question.subject === 'chemistry' && (
                      <div className="space-y-3">
                        {mistake.subjectBreakdown.chemicalEquation && (
                          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 font-mono">
                            <span className="font-bold font-sans text-emerald-900 dark:text-emerald-300">Chemical Equation / Transition: </span>
                            <span className="font-semibold">{mistake.subjectBreakdown.chemicalEquation}</span>
                          </div>
                        )}
                        <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                          {mistake.explanation}
                        </div>
                        {mistake.subjectBreakdown.notes && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                            {mistake.subjectBreakdown.notes}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Fallback if other subject */}
                    {!['mathematics', 'physics', 'chemistry'].includes(mistake.question.subject) && (
                      <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                        {mistake.explanation}
                      </div>
                    )}

                    {/* Common Board Pitfall (Examiner Note) */}
                    {mistake.question.pitfall && (
                      <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          <span>Common Board Exam Trap:</span>
                        </div>
                        <p className="text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
                          {mistake.question.pitfall}
                        </p>
                      </div>
                    )}

                    {/* Revision Tip */}
                    <div className="p-3 bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 rounded-xl space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-cyan-900 dark:text-cyan-300">
                        <Lightbulb className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400" />
                        <span>Revision Tip for this Concept:</span>
                      </div>
                      <p className="text-cyan-950 dark:text-cyan-200 leading-relaxed">
                        {mistake.revisionTip}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar & "Try a Similar Question" */}
                  <div className="space-y-4 pt-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFetchSimilarQuestion(mistake)}
                          disabled={similarState?.loading}
                          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          {similarState?.loading ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Generating Similar Question...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Try a Similar Question</span>
                            </>
                          )}
                        </button>

                        {onOpenModal && (
                          <button
                            onClick={() => onOpenModal(mistake.question, mistake.selectedAnswer)}
                            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Search className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                            <span>Forensic Deep Dive</span>
                          </button>
                        )}
                      </div>

                      {onPracticeTopic && (
                        <button
                          onClick={() =>
                            onPracticeTopic(
                              mistake.topic,
                              mistake.question.chapter,
                              mistake.question.subject
                            )
                          }
                          className="flex items-center gap-1 text-xs text-violet-700 dark:text-violet-400 hover:text-violet-900 dark:hover:text-violet-300 font-semibold transition-colors cursor-pointer"
                        >
                          <span>Practice full set on "{mistake.topic}"</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Similar Question Loading / Error / Interactive Drill Card */}
                    {similarState && (
                      <div className="space-y-3 pt-2 animate-fadeIn">
                        {similarState.loading && (
                          <div className="p-4 bg-violet-50/60 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/60 rounded-xl flex items-center gap-3">
                            <RefreshCw className="w-4 h-4 text-violet-600 dark:text-violet-400 animate-spin" />
                            <div className="text-xs text-violet-900 dark:text-violet-200 font-medium">
                              Formulating a verified CBSE Class 12 question targeting "{mistake.topic}"...
                            </div>
                          </div>
                        )}

                        {similarState.error && (
                          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl space-y-1.5 text-xs text-amber-900 dark:text-amber-200">
                            <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-100">
                              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              <span>Question Generator Notice</span>
                            </div>
                            <p>{similarState.error}</p>
                            <button
                              onClick={() => handleFetchSimilarQuestion(mistake)}
                              className="font-semibold text-amber-950 dark:text-amber-200 underline hover:no-underline pt-1 inline-block cursor-pointer"
                            >
                              Retry Question Generation
                            </button>
                          </div>
                        )}

                        {similarState.question && (
                          <div className="p-5 bg-white dark:bg-slate-800 border-2 border-violet-300 dark:border-violet-700 rounded-2xl space-y-4 shadow-sm transition-colors">
                            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2.5">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400 animate-pulse" />
                                <span className="text-xs font-bold text-violet-900 dark:text-violet-300 uppercase tracking-wide">
                                  Remediation Drill: Similar Question
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                Topic: {similarState.question.topic}
                              </span>
                            </div>

                            <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                              {similarState.question.question}
                            </p>

                            {/* Drill Options */}
                            <div className="space-y-2">
                              {similarState.question.options.map((opt, sIdx) => {
                                const isSelected = similarState.selectedAnswer === opt;
                                const isCorrect = opt === similarState.question?.correctAnswer;
                                let btnClass = 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200';

                                if (similarState.submitted) {
                                  if (isCorrect) {
                                    btnClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-semibold ring-1 ring-emerald-400';
                                  } else if (isSelected) {
                                    btnClass = 'border-red-400 bg-red-50 dark:bg-rose-950/60 text-red-950 dark:text-rose-100 font-semibold ring-1 ring-red-400';
                                  }
                                } else if (isSelected) {
                                  btnClass = 'border-violet-600 dark:border-violet-400 bg-violet-50 dark:bg-violet-950/70 text-violet-950 dark:text-violet-200 font-semibold ring-1 ring-violet-500';
                                }

                                return (
                                  <button
                                    key={sIdx}
                                    disabled={similarState.submitted}
                                    onClick={() => handleSelectSimilarAnswer(qId, opt)}
                                    className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${btnClass}`}
                                  >
                                    <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0 text-xs font-mono font-bold mt-0.5">
                                      {String.fromCharCode(65 + sIdx)}
                                    </span>
                                    <span className="flex-1">{opt}</span>
                                    {similarState.submitted && isCorrect && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    )}
                                    {similarState.submitted && isSelected && !isCorrect && (
                                      <XCircle className="w-4 h-4 text-red-600 dark:text-rose-400 shrink-0" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Submit or Verification Result */}
                            <div className="pt-2">
                              {!similarState.submitted ? (
                                <button
                                  disabled={!similarState.selectedAnswer}
                                  onClick={() => handleSubmitSimilarAnswer(qId)}
                                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                                >
                                  Submit & Check Mastery
                                </button>
                              ) : (
                                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
                                  <div className="flex items-center gap-2">
                                    {similarState.selectedAnswer === similarState.question.correctAnswer ? (
                                      <>
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        <span className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-200">
                                          Excellent! You solved the similar question correctly.
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="w-5 h-5 text-red-600 dark:text-rose-400" />
                                        <span className="text-xs sm:text-sm font-bold text-red-900 dark:text-rose-200">
                                          Keep going! Here is the step-by-step reasoning:
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {similarState.question.explanation}
                                  </p>
                                  {similarState.question.pitfall && (
                                    <div className="text-[11px] text-amber-800 dark:text-amber-300">
                                      <span className="font-semibold">Examiner Watch:</span> {similarState.question.pitfall}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
