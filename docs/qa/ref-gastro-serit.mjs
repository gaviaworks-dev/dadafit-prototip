import { chromium } from '../../tests/_pw.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const b=await chromium.launch();
const pg=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
pg.on('pageerror',()=>{});
await pg.goto('https://dadagastro.com/',{waitUntil:'domcontentloaded',timeout:30000});
await pg.waitForTimeout(2000);
const r=await pg.evaluate(()=>{
  const out={dugme:null, serit:[]};
  for(const e of document.querySelectorAll('*')){
    const cs=getComputedStyle(e); const R=e.getBoundingClientRect();
    if(R.width<1||R.height<1) continue;
    const t=(e.textContent||'').replace(/\s+/g,' ').trim();
    // Görüş Bildir düğmesi
    if(/^görüş bildir$/i.test(t) && e.children.length<=2 && !out.dugme){
      out.dugme={tag:e.tagName,sinif:(e.className||'').toString().slice(0,40),
        w:Math.round(R.width),h:Math.round(R.height),
        pos:cs.position,zemin:cs.backgroundColor,renk:cs.color,
        radius:cs.borderRadius,punto:cs.fontSize,agirlik:cs.fontWeight,
        harf:cs.letterSpacing,buyuk:cs.textTransform,dolgu:cs.padding,
        yon:cs.writingMode,tr:cs.transform.slice(0,40),golge:cs.boxShadow.slice(0,44),
        sag:Math.round(innerWidth-R.right),ust:Math.round(R.top),z:cs.zIndex};
    }
    // sağ kenardaki tam boy dikey şerit
    if(cs.position==='fixed' && R.width<=26 && R.height>innerHeight*0.6 && innerWidth-R.right<6){
      out.serit.push({tag:e.tagName,sinif:(e.className||'').toString().slice(0,40),
        w:Math.round(R.width),h:Math.round(R.height),zemin:cs.backgroundColor,
        sag:Math.round(innerWidth-R.right),ust:Math.round(R.top),z:cs.zIndex,radius:cs.borderRadius});
    }
  }
  return out;
});
console.log(JSON.stringify(r,null,1));
await b.close();
