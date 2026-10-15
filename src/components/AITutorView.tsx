import React, { useState, useEffect, useRef } from 'react';
import { SubjectId, TutorMessage, SavedDoubt } from '../types/quiz';
import { useLanguage } from '../context/LanguageContext';
import {
  getSavedDoubts,
  saveDoubt,
  deleteSavedDoubt,
} from '../utils/storage';
import {
  GraduationCap,
  Sparkles,
  Send,
  Image as ImageIcon,
  X,
  Copy,
  Check,
  Bookmark,
  BookOpen,
  Lightbulb,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  Trash2,
  HelpCircle,
  FileText,
  Calculator,
  Atom,
  FlaskConical,
} from 'lucide-react';

interface AITutorViewProps {
  initialSubject?: SubjectId;
  onNavigateHome?: () => void;
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  initialSubject = 'physics',
}) => {
  const { language, t, translateSubject } = useLanguage();

  const [selectedSubject, setSelectedSubject] = useState<SubjectId>(initialSubject);
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Image Upload State
  const [selectedImage, setSelectedImage] = useState<{
    file: File;
    previewUrl: string;
    base64: string;
    mimeType: string;
  } | null>(null);

  // Active View Tab: 'chat' | 'saved-doubts'
  const [activeTab, setActiveTab] = useState<'chat' | 'saved-doubts'>('chat');
  const [savedDoubts, setSavedDoubts] = useState<SavedDoubt[]>(() => getSavedDoubts());

  // Interactive Action Feedback
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [savedDoubtIds, setSavedDoubtIds] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Supported formats check: JPG, PNG, WEBP
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage(
        language === 'hi'
          ? 'कृपया JPG, PNG या WEBP प्रारूप की फोटो चुनें।'
          : 'Please select a valid image (JPG, PNG, or WEBP).'
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(
        language === 'hi'
          ? 'फोटो का आकार 5MB से कम होना चाहिए।'
          : 'Image size should be less than 5MB.'
      );
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      setSelectedImage({
        file,
        previewUrl: URL.createObjectURL(file),
        base64,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);

    // Reset input value so same image can be re-uploaded if desired
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    if (selectedImage?.previewUrl) {
      URL.revokeObjectURL(selectedImage.previewUrl);
    }
    setSelectedImage(null);
  };

  const handleSendMessage = async (customPrompt?: string, action?: 'explain_simply' | 'another_example' | 'explain_formula' | 'summarize') => {
    const textToSend = customPrompt ?? inputText.trim();
    if (!textToSend && !selectedImage) return;

    setErrorMessage(null);
    setIsLoading(true);

    const userMessageId = `msg-${Date.now()}`;
    const newUserMessage: TutorMessage = {
      id: userMessageId,
      role: 'user',
      content: textToSend || (language === 'hi' ? '[अपलोड की गई फोटो का प्रश्न]' : '[Uploaded Question Photo]'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: selectedSubject,
      action,
      imagePreview: selectedImage?.previewUrl,
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);

    // Clear input
    if (!customPrompt) {
      setInputText('');
    }

    // Save image ref for request, then clear
    const imagePayload = selectedImage ? { mimeType: selectedImage.mimeType, data: selectedImage.base64 } : undefined;
    setSelectedImage(null);

    try {
      // Build conversation history for API (last 6 messages)
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          question: textToSend,
          action: action || 'standard',
          conversationHistory: historyPayload,
          language,
          image: imagePayload,
        }),
      });

      const data = await res.json();

      if (data.success && data.answer) {
        const assistantMessage: TutorMessage = {
          id: `tutor-${Date.now()}`,
          role: 'assistant',
          content: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          subject: selectedSubject,
          action,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errText = data.error || (language === 'hi' ? 'उत्तर प्राप्त करने में त्रुटि हुई।' : 'Failed to generate tutor explanation.');
        setErrorMessage(errText);
      }
    } catch (err: any) {
      console.error('Tutor fetch error:', err);
      setErrorMessage(
        language === 'hi'
          ? 'नेटवर्क त्रुटि: AI ट्यूटर से संपर्क नहीं हो सका। कृपया इंटरनेट जांचें।'
          : 'Network error connecting to the AI Tutor. Please check your connection and retry.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (action: 'explain_simply' | 'another_example' | 'explain_formula' | 'summarize', baseText?: string) => {
    let actionQuery = '';
    if (action === 'explain_simply') {
      actionQuery = language === 'hi' ? 'कृपया इसे बहुत ही सरल और सहज उदाहरण के साथ समझाएं।' : 'Can you explain this concept in much simpler, everyday terms with an intuitive analogy?';
    } else if (action === 'another_example') {
      actionQuery = language === 'hi' ? 'कृपया इस विषय पर एक और बोर्ड परीक्षा शैली का उदाहरण हल सहित दें।' : 'Please solve another CBSE Class 12 board-style example on this exact topic with step-by-step calculations.';
    } else if (action === 'explain_formula') {
      actionQuery = language === 'hi' ? 'कृपया इसमें प्रयुक्त मुख्य सूत्र, उनके प्रतीक, मात्रक और अनुप्रयोग को विस्तार से समझाएं।' : 'Can you break down the governing formula in detail with symbol meanings, SI units, and application conditions?';
    } else if (action === 'summarize') {
      actionQuery = language === 'hi' ? 'कृपया अंतिम दोहराव के लिए इस उत्तर के 4-5 मुख्य बिंदुओं का संक्षिप्त सारांश दें।' : 'Please provide a 4-5 bullet point quick summary of this answer for last-minute revision.';
    }

    handleSendMessage(actionQuery, action);
  };

  const handleCopy = (message: TutorMessage) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(message.content);
    setCopiedMessageId(message.id);
    showToast(t.tutor.actionCopied);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSaveDoubt = (tutorMessage: TutorMessage) => {
    // Find preceding user question if available
    const msgIndex = messages.findIndex((m) => m.id === tutorMessage.id);
    const userMsg = msgIndex > 0 ? messages[msgIndex - 1] : null;
    const questionText = userMsg ? userMsg.content : `${translateSubject(selectedSubject)} Concept`;

    const newSaved: SavedDoubt = {
      id: `doubt-${Date.now()}`,
      subject: selectedSubject,
      question: questionText,
      answer: tutorMessage.content,
      savedAt: new Date().toISOString(),
      imagePreview: userMsg?.imagePreview,
    };

    saveDoubt(newSaved);
    setSavedDoubts(getSavedDoubts());
    setSavedDoubtIds((prev) => ({ ...prev, [tutorMessage.id]: true }));
    showToast(t.tutor.actionDoubtSaved);
  };

  const handleDeleteSaved = (id: string) => {
    deleteSavedDoubt(id);
    setSavedDoubts(getSavedDoubts());
  };

  const handleClearConversation = () => {
    setMessages([]);
    setErrorMessage(null);
    showToast(language === 'hi' ? 'बातचीत साफ़ की गई।' : 'Conversation cleared.');
  };

  // Subject quick suggested doubts
  const doubtMap: Record<SubjectId, string[]> = {
    mathematics: [
      t.tutor.mathsSample1,
      t.tutor.mathsSample2,
    ],
    physics: [
      t.tutor.physicsSample1,
      t.tutor.physicsSample2,
    ],
    chemistry: [
      t.tutor.chemSample1,
      t.tutor.chemSample2,
    ],
    science: [
      language === 'hi' ? 'प्रकाश संश्लेषण और श्वसन के बीच मुख्य अंतर क्या है?' : 'Explain the difference between aerobic and anaerobic respiration.',
      language === 'hi' ? 'ओम का नियम और इसका प्रायोगिक सत्यापन समझाइए।' : 'State Ohm\'s Law and explain the V-I characteristic graph.',
    ],
    social_science: [
      language === 'hi' ? 'भारतीय संघवाद की मुख्य विशेषताएं क्या हैं?' : 'What are the key features of federalism in India?',
      language === 'hi' ? 'सतत विकास क्या है और इसके उद्देश्य क्या हैं?' : 'Define sustainable development and explain resource planning.',
    ],
    english: [
      language === 'hi' ? 'संपादक को पत्र लिखने का सही प्रारूप क्या है?' : 'What is the format for writing a formal Letter to the Editor?',
      language === 'hi' ? '"A Letter to God" कहानी का मुख्य संदेश क्या है?' : 'Discuss the themes of faith and irony in "A Letter to God".',
    ],
  };
  const suggestedDoubts = doubtMap[selectedSubject] || doubtMap.mathematics;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border border-slate-700 dark:border-slate-300">
            <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              <GraduationCap className="w-4 h-4" />
              <span>{t.tutor.kicker}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NCERT Class 12 Master Teacher</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.tutor.pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            {t.tutor.pageSubtitle}
          </p>
        </div>

        {/* View Tabs: Live Chat vs Saved Doubts */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="inline-flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'chat'
                  ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t.tutor.chatTab}</span>
            </button>
            <button
              onClick={() => setActiveTab('saved-doubts')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'saved-doubts'
                  ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{t.tutor.savedDoubtsTab}</span>
              {savedDoubts.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300">
                  {savedDoubts.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'chat' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Chat Interface */}
          <div className="lg:col-span-8 space-y-4">
            {/* Subject Selector Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 transition-colors">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                <span>{t.tutor.subjectLabel}:</span>
                <div className="flex items-center gap-1.5">
                  {(
                    [
                      { id: 'mathematics', label: t.tutor.mathsOption, icon: <Calculator className="w-3.5 h-3.5" /> },
                      { id: 'physics', label: t.tutor.physicsOption, icon: <Atom className="w-3.5 h-3.5" /> },
                      { id: 'chemistry', label: t.tutor.chemistryOption, icon: <FlaskConical className="w-3.5 h-3.5" /> },
                    ] as const
                  ).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSubject(s.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedSubject === s.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {s.icon}
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {messages.length > 0 && (
                <button
                  onClick={handleClearConversation}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.tutor.clearChatBtn}</span>
                </button>
              )}
            </div>

            {/* Conversation Messages Container */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-4 sm:p-6 shadow-xs min-h-[460px] max-h-[640px] overflow-y-auto space-y-6 transition-colors">
              {messages.length === 0 ? (
                /* Empty state / Welcome prompt */
                <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                    <GraduationCap className="w-8 h-8" />
                  </div>

                  <div className="space-y-1 max-w-md">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {language === 'hi'
                        ? 'नमस्ते! मैं आपका सीबीएसई कक्षा 12 एआई ट्यूटर हूँ।'
                        : 'Hello! I am your CBSE Class 12 AI Personal Tutor.'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {language === 'hi'
                        ? 'गणित, भौतिकी या रसायन विज्ञान का कोई भी प्रश्न टाइप करें या फोटो अपलोड करें। मैं आपको चरणबद्ध तरीके से समझाऊंगा।'
                        : 'Type any numerical, reaction, derivation, or formula problem—or attach a photo. I will guide you through each step.'}
                    </p>
                  </div>

                  {/* Suggested questions chips */}
                  <div className="w-full max-w-lg pt-4 text-left space-y-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t.tutor.suggestedHeading} ({translateSubject(selectedSubject)}):</span>
                    </div>
                    <div className="space-y-2">
                      {suggestedDoubts.map((doubt, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInputText(doubt);
                          }}
                          className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 dark:bg-slate-900/60 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-950 dark:hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <span className="truncate pr-2">{doubt}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Message list */
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2 animate-fadeIn`}
                  >
                    {/* Role Pill & Timestamp */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 px-1">
                      {msg.role === 'user' ? (
                        <>
                          <span>{msg.timestamp}</span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {language === 'hi' ? 'आप' : 'You'}
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
                            <GraduationCap className="w-3.5 h-3.5" />
                            <span>BoardAce Tutor</span>
                          </div>
                          <span>• {msg.timestamp}</span>
                        </>
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`rounded-3xl p-4 sm:p-5 max-w-[90%] sm:max-w-[85%] text-xs sm:text-sm leading-relaxed shadow-xs transition-colors ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm'
                          : 'bg-slate-50 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-sm'
                      }`}
                    >
                      {/* Attached Image Preview if any */}
                      {msg.imagePreview && (
                        <div className="mb-3 rounded-2xl overflow-hidden border border-white/20 dark:border-slate-700 max-w-xs">
                          <img
                            src={msg.imagePreview}
                            alt="Question Upload"
                            className="w-full h-auto object-cover max-h-48"
                          />
                        </div>
                      )}

                      {/* Content text */}
                      <div className="whitespace-pre-line leading-relaxed space-y-2">
                        {msg.content}
                      </div>

                      {/* Action Bar for Assistant explanations */}
                      {msg.role === 'assistant' && (
                        <div className="pt-4 mt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
                          {/* Explain Simply */}
                          <button
                            onClick={() => handleAction('explain_simply', msg.content)}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            title={t.tutor.actionExplainSimply}
                          >
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                            <span>{t.tutor.actionExplainSimply}</span>
                          </button>

                          {/* Give Another Example */}
                          <button
                            onClick={() => handleAction('another_example', msg.content)}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            title={t.tutor.actionAnotherExample}
                          >
                            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                            <span>{t.tutor.actionAnotherExample}</span>
                          </button>

                          {/* Explain Formula */}
                          <button
                            onClick={() => handleAction('explain_formula', msg.content)}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            title={t.tutor.actionExplainFormula}
                          >
                            <Calculator className="w-3.5 h-3.5 text-violet-500" />
                            <span>{t.tutor.actionExplainFormula}</span>
                          </button>

                          {/* Summarize */}
                          <button
                            onClick={() => handleAction('summarize', msg.content)}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            title={t.tutor.actionSummarize}
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{t.tutor.actionSummarize}</span>
                          </button>

                          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

                          {/* Copy Answer */}
                          <button
                            onClick={() => handleCopy(msg)}
                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            title={t.tutor.actionCopy}
                          >
                            {copiedMessageId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600 font-bold">{t.tutor.actionCopied}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                                <span>{t.tutor.actionCopy}</span>
                              </>
                            )}
                          </button>

                          {/* Save Doubt */}
                          <button
                            onClick={() => handleSaveDoubt(msg)}
                            className={`px-2.5 py-1 rounded-lg font-semibold border transition-colors flex items-center gap-1 cursor-pointer ${
                              savedDoubtIds[msg.id]
                                ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-300 text-indigo-700 dark:text-indigo-300 font-bold'
                                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                            title={t.tutor.actionSaveDoubt}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${savedDoubtIds[msg.id] ? 'fill-current' : ''}`} />
                            <span>{savedDoubtIds[msg.id] ? t.tutor.actionDoubtSaved : t.tutor.actionSaveDoubt}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex flex-col items-start space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-[11px] text-indigo-600 dark:text-indigo-400 font-bold px-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>BoardAce Tutor</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/80 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 max-w-sm space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {t.tutor.loadingTitle}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-8">
                      {t.tutor.loadingStep1}
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message Box */}
              {errorMessage && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/50 rounded-2xl border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-3 animate-fadeIn">
                  <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold">{language === 'hi' ? 'संदेह समाधान में समस्या:' : 'Tutor Encountered an Issue:'}</div>
                    <p className="leading-relaxed">{errorMessage}</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-4 shadow-xs space-y-3 transition-colors">
              {/* Selected Image Preview Thumbnail */}
              {selectedImage && (
                <div className="relative inline-block border border-indigo-200 dark:border-indigo-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 p-1 animate-fadeIn">
                  <img
                    src={selectedImage.previewUrl}
                    alt="Preview"
                    className="h-20 w-auto rounded-xl object-contain"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-full hover:bg-rose-700 shadow-md cursor-pointer"
                    title={t.tutor.removePhotoBtn}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Textarea + Action buttons */}
              <div className="flex items-end gap-2">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={messages.length > 0 ? t.tutor.followUpPlaceholder : t.tutor.inputPlaceholder}
                  rows={2}
                  disabled={isLoading}
                  className="flex-1 p-3 text-xs sm:text-sm rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none transition-all placeholder:text-slate-400"
                />

                {/* Image Upload Input & Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title={t.tutor.uploadPhotoBtn}
                  aria-label={t.tutor.uploadPhotoBtn}
                  disabled={isLoading}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shrink-0 disabled:opacity-40"
                >
                  <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </button>

                {/* Send Button */}
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || (!inputText.trim() && !selectedImage)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-40 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.tutor.sendBtn}</span>
                </button>
              </div>

              {/* Disclaimer */}
              <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between px-1">
                <span>{t.tutor.disclaimer}</span>
                <span className="hidden sm:inline">Press Enter to send</span>
              </div>
            </div>
          </div>

          {/* Right Column: Tutoring Guide & Syllabus Anchors */}
          <div className="lg:col-span-4 space-y-6">
            {/* Subject Mastery Tips */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 shadow-xs space-y-4 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {translateSubject(selectedSubject)} {language === 'hi' ? 'विशेषज्ञ मार्गदर्शन' : 'Board Guidelines'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    CBSE Session 2026–27
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2.5 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-700">
                {selectedSubject === 'mathematics' && (
                  <>
                    <p>• <strong>Calculus Working:</strong> Write differential or integral formulas before substituting limits.</p>
                    <p>• <strong>Vectors & 3D:</strong> Clearly state position vectors and directional cosines.</p>
                    <p>• <strong>Matrices:</strong> Verify row/column operations step-by-step to prevent arithmetic sign errors.</p>
                  </>
                )}
                {selectedSubject === 'physics' && (
                  <>
                    <p>• <strong>Explicit SI Units:</strong> Every final numerical value must state units (Tesla, Farad, Volt, Ohm, etc.).</p>
                    <p>• <strong>Sign Conventions:</strong> State Cartesian sign conventions in Ray Optics and Electrostatics.</p>
                    <p>• <strong>Derivations:</strong> State initial assumptions and physical laws before algebraic steps.</p>
                  </>
                )}
                {selectedSubject === 'chemistry' && (
                  <>
                    <p>• <strong>Reaction Conditions:</strong> Mention catalysts, temperature, and medium (dilute/concentrated) for organic reactions.</p>
                    <p>• <strong>Nernst Calculations:</strong> Pay close attention to number of electrons $n$ and logarithmic quotients.</p>
                    <p>• <strong>Coordination Compounds:</strong> State ligand field strength and IUPAC naming order.</p>
                  </>
                )}
              </div>
            </div>

            {/* Quick Actions Guide */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 shadow-xs space-y-4 transition-colors">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                <span>{language === 'hi' ? 'ट्यूटर के मुख्य टूल्स' : 'Available AI Tutor Actions'}</span>
              </h3>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-md bg-amber-50 dark:bg-amber-950/70 text-amber-600 shrink-0">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white">{t.tutor.actionExplainSimply}:</strong>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Breaks down difficult concepts into simple everyday language.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/70 text-blue-600 shrink-0">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white">{t.tutor.actionAnotherExample}:</strong>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Provides fresh solved CBSE examination questions on this topic.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-md bg-violet-50 dark:bg-violet-950/70 text-violet-600 shrink-0">
                    <Calculator className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white">{t.tutor.actionExplainFormula}:</strong>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Explains all symbols, SI units, and rearrangement formulas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white">{t.tutor.actionSummarize}:</strong>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Extracts 4-5 bullet revision takeaways for quick memory refresh.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Saved Doubts View */
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 shadow-xs flex items-center justify-between transition-colors">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>{t.tutor.savedDoubtsTab}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'hi'
                  ? 'आपके द्वारा सहेजे गए सभी ट्यूटर उत्तर आपके ब्राउज़र में सुरक्षित हैं।'
                  : 'All questions and step-by-step solutions saved from your tutoring sessions.'}
              </p>
            </div>
          </div>

          {savedDoubts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {savedDoubts.map((doubt) => (
                <div
                  key={doubt.id}
                  className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 shadow-xs transition-colors space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
                          {translateSubject(doubt.subject)}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(doubt.savedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white pt-1">
                        {doubt.question}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleDeleteSaved(doubt.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                      title="Delete Saved Doubt"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {doubt.imagePreview && (
                    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-w-sm">
                      <img src={doubt.imagePreview} alt="Saved Question" className="w-full h-auto max-h-48 object-cover" />
                    </div>
                  )}

                  {/* Solution block */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                    {doubt.answer}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center space-y-3 transition-colors">
              <Bookmark className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {t.tutor.noSavedDoubtsTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {t.tutor.noSavedDoubtsDesc}
              </p>
              <button
                onClick={() => setActiveTab('chat')}
                className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'hi' ? 'संदेह पूछें' : 'Ask a Doubt Now'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
