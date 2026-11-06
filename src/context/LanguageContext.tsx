import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['en']) => string;
  isKannada: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default language is Kannada per requirements
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('janaseva_lang');
    return (saved === 'en' || saved === 'kn') ? saved : 'kn';
  });

  useEffect(() => {
    localStorage.setItem('janaseva_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'kn' ? 'en' : 'kn'));
  };

  const t = (key: keyof typeof translations['en']): string => {
    const langDict = translations[language] || translations.kn;
    return (langDict[key] as string) || (translations.en[key] as string) || String(key);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isKannada: language === 'kn'
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
