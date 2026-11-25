import React, { useMemo, useState } from 'react';
import {
  BookmarkPlus,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  FileText,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react';
import {
  ClientTypeId,
  CurrencyCode,
  DesignTierId,
  FEATURE_CATEGORIES,
  FEATURES_CATALOG,
  Lang,
  LanguageCount,
  PAGE_CATEGORIES,
  PAGES_CATALOG,
  PROJECT_TYPES,
  ProjectTypeId,
  UrgencyId,
} from '../data/catalog';
import { UI_TEXT } from '../i18n/translations';
import { SavedEstimate, ThemeMode } from '../utils/desktopBridge';
import {
  buildWhatsAppSummaryText,
  calculateProjectEstimate,
  CURRENCY_CONFIG,
  DESIGN_MULTIPLIERS,
  formatMoney,
  formatNumber,
  formatWeeksLabel,
  PricingInput,
  roundToStep,
} from '../utils/pricingEngine';
import { ThemeToggle } from './ThemeToggle';

interface PriceCalculatorDashboardProps {
  lang: Lang;
  onChangeLang: (lang: Lang) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  input: PricingInput;
  onChangeInput: React.Dispatch<React.SetStateAction<PricingInput>>;
  savedEstimates: SavedEstimate[];
  onSaveEstimate: (label: string, total: number) => void;
  onLoadEstimate: (estimate: SavedEstimate) => void;
  onDeleteEstimate: (id: string) => void;
  onConvertToQuote: (input: PricingInput) => void;
  onResetCalculator: () => void;
}

export const PriceCalculatorDashboard: React.FC<PriceCalculatorDashboardProps> = ({
  lang,
  onChangeLang,
  theme,
  onToggleTheme,
  input,
  onChangeInput,
  savedEstimates,
  onSaveEstimate,
  onLoadEstimate,
  onDeleteEstimate,
  onConvertToQuote,
  onResetCalculator,
}) => {
  const t = UI_TEXT[lang];
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [saveLabel, setSaveLabel] = useState('');
  const [vaultSearch, setVaultSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const result = useMemo(() => calculateProjectEstimate(input), [input]);
  const currencyCfg = CURRENCY_CONFIG[input.currency];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  const handleCurrencyChange = (nextCurrency: CurrencyCode) => {
    if (nextCurrency === input.currency) return;
    const nextCfg = CURRENCY_CONFIG[nextCurrency];
    onChangeInput((prev) => ({
      ...prev,
      currency: nextCurrency,
      pageRate: nextCfg.defaultRate,
      hostingAnnual: 0,
    }));
  };

  const handleProjectTypeSelect = (projectTypeId: ProjectTypeId) => {
    const def = PROJECT_TYPES.find((p) => p.id === projectTypeId);
    if (!def) return;
    onChangeInput((prev) => ({
      ...prev,
      projectType: projectTypeId,
      selectedPages: [...def.defaultPages],
      selectedFeatures: [...def.defaultFeatures],
    }));
  };

  const togglePage = (pageId: string) => {
    onChangeInput((prev) => {
      const exists = prev.selectedPages.includes(pageId);
      return {
        ...prev,
        selectedPages: exists
          ? prev.selectedPages.filter((id) => id !== pageId)
          : [...prev.selectedPages, pageId],
      };
    });
  };

  const toggleFeature = (featureId: string) => {
    const featDef = FEATURES_CATALOG.find((f) => f.id === featureId);
    onChangeInput((prev) => {
      const exists = prev.selectedFeatures.includes(featureId);
      if (exists) {
        return {
          ...prev,
          selectedFeatures: prev.selectedFeatures.filter((id) => id !== featureId),
        };
      }
      const nextPages = new Set(prev.selectedPages);
      if (featDef?.recommendedPages) {
        for (const pId of featDef.recommendedPages) {
          nextPages.add(pId);
        }
      }
      return {
        ...prev,
        selectedFeatures: [...prev.selectedFeatures, featureId],
        selectedPages: Array.from(nextPages),
      };
    });
  };

  const getDynamicItemPrice = (weight: number) => {
    const raw = weight * input.pageRate * DESIGN_MULTIPLIERS[input.designTier];
    return roundToStep(raw, currencyCfg.roundTo);
  };

  const getPresetApproxTotal = (projectTypeId: ProjectTypeId) => {
    const def = PROJECT_TYPES.find((p) => p.id === projectTypeId);
    if (!def) return 0;
    const est = calculateProjectEstimate({
      ...input,
      projectType: projectTypeId,
      selectedPages: def.defaultPages,
      selectedFeatures: def.defaultFeatures,
      extraPages: 0,
    });
    return est.selectedTotal;
  };

  const handleCopySummary = async () => {
    const text = buildWhatsAppSummaryText(input, result, lang);
    try {
      await navigator.clipboard.writeText(text);
      triggerToast(t.copiedToast);
    } catch {
      triggerToast(t.copiedToast);
    }
  };

  const handleSave = () => {
    const projectLabel =
      PROJECT_TYPES.find((p) => p.id === input.projectType)?.label[lang] || 'Project';
    const labelToUse = saveLabel.trim() || `${projectLabel} — TA Company`;
    onSaveEstimate(labelToUse, result.selectedTotal);
    setSaveLabel('');
    triggerToast(t.savedToast);
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    buildWhatsAppSummaryText(input, result, lang)
  )}`;

  const filteredVault = useMemo(() => {
    const q = vaultSearch.trim().toLowerCase();
    if (!q) return savedEstimates;
    return savedEstimates.filter((item) => {
      const typeLabel =
        PROJECT_TYPES.find((p) => p.id === item.input.projectType)?.label[lang] || '';
      return (
        item.label.toLowerCase().includes(q) || typeLabel.toLowerCase().includes(q)
      );
    });
  }, [savedEstimates, vaultSearch, lang]);

  const totalPagesCount = input.selectedPages.length + input.extraPages;

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="no-print fixed bottom-5 end-5 z-50 flex items-center gap-2 rounded-xl bg-[#0B1D39] px-4 py-3 text-sm font-medium text-white shadow-lg border border-white/10"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Workspace Hero + Language, Theme & Currency Toolbar */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-[#0F172A]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-2.5">
            <p className="text-xs font-semibold tracking-wide text-[#2563EB] dark:text-blue-400">
              {t.heroTag}
            </p>
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0B1D39] dark:text-white leading-tight"
              style={{ textWrap: 'balance' }}
            >
              {t.heroTitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.heroSubtitle}
            </p>
          </div>

          {/* Interactive Workspace Controls (Theme + Language + Currency) */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} lang={lang} />

            <div
              role="group"
              aria-label="Interface language"
              className="inline-flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
            >
              {(
                [
                  { id: 'ar', label: 'العربية' },
                  { id: 'en', label: 'EN' },
                  { id: 'fr', label: 'FR' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChangeLang(item.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    lang === item.id
                      ? 'bg-white text-[#0B1D39] shadow-sm dark:bg-slate-950 dark:text-white'
                      : 'text-slate-600 hover:text-[#0B1D39] dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div
              role="group"
              aria-label={t.kpiCurrencyLabel}
              className="inline-flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
            >
              {(['DZD', 'EUR', 'USD'] as CurrencyCode[]).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => handleCurrencyChange(curr)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    input.currency === curr
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#0B1D39] dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column KPI Strip */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6 lg:grid-cols-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.kpiTotalLabel}</p>
            <p
              data-testid="kpi-live-total"
              className="text-xl sm:text-2xl font-extrabold text-[#2563EB] dark:text-blue-400 tabular-nums"
            >
              {formatMoney(result.selectedTotal, input.currency, lang)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.kpiScopeLabel}</p>
            <p className="text-lg sm:text-xl font-bold text-[#0B1D39] dark:text-white tabular-nums">
              {totalPagesCount}{' '}
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {lang === 'ar' ? 'صفحات' : 'Pages'}
              </span>{' '}
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                ·
              </span>{' '}
              {input.selectedFeatures.length}{' '}
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {lang === 'ar' ? 'مزايا' : lang === 'fr' ? 'Options' : 'Features'}
              </span>
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.summaryDuration}</p>
            <p className="text-lg sm:text-xl font-bold text-[#0B1D39] dark:text-white tabular-nums">
              {formatWeeksLabel(result.estimatedWeeks, lang)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t.kpiSavedLabel}</p>
            <p
              data-testid="kpi-saved-count"
              className="text-lg sm:text-xl font-bold text-[#0B1D39] dark:text-white tabular-nums"
            >
              {savedEstimates.length}
            </p>
          </div>
        </div>
      </section>

      {/* Main Integrated Calculator Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_420px] items-start">
        {/* Configurator Steps Column */}
        <div className="space-y-6">
          {/* Step 1: Base Rate & Conditions */}
          <section
            aria-labelledby="calc-step-1"
            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 space-y-6 dark:border-slate-800 dark:bg-[#0F172A]"
          >
            <div className="flex items-start gap-3.5">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-sm font-bold text-white tabular-nums"
              >
                1
              </span>
              <div>
                <h2 id="calc-step-1" className="text-lg font-bold text-[#0B1D39] dark:text-white">
                  {t.step1Title}
                </h2>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{t.step1Sub}</p>
              </div>
            </div>

            {/* Page Rate Slider & Presets */}
            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 sm:p-5 space-y-4 dark:bg-slate-900/70 dark:border-slate-800">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="page-rate-slider" className="text-sm font-bold text-[#0B1D39] dark:text-white">
                  {t.pageRateLabel}
                </label>
                <output
                  htmlFor="page-rate-slider"
                  className="text-lg font-extrabold text-[#2563EB] dark:text-blue-400 tabular-nums"
                >
                  {formatMoney(input.pageRate, input.currency, lang)}
                </output>
              </div>

              <input
                id="page-rate-slider"
                type="range"
                min={currencyCfg.minRate}
                max={currencyCfg.maxRate}
                step={currencyCfg.step}
                value={input.pageRate}
                onChange={(e) =>
                  onChangeInput((prev) => ({
                    ...prev,
                    pageRate: Number(e.target.value),
                  }))
                }
                className="ta-slider w-full cursor-pointer"
              />

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: t.presetBeginner, value: currencyCfg.presets[0] },
                  { label: t.presetStandard, value: currencyCfg.presets[1] },
                  { label: t.presetPro, value: currencyCfg.presets[2] },
                ].map((preset) => {
                  const active = input.pageRate === preset.value;
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        onChangeInput((prev) => ({ ...prev, pageRate: preset.value }))
                      }
                      className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors tabular-nums whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-[#2563EB] text-white'
                          : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600'
                      }`}
                    >
                      {preset.label} · {formatNumber(preset.value)}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.pageRateHint}</p>
            </div>

            {/* Urgency & Client Type */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <span className="block text-sm font-bold text-[#0B1D39] dark:text-white">{t.urgencyLabel}</span>
                <div
                  role="radiogroup"
                  aria-label={t.urgencyLabel}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
                >
                  {(
                    [
                      { id: 'normal', label: t.urgencyNormal },
                      { id: 'rush', label: t.urgencyRush },
                      { id: 'urgent', label: t.urgencyUrgent },
                    ] as { id: UrgencyId; label: string }[]
                  ).map((opt) => {
                    const checked = input.urgency === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        onClick={() =>
                          onChangeInput((prev) => ({ ...prev, urgency: opt.id }))
                        }
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors text-center whitespace-nowrap cursor-pointer ${
                          checked
                            ? 'bg-white text-[#0B1D39] shadow-sm dark:bg-slate-950 dark:text-white'
                            : 'text-slate-600 hover:text-[#0B1D39] dark:text-slate-300 dark:hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <span className="block text-sm font-bold text-[#0B1D39] dark:text-white">{t.clientLabel}</span>
                <div
                  role="radiogroup"
                  aria-label={t.clientLabel}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
                >
                  {(
                    [
                      { id: 'individual', label: t.clientIndividual },
                      { id: 'sme', label: t.clientSme },
                      { id: 'enterprise', label: t.clientEnterprise },
                    ] as { id: ClientTypeId; label: string }[]
                  ).map((opt) => {
                    const checked = input.clientType === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        onClick={() =>
                          onChangeInput((prev) => ({ ...prev, clientType: opt.id }))
                        }
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors text-center whitespace-nowrap cursor-pointer ${
                          checked
                            ? 'bg-white text-[#0B1D39] shadow-sm dark:bg-slate-950 dark:text-white'
                            : 'text-slate-600 hover:text-[#0B1D39] dark:text-slate-300 dark:hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Annual Domain & Hosting */}
            <div className="space-y-2">
              <label htmlFor="hosting-annual-input" className="block text-sm font-bold text-[#0B1D39] dark:text-white">
                {t.hostingLabel}
              </label>
              <div className="relative max-w-xs">
                <input
                  id="hosting-annual-input"
                  type="number"
                  min={0}
                  step={currencyCfg.step}
                  value={input.hostingAnnual || ''}
                  placeholder={t.hostingPlaceholder}
                  onChange={(e) =>
                    onChangeInput((prev) => ({
                      ...prev,
                      hostingAnnual: Math.max(0, Number(e.target.value) || 0),
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pe-14 text-sm font-semibold text-[#0B1D39] tabular-nums focus:border-[#2563EB] focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
                <span className="pointer-events-none absolute inset-y-0 end-4 flex items-center text-xs font-semibold text-slate-400">
                  {currencyCfg.symbol[lang]}
                </span>
              </div>
            </div>
          </section>

          {/* Step 2: Project Type Presets */}
          <section
            aria-labelledby="calc-step-2"
            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 space-y-5 dark:border-slate-800 dark:bg-[#0F172A]"
          >
            <div className="flex items-start gap-3.5">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-sm font-bold text-white tabular-nums"
              >
                2
              </span>
              <div>
                <h2 id="calc-step-2" className="text-lg font-bold text-[#0B1D39] dark:text-white">
                  {t.step2Title}
                </h2>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{t.step2Sub}</p>
              </div>
            </div>

            <div
              role="radiogroup"
              aria-label={t.step2Title}
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
            >
              {PROJECT_TYPES.map((pt) => {
                const selected = input.projectType === pt.id;
                const approx = getPresetApproxTotal(pt.id);
                return (
                  <button
                    key={pt.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => handleProjectTypeSelect(pt.id)}
                    className={`flex flex-col justify-between rounded-xl border p-4 text-start transition-colors cursor-pointer ${
                      selected
                        ? 'border-[#2563EB] bg-[#EFF6FF]/60 ring-1 ring-[#2563EB] dark:border-blue-500 dark:bg-blue-950/40 dark:ring-blue-500'
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-[#0B1D39] dark:text-white">
                          {pt.label[lang]}
                        </span>
                        {selected && (
                          <Check className="w-4 h-4 text-[#2563EB] dark:text-blue-400 shrink-0" aria-hidden="true" />
                        )}
                      </div>
                      <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {pt.description[lang]}
                      </p>
                    </div>
                    <p className="mt-3 text-xs font-bold text-[#2563EB] dark:text-blue-400 tabular-nums">
                      {t.approxPrefix} {formatMoney(approx, input.currency, lang)}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 3: Pages & Screens */}
          <section
            aria-labelledby="calc-step-3"
            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 space-y-6 dark:border-slate-800 dark:bg-[#0F172A]"
          >
            <div className="flex items-start gap-3.5">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-sm font-bold text-white tabular-nums"
              >
                3
              </span>
              <div>
                <h2 id="calc-step-3" className="text-lg font-bold text-[#0B1D39] dark:text-white">
                  {t.step3Title}
                </h2>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{t.step3Sub}</p>
              </div>
            </div>

            <div className="space-y-5">
              {PAGE_CATEGORIES.map((cat) => {
                const pagesInCat = PAGES_CATALOG.filter((p) => p.category === cat.id);
                return (
                  <div key={cat.id} className="space-y-2.5">
                    <h3 className="text-xs font-bold tracking-wide text-slate-500 dark:text-slate-400">
                      {cat.label[lang]}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {pagesInCat.map((page) => {
                        const pressed = input.selectedPages.includes(page.id);
                        const itemPrice = getDynamicItemPrice(page.weight);
                        return (
                          <button
                            key={page.id}
                            type="button"
                            aria-pressed={pressed}
                            onClick={() => togglePage(page.id)}
                            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                              pressed
                                ? 'border-[#2563EB] bg-[#2563EB] text-white'
                                : 'border-slate-200 bg-white text-[#0B1D39] hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600'
                            }`}
                          >
                            <span>{page.label[lang]}</span>
                            <span
                              className={`text-xs font-mono tabular-nums ${
                                pressed ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {formatNumber(itemPrice)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Extra Custom Pages Stepper */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-900/70">
                <div>
                  <p className="text-sm font-bold text-[#0B1D39] dark:text-white">{t.extraPagesTitle}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t.extraPagesSub}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label={lang === 'ar' ? 'صفحة أقل' : 'Remove extra page'}
                    disabled={input.extraPages <= 0}
                    onClick={() =>
                      onChangeInput((prev) => ({
                        ...prev,
                        extraPages: Math.max(0, prev.extraPages - 1),
                      }))
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#0B1D39] disabled:opacity-40 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <output
                    data-testid="extra-pages-count"
                    className="w-8 text-center text-base font-bold text-[#0B1D39] dark:text-white tabular-nums"
                  >
                    {input.extraPages}
                  </output>
                  <button
                    type="button"
                    aria-label={lang === 'ar' ? 'صفحة أكثر' : 'Add extra page'}
                    onClick={() =>
                      onChangeInput((prev) => ({
                        ...prev,
                        extraPages: prev.extraPages + 1,
                      }))
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-[#0B1D39] hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Step 4: Features & Languages */}
          <section
            aria-labelledby="calc-step-4"
            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 space-y-6 dark:border-slate-800 dark:bg-[#0F172A]"
          >
            <div className="flex items-start gap-3.5">
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-sm font-bold text-white tabular-nums"
              >
                4
              </span>
              <div>
                <h2 id="calc-step-4" className="text-lg font-bold text-[#0B1D39] dark:text-white">
                  {t.step4Title}
                </h2>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{t.step4Sub}</p>
              </div>
            </div>

            <div className="space-y-5">
              {FEATURE_CATEGORIES.map((cat) => {
                const featsInCat = FEATURES_CATALOG.filter((f) => f.category === cat.id);
                return (
                  <div key={cat.id} className="space-y-2.5">
                    <h3 className="text-xs font-bold tracking-wide text-slate-500 dark:text-slate-400">
                      {cat.label[lang]}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {featsInCat.map((feat) => {
                        const pressed = input.selectedFeatures.includes(feat.id);
                        const itemPrice = getDynamicItemPrice(feat.weight);
                        return (
                          <button
                            key={feat.id}
                            type="button"
                            aria-pressed={pressed}
                            onClick={() => toggleFeature(feat.id)}
                            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                              pressed
                                ? 'border-[#2563EB] bg-[#2563EB] text-white'
                                : 'border-slate-200 bg-white text-[#0B1D39] hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600'
                            }`}
                          >
                            <span>{feat.label[lang]}</span>
                            <span
                              className={`text-xs font-mono tabular-nums ${
                                pressed ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                              }`}
                            >
                              {formatNumber(itemPrice)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Languages Radiogroup */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-5">
                <span className="block text-sm font-bold text-[#0B1D39] dark:text-white">
                  {t.languagesLabel}
                </span>
                <div
                  role="radiogroup"
                  aria-label={t.languagesLabel}
                  className="grid grid-cols-3 gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
                >
                  {(
                    [
                      { count: 1, label: t.lang1 },
                      { count: 2, label: t.lang2 },
                      { count: 3, label: t.lang3 },
                    ] as { count: LanguageCount; label: string }[]
                  ).map((opt) => {
                    const checked = input.languages === opt.count;
                    return (
                      <button
                        key={opt.count}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        onClick={() =>
                          onChangeInput((prev) => ({ ...prev, languages: opt.count }))
                        }
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                          checked
                            ? 'bg-white text-[#0B1D39] shadow-sm dark:bg-slate-950 dark:text-white'
                            : 'text-slate-600 hover:text-[#0B1D39] dark:text-slate-300 dark:hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sticky Live Summary Card (Dark Navy Anchor) */}
        <aside
          id="calculator-summary"
          aria-label={t.summaryTitle}
          className="lg:sticky lg:top-20 rounded-2xl bg-[#0B1D39] dark:bg-[#09152B] p-6 text-white shadow-lg border border-slate-800 dark:border-slate-700/80 space-y-5 scroll-mt-20"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-blue-200">{t.summaryTitle}</p>
            <div className="flex items-baseline gap-2">
              <strong
                data-testid="summary-selected-total"
                className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-white"
              >
                {formatMoney(result.selectedTotal, input.currency, lang)}
              </strong>
            </div>
            <p className="text-xs text-slate-300 tabular-nums">
              {t.summaryRangePrefix} {formatNumber(result.minRange)} {t.summaryRangeMid}{' '}
              {formatMoney(result.maxRange, input.currency, lang)} {t.summaryRangeSuffix}
            </p>
          </div>

          {/* Estimated Duration */}
          <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs">
            <span className="inline-flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-blue-300" aria-hidden="true" />
              {t.summaryDuration}
            </span>
            <span className="font-bold text-white tabular-nums">
              {formatWeeksLabel(result.estimatedWeeks, lang)}
            </span>
          </div>

          {/* 3 Client Design Tier Proposals */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-slate-300">{t.designTierTitle}</p>
            <div role="radiogroup" aria-label={t.designTierTitle} className="space-y-2">
              {(
                [
                  { id: 'template', title: t.tierTemplate, desc: t.tierTemplateDesc },
                  { id: 'custom', title: t.tierCustom, desc: t.tierCustomDesc },
                  { id: 'premium', title: t.tierPremium, desc: t.tierPremiumDesc },
                ] as { id: DesignTierId; title: string; desc: string }[]
              ).map((tier) => {
                const checked = input.designTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    onClick={() =>
                      onChangeInput((prev) => ({ ...prev, designTier: tier.id }))
                    }
                    className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-start transition-colors cursor-pointer ${
                      checked
                        ? 'border-[#3B82F6] bg-[#163464]'
                        : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white">{tier.title}</p>
                      <p className="text-[11px] text-slate-300 leading-snug">{tier.desc}</p>
                    </div>
                    <span className="shrink-0 font-mono text-sm font-bold text-blue-200 tabular-nums">
                      {formatNumber(result.designTierPrices[tier.id])}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Schedule */}
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-white/5 border border-white/10 p-3 text-center">
            <div>
              <p className="text-[11px] text-slate-300">{t.payStart}</p>
              <p className="mt-0.5 text-xs font-bold text-white tabular-nums">
                {formatNumber(result.milestones.start)}
              </p>
            </div>
            <div className="border-x border-white/10 px-1">
              <p className="text-[11px] text-slate-300">{t.payMid}</p>
              <p className="mt-0.5 text-xs font-bold text-white tabular-nums">
                {formatNumber(result.milestones.mid)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-300">{t.payEnd}</p>
              <p className="mt-0.5 text-xs font-bold text-white tabular-nums">
                {formatNumber(result.milestones.end)}
              </p>
            </div>
          </div>

          {/* Expandable Price Breakdown */}
          <div className="border-t border-white/10 pt-3">
            <button
              type="button"
              aria-expanded={breakdownOpen}
              onClick={() => setBreakdownOpen((prev) => !prev)}
              className="flex w-full items-center justify-between text-xs font-semibold text-blue-200 hover:text-white cursor-pointer py-1"
            >
              <span>{t.breakdownToggle}</span>
              {breakdownOpen ? (
                <ChevronUp className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
            {breakdownOpen && (
              <dl className="mt-2.5 space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <dt>{t.breakdownPages}</dt>
                  <dd className="tabular-nums font-medium text-white">
                    {formatMoney(result.breakdown.pagesTotal, input.currency, lang)}
                  </dd>
                </div>
                {result.breakdown.extraPagesTotal > 0 && (
                  <div className="flex justify-between">
                    <dt>{t.breakdownExtra}</dt>
                    <dd className="tabular-nums font-medium text-white">
                      {formatMoney(result.breakdown.extraPagesTotal, input.currency, lang)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt>{t.breakdownFeatures}</dt>
                  <dd className="tabular-nums font-medium text-white">
                    {formatMoney(result.breakdown.featuresTotal, input.currency, lang)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>{t.breakdownDesign}</dt>
                  <dd className="tabular-nums font-medium text-white">
                    +{formatMoney(result.breakdown.designDelta, input.currency, lang)}
                  </dd>
                </div>
                {result.breakdown.urgencyDelta > 0 && (
                  <div className="flex justify-between">
                    <dt>{t.breakdownUrgency}</dt>
                    <dd className="tabular-nums font-medium text-amber-300">
                      +{formatMoney(result.breakdown.urgencyDelta, input.currency, lang)}
                    </dd>
                  </div>
                )}
                {result.breakdown.clientDelta > 0 && (
                  <div className="flex justify-between">
                    <dt>{t.breakdownClient}</dt>
                    <dd className="tabular-nums font-medium text-white">
                      +{formatMoney(result.breakdown.clientDelta, input.currency, lang)}
                    </dd>
                  </div>
                )}
                {result.breakdown.languageDelta > 0 && (
                  <div className="flex justify-between">
                    <dt>{t.breakdownLang}</dt>
                    <dd className="tabular-nums font-medium text-white">
                      +{formatMoney(result.breakdown.languageDelta, input.currency, lang)}
                    </dd>
                  </div>
                )}
                {result.breakdown.hostingAnnual > 0 && (
                  <div className="flex justify-between border-t border-white/10 pt-1.5">
                    <dt>{t.breakdownHosting}</dt>
                    <dd className="tabular-nums font-medium text-blue-200">
                      {formatMoney(result.breakdown.hostingAnnual, input.currency, lang)}
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </div>

          {/* Save to Offline Vault Input + Primary Action Stack */}
          <div className="space-y-2.5 border-t border-white/10 pt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={saveLabel}
                onChange={(e) => setSaveLabel(e.target.value)}
                placeholder={t.vaultClientInputPlaceholder}
                aria-label={t.vaultClientInputPlaceholder}
                className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-2 text-xs font-semibold text-white hover:bg-white/25 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <BookmarkPlus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.btnSaveEstimate}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onConvertToQuote(input)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1D4ED8] cursor-pointer"
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              <span>{t.btnConvertQuote}</span>
            </button>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-2.5 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="truncate">{t.btnCopySummary}</span>
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-2.5 py-2 text-xs font-medium text-slate-200 hover:bg-white/10"
              >
                <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="truncate">{t.btnWhatsApp}</span>
              </a>
              <button
                type="button"
                onClick={onResetCalculator}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-2.5 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="truncate">{t.btnReset}</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Offline Saved Estimates Vault */}
      <section
        aria-labelledby="vault-heading"
        className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 space-y-5 dark:border-slate-800 dark:bg-[#0F172A]"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="vault-heading" className="text-lg font-bold text-[#0B1D39] dark:text-white">
              {t.vaultTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">{t.vaultSub}</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute inset-y-0 start-3 my-auto w-4 h-4 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={vaultSearch}
              onChange={(e) => setVaultSearch(e.target.value)}
              placeholder={t.vaultSearchPlaceholder}
              aria-label={t.vaultSearchPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 ps-9 pe-3 text-sm text-[#0B1D39] focus:border-[#2563EB] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
            />
          </div>
        </div>

        {filteredVault.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">
            {t.vaultEmpty}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filteredVault.map((item) => {
              const typeLabel =
                PROJECT_TYPES.find((p) => p.id === item.input.projectType)?.label[lang] || '';
              const dateStr = new Date(item.createdAt).toLocaleDateString(
                lang === 'ar' ? 'ar-DZ' : lang === 'fr' ? 'fr-FR' : 'en-US'
              );
              return (
                <article
                  key={item.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-300 transition-colors dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-[#0B1D39] dark:text-white">{item.label}</h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>{typeLabel}</span>
                        <span aria-hidden="true"> · </span>
                        <span className="tabular-nums">
                          {item.input.selectedPages.length + item.input.extraPages}{' '}
                          {lang === 'ar' ? 'صفحات' : 'Pages'}
                        </span>
                        <span aria-hidden="true"> · </span>
                        <span>{dateStr}</span>
                      </p>
                    </div>
                    <strong className="shrink-0 text-sm font-extrabold text-[#2563EB] dark:text-blue-400 tabular-nums">
                      {formatMoney(item.total, item.input.currency, lang)}
                    </strong>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <button
                      type="button"
                      onClick={() => onLoadEstimate(item)}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#0B1D39] hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      {t.vaultLoad}
                    </button>
                    <button
                      type="button"
                      onClick={() => onConvertToQuote(item.input)}
                      className="rounded-lg bg-[#EFF6FF] px-3 py-1.5 text-xs font-semibold text-[#2563EB] hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60 cursor-pointer"
                    >
                      {t.vaultOpenDevis}
                    </button>
                    <button
                      type="button"
                      aria-label={`${t.vaultDelete} ${item.label}`}
                      onClick={() => onDeleteEstimate(item.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Compact Mobile Live Total Bar (under 15% mobile viewport cap) */}
      <div className="no-print lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-slate-800 bg-[#0B1D39]/95 backdrop-blur-md px-4 py-2.5 text-white shadow-lg">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-blue-200 leading-none">{t.summaryTitle}</p>
            <p className="mt-0.5 text-base font-extrabold tabular-nums truncate">
              {formatMoney(result.selectedTotal, input.currency, lang)}
            </p>
          </div>
          <a
            href="#calculator-summary"
            className="rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white hover:bg-[#1D4ED8] whitespace-nowrap shrink-0"
          >
            {lang === 'ar' ? 'التفاصيل والعرض' : lang === 'fr' ? 'Voir le résumé' : 'View Summary'}
          </a>
        </div>
      </div>
    </div>
  );
};
