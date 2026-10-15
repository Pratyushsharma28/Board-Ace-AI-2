import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useClass } from '../context/ClassContext';
import { SubjectId } from '../types/quiz';
import {
  PYQuestion,
  PYQType,
  VERIFIED_CBSE_PYQS,
  getFilteredPYQs,
  getAvailablePYQYears,
} from '../data/pyqData';
import {
  getPYQStats,
  savePYQAttempt,
  togglePYQBookmark,
  isPYQBookmarked,
  PYQPerformanceStats,
} from '../utils/pyqStorage';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  Bookmark,
  Clock,
  Filter,
  Layers,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Check,
  BarChart3,
  FileText,
  AlertCircle,
  Shuffle,
} from 'lucide-react';

export const PyqHubPage: React.FC = () => {
  const { language, t, translateSubject, translateChapter } = useLanguage();
  const { grade, setGrade, gradeLabel, subjects } = useClass();

  // Mode: 'chapter' | 'year' | 'mixed' | 'timed'
  const [practiceMode, setPracticeMode] = useState<'chapter' | 'year' | 'mixed' | 'timed'>('chapter');

  // Filters
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(subjects[0]?.id || 'mathematics');
  const [selectedChapters, setSelectedChapters] = useState<string[]>(['all']);
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<PYQType | 'all'>('all');

  // Active question index in practice flow
  const [currentIndex, setCurrentIndex] = useState(0);

  // Student interaction state for current question
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Timed mode state
  const [timeRemaining, setTimeRemaining] = useState<number>(15 * 60); // 15 mins
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Stats state
  const [stats, setStats] = useState<PYQPerformanceStats>(() => getPYQStats(grade));

  // Sync subject when grade changes
  useEffect(() => {
    if (subjects.length > 0 && !subjects.some((s) => s.id === selectedSubject)) {
      setSelectedSubject(subjects[0].id);
    }
    setStats(getPYQStats(grade));
    setSelectedChapters(['all']);
    setSelectedYear('all');
    setCurrentIndex(0);
    resetInteraction();
  }, [grade, subjects]);

  // Available chapters for selected subject
  const availableChapters = useMemo(() => {
    const currentSubj = subjects.find((s) => s.id === selectedSubject);
    return currentSubj ? currentSubj.chapters : [];
  }, [subjects, selectedSubject]);

  // Available years for current grade & subject
  const availableYears = useMemo(() => {
    return getAvailablePYQYears(grade, selectedSubject);
  }, [grade, selectedSubject]);

  // Filtered Question List
  const questionPool = useMemo(() => {
    let pool = getFilteredPYQs({
      classLevel: grade,
      subject: selectedSubject,
      chapters: selectedChapters.includes('all') ? undefined : selectedChapters,
      year: selectedYear === 'all' ? undefined : selectedYear,
      questionType: selectedType,
    });

    if (practiceMode === 'mixed') {
      // Deterministic shuffle for variety
      pool = [...pool].sort((a, b) => a.id.localeCompare(b.id));
    }

    return pool;
  }, [grade, selectedSubject, selectedChapters, selectedYear, selectedType, practiceMode]);

  const currentQuestion: PYQuestion | undefined = questionPool[currentIndex];

  const resetInteraction = () => {
    setSelectedOption(null);
    setWrittenAnswer('');
    setIsSubmitted(false);
    setShowExplanation(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Timed Practice countdown
  useEffect(() => {
    let interval: any = null;
    if (practiceMode === 'timed' && isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerActive(false);
            showToast(language === 'hi' ? 'समय समाप्त!' : 'Time up for timed practice!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [practiceMode, isTimerActive, timeRemaining]);

  const handleStartTimer = () => {
    setTimeRemaining(15 * 60);
    setIsTimerActive(true);
    showToast(language === 'hi' ? '15 मिनट की समयबद्ध परीक्षा शुरू!' : '15-minute Timed PYQ Practice started!');
  };

  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion) return;

    const isMcq = currentQuestion.questionType === 'MCQ' || currentQuestion.questionType === 'Assertion-Reason';
    let isCorrect = false;

    if (isMcq) {
      if (!selectedOption) {
        showToast(language === 'hi' ? 'कृपया उत्तर विकल्प चुनें।' : 'Please select an option first.');
        return;
      }
      isCorrect = selectedOption.trim() === currentQuestion.correctAnswer.trim();
    } else {
      if (!writtenAnswer.trim()) {
        showToast(language === 'hi' ? 'कृपया अपना उत्तर लिखें या मार्किंग स्कीम देखें।' : 'Please type your answer or view the marking scheme.');
        return;
      }
      isCorrect = true; // Subjective self-check
    }

    setIsSubmitted(true);
    setShowExplanation(true);

    // Save attempt locally
    savePYQAttempt(grade, {
      questionId: currentQuestion.id,
      selectedAnswer: isMcq ? (selectedOption || '') : writtenAnswer,
      isCorrect,
      timestamp: new Date().toISOString(),
      year: currentQuestion.year,
      subject: currentQuestion.subject,
      chapter: currentQuestion.chapter,
      marks: currentQuestion.marks,
    });

    setStats(getPYQStats(grade));
  };

  const handleNextQuestion = () => {
    if (currentIndex < questionPool.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetInteraction();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      resetInteraction();
    }
  };

  const handleBookmarkToggle = () => {
    if (!currentQuestion) return;
    const isNow = togglePYQBookmark(grade, currentQuestion.id);
    setStats(getPYQStats(grade));
    showToast(
      isNow
        ? (language === 'hi' ? 'प्रश्न बुकमार्क में जोड़ा गया!' : 'Question saved to bookmarks!')
        : (language === 'hi' ? 'बुकमार्क से हटाया गया।' : 'Question removed from bookmarks.')
    );
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 animate-fadeIn">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 animate-slideUp">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-emerald-600 via-teal-700 to-indigo-900 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-emerald-100 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>{language === 'hi' ? '100% आधिकारिक सीबीएसई प्रश्न संग्रह' : '100% Authentic CBSE Board Paper PYQs'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              {language === 'hi' ? 'सीबीएसई पिछले वर्षों के प्रश्न (PYQ Hub)' : 'CBSE Previous Year Questions'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {language === 'hi'
                ? `सीबीएसई कक्षा ${grade} बोर्ड परीक्षा (2020-2024) के वास्तविक प्रश्न, आधिकारिक मार्किंग स्कीम और स्टेप-वाइज उत्तर समाधान।`
                : `Practise authentic, verified CBSE Class ${grade} Board Examination questions with official marking schemes and step-by-step solutions.`}
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[100px]">
              <div className="text-2xl font-black">{stats.totalAttempted}</div>
              <div className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider mt-0.5">
                {language === 'hi' ? 'हल किए' : 'Attempted'}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[100px]">
              <div className="text-2xl font-black">{stats.accuracy}%</div>
              <div className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider mt-0.5">
                {language === 'hi' ? 'सटीकता' : 'Accuracy'}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[100px]">
              <div className="text-2xl font-black">{stats.chaptersPractised.length}</div>
              <div className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider mt-0.5">
                {language === 'hi' ? 'अध्याय' : 'Chapters'}
              </div>
            </div>
          </div>
        </div>

        {/* Official Reference Links Strip */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center gap-4 text-[11px] text-emerald-100/90 font-medium">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            {language === 'hi' ? 'आधिकारिक स्रोत:' : 'Official CBSE Sources:'}
          </span>
          <a
            href="https://cbseacademic.nic.in/sqp_archive.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white underline underline-offset-2 flex items-center gap-1 transition-colors"
          >
            CBSE Sample Papers & Marking Schemes <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-white/40">•</span>
          <a
            href="https://www.cbse.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white underline underline-offset-2 flex items-center gap-1 transition-colors"
          >
            CBSE Official Portal (cbse.gov.in) <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-white/40">•</span>
          <a
            href="https://ncert.nic.in/textbook.php"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white underline underline-offset-2 flex items-center gap-1 transition-colors"
          >
            NCERT Official Textbooks <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Practice Mode Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => {
            setPracticeMode('chapter');
            setCurrentIndex(0);
            resetInteraction();
          }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            practiceMode === 'chapter'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 dark:text-emerald-100'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'मोड 1' : 'Mode 1'}
            </span>
            <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 font-black text-sm sm:text-base">
            {language === 'hi' ? 'अध्याय-वार अभ्यास' : 'Chapter-wise'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'hi' ? 'विशिष्ट अध्यायों से अभ्यास' : 'Target specific chapters'}
          </div>
        </button>

        <button
          onClick={() => {
            setPracticeMode('year');
            setCurrentIndex(0);
            resetInteraction();
          }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            practiceMode === 'year'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 dark:text-emerald-100'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'मोड 2' : 'Mode 2'}
            </span>
            <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="mt-2 font-black text-sm sm:text-base">
            {language === 'hi' ? 'वर्ष-वार अभ्यास' : 'Year-wise'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'hi' ? '2024, 2023, 2022 बोर्ड पेपर' : '2024, 2023, 2022 sets'}
          </div>
        </button>

        <button
          onClick={() => {
            setPracticeMode('mixed');
            setCurrentIndex(0);
            resetInteraction();
          }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            practiceMode === 'mixed'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 dark:text-emerald-100'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'मोड 3' : 'Mode 3'}
            </span>
            <Shuffle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-2 font-black text-sm sm:text-base">
            {language === 'hi' ? 'मिश्रित PYQ अभ्यास' : 'Mixed PYQ'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'hi' ? 'संपूर्ण पाठ्यक्रम शफल' : 'Shuffled across chapters'}
          </div>
        </button>

        <button
          onClick={() => {
            setPracticeMode('timed');
            setCurrentIndex(0);
            resetInteraction();
          }}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            practiceMode === 'timed'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 dark:text-emerald-100'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'मोड 4' : 'Mode 4'}
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 font-black text-sm sm:text-base">
            {language === 'hi' ? 'समयबद्ध अभ्यास' : 'Timed PYQ'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            {language === 'hi' ? 'उल्टी गिनती टाइमर के साथ' : '15-min exam countdown'}
          </div>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>{language === 'hi' ? 'PYQ फ़िल्टर एवं चयन' : 'PYQ Filters & Configuration'}</span>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {questionPool.length} {language === 'hi' ? 'सत्यापित प्रश्न उपलब्ध' : 'Verified Questions Found'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Subject Selector */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'hi' ? 'विषय चुनें' : 'Subject'}
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value as SubjectId);
                setSelectedChapters(['all']);
                setCurrentIndex(0);
                resetInteraction();
              }}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {translateSubject(s.id)} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {/* Chapter Selector */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'hi' ? 'अध्याय' : 'Chapter'}
            </label>
            <select
              value={selectedChapters[0] || 'all'}
              onChange={(e) => {
                setSelectedChapters([e.target.value]);
                setCurrentIndex(0);
                resetInteraction();
              }}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">{language === 'hi' ? 'सभी अध्याय (संपूर्ण पाठ्यक्रम)' : 'All Chapters'}</option>
              {availableChapters.map((ch) => (
                <option key={ch.id} value={ch.name}>
                  {translateChapter(ch.name)}
                </option>
              ))}
            </select>
          </div>

          {/* Examination Year Selector */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'hi' ? 'परीक्षा वर्ष' : 'Examination Year'}
            </label>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10));
                setCurrentIndex(0);
                resetInteraction();
              }}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">{language === 'hi' ? 'सभी उपलब्ध वर्ष (2020-2024)' : 'All Available Years'}</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  CBSE {yr} Board Paper
                </option>
              ))}
            </select>
          </div>

          {/* Question Type Filter */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {language === 'hi' ? 'प्रश्न प्रारूप' : 'Question Type'}
            </label>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value as PYQType | 'all');
                setCurrentIndex(0);
                resetInteraction();
              }}
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">{language === 'hi' ? 'सभी प्रारूप' : 'All Question Types'}</option>
              <option value="MCQ">Multiple Choice (MCQ)</option>
              <option value="Assertion-Reason">Assertion-Reason</option>
              <option value="Short Answer">Short Answer (2-3 Marks)</option>
              <option value="Case-Based">Case-Based</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Practice Area */}
      {questionPool.length === 0 ? (
        /* Empty State with Official Resources (Strict compliance: never invent fake PYQs) */
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {language === 'hi' ? 'इस फ़िल्टर के लिए कोई सत्यापित प्रश्न नहीं मिला' : 'No Verified PYQs for this Filter'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'शैक्षणिक अखंडता बनाए रखने के लिए, BoardAce AI कभी भी फर्जी या मनगढ़ंत पिछले वर्षों के प्रश्न प्रदर्शित नहीं करता है। आप आधिकारिक सीबीएसई पोर्टल से संपूर्ण प्रश्न पत्र डाउनलोड कर सकते हैं।'
                : 'To maintain strict academic integrity, BoardAce AI never hallucinates or fabricates past board questions. You can access the complete official question papers directly from CBSE archives below.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedChapters(['all']);
                setSelectedYear('all');
                setSelectedType('all');
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'फ़िल्टर रीसेट करें' : 'Reset All Filters'}
            </button>
            <a
              href="https://cbseacademic.nic.in/sqp_archive.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <span>{language === 'hi' ? 'सीबीएसई सैंपल एवं पिछले वर्ष पेपर्स' : 'Official CBSE Paper Archive'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : currentQuestion ? (
        <div className="space-y-4">
          {/* Practice Header & Timer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>
                {language === 'hi' ? 'प्रश्न' : 'Question'} {currentIndex + 1} / {questionPool.length}
              </span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400">{translateSubject(currentQuestion.subject)}</span>
              <span>•</span>
              <span className="truncate max-w-[200px]">{translateChapter(currentQuestion.chapter)}</span>
            </div>

            <div className="flex items-center gap-2">
              {practiceMode === 'timed' && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>{formatTimer(timeRemaining)}</span>
                  {!isTimerActive && (
                    <button
                      onClick={handleStartTimer}
                      className="ml-1 text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 underline cursor-pointer"
                    >
                      {language === 'hi' ? 'शुरू करें' : 'Start'}
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={handleBookmarkToggle}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isPYQBookmarked(grade, currentQuestion.id)
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isPYQBookmarked(grade, currentQuestion.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span className="hidden sm:inline">
                  {isPYQBookmarked(grade, currentQuestion.id)
                    ? (language === 'hi' ? 'बुकमार्क किया गया' : 'Bookmarked')
                    : (language === 'hi' ? 'बुकमार्क' : 'Bookmark')}
                </span>
              </button>
            </div>
          </div>

          {/* Question Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>CBSE {currentQuestion.year}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                  {currentQuestion.questionType}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                  {currentQuestion.marks} {currentQuestion.marks === 1 ? 'Mark' : 'Marks'}
                </span>
              </div>

              {currentQuestion.seriesOrCode && (
                <span className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400">
                  {currentQuestion.seriesOrCode}
                </span>
              )}
            </div>

            {/* Case Passage if present */}
            {currentQuestion.casePassage && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-sans">
                  {language === 'hi' ? 'केस संदर्भ / अनुच्छेद:' : 'Case Passage / Context:'}
                </div>
                {currentQuestion.casePassage}
              </div>
            )}

            {/* Question Text */}
            <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
              {currentQuestion.question}
            </div>

            {/* MCQ Options */}
            {currentQuestion.options && currentQuestion.options.length > 0 ? (
              <div className="space-y-3 pt-2">
                {currentQuestion.options.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = selectedOption === option;
                  const isCorrect = option.trim() === currentQuestion.correctAnswer.trim();

                  let btnStyle =
                    'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200';

                  if (isSubmitted) {
                    if (isCorrect) {
                      btnStyle =
                        'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20';
                    } else if (isSelected && !isCorrect) {
                      btnStyle =
                        'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/20';
                    } else {
                      btnStyle = 'opacity-60 border-slate-200 dark:border-slate-800';
                    }
                  } else if (isSelected) {
                    btnStyle =
                      'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-white ring-2 ring-emerald-600/30 font-bold';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isSubmitted}
                      onClick={() => handleOptionSelect(option)}
                      className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                          isSubmitted && isCorrect
                            ? 'bg-emerald-600 text-white'
                            : isSubmitted && isSelected && !isCorrect
                            ? 'bg-rose-600 text-white'
                            : isSelected
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {letter}
                      </span>
                      <span className="flex-1 leading-relaxed">{option}</span>
                      {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
                      {isSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Subjective Written Answer Section */
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {language === 'hi' ? 'अपना लिखित उत्तर यहाँ टाइप करें:' : 'Type your written answer:'}
                </label>
                <textarea
                  rows={4}
                  value={writtenAnswer}
                  onChange={(e) => setWrittenAnswer(e.target.value)}
                  disabled={isSubmitted}
                  placeholder={
                    language === 'hi'
                      ? 'यहाँ अपने मुख्य बिंदु, सूत्र या व्याख्या लिखें...'
                      : 'Write your key points, formulas, or steps here...'
                  }
                  className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentIndex === 0}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'पिछला' : 'Previous'}</span>
                </button>
                <button
                  onClick={handleNextQuestion}
                  disabled={currentIndex === questionPool.length - 1}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>{language === 'hi' ? 'अगला' : 'Next'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {!isSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{language === 'hi' ? 'उत्तर जमा करें' : 'Submit Answer'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="px-4 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    <span>
                      {showExplanation
                        ? (language === 'hi' ? 'व्याख्या छिपाएं' : 'Hide Explanation')
                        : (language === 'hi' ? 'मार्किंग स्कीम देखें' : 'View Marking Scheme')}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Explanation & Marking Scheme Box */}
            {isSubmitted && showExplanation && (
              <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'hi' ? 'आधिकारिक सीबीएसई मार्किंग स्कीम व उत्तर' : 'Official CBSE Marking Scheme & Answer'}</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                    Correct: {currentQuestion.correctAnswer}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {currentQuestion.explanation || currentQuestion.correctAnswer}
                </div>

                {currentQuestion.sourceUrl && (
                  <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                    <span>
                      {language === 'hi' ? 'सत्यापित स्रोत:' : 'Verified Source:'} {currentQuestion.seriesOrCode || 'CBSE Board Examination'}
                    </span>
                    <a
                      href={currentQuestion.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline flex items-center gap-1 hover:text-emerald-900 dark:hover:text-emerald-200"
                    >
                      <span>{language === 'hi' ? 'सीबीएसई आर्काइव' : 'CBSE Archive'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Footer attribution */}
      <div className="text-center pt-8 text-xs text-slate-400 dark:text-slate-500">
        Made with ❤️ by Pratyush Sharma · BoardAce AI 2026–27
      </div>
    </div>
  );
};
