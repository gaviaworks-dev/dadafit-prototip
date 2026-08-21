/* =====================================================================
   DADAFIT — HİZALAMA VE DOLGU NÖBETİ  (REVİZYON 7 · madde 7)
   ---------------------------------------------------------------------
   NEDEN VAR — R6'nın B20 tuzağı:
   Bir regex temizliği `.fpx-sum-sub,` seçicisini gövdesiz bıraktı; CSS onu
   bir sonraki kurala bağladı ve YEDİ sayfada iki hasar oluştu:
     · text-align justify oldu — @390 kelime arası 3.8 → 40.4 px (10.6×)
     · boş durum kuralından YABANCI padding bulaştı — blok 48 → 104 px
   Yirmi sınamanın HİÇBİRİ yakalamadı: süitte `text-align` ya da `padding`
   ölçen nöbet yoktu. Bu dosya o kör noktayı kapatır.

   DÖRT ÖLÇÜT
   1 · EŞİK AYNASI (statik) — `--jt-min` ile §2'deki `@container` sayısı
       ayrışmamalı. `@container` var() alamadığı için değer elle aynalanıyor;
       R6'da bu ikisi 30rem ↔ 20rem diye ayrışmıştı ve sorgu hiç çalışmadı.
   2 · YASLAMA OPT-IN SÖZLEŞMESİ — hiçbir eleman `.jt` taşımadan ve
       `.jt-flow` içinde olmadan `text-align:justify` HESAPLAYAMAZ.
       (B20 hasarı #1 buradan kırmızıya döner.)
   3 · HESAPSIZ DOLGU — bir <p> sıfırdan farklı padding hesaplıyorsa, onu
       EŞLEŞEN bir CSS kuralı ya da satır içi style AÇIKÇA vermiş olmalı.
       Hiçbiri vermiyorsa dolgu başka bir kuraldan bulaşmıştır.
       (B20 hasarı #2 buradan kırmızıya döner.)
   4 · "SÖZÜNÜ TUTUYOR MU" SONDASI — fit-type.css bir elemana `text-align`
       vaat ediyorsa ve o vaadi taşıyan seçicinin ÖZGÜLLÜĞÜ, aynı elemana
       text-align veren diğer bütün kuralların özgüllüğünden düşük DEĞİLSE,
       vaat computed'da tutmak ZORUNDA — çünkü fit-type.css en son yüklenir,
       eşit özgüllükte sırayla kazanır.
       Daha özgül bir SAYFA kuralının kazanması normal basamaklanmadır ve
       kırmızıya döndürmez; ayrıca sayılıp raporlanır.
       Kaynağa bakınca doğru görünüp computed'da sessizce kaybeden kural
       R6'da ÜÇ KEZ çıktı (biri yıllardır oradaydı) — hepsi "eşit ya da
       düşük özgüllük" hâliydi. DEVIR-6 §6/7 bu sondayı `tests/` altına
       almayı açık kalem bırakmıştı; sonda burada.
       Bu ölçüt aynı zamanda YÜKLEME SIRASI nöbetidir: fit-type.css sayfa
       stillerinden önce yüklenirse eşit özgüllükteki vaatler düşer.
   5 · OPT-IN KANCASI GERÇEKTEN ÇALIŞIYOR MU — `.jt` ve `.jt-flow` bugün
       hiçbir sayfada KULLANILMIYOR (ölçüldü: yaslamayı hak eden blok yok).
       Kullanılmayan kanca, gerektiği gün bozuk bulunur. Bu yüzden nöbet
       kancayı canlı sayfada kurup söker: geniş `.jt-flow` yaslamalı,
       DAR `.jt-flow` yaslamamalı (eşik iş görüyor mu), `.jt` her hâlde
       yaslamalı. Sayfaya kalıcı hiçbir şey yazılmaz.

   Çalıştırma (AÇIK BASE ile — DEVIR-6 uyarısı):
     python3 -m http.server 8811 &
     PW_HOME=~/.pw node tests/hizalama-nobeti.mjs http://localhost:8811
   ===================================================================== */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';
import { readdirSync, readFileSync, existsSync } from 'node:fs';

const B   = process.argv[2] || 'http://localhost:8811';
const KOK = '/Users/gaviaworks/Developer/Projects/dadafit-prototip';
const GEN = [1440, 390];
const SAYFALAR = readdirSync(KOK).filter(f => f.endsWith('.html')).sort();

let hata = 0;
const not = (ok, m) => { console.log((ok ? '  ✓ ' : '  ✗ ') + m); if (!ok) hata++; };

/* =====================================================================
   1 · EŞİK AYNASI — statik, tarayıcı gerekmez
   ===================================================================== */
console.log('\n1 · yaslama eşiği: --jt-min ile @container sayısı ayrışmamalı');
{
  const yol = KOK + '/assets/css/fit-type.css';
  const css = readFileSync(yol, 'utf8');
  const tok = css.match(/--jt-min\s*:\s*([\d.]+)rem/);
  not(!!tok, `fit-type.css: --jt-min tanımlı${tok ? ' (' + tok[1] + 'rem)' : ''}`);
  // §2'deki opt-in sorgusunun eşiği — yorum satırları elenir
  const kod = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const sorgular = [...kod.matchAll(/@container\s*\(\s*(min|max)-width\s*:\s*([\d.]+)rem\s*\)/g)];
  not(sorgular.length > 0, `fit-type.css: eşiği uygulayan @container sorgusu var (${sorgular.length} adet)`);
  if (tok && sorgular.length) {
    const ayrisan = sorgular.filter(m => m[2] !== tok[1]);
    not(ayrisan.length === 0,
      ayrisan.length
        ? `EŞİK AYRIŞMIŞ: --jt-min ${tok[1]}rem ama sorgu ${ayrisan.map(m => m[1] + '-width:' + m[2] + 'rem').join(', ')}`
        : `${sorgular.length}/${sorgular.length} @container sorgusu --jt-min (${tok[1]}rem) ile aynı sayıyı kullanıyor`);
  }
  // opt-in kancaları gerçekten dosyada mı
  not(/\.jt\s*\{/.test(kod) && /\.jt-flow/.test(kod),
    'fit-type.css: opt-in kancaları (.jt ve .jt-flow) tanımlı');
}

/* =====================================================================
   Tarayıcı ölçütleri
   ===================================================================== */
const ORTAK = () => {
  /* --- özgüllük: (a,b,c) — id, sınıf/öznitelik/pseudo-sınıf, eleman/pseudo-eleman --- */
  window.__ozgul = function (sel) {
    let s = sel.replace(/\s*[>+~]\s*/g, ' ').trim();
    const a = (s.match(/#[\w-]+/g) || []).length;
    const b = (s.match(/\.[\w-]+/g) || []).length
            + (s.match(/\[[^\]]+\]/g) || []).length
            + (s.match(/:(?!:)(?!not\b)[\w-]+/g) || []).length;
    const c = (s.match(/(^|[\s(])[a-zA-Z][\w-]*/g) || []).length
            + (s.match(/::[\w-]+/g) || []).length;
    return a * 10000 + b * 100 + c;
  };
  /* --- bir stylesheet'in TÜM kurallarını (gruplar dahil, koşulu tutanlar) düzleştir --- */
  window.__kurallar = function (filtreHref) {
    const out = [];
    let sira = 0;
    let kapKosul = null;
    const gez = (kurallar) => {
      for (const r of kurallar) {
        if (r.type === CSSRule.STYLE_RULE) { out.push({ sel: r.selectorText, style: r.style, sira: sira++, kap: kapKosul }); }
        else if (r.cssRules) {
          // koşullu grup: yalnız O AN geçerli olan dal sayılır
          if (r.type === CSSRule.MEDIA_RULE && !matchMedia(r.conditionText).matches) continue;
          if (r.type === CSSRule.SUPPORTS_RULE && !CSS.supports(r.conditionText)) continue;
          /* @container ELEMAN BAZLI: burada global olarak değerlendirilemez —
             koşul kurala iliştirilip ölçüt 4'te her eleman için ayrı bakılır.
             (R8: K-B ile kanca ilk kez kullanılınca ortaya çıktı — nöbet
             `.jt-flow p` vaadini koşulsuz sanıp @390'da sahte kırmızı veriyordu.) */
          const oncekiKap = kapKosul;
          if (window.CSSContainerRule && r instanceof CSSContainerRule) kapKosul = r.containerQuery || r.conditionText;
          gez(r.cssRules);
          kapKosul = oncekiKap;
        }
      }
    };
    for (const ss of document.styleSheets) {
      try {
        if (filtreHref && !(ss.href || '').includes(filtreHref)) continue;
        if (!ss.cssRules) continue;
        gez(ss.cssRules);
      } catch (e) { /* cross-origin (CDN) — atlanır */ }
    }
    return out;
  };
  window.__eslesir = function (el, sel) {
    for (const par of sel.split(',')) {
      const t = par.trim();
      if (!t) continue;
      try { if (el.matches(t)) return t; } catch (e) { /* ::placeholder vb. */ }
    }
    return null;
  };
};

const b = await chromium.launch();
const bulgu2 = [], bulgu3 = [], bulgu4 = [], kanca = [];
let sayEleman = 0, sayP = 0, sayVaat = 0, sayDevir = 0;

for (const w of GEN) {
  const ctx = await b.newContext({ viewport: { width: w, height: w > 900 ? 1000 : 844 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('dm-cookie-consent', 'accepted'); } catch (e) {} });
  await ctx.addInitScript(ORTAK);
  for (const s of SAYFALAR) {
    const p = await ctx.newPage();
    try { await p.goto(`${B}/${s}`, { waitUntil: 'networkidle', timeout: 30000 }); }
    catch (e) { await p.close(); continue; }
    await p.waitForTimeout(200);

    const r = await p.evaluate(() => {
      const sonuc = { justify: [], dolgu: [], vaat: [], nEleman: 0, nP: 0, nVaat: 0, nDevir: 0 };

      /* --- ÖLÇÜT 2 · opt-in sözleşmesi --- */
      document.querySelectorAll('body *').forEach(el => {
        sonuc.nEleman++;
        if (getComputedStyle(el).textAlign !== 'justify') return;
        if (el.classList.contains('jt') || el.closest('.jt-flow')) return;   // izinli
        sonuc.justify.push(el.tagName + '.' + (el.className || '').toString().trim().split(/\s+/)[0]);
      });

      /* --- ÖLÇÜT 3 · hesapsız dolgu (yalnız <p>: UA varsayılan dolgusu 0) --- */
      const tumKural = window.__kurallar(null);
      document.querySelectorAll('p').forEach(el => {
        sonuc.nP++;
        const c = getComputedStyle(el);
        const yon = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']
          .filter(k => parseFloat(c[k]) > 0.5);
        if (!yon.length) return;
        if (el.getAttribute('style') && /padding/.test(el.getAttribute('style'))) return;
        const veren = tumKural.some(k =>
          window.__eslesir(el, k.sel) &&
          (k.style.getPropertyValue('padding') ||
           k.style.getPropertyValue('padding-top') || k.style.getPropertyValue('padding-right') ||
           k.style.getPropertyValue('padding-bottom') || k.style.getPropertyValue('padding-left') ||
           k.style.getPropertyValue('padding-block') || k.style.getPropertyValue('padding-inline') ||
           k.style.getPropertyValue('padding-block-start') || k.style.getPropertyValue('padding-inline-start')));
        if (!veren)
          sonuc.dolgu.push(el.tagName + '.' + (el.className || '').toString().trim().split(/\s+/)[0]
            + ' → ' + yon.map(k => k.replace('padding', '').toLowerCase() + ':' + c[k]).join(' '));
      });

      /* --- ÖLÇÜT 4 · fit-type.css'in text-align vaadi computed'da tutuyor mu --- */
      const taVar   = k => !!k.style.getPropertyValue('text-align');
      const tipKural = window.__kurallar('fit-type.css').filter(taVar)
        .map(k => ({ ...k, deger: k.style.getPropertyValue('text-align') }));
      // rakipler: fit-type.css DIŞINDAKİ her kaynak (kabuk · sayfa · satır içi)
      const rakipKural = window.__kurallar(null).filter(taVar)
        .filter(k => !tipKural.some(t => t.sel === k.sel && t.sira === k.sira))
        .map(k => ({ ...k, deger: k.style.getPropertyValue('text-align'),
                     onemli: k.style.getPropertyPriority('text-align') === 'important' }));

      const aday = new Set();
      tipKural.forEach(k => k.sel.split(',').forEach(par => {
        const t = par.trim(); if (!t) return;
        try { document.querySelectorAll('body ' + t).forEach(e => aday.add(e)); } catch (e) {}
      }));
      aday.forEach(el => {
        // (a) fit-type.css içinde bu elemana uyan kuralların KAZANANI: (özgüllük, sıra)
        let kaz = null;
        for (const k of tipKural) {
          const par = window.__eslesir(el, k.sel);
          if (!par) continue;
          const o = window.__ozgul(par);
          if (!kaz || o > kaz.o || (o === kaz.o && k.sira >= kaz.sira)) kaz = { o, sira: k.sira, deger: k.deger, sel: par, kap: k.kap };
        }
        if (!kaz) return;

        // (b) DIŞARIDAN gelen en özgül rakip
        let rak = null;
        for (const k of rakipKural) {
          const par = window.__eslesir(el, k.sel);
          if (!par) continue;
          const o = window.__ozgul(par) + (k.onemli ? 1000000 : 0);
          if (!rak || o > rak.o) rak = { o, sel: par, deger: k.deger, onemli: k.onemli };
        }
        // satır içi style de rakiptir
        const satirIci = el.getAttribute('style') && /text-align\s*:/.test(el.getAttribute('style'));
        if (satirIci) rak = { o: 1000, sel: 'style=""', deger: '(satır içi)', onemli: false };

        // (c) daha özgül rakip varsa BASAMAKLANMA normaldir — sayılır, kırmızı değil
        if (rak && rak.o > kaz.o) { sonuc.nDevir++; return; }

        /* vaat @container'a bağlıysa koşulu ELEMAN İÇİN değerlendir.
           Kapsayıcı dar ise vaat zaten geçerli değildir — kusur değil, tasarım.
           Bu davranışın ÇALIŞTIĞINI ölçüt 5 canlı probla ayrıca kanıtlıyor
           (geniş .jt-flow yaslanıyor / dar .jt-flow yaslanmıyor, 132/132). */
        if (kaz.kap) {
          const m = /min-width\s*:\s*([\d.]+)(rem|px)/i.exec(kaz.kap);
          if (m) {
            const kok = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            const esik = m[2].toLowerCase() === 'rem' ? parseFloat(m[1]) * kok : parseFloat(m[1]);
            let c = el.parentElement, kutu = null;
            while (c) { const ct = getComputedStyle(c).containerType;
              if (ct && ct !== 'normal') { kutu = c.getBoundingClientRect().width; break; } c = c.parentElement; }
            if (kutu === null || kutu < esik) { sonuc.nKosullu = (sonuc.nKosullu || 0) + 1; return; }
          }
        }
        sonuc.nVaat++;
        const bek = kaz.deger.trim();
        const ger = getComputedStyle(el).textAlign;
        // `inherit` vaadi: ebeveynin değerini alması yeter
        const ok = bek === 'inherit'
          ? ger === (el.parentElement ? getComputedStyle(el.parentElement).textAlign : ger)
          : ger === bek;
        if (!ok) sonuc.vaat.push(`${kaz.sel} vaat="${bek}" ama computed="${ger}"`
          + (rak ? ` (rakip ${rak.sel} özg.${rak.o}${rak.onemli?' !important':''} ≤ vaat özg.${kaz.o})` : '')
          + ` — ${el.tagName}.${(el.className||'').toString().trim().split(/\s+/)[0]}`);
      });
      /* --- ÖLÇÜT 5 · opt-in kancası canlı sayfada kurulup sökülüyor --- */
      (function(){
        const ev = document.createElement('div');
        ev.innerHTML = '<div class="jt-flow" style="width:900px">'
          + '<p>' + 'Uzun bir paragraf gerekiyor çünkü tek satırlık metin yaslanmaz. '.repeat(6) + '</p></div>'
          + '<div class="jt-flow" style="width:240px">'
          + '<p>' + 'Dar kutuda eşik yaslamayı kapatmalı. '.repeat(6) + '</p></div>'
          + '<p class="jt">' + 'Tek blok kancası eşik aramaz. '.repeat(6) + '</p>'
          + '<p class="lead jt">' + 'Kanca istisna listesini de yenmeli. '.repeat(6) + '</p>';
        ev.style.cssText = 'position:absolute;left:-9999px;top:0';
        document.body.appendChild(ev);
        const [genis, dar] = ev.querySelectorAll('.jt-flow p');
        const tek = ev.querySelector('p.jt:not(.lead)');
        const istisna = ev.querySelector('p.lead.jt');
        sonuc.kanca = {
          genis: getComputedStyle(genis).textAlign,
          dar:   getComputedStyle(dar).textAlign,
          tek:   getComputedStyle(tek).textAlign,
          istisna: getComputedStyle(istisna).textAlign,
          cqDestek: CSS.supports('container-type:inline-size')
        };
        ev.remove();
      })();

      return sonuc;
    });

    if (r.kanca) kanca.push({ w, s, ...r.kanca });
    sayEleman += r.nEleman; sayP += r.nP; sayVaat += r.nVaat; sayDevir += r.nDevir;
    r.justify.forEach(x => bulgu2.push(`@${w} ${s} — ${x}`));
    r.dolgu.forEach(x  => bulgu3.push(`@${w} ${s} — ${x}`));
    r.vaat.forEach(x   => bulgu4.push(`@${w} ${s} — ${x}`));
    await p.close();
  }
  await ctx.close();
}
await b.close();

const yaz = (liste, n = 8) => {
  [...new Set(liste)].slice(0, n).forEach(x => console.log('      · ' + x));
  const t = new Set(liste).size;
  if (t > n) console.log(`      … ve ${t - n} tekil bulgu daha (toplam ${liste.length} örnek)`);
};

console.log(`\n2 · yaslama OPT-IN sözleşmesi (${SAYFALAR.length} sayfa × ${GEN.length} genişlik · ${sayEleman} eleman)`);
not(bulgu2.length === 0,
  bulgu2.length ? `${bulgu2.length} eleman .jt/.jt-flow olmadan justify hesaplıyor`
                : `hiçbir eleman izinsiz justify hesaplamıyor (${sayEleman} eleman tarandı)`);
if (bulgu2.length) yaz(bulgu2);

console.log(`\n3 · hesapsız dolgu — <p> dolgusunu eşleşen bir kural vermiş olmalı (${sayP} paragraf)`);
not(bulgu3.length === 0,
  bulgu3.length ? `${bulgu3.length} paragrafın dolgusunu HİÇBİR eşleşen kural vermiyor (bulaşma)`
                : `${sayP} paragrafın dolgusunun tamamı eşleşen bir kuraldan geliyor`);
if (bulgu3.length) yaz(bulgu3);

console.log(`\n4 · "sözünü tutuyor mu" sondası — fit-type.css'in KAZANMASI GEREKEN ${sayVaat} eşleşmesi`);
console.log(`    (${sayDevir} eşleşmede daha özgül bir sayfa/kabuk kuralı devraldı — normal basamaklanma)`);
not(bulgu4.length === 0,
  bulgu4.length ? `${bulgu4.length} eşleşmede fit-type.css'in text-align vaadi computed'da TUTMUYOR`
                : `${sayVaat} eşleşmenin tamamında vaat computed'da tutuyor`);
if (bulgu4.length) yaz(bulgu4, 12);

console.log(`\n5 · opt-in kancası — canlı sayfada kurulup söküldü (${kanca.length} örnek)`);
{
  const cq = kanca.length && kanca[0].cqDestek;
  const kotuGenis = kanca.filter(k => k.genis !== 'justify');
  const kotuTek   = kanca.filter(k => k.tek   !== 'justify');
  // container query desteklenmeyen tarayıcıda dar kutu @media dalına düşer;
  // orada eşik EKRANA bakar, kutuya değil — o dalda dar kutu ölçütü aranmaz
  const kotuDar   = cq ? kanca.filter(k => k.dar === 'justify') : [];
  not(kotuGenis.length === 0, kotuGenis.length
    ? `geniş .jt-flow ${kotuGenis.length} örnekte yaslanmıyor (ör. @${kotuGenis[0].w} ${kotuGenis[0].s} → ${kotuGenis[0].genis})`
    : `geniş .jt-flow ${kanca.length}/${kanca.length} örnekte yaslanıyor`);
  not(kotuDar.length === 0, kotuDar.length
    ? `DAR .jt-flow ${kotuDar.length} örnekte yaslanıyor — --jt-min eşiği iş görmüyor`
    : (cq ? `dar .jt-flow ${kanca.length}/${kanca.length} örnekte yaslanmıyor — eşik iş görüyor`
          : 'container query desteklenmiyor — dar kutu ölçütü bu tarayıcıda aranmadı'));
  not(kotuTek.length === 0, kotuTek.length
    ? `.jt ${kotuTek.length} örnekte yaslanmıyor (ör. @${kotuTek[0].w} ${kotuTek[0].s} → ${kotuTek[0].tek})`
    : `.jt ${kanca.length}/${kanca.length} örnekte yaslanıyor`);
  const kotuIst = kanca.filter(k => k.istisna !== 'justify');
  not(kotuIst.length === 0, kotuIst.length
    ? `.lead.jt ${kotuIst.length} örnekte yaslanmıyor — kanca §3 istisnasına kaybediyor (ör. @${kotuIst[0].w} ${kotuIst[0].s} → ${kotuIst[0].istisna})`
    : `.lead.jt ${kanca.length}/${kanca.length} örnekte yaslanıyor — kanca istisna listesini yeniyor`);
}

console.log(hata ? `\n${hata} SORUN\n` : '\n0 sorun — hizalama ve dolgu nöbeti temiz\n');
process.exit(hata ? 1 : 0);
