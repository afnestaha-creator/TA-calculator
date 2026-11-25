import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Lang } from '../data/catalog';
import { UI_TEXT } from '../i18n/translations';
import { ThemeMode } from '../utils/desktopBridge';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  lang: Lang;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggleTheme,
  lang,
}) => {
  const t = UI_TEXT[lang];
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggleTheme}
      aria-label={t.themeToggleLabel}
      aria-pressed={isDark}
      data-testid="theme-toggle"
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#0B1D39] transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-[#2563EB] shrink-0" aria-hidden="true" />
      )}
      <span>{isDark ? t.themeLight : t.themeDark}</span>
    </button>
  );
};
