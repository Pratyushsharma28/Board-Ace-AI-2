import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { SubjectId, DifficultyLevel, Question, QuizConfig, QuizAttempt } from '../types/quiz';
import { QuizInterface } from '../components/QuizInterface';
import { ResultsDashboard } from '../components/ResultsDashboard';
import { saveAttempt } from '../utils/storage';
import { saveToRevision } from '../utils/revisionEngine';
import { classifyMistake } from '../utils/mistakeDetective';
import {
  FileUp,
  FileText,
  AlertCircle,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Layers,
  X,
  UploadCloud,
} from 'lucide-react';

export const PdfToQuizPage: React.FC = () => {
  const { language, t, translateSubject } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [subject, setSubject] = useState<SubjectId>('physics');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Status states
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active quiz & results states
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [activeConfig, setActiveConfig] = useState<QuizConfig | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processSelectedFile(file);
  };

  const processSelectedFile = (file: File) => {
    setErrorMessage(null);

    // Validate type
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया केवल .pdf प्रारूप की फाइल अपलोड करें।'
          : 'Please select a valid .pdf file. Other formats are not supported.'
      );
      return;
    }

    // Validate size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage(
        language === 'hi'
          ? 'फाइल का आकार 10MB से कम होना चाहिए।'
          : `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 10MB limit.`
      );
      return;
    }

    setSelectedFile(file);

    // Read base64
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileBase64(result);
    };
    reader.onerror = () => {
      setErrorMessage(
        language === 'hi'
          ? 'फाइल पढ़ने में त्रुटि हुई। कृपया पुनः प्रयास करें।'
          : 'Failed to read file from browser. Please try again.'
      );
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!fileBase64 || !selectedFile) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया पहले एक अध्ययन पीडीएफ अपलोड करें।'
          : 'Please upload a study PDF first.'
      );
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/pdf-to-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64: fileBase64,
          filename: selectedFile.name,
          subject,
          difficulty,
          questionCount,
          language,
        }),
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        setGeneratedQuestions(data.questions);
        const config: QuizConfig = {
          board: 'CBSE',
          grade: '12',
          subject,
          chapter: selectedFile.name.replace(/\.pdf$/i, ''),
          difficulty,
          questionCount: data.questions.length,
          questionType: 'mcq',
          mode: 'practice',
          useAi: true,
        };
        setActiveConfig(config);
      } else {
        setErrorMessage(
          data.error ||
            (language === 'hi'
              ? 'पीडीएफ से प्रश्न उत्पन्न नहीं किए जा सके। कृपया सुनिश्चित करें कि यह एक स्पष्ट पाठ्य सामग्री है।'
              : 'Could not extract readable text from this PDF. If it is an image-only scan, please ensure text is legible or try a text-based notes PDF.')
        );
      }
    } catch (err: any) {
      console.error('PDF to Quiz request error:', err);
      setErrorMessage(
        language === 'hi'
          ? 'सर्वर से जुड़ने में त्रुटि। कृपया पुनः प्रयास करें।'
          : 'Network error connecting to the quiz engine. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitQuiz = (
    answers: Record<string, string>,
    flagged: Record<string, boolean>,
    timeSpentSeconds: number
  ) => {
    if (!activeConfig || generatedQuestions.length === 0) return;

    let score = 0;
    const topicBreakdown: Record<string, { total: number; correct: number; percentage: number }> = {};

    generatedQuestions.forEach((q) => {
      const isCorrect = answers[q.id] === q.correctAnswer;
      if (isCorrect) score += 1;

      const topicName = q.topic || 'PDF Content Concept';
      if (!topicBreakdown[topicName]) {
        topicBreakdown[topicName] = { total: 0, correct: 0, percentage: 0 };
      }
      topicBreakdown[topicName].total += 1;
      if (isCorrect) topicBreakdown[topicName].correct += 1;
    });

    Object.keys(topicBreakdown).forEach((tName) => {
      const stat = topicBreakdown[tName];
      stat.percentage = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
    });

    const weakTopics = Object.keys(topicBreakdown).filter((tName) => topicBreakdown[tName].percentage < 75);
    const accuracy = Math.round((score / generatedQuestions.length) * 100);

    const attempt: QuizAttempt = {
      id: `pdf-quiz-${Date.now()}`,
      quizConfig: activeConfig,
      questions: generatedQuestions,
      userAnswers: answers,
      flaggedQuestions: flagged,
      timeSpentSeconds,
      completedAt: new Date().toISOString(),
      score,
      totalQuestions: generatedQuestions.length,
      accuracy,
      topicBreakdown,
      weakTopics,
    };

    saveAttempt(attempt);

    // Save incorrect questions to revision
    generatedQuestions.forEach((q) => {
      const userAns = answers[q.id];
      if (userAns && userAns !== q.correctAnswer) {
        saveToRevision(q, 'incorrect_answer', {
          wrongAnswer: userAns,
          mistakeCategory: classifyMistake(q, userAns),
        });
      }
    });

    setCurrentAttempt(attempt);
    setGeneratedQuestions([]);
  };

  const handleReset = () => {
    setGeneratedQuestions([]);
    setActiveConfig(null);
    setCurrentAttempt(null);
    setSelectedFile(null);
    setFileBase64(null);
  };

  // 1. Result screen
  if (currentAttempt) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <ResultsDashboard
          attempt={currentAttempt}
          onRetryQuiz={() => {
            setCurrentAttempt(null);
            handleGenerate();
          }}
          onPracticeWeakTopics={() => navigate('/practice')}
          onOpenMistakeDetective={() => {}}
          onOpenRevision={() => navigate('/revision')}
          onHome={handleReset}
        />
      </div>
    );
  }

  // 2. Active quiz runner
  if (generatedQuestions.length > 0 && activeConfig) {
    return (
      <div className="space-y-4 animate-fadeIn">
        {/* Source citation bar */}
        <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="font-semibold truncate">Source Document: {selectedFile?.name}</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
            {generatedQuestions.length} Questions Grounded
          </span>
        </div>

        <QuizInterface
          questions={generatedQuestions}
          config={activeConfig}
          onSubmitQuiz={handleSubmitQuiz}
          onExit={handleReset}
          onOpenMistakeDetective={() => {}}
        />
      </div>
    );
  }

  // 3. Document Upload & Configuration Screen
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
          <FileUp className="w-4 h-4" />
          <span>CBSE AI STUDY DOCUMENT CONVERTER</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {language === 'hi' ? 'पीडीएफ से क्विज़ जनरेटर' : 'PDF to Quiz Generator'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {language === 'hi'
            ? 'अपने क्लास नोट्स, एनसीईआरटी अध्याय या असाइनमेंट पीडीएफ अपलोड करें और सीधे प्रश्नों में बदलें।'
            : 'Upload your NCERT chapters, teacher notes, or revision PDFs to generate board-standard questions with source section references.'}
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">{errorMessage}</p>
            <p className="text-[11px] text-amber-700 dark:text-amber-300">
              Tip: If you have a scanned handwritten PDF that cannot be read, you can also use our verified CBSE Question Bank or AI Tutor.
            </p>
          </div>
        </div>
      )}

      {/* Main Upload & Config Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-8 shadow-xs">
        {/* Step 1: File Dropzone */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {language === 'hi' ? '1. पीडीएफ फाइल अपलोड करें' : '1. Upload Study PDF (Max 10MB)'}
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {!selectedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) processSelectedFile(file);
              }}
              className="p-8 sm:p-12 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-3xl text-center cursor-pointer transition-all bg-slate-50/60 dark:bg-slate-950/40 hover:bg-indigo-50/20 group space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? 'पीडीएफ फाइल यहाँ छोड़ें या ब्राउज़ करें' : 'Click to upload or drag & drop PDF'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Supports digital NCERT textbooks, lecture notes, or coaching guides (PDF format up to 10MB)
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 truncate">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {selectedFile.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Ready for AI analysis
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setFileBase64(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Subject Discipline */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {language === 'hi' ? '2. विषय अनुशासन' : '2. Subject Discipline'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'physics', label: 'Physics (042)' },
              { id: 'chemistry', label: 'Chemistry (043)' },
              { id: 'mathematics', label: 'Mathematics (041)' },
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSubject(sub.id as SubjectId)}
                className={`p-3.5 rounded-2xl border text-center text-xs font-bold transition-all cursor-pointer ${
                  subject === sub.id
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-600/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Difficulty & Question Count */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'hi' ? '3. कठिनाई स्तर' : '3. Target Difficulty'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['easy', 'medium', 'hard', 'mixed'] as DifficultyLevel[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl capitalize transition-all cursor-pointer ${
                    difficulty === d
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'hi' ? '4. प्रश्नों की संख्या' : '4. Question Count'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setQuestionCount(cnt)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl transition-all cursor-pointer font-mono tabular-nums ${
                    questionCount === cnt
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cnt} Questions
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="button"
            disabled={!selectedFile || isProcessing}
            onClick={handleGenerate}
            className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 disabled:opacity-40 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RotateCcw className="w-5 h-5 animate-spin" />
                <span>Analyzing PDF &amp; Generating Board Questions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Quiz from PDF</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
