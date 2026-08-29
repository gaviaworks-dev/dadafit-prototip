/* =====================================================================
 HESABIM SEKME SADELEŞTİRME + FATURA BİLGİLERİ FORMU — KANIT
   A · 9 → 6 sekme, kalan altının sırası, bölüm sayısı
   B · kalkan üç bölümün içeriğinin yeni sayfalardaki karşılığı
   C · #uyelik / #odeme / #fatura çapasına giden CANLI bağlantı sayısı
   D · şerit ↔ kimlik kartı hizası (sol kenar ve genişlik)
   E · fatura bilgileri formu (segment · doğrulama · hafıza · a11y)
 Koşum: PW_HOME=~/.pw node docs/qa/hesabim-sekme-sadelestirme.mjs
 ===================================================================== */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';

const BASE = 'http://127.0.0.1:8788';
const tarayici = await chromium.launch();
const hatalar = [], sonuc = [];
const yaz = (a, b) => sonuc.push([a, b]);

/* Panel içi kaydırma: `.fb-panel` 100vh-40 ile kapanıp KENDİ İÇİNDE
   kayıyor. Playwright'ın otomatik "görünüre kaydır" adımı bu iç kabı
   güvenilir sürmüyor (ölçüldü: düğme y=1185'te kalıyor, tıklama
   düğmeye ulaşmıyor). Bu yüzden gönderimden önce panel elle dibe
   çekilir — gerçek kullanıcının yaptığı da bu. */
async function gonder(p) {
  await p.evaluate(() => { const pn = document.querySelector('#ftModal .fb-panel'); if (pn) pn.scrollTop = pn.scrollHeight; });
  await p.waitForTimeout(150);
  await p.click('#ftForm button[type=submit]');
  await p.waitForTimeout(350);
}

async function ac(url, w = 1440) {
  const ctx = await tarayici.newContext({ viewport: { width: w, height: 1000 } });
  const p = await ctx.newPage();
  p.on('pageerror', e => hatalar.push(`${url} @${w} · pageerror · ${e.message}`));
  p.on('console', m => { if (m.type() === 'error') hatalar.push(`${url} @${w} · ${m.text()}`); });
  await p.goto(BASE + '/' + url, { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.setItem('dm_fit_login', '1'));
  await p.reload({ waitUntil: 'networkidle' });
  return { ctx, p };
}

/* ============ A · SEKME SAYISI VE ADLARI ============ */
{
  const { ctx, p } = await ac('hesabim-v1.html');
  const r = await p.evaluate(() => {
    const k = [...document.querySelectorAll('#hsRail .dt')];
    return {
      sekme: k.length,
      adlar: k.map(x => x.textContent.trim()).join(' · '),
      capalar: k.map(x => x.getAttribute('href')).join(' '),
      bolum: document.querySelectorAll('.hs-sec').length,
      bolumIdleri: [...document.querySelectorAll('.hs-sec')].map(x => x.id).join(' ')
    };
  });
  yaz('sekme sayısı (9 → 6)', r.sekme);
  yaz('kalan altı, soldan sağa', r.adlar);
  yaz('çapaları', r.capalar);
  yaz('bölüm sayısı', r.bolum + ' → ' + r.bolumIdleri);
  yaz('kalkan üç bölüm DOM\'da kalmadı', await p.evaluate(() =>
    !document.getElementById('uyelik') && !document.getElementById('odeme') && !document.getElementById('fatura')));
  yaz('kalkan üç sekme kalemi kalmadı', await p.evaluate(() =>
    !document.getElementById('tab-uyelik') && !document.getElementById('tab-odeme') && !document.getElementById('tab-fatura')));
  yaz('#ftModal bu sayfadan kalktı', await p.evaluate(() => !document.getElementById('ftModal')));

  /* ---- C · canlı çapa bağlantısı ---- */
  yaz('hesabim içinde #uyelik/#odeme/#fatura\'ya giden CANLI bağlantı', await p.evaluate(() =>
    [...document.querySelectorAll('a[href]')]
      .filter(a => /^#(uyelik|odeme|fatura)$/.test(a.getAttribute('href'))).length));
  await ctx.close();
}

/* ---- C2 · diğer sayfalarımdan giden bağlantı ---- */
for (const u of ['odemelerim-v1.html', 'paketlerim-v1.html', 'pro-v1.html', 'pro-odeme-v1.html']) {
  const { ctx, p } = await ac(u);
  yaz(`${u} → hesabim#uyelik/#odeme/#fatura bağlantısı`, await p.evaluate(() =>
    [...document.querySelectorAll('a[href]')]
      .filter(a => /hesabim-v1\.html#(uyelik|odeme|fatura)/.test(a.getAttribute('href'))).length));
  await ctx.close();
}

/* ============ B · KAYIP KONTROLÜ ============ */
{
  const ARANAN = {
    'otomatik yenileme anahtarı': 'Otomatik yenileme',
    'abonelik iptali kapısı': 'Aboneliği İptal Et',
    'abonelik dondurma': 'Aboneliği Dondur',
    'antrenör paketi · 4 seans': 'Kuvvet Temeli',
    'antrenör paketi · 8 seans': 'Birebir Takip',
    'sona eren paket': 'Başlangıç Programı',
    'antrenör dizini düğmesi': 'Antrenör Dizinine Bak',
    'seans başına ödeme': 'Seans başına ödemeler',
    'kayıtlı kartlar': 'Kartların',
    'fatura defteri satırı': 'DFT-2026-004128',
    'fatura bilgileri formu': 'Fatura Bilgilerim',
    'ücretsiz kademe görünümü': 'Ücretsiz kademe',
    'kademe karşılaştırma tablosu': 'Hangi modül hangi kademede açık'
  };
  const bulundu = {};
  for (const u of ['odemelerim-v1.html', 'paketlerim-v1.html']) {
    const { ctx, p } = await ac(u);
    const metin = await p.evaluate(() => {
      const o = {};
      document.querySelectorAll('.fit-pane').forEach(x => {
        const g = x.hidden; x.hidden = false; o[x.dataset.pane] = x.innerText; x.hidden = g;
      });
      const m = document.getElementById('ftModal');
      if (m) o['#ftModal'] = m.innerText;
      return o;
    });
    for (const [ad, ara] of Object.entries(ARANAN))
      for (const [pane, v] of Object.entries(metin))
        if (v.includes(ara)) (bulundu[ad] ||= new Set()).add(u.replace('-v1.html', '') + ' › ' + pane);
    await ctx.close();
  }
  for (const ad of Object.keys(ARANAN))
    yaz('karşılık · ' + ad, bulundu[ad] ? [...bulundu[ad]].join(' | ') : '🔴 BULUNAMADI');
}

/* ============ D · ŞERİT ↔ KİMLİK KARTI HİZASI ============ */
for (const w of [390, 768, 1440]) {
  const { ctx, p } = await ac('hesabim-v1.html', w);
  yaz(`hiza @${w}`, await p.evaluate(() => {
    const r = document.getElementById('hsRail').getBoundingClientRect();
    const k = document.querySelector('.fp-kimlik').getBoundingClientRect();
    const t = [...document.querySelectorAll('#hsRail .dt')];
    const i = t[0].getBoundingClientRect(), s = t[t.length - 1].getBoundingClientRect();
    const d = document.documentElement;
    const esit = Math.round(r.left) === Math.round(k.left) && Math.round(r.width) === Math.round(k.width);
    return `şerit ${Math.round(r.left)}/${Math.round(r.width)} · kart ${Math.round(k.left)}/${Math.round(k.width)}` +
      ` · EŞİT ${esit}` +
      ` · grup merkezi ${Math.round((i.left + s.right) / 2)} · sayfa merkezi ${Math.round(innerWidth / 2)}` +
      ` · kaydırılabilir ${document.getElementById('hsRail').scrollWidth > document.getElementById('hsRail').clientWidth}` +
      ` · taşma ${d.scrollWidth - d.clientWidth}px`;
  }));
  await ctx.close();
}

/* ============ E · FATURA BİLGİLERİ FORMU ============ */
{
  const { ctx, p } = await ac('odemelerim-v1.html#faturalar');
  yaz('form · düğme başka sayfaya GİTMİYOR', await p.evaluate(() => {
    const b = document.getElementById('odFtBilgi');
    return b.tagName === 'BUTTON' && !b.getAttribute('href');
  }));
  await p.click('#odFtBilgi'); await p.waitForTimeout(400);
  yaz('form · aynı sayfada popup açıldı', await p.evaluate(() =>
    document.getElementById('ftModal').classList.contains('show')));
  yaz('form · dürüst şerit', (await p.textContent('#ftModal .hr-note')).replace(/\s+/g, ' ').trim().slice(0, 90) + '…');
  yaz('form · "yakında" geçmiyor', !/yakında/i.test(await p.textContent('#ftModal')));
  yaz('form · kapatma düğmesi', await p.evaluate(() => {
    const c = document.getElementById('ftClose'), r = c.getBoundingClientRect();
    return `${Math.round(r.width)}×${Math.round(r.height)} · aria-label="${c.getAttribute('aria-label')}"`;
  }));
  yaz('form · açılışta odak panelde', await p.evaluate(() =>
    document.getElementById('ftModal').contains(document.activeElement)));

  yaz('form · il sayısı', await p.$$eval('#ftIl option', o => o.length - 1));
  yaz('form · ilçe İL SEÇİLMEDEN pasif', await p.isDisabled('#ftIlce'));
  await p.selectOption('#ftIl', 'İstanbul'); await p.waitForTimeout(150);
  yaz('form · il seçilince ilçe açıldı', !(await p.isDisabled('#ftIlce')));
  yaz('form · ülke kodu seçicisi', await p.$$eval('#ftModal .fk-cc-list li', l => l.length) + ' ülke');

  /* segment geçişi ortak alanları SIFIRLAMIYOR */
  await p.fill('#ftTel', '5555555555');
  await p.fill('#ftEposta', 'elif@ornek.com');
  await p.fill('#ftIlce', 'Kadıköy');
  await p.fill('#ftAdres', 'Bağdat Caddesi No 14 Daire 3');
  await p.click('.ft-seg button[data-tip="kurumsal"]'); await p.waitForTimeout(200);
  yaz('form · kurumsal bloğu açıldı, bireysel kapandı', await p.evaluate(() =>
    !document.querySelector('.ft-blok[data-blok=kurumsal]').hidden &&
    document.querySelector('.ft-blok[data-blok=bireysel]').hidden));
  yaz('form · 🔴 tip değişince ORTAK ALANLAR SIFIRLANMADI', await p.evaluate(() =>
    [['tel', 'ftTel'], ['eposta', 'ftEposta'], ['il', 'ftIl'], ['ilçe', 'ftIlce'], ['adres', 'ftAdres']]
      .map(([ad, id]) => ad + '=' + (document.getElementById(id).value ? 'dolu' : '🔴BOŞ')).join(' ')));

  /* VKN doğrulaması */
  await p.fill('#ftUnvan', 'Örnek Yazılım A.Ş.');
  await p.fill('#ftDaire', 'Kadıköy');
  await p.fill('#ftVkn', '123');
  await gonder(p);
  yaz('form · 3 haneli VKN reddedildi', await p.evaluate(() =>
    document.getElementById('ftVknHata').classList.contains('show')));
  await p.fill('#ftVkn', '1234567890');
  await gonder(p);
  yaz('form · 10 haneli VKN kabul edildi', !(await p.evaluate(() =>
    document.getElementById('ftVknHata').classList.contains('show'))));
  yaz('form · kaydetme sonucu', (await p.textContent('#ftSonuc .od-sonuc-txt')).replace(/\s+/g, ' ').trim());

  /* TCKN sağlaması */
  await p.click('.ft-seg button[data-tip="bireysel"]'); await p.waitForTimeout(150);
  await p.fill('#ftAd', 'Elif Şahin');
  await p.fill('#ftTckn', '12345678901');
  await gonder(p);
  yaz('form · sağlaması tutmayan TCKN reddedildi', await p.evaluate(() =>
    document.getElementById('ftTcknHata').classList.contains('show')));
  await p.fill('#ftTckn', '10000000146');   /* sağlaması tutan örnek */
  await gonder(p);
  yaz('form · sağlaması tutan TCKN kabul edildi', !(await p.evaluate(() =>
    document.getElementById('ftTcknHata').classList.contains('show'))));

  /* tarayıcı hafızası — GERÇEK yetenek */
  const kaydedilen = await p.evaluate(() => localStorage.getItem('dm_fit_fatura_v1'));
  yaz('form · localStorage anahtarı yazıldı', kaydedilen ? 'dm_fit_fatura_v1 (' + kaydedilen.length + ' bayt)' : '🔴 YOK');
  await p.reload({ waitUntil: 'networkidle' });
  await p.click('#odFtBilgi'); await p.waitForTimeout(400);
  yaz('form · yenileme sonrası geri geldi', await p.evaluate(() =>
    ['ftAd', 'ftTel', 'ftEposta', 'ftIl', 'ftIlce', 'ftAdres']
      .map(id => document.getElementById(id).value).filter(Boolean).length + ' / 6 alan dolu'));

  await p.keyboard.press('Escape'); await p.waitForTimeout(350);
  yaz('form · Escape kapattı', await p.evaluate(() =>
    !document.getElementById('ftModal').classList.contains('show')));
  yaz('form · odak açtırana döndü', await p.evaluate(() =>
    document.activeElement === document.getElementById('odFtBilgi')));
  await ctx.close();
}

/* form taşma ölçümü */
for (const w of [390, 768, 1440]) {
  const { ctx, p } = await ac('odemelerim-v1.html#faturalar', w);
  await p.click('#odFtBilgi'); await p.waitForTimeout(350);
  yaz(`form @${w} · taşma`, await p.evaluate(() => {
    const d = document.documentElement;
    const pn = document.querySelector('#ftModal .fb-panel').getBoundingClientRect();
    return `sayfa ${d.scrollWidth - d.clientWidth}px · panel sağı ${Math.round(pn.right)} (ekran ${innerWidth})`;
  }));
  await ctx.close();
}

await tarayici.close();
console.log('\n╔══ SADELEŞTİRME + FATURA FORMU ÖLÇÜMÜ ══╗');
for (const [a, b] of sonuc) console.log('  ' + String(a).padEnd(52) + ' → ' + b);
console.log('\n  konsol/sayfa hatası: ' + hatalar.length + (hatalar.length ? '\n    ' + hatalar.join('\n    ') : ''));

/* ============ F · FATURA BELGESİ PENCERESİ (#fdModal) ============ */
{
  const tarayici2 = await chromium.launch();
  const ctx = await tarayici2.newContext({ viewport: { width: 1440, height: 1000 } });
  const p = await ctx.newPage();
  const yerel = [];
  p.on('pageerror', e => yerel.push('pageerror · ' + e.message));
  p.on('console', m => { if (m.type() === 'error') yerel.push(m.text()); });
  await p.goto(BASE + '/odemelerim-v1.html#faturalar', { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.setItem('dm_fit_login', '1'));
  await p.reload({ waitUntil: 'networkidle' });

  yaz('belge · "Detay" artık BAĞLANTI değil düğme', await p.evaluate(() => {
    const b = document.querySelector('#odFtBody [data-fatura]');
    return b.tagName === 'BUTTON' && !b.getAttribute('href');
  }));
  yaz('belge · sayfada fatura-detay-v1.html bağlantısı', await p.evaluate(() =>
    [...document.querySelectorAll('a[href]')].filter(a => /fatura-detay-v1/.test(a.getAttribute('href'))).length));

  await p.click('#odFtBody tr:nth-child(4) [data-fatura]');
  await p.waitForTimeout(400);
  yaz('belge · pencere açıldı', await p.evaluate(() => document.getElementById('fdModal').classList.contains('show')));
  yaz('belge · künye', (await p.textContent('#fdKunye')).replace(/\s+/g, ' ').trim());
  yaz('belge · satıcı (uydurma VKN YOK)', (await p.textContent('#fdSatici')).replace(/\s+/g, ' ').trim());
  yaz('belge · alıcı', (await p.textContent('#fdAlici')).replace(/\s+/g, ' ').trim());
  yaz('belge · kalem tablosu sütunları', (await p.$$eval('#fdModal .od-tab thead th', t => t.map(x => x.textContent.trim()))).join(' · '));
  yaz('belge · toplamlar', (await p.textContent('#fdToplam')).replace(/\s+/g, ' ').trim());
  yaz('belge · ödeme satırı', (await p.textContent('#fdOde')).replace(/\s+/g, ' ').trim());
  yaz('belge · dürüst şerit', (await p.textContent('#fdModal .hr-note')).replace(/\s+/g, ' ').trim().slice(0, 80) + '…');
  yaz('belge · "yakında" geçmiyor', !/yakında/i.test(await p.textContent('#fdModal')));
  yaz('belge · kapatma düğmesi', await p.evaluate(() => {
    const c = document.getElementById('fdClose'), r = c.getBoundingClientRect();
    return `${Math.round(r.width)}×${Math.round(r.height)} · aria-label="${c.getAttribute('aria-label')}"`;
  }));
  yaz('belge · açılışta odak panelde', await p.evaluate(() => document.getElementById('fdModal').contains(document.activeElement)));

  await p.evaluate(() => { const pn = document.querySelector('#fdModal .fb-panel'); pn.scrollTop = pn.scrollHeight; });
  await p.waitForTimeout(150);
  await p.click('#fdIndir'); await p.waitForTimeout(300);
  yaz('belge · "PDF İndir" dürüst sonuç', (await p.textContent('#fdSonuc .od-sonuc-txt')).replace(/\s+/g, ' ').trim());

  await p.keyboard.press('Escape'); await p.waitForTimeout(350);
  yaz('belge · Escape kapattı', await p.evaluate(() => !document.getElementById('fdModal').classList.contains('show')));

  /* KDV ayrıştırması kuruşu kaçırmıyor mu — defterin tamamında */
  yaz('belge · KDV ayrıştırması tüm defterde tutarlı', await p.evaluate(() =>
    FIT_FATURA.defter.every(f => {
      const t = FIT_FATURA.toplamlar(f);
      return t.ara + t.kdv === t.genel;
    }) ? FIT_FATURA.defter.length + ' / ' + FIT_FATURA.defter.length + ' kayıt (ara+KDV = genel)' : '🔴 SAPMA VAR'));

  /* alıcı künyesi form kaydından geliyor mu */
  await p.click('#odFtBilgi'); await p.waitForTimeout(350);
  await p.click('.ft-seg button[data-tip="kurumsal"]'); await p.waitForTimeout(150);
  await p.fill('#ftUnvan', 'Örnek Yazılım A.Ş.'); await p.fill('#ftDaire', 'Kadıköy'); await p.fill('#ftVkn', '1234567890');
  await p.fill('#ftTel', '5555555555'); await p.fill('#ftEposta', 'muhasebe@ornek.com');
  await p.selectOption('#ftIl', 'İstanbul'); await p.waitForTimeout(120);
  await p.fill('#ftIlce', 'Kadıköy'); await p.fill('#ftAdres', 'Bağdat Caddesi No 14 Daire 3');
  await gonder(p);
  await p.keyboard.press('Escape'); await p.waitForTimeout(350);
  await p.click('#odFtBody tr:nth-child(2) [data-fatura]'); await p.waitForTimeout(350);
  yaz('belge · alıcı künyesi FORMDAN okundu', (await p.textContent('#fdAlici')).replace(/\s+/g, ' ').trim());

  await tarayici2.close();
  hatalar.push(...yerel);
}

console.log('\n╔══ FATURA BELGESİ PENCERESİ ══╗');
for (const [a, b] of sonuc.slice(-16)) console.log('  ' + String(a).padEnd(46) + ' → ' + b);
console.log('\n  bu bölümün hataları dahil toplam: ' + hatalar.length);
