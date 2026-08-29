/* R16 · kenar durumlar: plan yok · giriş yok · kapanmış gün · ekran görüntüsü
   Koşum: PW_HOME=~/.pw node docs/qa/egzersiz-plana-ekle-kenar.mjs */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';
const KOK = 'http://127.0.0.1:8788';
const SAYFA = KOK + '/egzersiz-detay-v1.html?slug=goblet-squat&auth=1';
const oku = () => { try { return JSON.parse(localStorage.getItem('dm_fit_planlar_v1')||'null'); } catch(e){ return null; } };

async function main(){
  const b = await chromium.launch();
  const p = await b.newPage({ viewport:{ width:1440, height:1024 } });
  const hatalar = [];
  p.on('console', m => { if(m.type()==='error') hatalar.push(m.text()); });
  p.on('pageerror', e => hatalar.push(String(e)));

  /* --- A · plan yok --- */
  await p.goto(SAYFA, { waitUntil:'networkidle' });
  await p.evaluate(() => localStorage.removeItem('dm_fit_planlar_v1'));
  await p.click('#edBugune'); await p.waitForTimeout(200);
  console.log('A1 plan yok · Bugüne  :', (await p.locator('#edPlanDurum').innerText()).replace(/\s+/g,' '));
  console.log('A1 bağlantı sayısı    :', await p.locator('#edPlanDurum a').count());
  await p.click('#edPlanaEkle'); await p.waitForTimeout(200);
  console.log('A2 plan yok · Programa:', (await p.locator('#edPlanDurum').innerText()).replace(/\s+/g,' '));
  console.log('A2 seçici açıldı mı   :', await p.locator('#edPlanPick').isVisible(), '(açılmamalı)');
  console.log('A2 anahtar yazıldı mı :', await p.evaluate(oku), '(null olmalı)');

  /* --- B · KAPANMIŞ GÜN: yeni hareket günü geri açıyor mu --- */
  await p.evaluate(() => {
    localStorage.removeItem('dm_fit_planlar_v1');
    var id = FIT_PLAN.kaydet({ ad:'Tek gün', gunler:[
      { no:1, ad:'Gün 1', hareketler:[{slug:'sinav', ad:'Şınav (Push-up)'}] } ]});
    FIT_PLAN.isaretle(id, 1, 0, {yapildi:true, seviye:'tam'});   /* gün + plan tamamlandı */
  });
  const kapali = await p.evaluate(() => { const d = oku2(); return d; function oku2(){ return JSON.parse(localStorage.getItem('dm_fit_planlar_v1')); } });
  console.log('\nB1 ekleme ÖNCESİ  : gunDurum=' + JSON.stringify(kapali.planlar[0].gunDurum) +
              ' plan.durum=' + kapali.planlar[0].durum);
  await p.reload({ waitUntil:'networkidle' });
  await p.click('#edBugune'); await p.waitForTimeout(300);
  const acik = await p.evaluate(oku);
  console.log('B2 ekleme SONRASI : gunDurum=' + JSON.stringify(acik.planlar[0].gunDurum) +
              ' plan.durum=' + acik.planlar[0].durum + ' bitis=' + acik.planlar[0].bitis);
  console.log('B3 ilerleme korundu mu:', JSON.stringify(acik.planlar[0].ilerleme));
  console.log('B4 hareketler         :', JSON.stringify(acik.planlar[0].gunler[0].hareketler.map(h=>h.slug)));

  /* --- C · giriş yok: kapı açılıyor mu, depo bozuluyor mu --- */
  await p.goto(KOK + '/egzersiz-detay-v1.html?slug=goblet-squat&auth=0', { waitUntil:'networkidle' });
  const oncekiC = await p.evaluate(oku);
  await p.click('#edBugune'); await p.waitForTimeout(300);
  console.log('\nC1 is-auth            :', await p.evaluate(() => document.body.classList.contains('is-auth')));
  console.log('C1 giriş kapısı açıldı:', await p.evaluate(() => document.getElementById('lgGate').classList.contains('show')));
  console.log('C2 depo değişti mi    :', JSON.stringify(await p.evaluate(oku)) !== JSON.stringify(oncekiC), '(false olmalı)');

  /* --- D · ekran görüntüsü --- */
  await p.goto(SAYFA, { waitUntil:'networkidle' });
  await p.evaluate(() => {
    localStorage.removeItem('dm_fit_planlar_v1');
    FIT_PLAN.kaydet({ ad:'Ev · 3 gün · Başlangıç', gunler:[
      { no:1, ad:'Gün 1', odak:'İtiş',  hareketler:[{slug:'sinav', ad:'Şınav'}] },
      { no:2, ad:'Gün 2', odak:'Çekiş', hareketler:[{slug:'superman', ad:'Superman'}] },
      { no:3, ad:'Gün 3', odak:'Bacak', hareketler:[] } ]});
  });
  await p.reload({ waitUntil:'networkidle' });
  await p.click('#edPlanaEkle'); await p.waitForTimeout(250);
  await p.locator('#edTrack').scrollIntoViewIfNeeded();
  await p.waitForTimeout(200);
  await p.locator('#edTrack').screenshot({ path:'docs/screenshots/ed-plana-ekle-1440.png' });
  await p.locator('.ed-plan-gun[data-gun="3"]').click(); await p.waitForTimeout(300);
  await p.locator('#edTrack').screenshot({ path:'docs/screenshots/ed-plana-ekle-durum.png' });
  await p.setViewportSize({ width:390, height:900 });
  await p.reload({ waitUntil:'networkidle' });
  await p.click('#edPlanaEkle'); await p.waitForTimeout(250);
  await p.locator('#edTrack').scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
  await p.locator('#edTrack').screenshot({ path:'docs/screenshots/ed-plana-ekle-390.png' });
  console.log('\nD  ekran görüntüsü: docs/screenshots/ed-plana-ekle-{1440,durum,390}.png');
  console.log('\nkonsol hatası:', hatalar.length, hatalar.slice(0,5));
  await b.close();
}
main();
