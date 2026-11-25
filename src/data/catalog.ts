export type Lang = 'ar' | 'en' | 'fr';

export type ProjectTypeId = 'landing' | 'showcase' | 'ecommerce' | 'saas' | 'management';
export type UrgencyId = 'normal' | 'rush' | 'urgent';
export type ClientTypeId = 'individual' | 'sme' | 'enterprise';
export type DesignTierId = 'template' | 'custom' | 'premium';
export type LanguageCount = 1 | 2 | 3;
export type CurrencyCode = 'DZD' | 'EUR' | 'USD';

export interface LocalizedText {
  ar: string;
  en: string;
  fr: string;
}

export interface PageDef {
  id: string;
  category: 'intro' | 'content' | 'store' | 'admin';
  weight: number; // multiplier of base pageRate
  label: LocalizedText;
}

export interface FeatureDef {
  id: string;
  category: 'content' | 'users' | 'sales' | 'contact' | 'admin' | 'other';
  weight: number; // multiplier of base pageRate
  label: LocalizedText;
  recommendedPages?: string[];
}

export interface ProjectTypeDef {
  id: ProjectTypeId;
  label: LocalizedText;
  description: LocalizedText;
  defaultPages: string[];
  defaultFeatures: string[];
  baseWeeks: [number, number];
}

export const PAGE_CATEGORIES: { id: PageDef['category']; label: LocalizedText }[] = [
  { id: 'intro', label: { ar: 'صفحات التعريف', en: 'Core & Presentation', fr: 'Présentation' } },
  { id: 'content', label: { ar: 'المحتوى', en: 'Content & Blog', fr: 'Contenu & Blog' } },
  { id: 'store', label: { ar: 'المتجر', en: 'E-Commerce', fr: 'Boutique' } },
  { id: 'admin', label: { ar: 'الحسابات والإدارة', en: 'Accounts & Dashboard', fr: 'Comptes & Gestion' } },
];

export const FEATURE_CATEGORIES: { id: FeatureDef['category']; label: LocalizedText }[] = [
  { id: 'content', label: { ar: 'المحتوى', en: 'Content', fr: 'Contenu' } },
  { id: 'users', label: { ar: 'المستخدمون', en: 'Users & Access', fr: 'Utilisateurs' } },
  { id: 'sales', label: { ar: 'البيع', en: 'Commerce & Payments', fr: 'Vente & Paiement' } },
  { id: 'contact', label: { ar: 'التواصل', en: 'Communication', fr: 'Communication' } },
  { id: 'admin', label: { ar: 'الإدارة', en: 'Administration', fr: 'Administration' } },
  { id: 'other', label: { ar: 'أخرى', en: 'Technical & SEO', fr: 'Technique & SEO' } },
];

export const PAGES_CATALOG: PageDef[] = [
  { id: 'home', category: 'intro', weight: 1.5, label: { ar: 'الرئيسية', en: 'Home Page', fr: 'Accueil' } },
  { id: 'about', category: 'intro', weight: 1.0, label: { ar: 'من نحن', en: 'About Us', fr: 'À propos' } },
  { id: 'services', category: 'intro', weight: 1.0, label: { ar: 'الخدمات', en: 'Services', fr: 'Services' } },
  { id: 'portfolio', category: 'intro', weight: 1.0, label: { ar: 'معرض الأعمال', en: 'Portfolio / Work', fr: 'Portfolio' } },
  { id: 'pricing', category: 'intro', weight: 1.0, label: { ar: 'الأسعار والباقات', en: 'Pricing & Plans', fr: 'Tarifs & Offres' } },
  { id: 'faq', category: 'intro', weight: 0.5, label: { ar: 'الأسئلة الشائعة', en: 'FAQ', fr: 'FAQ' } },
  { id: 'contact', category: 'intro', weight: 1.0, label: { ar: 'اتصل بنا', en: 'Contact Us', fr: 'Contact' } },

  { id: 'articles-list', category: 'content', weight: 1.0, label: { ar: 'قائمة المقالات', en: 'Blog / Articles Index', fr: 'Liste des articles' } },
  { id: 'article-detail', category: 'content', weight: 1.0, label: { ar: 'صفحة المقال', en: 'Article Detail', fr: 'Page article' } },

  { id: 'products-list', category: 'store', weight: 1.5, label: { ar: 'قائمة المنتجات', en: 'Product Catalog', fr: 'Catalogue produits' } },
  { id: 'product-detail', category: 'store', weight: 1.5, label: { ar: 'صفحة المنتج', en: 'Product Detail', fr: 'Fiche produit' } },
  { id: 'cart', category: 'store', weight: 1.0, label: { ar: 'السلة', en: 'Shopping Cart', fr: 'Panier' } },
  { id: 'checkout', category: 'store', weight: 1.5, label: { ar: 'إتمام الطلب', en: 'Checkout Flow', fr: 'Validation commande' } },

  { id: 'auth', category: 'admin', weight: 1.0, label: { ar: 'الدخول والتسجيل', en: 'Sign In / Sign Up', fr: 'Connexion / Inscription' } },
  { id: 'user-profile', category: 'admin', weight: 1.5, label: { ar: 'حساب المستخدم', en: 'User Account', fr: 'Espace client' } },
  { id: 'dashboard', category: 'admin', weight: 2.0, label: { ar: 'لوحة المعلومات', en: 'Analytics Dashboard', fr: 'Tableau de bord' } },
  { id: 'data-table', category: 'admin', weight: 1.5, label: { ar: 'جدول بيانات مع بحث', en: 'Searchable Data Table', fr: 'Tableau filtrable' } },
  { id: 'crud-form', category: 'admin', weight: 1.0, label: { ar: 'نموذج إضافة وتعديل', en: 'Create / Edit Form', fr: 'Formulaire CRUD' } },
];

export const FEATURES_CATALOG: FeatureDef[] = [
  {
    id: 'cms-articles',
    category: 'content',
    weight: 3.0,
    label: { ar: 'نشر المقالات من لوحة تحكم', en: 'CMS Article Publishing', fr: 'Publication d’articles (CMS)' },
    recommendedPages: ['articles-list', 'article-detail'],
  },
  {
    id: 'media-gallery',
    category: 'content',
    weight: 1.0,
    label: { ar: 'معرض صور وفيديو', en: 'Photo & Video Gallery', fr: 'Galerie photo & vidéo' },
  },
  {
    id: 'booking',
    category: 'content',
    weight: 3.0,
    label: { ar: 'حجز المواعيد', en: 'Appointment Booking', fr: 'Prise de rendez-vous' },
  },
  {
    id: 'user-accounts',
    category: 'users',
    weight: 3.0,
    label: { ar: 'حسابات المستخدمين', en: 'User Authentication & Profiles', fr: 'Comptes utilisateurs' },
    recommendedPages: ['auth', 'user-profile'],
  },
  {
    id: 'rbac',
    category: 'users',
    weight: 2.0,
    label: { ar: 'أدوار وصلاحيات', en: 'Roles & Permissions (RBAC)', fr: 'Rôles & Permissions' },
  },
  {
    id: 'cart-orders',
    category: 'sales',
    weight: 4.0,
    label: { ar: 'سلة وطلبات', en: 'Cart & Order Management', fr: 'Panier & Gestion commandes' },
    recommendedPages: ['products-list', 'product-detail', 'cart', 'checkout'],
  },
  {
    id: 'epayment',
    category: 'sales',
    weight: 4.0,
    label: { ar: 'الدفع الإلكتروني (CIB / الذهبية / Stripe)', en: 'Online Payment (CIB / Edahabia / Card)', fr: 'Paiement en ligne (CIB / Carte)' },
  },
  {
    id: 'cod-shipping',
    category: 'sales',
    weight: 2.0,
    label: { ar: 'الدفع عند الاستلام والتوصيل حسب الولاية', en: 'Cash on Delivery & Regional Shipping', fr: 'Paiement à la livraison & Wilayas' },
  },
  {
    id: 'variants',
    category: 'sales',
    weight: 2.0,
    label: { ar: 'خيارات المنتج (المقاس، اللون)', en: 'Product Variants (Size, Color)', fr: 'Variantes produit (Taille, Couleur)' },
  },
  {
    id: 'coupons',
    category: 'sales',
    weight: 1.5,
    label: { ar: 'كوبونات التخفيض', en: 'Promo Codes & Discounts', fr: 'Codes promo' },
  },
  {
    id: 'contact-form',
    category: 'contact',
    weight: 0.5,
    label: { ar: 'نموذج تواصل', en: 'Contact Form', fr: 'Formulaire de contact' },
  },
  {
    id: 'whatsapp',
    category: 'contact',
    weight: 0.25,
    label: { ar: 'زر واتساب', en: 'WhatsApp Quick Action', fr: 'Bouton WhatsApp' },
  },
  {
    id: 'email-alerts',
    category: 'contact',
    weight: 1.0,
    label: { ar: 'إشعارات بالبريد الإلكتروني', en: 'Automated Email Notifications', fr: 'Notifications e-mail' },
  },
  {
    id: 'newsletter',
    category: 'contact',
    weight: 1.0,
    label: { ar: 'نشرة بريدية', en: 'Newsletter Subscription', fr: 'Newsletter' },
  },
  {
    id: 'admin-cms',
    category: 'admin',
    weight: 4.0,
    label: { ar: 'لوحة تحكم لإدارة المحتوى', en: 'Full Admin Control Panel', fr: 'Panneau d’administration' },
    recommendedPages: ['dashboard'],
  },
  {
    id: 'analytics-reports',
    category: 'admin',
    weight: 3.0,
    label: { ar: 'إحصائيات وتقارير', en: 'Analytics & Reports', fr: 'Statistiques & Rapports' },
  },
  {
    id: 'export-excel-pdf',
    category: 'admin',
    weight: 1.5,
    label: { ar: 'تصدير Excel / PDF', en: 'Excel / PDF Export', fr: 'Export Excel / PDF' },
  },
  {
    id: 'maps',
    category: 'other',
    weight: 0.5,
    label: { ar: 'خريطة Google', en: 'Interactive Location Map', fr: 'Carte interactive' },
  },
  {
    id: 'seo',
    category: 'other',
    weight: 1.0,
    label: { ar: 'تهيئة محركات البحث (SEO)', en: 'Technical SEO Optimization', fr: 'Optimisation SEO' },
  },
  {
    id: 'performance',
    category: 'other',
    weight: 1.0,
    label: { ar: 'تحسين السرعة', en: 'Core Web Vitals & Speed', fr: 'Optimisation vitesse' },
  },
  {
    id: 'api-integration',
    category: 'other',
    weight: 2.0,
    label: { ar: 'ربط بخدمة خارجية (API)', en: 'Third-Party API Integration', fr: 'Intégration API externe' },
  },
];

export const PROJECT_TYPES: ProjectTypeDef[] = [
  {
    id: 'landing',
    label: { ar: 'صفحة هبوط', en: 'Landing Page', fr: 'Page de destination' },
    description: {
      ar: 'صفحة واحدة تعرض منتجًا أو خدمة أو حملة.',
      en: 'High-converting single page for a product, service, or campaign.',
      fr: 'Page unique pour présenter un produit, service ou campagne.',
    },
    defaultPages: ['home'],
    defaultFeatures: ['contact-form', 'whatsapp', 'seo'],
    baseWeeks: [1, 1],
  },
  {
    id: 'showcase',
    label: { ar: 'موقع تعريفي', en: 'Corporate Showcase', fr: 'Site Vitrine' },
    description: {
      ar: 'موقع لنشاط أو شركة: من نحن، الخدمات، التواصل.',
      en: 'Multi-page company presence: about, services, portfolio, contact.',
      fr: 'Site d’entreprise complet : à propos, services, portfolio, contact.',
    },
    defaultPages: ['home', 'about', 'services', 'portfolio', 'contact'],
    defaultFeatures: ['contact-form', 'whatsapp', 'maps', 'seo'],
    baseWeeks: [2, 3],
  },
  {
    id: 'ecommerce',
    label: { ar: 'متجر إلكتروني', en: 'E-Commerce Store', fr: 'Boutique E-Commerce' },
    description: {
      ar: 'منتجات وسلة وطلبات، مع الدفع والتوصيل.',
      en: 'Product catalog, shopping cart, orders, shipping, and checkout.',
      fr: 'Catalogue produits, panier, commandes, livraison et paiement.',
    },
    defaultPages: ['home', 'products-list', 'product-detail', 'cart', 'checkout', 'contact'],
    defaultFeatures: ['cart-orders', 'cod-shipping', 'admin-cms', 'whatsapp', 'seo'],
    baseWeeks: [4, 6],
  },
  {
    id: 'saas',
    label: { ar: 'تطبيق ويب / SaaS', en: 'Web App / SaaS', fr: 'Application Web / SaaS' },
    description: {
      ar: 'منصة يسجّل فيها المستخدمون ويستعملونها.',
      en: 'Interactive cloud platform with accounts, dashboards, and APIs.',
      fr: 'Plateforme interactive avec comptes utilisateurs et tableau de bord.',
    },
    defaultPages: ['home', 'pricing', 'auth', 'user-profile', 'dashboard'],
    defaultFeatures: ['user-accounts', 'rbac', 'email-alerts', 'analytics-reports', 'api-integration'],
    baseWeeks: [5, 8],
  },
  {
    id: 'management',
    label: { ar: 'نظام تسيير', en: 'Management System', fr: 'Système de Gestion' },
    description: {
      ar: 'برنامج داخلي لمؤسسة: مخزون، مبيعات، طلبة…',
      en: 'Internal ERP/operations suite: inventory, sales, invoicing, reports.',
      fr: 'Logiciel interne : stock, ventes, facturation et rapports.',
    },
    defaultPages: ['auth', 'dashboard', 'data-table', 'crud-form'],
    defaultFeatures: ['user-accounts', 'rbac', 'admin-cms', 'analytics-reports', 'export-excel-pdf'],
    baseWeeks: [4, 7],
  },
];

export interface ResourceItem {
  id: string;
  type: 'article' | 'guide' | 'template' | 'link';
  category: LocalizedText;
  title: LocalizedText;
  summary: LocalizedText;
  meta: LocalizedText;
  content?: LocalizedText;
  downloadFilename?: string;
  downloadBody?: string;
  url?: string;
}

export const RESOURCES_CATALOG: ResourceItem[] = [
  {
    id: 'pricing-explanation-article',
    type: 'article',
    category: { ar: 'التسعير والعمل الحر', en: 'Pricing Strategy', fr: 'Stratégie Tarifaire' },
    title: {
      ar: 'كيف تحسب سعرك وتشرحه للعميل بثقة',
      en: 'How to Calculate and Present Your Project Pricing Clearly',
      fr: 'Comment calculer et expliquer vos tarifs client avec clarté',
    },
    summary: {
      ar: 'بدل التخمين العشوائي، اعتمد تسعير الصفحة الواحدة والمضاعفات لتوضيح قيمة كل بند في عرض السعر.',
      en: 'Replace guesswork with a transparent per-page baseline and clear scope multipliers clients immediately understand.',
      fr: 'Remplacez l’improvisation par un tarif de base par page et des multiplicateurs transparents.',
    },
    meta: { ar: '4 دقائق قراءة', en: '4 min read', fr: '4 min de lecture' },
    content: {
      ar: 'عند تقديم عرض سعر من TA Company، يبدأ نجاح التفاوض من الشفافية. قسّم المشروع إلى صفحات مرئية ومزايا خلفية، وقدّم للعميل 3 مستويات تصميم (قالب جاهز، تصميم خاص، تصميم مميز) مع جدولة دفع واضحة 40% / 30% / 30%.',
      en: 'Successful client negotiations start with structure. Break every proposal into visible pages and backend capabilities, offer 3 clear design tiers (Template, Custom, Premium), and anchor delivery with a 40% / 30% / 30% milestone schedule.',
      fr: 'Une négociation réussie repose sur la clarté. Découpez chaque projet en pages et fonctionnalités, proposez 3 niveaux de design et un échéancier 40% / 30% / 30%.',
    },
  },
  {
    id: 'ai-learning-article',
    type: 'article',
    category: { ar: 'الهندسة البرمجية', en: 'Software Engineering', fr: 'Ingénierie Logicielle' },
    title: {
      ar: 'كيف تتعلم البرمجة وتبني مشاريع حقيقية دون فقدان الأساسيات',
      en: 'Building Production Software Without Losing Core Fundamentals',
      fr: 'Construire des produits fiables sans négliger les fondamentaux',
    },
    summary: {
      ar: 'منهجية عملية للانتقال من HTML و CSS و JavaScript إلى بناء تطبيقات متكاملة مع React و Electron.',
      en: 'A practical roadmap from core web fundamentals to shipping responsive React and cross-platform Electron apps.',
      fr: 'Méthode pratique des fondamentaux web jusqu’au déploiement React et Electron.',
    },
    meta: { ar: '5 دقائق قراءة', en: '5 min read', fr: '5 min de lecture' },
    content: {
      ar: 'الأساس القوي في هيكلة البيانات وفصل منطق الحساب عن واجهة المستخدم يجعل مشاريعك قابلة للاختبار والتطوير سواء على الويب أو كتطبيق سطح مكتب يعمل دون إنترنت.',
      en: 'Decoupling pure business rules from UI components keeps your codebase testable, fast, and portable across Web PWAs and offline Electron desktop packages.',
      fr: 'Séparer la logique métier des composants UI rend vos applications testables et portables sur Web PWA et Desktop Electron.',
    },
  },
  {
    id: 'html-css-guide',
    type: 'guide',
    category: { ar: 'مسار تعلّم', en: 'Learning Track', fr: 'Parcours' },
    title: {
      ar: 'مسار بناء الواجهات المتجاوبة من الصفر حتى الإطلاق',
      en: 'Responsive UI Architecture: From Layout Grid to Desktop Shell',
      fr: 'Architecture UI Responsive : De la grille au bureau Electron',
    },
    summary: {
      ar: '8 فصول عملية لبناء واجهات نظيفة متوافقة مع الهواتف والشاشات الكبيرة مع دعم RTL و LTR.',
      en: '8 structured chapters covering fluid grids, RTL/LTR typography, accessibility, and offline-first caching.',
      fr: '8 chapitres structurés sur les grilles fluides, RTL/LTR, accessibilité et mode hors-ligne.',
    },
    meta: { ar: '8 فصول · متكامل', en: '8 Chapters · Complete', fr: '8 Chapitres · Complet' },
    content: {
      ar: 'الفصل 1: نظام الشبكة والمسافات · الفصل 2: الخطوط العربية واللاتينية · الفصل 3: التجاوب مع الشاشات · الفصل 4: قابلية الوصول · الفصل 5: فصل منطق الحساب · الفصل 6: التخزين المحلي Offline · الفصل 7: الطباعة وتصدير PDF · الفصل 8: التغليف عبر Electron.',
      en: 'Ch 1: Spatial Grids · Ch 2: Multilingual Typography · Ch 3: Breakpoints & Mobile Navigation · Ch 4: Accessibility · Ch 5: Pure Logic Modules · Ch 6: Offline Persistence · Ch 7: A4 Print/PDF · Ch 8: Electron Packaging.',
      fr: 'Ch 1: Grilles · Ch 2: Typographie · Ch 3: Responsive · Ch 4: Accessibilité · Ch 5: Logique pure · Ch 6: Hors-ligne · Ch 7: Export PDF · Ch 8: Packaging Electron.',
    },
  },
  {
    id: 'devis-template',
    type: 'template',
    category: { ar: 'قالب جاهز', en: 'Template', fr: 'Modèle' },
    title: {
      ar: 'قالب عرض سعر احترافي (Devis) — TA Company',
      en: 'Official Project Quote & Scope Template — TA Company',
      fr: 'Modèle de Devis Professionnel — TA Company',
    },
    summary: {
      ar: 'نموذج جاهز للتحميل بصيغة نصية/مستند يتضمن البنود، طريقة الدفع، والشروط القانونية.',
      en: 'Offline-downloadable scope document template including itemized deliverables, payment milestones, and terms.',
      fr: 'Modèle téléchargeable hors-ligne avec prestations, échéancier et conditions générales.',
    },
    meta: { ar: 'ملف جاهز · Offline', en: 'Ready File · Offline', fr: 'Fichier prêt · Hors-ligne' },
    downloadFilename: 'TA-Company-Devis-Template.txt',
    downloadBody: `============================================================
TA COMPANY — PROJECT QUOTE & SCOPE SPECIFICATION (DEVIS)
============================================================
Provider: TA Company
Document Type: Commercial Proposal / Devis
Payment Schedule: 40% Start · 30% Mid-Delivery · 30% Final Handover

1. PROJECT OVERVIEW
- Client Name: ___________________________
- Project Type: __________________________
- Estimated Duration: ____________________

2. DELIVERABLES & SCOPE
[ ] Core Pages & Responsive UI Architecture
[ ] Interactive Features & Integrations
[ ] Technical SEO & Performance Tuning
[ ] Handover Documentation & Training

3. TERMS & CONDITIONS
• Two (2) design revision rounds are included prior to development.
• Domain name registration and hosting fees are billed separately unless specified.
• Production starts upon receipt of the 40% kickoff deposit and initial content assets.
============================================================`,
  },
  {
    id: 'contract-checklist-template',
    type: 'template',
    category: { ar: 'قالب عقد', en: 'Contract Checklist', fr: 'Checklist Contrat' },
    title: {
      ar: 'قائمة التحقق قبل توقيع عقد المشروع وتسليمه',
      en: 'TA Company Pre-Kickoff & Final Handover Checklist',
      fr: 'Checklist de lancement et livraison — TA Company',
    },
    summary: {
      ar: 'قائمة عملية تضمن توثيق المتطلبات، الصلاحيات، والاختبارات قبل تسليم المشروع للعميل.',
      en: 'Standardized checklist covering requirements sign-off, backups, responsive QA, and client training.',
      fr: 'Checklist standardisée pour la validation des besoins, tests responsive et formation client.',
    },
    meta: { ar: 'ملف جاهز · Offline', en: 'Ready File · Offline', fr: 'Fichier prêt · Hors-ligne' },
    downloadFilename: 'TA-Company-Handover-Checklist.txt',
    downloadBody: `TA COMPANY — PROJECT DELIVERY CHECKLIST
------------------------------------------------------------
[ ] Scope & Devis signed by client
[ ] 40% kickoff payment confirmed
[ ] Brand assets, copy & access credentials collected
[ ] Desktop (1440px) & Mobile (390px) responsive checks passed
[ ] Offline/PWA or Electron build verified (if applicable)
[ ] Final 30% payment cleared & source/admin credentials handed over
------------------------------------------------------------`,
  },
  {
    id: 'electron-offline-links',
    type: 'link',
    category: { ar: 'توثيق وأدوات', en: 'Documentation', fr: 'Documentation' },
    title: {
      ar: 'أدلة Electron و PWA للعمل دون اتصال بالإنترنت',
      en: 'Electron & Offline-First Desktop Engineering References',
      fr: 'Références Electron & Applications Hors-Ligne',
    },
    summary: {
      ar: 'مصادر مرجعية موثوقة لتغليف تطبيقات الويب كتطبيقات سطح مكتب على Windows و macOS و Linux.',
      en: 'Curated references for packaging cross-platform desktop installers and service workers.',
      fr: 'Ressources sélectionnées pour packager des applications Windows, macOS et Linux.',
    },
    meta: { ar: '3 مراجع تقنية', en: '3 Technical Refs', fr: '3 Références' },
    content: {
      ar: '1) Electron Forge / Electron Builder لإصدار حزم Windows (.exe) و macOS (.dmg) و Linux (.AppImage).\n2) Workbox Service Worker للتخزين المؤقت الكامل في المتصفح.\n3) Chromium PrintToPDF لإنشاء عروض أسعار A4 بدقة عالية بدون خادم.',
      en: '1) Electron Builder for Windows (.exe), macOS (.dmg), and Linux (.AppImage) packaging.\n2) Workbox Service Workers for offline browser caching.\n3) Chromium PrintToPDF for local server-free A4 PDF quote export.',
      fr: '1) Electron Builder pour Windows, macOS et Linux.\n2) Workbox pour le cache hors-ligne.\n3) Chromium PrintToPDF pour l’export PDF A4 local.',
    },
  },
];
