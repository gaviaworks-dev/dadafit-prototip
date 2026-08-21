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
Y_TRAP=305; ROMB=(305,430)
YY=np.arange(H)[:,None]; XX=np.arange(W)[None,:]

def parca(lab,cid,kip):
    m=(lab==cid); ys,xs=np.where(m)
    if kip=='tum': return m
    sol = xs.mean()<W/2
    if kip in ('ic','dis'):
        orta=(xs.min()+xs.max())/2
        icTaraf = (XX>=orta) if sol else (XX<=orta)
        return m & (icTaraf if kip=='ic' else ~icTaraf)
    if kip=='ust':  return m & (YY<Y_TRAP)
    if kip=='romb':
        gen=xs.max()-xs.min()
        icx=(XX>xs.max()-0.42*gen) if sol else (XX<xs.min()+0.42*gen)
        return m & (YY>=ROMB[0]) & (YY<ROMB[1]) & icx
    if kip=='alt':  return m & (YY>=Y_TRAP) & ~parca(lab,cid,'romb')
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
   'trapez-ust':      [('kirp',1,None,None,None,305)],
   'trapez-orta-alt': [('kirp',1,None,None,305,None)],
   'romboid':         [('romb',1,None,None,None,None)],
   'latissimus':      [('kirp',21,None,None,None,612),('kirp',22,None,None,None,612)],
   'gluteus-maximus': [('kirp',33,None,None,None,None),('kirp',22,None,None,612,None)],
   'erector-spinae':  [('kirp',21,339,419,430,620),('kirp',22,339,419,430,620)],
 },
}

def _kirp(lab, spec):
    kip=spec[0]; cid=spec[1]
    m=(lab==cid)
    if kip=='romb':
        ys,xs=np.where(m); sol=xs.mean()<W/2; gen=xs.max()-xs.min()
        icx=(XX>xs.max()-0.42*gen) if sol else (XX<xs.min()+0.42*gen)
        return m & (YY>=ROMB[0]) & (YY<ROMB[1]) & icx
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
