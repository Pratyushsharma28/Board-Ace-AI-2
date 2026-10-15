import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CBSE_CLASS_12_SUBJECTS } from '../data/syllabus';
import { getSavedAttempts, calculateAnalytics } from '../utils/storage';
import { SubjectId } from '../types/quiz';
import {
  Compass,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Target,
  Sparkles,
  ArrowRight,
  BookOpen,
  Edit2,
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ROADMAP_KEY = 'boardace_study_roadmap_v1';

interface RoadmapTask {
  id: string;
  phaseId: number;
  title: string;
  subject: SubjectId;
  estimatedHours: number;
  completed: boolean;
  isCustom?: boolean;
}

interface RoadmapPhase {
  id: number;
  title: string;
  focus: string;
  weekRange: string;
}

export const StudyRoadmapPage: React.FC = () => {
  const { language, t, translateSubject } = useLanguage();

  const attempts = useMemo(() => getSavedAttempts(), []);
  const analytics = useMemo(() => calculateAnalytics(), []);

  // Configuration settings
  const [dailyHours, setDailyHours] = useState<number>(2);
  const [targetExamDate, setTargetExamDate] = useState<string>('2027-02-20');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectId[]>(['mathematics', 'physics', 'chemistry']);
  const [targetScore, setTargetScore] = useState<'95' | '90' | '80'>('95');

  // Stored tasks
  const [tasks, setTasks] = useState<RoadmapTask[]>(() => {
    try {
      const saved = localStorage.getItem(ROADMAP_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Seed default tasks
    return [
      {
        id: 't-1',
        phaseId: 1,
        title: 'Master Calculus Foundations (Integrals & Derivatives)',
        subject: 'mathematics',
        estimatedHours: 12,
        completed: false,
      },
      {
        id: 't-2',
        phaseId: 1,
        title: 'Complete Wave Optics & Ray Optics Derivations',
        subject: 'physics',
        estimatedHours: 10,
        completed: false,
      },
      {
        id: 't-3',
        phaseId: 1,
        title: 'Solutions & Electrochemistry Numerical Practice',
        subject: 'chemistry',
        estimatedHours: 8,
        completed: false,
      },
      {
        id: 't-4',
        phaseId: 2,
        title: 'Electromagnetic Induction & Alternating Current Formulas',
        subject: 'physics',
        estimatedHours: 6,
        completed: false,
      },
      {
        id: 't-5',
        phaseId: 2,
        title: 'Organic Chemistry Name Reactions & Mechanisms (Aldol, Cannizzaro)',
        subject: 'chemistry',
        estimatedHours: 10,
        completed: false,
      },
      {
        id: 't-6',
        phaseId: 3,
        title: 'Targeted Mistake Drill on Recorded Weak Topics',
        subject: 'physics',
        estimatedHours: 5,
        completed: false,
      },
      {
        id: 't-7',
        phaseId: 4,
        title: 'Full 3-Hour Timed CBSE Mock Board Simulation',
        subject: 'mathematics',
        estimatedHours: 3,
        completed: false,
      },
    ];
  });

  // Custom task input
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPhase, setNewTaskPhase] = useState<number>(1);
  const [newTaskSubject, setNewTaskSubject] = useState<SubjectId>('physics');

  const saveTasks = (updated: RoadmapTask[]) => {
    setTasks(updated);
    try {
      localStorage.setItem(ROADMAP_KEY, JSON.stringify(updated));
    } catch {}
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: RoadmapTask = {
      id: `custom-${Date.now()}`,
      phaseId: newTaskPhase,
      title: newTaskTitle.trim(),
      subject: newTaskSubject,
      estimatedHours: 2,
      completed: false,
      isCustom: true,
    };
    saveTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  // Days until target exam
  const daysRemaining = useMemo(() => {
    try {
      const exam = new Date(targetExamDate).getTime();
      const now = new Date().getTime();
      const diff = Math.ceil((exam - now) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 0;
    } catch {
      return 120;
    }
  }, [targetExamDate]);

  const phases: RoadmapPhase[] = [
    {
      id: 1,
      title: language === 'hi' ? 'चरण 1: उच्च-अंक वाले बुनियादी अध्याय' : 'Phase 1: High-Weightage Foundations',
      focus: 'Calculus, Optics, Solutions & Electrochemistry',
      weekRange: 'Weeks 1–3',
    },
    {
      id: 2,
      title: language === 'hi' ? 'चरण 2: महत्वपूर्ण व्युत्पत्ति एवं अभिक्रियाएं' : 'Phase 2: Core Derivations & Mechanisms',
      focus: 'Electromagnetism, Organic Conversions, 3D Geometry',
      weekRange: 'Weeks 4–6',
    },
    {
      id: 3,
      title: language === 'hi' ? 'चरण 3: कमजोर टॉपिक सुधार स्प्रिंट' : 'Phase 3: Weak Topic Sprints & Revision',
      focus: 'Mistake Detective Drills & Spaced Repetition',
      weekRange: 'Weeks 7–9',
    },
    {
      id: 4,
      title: language === 'hi' ? 'चरण 4: पूर्ण-लंबाई बोर्ड सिमुलेशन' : 'Phase 4: Full Board Exam Simulations',
      focus: 'Timed Section A drills & 3-hour official mock papers',
      weekRange: 'Final 2 Weeks',
    },
  ];

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'AI अध्ययन रोडमैप' : 'AI Study Roadmap'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'hi'
              ? 'आपकी उपलब्ध अध्ययन समयावधि, परीक्षा तिथि और वर्तमान सटीकता पर आधारित व्यक्तिगत योजना।'
              : 'Personalized CBSE Class 12 preparation roadmap aligned to your daily hours, target exam date, and real quiz results.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
          <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-mono tabular-nums font-bold">{daysRemaining}</span> Days to CBSE Board Exam
        </div>
      </div>

      {/* Target Parameters Deck */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Roadmap Target Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Daily Study Hours
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setDailyHours(hrs)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all font-mono tabular-nums cursor-pointer ${
                    dailyHours === hrs
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {hrs}h
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Target Board Exam Date
            </label>
            <input
              type="date"
              value={targetExamDate}
              onChange={(e) => setTargetExamDate(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Target Score Goal
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['95', '90', '80'] as const).map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setTargetScore(score)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer font-mono tabular-nums ${
                    targetScore === score
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {score}%+
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overall Completion Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Overall Roadmap Completion</span>
            <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
              {completedCount}/{tasks.length} Milestones ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Phases & Milestones */}
      <div className="space-y-6">
        {phases.map((phase) => {
          const phaseTasks = tasks.filter((t) => t.phaseId === phase.id);
          const phaseCompleted = phaseTasks.filter((t) => t.completed).length;

          return (
            <div
              key={phase.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs"
            >
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {phase.weekRange}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {phase.title}
                    </h3>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Focus: {phase.focus}
                  </div>
                </div>

                <div className="text-xs font-mono font-bold text-slate-400">
                  {phaseCompleted}/{phaseTasks.length} Completed
                </div>
              </div>

              {/* Task Items */}
              <div className="space-y-2.5">
                {phaseTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      task.completed
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                          task.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                        }`}
                      >
                        {task.completed && <Check className="w-3.5 h-3.5" />}
                      </button>

                      <span
                        className={`text-xs sm:text-sm font-semibold ${
                          task.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60">
                        {task.subject}
                      </span>

                      {task.isCustom && (
                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                          title="Delete custom task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Milestone Form */}
      <form
        onSubmit={handleAddTask}
        className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-4"
      >
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Add Custom Roadmap Milestone
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="e.g. Revise Optics Derivations 3 times..."
            className="sm:col-span-6 px-4 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            value={newTaskPhase}
            onChange={(e) => setNewTaskPhase(parseInt(e.target.value, 10))}
            className="sm:col-span-3 px-3 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            {phases.map((p) => (
              <option key={p.id} value={p.id}>
                Phase {p.id}
              </option>
            ))}
          </select>

          <select
            value={newTaskSubject}
            onChange={(e) => setNewTaskSubject(e.target.value as SubjectId)}
            className="sm:col-span-2 px-3 py-2.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white capitalize"
          >
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="mathematics">Mathematics</option>
          </select>

          <button
            type="submit"
            className="sm:col-span-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
