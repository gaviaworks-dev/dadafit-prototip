#!/usr/bin/env python3
"""
===============================================================================
DADAFIT — LEGACY SAYFA GÖÇ ARACI (Faz 2 · belge §1 ve §23)
-------------------------------------------------------------------------------
NE YAPAR
  12 eski sayfa (bildirimler · giris · hakkimizda · hesabim · iletisim ·
  pro-odeme · pro · profil · reklam-ver · rozetler · sss · yasal) kendi satır
  içi turuncu DadaMutfak kabuğunu taşıyor: ~850–1400 satır kabuk CSS'i,
  topbar/header/drawer/bottom-nav/footer markup'ı ve ~340–540 satır kabuk JS'i
  her dosyada ayrı ayrı duruyor. Bu araç o kabuğu söküp sayfayı DadaFit ortak
  kabuk sözleşmesine geçirir:

      <body data-brand="fit" data-fit-page="<anahtar>">
        <div id="fitShellTop"></div>
        <main class="page-main" id="pageMain"> … sayfa içeriği … </main>
        <div id="fitShellBottom"></div>
        <script src="assets/js/fit-shell.js"></script>
        <script> … yalnız SAYFA JS'i … </script>
      </body>

NEDEN ARAÇ, NEDEN ELLE DEĞİL
  Mekanik kısım 12 dosyada birebir aynı. Her ajan kendi yöntemini uydurursa
  tasarım dili sapar ve 12 farklı sonuç çıkar. Mekanik kısım burada tek
  yerden, aynı şekilde yapılır; ajana yalnız YARGI gerektiren kısım kalır
  (sayfaya özgü CSS/JS ayıklaması, marka dili, içerik).

GÜVENLİK İLKESİ — SESSİZCE SİLMEZ
  Kabuk bölgesinde tanımadığı bir düğüm bulursa onu SİLMEZ; korur ve raporda
  "KORUNDU" diye bildirir. Ölçüm: reklam-ver-v1'de kabuk bölgesinin içinde
  sayfaya ait .yp-modal/.yp-overlay, pro-v1'de .pro-gate/.pg-overlay duruyor.

KULLANIM
  python3 tools/legacy-migrate.py sss-v1                # DRY-RUN (yazmaz)
  python3 tools/legacy-migrate.py sss-v1 --apply         # uygular
  python3 tools/legacy-migrate.py sss-v1 --apply --page-key sss

  --apply öncesi dosyanın yedeği alınmaz; git'e güven (çalışma ağacı temiz olsun).
  Uygulandıktan sonra rapor stdout'a basılır; ajan raporu okumadan "bitti" demez.
===============================================================================
"""
import re, sys, os

# --- kabuk bölgesinde GÖRÜLMESİ BEKLENEN düğümler (silinebilir) --------------
# Bunların hepsini fit-shell.js zaten üretiyor. Düğüm HEM id'siyle HEM sınıfıyla
# aranır: aynı bileşen bazı sayfalarda id, bazılarında class ile yazılmış
# (ör. <aside class="drawer" id="drawer">) — biriyle eşleşmesi yeter.
SHELL_TOP_NODES = {
    '.topbar', '.header', '.drawer', '.drawer-overlay', '.bottom-nav',
    '.feedback-tab', '.fb-overlay', '.fb-modal', '.cookie-banner',
    '.skip-link', '.nav-item', '.d-item',
    '#drawer', '#drawerOverlay', '#fbTab', '#fbOverlay', '#fbModal',
    '#cookieBanner', '#cookieBar',
}
SHELL_BOTTOM_NODES = {
    '.footer', '.lg-gate', '.lg-overlay', '.to-top',
    '#lgGate', '#lgOverlay', '#toTop',
}

# --- kabuk JS'ini tanıyan parmak izleri --------------------------------------
# Bir <script> bloğu bunlardan BİRKAÇINI taşıyorsa kabuk JS'idir.
SHELL_JS_MARKS = [
    'drawerOverlay', 'hamburger', 'cookie-consent', 'dm-cookie-consent',
    'fbOverlay', 'lgGate', 'acct-item', 'nav-item', 'tbLangBtn',
    'bnAccount', 'dm_user', 'reveal-ready', 'toTop',
]

def _at_group(prelude):
    """Yorumu atarak koşullu grup at-rule'u mu diye bakar.

    prelude kendinden ÖNCEKİ yorumu da taşır; bu yüzden test yorumsuz kopyada
    yapılmalı. Eski hâli `re.match(r'\\s*@(media|…)', prelude)` idi: `\\s*`
    newline'ı yiyor, sonra `@` beklerken yorumun `/` karakterini görüyor ve
    eşleşme olmuyordu. Sonuç: yorumlu bir @media bloğu "tanımadığım at-rule →
    olduğu gibi KORU" dalına düşüyor ve gövdesi HİÇ SÜZÜLMÜYORDU (yani ilk
    hatanın tersi: "komple sil" yerine "komple tut"). Aynı sebeple
    shell_selectors kabuğun yorumlu media bloklarına inmiyor, o blokların iç
    seçicilerini hiç öğrenmiyordu.
    Ölçüm (faz2-iletisim ajanı): aynı blok, tek fark önündeki yorum —
    yorumsuz düşen=1/kalan=1, yorumlu düşen=0/kalan=1.
    """
    p = re.sub(r'/\*.*?\*/', ' ', prelude, flags=re.S).lstrip()
    return re.match(r'@(media|supports|container|layer)\b', p) is not None


def norm_sel(s):
    """Seçiciyi karşılaştırılabilir hâle getirir (boşluk ve sıra normalize)."""
    s = re.sub(r'/\*.*?\*/', '', s, flags=re.S)
    s = re.sub(r'\s+', ' ', s).strip()
    return ','.join(sorted(p.strip() for p in s.split(',') if p.strip()))


def split_css(css):
    """CSS'i üst düzey parçalara ayırır: (tip, seçici/prelude, gövde, tam metin).
    tip ∈ 'rule' | 'at' (at-rule: @media/@supports/@keyframes/@font-face …)"""
    out, i, n = [], 0, len(css)
    css_nc = re.sub(r'/\*.*?\*/', lambda m: ' ' * len(m.group(0)), css, flags=re.S)
    while i < n:
        br = css_nc.find('{', i)
        if br == -1: break
        prelude = css[i:br]
        depth, j = 1, br + 1
        while j < n and depth:
            if css_nc[j] == '{': depth += 1
            elif css_nc[j] == '}': depth -= 1
            j += 1
        body = css[br + 1:j - 1]
        # KİND TESPİTİ YORUMSUZ KOPYADAN YAPILIR.
        # Hata (faz2-iletisim ajanı yakaladı, ölçümle doğrulandı): prelude,
        # bloktan önceki YORUMU da içeriyor. "startswith('@')" yorumlu bir
        # @media bloğunu 'rule' sanıyordu; norm_sel yorumu attığı için o blok
        # shell_selectors'a "@media (max-width:640px)" gibi SAHTE bir seçici
        # olarak giriyor, filter_css de sayfadaki aynı yapıyı bu sahte
        # seçiciyle eşleştirip TÜM MEDIA BLOĞUNU düşürüyordu. iletisim-v1'de
        # yorumu olmayan @media blokları korunmuş, yorumu olan ikisi silinmişti
        # — ayrım tam olarak yorumdu. Ölçülen sonuç: 8 sahte seçici.
        prelude_nc = css_nc[i:br]
        kind = 'at' if prelude_nc.strip().startswith('@') else 'rule'
        out.append((kind, prelude, body, css[i:j]))
        i = j
    return out


def shell_selectors(shell_css):
    """fit-shell.css'in tanımladığı tüm seçiciler (at-rule içleri dahil)."""
    sels = set()
    def walk(css):
        for kind, prelude, body, _full in split_css(css):
            if kind == 'at':
                if _at_group(prelude):
                    walk(body)
            else:
                sels.add(norm_sel(prelude))
    walk(shell_css)
    return sels


def sel_parts(prelude):
    """Virgülle ayrılmış seçici listesini tek tek parçalara böler (yorumsuz)."""
    s = re.sub(r'/\*.*?\*/', '', prelude, flags=re.S)
    s = re.sub(r'\s+', ' ', s).strip()
    return [p.strip() for p in s.split(',') if p.strip()]


def filter_css(css, shell_sels):
    """Kabukta AYNI seçiciyle tanımlı kuralları atar, sayfaya özgü olanları tutar.

    EŞLEŞTİRME PARÇA BAŞINA YAPILIR. Önce liste bir bütün olarak
    karşılaştırılıyordu: sayfa `.row-nav,.cat-nav{…}` yazıp kabuk ikisini AYRI
    kurallarda tanımladığında eşleşme olmuyor ve kural gereksizce kalıyordu.
    Ölçülen kurbanlar (faz2-iletisim): `.row-nav,.cat-nav` (parçaların 1/2'si
    kabukta), `.row-nav button,.cat-nav button` (1/2),
    `body.is-auth .head-add,…` (1/3).
    Artık: TÜM parçalar kabukta varsa kural düşer; BİR KISMI varsa kural KALIR
    ve "kısmi eşleşme" olarak raporlanır — ajan ona elle bakar, çünkü kalan
    parça sayfaya ait olabilir de ölü kod da olabilir.
    """
    dropped = kept = 0
    partial = []
    def walk(css, depth=0):
        nonlocal dropped, kept
        out = []
        for kind, prelude, body, full in split_css(css):
            if kind == 'at':
                if _at_group(prelude):
                    inner = walk(body, depth + 1)
                    if inner.strip():
                        out.append(prelude + '{' + inner + '\n' + '  ' * depth + '}')
                else:
                    # @keyframes / @font-face / @import → kabukta var mı bilinmez, KORU
                    out.append(full); kept += 1
                continue
            parts = sel_parts(prelude)
            inshell = [p for p in parts if norm_sel(p) in shell_sels]
            if parts and len(inshell) == len(parts):
                dropped += 1                      # tamamı kabukta → düş
            else:
                out.append(full); kept += 1
                if inshell:                       # kısmen kabukta → koru + bildir
                    partial.append(f'{", ".join(parts)}  ({len(inshell)}/{len(parts)} parça kabukta)')
        return '\n'.join(out)
    res = walk(css)
    return res, dropped, kept, partial


def node_key(tag, id_, cls):
    if id_:  return '#' + id_
    if cls:  return '.' + cls.split()[0]
    return tag

def split_top_level(html):
    """Bölgedeki üst düzey düğümleri (etiket, başlangıç, bitiş) döndürür."""
    out, i, n = [], 0, len(html)
    while i < n:
        m = re.compile(r'<(\w+)([^>]*)>', re.S).search(html, i)
        if not m: break
        tag = m.group(1).lower()
        attrs = m.group(2)
        if tag in ('br','img','input','meta','link','hr','source'):
            i = m.end(); continue
        # eşleşen kapanışı bul (aynı etiketten iç içe olanları sayarak)
        depth, j = 1, m.end()
        pat = re.compile(r'</?' + tag + r'\b', re.I)
        while depth > 0:
            mm = pat.search(html, j)
            if not mm: j = n; break
            if html[mm.start():mm.start()+2].lower() == '</': depth -= 1
            else: depth += 1
            j = mm.end()
        end = html.find('>', j)
        end = (end + 1) if end != -1 else n
        idm = re.search(r'\sid="([^"]*)"', attrs)
        clm = re.search(r'\sclass="([^"]*)"', attrs)
        keys = {tag}
        if idm: keys.add('#' + idm.group(1))
        if clm: keys.update('.' + c for c in clm.group(1).split())
        out.append({'tag': tag, 'key': node_key(tag, idm and idm.group(1), clm and clm.group(1)),
                    'keys': keys, 'start': m.start(), 'end': end, 'text': html[m.start():end]})
        i = end
    return out


def migrate(name, apply=False, page_key=None):
    path = name if name.endswith('.html') else name + '.html'
    if not os.path.exists(path):
        sys.exit(f'YOK: {path}')
    src = open(path, encoding='utf-8').read()
    rep = []           # rapor satırları
    kept = []          # korunan sayfa düğümleri
    key = page_key or re.sub(r'-v1$', '', name.replace('.html', ''))

    # ---------- 1 · <head>: kabuk CSS'ini RULE RULE AYIKLA ------------------
    # DİKKAT — buradaki ilk sürüm ilk <style> bloğunu topluca siliyordu ve
    # sayfanın KENDİ içerik CSS'ini de götürüyordu: eski sayfalar sayfa
    # kurallarını kabuk bloğunun İÇİNE yazmış (sss-v1'de 849 satırlık blokta
    # ikisi karışık). Ölçüm: blok silinince akordeon, sekme ve arama kutusu
    # çıplak form kontrolüne dönüyordu.
    # Doğrusu: kural kural bak. fit-shell.css AYNI SEÇİCİYİ tanımlıyorsa kural
    # kabuğa aittir → düşer. Tanımlamıyorsa sayfaya aittir → KALIR.
    shell_css = open('assets/css/fit-shell.css', encoding='utf-8').read()
    shell_sels = shell_selectors(shell_css)

    styles = [(m.start(), m.end(), m.group(1))
              for m in re.finditer(r'<style[^>]*>(.*?)</style>', src, re.S)]
    if not styles:
        sys.exit('HATA: <style> bulunamadı')

    new_styles = []            # (start, end, yeni_govde)
    for (a, b, body) in styles:
        kept_css, dropped, keptn, partial = filter_css(body, shell_sels)
        new_styles.append((a, b, kept_css))
        rep.append(f'   CSS bloğu: {dropped} kural düştü (kabukta var), {keptn} kural kaldı (sayfaya özgü)')
        for pt in partial:
            rep.append(f'   ?? KISMİ EŞLEŞME — korundu, ELLE BAK: {pt}')

    # ---------- 2 · gövde bölgelerini bul ----------------------------------
    bm = re.search(r'<body[^>]*>', src)
    mainm = re.search(r'<main class="page-main"[^>]*>', src)
    if not (bm and mainm):
        sys.exit('HATA: <body> veya <main class="page-main"> bulunamadı')
    # ---- <main>'in GERÇEK kapanışını bul --------------------------------
    # rindex('</main>') KULLANILMAZ: her 12 sayfada lg-gate'in üstündeki
    # yorum metninin içinde "Markup </main> sonrasında durur" gibi bir cümle
    # geçiyor ve rindex o YORUMUN içine düşüyor. Sonuç: bölge sınırı yanlış
    # yerden kesiliyor ve kapanmayan bir HTML yorumu kalıyordu.
    # Doğrusu: yorumları maskele, <main ...> etiketinden itibaren derinlik say.
    masked = re.sub(r'<!--.*?-->', lambda m: ' ' * len(m.group(0)), src, flags=re.S)
    depth, k = 1, mainm.end()
    while depth > 0:
        mm = re.compile(r'</?main\b', re.I).search(masked, k)
        if not mm:
            sys.exit('HATA: <main class="page-main"> kapanışı bulunamadı')
        depth += -1 if masked[mm.start():mm.start() + 2] == '</' else 1
        k = mm.end()
    last_main_end = masked.find('>', k - 1) + 1

    top_region = src[bm.end():mainm.start()]
    bottom_region = src[last_main_end:]

    # ---------- 3 · üst bölge: kabuk mu, sayfa mı --------------------------
    top_keep = []
    for nd in split_top_level(top_region):
        if nd['keys'] & SHELL_TOP_NODES:
            rep.append(f'   silindi (kabuk)   ÜST  {nd["key"]}')
        else:
            top_keep.append(nd['text'])
            rep.append(f'** KORUNDU (sayfa)  ÜST  {nd["key"]}  ← fitShellTop ALTINA taşındı')

    # ---------- 4 · alt bölge: kabuk / sayfa / script ----------------------
    bottom_keep, page_scripts = [], []
    for nd in split_top_level(bottom_region):
        if nd['tag'] == 'script':
            if 'src=' in nd['text'][:200]:
                rep.append('   silindi (kabuk)   ALT  <script src> (fit-shell.js yeniden eklenecek)')
                continue
            body = nd['text']
            hits = [k for k in SHELL_JS_MARKS if k in body]
            if len(hits) >= 3:
                rep.append(f'   silindi (kabuk)   ALT  <script> kabuk JS ({len(body)} krkt) — parmak izi: {", ".join(hits[:5])}')
            else:
                page_scripts.append(body)
                rep.append(f'** KORUNDU (sayfa)  ALT  <script> ({len(body)} krkt)' +
                           (f' — dikkat: {", ".join(hits)} geçiyor, ELLE BAK' if hits else ''))
            continue
        if nd['keys'] & SHELL_BOTTOM_NODES:
            rep.append(f'   silindi (kabuk)   ALT  {nd["key"]}')
        else:
            bottom_keep.append(nd['text'])
            rep.append(f'** KORUNDU (sayfa)  ALT  {nd["key"]}  ← fitShellBottom ÜSTÜNE taşındı')

    # ---------- 5 · yeni dosyayı kur ---------------------------------------
    head = src[:bm.start()]
    # <style> bloklarını süzülmüş hâlleriyle değiştir (sondan başa, ofset kaymasın)
    for (a, b, kept_css) in sorted(new_styles, key=lambda t: -t[0]):
        if a >= len(head):        # gövdedeki <style> varsa dokunma
            continue
        block = ('<style>\n/* SAYFAYA ÖZGÜ CSS — kabuk kuralları fit-shell.css\'e devredildi.\n'
                 '   Buradaki her kuralın seçicisi fit-shell.css\'te YOK; yani hiçbiri\n'
                 '   kabuk kopyası değil. */\n' + kept_css.strip() + '\n</style>') if kept_css.strip() else ''
        head = head[:a] + block + head[b:]
    # kabuk stil sayfası ilk <style>'ın yerine değil, HEAD'in başına link'lenir
    if 'assets/css/fit-shell.css' not in head:
        head = re.sub(r'(<link rel="stylesheet"\s*\n?\s*href="https://cdnjs)',
                      '<!-- DadaFit ortak kabuk (tek kaynak) -->\n'
                      '<link rel="stylesheet" href="assets/css/fit-shell.css" />\n\\1',
                      head, count=1)
        if 'assets/css/fit-shell.css' not in head:      # FA linki bulunamadıysa
            head = head.replace('</head>', '<link rel="stylesheet" href="assets/css/fit-shell.css" />\n</head>')
    # fit-type.css her zaman </head>'ten hemen önce kalmalı (HANDOFF §5)
    if 'fit-type.css' in head:
        head = head.replace('<link rel="stylesheet" href="assets/css/fit-type.css" />\n', '')
        head = head.replace('<link rel="stylesheet" href="assets/css/fit-type.css" />', '')
        head = re.sub(r'\s*</head>', '\n<link rel="stylesheet" href="assets/css/fit-type.css" />\n</head>', head, count=1)

    main_html = src[mainm.start():last_main_end]

    parts = [head]
    parts.append(f'<body data-brand="fit" data-fit-page="{key}">\n\n')
    parts.append('<!-- KABUK: üst katman (üst bant + header + drawer + alt bar + görüş + çerez) -->\n')
    parts.append('<div id="fitShellTop"></div>\n\n')
    if top_keep:
        parts.append('<!-- SAYFAYA ÖZGÜ (kabuk bölgesinden korundu) -->\n')
        parts.append('\n'.join(top_keep) + '\n\n')
    parts.append(main_html + '\n\n')
    if bottom_keep:
        parts.append('<!-- SAYFAYA ÖZGÜ (kabuk bölgesinden korundu) -->\n')
        parts.append('\n'.join(bottom_keep) + '\n\n')
    parts.append('<!-- KABUK: alt katman (giriş kapısı + footer + başa dön) -->\n')
    parts.append('<div id="fitShellBottom"></div>\n\n')
    parts.append('<!-- DadaFit ortak kabuk JS (tek kaynak) -->\n')
    parts.append('<script src="assets/js/fit-shell.js"></script>\n')
    for ps in page_scripts:
        parts.append(ps + '\n')
    parts.append('</body>\n</html>\n')
    out = ''.join(parts)

    # ---------- 6 · rapor ---------------------------------------------------
    print(f'\n=== {path} ===')
    print(f'  {len(src):>8} -> {len(out):>8} karakter   ({100*(len(src)-len(out))//max(len(src),1)}% küçüldü)')
    print(f'  data-fit-page="{key}"')
    print(f'  korunan sayfa düğümü: üst {len(top_keep)} · alt {len(bottom_keep)} · script {len(page_scripts)}')
    print('  --- ayrıntı ---')
    for r in rep: print('  ' + r)
    left = len(re.findall(r'dadamutfak', out, re.I))
    print(f'  --- göç sonrası kalan "DadaMutfak" geçişi: {left}  (marka dili ELLE temizlenecek)')
    print('  --- SIRADAKİ ELLE İŞLER ---')
    print('   1. Kalan <style> bloğunda fit-shell.css\'in ZATEN verdiği kuralları sil;')
    print('      yalnız sayfaya özgü kurallar kalsın (turuncu --tomato token\'ı DAHİL silinir).')
    print('   2. Marka dili: DadaMutfak -> DadaFit, "DadaMutfak Pro" -> "DadaFit Pro",')
    print('      "DadaMutfak Onaylı" -> "DadaFit Onaylı", <title>, breadcrumb.')
    print('   3. Sayfayı tarayıcıda ÖLÇ: konsol hatası, yatay taşma, kırık link.')

    if apply:
        open(path, 'w', encoding='utf-8').write(out)
        print(f'\n  YAZILDI: {path}')
    else:
        print('\n  (DRY-RUN — dosya değişmedi. Uygulamak için --apply)')
    return out


def css_from_head(name):
    """KURTARMA MODU — sayfanın DOĞRU sayfa-özgü CSS'ini git HEAD'deki
    (göç ÖNCESİ) sürümünden hesaplar ve basar.

    Neden var: aracın ilk sürümünde iki hata vardı (yorumlu @media bloklarının
    yanlış sınıflandırılması ve </main> sınırının yorum içine düşmesi). O
    sürümle göç eden sayfalarda sayfa-özgü @media blokları kayboldu. Elle
    kurtarmak yerine, düzeltilmiş süzgeç HEAD sürümüne uygulanır ve olması
    gereken CSS buradan alınır — böylece kurtarma da ölçülebilir olur.

      python3 tools/legacy-migrate.py <sayfa> --css-from-head > /tmp/dogru.css
    """
    import subprocess
    path = name if name.endswith('.html') else name + '.html'
    head = subprocess.run(['git', 'show', f'HEAD:{path}'],
                          capture_output=True, text=True).stdout
    if not head:
        sys.exit(f'HATA: git HEAD:{path} okunamadı')
    shell_sels = shell_selectors(open('assets/css/fit-shell.css', encoding='utf-8').read())
    total_d = total_k = 0
    chunks = []
    for m in re.finditer(r'<style[^>]*>(.*?)</style>', head, re.S):
        kept, d, k, partial = filter_css(m.group(1), shell_sels)
        total_d += d; total_k += k
        for pt in partial:
            sys.stderr.write(f'# ?? kısmi eşleşme (korundu, elle bak): {pt}\n')
        if kept.strip(): chunks.append(kept.strip())
    sys.stderr.write(f'# {path}: HEAD sürümünden {total_d} kabuk kuralı düştü, '
                     f'{total_k} sayfa kuralı kaldı\n')
    print('\n\n'.join(chunks))


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not args:
        sys.exit(__doc__)
    if '--css-from-head' in sys.argv:
        css_from_head(args[0]); sys.exit(0)
    pk = None
    if '--page-key' in sys.argv:
        pk = sys.argv[sys.argv.index('--page-key') + 1]
    migrate(args[0], apply='--apply' in sys.argv, page_key=pk)
