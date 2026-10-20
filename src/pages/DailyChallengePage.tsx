import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useClass } from '../context/ClassContext';
import { Question, SubjectId } from '../types/quiz';
import { CURATED_BOARD_QUESTIONS, getCuratedQuestions } from '../data/sampleQuestions';
import { saveBookmark, isBookmarked } from '../utils/storage';
import { saveToRevision } from '../utils/revisionEngine';
import {
  Flame,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Bookmark,
  Share2,
  Trophy,
  Award,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

const DAILY_STORAGE_KEY = 'boardace_daily_challenge_history_v1';
const STREAK_KEY = 'boardace_daily_streak_v1';

interface DailyCompletionRecord {
  date: string; // YYYY-MM-DD
  score: number;
  total: number;
  timeSpentSeconds: number;
  completedAt: string;
  academicTarget?: string;
}

export const DailyChallengePage: React.FC = () => {
  const { language, t, translateSubject } = useLanguage();
  const { grade, stream, isClass12 } = useClass();

  const currentAcademicKey = `${grade}_${grade === '12' ? stream : 'general'}`;

  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  // History and Streak state
  const [history, setHistory] = useState<DailyCompletionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(DAILY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const streak = useMemo(() => {
    try {
      const saved = localStorage.getItem(STREAK_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.count || 0;
      }
    } catch {}
    return history.length > 0 ? 1 : 0;
  }, [history]);

  // Check if today was already completed for the active class/stream
  const todayRecord = useMemo(() => {
    return history.find(
      (h) => h.date === todayStr && (h.academicTarget === currentAcademicKey || (!h.academicTarget && grade === '12' && stream === 'science'))
    );
  }, [history, todayStr, currentAcademicKey, grade, stream]);

  // Generate today's 5 questions deterministically using date seed strictly within active academic context
  const dailyQuestions = useMemo<Question[]>(() => {
    let pool = CURATED_BOARD_QUESTIONS.filter((q) => {
      const qGrade = q.grade || '12';
      if (grade === '10') {
        return qGrade === '10';
      }
      if (qGrade !== '12') return false;
      const sub = (q.subject || '').toLowerCase();
      if (stream === 'commerce') {
        return ['accountancy', 'business_studies', 'economics', 'english_core', 'english'].includes(sub);
      }
      return ['mathematics', 'physics', 'chemistry'].includes(sub);
    });

    if (!pool || pool.length === 0) {
      return getCuratedQuestions(undefined, undefined, 5, 'medium', grade, stream);
    }

    // Deterministic hash from date string and academic selection
    const seedStr = `${todayStr}_${currentAcademicKey}`;
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);

    // Group questions by subject to ensure balanced representation across the active stream
    const subjectList = Array.from(new Set(pool.map((q) => q.subject)));
    const selected: Question[] = [];

    // 1. Round-robin pick from each available subject first
    subjectList.forEach((sub, sIdx) => {
      const subPool = pool.filter((q) => q.subject === sub);
      if (subPool.length > 0) {
        const picked = subPool[(seed + sIdx) % subPool.length];
        if (!selected.some((x) => x.id === picked.id)) {
          selected.push(picked);
        }
      }
    });

    // 2. Fill remaining slots up to 5 questions deterministically
    let attempt = 0;
    while (selected.length < 5 && selected.length < pool.length && attempt < 50) {
      const fallbackQ = pool[(seed + selected.length + attempt) % pool.length];
      if (!selected.some((x) => x.id === fallbackQ.id)) {
        selected.push(fallbackQ);
      }
      attempt++;
    }

    // 3. If still fewer than 5, pull fresh curated questions for this grade and stream
    if (selected.length < 5) {
      const extra = getCuratedQuestions(undefined, undefined, 5 - selected.length, 'medium', grade, stream);
      extra.forEach((eq) => {
        if (!selected.some((x) => x.id === eq.id) && selected.length < 5) {
          selected.push(eq);
        }
      });
    }

    return selected.slice(0, 5);
  }, [todayStr, grade, stream, currentAcademicKey]);

  // Quiz running states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(() => !!todayRecord);
  const [timeSpent, setTimeSpent] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  // Reset quiz runners when switching academic selection
  useEffect(() => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsCompleted(!!todayRecord);
    setTimeSpent(0);
  }, [currentAcademicKey, todayRecord]);

  // Timer
  useEffect(() => {
    if (isCompleted || !!todayRecord) return;
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted, todayRecord]);

  const currentQ = dailyQuestions[currentQuestionIndex];

  const handleSelectAnswer = (option: string) => {
    if (isCompleted || !!todayRecord) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: option,
    }));
  };

  const handleSubmitChallenge = () => {
    // Calculate score
    let score = 0;
    dailyQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score++;
      } else {
        // Save to revision automatically
        saveToRevision(q, 'incorrect_answer', {
          wrongAnswer: selectedAnswers[idx] || '',
        });
      }
    });

    const newRecord: DailyCompletionRecord = {
      date: todayStr,
      score,
      total: dailyQuestions.length,
      timeSpentSeconds: timeSpent,
      completedAt: new Date().toISOString(),
      academicTarget: currentAcademicKey,
    };

    const updated = [
      newRecord,
      ...history.filter((h) => !(h.date === todayStr && (h.academicTarget === currentAcademicKey || (!h.academicTarget && grade === '12' && stream === 'science')))),
    ];
    setHistory(updated);
    try {
      localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(updated));

      // Update streak
      const newStreak = streak + 1;
      localStorage.setItem(
        STREAK_KEY,
        JSON.stringify({ count: newStreak, lastDate: todayStr })
      );
    } catch {}

    setIsCompleted(true);
  };

  const handleToggleBookmark = (q: Question) => {
    const isCurrently = bookmarkedIds[q.id] || isBookmarked(q.id);
    saveBookmark(q);
    setBookmarkedIds((prev) => ({
      ...prev,
      [q.id]: !isCurrently,
    }));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const activeScore = useMemo(() => {
    if (todayRecord) return todayRecord.score;
    let s = 0;
    dailyQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) s++;
    });
    return s;
  }, [todayRecord, dailyQuestions, selectedAnswers]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>DAILY CBSE SHARPENER · 5 HIGH-YIELD QUESTIONS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'दैनिक अभ्यास चुनौती' : 'Daily Practice Challenge'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {language === 'hi'
              ? `प्रतिदिन केवल 5 मिनट में अपनी सीबीएसई कक्षा ${grade} ${isClass12 ? (stream === 'commerce' ? 'कॉमर्स' : 'साइंस') : ''} बोर्ड परीक्षा तैयारी का मूल्यांकन करें। किसी लॉगिन की आवश्यकता नहीं।`
              : `Every single day, 5 fresh curated CBSE Class ${grade} ${isClass12 ? (stream === 'commerce' ? 'Commerce' : 'Science') : ''} board questions to test retention and maintain exam velocity.`}
          </p>
        </div>

        {/* Streak Badge */}
        <div className="flex items-center gap-3 p-3 px-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              {language === 'hi' ? 'दैनिक स्ट्रीक' : 'Active Streak'}
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white leading-tight">
              {streak} {language === 'hi' ? 'दिन' : streak === 1 ? 'Day' : 'Days'}
            </div>
          </div>
        </div>
      </div>

      {/* When challenge is completed for today: Review & Score screen */}
      {(isCompleted || todayRecord) ? (
        <div className="space-y-6">
          {/* Trophy Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Trophy className="w-9 h-9 text-amber-300" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold text-amber-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'आज की चुनौती पूर्ण!' : "Today's Challenge Completed!"}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                    {language === 'hi' ? 'शानदार प्रयास!' : 'Well Done!'}
                  </h2>
                  <p className="text-xs sm:text-sm text-indigo-100">
                    {language === 'hi'
                      ? `आपने 5 में से ${activeScore} अंक प्राप्त किए। आपकी प्रगति स्थानीय रूप से सुरक्षित है।`
                      : `You scored ${activeScore} out of 5. Your streak has been safely recorded.`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 bg-black/20 p-4 rounded-2xl border border-white/10 text-center">
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-indigo-200">
                    {language === 'hi' ? 'सटीकता' : 'Accuracy'}
                  </div>
                  <div className="text-2xl font-black">
                    {Math.round((activeScore / 5) * 100)}%
                  </div>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-indigo-200">
                    {language === 'hi' ? 'समय लिया' : 'Time'}
                  </div>
                  <div className="text-2xl font-black font-mono">
                    {formatTime(todayRecord ? todayRecord.timeSpentSeconds : timeSpent)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Review Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                {language === 'hi' ? 'प्रश्नों की विस्तृत समीक्षा (Review Answers)' : 'Detailed Question Review'}
              </h3>
              <span className="text-xs text-slate-400">
                {language === 'hi' ? '5 में से 5 प्रश्न' : '5 of 5 questions'}
              </span>
            </div>

            <div className="space-y-4">
              {dailyQuestions.map((q, idx) => {
                const userAns = selectedAnswers[idx] || (todayRecord ? q.correctAnswer : '');
                const isCorrect = userAns === q.correctAnswer;
                const bookmarked = bookmarkedIds[q.id] || isBookmarked(q.id);

                return (
                  <div
                    key={q.id}
                    className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all ${
                      isCorrect
                        ? 'border-emerald-200/80 dark:border-emerald-900/40'
                        : 'border-rose-200/80 dark:border-rose-900/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold flex items-center justify-center text-slate-700 dark:text-slate-300">
                          {idx + 1}
                        </span>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          {translateSubject(q.subject)} · {q.chapter}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleBookmark(q)}
                          className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            bookmarked
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                          title="Bookmark Question"
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
                        </button>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                            isCorrect
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{language === 'hi' ? 'सही' : 'Correct'}</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>{language === 'hi' ? 'गलत' : 'Incorrect'}</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    <p className="mt-3 text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                      {q.question}
                    </p>

                    {/* Options list */}
                    <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isThisCorrect = opt === q.correctAnswer;
                        const isThisUser = opt === userAns;

                        let optClasses = 'border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300';
                        if (isThisCorrect) {
                          optClasses = 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                        } else if (isThisUser && !isThisCorrect) {
                          optClasses = 'border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 line-through';
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-xl border text-xs flex items-center justify-between ${optClasses}`}
                          >
                            <span>{opt}</span>
                            {isThisCorrect && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            )}
                            {isThisUser && !isThisCorrect && (
                              <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="mt-4 p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs space-y-1.5 text-indigo-950 dark:text-indigo-200">
                      <div className="font-bold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'सीबीएसई व्याख्या एवं हल' : 'NCERT CBSE Step-by-Step Solution:'}</span>
                      </div>
                      <p className="leading-relaxed">{q.explanation}</p>
                      {q.boardTip && (
                        <div className="pt-1.5 text-[11px] text-indigo-800 dark:text-indigo-300 font-medium">
                          💡 <span className="font-bold">Board Tip:</span> {q.boardTip}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Active Quiz Runner */
        <div className="space-y-6">
          {/* Progress & Timer Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">
                {language === 'hi' ? 'प्रश्न' : 'Question'}
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {currentQuestionIndex + 1} / {dailyQuestions.length}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1.5 rounded-xl">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeSpent)}</span>
            </div>
          </div>

          {/* Active Question Card */}
          {currentQ && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {translateSubject(currentQ.subject)} · {currentQ.chapter}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                  {currentQ.difficulty}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h2>

              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(option)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 shadow-xs'
                          : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {language === 'hi' ? 'पिछला' : 'Previous'}
                </button>

                {currentQuestionIndex < dailyQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-200 dark:shadow-none cursor-pointer"
                  >
                    <span>{language === 'hi' ? 'अगला प्रश्न' : 'Next Question'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitChallenge}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all shadow-md shadow-emerald-200 dark:shadow-none cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'hi' ? 'चुनौती सबमिट करें' : 'Submit Daily Challenge'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completion History & Streak Tracker (No login required) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{language === 'hi' ? 'स्थानीय अभ्यास इतिहास (Local History)' : 'Local Challenge History'}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {language === 'hi' ? 'बिना लॉगिन सुरक्षित' : 'Saved in browser storage'}
          </span>
        </div>

        {history.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            {language === 'hi'
              ? 'आपने अभी तक कोई दैनिक चुनौती पूर्ण नहीं की है। आज का सत्र शुरू करें!'
              : 'No challenge history yet. Complete your first 5-question sprint above!'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {history.slice(0, 6).map((rec, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {rec.date}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {formatTime(rec.timeSpentSeconds)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {rec.score} / {rec.total}
                  </span>
                  <div className="text-[10px] text-slate-400">
                    {Math.round((rec.score / rec.total) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
