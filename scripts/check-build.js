import { existsSync, statSync } from 'fs';
import { join } from 'path';

const must = [
  'dist/index.html',
  'dist/assets'
];

let ok = true;
for (const p of must) {
  const fp = join(process.cwd(), p);
  if (!existsSync(fp)) {
    console.error('❌ Missing build artifact:', p);
    ok = false;
  } else {
    const st = statSync(fp);
    if (p.endsWith('/assets') && !st.isDirectory()) { console.error('❌ Expected directory:', p); ok = false; }
    if (p.endsWith('index.html') && !st.isFile()) { console.error('❌ Expected file:', p); ok = false; }
  }
}
if (!ok) { process.exit(1); }
console.log('✅ Build artifacts present.');
