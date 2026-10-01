import React, { useState, useRef, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Layers, 
  Smartphone, 
  Ticket, 
  Megaphone, 
  Calendar as CalendarIcon, 
  Search, 
  Eye, 
  X 
} from 'lucide-react';
import { MarketType, PlatformType, PeriodType, LanguageCode } from '../types';
import { CITY_COUNTRY_MAP, ALL_CITIES } from '../data/mockData';
import { I18N_DICT } from '../data/i18n';

interface FilterEngineProps {
  market: MarketType;
  onMarketChange: (m: MarketType) => void;
  selectedCities: string[];
  removedCities: string[];
  onRemoveCity: (city: string) => void;
  onRestoreCity: (city: string) => void;
  onSelectAllCities: () => void;
  onClearAllCities: () => void;
  onRestoreAllCities: () => void;
  platform: PlatformType;
  onPlatformChange: (p: PlatformType) => void;
  period: PeriodType;
  onPeriodChange: (p: PeriodType) => void;
  customStartDate: string | null;
  customEndDate: string | null;
  onApplyCustomDate: (start: string, end: string) => void;
  onClearCustomDate: () => void;
  keyword: string;
  onKeywordChange: (kw: string) => void;
  minShows: number;
  onMinShowsChange: (val: number) => void;
  onResetAllFilters: () => void;
  currentLang: LanguageCode;
  allCampaignNames?: string[];
}

export const FilterEngine: React.FC<FilterEngineProps> = ({
  market,
  onMarketChange,
  selectedCities,
  removedCities,
  onRemoveCity,
  onRestoreCity,
  onSelectAllCities,
  onClearAllCities,
  onRestoreAllCities,
  platform,
  onPlatformChange,
  period,
  onPeriodChange,
  customStartDate,
  customEndDate,
  onApplyCustomDate,
  onClearCustomDate,
  keyword,
  onKeywordChange,
  minShows,
  onMinShowsChange,
  onResetAllFilters,
  currentLang,
  allCampaignNames = []
}) => {
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(customStartDate || '2025-07-01');
  const [tempEndDate, setTempEndDate] = useState(customEndDate || '2026-08-13');
  const popoverRef = useRef<HTMLDivElement>(null);
  const t = I18N_DICT[currentLang] || I18N_DICT.en;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setDatePopoverOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePresetSelect = (preset: string) => {
    if (!preset) return;
    const end = new Date(2026, 7, 13); // August 13, 2026
    const start = new Date(end);

    if (preset === '1w') start.setDate(end.getDate() - 7);
    else if (preset === '3m') start.setMonth(end.getMonth() - 3);
    else if (preset === '6m') start.setMonth(end.getMonth() - 6);
    else if (preset === '1y') start.setFullYear(end.getFullYear() - 1);
    else if (preset === '3y') start.setFullYear(end.getFullYear() - 3);
    else if (preset === 'all') {
      setTempStartDate('2025-07-01');
      setTempEndDate('2026-08-13');
      return;
    }

    setTempStartDate(start.toISOString().split('T')[0]);
    setTempEndDate(end.toISOString().split('T')[0]);
  };

  const handleApplyDateRange = () => {
    if (!tempStartDate || !tempEndDate) return;
    onApplyCustomDate(tempStartDate, tempEndDate);
    setDatePopoverOpen(false);
  };

  // Filter cities by current market
  const visibleSelectedCities = market === 'All' 
    ? selectedCities 
    : selectedCities.filter(c => CITY_COUNTRY_MAP[c] === market);

  const visibleRemovedCities = market === 'All'
    ? removedCities
    : removedCities.filter(c => CITY_COUNTRY_MAP[c] === market);

  return (
    <section id="filter-engine" className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600" />
          <span>{t.filter_engine_title}</span>
        </h3>
        <button
          onClick={onResetAllFilters}
          className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:underline cursor-pointer"
        >
          {t.reset_filters_btn}
        </button>
      </div>

      {/* Filter 1: Market */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
          {t.filter_market_label}
        </label>
        <div className="flex items-center space-x-2">
          {(['All', 'Australia', 'New Zealand'] as MarketType[]).map((m) => {
            const isCurrent = market === m;
            const label = m === 'All' ? t.market_all : m === 'Australia' ? 'AU' : 'NZ';
            return (
              <button
                key={m}
                onClick={() => onMarketChange(m)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isCurrent
                    ? 'bg-orange-600 text-white shadow-sm font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter 2: City */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
            {t.filter_city_label}
          </label>
          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={onSelectAllCities}
              className="text-orange-600 dark:text-orange-400 hover:underline font-medium cursor-pointer"
            >
              {t.select_all_btn}
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={onClearAllCities}
              className="text-slate-500 hover:underline font-medium cursor-pointer"
            >
              {t.clear_all_btn}
            </button>
          </div>
        </div>

        {/* Selected City Chips Container */}
        <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 min-h-[46px] items-center">
          {visibleSelectedCities.length === 0 ? (
            <span className="text-xs text-slate-400 italic">No cities selected. Click restore or select all.</span>
          ) : (
            visibleSelectedCities.map((city) => (
              <span
                key={city}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-orange-600 text-white shadow-sm"
              >
                <span>{city}</span>
                <button
                  onClick={() => onRemoveCity(city)}
                  className="text-orange-200 hover:text-white font-bold ml-1 cursor-pointer"
                  title={`Remove ${city}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>

        {/* Removed Cities Recovery Row */}
        {visibleRemovedCities.length > 0 && (
          <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2 pt-1">
            <span className="font-medium text-slate-400 flex items-center gap-1">
              <RotateCcw className="w-3 h-3" /> {t.click_to_restore_label}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {visibleRemovedCities.map((city) => (
                <button
                  key={city}
                  onClick={() => onRestoreCity(city)}
                  className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer"
                >
                  + {city}
                </button>
              ))}
            </div>
            <button
              onClick={onRestoreAllCities}
              className="text-orange-600 hover:underline ml-2 text-[11px] font-bold cursor-pointer"
            >
              {t.restore_all_btn}
            </button>
          </div>
        )}
      </div>

      {/* Filter 3: Type / Platform */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
          {t.filter_platform_label}
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'All', label: t.platform_all, icon: Layers },
            { id: 'In-App Ads', label: t.platform_inapp, icon: Smartphone },
            { id: 'Promo Codes', label: t.platform_promo, icon: Ticket },
            { id: 'Communications', label: t.platform_comm, icon: Megaphone }
          ].map((item) => {
            const isCurrent = platform === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onPlatformChange(item.id as PlatformType)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-orange-600 text-white shadow-sm font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter 4: Reporting Period */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
          {t.filter_period_label}
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'Daily', label: t.period_daily },
            { id: 'Weekly', label: t.period_weekly },
            { id: 'Fortnightly', label: t.period_fortnightly },
            { id: 'Monthly', label: t.period_monthly },
            { id: 'Quarterly', label: t.period_quarterly },
            { id: 'Biannual', label: t.period_biannual },
            { id: 'Yearly', label: t.period_yearly },
            { id: 'All Time', label: t.opt_all }
          ].map((item) => {
            const isCurrent = period === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPeriodChange(item.id as PeriodType)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  isCurrent
                    ? 'bg-orange-600 text-white shadow-sm font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Custom Date Range Popover Button */}
          <div className="relative" ref={popoverRef}>
            <button
              id="custom-date-trigger-btn"
              onClick={() => setDatePopoverOpen(!datePopoverOpen)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border border-dashed transition flex items-center gap-1.5 cursor-pointer ${
                period === 'Custom'
                  ? 'border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-900/30'
                  : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-orange-500 hover:text-orange-600'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>
                {customStartDate && customEndDate
                  ? `${customStartDate} → ${customEndDate}`
                  : t.period_custom_range}
              </span>
            </button>

            {/* Popover Window */}
            {datePopoverOpen && (
              <div
                id="custom-date-popover"
                className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-40 space-y-3 animate-in fade-in"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {t.custom_date_title}
                  </span>
                  <button
                    onClick={() => setDatePopoverOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    &times;
                  </button>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    {t.start_date_label}
                  </label>
                  <input
                    type="date"
                    value={tempStartDate}
                    onChange={(e) => setTempStartDate(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    {t.end_date_label}
                  </label>
                  <input
                    type="date"
                    value={tempEndDate}
                    onChange={(e) => setTempEndDate(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  />
                </div>
                {/* Quick Preset Dropdown */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    {t.quick_preset_label}
                  </label>
                  <select
                    onChange={(e) => handlePresetSelect(e.target.value)}
                    defaultValue=""
                    className="w-full text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    <option value="">{t.opt_select_interval}</option>
                    <option value="1w">{t.opt_1w}</option>
                    <option value="3m">{t.opt_3m}</option>
                    <option value="6m">{t.opt_6m}</option>
                    <option value="1y">{t.opt_1y}</option>
                    <option value="3y">{t.opt_3y}</option>
                    <option value="all">{t.opt_all}</option>
                  </select>
                </div>
                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      onClearCustomDate();
                      setDatePopoverOpen(false);
                    }}
                    className="px-2.5 py-1 rounded-lg text-[11px] text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    {t.btn_clear}
                  </button>
                  <button
                    onClick={handleApplyDateRange}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-sm cursor-pointer"
                  >
                    {t.btn_apply_date_range}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter 5 & 6: Keyword Search & Shows Amount */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            {t.keyword_search_label}
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              list="campaign-options"
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder={t.keyword_search_ph}
            />
            <datalist id="campaign-options">
              {allCampaignNames.map((name, i) => (
                <option key={i} value={name} />
              ))}
            </datalist>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
            {t.shows_amount_label}
          </label>
          <div className="relative">
            <Eye className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="number"
              value={minShows}
              min={0}
              step={100}
              onChange={(e) => onMinShowsChange(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
