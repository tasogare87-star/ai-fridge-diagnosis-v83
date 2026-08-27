import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context=vm.createContext({console,window:{}});
function load(file){vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});}

const catalogFiles=[
  'data.js',
  'catalog-production-extension.js',
  ...Array.from({length:19},(_,i)=>`catalog-production-batch${i+2}.js`),
];
for(const file of catalogFiles) load(file);
for(const file of [
  'catalog-depth-verified.js',
  'catalog-depth-toshiba.js',
  'catalog-depth-hitachi.js',
  'catalog-depth-aqua.js',
  'catalog-depth-mitsubishi-completion.js',
]) load(file);

const totals=JSON.parse(vm.runInContext(`JSON.stringify({
  total:products.length,
  verified:products.filter(p=>Number.isFinite(p.depth)||Number.isFinite(p.installDepth)).length,
  install:products.filter(p=>Number.isFinite(p.installDepth)).length,
  bodyOnly:products.filter(p=>Number.isFinite(p.depth)&&!Number.isFinite(p.installDepth)).length,
  missing:products.filter(p=>!Number.isFinite(p.depth)&&!Number.isFinite(p.installDepth)).map(p=>p.model),
  missingSource:products.filter(p=>(Number.isFinite(p.depth)||Number.isFinite(p.installDepth))&&!p.depthSource).map(p=>p.model),
  missingVerifiedAt:products.filter(p=>(Number.isFinite(p.depth)||Number.isFinite(p.installDepth))&&!p.depthVerifiedAt).map(p=>p.model)
})`,context));

assert.equal(totals.total,152,'production catalog count must remain 152');
assert.equal(totals.verified,152,`all 152 products must have official depth evidence; missing: ${totals.missing.join(', ')}`);
assert.equal(totals.install,123,'123 products should have manufacturer-confirmed installation depth');
assert.equal(totals.bodyOnly,29,'29 products should remain body-depth-only caution cases');
assert.deepEqual(totals.missing,[],'no production model may remain depth-unknown');
assert.deepEqual(totals.missingSource,[],'every depth-verified product must retain its manufacturer source');
assert.deepEqual(totals.missingVerifiedAt,[],'every depth-verified product must retain verification date');

const m=JSON.parse(vm.runInContext('JSON.stringify(window.__mitsubishiDepthCoverage)',context));
assert.equal(m.total,27,'Mitsubishi production catalog must remain 27 models');
assert.equal(m.verified,27,'Mitsubishi depth coverage must be 27/27');
assert.equal(m.installVerified,16,'Mitsubishi installation-depth coverage must be 16/27');

function state(prefix){
  return JSON.parse(vm.runInContext(`JSON.stringify((()=>{const p=products.find(x=>String(x.model).startsWith(${JSON.stringify(prefix)}));return p?{model:p.model,depth:p.depth,installDepth:p.installDepth}:null})())`,context));
}

assert.equal(state('MR-WXD70N').installDepth,748,'MR-WXD70N installation depth must be 748mm');
assert.equal(state('MR-MZ60N').installDepth,748,'MR-MZ60N installation depth must be 748mm');
assert.equal(state('MR-JM54N').installDepth,709,'MR-JM54N installation depth must be 709mm');
assert.equal(state('MR-WZ50N').installDepth,660,'MR-WZ50N installation depth must be 660mm');
assert.equal(state('MR-WXD47LN').installDepth,709,'MR-WXD47LN installation depth must be 709mm');
assert.equal(state('MR-N40M').installDepth,703,'MR-N40M installation depth must be 703mm');

const md45Models=JSON.parse(vm.runInContext(`JSON.stringify(products.filter(p=>String(p.model).startsWith('MR-MD45N')).map(p=>({model:p.model,installDepth:p.installDepth})))`,context));
assert.ok(md45Models.length>=2,'MR-MD45N right/left diagnostic variants must both exist');
assert.ok(md45Models.every(p=>p.installDepth===709),'MR-MD45N right/left variants must both inherit 709mm installation depth');

console.log(`Depth catalog completion: PASS (verified ${totals.verified}/${totals.total}, install ${totals.install}, body-only ${totals.bodyOnly}; Mitsubishi ${m.verified}/${m.total})`);
