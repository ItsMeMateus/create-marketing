# Central de Marketing

Um plugin para o [Claude Code](https://claude.com/claude-code) que junta 30
skills de marketing num lugar só. Você pede o que precisa em português ("gera
o conteúdo da semana", "faz um reel do meu site", "melhora a bio do meu
Instagram", "faz pins pro Pinterest") e a **central-marketing** escolhe a
skill certa e aplica as regras da sua marca.

## 1. Instalar

No Claude Code, rode:

```
/plugin marketplace add ItsMeMateus/create-marketing
/plugin install central-marketing@create-marketing
```

Isso já traz as 30 skills da tabela da seção 4. Os complementos
opcionais estão na seção 5.

## 2. Treine a sua marca (primeiro uso)

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
   - `.agents/brand.json`: cores, logo e mascote para as imagens e vídeos;
5. mostra uma amostra (ganchos de reel e uma legenda) para você aprovar.

Mudou de ramo ou de visual? Mande as imagens novas e peça "treinar de novo".

## 3. Programas que precisam estar no computador

Para gerar imagens (carrossel, meme, pins, leitura das cores) e vídeos:

- **Node.js** 18 ou mais novo
- **Playwright** com o Chromium:
  ```
  npm install -g playwright
  npx playwright install chromium
  ```
- **ffmpeg** (só para os vídeos): `brew install ffmpeg` no Mac,
  `sudo apt install ffmpeg` no Linux, ou o instalador de ffmpeg.org no Windows
- **Python 3** (para pontuar ganchos de reel e montar o arquivo de virais)

## 4. O que vem dentro

| Área | Skills |
|---|---|
| Central | `central-marketing` (com o treino da marca) |
| Pesquisa de trends | `instagram-research`, `tiktok-research`, `x-research`, `youtube-research`, `video-content-analyzer`, `content-planner` |
| Instagram | `ig-reel`, `ig-caption`, `ig-carousel`, `ig-story`, `ig-profile`, `ig-plan`, `ig-viral`, `ig-audit`, `ig-repurpose`, `ig-comment`, `ig-reply`, `ig-dm`, `ig-human` |
| Vídeo | `reel-video`: reel em MP4 sem gravar nada (conversa → QR Code → seu site sendo tocado → reação → final com a marca) |
| Pinterest | `pinterest` |
| Concorrentes | `engenharia-reversa`: o que funciona para os concorrentes no Instagram e no site, comparado com o seu produto, com o que fazer |
| Achar clientes | `prospeccao`: empresas do seu perfil ideal com nota e mensagem pronta (B2B), e onde estão e o que pedem os clientes finais (B2C) |
| Rotina de conteúdo | `pipeline-conteudo` |
| Estratégia e conversão | `marketing-council`, `copywriting`, `cro`, `ab-testing`, `marketing-psychology` |

Geradores que vêm junto (na skill `central-marketing`): carrossel e meme
1080x1350, pins 1000x1500 e leitura das cores de uma imagem. Na skill
`reel-video`: o projeto de vídeo completo.

## 5. Instalar à parte (opcional)

### Skills de outros autores

Não podem vir embutidas. A central-marketing reconhece cada uma quando está
instalada e avisa quando um pedido precisa de alguma que falta.

| Para quê | Skills | Como instalar |
|---|---|---|
| SEO e IA: auditoria do site, Search Console, aparecer no ChatGPT | `seo`, `seo-*` (claude-seo) | `/plugin marketplace add AgriciDaniel/claude-seo` e depois `/plugin install claude-seo` |
| Achar pessoas e contatos (influenciadores, parceiros) e e-mail | `people-search`, `lessie-email` (Lessie) | `npx skills add LessieAI/lessie-skill -y -g` e `npm install -g @lessie/cli`; precisa de conta no lessie.ai |
| Ajuda avançada com Remotion (efeitos, legendas, mapas) | `remotion-*` | `npx skills add remotion-dev/skills` |
| Pesquisa com usuários, personas e jornada | `ux-researcher-designer` | `npx skills add oabdelmaksoud/agention --skill ux-researcher-designer` |

### Conectores (no claude.ai → Configurações → Conectores)

| Conector | Para quê | Sem ele |
|---|---|---|
| **vidIQ** | Achar os virais do seu ramo no Instagram e no TikTok (a `ig-viral` usa); ver os números das suas contas do Instagram; publicar um reel aprovado por você | Mande prints dos números; a pesquisa de virais pode usar o Apify (abaixo) |
| **Canva** | Gerar imagens e memes com o seu mascote | Use o slide `meme` do gerador de carrossel |

### Chaves (nas variáveis de ambiente, nunca no chat)

| Chave | Para quê |
|---|---|
| `GOOGLE_MAPS_API_KEY` | opcional: `prospeccao` buscar negócios locais pela API oficial do Google Places |
| `APIFY_TOKEN` | `instagram-research`, `tiktok-research`, `x-research` (apify.com) |
| `GEMINI_API_KEY` | `video-content-analyzer` (Google AI Studio) |
| `TUBELAB_API_KEY` | `youtube-research` (tubelab.net) |

### Rotina automática

A `pipeline-conteudo` roda quando você pede. Para rodar sozinha (por exemplo,
domingo, terça e quinta às 18h), crie uma tarefa agendada no Claude Code com
o pedido "rode a skill pipeline-conteudo". Ela só prepara o conteúdo: quem
publica é você.

## 6. Regras que valem para tudo

- Nada é publicado, enviado ou mudado no site sem o seu "sim".
- Só fatos: nada de métricas, depoimentos ou avaliações inventados.
- Comentar, seguir e mandar DM é sempre com você, nunca automático.
- Chaves e senhas nunca vão no chat.
- Prospecção só com dados públicos: listas de empresas com contato comercial;
  de clientes finais, só o link do post público, nunca dados pessoais. As
  listas ficam em `prospeccao/`, fora do Git.

## 7. Créditos e licenças

- O código e os textos próprios deste plugin são MIT (veja `LICENSE`).
- Várias skills vêm de outros autores, também com licença MIT, e foram
  adaptadas: veja `THIRD_PARTY.md`.
- **Remotion:** o projeto de vídeo da `reel-video` usa o
  [Remotion](https://www.remotion.dev), que tem licença própria. Ele é grátis
  para pessoas e empresas com até 3 funcionários. Empresas maiores precisam
  da licença de empresa (veja remotion.dev/license).
