import React, { useEffect, useRef, useState } from 'react';
import { 
  Trophy, 
  Megaphone, 
  ChevronDown, 
  ChevronUp, 
  BarChart2 
} from 'lucide-react';
import { 
  PlatformType, 
  InAppRecord, 
  PromoRecord, 
  CommRecord, 
  LanguageCode 
} from '../types';
import { I18N_DICT } from '../data/i18n';

interface LeaderboardSectionProps {
  platform: PlatformType;
  inAppData: InAppRecord[];
  promoData: PromoRecord[];
  commData: CommRecord[];
  sortKey: string;
  onSortChange: (newSort: string) => void;
  rowsLimit: number;
  onToggleRowsLimit: () => void;
  isDarkMode: boolean;
  currentLang: LanguageCode;
}

interface LeaderboardItem {
  name: string;
  plat: string;
  channel?: string;
  vol: number;
  int: number;
  rate: number;
}

interface PromoLeaderboardItem {
  promocode: string;
  city: string;
  redemptions: number;
  usage: number;
  utilRate: number;
}

interface InAppLeaderboardItem {
  campaign: string;
  city: string;
  placement: string;
  showPv: number;
  showUv: number;
  clickPv: number;
  clickUv: number;
  ctr: number;
  qualityStatus: string;
  campaignVer: string;
  name: string;
  vol: number;
  int: number;
  rate: number;
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  platform,
  inAppData,
  promoData,
  commData,
  sortKey,
  onSortChange,
  rowsLimit,
  onToggleRowsLimit,
  isDarkMode,
  currentLang
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const t = I18N_DICT[currentLang] || I18N_DICT.en;
  const isComm = platform === 'Communications';
  const isInAppAds = platform === 'In-App Ads';
  const isPromoCodes = platform === 'Promo Codes';

  // Filters for In-App
  const [filterDate, setFilterDate] = useState('All');
  const [filterCity, setFilterCity] = useState('All');
  const [filterCampaign, setFilterCampaign] = useState('All');
  const [filterPlan, setFilterPlan] = useState('All');
  const [filterPlacement, setFilterPlacement] = useState('All');
  const [filterVersion, setFilterVersion] = useState('All');
  const [filterQuality, setFilterQuality] = useState('All');

  // Filters for Promo Codes
  const [promoStartDate, setPromoStartDate] = useState('2025-07-01');
  const [promoEndDate, setPromoEndDate] = useState('2026-08-13');
  const [promoFilterCity, setPromoFilterCity] = useState('All');
  const [promoFilterCode, setPromoFilterCode] = useState('All');

  // Filters for All Platform
  const [allFilterCampaign, setAllFilterCampaign] = useState('All');
  const [allFilterType, setAllFilterType] = useState('All');

  const datesList = Array.from(new Set(inAppData.map(r => r.date || r.reporting_date))).filter(Boolean).sort() as string[];
  const citiesList = Array.from(new Set(inAppData.map(r => r.city_name))).filter(Boolean).sort() as string[];
  const campaignsList = Array.from(new Set(inAppData.map(r => r.campaign_name))).filter(Boolean).sort() as string[];
  const plansList = Array.from(new Set(inAppData.map(r => r.plan_name))).filter(Boolean).sort() as string[];
  const placementsList = Array.from(new Set(inAppData.map(r => r.resource_id || r.resource_name))).filter(Boolean).sort() as string[];
  const versionsList = Array.from(new Set(inAppData.map(r => r.campaign_ver))).filter(Boolean).sort() as string[];
  const qualitiesList = Array.from(new Set(inAppData.map(r => r.data_quality_status || r.data_quality_flag))).filter(Boolean).sort() as string[];

  // Promo lists for filters
  const promoDatesList = Array.from(new Set(promoData.map(r => r.date))).filter(Boolean).sort() as string[];
  const promoCitiesList = Array.from(new Set(promoData.map(r => r.city_name))).filter(Boolean).sort() as string[];
  const promoCodesList = Array.from(new Set(promoData.map(r => r.promocode))).filter(Boolean).sort() as string[];

  // All platform lists for filters
  const allCampaignsList = Array.from(new Set([
    ...inAppData.map(r => r.campaign_name),
    ...promoData.map(r => r.promocode),
    ...commData.map(r => r.canvas_name || r.push_title)
  ])).filter(Boolean).sort() as string[];

  const allTypesList = ['In-App', 'Promo Code', 'Communications'];

  const inAppCombined: Record<string, InAppLeaderboardItem> = {};
  const promoCombined: Record<string, PromoLeaderboardItem> = {};
  const combined: Record<string, LeaderboardItem> = {};

  if (isInAppAds) {
    const filteredInApp = inAppData.filter(r => {
      if (filterDate !== 'All' && (r.date !== filterDate && r.reporting_date !== filterDate)) return false;
      if (filterCity !== 'All' && r.city_name !== filterCity) return false;
      if (filterCampaign !== 'All' && r.campaign_name !== filterCampaign) return false;
      if (filterPlan !== 'All' && r.plan_name !== filterPlan) return false;
      if (filterPlacement !== 'All' && r.resource_id !== filterPlacement && r.resource_name !== filterPlacement) return false;
      if (filterVersion !== 'All' && r.campaign_ver !== filterVersion) return false;
      if (filterQuality !== 'All' && r.data_quality_status !== filterQuality && r.data_quality_flag !== filterQuality) return false;
      return true;
    });

    filteredInApp.forEach((r) => {
      const key = `${r.campaign_name}_${r.city_name}_${r.resource_id || 'default'}_${r.campaign_ver || 'All'}`;
      inAppCombined[key] = inAppCombined[key] || {
        campaign: r.campaign_name || 'Campaign',
        city: r.city_name || 'All',
        placement: r.resource_id || r.resource_name || 'Placement',
        showPv: 0,
        showUv: 0,
        clickPv: 0,
        clickUv: 0,
        ctr: 0,
        qualityStatus: r.data_quality_status || 'Valid',
        campaignVer: r.campaign_ver || 'All',
        name: r.campaign_name || 'Campaign',
        vol: 0,
        int: 0,
        rate: 0
      };
      inAppCombined[key].showPv += r.show_pv;
      inAppCombined[key].showUv += r.show_uv;
      inAppCombined[key].clickPv += r.click_pv;
      inAppCombined[key].clickUv += r.click_uv;
    });

    Object.values(inAppCombined).forEach((item) => {
      item.ctr = item.showPv > 0 ? (item.clickPv / item.showPv) * 100 : 0;
      item.vol = item.showPv;
      item.int = item.clickPv;
      item.rate = item.ctr;
    });
  } else if (isPromoCodes) {
    const filteredPromo = promoData.filter(r => {
      if (promoStartDate !== 'All' && r.date < promoStartDate) return false;
      if (promoEndDate !== 'All' && r.date > promoEndDate) return false;
      if (promoFilterCity !== 'All' && r.city_name !== promoFilterCity) return false;
      if (promoFilterCode !== 'All' && r.promocode !== promoFilterCode) return false;
      return true;
    });

    filteredPromo.forEach((r) => {
      const key = `${r.promocode}_${r.city_name}`;
      promoCombined[key] = promoCombined[key] || {
        promocode: r.promocode,
        city: r.city_name,
        redemptions: 0,
        usage: 0,
        utilRate: 0
      };
      promoCombined[key].redemptions += r.redemption_count;
      promoCombined[key].usage += r.usage_count;
    });
  } else if (isComm) {
    commData.forEach((r) => {
      const key = `${r.canvas_name}_${r.channel}`;
      combined[key] = combined[key] || {
        name: r.canvas_name,
        channel: r.channel,
        plat: 'Comm',
        vol: 0,
        int: 0,
        rate: 0
      };
      combined[key].vol += r.delivered_count;
      combined[key].int += (r.click_count || r.clicks);
    });
  } else {
    inAppData.forEach((r) => {
      const name = r.campaign_name || 'Campaign';
      combined[name] = combined[name] || {
        name: name,
        plat: 'In-App',
        vol: 0,
        int: 0,
        rate: 0
      };
      combined[name].vol += r.show_pv;
      combined[name].int += r.click_pv;
    });

    promoData.forEach((r) => {
      const name = r.promocode || 'Promo';
      combined[name] = combined[name] || {
        name: name,
        plat: 'Promo Code',
        vol: 0,
        int: 0,
        rate: 0
      };
      combined[name].vol += r.redemption_count;
      combined[name].int += r.usage_count;
    });

    commData.forEach((r) => {
      const name = r.canvas_name || r.push_title || 'Comm';
      combined[name] = combined[name] || {
        name: name,
        plat: 'Communications',
        vol: 0,
        int: 0,
        rate: 0
      };
      combined[name].vol += (r.delivered_count || 0);
      combined[name].int += (r.click_count || r.clicks || 0);
    });
  }

  let inAppList: InAppLeaderboardItem[] = Object.values(inAppCombined);
  let promoList: PromoLeaderboardItem[] = Object.values(promoCombined).map((item) => {
    item.utilRate = item.redemptions > 0 ? (item.usage / item.redemptions) * 100 : 0;
    return item;
  });
  let list: LeaderboardItem[] = Object.values(combined).map((item) => {
    item.rate = item.vol ? (item.int / item.vol) * 100 : 0;
    return item;
  });

  if (!isComm && !isInAppAds && !isPromoCodes) {
    list = list.filter(item => {
      if (allFilterCampaign !== 'All' && item.name !== allFilterCampaign) return false;
      if (allFilterType !== 'All' && item.plat !== allFilterType) return false;
      return true;
    });
  }

  // Sorting
  if (isInAppAds) {
    if (sortKey === 'rate' || sortKey === 'ctr') {
      inAppList.sort((a, b) => b.ctr - a.ctr);
    } else if (sortKey === 'volume' || sortKey === 'show_pv') {
      inAppList.sort((a, b) => b.showPv - a.showPv);
    } else if (sortKey === 'interact' || sortKey === 'click_pv') {
      inAppList.sort((a, b) => b.clickPv - a.clickPv);
    } else if (sortKey === 'status') {
      inAppList.sort((a, b) => a.qualityStatus.localeCompare(b.qualityStatus));
    } else {
      inAppList.sort((a, b) => b.ctr - a.ctr);
    }
  } else if (isPromoCodes) {
    if (sortKey === 'redemptions') {
      promoList.sort((a, b) => b.redemptions - a.redemptions);
    } else if (sortKey === 'util' || sortKey === 'utilisation') {
      promoList.sort((a, b) => b.utilRate - a.utilRate);
    } else {
      // Default: Usage descending
      promoList.sort((a, b) => b.usage - a.usage);
    }
  } else {
    if (sortKey === 'rate') {
      list.sort((a, b) => b.rate - a.rate);
    } else if (sortKey === 'volume' || sortKey === 'reach') {
      list.sort((a, b) => b.vol - a.vol);
    } else if (sortKey === 'interact' || sortKey === 'engagements') {
      list.sort((a, b) => b.int - a.int);
    } else {
      list.sort((a, b) => b.int - a.int); // Default: Engagements descending
    }
  }

  const displayInAppRows = inAppList.slice(0, Math.min(rowsLimit, 10));
  const totalInAppItems = inAppList.length;

  const displayPromoRows = promoList.slice(0, Math.min(rowsLimit, 10));
  const totalPromoItems = promoList.length;

  // Cap at 10 items max for standard
  list = list.slice(0, 10);
  const totalItems = list.length;
  const displayRows = list.slice(0, Math.min(rowsLimit, 10));

  // Render Horizontal Bar Chart
  useEffect(() => {
    const Plotly = (window as unknown as { Plotly: any })?.Plotly;
    if (!Plotly || !chartRef.current) return;

    const chartRows = isPromoCodes 
      ? [...displayPromoRows].reverse() 
      : isInAppAds 
        ? [...displayInAppRows].reverse() 
        : [...displayRows].reverse();

    const chartTrace = [{
      type: 'bar',
      orientation: 'h',
      x: chartRows.map((item: any) => 
        isPromoCodes 
          ? (sortKey === 'redemptions' ? item.redemptions : sortKey === 'util' ? item.utilRate : item.usage)
          : isInAppAds 
            ? (sortKey === 'show_pv' ? item.showPv : sortKey === 'click_pv' ? item.clickPv : sortKey === 'status' ? (item.qualityStatus === 'Valid' ? 1 : 0) : item.ctr)
            : (sortKey === 'volume' || sortKey === 'delivered') 
              ? item.vol 
              : (sortKey === 'interact' || sortKey === 'clicks') 
                ? item.int 
                : item.rate
      ),
      y: chartRows.map((item: any) => {
        const name = isPromoCodes ? item.promocode : isInAppAds ? item.campaign : item.name;
        return name.length > 18 ? name.slice(0, 18) + '...' : name;
      }),
      marker: { 
        color: isPromoCodes
          ? '#10b981'
          : isInAppAds 
            ? '#f97316'
            : chartRows.map((item: any) => 
                item.channel 
                  ? (item.channel === 'Push' ? '#2563eb' : item.channel === 'Email' ? '#10b981' : '#f59e0b') 
                  : (item.plat === 'In-App' ? '#2563eb' : item.plat === 'Promo' ? '#10b981' : '#f59e0b')
              ) 
      }
    }];

    const chartLayout = {
      autosize: true,
      margin: { t: 10, r: 15, l: 100, b: 25 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { 
        family: 'Inter', 
        size: 10, 
        color: isDarkMode ? '#cbd5e1' : '#475569' 
      },
      xaxis: { 
        gridcolor: isDarkMode ? '#334155' : '#f1f5f9' 
      },
      yaxis: { 
        automargin: true 
      }
    };

    Plotly.newPlot(chartRef.current, chartTrace, chartLayout, { responsive: true, displayModeBar: false });
  }, [displayRows, displayInAppRows, displayPromoRows, sortKey, isInAppAds, isPromoCodes, isDarkMode]);

  return (
    <section id="leaderboard-section" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          {isInAppAds ? (
            <Trophy className="w-4 h-4 text-orange-600" />
          ) : isPromoCodes ? (
            <Trophy className="w-4 h-4 text-emerald-500" />
          ) : isComm ? (
            <Megaphone className="w-4 h-4 text-orange-600" />
          ) : (
            <Trophy className="w-4 h-4 text-amber-500" />
          )}
          <h2 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200 uppercase">
            {isPromoCodes ? 'Promo Code Performance' : isInAppAds ? 'In-App Campaign Performance' : isComm ? 'Communication Campaign Performance' : 'LEADERBOARD – Cross-Channel Campaign Performance'}
          </h2>
        </div>

        {/* Sorting Controls & Rows Limit Toggle */}
        <div className="flex items-center space-x-2">
          <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t.sort_by_label}
          </label>
          <select
            value={sortKey}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {isInAppAds ? (
              <>
                <option value="rate">CTR (%)</option>
                <option value="show_pv">Show PV</option>
                <option value="click_pv">Click PV</option>
                <option value="status">Review Status</option>
              </>
            ) : isPromoCodes ? (
              <>
                <option value="usage">Usage</option>
                <option value="redemptions">Redemptions</option>
                <option value="util">Utilisation Rate</option>
              </>
            ) : isComm ? (
              <>
                <option value="rate">Delivered-to-Click Rate</option>
                <option value="delivered">Delivered</option>
                <option value="clicks">Clicks</option>
                <option value="campaign">Campaign</option>
                <option value="channel">Channel</option>
              </>
            ) : (
              <>
                <option value="interact">Engagements</option>
                <option value="volume">Reach</option>
                <option value="rate">Engagement Rate</option>
              </>
            )}
          </select>

          <button
            onClick={onToggleRowsLimit}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-sm flex items-center gap-1 cursor-pointer"
          >
            <span>{rowsLimit === 5 ? 'Show 10 Rows' : 'Show 5 Rows'}</span>
            {rowsLimit === 5 ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* In-App Ads Interactive Filter Bar */}
      {isInAppAds && (
        <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs shadow-sm">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            Filters:
          </span>
          <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="All">Date Range: All</option>
            {datesList.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="All">City: All</option>
            {citiesList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterCampaign} onChange={(e) => setFilterCampaign(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 max-w-[150px] truncate focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="All">Campaign: All</option>
            {campaignsList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 max-w-[150px] truncate focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="All">Plan: All</option>
            {plansList.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterPlacement} onChange={(e) => setFilterPlacement(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 max-w-[150px] truncate focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="All">Placement: All</option>
            {placementsList.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterVersion} onChange={(e) => setFilterVersion(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="All">Campaign Version: All</option>
            {versionsList.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          <select value={filterQuality} onChange={(e) => setFilterQuality(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="All">Data Quality Status: All</option>
            {qualitiesList.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
          
          {(filterDate !== 'All' || filterCity !== 'All' || filterCampaign !== 'All' || filterPlan !== 'All' || filterPlacement !== 'All' || filterVersion !== 'All' || filterQuality !== 'All') && (
            <button 
              onClick={() => { setFilterDate('All'); setFilterCity('All'); setFilterCampaign('All'); setFilterPlan('All'); setFilterPlacement('All'); setFilterVersion('All'); setFilterQuality('All'); }}
              className="text-xs text-orange-600 dark:text-orange-400 font-bold hover:underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Promo Codes Interactive Filter Bar */}
      {isPromoCodes && (
        <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs shadow-sm">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            Filters:
          </span>
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Date Range:</span>
            <select value={promoStartDate} onChange={(e) => setPromoStartDate(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="All">Start: All</option>
              {promoDatesList.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <span className="text-slate-500 dark:text-slate-400">to</span>
            <select value={promoEndDate} onChange={(e) => setPromoEndDate(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="All">End: All</option>
              {promoDatesList.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <select value={promoFilterCity} onChange={(e) => setPromoFilterCity(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="All">City: All</option>
            {promoCitiesList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={promoFilterCode} onChange={(e) => setPromoFilterCode(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="All">Promo Code: All</option>
            {promoCodesList.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          {(promoStartDate !== '2025-07-01' || promoEndDate !== '2026-08-13' || promoFilterCity !== 'All' || promoFilterCode !== 'All') && (
            <button 
              onClick={() => { setPromoStartDate('2025-07-01'); setPromoEndDate('2026-08-13'); setPromoFilterCity('All'); setPromoFilterCode('All'); }}
              className="text-xs text-orange-600 dark:text-orange-400 font-bold hover:underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* All Platform Interactive Filter Bar */}
      {!isComm && !isInAppAds && !isPromoCodes && (
        <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs shadow-sm">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            Filters:
          </span>
          <select value={allFilterCampaign} onChange={(e) => setAllFilterCampaign(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 max-w-[220px] truncate focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="All">Campaign Name: All</option>
            {allCampaignsList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={allFilterType} onChange={(e) => setAllFilterType(e.target.value)} className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="All">Type: All</option>
            {allTypesList.map(tp => <option key={tp} value={tp}>{tp}</option>)}
          </select>

          {(allFilterCampaign !== 'All' || allFilterType !== 'All') && (
            <button 
              onClick={() => { setAllFilterCampaign('All'); setAllFilterType('All'); }}
              className="text-xs text-orange-600 dark:text-orange-400 font-bold hover:underline px-2 py-1"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Leaderboard Layout: Table on Left, Ranked Bar Chart on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Table Card (7 cols) */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                {isInAppAds ? (
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Campaign</th>
                    <th className="py-2.5 px-3 font-semibold">City</th>
                    <th className="py-2.5 px-3 font-semibold">Placement</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Show PV</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Show UV</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Click PV</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Click UV</th>
                    <th className="py-2.5 px-3 font-semibold text-right">CTR</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                    <th className="py-2.5 px-3 font-semibold">Ver</th>
                  </tr>
                ) : isPromoCodes ? (
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Promo Code</th>
                    <th className="py-2.5 px-3 font-semibold">City</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Redemptions</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Usage</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Utilisation Rate</th>
                  </tr>
                ) : isComm ? (
                  <tr>
                    <th className="py-2.5 px-3 font-semibold text-slate-500">Campaign</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-500">Channel</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-500 text-right">Delivered</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-500 text-right">Clicks</th>
                    <th className="py-2.5 px-3 font-semibold text-slate-500 text-right">Delivered-to-Click Rate</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Campaign Name</th>
                    <th className="py-2.5 px-3 font-semibold">Type</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Reach</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Engagements</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Engagement Rate</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {isInAppAds ? (
                  displayInAppRows.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-6 text-center text-slate-400">
                        No in-app campaign records available.
                      </td>
                    </tr>
                  ) : (
                    displayInAppRows.map((r, idx) => (
                      <tr key={`${r.campaign}-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                        <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-100 max-w-[140px] truncate" title={r.campaign}>{r.campaign}</td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{r.city}</td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 max-w-[120px] truncate" title={r.placement}>{r.placement}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300">{r.showPv.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300">{r.showUv.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300">{r.clickPv.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300">{r.clickUv.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-bold font-mono text-orange-600 dark:text-orange-400">{r.ctr.toFixed(2)}%</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${r.qualityStatus === 'Valid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'}`}>
                            {r.qualityStatus}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{r.campaignVer}</td>
                      </tr>
                    ))
                  )
                ) : isPromoCodes ? (
                  displayPromoRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        No promo code records available.
                      </td>
                    </tr>
                  ) : (
                    displayPromoRows.map((r, idx) => (
                      <tr key={`${r.promocode}-${r.city}-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                        <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-100">{r.promocode}</td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{r.city}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300">{r.redemptions.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300">{r.usage.toLocaleString()}</td>
                        <td className="py-2.5 px-3 text-right font-bold font-mono text-orange-600 dark:text-orange-400">{r.utilRate.toFixed(1)}%</td>
                      </tr>
                    ))
                  )
                ) : displayRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      No campaign records available.
                    </td>
                  </tr>
                ) : (
                  displayRows.map((r, idx) => (
                    <tr
                      key={`${r.name}-${idx}`}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                    >
                      {isComm ? (
                        <>
                          <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-100 max-w-[220px] truncate" title={r.name}>
                            {r.name}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.channel === 'Push' 
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300' 
                                : r.channel === 'Email' 
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' 
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                            }`}>
                              {r.channel || 'Push'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300">
                            {r.vol.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300">
                            {r.int.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold font-mono text-orange-600 dark:text-orange-400">
                            {r.rate.toFixed(2)}%
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-100 max-w-[200px] truncate" title={r.name}>
                            {r.name}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              r.plat === 'In-App' 
                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300' 
                                : r.plat === 'Promo Code' 
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' 
                                  : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                            }`}>
                              {r.plat}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300">
                            {r.vol.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600 dark:text-slate-300">
                            {r.int.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold font-mono text-orange-600 dark:text-orange-400">
                            {r.rate.toFixed(2)}%
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 italic text-right">
            Showing top {isInAppAds ? displayInAppRows.length : isPromoCodes ? displayPromoRows.length : displayRows.length} of {isInAppAds ? totalInAppItems : isPromoCodes ? totalPromoItems : totalItems} campaigns
          </p>
        </div>

        {/* Ranked Chart Card (5 cols) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-orange-600" />
            <span>{isInAppAds ? 'Top Campaigns by CTR' : isPromoCodes ? 'Top Promo Codes by Usage' : isComm ? 'Ranked Campaigns by Metric' : t.top_chart_title}</span>
          </h4>
          <div ref={chartRef} className="w-full h-64 flex-1" />
        </div>
      </div>
    </section>
  );
};
