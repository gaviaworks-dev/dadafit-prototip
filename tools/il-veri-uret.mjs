/* =====================================================================
   İL LİSTESİ ÜRETECİ  —  assets/js/fit-il-veri.js
   ---------------------------------------------------------------------
   🔴 LİSTE UYDURULMAZ, DEPODAN OKUNUR. Türkiye'nin 81 ili bu depoda bir
   veri modülünde DEĞİL, `odemelerim-v1.html`in fatura adresi alanına
   `<option>` olarak GÖMÜLÜ duruyor (ölçüldü: tek dosya, tek yer).

   Bu, deponun kendi kuralına aykırı: yönetim paneli bir listeyi
   yönetecekse listenin bir kaynağı olmalı; gömülü `<option>` yığınını
   ikinci bir yerde elle tekrarlamak "aynı soruya iki cevap" kusurudur.
   Bu yüzden liste KOPYALANMADI, ÇIKARILDI — üreteç public sayfayı
   okuyor, public sayfa değişmiyor. Public taraf da modüle geçtiğinde
   üreteç silinir ve tek kaynak modül olur.

   Koşum:  node tools/il-veri-uret.mjs
   ===================================================================== */
import { readFileSync, writeFileSync } from 'node:fs';

const KAYNAK = 'odemelerim-v1.html';
const metin = readFileSync(KAYNAK, 'utf8');

/* Adana ile başlayıp Düzce'ye kadar giden <option> bloğunu bul: il
   listesinin ilk ve son alfabetik kaydı sabit ve başka bir <select>te
   "Adana" geçmiyor (ölçüldü). */
const bas = metin.indexOf('<option>Adana</option>');
if (bas < 0) throw new Error('İl listesi bulunamadı: <option>Adana</option> yok');
const kalan = metin.slice(bas);
const son = kalan.indexOf('</select>');
if (son < 0) throw new Error('İl listesinin bittiği </select> bulunamadı');

const iller = [...kalan.slice(0, son).matchAll(/<option>([^<]+)<\/option>/g)]
  .map((m) => m[1].trim())
  .filter(Boolean);

if (iller.length !== 81) {
  throw new Error(`81 il beklendi, ${iller.length} bulundu — kaynak değişmiş olabilir, ` +
    'liste uydurulmadan önce DUR.');
}

const cikti = `/* =====================================================================
   FIT_IL_VERI — TÜRKİYE'NİN 81 İLİ
   ---------------------------------------------------------------------
   🔴 BU DOSYA ELLE DÜZENLENMEZ. Üreteci: tools/il-veri-uret.mjs
   Ölçüm: ${new Date().toISOString().slice(0, 10)} · kaynak \`${KAYNAK}\`

   Liste UYDURULMADI, depodan ÇIKARILDI: 81 il bugün
   \`${KAYNAK}\`in fatura adresi alanına \`<option>\` olarak gömülü ve
   başka hiçbir yerde yok. Yönetim panelinin il alanı buradan okur;
   ikinci bir elle-yazılmış kopya ÜRETİLMEDİ.

   ⚠ İLÇE LİSTESİ YOK. 973 ilçenin hiçbiri bu depoda değil ve hafızadan
   üretmek yanlış veri riskiydi (\`tasks/kuyruk.md\` kalem 2). İlçe alanı
   serbest metin kalır; gerçek liste gelince bu modüle eklenir.
   ===================================================================== */
window.FIT_IL_VERI = ${JSON.stringify(iller, null, 0).replace(/","/g, '", "')};
`;
writeFileSync('assets/js/fit-il-veri.js', cikti);
console.log('yazıldı: assets/js/fit-il-veri.js ·', iller.length, 'il ·',
  iller[0], '…', iller[iller.length - 1]);
