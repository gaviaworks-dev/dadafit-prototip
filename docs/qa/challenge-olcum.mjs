import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';
const B='http://127.0.0.1:8788/';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1440,height:1200}});
const pg=await ctx.newPage();
const hata=[]; pg.on('console',m=>{if(m.type()==='error')hata.push(m.text());});

async function git(u){ await pg.goto(B+u+(u.includes('?')?'&':'?')+'auth=1'); await pg.waitForTimeout(500); }

const SAYFA=['challenge-merkezi-v1.html','challenge-v1.html','challengelarim-v1.html'];
for(const s of SAYFA){
  await git(s);
  const r=await pg.evaluate(()=>({
    motor: !!window.FIT_CHALLENGE,
    rozet: !!window.FIT_ROZET,
    kart: document.querySelectorAll('.cc-card').length,
    katilDugme: Array.from(document.querySelectorAll('button')).filter(x=>/kat[ıi]l/i.test(x.textContent)).length,
    eskiSema: /state\.challenge/.test(document.documentElement.innerHTML),
    tasma: document.documentElement.scrollWidth>document.documentElement.clientWidth,
    sw: document.documentElement.scrollWidth
  }));
  console.log(s, JSON.stringify(r));
}

// motor yüzeyi
await git('challengelarim-v1.html');
const api=await pg.evaluate(()=>{
  const C=window.FIT_CHALLENGE;
  return { yuzey:Object.keys(C), katalog:C.KATALOG.length,
    tipler:C.KATALOG.map(k=>k.tip), durumlar:C.KATALOG.map(k=>k.durum) };
});
console.log('MOTOR', JSON.stringify(api));

// merkezdeki sabit kart verisi ile katalog çelişkisi
await git('challenge-merkezi-v1.html');
const celiski=await pg.evaluate(()=>{
  const C=window.FIT_CHALLENGE;
  return Array.from(document.querySelectorAll('#cmGrid .cc-card')).map(c=>{
    const slug=(c.getAttribute('href')||'').split('slug=')[1]||'';
    const k=C.bul(slug);
    return {slug, htmlDurum:c.getAttribute('data-durum'), katalogDurum:k?k.durum:'YOK',
            htmlTip:c.getAttribute('data-tip'), katalogTip:k?k.tip:'YOK'};
  });
});
console.log('CELISKI', JSON.stringify(celiski,null,1));
console.log('KONSOL HATA', hata.length, hata.slice(0,5));
await b.close();
