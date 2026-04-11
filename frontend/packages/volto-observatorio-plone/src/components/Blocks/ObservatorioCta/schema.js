import { defineMessages } from 'react-intl';

import {
  buttonItemSchemaFactory,
  defaultButtonsArray,
} from './schemaButtonItem.js';

const messages = defineMessages({
  blockTitle: {
    id: 'observatorio.block.cta.title',
    defaultMessage: 'Botões / CTAs',
  },
  blockDescription: {
    id: 'observatorio.block.cta.description',
    defaultMessage:
      'Linha de botões reutilizável em qualquer página. Combine com texto, imagem ou listagem.',
  },
  layout: {
    id: 'observatorio.block.cta.fieldset.layout',
    defaultMessage: 'Layout dos botões',
  },
  buttonsAlign: {
    id: 'observatorio.block.cta.buttonsAlign',
    defaultMessage: 'Alinhamento do grupo',
  },
  buttonSize: {
    id: 'observatorio.block.cta.buttonSize',
    defaultMessage: 'Tamanho dos botões',
  },
  buttonRadius: {
    id: 'observatorio.block.cta.buttonRadius',
    defaultMessage: 'Cantos dos botões',
  },
  buttonGap: {
    id: 'observatorio.block.cta.buttonGap',
    defaultMessage: 'Espaço entre botões',
  },
  buttonsList: {
    id: 'observatorio.block.cta.buttonsList',
    defaultMessage: 'Botões',
  },
  buttonsListDescription: {
    id: 'observatorio.block.cta.buttonsListDescription',
    defaultMessage:
      'Adicione links, cores e estilos por botão. Use “Espaçados (entre si)” para três ou mais distribuídos na linha.',
  },
});

const alignChoices = (intl) => [
  [
    'left',
    intl.formatMessage({
      id: 'obs.hero.align.left',
      defaultMessage: 'Esquerda',
    }),
  ],
  [
    'center',
    intl.formatMessage({
      id: 'obs.hero.align.center',
      defaultMessage: 'Centro',
    }),
  ],
  [
    'right',
    intl.formatMessage({
      id: 'obs.hero.align.right',
      defaultMessage: 'Direita',
    }),
  ],
];

const buttonsAlignChoices = (intl) => [
  ...alignChoices(intl),
  [
    'space-between',
    intl.formatMessage({
      id: 'obs.hero.buttonsAlign.between',
      defaultMessage: 'Espaçados (entre si)',
    }),
  ],
  [
    'space-around',
    intl.formatMessage({
      id: 'obs.hero.buttonsAlign.around',
      defaultMessage: 'Espaçados (ao redor)',
    }),
  ],
  [
    'space-evenly',
    intl.formatMessage({
      id: 'obs.hero.buttonsAlign.evenly',
      defaultMessage: 'Espaçados (igual)',
    }),
  ],
  [
    'stretch',
    intl.formatMessage({
      id: 'obs.hero.buttonsAlign.stretch',
      defaultMessage: 'Mesma largura (preenchem a linha)',
    }),
  ],
];

const buttonSizeChoices = (intl) => [
  [
    'sm',
    intl.formatMessage({
      id: 'obs.hero.btn.size.sm',
      defaultMessage: 'Pequeno',
    }),
  ],
  [
    'md',
    intl.formatMessage({
      id: 'obs.hero.btn.size.md',
      defaultMessage: 'Médio',
    }),
  ],
  [
    'lg',
    intl.formatMessage({
      id: 'obs.hero.btn.size.lg',
      defaultMessage: 'Grande',
    }),
  ],
];

const buttonRadiusChoices = (intl) => [
  [
    'pill',
    intl.formatMessage({
      id: 'obs.hero.btn.radius.pill',
      defaultMessage: 'Arredondado (pílula)',
    }),
  ],
  [
    'rounded',
    intl.formatMessage({
      id: 'obs.hero.btn.radius.rounded',
      defaultMessage: 'Levemente arredondado',
    }),
  ],
  [
    'square',
    intl.formatMessage({
      id: 'obs.hero.btn.radius.square',
      defaultMessage: 'Quadrado (sem arco)',
    }),
  ],
];

const buttonGapChoices = (intl) => [
  [
    'compact',
    intl.formatMessage({
      id: 'obs.hero.btn.gap.compact',
      defaultMessage: 'Apertado',
    }),
  ],
  [
    'normal',
    intl.formatMessage({
      id: 'obs.hero.btn.gap.normal',
      defaultMessage: 'Normal',
    }),
  ],
  [
    'relaxed',
    intl.formatMessage({
      id: 'obs.hero.btn.gap.relaxed',
      defaultMessage: 'Folgado',
    }),
  ],
];

export default function ObservatorioCtaSchema({ intl }) {
  return {
    title: intl.formatMessage(messages.blockTitle),
    description: intl.formatMessage(messages.blockDescription),
    fieldsets: [
      {
        id: 'default',
        title: intl.formatMessage(messages.layout),
        fields: [
          'buttonsAlign',
          'buttonSize',
          'buttonRadius',
          'buttonGap',
          'buttons',
        ],
      },
    ],
    properties: {
      buttonsAlign: {
        title: intl.formatMessage(messages.buttonsAlign),
        choices: buttonsAlignChoices(intl),
        default: 'left',
        noValueOption: false,
      },
      buttonSize: {
        title: intl.formatMessage(messages.buttonSize),
        choices: buttonSizeChoices(intl),
        default: 'md',
        noValueOption: false,
      },
      buttonRadius: {
        title: intl.formatMessage(messages.buttonRadius),
        choices: buttonRadiusChoices(intl),
        default: 'pill',
        noValueOption: false,
      },
      buttonGap: {
        title: intl.formatMessage(messages.buttonGap),
        choices: buttonGapChoices(intl),
        default: 'normal',
        noValueOption: false,
      },
      buttons: {
        title: intl.formatMessage(messages.buttonsList),
        description: intl.formatMessage(messages.buttonsListDescription),
        widget: 'object_list',
        schema: buttonItemSchemaFactory(intl),
        default: defaultButtonsArray(),
      },
    },
    required: [],
  };
}

export { messages };
