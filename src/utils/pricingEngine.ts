import {
  ClientTypeId,
  CurrencyCode,
  DesignTierId,
  FEATURES_CATALOG,
  Lang,
  LanguageCount,
  PAGES_CATALOG,
  PROJECT_TYPES,
  ProjectTypeId,
  UrgencyId,
} from '../data/catalog';

export interface PricingInput {
  currency: CurrencyCode;
  pageRate: number; // Base price for 1 standard page in the active currency
  urgency: UrgencyId;
  clientType: ClientTypeId;
  hostingAnnual: number;
  projectType: ProjectTypeId;
  selectedPages: string[];
  extraPages: number;
  selectedFeatures: string[];
  languages: LanguageCount;
  designTier: DesignTierId;
}

export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PricingBreakdown {
  pagesTotal: number;
  extraPagesTotal: number;
  featuresTotal: number;
  baseSubtotal: number;
  designMultiplier: number;
  designDelta: number;
  urgencyMultiplier: number;
  urgencyDelta: number;
  clientMultiplier: number;
  clientDelta: number;
  languageMultiplier: number;
  languageDelta: number;
  hostingAnnual: number;
}

export interface PricingResult {
  designTierPrices: Record<DesignTierId, number>;
  selectedTotal: number;
  minRange: number;
  maxRange: number;
  estimatedWeeks: [number, number];
  milestones: {
    start: number; // 40%
    mid: number;   // 30%
    end: number;   // 30%
  };
  breakdown: PricingBreakdown;
  totalWeight: number;
}

export const CURRENCY_CONFIG: Record<
  CurrencyCode,
  { symbol: Record<Lang, string>; minRate: number; maxRate: number; step: number; roundTo: number; presets: number[]; defaultRate: number }
> = {
  DZD: {
    symbol: { ar: 'دج', en: 'DZD', fr: 'DA' },
    minRate: 2000,
    maxRate: 25000,
    step: 500,
    roundTo: 500,
    presets: [3000, 6000, 10000],
    defaultRate: 6000,
  },
  EUR: {
    symbol: { ar: '€', en: '€', fr: '€' },
    minRate: 20,
    maxRate: 300,
    step: 5,
    roundTo: 10,
    presets: [40, 80, 150],
    defaultRate: 80,
  },
  USD: {
    symbol: { ar: '$', en: '$', fr: '$' },
    minRate: 25,
    maxRate: 350,
    step: 5,
    roundTo: 10,
    presets: [50, 90, 160],
    defaultRate: 90,
  },
};

export const DESIGN_MULTIPLIERS: Record<DesignTierId, number> = {
  template: 1.043,
  custom: 1.258,
  premium: 1.613,
};

export const URGENCY_MULTIPLIERS: Record<UrgencyId, number> = {
  normal: 1.0,
  rush: 1.25,
  urgent: 1.5,
};

export const CLIENT_MULTIPLIERS: Record<ClientTypeId, number> = {
  individual: 1.0,
  sme: 1.15,
  enterprise: 1.35,
};

export const LANGUAGE_MULTIPLIERS: Record<LanguageCount, number> = {
  1: 1.0,
  2: 1.3,
  3: 1.6,
};

export function roundToStep(value: number, step: number): number {
  if (step <= 1) return Math.round(value);
  return Math.round(value / step) * step;
}

export function createDefaultPricingInput(
  projectType: ProjectTypeId = 'showcase',
  currency: CurrencyCode = 'DZD'
): PricingInput {
  const preset = PROJECT_TYPES.find((p) => p.id === projectType) || PROJECT_TYPES[1];
  return {
    currency,
    pageRate: CURRENCY_CONFIG[currency].defaultRate,
    urgency: 'normal',
    clientType: 'individual',
    hostingAnnual: 0,
    projectType: preset.id,
    selectedPages: [...preset.defaultPages],
    extraPages: 0,
    selectedFeatures: [...preset.defaultFeatures],
    languages: 1,
    designTier: 'custom',
  };
}

export function calculateProjectEstimate(input: PricingInput): PricingResult {
  const cfg = CURRENCY_CONFIG[input.currency];
  const step = cfg.roundTo;
  const pageRate = Math.max(0, input.pageRate);

  let pagesWeight = 0;
  for (const pageId of input.selectedPages) {
    const def = PAGES_CATALOG.find((p) => p.id === pageId);
    if (def) pagesWeight += def.weight;
  }

  const extraPagesCount = Math.max(0, Math.floor(input.extraPages));
  const extraPagesWeight = extraPagesCount * 1.0;

  let featuresWeight = 0;
  for (const featId of input.selectedFeatures) {
    const def = FEATURES_CATALOG.find((f) => f.id === featId);
    if (def) featuresWeight += def.weight;
  }

  const pagesTotal = pagesWeight * pageRate;
  const extraPagesTotal = extraPagesWeight * pageRate;
  const featuresTotal = featuresWeight * pageRate;
  const baseSubtotal = pagesTotal + extraPagesTotal + featuresTotal;

  const urgencyMult = URGENCY_MULTIPLIERS[input.urgency];
  const clientMult = CLIENT_MULTIPLIERS[input.clientType];
  const langMult = LANGUAGE_MULTIPLIERS[input.languages];
  const combinedConditionMult = urgencyMult * clientMult * langMult;

  const computeForTier = (tier: DesignTierId): number => {
    const raw = baseSubtotal * DESIGN_MULTIPLIERS[tier] * combinedConditionMult;
    return roundToStep(raw, step);
  };

  const designTierPrices: Record<DesignTierId, number> = {
    template: computeForTier('template'),
    custom: computeForTier('custom'),
    premium: computeForTier('premium'),
  };

  const selectedTotal = designTierPrices[input.designTier];

  const activeDesignMult = DESIGN_MULTIPLIERS[input.designTier];
  const afterDesign = baseSubtotal * activeDesignMult;
  const afterUrgency = afterDesign * urgencyMult;
  const afterClient = afterUrgency * clientMult;
  const afterLanguage = afterClient * langMult;

  const minRange = roundToStep(selectedTotal * 0.9, step);
  const maxRange = roundToStep(selectedTotal * 1.1, step);

  // Payment milestones: 40% start, 30% mid, 30% end (exact sum reconciliation)
  const start = roundToStep(selectedTotal * 0.4, step);
  const mid = roundToStep(selectedTotal * 0.3, step);
  const end = Math.max(0, selectedTotal - start - mid);

  // Dynamic timeline based on total complexity weight and urgency
  const totalWeight = pagesWeight + extraPagesWeight + featuresWeight;
  let minWeeks = Math.max(1, Math.round(totalWeight / 4.2));
  let maxWeeks = Math.max(minWeeks + 1, Math.round(totalWeight / 2.8));
  if (input.languages > 1) {
    maxWeeks += input.languages - 1;
  }
  if (input.urgency === 'rush') {
    minWeeks = Math.max(1, Math.floor(minWeeks * 0.75));
    maxWeeks = Math.max(minWeeks, Math.floor(maxWeeks * 0.75));
  } else if (input.urgency === 'urgent') {
    minWeeks = Math.max(1, Math.floor(minWeeks * 0.55));
    maxWeeks = Math.max(minWeeks, Math.floor(maxWeeks * 0.6));
  }

  return {
    designTierPrices,
    selectedTotal,
    minRange,
    maxRange,
    estimatedWeeks: [minWeeks, maxWeeks],
    milestones: { start, mid, end },
    totalWeight,
    breakdown: {
      pagesTotal: Math.round(pagesTotal),
      extraPagesTotal: Math.round(extraPagesTotal),
      featuresTotal: Math.round(featuresTotal),
      baseSubtotal: Math.round(baseSubtotal),
      designMultiplier: activeDesignMult,
      designDelta: Math.round(afterDesign - baseSubtotal),
      urgencyMultiplier: urgencyMult,
      urgencyDelta: Math.round(afterUrgency - afterDesign),
      clientMultiplier: clientMult,
      clientDelta: Math.round(afterClient - afterUrgency),
      languageMultiplier: langMult,
      languageDelta: Math.round(afterLanguage - afterClient),
      hostingAnnual: Math.max(0, Math.round(input.hostingAnnual)),
    },
  };
}

export function formatMoney(amount: number, currency: CurrencyCode, lang: Lang): string {
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  const symbol = CURRENCY_CONFIG[currency].symbol[lang];
  return currency === 'DZD' ? `${formatted} ${symbol}` : `${symbol}${formatted}`;
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export function formatWeeksLabel(weeks: [number, number], lang: Lang): string {
  const [minW, maxW] = weeks;
  if (lang === 'ar') {
    if (minW === maxW) return minW === 1 ? 'أسبوع واحد' : `${minW} أسابيع`;
    return `${minW} – ${maxW} أسابيع`;
  }
  if (lang === 'fr') {
    if (minW === maxW) return minW === 1 ? '1 semaine' : `${minW} semaines`;
    return `${minW} – ${maxW} semaines`;
  }
  if (minW === maxW) return minW === 1 ? '1 week' : `${minW} weeks`;
  return `${minW} – ${maxW} weeks`;
}

export function convertEstimateToQuoteItems(
  input: PricingInput,
  result: PricingResult,
  lang: Lang
): QuoteLineItem[] {
  const items: QuoteLineItem[] = [];
  const tierFactor =
    DESIGN_MULTIPLIERS[input.designTier] *
    URGENCY_MULTIPLIERS[input.urgency] *
    CLIENT_MULTIPLIERS[input.clientType] *
    LANGUAGE_MULTIPLIERS[input.languages];

  const pageNames = input.selectedPages
    .map((id) => PAGES_CATALOG.find((p) => p.id === id)?.label[lang])
    .filter(Boolean);

  if (pageNames.length > 0 || input.extraPages > 0) {
    const pagesRaw = (result.breakdown.pagesTotal + result.breakdown.extraPagesTotal) * tierFactor;
    const pagesAmount = roundToStep(pagesRaw, CURRENCY_CONFIG[input.currency].roundTo);
    const desc =
      lang === 'ar'
        ? `تصميم وتطوير الصفحات (${pageNames.length + input.extraPages}): ${pageNames.join('، ')}${
            input.extraPages > 0 ? ` + ${input.extraPages} صفحات إضافية` : ''
          }`
        : lang === 'fr'
        ? `Conception & développement des pages (${pageNames.length + input.extraPages}) : ${pageNames.join(', ')}${
            input.extraPages > 0 ? ` + ${input.extraPages} pages suppl.` : ''
          }`
        : `UI Design & Page Development (${pageNames.length + input.extraPages}): ${pageNames.join(', ')}${
            input.extraPages > 0 ? ` + ${input.extraPages} extra pages` : ''
          }`;
    items.push({
      id: 'item-pages',
      description: desc,
      quantity: 1,
      unitPrice: pagesAmount,
      total: pagesAmount,
    });
  }

  const featureNames = input.selectedFeatures
    .map((id) => FEATURES_CATALOG.find((f) => f.id === id)?.label[lang])
    .filter(Boolean);

  if (featureNames.length > 0) {
    const pagesLineTotal = items[0]?.total || 0;
    const featuresAmount = Math.max(0, result.selectedTotal - pagesLineTotal);
    const desc =
      lang === 'ar'
        ? `المزايا والبرمجة الخلفية: ${featureNames.join('، ')}`
        : lang === 'fr'
        ? `Fonctionnalités & intégrations : ${featureNames.join(', ')}`
        : `Functional Features & Integrations: ${featureNames.join(', ')}`;
    items.push({
      id: 'item-features',
      description: desc,
      quantity: 1,
      unitPrice: featuresAmount,
      total: featuresAmount,
    });
  }

  if (input.hostingAnnual > 0) {
    const desc =
      lang === 'ar'
        ? 'النطاق والاستضافة السنوية (سنة أولى)'
        : lang === 'fr'
        ? 'Nom de domaine & Hébergement annuel'
        : 'Domain Name & Annual Cloud Hosting';
    items.push({
      id: 'item-hosting',
      description: desc,
      quantity: 1,
      unitPrice: input.hostingAnnual,
      total: input.hostingAnnual,
    });
  }

  return items;
}

export function buildWhatsAppSummaryText(
  input: PricingInput,
  result: PricingResult,
  lang: Lang
): string {
  const projectLabel = PROJECT_TYPES.find((p) => p.id === input.projectType)?.label[lang] || '';
  const pageNames = input.selectedPages
    .map((id) => PAGES_CATALOG.find((p) => p.id === id)?.label[lang])
    .filter(Boolean);
  const featNames = input.selectedFeatures
    .map((id) => FEATURES_CATALOG.find((f) => f.id === id)?.label[lang])
    .filter(Boolean);
  const tierLabels: Record<DesignTierId, LocalizedMap> = {
    template: { ar: 'قالب جاهز', en: 'Starter Template', fr: 'Modèle adapté' },
    custom: { ar: 'تصميم خاص', en: 'Custom Design', fr: 'Design sur-mesure' },
    premium: { ar: 'تصميم مميز', en: 'Premium Bespoke', fr: 'Design Premium' },
  };

  const totalFormatted = formatMoney(result.selectedTotal, input.currency, lang);
  const weeks = formatWeeksLabel(result.estimatedWeeks, lang);
  const s = formatMoney(result.milestones.start, input.currency, lang);
  const m = formatMoney(result.milestones.mid, input.currency, lang);
  const e = formatMoney(result.milestones.end, input.currency, lang);

  if (lang === 'ar') {
    return [
      `*TA Company — عرض سعر تقديري: ${projectLabel}*`,
      '',
      `*الصفحات (${pageNames.length + input.extraPages}):* ${pageNames.join('، ')}${
        input.extraPages > 0 ? ` (+${input.extraPages} إضافية)` : ''
      }`,
      `*المزايا:* ${featNames.length ? featNames.join('، ') : 'أساسية'}`,
      `*مستوى التصميم:* ${tierLabels[input.designTier].ar}`,
      '',
      `*السعر المقترح: ${totalFormatted}*`,
      `المدة التقديرية: ${weeks}`,
      '',
      `*طريقة الدفع:*`,
      `• 40% عند البداية: ${s}`,
      `• 30% في المنتصف: ${m}`,
      `• 30% عند التسليم: ${e}`,
    ].join('\n');
  }

  if (lang === 'fr') {
    return [
      `*TA Company — Estimation : ${projectLabel}*`,
      '',
      `*Pages (${pageNames.length + input.extraPages}) :* ${pageNames.join(', ')}`,
      `*Fonctionnalités :* ${featNames.length ? featNames.join(', ') : 'Standard'}`,
      `*Niveau de design :* ${tierLabels[input.designTier].fr}`,
      '',
      `*Budget estimé : ${totalFormatted}*`,
      `Délai estimé : ${weeks}`,
      '',
      `*Échéancier :*`,
      `• 40% au démarrage : ${s}`,
      `• 30% à mi-parcours : ${m}`,
      `• 30% à la livraison : ${e}`,
    ].join('\n');
  }

  return [
    `*TA Company — Project Estimate: ${projectLabel}*`,
    '',
    `*Pages (${pageNames.length + input.extraPages}):* ${pageNames.join(', ')}`,
    `*Features:* ${featNames.length ? featNames.join(', ') : 'Core'}`,
    `*Design Tier:* ${tierLabels[input.designTier].en}`,
    '',
    `*Estimated Investment: ${totalFormatted}*`,
    `Timeline: ${weeks}`,
    '',
    `*Payment Milestones:*`,
    `• 40% Kickoff: ${s}`,
    `• 30% Mid-Delivery: ${m}`,
    `• 30% Final Handover: ${e}`,
  ].join('\n');
}

interface LocalizedMap {
  ar: string;
  en: string;
  fr: string;
}
