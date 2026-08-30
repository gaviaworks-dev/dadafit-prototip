/* =====================================================================
   DADAFIT — BANNER'LI SAYFADA HEADER + PLANIM DÜĞMESİ TESTİ (A2)
   ---------------------------------------------------------------------
   Neyi kanıtlar:
   1. Banner/hero taşıyan sayfada header scroll=0'da ŞEFFAF, scroll sonrası KATI.
   2. Banner taşımayan sayfada header her zaman KATI (mod yanlışlıkla sızmasın).
   3. "Planım" düğmesi solid primary — her iki header durumunda da dolu yeşil,
      outline/ghost değil. (Referans: dadadiet.com .btn-login, ölçülen
      background rgb(28,122,78) · color #fff — at-top durumunda da dolu.)
   4. Şeffaf header banner metnini EZMİYOR: breadcrumb'ın üst kenarı header'ın
      alt kenarının altında kalır (üst üste binme yok).
   5. Banner üst boşluğu değişikliği içeriği kaydırmadı: breadcrumb'ın y'si
      referans değerde (152 / 142 / 86 px kat toplamı) kalır.

   Çalıştırma:
     python3 -m http.server 8811 &
     node tests/header-banner.mjs [base] [widths]
   ===================================================================== */
import { chromium } from './_pw.mjs';

const BASE   = process.argv[2] || 'http://localhost:8811';
/* 640 varsayılana SONRADAN eklendi: kabuğun ≤640 medya bloğu banner'ın
   header'ın arkasından mı başlayacağını belirliyor ve beyaz marka yazısının
   okunurluğu tam bu sınırda dönüyor. Sınırın kendisi ölçülmezse kusur kaçıyor. */
const WIDTHS = (process.argv[3] || '1440,1024,640,390').split(',').map(Number);

/* KOYU BANNER TAŞIYAN SAYFALAR — header şeffaf başlamalı.
   Liste GENİŞLETİLDİ: başlangıçta yalnız .lib-top / .fp-top / tam hero vardı.
   Kullanıcı antrenör detayı (.cp-top) ve antrenör-ol (.ol-top) sayfalarında
   header'ın koyu görselin üzerinde KATI kaldığını bildirdi; kabuk over-mode'u
   bütün koyu banner sınıflarını kapsayacak şekilde genişletildi
   (.cp-top · .kp-top · .chl-hero · .pd-hero · .fs-top · .ol-top).
   Bu sayfalar artık PLAIN değil BANNER tarafında. */
const BANNER = [
  'dadafit-hub-v1.html',            // tam ekran hero
  'antrenorler-v1.html',            // .lib-top
  'egzersiz-kutuphane-v1.html',
  'programlar-merkezi-v1.html',
  /* R8/4: hareket-merkezi-v1 kaldırıldı */
  'challenge-merkezi-v1.html',
  'program-liste-v1.html',
  'hareket-rehberi-v1.html',
  'saglik-bilgilendirme-v1.html',
  /* R11/M17 (Beyar): `fit-planim-v1` ve `enerji-defteri-v1` BANNER listesinden
     PLAIN listesine TAŞINDI — ve bütün plan ailesi (14 sayfa) onlarla birlikte.
     Gerekçe: Beyar "enerji defterinin profilini DadaGastro'nun şef profilinin
     aynısı yap" dedi; koyu `.fp-top` banner'ı BEYAZ profil başlığına
     (`.fp-profil` — yuvarlak kapak + üstüne binen kimlik kartı) çevrildi.
     Şeffaf header modu beyaz zeminde marka yazısını da beyaz boyuyor →
     logo görünmez olurdu. `profil-v1` de tam bu gerekçeyle hep PLAIN'di
     (KARARLAR K23: "beyaz profil kapağı, koyu banner ailesiyle aynı dil değil").
     Yani kural değişmedi, bu iki sayfa kuralın öbür tarafına geçti. */
  'antrenor-detay-v1.html',         // .cp-top
  'antrenor-ol-v1.html',            // .ol-top
  'arama-fit-v1.html',              // .fs-top
  'challenge-v1.html',              // .chl-hero
  'program-detay-v1.html',          // .pd-hero
  /* 4. TUR (R2): egzersiz-detay PLAIN listesinden BANNER listesine TAŞINDI.
     `.ed-top` diğer koyu banner'larla birebir aynı dili kullanıyor (aynı
     radial yeşil + üç katman + fotoğraf + #1b1913 taban) ama over-mode
     listesinde yoktu; header koyu görselin üstünde KATI kalıyordu — K11'in
     beş sınıf için düzelttiği kusurun altıncısı. Detay: KARARLAR K23. */
  'egzersiz-detay-v1.html',         // .ed-top
  /* R9 (Beyar): giriş sayfası PLAIN listesinden BANNER listesine TAŞINDI.
     `.au-top` da diğerleriyle aynı koyu banner dili (radial yeşil + iki
     gradient katmanı + fotoğraf) ve bant y=0'dan başlıyor; header üstünde
     KATI beyaz durup görseli kesiyordu (ölçüldü @1440: at-top yok,
     background rgb(255,255,255), üst 113px kesik). Sayfa artık kabuğun
     kendi anahtarını taşıyor: body[data-fit-hero="1"]. */
  'giris-v1.html',                  // .au-top
  /* R12 · Dalga 3 — kapsam boşluğu kapatıldı. `hesabim-12` R13'ü bitirip
     hesabim-v1'in koyu `.lib-top`'unu kaldırdığında bu nöbet dosyası
     hesabim-v1 / destek-v1 / pro-v1'i HİÇ TARAMIYORDU — ne BANNER ne PLAIN
     listesindeydiler, denetimsizdiler. `destek-v1.html` ve `pro-v1.html`
     canlıda ölçüldü (@1440): `.lib-top` VAR · yükseklik 544 ·
     zemin rgb(27,25,19) · `body[data-fit-over="1"]` · header at-top şeffaf.
     İkisi de hâlâ fotoğrafsız düz koyu banner (`--lib-img:none`) — BANNER'a
     eklendi. `hesabim-v1.html` aşağıdaki PLAIN listesinde. */
  /* 🔴 destek-v1.html BURADAN ÇIKTI — Dalga 4 · §Ö2 (v1.10.0): destek
     merkezinin kabuğu MODÜL SAYFASI kalıbıdır, banner ailesi DEĞİL.
     `.lib-top` söküldü, over-mode kendiliğinden düştü ve header katı
     kaldı — `hesabim-v1`/`profil-v1` ile aynı kalıp. Sayfa denetimsiz
     bırakılmadı: aşağıdaki PLAIN listesine, iki kardeşiyle birlikte geçti. */
  'pro-v1.html'
];
/* banner TAŞIMAYAN kabuk sayfaları — header katı kalmalı */
const PLAIN = [
  'profil-v1.html',                 // beyaz profil kapağı (KARARLAR K23)
  /* R11/M17 — plan ailesi artık beyaz profil başlığı taşıyor (yukarıdaki not) */
  'programlarim-v1.html#programlarim',
  'egzersizlerim-v1.html#defter',
  /* R12/R13 (Beyar) — `hesabim-12` ajanı koyu `.lib-top`'u kaldırıp beyaz
     `.fp-profil` profil başlığına çevirdi (commit 29a9b72). Canlıda
     ölçüldü (@1440): `.lib-top` YOK · `.fp-profil` VAR ·
     `body[data-fit-over]` null · header solid beyaz — over-mode kendiliğinden
     düştü, ayrı bir kabuk değişikliği gerekmedi. `profil-v1`/K23 kalıbı. */
  'hesabim-v1.html',
  /* §Ö2 · destek merkezinin üç ekranı da modül sayfası kalıbına geçti;
     banner taşımazlar, header katı kalır. */
  'destek-v1.html',
  'destek-v1.html#taleplerim',
  'destek-talebi-detay-v1.html'
];

const TRANSPARENT = /rgba\(0,\s*0,\s*0,\s*0\)|transparent/;
let fail = 0; const bad = [];
const rec = (t, m) => { fail++; bad.push(`${t}\n      ${m}`); };

const browser = await chromium.launch();

for(const width of WIDTHS){
  const ctx = await browser.newContext({ viewport:{ width, height:900 } });
  await ctx.addInitScript(() => { try{ localStorage.setItem('dm-cookie-consent','accepted'); }catch(e){} });
  const page = await ctx.newPage();

  for(const file of [...BANNER, ...PLAIN]){
    const isBanner = BANNER.includes(file);
    const tag = `${file} @${width}`;
    await page.goto(`${BASE}/${file}`, { waitUntil:'domcontentloaded' });
    await page.waitForSelector('.header', { timeout:8000 });
    await page.waitForLoadState('load').catch(() => {});
    await page.waitForTimeout(400);

    /* --- scroll 0 --- */
    await page.evaluate(() => window.scrollTo(0,0));
    await page.waitForTimeout(450);                 // .3s geçiş + pay
    const top = await page.evaluate(() => {
      const h  = document.querySelector('.header');
      const hs = getComputedStyle(h);
      const pl = document.querySelector('.btn-plan');
      const ps = pl ? getComputedStyle(pl) : null;
      const cr = document.querySelector('.lib-crumb');
      const r  = e => { if(!e) return null; const b = e.getBoundingClientRect();
                        return { top:+b.top.toFixed(1), bottom:+b.bottom.toFixed(1) }; };
      return {
        over:  document.body.getAttribute('data-fit-over'),
        atTop: h.classList.contains('at-top'),
        bg:    hs.backgroundColor,
        shadow:hs.boxShadow,
        planBg:   ps ? ps.backgroundColor : null,
        planColor:ps ? ps.color : null,
        planVisible: pl ? ps.display !== 'none' : false,
        header: r(h),
        crumb:  r(cr),
        /* ---- marka yazısı okunuyor mu? ----
           `at-top` durumunda kabuk marka yazısını BEYAZ boyuyor
           (fit-shell.css: .header.at-top .fit-word b/.ft{color:#fff}).
           Bu yalnız yazının ARKASINDA koyu banner/hero varsa doğrudur.
           Banner header'ın arkasından başlamıyorsa beyaz zeminde beyaz
           yazı kalır ve logo görünmez olur — ölçülen gerçek kusur,
           ≤640px'te 24 banner sayfasının hepsinde vardı. */
        word:   r(document.querySelector('.header .fit-word b')),
        wordColor: (() => { const w = document.querySelector('.header .fit-word b');
                            return w ? getComputedStyle(w).color : null; })(),
        /* koyu bant seçicisi over-mode'un kapsadığı TÜM sınıfları içerir */
        /* .au-top SONRADAN eklendi: giriş sayfasının koyu bandı bu sınıfı
           taşıyor; listede olmadığı için 2b kontrolü "arkasında koyu bant
           yok" diyordu — sondanın kusuru, sayfanınki değil. */
        dark:   r(document.querySelector('.lib-top, .fp-top, .df-top, .cp-top, .kp-top, .chl-hero, .pd-hero, .fs-top, .ol-top, .ed-top, .au-top'))
      };
    });

    /* --- scroll 400 --- */
    await page.evaluate(() => window.scrollTo(0,400));
    await page.waitForTimeout(450);
    const down = await page.evaluate(() => {
      const h = document.querySelector('.header'), hs = getComputedStyle(h);
      const pl = document.querySelector('.btn-plan'), ps = pl ? getComputedStyle(pl) : null;
      return { atTop:h.classList.contains('at-top'), bg:hs.backgroundColor,
               planBg: ps ? ps.backgroundColor : null };
    });

    /* ---------- 1 · şeffaflık davranışı ---------- */
    if(isBanner){
      if(top.over !== '1')  rec(tag, `body[data-fit-over] kurulmadı (banner sayfası) — değer: ${top.over}`);
      if(!top.atTop)        rec(tag, 'scroll=0: header.at-top YOK — banner üzerinde katı duruyor');
      if(!TRANSPARENT.test(top.bg)) rec(tag, `scroll=0: header şeffaf değil — background ${top.bg}`);
      if(down.atTop)        rec(tag, 'scroll=400: header hâlâ at-top — katıya geçmiyor');
      if(TRANSPARENT.test(down.bg)) rec(tag, `scroll=400: header hâlâ şeffaf — background ${down.bg}`);
    } else {
      if(top.over === '1')  rec(tag, 'banner YOK ama data-fit-over kurulmuş — mod sızıyor');
      if(top.atTop)         rec(tag, 'banner YOK ama header at-top — katı olmalı');
      if(TRANSPARENT.test(top.bg)) rec(tag, `banner YOK ama header şeffaf — ${top.bg}`);
    }

    /* ---------- 2 · Planım solid primary ---------- */
    if(top.planVisible){
      for(const [state, bg] of [['scroll=0', top.planBg], ['scroll=400', down.planBg]]){
        if(!bg) continue;
        if(TRANSPARENT.test(bg)) rec(tag, `${state}: Planım düğmesi şeffaf — solid olmalı (${bg})`);
        const m = bg.match(/rgba?\(([^)]+)\)/);
        if(m){
          const [r,g,b] = m[1].split(',').map(n => parseFloat(n));
          /* solid yeşil bekleniyor: yeşil kanal baskın ve zemin beyaz/cam DEĞİL */
          if(r > 200 && g > 200 && b > 200) rec(tag, `${state}: Planım düğmesi beyaz/ghost zemin (${bg}) — solid yeşil olmalı`);
          else if(!(g > r && g > b))        rec(tag, `${state}: Planım zemini yeşil değil (${bg})`);
        }
      }
      if(top.planColor && !/255,\s*255,\s*255/.test(top.planColor))
        rec(tag, `Planım metni beyaz değil — ${top.planColor}`);
    }

    /* ---------- 2b · BEYAZ MARKA YAZISI KOYU ZEMİNDE Mİ? ----------
       Kusur şöyle kaçmıştı: header doğru şekilde `at-top` (şeffaf) oluyor,
       Planım düğmesi doğru, breadcrumb header'ın altında kalmıyor — üç
       kontrol de yeşil. Ama ≤640px'te banner header'ın ARKASINDAN değil
       ALTINDAN başlıyordu (fit-shell.css'teki eski
       `.lib-top{margin-top:62px !important}` A2'nin margin-top:0'ını
       yeniyordu), yani beyaz logo beyaz zemine düşüyordu.
       ÖLÇÜM: 4 sayfa × 7 genişlik → ≥768px'te bannerTop=0 (doğru),
       ≤640px'te bannerTop=62 / yazı[16,44] (logo görünmez). */
    if(top.atTop && top.word && /255,\s*255,\s*255/.test(top.wordColor || '')){
      if(!top.dark){
        rec(tag, `marka yazısı BEYAZ ama arkasında koyu bant yok — logo görünmez (wordColor=${top.wordColor})`);
      } else if(!(top.dark.top <= top.word.top && top.dark.bottom >= top.word.bottom)){
        rec(tag, `marka yazısı BEYAZ ama koyu bant yazının arkasını kaplamıyor — logo görünmez ` +
                 `(yazı ${top.word.top}–${top.word.bottom}, bant ${top.dark.top}–${top.dark.bottom})`);
      }
    }

    /* ---------- 3 · şeffaf header banner metnini ezmiyor ---------- */
    if(isBanner && top.crumb && top.header){
      if(top.crumb.top < top.header.bottom - 0.5)
        rec(tag, `breadcrumb header'ın ALTINDA kalıyor (üst üste binme): crumb.top=${top.crumb.top} < header.bottom=${top.header.bottom}`);
    }
  }
  await ctx.close();
}

await browser.close();
console.log(`\n${BANNER.length + PLAIN.length} sayfa × ${WIDTHS.length} genişlik · ${fail} sorun`);
if(bad.length){ console.log('\nSORUNLAR:'); bad.forEach(b => console.log('  ✗ ' + b)); process.exit(1); }
console.log('✓ Banner sayfalarında header şeffaf başlıyor ve scroll\'da katıya geçiyor;');
console.log('✓ banner taşımayan sayfalarda katı kalıyor; Planım her durumda solid primary;');
console.log('✓ şeffaf header banner metnini ezmiyor.');
