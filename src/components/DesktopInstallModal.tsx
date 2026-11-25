import React, { useEffect, useState } from 'react';
import { Check, Copy, Download, ExternalLink, Laptop, Terminal, X } from 'lucide-react';
import { Lang } from '../data/catalog';
import { UI_TEXT } from '../i18n/translations';

interface DesktopInstallModalProps {
  open: boolean;
  onClose: () => void;
  lang: Lang;
  isInstallable: boolean;
  isIOS: boolean;
  isEmbeddedIframe: boolean;
  onNativeInstall: () => Promise<boolean>;
  onOpenElectronGuide: () => void;
}

const ELECTRON_COMMAND = 'npm install -D electron electron-builder && npm run electron:build';

export const DesktopInstallModal: React.FC<DesktopInstallModalProps> = ({
  open,
  onClose,
  lang,
  isInstallable,
  isIOS,
  isEmbeddedIframe,
  onNativeInstall,
  onOpenElectronGuide,
}) => {
  const t = UI_TEXT[lang];
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '/';

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedUrl(true);
      window.setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleCopyCmd = async () => {
    try {
      await navigator.clipboard.writeText(ELECTRON_COMMAND);
      setCopiedCmd(true);
      window.setTimeout(() => setCopiedCmd(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleDirectInstall = async () => {
    const accepted = await onNativeInstall();
    if (accepted) {
      onClose();
    }
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-[#0B1D39]/70 backdrop-blur-[2px] p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="desktop-install-heading"
      data-testid="desktop-install-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#0F172A]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-400">
              <Laptop className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="desktop-install-heading"
                className="text-lg font-extrabold text-[#0B1D39] dark:text-white"
              >
                {t.desktopModalTitle}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {t.desktopModalSub}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {/* Option 1: Direct Native Install if prompt available */}
          {isInstallable && (
            <div className="rounded-xl border border-[#2563EB]/30 bg-[#EFF6FF] p-4 dark:border-blue-500/40 dark:bg-blue-950/40">
              <button
                type="button"
                onClick={handleDirectInstall}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>{t.desktopDirectInstallBtn}</span>
              </button>
            </div>
          )}

          {/* Embedded iframe notice + Open Standalone Tab */}
          {isEmbeddedIframe && !isInstallable && (
            <div className="rounded-xl border border-blue-200 bg-[#EFF6FF] p-4 space-y-3 dark:border-blue-900/60 dark:bg-blue-950/35">
              <p className="text-xs sm:text-sm font-medium text-[#0B1D39] dark:text-slate-200 leading-relaxed">
                {t.desktopIframeNotice}
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  <span>{t.desktopOpenStandaloneBtn}</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#0B1D39] hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                >
                  {copiedUrl ? (
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>{copiedUrl ? t.desktopUrlCopied : t.desktopCopyUrlBtn}</span>
                </button>
              </div>
            </div>
          )}

          {/* Browser Desktop Install Steps */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2.5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold text-[#0B1D39] dark:text-white">
              {isIOS ? t.iosInstallTitle : t.desktopBrowserStepsTitle}
            </h3>
            {isIOS ? (
              <div className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>{t.iosInstallStep1}</p>
                <p>{t.iosInstallStep2}</p>
              </div>
            ) : (
              <div className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>{t.desktopChromeStep1}</p>
                <p>{t.desktopChromeStep2}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                  {t.desktopMacSafariStep}
                </p>
              </div>
            )}
          </div>

          {/* Electron Native Installer Packaging */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 dark:border-slate-800 dark:bg-[#0B1120]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#2563EB] dark:text-blue-400 shrink-0" aria-hidden="true" />
                <h3 className="text-sm font-bold text-[#0B1D39] dark:text-white">
                  {t.desktopElectronBoxTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCopyCmd}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer shrink-0"
              >
                {copiedCmd ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copiedCmd ? t.desktopCmdCopied : t.desktopCopyCmd}</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {t.desktopElectronBoxDesc}
            </p>
            <pre
              dir="ltr"
              className="rounded-lg bg-[#0B1D39] px-3.5 py-2.5 text-xs font-mono text-blue-200 overflow-x-auto"
            >
              {ELECTRON_COMMAND}
            </pre>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenElectronGuide();
                }}
                className="text-xs font-semibold text-[#2563EB] hover:underline dark:text-blue-400 cursor-pointer"
              >
                {t.desktopViewGuideBtn}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
