import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations, TRANSLATIONS, SUBJECT_TRANSLATIONS, CHAPTER_TRANSLATIONS } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
  translateSubject: (subjectId: string) => string;
  translateChapter: (chapterName: string) => string;
}

const LANGUAGE_KEY = 'boardace_preferred_lang_v1';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY);
      if (saved === 'hi' || saved === 'en') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_KEY, lang);
    } catch (e) {
      console.warn('Could not save language to localStorage', e);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const translateSubject = (subjectId: string): string => {
    const key = String(subjectId).toLowerCase();
    const sub = SUBJECT_TRANSLATIONS[key];
    if (!sub) return subjectId;
    return language === 'hi' ? sub.nameHi : sub.nameEn;
  };

  const translateChapter = (chapterName: string): string => {
    if (chapterName === 'all' || chapterName === 'All Chapters (Full Syllabus Mock)') {
      return t.config.allChapters;
    }
    if (language === 'hi' && CHAPTER_TRANSLATIONS[chapterName]) {
      return CHAPTER_TRANSLATIONS[chapterName];
    }
    return chapterName;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        translateSubject,
        translateChapter,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
