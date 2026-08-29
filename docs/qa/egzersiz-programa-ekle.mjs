/* =====================================================================
   R16 · "Programa ekle" ÖLÇÜMÜ — egzersiz-detay-v1.html
   ---------------------------------------------------------------------
   Soru: düğme gerçekten bir şey kaydediyor mu?
   Yöntem: giriş yapılmış oturumda localStorage'ın TAMAMI tıklamadan önce
   ve sonra alınır, diff basılır. "İkon değişti" kanıt sayılmaz.
   Koşum:  PW_HOME=~/.pw node docs/qa/egzersiz-programa-ekle.mjs
   ===================================================================== */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';

const KOK = 'http://127.0.0.1:8788';

const dump = () => JSON.stringify(Object.fromEntries(
  Object.keys(localStorage).map(k => [k, localStorage.getItem(k)])));

async function main(){
  const b = await chromium.launch();
  const p = await b.newPage({ viewport:{ width:1440, height:1024 } });
  const hatalar = [];
  p.on('console', m => { if(m.type()==='error') hatalar.push(m.text()); });
  p.on('pageerror', e => hatalar.push(String(e)));

  await p.goto(KOK + '/egzersiz-detay-v1.html?slug=goblet-squat&auth=1', { waitUntil:'networkidle' });

  const auth = await p.evaluate(() => document.body.classList.contains('is-auth'));
  console.log('body.is-auth       :', auth);

  const btn = p.locator('button:has-text("Programa ekle")');
  const say = await btn.count();
  console.log('"Programa ekle" adet:', say);
  if(!say){ console.log('DÜĞME BULUNAMADI — sonda kör olabilir'); await b.close(); return; }

  const nitelik = await btn.first().evaluate(el => ({
    id: el.id || '(yok)', sinif: el.className,
    ozn: Array.from(el.attributes).map(a => a.name).join(','),
    metin: el.textContent.trim()
  }));
  console.log('düğme            :', JSON.stringify(nitelik));

  const once = JSON.parse(await p.evaluate(dump));
  await btn.first().click();
  await p.waitForTimeout(400);
  const sonra = JSON.parse(await p.evaluate(dump));

  const anahtarlar = new Set([...Object.keys(once), ...Object.keys(sonra)]);
  let degisen = 0;
  for(const k of anahtarlar){
    if(once[k] !== sonra[k]){
      degisen++;
      console.log('DEĞİŞTİ  ' + k);
      console.log('  önce : ' + (once[k]  ?? '(yok)'));
      console.log('  sonra: ' + (sonra[k] ?? '(yok)'));
    }
  }
  console.log('değişen anahtar  :', degisen);

  const gorunum = await btn.first().evaluate(el => ({
    metin: el.textContent.trim(), pressed: el.getAttribute('aria-pressed'),
    ikon: (el.querySelector('i')||{}).className || '(yok)'
  }));
  console.log('tıklama sonrası  :', JSON.stringify(gorunum));

  const gate = await p.evaluate(() => {
    const g = document.getElementById('lgGate');
    return g ? g.classList.contains('show') : null;
  });
  console.log('giriş kapısı açık:', gate);

  console.log('konsol hatası    :', hatalar.length, hatalar.slice(0,3));
  await b.close();
}
main();
