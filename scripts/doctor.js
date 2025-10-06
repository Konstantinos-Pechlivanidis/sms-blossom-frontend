/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import * as url from 'node:url';
import YAML from 'yaml';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const ROOT = path.resolve(__dirname, '..');
const ENV_PATH = path.join(ROOT, '.env');
const OPENAPI_PATH = path.join(ROOT, 'openapi', 'openapi.yaml');
const EXT_CHECKOUT = path.join(ROOT, 'extensions', 'checkout-sms-consent', 'src', 'index.ts');
const EXT_THANKYOU = path.join(ROOT, 'extensions', 'thank-you-late-opt-in', 'src', 'index.ts');
const EXT_BANNER = path.join(ROOT, 'extensions', 'theme-embed-banner', 'blocks', 'sms-consent-banner.liquid');

const REQUIRED_PROXY = '/apps/sms-blossom';

function readEnv(file) {
  if (!fs.existsSync(file)) return {};
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const out = {};
  for (const l of lines) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) {
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      out[m[1]] = val;
    }
  }
  return out;
}

async function checkBackendHealth(base) {
  const target = `${base.replace(/\/+$/, '')}/health`;
  const res = await fetch(target).catch((e) => ({ ok: false, statusText: String(e) }));
  if (!res.ok) throw new Error(`Health check failed: ${res.status} ${res.statusText} (${target})`);
  const json = await res.json();
  if (!json?.status || json.status !== 'ok') throw new Error(`Unexpected /health payload: ${JSON.stringify(json)}`);
  return json;
}

function exists(p) {
  if (!fs.existsSync(p)) throw new Error(`Missing file: ${path.relative(ROOT, p)}`);
  return true;
}

function checkAppProxyStrings() {
  const files = [EXT_CHECKOUT, EXT_THANKYOU, EXT_BANNER];
  const offenders = [];
  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    const s = fs.readFileSync(f, 'utf8');
    if (!s.includes(REQUIRED_PROXY)) offenders.push(path.relative(ROOT, f));
  }
  if (offenders.length) {
    throw new Error(`App Proxy base not set to '${REQUIRED_PROXY}' in: ${offenders.join(', ')}`);
  }
}

function checkOpenAPI() {
  if (!fs.existsSync(OPENAPI_PATH)) throw new Error(`Missing ${path.relative(ROOT, OPENAPI_PATH)}`);
  const raw = fs.readFileSync(OPENAPI_PATH, 'utf8');
  const doc = YAML.parse(raw);
  const paths = Object.keys(doc?.paths || {});
  const must = ['/health', '/discounts'];
  const missing = must.filter((p) => !paths.includes(p));
  if (missing.length) {
    throw new Error(`OpenAPI missing required paths: ${missing.join(', ')}`);
  }
  return { ok: true, count: paths.length };
}

function run(cmd) {
  console.log(`$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: ROOT });
}

async function main() {
  console.log('=== SMS Blossom Doctor ===');

  // 1) Env
  const env = readEnv(ENV_PATH);
  const backend = (env.VITE_BACKEND_URL || '').replace(/\/+$/, '');
  if (!backend) throw new Error('VITE_BACKEND_URL not set in .env');
  console.log('Backend URL:', backend);

  // 2) Health
  console.log('Checking backend /health...');
  const health = await checkBackendHealth(backend);
  console.log('OK /health:', health);

  // 3) OpenAPI present
  console.log('Validating openapi/openapi.yaml...');
  const oa = checkOpenAPI();
  console.log('OpenAPI OK, paths:', oa.count);

  // 4) Extensions exist + proxy strings
  console.log('Checking extensions presence...');
  [EXT_CHECKOUT, EXT_THANKYOU, EXT_BANNER].forEach(exists);
  console.log('Validating App Proxy base strings...');
  checkAppProxyStrings();
  console.log('Extensions App Proxy base OK:', REQUIRED_PROXY);

  // 5) Typecheck extensions
  console.log('Typechecking extensions (tsc)...');
  try {
    run('npx tsc -p extensions/tsconfig.json --noEmit');
  } catch {
    console.warn('Extension typecheck failed (non-blocking). Extensions may need manual fixes.');
  }

  // 6) Generate API SDK (if configured)
  if (fs.existsSync(path.join(ROOT, 'openapi', 'openapi.yaml'))) {
    console.log('Generating OpenAPI client...');
    try {
      run('npm run api:generate');
    } catch {
      console.warn('OpenAPI generation skipped/failed (non-blocking).');
    }
  }

  // 7) Build app
  console.log('Building frontend...');
  run('npm run build');

  console.log('\n✅ Doctor finished successfully.');
  console.log('Next: open the app from Shopify Admin OR run `shopify app dev` to preview extensions.');
}

main().catch((e) => {
  console.error('\n❌ Doctor failed:', e?.message || e);
  process.exit(1);
});
