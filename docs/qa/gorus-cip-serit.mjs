/* =====================================================================
   GÖRÜŞ BİLDİR — BÖLÜM ŞERİDİ ÖLÇÜMÜ   (R18 · madde 1, Beyar 2026-08-30)
   ---------------------------------------------------------------------
   Beyar: "Popup'taki bölüm şeridi çift satıra taşıyor. TEK SATIR olacak,
   sığmazsa yatay kaydırılabilir. 'Uygulama' seçeneği KALKACAK — mobil
   uygulamamız yok. Kalan kalemler güncel modüllerle yenilensin."

   Ölçütler (hepsi SAYI):
     1. Şerit TEK SATIR mı  → bütün çiplerin offsetTop'u AYNI olmalı
     2. Sığmıyorsa yatay kaydırılıyor mu → scrollWidth > clientWidth iken
        overflow-x = auto/scroll ve gerçekten kaydırılabiliyor
     3. Dikey kaydırma YOK  → şeridin scrollHeight == clientHeight
     4. "Uygulama" çipi     → 0 adet
     5. Çip metinleri kabuğun modül listesiyle eşleşiyor mu
     6. Dokunma hedefi 44px → görünmez ::before ile, HIT TEST'le doğrulanır
     7. Konsol hatası       → 0

   Koş: PW_HOME=$HOME/.pw node docs/qa/gorus-cip-serit.mjs
   ===================================================================== */
import { chromium } from '../../tests/_pw.mjs';

const BASE = process.env.BASE || 'http://127.0.0.1:8099';
const SAYFALAR = (process.env.SAYFALAR || 'dadafit-hub-v1.html,egzersizlerim-v1.html,hareket-rehberi-v1.html').split(',');
const ENLER = [1440, 1024, 390];

/* Kabuğun güncel modül yüzeyi — NAV'ın dört kalemi + Enerji Defteri + Diğer.
   Beklenen liste BURAYA yazılır ki şerit sessizce eskimesin. */
const BEKLENEN = ['Hareketler','Programlar','Challenge','Antrenörler','Enerji Defteri','Diğer'];

const b = await chromium.launch();
let kirmizi = 0;
console.log('\n═══ GÖRÜŞ BİLDİR · BÖLÜM ŞERİDİ ═══\n');

for(const en of ENLER){
  for(const sayfa of SAYFALAR){
    const p = await b.newPage({ viewport:{ width:en, height:1000 } });
    const konsol = [];
    p.on('console', m => { if(m.type()==='error') konsol.push(m.text()); });
    p.on('pageerror', e => konsol.push('pageerror: '+e.message));

    await p.goto(`${BASE}/${sayfa}`, { waitUntil:'networkidle' });
    const cerez = await p.$('#cookieAccept'); if(cerez) await cerez.click();
    /* ⚠ `.feedback-tab` sayfa açılışında banner hizasına kayıyor ve
       görünür olmayabiliyor (R11 · "Görüş Bildir her tarafta yukarı
       çekilecek"). Playwright'ın görünürlük şartına takılmamak için
       modal DOM üzerinden açılıyor — kabuğun kendi dinleyicisi koşuyor. */
    await p.evaluate(() => document.getElementById('fbTab').click());
    await p.waitForSelector('.fb-fields.active .fb-chiprow .chip', { state:'visible', timeout:5000 });

    const r = await p.evaluate(() => {
      const row = document.querySelector('.fb-fields.active .fb-chiprow');
      const chips = [...row.querySelectorAll('.chip')];
      const cs = getComputedStyle(row);
      const ust = [...new Set(chips.map(c => Math.round(c.getBoundingClientRect().top)))];
      /* HIT TEST — görünmez ::before dokunma hedefini 44px'e açıyor.
         ⚠ Şerit yatay kaydırıldığı için sağdaki çipler kabın DIŞINDA
         kalabiliyor; orada `elementFromPoint` null döner ve çip
         yanlışlıkla "düşük hedef" sayılırdı (390px'te ölçüldü: iki çip).
         Bu yüzden her çip önce şeridin görünür penceresine kaydırılır —
         kullanıcı da tıklamadan önce aynı şeyi yapıyor. */
      const dusuk = chips.filter(c => {
        c.scrollIntoView({ block:'nearest', inline:'center' });
        const b = c.getBoundingClientRect();
        const cx = b.left + b.width/2, cy = b.top + b.height/2, d = 44/2 - 1;
        const alan = (y) => { const n = document.elementFromPoint(cx, y); return !!n && (n===c || c.contains(n) || n.contains(c)); };
        return !(alan(cy-d) && alan(cy+d));
      }).map(c => c.textContent.trim());
      row.scrollLeft = 0;
      return {
        cip: chips.length,
        metinler: chips.map(c => c.textContent.trim()),
        satir: ust.length,                       /* 1 olmalı */
        wrap: cs.flexWrap,
        overflowX: cs.overflowX,
        tasiyor: row.scrollWidth > row.clientWidth + 1,
        scrollW: row.scrollWidth, clientW: row.clientWidth,
        dikeyTasma: row.scrollHeight - row.clientHeight,
        yukseklik: +row.getBoundingClientRect().height.toFixed(1),
        cipYuk: +chips[0].getBoundingClientRect().height.toFixed(1),
        dusuk
      };
    });

    /* kaydırma gerçekten çalışıyor mu */
    let kaydi = null;
    if(r.tasiyor){
      kaydi = await p.evaluate(() => {
        const row = document.querySelector('.fb-fields.active .fb-chiprow');
        row.scrollLeft = 9999; const v = row.scrollLeft; row.scrollLeft = 0; return v > 0;
      });
    }

    const eksik = BEKLENEN.filter(x => !r.metinler.includes(x));
    const fazla = r.metinler.filter(x => !BEKLENEN.includes(x));
    const uygulama = r.metinler.filter(x => /uygulama/i.test(x)).length;

    const kusur = [];
    if(r.satir !== 1)                    kusur.push(`şerit ${r.satir} satır`);
    if(r.wrap !== 'nowrap')              kusur.push(`flex-wrap:${r.wrap}`);
    if(r.tasiyor && !kaydi)              kusur.push('taşıyor ama kaydırılamıyor');
    if(r.tasiyor && !/auto|scroll/.test(r.overflowX)) kusur.push(`overflow-x:${r.overflowX}`);
    if(r.dikeyTasma > 0)                 kusur.push(`dikey taşma ${r.dikeyTasma}px`);
    if(uygulama)                         kusur.push(`"Uygulama" çipi ${uygulama} adet`);
    if(eksik.length)                     kusur.push('eksik kalem: '+eksik.join('/'));
    if(fazla.length)                     kusur.push('fazla kalem: '+fazla.join('/'));
    if(r.dusuk.length)                   kusur.push('44px altı hedef: '+r.dusuk.join('/'));
    if(konsol.length)                    kusur.push(`konsol ${konsol.length}`);
    if(kusur.length) kirmizi++;

    console.log(
      `${String(en).padStart(4)} · ${sayfa.padEnd(26)} çip ${r.cip} · satır ${r.satir} · ` +
      `${r.tasiyor ? `taşıyor (${r.scrollW}>${r.clientW}) kaydırma ${kaydi?'✔':'✘'}` : `sığıyor (${r.scrollW}≤${r.clientW})`} · ` +
      `çip ${r.cipYuk}px · ${kusur.length ? '🔴 ' + kusur.join(' | ') : '✔'}`
    );
    if(en === ENLER[0] && sayfa === SAYFALAR[0]) console.log(`       kalemler: ${r.metinler.join(' · ')}`);
    await p.close();
  }
}

console.log('\n' + (kirmizi === 0 ? '✅ KAPI YEŞİL — ' + (ENLER.length*SAYFALAR.length) + ' ölçümün hepsi geçti'
                                  : `🔴 KAPI KIRMIZI — ${kirmizi} ölçüm düştü`));
await b.close();
process.exit(kirmizi === 0 ? 0 : 1);
