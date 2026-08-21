# -*- coding: utf-8 -*-
"""bolgeler.py'nin ürettiği yollardan dört gövde SVG'sini yazar."""
import json, re, sys, os
SP=os.environ.get('ANATOMI_SP')
d=json.load(open(f"{SP}/hf2/_yollar.json")); W,H=d['w'],d['h']
ADI={'erkek':'Erkek','kadin':'Kadın'}; GOR={'on':'ön','arka':'arka'}
veri=open('assets/js/anatomi-veri.js',encoding='utf-8').read()
adlar=dict(re.findall(r"'([a-z-]+)':\s*\{\s*\n\s*ad:\s*'([^']+)'", veri))
for c in ['erkek','kadin']:
    for g in ['on','arka']:
        y=d['yollar'][f'{c}-{g}']
        parca=[f'    <path class="an-bolge" id="{s}" data-kas="{s}"\n      d="{y[s]}"><title>{adlar.get(s,s)}</title></path>' for s in y]
        svg=f'''<?xml version="1.0" encoding="UTF-8"?>
<!--
  DADAFIT — {ADI[c].upper()} GÖVDE · {GOR[g].upper()} GÖRÜNÜM       (R6 · madde 21)
  =========================================================================
  İKİ KATMAN
    1. <image class="an-govde">  görünen gövde. Higgsfield ile üretilmiş nötr
       kas haritası. Boyanmaz, nötr kalır.
    2. <path class="an-bolge">   tıklama hedefi ve vurgu boyası. Varsayılan
       dolgu SAYDAM; seçilmemiş kasın üstünde boya yoktur.

  KOORDİNAT: dört dosyada ortak viewBox 0 0 {W} {H}. Dört render ortak tuvale
  NORMALİZE edildi; ölçek referansı gövde yüksekliği (baş tepesi → topuk =
  1300 px), genişlik zorlanmadı. Normalize sonrası nirengi kayması:
  omuz 16 · kalça 21 · kasık 11 · diz 3 px.

  PATH'LER ELLE ÇİZİLMEDİ. Render düz renkli plakalardan oluştuğu için
  görüntü segmentlendi (connectedComponents) ve plaka sınırları findContours
  ile çıkarıldı; sadeleştirme toleransı 1.1 px. Kontur render'ın kendisinden
  türüyor, hizasızlık mümkün değil.
  Üreteç: tasks/anatomi-uretim/ (bolgeler.py + svg-yaz.py), yeniden koşturulabilir.

  BOYAMA SIRASI alandan büyükten küçüğe: SVG'de sonraki path üste bindiği
  için ince kaslar en sonda kalır, büyük komşusunun altında kaybolmaz.

  Renk SVG'de sabitlenmez; dolgu sayfa CSS'inden gelir.
-->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 {W} {H}" role="img" aria-labelledby="baslik-{c}-{g}"
     class="an-harita" data-gorunum="{g}" data-cinsiyet="{c}"
     preserveAspectRatio="xMidYMid meet">
  <title id="baslik-{c}-{g}">{ADI[c]} gövde, {GOR[g]} görünüm — tıklanabilir kas haritası</title>

  <image class="an-govde" x="0" y="0" width="{W}" height="{H}"
         href="assets/img/anatomi/govde-{c}-{g}.png"
         xlink:href="assets/img/anatomi/govde-{c}-{g}.png"/>

  <g class="an-bolgeler">
{chr(10).join(parca)}
  </g>
</svg>
'''
        open(f'assets/svg/govde-{c}-{g}.svg','w',encoding='utf-8').write(svg)
        print(f'govde-{c}-{g}.svg  {len(y)} slug')
import xml.dom.minidom, glob
for f in sorted(glob.glob('assets/svg/govde-*.svg')): xml.dom.minidom.parse(f)
print('XML OK ×4')
