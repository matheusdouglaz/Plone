/**
 * Fontes RSS dos órgãos no Gov.br (caminhos típicos …/noticias/RSS).
 * Amplie ou ajuste URLs conforme o site de cada órgão publicar o feed.
 */
const ministryRssFeeds = [
  {
    id: 'mds',
    name: 'MDS',
    shortLabel: 'Desenvolvimento Social',
    rssUrl: 'https://www.gov.br/mds/pt-br/assuntos/noticias/RSS',
  },
  /* Feed oficial da pasta de notícias — mesmo conteúdo base da página
     https://www.gov.br/saude/pt-br/assuntos/noticias (ordem pode diferir do HTML). */
  {
    id: 'saude',
    name: 'Saúde',
    shortLabel: 'Ministério da Saúde',
    rssUrl: 'https://www.gov.br/saude/pt-br/assuntos/noticias/RSS',
  },
  {
    id: 'mec',
    name: 'Educação',
    shortLabel: 'MEC',
    rssUrl: 'https://www.gov.br/mec/pt-br/assuntos/noticias/RSS',
  },
  {
    id: 'fazenda',
    name: 'Fazenda',
    shortLabel: 'Ministério da Fazenda',
    rssUrl: 'https://www.gov.br/fazenda/pt-br/assuntos/noticias/RSS',
  },
  {
    id: 'mma',
    name: 'Meio Ambiente',
    shortLabel: 'MMA',
    rssUrl: 'https://www.gov.br/mma/pt-br/assuntos/noticias/RSS',
  },
  {
    id: 'justica',
    name: 'Justiça',
    shortLabel: 'Ministério da Justiça',
    rssUrl: 'https://www.gov.br/mj/pt-br/assuntos/noticias/RSS',
  },
  {
    id: 'defesa',
    name: 'Defesa',
    shortLabel: 'Ministério da Defesa',
    rssUrl: 'https://www.gov.br/defesa/pt-br/assuntos/noticias/RSS',
  },
  {
    id: 'transportes',
    name: 'Transportes',
    shortLabel: 'Ministério dos Transportes',
    rssUrl: 'https://www.gov.br/transportes/pt-br/assuntos/noticias/RSS',
  },
  {
    id: 'agricultura',
    name: 'Agricultura',
    shortLabel: 'MAPA',
    rssUrl: 'https://www.gov.br/agricultura/pt-br/assuntos/noticias/RSS',
  },
  {
    id: 'cidadania',
    name: 'Cidadania',
    shortLabel: 'Ministério da Cidadania',
    rssUrl: 'https://www.gov.br/cidadania/pt-br/assuntos/noticias/RSS',
  },
  {
    id: 'turismo',
    name: 'Turismo',
    shortLabel: 'Ministério do Turismo',
    rssUrl: 'https://www.gov.br/turismo/pt-br/assuntos/noticias/RSS',
  },
  {
    id: 'mulheres',
    name: 'Mulheres',
    shortLabel: 'Ministério das Mulheres',
    rssUrl: 'https://www.gov.br/mulheres/pt-br/assuntos/noticias/RSS',
  },
];

export default ministryRssFeeds;
