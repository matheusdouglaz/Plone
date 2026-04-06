import { defineMessages } from 'react-intl';

const messages = defineMessages({
  itemTitle: {
    id: 'observatorio.block.cta.buttonItem.title',
    defaultMessage: 'Botão',
  },
  label: {
    id: 'observatorio.block.cta.buttonItem.label',
    defaultMessage: 'Texto',
  },
  href: {
    id: 'observatorio.block.cta.buttonItem.href',
    defaultMessage: 'Link',
  },
  variant: {
    id: 'observatorio.block.cta.buttonItem.variant',
    defaultMessage: 'Estilo',
  },
  bgColor: {
    id: 'observatorio.block.cta.buttonItem.bgColor',
    defaultMessage: 'Cor de fundo',
  },
  textColor: {
    id: 'observatorio.block.cta.buttonItem.textColor',
    defaultMessage: 'Cor do texto',
  },
  borderColor: {
    id: 'observatorio.block.cta.buttonItem.borderColor',
    defaultMessage: 'Cor da borda',
  },
  hrefHint: {
    id: 'observatorio.block.cta.buttonItem.hrefHint',
    defaultMessage: 'Caminho (/pagina) ou https://…',
  },
  borderHint: {
    id: 'observatorio.block.cta.buttonItem.borderHint',
    defaultMessage: 'Contorno: define a borda; preenchido: opcional',
  },
  bgHint: {
    id: 'observatorio.block.cta.buttonItem.bgHint',
    defaultMessage: 'Vazio = transparente (contorno / só texto)',
  },
});

const variantChoices = (intl) => [
  [
    'filled',
    intl.formatMessage({
      id: 'obs.cta.variant.filled',
      defaultMessage: 'Preenchido',
    }),
  ],
  [
    'outline',
    intl.formatMessage({
      id: 'obs.cta.variant.outline',
      defaultMessage: 'Contorno',
    }),
  ],
  [
    'ghost',
    intl.formatMessage({
      id: 'obs.cta.variant.ghost',
      defaultMessage: 'Só texto',
    }),
  ],
];

export function defaultButtonsArray() {
  return [
    {
      label: 'Botão',
      href: '/',
      variant: 'filled',
      bgColor: '#ffcd07',
      textColor: '#1a1a1a',
      borderColor: '',
    },
  ];
}

/** Schema de um item da lista (widget object_list) */
export function buttonItemSchemaFactory(intl) {
  return {
    title: intl.formatMessage(messages.itemTitle),
    fieldsets: [
      {
        id: 'default',
        title: intl.formatMessage(messages.itemTitle),
        fields: [
          'label',
          'href',
          'variant',
          'bgColor',
          'textColor',
          'borderColor',
        ],
      },
    ],
    properties: {
      label: {
        title: intl.formatMessage(messages.label),
        default: '',
      },
      href: {
        title: intl.formatMessage(messages.href),
        description: intl.formatMessage(messages.hrefHint),
        default: '',
      },
      variant: {
        title: intl.formatMessage(messages.variant),
        choices: variantChoices(intl),
        default: 'filled',
        noValueOption: false,
      },
      bgColor: {
        title: intl.formatMessage(messages.bgColor),
        description: intl.formatMessage(messages.bgHint),
        default: '',
      },
      textColor: {
        title: intl.formatMessage(messages.textColor),
        default: '#1a1a1a',
      },
      borderColor: {
        title: intl.formatMessage(messages.borderColor),
        description: intl.formatMessage(messages.borderHint),
        default: '',
      },
    },
    required: [],
  };
}

export { messages as buttonItemMessages };
