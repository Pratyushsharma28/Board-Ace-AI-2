import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { CBSE_CLASS_12_SUBJECTS } from '../data/syllabus';
import { getSavedAttempts, calculateAnalytics } from '../utils/storage';
import { getRevisionSummary } from '../utils/revisionEngine';
import { SubjectId } from '../types/quiz';
import {
  Compass,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  Zap,
  RotateCcw,
  Bot,
  HelpCircle,
} from 'lucide-react';

const COACH_STORAGE_KEY = 'boardace_study_coach_goals_v2';

interface CoachTask {
  id: string;
  title: string;
  subject: SubjectId;
  estimatedMinutes: number;
  completed: boolean;
  isAiSuggested?: boolean;
}

export const StudyCoachPage: React.FC = () => {
  const { language, t, translateSubject } = useLanguage();
  const navigate = useNavigate();

  const attempts = useMemo(() => getSavedAttempts(), []);
  const analytics = useMemo(() => calculateAnalytics(), []);
  const revSummary = useMemo(() => getRevisionSummary(), []);

  // Form states
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('physics');
  const [targetDailyMinutes, setTargetDailyMinutes] = useState<number>(60);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskMinutes, setNewTaskMinutes] = useState(25);

  // AI Advice state
  const [coachAdvice, setCoachAdvice] = useState<string | null>(null);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);

  // Stored tasks
  const [tasks, setTasks] = useState<CoachTask[]>(() => {
    try {
      const saved = localStorage.getItem(COACH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}

    // Initial default high-yield goals
    return [
      {
        id: 't-1',
        title: 'Revise 5 Due Questions in Revision Center',
        subject: 'physics',
        estimatedMinutes: 15,
        completed: false,
        isAiSuggested: true,
      },
      {
        id: 't-2',
        title: 'Practice 10 High-Yield MCQs on Relations & Functions',
        subject: 'mathematics',
        estimatedMinutes: 25,
        completed: false,
        isAiSuggested: true,
      },
      {
        id: 't-3',
        title: 'Review Coordination Compounds IUPAC Nomenclature',
        subject: 'chemistry',
        estimatedMinutes: 20,
        completed: false,
        isAiSuggested: true,
      },
    ];
  });

  // Save tasks locally
  useEffect(() => {
    try {
      localStorage.setItem(COACH_STORAGE_KEY, JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  // Derived intelligent suggestions generated from actual student data
  const dataDrivenSuggestions = useMemo(() => {
    const list: Array<{ title: string; subject: SubjectId; minutes: number }> = [];

    // 1. Revision queue
    if (revSummary.dueCount > 0) {
      list.push({
        title:
          language === 'hi'
            ? `दोहराव केंद्र में आज देय ${revSummary.dueCount} प्रश्नों का अभ्यास करें`
            : `Clear ${revSummary.dueCount} questions due in Spaced-Repetition Revision`,
        subject: 'physics',
        minutes: Math.min(revSummary.dueCount * 3, 30),
      });
    }

    // 2. Weak topics from analytics
    if (analytics.weakTopicsAllTime && analytics.weakTopicsAllTime.length > 0) {
      analytics.weakTopicsAllTime.slice(0, 2).forEach((wt) => {
        const subId = (['mathematics', 'physics', 'chemistry'].includes(wt.subject.toLowerCase())
          ? wt.subject.toLowerCase()
          : 'physics') as SubjectId;
        list.push({
          title:
            language === 'hi'
              ? `कमजोर टॉपिक पर केंद्रित अभ्यास: ${wt.topic}`
              : `Drill high-yield weak topic: ${wt.topic}`,
          subject: subId,
          minutes: 20,
        });
      });
    }

    // 3. Formula library check
    list.push({
      title:
        language === 'hi'
          ? 'गणित व भौतिकी के 10 मुख्य सूत्रों का त्वरित पुनरावलोकन'
          : 'Quick 15-minute formula library sweep across Calculus & Electrostatics',
      subject: 'mathematics',
      minutes: 15,
    });

    return list;
  }, [revSummary, analytics, language]);

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: CoachTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      subject: selectedSubject,
      estimatedMinutes: newTaskMinutes,
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle('');
  };

  const handleAddSuggestionAsTask = (sug: typeof dataDrivenSuggestions[0]) => {
    const newTask: CoachTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      title: sug.title,
      subject: sug.subject,
      estimatedMinutes: sug.minutes,
      completed: false,
      isAiSuggested: true,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // On-demand AI Coach Strategy (uses Gemini only when explicitly requested)
  const handleFetchAiCoachAdvice = async () => {
    setIsLoadingAdvice(true);
    setCoachAdvice(null);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          question: `Give me a concise 3-bullet personalized exam coaching strategy for CBSE Class 12 ${selectedSubject}. My current accuracy is ${analytics.overallAccuracy}% across ${analytics.totalQuestionsAnswered} questions. Focus on practical exam hall execution and time management.`,
          action: 'summarize',
          language,
        }),
      });

      const data = await res.json();
      if (data.success && data.answer) {
        setCoachAdvice(data.answer);
      } else {
        setCoachAdvice(
          language === 'hi'
            ? 'दैनिक रणनीति: 1. हमेशा कठिन व्युत्पत्तियों (Derivations) को लिखकर हल करें। 2. भौतिकी में SI इकाइयों का विशेष ध्यान रखें। 3. प्रत्येक 50 मिनट के बाद 10 मिनट का विराम लें।'
            : 'Coaching Routine: 1. Handwrite step-by-step derivations rather than passively reading them. 2. Verify SI units in physics working margins. 3. Study in 50-minute focused blocks followed by 10-minute mental resets.'
        );
      }
    } catch {
      setCoachAdvice(
        language === 'hi'
          ? 'दैनिक रणनीति: 1. हमेशा कठिन व्युत्पत्तियों को लिखकर हल करें। 2. भौतिकी में SI इकाइयों का विशेष ध्यान रखें। 3. प्रत्येक 50 मिनट के बाद 10 मिनट का विराम लें।'
          : 'Coaching Routine: 1. Handwrite step-by-step derivations rather than passively reading them. 2. Verify SI units in physics working margins. 3. Study in 50-minute focused blocks followed by 10-minute mental resets.'
      );
    } finally {
      setIsLoadingAdvice(false);
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalMinutesPlanned = tasks.reduce((acc, t) => acc + t.estimatedMinutes, 0);
  const completedMinutes = tasks.filter((t) => t.completed).reduce((acc, t) => acc + t.estimatedMinutes, 0);
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
            <Bot className="w-4 h-4" />
            <span>PERSONALIZED CBSE STUDY MENTOR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'AI अध्ययन कोच' : 'AI Study Coach'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {language === 'hi'
              ? 'दैनिक अध्ययन लक्ष्य निर्धारित करें, वास्तविक क्विज़ प्रदर्शन के आधार पर लक्षित कार्य जोड़ें और अपनी बोर्ड तैयारी की गति बनाए रखें।'
              : 'Set daily study goals, track completed syllabus tasks, and receive personalized recommendations grounded in your actual quiz data.'}
          </p>
        </div>

        <button
          onClick={handleFetchAiCoachAdvice}
          disabled={isLoadingAdvice}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 dark:shadow-none hover:from-blue-500 hover:to-indigo-500 transition-all disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className={`w-4 h-4 ${isLoadingAdvice ? 'animate-spin' : ''}`} />
          <span>{isLoadingAdvice ? (language === 'hi' ? 'सलाह तैयार हो रही है...' : 'Consulting Coach...') : (language === 'hi' ? 'कोच से रणनीति पूछें' : 'Get Coach Strategy')}</span>
        </button>
      </div>

      {/* AI Coach Advice Card (when triggered) */}
      {coachAdvice && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-violet-950/30 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <Bot className="w-4 h-4" />
              <span>{language === 'hi' ? 'व्यक्तिगत सीबीएसई परीक्षा रणनीति:' : 'CBSE Master Coach Strategy:'}</span>
            </div>
            <button
              onClick={() => setCoachAdvice(null)}
              className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {coachAdvice}
          </div>
        </div>
      )}

      {/* Progress & Target Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {language === 'hi' ? 'दैनिक लक्ष्य प्रगति' : 'Daily Goal Progress'}
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
              {progressPercent}%
            </span>
            <span className="text-xs text-slate-400">
              {completedCount} / {tasks.length} {language === 'hi' ? 'कार्य पूर्ण' : 'tasks done'}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {language === 'hi' ? 'अध्ययन समय योजना' : 'Time Allocated'}
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400">
            {completedMinutes} <span className="text-sm font-semibold text-slate-400">/ {totalMinutesPlanned} mins</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {language === 'hi' ? 'आज के कार्यों का कुल समय' : 'Estimated completion duration'}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {language === 'hi' ? 'दोहराव स्थिति' : 'Revision Status'}
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-500">
            {revSummary.dueCount} <span className="text-sm font-semibold text-slate-400">{language === 'hi' ? 'देय' : 'due'}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {revSummary.masteredCount} {language === 'hi' ? 'कंठस्थ अवधारणाएं' : 'mastered concepts'}
          </div>
        </div>
      </div>

      {/* Main Task List & Add Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Task Checklist (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{language === 'hi' ? 'आज की अध्ययन कार्यसूची (Today’s Tasks)' : "Today's Study Action Checklist"}</span>
            </h2>
            <span className="text-xs text-slate-400">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  task.completed
                    ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800/60 opacity-75'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className="cursor-pointer shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-indigo-500 transition-colors" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        task.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                      <span className="uppercase font-bold text-indigo-600 dark:text-indigo-400">
                        {translateSubject(task.subject)}
                      </span>
                      <span>·</span>
                      <span>{task.estimatedMinutes} mins</span>
                      {task.isAiSuggested && (
                        <>
                          <span>·</span>
                          <span className="text-violet-600 dark:text-violet-400 font-bold">Coach Pick</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  title="Remove task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Custom Task Form */}
          <form
            onSubmit={handleAddTask}
            className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {language === 'hi' ? 'नया अध्ययन कार्य जोड़ें:' : 'Add Custom Study Task:'}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'उदा. गॉस प्रमेय के 3 संख्यात्मक प्रश्न हल करें...'
                    : 'e.g., Solve 5 numericals on Faraday’s Law...'
                }
                className="flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />

              <div className="flex items-center gap-2">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value as SubjectId)}
                  className="px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="mathematics">Mathematics</option>
                </select>

                <select
                  value={newTaskMinutes}
                  onChange={(e) => setNewTaskMinutes(Number(e.target.value))}
                  className="px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value={15}>15m</option>
                  <option value={25}>25m</option>
                  <option value={45}>45m</option>
                  <option value={60}>60m</option>
                </select>

                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'hi' ? 'जोड़ें' : 'Add'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right: Data-Driven Suggestions & Quick Tools (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span>{language === 'hi' ? 'डेटा आधारित सुझाव' : 'Performance Suggestions'}</span>
          </h2>

          <div className="space-y-3">
            {dataDrivenSuggestions.map((sug, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase text-slate-400">
                  <span>{translateSubject(sug.subject)}</span>
                  <span>{sug.minutes} mins</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  {sug.title}
                </p>
                <button
                  onClick={() => handleAddSuggestionAsTask(sug)}
                  className="w-full py-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'कार्यसूची में जोड़ें' : 'Add to Checklist'}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Quick Focus Mode Launch */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-200">
              <Clock className="w-4 h-4" />
              <span>{language === 'hi' ? 'ध्यान केंद्रित अध्ययन सत्र' : 'Distraction-Free Focus'}</span>
            </div>
            <p className="text-xs text-indigo-100 leading-relaxed">
              {language === 'hi'
                ? 'बिना किसी व्यवधान के पोमोडोरो टाइमर के साथ अपने चयनित कार्यों को पूरा करें।'
                : 'Enter minimalist Focus Mode to execute your study goals without distractions.'}
            </p>
            <Link
              to="/focus-mode"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-xs hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <span>{language === 'hi' ? 'फोकस मोड प्रारंभ करें' : 'Launch Focus Mode'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
