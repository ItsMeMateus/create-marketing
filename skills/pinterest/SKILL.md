---
name: pinterest
description: >-
  Pinterest da sua marca: cria pins 1000x1500 (frases tiradas do seu blog ou
  print real do produto, com a marca e o mascote), escreve título, descrição,
  pasta e link com UTM de cada pin, planeja as pastas e o calendário sazonal e
  lê os resultados que o usuário mandar. Use quando pedirem "pins",
  "Pinterest", "posts pro Pinterest", "pastas do Pinterest", "o que postar no
  Pinterest", ou quando a rotina de conteúdo chegar ao passo dos pins.
---

# Pinterest

Faz parte da `central-marketing`: siga as regras dela (nada é publicado pelo
Claude; só fatos de `.agents/product-marketing.md`). Quem posta é o usuário,
pelo app ou pelo agendador do Pinterest.

## Por que o Pinterest
O Pinterest funciona como um buscador de ideias: um pin bom traz visitas por
meses. Funciona melhor para assuntos que as pessoas planejam (presentes,
datas, receitas, decoração, frases, roteiros). Os pins devem apontar para
páginas e artigos do seu site.

## Contas e pastas
- Conta **comercial** (grátis) com o site reivindicado (Configurações → Contas
  reivindicadas).
- 3 a 6 pastas com nomes que as pessoas buscam (ex.: "Cute Love Notes", não
  "Nossa marca"). Anote as pastas em `.claude/instagram/voice.md`, na seção
  da marca.

## Como criar os pins
1. **Origem.** Todo pin aponta para uma página que já existe no site (artigo
   ou página de venda). Não repita o mesmo pin em 30 dias
   (`.claude/instagram/log.md`).
2. **Layout.**
   - `notes`: 4 a 6 frases **tiradas da página de origem**, sem inventar.
   - `image`: print real do produto (celular, tela) com título.
3. **Spec** em `marketing/pins/specs/AAAA-MM-DD-<marca>.json`. Cada pin:
   `out`, `brand` (id em `.agents/brand.json`), `layout`, `kicker`, `title`,
   `notes` ou `image`/`caption`, `cta` e o bloco `pinterest`:
   - `board`: uma das pastas;
   - `title`: até 100 caracteres, com a busca principal **no começo**;
   - `description`: 2 frases naturais com 2 ou 3 buscas relacionadas, sem
     hashtags, sem promessa que o produto não cumpre;
   - `link`: a página de origem com
     `?utm_source=pinterest&utm_medium=pin&utm_campaign=<slug>`.
4. **Gere as imagens** (na raiz do projeto):
   `NODE_PATH=$(npm root -g) node <pasta da skill central-marketing>/scripts/pin.cjs marketing/pins/specs/<arquivo>.json`
   A marca (cor, logo, mascote, site) vem de `.agents/brand.json`.
5. **Confira** cada imagem: texto inteiro, nada cortado, rodapé com o site.
   Se o pin promete um número ("70 ideias"), ele tem que existir na página.

## Calendário
Use as datas fortes do ramo em `.claude/instagram/niche.md`.
O Pinterest é buscado com cerca de 45 dias de antecedência. Comece os pins de
cada data importante do seu público 6 semanas antes (Natal, Dia das Mães, Dia
dos Namorados, volta às aulas, Black Friday...).

## Quantidade e horário
- 1 a 3 pins por dia, uma pasta diferente por pin.
- Melhor entre 20h e 23h no fuso do público. Pode agendar pelo próprio
  Pinterest.

## Entrega
Mande as imagens e, para cada pin, blocos de copiar com título, descrição,
link, pasta e horário. Registre em `.claude/instagram/log.md` e faça commit só
dos specs (as imagens ficam fora do Git).

## Resultados
Não há conexão do Pinterest com o Claude. A cada 2 semanas, peça um print de
**Análises → Visão geral** e dos 5 pins com mais cliques. Mais pins no
formato e no assunto que trazem cliques.

## Regras
- Nunca publicar, comentar ou seguir pela conta do usuário.
- Só frases e fatos que estão no site ou em `.agents/product-marketing.md`.
- Não copiar pins de outros perfis (adapte o assunto, nunca a arte ou o texto).
