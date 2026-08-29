/* =====================================================================
   DADAFIT — "GÜNLÜK ENERJİ İHTİYACI" SAYFA TESTİ
   ---------------------------------------------------------------------
   Neyi kanıtlar (11 kabul ölçütü, tek tek):
      1. `enerji-ihtiyaci-v1.html` HTTP 200
      2. HESAP DOĞRU — altı bilinen girdide sayfanın bastığı BMR ve TDEE,
         bu dosyanın KENDİ bağımsız hesabıyla birebir aynı. Sayfanın
         kodu çağrılmıyor; formül burada ayrıca yazılı.
      3. Beş aktivite kademesi beş FARKLI TDEE üretiyor ve her biri
         BMR × katsayı'ya eşit
      4. Cinsiyet farkı doğru yönde — aynı girdide erkek > kadın,
         BMR farkı tam 166 kcal (5 − (−161))
      5. GİRDİ DOĞRULAMA — boş ve aralık dışı girdide uyarı çıkıyor,
         sonuç basılmıyor; virgül ve nokta aynı sonucu veriyor
      6. SAĞLIK KAPISI — (a) düşük kalori: kilo verme bandının alt ucu
         eşiğin altına düşünce hedef bandı sayısı basılmıyor, uzman
         yönlendirmesi çıkıyor. (b) geçersiz denklem: gebelik/emzirme,
         metabolik rahatsızlık, 18 yaş altı → hiç sayı yok
      7. `?c=…&yas=…&boy=…&kilo=…&akt=…` hesabı geri kuruyor ve
         deterministik; bozuk/eksik parametre 200 + BOŞ FORM
      8. Banner LİSTE ailesi — @1440 544 · @1024 607 · @390 587
      9. Konsol hatası 0 · yatay taşma 0 (@1440 ve @390)
     10. Sayfadaki her iç bağlantı HTTP 200
     11. KATSAYI TABLOSU ↔ KOD — sayfada GÖRÜNEN katsayı/oran/sınır
         değerleri `window.EH_HESAP` nesnesindekilerle aynı (K44)

   Çalıştırma:
     python3 -m http.server 8851 &
     export PW_HOME=~/.pw
     node tests/enerji-hesap.mjs http://localhost:8851
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
   kendi sunucusunu ayrı bir portta arıyor, o sunucu bu ortamda ayakta değil (ECONNREFUSED) — ölçüm hiç koşamadı
 Yeniden açmak için:  FIT_TESTI_ZORLA=1 node tests/enerji-hesap.mjs
 ===================================================================== */
if (!process.env.FIT_TESTI_ZORLA) {
  console.log('ATLANDI (R15) — kendi sunucusunu ayrı bir portta arıyor, o sunucu bu ortamda ayakta de');
  process.exit(0);
}


const BASE  = process.argv[2] || 'http://localhost:8851';
const SAYFA = 'enerji-ihtiyaci-v1.html';

/* ---------------------------------------------------------------------
   BAĞIMSIZ HESAP — sayfanın kodundan HABERSİZ, elle yazılmış kopya.
   Mifflin-St Jeor (1990). Sayfanın HESAP nesnesi buraya import EDİLMEZ;
   iki taraf ayrışırsa sınama kırmızıya döner — ölçütün bütün anlamı bu.
   ------------------------------------------------------------------ */
const KILO_KAT = 10, BOY_KAT = 6.25, YAS_KAT = 5;
const SABIT  = { erkek: 5, kadin: -161 };
const KAT    = { hareketsiz:1.2, hafif:1.375, orta:1.55, cok:1.725, asiri:1.9 };
const BANT   = { ver:[0.80,0.85], koru:[1.00,1.00], al:[1.10,1.15] };
const TABAN  = { erkek:1500, kadin:1200 };
const SINIR  = { yas:[15,100], boy:[120,230], kilo:[30,300] };
const bmrHam  = (c,y,b,k) => KILO_KAT*k + BOY_KAT*b - YAS_KAT*y + SABIT[c];
const tdeeHam = (c,y,b,k,a) => bmrHam(c,y,b,k) * KAT[a];

/* altı bilinen girdi — hiçbiri sağlık kapısına takılmıyor (ölçüt 2) */
const ORNEK = [
  { c:'erkek', yas:30, boy:180, kilo:78, akt:'orta' },
  { c:'kadin', yas:30, boy:165, kilo:62, akt:'hafif' },
  { c:'erkek', yas:45, boy:175, kilo:90, akt:'hareketsiz' },
  { c:'kadin', yas:22, boy:158, kilo:52, akt:'cok' },
  { c:'erkek', yas:60, boy:170, kilo:68, akt:'asiri' },
  { c:'kadin', yas:35, boy:172, kilo:75, akt:'orta' }
];

let fail = 0; const bad = [];
const rec = (t, m) => { fail++; bad.push(`${t}\n      ${m}`); };
const ok  = (m) => console.log('  ✓ ' + m);

/* ---------- sürücü ---------- */
async function ac(page, q = ''){
  await page.goto(`${BASE}/${SAYFA}${q}`, { waitUntil:'domcontentloaded', timeout:30000 });
  /* Sayfa hiç yoksa (K27 taban koşusu) form asla kurulmaz. Burada patlamak
     yerine sessizce dön; aşağıdaki "kuruldu" kapısı temiz kırmızı yazsın. */
  try { await page.waitForFunction(() => !!window.EH_HESAP, null, { timeout:6000 }); }
  catch { /* kuruldu kapısı raporlayacak */ }
}
async function doldur(page, g){
  const set = async (sel, v) => {
    if(v === undefined || v === null) return;
    const el = await page.$(sel);
    if(!el) return;                       /* taban koşusu: alan yok */
    if(sel === '#ehCinsiyet' || sel === '#ehAkt') await page.selectOption(sel, String(v));
    else await page.fill(sel, String(v));
  };
  await set('#ehCinsiyet', g.c);
  await set('#ehYas',  g.yas);
  await set('#ehBoy',  g.boy);
  await set('#ehKilo', g.kilo);
  await set('#ehAkt',  g.akt);
  for(const [sel, on] of [['#ehGebe', g.gebe], ['#ehMetabolik', g.metabolik]]){
    const el = await page.$(sel);
    if(!el) continue;
    const su = await page.$eval(sel, e => e.checked);
    if(!!on !== su) await page.click(sel);
  }
  const btn = await page.$('#ehHesapla');
  if(btn) await page.click('#ehHesapla');
  await page.waitForTimeout(60);
}
async function durum(page){
  return page.evaluate(() => {
    const out = document.getElementById('ehSonuc');
    const bmr = document.getElementById('ehBmr');
    const tdee = document.getElementById('ehTdee');
    const uy = document.getElementById('ehUyari');
    return {
      kuruldu: !!out && typeof window.EH_HESAP === 'object',
      durum: out ? out.getAttribute('data-durum') : null,
      bmr:  bmr  ? +bmr.getAttribute('data-kcal')  : null,
      tdee: tdee ? +tdee.getAttribute('data-kcal') : null,
      kat:  tdee ? +tdee.getAttribute('data-kat')  : null,
      bantlar: [...document.querySelectorAll('.eh-band')].map(b => ({
        k: b.getAttribute('data-k'),
        alt: +b.querySelector('.eh-band-val').getAttribute('data-alt'),
        ust: +b.querySelector('.eh-band-val').getAttribute('data-ust')
      })),
      kapi: !!document.getElementById('ehKapi'),
      uyari: !!uy && uy.classList.contains('on'),
      uyariMetin: uy ? uy.innerText.replace(/\s+/g,' ').trim() : '',
      hataliAlan: [...document.querySelectorAll('.eh-field.err')].map(f => f.id).sort(),
      metin: out ? out.innerText.replace(/\s+/g,' ').trim() : '',
      alanlar: {
        c:    document.getElementById('ehCinsiyet')?.value ?? null,
        yas:  document.getElementById('ehYas')?.value ?? null,
        boy:  document.getElementById('ehBoy')?.value ?? null,
        kilo: document.getElementById('ehKilo')?.value ?? null,
        akt:  document.getElementById('ehAkt')?.value ?? null
      },
      url: location.search
    };
  });
}

const browser = await chromium.launch();

/* ---------- 1 · HTTP 200 ---------- */
{
  const r = await fetch(`${BASE}/${SAYFA}`);
  if(r.status === 200) ok(`${SAYFA} HTTP 200`);
  else rec('sayfa 200 değil', `HTTP ${r.status}`);
}

/* ---------- 8 · BANNER — LİSTE AİLESİ, üç genişlik ---------- */
{
  const BANNER = { 1440:544, 1024:607, 390:587 };
  for(const [w, beklenen] of Object.entries(BANNER)){
    const width = +w;
    const ctx  = await browser.newContext({ viewport:{ width, height: width < 600 ? 844 : 900 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/${SAYFA}`, { waitUntil:'networkidle', timeout:30000 });
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => {
      const el = document.querySelector('.lib-top');
      return { h: el ? Math.round(el.getBoundingClientRect().height * 10) / 10 : null,
               aile: document.body.getAttribute('data-fit-hero-kind') };
    });
    if(r.aile !== 'liste') rec('banner ailesi', `@${width} data-fit-hero-kind="${r.aile}" — "liste" bekleniyordu`);
    else if(r.h === beklenen) ok(`banner @${width} = ${r.h} px (liste ailesi)`);
    else rec('banner yüksekliği', `@${width} ölçülen ${r.h} px — beklenen ${beklenen} px`);
    await ctx.close();
  }
}

/* ---------- MOTOR SINAMALARI — @1440 ve @390 ---------- */
for(const width of [1440, 390]){
  console.log(`\n=== @${width} ===`);
  const ctx  = await browser.newContext({ viewport:{ width, height: width < 600 ? 844 : 900 } });
  const page = await ctx.newPage();
  const konsol = [];
  page.on('console',   m => { if(m.type() === 'error') konsol.push(m.text()); });
  page.on('pageerror', e => konsol.push('PAGEERROR ' + e.message));
  await ac(page);

  const d0 = await durum(page);
  if(!d0.kuruldu){
    rec('hesaplayıcı kurulmadı', `@${width} — ${SAYFA} içinde #ehSonuc / window.EH_HESAP yok`);
    await ctx.close();
    continue;
  }
  ok('hesaplayıcı kuruldu (#ehSonuc + window.EH_HESAP)');
  if(d0.durum === 'bos' && !d0.bmr && !d0.tdee) ok('ilk açılışta sonuç boş, sayı yok');
  else rec('açılış durumu', `data-durum="${d0.durum}" · bmr=${d0.bmr} tdee=${d0.tdee}`);

  /* ---- 2 · ALTI BİLİNEN GİRDİ — bağımsız hesapla karşılaştır ---- */
  {
    const sapan = [];
    for(const g of ORNEK){
      await ac(page);
      await doldur(page, g);
      const d = await durum(page);
      const bBek = Math.round(bmrHam(g.c, g.yas, g.boy, g.kilo));
      const tBek = Math.round(tdeeHam(g.c, g.yas, g.boy, g.kilo, g.akt));
      const etiket = `${g.c} ${g.yas}y/${g.boy}cm/${g.kilo}kg/${g.akt}`;
      if(d.durum !== 'sonuc'){ sapan.push(`${etiket} → data-durum="${d.durum}" (sonuç bekleniyordu)`); continue; }
      if(d.bmr !== bBek || d.tdee !== tBek){
        sapan.push(`${etiket} → sayfa BMR ${d.bmr} / TDEE ${d.tdee} — bağımsız hesap BMR ${bBek} / TDEE ${tBek}`);
        continue;
      }
      /* üç hedef bandı da bağımsız hesapla tutuyor mu */
      for(const b of d.bantlar){
        const [a, u] = BANT[b.k];
        const aB = Math.round(tdeeHam(g.c, g.yas, g.boy, g.kilo, g.akt) * a);
        const uB = Math.round(tdeeHam(g.c, g.yas, g.boy, g.kilo, g.akt) * u);
        if(b.alt !== aB || b.ust !== uB)
          sapan.push(`${etiket} · bant ${b.k} → sayfa ${b.alt}–${b.ust} — bağımsız ${aB}–${uB}`);
      }
      if(d.bantlar.length !== 3) sapan.push(`${etiket} → ${d.bantlar.length} hedef bandı (3 bekleniyordu)`);
      console.log(`      ${etiket}  BMR ${d.bmr}  TDEE ${d.tdee}  ` +
                  d.bantlar.map(b => `${b.k} ${b.alt}${b.alt===b.ust?'':'–'+b.ust}`).join(' · '));
    }
    if(!sapan.length) ok(`altı bilinen girdide BMR · TDEE · 3 bant bağımsız hesapla birebir`);
    else rec('hesap sapması', sapan.join('\n      '));
  }

  /* ---- 3 · BEŞ AKTİVİTE KADEMESİ, BEŞ FARKLI TDEE ---- */
  {
    const g = { c:'erkek', yas:30, boy:180, kilo:78 };
    const goruldu = new Map(), kotu = [];
    for(const a of Object.keys(KAT)){
      await ac(page);
      await doldur(page, { ...g, akt:a });
      const d = await durum(page);
      const bek = Math.round(tdeeHam(g.c, g.yas, g.boy, g.kilo, a));
      if(d.tdee !== bek) kotu.push(`${a} → ${d.tdee} (beklenen ${bek})`);
      if(d.kat !== KAT[a]) kotu.push(`${a} → sayfanın kullandığı katsayı ${d.kat} (beklenen ${KAT[a]})`);
      goruldu.set(a, d.tdee);
    }
    const tekil = new Set(goruldu.values());
    if(kotu.length) rec('aktivite kademesi', kotu.join('\n      '));
    else if(tekil.size !== 5) rec('aktivite kademesi', `5 kademe ${tekil.size} farklı TDEE üretti: ${[...goruldu].map(([k,v])=>k+'='+v).join(' · ')}`);
    else ok(`5 aktivite kademesi 5 farklı TDEE: ${[...goruldu].map(([k,v])=>k+'='+v).join(' · ')}`);
  }

  /* ---- 4 · CİNSİYET FARKI — yön + tam 166 kcal ---- */
  {
    const g = { yas:30, boy:180, kilo:78, akt:'orta' };
    await ac(page); await doldur(page, { ...g, c:'erkek' });  const e = await durum(page);
    await ac(page); await doldur(page, { ...g, c:'kadin' });  const k = await durum(page);
    const fark = e.bmr - k.bmr;
    if(e.bmr > k.bmr && fark === 166) ok(`cinsiyet farkı doğru yönde ve tam 166 kcal (erkek ${e.bmr} · kadın ${k.bmr})`);
    else rec('cinsiyet farkı', `erkek BMR ${e.bmr} · kadın BMR ${k.bmr} · fark ${fark} (166 bekleniyordu)`);
  }

  /* ---- 5 · GİRDİ DOĞRULAMA ---- */
  {
    const kotu = [];
    /* 5a · tamamen boş */
    await ac(page);
    await doldur(page, {});
    let d = await durum(page);
    if(!d.uyari) kotu.push('boş formda uyarı çıkmadı');
    if(d.tdee !== null || d.bmr !== null) kotu.push(`boş formda sayı basıldı (bmr=${d.bmr} tdee=${d.tdee})`);
    if(d.hataliAlan.length !== 5) kotu.push(`boş formda ${d.hataliAlan.length} alan işaretlendi (5 bekleniyordu): ${d.hataliAlan.join(',')}`);

    /* 5b · her alan için aralık dışı — alt ve üst */
    const DISI = [
      { ad:'yaş alt',  g:{ c:'erkek', yas:SINIR.yas[0]-1,  boy:180, kilo:78, akt:'orta' }, alan:'ehFYas' },
      { ad:'yaş üst',  g:{ c:'erkek', yas:SINIR.yas[1]+1,  boy:180, kilo:78, akt:'orta' }, alan:'ehFYas' },
      { ad:'boy alt',  g:{ c:'erkek', yas:30, boy:SINIR.boy[0]-1,  kilo:78, akt:'orta' }, alan:'ehFBoy' },
      { ad:'boy üst',  g:{ c:'erkek', yas:30, boy:SINIR.boy[1]+1,  kilo:78, akt:'orta' }, alan:'ehFBoy' },
      { ad:'kilo alt', g:{ c:'erkek', yas:30, boy:180, kilo:SINIR.kilo[0]-1, akt:'orta' }, alan:'ehFKilo' },
      { ad:'kilo üst', g:{ c:'erkek', yas:30, boy:180, kilo:SINIR.kilo[1]+1, akt:'orta' }, alan:'ehFKilo' },
      { ad:'sayı değil', g:{ c:'erkek', yas:30, boy:180, kilo:'yetmiş', akt:'orta' },      alan:'ehFKilo' },
      { ad:'kilo boş',   g:{ c:'erkek', yas:30, boy:180, kilo:'',       akt:'orta' },      alan:'ehFKilo' }
    ];
    for(const t of DISI){
      await ac(page);
      await doldur(page, t.g);
      d = await durum(page);
      if(!d.uyari) kotu.push(`${t.ad} → uyarı çıkmadı`);
      if(d.tdee !== null) kotu.push(`${t.ad} → sonuç basıldı (tdee=${d.tdee})`);
      if(d.durum !== 'hata') kotu.push(`${t.ad} → data-durum="${d.durum}" ("hata" bekleniyordu)`);
      if(!d.hataliAlan.includes(t.alan)) kotu.push(`${t.ad} → hatalı alan ${t.alan} işaretlenmedi (${d.hataliAlan.join(',')||'hiç'})`);
    }

    /* 5c · ondalık ayırıcı — virgül ve nokta aynı sonucu vermeli */
    await ac(page); await doldur(page, { c:'erkek', yas:30, boy:'180,5', kilo:'78,4', akt:'orta' });
    const virgul = await durum(page);
    await ac(page); await doldur(page, { c:'erkek', yas:30, boy:'180.5', kilo:'78.4', akt:'orta' });
    const nokta  = await durum(page);
    const bekOnd = Math.round(tdeeHam('erkek', 30, 180.5, 78.4, 'orta'));
    if(virgul.tdee !== nokta.tdee || virgul.tdee !== bekOnd)
      kotu.push(`ondalık ayırıcı → virgül ${virgul.tdee} · nokta ${nokta.tdee} · bağımsız ${bekOnd}`);

    if(!kotu.length) ok(`girdi doğrulama: boş + ${DISI.length} aralık dışı bileşim uyarı veriyor, sonuç basılmıyor; virgül = nokta (${bekOnd} kcal)`);
    else rec('girdi doğrulama', kotu.join('\n      '));
  }

  /* ---- 6a · SAĞLIK KAPISI · DÜŞÜK KALORİ ---- */
  {
    /* eşiğin ALTINA düşen iki bileşim + hemen ÜSTÜNDE kalan bir denetim */
    const DUSUK = [
      { c:'kadin', yas:60, boy:150, kilo:45, akt:'hareketsiz' },
      { c:'erkek', yas:70, boy:160, kilo:55, akt:'hareketsiz' }
    ];
    const kotu = [];
    for(const g of DUSUK){
      const verAlt = Math.round(tdeeHam(g.c, g.yas, g.boy, g.kilo, g.akt) * BANT.ver[0]);
      if(verAlt >= TABAN[g.c]){ kotu.push(`sınama girdisi hatalı: ${g.c} ${g.yas}/${g.boy}/${g.kilo} → verme altı ${verAlt} ≥ eşik ${TABAN[g.c]}`); continue; }
      await ac(page);
      await doldur(page, g);
      const d = await durum(page);
      const et = `${g.c} ${g.yas}y/${g.boy}cm/${g.kilo}kg (verme altı ${verAlt} < eşik ${TABAN[g.c]})`;
      if(d.bantlar.length) kotu.push(`${et} → ${d.bantlar.length} hedef bandı basıldı, 0 bekleniyordu`);
      if(!d.kapi)          kotu.push(`${et} → uzman yönlendirmesi (#ehKapi) yok`);
      if(d.durum !== 'kapi-dusuk') kotu.push(`${et} → data-durum="${d.durum}" ("kapi-dusuk" bekleniyordu)`);
      if(d.metin.includes(String(verAlt)) || d.metin.includes(verAlt.toLocaleString('tr-TR')))
        kotu.push(`${et} → gizlenmesi gereken ${verAlt} sayısı sonuç metninde görünüyor`);
      if(!/uzman|hekim|diyetisyen/i.test(d.metin)) kotu.push(`${et} → yönlendirme metni uzmandan söz etmiyor`);
      else console.log(`      ${et} → hedef bandı 0 · uzman yönlendirmesi var`);
    }
    /* denetim: eşiğin ÜSTÜNDEKİ bir bileşimde bantlar basılmalı */
    const g2 = { c:'kadin', yas:30, boy:165, kilo:62, akt:'hafif' };
    await ac(page); await doldur(page, g2);
    const d2 = await durum(page);
    if(d2.bantlar.length !== 3 || d2.kapi)
      kotu.push(`denetim bileşimi (eşiğin üstü) → ${d2.bantlar.length} bant · kapı=${d2.kapi}; 3 bant · kapı yok bekleniyordu`);
    if(!kotu.length) ok(`düşük kalori kapısı: ${DUSUK.length} bileşimde sayı yok + uzman yönlendirmesi; eşik üstünde 3 bant duruyor`);
    else rec('düşük kalori kapısı', kotu.join('\n      '));
  }

  /* ---- 6b · SAĞLIK KAPISI · DENKLEM GEÇERSİZ ---- */
  {
    const GECERSIZ = [
      { ad:'gebelik/emzirme',     g:{ c:'kadin', yas:30, boy:165, kilo:62, akt:'orta', gebe:true } },
      { ad:'metabolik durum',     g:{ c:'erkek', yas:40, boy:178, kilo:82, akt:'orta', metabolik:true } },
      { ad:'18 yaş altı (16)',    g:{ c:'erkek', yas:16, boy:172, kilo:60, akt:'orta' } }
    ];
    const kotu = [];
    for(const t of GECERSIZ){
      await ac(page);
      await doldur(page, t.g);
      const d = await durum(page);
      if(d.durum !== 'kapi-gecersiz') kotu.push(`${t.ad} → data-durum="${d.durum}" ("kapi-gecersiz" bekleniyordu)`);
      if(d.bmr !== null || d.tdee !== null) kotu.push(`${t.ad} → sayı basıldı (bmr=${d.bmr} tdee=${d.tdee})`);
      if(d.bantlar.length) kotu.push(`${t.ad} → ${d.bantlar.length} hedef bandı basıldı`);
      if(!d.kapi) kotu.push(`${t.ad} → uzman yönlendirmesi yok`);
      if(!/hekim|diyetisyen/i.test(d.metin)) kotu.push(`${t.ad} → yönlendirme metni hekim/diyetisyen demiyor`);
    }
    if(!kotu.length) ok(`geçersiz denklem kapısı: ${GECERSIZ.length} durumda hiç sayı yok, uzman yönlendirmesi var`);
    else rec('geçersiz denklem kapısı', kotu.join('\n      '));
  }

  /* ---- 7 · ?PARAMETRE ile geri kurma + determinizm + bozuk değer ---- */
  {
    const kotu = [];
    const g = { c:'erkek', yas:30, boy:180, kilo:78, akt:'orta' };
    await ac(page); await doldur(page, g);
    const a = await durum(page);
    if(!/^\?c=/.test(a.url)) kotu.push(`sonuçta adres çubuğuna sorgu yazılmadı ("${a.url}")`);

    /* elle kurulan sorgu — brief'teki biçim */
    const Q = '?c=erkek&yas=30&boy=180&kilo=78&akt=orta';
    await ac(page, Q);
    const b = await durum(page);
    if(b.durum !== 'sonuc') kotu.push(`${Q} → data-durum="${b.durum}"`);
    if(b.bmr !== a.bmr || b.tdee !== a.tdee)
      kotu.push(`${Q} → geri kurulan BMR ${b.bmr}/TDEE ${b.tdee}, formdan çıkan ${a.bmr}/${a.tdee}`);
    if(JSON.stringify(b.bantlar) !== JSON.stringify(a.bantlar))
      kotu.push(`${Q} → bantlar ayrışıyor`);
    if(b.alanlar.c !== 'erkek' || b.alanlar.akt !== 'orta')
      kotu.push(`${Q} → form alanları doldurulmadı (${JSON.stringify(b.alanlar)})`);

    /* determinizm — aynı sorgu iki kez, birebir aynı çıktı */
    await ac(page, Q);
    const c = await durum(page);
    if(JSON.stringify({b:b.bmr,t:b.tdee,x:b.bantlar}) !== JSON.stringify({b:c.bmr,t:c.tdee,x:c.bantlar}))
      kotu.push('aynı sorgu iki koşuda farklı sonuç verdi — deterministik değil');

    /* virgüllü parametre de çalışmalı */
    await ac(page, '?c=kadin&yas=28&boy=167,5&kilo=59,2&akt=cok');
    const v = await durum(page);
    const vBek = Math.round(tdeeHam('kadin', 28, 167.5, 59.2, 'cok'));
    if(v.tdee !== vBek) kotu.push(`virgüllü parametre → ${v.tdee} (beklenen ${vBek})`);

    /* bozuk / eksik → 200 + BOŞ FORM */
    const BOZUK = ['?', '?c=erkek', '?c=uzayli&yas=30&boy=180&kilo=78&akt=orta',
                   '?c=erkek&yas=abc&boy=180&kilo=78&akt=orta',
                   '?c=erkek&yas=30&boy=999&kilo=78&akt=orta',
                   '?c=erkek&yas=30&boy=180&kilo=78&akt=lazer',
                   '?c=erkek&yas=30&boy=180&akt=orta',
                   '?yas=30&boy=180&kilo=78'];
    for(const q of BOZUK){
      const r = await fetch(`${BASE}/${SAYFA}${q}`);
      if(r.status !== 200){ kotu.push(`${q} → HTTP ${r.status}`); continue; }
      await ac(page, q);
      const d = await durum(page);
      if(d.durum !== 'bos') kotu.push(`${q} → data-durum="${d.durum}" ("bos" bekleniyordu)`);
      if(d.tdee !== null)   kotu.push(`${q} → sayı basıldı (tdee=${d.tdee})`);
      if(d.uyari)           kotu.push(`${q} → kullanıcı yazmadan uyarı basıldı`);
      const dolu = Object.entries(d.alanlar).filter(([, v]) => v !== '' && v !== null);
      if(dolu.length) kotu.push(`${q} → form boş değil: ${dolu.map(([k,v]) => k+'="'+v+'"').join(' ')}`);
    }
    if(!kotu.length) ok(`?parametre hesabı geri kuruyor · deterministik · ${BOZUK.length} bozuk sorgunun hepsi 200 + boş form`);
    else rec('?parametre', kotu.join('\n      '));
  }

  /* ---- 11 · KATSAYI TABLOSU ↔ KOD ---- */
  {
    const r = await page.evaluate(() => {
      const H = window.EH_HESAP;
      const satir = (tid) => [...document.querySelectorAll('#'+tid+' tbody tr')].map(tr => ({
        k: tr.getAttribute('data-k'),
        ad: tr.querySelector('th').textContent.trim(),
        gorunen: tr.querySelector('td.num').textContent.trim(),
        kat: tr.querySelector('td.num').getAttribute('data-kat'),
        alt: tr.querySelector('td.num').getAttribute('data-alt'),
        ust: tr.querySelector('td.num').getAttribute('data-ust')
      }));
      return {
        H,
        kat: satir('ehKatTablo'),
        hedef: satir('ehHedefTablo'),
        formulMetin: document.getElementById('ehFormulKutu').innerText.replace(/\s+/g,' ').trim(),
        notMetin: document.getElementById('ehNote').innerText.replace(/\s+/g,' ').trim(),
        statFormul: document.getElementById('ehStatFormul').textContent.trim(),
        statAkt: document.getElementById('ehStatAkt').textContent.trim(),
        statHedef: document.getElementById('ehStatHedef').textContent.trim(),
        secAkt: [...document.querySelectorAll('#ehAkt option')].map(o => o.value).filter(Boolean)
      };
    });
    const kotu = [];

    /* 11a · sayfadaki HESAP nesnesi bu dosyanın bağımsız kopyasıyla aynı mı */
    for(const [k, v] of Object.entries(KAT)){
      const o = r.H.aktivite.find(a => a.k === k);
      if(!o) { kotu.push(`HESAP.aktivite içinde "${k}" yok`); continue; }
      if(o.kat !== v) kotu.push(`HESAP.aktivite.${k}.kat = ${o.kat}, bağımsız kopyada ${v}`);
    }
    if(r.H.aktivite.length !== 5) kotu.push(`HESAP.aktivite ${r.H.aktivite.length} kademe (5 bekleniyordu)`);
    for(const [k, [a, u]] of Object.entries(BANT)){
      const o = r.H.hedef.find(h => h.k === k);
      if(!o) { kotu.push(`HESAP.hedef içinde "${k}" yok`); continue; }
      if(o.alt !== a || o.ust !== u) kotu.push(`HESAP.hedef.${k} = ${o.alt}–${o.ust}, bağımsız kopyada ${a}–${u}`);
    }
    if(r.H.formul.kiloKat !== KILO_KAT || r.H.formul.boyKat !== BOY_KAT || r.H.formul.yasKat !== YAS_KAT ||
       r.H.formul.sabit.erkek !== SABIT.erkek || r.H.formul.sabit.kadin !== SABIT.kadin)
      kotu.push(`HESAP.formul katsayıları bağımsız kopyadan farklı: ${JSON.stringify(r.H.formul)}`);
    for(const [k, [mn, mx]] of Object.entries(SINIR)){
      if(r.H.sinir[k].min !== mn || r.H.sinir[k].max !== mx)
        kotu.push(`HESAP.sinir.${k} = ${r.H.sinir[k].min}–${r.H.sinir[k].max}, bağımsız kopyada ${mn}–${mx}`);
    }
    for(const [k, v] of Object.entries(TABAN))
      if(r.H.tabanKcal[k] !== v) kotu.push(`HESAP.tabanKcal.${k} = ${r.H.tabanKcal[k]}, bağımsız kopyada ${v}`);

    /* 11b · GÖRÜNEN tablo ↔ nesne */
    if(r.kat.length !== r.H.aktivite.length) kotu.push(`katsayı tablosunda ${r.kat.length} satır, HESAP'ta ${r.H.aktivite.length} kademe`);
    r.kat.forEach((row, i) => {
      const o = r.H.aktivite[i];
      if(!o) return;
      if(row.k !== o.k)  kotu.push(`katsayı tablosu satır ${i+1} anahtarı "${row.k}", HESAP'ta "${o.k}"`);
      if(row.ad !== o.ad) kotu.push(`katsayı tablosu "${row.ad}", HESAP'ta "${o.ad}"`);
      if(+row.kat !== o.kat) kotu.push(`katsayı tablosu data-kat="${row.kat}", HESAP'ta ${o.kat}`);
      const bekMetin = '×' + String(o.kat).replace('.', ',');
      if(row.gorunen !== bekMetin) kotu.push(`katsayı tablosunda GÖRÜNEN "${row.gorunen}", beklenen "${bekMetin}"`);
    });
    r.hedef.forEach((row, i) => {
      const o = r.H.hedef[i];
      if(!o) return;
      if(+row.alt !== o.alt || +row.ust !== o.ust)
        kotu.push(`hedef tablosu "${row.ad}" ${row.alt}–${row.ust}, HESAP'ta ${o.alt}–${o.ust}`);
    });
    /* 11c · seçenek listesi de nesneden mi */
    if(r.secAkt.join(',') !== r.H.aktivite.map(a => a.k).join(','))
      kotu.push(`aktivite <select> seçenekleri "${r.secAkt.join(',')}", HESAP'ta "${r.H.aktivite.map(a=>a.k).join(',')}"`);
    /* 11d · denklem sayfada GÖRÜNÜR yazılı mı */
    for(const parca of [r.H.formul.ad, '10 × kilo', '6,25 × boy', '5 × yaş', '+ 5', '− 161', 'TDEE = BMR × aktivite katsayısı'])
      if(!r.formulMetin.includes(parca)) kotu.push(`denklem kutusunda "${parca}" görünmüyor`);
    /* 11e · sınırlar ve eşikler sayfada yazılı mı */
    for(const parca of ['15–100', '120–230', '30–300', '1.200', '1.500'])
      if(!r.notMetin.includes(parca)) kotu.push(`açıklama satırında "${parca}" görünmüyor`);
    /* 11f · banner istatistikleri de nesneden */
    if(r.statFormul !== r.H.formul.ad) kotu.push(`banner "${r.statFormul}", HESAP'ta "${r.H.formul.ad}"`);
    if(+r.statAkt !== r.H.aktivite.length) kotu.push(`banner ${r.statAkt} kademe, HESAP'ta ${r.H.aktivite.length}`);
    if(+r.statHedef !== r.H.hedef.length) kotu.push(`banner ${r.statHedef} bant, HESAP'ta ${r.H.hedef.length}`);

    if(!kotu.length) ok(`katsayı/hedef/sınır tabloları sayfada GÖRÜNEN hâliyle HESAP nesnesiyle birebir (K44) · denklem sayfada açık yazılı`);
    else rec('katsayı tablosu ↔ kod', kotu.join('\n      '));
  }

  /* ---- 9 · yatay taşma + konsol ---- */
  {
    await ac(page);
    await doldur(page, { c:'erkek', yas:30, boy:180, kilo:78, akt:'orta' });
    const tasma = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if(tasma <= 0) ok('yatay taşma 0 (sonuç dolu hâldeyken)');
    else rec('yatay taşma', `@${width} → ${tasma} px`);
    if(!konsol.length) ok('konsol hatası 0');
    else rec('konsol', konsol.join(' | '));
  }

  await ctx.close();
}

/* ---------- 10 · SAYFADAKİ HER İÇ BAĞLANTI 200 ---------- */
{
  const ctx  = await browser.newContext({ viewport:{ width:1440, height:900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/${SAYFA}`, { waitUntil:'networkidle', timeout:30000 });
  /* sonuç ekranındaki köprüler de sayılsın: bir hesap ve bir kapı aç */
  const hepsi = new Set();
  const topla = async () => {
    /* YALNIZ main — footer ve header kabuğun alanı (K35), sosyal medya
       yer tutucuları oradadır ve bu sayfanın sorumluluğunda değildir. */
    const l = await page.evaluate(() => [...document.querySelectorAll('main a[href]')]
      .map(a => a.getAttribute('href')));
    l.forEach(h => hepsi.add(h));
  };
  await topla();
  await doldur(page, { c:'erkek', yas:30, boy:180, kilo:78, akt:'orta' }); await topla();
  await doldur(page, { c:'kadin', yas:60, boy:150, kilo:45, akt:'hareketsiz' }); await topla();
  await doldur(page, { c:'kadin', yas:30, boy:165, kilo:62, akt:'orta', gebe:true }); await topla();

  const ic = [...hepsi].filter(h => h && !/^(https?:|mailto:|tel:|#|javascript:|\?)/.test(h));
  const kirik = [];
  for(const h of ic){
    const f = h.split('#')[0];
    if(!f) continue;
    const r = await fetch(`${BASE}/${f}`);
    if(r.status !== 200) kirik.push(`${h} → ${r.status}`);
  }
  const bos = [...hepsi].filter(h => h === '#').length;
  if(bos) rec('boş bağlantı', `main içinde href="#" sayısı ${bos} (belge §23)`);
  if(!ic.length) rec('iç bağlantı', 'sayfada hiç iç bağlantı bulunamadı');
  else if(!kirik.length) ok(`${ic.length} iç bağlantının hepsi HTTP 200 (sonuç ve kapı ekranları dahil)`);
  else rec('kırık iç bağlantı', kirik.join(' · '));
  await ctx.close();
}

await browser.close();

console.log('');
if(fail){ console.log(`✗ ${fail} sorun\n\n  · ` + bad.join('\n  · ')); process.exit(1); }
console.log('✓ 0 sorun');
