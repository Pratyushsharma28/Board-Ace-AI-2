import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useClass } from '../context/ClassContext';
import { SubjectId } from '../types/quiz';
import {
  FileText,
  Sparkles,
  BookOpen,
  Download,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Copy,
  Printer,
  ChevronRight,
  Trash2,
  Share2,
} from 'lucide-react';

const SAVED_NOTES_KEY = 'boardace_saved_ai_notes_v1';

interface FormulaNote {
  name: string;
  formula: string;
  variables: string;
  examTip: string;
}

interface ConceptNote {
  title: string;
  content: string;
  importance: string;
}

interface ChapterNotes {
  id: string;
  chapter: string;
  subject: SubjectId;
  chapterSummary: string;
  keyFormulas: FormulaNote[];
  coreTheoremsAndConcepts: ConceptNote[];
  commonBoardTraps: string[];
  quickRevisionChecklist: string[];
  generatedAt: string;
}

// Preset Fallback Notes for Instant High-Yield Revision
const PRESET_NOTES: Partial<Record<SubjectId, Record<string, Partial<ChapterNotes>>>> = {
  physics: {
    'Electric Charges and Fields': {
      chapterSummary:
        'Electric charges and fields explore electrostatic phenomena governed by Coulomb’s law and Gauss’s theorem. Key board derivations include the electric field due to an infinitely long charged wire, a uniformly charged infinite plane sheet, and a uniformly charged thin spherical shell.',
      keyFormulas: [
        {
          name: 'Coulomb’s Law in Vector Form',
          formula: 'F = (1 / 4πε₀) · (q₁q₂ / r²) r̂',
          variables: 'ε₀ = 8.854 × 10⁻¹² C²N⁻¹m⁻², r = separation distance',
          examTip: 'Always specify the unit vector r̂ when asked for vector form to secure the 1/2 mark.',
        },
        {
          name: 'Electric Flux and Gauss’s Theorem',
          formula: 'Φ_E = ∮ E · dA = q_enclosed / ε₀',
          variables: 'Φ_E in N·m²/C, q_enclosed = net enclosed charge',
          examTip: 'Only enclosed charges contribute to net flux; charges outside the Gaussian surface do not.',
        },
      ],
      coreTheoremsAndConcepts: [
        {
          title: 'Gauss’s Law in Electrostatics',
          content: 'The total electric flux through any closed surface is 1/ε₀ times the total charge enclosed inside the surface.',
          importance: '5-mark derivation staple in CBSE Physics Section D.',
        },
        {
          title: 'Electric Dipole in Uniform Field',
          content: 'Experiences torque τ = p × E and potential energy U = -p · E. Net force in a uniform field is zero.',
          importance: 'Common 2-mark conceptual MCQ.',
        },
      ],
      commonBoardTraps: [
        'Confusing net force (zero in uniform field) with net torque (non-zero unless aligned).',
        'Forgetting that electric field inside a charged conducting shell is strictly zero.',
      ],
      quickRevisionChecklist: [
        'Derive E due to infinite wire: E = λ / (2πε₀r).',
        'Derive E due to sheet: E = σ / (2ε₀).',
        'State properties of electric field lines (no closed loops, perpendicular to conductor).',
        'Calculate torque on electric dipole τ = pE sin θ.',
      ],
    },
  },
  chemistry: {
    'Solutions': {
      chapterSummary:
        'Solutions covers binary liquid-liquid and solid-liquid solutions, Raoult’s law for ideal and non-ideal behaviors, colligative properties (relative lowering of vapor pressure, boiling point elevation, freezing point depression, osmotic pressure), and the van ’t Hoff factor (i).',
      keyFormulas: [
        {
          name: 'Raoult’s Law',
          formula: 'P_total = P°_A · x_A + P°_B · x_B',
          variables: 'P° = vapor pressure of pure component, x = mole fraction',
          examTip: 'Ensure mole fractions add up to 1: x_A + x_B = 1.',
        },
        {
          name: 'Osmotic Pressure',
          formula: 'Π = i · C · R · T = i · (n_B / V) · R · T',
          variables: 'R = 0.0821 L·atm·mol⁻¹·K⁻¹ or 8.314 J·K⁻¹·mol⁻¹',
          examTip: 'Ideal for determining molar mass of macromolecules because measurements are done at room temperature.',
        },
      ],
      coreTheoremsAndConcepts: [
        {
          title: 'Azeotropic Mixtures',
          content: 'Binary mixtures having the same composition in liquid and vapor phase and boil at a constant temperature (e.g. 95% ethanol + water minimum boiling azeotrope).',
          importance: 'Frequently asked in 2-mark reasoning questions.',
        },
        {
          title: 'van ’t Hoff Factor (i)',
          content: 'Ratio of normal molar mass to abnormal molar mass. For dissociation i > 1; for association i < 1.',
          importance: 'Mandatory in all numerical problems in Section C.',
        },
      ],
      commonBoardTraps: [
        'Forgetting van ’t Hoff factor (i) when solute dissociates (e.g., NaCl i=2, BaCl₂ i=3).',
        'Using Celsius instead of Kelvin for temperature T in Π = CRT calculations.',
      ],
      quickRevisionChecklist: [
        'Write Henry’s law formula P = K_H · x and explain temperature dependence.',
        'Distinguish ideal vs non-ideal solutions (ΔH_mix, ΔV_mix, examples).',
        'Derive molar mass from depression in freezing point: M_B = (1000 · K_f · w_B) / (ΔT_f · w_A).',
        'Understand reverse osmosis and semipermeable membranes.',
      ],
    },
  },
  mathematics: {
    'Matrices': {
      chapterSummary:
        'Matrices covers matrix operations, symmetric and skew-symmetric matrices, elementary row operations, and solving linear systems of equations using matrix inverses (A · X = B ⇒ X = A⁻¹ · B).',
      keyFormulas: [
        {
          name: 'Inverse of a Matrix',
          formula: 'A⁻¹ = (1 / |A|) · adj(A)',
          variables: '|A| ≠ 0 (non-singular matrix required)',
          examTip: 'Check |A| first; if |A| = 0, inverse does not exist.',
        },
        {
          name: 'Properties of Adjoint',
          formula: 'A · adj(A) = adj(A) · A = |A| · I',
          variables: 'I = identity matrix of same order n',
          examTip: '|adj(A)| = |A|ⁿ⁻¹ where n is matrix order.',
        },
      ],
      coreTheoremsAndConcepts: [
        {
          title: 'Symmetric & Skew-Symmetric Decomposition',
          content: 'Any square matrix A can be uniquely expressed as sum of a symmetric and skew-symmetric matrix: A = 1/2(A + A′) + 1/2(A - A′).',
          importance: '3-mark direct proof question in Section C.',
        },
      ],
      commonBoardTraps: [
        'Assuming matrix multiplication is commutative (AB ≠ BA in general).',
        'Taking transpose of cofactor matrix when computing adj(A) — transpose is mandatory!',
      ],
      quickRevisionChecklist: [
        'Calculate adjoint of 2x2 and 3x3 matrices cleanly.',
        'Verify AB ≠ BA and (AB)′ = B′A′.',
        'Solve 3-variable linear equations using matrix method.',
        'Compute |adj(A)| = |A|² for 3x3 matrices.',
      ],
    },
  },
};

export const NotesGeneratorPage: React.FC = () => {
  const { language, t, translateSubject } = useLanguage();
  const { grade, stream, setStream, subjects, isClass12, gradeLabel } = useClass();

  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(() => subjects[0]?.id || 'accountancy');
  const [selectedChapter, setSelectedChapter] = useState<string>(
    () => subjects[0]?.chapters[0]?.name || 'Accounting for Partnership Firms - Fundamentals'
  );

  // Sync selectedSubject if it's no longer in subjects
  React.useEffect(() => {
    if (!subjects.some((s) => s.id === selectedSubject)) {
      const nextSub = subjects[0]?.id || 'accountancy';
      setSelectedSubject(nextSub);
      const subObj = subjects.find((s) => s.id === nextSub);
      setSelectedChapter(subObj?.chapters[0]?.name || '');
    }
  }, [grade, stream, subjects]);

  const [activeTab, setActiveTab] = useState<'generate' | 'saved'>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeNotes, setActiveNotes] = useState<ChapterNotes | null>(null);
  const [copied, setCopied] = useState(false);

  // Stored notes in local storage
  const [savedNotes, setSavedNotes] = useState<ChapterNotes[]>(() => {
    try {
      const saved = localStorage.getItem(SAVED_NOTES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const availableChapters = useMemo(() => {
    const s = subjects.find((sub) => sub.id === selectedSubject);
    return s ? s.chapters.map((c) => c.name) : [];
  }, [subjects, selectedSubject]);

  const handleSubjectChange = (sub: SubjectId) => {
    setSelectedSubject(sub);
    const s = subjects.find((item) => item.id === sub);
    if (s && s.chapters.length > 0) {
      setSelectedChapter(s.chapters[0].name);
    }
    setActiveNotes(null);
  };

  const handleGenerateNotes = async () => {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/generate-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          chapter: selectedChapter,
          language,
        }),
      });

      const data = await res.json();
      if (data.success && data.notes) {
        const fullNotes: ChapterNotes = {
          id: `notes-${Date.now()}`,
          chapter: data.notes.chapter || selectedChapter,
          subject: selectedSubject,
          chapterSummary: data.notes.chapterSummary || '',
          keyFormulas: data.notes.keyFormulas || [],
          coreTheoremsAndConcepts: data.notes.coreTheoremsAndConcepts || [],
          commonBoardTraps: data.notes.commonBoardTraps || [],
          quickRevisionChecklist: data.notes.quickRevisionChecklist || [],
          generatedAt: new Date().toISOString(),
        };
        setActiveNotes(fullNotes);
      } else {
        // Fallback to verified preset notes if quota or network issue occurs
        const preset = PRESET_NOTES[selectedSubject]?.[selectedChapter];
        if (preset) {
          const fallback: ChapterNotes = {
            id: `notes-${Date.now()}`,
            chapter: selectedChapter,
            subject: selectedSubject,
            chapterSummary: preset.chapterSummary || '',
            keyFormulas: preset.keyFormulas || [],
            coreTheoremsAndConcepts: preset.coreTheoremsAndConcepts || [],
            commonBoardTraps: preset.commonBoardTraps || [],
            quickRevisionChecklist: preset.quickRevisionChecklist || [],
            generatedAt: new Date().toISOString(),
          };
          setActiveNotes(fallback);
        } else {
          setErrorMessage(data.error || 'Failed to generate revision notes. Please try again.');
        }
      }
    } catch (err) {
      // Use fallback if available
      const preset = PRESET_NOTES[selectedSubject]?.[selectedChapter];
      if (preset) {
        const fallback: ChapterNotes = {
          id: `notes-${Date.now()}`,
          chapter: selectedChapter,
          subject: selectedSubject,
          chapterSummary: preset.chapterSummary || '',
          keyFormulas: preset.keyFormulas || [],
          coreTheoremsAndConcepts: preset.coreTheoremsAndConcepts || [],
          commonBoardTraps: preset.commonBoardTraps || [],
          quickRevisionChecklist: preset.quickRevisionChecklist || [],
          generatedAt: new Date().toISOString(),
        };
        setActiveNotes(fallback);
      } else {
        setErrorMessage('Network connection error. Please verify your connection.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveNotes = () => {
    if (!activeNotes) return;
    const isAlready = savedNotes.some((n) => n.id === activeNotes.id || n.chapter === activeNotes.chapter);
    let updated: ChapterNotes[];
    if (isAlready) {
      updated = savedNotes.map((n) => (n.chapter === activeNotes.chapter ? activeNotes : n));
    } else {
      updated = [activeNotes, ...savedNotes];
    }
    setSavedNotes(updated);
    try {
      localStorage.setItem(SAVED_NOTES_KEY, JSON.stringify(updated));
    } catch {}
  };

  const handleDeleteSavedNotes = (id: string) => {
    const updated = savedNotes.filter((n) => n.id !== id);
    setSavedNotes(updated);
    try {
      localStorage.setItem(SAVED_NOTES_KEY, JSON.stringify(updated));
    } catch {}
  };

  const handleCopyNotes = () => {
    if (!activeNotes) return;
    const text = `# ${activeNotes.chapter} (${activeNotes.subject.toUpperCase()}) - CBSE Class 12\n\n## Summary\n${activeNotes.chapterSummary}\n\n## Key Formulas\n${activeNotes.keyFormulas.map((f) => `- ${f.name}: ${f.formula} (${f.variables}) | Tip: ${f.examTip}`).join('\n')}\n\n## Core Concepts\n${activeNotes.coreTheoremsAndConcepts.map((c) => `- ${c.title}: ${c.content} [${c.importance}]`).join('\n')}\n\n## Common Traps\n${activeNotes.commonBoardTraps.map((t) => `- ${t}`).join('\n')}\n\n## Quick Revision Checklist\n${activeNotes.quickRevisionChecklist.map((c) => `[ ] ${c}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCurrentSaved = useMemo(() => {
    if (!activeNotes) return false;
    return savedNotes.some((n) => n.chapter === activeNotes.chapter);
  }, [activeNotes, savedNotes]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
            <FileText className="w-4 h-4" />
            <span>CBSE CLASS 12 REVISION SHEET SYNTHESIZER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {language === 'hi' ? 'AI त्वरित नोट्स जनरेटर' : 'AI Chapter Notes Generator'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {language === 'hi'
              ? 'किसी भी अध्याय के प्रमुख सूत्र, सिद्धांत, सामान्य गलतियां और त्वरित पुनरावलोकन चेकलिस्ट एक क्लिक में प्राप्त करें।'
              : 'Generate structured, high-yield chapter revision guides containing verified formulas, core theorems, common board traps, and quick memory anchors.'}
          </p>
        </div>

        {/* Tab switch between Generator and Saved Notes */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'generate'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {language === 'hi' ? 'नोट्स बनाएं' : 'Generate Notes'}
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{language === 'hi' ? 'सहेजे गए नोट्स' : 'Saved Notes'}</span>
            {savedNotes.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold">
                {savedNotes.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'saved' ? (
        /* Saved Notes Archive */
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'आपके सहेजे गए रिवीजन नोट्स' : 'Your Saved Chapter Guides'}
          </h2>

          {savedNotes.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? 'कोई सहेजे गए नोट्स नहीं हैं' : 'No Saved Notes Yet'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                {language === 'hi'
                  ? 'जेनरेट किए गए नोट्स में "नोट्स सहेजें" बटन पर क्लिक करके उन्हें ऑफ़लाइन अध्ययन हेतु सुरक्षित रखें।'
                  : 'Generate notes for any chapter in the generator tab, then click "Save Notes" to keep them pinned here for exam day revision.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      <span>{translateSubject(note.subject)}</span>
                      <span>{new Date(note.generatedAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {note.chapter}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 mt-2 leading-relaxed">
                      {note.chapterSummary}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                      <span>{note.keyFormulas.length} Formulas</span>
                      <span>·</span>
                      <span>{note.commonBoardTraps.length} Traps</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setActiveNotes(note);
                        setActiveTab('generate');
                      }}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{language === 'hi' ? 'नोट्स देखें' : 'View Full Notes'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteSavedNotes(note.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Saved Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Generator View */
        <div className="space-y-6">
          {/* Configuration Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            {/* Subject Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  1. {language === 'hi' ? 'विषय चुनें' : 'Select Subject:'}
                </label>
                {isClass12 && (
                  <div className="inline-flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setStream('science')}
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
                      onClick={() => setStream('commerce')}
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
              <div className="flex flex-wrap gap-2.5">
                {subjects.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleSubjectChange(sub.id)}
                    className={`py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                      selectedSubject === sub.id
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                        : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    {translateSubject(sub.id)}
                  </button>
                ))}
              </div>
            </div>

            {/* Chapter Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. {language === 'hi' ? 'अध्याय चुनें' : 'Select Chapter:'}
              </label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {availableChapters.map((ch) => (
                  <option key={ch} value={ch} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                    {ch}
                  </option>
                ))}
              </select>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerateNotes}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm shadow-md shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>
                {isGenerating
                  ? language === 'hi'
                    ? 'अध्याय नोट्स तैयार किए जा रहे हैं...'
                    : 'Synthesizing CBSE Revision Notes...'
                  : language === 'hi'
                  ? 'अध्याय नोट्स जनरेट करें'
                  : 'Generate Chapter Revision Notes'}
              </span>
            </button>
          </div>

          {/* Render Generated Notes */}
          {activeNotes && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-8 animate-fadeIn">
              {/* Note Header & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {translateSubject(activeNotes.subject)} · CBSE CLASS 12 (2026–27)
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {activeNotes.chapter}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyNotes}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Copy Markdown"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? (language === 'hi' ? 'कॉपी हो गया' : 'Copied!') : (language === 'hi' ? 'कॉपी' : 'Copy')}</span>
                  </button>

                  <button
                    onClick={handleSaveNotes}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isCurrentSaved
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isCurrentSaved ? 'fill-current' : ''}`} />
                    <span>
                      {isCurrentSaved
                        ? language === 'hi'
                          ? 'सुरक्षित'
                          : 'Saved'
                        : language === 'hi'
                        ? 'नोट्स सहेजें'
                        : 'Save Notes'}
                    </span>
                  </button>
                </div>
              </div>

              {/* 1. Chapter Overview */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>{language === 'hi' ? 'अध्याय सारांश (Chapter Overview)' : 'Core Conceptual Overview'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  {activeNotes.chapterSummary}
                </p>
              </div>

              {/* 2. Key Formulas */}
              {activeNotes.keyFormulas.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>{language === 'hi' ? 'महत्वपूर्ण सूत्र (High-Yield Formulas)' : 'Governing Formulas & Constants'}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeNotes.keyFormulas.map((f, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2"
                      >
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {f.name}
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 font-mono text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
                          {f.formula}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Variables:</span> {f.variables}
                        </div>
                        {f.examTip && (
                          <div className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl">
                            💡 <span className="font-bold">Exam Tip:</span> {f.examTip}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Core Theorems & Concepts */}
              {activeNotes.coreTheoremsAndConcepts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>{language === 'hi' ? 'मुख्य प्रमेय एवं नियम (Core Theorems)' : 'Core Theorems, Laws & Mechanisms'}</span>
                  </h3>
                  <div className="space-y-2.5">
                    {activeNotes.coreTheoremsAndConcepts.map((c, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-black text-slate-900 dark:text-white">
                            {c.title}
                          </span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                            {c.importance}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {c.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Common Board Traps */}
              {activeNotes.commonBoardTraps.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-rose-500 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>{language === 'hi' ? 'सामान्य बोर्ड गलतियां (Common Mistakes to Avoid)' : 'Classic CBSE Board Pitfalls'}</span>
                  </h3>
                  <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-2">
                    {activeNotes.commonBoardTraps.map((trap, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-rose-950 dark:text-rose-200">
                        <span className="text-rose-500 font-bold shrink-0">⚠️</span>
                        <span>{trap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Quick Revision Checklist */}
              {activeNotes.quickRevisionChecklist.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'hi' ? 'परीक्षा पूर्व त्वरित चेकलिस्ट' : 'Night-Before-Exam Sprint Checklist'}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeNotes.quickRevisionChecklist.map((item, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 font-medium"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
