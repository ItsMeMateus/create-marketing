// Lê a marca de .agents/brand.json (na pasta em que o script é rodado) e
// devolve os caminhos das imagens como data URIs.
const fs = require('fs'), path = require('path');
const ROOT = process.cwd();
function loadBrands() {
  const f = path.join(ROOT, '.agents', 'brand.json');
  if (!fs.existsSync(f)) {
    throw new Error('Falta .agents/brand.json no projeto. Copie o modelo templates/brand.json da skill central-marketing e preencha.');
  }
  return JSON.parse(fs.readFileSync(f, 'utf8')).brands || {};
}
function dataUri(p) {
  if (!p) return '';
  const abs = path.isAbsolute(p) ? p : path.join(ROOT, p);
  if (!fs.existsSync(abs)) { console.warn('imagem não encontrada:', p); return ''; }
  const ext = path.extname(abs).slice(1).toLowerCase();
  const mime = ext === 'svg' ? 'image/svg+xml' : 'image/' + (ext === 'jpg' ? 'jpeg' : ext);
  return `data:${mime};base64,` + fs.readFileSync(abs).toString('base64');
}
function brand(id) {
  const all = loadBrands();
  const b = all[id] || Object.values(all)[0];
  if (!b) throw new Error('Nenhuma marca em .agents/brand.json');
  return { color: '#f0426e', background: '#fffafb', lang: 'pt', cta: '', ...b };
}
module.exports = { brand, dataUri, ROOT };
