export const qrakterHeroMedia = {
  variant: 'phonePair',
  priority: true,
  className: 'qrakter-hero-media',

  images: [
    {
      key: 'hero-home',
      src: '/images/qrakter/zayfix-anasayfa.png',
      type: 'phone',
      width: 375,
      height: 758,
      altKey: 'qrakter_decision_4_media_alt',
    },
    {
      key: 'hero-profile',
      src: '/images/qrakter/profil.png',
      type: 'phone',
      width: 375,
      height: 1085,
      altKey: 'qrakter_decision_5_media_alt',
    },
  ],
};

export const qrakterDecisionMedia = [
  /* ==================================================== */
  /* 01 — Dijital kaza tutanağı                           */
  /* ==================================================== */

  {
    variant: 'phoneSlider',
    captionKey: 'qrakter_decision_1_media_caption',

    images: [
      {
        key: 'accident-report-start',
        src: '/images/qrakter/kaza-tutanagi.png',
        type: 'phone',
        width: 375,
        height: 763,
        altKey: 'qrakter_decision_1_media_alt',
      },
      {
        key: 'accident-report-type',
        src: '/images/qrakter/tutanak-tipi.png',
        type: 'phone',
        width: 375,
        height: 763,
        altKey: 'qrakter_decision_1_media_alt',
      },
      {
        key: 'accident-room',
        src: '/images/qrakter/kaza-odasi.png',
        type: 'phone',
        width: 375,
        height: 833,
        altKey: 'qrakter_decision_1_media_alt',
      },
    ],
  },

  /* ==================================================== */
  /* 02 — QR Acil Durum Kartı                             */
  /* ==================================================== */

  {
    variant: 'phoneSlider',
    captionKey: 'qrakter_decision_2_media_caption',

    images: [
      {
        key: 'emergency-qr',
        src: '/images/qrakter/qr-kod-ekrani.png',
        type: 'phone',
        width: 375,
        height: 1398,
        altKey: 'qrakter_decision_2_media_alt',
      },
      {
        key: 'qr-role-citizen',
        src: '/images/qrakter/rol-secimi-vatandas.png',
        type: 'phone',
        width: 375,
        height: 926,
        altKey: 'qrakter_decision_2_media_alt',
      },
      {
        key: 'qr-role-police',
        src: '/images/qrakter/rol-secimi-polis.png',
        type: 'phone',
        width: 375,
        height: 926,
        altKey: 'qrakter_decision_2_media_alt',
      },
      {
        key: 'qr-role-health',
        src: '/images/qrakter/rol-secimi-saglikci.png',
        type: 'phone',
        width: 375,
        height: 926,
        altKey: 'qrakter_decision_2_media_alt',
      },
    ],
  },

  /* ==================================================== */
  /* 03 — Şans Çarkı                                      */
  /* ==================================================== */

  {
    variant: 'phoneSlider',
    captionKey: 'qrakter_decision_3_media_caption',

    images: [
      {
        key: 'wheel-default',
        src: '/images/qrakter/sans-carki.png',
        type: 'phone',
        width: 375,
        height: 1195,
        altKey: 'qrakter_decision_3_media_alt',
      },
      {
        key: 'wheel-profile-required',
        src: '/images/qrakter/sans-carki-profili-eksik.png',
        type: 'phone',
        width: 375,
        height: 1195,
        altKey: 'qrakter_decision_3_media_alt',
      },
      {
        key: 'wheel-no-win',
        src: '/images/qrakter/sans-carki-kazanilmama.png',
        type: 'phone',
        width: 375,
        height: 1195,
        altKey: 'qrakter_decision_3_media_alt',
      },
    ],
  },

  /* ==================================================== */
  /* 04 — Ana sayfa / kritik aksiyonlar                   */
  /* ==================================================== */

  {
    variant: 'phoneSingle',
    captionKey: 'qrakter_decision_4_media_caption',

    images: [
      {
        key: 'home-critical-actions',
        src: '/images/qrakter/zayfix-anasayfa.png',
        type: 'phone',
        width: 375,
        height: 758,
        altKey: 'qrakter_decision_4_media_alt',
      },
    ],
  },

  /* ==================================================== */
  /* 05 — Profil                                          */
  /* ==================================================== */

  {
    variant: 'phoneSingle',
    captionKey: 'qrakter_decision_5_media_caption',

    images: [
      {
        key: 'profile-completion',
        src: '/images/qrakter/profil.png',
        type: 'phone',
        width: 375,
        height: 1085,
        altKey: 'qrakter_decision_5_media_alt',
      },
    ],
  },

  /* ==================================================== */
  /* 06 — Kulüp rolleri                                   */
  /* ==================================================== */

  {
    variant: 'phoneSlider',
    captionKey: 'qrakter_decision_6_media_caption',

    images: [
      {
        key: 'club-owner',
        src: '/images/qrakter/kulup-profili-sahibi.png',
        type: 'phone',
        width: 375,
        height: 1517,
        altKey: 'qrakter_decision_6_media_alt',
      },
      {
        key: 'club-member',
        src: '/images/qrakter/kulup-profili.png',
        type: 'phone',
        width: 375,
        height: 1230,
        altKey: 'qrakter_decision_6_media_alt',
      },
    ],
  },
];