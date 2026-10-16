import React from 'react';
import { useClass } from '../context/ClassContext';
import { useLanguage } from '../context/LanguageContext';
import { Atom, TrendingUp, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';

interface StreamSelectorProps {
  compact?: boolean;
  showTitle?: boolean;
  className?: string;
}

export const StreamSelector: React.FC<StreamSelectorProps> = ({
  compact = false,
  showTitle = true,
  className = '',
}) => {
  const { grade, stream, setStream, isClass12 } = useClass();
  const { language } = useLanguage();

  if (!isClass12) {
    return null;
  }

  const streams = [
    {
      id: 'science' as const,
      title: language === 'hi' ? 'विज्ञान वर्ग (Science)' : 'Science',
      shortTitle: 'Science',
      icon: Atom,
      badge: language === 'hi' ? 'सत्र 2026–27' : 'Session 2026–27',
      description:
        language === 'hi'
          ? 'गणित, भौतिक विज्ञान, रसायन विज्ञान और वैज्ञानिक सिद्धांतों की संपूर्ण तैयारी।'
          : 'Explore Mathematics, Physics, Chemistry and scientific concepts.',
      subjects:
        language === 'hi'
          ? ['गणित (041)', 'भौतिकी (042)', 'रसायन (043)']
          : ['Mathematics (041)', 'Physics (042)', 'Chemistry (043)'],
      color: 'blue',
      activeBorder: 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20 shadow-blue-500/10',
      activeBg: 'bg-blue-50/70 dark:bg-blue-950/30',
      badgeBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      iconBg: 'bg-blue-500 text-white shadow-blue-500/30',
      inactiveHover: 'hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/40',
    },
    {
      id: 'commerce' as const,
      title: language === 'hi' ? 'वाणिज्य वर्ग (Commerce)' : 'Commerce',
      shortTitle: 'Commerce',
      icon: TrendingUp,
      badge: language === 'hi' ? 'सत्र 2026–27 नया' : 'Session 2026–27 New',
      description:
        language === 'hi'
          ? 'लेखाशास्त्र, व्यावसायिक अध्ययन, अर्थशास्त्र और अंग्रेज़ी कोर में महारत हासिल करें।'
          : 'Master Accountancy, Business Studies, Economics and English.',
      subjects:
        language === 'hi'
          ? ['लेखाशास्त्र (055)', 'व्यावसायिक अध्ययन (054)', 'अर्थशास्त्र (030)', 'अंग्रेज़ी कोर (301)']
          : ['Accountancy (055)', 'Business Studies (054)', 'Economics (030)', 'English Core (301)'],
      color: 'amber',
      activeBorder: 'border-amber-500 dark:border-amber-400 ring-2 ring-amber-500/20 shadow-amber-500/10',
      activeBg: 'bg-amber-50/70 dark:bg-amber-950/30',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-amber-500/30',
      inactiveHover: 'hover:border-amber-300 dark:hover:border-amber-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/40',
    },
  ];

  if (compact) {
    return (
      <div
        role="radiogroup"
        aria-label="Class 12 Stream Selection"
        className={`inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs ${className}`}
      >
        {streams.map((s) => {
          const isSelected = stream === s.id;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => setStream(s.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? s.id === 'science'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{s.shortTitle}</span>
              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {showTitle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'hi' ? 'सीबीएसई कक्षा 12 स्ट्रीम चयन' : 'CBSE Class 12 Stream Selection'}
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
            {language === 'hi' ? 'सत्र 2026–27 मान्य' : 'Session 2026–27 Verified'}
          </span>
        </div>
      )}

      <div
        role="radiogroup"
        aria-label="Select CBSE Class 12 Academic Stream"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {streams.map((s) => {
          const isSelected = stream === s.id;
          const Icon = s.icon;

          return (
            <div
              key={s.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => setStream(s.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setStream(s.id);
                }
              }}
              className={`group relative p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-left shadow-xs flex flex-col justify-between ${
                isSelected
                  ? `${s.activeBorder} ${s.activeBg}`
                  : `border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 ${s.inactiveHover}`
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105 ${s.iconBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                          {s.title}
                        </h3>
                      </div>
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-0.5 ${s.badgeBg}`}>
                        {s.badge}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? s.id === 'science'
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-amber-600 bg-amber-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-transparent'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {s.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  {language === 'hi' ? 'पाठ्यक्रम विषय' : 'Prescribed Subjects'}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {s.subjects.map((subName, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50"
                    >
                      {subName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
