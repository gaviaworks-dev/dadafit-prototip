/* =====================================================================
   R16 · "Bugünkü antrenmana ekle" + "Programa ekle" — KANIT ÖLÇÜMÜ
   ---------------------------------------------------------------------
   Koşum: PW_HOME=~/.pw node docs/qa/egzersiz-plana-ekle.mjs
   ===================================================================== */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';

const KOK  = 'http://127.0.0.1:8788';
const SAYFA = KOK + '/egzersiz-detay-v1.html?slug=goblet-squat&auth=1';
const ANAH = 'dm_fit_planlar_v1';

const oku = () => { try { return JSON.parse(localStorage.getItem('dm_fit_planlar_v1')||'null'); } catch(e){ return null; } };

function ozetle(d){
  if(!d) return '(anahtar yok)';
  return d.planlar.map(p =>
    p.ad + ' [' + p.id + '] durum=' + p.durum + ' ' +
    p.gunler.map(g => (g.ad||('Gün '+g.no)) + ':' + (g.hareketler||[]).length + ' hareket [' +
      (g.hareketler||[]).map(h => h.slug||h.ad).join(', ') + ']').join(' | ')
  ).join('\n  ');
}

async function main(){
  const b = await chromium.launch();
  const p = await b.newPage({ viewport:{ width:1440, height:1024 } });
  const hatalar = [];
  p.on('console', m => { if(m.type()==='error') hatalar.push(m.text()); });
  p.on('pageerror', e => hatalar.push(String(e)));

  await p.goto(SAYFA, { waitUntil:'networkidle' });

  /* --- 0 · tohum: sözleşme üzerinden iki günlük bir plan --- */
  await p.evaluate(() => {
    localStorage.removeItem('dm_fit_planlar_v1');
    FIT_PLAN.kaydet({
      ad:'Ev · 2 gün · Başlangıç', kaynak:'antrenman-olusturucu',
      gunler:[
        { no:1, ad:'Gün 1', odak:'İtiş',  hareketler:[{slug:'sinav', ad:'Şınav (Push-up)', set:3, tekrar:10}] },
        { no:2, ad:'Gün 2', odak:'Çekiş', hareketler:[{slug:'superman', ad:'Superman', set:3, tekrar:12}] }
      ]
    });
  });
  await p.reload({ waitUntil:'networkidle' });

  console.log('=== 1 · ÖNCE ===');
  const once = await p.evaluate(oku);
  console.log('  ' + ozetle(once));
  console.log('  ham uzunluk:', JSON.stringify(once).length, 'karakter');

  /* --- 1 · "Bugünkü antrenmana ekle" --- */
  console.log('\n=== 2 · "Bugünkü antrenmana ekle" tıklandı ===');
  await p.click('#edBugune');
  await p.waitForTimeout(300);
  const sonra1 = await p.evaluate(oku);
  console.log('  ' + ozetle(sonra1));
  console.log('  durum satırı:', (await p.locator('#edPlanDurum').innerText()).replace(/\s+/g,' '));
  const yeni = sonra1.planlar[0].gunler[0].hareketler.slice(-1)[0];
  console.log('  YAZILAN KAYIT:', JSON.stringify(yeni));

  /* --- 2 · yenile → duruyor mu --- */
  await p.reload({ waitUntil:'networkidle' });
  const sonraYenile = await p.evaluate(oku);
  console.log('\n=== 3 · YENİLEDİKTEN SONRA ===');
  console.log('  ' + ozetle(sonraYenile));
  console.log('  Gün 1 hareket sayısı:', sonraYenile.planlar[0].gunler[0].hareketler.length);

  /* --- 3 · aynı düğme ikinci kez: çiftleme koruması --- */
  await p.click('#edBugune');
  await p.waitForTimeout(300);
  const sonra2 = await p.evaluate(oku);
  console.log('\n=== 4 · AYNI DÜĞME İKİNCİ KEZ ===');
  console.log('  Gün 1 hareket sayısı:', sonra2.planlar[0].gunler[0].hareketler.length, '(çiftlenmedi mi?)');
  console.log('  durum satırı:', (await p.locator('#edPlanDurum').innerText()).replace(/\s+/g,' '));

  /* --- 4 · "Programa ekle" → gün seçici → Gün 2 --- */
  console.log('\n=== 5 · "Programa ekle" → gün seçici ===');
  await p.click('#edPlanaEkle');
  await p.waitForTimeout(200);
  console.log('  seçici görünür :', await p.locator('#edPlanPick').isVisible());
  console.log('  aria-expanded  :', await p.locator('#edPlanaEkle').getAttribute('aria-expanded'));
  const gunler = await p.locator('.ed-plan-gun').allInnerTexts();
  console.log('  gün düğmeleri  :', JSON.stringify(gunler.map(t => t.replace(/\s+/g,' '))));
  console.log('  plan seçici gizli mi (tek plan):', await p.locator('#edPlanSatir').isHidden());
  await p.locator('.ed-plan-gun[data-gun="2"]').click();
  await p.waitForTimeout(300);
  const sonra3 = await p.evaluate(oku);
  console.log('  ' + ozetle(sonra3));
  console.log('  durum satırı   :', (await p.locator('#edPlanDurum').innerText()).replace(/\s+/g,' '));
  console.log('  seçici kapandı :', await p.locator('#edPlanPick').isHidden());

  /* --- 5 · Planım sayfasında görünüyor mu --- */
  console.log('\n=== 6 · PROGRAMLARIM — "Bugün" kartı ===');
  await p.goto(KOK + '/programlarim-v1.html?auth=1#programlarim', { waitUntil:'networkidle' });
  await p.waitForTimeout(600);
  const satirlar = await p.locator('#fpxHareketler .fpx-ex').allInnerTexts();
  console.log('  seçici        : #fpxHareketler .fpx-ex');
  console.log('  öğe sayısı    :', satirlar.length);
  satirlar.forEach((t,i) => console.log('   ' + (i+1) + '. ' + t.replace(/\s+/g,' ').slice(0,120)));
  console.log('  Gün adı       :', await p.locator('#fpxGunAd').innerText().catch(()=>'(yok)'));

  /* --- 6 · geometri: taşma + dokunma hedefi --- */
  console.log('\n=== 7 · GEOMETRİ (egzersiz-detay) ===');
  for(const w of [1440, 1024, 768, 390]){
    await p.setViewportSize({ width:w, height:1000 });
    await p.goto(SAYFA, { waitUntil:'networkidle' });
    await p.click('#edPlanaEkle');
    await p.waitForTimeout(250);
    const g = await p.evaluate(() => {
      const tas = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      const sec = ['#edBugune','#edPlanaEkle','#edPlanSel','.ed-plan-gun'];
      const kucuk = [];
      let n = 0;
      sec.forEach(s => document.querySelectorAll(s).forEach(el => {
        const r = el.getBoundingClientRect();
        if(r.width === 0 && r.height === 0) return;
        n++;
        if(r.height < 44 || r.width < 44) kucuk.push(s + ' ' + Math.round(r.width) + '×' + Math.round(r.height));
      }));
      const dr = document.getElementById('edPlanDurum');
      return { tas, n, kucuk, gunH: Array.from(document.querySelectorAll('.ed-plan-gun')).map(e=>Math.round(e.getBoundingClientRect().height)) };
    });
    console.log('  ' + w + 'px → yatay taşma ' + g.tas + 'px · ölçülen öğe ' + g.n +
                ' · 44px altı ' + g.kucuk.length + (g.kucuk.length ? ' ' + JSON.stringify(g.kucuk) : '') +
                ' · gün düğmesi yükseklikleri ' + JSON.stringify(g.gunH));
  }

  console.log('\n=== 8 · KONSOL ===');
  console.log('  hata sayısı:', hatalar.length, hatalar.slice(0,5));
  await b.close();
}
main();
