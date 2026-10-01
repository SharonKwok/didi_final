import React from 'react';
import { 
  House, 
  TrendingUp, 
  Trophy, 
  Lightbulb, 
  TableProperties, 
  Brain, 
  Settings, 
  ChevronsLeft, 
  ChevronsRight 
} from 'lucide-react';
import { LanguageCode } from '../types';
import { I18N_DICT } from '../data/i18n';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentLang: LanguageCode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  currentLang
}) => {
  const t = I18N_DICT[currentLang] || I18N_DICT.en;

  const navItems = [
    { id: 'home', label: t.nav_home, icon: House },
    { id: 'performance', label: t.nav_performance, icon: TrendingUp },
    { id: 'leaderboard', label: t.nav_leaderboard, icon: Trophy },
    { id: 'recommendation', label: t.nav_recommendations, icon: Lightbulb },
    { id: 'data-explorer', label: t.nav_data_explorer, icon: TableProperties }
  ];

  return (
    <aside
      id="main-sidebar"
      className={`${
        isCollapsed ? 'w-18' : 'w-60'
      } bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 z-20 shrink-0 select-none`}
    >
      {/* Collapse toggle header */}
      <div className="h-12 border-b border-slate-100 dark:border-slate-800/80 px-4 flex items-center justify-between text-xs text-slate-500">
        {!isCollapsed && (
          <span className="font-bold tracking-wider text-[11px] uppercase text-slate-400">
            Navigation
          </span>
        )}
        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer ${
            isCollapsed ? 'mx-auto' : ''
          }`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronsRight className="w-4 h-4" />
          ) : (
            <ChevronsLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav items list */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0' : 'space-x-3 px-3'
              } py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isActive
                  ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'}`} />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between text-left">
                  <span>{item.label}</span>
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Region footer badge */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} text-[11px] text-slate-500 dark:text-slate-400`}>
          {!isCollapsed && <span className="font-medium">{t.region_label}</span>}
          <span className="px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 font-bold text-[10px]">
            ANZ Live
          </span>
        </div>
        {!isCollapsed && (
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
            {t.region_subtext}
          </p>
        )}
      </div>
    </aside>
  );
};
