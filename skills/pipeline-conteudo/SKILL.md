---
name: pipeline-conteudo
description: >-
  Rotina de conteúdo para Instagram, TikTok e Pinterest: pesquisa as trends da
  semana, escolhe os formatos, escreve os reels (gancho pontuado, roteiro e
  tempo de cada cena), cria imagens/memes, carrosséis e pins com a marca,
  escreve as legendas, entrega tudo ao usuário e registra no histórico. Use
  quando pedirem "gera o conteúdo da semana", "pacote de posts", "roda o
  pipeline", ou quando um agendamento disparar a rodada.
---

# Rotina de conteúdo (Instagram, TikTok e Pinterest)

Faz parte da `central-marketing`: siga as regras dela (nada é publicado pelo
Claude; só fatos de `.agents/product-marketing.md`).

## Agenda sugerida
Três rodadas por semana, cada uma cobrindo os 2 ou 3 dias seguintes:

| Rodada | Conteúdo para |
|---|---|
| Domingo | segunda e terça |
| Terça | quarta e quinta |
| Quinta | sexta, sábado e domingo |

Para automatizar, o usuário pode criar uma tarefa agendada no Claude Code
(por exemplo, `/schedule`) com o pedido "rode a skill pipeline-conteudo".

## Por rodada, por marca
- **1 reel** (15 a 30 s) que serve para Instagram Reels e TikTok
- **1 imagem** (meme de trend ou post de oferta) para o feed
- **2 ou 3 pins** do Pinterest (skill `pinterest`)
- **Legendas** separadas para Instagram, TikTok e Pinterest
- Na rodada de quinta, também **1 carrossel**

## Passo a passo
1. **Contexto.** Leia `.agents/product-marketing.md` (preços e promoções do
   dia), `.claude/instagram/voice.md`, `.claude/instagram/log.md` e
   `.claude/instagram/plan.md`. Não repita gancho, tema ou meme dos últimos
   14 dias.
2. **Virais do nicho (obrigatório, com a `ig-viral`).** Use os termos de busca,
   o país e os perfis de referência de `.claude/instagram/niche.md`. Na 1ª rodada do mês,
   pesquisa completa dos últimos 30 dias por país do público; nas outras, uma
   busca rápida dos últimos 14 dias. Atualize `.claude/instagram/swipe.md`.
   Nunca raspe o Instagram nem faça login pelo usuário: use uma ferramenta de
   busca conectada (vidIQ, Apify). Copie a fórmula, nunca o vídeo ou a frase.
   Escolha uma fórmula do topo do `swipe.md` que não foi usada nos últimos 14
   dias.
3. **Reel.** `ig-reel` com a fórmula escolhida: 3 ganchos pontuados com
   `hookscore.py` (use só o que passar de 70), roteiro e `beats.py` sem
   alertas. Gancho no formato "POV:", no topo da tela, até 2 linhas.
   Se o projeto tiver um gerador de vídeo próprio, use-o; senão, entregue o
   roteiro cena a cena para o usuário gravar (tela do produto, texto na tela,
   música em alta pelo app).
4. **Imagem.** Um gerador de imagem conectado (ex.: Canva) com o mascote da
   marca, ou o slide `meme` do `scripts/carousel.cjs` da central-marketing.
   Confira o texto da imagem.
5. **Pins.** Skill `pinterest`.
6. **Carrossel (quinta).** `ig-carousel` para o texto e
   `scripts/carousel.cjs` da central-marketing para os slides.
7. **Legendas.** `ig-caption` para o Instagram (primeira linha forte, uma
   chamada, 3 a 5 hashtags). TikTok: até 150 caracteres, 3 a 5 hashtags.
   Revise com `copywriting`.
8. **Entrega.** Arquivos e uma mensagem curta com: o que é cada peça e de qual
   trend saiu (com o link do post de referência), dia e horário sugerido no
   fuso do público (Instagram 12h ou 19h–21h; TikTok 19h–22h), as legendas em
   blocos para copiar, a música em alta sugerida e 8 a 10 contas do nicho para
   o usuário interagir (só perfis públicos, com comentário sugerido pela
   `ig-comment`).
9. **Registro.** Acrescente em `.claude/instagram/log.md` (data, marca, peça,
   gancho, fórmula, status "aguardando aprovação") e atualize
   `.claude/instagram/plan.md`. Faça commit só dos arquivos de texto.

## Regras
- Nunca publique, comente, siga ou mande DM. Quem posta é o usuário.
- Sem música com direitos autorais no arquivo: ela entra pelo app.
- "Grátis" só quando for verdade, e dizendo o que é grátis.
- Se uma etapa falhar (rede, créditos de imagem, render), entregue o que deu
  certo e diga o que faltou; não invente arquivo nem resultado.
