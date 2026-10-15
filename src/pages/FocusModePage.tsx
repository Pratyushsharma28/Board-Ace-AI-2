import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Target,
  Clock,
  Sparkles,
  Volume2,
  VolumeX,
  Calendar,
} from 'lucide-react';

const FOCUS_STORAGE_KEY = 'boardace_focus_sessions_v2';

interface FocusSessionRecord {
  id: string;
  goal: string;
  durationMinutes: number;
  completedAt: string;
}

export const FocusModePage: React.FC = () => {
  const { language, t } = useLanguage();

  // Mode: 25m Pomodoro, 50m Deep Work, 90m Board Sprint, or custom
  const [targetMinutes, setTargetMinutes] = useState<number>(25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [studyGoal, setStudyGoal] = useState<string>('Physics Electrostatics Derivations');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Audio white noise generator using Web Audio API (zero external assets or dependencies needed)
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Completed sessions
  const [sessions, setSessions] = useState<FocusSessionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(FOCUS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [sessionCompletedCelebration, setSessionCompletedCelebration] = useState(false);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isActive) {
      handleCompleteSession();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsRemaining(targetMinutes * 60);
  };

  const handleSetDuration = (mins: number) => {
    setIsActive(false);
    setTargetMinutes(mins);
    setSecondsRemaining(mins * 60);
  };

  const handleCompleteSession = () => {
    setIsActive(false);
    stopWhiteNoise();

    const newRecord: FocusSessionRecord = {
      id: `focus-${Date.now()}`,
      goal: studyGoal.trim() || 'CBSE Study Session',
      durationMinutes: targetMinutes,
      completedAt: new Date().toISOString(),
    };

    const updated = [newRecord, ...sessions];
    setSessions(updated);
    try {
      localStorage.setItem(FOCUS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    setSessionCompletedCelebration(true);
    setTimeout(() => {
      setSessionCompletedCelebration(false);
      setSecondsRemaining(targetMinutes * 60);
    }, 4000);
  };

  // Minimal web audio brownian noise generator for study concentration
  const toggleWhiteNoise = () => {
    if (isAudioPlaying) {
      stopWhiteNoise();
    } else {
      startWhiteNoise();
    }
  };

  const startWhiteNoise = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02; // Brown noise curve
        lastOut = output[i];
        output[i] *= 0.15; // Soft volume
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const gain = ctx.createGain();
      gain.gain.value = 0.1;

      whiteNoise.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start(0);

      noiseNodeRef.current = whiteNoise;
      setIsAudioPlaying(true);
    } catch (e) {
      console.warn('Audio Context not available', e);
    }
  };

  const stopWhiteNoise = () => {
    try {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } catch {}
    setIsAudioPlaying(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const todayCompletedMinutes = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return sessions
      .filter((s) => s.completedAt.startsWith(todayStr))
      .reduce((acc, s) => acc + s.durationMinutes, 0);
  }, [sessions]);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Top Controls Toolbar */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span className="font-mono font-bold uppercase tracking-wider">
            {language === 'hi' ? 'दैनिक फोकस समय:' : "Today's Deep Focus:"}{' '}
            <span className="text-slate-900 dark:text-white font-black">{todayCompletedMinutes} mins</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleWhiteNoise}
            className={`p-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              isAudioPlaying
                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
            title="Toggle Ambient Study Sound"
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {isAudioPlaying ? (language === 'hi' ? 'ध्वनि सक्रिय' : 'Ambient On') : (language === 'hi' ? 'शांत वातावरण' : 'Ambient Noise')}
            </span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Focus Card (Minimalist, zero distracting animations) */}
      <div className="p-8 sm:p-14 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md text-center space-y-8">
        {/* Goal Input Header */}
        <div className="space-y-2 max-w-lg mx-auto">
          <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400">
            {language === 'hi' ? 'वर्तमान अध्ययन लक्ष्य:' : 'Active Focus Objective:'}
          </div>
          <input
            type="text"
            value={studyGoal}
            onChange={(e) => setStudyGoal(e.target.value)}
            placeholder="What are you working on right now?"
            className="w-full text-center text-lg sm:text-xl font-black text-slate-900 dark:text-white bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 pb-1.5 focus:outline-none focus:border-indigo-600"
          />
        </div>

        {/* Big Tabular Timer Display */}
        <div className="py-4">
          <div className="text-6xl sm:text-8xl font-black font-mono tracking-tight text-slate-900 dark:text-white select-none tabular-nums">
            {formatTime(secondsRemaining)}
          </div>
        </div>

        {/* Preset Duration Buttons */}
        <div className="flex items-center justify-center gap-2">
          {[15, 25, 50, 90].map((mins) => (
            <button
              key={mins}
              onClick={() => handleSetDuration(mins)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                targetMinutes === mins
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleStartPause}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-indigo-200 dark:shadow-none transition-all cursor-pointer"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isActive ? (language === 'hi' ? 'रोकें' : 'Pause Focus') : (language === 'hi' ? 'शुरू करें' : 'Start Focus')}</span>
          </button>

          <button
            onClick={handleCompleteSession}
            className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors cursor-pointer"
            title="Log Completed Session"
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>

        {sessionCompletedCelebration && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-center justify-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{language === 'hi' ? 'सत्र सफलतापूर्वक दर्ज हुआ! शानदार एकाग्रता।' : 'Study session successfully recorded to your progress history!'}</span>
          </div>
        )}
      </div>

      {/* Completed Sessions Log */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>{language === 'hi' ? 'हाल के एकाग्रता सत्र' : 'Recent Focus Sessions'}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
          </span>
        </div>

        {sessions.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            {language === 'hi' ? 'अभी तक कोई सत्र दर्ज नहीं है। टाइमर शुरू करें!' : 'No focus sessions completed yet. Start your first sprint above!'}
          </p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {sessions.slice(0, 5).map((s) => (
              <div key={s.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{s.goal}</span>
                  <div className="text-[10px] text-slate-400">
                    {new Date(s.completedAt).toLocaleDateString()} · {new Date(s.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  +{s.durationMinutes}m
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
