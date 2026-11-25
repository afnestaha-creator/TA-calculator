import React from 'react';
import { FilePlus2, Plus, Printer, QrCode, Trash2 } from 'lucide-react';
import { Lang } from '../data/catalog';
import { UI_TEXT } from '../i18n/translations';
import {
  CompanyProfile,
  exportCurrentViewToPdf,
  QuoteDraft,
  ThemeMode,
} from '../utils/desktopBridge';
import { formatMoney, QuoteLineItem } from '../utils/pricingEngine';
import { buildWhatsAppContactUrl, normalizeQrUrl, QuoteQrCode } from './QuoteQrCode';
import { ThemeToggle } from './ThemeToggle';

interface QuoteGeneratorViewProps {
  lang: Lang;
  theme: ThemeMode;
  onToggleTheme: () => void;
  company: CompanyProfile;
  onChangeCompany: React.Dispatch<React.SetStateAction<CompanyProfile>>;
  draft: QuoteDraft;
  onChangeDraft: React.Dispatch<React.SetStateAction<QuoteDraft>>;
  onNewBlankQuote: () => void;
}

export const QuoteGeneratorView: React.FC<QuoteGeneratorViewProps> = ({
  lang,
  theme,
  onToggleTheme,
  company,
  onChangeCompany,
  draft,
  onChangeDraft,
  onNewBlankQuote,
}) => {
  const t = UI_TEXT[lang];

  const subtotal = draft.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tvaAmount = draft.includeTva ? Math.round(subtotal * 0.19) : 0;
  const grandTotal = subtotal + tvaAmount;

  const updateItem = (id: string, patch: Partial<QuoteLineItem>) => {
    onChangeDraft((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, ...patch };
        next.total = next.quantity * next.unitPrice;
        return next;
      }),
    }));
  };

  const addItem = () => {
    const nextId = `item-${Date.now()}`;
    onChangeDraft((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: nextId,
          description:
            lang === 'ar'
              ? 'بند خدمة جديد'
              : lang === 'fr'
              ? 'Nouvelle prestation'
              : 'New Service Item',
          quantity: 1,
          unitPrice: 0,
          total: 0,
        },
      ],
    }));
  };

  const removeItem = (id: string) => {
    onChangeDraft((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const paymentScheduleRows = (() => {
    if (draft.paymentMode === '100') {
      return [
        {
          label: t.quotePay100,
          amount: grandTotal,
        },
      ];
    }
    if (draft.paymentMode === '50-50') {
      const half = Math.round(grandTotal * 0.5);
      return [
        { label: lang === 'ar' ? '50% عند البداية' : '50% Kickoff', amount: half },
        {
          label: lang === 'ar' ? '50% عند التسليم' : '50% Delivery',
          amount: grandTotal - half,
        },
      ];
    }
    const p1 = Math.round(grandTotal * 0.4);
    const p2 = Math.round(grandTotal * 0.3);
    return [
      { label: t.payStart, amount: p1 },
      { label: t.payMid, amount: p2 },
      { label: t.payEnd, amount: Math.max(0, grandTotal - p1 - p2) },
    ];
  })();

  const handlePrintToPdf = () => {
    exportCurrentViewToPdf(`${draft.quoteNumber || 'TA-Company-Devis'}.pdf`);
  };

  const qrEnabled = draft.showQrCode !== false;
  const qrMode = draft.qrMode ?? 'website';
  const rawWebsite = company.website ?? 'https://tacompany.dz';
  const resolvedQrUrl =
    qrMode === 'whatsapp'
      ? buildWhatsAppContactUrl(company.phone)
      : normalizeQrUrl(rawWebsite);
  const displayQrLabel =
    qrMode === 'whatsapp'
      ? `wa.me/${company.phone.replace(/[^\d]/g, '')}`
      : resolvedQrUrl.replace(/^https?:\/\//i, '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="no-print flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1D39] dark:text-white">
            {t.quotePageTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t.quotePageSub}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t.quotePrintHint}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} lang={lang} />
          <button
            type="button"
            onClick={onNewBlankQuote}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0B1D39] hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <FilePlus2 className="w-4 h-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
            <span>{t.quoteNewBlank}</span>
          </button>
          <button
            type="button"
            data-testid="print-to-pdf-btn"
            onClick={handlePrintToPdf}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" aria-hidden="true" />
            <span>{t.quoteExportPdf}</span>
          </button>
        </div>
      </div>

      {/* Split Workspace: Editor + Live A4 Preview */}
      <div className="print-container grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_540px] items-start">
        {/* Form Steps */}
        <div className="no-print space-y-6">
          {/* 1. Provider (TA Company) */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 dark:border-slate-800 dark:bg-[#0F172A]">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB] text-xs font-bold text-white">
                1
              </span>
              <h2 className="text-base font-bold text-[#0B1D39] dark:text-white">
                {t.quoteStepProvider}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{t.quoteProviderName}</span>
                <input
                  type="text"
                  value={company.name}
                  onChange={(e) =>
                    onChangeCompany((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-[#0B1D39] focus:border-[#2563EB] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                />
              </label>
              <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{t.quoteProviderRole}</span>
                <input
                  type="text"
                  value={company.role}
                  onChange={(e) =>
                    onChangeCompany((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-[#0B1D39] focus:border-[#2563EB] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                />
              </label>
              <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{t.quoteProviderPhone}</span>
                <input
                  type="text"
                  dir="ltr"
                  value={company.phone}
                  onChange={(e) =>
                    onChangeCompany((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-[#0B1D39] text-start focus:border-[#2563EB] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                />
              </label>
              <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{t.quoteProviderEmail}</span>
                <input
                  type="email"
                  dir="ltr"
                  value={company.email}
                  onChange={(e) =>
                    onChangeCompany((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-[#0B1D39] text-start focus:border-[#2563EB] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                />
              </label>
              <label className="sm:col-span-2 space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{t.quoteProviderAddress}</span>
                <input
                  type="text"
                  value={company.address}
                  onChange={(e) =>
                    onChangeCompany((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-[#0B1D39] focus:border-[#2563EB] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                />
              </label>

              {/* QR Code Target URL & Mode */}
              <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-3 dark:border-slate-800 dark:bg-slate-900/70">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-2 text-xs font-bold text-[#0B1D39] dark:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      data-testid="toggle-qr-checkbox"
                      checked={qrEnabled}
                      onChange={(e) =>
                        onChangeDraft((prev) => ({ ...prev, showQrCode: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <QrCode className="w-4 h-4 text-[#2563EB] dark:text-blue-400" aria-hidden="true" />
                    <span>{t.quoteQrToggle}</span>
                  </label>

                  {qrEnabled && (
                    <div
                      role="group"
                      aria-label={t.quoteProviderWebsite}
                      className="inline-flex rounded-lg bg-slate-200/75 p-0.5 dark:bg-slate-800"
                    >
                      <button
                        type="button"
                        data-testid="qr-mode-website"
                        onClick={() =>
                          onChangeDraft((prev) => ({ ...prev, qrMode: 'website' }))
                        }
                        className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                          qrMode === 'website'
                            ? 'bg-white text-[#0B1D39] shadow-xs dark:bg-slate-950 dark:text-white'
                            : 'text-slate-600 hover:text-[#0B1D39] dark:text-slate-300'
                        }`}
                      >
                        {t.quoteQrPresetSite}
                      </button>
                      <button
                        type="button"
                        data-testid="qr-mode-whatsapp"
                        onClick={() =>
                          onChangeDraft((prev) => ({ ...prev, qrMode: 'whatsapp' }))
                        }
                        className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                          qrMode === 'whatsapp'
                            ? 'bg-white text-[#0B1D39] shadow-xs dark:bg-slate-950 dark:text-white'
                            : 'text-slate-600 hover:text-[#0B1D39] dark:text-slate-300'
                        }`}
                      >
                        {t.quoteQrPresetWhatsapp}
                      </button>
                    </div>
                  )}
                </div>

                {qrEnabled && qrMode === 'website' && (
                  <label className="block space-y-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>{t.quoteProviderWebsite}</span>
                    <input
                      type="url"
                      dir="ltr"
                      data-testid="qr-website-input"
                      placeholder="https://tacompany.dz/contact"
                      value={rawWebsite}
                      onChange={(e) =>
                        onChangeCompany((prev) => ({ ...prev, website: e.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-[#0B1D39] text-start focus:border-[#2563EB] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </label>
                )}
              </div>
            </div>
          </section>

          {/* 2. Client & Reference */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 dark:border-slate-800 dark:bg-[#0F172A]">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB] text-xs font-bold text-white">
                2
              </span>
              <h2 className="text-base font-bold text-[#0B1D39] dark:text-white">
                {t.quoteStepClient}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{t.quoteClientName}</span>
                <input
                  type="text"
                  value={draft.clientName}
                  onChange={(e) =>
                    onChangeDraft((prev) => ({ ...prev, clientName: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-[#0B1D39] focus:border-[#2563EB] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                />
              </label>
              <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{t.quoteClientCompany}</span>
                <input
                  type="text"
                  value={draft.clientCompany}
                  onChange={(e) =>
                    onChangeDraft((prev) => ({ ...prev, clientCompany: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-[#0B1D39] focus:border-[#2563EB] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                />
              </label>
              <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{t.quoteNumber}</span>
                <input
                  type="text"
                  dir="ltr"
                  value={draft.quoteNumber}
                  onChange={(e) =>
                    onChangeDraft((prev) => ({ ...prev, quoteNumber: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-sm font-medium text-[#0B1D39] text-start focus:border-[#2563EB] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                />
              </label>
              <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{t.quoteValidUntil}</span>
                <input
                  type="text"
                  dir="ltr"
                  value={draft.validUntil}
                  onChange={(e) =>
                    onChangeDraft((prev) => ({ ...prev, validUntil: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 font-mono text-sm font-medium text-[#0B1D39] text-start focus:border-[#2563EB] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                />
              </label>
            </div>
          </section>

          {/* 3. Line Items */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 dark:border-slate-800 dark:bg-[#0F172A]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB] text-xs font-bold text-white">
                  3
                </span>
                <h2 className="text-base font-bold text-[#0B1D39] dark:text-white">
                  {t.quoteStepItems}
                </h2>
              </div>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#EFF6FF] px-3 py-2 text-xs font-bold text-[#2563EB] hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{t.quoteAddItem}</span>
              </button>
            </div>

            <div className="space-y-3">
              {draft.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_76px_120px_auto] items-center dark:border-slate-800 dark:bg-slate-900"
                >
                  <input
                    type="text"
                    aria-label={t.quoteItemDesc}
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0B1D39] focus:border-[#2563EB] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                  <input
                    type="number"
                    min={1}
                    aria-label={t.quoteItemQty}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, {
                        quantity: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0B1D39] tabular-nums focus:border-[#2563EB] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                  <input
                    type="number"
                    min={0}
                    aria-label={t.quoteItemUnit}
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(item.id, {
                        unitPrice: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0B1D39] tabular-nums focus:border-[#2563EB] focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                  <button
                    type="button"
                    aria-label={`${t.vaultDelete} ${item.description}`}
                    onClick={() => removeItem(item.id)}
                    className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <label className="inline-flex items-center gap-2.5 pt-2 text-sm font-medium text-[#0B1D39] dark:text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.includeTva}
                onChange={(e) =>
                  onChangeDraft((prev) => ({ ...prev, includeTva: e.target.checked }))
                }
                className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
              />
              <span>{t.quoteTvaToggle}</span>
            </label>
          </section>

          {/* 4. Payment & Terms */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 dark:border-slate-800 dark:bg-[#0F172A]">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB] text-xs font-bold text-white">
                4
              </span>
              <h2 className="text-base font-bold text-[#0B1D39] dark:text-white">
                {t.quoteStepTerms}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{t.quoteDuration}</span>
                <input
                  type="text"
                  value={draft.duration}
                  onChange={(e) =>
                    onChangeDraft((prev) => ({ ...prev, duration: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-[#0B1D39] focus:border-[#2563EB] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
                />
              </label>

              <div className="space-y-1.5">
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {t.quotePaymentMode}
                </span>
                <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                  {(
                    [
                      { id: '100', label: '100%' },
                      { id: '50-50', label: '50/50' },
                      { id: '40-30-30', label: '40/30/30' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        onChangeDraft((prev) => ({ ...prev, paymentMode: opt.id }))
                      }
                      className={`rounded-lg py-2 text-xs font-semibold cursor-pointer ${
                        draft.paymentMode === opt.id
                          ? 'bg-white text-[#0B1D39] shadow-sm dark:bg-slate-950 dark:text-white'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label className="block space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>{t.quoteNotes}</span>
              <textarea
                rows={4}
                value={draft.notes}
                onChange={(e) =>
                  onChangeDraft((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-[#0B1D39] leading-relaxed focus:border-[#2563EB] focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:bg-slate-950"
              />
            </label>
          </section>
        </div>

        {/* Live A4 Printable Preview Sheet (always crisp white paper for authentic PDF output) */}
        <article
          aria-label="A4 Quote Preview"
          className="print-sheet rounded-2xl border border-slate-200 bg-white text-[#0B1D39] p-6 sm:p-8 shadow-sm space-y-6 dark:border-slate-700"
        >
          {/* Sheet Header */}
          <div className="flex items-start justify-between gap-4 border-b-2 border-[#0B1D39] pb-5 print:break-inside-avoid">
            <div className="flex items-center gap-3.5">
              <img
                src="/assets/aistudio/de_21886c63.jpg"
                alt={`${company.name || 'TA Company'} Logo`}
                data-testid="devis-logo"
                className="h-16 w-14 shrink-0 rounded-xl bg-black object-contain p-1 border border-slate-200"
              />
              <div>
                <strong className="block text-lg font-extrabold text-[#0B1D39] leading-tight">
                  {company.name || 'TA Company'}
                </strong>
                <p className="mt-1 text-xs text-slate-600">{company.role}</p>
              </div>
            </div>
            <div className="text-end shrink-0">
              <h2 className="text-xl font-extrabold text-[#2563EB]">
                {lang === 'ar' ? 'عرض سعر' : 'DEVIS'}
              </h2>
              <dl className="mt-2 space-y-0.5 text-xs text-slate-600 tabular-nums">
                <div className="flex justify-end gap-2">
                  <dt className="text-slate-400">{t.quoteNumber}:</dt>
                  <dd dir="ltr" className="font-mono font-semibold text-[#0B1D39]">
                    {draft.quoteNumber}
                  </dd>
                </div>
                <div className="flex justify-end gap-2">
                  <dt className="text-slate-400">{t.quoteDate}:</dt>
                  <dd dir="ltr" className="font-mono">{draft.issueDate}</dd>
                </div>
                <div className="flex justify-end gap-2">
                  <dt className="text-slate-400">{t.quoteValidUntil}:</dt>
                  <dd dir="ltr" className="font-mono">{draft.validUntil}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Provider / Client */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 print:grid-cols-2 print:break-inside-avoid">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs space-y-1">
              <p className="font-bold text-slate-400">{t.quoteProviderName}</p>
              <p className="font-bold text-[#0B1D39]">{company.name}</p>
              <p dir="ltr" className="text-slate-600 w-fit">{company.phone}</p>
              <p dir="ltr" className="text-slate-600 w-fit">{company.email}</p>
              <p className="text-slate-600">{company.address}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs space-y-1">
              <p className="font-bold text-slate-400">{t.quoteClientName}</p>
              <p data-testid="preview-client-name" className="font-bold text-[#0B1D39]">
                {draft.clientName || (lang === 'ar' ? 'اسم العميل' : 'Client Name')}
              </p>
              {draft.clientCompany && (
                <p className="text-slate-600">{draft.clientCompany}</p>
              )}
              {draft.duration && (
                <p className="text-slate-600">
                  {t.quoteDuration}: {draft.duration}
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#0B1D39] text-white">
                  <th className="px-3 py-2.5 text-start font-semibold rounded-s-lg">#</th>
                  <th className="px-3 py-2.5 text-start font-semibold">{t.quoteItemDesc}</th>
                  <th className="px-3 py-2.5 text-center font-semibold">{t.quoteItemQty}</th>
                  <th className="px-3 py-2.5 text-end font-semibold">{t.quoteItemUnit}</th>
                  <th className="px-3 py-2.5 text-end font-semibold rounded-e-lg">
                    {t.quoteItemTotal}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {draft.items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="px-3 py-2.5 font-mono text-slate-400 tabular-nums">
                      {idx + 1}
                    </td>
                    <td className="px-3 py-2.5 text-[#0B1D39] font-medium">
                      {item.description}
                    </td>
                    <td className="px-3 py-2.5 text-center tabular-nums">{item.quantity}</td>
                    <td className="px-3 py-2.5 text-end tabular-nums">
                      {formatMoney(item.unitPrice, draft.currency, lang)}
                    </td>
                    <td className="px-3 py-2.5 text-end font-bold text-[#0B1D39] tabular-nums">
                      {formatMoney(item.quantity * item.unitPrice, draft.currency, lang)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment Milestones & Totals */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 print:grid-cols-2 items-start border-t border-slate-200 pt-4 print:break-inside-avoid">
            <div className="space-y-1.5 text-xs">
              <p className="font-bold text-[#0B1D39]">{t.quotePaymentMode}</p>
              <ul className="space-y-1 text-slate-600">
                {paymentScheduleRows.map((row) => (
                  <li key={row.label} className="flex justify-between gap-2 tabular-nums">
                    <span>• {row.label}</span>
                    <span className="font-semibold text-[#0B1D39]">
                      {formatMoney(row.amount, draft.currency, lang)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-[#0B1D39] p-4 text-white space-y-2">
              {draft.includeTva && (
                <>
                  <div className="flex justify-between text-xs text-slate-300 tabular-nums">
                    <span>{t.quoteSubtotal}</span>
                    <span>{formatMoney(subtotal, draft.currency, lang)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300 tabular-nums">
                    <span>{t.quoteTvaLabel}</span>
                    <span>{formatMoney(tvaAmount, draft.currency, lang)}</span>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between border-t border-white/15 pt-2">
                <span className="text-xs font-semibold text-blue-200">
                  {t.quoteGrandTotal}
                </span>
                <strong
                  data-testid="quote-grand-total"
                  className="text-lg font-extrabold tabular-nums"
                >
                  {formatMoney(grandTotal, draft.currency, lang)}
                </strong>
              </div>
            </div>
          </div>

          {/* Notes */}
          {draft.notes && (
            <div className="border-t border-slate-100 pt-4 text-xs text-slate-600 space-y-1 whitespace-pre-line leading-relaxed print:break-inside-avoid">
              <p className="font-bold text-[#0B1D39]">{t.quoteNotes}</p>
              <p>{draft.notes}</p>
            </div>
          )}

          {/* Embedded Scannable QR Contact & Portfolio Block */}
          {qrEnabled && resolvedQrUrl && (
            <div
              data-testid="devis-qr-block"
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/90 p-3.5 print:break-inside-avoid"
            >
              <div className="min-w-0 space-y-1">
                <p className="text-xs font-extrabold text-[#0B1D39]">
                  {t.quoteQrSheetTitle}
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {t.quoteQrSheetSub}
                </p>
                <a
                  href={resolvedQrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  data-testid="devis-qr-link-label"
                  className="inline-block max-w-full truncate font-mono text-[11px] font-semibold text-[#2563EB] underline-offset-2 hover:underline"
                >
                  {displayQrLabel}
                </a>
              </div>
              <QuoteQrCode
                value={resolvedQrUrl}
                size={76}
                label={`${company.name || 'TA Company'} QR — ${displayQrLabel}`}
              />
            </div>
          )}

          {/* Signature Boxes */}
          <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-slate-500 print:grid-cols-2 print:break-inside-avoid">
            <div className="rounded-xl border border-dashed border-slate-200 p-4 h-20">
              {t.quoteSigProvider}
            </div>
            <div className="rounded-xl border border-dashed border-slate-200 p-4 h-20">
              {t.quoteSigClient}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
