# -*- coding: utf-8 -*-
"""DadaFit anatomi — render'dan bölge maskesi üretimi (R6 · madde 21).

ERKEK: plakalar elle slug'a atandı (etiketli haritadan okunarak).
KADIN: erkek slug maskesiyle EN ÇOK ÖRTÜŞEN bileşen kuralı; örtüşmesi
       olmayan slug için doğrudan geometrik kesişim (maske ∩ kadın plakası).
       Gövdeler ortak tuvalde nirengi bazında ≤21 px hizalı olduğu için
       geçerli; sonuç gözle doğrulanır.
"""
import numpy as np, json, cv2
SP="/private/tmp/claude-501/-Users-gaviaworks-Developer-Projects-dadafit-prototip/ce69d8d5-864c-420f-9bb0-96a0f9364f91/scratchpad"
W,H=758,1380

ON = {
 'boyun':[1,2], 'trapez-ust':[5,6], 'gogus-ust':[9,10], 'gogus':[11,12],
 'serratus':[47,48], 'biceps':[13,14], 'brachioradialis':[39,40],
 'on-kol-fleksor':[49,50,51,52],
 'karin-duz':[19,20,31,32,45,46,53,54], 'karin-yan':[23,24],
 'tensor-fasya-lata':[55,56], 'kalca-fleksor':[57,58], 'adduktor':[65,66],
 'quadriceps':[63,64,67,68,69,70], 'gastrocnemius':[71,72,74,75], 'tibialis-on':[76,77],
}
ON_BOL={'deltoid-on':[(7,'ic'),(8,'ic')],'deltoid-yan':[(7,'dis'),(8,'dis')]}
ARKA = {
 'deltoid-arka':[4,5], 'rotator-manset':[6,7], 'teres-major':[8,9],
 'triceps':[10,11,12,13], 'brachioradialis':[16,17],
 'on-kol-ekstansor':[24,25,26,27,28,29],
 'latissimus':[14,15], 'erector-spinae':[18,19],
 'gluteus-medius':[30,31], 'gluteus-maximus':[32,33], 'tensor-fasya-lata':[34,35],
 'hamstring':[36,37,38,39,40,41], 'adduktor':[42,43],
 'gastrocnemius':[44,45,46,47], 'soleus':[48,49],
}
ARKA_BOL={'trapez-ust':[(2,'tum'),(1,'ust'),(3,'ust')],
          'trapez-orta-alt':[(1,'alt'),(3,'alt')],
          'romboid':[(1,'romb'),(3,'romb')]}
YY=np.arange(H)[:,None]; XX=np.arange(W)[None,:]

# ===========================================================================
# R9/K22 · TRAPEZ PLAKASININ İÇ KESİMLERİ — DÜZ BANTTAN KAS BİÇİMİNE
# ---------------------------------------------------------------------------
# Beyar: "Bazı kaslar seçilince yeşil alan dikdörtgen çıkıyor — kasın kendi
# şeklini almıyor. Romboid ve trapez orta bölgede net görünüyor."
#
# ÖLÇÜLDÜ, TAHMİN EDİLMEDİ. 72 bölgenin (4 harita × 18) tamamı <path>;
# ne <rect> var ne de ayrı bir vurgu katmanı — seçim doğrudan path'i
# boyuyor (`.an-bolge[aria-pressed="true"]{fill}`), `outline:none`.
# 66 bölge render'ın DÜZ RENKLİ PLAKASINDAN findContours ile çıkıyor,
# yani konturu zaten birebir izliyor. Kutu görünen 6 bölge (iki arka
# haritada trapez-ust · trapez-orta-alt · romboid) plaka DEĞİL: tek bir
# trapez plakasının EKSEN HİZALI düz çizgilerle kesilmesiyle üretiliyordu
#   eski: ust  = YY < 305                       (yatay düz çizgi)
#         romb = 305 <= YY < 430  ∧  iç %42     (yatay bant × düşey çizgi)
#         alt  = YY >= 305  −  romb             (kalan)
# Bu üç düz çizgi ekranda dikdörtgen olarak okunuyordu.
#
# NEDEN PLAKA YOK: romboid anatomik olarak trapezin ALTINDA kalır, render
# onu ayrı bir plaka olarak çizmiyor; üst/orta trapez ayrımı da tek plakada.
# Yani izlenecek bir kontur YOK, bölge sentezlenmek zorunda. Yapılan:
# sentezi düz banttan KAS LİFİ YÖNÜNE çevirmek.
#   · romboid  → paralelkenar: lifler omurgadan aşağı-DIŞA gider, üst ve
#                alt kenar orta hattan uzaklaştıkça birlikte aşağı kayar
#   · trapez-ust ↔ orta/alt sınırı → skapula dikeni yönünde EĞİK çizgi
#                (orta hatta daha aşağıda, omuz ucunda daha yukarıda)
# Dış sınır her koşulda plakanın kendi konturu (maskeler `m &` ile
# kesiliyor), yani render ile hizasızlık yine imkânsız.
#
# İKİNCİ KUSUR — KADIN HARİTASINDA TEK TARAF. Eski kesim bileşenin
# ortalama x'ine bakıp "sol mu sağ mı" diye tek yön seçiyordu. Erkekte
# trapez iki ayrı bileşen (1 sol · 3 sağ) olduğu için çalışıyordu; kadında
# plaka TEK bileşen (x 260..496, iki yakayı da kapsıyor) → romboid ve
# trapez kesimleri yalnız BİR yarıya uygulanıyor, diğer yarı boş kalıyordu
# (ölçüm: kadin-arka romboid tek alt-yol, erkekte iki). Kesimler artık
# tuval orta hattına (MID) göre her iki yarıya AYRI AYRI uygulanıyor.
# ===========================================================================
MID = W / 2                 # tuval orta hattı (omurga)
TRAP_Y0, TRAP_EGIM = 318.0, 0.26   # üst/orta trapez sınırı: y = Y0 − eğim·dx
ROMB_UST, ROMB_ALT, ROMB_EGIM, ROMB_ORAN = 300.0, 415.0, 0.52, 0.42

def _yariya_uygula(m, kip):
    """Kesimi orta hattın iki yanına AYRI AYRI uygular ve birleştirir.
       Bir yarıda hiç piksel yoksa o yarı atlanır (erkekte bileşen zaten
       tek yakada)."""
    out = np.zeros((H, W), bool)
    for taraf in ('sol', 'sag'):
        yari = m & ((XX < MID) if taraf == 'sol' else (XX >= MID))
        if not yari.any():
            continue
        ys, xs = np.where(yari)
        dx = np.abs(XX - MID)                      # orta hattan uzaklık
        gen = xs.max() - xs.min()                  # bu yarının genişliği
        if kip == 'ust':
            out |= yari & (YY < TRAP_Y0 - TRAP_EGIM * dx)
        elif kip == 'romb':
            out |= yari & (dx <= ROMB_ORAN * gen) \
                        & (YY >= ROMB_UST + ROMB_EGIM * dx) \
                        & (YY <  ROMB_ALT + ROMB_EGIM * dx)
        elif kip == 'alt':
            ust  = yari & (YY < TRAP_Y0 - TRAP_EGIM * dx)
            romb = yari & (dx <= ROMB_ORAN * gen) \
                        & (YY >= ROMB_UST + ROMB_EGIM * dx) \
                        & (YY <  ROMB_ALT + ROMB_EGIM * dx)
            out |= yari & ~ust & ~romb
    return out

def parca(lab,cid,kip):
    m=(lab==cid); ys,xs=np.where(m)
    if kip=='tum': return m
    sol = xs.mean()<W/2
    if kip in ('ic','dis'):
        orta=(xs.min()+xs.max())/2
        icTaraf = (XX>=orta) if sol else (XX<=orta)
        return m & (icTaraf if kip=='ic' else ~icTaraf)
    if kip in ('ust','romb','alt'): return _yariya_uygula(m, kip)
    raise ValueError(kip)

def erkek_maske(g):
    lab=np.load(f"{SP}/hf2/erkek-{g}-nlab.npy")
    duz,bol=(ON,ON_BOL) if g=='on' else (ARKA,ARKA_BOL)
    out={}
    for s,ids in duz.items(): out[s]=np.isin(lab,ids)
    for s,pl in bol.items():
        m=np.zeros((H,W),bool)
        for cid,kip in pl: m|=parca(lab,cid,kip)
        out[s]=out.get(s,np.zeros((H,W),bool))|m
    return out

# Kadın görünümünde ELLE sabitlenen bileşenler (etiketli haritadan okundu).
# Örtüşme kuralı bunları kaçırıyordu: kadının kolları daha dar ve içeride,
# erkek maskesi ön kolun DIŞINA düşüyordu.
KADIN_SABIT = {
 'on':   {'brachioradialis':[35,36], 'on-kol-fleksor':[43,44,45,46]},
 'arka': {'brachioradialis':[23,24]},
}

# ============================================================================
# KADIN GÖRÜNÜMLERİ — ELLE SABİTLENDİ
# Otomatik aktarım (erkek maskesiyle örtüşme) kadın render'ında yetmedi:
# bazı plakalar birleşik geldi. Ölçülen örnek — kadin-arka bileşen 22,
# alan 38545, bbox y390..922: SAĞ lat ile SAĞ kalçayı tek parça yapmış,
# örtüşme kuralı hepsini gluteus-maximus'a atıyordu (yeşil sırtın yarısını
# kaplıyordu). Bu yüzden kadın da erkek gibi etiketli haritadan okundu.
# ("kirp" = bileşeni x/y aralığıyla kes; birleşik plakaları ayırmak için.)
# ============================================================================
KADIN = {
 'on': {
   'boyun':[1,2], 'gogus-ust':[9,10], 'gogus':[11,12], 'biceps':[13,14],
   'karin-duz':[19,20,28,29,39,40,47,48], 'serratus':[33,34], 'karin-yan':[41,42],
   'brachioradialis':[35,36], 'on-kol-fleksor':[43,44,45,46],
   'tensor-fasya-lata':[50,51], 'kalca-fleksor':[53,54], 'adduktor':[62,63],
   'quadriceps':[57,58,64,65,66,67], 'gastrocnemius':[70,71,72,73], 'tibialis-on':[74,75],
 },
 'arka': {
   'deltoid-arka':[7,8], 'rotator-manset':[9,10], 'teres-major':[15,16],
   'triceps':[13,14,17,18], 'brachioradialis':[23,24], 'on-kol-ekstansor':[29,30],
   'gluteus-medius':[31,32], 'tensor-fasya-lata':[35,36],
   'hamstring':[37,38,39,40,41,42,50,51], 'adduktor':[43,44],
   'gastrocnemius':[52,53,54,55], 'soleus':[56,57,58],
 },
}
# birleşik plakaları kesen kurallar: (bileşen, x0,x1, y0,y1)
KADIN_KIRP = {
 'on':   {'deltoid-on':[(7,'ic'),(8,'ic')], 'deltoid-yan':[(7,'dis'),(8,'dis')]},
 'arka': {
   'trapez-ust':      [('ust',1)],                  # R9/K22 · eğik sınır
   'trapez-orta-alt': [('alt',1)],                  # R9/K22 · eğik sınır + romboid çıkarılmış
   'romboid':         [('romb',1,None,None,None,None)],
   # R9/K22-b · latissimus artık erector-spinae'yi ÇIKARIYOR (bkz. _omurga notu)
   'latissimus':      [('lat',21),('lat',22)],
   'gluteus-maximus': [('kirp',33,None,None,None,None),('kirp',22,None,None,612,None)],
   # R9/K22-b · omurga şeridi: sabit dikdörtgen değil, aşağı indikçe genişleyen kolon
   'erector-spinae':  [('omurga',21),('omurga',22)],
 },
}

# ===========================================================================
# R9/K22-b · KADIN ARKA: ERECTOR SPINAE DİKDÖRTGENİ → OMURGA ŞERİDİ
# ---------------------------------------------------------------------------
# ÖLÇÜLEN KUSUR (denetim ajanının B maddesi, tarayıcıda doğrulandı):
# kadin-arka `latissimus` dolgusunun **%34'ü** `erector-spinae` altında
# kalıyordu — kullanıcı sırtın ortasına tıklayınca panel "Bel ve Sırt
# Dikleştiricileri" açıyordu. (Diğer 71 bölgede örtüşme %0.)
#
# KÖK NEDEN: kadın arka render'ında sırt TEK plaka (bileşen 21 sol · 22 sağ);
# erector-spinae ayrı çizilmemiş. Üreteç onu düz bir DİKDÖRTGENLE kesiyordu
# (x 339..419 · y 430..620) ve bu dikdörtgen latissimus'un içine biniyordu —
# iki bölge birbirini DIŞLAMIYORDU, üst üste iki path vardı.
#
# ÇÖZÜM İKİ PARÇA:
#  1) Şekil: sabit genişlikli dikdörtgen yerine omurga boyunca inen, aşağı
#     doğru GENİŞLEYEN kolon (bel bölgesinde erector spinae kalınlaşır).
#     Yarı genişlik y=430'da 26u → y=620'de 46u. Dış sınır yine plakanın
#     kendi konturu (`m &`).
#  2) Bölüşme: latissimus artık plakadan erector-spinae'yi ÇIKARIYOR, yani
#     iki bölge örtüşmüyor. Tıklama hedefi tek sahibe düşüyor.
# ===========================================================================
OMURGA_Y0, OMURGA_Y1, OMURGA_W0, OMURGA_W1 = 430.0, 620.0, 26.0, 46.0

def _omurga(m):
    """Plakanın omurga boyunca inen, aşağı doğru genişleyen şeridi."""
    dx = np.abs(XX - MID)
    t  = np.clip((YY - OMURGA_Y0) / (OMURGA_Y1 - OMURGA_Y0), 0.0, 1.0)
    w  = OMURGA_W0 + (OMURGA_W1 - OMURGA_W0) * t
    return m & (YY >= OMURGA_Y0) & (YY < OMURGA_Y1) & (dx <= w)

def _kirp(lab, spec):
    kip=spec[0]; cid=spec[1]
    m=(lab==cid)
    if kip in ('ust','alt'): return _yariya_uygula(m, kip)   # R9/K22
    if kip=='omurga': return _omurga(m)                      # R9/K22-b
    if kip=='lat':    return (m & (YY < 612)) & ~_omurga(m)  # R9/K22-b · örtüşme yok
    if kip=='romb':
        return _yariya_uygula(m,'romb')          # R9/K22 · bkz. _yariya_uygula notu
    x0,x1,y0,y1=spec[2],spec[3],spec[4],spec[5]
    if x0 is not None: m &= (XX>=x0)
    if x1 is not None: m &= (XX<x1)
    if y0 is not None: m &= (YY>=y0)
    if y1 is not None: m &= (YY<y1)
    return m

def kadin_maske(g, em):
    lab=np.load(f"{SP}/hf2/kadin-{g}-nlab.npy")
    plaka=lab>0
    out={s:np.zeros((H,W),bool) for s in em}
    for s,ids in KADIN.get(g,{}).items():
        if s in out: out[s]=np.isin(lab,ids)
    for s,spl in KADIN_KIRP.get(g,{}).items():
        if s not in out: continue
        m=np.zeros((H,W),bool)
        for sp in spl:
            m |= parca(lab,sp[0],sp[1]) if sp[0] in (7,8) and sp[1] in ('ic','dis') else _kirp(lab,sp)
        out[s]=m
    rapor=[]; bos=[]
    for s in em:
        if out[s].sum()<400:
            kes=em[s]&plaka
            out[s]= kes if kes.sum()>=400 else em[s]
            bos.append((s,'kesişim' if kes.sum()>=400 else 'erkek maskesi',int(out[s].sum())))
    from PIL import Image as _I
    _a=np.asarray(_I.open(f"{SP}/hf2/kadin-{g}-norm.png").convert('RGB')).astype(int)
    siluet=np.abs(_a-np.array([252,237,211])).sum(2)>60
    for s in out: out[s]=out[s]&siluet
    # kaplanmamış plaka kalmasın: hiçbir slug'a girmeyen bileşeni en çok
    # örtüşen komşusuna ver (aksi hâlde render'da tıklanamayan kas kalır)
    kapali=np.zeros((H,W),bool)
    for m in out.values(): kapali|=m
    import cv2 as _c
    seg=json.load(open(f"{SP}/hf2/kadin-{g}-nseg.json"))
    acik=[]
    for i in seg['ids']:
        m=(lab==i)
        if (m&kapali).sum()/max(1,m.sum()) < 0.30:
            skor={s:(m&em[s]).sum() for s in em}
            en=max(skor,key=skor.get)
            if skor[en]>0: out[en]|=(m&siluet); acik.append((i,en))
    rapor=acik
    return out,rapor,bos

def yol(maske, eps=1.1, minAlan=180):
    m=cv2.morphologyEx(maske.astype(np.uint8),cv2.MORPH_CLOSE,np.ones((3,3),np.uint8))
    m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
    cs,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)
    d=[]
    for c in cs:
        if cv2.contourArea(c)<minAlan: continue
        ap=cv2.approxPolyDP(c,eps,True).reshape(-1,2)
        if len(ap)<3: continue
        d.append('M'+' '.join(f'{x} {y}' for x,y in ap)+'Z')
    return ' '.join(d)

if __name__=='__main__':
    tum={}
    for g in ['on','arka']:
        em=erkek_maske(g); tum[('erkek',g)]=em
        km,rp,bos=kadin_maske(g,em); tum[('kadin',g)]=km
        print(f"=== {g} ===")
        print(f"  erkek slug {len(em)}  boş {sum(1 for s in em if em[s].sum()<400)}")
        print(f"  kadın slug {len(km)}  örtüşmeyle {sum(1 for r in rp if r[3]=='örtüşme')}"
              f" · mesafeyle {sum(1 for r in rp if r[3]=='mesafe')} · kesişimle doldurulan {len(bos)}")
        if bos: print('   doldurulanlar:', ', '.join(f'{s}({k})' for s,k,_ in bos))
    yollar={}
    for (c,g),mk in tum.items():
        # BOYAMA SIRASI: büyükten küçüğe. SVG'de sonraki path üste biner;
        # ince kaslar en sonda kalırsa büyük komşusunun altında kaybolmaz.
        sirali=sorted((s for s in mk if mk[s].sum()>=400), key=lambda s:-int(mk[s].sum()))
        yollar[f'{c}-{g}']={s:yol(mk[s]) for s in sirali}
    json.dump({'w':W,'h':H,'yollar':yollar}, open(f"{SP}/hf2/_yollar.json",'w'))
    print('\nSLUG SAYISI:', {k:len(v) for k,v in yollar.items()})
    hepsi=set().union(*[set(v) for v in yollar.values()])
    print('BENZERSİZ SLUG:', len(hepsi))
