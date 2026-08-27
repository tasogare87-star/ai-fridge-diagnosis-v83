import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context=vm.createContext({
  console,
  location:{protocol:'https:',href:'https://aqua-depth.invalid/'},
  window:{},
  answers:{maxWidth:999,maxDepth:700},
  questions:[{key:'maxWidth'}],
  document:{
    head:{appendChild(){}},
    getElementById(){return null;},
    querySelector(){return null;},
    createElement(){return {id:'',className:'',innerHTML:'',textContent:'',classList:{contains(){return false;}}};}
  }
});

function load(file){vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});}
const catalogFiles=['data.js','catalog-production-extension.js',...Array.from({length:19},(_,i)=>`catalog-production-batch${i+2}.js`)];
for(const file of catalogFiles) load(file);
load('catalog-depth-verified.js');
load('catalog-depth-toshiba.js');
load('catalog-depth-hitachi.js');
load('catalog-depth-aqua.js');

vm.runInContext(`
function hardFilter(p){ return p.status==='発売中' && p.width<=answers.maxWidth; }
function productScore(){ return 100; }
function matchRows(){ return [[true,'base']]; }
function showResult(){}
`,context);
load('v810-depth.js');

const aqua=JSON.parse(vm.runInContext('JSON.stringify(window.__aquaDepthCoverage)',context));
const total=JSON.parse(vm.runInContext('JSON.stringify(window.__fridgeDepthCoverage)',context));
assert.equal(aqua.installVerified,27,'all 27 AQUA standard diagnosis models must have official installation depth');
assert.equal(aqua.total,27,'AQUA production pool count must stay 27');
assert.equal(total.verified,143,'overall depth coverage must reach 143/152 after AQUA expansion');
assert.equal(total.installVerified,114,'installation-depth coverage must reach 114/152 after AQUA expansion');
assert.equal(total.bodyOnlyVerified,29,'body-only count must remain 29 after AQUA exact installation-depth coverage');

function state(prefix){
  return JSON.parse(vm.runInContext(`JSON.stringify(window.fridgeDepthState(products.find(p=>String(p.model).startsWith(${JSON.stringify(prefix)}))))`,context));
}

assert.equal(state('AQR-TZA52A').install,635);
assert.equal(state('AQR-TZ52A').install,635);
assert.equal(state('AQR-TZ42A').install,635);
assert.equal(state('AQR-TXA50A').install,670);
assert.equal(state('AQR-TX51A').install,670);
assert.equal(state('AQR-36A').install,702.5);
assert.equal(state('AQR-S26A').install,701);
assert.equal(state('AQR-26A').install,701);
assert.equal(state('AQR-23A').install,601);
assert.equal(state('AQR-SBS48A').install,697);
assert.equal(state('AQR-VZA45A').install,720);
assert.equal(state('AQR-V46A').install,720);
assert.equal(state('AQR-V43A').install,720);
assert.equal(state('AQR-S40A').install,600);
assert.equal(state('AQR-S31A').install,600);
assert.equal(state('AQR-31A').install,600);
assert.equal(state('AQR-S36A').install,702.5);
assert.equal(state('AQR-14A').install,568);
assert.equal(state('AQR-17A').install,601);
assert.equal(state('AQR-20A').install,601);
assert.equal(state('AQR-16A').install,600);

assert.equal(state('AQR-TZ52A').kind,'verified-fit','635mm thin-depth TZ52A must fit 700mm');
assert.equal(state('AQR-SBS48A').kind,'verified-fit','697mm SBS48A must fit 700mm');
assert.equal(state('AQR-36A').kind,'over','702.5mm AQR-36A must fail 700mm');
assert.equal(state('AQR-S26A').kind,'over','701mm AQR-S26A must fail 700mm');
assert.equal(state('AQR-V46A').kind,'over','720mm V46A must fail 700mm');
assert.equal(state('AQR-S40A').kind,'verified-fit','600mm S40A must fit 700mm');

const left36=state('AQR-36AL');
assert.equal(left36.install,702.5,'left AQR-36AL variant must inherit the same official cabinet installation depth');
const leftV46=state('AQR-V46AL');
assert.equal(leftV46.install,720,'left AQR-V46AL variant must inherit the same official cabinet installation depth');

console.log(`AQUA depth regression: PASS (install ${aqua.installVerified}/${aqua.total}; overall ${total.verified}/${total.total}, install ${total.installVerified})`);
