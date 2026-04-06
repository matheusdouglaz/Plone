import type { ConfigType } from '@plone/registry';
import BlockSettingsSchema from '@plone/volto/components/manage/Blocks/Block/Schema';
import gridSVG from '@plone/volto/icons/grid-block.svg';

import ministryRssFeeds from './ministryRssFeeds.js';
import { ministryCardsSiteList } from './ministryCardsSite.js';
import ObservatorioHeroView from '../components/Blocks/ObservatorioHero/View.jsx';
import ObservatorioHeroEdit from '../components/Blocks/ObservatorioHero/Edit.jsx';
import ObservatorioHeroSchema from '../components/Blocks/ObservatorioHero/schema.js';
import ObservatorioCtaView from '../components/Blocks/ObservatorioCta/View.jsx';
import ObservatorioCtaEdit from '../components/Blocks/ObservatorioCta/Edit.jsx';
import ObservatorioCtaSchema from '../components/Blocks/ObservatorioCta/schema.js';
import ObservatorioNewsFeedView from '../components/Blocks/ObservatorioNewsFeed/View.jsx';
import ObservatorioNewsFeedEdit from '../components/Blocks/ObservatorioNewsFeed/Edit.jsx';
import ObservatorioNewsFeedSchema from '../components/Blocks/ObservatorioNewsFeed/schema.js';
import ObservatorioMinistryCardsView from '../components/Blocks/ObservatorioMinistryCards/View.jsx';
import ObservatorioMinistryCardsEdit from '../components/Blocks/ObservatorioMinistryCards/Edit.jsx';
import ObservatorioMinistryCardsSchema from '../components/Blocks/ObservatorioMinistryCards/schema.js';

export default function install(config: ConfigType) {
  config.settings.isMultilingual = false;
  config.settings.supportedLanguages = ['pt-br'];
  config.settings.defaultLanguage = 'pt-br';

  /* Lista editável em código: packages/.../config/ministryRssFeeds.js */
  // @ts-expect-error extensão de settings do projeto
  config.settings.observatorioMinistryRssFeeds = ministryRssFeeds;
  /* Nome do serviço REST no Plone: GET {apiPath}/++api++/@observatorio-rss-feed?url=… */
  // @ts-expect-error extensão de settings do projeto
  config.settings.observatorioPloneRssService = '@observatorio-rss-feed';
  /* true ou ?rssDebug=1 na URL: logs no console ([Observatorio RSS]) */
  // @ts-expect-error extensão de settings do projeto
  config.settings.observatorioRssDebug = false;
  /*
   * Bloco RSS desligado até haver RAZZLE_API_PATH + endpoint Plone OK.
   * Para reativar: true no applyConfig do projeto ou aqui.
   */
  // @ts-expect-error extensão de settings do projeto
  config.settings.observatorioNewsFeedEnabled = false;
  /* Bloco Grade de ministérios — modo "lista central"; editável em config/ministryCardsSite.js */
  // @ts-expect-error extensão de settings do projeto
  config.settings.observatorioMinistryCardsSiteList = ministryCardsSiteList;

  config.blocks.blocksConfig.observatorioHero = {
    id: 'observatorioHero',
    title: 'Banner / Hero',
    icon: gridSVG,
    group: 'common',
    view: ObservatorioHeroView,
    edit: ObservatorioHeroEdit,
    schema: BlockSettingsSchema,
    blockSchema: ObservatorioHeroSchema,
    restricted: false,
    mostUsed: true,
    sidebarTab: 1,
  };

  config.blocks.blocksConfig.observatorioCta = {
    id: 'observatorioCta',
    title: 'Botões / CTAs',
    icon: gridSVG,
    group: 'common',
    view: ObservatorioCtaView,
    edit: ObservatorioCtaEdit,
    schema: BlockSettingsSchema,
    blockSchema: ObservatorioCtaSchema,
    restricted: false,
    mostUsed: true,
    sidebarTab: 1,
  };

  config.blocks.blocksConfig.observatorioNewsFeed = {
    id: 'observatorioNewsFeed',
    title: 'Notícias dos órgãos (RSS)',
    icon: gridSVG,
    group: 'common',
    view: ObservatorioNewsFeedView,
    edit: ObservatorioNewsFeedEdit,
    schema: BlockSettingsSchema,
    blockSchema: ObservatorioNewsFeedSchema,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
  };

  config.blocks.blocksConfig.observatorioMinistryCards = {
    id: 'observatorioMinistryCards',
    title: 'Grade de ministérios / órgãos',
    icon: gridSVG,
    group: 'common',
    view: ObservatorioMinistryCardsView,
    edit: ObservatorioMinistryCardsEdit,
    schema: BlockSettingsSchema,
    blockSchema: ObservatorioMinistryCardsSchema,
    restricted: false,
    mostUsed: true,
    sidebarTab: 1,
  };

  return config;
}
