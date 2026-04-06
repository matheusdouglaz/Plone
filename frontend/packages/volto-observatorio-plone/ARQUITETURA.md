# Onde muda o quê — Observatório Plone (Volto)

## Duas camadas

| Camada | O quê é | Onde você mexe |
|--------|---------|----------------|
| **CMS (Plone + Volto no navegador)** | Conteúdo: textos, páginas, blocos da página, menu, mídia, publicação | `http://localhost:3000` logado — **não** é o código |
| **Front (este add-on)** | “Moldura” do site: cabeçalho, rodapé, cores, tipografia, blocos React novos | Pasta `packages/volto-observatorio-plone/` |

O **cabeçalho e o rodapé** do seu projeto estão no **tema/add-on** (código). No Volto **não** existe, por padrão, um “widget de cabeçalho” que você arrasta na página como em alguns CMS antigos: o header **envolve todas as páginas** automaticamente.

---

## Pastas importantes deste add-on

```
packages/volto-observatorio-plone/
├── src/
│   ├── index.ts                 → entrada: applyConfig (idioma, etc.)
│   ├── config/
│   │   ├── settings.ts        → ajustes globais do Volto (idioma, etc.)
│   │   ├── institutionalLinks.ts → listas reutilizáveis (ex.: ministérios, Plone)
│   │   └── footerColumns.ts   → **colunas do rodapé** (títulos + links estilo gov.br)
│   ├── customizations/volto/  → substitui componentes do Volto (Header, Footer, Logo, …)
│   └── theme/
│       ├── _variables.scss    → cores e tamanhos (ex.: logo)
│       └── _main.scss         → estilos globais do tema
├── razzle.extend.js           → garante aliases Webpack (customizações)
└── package.json
```

---

## CMS: o que você consegue fazer **sem** deploy de código

- **Páginas e pastas** (estrutura do site).
- **Blocos na página**: texto (Slate), imagem, vídeo, **listagem** (listing), teaser, etc.
- **Menu de navegação** (itens do menu principal).
- **Configuração do site**: título, **upload da logo** (substitui o SVG padrão), ações do rodapé em alguns setups.
- **Home**: montar com blocos — hero, colunas, listagem de notícias, etc. (o que o Volto oferece de bloco; “carrossel” pode ser bloco específico, listagem com variante, ou add-on).

O que **não** costuma existir no CMS Volto padrão: “inserir cabeçalho nesta página”. O cabeçalho é **global** no front.

---

## Código: quando mexer

- Mudar **layout do topo/rodapé**, textos fixos da moldura, **identidade visual**.
- Criar um **bloco Volto novo** (ex.: carrossel customizado) se o que vem pronto não bastar.
- Integrações, analytics no template, etc.

---

## Desenvolvimento: preciso reiniciar o servidor?

Em geral **não** para:

- Alterações em `.jsx`, `.js`, `.scss` dentro do add-on (o Webpack recompila; pode atualizar sozinho ou com F5).

Reinicie (`Ctrl+C` e `pnpm start`) quando mudar:

- `volto.config.js` na raiz do `frontend/`
- `package.json`, dependências, `razzle.extend.js`
- Às vezes ao **criar arquivo novo** de customização (se o alias não for detectado)

Se nada atualizar: salve o arquivo, espere “Compiled” no terminal, dê **F5** forte (Ctrl+Shift+R). Cache do browser também atrapalha.

---

## Por que parece diferente de “CMS de ministério”

Muitos portais usam **tema feito sob medida** + **editores montam só o miolo** (notícias, banners) com blocos. O “cabeçalho igual em tudo” vem do **tema no código**, não de um bloco por página.

Para se aproximar do que você vê em outros sites: **conteúdo e listagens no CMS** + **cabeçalho/rodapé/cores no add-on**.
