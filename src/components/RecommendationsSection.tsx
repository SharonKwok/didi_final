import React from 'react';
import { 
  Wand2, 
  Scale, 
  Gauge, 
  Clock, 
  ArrowRight 
} from 'lucide-react';
import { LanguageCode } from '../types';
import { I18N_DICT } from '../data/i18n';

interface RecommendationsSectionProps {
  onApplyTactic: (tacticTitle: string) => void;
  currentLang: LanguageCode;
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  onApplyTactic,
  currentLang
}) => {
  const t = I18N_DICT[currentLang] || I18N_DICT.en;

  const tactics = [
    {
      tag: 'BUDGET REALLOCATION',
      title: 'Shift 18% Inventory to High-Converting Promo Codes',
      desc: 'Sydney and Melbourne commuter vouchers are delivering 55%+ redemption-to-usage conversion with minimal churn.',
      metric: '+18% Ride Lift',
      icon: Scale,
      color: 'orange'
    },
    {
      tag: 'FREQUENCY MANAGEMENT',
      title: 'Cap In-App Banner Exposure to 3x Daily per Rider',
      desc: 'Shows above 3x show a sharp 40% decline in daily click rate (CTR) without driving incremental rides.',
      metric: '-24% Ad Waste',
      icon: Gauge,
      color: 'emerald'
    },
    {
      tag: 'PUSH TIMING OPTIMIZATION',
      title: 'Schedule Weekend Evening Notifications at 5:30 PM',
      desc: 'Historical delivery peaks demonstrate a 2.4x higher open-to-ride conversion before sunset.',
      metric: '2.4x Engagement',
      icon: Clock,
      color: 'amber'
    }
  ];

  return (
    <section id="recommendations-section" className="space-y-3">
      <div className="flex items-center space-x-2">
        <Wand2 className="w-4 h-4 text-indigo-500" />
        <h2 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200 uppercase">
          {t.recommendations_title}
        </h2>
        <span className="text-xs text-slate-400">• {t.recommendations_sub}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tactics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.title}-${idx}`}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.color === 'orange' 
                      ? 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300' 
                      : item.color === 'emerald'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}>
                    {item.tag}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${
                    item.color === 'orange' ? 'text-orange-500' : item.color === 'emerald' ? 'text-emerald-500' : 'text-amber-500'
                  }`} />
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className={`text-xs font-bold ${
                  item.color === 'orange' ? 'text-orange-600 dark:text-orange-400' : item.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {item.metric}
                </span>
                <button
                  onClick={() => onApplyTactic(item.title)}
                  className="text-[11px] font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Apply Action</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
