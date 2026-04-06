/**
 * Define VOLTOCONFIG com caminho absoluto para volto.config.js na raiz do projeto.
 * Evita falha silenciosa quando path.resolve() usa um cwd diferente (ex.: core/packages/volto).
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const voltoConfig = path.join(projectRoot, 'volto.config.js');

if (!fs.existsSync(voltoConfig)) {
  console.error(
    '[volto-dev] volto.config.js não encontrado em:',
    voltoConfig,
    '\nExecute os comandos a partir da pasta frontend do repositório.',
  );
  process.exit(1);
}

process.env.VOLTOCONFIG = voltoConfig;
process.env.RAZZLE_JEST_CONFIG = path.join(projectRoot, 'jest-addon.config.js');

const args = process.argv.slice(2);

// Storybook (-c): o processo roda em core/packages/volto; forçar .storybook na raiz do projeto
for (let i = 0; i < args.length - 1; i++) {
  if (args[i] === '-c') {
    const v = args[i + 1];
    if (v && v.includes('storybook')) {
      args[i + 1] = path.join(projectRoot, '.storybook');
    }
    break;
  }
}
if (args.length === 0) {
  console.error(
    'Uso: node scripts/run-with-volto-config.cjs --filter @plone/volto <comando>',
  );
  process.exit(1);
}

if (process.env.DEBUG_VOLTO_CONFIG) {
  console.log('[volto-dev] VOLTOCONFIG =', process.env.VOLTOCONFIG);
}

const result = spawnSync('pnpm', args, {
  stdio: 'inherit',
  env: process.env,
  shell: process.platform === 'win32',
});

process.exit(result.status === null ? 1 : result.status);
