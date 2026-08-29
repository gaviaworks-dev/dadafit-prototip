/* =====================================================================
 HESABIM — DÖRT DÜZELTMENİN KANITI
   1 · fotoğraf popup'ı (kapatma düğmesi · ayak hizası · a11y)
   2 · "Kaldır" seçeneği (avatar + kapak)
   3 · sekme şeridi ortalama
   4 · doğum tarihi takvimi
 Her madde SAYI ya da EKRANDAN OKUNAN METİN döndürür (DENETIM.md).
 Koşum: PW_HOME=~/.pw node docs/qa/hesabim-duzeltme.mjs
 ===================================================================== */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';

const BASE = 'http://127.0.0.1:8788/hesabim-v1.html';
const tarayici = await chromium.launch();
const hatalar = [];
const sonuc = [];
const yaz = (a, b) => sonuc.push([a, b]);

async function sayfa(w = 1440) {
  const ctx = await tarayici.newContext({ viewport: { width: w, height: 1000 } });
  const p = await ctx.newPage();
  p.on('pageerror', e => hatalar.push(`${w}px · pageerror · ${e.message}`));
  p.on('console', m => { if (m.type() === 'error') hatalar.push(`${w}px · ${m.text()}`); });
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.setItem('dm_fit_login', '1'));
  await p.reload({ waitUntil: 'networkidle' });
  return { ctx, p };
}

/* ============ 1 · FOTOĞRAF POPUP'I ============ */
{
  const { ctx, p } = await sayfa();
  await p.click('.fp-ava-edit');
  await p.waitForTimeout(300);

  yaz('popup · kapatma düğmesi ölçüsü', (await p.evaluate(() => {
    const r = document.getElementById('fotoClose').getBoundingClientRect();
    return Math.round(r.width) + '×' + Math.round(r.height);
  })));
  yaz('popup · kapatma düğmesinde ikon var mı', await p.evaluate(() => {
    const i = document.querySelector('#fotoClose i');
    if (!i) return 'İKON YOK';
    const r = i.getBoundingClientRect();
    const ff = getComputedStyle(i, '::before').fontFamily;
    return `${Math.round(r.width)}×${Math.round(r.height)} · ${ff}`;
  }));
  yaz('popup · kapatma düğmesi aria-label', await p.getAttribute('#fotoClose', 'aria-label'));
  yaz('popup · kapatma düğmesi zemini (boş kutu okunmasın)',
    await p.evaluate(() => getComputedStyle(document.getElementById('fotoClose')).backgroundColor));

  yaz('popup · ayak öğelerinin sol/sağ x değerleri', await p.evaluate(() => {
    const f = document.querySelector('.fy-foot');
    const kap = f.getBoundingClientRect();
    return [...f.children].filter(k => k.getClientRects().length).map(k => {
      const r = k.getBoundingClientRect();
      return `${k.id || k.className.split(' ')[0]} ${Math.round(r.left - kap.left)}→${Math.round(r.right - kap.left)}`;
    }).join(' | ');
  }));
  yaz('popup · not tam genişlikte kendi satırında', await p.evaluate(() => {
    const f = document.querySelector('.fy-foot'), n = f.querySelector('.note');
    return Math.round(n.getBoundingClientRect().width) === Math.round(f.getBoundingClientRect().width);
  }));
  yaz('popup · onay düğmeleri sağ kenara hizalı', await p.evaluate(() => {
    const f = document.querySelector('.fy-foot');
    const u = document.getElementById('fyUygula').getBoundingClientRect();
    return Math.abs(u.right - f.getBoundingClientRect().right) < 2;
  }));

  /* a11y */
  yaz('popup · açılışta odak panelin içinde', await p.evaluate(() =>
    document.getElementById('fotoModal').contains(document.activeElement)));
  yaz('popup · odak tuzağı (Tab hep panelde kalıyor)', await (async () => {
    for (let i = 0; i < 14; i++) await p.keyboard.press('Tab');
    return p.evaluate(() => document.getElementById('fotoModal').contains(document.activeElement));
  })());
  await p.keyboard.press('Escape');
  await p.waitForTimeout(350);
  yaz('popup · Escape kapattı', await p.evaluate(() =>
    !document.getElementById('fotoModal').classList.contains('show')));
  yaz('popup · odak açtırana döndü', await p.evaluate(() =>
    document.activeElement === document.querySelector('.fp-ava-edit')));
  await ctx.close();
}

/* ============ 2 · KALDIR ============ */
{
  const { ctx, p } = await sayfa();
  /* avatar */
  await p.click('.fp-ava-edit'); await p.waitForTimeout(250);
  yaz('kaldır · avatar düğmesi görünür (fotoğraf varken)',
    !(await p.evaluate(() => document.getElementById('fyKaldir').hidden)));
  yaz('kaldır · avatar düğme etiketi', (await p.textContent('#fyKaldirEtiket')).trim());
  const avOnce = await p.evaluate(() => document.querySelector('.fp-ava2').style.backgroundImage.slice(0, 44) + '…');
  await p.click('#fyKaldir'); await p.waitForTimeout(350);
  yaz('kaldır · avatar ÖNCE', avOnce);
  yaz('kaldır · avatar SONRA', await p.evaluate(() => {
    const a = document.querySelector('.fp-ava2');
    return `background-image:${a.style.backgroundImage || '(boş)'} · is-bos=${a.classList.contains('is-bos')} · zemin=${getComputedStyle(a).backgroundColor}`;
  }));
  yaz('kaldır · sayfa durum satırı', (await p.textContent('#fotoDurum')).replace(/\s+/g, ' ').trim());
  yaz('kaldır · "yakında" geçmiyor', !/yakında/i.test(await p.textContent('#fotoDurum')));
  await p.click('.fp-ava-edit'); await p.waitForTimeout(250);
  yaz('kaldır · fotoğraf yokken düğme BASILMIYOR',
    await p.evaluate(() => document.getElementById('fyKaldir').hidden));
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);

  /* kapak */
  await p.click('.fp-kapak-edit'); await p.waitForTimeout(250);
  yaz('kaldır · kapak düğme etiketi', (await p.textContent('#fyKaldirEtiket')).trim());
  await p.click('#fyKaldir'); await p.waitForTimeout(350);
  yaz('kaldır · kapak SONRA', await p.evaluate(() => {
    const k = document.querySelector('.fp-kapak');
    return `--px-img:${k.style.getPropertyValue('--px-img') || '(boş)'} · is-bos=${k.classList.contains('is-bos')}`;
  }));
  await ctx.close();
}

/* ============ 3 · SEKME ŞERİDİ ORTALAMA ============ */
for (const w of [390, 768, 1024, 1440]) {
  const { ctx, p } = await sayfa(w);
  yaz(`şerit @${w}`, await p.evaluate(() => {
    const r = document.getElementById('hsRail');
    const k = [...r.querySelectorAll('.dt')];
    const kutu = r.getBoundingClientRect(), kap = r.parentElement.getBoundingClientRect();
    const ilk = k[0].getBoundingClientRect(), son = k[k.length - 1].getBoundingClientRect();
    const d = document.documentElement;
    return `sol ${Math.round(kutu.left - kap.left)} / sağ ${Math.round(kap.right - kutu.right)}` +
      ` · grup merkezi ${Math.round((ilk.left + son.right) / 2)} · sayfa merkezi ${Math.round(innerWidth / 2)}` +
      ` · kaydırılabilir ${r.scrollWidth > r.clientWidth}` +
      ` · sayfa taşması ${d.scrollWidth - d.clientWidth}px · kalem ${Math.round(ilk.height)}px`;
  }));
  await ctx.close();
}

/* ============ 4 · DOĞUM TARİHİ TAKVİMİ ============ */
{
  const { ctx, p } = await sayfa();
  yaz('takvim · başlangıç değeri', await p.inputValue('#hsDogum'));
  await p.click('#hsDogumAc'); await p.waitForTimeout(250);
  yaz('takvim · açıldı', !(await p.evaluate(() => document.getElementById('hsDogumPop').hidden)));
  yaz('takvim · aria-expanded', await p.getAttribute('#hsDogumAc', 'aria-expanded'));
  yaz('takvim · yıl listesi seçenek sayısı (tek tıkla açılan <select>)',
    await p.$$eval('#hsDogumYil option', o => o.length));
  yaz('takvim · yıl aralığı', await p.evaluate(() => {
    const o = document.querySelectorAll('#hsDogumYil option');
    return o[0].value + ' → ' + o[o.length - 1].value;
  }));
  yaz('takvim · ay listesi', await p.$$eval('#hsDogumAy option', o => o.length + ' ay · ' + o[0].textContent));
  yaz('takvim · sınır notu', (await p.textContent('#hsDogumSinir')).trim());

  /* yarının tarihi seçilebiliyor mu? — bugünün ayına gidip dene */
  yaz('takvim · BUGÜNÜN yılı listede var mı (olmamalı)', await p.evaluate(() =>
    [...document.querySelectorAll('#hsDogumYil option')].some(o => +o.value === new Date().getFullYear())));
  yaz('takvim · bugünden 12 yıl öncesinin yılı listede (olmamalı)', await p.evaluate(() =>
    [...document.querySelectorAll('#hsDogumYil option')].some(o => +o.value === new Date().getFullYear() - 12)));

  /* üst sınır ayına git: sınır sonrası günler kapalı olmalı */
  const ust = await p.evaluate(() => {
    const b = new Date(); return { y: b.getFullYear() - 13, a: b.getMonth(), g: b.getDate() };
  });
  await p.selectOption('#hsDogumYil', String(ust.y));
  await p.selectOption('#hsDogumAy', String(ust.a));
  await p.waitForTimeout(200);
  yaz('takvim · üst sınır ayında açık/kapalı gün sayısı', await p.evaluate(() => {
    const b = [...document.querySelectorAll('#hsDogumGrid button')];
    return `${b.filter(x => !x.disabled).length} açık / ${b.filter(x => x.disabled).length} kapalı`;
  }));
  yaz('takvim · sınırın ERTESİ günü kapalı mı', await p.evaluate((g) => {
    const b = document.querySelector(`#hsDogumGrid button[data-gun="${g + 1}"]`);
    return b ? (b.disabled ? 'kapalı ✓' : 'AÇIK ✗') : '(o ayda yok — sınır ayın son günü)';
  }, ust.g));
  yaz('takvim · sonraki ay oku kapalı mı (gelecek engellendi)',
    await p.isDisabled('#hsDogumPop [data-ay="1"]'));

  /* gerçek seçim: 15. gün */
  const once = await p.inputValue('#hsDogum');
  await p.selectOption('#hsDogumYil', '1992');
  await p.selectOption('#hsDogumAy', '5');
  await p.waitForTimeout(150);
  await p.click('#hsDogumGrid button[data-gun="15"]');
  await p.waitForTimeout(250);
  yaz('takvim · seçim ÖNCE → SONRA', once + ' → ' + (await p.inputValue('#hsDogum')));
  yaz('takvim · seçimden sonra kapandı', await p.evaluate(() => document.getElementById('hsDogumPop').hidden));
  yaz('takvim · odak alana döndü', await p.evaluate(() => document.activeElement === document.getElementById('hsDogum')));

  /* elle yazım denetimi */
  await p.fill('#hsDogum', '01.01.2020'); await p.click('h1'); await p.waitForTimeout(200);
  yaz('takvim · elle yazılan 13 yaş altı tarih reddedildi', (await p.textContent('#hsDogumHata span')).trim());
  await p.fill('#hsDogum', '31.02.1990'); await p.click('h1'); await p.waitForTimeout(200);
  yaz('takvim · olmayan tarih (31.02) reddedildi', (await p.textContent('#hsDogumHata span')).trim());
  await p.fill('#hsDogum', '14.03.1992'); await p.click('h1'); await p.waitForTimeout(200);
  yaz('takvim · geçerli tarih kabul edildi (hata kapalı)',
    !(await p.evaluate(() => document.getElementById('hsDogumHata').classList.contains('show'))));
  await ctx.close();
}

/* dokunma hedefi + taşma: takvim açıkken üç genişlik */
for (const w of [390, 768, 1440]) {
  const { ctx, p } = await sayfa(w);
  await p.click('#hsDogumAc'); await p.waitForTimeout(250);
  yaz(`takvim @${w} · taşma ve hedef`, await p.evaluate(() => {
    const d = document.documentElement;
    const pop = document.getElementById('hsDogumPop');
    const kucuk = [...pop.querySelectorAll('button,select')]
      .filter(e => e.getClientRects().length)
      .filter(e => { const r = e.getBoundingClientRect(); return r.width < 38 || r.height < 38; })
      .map(e => `${e.id || e.tagName}:${Math.round(e.getBoundingClientRect().width)}×${Math.round(e.getBoundingClientRect().height)}`);
    const r = pop.getBoundingClientRect();
    return `sayfa taşması ${d.scrollWidth - d.clientWidth}px · kutu sağı ${Math.round(r.right)} (ekran ${innerWidth})` +
      ` · <38px hedef ${kucuk.length}${kucuk.length ? ' → ' + kucuk.join(', ') : ''}`;
  }));
  await ctx.close();
}

await tarayici.close();

console.log('\n╔══ HESABIM DÜZELTME ÖLÇÜMÜ ══╗');
for (const [a, b] of sonuc) console.log('  ' + String(a).padEnd(56) + ' → ' + b);
console.log('\n  konsol/sayfa hatası: ' + hatalar.length + (hatalar.length ? '\n    ' + hatalar.join('\n    ') : ''));
