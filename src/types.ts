export type MarketType = 'All' | 'Australia' | 'New Zealand';
export type PlatformType = 'All' | 'In-App Ads' | 'Promo Codes' | 'Communications';
export type PeriodType = 'Daily' | 'Weekly' | 'Fortnightly' | 'Monthly' | 'Quarterly' | 'Biannual' | 'Yearly' | 'Custom' | 'All Time';
export type LanguageCode = 'en' | 'zh-TW' | 'zh-CN' | 'ja' | 'es' | 'fr' | 'ko' | 'hi';

export interface InAppRecord {
  id?: string;
  pt?: string;
  date: string;
  day_of_week: string;
  city_name: string;
  country: string;
  resource_id?: string;
  resource_name?: string;
  plan_id?: string;
  plan_name?: string;
  campaign_id?: string;
  campaign_name: string;
  campaign_ver?: string;
  plan_start_time?: string;
  plan_end_time?: string;
  show_pv: number;
  click_pv: number;
  show_uv: number;
  click_uv: number;
  reporting_date?: string;
  template_id?: string;
  ctr_click_pv_show_pv?: string;
  frequency_show_pv_show_uv?: string;
  unique_click_rate_click_uv_show_uv?: string;
  data_quality_status?: string;
  data_quality_flag?: string;
  url: string;
}

export interface PromoRecord {
  date: string;
  day_of_week: string;
  city_name: string;
  country: string;
  promocode: string;
  redemption_count: number;
  usage_count: number;
  url: string;
}

export interface CommRecord {
  date: string;
  day_of_week: string;
  target_markets: string;
  country: string;
  channel: string;
  canvas_id: string;
  canvas_name: string;
  campaign_start_date: string;
  campaign_end_date: string;
  step_id: string;
  step_name: string;
  request_count: number;
  delivered_count: number;
  open_count: number;
  show_count: number;
  link_eligible_count: number;
  click_count: number;
  push_title: string;
  hour_of_day: number;
  sends: number;
  clicks: number;
  url: string;
}

export interface ConsolidatedRow {
  date: string;
  type: 'In-App Ads' | 'Promo Codes' | 'Communications';
  channel: string;
  city: string;
  campaignIdentifier: string;
  reach: number;
  engagements: number;
  url: string;
}

export interface CustomAxisConfig {
  xAxis: string;
  yAxis: string;
  style: string;
  baseType: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  time?: string;
}
