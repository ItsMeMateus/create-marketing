---
name: engenharia-reversa
description: >-
  Engenharia reversa de concorrentes: acha quem vende o mesmo que você (Instagram, TikTok e site), mede o que funciona para
  cada um (reels que passaram da média da conta, ganchos, frequência,
  legendas, chamadas), levanta o produto (temas, recursos novos, preços) e
  compara com o nosso, entregando uma tabela "eles têm / nós temos / o que
  fazer" e as fórmulas para o pipeline. Use quando o usuário pedir "analisa o
  concorrente", "engenharia reversa", "o que o concorrente X está fazendo",
  "novidade de concorrente", "por que o vídeo deles bombou", ou mandar print
  de post de concorrente.
---

# Engenharia reversa de concorrentes

Faz parte da `central-marketing`: siga as regras dela. Leia antes
`.agents/product-marketing.md` (lista de concorrentes) e
`.claude/instagram/niche.md` (ramo e país) e o último
`docs/marketing/concorrentes-instagram-*.md`, para não refazer o que já foi
levantado.

## 1. Quem analisar
- Os que o usuário citou ou mandou print.
- Os da lista em `product-marketing.md`.
- Descoberta: `vidiq_ig_accounts_from_outliers` com o ramo de
  `.claude/instagram/niche.md` e o público do país da marca.
- Só perfis públicos. Se o @ não for encontrado, diga e peça ao usuário; não
  chute vários @ (cada consulta gasta créditos do vidIQ).

## 2. Conteúdo (para cada concorrente)
1. `vidiq_ig_profile`: seguidores, posts, bio, link.
2. `vidiq_ig_profile_reels`: os 12 últimos reels.
3. Para cada conta, anote:
   - os reels que passaram muito da média da própria conta (o múltiplo, ex.:
     "17 mi contra 2 mil de média");
   - o gancho na tela e a fórmula (ex.: "POV + QR Code na conversa",
     "segredo: fiquei acordado fazendo isso", "revelação do presente atrás
     das costas");
   - a frequência (reels por dia ou por semana);
   - as palavras de busca nas legendas (ex.: "presente de natal para
     namorada") e a chamada ("comenta EU QUERO", "link na bio");
   - o produto que cada reel vende.
4. Se um vídeo for decisivo, assista com `vidiq_watch_shortform_content` para
   tirar a estrutura (cenas e tempo). Use só quando valer o crédito.
5. Para virais do nicho sem conta definida: `ig-viral` ou
   `vidiq_instagram_tiktok_outlier_search`.

## 3. Produto
- O que o print ou o post mostra (tema novo, cores, recurso).
- Site e preços: busca na web e a página do concorrente, se abrir. Se não
  abrir, use os prints do usuário e escreva "conferir no site".
- Compare com o seu produto **de verdade**, não de memória: se o projeto
  tiver o código do site, procure nele se o recurso já existe; se não,
  pergunte ao usuário ou confira o site.

## 4. Entrega
1. Arquivo `docs/marketing/concorrentes-instagram-AAAA-MM-DD.md` com:
   - um bloco por concorrente (tamanho, produtos, o que deu certo, o que
     fazem agora);
   - a seção "O que isso diz para nós".
2. Tabela curta para o usuário: **eles têm / nós temos / o que fazer**, com a
   prioridade.
3. Fórmulas novas para o `swipe.md` (da `ig-viral`) (só a fórmula, com o múltiplo e o link
   de referência).
4. Atualize a linha de concorrentes em `product-marketing.md`.
5. Pergunte antes de colocar algo no plano de conteúdo ou de mudar o site.

## Regras
- Só dados públicos. Nada de login, raspagem ou conta falsa.
- Copie a **fórmula**, nunca o vídeo, o texto, o nome, o desenho ou a arte.
  Recursos parecidos ganham nomes e visual nossos.
- Não invente números: o que o concorrente diz sobre si ("+200 mil clientes")
  vai como "eles dizem".
- Não comente nem siga perfis de concorrentes pela conta do usuário.
