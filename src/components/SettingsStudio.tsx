import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Globe, 
  Sun, 
  Moon, 
  MapPin, 
  Save, 
  RotateCcw 
} from 'lucide-react';
import { MarketType, LanguageCode } from '../types';
import { I18N_DICT } from '../data/i18n';

interface SettingsStudioProps {
  onBackToHome: () => void;
  market: MarketType;
  onMarketChange: (m: MarketType) => void;
  isDarkMode: boolean;
  onSetDarkMode: (isDark: boolean) => void;
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onSaveSettings: () => void;
  onResetDefaults: () => void;
}

export const SettingsStudio: React.FC<SettingsStudioProps> = ({
  onBackToHome,
  market,
  onMarketChange,
  isDarkMode,
  onSetDarkMode,
  currentLang,
  onLanguageChange,
  onSaveSettings,
  onResetDefaults
}) => {
  const [liveTime, setLiveTime] = useState('2026-09-19 14:00:00 AEST');
  const [selectedTimezone, setSelectedTimezone] = useState('AEST');
  const t = I18N_DICT[currentLang] || I18N_DICT.en;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(`${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString()} ${selectedTimezone}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [selectedTimezone]);

  return (
    <div id="view-settings" className="space-y-6 max-w-5xl mx-auto animate-in fade-in">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToHome}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.settings_page_title}
            </h1>
            <p className="text-xs text-slate-400">
              {t.settings_page_sub}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onResetDefaults}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.btn_reset_defaults}</span>
          </button>
          <button
            onClick={onSaveSettings}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t.btn_save_settings}</span>
          </button>
        </div>
      </div>

      {/* 4 Grid Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Timezone Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span>{t.setting_timezone_title}</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                {t.setting_timezone_sub}
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {liveTime}
            </span>
          </div>
          <select
            value={selectedTimezone}
            onChange={(e) => setSelectedTimezone(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
          >
            <option value="AEST">Australian Eastern Standard Time (AEST / Sydney, Melbourne, Brisbane)</option>
            <option value="ACST">Australian Central Standard Time (ACST / Adelaide)</option>
            <option value="AWST">Australian Western Standard Time (AWST / Perth)</option>
            <option value="NZST">New Zealand Standard Time (NZST / Auckland, Wellington)</option>
            <option value="UTC">Coordinated Universal Time (UTC)</option>
          </select>
        </div>

        {/* Language Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-orange-600" />
              <span>{t.setting_lang_title}</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              {t.setting_lang_sub}
            </p>
          </div>
          <select
            value={currentLang}
            onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
          >
            <option value="en">English (Default)</option>
            <option value="zh-TW">繁體中文 (Traditional Chinese)</option>
            <option value="zh-CN">简体中文 (Simplified Chinese)</option>
            <option value="ja">日本語 (Japanese)</option>
            <option value="es">Español (Spanish)</option>
            <option value="fr">Français (French)</option>
            <option value="ko">한국어 (Korean)</option>
            <option value="hi">हिन्दी (Hindi)</option>
          </select>
        </div>

        {/* Appearance Theme Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {t.setting_theme_title}
            </h4>
            <p className="text-[11px] text-slate-400">
              {t.setting_theme_sub}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onSetDarkMode(false)}
              className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition ${
                !isDarkMode
                  ? 'border-2 border-orange-600 bg-white text-slate-800'
                  : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Light Mode</span>
            </button>
            <button
              onClick={() => onSetDarkMode(true)}
              className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition ${
                isDarkMode
                  ? 'border-2 border-orange-600 bg-slate-900 text-white'
                  : 'border border-slate-200 dark:border-slate-700 bg-slate-900 text-white'
              }`}
            >
              <Moon className="w-4 h-4 text-orange-400" />
              <span>Dark Mode</span>
            </button>
          </div>
        </div>

        {/* Market Scope Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>{t.setting_region_title}</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              {t.setting_region_sub}
            </p>
          </div>
          <select
            value={market}
            onChange={(e) => onMarketChange(e.target.value as MarketType)}
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-orange-500"
          >
            <option value="All">All ANZ Markets (Australia + New Zealand)</option>
            <option value="Australia">Australia Focus Only</option>
            <option value="New Zealand">New Zealand Focus Only</option>
          </select>
        </div>
      </div>
    </div>
  );
};
