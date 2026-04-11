import { defineMessages } from 'react-intl';

import {
  defaultMinistryCards,
  ministryCardItemSchemaFactory,
} from './schemaCardItem.js';

const messages = defineMessages({
  blockTitle: {
    id: 'observatorio.block.ministryCards.title',
    defaultMessage: 'Grade de ministérios / órgãos',
  },
  blockDescription: {
    id: 'observatorio.block.ministryCards.description',
    defaultMessage:
      'Cartões com emoji, descrição, lista de destaques e botão para o portal de cada órgão.',
  },
  sectionTitle: {
    id: 'observatorio.block.ministryCards.sectionTitle',
    defaultMessage: 'Título da seção (opcional)',
  },
  sectionTitleDescription: {
    id: 'observatorio.block.ministryCards.sectionTitleDescription',
    defaultMessage:
      'Se a página já tiver o título «Ministérios» no topo, deixe em branco: a barra de busca fica logo abaixo desse título.',
  },
  columns: {
    id: 'observatorio.block.ministryCards.columns',
    defaultMessage: 'Colunas no desktop',
  },
  cards: {
    id: 'observatorio.block.ministryCards.cards',
    defaultMessage: 'Cartões',
  },
  cardsDescription: {
    id: 'observatorio.block.ministryCards.cardsDescription',
    defaultMessage:
      'Adicione ou reordene os cartões; cada um tem link e destaques próprios.',
  },
  cardsSource: {
    id: 'observatorio.block.ministryCards.cardsSource',
    defaultMessage: 'Fonte dos cartões',
  },
  cardsSourceDescription: {
    id: 'observatorio.block.ministryCards.cardsSourceDescription',
    defaultMessage:
      'Lista desta página: cartões ficam só nesta página e a busca usa apenas eles (recomendado em Ministérios). Lista central: mesmos cartões em todo o site (arquivo ministryCardsSite.js); a busca ainda é só neste bloco, mas os dados são os mesmos em qualquer página que use a lista central.',
  },
  cardsSourceLocal: {
    id: 'observatorio.block.ministryCards.cardsSourceLocal',
    defaultMessage: 'Lista desta página (barra lateral)',
  },
  cardsSourceGlobal: {
    id: 'observatorio.block.ministryCards.cardsSourceGlobal',
    defaultMessage: 'Lista central do site (arquivo ministryCardsSite.js)',
  },
  maxCards: {
    id: 'observatorio.block.ministryCards.maxCards',
    defaultMessage: 'Limite de cartões (0 = todos)',
  },
  maxCardsDescription: {
    id: 'observatorio.block.ministryCards.maxCardsDescription',
    defaultMessage:
      'Na home, use um número menor para não poluir; na página Ministérios, deixe 0 para listar todos.',
  },
  showSearchAndFilters: {
    id: 'observatorio.block.ministryCards.showSearchAndFilters',
    defaultMessage: 'Busca e filtros',
  },
  showSearchAndFiltersDescription: {
    id: 'observatorio.block.ministryCards.showSearchAndFiltersDescription',
    defaultMessage:
      'Mostra a barra (como em listagens): pesquisa e filtro só entre os cartões deste bloco nesta página — não pesquisa o site inteiro. Ative na página Ministérios e deixe o título da seção em branco se o título da página já for «Ministérios».',
  },
});

const cardsSourceChoices = (intl) => [
  ['local', intl.formatMessage(messages.cardsSourceLocal)],
  ['global', intl.formatMessage(messages.cardsSourceGlobal)],
];

const columnsChoices = (intl) => [
  [
    '2',
    intl.formatMessage({
      id: 'observatorio.block.ministryCards.cols2',
      defaultMessage: '2 colunas',
    }),
  ],
  [
    '3',
    intl.formatMessage({
      id: 'observatorio.block.ministryCards.cols3',
      defaultMessage: '3 colunas',
    }),
  ],
  [
    'auto',
    intl.formatMessage({
      id: 'observatorio.block.ministryCards.colsAuto',
      defaultMessage: 'Automático (responsivo)',
    }),
  ],
];

export default function ObservatorioMinistryCardsSchema({ intl }) {
  return {
    title: intl.formatMessage(messages.blockTitle),
    description: intl.formatMessage(messages.blockDescription),
    fieldsets: [
      {
        id: 'default',
        title: intl.formatMessage(messages.blockTitle),
        fields: [
          'sectionTitle',
          'cardsSource',
          'maxCards',
          'showSearchAndFilters',
          'columns',
          'cards',
        ],
      },
    ],
    properties: {
      sectionTitle: {
        title: intl.formatMessage(messages.sectionTitle),
        description: intl.formatMessage(messages.sectionTitleDescription),
        default: '',
      },
      cardsSource: {
        title: intl.formatMessage(messages.cardsSource),
        description: intl.formatMessage(messages.cardsSourceDescription),
        choices: cardsSourceChoices(intl),
        default: 'local',
        noValueOption: false,
      },
      maxCards: {
        title: intl.formatMessage(messages.maxCards),
        description: intl.formatMessage(messages.maxCardsDescription),
        type: 'integer',
        default: 0,
        minimum: 0,
        maximum: 200,
      },
      showSearchAndFilters: {
        title: intl.formatMessage(messages.showSearchAndFilters),
        description: intl.formatMessage(
          messages.showSearchAndFiltersDescription,
        ),
        type: 'boolean',
        default: false,
      },
      columns: {
        title: intl.formatMessage(messages.columns),
        choices: columnsChoices(intl),
        default: '3',
        noValueOption: false,
      },
      cards: {
        title: intl.formatMessage(messages.cards),
        description: intl.formatMessage(messages.cardsDescription),
        widget: 'object_list',
        schema: ministryCardItemSchemaFactory(intl),
        default: defaultMinistryCards(),
        condition: (formData) => (formData?.cardsSource ?? 'local') === 'local',
      },
    },
    required: [],
  };
}

export { messages };
