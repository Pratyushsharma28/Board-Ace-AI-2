import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SubjectId } from '../types/quiz';
import {
  FileCheck,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  FileText,
} from 'lucide-react';

interface EvaluationResult {
  estimatedScore: number;
  maxMarks: number;
  conceptAccuracy: string;
  keyPointsHit: string[];
  keyPointsMissed: string[];
  improvementSuggestions: string[];
  modelAnswer: string;
  disclaimer?: string;
}

const PRESET_QUESTIONS = [
  {
    subject: 'physics' as SubjectId,
    marks: 3,
    chapter: 'Electric Charges and Fields',
    question: 'State Gauss’s law in electrostatics. Using this law, obtain an expression for the electric field due to an infinitely long straight uniformly charged wire of linear charge density λ.',
  },
  {
    subject: 'chemistry' as SubjectId,
    marks: 3,
    chapter: 'Haloalkanes and Haloarenes',
    question: 'Give reasons: (a) Haloarenes are extremely less reactive towards nucleophilic substitution reactions. (b) Alkyl halides, though polar, are immiscible with water.',
  },
  {
    subject: 'mathematics' as SubjectId,
    marks: 3,
    chapter: 'Relations and Functions',
    question: 'Show that the relation R in the set A = {x ∈ Z : 0 ≤ x ≤ 12}, given by R = {(a, b) : |a - b| is a multiple of 4}, is an equivalence relation.',
  },
];

export const AnswerCheckerPage: React.FC = () => {
  const { language, t } = useLanguage();

  const [subject, setSubject] = useState<SubjectId>('physics');
  const [questionText, setQuestionText] = useState(PRESET_QUESTIONS[0].question);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [maxMarks, setMaxMarks] = useState<number>(3);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectPreset = (preset: typeof PRESET_QUESTIONS[0]) => {
    setSubject(preset.subject);
    setMaxMarks(preset.marks);
    setQuestionText(preset.question);
    setEvaluation(null);
    setErrorMsg(null);
  };

  const handleEvaluate = async () => {
    if (!questionText.trim() || !studentAnswer.trim()) {
      setErrorMsg(
        language === 'hi'
          ? 'कृपया प्रश्न और अपना उत्तर दोनों प्रदान करें।'
          : 'Please enter both the board question and your written answer.'
      );
      return;
    }

    setIsEvaluating(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/check-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          questionText,
          studentAnswer,
          maxMarks,
          language,
        }),
      });

      const data = await response.json();

      if (data.success && data.evaluation) {
        setEvaluation(data.evaluation);
      } else {
        setErrorMsg(data.error || 'Evaluation could not complete. Please try again.');
      }
    } catch (err: any) {
      console.error('Answer check error:', err);
      setErrorMsg('Network error connecting to AI Examiner service.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <FileCheck className="w-4 h-4" />
          <span>CBSE DESCRIPTIVE ANSWER EVALUATION ENGINE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {language === 'hi' ? 'एआई मॉक बोर्ड परीक्षक' : 'AI Mock Board Examiner'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {language === 'hi'
            ? 'अपने लिखित उत्तर सबमिट करें और सीबीएसई मार्किंग स्कीम के अनुसार तत्काल अंक, छूटे हुए बिंदु और मॉडल उत्तर प्राप्त करें।'
            : 'Submit handwritten or typed answers for instant step-by-step scoring against verified CBSE Class 12 marking schemes.'}
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Input Configuration Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-xs">
        {/* Preset Question Shortcuts */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Quick Practice Question Templates:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_QUESTIONS.map((pr, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectPreset(pr)}
                className="p-3 text-left rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all truncate"
              >
                <div className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                  {pr.subject} ({pr.marks} Marks)
                </div>
                <div className="truncate mt-0.5">{pr.chapter}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Board Question:
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Weightage:</span>
              <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs font-bold">
                {[2, 3, 5].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMaxMarks(m)}
                    className={`px-2 py-0.5 rounded-md transition-colors ${
                      maxMarks === m
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    {m}M
                  </button>
                ))}
              </div>
            </div>
          </div>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={3}
            placeholder="Type or paste the board exam question here..."
            className="w-full p-3.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Student Written Response */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Your Written Answer:</span>
            <span className="text-slate-400 font-mono tabular-nums font-normal">
              {studentAnswer.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <textarea
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            rows={6}
            placeholder="Type your complete solution, statements, formulas, and substitution steps here..."
            className="w-full p-3.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          />
        </div>

        {/* Action Button */}
        <div>
          <button
            type="button"
            disabled={isEvaluating}
            onClick={handleEvaluate}
            className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 disabled:opacity-40 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isEvaluating ? (
              <>
                <RotateCcw className="w-5 h-5 animate-spin" />
                <span>Evaluating Against CBSE Rubric...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Evaluate Answer &amp; Get Scorecard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Evaluation Results Card */}
      {evaluation && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-800 space-y-6 shadow-sm animate-fadeIn">
          {/* Score Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official CBSE Evaluation Estimate
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                Scorecard Breakdown
              </h2>
            </div>

            <div className="p-3 px-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-center shrink-0">
              <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                {evaluation.estimatedScore} / {evaluation.maxMarks}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Estimated Marks
              </div>
            </div>
          </div>

          {/* Concept Accuracy Analysis */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Concept Accuracy Assessment:
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
              {evaluation.conceptAccuracy}
            </p>
          </div>

          {/* Key Points Hit vs Missed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Marking Criteria Awarded:</span>
              </div>
              <ul className="text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5 list-disc list-inside">
                {evaluation.keyPointsHit.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Essential Points Missed:</span>
              </div>
              <ul className="text-xs text-amber-900 dark:text-amber-200 space-y-1.5 list-disc list-inside">
                {evaluation.keyPointsMissed.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Examiner Suggestions */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <span>Examiner Recommendations for 100% Score:</span>
            </div>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
              {evaluation.improvementSuggestions.map((sug, i) => (
                <li key={i}>{sug}</li>
              ))}
            </ul>
          </div>

          {/* Model Answer */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Model Board-Topper Answer Format:
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-mono">
              {evaluation.modelAnswer}
            </div>
          </div>

          {/* Mandatory Disclaimer */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2 border border-slate-200 dark:border-slate-700">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>{evaluation.disclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
};
