# Especificação do endpoint `@observatorio-rss-feed` (backend Plone)

Documento de referência acordado com o backend. Ajustar host/porta/path ao ambiente real.

## Frontend: ativar o bloco

No add-on, `observatorioNewsFeedEnabled` fica **`false` por padrão** (sem fetch, view não renderiza nada). Para voltar a exibir notícias quando `RAZZLE_API_PATH` e o Plone estiverem OK, defina **`observatorioNewsFeedEnabled: true`** no `applyConfig` do projeto (ou altere o default em `config/settings.ts` do add-on).

## 1. URL exata de teste (critério de pronto)

Substitua `SEU_HOST`, `SEU_PORTA` e o path do site se não for `/Plone`:

```bash
curl -sS -o /tmp/rss-test.json -w "%{http_code}\n" \
  "http://SEU_HOST:SEU_PORTA/Plone/++api++/@observatorio-rss-feed?url=https%3A%2F%2Fwww.gov.br%2Fmds%2Fpt-br%2Fassuntos%2Fnoticias%2FRSS"
```

**Exemplo local típico** (ajuste se o site não for `Plone`):

`http://localhost:8080/Plone/++api++/@observatorio-rss-feed?url=https%3A%2F%2Fwww.gov.br%2Fmds%2Fpt-br%2Fassuntos%2Fnoticias%2FRSS`

Esperado: **HTTP 200** e arquivo/corpo JSON começando com `{"raw":` — **não** HTML do Plone, **não** 404.

O mesmo serviço também costuma responder **sem** `++api++` no path direto do Zope (padrão plone.rest), por exemplo:

`http://SEU_HOST:SEU_PORTA/Plone/@observatorio-rss-feed?url=...`

Com **`RAZZLE_API_PATH=http://HOST:PORTA/Plone`**, o proxy do Volto em dev encaminha para o Plone; o padrão com **`++api++`** é o alinhado ao fluxo Volto/seamless.

## 2. Nome do serviço na URL

- **Nome registrado:** `@observatorio-rss-feed` (com `@`, exatamente esse slug).
- No add-on Volto, **`observatorioPloneRssService`** deve apontar para esse nome; **não** há outro nome de serviço no backend para este proxy.

## 3. Contrato HTTP e JSON

| Item | Valor |
|------|--------|
| Método | **GET** |
| Query obrigatória | **`url`** — URL absoluta do feed (ex.: `https://www.gov.br/.../RSS`) |
| Sucesso **200** | **`Content-Type: application/json`** (padrão `plone.restapi.services.Service`) |
| Corpo sucesso | **`{"raw": "<string com o XML completo do feed>"}`** |
| Campos alternativos | O backend **só envia `raw`** em sucesso. O frontend pode aceitar `xml`/`body` como fallback defensivo; o contrato oficial é **`raw`**. |
| Erros | **`{"message": "..."}`** com status **400** (URL inválida, parâmetro ausente) ou **502** (timeout, rede, HTTP do upstream ≥ 400, corpo que não parece RSS/Atom com `<item` / `<entry`). |

## 4. Validação e upstream (servidor)

- Apenas **HTTPS**; hosts permitidos por política: sufixo **`.gov.br`** (e lista explícita `ALLOWED_HOSTS_EXACT` no código do backend).
- **SSRF:** sem IP literal no host, sem credenciais na URL; path/query deve indicar feed (presença de **`rss`**).
- **Upstream:** `requests`, timeout **25s**, **User-Agent:** `ObservatorioPloneRSS/1.0`.

## 5. Permissão

- Serviço registrado com **`zope2.View`** no site; **`check_permission`** do `Service` não exige **`UseRESTAPI`**, só **View** no contexto — adequado a **anônimos** em site público.

## 6. ZCML (pacote `observatorio.plone`)

```xml
<plone:service
    method="GET"
    for="Products.CMFPlone.interfaces.IPloneSiteRoot"
    factory=".rss_feed.ObservatorioRSSFeedGet"
    name="@observatorio-rss-feed"
    permission="zope2.View"
    />
```

## 7. Versões relevantes (referência de projeto)

- **Plone (core):** `Products.CMFPlone==6.1.4` (Plone **6.1**).
- **plone.restapi:** **9.15.4** (constraint do projeto).
- **Roteamento:** serviço no root do site; **`++api++`** é o namespace de API usado pelo Volto — mesmo `@observatorio-rss-feed` atrás do traversal.

## 8. CORS

- **`plone.volto.cors`** (origens dev típicas: **`http://localhost:3000`**, **`http://127.0.0.1:3000`**).
- Política extra em **`cors_policy.zcml`** com origem **HTTPS de produção** (substituir placeholder pela origem real do frontend).
- Garantir **origem exata** do Volto (dev e produção) em **`allow_origin`** se usarem outro host/porta.

## 9. Desvios em relação a chaves alternativas

- **Sucesso:** apenas **`raw`** no contrato backend. **`xml`** / **`body`** não são retornados pelo servidor descrito.
- **Erro:** apenas **`message`**.

Mudanças futuras no contrato exigem alinhamento em `src/helpers/rssNews.js`.
