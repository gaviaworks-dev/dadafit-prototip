/* =====================================================================
   DADAFIT — PROGRAM TAKVİM SÖZLEŞMESİ NÖBETİ  (R10 · belge §4 · §4.3 · §5.2)
   ---------------------------------------------------------------------
   NEYİ KODLUYOR — R10'da kurulan sözleşme:

   A · program-detay-v1 · "Programa Başla" bir kayıt AÇMAKLA kalmaz,
       programı TAKVİME oturtur. Üç soru (hangi günler · saat kaçta ·
       ne zaman başlıyor) sorulur, cevaplar `programBasla()`ya
       baslangic/gunler/saat olarak geçer. Sözleşme ATLANABİLİR:
       "Şimdilik geç" programı `baslangic:null` ile başlatır ve eksiği
       ekranda AÇIKÇA yazar. Aktif program varken üzerine SESSİZCE
       yazılmaz — önce çakışma paneli, sonra kullanıcının kararı.

   B · fit-planim-programim-v1 · aylık görünüm `baslangic + gunler[]`
       üzerinden çizilir; §4.3'ün yedi planlama işlemi de GERÇEKTEN
       depoya yazar. `.ics` sahte indirme değil, geçerli bir VCALENDAR.

   NEDEN KIRMIZI OLMALI (taban 8358446'da):
     `git show 8358446:program-detay-v1.html | grep -c pgKur`        → 0
     `git show 8358446:fit-planim-programim-v1.html | grep -c ptkGovde` → 0
   Taban sürümde bu nöbetin aradığı 6 çapa (#pgKur · #pgkOnizleme ·
   #pgCakisma · #pgkOzet · #ptkGovde · #ptkDuzen) HİÇ YOK; nöbet
   ilk adımda "sözleşme açılmıyor" diye düşer.

   ÖLÇÜM KURALI: görünürlük `getClientRects().length > 0`. DOM'da olmak,
   `offsetParent` ve innerText'te kelime aramak kanıt değildir (DENETIM §2).

   Çalıştırma — BASE'İ ELLE VER:
     python3 -m http.server 8811 &
     PW_HOME=~/.pw node tests/program-takvim.mjs http://localhost:8811
   ===================================================================== */
import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';
const B=process.argv[2]||'http://localhost:8811';
let hata=0; const not=(ok,m)=>{ console.log((ok?'  ✓ ':'  ✗ ')+m); if(!ok)hata++; };
const b=await chromium.launch();
const c=await b.newContext({viewport:{width:1440,height:1100}});
await c.addInitScript(()=>{try{localStorage.setItem('dm-cookie-consent','accepted');}catch(e){}});
const p=await c.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
const gor = s => p.locator(s).evaluate(e=>e.getClientRects().length).catch(()=>0);

await p.goto(B+'/program-detay-v1.html',{waitUntil:'networkidle'});
console.log('— 1 · sözleşme açılıyor mu');
not((await p.evaluate(()=>JSON.stringify(window.FIT_SHELL.state.read().program)))==='null','tıklamadan önce state.program = null');
not(await gor('#pgKur')===0,'#pgKur başta görünmüyor (rects=0)');
await p.click('#pgStart');
await p.waitForTimeout(250);
not(await gor('#pgKur')>0,'tıktan sonra #pgKur GÖRÜNÜR (getClientRects>0)');
not((await p.evaluate(()=>JSON.stringify(window.FIT_SHELL.state.read().program)))==='null','sözleşme açıkken depo HÂLÂ null — sessiz yazma yok');
const gc = await p.locator('#pgkGunler button').count();
const sc = await p.locator('#pgkSaatler button').count();
const bc = await p.locator('#pgkBaslar button').count();
not(gc===7,'gün çipi = '+gc+' (7)');
not(sc===6,'saat çipi = '+sc+' (5 hazır + saat yok)');
not(bc===3,'başlangıç çipi = '+bc+' (3)');
const ap = await p.locator('#pgKur button[aria-pressed]').count();
not(ap===gc+sc+bc,'aria-pressed taşıyan çip = '+ap+' / '+(gc+sc+bc));
const basili = await p.locator('#pgkGunler button[aria-pressed="true"]').count();
not(basili===3,'varsayılan seçili gün = '+basili+' (Pzt·Çar·Cum)');
const rand = await p.locator('#pgkOnizleme .pgk-r').count();
not(rand===3,'canlı randevu satırı = '+rand);
const ilk = await p.locator('#pgkOnizleme .pgk-r').first().innerText();
console.log('    ilk randevu satırı: '+JSON.stringify(ilk.replace(/\n/g,' | ')));
not(/GÜN 1/i.test(ilk)&&/(Yarın|Bugün|\d+ [A-ZÇĞİÖŞÜa-zçğıöşü]{3})/.test(ilk),'ilk satır gün adı/tarih + "Gün 1" taşıyor');
const bitis1 = await p.locator('#pgkBitis').innerText();
console.log('    bitiş satırı: '+JSON.stringify(bitis1));

console.log('— 2 · gün çipi basınca şerit YENİDEN YAZILIYOR');
const once = await p.locator('#pgkOnizleme').innerText();
await p.click('#pgkGunler button[data-gun="2"]');   // Salı ekle
await p.waitForTimeout(200);
const sonra = await p.locator('#pgkOnizleme').innerText();
not(once!==sonra,'Salı eklenince randevular değişti');
not((await p.locator('#pgkGunler button[aria-pressed="true"]').count())===4,'seçili gün 3→4');
await p.click('#pgkGunler button[data-gun="2"]');   // geri al
await p.waitForTimeout(150);

console.log('— 3 · hiç gün seçilmezse ölü düğme yok');
for(const g of [1,3,5]) { await p.click(`#pgkGunler button[data-gun="${g}"]`); await p.waitForTimeout(60); }
not((await p.locator('#pgkGunler button[aria-pressed="true"]').count())===0,'seçili gün 0');
not(await gor('#pgkOnayla')===0,'gün yokken "Takvimi kur" GİZLİ (ölü düğme yok)');
not(await gor('#pgkGec')>0,'"Şimdilik geç" hâlâ görünür');
not((await p.locator('#pgkOnizleme').innerText()).includes('Hiç antrenman günü seçilmedi'),'boş durum dürüstçe yazıyor');
for(const g of [1,3,5]) { await p.click(`#pgkGunler button[data-gun="${g}"]`); await p.waitForTimeout(60); }

console.log('— 4 · saat + tarih');
await p.click('#pgkSaatler button[data-saat="18:30"]');
await p.waitForTimeout(150);
not((await p.locator('#pgkOnizleme').innerText()).includes('18:30'),'saat çipi randevu şeridine işledi');
not((await p.locator('#pgkSaatAlan').inputValue())==='18:30','time alanı senkron');
await p.click('#pgkBaslar button:nth-child(1)');   // Bugün
await p.waitForTimeout(150);

console.log('— 5 · ONAY → depo');
await p.click('#pgkOnayla');
await p.waitForTimeout(300);
const pr = await p.evaluate(()=>window.FIT_SHELL.state.read().program);
console.log('    depo: '+JSON.stringify(pr));
not(pr && pr.durum==='devam','program başladı');
not(!!pr.baslangic,'baslangic YAZILDI: '+pr.baslangic);
not(JSON.stringify(pr.gunler)==='[1,3,5]','gunler = '+JSON.stringify(pr.gunler));
not(pr.saat==='18:30','saat = '+pr.saat);
not(await gor('#pgKur')===0,'onay sonrası sözleşme kapandı');

console.log('— 6 · başlattıktan sonra EKRANDA NE DEĞİŞTİ');
not(await gor('#pgkOzet')>0,'#pgkOzet GÖRÜNÜR');
const ozet = (await p.locator('#pgkOzet').innerText()).replace(/\n/g,' | ');
console.log('    özet: '+JSON.stringify(ozet));
not((await p.locator('#pgkOzet .pgk-ozet-cip').count())>=4,'özet çipi = '+(await p.locator('#pgkOzet .pgk-ozet-cip').count()));
not(/18:30/.test(ozet),'özet saati gösteriyor');
not(/Tahmini bitiş/.test(ozet),'§5.2 tahmini bitiş özet satırında');
not(await gor('#pgPlan')>0,'"Takvimi kur" düzenleme düğmesi görünür');
not(await gor('#pgStart')===0,'"Programa Başla" artık gizli');
const badge = await p.locator('#pgBadge').innerText();
not(/Devam/.test(badge),'rozet: '+badge.trim());

console.log('— 7 · ŞİMDİLİK GEÇ yolu (temiz depo)');
await p.evaluate(()=>localStorage.removeItem('dm_fit'));
await p.reload({waitUntil:'networkidle'});
await p.click('#pgStart'); await p.waitForTimeout(200);
await p.click('#pgkGec');  await p.waitForTimeout(300);
const pr2 = await p.evaluate(()=>window.FIT_SHELL.state.read().program);
not(pr2 && pr2.durum==='devam','geç yolunda da program BAŞLADI');
not(pr2.baslangic===null,'baslangic null (sözleşme atlandı)');
const oz2 = await p.locator('#pgkOzet').innerText();
not(/Takvim kurulmadı/.test(oz2),'eksik AÇIKÇA yazıyor: '+JSON.stringify(oz2.trim()));
not((await p.locator('#pgkOzet .is-yok').count())===1,'uyarı çipi var');

console.log('— 8 · DÜZENLE modu');
await p.click('#pgPlan'); await p.waitForTimeout(250);
not(await gor('#pgKur')>0,'#pgKur düzenlemede açıldı');
not(await gor('#pgkGec')===0,'düzenlemede "Şimdilik geç" gizli');
not(await gor('#pgkVazgec')>0,'düzenlemede "Vazgeç" görünür');
not((await p.locator('#pgkOnayla').innerText()).includes('güncelle'),'düğme metni "Takvimi güncelle"');
await p.click('#pgkOnayla'); await p.waitForTimeout(250);
const pr3 = await p.evaluate(()=>window.FIT_SHELL.state.read().program);
not(!!pr3.baslangic && pr3.gunler.length===3,'programPlanla yazdı: '+pr3.baslangic+' / '+JSON.stringify(pr3.gunler)+' / '+pr3.saat);
not(pr3.biten===0 && pr3.durum==='devam','düzenleme ilerlemeyi BOZMADI (biten='+pr3.biten+')');

console.log('— 9 · ÇAKIŞMA: sessiz veri kaybı yok');
await p.evaluate(()=>{ const S=window.FIT_SHELL.state;
  S.programBasla({slug:'8-hafta-mobilite',ad:'8 Hafta Mobilite Planı',toplam:12,baslangic:'2026-08-03',gunler:[2,4],saat:'07:30'});
  const s=S.read(); s.program.biten=5; S.write(s); });
await p.goto(B+'/program-detay-v1.html?slug=4-hafta-ev-antrenmani',{waitUntil:'networkidle'});
await p.click('#pgStart'); await p.waitForTimeout(250);
not(await gor('#pgCakisma')>0,'#pgCakisma GÖRÜNÜR');
not(await gor('#pgKur')===0,'sözleşme açılmadı — önce karar');
const pr4 = await p.evaluate(()=>window.FIT_SHELL.state.read().program);
not(pr4.slug==='8-hafta-mobilite' && pr4.biten===5,'ESKİ KAYIT DURUYOR (slug='+pr4.slug+' biten='+pr4.biten+')');
const cm = (await p.locator('#pgcMevcut').innerText()).replace(/\n/g,' | ');
console.log('    çakışma kartı: '+JSON.stringify(cm));
not(/8 Hafta Mobilite/.test(cm)&&/5\/12/.test(cm),'çakışma kartı neyin kaybolacağını sayıyla söylüyor');
await p.click('#pgcVazgec'); await p.waitForTimeout(200);
not(await gor('#pgCakisma')===0,'Vazgeç paneli kapattı');
not((await p.evaluate(()=>window.FIT_SHELL.state.read().program)).slug==='8-hafta-mobilite','Vazgeç sonrası eski program hâlâ yerinde');
await p.click('#pgStart'); await p.waitForTimeout(200);
await p.click('#pgcDegistir'); await p.waitForTimeout(250);
not(await gor('#pgKur')>0,'"Yine de geç" sözleşmeyi açtı');
not((await p.evaluate(()=>window.FIT_SHELL.state.read().program)).slug==='8-hafta-mobilite','sözleşme onaylanana kadar eski kayıt DURUYOR');

console.log('— 10 · JS hatası');
not(errs.length===0,'konsol hatası = '+errs.length+(errs.length?' :: '+errs.slice(0,3).join(' | '):''));

console.log('\n===== B · fit-planim-programim-v1 =====');
const U=B+'/fit-planim-programim-v1.html?auth=1';
/* A bölümü depoya program yazdı; B'nin boş-durum ölçümü TEMİZ depo ister.
   (Bu ayrımı atlayınca nöbet "boş durum yok" diye üç kez kırmızı verir —
   ölçülen kusur değil, sondanın kendi kalıntısıdır.) */
await p.goto(U,{waitUntil:'domcontentloaded'});
await p.evaluate(()=>{ try{ localStorage.removeItem('dm_fit'); }catch(e){} });

console.log('— 0 · boş durum (program yok)');
await p.goto(U,{waitUntil:'networkidle'});
not(await gor('#ptkGovde .ptk-bos')>0,'program yokken dürüst boş durum görünür');
not(await p.locator('#ptkGovde .ptk-h').count()===0,'takvim hücresi 0 — uydurma takvim yok');
not((await p.locator('#ptkArsiv').innerText()).includes('Henüz arşivlenmiş'),'arşiv boş durumu dürüst (sabit HTML gitti)');
not((await p.locator('#ptkArsiv').innerText()).includes('Sabah Esneme')===false,'eski SABİT "7 Gün Sabah Esneme" satırı YOK');

console.log('— 1 · takvim kurulu program → AYLIK GÖRÜNÜM (§4)');
await p.evaluate(()=>{const S=window.FIT_SHELL.state;
  S.programBasla({slug:'4-hafta-ev-antrenmani',ad:'4 Hafta Ev Antrenmanı',toplam:12,
    baslangic:'2026-08-10',gunler:[1,3,5],saat:'07:30'});
  const s=S.read(); s.program.biten=4; s.program.kacan=1; S.write(s);});
await p.reload({waitUntil:'networkidle'});
const hucre = await p.locator('#ptkGovde .ptk-grid > .ptk-h, #ptkGovde .ptk-grid > button.ptk-h').count();
not(hucre===42,'ay ızgarası hücre = '+hucre+' (6×7)');
not((await p.locator('#ptkGovde .ptk-gh').count())===7,'gün başlığı = 7');
const say = async s => p.locator('#ptkGovde '+s).count();
const yap=await say('.ptk-h.is-yapildi'), gel=await say('.ptk-h.is-gelecek'), ote=await say('.ptk-h.is-otelendi');
console.log('    yapıldı='+yap+' gelecek='+gel+' ötelendi='+ote);
not(yap>0,'tamamlanan gün hücresi > 0');
not(ote>0,'ötelenen gün hücresi > 0 (kırmızı değil kehribar)');
not((await p.locator('#ptkGovde .ptk-lejant span').count())===6,'lejant = 6 durum');
not((await p.locator('#ptkGovde .ptk-h .p').first().innerText()).startsWith('G'),'hücre programın KAÇINCI GÜNÜ olduğunu taşıyor');
const bOzet = (await p.locator('.ptk-ozet').innerText()).replace(/\n/g,' | ');
console.log('    özet: '+JSON.stringify(bOzet));
not(/Tahmini bitiş/.test(bOzet),'§5.2 tahmini bitiş görünür');
not(/07:30/.test(bOzet)&&/Pzt · Çar · Cum/.test(bOzet),'kalıp ve saat özette');
const ay1 = await p.locator('#ptkAyAd').innerText();
await p.click('#ptkIleri'); await p.waitForTimeout(200);
const ay2 = await p.locator('#ptkAyAd').innerText();
not(ay1!==ay2,'ay gezinme: '+ay1+' → '+ay2);
await p.click('#ptkBugun'); await p.waitForTimeout(200);
not((await p.locator('#ptkAyAd').innerText()).includes('Ağustos 2026'),'"Bugün" bugünün ayına döndü');

console.log('— 2 · ölü hücre yok: yalnız iş yapan hücre DÜĞME');
const btnH = await p.locator('#ptkGovde .ptk-grid button.ptk-h').count();
const divH = await p.locator('#ptkGovde .ptk-grid div.ptk-h').count();
not(btnH>0 && btnH+divH===42,'düğme hücre='+btnH+' · düz hücre='+divH);
not((await p.locator('#ptkGovde .ptk-grid button.ptk-h[aria-pressed]').count())===btnH,'her düğme hücre aria-pressed taşıyor');
const bLbl = await p.locator('#ptkGovde .ptk-grid button.ptk-h').first().getAttribute('aria-label');
console.log('    hücre aria-label: '+JSON.stringify(bLbl));
not(/Gün \d/.test(bLbl),'hücre aria-label tarih+gün taşıyor');

console.log('— 3 · §4.3/2 BAŞKA GÜNE TAŞI');
// gelecek bir seans hücresi seç
const hedef = await p.evaluate(()=>{const b=document.querySelector('#ptkGovde .ptk-h.is-gelecek[data-ptk-gun]');return b?b.getAttribute('data-ptk-gun'):null;});
not(!!hedef,'seçilecek gelecek seans: '+hedef);
await p.click(`[data-ptk-gun="${hedef}"]`); await p.waitForTimeout(250);
not(await gor('#ptkSec')>0,'#ptkSec eylem paneli GÖRÜNÜR');
const secNo = await p.locator('#ptkTasi').getAttribute('data-no');
const yeniTarih = await p.evaluate(h=>{const d=new Date(h);d.setDate(d.getDate()+2);return d.toISOString().slice(0,10);},hedef);
await p.fill('#ptkTasiTarih', yeniTarih);
await p.click('#ptkTasi'); await p.waitForTimeout(300);
const tas = await p.evaluate(()=>window.FIT_SHELL.state.read().program.tasimalar);
console.log('    tasimalar: '+JSON.stringify(tas));
not(tas[secNo]===yeniTarih,'seansTasi depoya yazdı: Gün '+secNo+' → '+yeniTarih);
not((await p.locator(`#ptkGovde [data-ptk-gun="${yeniTarih}"]`).count())===1,'seans YENİ tarihte çiziliyor');
not((await p.locator(`#ptkGovde [data-ptk-gun="${hedef}"]`).count())===0,'eski tarihte artık seans yok');
await p.click('#ptkTasiGeri'); await p.waitForTimeout(300);
not(Object.keys(await p.evaluate(()=>window.FIT_SHELL.state.read().program.tasimalar)).length===0,'"Kalıba geri koy" taşımayı sildi');

console.log('— 4 · §4.3/3 DİNLENME GÜNÜ EKLE');
const h2 = await p.evaluate(()=>{const b=document.querySelector('#ptkGovde .ptk-h.is-gelecek[data-ptk-gun]');return b?b.getAttribute('data-ptk-gun'):null;});
await p.click(`[data-ptk-gun="${h2}"]`); await p.waitForTimeout(200);
await p.click('#ptkDinEkle'); await p.waitForTimeout(300);
const bDin = await p.evaluate(()=>window.FIT_SHELL.state.read().program.dinlenmeler);
not(bDin.indexOf(h2)>=0,'dinlenmeEkle depoya yazdı: '+JSON.stringify(bDin));
not((await p.locator(`#ptkGovde .ptk-h.is-dinlenme[data-ptk-gun="${h2}"]`).count())===1,'hücre dinlenme olarak çiziliyor');
await p.click('#ptkDinKaldir'); await p.waitForTimeout(300);
not((await p.evaluate(()=>window.FIT_SHELL.state.read().program.dinlenmeler)).length===0,'dinlenme geri alındı');

console.log('— 5 · §4.3/1 GÜNÜ DEĞİŞTİR · /4 HATIRLATMA SAATİ');
await p.click('#ptkDuzen > summary'); await p.waitForTimeout(250);
not(await gor('#ptkGunler')>0,'düzenleme paneli açıldı');
not((await p.locator('#ptkGunler button').count())===7,'gün çipi 7');
not((await p.locator('#ptkGunler button[aria-pressed="true"]').count())===3,'seçili gün 3');
await p.click('#ptkGunler button[data-ptk-g="2"]'); await p.waitForTimeout(300);
const g2 = await p.evaluate(()=>window.FIT_SHELL.state.read().program.gunler);
not(JSON.stringify(g2)==='[1,2,3,5]','gunler depoda: '+JSON.stringify(g2));
not(await gor('#ptkGunler')>0,'panel yeniden basımda AÇIK kaldı');
await p.click('#ptkGunler button[data-ptk-g="2"]'); await p.waitForTimeout(300);
await p.click('#ptkSaatler button[data-ptk-s="18:30"]'); await p.waitForTimeout(300);
not((await p.evaluate(()=>window.FIT_SHELL.state.read().program.saat))==='18:30','saat depoda 18:30');
not((await p.locator('#ptkSaatler button[aria-pressed="true"]').count())===1,'tek saat basılı');
await p.click('#ptkSaatler button[data-ptk-s=""]'); await p.waitForTimeout(300);
not((await p.evaluate(()=>window.FIT_SHELL.state.read().program.saat))===null,'"Saat yok" saati kaldırdı');
await p.click('#ptkSaatler button[data-ptk-s="07:30"]'); await p.waitForTimeout(300);

console.log('— 6 · §4.3/5 HAFTALIK PLANI YENİDEN OLUŞTUR');
const oncekiBas = await p.evaluate(()=>window.FIT_SHELL.state.read().program.baslangic);
const yeniBas = '2026-09-07';
await p.fill('#ptkYeniBas', yeniBas);
// istisna yokken doğrudan uygulanır; varken satır içi onay çıkar (confirm YOK)
await p.evaluate(()=>{const S=window.FIT_SHELL.state;S.seansTasi(11,'2026-09-30');});
await p.waitForTimeout(200);
await p.fill('#ptkYeniBas', yeniBas);
await p.click('#ptkYeniden'); await p.waitForTimeout(300);
not(await gor('#ptkYenidenOnay')>0,'yıkıcı işlem SATIR İÇİ onay istiyor (tarayıcı diyaloğu değil)');
not((await p.locator('#ptkYenidenOnayP').innerText()).includes('1 taşıma/dinlenme'),'onay metni kaç kaydın silineceğini SAYIYLA yazıyor');
await p.click('#ptkYenidenHayir'); await p.waitForTimeout(250);
not(await gor('#ptkYenidenOnay')===0,'Vazgeç onayı kapattı');
not(Object.keys(await p.evaluate(()=>window.FIT_SHELL.state.read().program.tasimalar)).length===1,'Vazgeç sonrası taşıma DURUYOR');
await p.click('#ptkYeniden'); await p.waitForTimeout(250);
await p.click('#ptkYenidenEvet'); await p.waitForTimeout(400);
const bPr = await p.evaluate(()=>window.FIT_SHELL.state.read().program);
not(bPr.baslangic===yeniBas,'baslangic '+oncekiBas+' → '+bPr.baslangic);
not(Object.keys(bPr.tasimalar).length===0 && bPr.dinlenmeler.length===0,'istisnalar sıfırlandı');
not(bPr.biten===4,'ilerleme KORUNDU (biten='+bPr.biten+')');
not((await p.locator('#ptkAyAd').innerText()).includes('Eylül'),'takvim yeni aya taşındı: '+(await p.locator('#ptkAyAd').innerText()));

console.log('— 7 · §4.3/6 .ics GERÇEKTEN İNİYOR');
const dl = p.waitForEvent('download',{timeout:6000});
await p.click('#ptkIcs');
let ics=null, dosya=null;
try{ const d=await dl; dosya=d.suggestedFilename();
  const fs=await import('node:fs'); const yol=await d.path(); ics=fs.readFileSync(yol,'utf8'); }
catch(e){ }
not(!!ics,'indirme olayı tetiklendi · dosya = '+dosya);
if(ics){
  const ev=(ics.match(/BEGIN:VEVENT/g)||[]).length, al=(ics.match(/BEGIN:VALARM/g)||[]).length;
  console.log('    .ics: '+ics.length+' bayt · VEVENT='+ev+' · VALARM='+al);
  not(ics.startsWith('BEGIN:VCALENDAR')&&ics.trim().endsWith('END:VCALENDAR'),'geçerli VCALENDAR sarmalı');
  not(ev===12,'VEVENT = '+ev+' (12 antrenman)');
  not(al===12,'VALARM = '+al+' (hatırlatma saati gerçekten kuruldu)');
  not(/DTSTART;TZID=Europe\/Istanbul:\d{8}T073000/.test(ics),'DTSTART saat 07:30 ile yazıldı');
  not(/SUMMARY:4 Hafta Ev Antrenmanı — Gün 1/.test(ics),'SUMMARY program adı + gün no');
  not(dosya.endsWith('.ics'),'dosya adı .ics');
}
await p.waitForTimeout(200);
not((await p.locator('#ptkDurum').innerText()).includes('.ics indirildi'),'durum satırı ne olduğunu SAYIYLA yazıyor: '+JSON.stringify((await p.locator('#ptkDurum').innerText()).trim()));

console.log('— 8 · §4.3/7 Google Takvim bağlantısı SAHTE DEĞİL');
const bHref = await p.locator('#ptkGoogle').getAttribute('href');
console.log('    href: '+(bHref||'').slice(0,150));
not(/^https:\/\/calendar\.google\.com\/calendar\/render\?action=TEMPLATE/.test(bHref||''),'gerçek Google TEMPLATE uç noktası');
not(/recur=RRULE%3AFREQ%3DWEEKLY%3BBYDAY%3D/.test(bHref||''),'RRULE tüm seriyi kuruyor');
not(/ctz=Europe%2FIstanbul|ctz=Europe\/Istanbul/.test(bHref||''),'saat dilimi verildi');
not((await p.locator('#ptkGoogle').getAttribute('target'))==='_blank','yeni sekmede açılır');

console.log('— 9 · ötelenen gün + arşiv gerçek veriden');
const kacanTxt=(await p.locator('#ptkKacan').innerText()).replace(/\n/g,' | ');
console.log('    ötelenen kartı: '+JSON.stringify(kacanTxt.slice(0,150)));
not(/Şimdiye kadar ötelenen: 1/.test(kacanTxt),'ötelenen sayısı DEPODAN (1)');
not(!/başarısız|kaçırdın|ceza/i.test(kacanTxt),'ceza dili yok');
await p.click('#ptkOtele'); await p.waitForTimeout(300);
not((await p.evaluate(()=>window.FIT_SHELL.state.read().program.kacan))===2,'"Haftanın sonuna al" gerçekten gunKaydir çağırdı (1→2)');
await p.click('#ptkAtla'); await p.waitForTimeout(300);
not((await p.evaluate(()=>window.FIT_SHELL.state.read().program.gun))>1,'"Atla, devam et" gunAtla çağırdı');

console.log('— 10 · Duraklat / Bırak ölü değil');
await p.click('#ppDurakla'); await p.waitForTimeout(300);
not((await p.evaluate(()=>window.FIT_SHELL.state.read().program.durum))==='duraklatildi','Duraklat çalıştı');
not(await gor('#ppDevam')>0,'Devam et düğmesi belirdi');
await p.click('#ppDevam'); await p.waitForTimeout(300);
not((await p.evaluate(()=>window.FIT_SHELL.state.read().program.durum))==='devam','Devam et çalıştı');
await p.click('#ppBirak'); await p.waitForTimeout(300);
not(await gor('#ppBirakOnay')>0,'Bırak SATIR İÇİ onay açıyor');
not((await p.locator('#ppBirakOnayP').innerText()).includes('/12 antrenman'),'onay ne kaybedilmeyeceğini sayıyla söylüyor');
await p.click('#ppBirakHayir'); await p.waitForTimeout(250);
not((await p.evaluate(()=>window.FIT_SHELL.state.read().program.durum))==='devam','Vazgeç program durumunu DEĞİŞTİRMEDİ');
await p.click('#ppBirak'); await p.waitForTimeout(250);
await p.click('#ppBirakEvet'); await p.waitForTimeout(400);
not((await p.evaluate(()=>window.FIT_SHELL.state.read().program.durum))==='birakildi','Bırak çalıştı');

console.log('— 11 · arşiv');
await p.evaluate(()=>{const S=window.FIT_SHELL.state;
  S.programBasla({slug:'8-hafta-mobilite',ad:'8 Hafta Mobilite Planı',toplam:12,baslangic:'2026-09-01',gunler:[2,4],saat:'08:00'});});
await p.reload({waitUntil:'networkidle'});
const arv=(await p.locator('#ptkArsiv').innerText()).replace(/\n/g,' | ');
console.log('    arşiv: '+JSON.stringify(arv.slice(0,160)));
not((await p.locator('#ptkArsiv .fp-row').count())>=1,'arşiv satırı = '+(await p.locator('#ptkArsiv .fp-row').count()));
not(/4 Hafta Ev Antrenmanı/.test(arv),'bırakılan program arşive DÜŞTÜ');
not(/\d+\/12 antrenman/.test(arv),'arşiv satırı ilerlemeyi sayıyla taşıyor');

console.log('— 12 · JS hatası');
not(errs.length===0,'konsol hatası = '+errs.length+(errs.length?' :: '+errs.slice(0,3).join(' | '):''));


console.log('\n===== C · KANIT KADEMESİ · program-detay-v1 =====');
/* Sabit dk:25/kcal:280 uydurması geri gelirse burası kırmızıya döner.
   Süre sayfanın kendi gün kartlarından (~25/28/30/32 dk) okunmalı,
   kcal deponun katsayısından türetilmeli, kademe 'beyan' olmalı. */
await p.goto(B+'/program-detay-v1.html',{waitUntil:'networkidle'});
await p.evaluate(()=>{ try{ localStorage.removeItem('dm_fit'); }catch(e){} });
await p.reload({waitUntil:'networkidle'});
await p.evaluate(()=>{window.FIT_SHELL.state.programBasla({slug:'4-hafta-ev-antrenmani',
  ad:'4 Hafta Ev Antrenmanı',toplam:12,baslangic:'2026-08-10',gunler:[1,3,5],saat:'07:30'});});
await p.waitForTimeout(300);
console.log('— sayfadaki gerçek süreler kullanılıyor mu (sabit 25/280 gitti mi)');
const kayit=[];
for(let i=0;i<12;i++){
  await p.click('#pgWorkout'); await p.waitForTimeout(150);
  const g=await p.evaluate(()=>window.FIT_SHELL.state.read().gecmis[0]);
  kayit.push(g.dk+'dk/'+g.kcal+'kcal/'+g.kaynak);
}
console.log('    12 kaydın tamamı: '+kayit.join(' · '));
const dks=kayit.map(x=>+x.split('dk')[0]);
not(new Set(dks).size>1,'süre SABİT DEĞİL — farklı değer sayısı '+new Set(dks).size+' ('+[...new Set(dks)].join(',')+')');
not(JSON.stringify(dks)===JSON.stringify([25,25,25,28,28,28,30,30,30,30,32,30]),'hafta hafta sayfadaki kartlarla birebir: '+JSON.stringify(dks));
not(kayit.every(x=>!x.includes('280kcal')),'sabit 280 kcal kaydı = 0');
not(kayit.every(x=>x.endsWith('/beyan')),'kanıt kademesi hepsinde "beyan" (kronometre yok, yalan yok)');
const bekle=dks.map(d=>Math.round(6.6*d/5)*5);
const gercek=kayit.map(x=>+x.split('/')[1].replace('kcal',''));
not(JSON.stringify(gercek)===JSON.stringify(bekle),'kcal 6,6 kcal/dk katsayısından türetildi: '+JSON.stringify(gercek));
const st=await p.evaluate(()=>window.FIT_SHELL.state.read());
not(st.bugun.dk===dks.reduce((a,x)=>a+x,0),'deftere toplam '+st.bugun.dk+' dk işlendi (beklenen '+dks.reduce((a,x)=>a+x,0)+')');
not((await p.locator('#pgLive').innerText()).includes('dakika'),'aria-live ne kaydedildiğini söylüyor: '+JSON.stringify(await p.locator('#pgLive').innerText()));
not(errs.length===0,'JS hatası (C bölümü) = '+errs.length);

console.log('\n'+(hata?'KIRMIZI · '+hata+' sorun':'YEŞİL · 0 sorun · program takvim sözleşmesi ayakta'));
await b.close(); process.exit(hata?1:0);
