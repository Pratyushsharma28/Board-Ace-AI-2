import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { QuizConfigModal } from './components/QuizConfigModal';
import { QuizInterface } from './components/QuizInterface';
import { ResultsDashboard } from './components/ResultsDashboard';
import { AnalyticsView } from './components/AnalyticsView';
import { MistakeDetectiveModal } from './components/MistakeDetectiveModal';
import { AITutorView } from './components/AITutorView';
import { SmartPracticeView } from './components/SmartPracticeView';
import { SmartRevisionView } from './components/SmartRevisionView';
import { Question, QuizConfig, QuizAttempt, SubjectId, AppView, DifficultyLevel } from './types/quiz';
import { getCuratedQuestions } from './data/sampleQuestions';
import { saveAttempt, getActiveExamState, ActiveExamState } from './utils/storage';
import { saveToRevision } from './utils/revisionEngine';
import { classifyMistake } from './utils/mistakeDetective';
import { CheckCircle2 } from 'lucide-react';

function AppContent() {
  const { language, t } = useLanguage();
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [tutorSubject, setTutorSubject] = useState<SubjectId>('physics');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'info' | 'success' | 'warn' } | null>(null);

  const showToast = (text: string, type: 'info' | 'success' | 'warn' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // Check for active interrupted exam on startup
  React.useEffect(() => {
    const saved = getActiveExamState();
    if (saved && saved.questions.length > 0) {
      const msg = language === 'hi'
        ? 'आपकी अधूरी परीक्षा सुरक्षित है। डैशबोर्ड से कभी भी जारी रखें!'
        : 'Your in-progress exam is safely preserved. Resume anytime from the Dashboard!';
      showToast(msg, 'info');
    }
  }, []);

  // Modal states
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [configPrefill, setConfigPrefill] = useState<Partial<QuizConfig>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Active Quiz State
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [activeConfig, setActiveConfig] = useState<QuizConfig | null>(null);
  const [activeInitialState, setActiveInitialState] = useState<{
    currentIndex?: number;
    answers?: Record<string, string>;
    flagged?: Record<string, boolean>;
    secondsRemaining?: number;
    elapsedSeconds?: number;
  } | undefined>(undefined);

  // Active Results State
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);

  // Mistake Detective Modal State
  const [mistakeModalData, setMistakeModalData] = useState<{
    question: Question;
    selectedAnswer: string;
  } | null>(null);

  const handleOpenConfig = (prefill?: Partial<QuizConfig>) => {
    setConfigPrefill(prefill || {});
    setGenerationError(null);
    setIsConfigModalOpen(true);
  };

  const handleStartPractice = () => {
    handleOpenConfig({ mode: 'practice' });
  };

  const handleStartExam = () => {
    handleOpenConfig({ mode: 'exam' });
  };

  const handleStartQuiz = async (config: QuizConfig) => {
    setIsGenerating(true);
    setGenerationError(null);
    setActiveConfig(config);

    if (config.useAi) {
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
          setIsConfigModalOpen(false);
          setIsGenerating(false);
          setCurrentView('quiz');
          return;
        } else {
          // Server returned error (e.g. Gemini key not set or quota issue)
          const errorMsg =
            data.error ||
            (language === 'hi'
              ? 'AI प्रश्न जनरेटर वर्तमान में व्यस्त है। आप प्रमाणित NCERT प्रश्न बैंक से तुरंत अभ्यास कर सकते हैं।'
              : 'AI generation could not complete. You can proceed with our verified board questions bank.');
          setGenerationError(errorMsg);
          setIsGenerating(false);
        }
      } catch (err: any) {
        console.error('Quiz generation network failure:', err);
        setGenerationError(
          language === 'hi'
            ? 'क्विज़ इंजन से जुड़ने में त्रुटि। कृपया पुनः प्रयास करें या प्रमाणित प्रश्न बैंक चुनें।'
            : 'Network error connecting to the quiz engine. Please try again or switch to the curated board question bank.'
        );
        setIsGenerating(false);
      }
    } else {
      // Offline / High-Yield Curated Board Questions Bank
      const questions = getCuratedQuestions(
        config.subject,
        config.chapter === 'all' ? undefined : config.chapter,
        config.questionCount,
        config.difficulty
      );
      setActiveQuestions(questions);
      setIsConfigModalOpen(false);
      setIsGenerating(false);
      setCurrentView('quiz');
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
    setIsConfigModalOpen(false);
    setGenerationError(null);
    setCurrentView('quiz');
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

    // Calculate percentage per topic (Formula: (Correct Answers / Attempted Questions) * 100)
    Object.keys(topicBreakdown).forEach((tName) => {
      const stat = topicBreakdown[tName];
      stat.percentage = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
    });

    // Weak topics are those with < 75% accuracy
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

    // Save to browser localStorage locally
    saveAttempt(attempt);

    // Save questions answered incorrectly to Smart Revision System (spaced repetition)
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
    setCurrentView('results');

    const toastSuccessText =
      language === 'hi'
        ? `क्विज़ पूर्ण! प्राप्तांक: ${score}/${activeQuestions.length} (${accuracy}% सटीकता)`
        : `Quiz completed! Score: ${score}/${activeQuestions.length} (${accuracy}% accuracy)`;
    showToast(toastSuccessText, 'success');
  };

  const handleRetryQuiz = () => {
    if (!currentAttempt) return;
    handleStartQuiz(currentAttempt.quizConfig);
  };

  const handlePracticeWeakTopics = (weakTopics: string[]) => {
    if (!weakTopics || weakTopics.length === 0) return;
    const firstWeak = weakTopics[0];
    handleOpenConfig({
      mode: 'practice',
      chapter: 'all',
      difficulty: 'medium',
      questionCount: 5,
      useAi: true,
    });
    const toastDrillText =
      language === 'hi'
        ? `कमज़ोर टॉपिक "${firstWeak}" पर अभ्यास सत्र सेट किया गया!`
        : `Target drill configured for weak topic: "${firstWeak}"!`;
    showToast(toastDrillText, 'info');
  };

  const handleContinueExam = (savedExam: ActiveExamState) => {
    setActiveConfig(savedExam.config);
    setActiveQuestions(savedExam.questions);
    setActiveInitialState({
      currentIndex: savedExam.currentIndex,
      answers: savedExam.answers,
      flagged: savedExam.flagged,
      secondsRemaining: savedExam.secondsRemaining,
      elapsedSeconds: savedExam.elapsedSeconds,
    });
    setCurrentView('quiz');
    showToast(
      language === 'hi'
        ? 'सक्रिय परीक्षा पुनः शुरू की गई!'
        : 'Resumed your active CBSE board exam session!',
      'info'
    );
  };

  const handlePracticeCustomQuestions = (customQuestions: Question[]) => {
    if (customQuestions.length === 0) return;
    const firstQ = customQuestions[0];
    const subjectId = (
      ['mathematics', 'physics', 'chemistry'].includes(firstQ.subject?.toLowerCase())
        ? firstQ.subject.toLowerCase()
        : 'physics'
    ) as SubjectId;

    const practiceConfig: QuizConfig = {
      board: 'CBSE',
      grade: '12',
      subject: subjectId,
      chapter: 'all',
      difficulty: 'medium',
      questionCount: customQuestions.length,
      questionType: 'mixed',
      mode: 'practice',
      useAi: false,
    };

    setActiveConfig(practiceConfig);
    setActiveQuestions(customQuestions);
    setActiveInitialState(undefined);
    setCurrentView('quiz');
    showToast(
      language === 'hi'
        ? `${customQuestions.length} बुकमार्क प्रश्नों का अभ्यास सत्र शुरू!`
        : `Started practice drill with ${customQuestions.length} saved questions!`,
      'success'
    );
  };

  const handleStartSmartDrill = (
    questions: Question[],
    meta: { subject: SubjectId; chapter: string; difficulty: DifficultyLevel; topic: string }
  ) => {
    if (questions.length === 0) return;

    const drillConfig: QuizConfig = {
      board: 'CBSE',
      grade: '12',
      subject: meta.subject,
      chapter: meta.chapter,
      difficulty: meta.difficulty,
      questionCount: questions.length,
      questionType: 'mixed',
      mode: 'practice',
      useAi: false,
    };

    setActiveConfig(drillConfig);
    setActiveQuestions(questions);
    setActiveInitialState(undefined);
    setCurrentView('quiz');
    showToast(
      language === 'hi'
        ? `स्मार्ट अभ्यास शुरू: ${meta.topic} (${meta.difficulty.toUpperCase()})`
        : `Smart Practice started: ${meta.topic} (${meta.difficulty.toUpperCase()})`,
      'success'
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100 transition-colors duration-150">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold border ${
              toastMessage.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-700'
                : toastMessage.type === 'warn'
                ? 'bg-amber-600 text-white border-amber-700'
                : 'bg-indigo-600 text-white border-indigo-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      {currentView !== 'quiz' && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          onStartPractice={handleStartPractice}
          onStartExam={handleStartExam}
        />
      )}

      {/* View Switcher */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStartQuiz={(prefill) => handleOpenConfig(prefill)}
            onOpenMistakeDetective={(q, ans) => setMistakeModalData({ question: q, selectedAnswer: ans })}
            onNavigateToDashboard={() => setCurrentView('dashboard')}
            onNavigateToTutor={() => setCurrentView('tutor')}
          />
        )}

        {currentView === 'dashboard' && (
          <StudentDashboard
            onStartQuiz={(prefill) => {
              setActiveInitialState(undefined);
              handleOpenConfig(prefill);
            }}
            onPracticeWeakTopics={handlePracticeWeakTopics}
            onReviewAttempt={(att) => {
              setCurrentAttempt(att);
              setCurrentView('results');
            }}
            onOpenMistakeDetective={(q, ans) => setMistakeModalData({ question: q, selectedAnswer: ans })}
            onContinueExam={handleContinueExam}
            onPracticeSavedQuestions={handlePracticeCustomQuestions}
            onOpenTutor={(subj) => {
              if (subj) setTutorSubject(subj);
              setCurrentView('tutor');
            }}
            onOpenSmartPractice={() => setCurrentView('smart-practice')}
            onOpenRevision={() => setCurrentView('revision')}
          />
        )}

        {currentView === 'quiz' && activeConfig && (
          <QuizInterface
            questions={activeQuestions}
            config={activeConfig}
            onSubmitQuiz={handleSubmitQuiz}
            onExit={() => {
              setActiveInitialState(undefined);
              setCurrentView('landing');
            }}
            onOpenMistakeDetective={(q, ans) => setMistakeModalData({ question: q, selectedAnswer: ans })}
            initialState={activeInitialState}
          />
        )}

        {currentView === 'results' && currentAttempt && (
          <ResultsDashboard
            attempt={currentAttempt}
            onRetryQuiz={handleRetryQuiz}
            onPracticeWeakTopics={handlePracticeWeakTopics}
            onOpenMistakeDetective={(q, ans) => setMistakeModalData({ question: q, selectedAnswer: ans })}
            onOpenRevision={() => setCurrentView('revision')}
            onHome={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView
            onStartQuiz={() => handleOpenConfig()}
            onPracticeWeakTopics={handlePracticeWeakTopics}
            onReviewAttempt={(att) => {
              setCurrentAttempt(att);
              setCurrentView('results');
            }}
          />
        )}

        {currentView === 'tutor' && (
          <AITutorView
            initialSubject={tutorSubject}
            onNavigateHome={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'smart-practice' && (
          <SmartPracticeView
            onStartDrill={handleStartSmartDrill}
            onNavigateHome={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'revision' && (
          <SmartRevisionView
            onPracticeQuestions={handlePracticeCustomQuestions}
            onNavigateHome={() => setCurrentView('landing')}
            onStartQuiz={() => handleOpenConfig()}
          />
        )}
      </main>

      {/* Quiz Configuration Modal */}
      <QuizConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false);
          setGenerationError(null);
        }}
        onStartQuiz={handleStartQuiz}
        initialConfig={configPrefill}
        isGenerating={isGenerating}
        generationError={generationError}
        onFallbackToCurated={handleFallbackToCurated}
      />

      {/* Mistake Detective Forensic Modal */}
      {mistakeModalData && (
        <MistakeDetectiveModal
          question={mistakeModalData.question}
          selectedAnswer={mistakeModalData.selectedAnswer}
          onClose={() => setMistakeModalData(null)}
          onPracticeTopic={(topic, chapter, subject) => {
            setMistakeModalData(null);
            handleOpenConfig({
              subject: subject as SubjectId,
              chapter,
              difficulty: 'medium',
              questionCount: 5,
              mode: 'practice',
              useAi: true,
            });
          }}
        />
      )}

      {/* Professional EdTech Footer */}
      {currentView !== 'quiz' && (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm">BoardAce AI</span>
              <span aria-hidden="true">·</span>
              <span className="dark:text-slate-300">{t.hero.titleLine1} {t.hero.titleGradient}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {t.landing.madeBy}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-slate-400 dark:text-slate-500">
              <span>{t.hero.kicker}</span>
              <span aria-hidden="true">·</span>
              <span>{language === 'hi' ? 'गणित (041) · भौतिक विज्ञान (042) · रसायन विज्ञान (043)' : 'Mathematics (041) · Physics (042) · Chemistry (043)'}</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
