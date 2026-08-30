/* =====================================================================
   R18 KABUK NÖBETİ — kabuk değişikliği 79 sayfayı da bozmasın
   ---------------------------------------------------------------------
   R18'de `fit-shell.js` (FOOTER_COLS · PLAN_EXTRA · DEFTER_TABS ·
   FEEDBACK_HTML · modül hash çözümü) ve `fit-shell.css` (.fb-chiprow ·
   .foot-soc · bant dokunma hedefi) değişti. Bunlar TEK KAYNAK dosyalar:
   bir kusur tek sayfada değil, hepsinde patlar.

   Ölçüt: her sayfada konsol hatası 0 · yatay taşma 0 · footer basıldı.
   Koş: PW_HOME=$HOME/.pw node docs/qa/kabuk-r18-nobet.mjs
   ===================================================================== */
import { chromium } from '../../tests/_pw.mjs';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BASE = process.env.BASE || 'http://127.0.0.1:8099';
const EN   = +(process.env.EN || 1440);

const sayfalar = readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'index.html');
const b = await chromium.launch();
let kirmizi = 0;
console.log(`\n═══ R18 KABUK NÖBETİ · ${sayfalar.length} sayfa @${EN} ═══\n`);

for(const f of sayfalar){
  const p = await b.newPage({ viewport:{ width:EN, height:1000 } });
  const konsol = [];
  p.on('console', m => { if(m.type()==='error') konsol.push(m.text()); });
  p.on('pageerror', e => konsol.push('PE: '+e.message));
  let r = { tasma:-1, footer:false };
  try{
    await p.goto(`${BASE}/${f}`, { waitUntil:'networkidle', timeout:25000 });
    r = await p.evaluate(() => ({
      tasma: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
      footer: !!document.querySelector('footer.footer')
    }));
  }catch(e){ konsol.push('goto: '+e.message); }
  const kusur = [];
  if(konsol.length) kusur.push(`konsol ${konsol.length}: ${konsol[0].slice(0,90)}`);
  if(r.tasma > 0)   kusur.push(`yatay taşma ${r.tasma}px`);
  /* ⚠ Yönetim paneli public footer'ı BASMAZ (kendi kabuğu var, kit §13) —
     21 admin ekranı bu şartın dışındadır; ölçüldü, kusur değil. */
  if(!r.footer && !f.startsWith('admin-')) kusur.push('footer basılmadı');
  if(kusur.length){ kirmizi++; console.log(`🔴 ${f.padEnd(34)} ${kusur.join(' | ')}`); }
  await p.close();
}
console.log('\n' + (kirmizi===0
  ? `✅ KAPI YEŞİL — ${sayfalar.length}/${sayfalar.length} sayfa: konsol 0 · taşma 0 · footer var`
  : `🔴 KAPI KIRMIZI — ${kirmizi}/${sayfalar.length} sayfa düştü`));
console.log(`   (footer şartı ${sayfalar.filter(f=>!f.startsWith('admin-')).length} public sayfada arandı; 21 admin ekranı hariç)`);
await b.close();
process.exit(kirmizi===0 ? 0 : 1);
