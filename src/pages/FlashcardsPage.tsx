import { useLanguage } from '../context/LanguageContext';
import { useClass } from '../context/ClassContext';
import { CBSE_FLASHCARDS, Flashcard } from '../data/flashcardsData';
import { SubjectId } from '../types/quiz';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCw,
  CheckCircle2,
  Bookmark,
  Search,
  Sparkles,
  BookOpen,
} from 'lucide-react';

const STORAGE_KEY = 'boardace_flashcards_mastery_v1';

export const FlashcardsPage: React.FC = () => {
  const { language, t, translateSubject } = useLanguage();
  const { grade, stream, setStream, subjects, isClass12, gradeLabel } = useClass();

  const [selectedSubject, setSelectedSubject] = useState<'all' | SubjectId>('all');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Sync selectedSubject if it's no longer in subjects list
  useEffect(() => {
    if (selectedSubject !== 'all' && !subjects.some(s => s.id === selectedSubject)) {
      setSelectedSubject('all');
      setSelectedChapter('all');
    }
  }, [grade, stream, subjects]);

  // Mastered card IDs tracked in localStorage
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleMastered = (id: string) => {
    setMasteredIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Filter cards
  const filteredCards = useMemo(() => {
    const validSubjectIds = subjects.map((s) => s.id);
    return CBSE_FLASHCARDS.filter((card) => {
      // Must be a subject in the current grade/stream
      if (!validSubjectIds.includes(card.subject)) return false;

      if (selectedSubject !== 'all' && card.subject !== selectedSubject) return false;
      if (selectedChapter !== 'all' && card.chapter !== selectedChapter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesFront = card.front.toLowerCase().includes(q) || (card.frontHi && card.frontHi.toLowerCase().includes(q));
        const matchesBack = card.back.toLowerCase().includes(q) || (card.backHi && card.backHi.toLowerCase().includes(q));
        const matchesTopic = card.topic.toLowerCase().includes(q);
        if (!matchesFront && !matchesBack && !matchesTopic) return false;
      }
      return true;
    });
  }, [selectedSubject, selectedChapter, searchQuery, subjects]);

  // Available chapters for the selected subject (within current stream)
  const availableChapters = useMemo(() => {
    const validSubjectIds = subjects.map((s) => s.id);
    const list = new Set<string>();
    CBSE_FLASHCARDS.forEach((card) => {
      if (!validSubjectIds.includes(card.subject)) return;
      if (selectedSubject === 'all' || card.subject === selectedSubject) {
        list.add(card.chapter);
      }
    });
    return Array.from(list);
  }, [selectedSubject, subjects]);

  // Reset index if out of bounds
  useEffect(() => {
    if (currentIndex >= filteredCards.length) {
      setCurrentIndex(0);
    }
    setIsFlipped(false);
  }, [filteredCards.length]);

  const currentCard = filteredCards[currentIndex];
  const isMastered = currentCard ? masteredIds.includes(currentCard.id) : false;

  const handleNext = () => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleShuffle = () => {
    if (filteredCards.length <= 1) return;
    setIsFlipped(false);
    const rand = Math.floor(Math.random() * filteredCards.length);
    setCurrentIndex(rand !== currentIndex ? rand : (rand + 1) % filteredCards.length);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'उच्च-महत्व फ्लैशकार्ड्स' : 'High-Yield Flashcards'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'hi'
              ? 'परिभाषाएं, प्रमेय और मुख्य बिंदु त्वरित रूप से याद करें।'
              : 'Interactive 3D concept flip cards for rapid retrieval and active recall.'}
          </p>
        </div>

        {/* Mastered Counter */}
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="font-mono tabular-nums">{masteredIds.length}</span>
          <span>{language === 'hi' ? 'कंठस्थ कार्ड्स' : 'Mastered'}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
        {/* Stream and Subject Selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Subject Segmented Control */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: language === 'hi' ? 'सभी विषय' : 'All Subjects' },
              ...subjects.map(s => ({ id: s.id, label: translateSubject(s.id) }))
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedSubject(sub.id as any);
                  setSelectedChapter('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSubject === sub.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Stream Switcher for Class 12 */}
          {isClass12 && (
            <div className="inline-flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => {
                  setStream('science');
                  setSelectedSubject('all');
                  setSelectedChapter('all');
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  stream === 'science'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {language === 'hi' ? 'साइंस' : 'Science'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStream('commerce');
                  setSelectedSubject('all');
                  setSelectedChapter('all');
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  stream === 'commerce'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {language === 'hi' ? 'कॉमर्स' : 'Commerce'}
              </button>
            </div>
          )}
        </div>

        {/* Chapter & Search in 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">
              {language === 'hi' ? 'सभी अध्याय (All Chapters)' : 'All Chapters'}
            </option>
            {availableChapters.map((ch) => (
              <option key={ch} value={ch}>
                {ch}
              </option>
            ))}
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'hi' ? 'अवधारणा या सूत्र खोजें...' : 'Search concept, topic, theorem...'}
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Flashcard Area */}
      {filteredCards.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <Layers className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'कोई फ्लैशकार्ड नहीं मिला' : 'No flashcards matched your filter'}
          </div>
          <button
            onClick={() => {
              setSelectedSubject('all');
              setSelectedChapter('all');
              setSearchQuery('');
            }}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            {language === 'hi' ? 'फ़िल्टर हटाएं' : 'Reset filters'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Progress / Card counter */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span className="font-semibold">
              <span className="text-slate-900 dark:text-white font-mono font-bold tabular-nums">
                {currentIndex + 1}
              </span>{' '}
              of{' '}
              <span className="text-slate-900 dark:text-white font-mono font-bold tabular-nums">
                {filteredCards.length}
              </span>{' '}
              Cards
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'कार्ड पलटें' : 'Click to Flip'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[280px] sm:min-h-[320px] p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer flex flex-col justify-between shadow-xs relative overflow-hidden group select-none"
          >
            {/* Top metadata unboxed */}
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2 truncate">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {currentCard.subject}
                </span>
                <span aria-hidden="true">·</span>
                <span className="truncate">{currentCard.chapter}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {isFlipped ? (language === 'hi' ? 'उत्तर / व्याख्या' : 'EXPLANATION') : (language === 'hi' ? 'अवधारणा' : 'CONCEPT')}
                </span>
              </div>
            </div>

            {/* Main Content */}
            <div className="my-auto py-6 space-y-4">
              {!isFlipped ? (
                // Front Side
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {currentCard.topic}
                  </div>
                  <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                    {language === 'hi' && currentCard.frontHi ? currentCard.frontHi : currentCard.front}
                  </h2>
                </div>
              ) : (
                // Back Side
                <div className="space-y-4 animate-fadeIn">
                  <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {currentCard.topic} — Solution &amp; Key Derivation
                  </div>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                    {language === 'hi' && currentCard.backHi ? currentCard.backHi : currentCard.back}
                  </p>

                  {currentCard.formula && (
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-xs sm:text-sm font-bold text-indigo-900 dark:text-indigo-300 border border-slate-200 dark:border-slate-700">
                      {currentCard.formula}
                    </div>
                  )}

                  {currentCard.keyPoint && (
                    <div className="text-xs text-amber-700 dark:text-amber-300 font-medium bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800">
                      <span className="font-bold">Board Tip:</span> {currentCard.keyPoint}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Card Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px]">
                {isFlipped ? 'Click card to see question' : 'Click card or press Space to reveal solution'}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMastered(currentCard.id);
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  isMastered
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isMastered ? 'Mastered' : 'Mark Mastered'}</span>
              </button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'पिछला' : 'Previous'}</span>
            </button>

            <button
              onClick={handleShuffle}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Shuffle className="w-4 h-4" />
              <span>{language === 'hi' ? 'क्रम बदलें' : 'Shuffle'}</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>{language === 'hi' ? 'अगला' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
