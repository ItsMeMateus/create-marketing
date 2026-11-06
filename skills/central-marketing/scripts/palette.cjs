// Tira as cores principais de uma ou mais imagens (logo, print do site ou do
// Instagram) para montar o .agents/brand.json no treino da marca.
// Uso: NODE_PATH=$(npm root -g) node <pasta-da-skill>/scripts/palette.cjs imagem1.png [imagem2.jpg ...]
// Saída: as 6 cores mais frequentes de cada imagem (ignorando branco, preto e
// cinzas quase puros), em hex, com a porcentagem de área.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const files = process.argv.slice(2);
  if (!files.length) { console.error('passe pelo menos uma imagem'); process.exit(1); }
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const f of files) {
    const ext = path.extname(f).slice(1).toLowerCase();
    const uri = `data:image/${ext === 'jpg' ? 'jpeg' : ext};base64,` + fs.readFileSync(f).toString('base64');
    const res = await p.evaluate(async (src) => {
      const img = new Image(); img.src = src; await img.decode();
      const W = 200, H = Math.max(1, Math.round(img.height * 200 / img.width));
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const g = c.getContext('2d'); g.drawImage(img, 0, 0, W, H);
      const d = g.getImageData(0, 0, W, H).data; const buckets = {}; let total = 0;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] < 128) continue;
        const r = d[i], gg = d[i + 1], bb = d[i + 2];
        const mx = Math.max(r, gg, bb), mn = Math.min(r, gg, bb);
        if (mx - mn < 18 && (mx > 235 || mx < 30)) continue; // branco, preto, cinza puro
        total++;
        const k = [r, gg, bb].map(v => Math.round(v / 24) * 24).join(',');
        (buckets[k] = buckets[k] || { n: 0, r: 0, g: 0, b: 0 }).n++;
        buckets[k].r += r; buckets[k].g += gg; buckets[k].b += bb;
      }
      const hex = v => Math.round(v).toString(16).padStart(2, '0');
      return Object.values(buckets).sort((a, z) => z.n - a.n).slice(0, 6)
        .map(x => `#${hex(x.r / x.n)}${hex(x.g / x.n)}${hex(x.b / x.n)} ${(100 * x.n / total).toFixed(0)}%`);
    }, uri);
    console.log(path.basename(f) + ': ' + res.join('  '));
  }
  await b.close();
})();
