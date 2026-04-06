import { defineMessages } from 'react-intl';

const messages = defineMessages({
  cardTitle: {
    id: 'observatorio.block.ministryCards.card.title',
    defaultMessage: 'Cartão',
  },
  emoji: {
    id: 'observatorio.block.ministryCards.card.emoji',
    defaultMessage: 'Ícone ou emoji',
  },
  emojiHint: {
    id: 'observatorio.block.ministryCards.card.emojiHint',
    defaultMessage: 'Um caractere emoji ou texto curto (ex.: ❤️, 📚).',
  },
  iconBg: {
    id: 'observatorio.block.ministryCards.card.iconBg',
    defaultMessage: 'Fundo do ícone',
  },
  iconBgHint: {
    id: 'observatorio.block.ministryCards.card.iconBgHint',
    defaultMessage: 'Cor de fundo suave atrás do emoji (hex, ex.: #fee2e2).',
  },
  accent: {
    id: 'observatorio.block.ministryCards.card.accent',
    defaultMessage: 'Cor de destaque',
  },
  accentHint: {
    id: 'observatorio.block.ministryCards.card.accentHint',
    defaultMessage: 'Borda sutil do cartão e título “Destaques” (hex).',
  },
  title: {
    id: 'observatorio.block.ministryCards.card.ministryTitle',
    defaultMessage: 'Título',
  },
  description: {
    id: 'observatorio.block.ministryCards.card.description',
    defaultMessage: 'Descrição',
  },
  highlightsLabel: {
    id: 'observatorio.block.ministryCards.card.highlightsLabel',
    defaultMessage: 'Título da lista de destaques',
  },
  highlights: {
    id: 'observatorio.block.ministryCards.card.highlights',
    defaultMessage: 'Destaques (um por linha)',
  },
  highlightsHint: {
    id: 'observatorio.block.ministryCards.card.highlightsHint',
    defaultMessage: 'Três itens recomendados; um bullet por linha.',
  },
  buttonLabel: {
    id: 'observatorio.block.ministryCards.card.buttonLabel',
    defaultMessage: 'Texto do botão',
  },
  href: {
    id: 'observatorio.block.ministryCards.card.href',
    defaultMessage: 'Link do botão',
  },
  hrefHint: {
    id: 'observatorio.block.ministryCards.card.hrefHint',
    defaultMessage: 'Caminho interno (/pagina) ou https://…',
  },
  category: {
    id: 'observatorio.block.ministryCards.card.category',
    defaultMessage: 'Categoria (filtros)',
  },
  categoryHint: {
    id: 'observatorio.block.ministryCards.card.categoryHint',
    defaultMessage:
      'Opcional. Se vazio, a categoria é deduzida do título (ex.: Ministérios). Use para agrupar à mão.',
  },
  themes: {
    id: 'observatorio.block.ministryCards.card.themes',
    defaultMessage: 'Temas (filtro)',
  },
  themesHint: {
    id: 'observatorio.block.ministryCards.card.themesHint',
    defaultMessage:
      'Separados por vírgula ou linha. Ex.: economia, social. Definam as opções do filtro “por tema” no bloco.',
  },
  searchKeywords: {
    id: 'observatorio.block.ministryCards.card.searchKeywords',
    defaultMessage: 'Siglas e palavras-chave (busca)',
  },
  searchKeywordsHint: {
    id: 'observatorio.block.ministryCards.card.searchKeywordsHint',
    defaultMessage:
      'Separadas por vírgula. Ex.: mds, mec. Não aparecem no cartão; ajudam a achar o órgão na busca (siglas, apelidos).',
  },
});

import { ministryCardsSiteList } from '../../../config/ministryCardsSite.js';

/** Pré-visualização padrão do bloco (mesmos dados que a lista central inicial). */
export function defaultMinistryCards() {
  return ministryCardsSiteList.map((c) => ({ ...c }));
}

export function ministryCardItemSchemaFactory(intl) {
  return {
    title: intl.formatMessage(messages.cardTitle),
    fieldsets: [
      {
        id: 'default',
        title: intl.formatMessage(messages.cardTitle),
        fields: [
          'emoji',
          'iconBgColor',
          'accentColor',
          'title',
          'category',
          'themes',
          'searchKeywords',
          'description',
          'highlightsLabel',
          'highlights',
          'buttonLabel',
          'href',
        ],
      },
    ],
    properties: {
      emoji: {
        title: intl.formatMessage(messages.emoji),
        description: intl.formatMessage(messages.emojiHint),
        default: '🏛️',
      },
      iconBgColor: {
        title: intl.formatMessage(messages.iconBg),
        description: intl.formatMessage(messages.iconBgHint),
        default: '#f1f5f9',
      },
      accentColor: {
        title: intl.formatMessage(messages.accent),
        description: intl.formatMessage(messages.accentHint),
        default: '#1351b4',
      },
      title: {
        title: intl.formatMessage(messages.title),
        default: '',
      },
      category: {
        title: intl.formatMessage(messages.category),
        description: intl.formatMessage(messages.categoryHint),
        default: '',
      },
      themes: {
        title: intl.formatMessage(messages.themes),
        description: intl.formatMessage(messages.themesHint),
        widget: 'textarea',
        default: '',
      },
      searchKeywords: {
        title: intl.formatMessage(messages.searchKeywords),
        description: intl.formatMessage(messages.searchKeywordsHint),
        widget: 'textarea',
        default: '',
      },
      description: {
        title: intl.formatMessage(messages.description),
        widget: 'textarea',
        default: '',
      },
      highlightsLabel: {
        title: intl.formatMessage(messages.highlightsLabel),
        default: 'Destaques',
      },
      highlights: {
        title: intl.formatMessage(messages.highlights),
        description: intl.formatMessage(messages.highlightsHint),
        widget: 'textarea',
        default: '',
      },
      buttonLabel: {
        title: intl.formatMessage(messages.buttonLabel),
        default: 'Acessar Portal',
      },
      href: {
        title: intl.formatMessage(messages.href),
        description: intl.formatMessage(messages.hrefHint),
        default: '',
      },
    },
    required: [],
  };
}

export { messages as ministryCardItemMessages };
