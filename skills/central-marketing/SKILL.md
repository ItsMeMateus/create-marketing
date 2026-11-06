---
name: central-marketing
description: >-
  Skill mãe de marketing. Entende o pedido, escolhe a skill certa (ou uma
  sequência de skills) e aplica as regras da sua marca em tudo: pesquisa de
  conteúdo (Instagram, TikTok, X, YouTube, análise de vídeo, plano de
  conteúdo), criação para Instagram (reels, legendas, carrosséis, stories,
  perfil, plano da semana, DMs, comentários), Pinterest (pins, pastas,
  calendário), prospecção de clientes (B2B e clientes finais), SEO e IA (com
  o plugin claude-seo), textos de venda, conversão
  de páginas, testes A/B, psicologia de compra e um conselho de marketing.
  Use quando o usuário pedir "central de marketing", "skill mãe", "qual skill
  usar", "me ajuda com marketing", "plano de marketing", ou quando o pedido de
  marketing não deixar claro qual skill chamar.
---

# Central de Marketing (skill mãe)

Esta skill não faz o trabalho sozinha: ela entende o pedido, escolhe a skill
certa (ou uma sequência de skills) e aplica as regras da marca em tudo.

## Antes de qualquer coisa
1. **Contexto da marca.** Leia `.agents/product-marketing.md`,
   `.claude/instagram/voice.md`, `.claude/instagram/niche.md` e
   `.agents/brand.json` do projeto. Use só os fatos de lá.
   - **Primeira vez (os arquivos não existem), ou o usuário pede "treinar",
     "configurar a minha marca" ou "mudar de ramo":** faça o **treino da
     marca** (seção abaixo) antes de qualquer outra coisa.
2. **Mais de uma marca?** O `product-marketing.md` pode listar várias (por
   exemplo, uma por país ou idioma). Descubra de qual é o pedido; na dúvida,
   pergunte.
3. Responda no idioma do usuário, curto, começando pelo resultado.

## Treino da marca (imagem + ramo)
O usuário "ensina" a marca mostrando imagens e dizendo o ramo. Em poucos
minutos, todas as skills passam a escrever e criar no jeito dele.

1. **Peça, em uma mensagem só:**
   - **1 a 3 imagens:** o logo, um print do site ou do perfil do Instagram, e
     um post que ele gosta (dele ou de referência);
   - **o ramo** (ex.: "doceria artesanal", "estúdio de pilates", "loja de
     roupa infantil", "SaaS de agendamento") e a cidade/país, se o público
     for local;
   - **o site e o @** do Instagram, se houver.
2. **Leia as imagens.** Olhe cada uma e anote: cores, estilo (minimalista,
   colorido, fofo, sério), fontes aparentes, se tem mascote ou rosto, o tom
   dos textos que aparecem. Para as cores exatas, salve as imagens no projeto
   (ex.: `.agents/brand/`) e rode
   `NODE_PATH=$(npm root -g) node <pasta desta skill>/scripts/palette.cjs <imagens>`.
   A cor que mais aparece no logo (que não seja fundo) costuma ser a
   principal.
3. **Pesquise o ramo.** Com a `ig-viral` (ou uma busca de virais conectada),
   veja o que está funcionando no ramo nos últimos 30 dias, no país do
   público. Anote 3 a 5 formatos que se repetem e 5 a 10 perfis de
   referência (só públicos).
4. **Monte os arquivos** a partir dos modelos em `templates/` desta skill:
   - `.agents/product-marketing.md`: produto, público, preços, números
     públicos, concorrentes e regras;
   - `.claude/instagram/voice.md`: tom, palavras que usa e que não usa,
     emoji, formato dos vídeos, posições da marca;
   - `.claude/instagram/niche.md` (modelo `templates/niche.md`): ramo, termos
     de busca para virais (no idioma do público), formatos que funcionam,
     perfis de referência, datas fortes do ramo e o que evitar;
   - `.agents/brand.json`: nome, site, cor principal e de fundo (da paleta),
     caminho do logo e do mascote (se houver), idioma e chamada padrão.
   O que vier das imagens e da pesquisa, preencha; o que só o usuário sabe
   (preços, números, o que é grátis, garantia), **pergunte**. Não invente:
   deixe `[PREENCHER]`.
5. **Mostre um resumo** de uma tela (cores, tom, 3 formatos, 3 datas fortes)
   e uma amostra: 3 ganchos de reel pontuados com `hookscore.py` e 1 legenda.
   Pergunte se está no jeito dele e ajuste.
6. **Re-treinar:** quando o usuário mandar imagens novas ou mudar de ramo,
   refaça só o que mudou e diga o que foi atualizado.

## Qual skill usar

### Pesquisa de conteúdo e redes sociais
| Pedido | Skill |
|---|---|
| O que está bombando no Instagram, reels virais, trends | `instagram-research` |
| O mesmo no TikTok | `tiktok-research` |
| O mesmo no X/Twitter | `x-research` |
| Vídeos que estão performando no YouTube | `youtube-research` |
| Por que um vídeo viralizou, ganchos, estrutura | `video-content-analyzer` |
| Plano de conteúdo juntando todas as redes | `content-planner` |

Precisam das chaves `APIFY_TOKEN` (Instagram, TikTok, X), `GEMINI_API_KEY`
(vídeo) e `TUBELAB_API_KEY` (YouTube) nas configurações do ambiente. Sem elas,
use a `ig-viral` com uma ferramenta de busca de virais conectada (por exemplo,
o conector do vidIQ) e diga isso ao usuário.

### Criação para Instagram (ig-*)
Todas leem `.claude/instagram/voice.md` e nunca publicam nada sozinhas.

| Pedido | Skill |
|---|---|
| Roteiro de reel: gancho, texto na tela, tempo de cada cena | `ig-reel` |
| Legenda (o que aparece antes do "... mais"), hashtags | `ig-caption` |
| Carrossel com os slides 1080x1350 | `ig-carousel` |
| Sequência de stories do dia, figurinhas | `ig-story` |
| Nota do perfil (0 a 100) e bio reescrita | `ig-profile` |
| Plano da semana e contas para interagir | `ig-plan` |
| Achar reels virais do nicho e montar o arquivo de referências | `ig-viral` |
| Analisar o que já foi postado | `ig-audit` |
| Transformar um artigo ou vídeo em vários posts | `ig-repurpose` |
| Comentários em posts de outros perfis | `ig-comment` |
| Responder comentários dos seus posts | `ig-reply` |
| DMs: parceria, influenciador, follow-up | `ig-dm` |
| Tirar cara de texto de IA (travessão, clichês) | `ig-human` |

O `ig-reel` pontua ganchos em inglês e português (`hookscore.py`). O
`ig-human` foi calibrado em inglês: em português, use o resultado só como
alerta de travessão e clichê, e revise o texto com `copywriting`.

Para gerar as imagens dos slides e memes com a marca, há o script
`scripts/carousel.cjs` desta skill (ver "Imagens prontas" abaixo).

### Vídeo
| Pedido | Skill |
|---|---|
| Reel em MP4 sem gravar nada: conversa → QR Code → produto → reação | `reel-video` |

### Pinterest
| Pedido | Skill |
|---|---|
| Pins (imagem, título, descrição, pasta, link), pastas, calendário sazonal | `pinterest` |

### Rotina de conteúdo
| Pedido | Skill |
|---|---|
| "Gera o conteúdo da semana", pacote de posts, rotina automática | `pipeline-conteudo` |

### SEO e IA (plugin claude-seo, instalado à parte)
Auditoria do site, página, técnico, conteúdo, schema, sitemap, hreflang,
backlinks, aparecer no ChatGPT e no Perplexity (GEO), llms.txt, Search
Console. Use o hub `seo` ou a skill `seo-*` específica.

**Se as skills `seo-*` não estiverem disponíveis**, diga ao usuário para
instalar o claude-seo (é de outro autor, licença MIT):
```
/plugin marketplace add AgriciDaniel/claude-seo
/plugin install claude-seo
```

### Achar clientes
| Pedido | Skill |
|---|---|
| Lista de empresas do perfil ideal, nota de encaixe, primeira mensagem e follow-ups (B2B) | `prospeccao` (modo B2B) |
| Onde está o meu público, quem está pedindo o que eu vendo agora (clientes finais) | `prospeccao` (modo B2C) |

### Instaladas à parte (use se estiverem disponíveis)
| Pedido | Skill | Se não estiver instalada |
|---|---|---|
| Achar influenciadores, parceiros, contatos de empresas | `people-search` | `npx skills add LessieAI/lessie-skill -y -g` |
| Enviar ou organizar e-mails e campanhas (só com o "sim" do usuário) | `lessie-email` | idem |
| Ajuda avançada com Remotion (efeitos, legendas, mapas) | `remotion-*` | `npx skills add remotion-dev/skills` |
| Personas, jornada, teste de usabilidade | `ux-researcher-designer` | `npx skills add oabdelmaksoud/agention --skill ux-researcher-designer` |

Se o pedido precisar de uma delas e ela não estiver instalada, diga ao
usuário qual é e o comando; não finja o resultado.

### Estratégia, textos e conversão
| Pedido | Skill |
|---|---|
| Várias opiniões, "o que o Hormozi/Ogilvy faria", debate de uma decisão | `marketing-council` |
| Textos de venda: home, landing page, chamada, botão | `copywriting` |
| Melhorar a conversão de uma página ou formulário | `cro` |
| Planejar um teste A/B | `ab-testing` |
| Vieses e psicologia de compra | `marketing-psychology` |

## Imagens prontas (scripts desta skill)
Precisam de Node.js e do Playwright (`npm install -g playwright` e
`npx playwright install chromium`, uma vez).
- `scripts/carousel.cjs <spec.json>`: slides de carrossel e memes 1080x1350.
- `scripts/pin.cjs <spec.json>`: pins do Pinterest 1000x1500.

Os dois leem a marca de `.agents/brand.json` no projeto (modelo em
`templates/brand.json`): nome, site, cor, logo e mascote. Os scripts ficam na
pasta `scripts/` desta skill; rode a partir da raiz do projeto, passando o
caminho completo do script.

## Fluxos prontos
- **Post ou meme de trend:** `ig-viral` (ou `instagram-research`) → escolher o
  formato → imagem → legenda com `ig-caption`.
- **Reel:** `ig-reel` (gancho pontuado + roteiro + tempo) → `ig-caption` →
  o usuário grava e posta → `ig-audit` depois de uma semana.
- **Semana no Instagram:** `ig-plan` → `ig-reel` / `ig-carousel` /
  `ig-story` para cada dia → `ig-caption`.
- **Artigo novo do blog:** `ig-repurpose` para virar reels e carrosséis, e
  `pinterest` para virar 2 ou 3 pins.
- **Decisão difícil** (preço, promoção, posicionamento): `marketing-council`
  → executar com a skill específica.

## Regras (valem para todas as skills acima)
1. **Nada sai sem aprovação.** Nenhum e-mail, post, publicação ou mudança no
   site em produção sem o "sim" explícito do usuário, para aquela ação. As
   skills escrevem; quem publica é o usuário.
2. **Só fatos.** Não invente métricas, depoimentos, avaliações, backlinks ou
   recursos. Números públicos só os do `product-marketing.md`; se precisar de
   um número novo, peça ao usuário para conferir.
3. **"Grátis" com cuidado.** Se só uma parte do produto é grátis (teste,
   prévia), diga qual parte. Nunca prometa "grátis" sozinho.
4. **Não compre backlinks** e não use táticas de spam.
5. **Não copie concorrentes nem posts virais:** use a fórmula, nunca o vídeo,
   a frase ou a arte.
6. **Dados de terceiros** (leads, influenciadores) não vão para o Git.
7. **Nunca peça chaves ou senhas no chat.** Elas vão nas configurações do
   ambiente ou em variáveis de ambiente.
8. **Nada de automação na conta de outra pessoa:** comentar, seguir e mandar
   DM é sempre manual, feito pelo usuário.
