/* HUNİ KANITI — gerçek arayüzden: egzersiz-detay'da antrenman bitir →
   challenge ilerlemesi (seri adımı + süreli hedef) kendiliğinden ilerlesin.
   Sonda hiçbir yere elle veri YAZMAZ; yalnız kullanıcının bastığı düğmelere basar. */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';
const B='http://127.0.0.1:8788/';
const b=await chromium.launch();
const pg=await (await b.newContext({viewport:{width:1440,height:1200}})).newPage();
const hata=[]; pg.on('console',m=>{if(m.type()==='error')hata.push(m.text());});
pg.on('pageerror',e=>hata.push('PAGEERROR '+e.message));

await pg.goto(B+'challenge-v1.html?auth=1'); await pg.waitForTimeout(400);
await pg.evaluate(()=>{['dm_fit','dm_fit_challenge_v1','dm_fit_rozet_v1','dm_fit_ex'].forEach(k=>localStorage.removeItem(k));});

/* iki challenge'a katıl — düğmeye basarak, motora elle yazmadan */
for(const s of ['ekipmansiz-temel','bin-tekrar']){
  await pg.goto(B+'challenge-v1.html?slug='+s+'&auth=1'); await pg.waitForTimeout(700);
  await pg.locator('#chJoin').click(); await pg.waitForTimeout(400);
}
const oku=async()=>pg.evaluate(()=>{
  const C=window.FIT_CHALLENGE,R=window.FIT_ROZET;
  const a=C.ilerleme('ekipmansiz-temel'), b=C.ilerleme('bin-tekrar');
  return {seriAdim:a.biriken+'/'+a.hedef, seriSirada:a.siradaki?a.siradaki.ad:'—',
          sureli:b.biriken+'/'+b.hedef+' '+b.birimAd, sureliOran:b.oran,
          puan:R.puan(), kademe:R.kademe().ad, rozet:R.liste().filter(x=>x.durum==='kazanildi').length};
});
console.log('katıldı  ', JSON.stringify(await oku()));

/* GERÇEK ANTRENMAN: serinin 1. adımı `kopru` — sayfaya git, setleri kapat, bitir */
async function antrenman(slug){
  await pg.goto(B+'egzersiz-detay-v1.html?slug='+slug+'&auth=1'); await pg.waitForTimeout(800);
  const c=await pg.locator('#edSetList .ed-set-check').count();
  for(let i=0;i<c;i++){ await pg.locator('#edSetList .ed-set-check').nth(i).click(); await pg.waitForTimeout(90); }
  const tekrar=await pg.locator('#edTotalReps').innerText();
  await pg.locator('#edFinish').click(); await pg.waitForTimeout(600);
  return {slug, set:c, tekrar};
}
console.log('antrenman', JSON.stringify(await antrenman('kopru')));
await pg.goto(B+'challenge-v1.html?slug=ekipmansiz-temel&auth=1'); await pg.waitForTimeout(700);
console.log('1. adım sonrası', JSON.stringify(await oku()));

console.log('antrenman', JSON.stringify(await antrenman('superman')));
await pg.goto(B+'challenge-v1.html?slug=ekipmansiz-temel&auth=1'); await pg.waitForTimeout(700);
console.log('2. adım sonrası', JSON.stringify(await oku()));
console.log('adım listesi kapanan', await pg.locator('#trackSteps .fp-badge.ok').count(),
            '· açık', await pg.locator('#trackSteps a.btn-primary').count(),
            '· kilitli', await pg.locator('#trackSteps .fp-badge.off').count());
console.log('sıradaki bağlantı', await pg.locator('#trackSteps a.btn-primary').getAttribute('href'));

/* SIRA KURALI: 4. adımı 3. adımdan ÖNCE yapmak adımı kapatmamalı */
console.log('antrenman(sıra dışı)', JSON.stringify(await antrenman('hamle')));
await pg.goto(B+'challenge-v1.html?slug=ekipmansiz-temel&auth=1'); await pg.waitForTimeout(700);
console.log('sıra dışı sonrası', JSON.stringify(await oku()), '← adım sayısı ARTMAMALI');

console.log('KONSOL', hata.length, hata.slice(0,4));
await b.close();
