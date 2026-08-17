/* =====================================================================
   DADAFIT — PLANIM RAYI + HESABIM MENÜSÜ TESTİ (Faz 4 · belge §4 ve §5)
   ---------------------------------------------------------------------
   Neyi kanıtlar:
   1. Planım sekme rayı TAM ALTI kalem (belge §4) ve başlıklar belgedeki adlar.
   2. Rayda Enerji Defteri / Enerji Köprüsü / Sağlık Profili / Veri İzinleri YOK
      (§2 Enerji Defteri'ni ana menüye taşıyor, §5 Köprü'nün sekme olmamasını
      ve sağlık/veri kalemlerinin Hesabım'a geçmesini istiyor).
   3. Ray dışında kalan plan sayfaları YETİM DEĞİL: kendi banner/breadcrumb'ını
      hâlâ çözüyor (data-plan-page değeri PLAN_PAGES'te duruyor) ve başlığı boş değil.
   4. Hesabım menüsü Planım rayının kopyası değil; belge §5'in on dört modülünü
      taşıyor ve "Planım" için TEK giriş veriyor.
   5. Hesabım menüsündeki hiçbir hedef kırık değil (dosya diskte var).
   6. Menüde "DadaMutfak'a dön" kalmadı (§1).

   Çalıştırma:
     python3 -m http.server 8811 &
     node tests/plan-account.mjs
   ===================================================================== */
import { chromium } from './_pw.mjs';
import { readdirSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:8811';
const REPO = new URL('..', import.meta.url).pathname;
const ONDISK = new Set(readdirSync(REPO).filter(f => f.endsWith('.html')));

const BEKLENEN_SEKME = ['Bugün','Plan ve Takvim','Aktivite Kayıtlarım','İlerlemem','Kaydettiklerim','Antrenörüm'];
const RAYDA_OLMAMALI = ['Enerji Defteri','Enerji Köprüsü','Sağlık ve Hareket Profilim','Veri ve İzinlerim','Challenge ve Rozetler'];
/* §5'in saydığı on dört modül */
const HESAP_MODULLERI = ['Profil Bilgilerim','Sağlık ve Hareket Profilim','Veri ve İzinlerim',
  'Bildirim Tercihlerim','Bağlı Uygulamalar','Üyelik ve Paketim','Ödeme Geçmişim','Faturalarım',
  'Güvenlik','Dil ve Bölge','Destek Taleplerim','Hesabı Dondurma','Verilerimi İndir','Hesabımı Sil'];
/* ray dışı ama Planım kabuğunu kullanan sayfalar — yetim kalmamalı */
const RAY_DISI = ['enerji-defteri-v1.html','fit-planim-rozetler-v1.html',
                  'fit-planim-saglik-profil-v1.html','fit-planim-veri-izin-v1.html'];

let fail = 0; const bad = [];
const rec = m => { fail++; bad.push(m); };
const ok  = m => console.log('  ✓ ' + m);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{ width:1440, height:1000 } });
await ctx.addInitScript(() => { try{
  localStorage.setItem('dm-cookie-consent','accepted');
  localStorage.setItem('dm_user', JSON.stringify({auth:true, roles:['kullanici'], verified:false, level:0}));
}catch(e){} });
const page = await ctx.newPage();

/* ---------------- 1·2 · sekme rayı ---------------- */
await page.goto(`${BASE}/fit-planim-v1.html`, { waitUntil:'load' });
await page.waitForTimeout(700);
const tabs = await page.evaluate(() =>
  [...document.querySelectorAll('.pf-tabs .dt')].map(a => ({ t:a.textContent.trim(), href:a.getAttribute('href') })));

if(tabs.length !== 6) rec(`Planım rayı ${tabs.length} kalem — belge §4 ALTI istiyor: ${tabs.map(t=>t.t).join(' · ')}`);
else ok(`Planım rayı 6 kalem: ${tabs.map(t=>t.t).join(' · ')}`);

for(const beklenen of BEKLENEN_SEKME)
  if(!tabs.some(t => t.t === beklenen)) rec(`rayda "${beklenen}" sekmesi yok (belge §4)`);
for(const olmamali of RAYDA_OLMAMALI)
  if(tabs.some(t => t.t === olmamali)) rec(`rayda "${olmamali}" DURUYOR — belge onu Planım sekmesi olmaktan çıkardı`);
if(!bad.length) ok('ray içeriği belgeyle birebir (fazlalık yok, eksik yok)');

/* rayda kırık hedef olmasın */
for(const t of tabs){
  const f = (t.href||'').split('#')[0].split('?')[0];
  if(f && !ONDISK.has(f)) rec(`ray sekmesi kırık hedefe gidiyor: ${t.t} → ${f}`);
}

/* ---------------- 3 · ray dışı sayfalar yetim mi ---------------- */
for(const f of RAY_DISI){
  await page.goto(`${BASE}/${f}`, { waitUntil:'load' });
  await page.waitForTimeout(450);
  const r = await page.evaluate(() => {
    const h1 = document.querySelector('.lib-top h1, .fp-top h1, main h1');
    const crumb = document.querySelector('.lib-crumb .cur');
    return { h1: h1 ? h1.textContent.trim() : null,
             crumb: crumb ? crumb.textContent.trim() : null,
             tabs: document.querySelectorAll('.pf-tabs .dt').length };
  });
  if(!r.h1)                 rec(`${f}: başlık boş — banner çözümü kırıldı (data-plan-page PLAN_PAGES'te yok)`);
  else if(/^\s*$/.test(r.h1)) rec(`${f}: başlık boş`);
  else ok(`${f}: başlık "${r.h1}" · breadcrumb "${r.crumb}" · ray ${r.tabs} sekme`);
}

/* ---------------- 4·5·6 · Hesabım menüsü ---------------- */
await page.goto(`${BASE}/dadafit-hub-v1.html?auth=1`, { waitUntil:'load' });
await page.waitForTimeout(700);
const acct = await page.evaluate(() =>
  [...document.querySelectorAll('.acct-menu a')].map(a => ({
    t: (a.querySelector('span') ? a.querySelector('span').childNodes[0].textContent : a.textContent).trim(),
    href: a.getAttribute('href') })));

if(!acct.length) rec('hesap menüsü boş / bulunamadı (?auth=1 ile üye görünümü açılmalıydı)');
else {
  ok(`hesap menüsü ${acct.length} kalem`);
  for(const m of HESAP_MODULLERI)
    if(!acct.some(a => a.t === m)) rec(`Hesabım'da "${m}" kalemi yok (belge §5)`);

  /* Planım rayının kopyası olmamalı: ray sekmelerinden en fazla "Planım" girişi olsun */
  const rayKopya = acct.filter(a => BEKLENEN_SEKME.includes(a.t) && a.t !== 'Bugün');
  if(rayKopya.length) rec(`Hesabım Planım rayını tekrarlıyor (§5 "karıştırılmamalı"): ${rayKopya.map(a=>a.t).join(', ')}`);
  else ok('Hesabım Planım rayını tekrarlamıyor — Planım için tek giriş');

  const planEntries = acct.filter(a => a.t === 'Planım');
  if(planEntries.length !== 1) rec(`Hesabım'da "Planım" girişi ${planEntries.length} adet — tek olmalı`);

  /* kırık hedef */
  const broken = new Set();
  for(const a of acct){
    const h = a.href || '';
    if(/^(https?:|mailto:|tel:|#|javascript:)/.test(h)) continue;
    const f = h.split('#')[0].split('?')[0];
    if(f && f.endsWith('.html') && !ONDISK.has(f)) broken.add(`${a.t} → ${f}`);
  }
  if(broken.size) rec('hesap menüsünde kırık hedef: ' + [...broken].join(', '));
  else ok('hesap menüsündeki tüm hedefler diskte var');

  if(acct.some(a => /DadaMutfak/i.test(a.t))) rec('hesap menüsünde "DadaMutfak" kalemi kaldı (belge §1)');
  else ok('hesap menüsünde DadaMutfak kalemi yok');
}

/* drawer'da da DadaMutfak kalmasın */
const drawerMutfak = await page.evaluate(() =>
  [...document.querySelectorAll('#drawer a')].filter(a => /DadaMutfak/i.test(a.textContent)).length);
if(drawerMutfak) rec(`drawer'da ${drawerMutfak} adet "DadaMutfak" bağlantısı kaldı (belge §1)`);
else ok('drawer\'da DadaMutfak bağlantısı yok');

await browser.close();
console.log(`\n${fail} sorun`);
if(bad.length){ console.log('\nSORUNLAR:'); bad.forEach(b => console.log('  ✗ ' + b)); process.exit(1); }
console.log('✓ Planım altı sekme · ray dışı sayfalar yetim değil · Hesabım §5 modülleriyle ayrı.');
