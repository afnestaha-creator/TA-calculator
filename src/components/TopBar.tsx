import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Lang } from '../data/catalog';
import { UI_TEXT } from '../i18n/translations';
import { PWAInstallButton } from './PWAInstallButton';

export type ActiveTab = 'dashboard' | 'quote' | 'resources' | 'about';

interface TopBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onStartNewQuote: () => void;
  lang: Lang;
  isInstalled: boolean;
  isIOS: boolean;
  onTriggerInstall: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  onStartNewQuote,
  lang,
  isInstalled,
  isIOS,
  onTriggerInstall,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = UI_TEXT[lang];

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'dashboard', label: t.navDashboard },
    { id: 'quote', label: t.navQuote },
    { id: 'resources', label: t.navResources },
    { id: 'about', label: t.navAbout },
  ];

  const handleNavClick = (id: ActiveTab) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="no-print sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-[#0B1120]/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-2.5 text-start whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2563EB] rounded-lg"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 512 512"
            fill="none"
            aria-hidden="true"
            className="shrink-0 rounded-lg ring-1 ring-slate-900/10 dark:ring-white/15"
          >
            <rect width="512" height="512" rx="112" fill="#0B1D39" />
            <path d="M132 168H276V208H224V348H184V208H132V168Z" fill="#FFFFFF" />
            <path
              d="M294 348L340 168H382L428 348H386L376 306H346L336 348H294ZM353 270H369L361 230L353 270Z"
              fill="#3B82F6"
            />
          </svg>
          <span className="text-lg font-extrabold tracking-tight text-[#0B1D39] dark:text-white whitespace-nowrap shrink-0">
            {t.brandName}
          </span>
        </button>

        {/* Zone 2: Clean Single-Line Navigation Links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center md:gap-4 lg:gap-7">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 text-xs lg:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2563EB] rounded ${
                  isActive
                    ? 'text-[#2563EB] dark:text-blue-400'
                    : 'text-slate-600 hover:text-[#0B1D39] dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[20px] h-0.5 bg-[#2563EB] dark:bg-blue-400"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:block">
            <PWAInstallButton
              lang={lang}
              isInstalled={isInstalled}
              isIOS={isIOS}
              onTriggerInstall={onTriggerInstall}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              onStartNewQuote();
              setMobileMenuOpen(false);
            }}
            className="rounded-xl bg-[#2563EB] px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.newQuoteCta}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? t.close : 'Menu'}
            className="inline-flex md:hidden items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-[#0B1D39] hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 cursor-pointer min-h-[40px] min-w-[40px]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1.5 dark:border-slate-800 dark:bg-[#0B1120]"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-300'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2">
            <PWAInstallButton
              lang={lang}
              isInstalled={isInstalled}
              isIOS={isIOS}
              onTriggerInstall={() => {
                setMobileMenuOpen(false);
                onTriggerInstall();
              }}
              fullWidth
            />
          </div>
        </nav>
      )}
    </header>
  );
};
