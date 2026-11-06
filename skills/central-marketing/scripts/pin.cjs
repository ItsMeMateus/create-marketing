// Pins do Pinterest (1000x1500, PNG) a partir de um JSON.
// Uso (na raiz do projeto): NODE_PATH=$(npm root -g) node <pasta-da-skill>/scripts/pin.cjs <spec.json>
// Spec: { "out_dir": "marketing/pins/out", "pins": [ {
//   "out": "nome.png", "brand": "<id em .agents/brand.json>", "layout": "notes" | "image",
//   "kicker": "texto pequeno", "title": "título grande", "titleSize": 84,
//   "notes": ["frase 1", ...],                 (layout notes: 4 a 6 frases tiradas do seu conteúdo)
//   "image": "caminho/print.png", "caption": "" (layout image: print real do produto num celular)
//   "cta": "texto do rodapé",
//   "pinterest": { "board", "title", "description", "link" } } ] }
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { brand, dataUri, ROOT } = require('./brand.cjs');
const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const COLORS = ['#fff3b0', '#ffd6e0', '#d7f2ff', '#e2f7d4', '#ffe4c7', '#eadcff'];

function html(pin) {
  const b = brand(pin.brand);
  const mascot = dataUri(b.mascot), logo = dataUri(b.logo);
  let body = '';
  if ((pin.layout || 'notes') === 'notes') {
    body = '<div class="notes">' + (pin.notes || []).map((n, i) =>
      `<div class="note" style="background:${COLORS[i % COLORS.length]};transform:rotate(${[-2.5, 2, -1.5, 2.5, -2, 1.5][i % 6]}deg)">${esc(n)}</div>`).join('') + '</div>';
  } else {
    body = `<div class="shot"><div class="phone"><img src="${dataUri(pin.image)}"></div>${mascot ? `<img class="mascot" src="${mascot}">` : ''}</div>
      ${pin.caption ? `<p class="cap">${esc(pin.caption)}</p>` : ''}`;
  }
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0}
  body{width:1000px;height:1500px;font-family:Inter,Arial,sans-serif;background:linear-gradient(180deg,${b.background} 0%,${b.color}22 100%);
    color:#1e1b2e;display:flex;flex-direction:column;align-items:center;padding:80px 70px 60px;overflow:hidden}
  .kicker{font-size:34px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:${b.color}}
  h1{font-size:${pin.titleSize || 84}px;line-height:1.05;font-weight:900;text-align:center;margin-top:18px;letter-spacing:-1.5px}
  .notes{flex:1;width:100%;display:flex;flex-direction:column;justify-content:center;gap:30px;padding:30px 10px}
  .note{font-size:40px;line-height:1.3;font-weight:600;padding:30px 38px;border-radius:10px;box-shadow:0 10px 24px rgba(30,27,46,.12)}
  .shot{flex:1;display:flex;align-items:center;justify-content:center;position:relative;width:100%}
  .phone{width:470px;height:836px;border-radius:56px;border:14px solid #1e1b2e;overflow:hidden;box-shadow:0 30px 60px rgba(30,27,46,.25);background:#000}
  .phone img{width:100%;height:100%;object-fit:cover;object-position:top}
  .mascot{position:absolute;width:250px;right:40px;bottom:40px}
  .cap{font-size:40px;font-weight:600;text-align:center;margin:0 0 20px;color:#4a4458}
  .foot{display:flex;align-items:center;gap:26px;background:#fff;border-radius:999px;padding:16px 40px 16px 18px;box-shadow:0 10px 30px ${b.color}33}
  .foot img{height:96px}
  .foot b{display:block;font-size:36px;color:${b.color}}
  .foot span{font-size:30px;color:#4a4458;font-weight:600}
  </style></head><body>
  ${pin.kicker ? `<div class="kicker">${esc(pin.kicker)}</div>` : ''}
  <h1>${esc(pin.title)}</h1>
  ${body}
  <div class="foot">${logo ? `<img src="${logo}">` : ''}<div><b>${esc(pin.cta || b.cta)}</b><span>${esc(b.site)}</span></div></div>
  </body></html>`;
}

(async () => {
  const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const outDir = path.join(ROOT, spec.out_dir || 'marketing/pins/out'); fs.mkdirSync(outDir, { recursive: true });
  const br = await chromium.launch();
  const p = await br.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 1 });
  for (const pin of spec.pins) {
    await p.setContent(html(pin), { waitUntil: 'load' });
    if (await p.evaluate(() => document.body.scrollHeight > 1500)) console.warn('texto passou do tamanho do pin:', pin.out);
    await p.screenshot({ path: path.join(outDir, pin.out) });
    console.log('ok', path.relative(ROOT, path.join(outDir, pin.out)));
  }
  await br.close();
})();
