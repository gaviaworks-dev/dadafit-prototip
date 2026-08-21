# Anatomi harita üreteci — R6 · madde 21

Dört gövde SVG'sini (`assets/svg/govde-*.svg`) **render'lardan üretir**.
Path'ler elle çizilmez; `assets/img/anatomi/govde-*.png` segmentlenerek
plaka konturları çıkarılır. Karar kayıtları: `KARARLAR.md` **K46–K49**.

## Neden üreteç var
Render değişirse SVG'ler elle düzeltilmez, bu betikler yeniden koşturulur.
Elle düzenlenen bir SVG bir daha üretilemez ve render ile hizası bozulur.

## Akış
1. `bolgeler.py` — normalize edilmiş render'ları segmentler, bileşenleri
   slug'lara eşler (erkek ve kadın için **elle** yazılmış eşleştirme
   tabloları), maskeleri kontura çevirir, `_yollar.json` yazar.
2. `svg-yaz.py` — o yollardan dört SVG dosyasını yazar ve XML doğrular.

## Koşturma
```bash
export ANATOMI_SP=<normalize edilmiş render ve .npy dosyalarının bulunduğu dizin>
python3 tasks/anatomi-uretim/bolgeler.py
python3 tasks/anatomi-uretim/svg-yaz.py
node tests/anatomi.mjs http://localhost:8811     # nöbet
```

## Gereken paketler
`numpy` · `opencv-python` (cv2) · `Pillow` — hepsi sistemde kurulu.

## Ara dosyalar
`bolgeler.py` normalize edilmiş `*-norm.png`, `*-nlab.npy` ve `*-nseg.json`
dosyalarını okur. Bunlar üretim oturumunun scratchpad'inde kaldı; render'lar
değişirse normalizasyon adımı (ortak tuval 758×1380, gövde yüksekliği
1300 px) yeniden koşturulmalı — ölçüler `tasks/DEVIR-6.md` §2a'da.
