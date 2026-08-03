export const hasarlinkMedia = {
  hero: {
    variant: 'heroDevices',
    priority: true,
    images: [
      {
        key: 'hero-web',
        src: '/images/hasarlink/hero/web-masaustu.png',
        type: 'web',
        altKey: 'hasarlink_media_web_desktop_alt',
        placeholderKey: 'hasarlink_media_web_placeholder',
      },
      {
        key: 'hero-mobile',
        src: '/images/hasarlink/mobile/mobil-anasayfa.png',
        type: 'phone',
        altKey: 'hasarlink_media_mobile_home_alt',
        placeholderKey: 'hasarlink_media_hero_placeholder',
      },
    ],
  },
  decisions: {
    commonFlow: {
      variant: 'phoneSlider',
      captionKey: 'hasarlink_media_common_flow_caption',
      images: [
        {
          key: 'insurance-select',
          src: '/images/hasarlink/mobile/sigorta-secme-ekrani.png',
          type: 'phone',
          altKey: 'hasarlink_media_insurance_select_alt',
          placeholderKey: 'hasarlink_media_mobile_placeholder',
        },
        {
          key: 'opening-type',
          src: '/images/hasarlink/mobile/sigorta-nereden-aciliyor.png',
          type: 'phone',
          altKey: 'hasarlink_media_opening_type_alt',
          placeholderKey: 'hasarlink_media_mobile_placeholder',
        },
      ],
    },
    guidedForm: {
      variant: 'phoneSlider',
      captionKey: 'hasarlink_media_guided_form_caption',
      images: [
        {
          key: 'victim-form',
          src: '/images/hasarlink/mobile/magdur-bilgileri.png',
          type: 'phone',
          altKey: 'hasarlink_media_victim_form_alt',
          placeholderKey: 'hasarlink_media_mobile_placeholder',
        },
        {
          key: 'document-upload',
          src: '/images/hasarlink/mobile/evrak-yukleme-alani.png',
          type: 'phone',
          altKey: 'hasarlink_media_document_upload_alt',
          placeholderKey: 'hasarlink_media_mobile_placeholder',
        },
        {
          key: 'form-summary',
          src: '/images/hasarlink/mobile/form-adim-1.png',
          type: 'phone',
          altKey: 'hasarlink_media_form_summary_alt',
          placeholderKey: 'hasarlink_media_mobile_placeholder',
        },
      ],
    },
    fileOverview: {
      variant: 'phoneSingle',
      images: [
        {
          key: 'file-list',
          src: '/images/hasarlink/mobile/dosya-bildirimlerim.png',
          type: 'phone',
          altKey: 'hasarlink_media_file_list_alt',
          placeholderKey: 'hasarlink_media_mobile_placeholder',
        },
      ],
    },
    fileDetail: {
      variant: 'longPhone',
      images: [
        {
          key: 'file-detail',
          src: '/images/hasarlink/mobile/dosya-bildirimlerim-detay.png',
          type: 'phone',
          variant: 'longPhone',
          altKey: 'hasarlink_media_file_detail_alt',
          placeholderKey: 'hasarlink_media_mobile_placeholder',
        },
      ],
    },
  },
};
