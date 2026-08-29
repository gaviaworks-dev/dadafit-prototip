/* =====================================================================
 ÖDEME DALGASI — ETKİLEŞİM ÖLÇÜMÜ
 ---------------------------------------------------------------------
 Neyin GERÇEKTEN çalıştığını ve neyin dürüstçe maket kaldığını ölçer.
 "Ekledim / çalışıyor" kanıt değildir (DENETIM.md); her madde SAYI ya da
 EKRANDAN OKUNAN METİN döndürür.

 Koşum: PW_HOME=~/.pw node docs/qa/odeme-etkilesim.mjs
 ===================================================================== */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';

const BASE = 'http://127.0.0.1:8788';
const tarayici = await chromium.launch();
const ctx = await tarayici.newContext({ viewport: { width: 1440, height: 1000 } });
const sf = await ctx.newPage();
const hatalar = [];
sf.on('pageerror', e => hatalar.push('pageerror · ' + e.message));
sf.on('console', m => { if (m.type() === 'error') hatalar.push('console · ' + m.text()); });

async function ac(url){
  await sf.goto(BASE + '/' + url, { waitUntil: 'networkidle' });
  await sf.evaluate(() => localStorage.setItem('dm_fit_login', '1'));
  await sf.reload({ waitUntil: 'networkidle' });
}
const sonuc = [];
const yaz = (a, b) => { sonuc.push([a, b]); };

/* ================= 1 · ÖDEMELERİM · fatura süzgeci (GERÇEK) ========= */
await ac('odemelerim-v1.html#faturalar');
yaz('süzgeç · derin bağlantı #faturalar açtı',
  await sf.evaluate(() => document.querySelector('.fit-pane[data-pane="faturalar"]').getClientRects().length > 0));
const tumu = await sf.$$eval('#odFtBody tr', r => r.length);
await sf.click('#odFtChips button[data-tur="uyelik"]');
const uyelik = await sf.$$eval('#odFtBody tr', r => r.length);
await sf.click('#odFtChips button[data-tur="iade"]');
const iade = await sf.$$eval('#odFtBody tr', r => r.length);
yaz('süzgeç · tümü / üyelik / iade satır sayısı', `${tumu} / ${uyelik} / ${iade}`);
yaz('süzgeç · sayaç metni', (await sf.textContent('#odFtCount')).trim());

/* boş durum: hiçbir satırı olmayan tür yok, o yüzden süzgeci elle boşalt */
yaz('boş durum kartı DOM\'da ve dört parçalı',
  await sf.evaluate(() => {
    const b = document.getElementById('odFtBos');
    return !!(b && b.querySelector('.pe-ico') && b.querySelector('h4') && b.querySelector('p') && b.querySelector('.btn'));
  }));

/* ================= 2 · KART FORMU · doğrulama GERÇEK ================= */
await ac('odemelerim-v1.html#kartlar');
await sf.click('#odKartForm button[type=submit]');
yaz('kart formu · boş gönderimde açılan hata sayısı',
  await sf.$$eval('#odKartForm .fk-hata.show', n => n.length));
/* geçersiz kart numarası (Luhn'dan geçmez) */
await sf.fill('#odKkAd', 'Elif Şahin');
await sf.fill('#odKkNo', '1234567812345678');
await sf.fill('#odKkSkt', '0130');
await sf.fill('#odKkCvv', '123');
await sf.click('#odKartForm button[type=submit]');
yaz('kart formu · geçersiz numara reddedildi',
  await sf.evaluate(() => document.getElementById('odKkNoHata').classList.contains('show')));
/* geçmiş tarih */
await sf.fill('#odKkNo', '4242424242424242');
await sf.fill('#odKkSkt', '01/20');
await sf.click('#odKartForm button[type=submit]');
yaz('kart formu · geçmiş SKT reddedildi',
  await sf.evaluate(() => document.getElementById('odKkSktHata').classList.contains('show')));
/* geçerli kart → DÜRÜST maket sonucu */
await sf.fill('#odKkSkt', '08/30');
await sf.click('#odKartForm button[type=submit]');
yaz('kart formu · geçerli kartta ekrana basılan metin',
  (await sf.textContent('#odKartEkleSonuc .od-sonuc-txt')).trim());
yaz('kart formu · "başarı" kelimesi geçmiyor',
  !/başarı|kaydedildi|eklendi\b/i.test(await sf.textContent('#odKartEkleSonuc .od-sonuc-txt')));

/* kart kaldırma da dürüst */
await sf.click('[data-kart-sil]');
yaz('kart kaldır · ekrana basılan metin', (await sf.textContent('#odKartSonuc .od-sonuc-txt')).trim());

/* ================= 3 · İADE FORMU ================= */
await ac('odemelerim-v1.html#iade');
yaz('iade · tahsilat seçenekleri defterden üretildi',
  await sf.$$eval('#odIadeTahsilat option', o => o.length - 1));
await sf.click('#odIadeForm button[type=submit]');
yaz('iade · boş gönderimde açılan hata sayısı',
  await sf.$$eval('#odIadeForm .fk-hata.show', n => n.length));
await sf.selectOption('#odIadeTahsilat', { index: 1 });
yaz('iade · tutar seçilen tahsilattan okundu', (await sf.textContent('#odIadeTutar')).trim());
await sf.selectOption('#odIadeNeden', 'yanlis');
await sf.fill('#odIadeAciklama', 'Kısa');
await sf.click('#odIadeForm button[type=submit]');
yaz('iade · 20 karakterden kısa açıklama reddedildi',
  await sf.evaluate(() => document.getElementById('odIadeAciklamaHata').classList.contains('show')));
await sf.fill('#odIadeAciklama', 'Aynı seans için iki kez tahsilat alındı, ikincisinin iadesini istiyorum.');
yaz('iade · karakter sayacı çalışıyor', (await sf.textContent('#odIadeSayac')).trim());
await sf.click('#odIadeForm button[type=submit]');
yaz('iade · gönderimde ekrana basılan metin', (await sf.textContent('#odIadeSonuc .od-sonuc-txt')).trim());

/* ================= 4 · ABONELİK İPTAL KAPISI ================= */
await ac('odemelerim-v1.html#abonelik');
yaz('iptal düğmesi başlangıçta kapalı', await sf.isDisabled('#odIptalBtn'));
await sf.check('#odIptalOnay');
yaz('onay kutusu düğmeyi açtı', !(await sf.isDisabled('#odIptalBtn')));
await sf.click('#odIptalBtn');
yaz('iptal · ekrana basılan metin', (await sf.textContent('#odIptalSonuc .od-sonuc-txt')).trim());
await sf.click('#odDondurBtn');
yaz('dondur · ekrana basılan metin', (await sf.textContent('#odIptalSonuc .od-sonuc-txt')).trim());
/* kampanya kodu */
await sf.fill('#odPromoKod', 'YOKBOYLEKOD');
await sf.click('#odPromoForm button[type=submit]');
yaz('promo · tanınmayan kod reddedildi', (await sf.textContent('#odPromoHata span')).trim());
await sf.fill('#odPromoKod', 'hareket25');
await sf.click('#odPromoForm button[type=submit]');
yaz('promo · tanınan kodda ekrana basılan metin', (await sf.textContent('#odPromoSonuc .od-sonuc-txt')).trim());

/* ================= 5 · PAKETLERİM · üç persona ================= */
for(const k of ['ucretsiz','pro','promax']){
  await ac('paketlerim-v1.html?paket=' + k);
  yaz('paketlerim · ?paket=' + k + ' aktif kart başlığı',
    (await sf.textContent('#pkAktif .sub-tier-info b')).replace(/\s+/g,' ').trim());
}
await ac('paketlerim-v1.html#kademeler');
yaz('kademeler · kart sayısı', await sf.$$eval('#pkKartlar .pro-card', n => n.length));
yaz('kademeler · kart düğme etiketleri',
  (await sf.$$eval('#pkKartlar .pro-card > .btn', n => n.map(x => x.textContent.trim()))).join(' | '));
yaz('kademeler · "kapalı özellik" katlanır blok sayısı',
  await sf.$$eval('#pkKartlar .pro-kapali', n => n.length));
await ac('paketlerim-v1.html#karsilastir');
yaz('karşılaştırma · modül satırı (grup başlıkları hariç)',
  await sf.$$eval('#pkTablo tbody tr:not(.cmp-group)', n => n.length));
yaz('karşılaştırma · grup sayısı', await sf.$$eval('#pkTablo tbody tr.cmp-group', n => n.length));
yaz('karşılaştırma · Pro Max fiyat hücresi',
  (await sf.$$eval('#pkTablo thead th .ch-price', n => n.map(x => x.textContent.trim()))).join(' | '));

/* ================= 6 · YÜKSELTME AKIŞI ================= */
await ac('pro-odeme-v1.html?plan=promax');
yaz('ödeme · plan adı ve fiyat',
  (await sf.textContent('#psName')) + ' · ' + (await sf.textContent('#psPrice')));
yaz('ödeme · kart formu başlangıçta kapalı (kayıtlı kart seçili)',
  await sf.evaluate(() => document.getElementById('kartFormu').hidden));
await sf.click('#startSub');
yaz('ödeme · onaysız gönderimde durum ekranı AÇILMADI',
  !(await sf.evaluate(() => document.body.classList.contains('pay-done'))));
/* #agreePro görsel olarak gizli (opacity:0) ve üstünde `.cbx` var —
   gerçek kullanıcı gibi ETİKETE tıklanır, kutuya değil. */
await sf.click('label.agree');
await sf.waitForTimeout(200);
/* radyo da görsel olarak gizli (opacity:0), `.pm-dot` üstünde —
   gerçek kullanıcı gibi ETİKETE tıklanır. */
await sf.click('label[for=pmYeni]');
await sf.waitForTimeout(200);
yaz('ödeme · yeni kart seçilince form açıldı',
  await sf.evaluate(() => !document.getElementById('kartFormu').hidden));
await sf.click('#startSub');
yaz('ödeme · boş kart formuyla durum ekranı AÇILMADI',
  !(await sf.evaluate(() => document.body.classList.contains('pay-done'))));
yaz('ödeme · açılan alan hatası sayısı',
  await sf.$$eval('#kartFormu .fk-hata.show', n => n.length));
await sf.fill('#ccName', 'Elif Şahin');
await sf.fill('#ccNum', '4242424242424242');
await sf.fill('#ccExp', '0830');
await sf.fill('#ccCvv', '123');
await sf.click('#startSub');
yaz('ödeme · geçerli formda durum ekranı açıldı',
  await sf.evaluate(() => document.body.classList.contains('pay-done')));
yaz('ödeme · durum ekranı başlığı', (await sf.textContent('.pay-success h2')).trim());
yaz('ödeme · durum ekranında "başlad" / "başarı" geçmiyor',
  !/başarı|üyeliğin başladı|tebrik/i.test(await sf.textContent('.pay-success')));
yaz('ödeme · seçilen yöntem durum ekranına yazıldı', (await sf.textContent('#dsYontem')).trim());

/* ================= 7 · PRO SAYFASI ================= */
await ac('pro-v1.html');
yaz('pro · kademe kartı sayısı', await sf.$$eval('#proKartlar .pro-card', n => n.length));
yaz('pro · kart düğmeleri',
  (await sf.$$eval('#proKartlar .pro-card > .btn', n => n.map(x => x.textContent.trim()))).join(' | '));
yaz('pro · sayfada "Pro Max AI" geçen görünür metin',
  await sf.evaluate(() => (document.body.innerText.match(/Pro Max AI/g) || []).length));
yaz('pro · antrenör ücreti ayrımı basıldı', (await sf.textContent('#proAyri')).trim().slice(0, 60) + '…');

await tarayici.close();

console.log('\n╔══ ETKİLEŞİM ÖLÇÜMÜ ══╗');
for (const [a, b] of sonuc) console.log('  ' + a.padEnd(52) + ' → ' + b);
console.log('\n  konsol/sayfa hatası: ' + hatalar.length + (hatalar.length ? '\n    ' + hatalar.join('\n    ') : ''));
