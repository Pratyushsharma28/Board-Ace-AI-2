import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CBSE_CLASS_12_SUBJECTS } from '../data/syllabus';
import { SubjectId } from '../types/quiz';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Target,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PLANNER_STORAGE_KEY = 'boardace_study_planner_v1';

type ChapterStatus = 'pending' | 'in_progress' | 'completed';

export const StudyPlannerPage: React.FC = () => {
  const { language, t, translateSubject, translateChapter } = useLanguage();

  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('mathematics');

  // Stored chapter progress map: Record<chapterId, ChapterStatus>
  const [chapterStatusMap, setChapterStatusMap] = useState<Record<string, ChapterStatus>>(() => {
    try {
      const saved = localStorage.getItem(PLANNER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const updateStatus = (chapterId: string, status: ChapterStatus) => {
    setChapterStatusMap((prev) => {
      const next = { ...prev, [chapterId]: status };
      try {
        localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // 25-minute Pomodoro focus timer
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentSubjectObj = CBSE_CLASS_12_SUBJECTS.find((s) => s.id === selectedSubject)!;
  const chapters = currentSubjectObj ? currentSubjectObj.chapters : [];

  const completedCount = chapters.filter((c) => chapterStatusMap[c.id] === 'completed').length;
  const inProgressCount = chapters.filter((c) => chapterStatusMap[c.id] === 'in_progress').length;
  const percentCompleted = chapters.length > 0 ? Math.round((completedCount / chapters.length) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'सीबीएसई अध्ययन योजनाकार' : 'CBSE Study Planner & Checklist'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'hi'
              ? '30-दिवसीय बोर्ड रणनीति, पाठ्यक्रम ट्रैकिंग एवं पोमोडोरो एकाग्रता टाइमर।'
              : 'Chapter syllabus milestones, high-yield weightage guide, and focused study routine.'}
          </p>
        </div>

        {/* Global completion summary */}
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
          <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-mono tabular-nums font-bold">{percentCompleted}%</span> of {currentSubjectObj.name} Completed
        </div>
      </div>

      {/* Top Banner: Pomodoro Focus Timer & 30-Day Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: 25-Min Focus Timer (5 cols) */}
        <div className="md:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {language === 'hi' ? 'एकाग्रता टाइमर (Pomodoro)' : 'Focused Study Sprint'}
              </span>
              <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="mt-4 text-center">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
                {formatTimer(timerSeconds)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {timerRunning ? 'Session active · Stay focused on NCERT' : '25-minute deep practice session'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{timerRunning ? 'Pause' : 'Start Sprint'}</span>
            </button>
            <button
              onClick={() => {
                setTimerRunning(false);
                setTimerSeconds(25 * 60);
              }}
              className="p-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Board Exam Sprint Guidelines (7 cols) */}
        <div className="md:col-span-7 p-6 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-white to-violet-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-100 dark:border-slate-800 space-y-3">
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            {language === 'hi' ? 'सीबीएसई टॉपर अध्ययन नियम' : 'Official CBSE 2026–27 Strategy'}
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            High-Yield Weightage &amp; Daily Habit Loop
          </h2>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
            <li>
              <strong>Mathematics:</strong> Calculus carries ~35 marks, Vectors &amp; 3D Geometry carry ~14 marks. Always write integration constant <code className="font-mono">+ C</code>.
            </li>
            <li>
              <strong>Physics:</strong> Optics carries ~14 marks, Electrostatics &amp; Current carry ~16 marks. Always specify explicit SI units for every final numerical step.
            </li>
            <li>
              <strong>Chemistry:</strong> Organic Conversions &amp; Mechanisms carry ~33 marks. Emphasize reagent conditions and IUPAC nomenclature.
            </li>
          </ul>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2">
          {CBSE_CLASS_12_SUBJECTS.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedSubject === sub.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {translateSubject(sub.id)}
            </button>
          ))}
        </div>

        {/* Progress Bar for Current Subject */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">
              {completedCount} of {chapters.length} Chapters Mastered ({inProgressCount} in progress)
            </span>
            <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-white">
              {percentCompleted}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 rounded-full"
              style={{ width: `${percentCompleted}%` }}
            />
          </div>
        </div>

        {/* Chapter Checklist Table */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
          {chapters.map((ch, idx) => {
            const status = chapterStatusMap[ch.id] || 'pending';
            return (
              <div
                key={ch.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      CH {(idx + 1).toString().padStart(2, '0')}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {translateChapter(ch.name)}
                    </h3>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Verified CBSE NCERT Class 12 Syllabus (Session 2026–27)
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Status Toggle Buttons */}
                  <div className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-xs font-semibold">
                    <button
                      onClick={() => updateStatus(ch.id, 'pending')}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        status === 'pending'
                          ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs font-bold'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => updateStatus(ch.id, 'in_progress')}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        status === 'in_progress'
                          ? 'bg-amber-500 text-white shadow-xs font-bold'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => updateStatus(ch.id, 'completed')}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        status === 'completed'
                          ? 'bg-emerald-600 text-white shadow-xs font-bold'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      Mastered
                    </button>
                  </div>

                  {/* Quick Quiz Shortcut */}
                  <Link
                    to={`/quiz?subject=${selectedSubject}&chapter=${encodeURIComponent(ch.name)}`}
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Generate chapter drill"
                  >
                    <BookOpen className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
