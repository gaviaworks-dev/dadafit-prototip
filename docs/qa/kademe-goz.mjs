import { chromium } from '/Users/gaviaworks/Developer/Projects/dadafit-prototip/tests/_pw.mjs';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1440,height:1000} });
const p = await ctx.newPage();
await p.goto('http://127.0.0.1:8788/rozetlerim-v1.html?auth=1', { waitUntil:'networkidle' });
await p.waitForTimeout(300);
// çerez bandını kapat
const rd = await p.$('text=Reddet'); if (rd) await rd.click();
await p.click('.fit-tab[data-tab="kademe"]');
await p.waitForTimeout(300);
await p.evaluate(() => document.getElementById('rzRank').scrollIntoView({block:'start'}));
await p.waitForTimeout(400);
await p.screenshot({ path:'/Users/gaviaworks/Developer/Projects/dadafit-prototip/docs/screenshots/kademe-goz-a.png' });
await p.evaluate(() => document.getElementById('rzLadder').scrollIntoView({block:'center'}));
await p.waitForTimeout(400);
await p.screenshot({ path:'/Users/gaviaworks/Developer/Projects/dadafit-prototip/docs/screenshots/kademe-goz-b.png' });
await b.close();
