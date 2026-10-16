import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useClass } from '../context/ClassContext';
import { SubjectId } from '../types/quiz';
import {
  getCompetencyStats,
  saveCompetencySession,
  CompetencyStats,
} from '../utils/competencyStorage';
import {
  ShieldCheck,
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Zap,
  Layers,
  HelpCircle,
  BarChart3,
  Target,
  FileText,
  Clock,
  Compass,
} from 'lucide-react';

interface CompetencyQuestion {
  id: string;
  grade: string;
  subject: string;
  chapter: string;
  questionType: string;
  question: string;
  casePassage?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  conceptTested: string;
  commonMisconception: string;
  suggestedRevisionTopic: string;
  difficulty: string;
  marks: number;
}

export const CompetencyPracticePage: React.FC = () => {
  const { language, t, translateSubject, translateChapter } = useLanguage();
  const { grade, gradeLabel, subjects, stream, setStream, isClass12 } = useClass();

  // Generator Setup State
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(subjects[0]?.id || 'physics');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [questionType, setQuestionType] = useState<string>('application_mcq');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Generation & Active Drill State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [questions, setQuestions] = useState<CompetencyQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Student Interaction State for active session
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Persistent Stats
  const [stats, setStats] = useState<CompetencyStats>(() => getCompetencyStats(grade));

  // Sync subject when grade changes
  useEffect(() => {
    if (subjects.length > 0 && !subjects.some((s) => s.id === selectedSubject)) {
      setSelectedSubject(subjects[0].id);
    }
    setSelectedChapter('all');
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers({});
    setSubmittedQuestions({});
    setSessionCompleted(false);
    setStats(getCompetencyStats(grade));
  }, [grade, subjects]);

  // Available chapters for selected subject
  const availableChapters = useMemo(() => {
    const currentSubj = subjects.find((s) => s.id === selectedSubject);
    return currentSubj ? currentSubj.chapters : [];
  }, [subjects, selectedSubject]);

  // Subject-appropriate Question Type options
  const questionTypeOptions = useMemo(() => {
    const isScienceOrMath = ['mathematics', 'physics', 'chemistry', 'science'].includes(selectedSubject);
    const list = [
      { id: 'application_mcq', label: language === 'hi' ? 'अनुप्रयोग-आधारित MCQ (Application MCQs)' : 'Application-Based MCQs' },
      { id: 'case_based', label: language === 'hi' ? 'केस-आधारित प्रश्न (Case-Based Study)' : 'Case-Based Integrated Study' },
      { id: 'assertion_reason', label: language === 'hi' ? 'अभिकथन एवं कारण (Assertion-Reason)' : 'Assertion-Reason' },
      { id: 'analytical', label: language === 'hi' ? 'विश्लेषणात्मक प्रश्न (Analytical Questions)' : 'Analytical & Critical Thinking' },
      { id: 'conceptual', label: language === 'hi' ? 'अवधारणात्मक समझ (Conceptual Understanding)' : 'Conceptual Understanding' },
    ];

    if (isScienceOrMath) {
      list.push({
        id: 'numerical',
        label: language === 'hi' ? 'व्यावहारिक आंकिक प्रश्न (Applied Numericals)' : 'Applied Numerical Calculations',
      });
      list.push({
        id: 'problem_solving',
        label: language === 'hi' ? 'समस्या-समाधान प्रश्न (Problem-Solving)' : 'Multi-Step Problem Solving',
      });
    }

    if (selectedSubject === 'accountancy') {
      list.push({
        id: 'numerical',
        label: language === 'hi' ? 'लेखांकन गणना एवं अनुपात (Accounting Computations)' : 'Accounting Computations & Ratios',
      });
    }

    if (selectedSubject === 'economics') {
      list.push({
        id: 'numerical',
        label: language === 'hi' ? 'समष्टि अर्थशास्त्र आंकिक प्रश्न (Macro Numericals)' : 'Macroeconomic Numericals',
      });
      list.push({
        id: 'source_based',
        label: language === 'hi' ? 'आर्थिक डेटा/ग्राफ विश्लेषण (Economic Data Analysis)' : 'Economic Data & Graph Analysis',
      });
    }

    if (['social_science', 'english', 'english_core'].includes(selectedSubject)) {
      list.push({
        id: 'source_based',
        label: language === 'hi' ? 'स्रोत/अनुच्छेद विश्लेषण (Source/Extract RTC Analysis)' : 'Source Document & RTC Extract Analysis',
      });
    }

    return list;
  }, [selectedSubject, language]);

  // Handle Generate Questions
  const handleGenerateQuestions = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSessionCompleted(false);
    setAnswers({});
    setSubmittedQuestions({});
    setCurrentIndex(0);

    try {
      const response = await fetch('/api/generate-competency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          subject: selectedSubject,
          chapter: selectedChapter,
          questionType,
          difficulty,
          questionCount,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate competency questions.');
      }

      if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('Received empty question set from server. Please retry.');
      }

      setQuestions(data.questions);
    } catch (err: any) {
      console.error('Competency Generation Failed:', err);
      setErrorMessage(
        err.message ||
          (language === 'hi'
            ? 'प्रश्न जनरेट करने में त्रुटि हुई। कृपया पुनः प्रयास करें।'
            : 'Could not generate competency questions. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const currentQ = questions[currentIndex];

  const handleSelectOption = (qId: string, opt: string) => {
    if (submittedQuestions[qId]) return;
    setAnswers((prev) => ({ ...prev, [qId]: opt }));
  };

  const handleSubmitCurrentAnswer = (qId: string) => {
    if (!answers[qId]) return;
    setSubmittedQuestions((prev) => ({ ...prev, [qId]: true }));
  };

  const handleFinishSession = () => {
    // Calculate final metrics
    let correct = 0;
    const weakList: string[] = [];
    const concepts: string[] = [];

    questions.forEach((q) => {
      const selected = answers[q.id];
      const isCorrect = selected && selected.trim() === q.correctAnswer.trim();
      if (isCorrect) {
        correct++;
      } else {
        weakList.push(q.conceptTested);
      }
      concepts.push(q.conceptTested);
    });

    const accuracy = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

    saveCompetencySession(grade, {
      id: `sess-${Date.now()}`,
      timestamp: new Date().toISOString(),
      grade,
      subject: selectedSubject,
      chapter: selectedChapter,
      questionType,
      totalQuestions: questions.length,
      score: correct,
      accuracy,
      conceptsTested: concepts,
      weakConcepts: weakList,
    });

    setStats(getCompetencyStats(grade));
    setSessionCompleted(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-indigo-700 via-indigo-900 to-slate-950 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-indigo-200 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
              <span>{language === 'hi' ? 'राष्ट्रीय शिक्षा नीति (NEP 2020) एवं सीबीएसई 2026–27' : 'NEP 2020 & CBSE 2026–27 Competency Framework'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              {language === 'hi' ? 'सीबीएसई योग्यता-आधारित अभ्यास' : 'CBSE Competency-Based Practice'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
              {language === 'hi'
                ? `सीबीएसई कक्षा ${grade} बोर्ड परीक्षा में अब 50% प्रश्न योग्यता-आधारित हैं। केस-स्टडी, वास्तविक अनुप्रयोग और उच्च-स्तरीय विचार कौशल (HOTS) का अभ्यास करें।`
                : `CBSE now mandates ≥50% Competency-Focused Questions. Master case-based scenarios, real-world application, assertion-reasoning, and higher-order critical thinking.`}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[100px]">
              <div className="text-2xl font-black">{stats.totalQuestionsPractised}</div>
              <div className="text-[11px] font-semibold text-indigo-200 uppercase tracking-wider mt-0.5">
                {language === 'hi' ? 'अभ्यास प्रश्न' : 'Practised'}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[100px]">
              <div className="text-2xl font-black">{stats.overallAccuracy}%</div>
              <div className="text-[11px] font-semibold text-indigo-200 uppercase tracking-wider mt-0.5">
                {language === 'hi' ? 'सटीकता' : 'Accuracy'}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[100px]">
              <div className="text-2xl font-black">{stats.totalAttempts}</div>
              <div className="text-[11px] font-semibold text-indigo-200 uppercase tracking-wider mt-0.5">
                {language === 'hi' ? 'सत्र' : 'Sessions'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Competency Practice Setup Panel */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>{language === 'hi' ? 'अभ्यास सत्र सेटअप' : 'Competency Drill Configuration'}</span>
          </div>
          <div className="flex items-center gap-2">
            {isClass12 && (
              <div className="inline-flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setStream('science')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    stream === 'science'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {language === 'hi' ? 'साइंस' : 'Science'}
                </button>
                <button
                  type="button"
                  onClick={() => setStream('commerce')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    stream === 'commerce'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {language === 'hi' ? 'कॉमर्स' : 'Commerce'}
                </button>
              </div>
            )}
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              CBSE {gradeLabel} (2026–27)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          {/* Subject */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'hi' ? 'विषय चुनें' : 'Subject'}
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value as SubjectId);
                setSelectedChapter('all');
              }}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {translateSubject(s.id)} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {/* Chapter */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'hi' ? 'अध्याय' : 'Chapter'}
            </label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">{language === 'hi' ? 'सभी अध्याय (मिश्रित अभ्यास)' : 'All Chapters'}</option>
              {availableChapters.map((ch) => (
                <option key={ch.id} value={ch.name}>
                  {translateChapter(ch.name)}
                </option>
              ))}
            </select>
          </div>

          {/* Question Type */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'hi' ? 'योग्यता प्रारूप' : 'Competency Format'}
            </label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {questionTypeOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'hi' ? 'कठिनाई स्तर' : 'Difficulty'}
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="easy">{language === 'hi' ? 'सरल (Easy)' : 'Easy'}</option>
              <option value="medium">{language === 'hi' ? 'मध्यम (Medium)' : 'Medium'}</option>
              <option value="hard">{language === 'hi' ? 'कठिन (Hard)' : 'Hard'}</option>
            </select>
          </div>

          {/* Question Count */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'hi' ? 'प्रश्नों की संख्या' : 'Question Count'}
            </label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={8}>8 Questions</option>
              <option value={10}>10 Questions</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {language === 'hi'
              ? 'प्रश्नों को वास्तविक सीबीएसई एनसीईआरटी ब्लूप्रिंट और एनईपी 2020 मानदंडों के आधार पर तैयार किया जाता है।'
              : 'Original competency questions generated in strict accordance with official CBSE 2026–27 learning outcomes.'}
          </p>

          <button
            onClick={handleGenerateQuestions}
            disabled={isLoading}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            {isLoading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>{language === 'hi' ? 'तैयार किया जा रहा है...' : 'Generating Practice...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>{language === 'hi' ? 'अभ्यास प्रश्न जनरेट करें' : 'Generate Practice Questions'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs sm:text-sm text-rose-800 dark:text-rose-300 font-semibold flex items-center justify-between gap-3 animate-shake">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={handleGenerateQuestions}
            className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
          >
            {language === 'hi' ? 'पुनः प्रयास करें' : 'Retry'}
          </button>
        </div>
      )}

      {/* Active Practice Interface */}
      {questions.length > 0 && !sessionCompleted && currentQ && (
        <div className="space-y-4 animate-fadeIn">
          {/* Progress Header */}
          <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-indigo-600 dark:text-indigo-400">
                {language === 'hi' ? 'प्रश्न' : 'Question'} {currentIndex + 1} / {questions.length}
              </span>
              <span>•</span>
              <span className="capitalize">{currentQ.difficulty}</span>
              <span>•</span>
              <span className="capitalize">{currentQ.questionType.replace('_', ' ')}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFinishSession}
                className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'सत्र समाप्त करें' : 'End Session'}
              </button>
            </div>
          </div>

          {/* Question Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            {/* Context Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200/80 dark:border-indigo-800">
                  {currentQ.questionType.toUpperCase().replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {translateSubject(currentQ.subject)} · {translateChapter(currentQ.chapter)}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {currentQ.marks} {currentQ.marks === 1 ? 'Mark' : 'Marks'}
              </span>
            </div>

            {/* Case Passage if available */}
            {currentQ.casePassage && (
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif">
                <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1.5 font-sans flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'केस-स्टडी संदर्भ / वास्तविक परिस्थिति:' : 'Case-Based Scenario / Context:'}</span>
                </div>
                {currentQ.casePassage}
              </div>
            )}

            {/* Question Text */}
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
              {currentQ.question}
            </div>

            {/* MCQ Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                const letter = String.fromCharCode(65 + idx);
                const isSelected = answers[currentQ.id] === opt;
                const isSubmitted = !!submittedQuestions[currentQ.id];
                const isCorrect = opt.trim() === currentQ.correctAnswer.trim();

                let style =
                  'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200';

                if (isSubmitted) {
                  if (isCorrect) {
                    style =
                      'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20';
                  } else if (isSelected && !isCorrect) {
                    style =
                      'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/20';
                  } else {
                    style = 'opacity-60 border-slate-200 dark:border-slate-800';
                  }
                } else if (isSelected) {
                  style =
                    'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-950 dark:text-white ring-2 ring-indigo-600/30 font-bold';
                }

                return (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => handleSelectOption(currentQ.id, opt)}
                    className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-start gap-3 cursor-pointer ${style}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                        isSubmitted && isCorrect
                          ? 'bg-emerald-600 text-white'
                          : isSubmitted && isSelected && !isCorrect
                          ? 'bg-rose-600 text-white'
                          : isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt}</span>
                    {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
                    {isSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Navigation & Submit Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'पिछला' : 'Previous'}</span>
                </button>
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1))}
                  disabled={currentIndex === questions.length - 1}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>{language === 'hi' ? 'अगला' : 'Next'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {!submittedQuestions[currentQ.id] ? (
                  <button
                    onClick={() => handleSubmitCurrentAnswer(currentQ.id)}
                    disabled={!answers[currentQ.id]}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'hi' ? 'उत्तर जांचें' : 'Check Answer'}</span>
                  </button>
                ) : (
                  currentIndex === questions.length - 1 && (
                    <button
                      onClick={handleFinishSession}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{language === 'hi' ? 'सत्र रिपोर्ट देखें' : 'View Session Report'}</span>
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Explain My Answer Forensic Breakdown */}
            {submittedQuestions[currentQ.id] && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-700">
                  <div className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>{language === 'hi' ? 'उत्तर विश्लेषण एवं अवधारणा व्याख्या' : 'Explain My Answer & Forensic Breakdown'}</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    Correct: {currentQ.correctAnswer}
                  </span>
                </div>

                {/* Step-by-step reasoning */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {language === 'hi' ? 'चरण-दर-चरण समाधान:' : 'Step-by-Step Reasoning:'}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                    {currentQ.explanation}
                  </div>
                </div>

                {/* Forensic Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 space-y-1">
                    <div className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                      {language === 'hi' ? 'परीक्षित अवधारणा' : 'Concept Tested'}
                    </div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {currentQ.conceptTested}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 space-y-1">
                    <div className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                      {language === 'hi' ? 'सामान्य बोर्ड जाल / भ्रम' : 'Common Misconception'}
                    </div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {currentQ.commonMisconception}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60 space-y-1">
                    <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                      {language === 'hi' ? 'अनुशंसित दोहराव टॉपिक' : 'Suggested NCERT Topic'}
                    </div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {currentQ.suggestedRevisionTopic}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Competency Performance Report (After completion) */}
      {sessionCompleted && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-6 animate-scaleUp">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'सत्र संपन्न' : 'Drill Completed'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {language === 'hi' ? 'योग्यता प्रदर्शन विश्लेषण रिपोर्ट' : 'Competency Performance Report'}
              </h2>
            </div>

            <button
              onClick={() => {
                setSessionCompleted(false);
                setQuestions([]);
                handleGenerateQuestions();
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{language === 'hi' ? 'नया अभ्यास सत्र शुरू करें' : 'Start Another Session'}</span>
            </button>
          </div>

          {/* Session Score Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700">
              <div className="text-xs text-slate-500 font-semibold">{language === 'hi' ? 'प्रयास किए' : 'Attempted'}</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{questions.length}</div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{language === 'hi' ? 'सही उत्तर' : 'Correct'}</div>
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
                {questions.filter((q) => answers[q.id]?.trim() === q.correctAnswer.trim()).length}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
              <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold">{language === 'hi' ? 'गलत उत्तर' : 'Incorrect'}</div>
              <div className="text-2xl font-black text-rose-700 dark:text-rose-300 mt-1">
                {questions.length - questions.filter((q) => answers[q.id]?.trim() === q.correctAnswer.trim()).length}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
              <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{language === 'hi' ? 'सटीकता' : 'Accuracy'}</div>
              <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300 mt-1">
                {Math.round(
                  (questions.filter((q) => answers[q.id]?.trim() === q.correctAnswer.trim()).length / questions.length) * 100
                )}
                %
              </div>
            </div>
          </div>

          {/* Concepts needing review & Next Practice Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>{language === 'hi' ? 'कमजोर अवधारणाएं जिन पर ध्यान आवश्यक है' : 'Concepts Requiring Revision'}</span>
              </div>
              <ul className="space-y-2 text-xs">
                {questions
                  .filter((q) => answers[q.id]?.trim() !== q.correctAnswer.trim())
                  .map((q, i) => (
                    <li key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{q.conceptTested}</span>
                      <span className="text-[11px] text-slate-500">{q.suggestedRevisionTopic}</span>
                    </li>
                  ))}
                {questions.every((q) => answers[q.id]?.trim() === q.correctAnswer.trim()) && (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium py-2">
                    {language === 'hi' ? 'शानदार प्रदर्शन! आपने सभी प्रश्नों के सही उत्तर दिए।' : 'Flawless session! You answered all competency questions correctly.'}
                  </div>
                )}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-500" />
                <span>{language === 'hi' ? 'अगले अभ्यास की सिफारिशें' : 'Recommended Next Steps'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'hi'
                  ? 'अपनी कमजोर अवधारणाओं को दोहराने के लिए फॉर्मूला बैंक या स्मार्ट रिवीजन सेंटर का उपयोग करें। इसके अतिरिक्त, बोर्ड परीक्षा पैटर्न के लिए PYQ Hub से पिछले वर्ष के प्रश्न हल करें।'
                  : 'Reinforce these outcomes in the Formula Library or Smart Revision Center. Then test your knowledge on authentic Board sets in the CBSE PYQ Hub.'}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Link
                  to="/pyq-hub"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  {language === 'hi' ? 'सीबीएसई PYQ हब पर जाएं' : 'Practice CBSE PYQs'}
                </Link>
                <Link
                  to="/formulas"
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
                  {language === 'hi' ? 'सूत्र पुस्तकालय' : 'Formula Library'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer attribution */}
      <div className="text-center pt-8 text-xs text-slate-400 dark:text-slate-500">
        Made with ❤️ by Pratyush Sharma · BoardAce AI 2026–27
      </div>
    </div>
  );
};
