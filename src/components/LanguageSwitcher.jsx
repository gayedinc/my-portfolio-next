'use client';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

export function LanguageSwitcher() {
  const languageOptions = {
    tr: 'TR - Türkçe',
    en: 'EN - English',
    de: 'DE - Deutsch',
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[i18n.language] || languageOptions.tr);
  const { t } = useTranslation();
  const switcherRef = useRef(null);

  useEffect(() => {
    setSelectedLanguage(languageOptions[i18n.language] || languageOptions.tr);
  }, [i18n.language]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!switcherRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLanguageChange = (languageCode, languageName) => {
    setSelectedLanguage(languageName);
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    toast.success(t('language_changed'));
  };

  return (
    <div className="language-switcher" ref={switcherRef}>
      <button type="button" className="dropdown" onClick={toggleDropdown}>
        <span>{selectedLanguage}</span>
        <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
          <button type="button" className="dropdown-item" onClick={() => handleLanguageChange('tr', languageOptions.tr)}>
            Türkçe
          </button>
          <button type="button" className="dropdown-item" onClick={() => handleLanguageChange('en', languageOptions.en)}>
            English
          </button>
          <button type="button" className="dropdown-item" onClick={() => handleLanguageChange('de', languageOptions.de)}>
            German
          </button>
        </div>
      </button>
    </div>
  );
}

export default LanguageSwitcher;