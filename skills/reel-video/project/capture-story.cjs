// Grava uma página do seu produto (site ou app web) com toques de verdade, como
// alguém usando no celular, em 1080x1920, e salva onde cada toque aconteceu
// para o vídeo desenhar o toque. Uso: node capture-story.cjs <roteiro.json> <saida.mp4>
// O roteiro tem: { "url", "seconds", "hide": ["#cookieBanner"], "steps": [...] }. Passos:
//   { "at": 1.0, "do": "tap", "sel": "#playBtn" }
//   { "at": 3.0, "do": "scrollTo", "sel": "#galleryBlock", "dur": 1.5, "offset": 80 }
//   { "at": 9.0, "do": "scrollBy", "y": 500, "dur": 3 }
//   { "at": 6.0, "do": "key", "key": "ArrowRight" }
//   { "at": 7.0, "do": "tapText", "text": "close" }   (botão pelo texto visível)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const W = 432, H = 768, DPR = 2.5, FPS = 15;
(async () => {
  const [cfgFile, out = 'public/story.mp4'] = process.argv.slice(2);
  const cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8')).card || JSON.parse(fs.readFileSync(cfgFile, 'utf8'));
  if (!cfg.url) { console.error('falta "url" no roteiro'); process.exit(1); }
  const frames = Math.round((cfg.seconds || 14) * FPS);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'story-'));
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DPR, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(cfg.url, { waitUntil: 'load', timeout: 60000 });
  await p.waitForTimeout(cfg.wait || 1500);
  // Esconde o que não deve aparecer no vídeo (banner de cookies, avisos...)
  await p.evaluate(sels => sels.forEach(s => document.querySelectorAll(s).forEach(e => e.remove())), cfg.hide || []);
  const steps = (cfg.steps || []).map(s => ({ ...s, done: false }));
  const taps = []; let scroll = null;
  const loc = async sel => { const l = p.locator(sel).first(); return (await l.count()) ? l : null; };
  for (let i = 0; i < frames; i++) {
    const t = i / FPS;
    for (const s of steps) {
      if (s.done || t < s.at) continue; s.done = true;
      if (s.do === 'tap') {
        const l = await loc(s.sel); if (!l) { console.warn('não achei', s.sel); continue; }
        await l.scrollIntoViewIfNeeded().catch(() => {});
        const bb = await l.boundingBox(); if (!bb) continue;
        const x = bb.x + bb.width / 2, y = bb.y + bb.height / 2;
        taps.push({ t, x: x / W * 1080, y: y / H * 1920 });
        await p.mouse.click(x, y).catch(() => {});
      } else if (s.do === 'tapText') {
        // toca no botão visível cujo texto é exatamente s.text (ex.: "close")
        const bb = await p.evaluate(txt => {
          const el = [...document.querySelectorAll('button,a,[role=button]')].find(e => {
            const r = e.getBoundingClientRect(); return r.width > 0 && r.top >= 0 && r.top < innerHeight && e.innerText.trim() === txt; });
          if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }, s.text);
        if (!bb) { console.warn('não achei texto', s.text); continue; }
        taps.push({ t, x: bb.x / W * 1080, y: bb.y / H * 1920 });
        await p.mouse.click(bb.x, bb.y).catch(() => {});
      } else if (s.do === 'key') {
        await p.keyboard.press(s.key);
      } else if (s.do === 'scrollTo' || s.do === 'scrollBy') {
        const from = await p.evaluate(() => scrollY);
        let to = from + (s.y || 0);
        if (s.do === 'scrollTo') {
          const l = await loc(s.sel); if (!l) { console.warn('não achei', s.sel); continue; }
          to = await l.evaluate((e, off) => e.getBoundingClientRect().top + scrollY - off, s.offset ?? 90);
        }
        scroll = { t0: t, dur: s.dur || 1, from, to };
      }
    }
    if (scroll) {
      const k = Math.min(1, (t - scroll.t0) / scroll.dur), e = (1 - Math.cos(k * Math.PI)) / 2;
      await p.evaluate(y => window.scrollTo(0, y), Math.round(scroll.from + (scroll.to - scroll.from) * e));
      if (k >= 1) scroll = null;
    }
    await p.screenshot({ path: path.join(dir, `f${String(i).padStart(4, '0')}.png`) });
  }
  await b.close();
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-i', path.join(dir, 'f%04d.png'),
    '-vf', 'scale=1080:1920,fps=30', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', out]);
  fs.writeFileSync(out.replace(/\.mp4$/, '.taps.json'), JSON.stringify(taps));
  fs.rmSync(dir, { recursive: true, force: true });
  console.log('ok', out, taps.length, 'toques');
})();
