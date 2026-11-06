// Renderiza um reel a partir de um roteiro JSON.
// Uso (dentro desta pasta): node render.mjs reels/<arquivo>.json  →  out/<arquivo>.mp4
// A marca vem do .agents/brand.json do projeto (procurado subindo as pastas):
// "brand" no roteiro escolhe a marca; sem ele, usa a primeira.
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const qrcode = require('qrcode-generator');

const file = process.argv[2]; if (!file) { console.error('uso: node render.mjs reels/x.json'); process.exit(1); }
const props = JSON.parse(fs.readFileSync(file, 'utf8'));

// Marca
function findBrandFile(dir) {
  for (let d = path.resolve(dir); ; d = path.dirname(d)) {
    const f = path.join(d, '.agents', 'brand.json');
    if (fs.existsSync(f)) return f;
    if (path.dirname(d) === d) return null;
  }
}
const bf = findBrandFile(process.cwd());
if (!bf) { console.error('Falta .agents/brand.json no projeto (modelo na skill central-marketing).'); process.exit(1); }
const brands = JSON.parse(fs.readFileSync(bf, 'utf8')).brands || {};
const brand = brands[props.brand] || Object.values(brands)[0] || {};
const root = path.dirname(path.dirname(bf));
const copyAsset = (rel, name) => {
  if (!rel) return '';
  const src = path.isAbsolute(rel) ? rel : path.join(root, rel);
  if (!fs.existsSync(src)) { console.warn('não achei', rel); return ''; }
  const dest = name + path.extname(src).toLowerCase();
  fs.copyFileSync(src, path.join('public', dest));
  return dest;
};
props.b = { site: brand.site || '', cta: props.cta || brand.cta || '', sub: props.sub || brand.sub || '',
  color: brand.color || '#f0426e', background: brand.background || '#fffafb', lang: brand.lang || 'pt' };
props.mascot = copyAsset(brand.mascot, 'brand-mascot');
props.avatar = copyAsset(props.avatar || brand.avatar, 'brand-avatar');

// QR Code que aparece na conversa: aponta para qrUrl (ou o site da marca)
const q = qrcode(0, 'H'); q.addData(props.qrUrl || ('https://' + (brand.site || 'example.com'))); q.make();
const n = q.getModuleCount();
props.qr = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => (q.isDark(r, c) ? 1 : 0)));

// Toques gravados pelo capture-story.cjs entram no vídeo
if (props.cardVideo && !props.taps) {
  const tf = path.join('public', props.cardVideo.replace(/\.mp4$/, '.taps.json'));
  if (fs.existsSync(tf)) props.taps = JSON.parse(fs.readFileSync(tf, 'utf8'));
}

// Navegador: REMOTION_BROWSER, o Chromium do Playwright se houver, ou o que o Remotion baixar
let browserExecutable = process.env.REMOTION_BROWSER || null;
if (!browserExecutable && fs.existsSync('/opt/pw-browsers')) {
  browserExecutable = fs.readdirSync('/opt/pw-browsers').filter(d => d.startsWith('chromium_headless_shell-'))
    .map(d => `/opt/pw-browsers/${d}/chrome-headless-shell-linux64/chrome-headless-shell`).find(p => fs.existsSync(p)) || null;
}

const compId = props.composition || 'Story';
fs.mkdirSync('out', { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.jsx') });
const composition = await selectComposition({ serveUrl, id: compId, inputProps: props, browserExecutable });
const out = `out/${path.basename(file, '.json')}.mp4`;
await renderMedia({ composition, serveUrl, codec: 'h264', outputLocation: out, inputProps: props, browserExecutable,
  concurrency: Number(process.env.RENDER_CONCURRENCY || 2), offthreadVideoCacheSizeInBytes: 512 * 1024 * 1024 });
console.log('ok', out);
