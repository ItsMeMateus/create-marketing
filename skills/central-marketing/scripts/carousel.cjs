// Slides de carrossel e memes do Instagram (1080x1350, PNG) a partir de um JSON.
// Uso (na raiz do projeto): NODE_PATH=$(npm root -g) node <pasta-da-skill>/scripts/carousel.cjs <spec.json>
// Spec: { "out_dir": "marketing/carousel/out", "sets": [{ "name", "brand", "slides": [...] }] }
// Slides:
//   { "type": "cover", "kicker", "title", "sub" }              capa (com o mascote, se houver)
//   { "type": "tip", "n": 1, "title", "text" }                 um item da lista
//   { "type": "image", "image": "caminho.png", "title", "text" } print real do produto num celular
//   { "type": "cta", "title", "text", "button" }               último slide
//   { "type": "meme", "top", "bottom", "image" }               meme de uma imagem só
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { brand, dataUri, ROOT } = require('./brand.cjs');
const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');

function slideHtml(s, b, i, total) {
  const mascot = dataUri(b.mascot), logo = dataUri(b.logo);
  const dots = total > 1 ? `<div class="dots">${Array.from({ length: total }, (_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>` : '';
  const foot = `<div class="foot">${logo ? `<img src="${logo}">` : ''}<span>${esc(b.site)}</span></div>`;
  let body = '';
  if (s.type === 'cover') {
    body = `<div class="k">${esc(s.kicker)}</div><h1 class="big">${esc(s.title)}</h1>${s.sub ? `<p class="sub">${esc(s.sub)}</p>` : ''}
      ${mascot ? `<img class="mascot-c" src="${mascot}">` : ''}<div class="swipe">${b.lang === 'en' ? 'Swipe' : 'Arrasta'} →</div>`;
  } else if (s.type === 'tip') {
    body = `<div class="n">${s.n}</div><h2>${esc(s.title)}</h2><p class="txt">${esc(s.text)}</p>`;
  } else if (s.type === 'image') {
    body = `<h2 class="t2">${esc(s.title)}</h2><div class="phone"><img src="${dataUri(s.image)}"></div><p class="txt c">${esc(s.text)}</p>`;
  } else if (s.type === 'cta') {
    body = `${mascot ? `<img class="mascot-cta" src="${mascot}">` : ''}<h2 class="c">${esc(s.title)}</h2><p class="txt c">${esc(s.text)}</p>
      <div class="btn">${esc(s.button || b.cta)}</div><p class="site">${esc(b.site)}</p>`;
  } else if (s.type === 'meme') {
    body = `<h1 class="meme-top">${esc(s.top)}</h1><div class="meme-mid">${s.image ? `<div class="phone sm"><img src="${dataUri(s.image)}"></div>` : ''}${mascot ? `<img class="mascot-m" src="${mascot}">` : ''}</div><p class="meme-bottom">${esc(s.bottom)}</p>`;
  }
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0}
  body{width:1080px;height:1350px;font-family:Inter,Arial,sans-serif;background:linear-gradient(180deg,${b.background} 0%,${b.color}22 100%);color:#1e1b2e;
    display:flex;flex-direction:column;padding:90px 90px 70px;overflow:hidden;position:relative}
  .k{font-size:34px;font-weight:700;letter-spacing:5px;text-transform:uppercase;color:${b.color}}
  h1.big{font-size:104px;font-weight:900;line-height:1.02;letter-spacing:-2px;margin-top:22px}
  .sub{font-size:42px;font-weight:600;color:#4a4458;margin-top:30px;line-height:1.3}
  .mascot-c{position:absolute;width:420px;right:60px;bottom:150px}
  .swipe{position:absolute;left:90px;bottom:170px;font-size:38px;font-weight:800;color:${b.color}}
  .n{width:150px;height:150px;border-radius:50%;background:${b.color};color:#fff;font-size:84px;font-weight:900;display:flex;align-items:center;justify-content:center;margin-top:120px}
  h2{font-size:78px;font-weight:900;line-height:1.08;letter-spacing:-1px;margin-top:60px}
  h2.t2{margin-top:0;text-align:center;font-size:66px}
  .txt{font-size:44px;line-height:1.4;color:#4a4458;margin-top:36px;font-weight:500}
  .c{text-align:center}
  .phone{width:430px;height:765px;border-radius:52px;border:13px solid #1e1b2e;overflow:hidden;margin:40px auto 0;box-shadow:0 30px 60px rgba(30,27,46,.25);background:#000}
  .phone img{width:100%;height:100%;object-fit:cover;object-position:top}
  .phone.sm{width:360px;height:640px;margin:0}
  .mascot-cta{width:330px;margin:20px auto 0}
  .btn{margin:50px auto 0;background:${b.color};color:#fff;font-size:44px;font-weight:800;padding:30px 54px;border-radius:999px}
  .site{text-align:center;font-size:40px;font-weight:800;color:${b.color};margin-top:30px}
  .meme-top{font-size:76px;font-weight:900;line-height:1.1;text-align:center;letter-spacing:-1px}
  .meme-mid{flex:1;display:flex;align-items:center;justify-content:center;gap:10px}
  .mascot-m{width:330px;margin-left:-60px;margin-top:220px}
  .meme-bottom{font-size:46px;font-weight:700;text-align:center;color:#4a4458;margin-bottom:110px}
  .foot{position:absolute;left:0;right:0;bottom:40px;display:flex;align-items:center;justify-content:center;gap:16px;font-size:30px;font-weight:800;color:${b.color}}
  .foot img{height:70px}
  .dots{position:absolute;top:40px;left:0;right:0;display:flex;gap:10px;justify-content:center}
  .dots i{width:14px;height:14px;border-radius:50%;background:${b.color}44}.dots i.on{background:${b.color}}
  </style></head><body>${dots}${body}${s.type === 'cta' ? '' : foot}</body></html>`;
}

(async () => {
  const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const outDir = path.join(ROOT, spec.out_dir || 'marketing/carousel/out'); fs.mkdirSync(outDir, { recursive: true });
  const br = await chromium.launch();
  const p = await br.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  for (const set of spec.sets) {
    const b = brand(set.brand);
    for (let i = 0; i < set.slides.length; i++) {
      await p.setContent(slideHtml(set.slides[i], b, i, set.slides.length), { waitUntil: 'load' });
      if (await p.evaluate(() => document.body.scrollHeight > 1350)) console.warn('texto passou do tamanho:', set.name, i + 1);
      const f = path.join(outDir, `${set.name}-${i + 1}.png`);
      await p.screenshot({ path: f });
      console.log('ok', path.relative(ROOT, f));
    }
  }
  await br.close();
})();
