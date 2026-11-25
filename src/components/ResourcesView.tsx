import React, { useMemo, useState } from 'react';
import { BookOpen, Download, ExternalLink, FileText, X } from 'lucide-react';
import { Lang, ResourceItem, RESOURCES_CATALOG } from '../data/catalog';
import { UI_TEXT } from '../i18n/translations';
import { downloadTextFileOffline, ThemeMode } from '../utils/desktopBridge';
import { ThemeToggle } from './ThemeToggle';

interface ResourcesViewProps {
  lang: Lang;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

type ResourceFilter = 'all' | 'article' | 'guide' | 'template' | 'link';

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  lang,
  theme,
  onToggleTheme,
}) => {
  const t = UI_TEXT[lang];
  const [filter, setFilter] = useState<ResourceFilter>('all');
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'all') return RESOURCES_CATALOG;
    return RESOURCES_CATALOG.filter((item) => item.type === filter);
  }, [filter]);

  const filters: { id: ResourceFilter; label: string }[] = [
    { id: 'all', label: t.filterAll },
    { id: 'article', label: t.filterArticles },
    { id: 'guide', label: t.filterGuides },
    { id: 'template', label: t.filterTemplates },
    { id: 'link', label: t.filterLinks },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1D39] dark:text-white">
            {t.resourcesTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t.resourcesSub}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} lang={lang} />
          <div
            role="group"
            aria-label="Filter resources"
            className="inline-flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
          >
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filter === f.id
                    ? 'bg-white text-[#0B1D39] shadow-sm dark:bg-slate-950 dark:text-white'
                    : 'text-slate-600 hover:text-[#0B1D39] dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-[#0F172A] dark:hover:border-slate-700"
          >
            <div>
              <p className="text-xs font-semibold text-[#2563EB] dark:text-blue-400">
                <span>{item.category[lang]}</span>
                <span aria-hidden="true" className="mx-1.5 text-slate-300 dark:text-slate-600">
                  ·
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">{item.meta[lang]}</span>
              </p>
              <h2 className="mt-2.5 text-lg font-bold text-[#0B1D39] dark:text-white leading-snug">
                {item.title[lang]}
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.summary[lang]}
              </p>
            </div>

            <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-4">
              {item.type === 'template' && item.downloadBody ? (
                <button
                  type="button"
                  onClick={() =>
                    downloadTextFileOffline(
                      item.downloadFilename || 'TA-Company-Template.txt',
                      item.downloadBody!
                    )
                  }
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>{t.downloadFile}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedResource(item)}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                >
                  {item.type === 'link' ? (
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  ) : item.type === 'guide' ? (
                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <FileText className="w-4 h-4" aria-hidden="true" />
                  )}
                  <span>{t.readMore}</span>
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Resource Reader Modal */}
      {selectedResource && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="resource-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1D39]/60 p-4"
        >
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xl space-y-4 dark:border-slate-800 dark:bg-[#0F172A]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#2563EB] dark:text-blue-400">
                  {selectedResource.category[lang]} · {selectedResource.meta[lang]}
                </p>
                <h3
                  id="resource-modal-title"
                  className="mt-1 text-xl font-extrabold text-[#0B1D39] dark:text-white"
                >
                  {selectedResource.title[lang]}
                </h3>
              </div>
              <button
                type="button"
                aria-label={t.close}
                onClick={() => setSelectedResource(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#0B1D39] dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {selectedResource.content?.[lang] || selectedResource.summary[lang]}
            </p>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedResource(null)}
                className="rounded-xl bg-[#0B1D39] px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] cursor-pointer"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
