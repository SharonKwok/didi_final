import { InAppRecord, PromoRecord, CommRecord } from '../types';

export const CITY_COUNTRY_MAP: Record<string, 'Australia' | 'New Zealand'> = {
  'Sydney': 'Australia',
  'Melbourne': 'Australia',
  'Brisbane': 'Australia',
  'Perth': 'Australia',
  'Adelaide': 'Australia',
  'Gold Coast': 'Australia',
  'Canberra': 'Australia',
  'Hobart': 'Australia',
  'Geelong': 'Australia',
  'Newcastle': 'Australia',
  'Auckland': 'New Zealand',
  'Wellington': 'New Zealand',
  'Christchurch': 'New Zealand',
  'Christchurch City': 'New Zealand',
  'RoANZ': 'New Zealand'
};

export const ALL_CITIES = Object.keys(CITY_COUNTRY_MAP);

export const DEFAULT_CHARTS = [
  "Trend Timeline",
  "Distribution Share",
  "Efficiency Comparison",
  "Cross-Type Engagement Share Distribution"
];

export const DEFAULT_COMM_CHARTS = [
  "Communication Engagement Over Time",
  "Click Engagement by Channel",
  "Campaign Performance",
  "Push Engagement by Hour",
  "Push Engagement Heatmap"
];

export const DEFAULT_PROMO_CHARTS = [
  "Promo Performance Over Time",
  "Promo Usage by City",
  "Promo Volume vs Utilisation",
  "Usage Above Redemption Review"
];

export const DEFAULT_INAPP_CHARTS = [
  "In-App Engagement Over Time",
  "In-App Placement Performance",
  "Campaign Scale vs Engagement",
  "In-App Exposure to Engagement",
  "In-App Performance by City",
  "Data Quality Review"
];

export function generateDatasets(): {
  inApp: InAppRecord[];
  promo: PromoRecord[];
  comm: CommRecord[];
} {
  const inAppCampaigns = [
    'Summer_Rides_Hero_Banner',
    'Morning_Commute_Boost',
    'Airport_FastTrack_Promo',
    'VIP_Exclusive_Express',
    'Weekend_Night_Party_Pop',
    'Friday_Night_Surge_Offer',
    'Student_Campus_Discount_Push',
    'Driver_Loyalty_Perks'
  ];

  const promoCodes = [
    'RIDE50OFF',
    'ANZSUMMER25',
    'SYDNEYNIGHTS',
    'MELBCOMMUTE',
    'BRISBANEBOOST',
    'AUCKLAND10',
    'WELLYFREE',
    'WEEKENDPASS',
    'WELCOMEANZ',
    'GOLDCOASTSURF'
  ];

  const commCanvases: { id: string; name: string; channel: 'Push' | 'Email' | 'SMS' }[] = [
    { id: 'CANVAS_101', name: 'Morning Commute Boost Push', channel: 'Push' },
    { id: 'CANVAS_102', name: 'Flash Sale Commuter Alert', channel: 'Push' },
    { id: 'CANVAS_103', name: 'Weekend Rides Newsletter', channel: 'Email' },
    { id: 'CANVAS_104', name: 'Loyalty Rewards Statement', channel: 'Email' },
    { id: 'CANVAS_105', name: 'Friday Night Travel SMS', channel: 'SMS' },
    { id: 'CANVAS_106', name: 'Airport Dropoff Pass SMS', channel: 'SMS' },
    { id: 'CANVAS_107', name: 'Student Night Pass Push', channel: 'Push' },
    { id: 'CANVAS_108', name: 'Rainy Day Surge Alert', channel: 'Push' },
    { id: 'CANVAS_109', name: 'Midweek Commuter Digest', channel: 'Email' },
    { id: 'CANVAS_110', name: 'Auckland Weekend Special SMS', channel: 'SMS' }
  ];

  const startDate = new Date(2026, 7, 1);
  const endDate = new Date(2026, 8, 18);

  const inApp: InAppRecord[] = [];
  const promo: PromoRecord[] = [];
  const comm: CommRecord[] = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'long' });

    ALL_CITIES.forEach((city) => {
      const country = CITY_COUNTRY_MAP[city];

      // In-App Data
      inAppCampaigns.slice(0, 4).forEach((cName, idx) => {
        const show_pv = Math.floor(Math.random() * 12000) + 3000;
        const click_pv = Math.floor(show_pv * (Math.random() * 0.04 + 0.025));
        inApp.push({
          pt: dateStr,
          date: dateStr,
          day_of_week: dayOfWeek,
          city_name: city,
          country: country,
          campaign_id: `CAMP_${100 + idx}`,
          campaign_name: cName,
          show_pv: show_pv,
          click_pv: click_pv,
          show_uv: Math.floor(show_pv * 0.65),
          click_uv: Math.floor(click_pv * 0.80),
          data_quality_status: Math.random() > 0.95 ? 'Review' : 'Verified',
          url: 'https://web.didiglobal.com/au/store/'
        });
      });

      // Promo Data
      promoCodes.slice(0, 4).forEach((pCode) => {
        const redemptions = Math.floor(Math.random() * 4500) + 800;
        const usage = Math.floor(redemptions * (Math.random() * 0.40 + 0.45));
        promo.push({
          date: dateStr,
          day_of_week: dayOfWeek,
          city_name: city,
          country: country,
          promocode: pCode,
          redemption_count: redemptions,
          usage_count: usage,
          url: 'https://web.didiglobal.com/au/store/'
        });
      });

      // Communications Data
      commCanvases.forEach((canvas) => {
        const sends = Math.floor(Math.random() * 15000) + 5000;
        const delivered = Math.floor(sends * 0.985);
        let rate = 0.015;
        if (canvas.channel === 'SMS') rate = Math.random() * 0.04 + 0.03;
        if (canvas.channel === 'Push') rate = Math.random() * 0.02 + 0.025;
        if (canvas.channel === 'Email') rate = Math.random() * 0.015 + 0.01;

        const clicks = Math.floor(delivered * rate);
        const hourOfDay = Math.floor(Math.random() * 24);

        comm.push({
          date: dateStr,
          day_of_week: dayOfWeek,
          target_markets: city,
          country: country,
          channel: canvas.channel,
          canvas_id: canvas.id,
          canvas_name: canvas.name,
          campaign_start_date: '2025-07-01',
          campaign_end_date: '2026-08-12',
          step_id: 'S01',
          step_name: 'Welcome Step',
          request_count: sends,
          delivered_count: delivered,
          open_count: Math.floor(delivered * 0.45),
          show_count: Math.floor(delivered * 0.6),
          link_eligible_count: Math.floor(delivered * 0.3),
          click_count: clicks,
          push_title: canvas.name,
          hour_of_day: hourOfDay,
          sends: sends,
          clicks: clicks,
          url: 'https://web.didiglobal.com/au/store/'
        });
      });
    });
  }

  return { inApp, promo, comm };
}
