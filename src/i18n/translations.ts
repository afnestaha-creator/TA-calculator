import { Lang } from '../data/catalog';

export const UI_TEXT: Record<
  Lang,
  {
    brandName: string;
    navDashboard: string;
    navQuote: string;
    navResources: string;
    navAbout: string;
    newQuoteCta: string;
    installApp: string;
    installOnIOS: string;
    iosInstallTitle: string;
    iosInstallStep1: string;
    iosInstallStep2: string;
    desktopModalTitle: string;
    desktopModalSub: string;
    desktopDirectInstallBtn: string;
    desktopOpenStandaloneBtn: string;
    desktopIframeNotice: string;
    desktopCopyUrlBtn: string;
    desktopUrlCopied: string;
    desktopBrowserStepsTitle: string;
    desktopChromeStep1: string;
    desktopChromeStep2: string;
    desktopMacSafariStep: string;
    desktopElectronBoxTitle: string;
    desktopElectronBoxDesc: string;
    desktopCopyCmd: string;
    desktopCmdCopied: string;
    desktopViewGuideBtn: string;
    close: string;
    offlineBadge: string;
    heroTag: string;
    heroTitle: string;
    heroSubtitle: string;
    kpiTotalLabel: string;
    kpiScopeLabel: string;
    kpiSavedLabel: string;
    kpiCurrencyLabel: string;
    step1Title: string;
    step1Sub: string;
    pageRateLabel: string;
    pageRateHint: string;
    presetBeginner: string;
    presetStandard: string;
    presetPro: string;
    urgencyLabel: string;
    urgencyNormal: string;
    urgencyRush: string;
    urgencyUrgent: string;
    clientLabel: string;
    clientIndividual: string;
    clientSme: string;
    clientEnterprise: string;
    hostingLabel: string;
    hostingPlaceholder: string;
    step2Title: string;
    step2Sub: string;
    approxPrefix: string;
    step3Title: string;
    step3Sub: string;
    extraPagesTitle: string;
    extraPagesSub: string;
    step4Title: string;
    step4Sub: string;
    languagesLabel: string;
    lang1: string;
    lang2: string;
    lang3: string;
    summaryTitle: string;
    summaryRangePrefix: string;
    summaryRangeMid: string;
    summaryRangeSuffix: string;
    summaryDuration: string;
    designTierTitle: string;
    tierTemplate: string;
    tierTemplateDesc: string;
    tierCustom: string;
    tierCustomDesc: string;
    tierPremium: string;
    tierPremiumDesc: string;
    payStart: string;
    payMid: string;
    payEnd: string;
    breakdownToggle: string;
    breakdownPages: string;
    breakdownExtra: string;
    breakdownFeatures: string;
    breakdownDesign: string;
    breakdownUrgency: string;
    breakdownClient: string;
    breakdownLang: string;
    breakdownHosting: string;
    btnConvertQuote: string;
    btnSaveEstimate: string;
    btnCopySummary: string;
    btnWhatsApp: string;
    btnReset: string;
    copiedToast: string;
    savedToast: string;
    vaultTitle: string;
    vaultSub: string;
    vaultEmpty: string;
    vaultSearchPlaceholder: string;
    vaultLoad: string;
    vaultOpenDevis: string;
    vaultDelete: string;
    vaultClientInputPlaceholder: string;
    quotePageTitle: string;
    quotePageSub: string;
    quoteStepProvider: string;
    quoteStepClient: string;
    quoteStepItems: string;
    quoteStepTerms: string;
    quoteProviderName: string;
    quoteProviderRole: string;
    quoteProviderPhone: string;
    quoteProviderEmail: string;
    quoteProviderAddress: string;
    quoteProviderWebsite: string;
    quoteQrToggle: string;
    quoteQrPresetSite: string;
    quoteQrPresetWhatsapp: string;
    quoteQrSheetTitle: string;
    quoteQrSheetSub: string;
    quoteClientName: string;
    quoteClientCompany: string;
    quoteClientPhone: string;
    quoteClientEmail: string;
    quoteNumber: string;
    quoteDate: string;
    quoteValidUntil: string;
    quoteAddItem: string;
    quoteItemDesc: string;
    quoteItemQty: string;
    quoteItemUnit: string;
    quoteItemTotal: string;
    quoteTvaToggle: string;
    quotePaymentMode: string;
    quotePay100: string;
    quotePay5050: string;
    quotePay403030: string;
    quoteDuration: string;
    quoteNotes: string;
    quoteExportPdf: string;
    quoteNewBlank: string;
    quoteSubtotal: string;
    quoteTvaLabel: string;
    quoteGrandTotal: string;
    quoteSigProvider: string;
    quoteSigClient: string;
    quotePrintHint: string;
    themeLight: string;
    themeDark: string;
    themeToggleLabel: string;
    resourcesTitle: string;
    resourcesSub: string;
    filterAll: string;
    filterArticles: string;
    filterGuides: string;
    filterTemplates: string;
    filterLinks: string;
    readMore: string;
    downloadFile: string;
    aboutTitle: string;
    aboutSub: string;
    aboutLead: string;
    aboutBody: string;
    desktopGuideTitle: string;
    desktopGuideSub: string;
    footerDesc: string;
    footerRights: string;
  }
> = {
  ar: {
    brandName: 'TA Company',
    navDashboard: 'لوحة التسعير',
    navQuote: 'مولّد عرض السعر',
    navResources: 'المصادر والقوالب',
    navAbout: 'عن الشركة وسطح المكتب',
    newQuoteCta: 'عرض سعر جديد',
    installApp: 'تحميل على الحاسوب',
    installOnIOS: 'التثبيت على iOS',
    iosInstallTitle: 'تثبيت تطبيق TA Company',
    iosInstallStep1: '1. اضغط على زر المشاركة (Share) في شريط Safari.',
    iosInstallStep2: '2. اختر «إضافة إلى الشاشة الرئيسية» (Add to Home Screen).',
    desktopModalTitle: 'تحميل وتثبيت TA Company على الحاسوب',
    desktopModalSub: 'شغّل التطبيق كبرنامج مستقل على Windows أو macOS أو Linux مع عمل كامل دون إنترنت.',
    desktopDirectInstallBtn: 'تثبيت التطبيق الآن (نقرة واحدة)',
    desktopOpenStandaloneBtn: 'فتح في نافذة مستقلة للتثبيت',
    desktopIframeNotice: 'أنت تتصفح التطبيق داخل إطار معاينة. افتحه في تبويب مستقل ليظهر خيار التثبيت الفوري على سطح المكتب.',
    desktopCopyUrlBtn: 'نسخ رابط التطبيق',
    desktopUrlCopied: 'تم نسخ الرابط',
    desktopBrowserStepsTitle: 'التثبيت المباشر من المتصفح (Chrome / Edge / Safari)',
    desktopChromeStep1: '1. افتح الرابط في Chrome أو Edge ثم اضغط على أيقونة التثبيت (+) في شريط العنوان أو القائمة ⋮ ← تثبيت التطبيق.',
    desktopChromeStep2: '2. سيُضاف اختصار TA Company مباشرة على سطح المكتب وقائمة ابدأ ويعمل دون اتصال.',
    desktopMacSafariStep: 'على macOS Safari: من شريط القوائم اختر File ← Add to Dock.',
    desktopElectronBoxTitle: 'تغليف نسخة Electron أصلية (.exe / .dmg / .AppImage)',
    desktopElectronBoxDesc: 'لتوليد ملف تنفيذي قابل للتوزيع من مصدر المشروع على جهازك:',
    desktopCopyCmd: 'نسخ الأوامر',
    desktopCmdCopied: 'تم النسخ',
    desktopViewGuideBtn: 'عرض دليل Electron الكامل',
    close: 'إغلاق',
    offlineBadge: 'الوضع دون اتصال — البيانات محفوظة محليًا',
    heroTag: 'مساحة عمل TA Company · تعمل دون إنترنت',
    heroTitle: 'حاسبة تسعير المشاريع وعروض الأسعار الاحترافية.',
    heroSubtitle:
      'حدّد سعر صفحتك، اختر نوع المشروع وصفحاته ومزاياه في لوحة واحدة تفاعلية، واحفظ التقديرات أو حوّلها فورًا إلى عرض سعر PDF جاهز للعميل.',
    kpiTotalLabel: 'التقدير الحالي',
    kpiScopeLabel: 'نطاق المشروع',
    kpiSavedLabel: 'عروض محفوظة محليًا',
    kpiCurrencyLabel: 'العملة النشطة',
    step1Title: 'سعرك وشروط العمل',
    step1Sub: 'ابدأ بسعر صفحة واحدة: كل الأسعار في الحاسبة تُحسب ديناميكيًا انطلاقًا منه.',
    pageRateLabel: 'سعر الصفحة الواحدة',
    pageRateHint:
      'سعر الصفحة هو الأساس لصفحة بسيطة واحدة: الرئيسية تساوي 1.5 صفحة، وسلة الطلبات تساوي 4 صفحات.',
    presetBeginner: 'مبتدئ',
    presetStandard: 'متوسط',
    presetPro: 'محترف',
    urgencyLabel: 'موعد التسليم',
    urgencyNormal: 'عادي',
    urgencyRush: 'مستعجل +25%',
    urgencyUrgent: 'مستعجل جدًا +50%',
    clientLabel: 'فئة العميل',
    clientIndividual: 'فرد',
    clientSme: 'مؤسسة صغيرة +15%',
    clientEnterprise: 'شركة كبرى +35%',
    hostingLabel: 'النطاق والاستضافة سنويًا (اختياري، يُذكر منفصلًا)',
    hostingPlaceholder: '0',
    step2Title: 'نوع المشروع',
    step2Sub: 'يضبط لك الصفحات والمزايا المعتادة لهذا النوع، مع إمكانية التعديل الفوري.',
    approxPrefix: 'حوالي',
    step3Title: 'الصفحات المطلوبة',
    step3Sub: 'الصفحات التي يراها الزائر. السعر بجانب كل صفحة يتغيّر تلقائيًا حسب إعداداتك.',
    extraPagesTitle: 'صفحات إضافية مخصصة',
    extraPagesSub: 'كل صفحة إضافية تُحسب بسعر صفحة بسيطة واحدة.',
    step4Title: 'المزايا والبرمجة',
    step4Sub: 'الوظائف التي تعمل خلف الصفحات والتكاملات التقنية.',
    languagesLabel: 'عدد لغات المشروع',
    lang1: 'لغة واحدة',
    lang2: 'لغتان +30%',
    lang3: 'ثلاث لغات +60%',
    summaryTitle: 'السعر المقترح',
    summaryRangePrefix: 'النطاق المتوقع بين',
    summaryRangeMid: 'و',
    summaryRangeSuffix: 'حسب تفاصيل التنفيذ',
    summaryDuration: 'المدة التقديرية',
    designTierTitle: 'مستوى التصميم: ثلاثة عروض لعميلك',
    tierTemplate: 'قالب جاهز',
    tierTemplateDesc: 'قالب احترافي يُعدَّل بألوان TA Company ومحتوى العميل.',
    tierCustom: 'تصميم خاص',
    tierCustomDesc: 'واجهة مصممة خصيصًا للمشروع من الصفر.',
    tierPremium: 'تصميم مميز',
    tierPremiumDesc: 'تصميم خاص مع حركات وتفاصيل تفاعلية متقدمة.',
    payStart: '40% عند البداية',
    payMid: '30% في المنتصف',
    payEnd: '30% عند التسليم',
    breakdownToggle: 'تفصيل حساب السعر',
    breakdownPages: 'الصفحات المختارة',
    breakdownExtra: 'الصفحات الإضافية',
    breakdownFeatures: 'المزايا والتكاملات',
    breakdownDesign: 'تعديل مستوى التصميم',
    breakdownUrgency: 'معامل الاستعجال',
    breakdownClient: 'معامل فئة العميل',
    breakdownLang: 'تعدد اللغات',
    breakdownHosting: 'الاستضافة السنوية (منفصلة)',
    btnConvertQuote: 'حوّل إلى عرض سعر (Devis)',
    btnSaveEstimate: 'حفظ في السجل المحلي',
    btnCopySummary: 'نسخ الملخص',
    btnWhatsApp: 'إرسال عبر واتساب',
    btnReset: 'إعادة ضبط',
    copiedToast: 'تم نسخ ملخص التسعير بنجاح',
    savedToast: 'تم حفظ التقدير محليًا في سجل TA Company',
    vaultTitle: 'سجل التقديرات المحفوظة (Offline Vault)',
    vaultSub: 'جميع التقديرات تُحفظ على جهازك وتعمل بدون إنترنت.',
    vaultEmpty: 'لا توجد تقديرات محفوظة بعد. اضغط على «حفظ في السجل المحلي» لحفظ عرضك الأول.',
    vaultSearchPlaceholder: 'ابحث باسم العميل أو نوع المشروع...',
    vaultLoad: 'تحميل في الحاسبة',
    vaultOpenDevis: 'فتح كعرض سعر',
    vaultDelete: 'حذف',
    vaultClientInputPlaceholder: 'اسم العميل أو المشروع للحفظ (اختياري)...',
    quotePageTitle: 'مولّد عرض السعر (Devis)',
    quotePageSub: 'خصّص بيانات TA Company والعميل والبنود، وصدّر عرض سعر احترافي بصيغة PDF.',
    quoteStepProvider: 'بيانات TA Company (مقدّم العرض)',
    quoteStepClient: 'بيانات العميل والمرجع',
    quoteStepItems: 'بنود العرض والأسعار',
    quoteStepTerms: 'طريقة الدفع والشروط',
    quoteProviderName: 'اسم الشركة / النشاط',
    quoteProviderRole: 'التخصص',
    quoteProviderPhone: 'الهاتف',
    quoteProviderEmail: 'البريد الإلكتروني',
    quoteProviderAddress: 'العنوان',
    quoteProviderWebsite: 'رابط الموقع / البورتفوليو أو صفحة التواصل (لـ QR)',
    quoteQrToggle: 'تضمين رمز الاستجابة السريعة (QR) في عرض السعر المطبوع',
    quoteQrPresetSite: 'رابط الموقع / التواصل',
    quoteQrPresetWhatsapp: 'رابط واتساب المباشر',
    quoteQrSheetTitle: 'تواصل معنا واستعرض أعمال TA Company',
    quoteQrSheetSub: 'امسح الرمز بكاميرا الهاتف لفتح صفحة التواصل أو معرض الأعمال مباشرة.',
    quoteClientName: 'اسم العميل',
    quoteClientCompany: 'الشركة / المؤسسة',
    quoteClientPhone: 'هاتف العميل',
    quoteClientEmail: 'بريد العميل',
    quoteNumber: 'رقم العرض',
    quoteDate: 'التاريخ',
    quoteValidUntil: 'صالح حتى',
    quoteAddItem: 'إضافة بند جديد',
    quoteItemDesc: 'الوصف',
    quoteItemQty: 'الكمية',
    quoteItemUnit: 'سعر الوحدة',
    quoteItemTotal: 'المبلغ',
    quoteTvaToggle: 'إضافة الرسم على القيمة المضافة (TVA 19%)',
    quotePaymentMode: 'جدولة الدفع',
    quotePay100: 'دفعة واحدة 100%',
    quotePay5050: '50% / 50%',
    quotePay403030: '40% / 30% / 30%',
    quoteDuration: 'مدة التنفيذ',
    quoteNotes: 'الشروط والملاحظات',
    quoteExportPdf: 'طباعة / حفظ PDF',
    quoteNewBlank: 'عرض فارغ جديد',
    quoteSubtotal: 'المجموع قبل الضريبة',
    quoteTvaLabel: 'TVA (19%)',
    quoteGrandTotal: 'المبلغ الإجمالي',
    quoteSigProvider: 'توقيع وختم TA Company',
    quoteSigClient: 'موافقة العميل (التاريخ والتوقيع)',
    quotePrintHint: 'تُخفى القوائم والأزرار تلقائيًا عند الطباعة لإخراج ورقة A4 نظيفة بصيغة PDF.',
    themeLight: 'فاتح',
    themeDark: 'داكن',
    themeToggleLabel: 'تبديل المظهر',
    resourcesTitle: 'مكتبة وقوالب TA Company',
    resourcesSub: 'مقالات عملية، مسارات تعلّم، وقوالب جاهزة للتحميل دون اتصال.',
    filterAll: 'الكل',
    filterArticles: 'مقالات',
    filterGuides: 'مسارات',
    filterTemplates: 'قوالب',
    filterLinks: 'روابط ومراجع',
    readMore: 'اقرأ التفاصيل',
    downloadFile: 'تحميل الملف',
    aboutTitle: 'عن TA Company وتطبيق سطح المكتب',
    aboutSub: 'حل رقمي متكامل لتسعير المشاريع البرمجية وإدارة عروض الأسعار دون اتصال.',
    aboutLead: 'TA Company — هندسة البرمجيات وتطوير الأنظمة الرقمية.',
    aboutBody:
      'صُمّمت مساحة عمل TA Company لتعمل بسلاسة كتطبيق سطح مكتب عبر Electron على أنظمة Windows و macOS و Linux، وكـ PWA سريع في المتصفح مع تخزين محلي كامل للبيانات.',
    desktopGuideTitle: 'بنية Electron والتشغيل دون اتصال (Cross-Platform)',
    desktopGuideSub: 'خطوات تغليف وتشغيل التطبيق محليًا على جميع أنظمة التشغيل.',
    footerDesc: 'مساحة عمل احترافية لتسعير المشاريع وإصدار عروض الأسعار دون اتصال.',
    footerRights: '© 2026 TA Company. جميع الحقوق محفوظة.',
  },
  en: {
    brandName: 'TA Company',
    navDashboard: 'Pricing Dashboard',
    navQuote: 'Quote Generator',
    navResources: 'Resources & Templates',
    navAbout: 'About & Desktop',
    newQuoteCta: 'New Quote',
    installApp: 'Install on PC',
    installOnIOS: 'Install on iOS',
    iosInstallTitle: 'Install TA Company App',
    iosInstallStep1: '1. Tap the Share button in Safari.',
    iosInstallStep2: '2. Scroll down and tap Add to Home Screen.',
    desktopModalTitle: 'Install TA Company on Your Computer',
    desktopModalSub: 'Run as a standalone offline desktop window on Windows, macOS, or Linux.',
    desktopDirectInstallBtn: 'Install Desktop App Now',
    desktopOpenStandaloneBtn: 'Open in Standalone Tab to Install',
    desktopIframeNotice: 'You are viewing inside an embedded preview frame. Open the app in its own browser tab to enable one-click desktop installation.',
    desktopCopyUrlBtn: 'Copy App URL',
    desktopUrlCopied: 'URL Copied',
    desktopBrowserStepsTitle: 'Direct Browser Install (Chrome / Edge / Safari)',
    desktopChromeStep1: '1. Open in Chrome or Edge, then click the Install icon in the address bar (or Menu -> Save & Share -> Install TA Company).',
    desktopChromeStep2: '2. Launches in its own window with a Desktop / Start Menu shortcut and full offline caching.',
    desktopMacSafariStep: 'On macOS Safari: click File -> Add to Dock.',
    desktopElectronBoxTitle: 'Native Electron Desktop Build (.exe / .dmg / .AppImage)',
    desktopElectronBoxDesc: 'Package standalone native installers from the local project source:',
    desktopCopyCmd: 'Copy Commands',
    desktopCmdCopied: 'Copied',
    desktopViewGuideBtn: 'Open Electron Guide',
    close: 'Close',
    offlineBadge: 'Offline Mode — All data stored locally',
    heroTag: 'TA Company Desktop Workspace · Offline-Ready',
    heroTitle: 'Dynamic Project Price Calculator & Proposal Studio.',
    heroSubtitle:
      'Set your base page rate, configure project scope, pages, and integrations in one live dashboard, save offline estimates, and export A4 PDF quotes.',
    kpiTotalLabel: 'Live Estimate',
    kpiScopeLabel: 'Selected Scope',
    kpiSavedLabel: 'Offline Saved Quotes',
    kpiCurrencyLabel: 'Currency',
    step1Title: 'Base Rate & Project Conditions',
    step1Sub: 'Start with a single-page base rate: all pages and features scale dynamically from it.',
    pageRateLabel: 'Base Rate per Page',
    pageRateHint:
      'Your single-page unit anchors every multiplier: Home = 1.5×, Cart & Orders = 4×.',
    presetBeginner: 'Starter',
    presetStandard: 'Standard',
    presetPro: 'Senior',
    urgencyLabel: 'Delivery Timeline',
    urgencyNormal: 'Standard',
    urgencyRush: 'Rush +25%',
    urgencyUrgent: 'Urgent +50%',
    clientLabel: 'Client Profile',
    clientIndividual: 'Individual',
    clientSme: 'Small Business +15%',
    clientEnterprise: 'Enterprise +35%',
    hostingLabel: 'Annual Domain & Hosting (optional, itemized separately)',
    hostingPlaceholder: '0',
    step2Title: 'Project Type',
    step2Sub: 'Pre-populates recommended pages and features, fully customizable below.',
    approxPrefix: 'Approx.',
    step3Title: 'Pages & Screens',
    step3Sub: 'Client-facing views. Each price updates dynamically with your rate and design tier.',
    extraPagesTitle: 'Additional Custom Pages',
    extraPagesSub: 'Each extra page adds 1× base page rate.',
    step4Title: 'Features & Backend Logic',
    step4Sub: 'Capabilities, integrations, and workflows behind the interface.',
    languagesLabel: 'Supported Languages',
    lang1: '1 Language',
    lang2: '2 Languages +30%',
    lang3: '3 Languages +60%',
    summaryTitle: 'Suggested Investment',
    summaryRangePrefix: 'Typical range',
    summaryRangeMid: 'to',
    summaryRangeSuffix: 'depending on final spec',
    summaryDuration: 'Estimated Timeline',
    designTierTitle: 'Design Tier: 3 Client Options',
    tierTemplate: 'Starter Template',
    tierTemplateDesc: 'Clean template customized to client colors and content.',
    tierCustom: 'Custom Design',
    tierCustomDesc: 'Tailored UI/UX crafted from scratch for the brand.',
    tierPremium: 'Premium Bespoke',
    tierPremiumDesc: 'Bespoke art direction with refined motion and polish.',
    payStart: '40% Kickoff',
    payMid: '30% Midpoint',
    payEnd: '30% Delivery',
    breakdownToggle: 'Calculation Breakdown',
    breakdownPages: 'Selected Pages',
    breakdownExtra: 'Extra Pages',
    breakdownFeatures: 'Features & Integrations',
    breakdownDesign: 'Design Tier Adjustment',
    breakdownUrgency: 'Urgency Multiplier',
    breakdownClient: 'Client Profile Adjustment',
    breakdownLang: 'Multilingual Surcharge',
    breakdownHosting: 'Annual Hosting (separate)',
    btnConvertQuote: 'Convert to Quote (Devis)',
    btnSaveEstimate: 'Save to Offline Vault',
    btnCopySummary: 'Copy Summary',
    btnWhatsApp: 'Send via WhatsApp',
    btnReset: 'Reset',
    copiedToast: 'Estimate summary copied to clipboard',
    savedToast: 'Estimate saved to local TA Company vault',
    vaultTitle: 'Saved Estimates (Offline Vault)',
    vaultSub: 'Stored locally on your device for instant offline access.',
    vaultEmpty: 'No saved estimates yet. Click "Save to Offline Vault" above to store one.',
    vaultSearchPlaceholder: 'Search by client label or project type...',
    vaultLoad: 'Load in Calculator',
    vaultOpenDevis: 'Open Quote',
    vaultDelete: 'Delete',
    vaultClientInputPlaceholder: 'Client or project label (optional)...',
    quotePageTitle: 'Official Quote Generator (Devis)',
    quotePageSub: 'Customize TA Company details, client metadata, line items, and export A4 PDF.',
    quoteStepProvider: 'TA Company Details',
    quoteStepClient: 'Client & Reference',
    quoteStepItems: 'Line Items & Pricing',
    quoteStepTerms: 'Payment & Terms',
    quoteProviderName: 'Company Name',
    quoteProviderRole: 'Specialty',
    quoteProviderPhone: 'Phone',
    quoteProviderEmail: 'Email',
    quoteProviderAddress: 'Address',
    quoteProviderWebsite: 'Website / Portfolio / Contact URL (QR Code)',
    quoteQrToggle: 'Embed scannable QR code on printed quote sheet',
    quoteQrPresetSite: 'Website / Contact',
    quoteQrPresetWhatsapp: 'WhatsApp Link',
    quoteQrSheetTitle: 'Connect & View TA Company Portfolio',
    quoteQrSheetSub: 'Scan with your phone camera to open our contact page or portfolio.',
    quoteClientName: 'Client Name',
    quoteClientCompany: 'Company / Organization',
    quoteClientPhone: 'Client Phone',
    quoteClientEmail: 'Client Email',
    quoteNumber: 'Quote #',
    quoteDate: 'Issue Date',
    quoteValidUntil: 'Valid Until',
    quoteAddItem: 'Add Line Item',
    quoteItemDesc: 'Description',
    quoteItemQty: 'Qty',
    quoteItemUnit: 'Unit Price',
    quoteItemTotal: 'Total',
    quoteTvaToggle: 'Apply VAT / TVA (19%)',
    quotePaymentMode: 'Payment Schedule',
    quotePay100: '100% Upfront',
    quotePay5050: '50% / 50%',
    quotePay403030: '40% / 30% / 30%',
    quoteDuration: 'Delivery Timeframe',
    quoteNotes: 'Terms & Notes',
    quoteExportPdf: 'Print to PDF',
    quoteNewBlank: 'New Blank Quote',
    quoteSubtotal: 'Subtotal',
    quoteTvaLabel: 'VAT / TVA (19%)',
    quoteGrandTotal: 'Total Amount',
    quoteSigProvider: 'TA Company Signature',
    quoteSigClient: 'Client Approval (Date & Signature)',
    quotePrintHint: 'Navigation and controls are automatically hidden for a clean A4 PDF output.',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeToggleLabel: 'Toggle color theme',
    resourcesTitle: 'TA Company Resources & Templates',
    resourcesSub: 'Offline-available engineering guides, pricing playbooks, and templates.',
    filterAll: 'All',
    filterArticles: 'Articles',
    filterGuides: 'Guides',
    filterTemplates: 'Templates',
    filterLinks: 'References',
    readMore: 'Read Details',
    downloadFile: 'Download File',
    aboutTitle: 'About TA Company & Desktop App',
    aboutSub: 'Cross-platform offline-first pricing and proposal workspace.',
    aboutLead: 'TA Company — Digital Product Engineering & Studio Operations.',
    aboutBody:
      'Built to run both as a responsive browser PWA and a native cross-platform Electron desktop application across Windows, macOS, and Linux with zero cloud dependency.',
    desktopGuideTitle: 'Electron Cross-Platform & Offline Packaging',
    desktopGuideSub: 'Build native desktop installers for Windows, macOS, and Linux.',
    footerDesc: 'Offline-capable pricing calculator and proposal suite for TA Company.',
    footerRights: '© 2026 TA Company. All rights reserved.',
  },
  fr: {
    brandName: 'TA Company',
    navDashboard: 'Tableau de Calcul',
    navQuote: 'Générateur de Devis',
    navResources: 'Ressources & Modèles',
    navAbout: 'À propos & Bureau',
    newQuoteCta: 'Nouveau Devis',
    installApp: 'Installer sur PC',
    installOnIOS: 'Installer sur iOS',
    iosInstallTitle: 'Installer TA Company',
    iosInstallStep1: '1. Appuyez sur Partager dans Safari.',
    iosInstallStep2: '2. Choisissez Sur l’écran d’accueil.',
    desktopModalTitle: 'Installer TA Company sur votre ordinateur',
    desktopModalSub: 'Exécutez l’application en fenêtre bureau hors-ligne sur Windows, macOS ou Linux.',
    desktopDirectInstallBtn: 'Installer l’application maintenant',
    desktopOpenStandaloneBtn: 'Ouvrir dans un onglet indépendant',
    desktopIframeNotice: 'Vous consultez l’application dans un cadre intégré. Ouvrez-la dans un nouvel onglet pour activer l’installation bureau en un clic.',
    desktopCopyUrlBtn: 'Copier le lien',
    desktopUrlCopied: 'Lien copié',
    desktopBrowserStepsTitle: 'Installation directe (Chrome / Edge / Safari)',
    desktopChromeStep1: '1. Ouvrez dans Chrome ou Edge, puis cliquez sur l’icône Installer dans la barre d’adresse.',
    desktopChromeStep2: '2. Ajoute un raccourci Bureau / Menu Démarrer avec fonctionnement hors-ligne complet.',
    desktopMacSafariStep: 'Sur macOS Safari : Fichier -> Ajouter au Dock.',
    desktopElectronBoxTitle: 'Build Bureau Electron natif (.exe / .dmg / .AppImage)',
    desktopElectronBoxDesc: 'Générez des installateurs natifs depuis le code source local :',
    desktopCopyCmd: 'Copier',
    desktopCmdCopied: 'Copié',
    desktopViewGuideBtn: 'Voir le guide Electron',
    close: 'Fermer',
    offlineBadge: 'Mode Hors-Ligne — Données enregistrées localement',
    heroTag: 'Espace TA Company · Fonctionne Hors-Ligne',
    heroTitle: 'Calculateur de Prix Dynamique & Générateur de Devis.',
    heroSubtitle:
      'Définissez votre tarif par page, configurez le type de projet et ses options en direct, sauvegardez vos estimations et exportez des devis PDF A4.',
    kpiTotalLabel: 'Estimation en direct',
    kpiScopeLabel: 'Périmètre',
    kpiSavedLabel: 'Devis sauvegardés',
    kpiCurrencyLabel: 'Devise',
    step1Title: 'Tarif de base & Conditions',
    step1Sub: 'Commencez par le tarif d’une page simple : tout le devis s’adapte dynamiquement.',
    pageRateLabel: 'Tarif par page simple',
    pageRateHint:
      'Référence de calcul : Accueil = 1.5×, Panier & Commandes = 4× le tarif d’une page.',
    presetBeginner: 'Junior',
    presetStandard: 'Standard',
    presetPro: 'Expert',
    urgencyLabel: 'Délai de livraison',
    urgencyNormal: 'Normal',
    urgencyRush: 'Rapide +25%',
    urgencyUrgent: 'Urgent +50%',
    clientLabel: 'Profil client',
    clientIndividual: 'Particulier',
    clientSme: 'PME +15%',
    clientEnterprise: 'Grande entreprise +35%',
    hostingLabel: 'Domaine & Hébergement annuel (optionnel, séparé)',
    hostingPlaceholder: '0',
    step2Title: 'Type de projet',
    step2Sub: 'Pré-sélectionne les pages et fonctionnalités recommandées, modifiables librement.',
    approxPrefix: 'Env.',
    step3Title: 'Pages & Écrans',
    step3Sub: 'Pages visibles par les visiteurs. Le tarif se met à jour instantanément.',
    extraPagesTitle: 'Pages supplémentaires',
    extraPagesSub: 'Chaque page ajoutée correspond à 1× le tarif de base.',
    step4Title: 'Fonctionnalités & Logique',
    step4Sub: 'Modules techniques et intégrations en arrière-plan.',
    languagesLabel: 'Langues du site',
    lang1: '1 langue',
    lang2: '2 langues +30%',
    lang3: '3 langues +60%',
    summaryTitle: 'Prix suggéré',
    summaryRangePrefix: 'Fourchette estimée entre',
    summaryRangeMid: 'et',
    summaryRangeSuffix: 'selon les détails',
    summaryDuration: 'Délai estimé',
    designTierTitle: 'Niveau de design : 3 propositions client',
    tierTemplate: 'Modèle adapté',
    tierTemplateDesc: 'Base professionnelle adaptée aux couleurs et contenus du client.',
    tierCustom: 'Design sur-mesure',
    tierCustomDesc: 'Interface conçue spécifiquement pour le projet.',
    tierPremium: 'Design Premium',
    tierPremiumDesc: 'Direction artistique poussée avec animations fluides.',
    payStart: '40% Démarrage',
    payMid: '30% Mi-parcours',
    payEnd: '30% Livraison',
    breakdownToggle: 'Détail du calcul',
    breakdownPages: 'Pages sélectionnées',
    breakdownExtra: 'Pages supplémentaires',
    breakdownFeatures: 'Fonctionnalités',
    breakdownDesign: 'Ajustement design',
    breakdownUrgency: 'Majoration délai',
    breakdownClient: 'Majoration profil client',
    breakdownLang: 'Multilingue',
    breakdownHosting: 'Hébergement annuel (séparé)',
    btnConvertQuote: 'Convertir en Devis',
    btnSaveEstimate: 'Sauvegarder hors-ligne',
    btnCopySummary: 'Copier le résumé',
    btnWhatsApp: 'Envoyer sur WhatsApp',
    btnReset: 'Réinitialiser',
    copiedToast: 'Résumé copié dans le presse-papiers',
    savedToast: 'Estimation enregistrée dans le coffre local TA Company',
    vaultTitle: 'Historique des estimations (Hors-ligne)',
    vaultSub: 'Stocké localement sur votre appareil sans connexion requise.',
    vaultEmpty: 'Aucune estimation sauvegardée. Cliquez sur « Sauvegarder hors-ligne ».',
    vaultSearchPlaceholder: 'Rechercher par client ou type de projet...',
    vaultLoad: 'Charger',
    vaultOpenDevis: 'Ouvrir Devis',
    vaultDelete: 'Supprimer',
    vaultClientInputPlaceholder: 'Nom du client ou projet (optionnel)...',
    quotePageTitle: 'Générateur de Devis Officiel',
    quotePageSub: 'Personnalisez les informations TA Company, le client et exportez en PDF A4.',
    quoteStepProvider: 'Informations TA Company',
    quoteStepClient: 'Client & Référence',
    quoteStepItems: 'Prestations & Montants',
    quoteStepTerms: 'Paiement & Conditions',
    quoteProviderName: 'Nom de l’entreprise',
    quoteProviderRole: 'Activité',
    quoteProviderPhone: 'Téléphone',
    quoteProviderEmail: 'E-mail',
    quoteProviderAddress: 'Adresse',
    quoteProviderWebsite: 'Site web / Portfolio / Contact (Code QR)',
    quoteQrToggle: 'Intégrer un code QR cliquable sur le devis imprimé',
    quoteQrPresetSite: 'Site / Contact',
    quoteQrPresetWhatsapp: 'Lien WhatsApp',
    quoteQrSheetTitle: 'Contact & Portfolio TA Company',
    quoteQrSheetSub: 'Scannez ce code QR pour accéder directement à notre page de contact ou portfolio.',
    quoteClientName: 'Nom du client',
    quoteClientCompany: 'Entreprise',
    quoteClientPhone: 'Tél. client',
    quoteClientEmail: 'E-mail client',
    quoteNumber: 'N° Devis',
    quoteDate: 'Date',
    quoteValidUntil: 'Valable jusqu’au',
    quoteAddItem: 'Ajouter une ligne',
    quoteItemDesc: 'Désignation',
    quoteItemQty: 'Qté',
    quoteItemUnit: 'P.U.',
    quoteItemTotal: 'Total',
    quoteTvaToggle: 'Appliquer la TVA (19%)',
    quotePaymentMode: 'Modalités de paiement',
    quotePay100: '100% à la commande',
    quotePay5050: '50% / 50%',
    quotePay403030: '40% / 30% / 30%',
    quoteDuration: 'Délai d’exécution',
    quoteNotes: 'Conditions & Remarques',
    quoteExportPdf: 'Imprimer en PDF',
    quoteNewBlank: 'Nouveau devis vierge',
    quoteSubtotal: 'Sous-total HT',
    quoteTvaLabel: 'TVA (19%)',
    quoteGrandTotal: 'Total TTC',
    quoteSigProvider: 'Cachet & Signature TA Company',
    quoteSigClient: 'Bon pour accord (Date & Signature)',
    quotePrintHint: 'La navigation et les boutons sont masqués automatiquement pour une mise en page A4 propre.',
    themeLight: 'Clair',
    themeDark: 'Sombre',
    themeToggleLabel: 'Changer le thème',
    resourcesTitle: 'Ressources & Modèles TA Company',
    resourcesSub: 'Guides pratiques et modèles téléchargeables hors-ligne.',
    filterAll: 'Tout',
    filterArticles: 'Articles',
    filterGuides: 'Parcours',
    filterTemplates: 'Modèles',
    filterLinks: 'Références',
    readMore: 'Lire le détail',
    downloadFile: 'Télécharger',
    aboutTitle: 'À propos de TA Company & App Bureau',
    aboutSub: 'Solution multiplateforme hors-ligne de chiffrage et devis.',
    aboutLead: 'TA Company — Ingénierie logicielle et solutions digitales.',
    aboutBody:
      'Conçue pour fonctionner en PWA responsive et en application de bureau Electron sur Windows, macOS et Linux sans dépendance réseau.',
    desktopGuideTitle: 'Architecture Electron & Mode Hors-Ligne',
    desktopGuideSub: 'Générez les installateurs natifs Windows, macOS et Linux.',
    footerDesc: 'Outil de chiffrage dynamique et générateur de devis pour TA Company.',
    footerRights: '© 2026 TA Company. Tous droits réservés.',
  },
};
