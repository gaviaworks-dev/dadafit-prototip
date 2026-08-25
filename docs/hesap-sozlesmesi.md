sozlesme v1 · 2026-08-25

# Hesap Sözleşmesi — dört marka

🔴 **BU DOSYA DÖRT DEPODA BİREBİR AYNIDIR.** (K10)
`dadagastro` · `dadadiet` · `dadagourmet` · `dadafit-prototip`

Ortak depo, symlink ve dış yol bağımlılığı **yoktur** — her teammate kendi
ağacındaki bu dosyayı okur. Değiştiren, **dördünü birden** değiştirir ve
yukarıdaki sürüm damgasını yükseltir. Sapma dalga sonunda `diff` ile ölçülür.

Kararların gerekçesi: Gastro'nun `docs/hesap-mimarisi/08-kararlar.md`.
Uygulama sırası: `docs/hesap-mimarisi/09-uygulama-plani.md`.

⚠ **İSKELET.** İçerik **Dalga 1**'de dolacak; bu turda yalnız başlıklar açıldı.
Boş bir başlığı doldurmadan önce dalganın kendi şerit tanımını oku.

---

## 1 · Alan adları

<!-- Dalga 1 · dört şerit kendi deposundan ölçüm getirir -->

### 1.1 · Kimlik ve profil

### 1.2 · Güvenlik ve oturum

### 1.3 · Gizlilik

### 1.4 · Bildirim tercihleri

### 1.5 · Ödeme yöntemi ve fatura

### 1.6 · Üyelik ve paket

### 1.7 · Destek

### 1.8 · Rozet ve kademe

### 1.9 · Üretici ve kazanç

---

## 2 · Durum makinesi

<!-- Her durum listesi KAPALI listedir; geçişler enum'da tanımlanır,
     controller'da değil (K8, Diet emsali). -->

### 2.1 · Hesap durumu

### 2.2 · Destek talebi durumu

### 2.3 · Abonelik / paket durumu

### 2.4 · Üretici planı durumu

### 2.5 · Kazanç ve ödeme durumu

---

## 3 · Adres kalıbı

<!-- Marka önekleri ve yerelleştirme kuralları dahil. -->

### 3.1 · Hesap kökü

### 3.2 · Alt yüzeyler

### 3.3 · Yazma uçları ve hız sınırları

### 3.4 · Yönetim yüzeyi

---

## 4 · Doğrulama kuralları

<!-- Aynı alan dört depoda AYNI kuralla doğrulanır; sayı tek yerde durur. -->

### 4.1 · Alan bazlı kurallar

### 4.2 · Görsel yükleme (boyut · tip · en küçük kenar)

### 4.3 · Hız sınırı tavanları

### 4.4 · Yetki kapıları

---

## 5 · Sözleşme dışı bırakılanlar

<!-- Bilerek markaya özel kalan her şey. Boş bırakılmaz — "bu markaya özel"
     demek de bir sözleşme hükmüdür. -->
