import { defineMessages } from 'react-intl';

const messages = defineMessages({
  blockTitle: {
    id: 'observatorio.block.newsFeed.title',
    defaultMessage: 'Notícias dos órgãos (RSS)',
  },
  blockDescription: {
    id: 'observatorio.block.newsFeed.description',
    defaultMessage:
      'Home: 1 notícia em destaque + cards (prioriza um órgão diferente em cada um; completa a grade com as mais recentes se faltar órgão). Página de notícias: mesmo RSS agregado em grade, com filtro por órgão e ordem. Fontes: RSS Gov.br.',
  },
  variant: {
    id: 'observatorio.block.newsFeed.variant',
    defaultMessage: 'Modo de exibição',
  },
  sectionTitle: {
    id: 'observatorio.block.newsFeed.sectionTitle',
    defaultMessage: 'Título da seção',
  },
  sectionIntro: {
    id: 'observatorio.block.newsFeed.sectionIntro',
    defaultMessage: 'Texto de apoio (opcional)',
  },
  moreLinkPath: {
    id: 'observatorio.block.newsFeed.moreLinkPath',
    defaultMessage: 'Página “Ver mais” (caminho)',
  },
  moreLinkLabel: {
    id: 'observatorio.block.newsFeed.moreLinkLabel',
    defaultMessage: 'Texto do botão “Ver mais”',
  },
  maxHighlight: {
    id: 'observatorio.block.newsFeed.maxHighlight',
    defaultMessage: 'Quantidade no destaque (1 principal + demais em grade)',
  },
  maxListing: {
    id: 'observatorio.block.newsFeed.maxListing',
    defaultMessage: 'Quantidade na listagem',
  },
  pathHint: {
    id: 'observatorio.block.newsFeed.pathHint',
    defaultMessage: 'Ex.: /noticias — página onde está o bloco em modo listagem.',
  },
});

const variantChoices = (intl) => [
  [
    'highlight',
    intl.formatMessage({
      id: 'obs.news.variant.highlight',
      defaultMessage: 'Destaque (home) — 1 principal + grade',
    }),
  ],
  [
    'listing',
    intl.formatMessage({
      id: 'obs.news.variant.listing',
      defaultMessage: 'Listagem — grade completa + filtro por órgão',
    }),
  ],
];

export default function ObservatorioNewsFeedSchema({ intl, formData = {} }) {
  const variant = formData.variant || 'highlight';

  const mainFields =
    variant === 'highlight'
      ? [
          'variant',
          'sectionTitle',
          'sectionIntro',
          'moreLinkPath',
          'moreLinkLabel',
          'maxHighlight',
        ]
      : ['variant', 'sectionTitle', 'sectionIntro', 'maxListing'];

  return {
    title: intl.formatMessage(messages.blockTitle),
    description: intl.formatMessage(messages.blockDescription),
    fieldsets: [
      {
        id: 'default',
        title: intl.formatMessage(messages.blockTitle),
        fields: mainFields,
      },
    ],
    properties: {
      variant: {
        title: intl.formatMessage(messages.variant),
        choices: variantChoices(intl),
        default: 'highlight',
        noValueOption: false,
      },
      sectionTitle: {
        title: intl.formatMessage(messages.sectionTitle),
        default: 'Notícias',
      },
      sectionIntro: {
        title: intl.formatMessage(messages.sectionIntro),
        widget: 'textarea',
        default: '',
      },
      moreLinkPath: {
        title: intl.formatMessage(messages.moreLinkPath),
        description: intl.formatMessage(messages.pathHint),
        default: '/noticias',
      },
      moreLinkLabel: {
        title: intl.formatMessage(messages.moreLinkLabel),
        default: 'Ver todas as notícias',
      },
      maxHighlight: {
        title: intl.formatMessage(messages.maxHighlight),
        default: 5,
      },
      maxListing: {
        title: intl.formatMessage(messages.maxListing),
        default: 24,
      },
    },
    required: [],
  };
}

export { messages };
