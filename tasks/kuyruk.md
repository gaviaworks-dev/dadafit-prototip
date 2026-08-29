# KUYRUK — R15 kapanış · 2026-08-30

Sunucu: `python3 -m http.server 8788 --bind 127.0.0.1`
Ölçüm: `PW_HOME=~/.pw node <betik>.mjs` · oturum kipi **`?auth=1`**
(⚠ `dm_fit_login` bu depoda YOK; kabuk `dm_user` okuyup `body.is-auth` basıyor)
Kit: `docs/fit-kit.md` · ölçüm betiği `docs/qa/kit-olcum.mjs`
Devir notu: `~/Desktop/dada-fit-handoff-2.md`

## YAYIN
| Adres | Ne |
|---|---|
| `gaviaworks-dev.github.io/dadafit-prototip/` | **v1** — `d4839be`e sabit |
| `…/dadafit-prototip/v2/` | **v2** — `main`, her push'ta tazelenir |
Workflow `.github/workflows/pages.yml`; yeni dondurulmuş sürüm için `V1_SHA`.

## R15'TE KAPANANLAR
Menü 13→9 kalem · 7 yeni sayfa · 8 sözleşme modülü · 15 sayfa silindi ·
170+ bağlantı yeniden yazıldı · kaydetme · challenge (3 tip) · rozet · puan ·
liderlik · su takibi · kademe (8) · antrenör sohbeti · ödeme ve paketler ·
destek tek adreste · zebra · 44px dokunma hedefi.
**60 sayfa · ölü bağlantı 0 · konsol hatası 0 · "Yakında" 0 · yer tutucu 0.**

---

## SIRADAKİ

### 1 · Challenge sistemi gerçek olacak 🔴 SONRAKİ OTURUMUN ANA İŞİ
Motor (`fit-challenge.js`) çalışıyor — 3 katalog, üç tip (`sureli`·`seri`·
`aliskanlik`), kanıt kademesi, puan/rozet bağı. **Akış yarım:**
`challenge-merkezi-v1.html` 3 kart basıyor ama **katıl düğmesi 0** — keşif
yüzeyinden katılınamıyor; yalnız `challengelarim-v1.html`den katılınıyor (3/3).
🔴 `challenge-v1.html` hâlâ eski `FIT_SHELL.state.challenge` (tek nesne,
tarihsiz) kullanıyor — **iki kayıt yeri var**, ilk iş bunu teke indirmek.
Ayrıntılı yol haritası devir notunun **6. bölümünde**.

### 2 · Destek formu koşullu alanlar 🔵 SIRADA
Yeni talep formunda seçilen konuya göre açılan/kapanan alan yok; her talep aynı
formu dolduruyor (ör. "ödeme" → fatura numarası, "antrenör" → antrenör seçici).
Şartname bu turda gelmedi, ölçüm yapılmadı — **önce ölç**.

### ✅ Hesap ayarları telefon ülke kodu — KAPANDI (bu oturum)
`hesabim-v1.html` profil sekmesindeki telefon alanı düz metin; ülke kodu
seçicisi yok.
`giris-v1.html`dekinin aynısı gelecek: bayrak · ülke adı · alan kodu ·
aranabilir liste.
🔴 **`assets/js/fit-ulke.js` zaten var, oradan beslenecek — ikinci kopya
üretilmeyecek.** (Aynı hata bir kez yapıldı: liste `giris-v1`de satır içiydi,
ikinci gerçek kaynak olmasın diye modüle taşındı.)
**Ölçüldü:** 199 ülke · varsayılan 🇹🇷 · "alman" → 1 sonuç (Almanya +49) ·
seçim gizli alana `DE` yazıyor · Esc kapatıyor · taşma 0 · konsol 0.
Ayrıca üç sayfada düğme 96×43 → **96×45** (1px dokunma hedefi eksiğiydi).

---

## AÇIK KALEMLER (veri ya da karar bekliyor)

1. **Pro Max fiyatı** — `fit-paket.js`te `fiyat:null`, ekranda "Fiyat onay
   bekliyor". Rakam gelince tek satır; kart, tablo ve ödeme özeti aynı diziden
   basıldığı için üç ekran birden güncellenir.
2. **İlçe listesi** — 81 il tam; 973 ilçe serbest metin. Hafızadan üretmek
   yanlış veri riskiydi. Gerçek liste verilirse tek dosyaya girer.
3. **Hatırlatma** — su takibinde ayar ekranı gerçek, bildirim maket ve bunu
   ekranda söylüyor. Backend gelince bağlanır.
4. **Kademe alanı** — `dm_user` şemasında `paket` YOK; profil kartı savunmacı
   okuyup "Ücretsiz" basıyor (onaylandı).
5. **Üyelik tarihi** — hiçbir şemada kayıt tarihi yok, kartta "—".
6. **Ölü CSS** — `fit-planim.css`teki `.fpx-kol-*` kuralları koleksiyon
   kalkınca ölü kaldı. Regex denemesi dosyayı kırdı, geri alındı; düzgün bir
   CSS ayrıştırıcısıyla alınmalı.
7. **`h1` semantiği** — modül sayfalarında `<h1>` sayfa adı değil kullanıcı adı
   (kasıtlı). Sayfa adı breadcrumb, `<title>` ve sekme şeridinde.

---

## SONRAKİ OTURUM: ADMİN PANEL
`fit-paket.js` (kademe⇄özellik matrisi) ve `fit-challenge.js` (challenge
kataloğu) bugün okunabilir veri; panel yazma ucunu ekleyecek. Ayrıntı devir
notunun 6. bölümünde.
