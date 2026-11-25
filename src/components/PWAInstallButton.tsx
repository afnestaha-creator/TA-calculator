import React from 'react';
import { Download } from 'lucide-react';
import { Lang } from '../data/catalog';
import { UI_TEXT } from '../i18n/translations';

interface PWAInstallButtonProps {
  lang: Lang;
  isInstalled: boolean;
  isIOS: boolean;
  onTriggerInstall: () => void;
  fullWidth?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  lang,
  isInstalled,
  isIOS,
  onTriggerInstall,
  fullWidth = false,
}) => {
  const t = UI_TEXT[lang];

  if (isInstalled) return null;

  return (
    <button
      type="button"
      onClick={onTriggerInstall}
      data-testid="install-desktop-btn"
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-[#0B1D39] transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-[#2563EB] whitespace-nowrap shrink-0 cursor-pointer ${
        fullWidth ? 'w-full py-2.5' : ''
      }`}
    >
      <Download className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" aria-hidden="true" />
      <span>{isIOS ? t.installOnIOS : t.installApp}</span>
    </button>
  );
};
