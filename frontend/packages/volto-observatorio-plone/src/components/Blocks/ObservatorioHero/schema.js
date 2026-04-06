import { defineMessages } from 'react-intl';

import {
  buttonItemSchemaFactory,
  defaultButtonsArray,
} from '../ObservatorioCta/schemaButtonItem.js';

const messages = defineMessages({
  blockTitle: {
    id: 'observatorio.block.hero.title',
    defaultMessage: 'Banner / Hero',
  },
  blockDescription: {
    id: 'observatorio.block.hero.descriptionBlock',
    defaultMessage:
      'Vários banners por página; cada bloco tem suas próprias cores e alinhamentos.',
  },
  appearance: {
    id: 'observatorio.block.hero.fieldset.appearance',
    defaultMessage: 'Fundo, alinhamentos e cores do texto',
  },
  content: {
    id: 'observatorio.block.hero.fieldset.content',
    defaultMessage: 'Texto',
  },
  buttons: {
    id: 'observatorio.block.hero.fieldset.buttons',
    defaultMessage: 'Botões (lista, tamanho e layout)',
  },
  backgroundMode: {
    id: 'observatorio.block.hero.backgroundMode',
    defaultMessage: 'Fundo do banner',
  },
  colorStart: {
    id: 'observatorio.block.hero.colorStart',
    defaultMessage: 'Cor inicial do gradiente',
  },
  colorEnd: {
    id: 'observatorio.block.hero.colorEnd',
    defaultMessage: 'Cor final do gradiente',
  },
  solidColor: {
    id: 'observatorio.block.hero.solidColor',
    defaultMessage: 'Cor de fundo',
  },
  customBackground: {
    id: 'observatorio.block.hero.customBackground',
    defaultMessage: 'Fundo (CSS avançado)',
  },
  customBackgroundHint: {
    id: 'observatorio.block.hero.customBackgroundHint',
    defaultMessage:
      'Ex.: linear-gradient(120deg, #1351b4 0%, #071d41 100%) ou #0c326f',
  },
  titleAlign: {
    id: 'observatorio.block.hero.titleAlign',
    defaultMessage: 'Alinhamento do título',
  },
  bodyAlign: {
    id: 'observatorio.block.hero.bodyAlign',
    defaultMessage: 'Alinhamento do parágrafo',
  },
  buttonsAlign: {
    id: 'observatorio.block.hero.buttonsAlign',
    defaultMessage: 'Alinhamento do grupo de botões',
  },
  buttonSize: {
    id: 'observatorio.block.hero.buttonSize',
    defaultMessage: 'Tamanho dos botões',
  },
  buttonRadius: {
    id: 'observatorio.block.hero.buttonRadius',
    defaultMessage: 'Cantos dos botões',
  },
  buttonGap: {
    id: 'observatorio.block.hero.buttonGap',
    defaultMessage: 'Espaço entre botões',
  },
  buttonsList: {
    id: 'observatorio.block.hero.buttonsList',
    defaultMessage: 'Botões',
  },
  buttonsListDescription: {
    id: 'observatorio.block.hero.buttonsListDescription',
    defaultMessage:
      'Adicione quantos precisar; em “Alinhamento” use “Espaçados (entre si)” para distribuir na linha.',
  },
  titleSize: {
    id: 'observatorio.block.hero.titleSize',
    defaultMessage: 'Tamanho do título',
  },
  bodySize: {
    id: 'observatorio.block.hero.bodySize',
    defaultMessage: 'Tamanho do parágrafo',
  },
  titleColor: {
    id: 'observatorio.block.hero.titleColor',
    defaultMessage: 'Cor do título',
  },
  descriptionColor: {
    id: 'observatorio.block.hero.descriptionColor',
    defaultMessage: 'Cor do parágrafo',
  },
  paddingY: {
    id: 'observatorio.block.hero.paddingY',
    defaultMessage: 'Espaço vertical (altura da faixa)',
  },
  headline: {
    id: 'observatorio.block.hero.headline',
    defaultMessage: 'Título',
  },
  showHeadline: {
    id: 'observatorio.block.hero.showHeadline',
    defaultMessage: 'Mostrar título',
  },
  description: {
    id: 'observatorio.block.hero.description',
    defaultMessage: 'Parágrafo',
  },
  hexHint: {
    id: 'observatorio.block.hero.hexHint',
    defaultMessage: 'Hex, ex.: #ffffff',
  },
  optionalColorHint: {
    id: 'observatorio.block.hero.optionalColorHint',
    defaultMessage:
      'Opcional — vazio não força cor (contraste conforme o fundo)',
  },
});

const bgModeChoices = (intl) => [
  [
    'theme-default',
    intl.formatMessage({
      id: 'obs.hero.bg.theme',
      defaultMessage: 'Tema — gradiente azul do site',
    }),
  ],
  [
    'gradient-custom',
    intl.formatMessage({
      id: 'obs.hero.bg.gradient2',
      defaultMessage: 'Gradiente — duas cores (hex)',
    }),
  ],
  [
    'solid',
    intl.formatMessage({
      id: 'obs.hero.bg.solid',
      defaultMessage: 'Cor sólida (hex)',
    }),
  ],
  [
    'custom-css',
    intl.formatMessage({
      id: 'obs.hero.bg.css',
      defaultMessage: 'Avançado — CSS do fundo',
    }),
  ],
];

const alignChoices = (intl) => [
  [
    'left',
    intl.formatMessage({ id: 'obs.hero.align.left', defaultMessage: 'Esquerda' }),
  ],
  [
    'center',
    intl.formatMessage({ id: 'obs.hero.align.center', defaultMessage: 'Centro' }),
  ],
  [
    'right',
    intl.formatMessage({ id: 'obs.hero.align.right', defaultMessage: 'Direita' }),
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
    intl.formatMessage({ id: 'obs.hero.btn.size.sm', defaultMessage: 'Pequeno' }),
  ],
  [
    'md',
    intl.formatMessage({ id: 'obs.hero.btn.size.md', defaultMessage: 'Médio' }),
  ],
  [
    'lg',
    intl.formatMessage({ id: 'obs.hero.btn.size.lg', defaultMessage: 'Grande' }),
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

const titleSizeChoices = (intl) => [
  ['sm', intl.formatMessage({ id: 'obs.hero.title.sm', defaultMessage: 'Pequeno' })],
  ['md', intl.formatMessage({ id: 'obs.hero.title.md', defaultMessage: 'Médio' })],
  ['lg', intl.formatMessage({ id: 'obs.hero.title.lg', defaultMessage: 'Grande' })],
  [
    'xl',
    intl.formatMessage({ id: 'obs.hero.title.xl', defaultMessage: 'Muito grande' }),
  ],
];

const bodySizeChoices = (intl) => [
  ['sm', intl.formatMessage({ id: 'obs.hero.body.sm', defaultMessage: 'Pequeno' })],
  ['md', intl.formatMessage({ id: 'obs.hero.body.md', defaultMessage: 'Médio' })],
  ['lg', intl.formatMessage({ id: 'obs.hero.body.lg', defaultMessage: 'Grande' })],
];

const paddingChoices = (intl) => [
  [
    'compact',
    intl.formatMessage({ id: 'obs.hero.py.compact', defaultMessage: 'Compacto' }),
  ],
  [
    'normal',
    intl.formatMessage({ id: 'obs.hero.py.normal', defaultMessage: 'Normal' }),
  ],
  [
    'spacious',
    intl.formatMessage({ id: 'obs.hero.py.spacious', defaultMessage: 'Amplo' }),
  ],
];

export default function ObservatorioHeroSchema({ intl, formData = {} }) {
  const mode = formData.backgroundMode || 'theme-default';

  const appearanceFields = [
    'backgroundMode',
    ...(mode === 'gradient-custom' ? ['colorStart', 'colorEnd'] : []),
    ...(mode === 'solid' ? ['solidColor'] : []),
    ...(mode === 'custom-css' ? ['customBackground'] : []),
    'titleAlign',
    'bodyAlign',
    'titleSize',
    'bodySize',
    'titleColor',
    'descriptionColor',
    'paddingY',
  ];

  return {
    title: intl.formatMessage(messages.blockTitle),
    description: intl.formatMessage(messages.blockDescription),
    fieldsets: [
      {
        id: 'appearance',
        title: intl.formatMessage(messages.appearance),
        fields: appearanceFields,
      },
      {
        id: 'default',
        title: intl.formatMessage(messages.content),
        fields: ['showHeadline', 'headline', 'description'],
      },
      {
        id: 'buttons',
        title: intl.formatMessage(messages.buttons),
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
      backgroundMode: {
        title: intl.formatMessage(messages.backgroundMode),
        choices: bgModeChoices(intl),
        default: 'theme-default',
        noValueOption: false,
      },
      colorStart: {
        title: intl.formatMessage(messages.colorStart),
        description: '#1351b4',
        default: '#1351b4',
      },
      colorEnd: {
        title: intl.formatMessage(messages.colorEnd),
        description: '#071d41',
        default: '#071d41',
      },
      solidColor: {
        title: intl.formatMessage(messages.solidColor),
        default: '#1351b4',
      },
      customBackground: {
        title: intl.formatMessage(messages.customBackground),
        description: intl.formatMessage(messages.customBackgroundHint),
        widget: 'textarea',
        default: 'linear-gradient(160deg, #1351b4 0%, #071d41 100%)',
      },
      titleAlign: {
        title: intl.formatMessage(messages.titleAlign),
        choices: alignChoices(intl),
        default: 'left',
        noValueOption: false,
      },
      bodyAlign: {
        title: intl.formatMessage(messages.bodyAlign),
        choices: alignChoices(intl),
        default: 'left',
        noValueOption: false,
      },
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
      titleSize: {
        title: intl.formatMessage(messages.titleSize),
        choices: titleSizeChoices(intl),
        default: 'lg',
        noValueOption: false,
      },
      bodySize: {
        title: intl.formatMessage(messages.bodySize),
        choices: bodySizeChoices(intl),
        default: 'md',
        noValueOption: false,
      },
      titleColor: {
        title: intl.formatMessage(messages.titleColor),
        description: `${intl.formatMessage(messages.hexHint)} · ${intl.formatMessage(messages.optionalColorHint)}`,
        default: '#ffffff',
      },
      descriptionColor: {
        title: intl.formatMessage(messages.descriptionColor),
        description: `${intl.formatMessage(messages.hexHint)} · ${intl.formatMessage(messages.optionalColorHint)}`,
        default: '#ffffff',
      },
      paddingY: {
        title: intl.formatMessage(messages.paddingY),
        choices: paddingChoices(intl),
        default: 'normal',
        noValueOption: false,
      },
      showHeadline: {
        title: intl.formatMessage(messages.showHeadline),
        type: 'boolean',
        default: true,
      },
      headline: {
        title: intl.formatMessage(messages.headline),
        default: 'Observatório Plone Gov.br',
      },
      description: {
        title: intl.formatMessage(messages.description),
        widget: 'textarea',
        default:
          'Portal centralizado para acesso a todos os ministérios, informações sobre design system, acessibilidade e notícias do governo federal. Tudo em um só lugar.',
      },
    },
    required: [],
  };
}

export { messages };
