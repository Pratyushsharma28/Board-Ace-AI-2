import React, { useState } from 'react';
import { Question, MistakeAnalysis } from '../types/quiz';
import {
  classifyMistake,
  getRevisionTip,
  getSubjectSpecificBreakdown,
  MISTAKE_CATEGORY_HI
} from '../utils/mistakeDetective';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Send,
  Sparkles,
  BookOpen,
  X
} from 'lucide-react';

interface MistakeDetectiveModalProps {
  question: Question;
  selectedAnswer: string;
  onClose: () => void;
  onPracticeTopic?: (topic: string, chapter: string, subject: string) => void;
}

export const MistakeDetectiveModal: React.FC<MistakeDetectiveModalProps> = ({
  question,
  selectedAnswer,
  onClose,
  onPracticeTopic,
}) => {
  const { language, t, translateSubject, translateChapter } = useLanguage();
  const [activeTab, setActiveTab] = useState<'breakdown' | 'interactive' | 'aiChat'>('breakdown');
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<MistakeAnalysis | null>(null);
  const [customQuery, setCustomQuery] = useState('');
  const [followUpAnswer, setFollowUpAnswer] = useState<string | null>(null);
  const [followUpSubmitted, setFollowUpSubmitted] = useState(false);

  const category = classifyMistake(question, selectedAnswer);
  const categoryLabel = language === 'hi' && MISTAKE_CATEGORY_HI[category] ? MISTAKE_CATEGORY_HI[category] : category;

  const revisionTip = getRevisionTip(question, category);
  const subjectBreakdown = getSubjectSpecificBreakdown(question);

  const isHindiQ = language === 'hi' && Boolean(question.questionHi);
  const displayQText = isHindiQ ? question.questionHi! : question.question;
  const displayExpl = isHindiQ && question.explanationHi ? question.explanationHi : question.explanation;

  const defaultConcept = displayExpl.split('.')[0] + '.';
  const defaultPitfall = (isHindiQ && question.pitfallHi) || question.pitfall || (
    language === 'hi'
      ? 'छात्र अक्सर चिह्न परिपाटी में जल्दबाजी करते हैं या विद्युत क्षेत्र को विभव के साथ भ्रमित कर देते हैं।'
      : 'Students often rush through sign conventions or confuse field with potential.'
  );
  const defaultTip = (isHindiQ && question.boardTipHi) || revisionTip || question.boardTip || (
    language === 'hi'
      ? 'प्रश्न को ध्यानपूर्वक पढ़ें कि बोर्ड सदिश राशि पूछ रहा है या अदिश परिमाण।'
      : 'Read the question stem twice to identify whether the board is asking for a vector quantity or scalar magnitude.'
  );

  const handleFetchAiDeepDive = async (queryText?: string) => {
    setLoadingAi(true);
    try {
      const res = await fetch('/api/mistake-deepdive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: displayQText,
          options: (isHindiQ && question.optionsHi) || question.options,
          selectedAnswer,
          correctAnswer: (isHindiQ && question.correctAnswerHi) || question.correctAnswer,
          explanation: displayExpl,
          subject: question.subject,
          chapter: question.chapter,
          topic: question.topic,
          language: language,
          studentQuery: queryText || customQuery,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAiAnalysis(data.analysis);
        if (queryText || customQuery) {
          setActiveTab('aiChat');
        }
      }
    } catch (err) {
      console.error('Error fetching deep dive', err);
    } finally {
      setLoadingAi(false);
    }
  };

  const currentAnalysis: MistakeAnalysis = aiAnalysis || {
    coreConcept: defaultConcept,
    whyCorrectIsRight: displayExpl,
    whySelectedIsWrong: language === 'hi'
      ? `एक सामान्य परीक्षा जाल "${selectedAnswer}" का चयन करना है। ${defaultPitfall}`
      : `A common board exam trap is selecting "${selectedAnswer}". ${defaultPitfall}`,
    memoryAnchor: defaultTip,
    followUpQuestion: {
      question: language === 'hi'
        ? `पुष्टि प्रश्न: ${translateChapter(question.chapter)} में, ${question.topic} के संबंध में कौन सा कथन सत्य है?`
        : `Check-in: In ${question.chapter}, which statement regarding ${question.topic} is true?`,
      options: [
        `Statement aligned with ${question.correctAnswer}`,
        `A tempting statement that inverts the relationship`,
        `A statement assuming ideal conditions never hold`,
        `A statement confusing scalar with vector effects`
      ],
      correctAnswer: `Statement aligned with ${question.correctAnswer}`,
      explanation: `Consistent with board exam principles, remember that ${defaultConcept}`
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-3xl w-full border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/90 flex items-center justify-center text-violet-100 shadow-sm">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-lg text-white">{t.mistake.title}</span>
                <span className="text-[10px] font-bold bg-violet-500/30 text-violet-200 border border-violet-400/30 px-2 py-0.5 rounded-md">
                  {categoryLabel}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                {translateSubject(question.subject)} · {translateChapter(question.chapter)} · {question.topic}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question & Comparison Banner */}
        <div className="p-6 bg-slate-50 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-700 space-y-3 transition-colors">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {language === 'hi' ? 'परीक्षित बोर्ड प्रश्न' : 'Exam Question Under Review'}
          </div>
          <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
            {displayQText}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-red-50/80 dark:bg-rose-950/40 border border-red-200 dark:border-rose-900/60 rounded-xl flex items-start gap-2.5">
              <XCircle className="w-5 h-5 text-red-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-red-800 dark:text-rose-300">{language === 'hi' ? 'आपका चयन' : 'Your Selection'}</div>
                <div className="text-xs text-red-900 dark:text-rose-200 font-bold mt-0.5">{selectedAnswer || (language === 'hi' ? 'उत्तर नहीं दिया' : 'Not answered')}</div>
              </div>
            </div>
            <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">{language === 'hi' ? 'बोर्ड-प्रमाणित सही उत्तर' : 'Board Correct Answer'}</div>
                <div className="text-xs text-emerald-900 dark:text-emerald-200 font-bold mt-0.5">{question.correctAnswer}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors">
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'breakdown'
                ? 'border-violet-600 dark:border-violet-400 text-violet-700 dark:text-violet-300'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {language === 'hi' ? 'अवधारणा विश्लेषण' : 'Concept Breakdown'}
          </button>
          <button
            onClick={() => setActiveTab('interactive')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-colors border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'interactive'
                ? 'border-violet-600 dark:border-violet-400 text-violet-700 dark:text-violet-300'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {language === 'hi' ? 'अवधारणा पुष्टि प्रश्न' : 'Check-in Drill Question'}
          </button>
          <button
            onClick={() => {
              setActiveTab('aiChat');
              if (!aiAnalysis && !loadingAi) {
                handleFetchAiDeepDive();
              }
            }}
            className={`pb-3 text-xs sm:text-sm font-bold transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'aiChat'
                ? 'border-violet-600 dark:border-violet-400 text-violet-700 dark:text-violet-300'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            <span>{language === 'hi' ? 'AI शिक्षक से समझें' : 'AI Deep-Dive Teacher'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'breakdown' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Core Concept */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-violet-900 dark:text-violet-300 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  {t.mistake.coreConcept}
                </div>
                <div className="p-4 bg-violet-50/50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/60 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {currentAnalysis.coreConcept}
                </div>
              </div>

              {/* The Board Trap / Pitfall */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  {t.mistake.whySelectedWrong}
                </div>
                <div className="p-4 bg-amber-50/50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  {currentAnalysis.whySelectedIsWrong}
                </div>
              </div>

              {/* Step-by-Step Proof */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {t.mistake.whyCorrect}
                </div>
                <div className="p-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {currentAnalysis.whyCorrectIsRight}
                </div>
              </div>

              {/* Memory Anchor */}
              {currentAnalysis.memoryAnchor && (
                <div className="p-4 bg-slate-900 dark:bg-slate-950 text-white rounded-2xl space-y-1">
                  <div className="text-xs font-semibold text-violet-300">
                    {t.mistake.memoryAnchor}
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed">
                    {currentAnalysis.memoryAnchor}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'interactive' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 bg-violet-50/60 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/60 rounded-2xl text-xs text-violet-900 dark:text-violet-200 leading-relaxed">
                {t.mistake.followUpDesc}
              </div>

              {currentAnalysis.followUpQuestion && (
                <div className="space-y-4">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                    {currentAnalysis.followUpQuestion.question}
                  </div>

                  <div className="space-y-2">
                    {currentAnalysis.followUpQuestion.options.map((opt, idx) => {
                      const isSelected = followUpAnswer === opt;
                      const isCorrect = opt === currentAnalysis.followUpQuestion?.correctAnswer;
                      let btnStyle = 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200';

                      if (followUpSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'border-rose-400 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200';
                        }
                      } else if (isSelected) {
                        btnStyle = 'border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-950 dark:text-indigo-200 font-bold';
                      }

                      return (
                        <button
                          key={idx}
                          disabled={followUpSubmitted}
                          onClick={() => setFollowUpAnswer(opt)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {!followUpSubmitted ? (
                    <button
                      disabled={!followUpAnswer}
                      onClick={() => setFollowUpSubmitted(true)}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      {language === 'hi' ? 'उत्तर की पुष्टि करें' : 'Confirm Check-in Answer'}
                    </button>
                  ) : (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                      <div className="font-bold">{language === 'hi' ? 'स्पष्टीकरण:' : 'Explanation:'}</div>
                      <p>{currentAnalysis.followUpQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'aiChat' && (
            <div className="space-y-5 animate-fadeIn">
              {loadingAi ? (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.mistake.analyzing}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      {t.mistake.askTeacher}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customQuery}
                        onChange={(e) => setCustomQuery(e.target.value)}
                        placeholder={t.mistake.askPlaceholder}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && customQuery.trim()) {
                            handleFetchAiDeepDive(customQuery);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleFetchAiDeepDive(customQuery)}
                        disabled={!customQuery.trim()}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{t.mistake.askBtn}</span>
                      </button>
                    </div>
                  </div>

                  {aiAnalysis && (
                    <div className="space-y-3 pt-2">
                      <div className="p-4 bg-violet-50/70 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/60 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                        <div className="font-bold text-violet-950 dark:text-violet-200 mb-1">{t.mistake.coreConcept}</div>
                        {aiAnalysis.coreConcept}
                      </div>

                      <div className="p-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                        <div className="font-bold text-slate-900 dark:text-white mb-1">{t.mistake.whyCorrect}</div>
                        {aiAnalysis.whyCorrectIsRight}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/70 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'hi' ? 'NCERT 2026-27 पाठ्यक्रम आधारित' : 'Aligned with NCERT 2026-27 syllabus'}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            {t.mistake.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
