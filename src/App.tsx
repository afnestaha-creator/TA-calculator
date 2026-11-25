import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { AboutDesktopView } from './components/AboutDesktopView';
import { DesktopInstallModal } from './components/DesktopInstallModal';
import { PriceCalculatorDashboard } from './components/PriceCalculatorDashboard';
import { QuoteGeneratorView } from './components/QuoteGeneratorView';
import { ResourcesView } from './components/ResourcesView';
import { ActiveTab, TopBar } from './components/TopBar';
import { Lang } from './data/catalog';
import { UI_TEXT } from './i18n/translations';
import {
  CompanyProfile,
  loadCompanyProfile,
  loadSavedEstimates,
  loadStoredLang,
  loadStoredTheme,
  persistCompanyProfile,
  persistSavedEstimates,
  persistStoredLang,
  persistStoredTheme,
  QuoteDraft,
  SavedEstimate,
  ThemeMode,
  useOnlineStatus,
  usePWAInstall,
} from './utils/desktopBridge';
import {
  calculateProjectEstimate,
  convertEstimateToQuoteItems,
  createDefaultPricingInput,
  formatWeeksLabel,
  PricingInput,
} from './utils/pricingEngine';

function createInitialQuoteDraft(lang: Lang): QuoteDraft {
  const now = new Date();
  const valid = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const formatDate = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}/${d.getFullYear()}`;

  const defaultInput = createDefaultPricingInput('showcase', 'DZD');
  const defaultResult = calculateProjectEstimate(defaultInput);

  return {
    quoteNumber: `TA-${now.getFullYear()}-001`,
    issueDate: formatDate(now),
    validUntil: formatDate(valid),
    clientName: '',
    clientCompany: '',
    clientPhone: '',
    clientEmail: '',
    currency: defaultInput.currency,
    includeTva: false,
    showQrCode: true,
    qrMode: 'website',
    paymentMode: '40-30-30',
    duration: formatWeeksLabel(defaultResult.estimatedWeeks, lang),
    notes:
      lang === 'ar'
        ? '• يشمل السعر جولتين من التعديلات على التصميم قبل البرمجة.\n• لا يشمل السعر النطاق والاستضافة إلا إذا ذُكر كبند منفصل.\n• يبدأ التنفيذ بعد تأكيد الدفعة الأولى (40%) واستلام المحتوى.'
        : lang === 'fr'
        ? '• Deux révisions de design incluses avant développement.\n• Nom de domaine et hébergement facturés séparément sauf mention contraire.\n• Démarrage après réception de l’acompte de 40%.'
        : '• Includes two design revision rounds prior to development.\n• Domain & hosting billed separately unless listed above.\n• Production begins upon receipt of the 40% kickoff deposit.',
    items: convertEstimateToQuoteItems(defaultInput, defaultResult, lang),
  };
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => loadStoredLang());
  const [theme, setTheme] = useState<ThemeMode>(() => loadStoredTheme());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [calcInput, setCalcInput] = useState<PricingInput>(() =>
    createDefaultPricingInput('showcase', 'DZD')
  );
  const [savedEstimates, setSavedEstimates] = useState<SavedEstimate[]>(() =>
    loadSavedEstimates()
  );
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(() =>
    loadCompanyProfile(loadStoredLang())
  );
  const [quoteDraft, setQuoteDraft] = useState<QuoteDraft>(() =>
    createInitialQuoteDraft(loadStoredLang())
  );
  const [installModalOpen, setInstallModalOpen] = useState(false);

  const isOnline = useOnlineStatus();
  const { isInstallable, isInstalled, isIOS, isEmbeddedIframe, install } = usePWAInstall();
  const t = UI_TEXT[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    persistStoredLang(lang);
  }, [lang]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    persistStoredTheme(theme);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#070D19' : '#0B1D39');
    }
  }, [theme]);

  useEffect(() => {
    persistCompanyProfile(companyProfile);
  }, [companyProfile]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleTriggerInstall = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) return;
    }
    setInstallModalOpen(true);
  };

  const handleSaveEstimate = (label: string, total: number) => {
    const newItem: SavedEstimate = {
      id: `est-${Date.now()}`,
      label,
      createdAt: new Date().toISOString(),
      input: { ...calcInput },
      total,
    };
    setSavedEstimates((prev) => {
      const updated = [newItem, ...prev];
      persistSavedEstimates(updated);
      return updated;
    });
  };

  const handleLoadEstimate = (estimate: SavedEstimate) => {
    setCalcInput({ ...estimate.input });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteEstimate = (id: string) => {
    setSavedEstimates((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      persistSavedEstimates(updated);
      return updated;
    });
  };

  const handleConvertToQuote = (sourceInput: PricingInput) => {
    const result = calculateProjectEstimate(sourceInput);
    const items = convertEstimateToQuoteItems(sourceInput, result, lang);
    const baseDraft = createInitialQuoteDraft(lang);
    setQuoteDraft((prev) => ({
      ...baseDraft,
      clientName: prev.clientName,
      clientCompany: prev.clientCompany,
      showQrCode: prev.showQrCode ?? true,
      qrMode: prev.qrMode ?? 'website',
      currency: sourceInput.currency,
      duration: formatWeeksLabel(result.estimatedWeeks, lang),
      items,
    }));
    setActiveTab('quote');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewBlankQuote = () => {
    const blank = createInitialQuoteDraft(lang);
    setQuoteDraft({
      ...blank,
      currency: calcInput.currency,
      items: [
        {
          id: `item-${Date.now()}`,
          description:
            lang === 'ar'
              ? 'تطوير موقع إلكتروني متكامل'
              : lang === 'fr'
              ? 'Développement d’application web'
              : 'Custom Web Application Development',
          quantity: 1,
          unitPrice: calcInput.pageRate * 5,
          total: calcInput.pageRate * 5,
        },
      ],
    });
    setActiveTab('quote');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-architectural-grid text-[#0B1D39] dark:text-slate-100">
      <TopBar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartNewQuote={() => handleConvertToQuote(calcInput)}
        lang={lang}
        isInstalled={isInstalled}
        isIOS={isIOS}
        onTriggerInstall={handleTriggerInstall}
      />

      {!isOnline && (
        <div
          role="status"
          className="no-print bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs font-semibold text-amber-900 flex items-center justify-center gap-2 dark:bg-amber-950/70 dark:border-amber-800 dark:text-amber-200"
        >
          <WifiOff className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300 shrink-0" aria-hidden="true" />
          <span>{t.offlineBadge}</span>
        </div>
      )}

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {activeTab === 'dashboard' && (
          <PriceCalculatorDashboard
            lang={lang}
            onChangeLang={setLang}
            theme={theme}
            onToggleTheme={toggleTheme}
            input={calcInput}
            onChangeInput={setCalcInput}
            savedEstimates={savedEstimates}
            onSaveEstimate={handleSaveEstimate}
            onLoadEstimate={handleLoadEstimate}
            onDeleteEstimate={handleDeleteEstimate}
            onConvertToQuote={handleConvertToQuote}
            onResetCalculator={() =>
              setCalcInput(createDefaultPricingInput('showcase', calcInput.currency))
            }
          />
        )}

        {activeTab === 'quote' && (
          <QuoteGeneratorView
            lang={lang}
            theme={theme}
            onToggleTheme={toggleTheme}
            company={companyProfile}
            onChangeCompany={setCompanyProfile}
            draft={quoteDraft}
            onChangeDraft={setQuoteDraft}
            onNewBlankQuote={handleNewBlankQuote}
          />
        )}

        {activeTab === 'resources' && (
          <ResourcesView
            lang={lang}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        )}

        {activeTab === 'about' && (
          <AboutDesktopView
            lang={lang}
            theme={theme}
            onToggleTheme={toggleTheme}
            onJumpToCalculator={() => {
              setActiveTab('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isInstalled={isInstalled}
            onTriggerInstall={handleTriggerInstall}
          />
        )}
      </main>

      <DesktopInstallModal
        open={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        lang={lang}
        isInstallable={isInstallable}
        isIOS={isIOS}
        isEmbeddedIframe={isEmbeddedIframe}
        onNativeInstall={install}
        onOpenElectronGuide={() => {
          setActiveTab('about');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <footer className="no-print border-t border-slate-200/80 bg-white pb-20 lg:pb-0 dark:border-slate-800 dark:bg-[#0B1120]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="space-y-1">
            <strong className="text-sm font-extrabold text-[#0B1D39] dark:text-white">
              {t.brandName}
            </strong>
            <p className="text-xs text-slate-500 dark:text-slate-400">{t.footerDesc}</p>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="hover:text-[#0B1D39] dark:hover:text-white cursor-pointer"
            >
              {t.navDashboard}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quote')}
              className="hover:text-[#0B1D39] dark:hover:text-white cursor-pointer"
            >
              {t.navQuote}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('resources')}
              className="hover:text-[#0B1D39] dark:hover:text-white cursor-pointer"
            >
              {t.navResources}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className="hover:text-[#0B1D39] dark:hover:text-white cursor-pointer"
            >
              {t.navAbout}
            </button>
          </nav>
          <p className="text-xs text-slate-400 dark:text-slate-500">{t.footerRights}</p>
        </div>
      </footer>
    </div>
  );
}
