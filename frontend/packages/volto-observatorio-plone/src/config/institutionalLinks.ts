/** Links institucionais exibidos no rodapé; edite aqui ou mova para conteúdo no CMS depois. */

export type InstitutionalLink = { title: string; href: string };

/** Preencha com títulos e URLs (páginas internas ou sites dos órgãos). */
export const ministeriosLinks: InstitutionalLink[] = [];

export const legislacaoLinks: InstitutionalLink[] = [
  {
    title: 'Legislação (gov.br)',
    href: 'http://www4.planalto.gov.br/legislacao',
  },
];

export const ploneLinks: InstitutionalLink[] = [
  {
    title: 'Documentação Plone 6',
    href: 'https://6.docs.plone.org/',
  },
  {
    title: 'Treinamentos Plone',
    href: 'https://training.plone.org/',
  },
  {
    title: 'Plone.org',
    href: 'https://plone.org/',
  },
];

export const acessibilidadeEDesignLinks: InstitutionalLink[] = [
  {
    title: 'Design System gov.br',
    href: 'https://www.gov.br/ds/',
  },
  {
    title: 'Acessibilidade digital (gov.br)',
    href: 'https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario',
  },
];
