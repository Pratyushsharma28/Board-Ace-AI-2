import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { CBSE_CLASS_12_SUBJECTS } from '../data/syllabus';
import { getCuratedQuestions } from '../data/sampleQuestions';
import { saveAttempt, getSavedAttempts } from '../utils/storage';
import { saveToRevision } from '../utils/revisionEngine';
import { classifyMistake } from '../utils/mistakeDetective';
import {
  SubjectId,
  DifficultyLevel,
  QuestionType,
  QuizConfig,
  Question,
  QuizAttempt,
} from '../types/quiz';
import { QuizInterface } from '../components/QuizInterface';
import { ResultsDashboard } from '../components/ResultsDashboard';
import { MistakeDetectiveModal } from '../components/MistakeDetectiveModal';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const QuizPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language, t, translateSubject, translateChapter } = useLanguage();

  // Query parameter prefill
  const querySubject = (searchParams.get('subject') as SubjectId) || 'physics';
  const queryChapter = searchParams.get('chapter') || 'all';
  const reviewAttemptId = searchParams.get('review');

  // Form State
  const [subject, setSubject] = useState<SubjectId>(
    ['mathematics', 'physics', 'chemistry'].includes(querySubject) ? querySubject : 'physics'
  );
  const [chapter, setChapter] = useState<string>(queryChapter);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [questionType, setQuestionType] = useState<QuestionType>('mcq');
  const [useAi, setUseAi] = useState<boolean>(true);

  // Execution states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Active quiz & results state
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [activeConfig, setActiveConfig] = useState<QuizConfig | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);

  // Mistake Detective Modal
  const [mistakeModalData, setMistakeModalData] = useState<{
    question: Question;
    selectedAnswer: string;
  } | null>(null);

  // Check if reviewing an existing attempt
  useEffect(() => {
    if (reviewAttemptId) {
      const attempts = getSavedAttempts();
      const target = attempts.find((a) => a.id === reviewAttemptId);
      if (target) {
        setCurrentAttempt(target);
      }
    }
  }, [reviewAttemptId]);

  // Update chapters when subject changes
  const currentSubjectObj = CBSE_CLASS_12_SUBJECTS.find((s) => s.id === subject);
  const availableChapters = currentSubjectObj ? currentSubjectObj.chapters : [];

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setGenerationError(null);

    const config: QuizConfig = {
      board: 'CBSE',
      grade: '12',
      subject,
      chapter,
      difficulty,
      questionCount,
      questionType,
      mode: 'practice',
      useAi,
    };
    setActiveConfig(config);

    if (useAi) {
      try {
        const response = await fetch('/api/generate-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...config,
            language,
          }),
        });

        const data = await response.json();

        if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
          setActiveQuestions(data.questions);
          setIsGenerating(false);
          return;
        } else {
          const errorMsg =
            data.error ||
            (language === 'hi'
              ? 'AI प्रश्न जनरेटर व्यस्त है। आप प्रमाणित NCERT प्रश्न बैंक से तुरंत अभ्यास कर सकते हैं।'
              : 'AI generation could not complete. You can proceed with our verified board question bank.');
          setGenerationError(errorMsg);
          setIsGenerating(false);
        }
      } catch (err: any) {
        console.error('Quiz generation network failure:', err);
        setGenerationError(
          language === 'hi'
            ? 'क्विज़ इंजन से जुड़ने में त्रुटि। कृपया प्रमाणित प्रश्न बैंक से जारी रखें।'
            : 'Network error connecting to the quiz engine. Switch to verified board question bank.'
        );
        setIsGenerating(false);
      }
    } else {
      // Curated verified bank
      const questions = getCuratedQuestions(
        config.subject,
        config.chapter === 'all' ? undefined : config.chapter,
        config.questionCount,
        config.difficulty
      );
      setActiveQuestions(questions);
      setIsGenerating(false);
    }
  };

  const handleFallbackToCurated = () => {
    if (!activeConfig) return;
    const questions = getCuratedQuestions(
      activeConfig.subject,
      activeConfig.chapter === 'all' ? undefined : activeConfig.chapter,
      activeConfig.questionCount,
      activeConfig.difficulty
    );
    setActiveQuestions(questions);
    setGenerationError(null);
  };

  const handleSubmitQuiz = (
    answers: Record<string, string>,
    flagged: Record<string, boolean>,
    timeSpentSeconds: number
  ) => {
    if (!activeConfig || activeQuestions.length === 0) return;

    let score = 0;
    const topicBreakdown: Record<string, { total: number; correct: number; percentage: number }> = {};

    activeQuestions.forEach((q) => {
      const isCorrect = answers[q.id] === q.correctAnswer;
      if (isCorrect) score += 1;

      const topicName = q.topic || 'Core Concept';
      if (!topicBreakdown[topicName]) {
        topicBreakdown[topicName] = { total: 0, correct: 0, percentage: 0 };
      }
      topicBreakdown[topicName].total += 1;
      if (isCorrect) {
        topicBreakdown[topicName].correct += 1;
      }
    });

    Object.keys(topicBreakdown).forEach((tName) => {
      const stat = topicBreakdown[tName];
      stat.percentage = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
    });

    const weakTopics = Object.keys(topicBreakdown).filter((tName) => topicBreakdown[tName].percentage < 75);
    const accuracy = Math.round((score / activeQuestions.length) * 100);

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizConfig: activeConfig,
      questions: activeQuestions,
      userAnswers: answers,
      flaggedQuestions: flagged,
      timeSpentSeconds,
      completedAt: new Date().toISOString(),
      score,
      totalQuestions: activeQuestions.length,
      accuracy,
      topicBreakdown,
      weakTopics,
    };

    saveAttempt(attempt);

    // Auto-save incorrect questions to Smart Revision System
    activeQuestions.forEach((q) => {
      const userAns = answers[q.id];
      if (userAns && userAns !== q.correctAnswer) {
        saveToRevision(q, 'incorrect_answer', {
          wrongAnswer: userAns,
          mistakeCategory: classifyMistake(q, userAns),
        });
      }
    });

    setCurrentAttempt(attempt);
    setActiveQuestions([]);
  };

  const handleResetToConfig = () => {
    setActiveQuestions([]);
    setCurrentAttempt(null);
    setSearchParams({});
  };

  // 1. If currently in Results mode
  if (currentAttempt) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <ResultsDashboard
          attempt={currentAttempt}
          onRetryQuiz={() => {
            setCurrentAttempt(null);
            handleStartGeneration();
          }}
          onPracticeWeakTopics={(wts) => {
            setCurrentAttempt(null);
            setChapter('all');
            handleStartGeneration();
          }}
          onOpenMistakeDetective={(q, ans) => setMistakeModalData({ question: q, selectedAnswer: ans })}
          onOpenRevision={() => navigate('/revision')}
          onHome={handleResetToConfig}
        />

        {mistakeModalData && (
          <MistakeDetectiveModal
            onClose={() => setMistakeModalData(null)}
            question={mistakeModalData.question}
            selectedAnswer={mistakeModalData.selectedAnswer}
            onPracticeTopic={(topic, chap, subj) => {
              setMistakeModalData(null);
              setSubject(subj as SubjectId);
              setChapter(chap);
              handleStartGeneration();
            }}
          />
        )}
      </div>
    );
  }

  // 2. If currently in Active Quiz mode
  if (activeQuestions.length > 0 && activeConfig) {
    return (
      <div className="animate-fadeIn">
        <QuizInterface
          questions={activeQuestions}
          config={activeConfig}
          onSubmitQuiz={handleSubmitQuiz}
          onExit={handleResetToConfig}
          onOpenMistakeDetective={(q, ans) => setMistakeModalData({ question: q, selectedAnswer: ans })}
        />

        {mistakeModalData && (
          <MistakeDetectiveModal
            onClose={() => setMistakeModalData(null)}
            question={mistakeModalData.question}
            selectedAnswer={mistakeModalData.selectedAnswer}
            onPracticeTopic={(topic, chap, subj) => {
              setMistakeModalData(null);
              setSubject(subj as SubjectId);
              setChapter(chap);
              handleStartGeneration();
            }}
          />
        )}
      </div>
    );
  }

  // 3. Setup / Config Workspace
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Page Heading */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {language === 'hi' ? 'AI बोर्ड क्विज़ जनरेटर' : 'AI Board Quiz Generator'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {language === 'hi'
            ? 'कक्षा 12 बोर्ड परीक्षा (2026–27) के अनुसार अध्याय, कठिनाई और प्रश्न प्रारूप चुनें।'
            : 'Configure and generate curriculum-verified CBSE Class 12 Section A MCQs with step-by-step NCERT explanations.'}
        </p>
      </div>

      {/* Error alert if generation failed */}
      {generationError && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3">
          <div className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p>{generationError}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFallbackToCurated}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'सत्यापित NCERT बैंक से हल करें' : 'Continue with Verified NCERT Bank'}
            </button>
            <button
              onClick={() => setGenerationError(null)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:underline cursor-pointer"
            >
              {language === 'hi' ? 'रद्द करें' : 'Dismiss'}
            </button>
          </div>
        </div>
      )}

      {/* Main Configuration Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-8 shadow-xs">
        {/* Step 1: Subject Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {language === 'hi' ? '1. विषय चुनें' : '1. Select Subject'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CBSE_CLASS_12_SUBJECTS.map((sub) => {
              const isSelected = subject === sub.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => {
                    setSubject(sub.id);
                    setChapter('all');
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-600/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
                      CODE {sub.code}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {translateSubject(sub.id)}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {sub.chapters.length} NCERT chapters
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Chapter Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {language === 'hi' ? '2. अध्याय चुनें' : '2. Select Chapter'}
          </label>
          <select
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">
              {language === 'hi' ? '🌟 सभी अध्याय (संपूर्ण पाठ्यक्रम मॉक)' : '🌟 All Chapters (Full Syllabus Mix)'}
            </option>
            {availableChapters.map((ch) => (
              <option key={ch.id} value={ch.name}>
                {translateChapter(ch.name)}
              </option>
            ))}
          </select>
        </div>

        {/* Step 3: Difficulty & Question Count (2 cols) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'hi' ? '3. कठिनाई स्तर' : '3. Target Difficulty'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['easy', 'medium', 'hard', 'mixed'] as DifficultyLevel[]).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer text-center ${
                    difficulty === diff
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'hi' ? '4. प्रश्नों की संख्या' : '4. Question Count'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center font-mono tabular-nums ${
                    questionCount === num
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {num} Qs
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 4: Question Type Format */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {language === 'hi' ? '5. प्रश्न प्रारूप (CBSE Format)' : '5. Question Format'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'mcq', label: 'Standard MCQ' },
              { id: 'numerical', label: 'Numerical / Calc' },
              { id: 'conceptual', label: 'Conceptual' },
              { id: 'assertion_reason', label: 'Assertion-Reason' },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setQuestionType(type.id as QuestionType)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                  questionType === type.id
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 5: Generation Engine (Curated vs Gemini AI) */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'AI जनरेटर सक्षम करें (Gemini)' : 'Enable AI Generation (Gemini 2026–27)'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {useAi
                ? 'Dynamic fresh questions generated via Google Gemini'
                : 'Offline verified CBSE NCERT question bank'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setUseAi(!useAi)}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              useAi ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                useAi ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleStartGeneration}
            className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 disabled:opacity-50 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RotateCcw className="w-5 h-5 animate-spin" />
                <span>{language === 'hi' ? 'क्विज़ तैयार हो रही है...' : 'Generating Board Quiz...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>{language === 'hi' ? 'बोर्ड क्विज़ प्रारंभ करें' : 'Generate & Start Board Quiz'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
