import React from 'react';
import { 
  BarChart2, 
  Eye, 
  MousePointerClick, 
  Ticket, 
  Car, 
  Send, 
  Bell, 
  Users, 
  Percent, 
  Megaphone, 
  AlertTriangle, 
  CarFront, 
  Tags, 
  MapPin, 
  Hourglass 
} from 'lucide-react';
import { PlatformType, InAppRecord, PromoRecord, CommRecord, LanguageCode } from '../types';
import { I18N_DICT } from '../data/i18n';

interface KPICardsProps {
  platform: PlatformType;
  inAppData: InAppRecord[];
  promoData: PromoRecord[];
  commData: CommRecord[];
  currentLang: LanguageCode;
}

export const KPICards: React.FC<KPICardsProps> = ({
  platform,
  inAppData,
  promoData,
  commData,
  currentLang
}) => {
  const t = I18N_DICT[currentLang] || I18N_DICT.en;

  const totalInAppShows = inAppData.reduce((acc, r) => acc + r.show_pv, 0);
  const totalInAppClicks = inAppData.reduce((acc, r) => acc + r.click_pv, 0);
  const inAppUV = inAppData.reduce((acc, r) => acc + (r.show_uv || 0), 0);
  const distinctInAppCampaigns = new Set(inAppData.map(r => r.campaign_id || r.campaign_name)).size;
  const reviewRecords = inAppData.filter(r => r.data_quality_status === 'Review').length;

  const totalPromoClaims = promoData.reduce((acc, r) => acc + r.redemption_count, 0);
  const totalPromoUsages = promoData.reduce((acc, r) => acc + r.usage_count, 0);
  const uniquePromos = new Set(promoData.map(r => r.promocode)).size;
  const activePromoCities = new Set(promoData.map(r => r.city_name)).size;

  const totalCommDelivered = commData.reduce((acc, r) => acc + (r.delivered_count || 0), 0);
  const totalCommClicks = commData.reduce((acc, r) => acc + (r.click_count || r.clicks || 0), 0);
  const distinctCanvases = new Set(commData.map(r => r.canvas_id)).size;

  interface CardItem {
    label: string;
    val: string;
    sub: string;
    icon: React.ElementType;
    color: string;
  }

  let cards: CardItem[] = [];
  let gridClass = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3';

  if (platform === 'Communications') {
    gridClass = 'grid grid-cols-2 md:grid-cols-4 gap-3';
    const delivToClickRate = totalCommDelivered > 0 ? (totalCommClicks / totalCommDelivered * 100).toFixed(2) : '0.00';
    cards = [
      {
        label: 'Delivered Communications',
        val: totalCommDelivered.toLocaleString(),
        sub: 'SUM(delivered_count) volume',
        icon: Send,
        color: 'text-orange-600'
      },
      {
        label: 'Total Clicks',
        val: totalCommClicks.toLocaleString(),
        sub: 'SUM(click_count) active',
        icon: MousePointerClick,
        color: 'text-indigo-600'
      },
      {
        label: 'Delivered-to-Click Rate',
        val: `${delivToClickRate}%`,
        sub: 'SUM(click_count) / SUM(delivered_count)',
        icon: Percent,
        color: 'text-emerald-600'
      },
      {
        label: 'Active Campaigns',
        val: distinctCanvases.toString(),
        sub: 'Distinct canvas_id',
        icon: Megaphone,
        color: 'text-amber-600'
      }
    ];
  } else if (platform === 'In-App Ads') {
    const ctr = totalInAppShows ? (totalInAppClicks / totalInAppShows * 100).toFixed(2) : '0.00';
    cards = [
      { 
        label: 'Total Impressions', 
        val: totalInAppShows.toLocaleString(), 
        sub: 'SUM(show_pv)', 
        icon: Eye, 
        color: 'text-orange-600' 
      },
      { 
        label: 'Aggregated Daily Show UV', 
        val: inAppUV.toLocaleString(), 
        sub: 'SUM(show_uv)', 
        icon: Users, 
        color: 'text-cyan-600' 
      },
      { 
        label: 'Total Clicks', 
        val: totalInAppClicks.toLocaleString(), 
        sub: 'SUM(click_pv)', 
        icon: MousePointerClick, 
        color: 'text-indigo-600' 
      },
      { 
        label: 'CTR', 
        val: `${ctr}%`, 
        sub: 'SUM(click_pv) / SUM(show_pv)', 
        icon: Percent, 
        color: 'text-emerald-600' 
      },
      { 
        label: 'Active Campaigns', 
        val: distinctInAppCampaigns.toString(), 
        sub: 'Distinct campaign_id', 
        icon: Megaphone, 
        color: 'text-amber-600' 
      },
      { 
        label: 'Review Records', 
        val: reviewRecords.toLocaleString(), 
        sub: 'Requires investigation', 
        icon: AlertTriangle, 
        color: 'text-rose-600' 
      }
    ];
  } else if (platform === 'Promo Codes') {
    gridClass = 'grid grid-cols-2 md:grid-cols-4 gap-3';
    const totalRedemptions = promoData.reduce((acc, r) => acc + r.redemption_count, 0);
    const totalUsages = promoData.reduce((acc, r) => acc + r.usage_count, 0);
    const utilisationRate = totalRedemptions > 0 ? (totalUsages / totalRedemptions * 100).toFixed(1) : '0.0';
    const activePromoCodes = new Set(promoData.map(r => r.promocode)).size;

    cards = [
      { label: 'Total Redemptions', val: totalRedemptions.toLocaleString(), sub: 'SUM(redemption_count)', icon: Ticket, color: 'text-orange-600' },
      { label: 'Total Usage', val: totalUsages.toLocaleString(), sub: 'SUM(usage_count)', icon: CarFront, color: 'text-emerald-600' },
      { label: 'Utilisation Rate', val: `${utilisationRate}%`, sub: 'SUM(usage_count) / SUM(redemption_count)', icon: Percent, color: 'text-teal-600' },
      { label: 'Active Promo Codes', val: activePromoCodes.toString(), sub: 'Distinct count of promocode', icon: Tags, color: 'text-indigo-600' }
    ];
  } else {
    // Platform === 'All'
    gridClass = 'grid grid-cols-2 md:grid-cols-4 gap-3';
    const totalReach = totalInAppShows + totalCommDelivered + totalPromoClaims;
    const totalEngagements = totalInAppClicks + totalCommClicks + totalPromoUsages;
    const overallEngagementRate = totalReach > 0 ? (totalEngagements / totalReach * 100).toFixed(2) : '0.00';
    const distinctInAppCamps = new Set(inAppData.map(r => r.campaign_name)).size;
    const distinctCommCamps = new Set(commData.map(r => r.canvas_name)).size;
    const distinctPromoCodesCount = new Set(promoData.map(r => r.promocode)).size;
    const activeCampaignsCount = distinctInAppCamps + distinctCommCamps + distinctPromoCodesCount;

    cards = [
      { label: 'Total Reach', val: totalReach.toLocaleString(), sub: 'SUM(inapp.show_pv) + SUM(comm.delivered_count) + SUM(promo.redemption_count)', icon: Eye, color: 'text-orange-600' },
      { label: 'Total Engagements', val: totalEngagements.toLocaleString(), sub: 'SUM(inapp.click_pv) + SUM(comm.click_count) + SUM(promo.usage_count)', icon: MousePointerClick, color: 'text-indigo-600' },
      { label: 'Overall Engagement Rate', val: `${overallEngagementRate}%`, sub: 'DIVIDE(Total Engagements, Total Reach, 0)', icon: Percent, color: 'text-emerald-600' },
      { label: 'Active Campaigns', val: activeCampaignsCount.toString(), sub: 'Distinct campaigns across platforms', icon: Megaphone, color: 'text-amber-600' }
    ];
  }

  return (
    <section id="kpi-metrics-section" className="space-y-3">
      <div className="flex items-center space-x-2">
        <BarChart2 className="w-4 h-4 text-orange-600" />
        <h2 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200 uppercase">
          {t.kpi_metrics_title}
        </h2>
        <span className="text-xs text-slate-400">• {t.kpi_metrics_subtitle}</span>
      </div>
      <div id="kpi-cards-grid" className={gridClass}>
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div
              key={`${c.label}-${idx}`}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                  {c.label}
                </span>
                <Icon className={`w-4 h-4 ${c.color}`} />
              </div>
              <div className="text-xl font-black tracking-tight text-slate-900 dark:text-white my-0.5">
                {c.val}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                {c.sub}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
