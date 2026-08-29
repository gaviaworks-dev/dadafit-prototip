/* CHALLENGE UÇTAN UCA — katıl → kayıt → ilerleme → rozet → puan → kademe
   ⚠ Kayıt tarihleri YEREL güne göre yazılır; UTC ile yazılan bir sonda
   katılım penceresinin bir gün dışına düşer (bu betik bir kez öyle yazıldı
   ve motoru bozuk gösterdi — motor doğruydu). */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';
const B='http://127.0.0.1:8788/';
const b=await chromium.launch();
const pg=await (await b.newContext({viewport:{width:1440,height:1200}})).newPage();
const hata=[]; pg.on('console',m=>{if(m.type()==='error')hata.push(m.text());});
await pg.goto(B+'challengelarim-v1.html?auth=1'); await pg.waitForTimeout(400);
await pg.evaluate(()=>{['dm_fit','dm_fit_challenge_v1','dm_fit_rozet_v1'].forEach(k=>localStorage.removeItem(k));});
await pg.reload(); await pg.waitForTimeout(500);

const ol=async(t)=>pg.evaluate((t)=>{
  const C=window.FIT_CHALLENGE,R=window.FIT_ROZET;
  const o=C.ozet(), kd=R.kademe();
  return {an:t, devam:o.devam.length, biten:o.biten.length, acik:o.acik.length,
    puan:R.puan().toplam!==undefined?R.puan().toplam:R.puan(),
    rozet:R.liste().filter(x=>x.kazanildi).length,
    kademe:kd.ad, kdPuan:kd.puan, kdGun:kd.aktifGun};
},t);
console.log(JSON.stringify(await ol('sıfır')));

await pg.evaluate(()=>{
  const C=window.FIT_CHALLENGE,S=window.FIT_SHELL.state;
  C.katil('bin-tekrar');
  for(let i=0;i<5;i++){ const d=new Date(); d.setMinutes(d.getMinutes()-i);
    S.antrenmanTamamla({ad:'Yürüyüş',slug:'yuruyus',tarihISO:d.toISOString(),metrik:{tekrar:200},dk:60,kcal:300,kaynak:'olculdu'}); }
});
await pg.waitForTimeout(400);
console.log(JSON.stringify(await ol('süreli 1000 tekrar')));
console.log(' süreli', JSON.stringify(await pg.evaluate(()=>{const i=window.FIT_CHALLENGE.ilerleme('bin-tekrar');return{oran:i.oran,biriken:i.biriken,tamam:i.tamam,durum:i.durum,elenenBeyan:i.elenenBeyan};})));

await pg.evaluate(()=>{
  const C=window.FIT_CHALLENGE,S=window.FIT_SHELL.state;
  C.katil('ekipmansiz-temel');
  ['kopru','superman','hava-squat','hamle','sinav','dead-bug','plank']
    .forEach((s,ix)=>{ const d=new Date(); d.setSeconds(d.getSeconds()-(60-ix));
      S.antrenmanTamamla({ad:s,slug:s,tarihISO:d.toISOString(),dk:8,kaynak:'beyan'}); });
});
await pg.waitForTimeout(500);
console.log(JSON.stringify(await ol('seri 7/7')));
console.log(' seri', JSON.stringify(await pg.evaluate(()=>{const i=window.FIT_CHALLENGE.ilerleme('ekipmansiz-temel');return{oran:i.oran,biriken:i.biriken,tamam:i.tamam,durum:i.durum};})));

/* beyan elenmesi: süreli hedefe beyan yazılır, biriken DEĞİŞMEMELİ */
const once=await pg.evaluate(()=>window.FIT_CHALLENGE.ilerleme('bin-tekrar').biriken);
await pg.evaluate(()=>{const S=window.FIT_SHELL.state;
  S.antrenmanTamamla({ad:'Beyan antrenman',slug:'yuruyus',tarihISO:new Date().toISOString(),metrik:{tekrar:400},kaynak:'beyan'});});
await pg.waitForTimeout(300);
const sonra=await pg.evaluate(()=>window.FIT_CHALLENGE.ilerleme('bin-tekrar'));
console.log(' beyan elendi mi:', once, '→', sonra.biriken, '· elenen', sonra.elenenBeyan);

console.log(' kazanılan rozetler', JSON.stringify(await pg.evaluate(()=>window.FIT_ROZET.liste().filter(x=>x.kazanildi).map(r=>r.slug))));
console.log('KONSOL', hata.length, hata.slice(0,4));
await b.close();
