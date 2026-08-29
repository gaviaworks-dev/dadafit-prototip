/* =====================================================================
   DADAFIT — PLANIM RAYI + AÇILIR KULLANICI MENÜSÜ NÖBETİ (R9 · K66)
   ---------------------------------------------------------------------
   NÖBET NEDEN YENİDEN YAZILDI
   Bu dosyanın eski hâli DEVRİLEN KARARIN kodlanmış hâliydi. Şunları
   ölçüyordu ve üçü de artık YANLIŞ:
     · "Planım rayı YEDİ kalem olmalı"
     · "Hesabım menüsü Planım rayını TEKRARLAMAMALI"   (önceki belge §5:
       "Planım ile Hesabım birbirine karıştırılmamalıdır")
     · "menüde §5'in on dört hesap modülü bulunmalı"
   Yeni ürün belgesi §2 bunun TERSİNİ istiyor ve Beyar "belge birebir
   uygulansın" dedi: ray üçe indi, rayın içeriği menüye taşındı, 19 hesap
   kalemi tek "Hesap ve Ayarlar" kalemine katlandı.

   Nöbet SİLİNMEDİ, yeni sözleşme kodlandı. Ölçüt gevşemedi: eskiden
   menü içeriği ad ad aranıyordu, şimdi hem ad ad aranıyor HEM DE tam
   sayı (11 kalem · 3 ayraç) ve fazlalık yasağı (Bildirimler 0 · Planım 0)
   ekleniyor. Üstüne eski nöbette hiç olmayan dört ölçüm geldi: header
   İlerlemem düğmesinin oturum/genişlik davranışı, yer tutucu kaleminin
   odak sırası, üyelik kaleminin dört kırılımı, alt bar etiketleri.

   NE KANITLAR
   1. Planım rayı TAM ÜÇ kalem (belge §3 Bugün · §4 Plan ve Takvim ·
      §5 İlerlemem) ve raydan inen adlar rayda DURMAZ.
   2. Açılır menü TAM 11 kalem; adlar belgeyle birebir. Gruplama R11/M15'ten
      beri BAŞLIKLA değil AYRAÇLA yapılıyor (grup başlığı 0, ayraç ≥3).
   3. Menüde "Bildirimler" 0 (belge §1: header'da durur, menüye konmaz) ve
      "Planım" 0 (R8 madde 1'den devralınan ölçüt).
   4. Raydan inen dört sayfa YETİM DEĞİL: banner h1 dolu ve GÖRÜNÜR,
      breadcrumb dolu (data-plan-page anahtarı PLAN_PAGES'te duruyor).
   5. Menüdeki hiçbir hedef kırık değil; yer tutucu kalem ölü bağlantı
      değil (href yok · odak sırasında değil · aria-disabled taşır).
   6. Menüde ve drawer'da "DadaMutfak" kalemi yok (belge §1).
   7. Header sırası Arama · Planım · İlerlemem · Bildirimler · Profil;
      İlerlemem misafirde GİZLİ, @390'da drawer'a devreder, taşma yok.
   8. Üyelik kalemi dört kırılımda doğru etiketi verir (belge §14).
   9. Mobil alt bar etiketleri: Ana Sayfa · Hareketler · Programlar ·
      Planım · Profil (belge §1).

   Çalıştırma:
     python3 -m http.server 8811 &
     PW_HOME=~/.pw node tests/plan-account.mjs
   ===================================================================== */
import { chromium } from './_pw.mjs';
import { readdirSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:8811';
const REPO = new URL('..', import.meta.url).pathname;
const ONDISK = new Set(readdirSync(REPO).filter(f => f.endsWith('.html')));

/* ---- belge §2 · rayda kalan üç kalem ---- */
const RAY = ['Bugün', 'Plan ve Takvim', 'İlerlemem'];
/* raydan İNEN adlar — rayda görünürlerse taşıma yarım kalmış demektir */
const RAYDA_OLMAMALI = ['Aktivite Kayıtlarım', 'Kaydettiklerim', 'Antrenörüm',
  'Enerji Defteri', 'Enerji Defterim', 'Enerji Köprüsü', 'Challenge ve Rozetler',
  "Challenge'larım ve Rozetlerim", 'Sağlık ve Hareket Profilim', 'Veri ve İzinlerim'];

/* ---- belge §2 · menünün on iki kalemi, üç grup, SIRASIYLA ----
   R12/S10 (Beyar) · DadaDiet paritesi için "Aboneliğim ve Ödemelerim" kalemi
   eklendi (hesabim-v1.html#uyelik), "Hesap ve Ayarlar"ın hemen üstünde.
   ASIL GARANTİ (adlar + sıra + kırık hedef yok, docs/lessons.md §5) DEĞİŞMEDİ,
   yalnız kalem SAYISI 11 → 12'ye taşındı. */
/* 🔴 ŞARTNAMEYE ÇEKİLDİ — Dalga 4, 2026-08-29 · `docs/arayuz-sartnamesi.md` v1.8.1.
   Bu blok 2026-08-26 tarihli ESKİ kararı kodluyordu ve şartname o kararların
   üzerine yazdı (§W2: eski karar silinmez, üzerine yazılır). Değişen üç şey:

   ① §G4 · kalem sayısı 12 → 13. Eklenen kalem "Bildirimlerim"dir (§G13):
      hedefi `bildirimler-v1.html`, üst çubuktaki zille AYNI sayfa (§G19).
      Testin eski `MENUDE_OLMAMALI` listesi "Bildirimler"i yasaklıyordu —
      o yasak §G13 ile ters düştüğü için kalktı. Yerine kalemin VARLIĞI ve
      TAM ADI ("Bildirimlerim") ölçülüyor; ölçüt zayıflamadı, yön değiştirdi.
   ② §G12 · rozet kalemi ile "Bildirimlerim" AYNI grupta durur ve o grup
      hesap grubunun hemen üstündedir → grup sayısı 3 → 4 (§G2: 4 ayraç).
   ③ §G10 · Slot 2 dizgisi dört markada KİLİTLİ: "Hizmetlerim ve Ödemelerim".
      Fit'in "Hizmet Paketlerim" adı bu kilitten önceki turun kararıydı.
      K6 (Fit'te abonelik yoktur) kalkmadı — kalem hâlâ antrenör hizmet
      paketine bakıyor, yalnız ADI dört markada tekleşti. */
const GRUPLAR = ['moduller', 'gelisim', 'hesap', 'sabit'];
const MENU = ['Enerji Defterim', 'Aktivite Kayıtlarım', 'Kaydettiklerim',
  'Fit Test Sonuçlarım', 'Antrenörüm', 'Sağlık ve Hareket Profilim',
  "Challenge'larım ve Rozetlerim", 'Bildirimlerim',
  /* üyelik kalemi (Slot 1) kademeye göre ad değiştirir → ayrı ölçülür */
  'Hizmetlerim ve Ödemelerim', 'Hesap ve Ayarlar', 'Destek Merkezi', 'Çıkış'];
/* menüde ASLA bulunmayacaklar. "Bildirimler" §G13 ile listeden ÇIKTI —
   ama tekil/çoğul ayrımı korunuyor: kalemin adı "Bildirimlerim"dir,
   "Bildirim Tercihlerim" değil. */
const MENUDE_OLMAMALI = ['Bildirim Tercihlerim', 'Planım'];

/* raydan inen ama Planım kabuğunu kullanan sayfalar — yetim kalmamalı */
const RAY_DISI = ['fit-planim-gecmis-v1.html', 'fit-planim-kaydettiklerim-v1.html',
  'fit-planim-randevular-v1.html', 'enerji-defteri-v1.html'];

/* belge §14 · üyelik kaleminin dört kırılımı */
const UYELIK = [
  ['kademe yok', { auth: true, roles: ['kullanici'] }, "Pro'ya Yükselt", 'pro-v1.html'],
    /* §G7 · Slot 1 dizgisi dört markada KİLİTLİ: ücretsiz üyede
     "Pro'ya Yükselt", Pro üyede "Pro Üyeliğim". "Aboneliğim" adı hem
     §G7'ye hem K6'ya (Fit'te abonelik yoktur) aykırıydı. */
  ['pro', { auth: true, roles: ['kullanici'], paket: 'pro' }, 'Pro Üyeliğim', 'uyelik-faturalandirma-v1.html'],
  /* P8 (2026-08-25) · paket ad alanı tekleşti: `pro_max` → `pro_max_ai`,
     etiket "Pro Max AI Üyeliğim". İkinci satır, tarayıcıda kalmış ESKİ demo
     kaydının (`pro_max`) sessizce yeni ada düştüğünü kilitler — göç akışı
     değil, kabuktaki tek satırlık normalizasyon. */
  ['pro_max_ai', { auth: true, roles: ['kullanici'], paket: 'pro_max_ai' }, 'Pro Max AI Üyeliğim', 'uyelik-faturalandirma-v1.html'],
  ['eski pro_max kaydı', { auth: true, roles: ['kullanici'], paket: 'pro_max' }, 'Pro Max AI Üyeliğim', 'uyelik-faturalandirma-v1.html'],
  ['ödeme sorunu', { auth: true, roles: ['kullanici'], paket: 'pro', odemeSorunu: true },
    'Pro Üyeliğim — İşlem Gerekli', 'uyelik-faturalandirma-v1.html']
];

/* belge §1 · mobil alt bar */
const ALT_BAR = ['Ana Sayfa', 'Hareketler', 'Programlar', 'Planım', 'Profil'];

let fail = 0; const bad = [];
const rec = m => { fail++; bad.push(m); };
const ok = m => console.log('  ✓ ' + m);

const browser = await chromium.launch();
const UYE = { auth: true, roles: ['kullanici'], verified: false, level: 0 };
async function sayfa(kullanici = UYE, vp = { width: 1440, height: 1100 }) {
  const ctx = await browser.newContext({ viewport: vp });
  await ctx.addInitScript(u => {
    try {
      localStorage.setItem('dm-cookie-consent', 'accepted');
      if (u) localStorage.setItem('dm_user', JSON.stringify(u));
      else localStorage.removeItem('dm_user');
    } catch (e) {}
  }, kullanici);
  return { ctx, page: await ctx.newPage() };
}

/* ================= 1 · PLANIM RAYI ÜÇ KALEM ================= */
{
  const { ctx, page } = await sayfa();
  await page.goto(`${BASE}/fit-planim-v1.html`, { waitUntil: 'load' });
  await page.waitForTimeout(700);
  const tabs = await page.evaluate(() =>
    [...document.querySelectorAll('.pf-tabbar .fit-tab, .pf-tabs .dt')]
      .map(a => ({ t: a.textContent.trim(), href: a.getAttribute('href') })));

  if (tabs.length !== 3) rec(`Planım rayı ${tabs.length} kalem — belge §2 sonrası ÜÇ olmalı: ${tabs.map(t => t.t).join(' · ')}`);
  else ok(`Planım rayı 3 kalem: ${tabs.map(t => t.t).join(' · ')}`);

  for (const b of RAY) if (!tabs.some(t => t.t === b)) rec(`rayda "${b}" sekmesi yok (belge §2)`);
  for (const y of RAYDA_OLMAMALI)
    if (tabs.some(t => t.t === y)) rec(`rayda "${y}" DURUYOR — belge §2 onu açılır menüye taşıdı`);
  for (const t of tabs) {
    const f = (t.href || '').split('#')[0].split('?')[0];
    if (f && !ONDISK.has(f)) rec(`ray sekmesi kırık hedefe gidiyor: ${t.t} → ${f}`);
  }
  await ctx.close();
}

/* ============ 2·3·5·6 · AÇILIR MENÜ · 11 KALEM · 3 GRUP ============ */
{
  const { ctx, page } = await sayfa();
  await page.goto(`${BASE}/dadafit-hub-v1.html`, { waitUntil: 'load' });
  await page.waitForTimeout(700);
  /* MENÜ AÇILMADAN GÖRÜNÜRLÜK ÖLÇÜLMEZ. `.acct-menu` kapalıyken
     visibility:hidden taşır ve bu ÇOCUKLARA MİRAS KALIR → grup başlıkları
     "DOM'da var ama görünmüyor" diye yanlış kırmızı verir. Bu sondanın
     kendi körlüğüydü, ölçülenin kusuru değil: hover'lı ölçümde üç başlık
     da display:block · visibility:visible · opacity:1 · yükseklik 16px. */
  await page.hover('.acct-btn');
  await page.waitForTimeout(400);
  const acik = await page.evaluate(() => {
    const cs = getComputedStyle(document.querySelector('.acct-menu'));
    return cs.visibility === 'visible' && cs.opacity !== '0';
  });
  if (!acik) rec('avatar menüsü hover ile açılmadı — görünürlük ölçümü yapılamaz');

  const m = await page.evaluate(() => {
    const menu = document.querySelector('.acct-menu');
    if (!menu) return null;
    const ad = el => {
      const inner = el.querySelector('span');
      return (inner ? inner.childNodes[0].textContent : el.textContent).trim();
    };
    return {
      kalemler: [...menu.querySelectorAll(':scope > a, :scope > .acct-soon')].map(el => ({
        t: ad(el),
        href: el.getAttribute('href'),
        soon: el.classList.contains('acct-soon'),
        aria: el.getAttribute('aria-disabled'),
        tabIndex: el.tabIndex
      })),
      gruplar: [...menu.querySelectorAll('.acct-grup')].map(g => ({
        t: g.textContent.trim(),
        gorunur: getComputedStyle(g).display !== 'none' &&
                 getComputedStyle(g).visibility !== 'hidden' &&
                 getComputedStyle(g).opacity !== '0' &&
                 g.getBoundingClientRect().height > 0
      })),
      /* R11/M15 · gruplama artık BAŞLIKLA değil AYRAÇLA yapılıyor */
      ayraclar: [...menu.querySelectorAll('.acct-div')]
        .filter(d => d.getBoundingClientRect().height > 0 ||
                     parseFloat(getComputedStyle(d).borderTopWidth) > 0 ||
                     getComputedStyle(d).backgroundColor !== 'rgba(0, 0, 0, 0)').length,
      /* kalem açıklaması kalkmalı: iki satıra taşan kalem olmamalı */
      aciklamaliKalem: [...menu.querySelectorAll('a[href] small, .acct-soon small')].length,
      /* odak sırasına giren kalemler — yer tutucu buraya GİRMEMELİ */
      odak: [...menu.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])')].map(ad)
    };
  });

  if (!m) rec('açılır menü bulunamadı (.acct-menu yok — üye kipi açılmadı mı?)');
  else {
    /* §G4 · menü kalem sayıları: Gastro 12 · Diet 14 · Gourmet 12 · FİT 13.
       Sayı = 7 marka modülü (§F4) + Bildirimlerim + Slot 1 + Slot 2 + sabit
       üçlü. Eski 12, "Bildirimlerim" kalemi basılmadan önceki hâldi (§G13). */
    if (m.kalemler.length !== 13)
      rec(`açılır menü ${m.kalemler.length} kalem — §G4 gereği Fit'te ON ÜÇ olmalı: ${m.kalemler.map(k => k.t).join(' · ')}`);
    else ok(`açılır menü 13 kalem (§G4): ${m.kalemler.map(k => k.t).join(' · ')}`);

    /* ---------------------------------------------------------------
       BEKLENTİ DEĞİŞTİ — R11/M15 (Beyar):
         "Dropdown kısmı section'lı BAŞLIKSIZ olacak — aynı Diet'in
          dropdown'ındaki tab menü yapısını alabilirsin."
       Kardeş marka (dadadiet.com) hesap menüsünde grup başlığı da kalem
       açıklaması da YOK; gruplar ince ayraçla ayrılıyor.

       Belge §2'nin ASIL ŞARTI — "on bir kalem, şu adlarla, şu sırada" —
       DEĞİŞMEDİ ve yukarıda hâlâ ölçülüyor. Değişen yalnız grupların NASIL
       gösterildiği: başlık yerine ayraç. Nöbet artık onu şart koşuyor,
       yani gruplama sessizce kaybolursa (ayraç da yoksa) kırmızı yanar. */
    if (m.gruplar.length)
      rec(`menüde ${m.gruplar.length} grup BAŞLIĞI kaldı — R11/M15 başlıkları ayraca çevirmişti: ${m.gruplar.map(g => g.t).join(' · ')}`);
    /* AYRAÇ SAYISI TAM ÜÇ (Beyar kararı 2026-08-26, kanon Diet):
       profil başlığı altı + 2 grup arası. 🔴 ÇIKIŞ'IN ÜSTÜNE DÖRDÜNCÜ AYRAÇ
       KONMAZ — Çıkış "Üyelik ve Hesap" grubunun İÇİNDEDİR. Önceki ölçüt
       `>= 3` idi ve gerekçesi "Çıkış öncesi" diyordu; o gerekçe kanonla
       çeliştiği için ölçüt tam sayıya çevrildi (dördüncü ayraç ölçüldü ve
       kaldırıldı). */
    /* §G2 · menü kimlik bloğuyla başlar, ardından DÖRT bağlantı grubu gelir;
       ayraç sayısı TAM 4'tür: biri kimlik bloğunu, üçü grupları ayırır.
       Eski 3, dördüncü grup (rozet + Bildirimlerim, §G12) doğmadan önceki
       hâldi. §G6 hâlâ geçerli: Çıkış'ın üstüne ayraç KONMAZ. */
    else if (m.ayraclar !== 4)
      rec(`menüde ${m.ayraclar} ayraç var — §G2 gereği TAM 4 olmalı (kimlik bloğu + 3 grup arası); Çıkış'ın üstüne ayraç konmaz`);
    else ok(`grup başlığı 0 · ayraç ${m.ayraclar} (başlıksız kip, DadaDiet kalıbı · Çıkış grubun içinde)`);

    if (m.aciklamaliKalem)
      rec(`menüde ${m.aciklamaliKalem} kalemde açıklama satırı kaldı — R11/M15 bunları kaldırmıştı`);
    else ok('kalem açıklaması 0 — kalemler tek satır');

    for (const beklenen of MENU)
      if (!m.kalemler.some(k => k.t === beklenen)) rec(`menüde "${beklenen}" kalemi yok (belge §2)`);
    /* üyelik kalemi: adı kademeye göre değişir, ama biri MUTLAKA olmalı */
    if (!m.kalemler.some(k => /Yükselt|Üyeliğim/.test(k.t)))
      rec('menüde Slot 1 üyelik kalemi yok (§G7: "Pro\'ya Yükselt" / "Pro Üyeliğim")');

    for (const yasak of MENUDE_OLMAMALI) {
      const n = m.kalemler.filter(k => k.t === yasak).length;
      if (n) rec(`menüde "${yasak}" ${n} adet — belge §1/§2 sıfır istiyor`);
    }
    if (!bad.length) ok('menüde Bildirimler 0 · Planım 0 (belge §1: zil header\'da kalır)');

    /* yer tutucu ölü bağlantı olmasın */
    const yt = m.kalemler.find(k => k.soon);
    if (!yt) ok('yer tutucu kalem yok — tüm kalemler gerçek hedefe gidiyor');
    else {
      if (yt.href) rec(`yer tutucu "${yt.t}" href taşıyor (${yt.href}) — ölü bağlantı olmamalı`);
      if (yt.aria !== 'true') rec(`yer tutucu "${yt.t}" aria-disabled taşımıyor`);
      if (m.odak.includes(yt.t)) rec(`yer tutucu "${yt.t}" odak sırasına giriyor — girmemeli`);
      else ok(`yer tutucu "${yt.t}": href yok · aria-disabled="true" · odak sırasında değil`);
    }

    /* kırık hedef */
    const broken = new Set();
    for (const k of m.kalemler) {
      const h = k.href || '';
      if (!h || /^(https?:|mailto:|tel:|#|javascript:)/.test(h)) continue;
      const f = h.split('#')[0].split('?')[0];
      if (f && f.endsWith('.html') && !ONDISK.has(f)) broken.add(`${k.t} → ${f}`);
    }
    if (broken.size) rec('menüde kırık hedef: ' + [...broken].join(', '));
    else ok('menüdeki tüm hedefler diskte var');

    if (m.kalemler.some(k => /DadaMutfak/i.test(k.t))) rec('menüde "DadaMutfak" kalemi kaldı (belge §1)');
    else ok('menüde DadaMutfak kalemi yok');
  }

  /* drawer'da da DadaMutfak kalmasın */
  const drawerMutfak = await page.evaluate(() =>
    [...document.querySelectorAll('#drawer a')].filter(a => /DadaMutfak/i.test(a.textContent)).length);
  if (drawerMutfak) rec(`drawer'da ${drawerMutfak} adet "DadaMutfak" bağlantısı kaldı (belge §1)`);
  else ok('drawer\'da DadaMutfak bağlantısı yok');

  /* alt bar etiketleri (belge §1) */
  const bn = await page.evaluate(() =>
    [...document.querySelectorAll('.bottom-nav .bn-item')].map(a => a.textContent.trim()));
  if (bn.join(' · ') !== ALT_BAR.join(' · '))
    rec(`alt bar "${bn.join(' · ')}" — belge §1: "${ALT_BAR.join(' · ')}"`);
  else ok(`alt bar: ${bn.join(' · ')}`);

  await ctx.close();
}

/* ============ 4 · RAYDAN İNEN DÖRT SAYFA YETİM DEĞİL ============ */
{
  const { ctx, page } = await sayfa();
  for (const f of RAY_DISI) {
    await page.goto(`${BASE}/${f}`, { waitUntil: 'load' });
    await page.waitForTimeout(500);
    const r = await page.evaluate(() => {
      const h1 = document.querySelector('.lib-top h1, .fp-top h1, main h1');
      const crumb = document.querySelector('.lib-crumb .cur');
      const cs = h1 ? getComputedStyle(h1) : null;
      return {
        h1: h1 ? h1.textContent.trim() : null,
        /* DOM'da var ≠ görünür */
        h1Gorunur: !!(h1 && cs.display !== 'none' && cs.visibility !== 'hidden' &&
                      cs.opacity !== '0' && h1.getBoundingClientRect().height > 0),
        crumb: crumb ? crumb.textContent.trim() : null,
        ray: document.querySelectorAll('.pf-tabbar .fit-tab').length
      };
    });
    if (!r.h1 || /^\s*$/.test(r.h1))
      rec(`${f}: banner başlığı boş — kabuk çözümü kırıldı (data-plan-page PLAN_PAGES'te yok)`);
    else if (!r.h1Gorunur) rec(`${f}: banner h1 "${r.h1}" DOM'da var ama GÖRÜNMÜYOR`);
    else if (!r.crumb) rec(`${f}: breadcrumb boş — raydan indi ama kabuğu kaybetti`);
    else ok(`${f}: başlık "${r.h1}" · breadcrumb "${r.crumb}" · ray ${r.ray} sekme`);
  }
  await ctx.close();
}

/* ============ 7 · HEADER İLERLEMEM DÜĞMESİ ============ */
/* Belge §1 header sırası: Arama · Planım · İlerlemem · Bildirimler · Profil.
   İlerlemem R9'da eklenen YEDİNCİ head-actions öğesi → taşma riski gerçek,
   üç genişlikte ölçülür. Kişisel sayfa olduğu için misafirde kapalı,
   @390'da (Planım/zil/avatar gibi) drawer + alt bara devreder. */
{
  const gor = async (kullanici, w) => {
    const { ctx, page } = await sayfa(kullanici, { width: w, height: 900 });
    await page.goto(`${BASE}/dadafit-hub-v1.html`, { waitUntil: 'load' });
    await page.waitForTimeout(600);
    const r = await page.evaluate(() => {
      const ha = document.querySelector('.head-actions');
      const gorunur = el => {
        if (!el) return false;
        const cs = getComputedStyle(el);
        return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0' &&
               el.getBoundingClientRect().width > 0;
      };
      const prog = ha.querySelector('.head-prog');
      const sira = [...ha.children].filter(gorunur).map(el => {
        if (el.classList.contains('head-prog')) return 'İlerlemem';
        if (el.classList.contains('btn-plan')) return 'Planım';
        if (el.classList.contains('head-bell')) return 'Bildirimler';
        if (el.classList.contains('acct-wrap')) return 'Profil';
        if (el.classList.contains('hamburger')) return 'Menü';
        if (el.classList.contains('btn-login')) return 'Giriş Yap';
        return 'Arama';
      });
      const nav = document.querySelector('.nav');
      const navR = gorunur(nav) ? nav.getBoundingClientRect().right : null;
      return {
        progGorunur: gorunur(prog),
        progHref: prog ? prog.getAttribute('href') : null,
        sira,
        docTasma: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        haTasma: ha.scrollWidth - ha.clientWidth,
        cakisma: navR !== null && navR > ha.getBoundingClientRect().left
      };
    });
    await ctx.close();
    return r;
  };

  const u1440 = await gor(UYE, 1440);
  if (!u1440.progGorunur) rec('@1440 üyede İlerlemem düğmesi görünmüyor (belge §1)');
  else if (u1440.progHref !== 'fit-planim-ilerleme-v1.html')
    rec(`İlerlemem düğmesi "${u1440.progHref}" hedefine gidiyor — fit-planim-ilerleme-v1.html olmalı`);
  else if (!ONDISK.has(u1440.progHref)) rec(`İlerlemem hedefi diskte yok: ${u1440.progHref}`);
  else ok(`@1440 İlerlemem düğmesi görünür → ${u1440.progHref}`);

  const beklenenSira = ['Arama', 'Planım', 'İlerlemem', 'Bildirimler', 'Profil'];
  if (u1440.sira.join(' · ') !== beklenenSira.join(' · '))
    rec(`@1440 header sırası "${u1440.sira.join(' · ')}" — belge §1: "${beklenenSira.join(' · ')}"`);
  else ok(`@1440 header sırası belgeyle birebir: ${u1440.sira.join(' · ')}`);

  for (const [w, r] of [[1440, u1440], [1024, await gor(UYE, 1024)], [390, await gor(UYE, 390)]]) {
    if (r.docTasma > 0) rec(`@${w} sayfa yatay taşıyor (${r.docTasma}px) — head-actions'a eklenen öğe sığmıyor`);
    if (r.haTasma > 0) rec(`@${w} head-actions kendi içinde taşıyor (${r.haTasma}px)`);
    if (r.cakisma) rec(`@${w} ana menü head-actions'ın üstüne biniyor`);
    if (w === 390 && r.progGorunur)
      rec('@390 üyede İlerlemem header\'da kalmış — Planım/zil/avatar gibi drawer + alt bara devretmeli');
  }
  ok('1440 · 1024 · 390: taşma 0 · çakışma yok · @390 İlerlemem drawer\'a devretti');

  const misafir = await gor(null, 1440);
  if (misafir.progGorunur) rec('@1440 MİSAFİRDE İlerlemem düğmesi görünüyor — kişisel sayfa, yalnız girişte açılmalı');
  else ok('@1440 misafirde İlerlemem gizli (Planım ve zil ile aynı sözleşme)');

  /* @390 erişim kaybı olmadığının kanıtı: drawer'da İlerlemem duruyor */
  const { ctx, page } = await sayfa(UYE, { width: 390, height: 844 });
  await page.goto(`${BASE}/dadafit-hub-v1.html?drawer=1`, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const dr = await page.evaluate(() =>
    [...document.querySelectorAll('.d-plan .d-sub a')].map(a => a.textContent.trim()));
  if (!dr.includes('İlerlemem'))
    rec(`@390 drawer'da İlerlemem yok — header'dan indi, hiçbir kapı kalmadı (drawer: ${dr.join(' · ')})`);
  else ok(`@390 drawer Planım bölümü: ${dr.join(' · ')} — erişim kaybı yok`);
  await ctx.close();
}

/* ====== 10 · @390 MENÜ KAPILARI — açılır menü mobilde yok, drawer var ======
   BU ÖLÇÜM K66'NIN KENDİ KUSURUNU YAKALADI. §2 rayın içeriğini açılır menüye
   taşıdı; açılır menü @390'da gizli (`.acct-wrap`), drawer'ın alt şeridi de
   yalnız dört ince bağlantı taşıyordu → `fit-planim-gecmis-v1` ve
   `fit-planim-kaydettiklerim-v1` mobilde KAPISIZ kaldı (tabanda drawer'ın
   Planım bölümünde duruyorlardı, ray üçe inince düştüler).
   Nöbet artık şunu tutuyor: masaüstü menüsündeki HER hedefin @390'da da
   GÖRÜNÜR bir kapısı var. "DOM'da var" yetmez — görünürlük ölçülür. */
{
  const { ctx, page } = await sayfa(UYE, { width: 1440, height: 1100 });
  await page.goto(`${BASE}/dadafit-hub-v1.html`, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  const hedefler = await page.evaluate(() =>
    [...document.querySelectorAll('.acct-menu > a[href]')]
      .map(a => a.getAttribute('href').split('#')[0])
      .filter(h => h.endsWith('.html')));
  await ctx.close();

  const m = await sayfa(UYE, { width: 390, height: 844 });
  await m.page.goto(`${BASE}/dadafit-hub-v1.html?drawer=1`, { waitUntil: 'load' });
  await m.page.waitForTimeout(1000);
  const kapilar = await m.page.evaluate(() =>
    [...document.querySelectorAll('a[href]')].filter(a => {
      const cs = getComputedStyle(a);
      return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0' &&
             a.getBoundingClientRect().width > 0;
    }).map(a => a.getAttribute('href').split('#')[0]));
  const kapiSet = new Set(kapilar);
  const kapisiz = hedefler.filter(h => !kapiSet.has(h));
  if (kapisiz.length)
    rec(`@390'da kapısız menü hedefi (${kapisiz.length}): ${kapisiz.join(', ')} — açılır menü mobilde yok, drawer'a konmalı`);
  else ok(`@390 drawer: menünün ${hedefler.length} hedefinin hepsine görünür kapı var`);

  /* misafirde hesap bölümü açılmasın */
  await m.ctx.close();
  const g = await sayfa(null, { width: 390, height: 844 });
  await g.page.goto(`${BASE}/dadafit-hub-v1.html?auth=0&drawer=1`, { waitUntil: 'load' });
  await g.page.waitForTimeout(800);
  const misafirBlok = await g.page.evaluate(() => {
    const b = document.querySelector('.d-acct-block');
    return b ? getComputedStyle(b).display !== 'none' : false;
  });
  if (misafirBlok) rec('@390 MİSAFİRDE drawer hesap bölümü açık — yalnız girişte görünmeli');
  else ok('@390 misafirde drawer hesap bölümü kapalı');
  await g.ctx.close();
}

/* ============ 8 · ÜYELİK KALEMİ DÖRT KIRILIM (belge §14) ============ */
for (const [ad, kullanici, etiket, hedef] of UYELIK) {
  const { ctx, page } = await sayfa(kullanici);
  await page.goto(`${BASE}/dadafit-hub-v1.html`, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  const r = await page.evaluate(() => {
    const a = document.querySelector('.acct-menu .acct-pro, .acct-menu .acct-uyari');
    if (!a) return null;
    const inner = a.querySelector('span');
    return { t: (inner ? inner.childNodes[0].textContent : a.textContent).trim(),
             href: a.getAttribute('href'), uyari: a.classList.contains('acct-uyari') };
  });
  if (!r) rec(`üyelik kalemi (${ad}) menüde bulunamadı`);
  else if (r.t !== etiket) rec(`üyelik kalemi (${ad}) "${r.t}" — "${etiket}" olmalı (belge §14)`);
  else if (!(r.href || '').startsWith(hedef)) rec(`üyelik kalemi (${ad}) "${r.href}" — ${hedef} olmalı`);
  else if (ad === 'ödeme sorunu' && !r.uyari) rec('ödeme sorunu kalemi uyarı biçimini (acct-uyari) taşımıyor');
  else ok(`üyelik · ${ad} → "${r.t}" (${r.href})`);
  await ctx.close();
}

await browser.close();
console.log(`\n${fail} sorun`);
if (bad.length) { console.log('\nSORUNLAR:'); bad.forEach(b => console.log('  ✗ ' + b)); process.exit(1); }
console.log('✓ Ray 3 kalem · menü 13 kalem · 4 ayraç (§G2/§G4) · grup başlığı 0, ayraçla ayrılıyor (§G1) · "Bildirimlerim" basılı (§G13) · raydan inen 4 sayfa yetim değil · kırık hedef yok.');
