import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import './CustomLanguageSwitcher.css';

const CustomLanguageSwitcher = ({ variant = 'navbar' }) => {
  const [currentLang, setCurrentLang] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'hi', label: 'Hindi', short: 'HI' },
    { code: 'gu', label: 'Gujarati', short: 'GU' }
  ];

  // Try to sync with Google Translate's actual state
  useEffect(() => {
    const checkLang = setInterval(() => {
      const selectEl = document.querySelector('.goog-te-combo');
      if (selectEl) {
        if (selectEl.value) {
          setCurrentLang(selectEl.value);
        } else {
          // Empty string in select means default language (English)
          setCurrentLang('en');
        }
      }
    }, 1000);
    return () => clearInterval(checkLang);
  }, []);

  const changeLanguage = (langCode) => {
    setCurrentLang(langCode);
    setIsOpen(false);
    
    // Find the hidden Google Translate select dropdown
    const selectEl = document.querySelector('.goog-te-combo');
    if (selectEl) {
      // If default language is English and not in the options, Google uses empty string '' to revert
      if (langCode === 'en' && !Array.from(selectEl.options).some(opt => opt.value === 'en')) {
        selectEl.value = '';
      } else {
        selectEl.value = langCode;
      }
      selectEl.dispatchEvent(new Event('change', { bubbles: true })); 
    } else {
      // Fallback if Google Translate hasn't fully loaded yet
      const domain = window.location.hostname;
      document.cookie = `googtrans=/en/${langCode === 'en' ? 'en' : langCode}; path=/;`;
      if (domain !== 'localhost') {
        document.cookie = `googtrans=/en/${langCode === 'en' ? 'en' : langCode}; path=/; domain=${domain};`;
      }
      window.location.reload();
    }
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest('.custom-lang-switcher-container')) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const selectedLangObj = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <div className={`custom-lang-switcher-container ${variant}`}>
      <button 
        className="lang-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Change Language"
      >
        <Globe size={18} className="lang-icon" />
        <span className="lang-text">{selectedLangObj.short}</span>
        <span className="lang-caret">▾</span>
      </button>

      {isOpen && (
        <div className="lang-dropdown-menu">
          {languages.map(lang => (
            <div 
              key={lang.code}
              className={`lang-option ${currentLang === lang.code ? 'active' : ''}`}
              onClick={() => changeLanguage(lang.code)}
            >
              {lang.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomLanguageSwitcher;
