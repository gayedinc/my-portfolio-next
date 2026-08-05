import { cookies } from 'next/headers';

export const SITE_NAME = 'Gaye Dinç';
export const LOCALE_COOKIE = 'portfolio_locale';
export const SUPPORTED_LOCALES = ['tr', 'en', 'de'];

const metadataTranslations = {
  tr: {
    home: {
      title: 'Gaye Dinç | UI/UX Tasarımcı ve Frontend Developer',
      description: 'Gaye Dinç’in UI/UX tasarım çalışmaları, case study projeleri ve frontend geliştirme çalışmaları.',
    },
    projects: {
      title: 'Çalışmalarım | Gaye Dinç',
      description: 'Gaye Dinç’in UI/UX case study çalışmaları ve frontend geliştirme projeleri.',
    },
    about: { title: 'Hakkımda | Gaye Dinç', description: 'Gaye Dinç’in tasarım yaklaşımı, deneyimi ve çalışma biçimi.' },
    articles: { title: 'Makaleler | Gaye Dinç', description: 'Gaye Dinç’in UI/UX ve frontend geliştirme üzerine makaleleri.' },
    contact: { title: 'İletişim | Gaye Dinç', description: 'UI/UX ve frontend projeleri için Gaye Dinç ile iletişime geçin.' },
    workLabel: 'Çalışmalarım',
    hasarlinkDescription: 'HasarLink hasar bildirim deneyimi için hazırlanan UI/UX case study çalışması.',
    qrakterDescription: 'Zayfix QRakter case study; kaza öncesi hazırlığı, Bireysel ve Paylaşımlı dijital tutanak akışını, QR Acil Durum Kartını, evrak yönetimini ve kaza sonrası takibi ele alıyor.',
  },
  en: {
    home: {
      title: 'Gaye Dinç | UI/UX Designer & Frontend Developer',
      description: 'UI/UX design case studies and frontend development work by Gaye Dinç.',
    },
    projects: {
      title: 'My Work | Gaye Dinç',
      description: 'UI/UX case studies and frontend development projects by Gaye Dinç.',
    },
    about: { title: 'About Me | Gaye Dinç', description: 'The design approach, experience, and working practice of Gaye Dinç.' },
    articles: { title: 'Articles | Gaye Dinç', description: 'Articles by Gaye Dinç on UI/UX and frontend development.' },
    contact: { title: 'Contact | Gaye Dinç', description: 'Contact Gaye Dinç about UI/UX and frontend projects.' },
    workLabel: 'My Work',
    hasarlinkDescription: 'A UI/UX case study for the HasarLink damage reporting experience.',
    qrakterDescription: 'A Zayfix QRakter case study covering pre-accident preparation, Individual and Shared digital accident reports, the QR Emergency Card, document management and post-accident follow-up.',
  },
  de: {
    home: {
      title: 'Gaye Dinç | UI/UX-Designerin & Frontend-Entwicklerin',
      description: 'UI/UX-Fallstudien und Frontend-Entwicklungsarbeiten von Gaye Dinç.',
    },
    projects: {
      title: 'Meine Arbeiten | Gaye Dinç',
      description: 'UI/UX-Fallstudien und Frontend-Projekte von Gaye Dinç.',
    },
    about: { title: 'Über mich | Gaye Dinç', description: 'Designansatz, Erfahrung und Arbeitsweise von Gaye Dinç.' },
    articles: { title: 'Artikel | Gaye Dinç', description: 'Artikel von Gaye Dinç über UI/UX und Frontend-Entwicklung.' },
    contact: { title: 'Kontakt | Gaye Dinç', description: 'Kontaktieren Sie Gaye Dinç für UI/UX- und Frontend-Projekte.' },
    workLabel: 'Meine Arbeiten',
    hasarlinkDescription: 'Eine UI/UX-Fallstudie für den Schadenmeldungsprozess von HasarLink.',
    qrakterDescription: 'Eine Zayfix QRakter Case Study über Unfallvorbereitung, individuelle und gemeinsam erstellte digitale Unfallberichte, die QR-Notfallkarte, Dokumentenverwaltung und die Nachverfolgung nach einem Unfall.',
  },
};

export function normalizeLocale(locale) {
  return SUPPORTED_LOCALES.includes(locale) ? locale : 'tr';
}

export async function getServerLocale() {
  const cookieStore = await cookies();
  return normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value);
}

function withSocialMetadata({ title, description }) {
  const socialImage = {
    url: '/og.png',
    width: 1731,
    height: 909,
    alt: `${SITE_NAME} portfolio preview`,
  };

  return {
    title: { absolute: title },
    description,
    icons: {
      icon: [{ url: '/gaye-dinc-favicon.svg?v=2', type: 'image/svg+xml' }],
      shortcut: '/gaye-dinc-favicon.svg?v=2',
    },
    openGraph: {
      title,
      siteName: SITE_NAME,
      description,
      type: 'website',
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage.url],
    },
  };
}

export function buildPageMetadata({ locale, page }) {
  const translation = metadataTranslations[normalizeLocale(locale)];
  return withSocialMetadata(translation[page] || translation.home);
}

export function buildProjectMetadata({ locale, projectName }) {
  const translation = metadataTranslations[normalizeLocale(locale)];
  const normalizedName = projectName === 'Zayfix QRakter' ? projectName : 'HasarLink';
  const description = normalizedName === 'Zayfix QRakter'
    ? translation.qrakterDescription
    : translation.hasarlinkDescription;

  return withSocialMetadata({
    title: `${translation.workLabel} · ${normalizedName} | ${SITE_NAME}`,
    description,
  });
}
