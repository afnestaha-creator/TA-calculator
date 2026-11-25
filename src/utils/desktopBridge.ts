import { useEffect, useState } from 'react';
import { CurrencyCode, Lang } from '../data/catalog';
import { PricingInput, QuoteLineItem } from './pricingEngine';

export interface SavedEstimate {
  id: string;
  label: string;
  createdAt: string;
  input: PricingInput;
  total: number;
}

export interface CompanyProfile {
  name: string;
  role: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
}

export interface QuoteDraft {
  quoteNumber: string;
  issueDate: string;
  validUntil: string;
  clientName: string;
  clientCompany: string;
  clientPhone: string;
  clientEmail: string;
  currency: CurrencyCode;
  includeTva: boolean;
  showQrCode?: boolean;
  qrMode?: 'website' | 'whatsapp';
  paymentMode: '100' | '50-50' | '40-30-30';
  duration: string;
  notes: string;
  items: QuoteLineItem[];
}

interface ElectronAPI {
  isElectron?: boolean;
  getPlatform?: () => Promise<{ platform: string; version: string; isPackaged: boolean }>;
  exportPdf?: (filename?: string) => Promise<{ ok: boolean; filePath?: string; canceled?: boolean }>;
  saveFile?: (payload: {
    defaultFilename: string;
    content: string;
    filters?: { name: string; extensions: string[] }[];
  }) => Promise<{ ok: boolean; filePath?: string; canceled?: boolean }>;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export function isElectronRuntime(): boolean {
  return typeof window !== 'undefined' && Boolean(window.electronAPI?.isElectron);
}

export async function exportCurrentViewToPdf(filename = 'TA-Company-Devis.pdf'): Promise<void> {
  if (typeof window !== 'undefined' && window.electronAPI?.exportPdf) {
    await window.electronAPI.exportPdf(filename);
    return;
  }
  if (typeof window !== 'undefined') {
    const previousTitle = document.title;
    const cleanBase = filename.replace(/\.pdf$/i, '');
    document.title = cleanBase;
    window.print();
    window.setTimeout(() => {
      document.title = previousTitle;
    }, 500);
  }
}

export async function downloadTextFileOffline(filename: string, content: string): Promise<void> {
  if (typeof window !== 'undefined' && window.electronAPI?.saveFile) {
    await window.electronAPI.saveFile({
      defaultFilename: filename,
      content,
      filters: [{ name: 'Text Document', extensions: ['txt', 'md'] }],
    });
    return;
  }
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// LocalStorage Keys
const KEY_SAVED_ESTIMATES = 'ta_company_saved_estimates_v1';
const KEY_COMPANY_PROFILE = 'ta_company_profile_v1';
const KEY_LANG = 'ta_company_lang_v1';
const KEY_THEME = 'ta_company_theme_v1';

export type ThemeMode = 'light' | 'dark';

export function loadStoredTheme(): ThemeMode {
  try {
    const val = localStorage.getItem(KEY_THEME);
    if (val === 'dark' || val === 'light') return val;
  } catch {
    // ignore
  }
  return 'light';
}

export function persistStoredTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(KEY_THEME, theme);
  } catch {
    // ignore
  }
}

const SEED_ESTIMATES: SavedEstimate[] = [
  {
    id: 'seed-1',
    label: 'Atlas Logistics — Corporate Portal',
    createdAt: '2026-11-20T10:30:00.000Z',
    total: 58500,
    input: {
      currency: 'DZD',
      pageRate: 6000,
      urgency: 'normal',
      clientType: 'individual',
      hostingAnnual: 8500,
      projectType: 'showcase',
      selectedPages: ['home', 'about', 'services', 'portfolio', 'contact'],
      extraPages: 0,
      selectedFeatures: ['contact-form', 'whatsapp', 'maps', 'seo'],
      languages: 1,
      designTier: 'custom',
    },
  },
  {
    id: 'seed-2',
    label: 'Medina Retail — E-Commerce Store',
    createdAt: '2026-11-22T14:15:00.000Z',
    total: 145500,
    input: {
      currency: 'DZD',
      pageRate: 6000,
      urgency: 'normal',
      clientType: 'sme',
      hostingAnnual: 12000,
      projectType: 'ecommerce',
      selectedPages: ['home', 'products-list', 'product-detail', 'cart', 'checkout', 'contact'],
      extraPages: 0,
      selectedFeatures: ['cart-orders', 'cod-shipping', 'admin-cms', 'whatsapp', 'seo'],
      languages: 1,
      designTier: 'custom',
    },
  },
];

export function loadSavedEstimates(): SavedEstimate[] {
  try {
    const raw = localStorage.getItem(KEY_SAVED_ESTIMATES);
    if (!raw) {
      localStorage.setItem(KEY_SAVED_ESTIMATES, JSON.stringify(SEED_ESTIMATES));
      return SEED_ESTIMATES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_ESTIMATES;
  } catch {
    return SEED_ESTIMATES;
  }
}

export function persistSavedEstimates(list: SavedEstimate[]): void {
  try {
    localStorage.setItem(KEY_SAVED_ESTIMATES, JSON.stringify(list));
  } catch {
    // Ignore quota errors cleanly
  }
}

export function loadCompanyProfile(lang: Lang): CompanyProfile {
  try {
    const raw = localStorage.getItem(KEY_COMPANY_PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw) as CompanyProfile;
      return {
        ...parsed,
        website: parsed.website !== undefined ? parsed.website : 'https://tacompany.dz',
      };
    }
  } catch {
    // fallback below
  }
  return {
    name: 'TA Company',
    role:
      lang === 'ar'
        ? 'تطوير البرمجيات وحلول الويب وسطح المكتب'
        : lang === 'fr'
        ? 'Ingénierie logicielle, Web & Applications Bureau'
        : 'Software Engineering, Web & Desktop Solutions',
    phone: '+213 550 00 00 00',
    email: 'contact@tacompany.dz',
    address: lang === 'ar' ? 'الجزائر العاصمة' : 'Algiers, Algeria',
    website: 'https://tacompany.dz',
  };
}

export function persistCompanyProfile(profile: CompanyProfile): void {
  try {
    localStorage.setItem(KEY_COMPANY_PROFILE, JSON.stringify(profile));
  } catch {
    // Ignore storage errors
  }
}

export function loadStoredLang(): Lang {
  try {
    const val = localStorage.getItem(KEY_LANG);
    if (val === 'ar' || val === 'en' || val === 'fr') return val;
  } catch {
    // ignore
  }
  return 'ar';
}

export function persistStoredLang(lang: Lang): void {
  try {
    localStorage.setItem(KEY_LANG, lang);
  } catch {
    // ignore
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let cachedDeferredPrompt: BeforeInstallPromptEvent | null = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    cachedDeferredPrompt = e as BeforeInstallPromptEvent;
  });
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(
    () => cachedDeferredPrompt
  );
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isEmbeddedIframe, setIsEmbeddedIframe] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      isElectronRuntime();
    setIsInstalled(isStandalone);

    try {
      setIsEmbeddedIframe(window.self !== window.top);
    } catch {
      setIsEmbeddedIframe(true);
    }

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    if (cachedDeferredPrompt) {
      setDeferredPrompt(cachedDeferredPrompt);
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      cachedDeferredPrompt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      cachedDeferredPrompt = null;
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = async () => {
    const promptEvent = deferredPrompt || cachedDeferredPrompt;
    if (!promptEvent) return false;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      cachedDeferredPrompt = null;
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: Boolean(deferredPrompt),
    isInstalled,
    isIOS,
    isEmbeddedIframe,
    install,
  };
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
