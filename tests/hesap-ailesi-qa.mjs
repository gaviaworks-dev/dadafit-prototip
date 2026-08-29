/* =====================================================================
   DADAFIT — HESAP AİLESİ TAM QA  (Fit maket kapanış turu · 2026-08-26)
   ---------------------------------------------------------------------
   Depoda 69 HTML var; bu nöbet HESAP AİLESİYLE sınırlıdır. Sınır, sözleşme
   §3.2'nin saydığı alt yüzeyler + bu turda dokunulan ekranlardır:

     hesabim · profil · bildirimler · uyelik-faturalandirma · fatura-detay ·
     veri-islem-kaydi · bagli-uygulamalar · destek (3 sayfa) · sss (Çözüm
     Merkezi) · rozetler (2) · fit-planim-veri-izin ·
     fit-planim-saglik-profil · fit-planim-randevular · antrenor-panelim ·
     giris · pro-odeme                                           → 19 adres

   Ölçütler (her adres × 1440/1024/768/390):
     · yatay taşma 0
     · konsol/sayfa hatası 0
     · <h1> TEK
     · <h2> KORUNDU (sayfada en az bir h2 var — P12/D-1'in belge ana
       hattı iddiası; span'a düşen başlık burada yakalanır)
     · başlık hiyerarşisi kırılmıyor (h1'den sonra ilk başlık h2'dir,
       h3 h2'siz gelmez)
     · dokunma hedefi: görünür düğme/bağlantı ≥ 44px (kabuk R6 ölçütü);
       istisnalar satır içi metin bağlantılarıdır ve ayrıca sayılır

   Çalıştırma:
     export PW_HOME=~/.pw
     node tests/hesap-ailesi-qa.mjs                        # varsayılan 8811
     node tests/hesap-ailesi-qa.mjs http://localhost:8833
   ===================================================================== */
import { chromium } from './_pw.mjs';

/* =====================================================================
 ⚠ R15'TE ATLANDI — Beyar kararı, 2026-08-29:
   "Kırmızı testleri devre dışı bırak — silme, sadece atlanacak duruma
    getir. Bir daha test güncellemesiyle uğraşma. Bir şey kırılırsa
    tarayıcıda ölç ve kanıtla, yeterli."
 ---------------------------------------------------------------------
 İDDİALAR SİLİNMEDİ, dosya olduğu gibi duruyor — yalnız koşmuyor.
 Kırmızı olma sebebi (ölçüldü, 2026-08-29):
   eski kararı kodluyor: destek-v1.html#taleplerim @1440 → HTTP null
 Yeniden açmak için:  FIT_TESTI_ZORLA=1 node tests/hesap-ailesi-qa.mjs
 ===================================================================== */
if (!process.env.FIT_TESTI_ZORLA) {
  console.log('ATLANDI (R15) — eski kararı kodluyor: destek-v1.html#taleplerim @1440 → HTTP null');
  process.exit(0);
}

const BASE = process.argv[2] || 'http://localhost:8811';

const AILE = [
  'hesabim-v1.html',
  'profil-v1.html',
  'bildirimler-v1.html',
  'uyelik-faturalandirma-v1.html',
  'fatura-detay-v1.html',
  'veri-islem-kaydi-v1.html',
  'bagli-uygulamalar-v1.html',
  'destek-v1.html',
  'destek-v1.html#taleplerim',
  'destek-talebi-detay-v1.html',
  /* 🔴 Beyar 2026-08-26: "Çözüm Merkezi ayrı sayfa (SSS tarafı)" — sss-v1
     artık destek ailesinin ikinci adıdır, aileye alındı. */
  'destek-v1.html#cozum',
  'rozetler-v1.html',
  'fit-planim-rozetler-v1.html',
  'fit-planim-veri-izin-v1.html',
  'programlarim-v1.html#saglik',
  'egzersizlerim-v1.html#antrenorum',
  'antrenor-panelim-v1.html',
  'giris-v1.html',
  'pro-odeme-v1.html',
];
const GENISLIK = [1440, 1024, 768, 390];

/* =====================================================================
   🔴 KAYITLI TABAN — bu turdan ÖNCE de var olan, bu turda DOKUNULMAYAN
   sayfalardaki başlık bulguları.
   ---------------------------------------------------------------------
   Neden burada: nöbetin işi BU TURUN GERİLEMESİNİ yakalamaktır. Aşağıdaki
   dört sayfa bu turda hiç açılmadı (`git status` ile doğrulandı) ve
   bulguları yapısaldır — düzeltmek `.fp-head h3` gibi ETİKETE bağlı kabuk
   kurallarını ve onlara bağlı JS seçicilerini kırabilir (ders D-3). O yüzden
   ÖLÇÜLDÜ, ADIYLA YAZILDI ve lead'e soru olarak raporlandı; SESSİZCE
   yutulmadı.
   🔴 Bu tabloya kalem eklemek lead'in tek başına yetkisinde DEĞİLDİR
   (whitelist kilidi). Listede olmayan her bulgu KIRMIZIDIR.
   ===================================================================== */
const TABAN = {
  'profil-v1.html': [
    'h2-yok',      // görünür başlıklar: h1 → 8×h4 (hareket kartları) → h3 "Rozetler"
    'hiyerarsi'    // h1'den sonra h4 geliyor; bölüm başlıkları hiç basılmamış
  ],
  'bildirimler-v1.html': [
    'h2-yok'       // sayfanın tek görünür başlığı h1; bölümler başlıksız
  ],
  'fit-planim-veri-izin-v1.html': [
    'h2-yok',      // kart başlıkları `.fp-head h3` — Fit Planım kiti, .pnl-card değil
    'hiyerarsi'    // h1 → h3 atlaması aynı sebepten
  ],
  'giris-v1.html': [
    'hiyerarsi'    // pazarlama sütunundaki h2 DOM sırasında h1'den önce geliyor
  ],
  /* ⚠ sss-v1'e BU TURDA DOKUNULDU — ama yalnız SAYFANIN ADINA (`<h1>`
     "Sıkça Sorulan Sorular" → "Çözüm Merkezi", Beyar kararı). Başlık
     YAPISI değişmedi ve bulgular turdan ÖNCE de aynıydı: kategori etiketi
     `<p class="faq-kat-note">` (JS'in güncellediği canlı satır, başlık
     değil), sorular `<button class="qa-head">`, tek görünür alt başlık
     CTA kartının `<h3>`ü. Yapıyı düzeltmek `.faq-kat-note`u başlık
     öğesine çevirmek demek; o satır `h1..h4{line-height:1.12}` kuralına
     girer ve bugün olmayan bir kayma üretir (ders D-3 · nötrleyici tuzağı).
     Ölçüldü, adıyla yazıldı, lead'e açık kalem olarak raporlandı. */
  'destek-v1.html#cozum': [
    'h2-yok',      // görünür başlıklar: h1 → h3 "Cevap bulamadın mı?" (CTA kartı)
    'hiyerarsi'    // h1 → h3 atlaması aynı sebepten
  ]
};
const tabanda = (s, tur) => (TABAN[s] || []).includes(tur);

let fail = 0; const notlar = []; const tabanBulgu = [];
const bad = m => { fail++; console.log('  ✗ ' + m); };
const not = m => notlar.push(m);
const b = await chromium.launch();

console.log(`\nHESAP AİLESİ — ${AILE.length} adres × ${GENISLIK.length} genişlik = ${AILE.length*GENISLIK.length} koşum`);
console.log('Adresler: ' + AILE.join(' · '));

for(const w of GENISLIK){
  const ctx = await b.newContext({ viewport:{ width:w, height: w<600?844:1000 } });
  const p = await ctx.newPage();
  let tasma = 0, h1Kotu = 0, h2Yok = 0, hiyerarsi = 0, kucukHedef = 0, sayfa = 0;
  const hatalar = [];
  p.on('console', m => { if(m.type()==='error') hatalar.push(p.__s + ' :: ' + m.text().slice(0,120)); });
  p.on('pageerror', e => hatalar.push(p.__s + ' :: PAGEERROR ' + e.message.slice(0,120)));

  for(const s of AILE){
    p.__s = s;
    const r = await p.goto(`${BASE}/${s}`, { waitUntil:'networkidle' });
    if(!r || r.status() !== 200){ bad(`${s} @${w} → HTTP ${r && r.status()}`); continue; }
    await p.evaluate(() => new Promise(r => setTimeout(r, 350)));
    sayfa++;

    const t = await p.evaluate(() => {
      const gorunur = el => {
        const cs = getComputedStyle(el);
        return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0'
               && el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0;
      };
      /* başlık hiyerarşisi — YALNIZ sayfa gövdesi; kabuk (header/footer)
         her sayfada aynı ve bu nöbetin konusu değil */
      const kok = document.getElementById('pageMain') || document.body;
      const bas = [...kok.querySelectorAll('h1,h2,h3,h4,h5,h6')]
        .filter(gorunur).map(x => +x.tagName[1]);
      let kirik = 0;
      for(let i=1;i<bas.length;i++) if(bas[i] - bas[i-1] > 1) kirik++;

      /* dokunma hedefi — sayfa gövdesindeki gerçek düğme/kontrol.
         Satır içi metin bağlantısı (<p>/<li>/<small> içindeki <a>) hariç:
         onların hedefi metin satırıdır, kutu değil. */
      const kontrol = [...kok.querySelectorAll('button, a.btn, .df-fchip, .pg, input[type=checkbox], input[type=radio], select')]
        .filter(gorunur)
        .map(el => { const r = el.getBoundingClientRect(); return { ad: el.tagName.toLowerCase()+'.'+String(el.className||'').trim().split(/\s+/)[0], w: Math.round(r.width), h: Math.round(r.height) }; })
        .filter(x => x.h < 44 && x.w < 44);

      /* ⚠ GÖRÜNÜR olanlar sayılır. Bu sayfalarda sekmeli/panelli yapı var
         (giris-v1'in dört panelinin her birinde bir h1, hesabim-v1'in on
         paneli…); gizli panelleri saymak "5 h1 var" gibi YANLIŞ bir ölçüm
         verir. Ölçüt kullanıcının O AN gördüğü belge ana hattıdır. */
      const gorunurBas = t => [...kok.querySelectorAll(t)].filter(gorunur).length;
      return {
        d: document.documentElement.scrollWidth, w: window.innerWidth,
        h1: gorunurBas('h1'),
        h2: gorunurBas('h2'),
        ilk: bas[0] || null, kirik, kucuk: kontrol
      };
    });

    if(t.d > t.w){ tasma++; bad(`taşma @${w} ${s} → ${t.d} > ${t.w}`); }
    if(t.h1 !== 1){ h1Kotu++; bad(`h1 @${w} ${s} → ${t.h1} adet, 1 bekleniyordu`); }
    if(t.h2 === 0){
      if(tabanda(s,'h2-yok')){ if(w===GENISLIK[0]) tabanBulgu.push(`${s} · h2-yok`); }
      else { h2Yok++; bad(`h2 @${w} ${s} → sayfa gövdesinde hiç <h2> yok (P12/D-1 ana hattı)`); }
    }
    if(t.ilk !== null && t.ilk !== 1){
      if(tabanda(s,'hiyerarsi')){ if(w===GENISLIK[0]) tabanBulgu.push(`${s} · ilk başlık h${t.ilk}`); }
      else { hiyerarsi++; bad(`hiyerarşi @${w} ${s} → gövdenin ilk başlığı h${t.ilk}, h1 bekleniyordu`); }
    }
    if(t.kirik){
      if(tabanda(s,'hiyerarsi')){ if(w===GENISLIK[0]) tabanBulgu.push(`${s} · ${t.kirik} seviye atlaması`); }
      else { hiyerarsi++; bad(`hiyerarşi @${w} ${s} → ${t.kirik} yerde başlık seviyesi atlanmış`); }
    }
    if(t.kucuk.length){ kucukHedef += t.kucuk.length; not(`@${w} ${s} → ${t.kucuk.length} kontrol 44px altında: ${t.kucuk.slice(0,3).map(x=>x.ad+' '+x.w+'×'+x.h).join(', ')}`); }
  }

  if(hatalar.length) hatalar.forEach(h => bad(`konsol @${w} ${h}`));
  console.log(`  @${w} · ${sayfa}/${AILE.length} sayfa · taşma ${tasma} · h1 ${h1Kotu} · h2-yok ${h2Yok} · hiyerarşi ${hiyerarsi} · konsol ${hatalar.length} · 44px-altı kontrol ${kucukHedef}`);
  await ctx.close();
}

await b.close();
console.log('\n' + '='.repeat(58));
if(tabanBulgu.length){
  console.log('🔴 KAYITLI TABAN (bu turda DOKUNULMAYAN sayfalar · lead\'e soru olarak raporlandı):');
  tabanBulgu.forEach(x => console.log('  ! ' + x));
}
if(notlar.length){ console.log('NOTLAR (dokunma hedefi — sorun sayılmaz, kayda geçer):'); notlar.slice(0,12).forEach(n => console.log('  · ' + n)); if(notlar.length>12) console.log(`  · … ve ${notlar.length-12} not daha`); }
console.log(fail ? `\n✗ ${fail} SORUN` : '\n✓ HESAP AİLESİ TEMİZ — taşma 0 · konsol 0 · h1 tek · h2 korundu · hiyerarşi sağlam');
process.exit(fail ? 1 : 0);
