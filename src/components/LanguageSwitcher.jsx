'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('TR - Türkçe');
  const { t } = useTranslation();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLanguageChange = (languageCode, languageName) => {
    setSelectedLanguage(languageName);
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
    toast.success(t('language_changed'));
  };

  return (
    <div className="language-switcher">
      <div className="dropdown" onClick={toggleDropdown}>
        <span>{selectedLanguage}</span>
        <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
          <div className="dropdown-item" onClick={() => handleLanguageChange('tr', 'TR - Türkçe')}>
            Türkçe
          </div>
          <div className="dropdown-item" onClick={() => handleLanguageChange('en', 'EN - English')}>
            English
          </div>
          <div className="dropdown-item" onClick={() => handleLanguageChange('de', 'DE - German')}>
            German
          </div>
        </div>
      </div>
    </div>
  );
}

export default LanguageSwitcher;