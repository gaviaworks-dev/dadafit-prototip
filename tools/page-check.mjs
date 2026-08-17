/* =====================================================================
   DADAFIT — TEK SAYFA KALİTE KAPISI
   ---------------------------------------------------------------------
   Faz 2 göçünde ve yeni sayfalarda kullanılır. Ölçtüğü şeyler:

   1. Ortak kabuk gerçekten mount olmuş mu (header + nav + footer + drawer + alt bar)
   2. Konsol hatası / JS istisnası
   3. 4xx dönen alt kaynak (kırık görsel, eksik dosya)
   4. Yatay taşma (documentElement + main/footer içindeki öğeler)
   5. İçerik sabit header'ın ALTINDA kalmıyor (üst üste binme)
   6. Sayfadaki iç bağlantılar diskte var mı (kırık hedef)
   7. Marka: görünen metinde "DadaMutfak" kalıntısı, turuncu #E14827 kalıntısı
   8. Boş href="#" sayısı (belge §23)

   Sorun bulursa çıkış kodu 1.

   KULLANIM
     export PW_HOME=<playwright-core kurulum koku>
     node tools/page-check.mjs sss-v1.html 1440
     node tools/page-check.mjs sss-v1.html 390 --base http://localhost:8811
   ===================================================================== */
import { chromium } from '../tests/_pw.mjs';
import { existsSync, readdirSync } from 'node:fs';

const file  = process.argv[2];
const width = +(process.argv[3] || 1440);
const bi    = process.argv.indexOf('--base');
const BASE  = bi > -1 ? process.argv[bi + 1] : 'http://localhost:8811';
if(!file){ console.error('kullanım: node tools/page-check.mjs <sayfa>.html [genislik]'); process.exit(2); }

const REPO  = new URL('..', import.meta.url).pathname;
const ONDISK = new Set(readdirSync(REPO).filter(f => f.endsWith('.html')));

const problems = [], notes = [];
const bad = m => problems.push(m);
const ok  = m => notes.push('✓ ' + m);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{ width, height: 900 } });
await ctx.addInitScript(() => { try{ localStorage.setItem('dm-cookie-consent','accepted'); }catch(e){} });
const page = await ctx.newPage();

const errs = [], http4 = [];
page.on('pageerror', e => errs.push('pageerror: ' + e.message.split('\n')[0]));
page.on('console',  m => { if(m.type() === 'error') errs.push('console.error: ' + m.text().slice(0,140)); });
page.on('response', r => { if(r.status() >= 400) http4.push(`${r.status()} ${r.url().replace(BASE,'')}`); });

const resp = await page.goto(`${BASE}/${file}`, { waitUntil:'load' }).catch(e => { bad('sayfa açılmadı: ' + e.message); return null; });
if(resp && resp.status() >= 400) bad(`sayfanın kendisi ${resp.status()} döndü`);
await page.waitForTimeout(900);

/* ---------- 1 · kabuk mount ---------- */
const shell = await page.evaluate(() => ({
  header:  !!document.querySelector('.header'),
  nav:     document.querySelectorAll('.header .nav .nav-item').length,
  footer:  !!document.querySelector('.footer'),
  footCols:document.querySelectorAll('.footer .foot-col').length,
  drawer:  !!document.querySelector('#drawer'),
  bottom:  document.querySelectorAll('.bottom-nav .bn-item').length,
  main:    !!document.querySelector('main#pageMain'),
  brand:   document.body.getAttribute('data-brand'),
  pageKey: document.body.getAttribute('data-fit-page'),
  mounts:  document.querySelectorAll('#fitShellTop, #fitShellBottom').length
}));
if(!shell.header)      bad('kabuk header YOK — fit-shell.js mount olmamış');
if(shell.nav === 0)    bad('header nav kalemi yok');
if(!shell.footer)      bad('kabuk footer YOK');
if(shell.footCols===0) bad('footer kolonları yok');
if(!shell.drawer)      bad('mobil drawer YOK');
if(shell.bottom === 0) bad('mobil alt bar YOK');
if(shell.bottom > 5)   bad(`mobil alt bar ${shell.bottom} öğe — belge §3 en fazla 5 diyor`);
if(!shell.main)        bad('main#pageMain YOK');
if(shell.brand !== 'fit') bad(`data-brand="${shell.brand}" — "fit" olmalı`);
if(!shell.pageKey)     bad('data-fit-page yok');
if(shell.mounts > 0)   bad('mount div\'i hâlâ DOM\'da — fit-shell.js onu değiştirmemiş');
if(!problems.length)   ok(`kabuk mount: nav ${shell.nav} · footer ${shell.footCols} kolon · alt bar ${shell.bottom} · page="${shell.pageKey}"`);

/* ---------- 2·3 · hata ve 4xx ---------- */
if(errs.length)  bad('konsol/JS hatası:\n      ' + [...new Set(errs)].join('\n      '));
else ok('konsol hatası yok');
if(http4.length) bad('4xx istek:\n      ' + [...new Set(http4)].slice(0,10).join('\n      '));
else ok('4xx istek yok');

/* ---------- 4 · yatay taşma ---------- */
const of = await page.evaluate(() => {
  const root = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  const w = document.documentElement.clientWidth, out = [];
  document.querySelectorAll('main *, .footer *').forEach(el => {
    const s = getComputedStyle(el);
    if(s.position === 'fixed' || s.display === 'none' || s.visibility === 'hidden') return;
    const r = el.getBoundingClientRect();
    if(r.width === 0 || r.height === 0) return;
    if(r.right <= w + 2) return;
    /* tasarım gereği yatay kayan ray içindeyse taşma sayılmaz */
    let sc = el.parentElement, inScroller = false;
    while(sc && sc !== document.body){
      const ss = getComputedStyle(sc);
      if((ss.overflowX === 'auto' || ss.overflowX === 'scroll') && sc.scrollWidth > sc.clientWidth + 1){ inScroller = true; break; }
      sc = sc.parentElement;
    }
    if(!inScroller) out.push(`${el.tagName.toLowerCase()}.${(el.className||'').toString().split(' ')[0]} sağ=${Math.round(r.right)}`);
  });
  return { root, out: [...new Set(out)].slice(0,6) };
});
if(of.root > 1)     bad(`kök yatay taşma: scrollWidth farkı ${of.root}px`);
if(of.out.length)   bad('taşan öğe:\n      ' + of.out.join('\n      '));
if(of.root <= 1 && !of.out.length) ok('yatay taşma yok');

/* ---------- 5 · içerik header'ın altında kalmıyor ---------- */
const clear = await page.evaluate(() => {
  const h = document.querySelector('.header');
  if(!h) return null;
  const hb = h.getBoundingClientRect().bottom;
  const main = document.querySelector('main#pageMain');
  /* main içindeki ilk GÖRÜNÜR metin taşıyan öğeyi bul */
  let el = null;
  for(const c of main.querySelectorAll('h1,h2,p,a,button,input,li')){
    const r = c.getBoundingClientRect();
    if(r.height > 0 && r.width > 0){ el = { cls: c.className || c.tagName, top: Math.round(r.top) }; break; }
  }
  return { headerBottom: Math.round(hb), first: el, atTop: h.classList.contains('at-top') };
});
if(clear && clear.first){
  if(clear.first.top < clear.headerBottom - 1)
    bad(`içerik header'ın altında kalıyor: ilk öğe (${clear.first.cls}) top=${clear.first.top} < header.bottom=${clear.headerBottom}`);
  else ok(`içerik header'ı geçiyor (ilk öğe top=${clear.first.top}, header alt=${clear.headerBottom})`);
}

/* ---------- 6 · kırık iç bağlantı ---------- */
const links = await page.evaluate(() =>
  [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')));
const broken = new Set(), emptyHref = [];
for(const h of links){
  if(h === '#'){ emptyHref.push(h); continue; }
  if(/^(https?:|mailto:|tel:|#|javascript:)/.test(h)) continue;
  const f = h.split('#')[0].split('?')[0];
  if(!f) continue;
  if(f.endsWith('.html') && !ONDISK.has(f)) broken.add(f);
}
if(broken.size) bad('kırık iç bağlantı: ' + [...broken].join(', '));
else ok(`iç bağlantılar sağlam (${links.length} bağlantı tarandı)`);
if(emptyHref.length) notes.push(`! href="#" sayısı: ${emptyHref.length} (belge §23 boş bağlantı bırakma diyor)`);

/* ---------- 7 · marka kalıntısı ---------- */
const brandLeft = await page.evaluate(() => ({
  visible: (document.body.innerText.match(/DadaMutfak/gi) || []).length,
  title:   /dadamutfak/i.test(document.title),
  orange:  [...document.querySelectorAll('*')].filter(e => {
              const s = getComputedStyle(e);
              return /225,\s*72,\s*39/.test(s.backgroundColor) || /225,\s*72,\s*39/.test(s.color);
            }).length
}));
if(brandLeft.visible) bad(`görünen metinde ${brandLeft.visible} kez "DadaMutfak" (belge §1)`);
if(brandLeft.title)   bad('<title> içinde "DadaMutfak" (belge §1)');
if(brandLeft.orange)  bad(`${brandLeft.orange} öğede turuncu #E14827 kalıntısı (belge §1)`);
if(!brandLeft.visible && !brandLeft.title && !brandLeft.orange) ok('marka dili temiz (DadaMutfak/turuncu yok)');

await browser.close();

console.log(`\n=== ${file} @ ${width}px ===`);
notes.forEach(n => console.log('  ' + n));
if(problems.length){
  console.log(`\n  ${problems.length} SORUN:`);
  problems.forEach(p => console.log('  ✗ ' + p));
  process.exit(1);
}
console.log('  → temiz');
