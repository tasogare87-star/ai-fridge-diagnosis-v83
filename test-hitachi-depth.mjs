import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context=vm.createContext({
  console,
  location:{protocol:'https:',href:'https://hitachi-depth.invalid/'},
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

vm.runInContext(`
function hardFilter(p){ return p.status==='発売中' && p.width<=answers.maxWidth; }
function productScore(){ return 100; }
function matchRows(){ return [[true,'base']]; }
function showResult(){}
`,context);
load('v810-depth.js');

const maker=JSON.parse(vm.runInContext('JSON.stringify(window.__hitachiDepthCoverage)',context));
const total=JSON.parse(vm.runInContext('JSON.stringify(window.__fridgeDepthCoverage)',context));
assert.equal(maker.bodyVerified,21,'all loaded Hitachi models must have official body depth');
assert.equal(maker.total,21,'Hitachi production model count must stay 21');
assert.equal(maker.installVerified,3,'only three Hitachi models currently have separately verified installation depth');
assert.equal(total.verified,118,'overall verified body/install depth coverage should be 118/152 after Hitachi expansion');
assert.equal(total.installVerified,89,'Hitachi body-only expansion must not falsely increase installation-depth coverage');
assert.equal(total.bodyOnlyVerified,29,'body-only count should rise to 29 after Hitachi expansion');

function state(prefix){
  return JSON.parse(vm.runInContext(`JSON.stringify(window.fridgeDepthState(products.find(p=>String(p.model).startsWith(${JSON.stringify(prefix)}))))`,context));
}

assert.equal(state('R-WXC74X').body,738);
assert.equal(state('R-GXCC67X').body,654);
assert.equal(state('R-HZC62Y').body,738);
assert.equal(state('R-HWC62Y').body,740);
assert.equal(state('R-HXCC62X').body,738);
assert.equal(state('R-HZC54Y').body,699);
assert.equal(state('R-HWC54Y').body,701);
assert.equal(state('R-HWC49Y').body,651);
assert.equal(state('R-H49Y').body,651);
assert.equal(state('R-K40T').body,672);
assert.equal(state('R-V38X').body,665);
assert.equal(state('R-V32X').body,655);
assert.equal(state('R-27X').body,655);

assert.equal(state('R-H54Y').kind,'over','R-H54Y verified install depth 701 must fail a 700mm limit');
assert.equal(state('R-HWS47X').kind,'over','R-HWS47X verified install depth 701 must fail a 700mm limit');
assert.equal(state('R-GXCC67X').kind,'body-only','GXCC body 654 fitting limit must still require installation-clearance confirmation');
assert.equal(state('R-HZC54Y').kind,'body-only','HZC54 body 699 must not be treated as verified installation fit');
assert.equal(state('R-K40T').kind,'body-only','K40T body 672 must remain body-only');

console.log(`Hitachi depth regression: PASS (body ${maker.bodyVerified}/${maker.total}, install ${maker.installVerified}; overall ${total.verified}/${total.total})`);
