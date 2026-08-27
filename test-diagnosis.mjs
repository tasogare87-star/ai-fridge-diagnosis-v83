import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const catalogFiles=[
  'data.js',
  'catalog-production-extension.js',
  ...Array.from({length:19},(_,i)=>`catalog-production-batch${i+2}.js`),
];

const answers={};
const context=vm.createContext({
  console,
  answers,
  questions:[],
  location:{protocol:'https:',href:'https://diagnosis-regression.invalid/'},
  window:{},
  document:{getElementById(){return null;}},
  MutationObserver:class{observe(){} disconnect(){}},
});

function load(file){
  vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
}

for(const file of catalogFiles) load(file);

// logic.js also contains browser event wiring at the bottom. Regression tests only need
// the pure diagnosis functions, so stop before the share/UI initialization block.
const logicSource=fs.readFileSync('logic.js','utf8');
const uiBoundary=logicSource.indexOf('\nfunction refreshShareUrlDisplay');
assert.ok(uiBoundary>0,'logic.js pure-logic boundary must exist');
vm.runInContext(logicSource.slice(0,uiBoundary),context,{filename:'logic.js'});
load('v89-fairness.js');

const defaults={
  family:2,
  maxWidth:999,
  wallSide:'none',
  kitchenSide:'center',
  approachSide:'center',
  freezerUse:3,
  vegetablePriority:3,
  vegetablePos:'any',
  energy:3,
  budget:999999,
  autoIce:'no',
  smartphone:'no',
};

function run(overrides={}){
  Object.assign(answers,defaults,overrides);
  const door=vm.runInContext('doorPref()',context);
  const candidates=vm.runInContext('getCandidates(doorPref())',context);
  const profile=vm.runInContext('window.capacityProfile(answers.family)',context);
  return {door,candidates,profile};
}

function allPicks(result){
  return [...result.candidates.regular,...(result.candidates.featurePick?[result.candidates.featurePick]:[])];
}

function assertCommon(result,{maxWidth,budget=999999,autoIce='no',smartphone='no'}){
  assert.ok(result.candidates.regular.length<=3,'regular candidates must never exceed 3');
  const picks=allPicks(result);
  for(const p of picks){
    assert.ok(p.width<=maxWidth,`${p.model} exceeds max width ${maxWidth}`);
    assert.ok(p.capacity>=result.profile.hardMin && p.capacity<=result.profile.hardMax,
      `${p.model} capacity ${p.capacity} outside hard profile ${result.profile.hardMin}-${result.profile.hardMax}`);
    if(autoIce==='must') assert.equal(p.autoIce,true,`${p.model} violates auto-ice must`);
    if(smartphone==='must') assert.equal(p.smartphone,true,`${p.model} violates smartphone must`);
  }
  if(budget!==999999){
    for(const p of result.candidates.regular){
      assert.ok(p.price<=budget+40000,`${p.model} exceeds regular budget cap`);
    }
  }

  const regularSeries=result.candidates.regular.map(p=>`${p.maker}|${p.capacity}|${p.width}|${p.doors}`);
  assert.equal(new Set(regularSeries).size,regularSeries.length,'regular candidates must not repeat same series key');
  if(result.candidates.featurePick){
    const fp=result.candidates.featurePick;
    const key=`${fp.maker}|${fp.capacity}|${fp.width}|${fp.doors}`;
    assert.ok(!regularSeries.includes(key),'feature pick must not duplicate a regular series');
  }
}

// 1-person: do not inflate into large family models.
{
  const r=run({family:1,maxWidth:500,budget:120000});
  assert.ok(r.candidates.regular.length>0,'1-person scenario should return candidates');
  assert.equal(r.profile.hardMin,100);
  assert.equal(r.profile.hardMax,299);
  assertCommon(r,{maxWidth:500,budget:120000});
}

// 2-person: finite budget must cap regular recommendations at budget + 40,000 yen.
{
  const r=run({family:2,maxWidth:600,budget:100000});
  assert.ok(r.candidates.regular.length>0,'2-person budget scenario should return candidates');
  assertCommon(r,{maxWidth:600,budget:100000});
}

// 3-person: auto-ice hard requirement must be honored without fallback leakage.
{
  const r=run({family:3,maxWidth:650,budget:220000,autoIce:'must'});
  assert.ok(allPicks(r).length>0,'auto-ice must scenario should return candidates');
  assertCommon(r,{maxWidth:650,budget:220000,autoIce:'must'});
}

// Smartphone hard requirement must only return confirmed smartphone-capable products.
{
  const r=run({family:3,maxWidth:700,budget:999999,smartphone:'must'});
  assert.ok(allPicks(r).length>0,'smartphone must scenario should return candidates');
  assertCommon(r,{maxWidth:700,smartphone:'must'});
}

// 4-person: capacity hard floor prevents undersized recommendations.
{
  const r=run({family:4,maxWidth:700,budget:300000,freezerUse:4});
  assert.ok(r.candidates.regular.length>0,'4-person scenario should return candidates');
  assert.equal(r.profile.hardMin,500);
  assertCommon(r,{maxWidth:700,budget:300000});
}

// Wall-side rule: about-100-degree assumption must not hard-block either single-door direction.
{
  const left=run({wallSide:'left',kitchenSide:'left',maxWidth:650});
  const right=run({wallSide:'right',kitchenSide:'right',maxWidth:650});
  assert.equal(left.door.hardBlock.length,0,'left wall must not hard-block door types');
  assert.equal(right.door.hardBlock.length,0,'right wall must not hard-block door types');
}

// Retail sell-through model must actually be eligible after batch 18.
{
  Object.assign(answers,defaults,{family:4,maxWidth:700,budget:999999});
  const eligible=vm.runInContext("hardFilter(products.find(p=>p.model==='GR-Y600FK-EW'),doorPref())",context);
  assert.equal(eligible,true,'GR-Y600FK-EW must pass hardFilter while Yodobashi sell-through is active');
}

// Removed SHARP legacy model must never remain in the loaded product pool.
{
  const exists=vm.runInContext("products.some(p=>p.model==='SJ-X373P-N')",context);
  assert.equal(exists,false,'SJ-X373P-N must remain removed');
}

// Hitachi completion model must be loaded and eligible for a matching large-family scenario.
{
  const exists=vm.runInContext("products.some(p=>p.model==='R-H54Y-S')",context);
  assert.equal(exists,true,'R-H54Y-S must be loaded after batch 20');
  Object.assign(answers,defaults,{family:4,maxWidth:650,budget:260000,autoIce:'must'});
  const eligible=vm.runInContext("hardFilter(products.find(p=>p.model==='R-H54Y-S'),doorPref())",context);
  assert.equal(eligible,true,'R-H54Y-S must pass hardFilter for compatible conditions');
}

console.log('Diagnosis regression: PASS');
