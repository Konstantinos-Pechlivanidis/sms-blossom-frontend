import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const EXT_DIRS = [
  'extensions/checkout-consent/dist',
  'extensions/thankyou-optin/dist'
];

let fail = false;
for (const dir of EXT_DIRS) {
  const p = path.join(ROOT, dir);
  if (!fs.existsSync(p)) { console.log(`(skip) ${dir} not built`); continue; }
  const files = fs.readdirSync(p).filter(f => f.endsWith('.js'));
  for (const f of files) {
    const b = fs.statSync(path.join(p, f)).size;
    const kb = (b / 1024).toFixed(1);
    const ok = b <= 63 * 1024; // safety margin under 64KB
    console.log(`${dir}/${f} -> ${kb} KB ${ok ? '✅' : '❌'}`);
    if (!ok) fail = true;
  }
}
if (fail) {
  console.error('Bundle too big. Keep each extension ≤ 64KB.');
  process.exit(1);
}
