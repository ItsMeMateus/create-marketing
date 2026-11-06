---
name: reel-video
description: >-
  Gera reels em MP4 (1080x1920) para Instagram e TikTok sem gravar nada: uma
  conversa de celular com as mensagens chegando, um QR Code com a cor e o
  mascote da marca, a gravação real do seu site ou produto sendo tocado, a
  reação na conversa e o final com a marca. Também faz o formato de cartões de
  texto sobre a gravação. Use quando pedirem "faz o vídeo", "gera o reel em
  MP4", "reel de gravação de tela", "vídeo do produto", ou quando a rotina de
  conteúdo chegar ao passo do reel e o produto tiver uma página web.
---

# Reels em vídeo (conversa → QR → produto → reação)

Faz parte da `central-marketing`: siga as regras dela. Os vídeos vêm sem
música (ela entra pelo app, com licença) e quem posta é o usuário.

## Primeira vez no projeto
1. Copie a pasta `project/` desta skill para `marketing/video/` do projeto do
   usuário (se ainda não existir) e rode, dentro dela, `npm install`.
2. Precisa de Node.js 18+, ffmpeg e do Chromium do Playwright
   (`npm install -g playwright` e `npx playwright install chromium`).
3. A marca vem de `.agents/brand.json` (cor, site, mascote, chamada `cta` e
   linha de baixo `sub`). Se não existir, faça antes o treino da marca da
   `central-marketing`.

## Como fazer um reel
1. **Roteiro do gancho e da história:** `ig-reel` (gancho pontuado com
   `hookscore.py`, acima de 70, no formato "POV:", até 2 linhas).
2. **Gravar o produto** com toques de verdade. Escreva
   `marketing/video/reels/captura-<nome>.json` (modelo:
   `reels/exemplo-captura.json`):
   - `url`: a página que vai aparecer (página pública, demonstração ou
     exemplo; nunca dados de cliente real);
   - `seconds`: 15 a 25 para dar tempo de explorar com calma;
   - `hide`: seletores CSS para esconder (banner de cookies, avisos);
   - `steps`: `tap` (seletor), `tapText` (texto exato do botão),
     `scrollTo` (seletor, `dur`, `offset`), `scrollBy` (`y`, `dur`), `key`.
   Abra a página antes e confira os seletores. Rode, dentro de
   `marketing/video`:
   `NODE_PATH=$(npm root -g) node capture-story.cjs reels/captura-<nome>.json public/<nome>.mp4`
3. **Roteiro do vídeo** em `marketing/video/reels/AAAA-MM-DD-<marca>-<slug>.json`
   (modelo: `reels/exemplo-story.json`):
   - `brand`: id em `.agents/brand.json`;
   - `hook`: o gancho "POV:" (fica no topo durante a conversa);
   - `contact`, `statusTime` e `msgs` (`at` em segundos, `from: "me"` para
     quem manda, `time` do balão), coerentes com a história;
   - `qrUrl`: para onde o QR aponta (o site da marca, se omitido);
     `qrFrom: "me"` se for quem manda;
   - `qrAt`, `zoomAt` (zoom com flash) e `cardAt` (entra a gravação);
   - `cardVideo`: o arquivo gravado no passo 2;
   - `reply`: a volta para a conversa com a reação (`at` = `cardAt` + duração
     da gravação);
   - `duration`: `reply.at` + uns 4,5 s da reação + 3,2 s do final;
   - opcional `lock` para a tela de bloqueio virando meia-noite (formato
     "Imagine receber isso às 00:00");
   - `trend`: a fórmula e o post de referência.
4. **Render:** `node render.mjs reels/<arquivo>.json` → `out/<arquivo>.mp4`.
   Em máquina com pouca memória, `RENDER_CONCURRENCY=1`.
5. **Confira 6 quadros** com o ffmpeg (`ffmpeg -ss <segundo> -i out/x.mp4
   -frames:v 1 quadro.png`): gancho legível, conversa sem cortar, QR inteiro,
   toques no lugar, final com a marca.

## Outro formato: cartões de texto sobre a gravação
`"composition": "Reel"` com `video` (gravação em `public/`), `beats`
(`[{ "t": 0, "dur": 2.5, "text": "até 6 palavras" }]`) e `mascotAt`
(`[{ "t": 8, "dur": 3 }]`). Bom para variar.

## Criatividade
Cada reel conta uma mini-história diferente, montada a partir de 1 ou 2
trends do `swipe.md`: quem manda, o que diz, a hora, o motivo. Não repita a
mesma história nem a mesma página gravada em 14 dias.

## Regras
- Sem música no arquivo: sugira uma música em alta para colocar pelo app.
- O texto do final não promete o que o produto não faz ("grátis" só com o
  que é grátis de verdade).
- Nada de dados reais de clientes na gravação.
