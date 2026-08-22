/* =====================================================================
   DADAFIT — MEKANİK DENETİM  (DENETIM.md §8)
   ---------------------------------------------------------------------
   Ajan raporuna güvenmeden, makinenin yakalayabileceği kusur sınıflarını
   arar. Dört şey bakar:

     1. ÖLÜ ETKİLEŞİM — düğme gibi görünüp hiçbir şey yapmayan öğe.
        Yöntem: TIKLA ve SONUCU ÖLÇ. Dinleyici okumak (CDP) yanıltıcı,
        çünkü bu depoda olay devri (delegation) yaygın: kabuk `document`
        düzeyinde dinliyor, o yüzden "dinleyicisi var" demek "bir şey
        yapıyor" demek değil. Tek dürüst ölçü davranıştır.
        Her tıklama ÖNCESİ sayfa yeniden yükleniyor — aksi hâlde birinci
        tıklamanın yan etkisi ikincinin ölçümünü kirletir.

     2. SAHTE DURUM — depodan gelmesi gereken ama sayfaya sabit yazılmış
        sayı. Yöntem: `dm_fit`'i AYIRT EDİCİ bir değerle tohumla, sonra
        sayfada o değerin mi yoksa başka bir sayının mı yazdığına bak.

     3. JS HATASI — konsolda hata üreten sayfa.

     4. COMMIT İHLALİ — ajanlar commit/push atmaz (DENETIM.md §6).

   NE YAPMAZ: bu araç kusur bulmazsa "temiz" demez, yalnız "mekanik olarak
   yakalanabilecek bir şey görünmedi" der. Görsel kusur, metin kusuru ve
   akış kusuru buradan geçmez — onlar için ölçüm + göz gerekir.

   Çalıştırma:
     python3 -m http.server 8811 &
     node tools/denetim.mjs                      # varsayılan sayfa kümesi
     node tools/denetim.mjs sayfa-a,sayfa-b      # yalnız bunlar
   ===================================================================== */
import { chromium } from '../tests/_pw.mjs';
import { readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';

const BASE = process.env.BASE || 'http://localhost:8811';
const REPO = new URL('..', import.meta.url).pathname;

/* Varsayılan küme: durum yazan / akış taşıyan sayfalar. Ölü etkileşim ve
   sahte durum bu sayfalarda anlamlı; salt içerik sayfasında değil. */
const VARSAYILAN = [
  'dadafit-hub-v1', 'challenge-v1', 'challenge-merkezi-v1',
  'program-detay-v1', 'program-liste-v1', 'programlar-merkezi-v1',
  'fit-planim-v1', 'fit-planim-programim-v1', 'fit-planim-ilerleme-v1',
  'antrenman-olusturucu-v1'
];

const arg = process.argv[2];
const SAYFALAR = arg ? arg.split(',').map(s => s.replace(/\.html$/, '')) : VARSAYILAN;
const ONDISK = new Set(readdirSync(REPO).filter(f => f.endsWith('.html')));

/* Ayırt edici tohum: bu sayılar hiçbir sayfada sabit yazılı DEĞİL, o yüzden
   ekranda görünmeleri "depodan geldi" demek. Sabit sayı yazan sayfa ise
   tohumdan bağımsız kendi sayısını göstermeye devam eder — kusur budur. */
const TOHUM = {
  program:   { hafta:3, gun:4, toplam:24, biten:17, kacan:2, durum:'devam' },
  challenge: { ad:'30 Gün Hareket', gun:23, toplam:30, seri:9, telafi:1, durum:'devam' },
  randevular:[], bugun:{ dk:47, kcal:391, tamam:false },
  gecmis:[], hafta:[62,74,90,96,118,142]
};

const bulgular = [];
const kaydet = (tur, sayfa, mesaj) => bulgular.push({ tur, sayfa, mesaj });

/* --------------------------------------------------------------------
   0 · COMMIT İHLALİ
   -------------------------------------------------------------------- */
function commitDenetimi(){
  let taban;
  try { taban = (process.env.TABAN || execSync('git rev-parse HEAD~0', {cwd:REPO}).toString().trim()); }
  catch { return; }
  try {
    const kirli = execSync('git status --short', {cwd:REPO}).toString().trim();
    const dosya = kirli ? kirli.split('\n').length : 0;
    console.log(`  commit: HEAD ${taban.slice(0,7)} · çalışma ağacında ${dosya} değişmiş dosya`);
    /* Ajan turu sırasında yeni commit OLMAMALI. TABAN verilmişse karşılaştır. */
    if (process.env.TABAN) {
      const yeni = execSync(`git rev-list ${process.env.TABAN}..HEAD --count`, {cwd:REPO}).toString().trim();
      if (Number(yeni) > 0) kaydet('COMMIT', '-', `tur sırasında ${yeni} yeni commit atılmış — ajanlar commit atmaz (DENETIM.md §6)`);
    }
  } catch(e){ console.log('  commit denetimi atlandı:', e.message.split('\n')[0]); }
}

/* -------------------------------------------------------------------- */
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{ width:1440, height:1000 } });
await ctx.addInitScript(([tohum]) => { try {
  localStorage.setItem('dm-cookie-consent','accepted');
  localStorage.setItem('dm_user', JSON.stringify({auth:true, roles:['kullanici'], verified:false, level:0}));
  localStorage.setItem('dm_fit', JSON.stringify(tohum));
} catch(e){} }, [TOHUM]);

const page = await ctx.newPage();
const jsHata = [];
page.on('pageerror', e => jsHata.push(String(e).split('\n')[0].slice(0, 110)));

/* Tıklanabilir aday: görünür düğmeler ve hedefsiz bağlantılar.
   DIŞARIDA BIRAKILANLAR ve nedeni:
     · [data-fit-shell] altındakiler → kabuk kendi nöbetinde ölçülüyor
     · çerez bandı → tıklanınca bandı kapatır, her ölçümü kirletir (bu turda
       otomasyonum tam buna takıldı)
     · form submit → formun kendi davranışı var, tıklama testi yanıltır
     · [aria-disabled] / .acct-soon → bilerek etkisiz, yer tutucu
     · <summary> ve details → tarayıcının kendi davranışı  */
const ADAY_JS = `
  (() => {
    const gorunur = el => el.getClientRects().length > 0;
    const disari = el => el.closest('.cookie-banner,[data-cookie],#cookieBanner,header.header,footer,.acct-menu,#drawer,.bottom-nav')
                       /* DÜZELTME: aşağıdakiler ilk sürümde 3 sayfada onlarca
                          yanlış "ölü" üretti. Hiçbiri akış öğesi değil:
                            · dil/marka bandı ve geri bildirim aracı — kabuk widget'ı
                            · "Kapat" — kapalı bir katmanı kapatmak doğal olarak etkisiz
                            · "Başa dön" — yalnız kaydırır, sayfa zaten tepedeyse etkisiz
                            · zaten seçili süzgeç çipi — tekrar seçmek etkisiz, doğru davranış
                            · dış bağlantı / yeni sekme — sayfa değişmez, kusur değil */
                       || el.closest('[class*="lang"],[class*="gorus"],[id*="gorus"],[class*="brandbar"],[class*="eko"]')
                       || /^(kapat|başa dön|basa don|close)$/i.test(
                            (el.innerText || el.getAttribute('aria-label') || el.title || '').trim())
                       || el.matches('[aria-pressed="true"],.active,.is-active,.sel,[aria-current]')
                       || (el.tagName === 'A' && (el.target === '_blank' || /^https?:/.test(el.getAttribute('href')||'')))
                       || el.closest('[aria-disabled="true"]')
                       || el.classList.contains('acct-soon')
                       || (el.tagName === 'BUTTON' && el.type === 'submit');
    const ad = el => (el.innerText || el.getAttribute('aria-label') || el.title || '').trim().replace(/\\s+/g,' ');
    const aday = [...document.querySelectorAll('button, [role="button"], a[href="#"], a:not([href])')]
      .filter(el => gorunur(el) && !disari(el));
    return aday.map((el, i) => {
      el.setAttribute('data-denetim-ix', i);
      return { ix:i, metin:ad(el).slice(0,42), adsiz:!ad(el), etiket:el.tagName.toLowerCase() };
    });
  })()`;

/* DÜZELTME (ilk sürüm kördü): özet YALNIZ `main` üzerinden alınıyordu, o
   yüzden header açılır menüsü, dil seçici, geri bildirim kutusu ve gövde
   sınıfı gibi `main` DIŞINDA olan her değişiklik "hiçbir şey olmadı" diye
   okunuyordu — 3 sayfada 91 yanlış "ölü" üretti. Artık TÜM belge, gövde
   sınıfı, kaydırma konumu ve odak da durumun parçası. */
const DURUM_JS = `
  (() => {
    let h = 0; const s = document.documentElement.outerHTML;
    for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
    const ae = document.activeElement;
    return { url:location.href, depo:(localStorage.getItem('dm_fit')||'') + (localStorage.getItem('dm_fit_planlar_v1')||''),
             dom:h, uzunluk:s.length,
             govde:document.body.className,
             kaydirma:Math.round(window.scrollY / 40),
             odak: ae ? (ae.tagName + '#' + (ae.id||'') + '.' + (ae.className||'').slice(0,40)) : '',
             acikModal:[...document.querySelectorAll('[role="dialog"],.modal,dialog')]
               .filter(e => e.getClientRects().length > 0).length };
  })()`;

for (const ad of SAYFALAR){
  if(!ONDISK.has(ad + '.html')){ kaydet('EKSİK', ad, 'dosya diskte yok'); continue; }
  const url = `${BASE}/${ad}.html?auth=1`;
  jsHata.length = 0;

  await page.goto(url, { waitUntil:'load' });
  await page.waitForTimeout(700);

  /* --- 3 · JS hatası --- */
  if (jsHata.length) kaydet('JS', ad, `${jsHata.length} konsol hatası: ${jsHata.slice(0,2).join(' | ')}`);

  /* --- 2 · SAHTE DURUM --- */
  const sahte = await page.evaluate(([ch, pr]) => {
    const t = (document.querySelector('main') || document.body).innerText;
    const out = [];
    /* "N / 30" kalıbı: challenge ilerlemesi. Tohum 23 dedi. */
    for (const m of t.matchAll(/(\d+)\s*\/\s*30\b/g))
      if (Number(m[1]) !== ch.gun) out.push(`"${m[0]}" yazıyor ama depoda challenge.gun=${ch.gun}`);
    /* "Gün N" kalıbı — yalnız challenge bağlamında anlamlı olduğu için
       metinde "challenge" ya da "seri" geçen sayfalarda bakılıyor. */
    if (/challenge|seri/i.test(t))
      for (const m of t.matchAll(/Gün\s+(\d+)\b/g))
        if (Number(m[1]) !== ch.gun && Number(m[1]) !== pr.gun) out.push(`"${m[0]}" yazıyor ama depoda challenge.gun=${ch.gun} / program.gun=${pr.gun}`);
    return [...new Set(out)];
  }, [TOHUM.challenge, TOHUM.program]);
  for (const s of sahte) kaydet('SAHTE', ad, s);

  /* --- 1 · ÖLÜ ETKİLEŞİM --- */
  const adaylar = await page.evaluate(ADAY_JS);
  const olu = [], adsiz = [];
  for (const a of adaylar){
    /* her tıklama TAZE sayfada — önceki tıklamanın yan etkisi bulaşmasın */
    await page.goto(url, { waitUntil:'load' });
    await page.waitForTimeout(450);
    await page.evaluate(ADAY_JS);                       // ix niteliklerini yeniden bas
    /* ÖNCE görünür alana kaydır, SONRA anlık görüntü al. Ters sırada yapmak
       aracı tamamen kör ediyordu: `scrollIntoView` kaydırmayı değiştiriyor,
       `kaydirma` alanı da ölçütün parçası olduğu için HER öğe "canlı"
       görünüyordu — araç challenge'ın ölü CTA'sını ve 30 gün kutusunu
       kaybetti. Kaydırma tıklamanın değil, hazırlığın sonucuydu. */
    await page.evaluate(ix => {
      const el = document.querySelector(`[data-denetim-ix="${ix}"]`);
      if (el) el.scrollIntoView({block:'center', behavior:'instant'});
    }, a.ix);
    await page.waitForTimeout(200);
    const once = await page.evaluate(DURUM_JS);
    const tiklandi = await page.evaluate(ix => {
      const el = document.querySelector(`[data-denetim-ix="${ix}"]`);
      if (!el) return false;
      el.click(); return true;
    }, a.ix);
    if (!tiklandi) continue;
    await page.waitForTimeout(600);
    const sonra = await page.evaluate(DURUM_JS);

    const degisti = once.url !== sonra.url || once.depo !== sonra.depo
                 || once.dom !== sonra.dom || once.acikModal !== sonra.acikModal
                 || once.govde !== sonra.govde || once.kaydirma !== sonra.kaydirma;
    /* `odak` ölçüte KONMADI. İkinci sürümde koymuştum ve araç kör oldu:
       tıklamak daima `activeElement`'i değiştirir, dolayısıyla her öğe
       "canlı" göründü ve araç kendi bulduğu iki gerçek kusuru (challenge'ın
       ölü CTA'sı ve takvim gün kutuları) KAYBETTİ. Yanlış negatif, yanlış
       pozitiften pahalıdır: biri gürültü yapar, öteki kusuru saklar. */
    /* Adsız öğe AYRI bir bulgu: "ölü" değil, erişilebilirlik kusuru.
       İkisini karıştırmak ölü-etkileşim listesini okunamaz hâle getiriyordu. */
    if (!degisti) { if (a.adsiz) adsiz.push(`${a.etiket} (erişilebilir adı yok)`); else olu.push(`${a.etiket} "${a.metin}"`); }
  }
  for (const o of olu) kaydet('ÖLÜ', ad, o);
  if (adsiz.length) kaydet('ADSIZ', ad, `${adsiz.length} öğe hem etkisiz hem erişilebilir adsız`);

  console.log(`  ${ad}: ${adaylar.length} aday · ölü ${olu.length} · adsız ${adsiz.length} · sahte ${sahte.length} · js ${jsHata.length}`);
}

await browser.close();

console.log('');
commitDenetimi();

/* -------------------------------------------------------------------- */
console.log('');
if (!bulgular.length){
  console.log('✓ 0 bulgu — mekanik olarak yakalanabilecek bir şey görünmedi.');
  console.log('  (Bu "temiz" demek DEĞİL: görsel, metin ve akış kusuru buradan geçmez.)');
  process.exit(0);
}
const grup = {};
for (const b of bulgular) (grup[b.tur] = grup[b.tur] || []).push(b);
console.log(`✗ ${bulgular.length} BULGU\n`);
for (const [tur, list] of Object.entries(grup)){
  console.log(`  ${tur} (${list.length})`);
  for (const b of list) console.log(`    · ${b.sayfa} — ${b.mesaj}`);
  console.log('');
}
process.exit(1);
