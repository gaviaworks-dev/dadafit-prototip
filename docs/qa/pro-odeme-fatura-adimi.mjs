/* =====================================================================
   PRO ÖDEME · FATURA ADIMI — SONDA
   ---------------------------------------------------------------------
   NEDEN VAR: akış fatura adresini HİÇ sormuyordu ("adres" kelimesi
   `pro-odeme-v1.html`de sıfır kez geçiyordu) ama sonunda GERÇEK bir fatura
   kaydı üretiyordu (`FIT_FATURA.ekle` → `dm_fit_fatura_kayit_v1`), ve
   yönetim tarafı o kaydın alıcı adresini `fit-fatura.js:alici()`ten
   basıyordu. Kayıt boş olduğu için `admin-fatura-detay-v1.html` alıcı
   satırında "Adres bilgisi girilmedi" yazıyordu. Ayrıca adım rozetleri
   DOM sırasıyla uyuşmuyordu: kullanıcı 2 → 3 → 1 → 4 görüyordu.

   NE ÖLÇER (üç genişlikte)
     1. Beş adım var ve rozetler "Adım N / 5" biçiminde
     2. Rozet sırası DOM sırasıyla aynı (1,2,3,4,5)
     3. Kayıt BOŞKEN "Aboneliği Başlat" reddediyor: durum ekranı açılmıyor,
        fatura kartı `is-err` alıyor, kırmızı satır görünür oluyor
     4. Kayıt yazılınca özet kartı doluyor (kimlik + adres okunuyor),
        boş-hâl kutusu kapanıyor, düğme "Düzenle"ye dönüyor
     5. Kayıt doluyken akış sonuna gidiyor ve üretilen faturanın alıcı
        adresi ARTIK kayıttan geliyor
        ⚠ Fatura kaydı yalnız FİYATI OLAN kademede açılır: `pro`nun fiyatı
        99, `promax`ınki `null` (fit-paket.js:71 — "Pro Max'in fiyatı Beyar
        tarafından onaylanmadı"). K13 gereği sayı uydurulmadığı için
        promax'ta defter satırı HİÇ doğmaz; sonda ikisini de bekler.
     6. Ödemelerim'de `#fatura-bilgilerim` çapası pencereyi açıyor
     7. Akış sonu listesi YAZILANI yazıyor: kademe maddesi yalnız kademe
        gerçekten yazıldıysa, defter maddesi yalnız satır gerçekten
        düştüyse basılıyor (`?ok=1` ile gelindiğinde ikisi de basılmaz)

   KULLANIM
     python3 -m http.server 8788 &
     PW_HOME=~/.pw node docs/qa/pro-odeme-fatura-adimi.mjs
   ===================================================================== */
import { chromium } from '../../tests/_pw.mjs';

const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const KAYIT = {
  tip: 'bireysel', ulke: 'TR', efatura: false, varsayilan: true,
  ftAd: 'Elif Şahin', ftTckn: '', ftUnvan: '', ftDaire: '', ftVkn: '',
  ftTel: '5551112233', ftEposta: 'elif@ornek.com',
  ftIl: 'İstanbul', ftIlce: 'Kadıköy',
  ftAdres: 'Caferağa Mah. Moda Cad. No:12 D:4', ftPosta: '34710'
};

const browser = await chromium.launch();
const hatalar = [];
const bekle = (k, d, ek) => { if (!k) hatalar.push(d + (ek ? ' — ' + ek : '')); return k; };

for (const W of [1440, 768, 390]) {
  console.log(`\n══════ @${W}px ══════`);

  /* ---------- A · yapı + boş kayıtta kapı ---------- */
  {
    const ctx = await browser.newContext({ viewport: { width: W, height: 1200 }, reducedMotion: 'reduce' });
    await ctx.addInitScript(() => { try { localStorage.setItem('dm-cookie-consent', 'all'); } catch (e) {} });
    const pg = await ctx.newPage();
    pg.on('pageerror', e => hatalar.push(`@${W} pageerror: ${e.message}`));
    await pg.goto(BASE + '/pro-odeme-v1.html?plan=promax', { waitUntil: 'load' });
    await pg.waitForTimeout(500);

    const yapi = await pg.evaluate(() => {
      const kartlar = [...document.querySelectorAll('.wiz-main .form-card')];
      return {
        kartSayisi: kartlar.length,
        rozetler: kartlar.map(c => {
          const s = c.querySelector('.fc-step');
          return s ? s.textContent.trim() : null;
        }),
        basliklar: kartlar.map(c => (c.querySelector('.fc-head h2') || {}).textContent || null)
          .map(t => t && t.trim()),
        ozetGizli: document.getElementById('ftOzet').hidden,
        bosGorunur: !document.getElementById('ftBos').hidden,
        dugmeMetni: document.getElementById('faturaAcTxt').textContent.trim(),
        hataGorunur: getComputedStyle(document.getElementById('faturaErr')).display !== 'none'
      };
    });

    bekle(yapi.kartSayisi === 5, `@${W} · beş kart bekleniyordu`, `${yapi.kartSayisi} var`);
    const beklenen = ['Adım 1 / 5', 'Adım 2 / 5', 'Adım 3 / 5', 'Adım 4 / 5', 'Adım 5 / 5'];
    bekle(JSON.stringify(yapi.rozetler) === JSON.stringify(beklenen),
      `@${W} · rozet sırası DOM sırasıyla uyumsuz`, JSON.stringify(yapi.rozetler));
    bekle(yapi.ozetGizli, `@${W} · kayıt boşken özet kartı görünür olmamalı`);
    bekle(yapi.bosGorunur, `@${W} · kayıt boşken boş-hâl kutusu görünmeli`);
    bekle(/Gir$/.test(yapi.dugmeMetni), `@${W} · boş kayıtta düğme "…Gir" demeli`, yapi.dugmeMetni);
    bekle(!yapi.hataGorunur, `@${W} · denemeden ÖNCE kırmızı satır görünmemeli`);
    console.log('  yapı      ·', yapi.rozetler.join(' | '));
    console.log('  başlıklar ·', yapi.basliklar.join(' | '));

    /* onay kutusunu işaretle ki reddin sebebi SADECE fatura olsun */
    /* Gerçek kutu görsel `.cbx` ile örtülü (kabuğun kalıbı); tıklama
       etikete gider — kullanıcının yaptığının aynısı. */
    await pg.click('label[for="agreePro"]');
    await pg.click('#startSub');
    await pg.waitForTimeout(600);
    const kapi = await pg.evaluate(() => ({
      durumAcildi: document.body.classList.contains('pay-done'),
      kartHatali: document.getElementById('faturaKart').classList.contains('is-err'),
      hataGorunur: getComputedStyle(document.getElementById('faturaErr')).display !== 'none',
      defter: (() => { try { return localStorage.getItem('dm_fit_fatura_kayit_v1'); } catch (e) { return null; } })(),
      paket: (() => { try { return localStorage.getItem('dm_user'); } catch (e) { return null; } })()
    }));
    bekle(!kapi.durumAcildi, `@${W} · boş kayıtta akış SONUNA GİTMEMELİYDİ`);
    bekle(kapi.kartHatali, `@${W} · fatura kartı is-err almalıydı`);
    bekle(kapi.hataGorunur, `@${W} · kırmızı uyarı satırı görünmeliydi`);
    bekle(!kapi.defter, `@${W} · reddedilen denemede fatura kaydı ÜRETİLMEMELİ`, String(kapi.defter));
    bekle(!kapi.paket, `@${W} · reddedilen denemede paket YAZILMAMALI`, String(kapi.paket));
    console.log('  boş kayıt · başlatma reddedildi, defter ve paket yazılmadı  ✅');
    await ctx.close();
  }

  /* ---------- B · dolu kayıtta özet + akışın sonu ----------
     İki kademe: fiyatı olan (`pro` → defterde satır) ve fiyatı
     onaylanmamış olan (`promax` → satır YOK, sayı uydurulmaz). */
  for (const [plan, beklenenFatura] of [['pro', 1], ['promax', 0]]) {
    const ctx = await browser.newContext({ viewport: { width: W, height: 1200 }, reducedMotion: 'reduce' });
    await ctx.addInitScript((k) => {
      try {
        localStorage.setItem('dm-cookie-consent', 'all');
        localStorage.setItem('dm_fit_fatura_v1', JSON.stringify(k));
      } catch (e) {}
    }, KAYIT);
    const pg = await ctx.newPage();
    pg.on('pageerror', e => hatalar.push(`@${W}/${plan} pageerror(B): ${e.message}`));
    await pg.goto(BASE + '/pro-odeme-v1.html?plan=' + plan, { waitUntil: 'load' });
    await pg.waitForTimeout(500);

    const ozet = await pg.evaluate(() => {
      const o = document.getElementById('ftOzet');
      return {
        ozetGorunur: !o.hidden,
        bosGizli: document.getElementById('ftBos').hidden,
        dugmeMetni: document.getElementById('faturaAcTxt').textContent.trim(),
        kutuSayisi: o.querySelectorAll('.sf-item').length,
        metin: o.textContent.replace(/\s+/g, ' ').trim()
      };
    });
    bekle(ozet.ozetGorunur, `@${W}/${plan} · dolu kayıtta özet görünmeliydi`);
    bekle(ozet.bosGizli, `@${W}/${plan} · dolu kayıtta boş-hâl kutusu kapanmalıydı`);
    bekle(/Düzenle$/.test(ozet.dugmeMetni), `@${W}/${plan} · dolu kayıtta düğme "…Düzenle" demeli`, ozet.dugmeMetni);
    bekle(ozet.kutuSayisi === 4, `@${W}/${plan} · özet dört kutu olmalı`, String(ozet.kutuSayisi));
    bekle(ozet.metin.indexOf(KAYIT.ftAdres) >= 0, `@${W}/${plan} · özet ADRESİ okumalı`, ozet.metin.slice(0, 90));
    bekle(ozet.metin.indexOf(KAYIT.ftAd) >= 0, `@${W}/${plan} · özet KİMLİĞİ okumalı`);
    console.log(`  ${plan.padEnd(6)} · özet ${ozet.kutuSayisi} kutu, adres ve kimlik okunuyor  ✅`);

    /* Gerçek kutu görsel `.cbx` ile örtülü (kabuğun kalıbı); tıklama
       etikete gider — kullanıcının yaptığının aynısı. */
    await pg.click('label[for="agreePro"]');
    await pg.click('#startSub');
    await pg.waitForTimeout(700);
    const son = await pg.evaluate(() => {
      const oku = k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
      const defter = oku('dm_fit_fatura_kayit_v1');
      return {
        durumAcildi: document.body.classList.contains('pay-done'),
        faturaSayisi: defter ? defter.length : 0,
        alici: (window.FIT_FATURA && window.FIT_FATURA.alici()) || null
      };
    });
    bekle(son.durumAcildi, `@${W}/${plan} · dolu kayıtta akış sonuna gitmeliydi`);
    bekle(son.faturaSayisi === beklenenFatura,
      `@${W}/${plan} · defterde ${beklenenFatura} kayıt bekleniyordu`, String(son.faturaSayisi));
    bekle(son.alici && son.alici.adres.indexOf(KAYIT.ftAdres) >= 0,
      `@${W}/${plan} · faturanın alıcı adresi kayıttan gelmiyor`, son.alici ? son.alici.adres : 'null');
    bekle(son.alici && son.alici.kaynak === 'form',
      `@${W}/${plan} · alıcı hâlâ varsayılan personadan okunuyor`, son.alici ? son.alici.kaynak : 'null');
    console.log(`  ${plan.padEnd(6)} · akış sonu · defter ${son.faturaSayisi} satır · alıcı: ${son.alici ? son.alici.adres : 'null'}`);

    /* Akış sonu listesi DAVRANIŞI anlatmalı. Eski hâli "abonelik başlaMADI —
       kademen değişmedi" ve "fatura kesilMEDİ" diyordu; ikisi de yanlıştı. */
    const liste = await pg.evaluate(() => {
      const g = id => document.getElementById(id);
      const gorunur = el => !!el && el.getClientRects().length > 0;
      const metin = [...document.querySelectorAll('.suc-liste li')]
        .filter(gorunur).map(e => e.textContent.replace(/\s+/g, ' ')).join(' ');
      return {
        kademeMd: gorunur(g('dsKademe') && g('dsKademe').closest('li')),
        kademeMetni: g('dsKademe') ? g('dsKademe').textContent.trim() : null,
        defterMd: gorunur(g('dsDefterMd')),
        kademeDegismediDiyor: /kademen değişmedi/.test(metin),
        faturaKesilmediDiyor: /Fatura kesilMEDİ/.test(metin)
      };
    });
    bekle(liste.kademeMd, `@${W}/${plan} · kademe yazıldı ama liste bunu söylemiyor`);
    bekle(liste.kademeMetni.indexOf(plan === 'pro' ? 'Pro' : 'Pro Max') >= 0,
      `@${W}/${plan} · kademe maddesi yanlış kademeyi yazıyor`, liste.kademeMetni);
    bekle(liste.defterMd === (beklenenFatura > 0),
      `@${W}/${plan} · defter maddesi defterin gerçek hâliyle uyuşmuyor`,
      `madde ${liste.defterMd} / satır ${son.faturaSayisi}`);
    bekle(!liste.kademeDegismediDiyor, `@${W}/${plan} · liste hâlâ "kademen değişmedi" diyor`);
    bekle(!liste.faturaKesilmediDiyor, `@${W}/${plan} · liste hâlâ "Fatura kesilMEDİ" diyor`);
    console.log(`  ${plan.padEnd(6)} · liste · kademe md ${liste.kademeMd} ("${liste.kademeMetni}") · defter md ${liste.defterMd}  ✅`);
    await ctx.close();
  }

  /* ---------- C · Ödemelerim derin bağlantısı ---------- */
  {
    const ctx = await browser.newContext({ viewport: { width: W, height: 1200 }, reducedMotion: 'reduce' });
    await ctx.addInitScript(() => { try { localStorage.setItem('dm-cookie-consent', 'all'); } catch (e) {} });
    const pg = await ctx.newPage();
    pg.on('pageerror', e => hatalar.push(`@${W} pageerror(C): ${e.message}`));
    await pg.goto(BASE + '/odemelerim-v1.html#fatura-bilgilerim', { waitUntil: 'load' });
    await pg.waitForTimeout(900);
    const capa = await pg.evaluate(() => {
      const m = document.getElementById('ftModal');
      const pane = document.querySelector('.fit-pane[data-pane="faturalar"]');
      return { modalVar: !!m, acik: !!m && m.classList.contains('show'), sekmeAcik: !!pane && !pane.hidden };
    });
    bekle(capa.modalVar, `@${W} · #ftModal basılmamış`);
    bekle(capa.sekmeAcik, `@${W} · çapa Faturalar sekmesini açmadı`);
    bekle(capa.acik, `@${W} · #fatura-bilgilerim pencereyi açmadı`);
    console.log('  çapa       · #fatura-bilgilerim → Faturalar sekmesi + pencere açık  ✅');
    await ctx.close();
  }
}

await browser.close();
console.log('\n' + '─'.repeat(60));
if (hatalar.length) {
  console.log(`🔴 ${hatalar.length} BULGU:`);
  hatalar.forEach(h => console.log('   · ' + h));
  process.exit(1);
}
console.log('✅ GEÇTİ — beş adım, sıralı rozetler, boş kayıtta kapalı kapı, dolu kayıtta okunan adres.');
