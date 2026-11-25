import React, { useState } from 'react';
import { Check, Copy, Download, HardDrive, Layers, Monitor } from 'lucide-react';
import { Lang } from '../data/catalog';
import { UI_TEXT } from '../i18n/translations';
import { isElectronRuntime, ThemeMode } from '../utils/desktopBridge';
import { ThemeToggle } from './ThemeToggle';

interface AboutDesktopViewProps {
  lang: Lang;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onJumpToCalculator: () => void;
  isInstalled: boolean;
  onTriggerInstall: () => void;
}

const ELECTRON_SETUP_COMMANDS = `npm install -D electron electron-builder\nnpm run electron:dev\nnpm run electron:build`;

export const AboutDesktopView: React.FC<AboutDesktopViewProps> = ({
  lang,
  theme,
  onToggleTheme,
  onJumpToCalculator,
  isInstalled,
  onTriggerInstall,
}) => {
  const t = UI_TEXT[lang];
  const [studioImgFailed, setStudioImgFailed] = useState(false);
  const [bookImgFailed, setBookImgFailed] = useState(false);
  const [copiedCmds, setCopiedCmds] = useState(false);
  const inElectron = isElectronRuntime();

  const handleCopyCommands = async () => {
    try {
      await navigator.clipboard.writeText(ELECTRON_SETUP_COMMANDS);
      setCopiedCmds(true);
      window.setTimeout(() => setCopiedCmds(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="space-y-8">
      {/* Studio Overview Split */}
      <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-[#0F172A]">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-[#2563EB] dark:text-blue-400">
                  {t.brandName}
                </p>
                <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} lang={lang} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1D39] dark:text-white leading-tight">
                {t.aboutTitle}
              </h1>
              <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                {t.aboutLead}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.aboutBody}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {!isInstalled && (
                <button
                  type="button"
                  onClick={onTriggerInstall}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>{t.installApp}</span>
                </button>
              )}
              <button
                type="button"
                onClick={onJumpToCalculator}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-colors cursor-pointer ${
                  isInstalled
                    ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                    : 'border border-slate-200 bg-white text-[#0B1D39] hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t.navDashboard}
              </button>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {inElectron
                  ? 'Electron Desktop Runtime'
                  : 'Web & Offline PWA Runtime'}
              </span>
            </div>
          </div>

          <div className="min-h-[240px] bg-slate-100 dark:bg-slate-900 relative">
            {!studioImgFailed ? (
              <img
                src="/src/assets/images/ta_workspace_studio_1795532748604.jpg"
                alt="TA Company engineering workspace"
                referrerPolicy="no-referrer"
                onError={() => setStudioImgFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6 text-center">
                <Monitor className="w-10 h-10 text-[#2563EB] dark:text-blue-400" aria-hidden="true" />
                <p className="text-sm font-bold text-[#0B1D39] dark:text-white">TA Company Studio</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Handbook & Electron Cross-Platform Packaging */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)] items-stretch">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-col justify-between dark:border-slate-800 dark:bg-[#0F172A]">
          <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
            {!bookImgFailed ? (
              <img
                src="/src/assets/images/ta_handbook_cover_1795532749896.jpg"
                alt="TA Company Engineering Handbook"
                referrerPolicy="no-referrer"
                onError={() => setBookImgFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-[#0B1D39] text-white p-6 text-center">
                <p className="text-lg font-extrabold">TA Company</p>
                <p className="mt-1 text-xs text-blue-200">Engineering Handbook</p>
              </div>
            )}
          </div>
          <div className="mt-4">
            <h2 className="text-base font-bold text-[#0B1D39] dark:text-white">
              {lang === 'ar'
                ? 'دليل TA Company الهندسي'
                : lang === 'fr'
                ? 'Manuel d’Ingénierie TA Company'
                : 'TA Company Engineering Playbook'}
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              {lang === 'ar'
                ? 'مرجع تسعير المشاريع وتغليف تطبيقات سطح المكتب دون اتصال.'
                : 'Standardized pricing methodology & offline desktop architecture.'}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 dark:border-slate-800 dark:bg-[#0F172A]">
          <div>
            <h2 className="text-xl font-extrabold text-[#0B1D39] dark:text-white">
              {t.desktopGuideTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {t.desktopGuideSub}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1.5 dark:border-slate-800 dark:bg-slate-900">
              <Monitor className="w-5 h-5 text-[#2563EB] dark:text-blue-400" aria-hidden="true" />
              <h3 className="text-sm font-bold text-[#0B1D39] dark:text-white">
                Windows / macOS / Linux
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'ar'
                  ? 'ملفات electron/main.cjs و electron-builder.json مهيأة لإصدار .exe و .dmg و .AppImage.'
                  : 'Configured via electron/main.cjs and electron-builder.json for .exe, .dmg, and .AppImage.'}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1.5 dark:border-slate-800 dark:bg-slate-900">
              <HardDrive className="w-5 h-5 text-[#2563EB] dark:text-blue-400" aria-hidden="true" />
              <h3 className="text-sm font-bold text-[#0B1D39] dark:text-white">
                {lang === 'ar' ? 'تخزين محلي كامل' : 'Offline Storage'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'ar'
                  ? 'Service Worker + حفظ العروض وبيانات الشركة محليًا للعمل دون شبكة.'
                  : 'Service Worker asset caching plus local estimate vault and PDF printing without internet.'}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1.5 dark:border-slate-800 dark:bg-slate-900">
              <Layers className="w-5 h-5 text-[#2563EB] dark:text-blue-400" aria-hidden="true" />
              <h3 className="text-sm font-bold text-[#0B1D39] dark:text-white">
                {lang === 'ar' ? 'تصدير PDF فوري' : 'Native PrintToPDF'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'ar'
                  ? 'تصدير عروض السعر (Devis) بصيغة A4 مباشرة من Electron أو المتصفح.'
                  : 'Uses Electron native printToPDF dialog in desktop mode or A4 print stylesheet in browser.'}
              </p>
            </div>
          </div>

          <div
            className="rounded-xl bg-[#0B1D39] p-4 sm:p-5 text-slate-200 font-mono text-xs space-y-1.5 overflow-x-auto border border-slate-800"
            dir="ltr"
          >
            <div className="flex items-center justify-between gap-2 pb-1">
              <p className="text-blue-300"># Install Electron &amp; builder locally to package desktop installers</p>
              <button
                type="button"
                onClick={handleCopyCommands}
                className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-900 px-2.5 py-1 font-sans text-[11px] font-semibold text-slate-200 hover:bg-slate-800 cursor-pointer shrink-0"
              >
                {copiedCmds ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedCmds ? t.desktopCmdCopied : t.desktopCopyCmd}</span>
              </button>
            </div>
            <p>npm install -D electron electron-builder</p>
            <p>npm run electron:dev   # Launch desktop window in dev</p>
            <p>npm run electron:build # Build offline .exe / .dmg / .AppImage</p>
          </div>
        </div>
      </section>
    </div>
  );
};
