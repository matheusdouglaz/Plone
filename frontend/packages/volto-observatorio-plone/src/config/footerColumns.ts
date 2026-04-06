/**
 * Rodapé estilo gov.br — edite títulos e links aqui.
 * Colunas vazias ou com href '#' são placeholders até você publicar páginas ou URLs reais.
 */
import type { InstitutionalLink } from './institutionalLinks';
import {
  ministeriosLinks,
  legislacaoLinks,
  ploneLinks,
  acessibilidadeEDesignLinks,
} from './institutionalLinks';

export type FooterColumn = {
  /** identificador estável (útil se quiser destacar uma coluna no CSS) */
  id: string;
  /** Título em maiúsculas no layout (o CSS força uppercase) */
  title: string;
  links: InstitutionalLink[];
};

const placeholder = (msg: string): InstitutionalLink[] => [
  { title: msg, href: '#' },
];

export const footerColumns: FooterColumn[] = [
  {
    id: 'assuntos',
    title: 'Assuntos',
    links:
      ministeriosLinks.length > 0
        ? ministeriosLinks
        : placeholder('Inclua órgãos em ministeriosLinks (institutionalLinks.ts)'),
  },
  {
    id: 'acesso-informacao',
    title: 'Acesso à informação',
    links: [
      {
        title: 'Acesso à informação (gov.br)',
        href: 'https://www.gov.br/acesso-a-informacao/pt-br',
      },
      {
        title: 'Dados abertos',
        href: 'https://www.gov.br/dados/',
      },
      {
        title: 'Transparência e prestação de contas',
        href: 'https://www.gov.br/transparencia/',
      },
      ...legislacaoLinks,
    ],
  },
  {
    id: 'observatorio',
    title: 'Observatório',
    links: placeholder('Páginas “Quem somos”, equipe, etc. (crie no CMS e substitua)'),
  },
  {
    id: 'documentacao',
    title: 'Documentação e comunidade',
    links: ploneLinks,
  },
  {
    id: 'atendimento',
    title: 'Canais de atendimento',
    links: [
      {
        title: 'Fale conosco (exemplo — altere o href)',
        href: '#',
      },
      {
        title: 'Ouvidoria (exemplo — altere o href)',
        href: '#',
      },
    ],
  },
  {
    id: 'acessibilidade-normas',
    title: 'Acessibilidade e normas',
    links: [
      ...acessibilidadeEDesignLinks,
      {
        title: 'VLibras',
        href: 'http://www.vlibras.gov.br/',
      },
    ],
  },
];
