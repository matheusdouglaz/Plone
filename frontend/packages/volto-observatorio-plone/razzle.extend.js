/**
 * Garante que Header, Footer, busca e logo usem os arquivos do add-on.
 * O alias amplo `@plone/volto` pode prevalecer sobre os shadows do registry;
 * estes aliases são aplicados depois e sobrescrevem caminhos completos.
 */
const path = require('path');

const root = path.resolve(__dirname);

const shadowAliases = {
  '@plone/volto/components/theme/Logo/Logo': path.join(
    root,
    'src/customizations/volto/components/theme/Logo/Logo.jsx',
  ),
  '@plone/volto/components/theme/Header/Header': path.join(
    root,
    'src/customizations/volto/components/theme/Header/Header.jsx',
  ),
  '@plone/volto/components/theme/Footer/Footer': path.join(
    root,
    'src/customizations/volto/components/theme/Footer/Footer.jsx',
  ),
  '@plone/volto/components/theme/SearchWidget/SearchWidget': path.join(
    root,
    'src/customizations/volto/components/theme/SearchWidget/SearchWidget.jsx',
  ),
  '@plone/volto/components/manage/Blocks/Block/EditBlockWrapper': path.join(
    root,
    'src/customizations/volto/components/manage/Blocks/Block/EditBlockWrapper.jsx',
  ),
  '@plone/volto/components/theme/Logo/Logo.svg': path.join(
    root,
    'src/customizations/volto/components/theme/Logo/Logo.svg',
  ),
};

module.exports = {
  plugins: (defaultPlugins) => defaultPlugins,
  modify: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      ...shadowAliases,
    };
    return config;
  },
};
