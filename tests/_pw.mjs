/* =====================================================================
   Playwright çözücü — testlerin ortak yardımcısı.
   ---------------------------------------------------------------------
   Bu repo statik bir prototip; içine node_modules kurulmuyor. Testler
   playwright-core'u şu sırayla arar:

     1. repo kökündeki node_modules            (npm i -D playwright-core)
     2. tests/node_modules
     3. $PW_HOME/node_modules                  (elle verilen kurulum kökü)
     4. global npm root                        (npm i -g playwright-core)

   Kurulum (bir kez, repo dışında da olabilir):
     mkdir -p ~/.pw && cd ~/.pw && npm init -y && npm i playwright-core
     npx playwright install chromium
     export PW_HOME=~/.pw
   ===================================================================== */
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

function globalRoot(){
  try { return execSync('npm root -g', { stdio:['ignore','pipe','ignore'] }).toString().trim(); }
  catch { return null; }
}

const candidates = [
  path.join(ROOT, 'node_modules'),
  path.join(HERE, 'node_modules'),
  process.env.PW_HOME ? path.join(process.env.PW_HOME, 'node_modules') : null,
  globalRoot()
].filter(Boolean);

let mod = null;
for(const base of candidates){
  const entry = path.join(base, 'playwright-core', 'index.js');
  if(!existsSync(entry)) continue;
  try {
    const req = createRequire(pathToFileURL(path.join(base, 'noop.js')));
    mod = req('playwright-core');
    break;
  } catch { /* sıradakini dene */ }
}

if(!mod){
  console.error(
    'playwright-core bulunamadı. Aranan yerler:\n  ' + candidates.join('\n  ') +
    '\n\nKurulum:\n  mkdir -p ~/.pw && cd ~/.pw && npm init -y && npm i playwright-core' +
    '\n  npx playwright install chromium\n  export PW_HOME=~/.pw\n'
  );
  process.exit(2);
}

export const chromium = mod.chromium;
export default mod;
