import React, { useState, useRef, useEffect } from 'react';
import { 
  Car, 
  Bot, 
  Globe, 
  ChevronDown, 
  Sun, 
  Moon,
  Settings 
} from 'lucide-react';
import { LanguageCode } from '../types';
import { I18N_DICT } from '../data/i18n';

interface HeaderProps {
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAIChat: () => void;
  onNavigate: (route: string) => void;
}

const LANGUAGES: { code: LanguageCode; label: string; badge: string }[] = [
  { code: 'en', label: 'English', badge: 'EN' },
  { code: 'zh-TW', label: '繁體中文', badge: 'TW' },
  { code: 'zh-CN', label: '简体中文', badge: 'CN' },
  { code: 'ja', label: '日本語', badge: 'JA' },
  { code: 'es', label: 'Español', badge: 'ES' },
  { code: 'fr', label: 'Français', badge: 'FR' },
  { code: 'ko', label: '한국어', badge: 'KO' },
  { code: 'hi', label: 'हिन्दी', badge: 'HI' }
];

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  isDarkMode,
  onToggleDarkMode,
  onOpenAIChat,
  onNavigate
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = I18N_DICT[currentLang] || I18N_DICT.en;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white flex items-center justify-between px-4 sm:px-6 z-30 shrink-0 shadow-sm">
      {/* Brand / Workspace Switcher */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-black text-white text-base shadow-sm">
          <Car className="w-4 h-4 text-white" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">{t.workspace_title}</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-950/80 dark:text-orange-300 font-semibold border border-orange-200 dark:border-orange-800/50">
            ANZ Hub
          </span>
        </div>
      </div>

      {/* Right Controls: Language Dropdown, Dark/Light, Settings, User Profile */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Language Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="lang-btn"
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition shadow-sm text-xs font-medium cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-orange-500" />
            <span>{currentLang.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 z-50 text-xs animate-in fade-in zoom-in-95">
              {LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    onLanguageChange(item.code);
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ${
                    currentLang === item.code ? 'font-bold text-orange-600 dark:text-orange-400' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] text-slate-400">{item.badge}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Switcher Button */}
        <button
          id="theme-toggle-btn"
          onClick={onToggleDarkMode}
          className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition cursor-pointer relative"
          title="Toggle Light/Dark Theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-orange-500"></span>
        </button>

        {/* Settings Button */}
        <button
          id="settings-toggle-btn"
          onClick={() => onNavigate('settings')}
          className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition cursor-pointer"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div 
            id="user-profile-avatar"
            className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-200 dark:ring-slate-700 select-none cursor-pointer"
            title="Liam Vance"
          >
            <span>LV</span>
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Liam Vance</div>
            <div className="text-[10px] text-slate-400">ANZ Marketing Lead</div>
          </div>
        </div>
      </div>
    </header>
  );
};
