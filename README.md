# Central de Marketing

Um plugin para o [Claude Code](https://claude.com/claude-code) que junta 27
skills de marketing num lugar só. Você pede o que precisa em português ("gera
o conteúdo da semana", "melhora a bio do meu Instagram", "faz pins pro
Pinterest") e a **central-marketing** escolhe a skill certa e aplica as regras
da sua marca.

## Instalar

No Claude Code, rode:

```
/plugin marketplace add ItsMeMateus/create-marketing
/plugin install central-marketing@create-marketing
```

### Instalar à parte (opcional)

Estas skills são de outros autores e não podem vir embutidas no plugin. A
central-marketing reconhece cada uma quando ela está instalada:

| Para quê | Skills | Como instalar |
|---|---|---|
| SEO e IA: auditoria do site, Search Console, aparecer no ChatGPT | `seo`, `seo-*` (claude-seo) | `/plugin marketplace add AgriciDaniel/claude-seo` e depois `/plugin install claude-seo` |
| Achar pessoas e contatos (influenciadores, parceiros) e e-mail | `people-search`, `lessie-email` (Lessie) | `npx skills add LessieAI/lessie-skill -y -g` e `npm install -g @lessie/cli`; precisa de conta no lessie.ai |
| Vídeos programados (reels feitos com código) | `remotion-*` (Remotion) | `npx skills add remotion-dev/skills` |
| Pesquisa com usuários, personas e jornada | `ux-researcher-designer` | `npx skills add oabdelmaksoud/agention --skill ux-researcher-designer` |

## Primeiro uso: treine a sua marca

Abra o seu projeto no Claude Code e digite:

```
/central-marketing treinar a minha marca
```

Mande **1 a 3 imagens** (o logo, um print do site ou do Instagram, um post que
você gosta) e diga **o seu ramo** (ex.: "doceria artesanal em Curitiba",
"estúdio de pilates", "loja de roupa infantil"). A central-marketing:

1. lê as imagens e tira as cores, o estilo e o tom da marca;
2. pesquisa o que está viralizando no seu ramo;
3. pergunta só o que ela não tem como saber (preços, números, o que é grátis);
4. monta quatro arquivos no seu projeto, que todas as skills passam a usar:
   - `.agents/product-marketing.md`: produto, preços, números, concorrentes;
   - `.claude/instagram/voice.md`: tom de voz e palavras;
   - `.claude/instagram/niche.md`: o ramo, termos de busca, formatos que
     funcionam, datas fortes;
   - `.agents/brand.json`: cores, logo e mascote para as imagens.
5. mostra uma amostra (ganchos de reel e uma legenda) para você aprovar.

Mudou de ramo ou de visual? Mande as imagens novas e peça "treinar de novo".

Os geradores de imagem (carrossel, meme, pins e a leitura das cores)
precisam de Node.js e do Playwright:

```
npm install -g playwright
npx playwright install chromium
```

## O que vem dentro

| Área | Skills |
|---|---|
| Central | `central-marketing` |
| Pesquisa de trends | `instagram-research`, `tiktok-research`, `x-research`, `youtube-research`, `video-content-analyzer`, `content-planner` |
| Instagram | `ig-reel`, `ig-caption`, `ig-carousel`, `ig-story`, `ig-profile`, `ig-plan`, `ig-viral`, `ig-audit`, `ig-repurpose`, `ig-comment`, `ig-reply`, `ig-dm`, `ig-human` |
| Pinterest | `pinterest` |
| Rotina de conteúdo | `pipeline-conteudo` |
| Estratégia e conversão | `marketing-council`, `copywriting`, `cro`, `ab-testing`, `marketing-psychology` |

As skills de pesquisa (`*-research`, `video-content-analyzer`) usam as chaves
`APIFY_TOKEN`, `GEMINI_API_KEY` e `TUBELAB_API_KEY`. Coloque-as nas
variáveis de ambiente, nunca no chat. Sem elas, a `ig-viral` funciona com um
conector de busca de virais, como o do vidIQ.

## Regras que valem para tudo

- Nada é publicado, enviado ou mudado no site sem o seu "sim".
- Só fatos: nada de métricas, depoimentos ou avaliações inventados.
- Comentar, seguir e mandar DM é sempre com você, nunca automático.
- Chaves e senhas nunca vão no chat.

## Créditos e licenças

O código e os textos próprios deste plugin são MIT (veja `LICENSE`). Várias
skills vêm de outros autores, também com licença MIT, e foram adaptadas
(textos em português, fórmulas novas, caminhos): veja `THIRD_PARTY.md`.
