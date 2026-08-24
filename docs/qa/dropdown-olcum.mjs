import { chromium } from '../../tests/_pw.mjs';
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const b=await chromium.launch();
const pg=await (await b.newContext({viewport:{width:1440,height:1000}})).newPage();
pg.on('pageerror',e=>console.log('!!',e.message));
await pg.goto(''+BASE+'/fit-planim-v1.html',{waitUntil:'load'});
await pg.waitForTimeout(600);
await pg.evaluate(()=>{ try{localStorage.setItem('dm_fit_login','1')}catch(e){} });
await pg.reload({waitUntil:'load'}); await pg.waitForTimeout(700);
const r=await pg.evaluate(()=>{
  const it=document.querySelector('.acct-item.acct-wrap');
  if(it) it.classList.add('open');
  const menu=it?it.querySelector('.acct-menu')||it.lastElementChild:null;
  if(!menu) return {menuYok:true, acct:document.querySelectorAll('.acct-item').length};
  const R=e=>e.getBoundingClientRect();
  const bag=[...menu.querySelectorAll('a[href]')];
  return {
    baslik:menu.querySelectorAll('.acct-grup').length,
    ayrac:menu.querySelectorAll('.acct-div').length,
    baglanti:bag.length,
    aciklama:menu.querySelectorAll('small').length,
    kirikHedef:bag.filter(a=>!a.getAttribute('href')||a.getAttribute('href')==='#').length,
    menuYuksekligi:Math.round(R(menu).height),
    ikiSatirli:bag.filter(a=>{const s=a.querySelector('span');return s&&R(s).height>26;}).length,
    etiketler:bag.map(a=>a.textContent.replace(/\s+/g,' ').trim()).slice(0,14)
  };
});
console.log(JSON.stringify(r,null,1));
await b.close();
