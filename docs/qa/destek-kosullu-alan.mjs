/* Destek · yeni talep formu — KOŞULLU BAĞLAM ALANLARI ölçümü
   Koşu: PW_HOME=~/.pw node docs/qa/destek-kosullu-alan.mjs [seed]
   `seed` → kabuk deposuna 3 örnek randevu yazar (dolu seçici hâli).
   Ölçtüğü: kategori→alan matrisi · seçenek kaynağı · gizlenince değer
   temizliği · gönderim · sekme sırası · 44px hedefi · taşma · konsol. */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';

const BASE = 'http://127.0.0.1:8788/destek-v1.html?auth=1#yeni';
const SEED = process.argv[2] === 'seed';

const RANDEVU = [
  {antrenor:'Selin Aksoy', slug:'selin-aksoy', hizmet:'Birebir online seans', fiyat:'₺450',
   tarih:'14 Ağustos 2026', saat:'19:00', durum:'tamamlandi'},
  {antrenor:'Mert Özkan', slug:'mert-ozkan', hizmet:'Form kontrolü', fiyat:'₺450',
   tarih:'2 Eylül 2026', saat:'10:30', durum:'onaylandi'},
  {antrenor:'Deniz Kaya', slug:'deniz-kaya', hizmet:'Başlangıç değerlendirmesi', fiyat:'₺450',
   tarih:'9 Eylül 2026', saat:'18:15', durum:'onay-bekliyor'}
];

const b = await chromium.launch();
const errs = [];
const ctx = await b.newContext({viewport:{width:1440,height:1024}});
const p = await ctx.newPage();
p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));

/* SONDA NOTU (2. kusur): önce `goto('...?auth=1')` → localStorage yaz →
   `goto('...?auth=1#yeni')` yapıyordum. İkincisi YALNIZ FRAGMAN farkı
   taşıdığı için Playwright sayfayı YENİDEN YÜKLEMEZ — sayfa scriptleri
   bir daha koşmadı ve seçici, tohum ATILMADAN ÖNCEKİ hâlini gösterdi.
   "Kod randevuyu okumuyor" diye rapor edilecekti. Tohum artık
   `addInitScript` ile, sayfa scriptlerinden ÖNCE atılıyor. */
if (SEED) await ctx.addInitScript(r => {
  localStorage.setItem('dm_fit', JSON.stringify({surum:2, randevular:r}));
}, RANDEVU);
await p.goto(BASE);
await p.waitForTimeout(400);

const KAT = await p.$$eval('#tkKategori option', o => o.map(x => x.textContent.trim()));
console.log('kategori seçeneği (placeholder dahil): ' + KAT.length);
KAT.forEach((k,i) => console.log('  ' + i + ' · ' + k));

const alanlar = await p.$$eval('#tkForm .fk-field', els => els.map(e => {
  const c = e.querySelector('input,select,textarea');
  return { id: c ? c.id : '(yok)', label: (e.querySelector('label')||{}).textContent?.trim().replace(/\s+/g,' ') || '' };
}));
console.log('form alanı sayısı: ' + alanlar.length);
alanlar.forEach(a => console.log('  ' + a.id + ' — ' + a.label));

const rndOpt = await p.$$eval('#tkRandevu option', o => o.map(x => x.value + ' | ' + x.textContent.trim() + (x.disabled?' [disabled]':'')));
console.log('#tkRandevu seçenek: ' + rndOpt.length);
rndOpt.forEach(o => console.log('  ' + o));
const dl = await p.$$eval('#tkOdemeListe option', o => o.map(x => x.value + ' | ' + (x.label||x.textContent).trim())).catch(()=>[]);
console.log('#tkOdemeListe seçenek: ' + dl.length);
dl.forEach(o => console.log('  ' + o));

async function durum(tag) {
  return await p.evaluate(() => {
    const g = id => document.getElementById(id);
    const gor = el => !!el && el.getClientRects().length > 0;
    const rec = (fid, cid) => {
      const c = g(cid);
      /* SONDA NOTU: taban ölçümde #tkRandevuAlan/#tkOdemeAlan HENÜZ YOKTU
         ve `gor(null)` her satıra false yazdı — "hiçbir alan görünmüyor"
         diye okunacaktı. Görünürlük artık kontrolün KENDİ .fk-field
         kabından ölçülüyor; kap adı olsa da olmasa da doğru cevap gelir. */
      const f = g(fid) || (c ? c.closest('.fk-field') : null);
      return { gorunur: gor(f), hiddenAttr: f ? f.hasAttribute('hidden') : null,
               req: c ? c.hasAttribute('required') : null,
               ariaReq: c ? c.getAttribute('aria-required') : null,
               deger: c ? c.value : null,
               ctrlGorunur: gor(c),
               h: c ? Math.round(c.getBoundingClientRect().height) : 0 };
    };
    const wrap = g('tkBaglam');
    return { wrapGorunur: gor(wrap), wrapHidden: wrap ? wrap.hasAttribute('hidden') : null,
             randevu: rec('tkRandevuAlan','tkRandevu'), odeme: rec('tkOdemeAlan','tkOdeme') };
  });
}

console.log('\n--- kategori → alan matrisi (1440) ---');
console.log('kategori | randevu görünür | ödeme görünür | randevu req | ödeme req | randevu değer | ödeme değer');
const reqSay = await p.$$eval('#tkForm [required]', e => e.map(x=>x.id).join(', '));
console.log('form [required] alanları: ' + reqSay);
const bos = await durum();
console.log('(seçilmedi) | ' + bos.randevu.gorunur + ' | ' + bos.odeme.gorunur + ' | ' + bos.randevu.req + ' | ' + bos.odeme.req + ' | "' + bos.randevu.deger + '" | "' + bos.odeme.deger + '"');

for (let i = 1; i < KAT.length; i++) {
  await p.selectOption('#tkKategori', { index: i });
  await p.waitForTimeout(120);
  const d = await durum();
  console.log(KAT[i] + ' | ' + d.randevu.gorunur + ' | ' + d.odeme.gorunur + ' | ' + d.randevu.req + ' | ' + d.odeme.req + ' | "' + d.randevu.deger + '" | "' + d.odeme.deger + '"');
}

/* kirlilik nöbeti: alan doldur, kategoriyi değiştir, değer kaldı mı */
console.log('\n--- gizlenince değer temizleniyor mu ---');
const iOdeme = KAT.findIndex(k => /Üyelik ve fatura/.test(k));
const iRnd   = KAT.findIndex(k => /Antrenör ve randevu/.test(k));
const iHesap = KAT.findIndex(k => /Hesap ve giriş/.test(k));
if (iOdeme > 0) {
  await p.selectOption('#tkKategori', { index: iOdeme });
  await p.fill('#tkOdeme', 'DFT-2026-004128');
  console.log('ödeme doldurdu: "' + await p.inputValue('#tkOdeme') + '"');
  await p.selectOption('#tkKategori', { index: iHesap });
  await p.waitForTimeout(100);
  const d = await durum();
  console.log('kategori Hesap ve giriş → ödeme görünür:' + d.odeme.gorunur + ' değer:"' + d.odeme.deger + '"');
}
if (iRnd > 0) {
  await p.selectOption('#tkKategori', { index: iRnd });
  await p.waitForTimeout(100);
  const opts = await p.$$eval('#tkRandevu option:not([disabled])', o => o.length);
  if (opts > 1) { await p.selectOption('#tkRandevu', { index: 1 }); }
  console.log('randevu seçildi: "' + await p.inputValue('#tkRandevu') + '"');
  await p.selectOption('#tkKategori', { index: iHesap });
  await p.waitForTimeout(100);
  const d = await durum();
  console.log('kategori Hesap ve giriş → randevu görünür:' + d.randevu.gorunur + ' değer:"' + d.randevu.deger + '"');
}

/* gönderim */
console.log('\n--- gönderim ---');
await p.selectOption('#tkKategori', { index: iRnd > 0 ? iRnd : 1 });
await p.fill('#tkBaslik', 'Randevum listede iki kez görünüyor');
await p.fill('#tkMesaj', 'Cuma günkü seansım Antrenörüm ekranında iki satır olarak duruyor.');
const rowsOnce = await p.$$eval('#tkList .set-row', e => e.length).catch(()=>-1);
await p.click('#tkForm button[type=submit]');
await p.waitForTimeout(300);
const okVis = await p.evaluate(() => { const o = document.getElementById('tkOk'); return o && o.getClientRects().length > 0; });
const okTxt = await p.evaluate(() => { const o = document.getElementById('tkOk'); return o ? o.innerText.replace(/\s+/g,' ').slice(0,120) : ''; });
const rowsAfter = await p.$$eval('#tkList .set-row', e => e.length).catch(()=>-1);
const sonra = await durum();
console.log('durum şeridi görünür: ' + okVis + ' | "' + okTxt + '"');
console.log('liste satırı ' + rowsOnce + ' → ' + rowsAfter);
console.log('reset sonrası → wrap görünür:' + sonra.wrapGorunur + ' randevu:' + sonra.randevu.gorunur + ' ödeme:' + sonra.odeme.gorunur);

/* dört genişlik: taşma + dokunma hedefi */
console.log('\n--- genişlik nöbeti (kategori = Antrenör ve randevu) ---');
for (const w of [1440,1024,768,390]) {
  await p.setViewportSize({width:w, height:900});
  await p.goto(BASE); await p.waitForTimeout(350);
  await p.selectOption('#tkKategori', { index: iRnd > 0 ? iRnd : 1 });
  await p.waitForTimeout(120);
  const tasma = await p.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  const hs = await p.evaluate(() => {
    const ids = ['tkKategori','tkRandevu','tkOdeme'];
    return ids.map(i => { const e = document.getElementById(i); return i + ':' + (e && e.getClientRects().length ? Math.round(e.getBoundingClientRect().height) : 'gizli'); }).join(' ');
  });
  await p.selectOption('#tkKategori', { index: iOdeme > 0 ? iOdeme : 1 });
  await p.waitForTimeout(120);
  const tasma2 = await p.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  const hs2 = await p.evaluate(() => { const e = document.getElementById('tkOdeme'); return e && e.getClientRects().length ? Math.round(e.getBoundingClientRect().height) : 'gizli'; });
  console.log(w + 'px → taşma(randevu) ' + tasma + ' · taşma(ödeme) ' + tasma2 + ' · yükseklik ' + hs + ' tkOdeme:' + hs2);
}

console.log('\nkonsol hatası: ' + errs.length);
errs.forEach(e => console.log('  ' + e));
await b.close();

/* ---- ikinci geçiş: sekme sırası · dokunma hedefi · ekran görüntüsü ---- */
await (async () => {
const R=[{antrenor:'Selin Aksoy',hizmet:'Birebir online seans',tarih:'14 Ağustos 2026',saat:'19:00',durum:'tamamlandi'}];
const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1440,height:1024}});
await ctx.addInitScript(r=>localStorage.setItem('dm_fit',JSON.stringify({surum:2,randevular:r})),R);
const p=await ctx.newPage(); const errs=[];
p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
await p.goto('http://127.0.0.1:8788/destek-v1.html?auth=1#yeni'); await p.waitForTimeout(400);

for (const [ad, idx] of [['Antrenör ve randevu',5],['Üyelik ve fatura',2]]) {
  await p.selectOption('#tkKategori',{index:idx}); await p.waitForTimeout(120);
  await p.focus('#tkKategori');
  const sira=['tkKategori'];
  for(let i=0;i<6;i++){ await p.keyboard.press('Tab');
    sira.push(await p.evaluate(()=>{const a=document.activeElement;return a.id||a.className||a.tagName;})); }
  console.log(ad+' → sekme sırası: '+sira.join(' → '));
  const duy = await p.evaluate(()=>document.getElementById('tkAlanDuyuru').textContent);
  console.log('  aria-live duyurusu: "'+duy+'"');
}
console.log('\n--- dokunma hedefi (44px tabanı) ---');
for (const w of [1440,1024,768,390]) {
  await p.setViewportSize({width:w,height:900});
  await p.goto('http://127.0.0.1:8788/destek-v1.html?auth=1#yeni'); await p.waitForTimeout(350);
  await p.selectOption('#tkKategori',{index:5}); await p.waitForTimeout(100);
  const a=await p.evaluate(()=>['tkKategori','tkRandevu'].map(i=>{const e=document.getElementById(i);
    return i+':'+Math.round(e.getBoundingClientRect().height)+(e.getBoundingClientRect().height>=44?'✓':'✗');}).join(' '));
  await p.selectOption('#tkKategori',{index:2}); await p.waitForTimeout(100);
  const o=await p.evaluate(()=>{const e=document.getElementById('tkOdeme');
    return 'tkOdeme:'+Math.round(e.getBoundingClientRect().height)+(e.getBoundingClientRect().height>=44?'✓':'✗');});
  const t=await p.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth));
  console.log(w+'px → '+a+' '+o+' · taşma '+t);
}
await p.setViewportSize({width:1440,height:1100});
await p.goto('http://127.0.0.1:8788/destek-v1.html?auth=1#yeni'); await p.waitForTimeout(400);
await p.selectOption('#tkKategori',{index:5}); await p.waitForTimeout(200);
await p.locator('#tkForm').screenshot({path:'/Users/gaviaworks/Developer/Projects/dadafit-prototip/docs/screenshots/destek-kosullu-randevu.png'});
await p.selectOption('#tkKategori',{index:2}); await p.waitForTimeout(200);
await p.locator('#tkForm').screenshot({path:'/Users/gaviaworks/Developer/Projects/dadafit-prototip/docs/screenshots/destek-kosullu-odeme.png'});
console.log('\nkonsol hatası: '+errs.length); errs.forEach(e=>console.log('  '+e));
await b.close();
})();
