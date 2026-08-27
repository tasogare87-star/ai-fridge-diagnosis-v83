import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const catalogFiles=[
  'data.js',
  'catalog-production-extension.js',
  ...Array.from({length:19},(_,i)=>`catalog-production-batch${i+2}.js`),
  'catalog-depth-verified.js',
  'catalog-depth-toshiba.js',
  'catalog-depth-hitachi.js',
  'catalog-depth-aqua.js',
  'catalog-depth-mitsubishi-completion.js',
];

const answers={};
const context=vm.createContext({
  console,
  answers,
  questions:[],
  location:{protocol:'https:',href:'https://ranking-audit.invalid/'},
  window:{},
  document:{
    getElementById(){return null;},
    querySelector(){return null;},
    createElement(){return {style:{},appendChild(){},classList:{contains(){return false;}}};},
    head:{appendChild(){}},
    title:''
  },
  MutationObserver:class{observe(){} disconnect(){}},
});

function load(file){
  vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
}
for(const file of catalogFiles) load(file);

const logicSource=fs.readFileSync('logic.js','utf8');
const uiBoundary=logicSource.indexOf('\nfunction refreshShareUrlDisplay');
assert.ok(uiBoundary>0,'logic.js pure-logic boundary must exist');
vm.runInContext(logicSource.slice(0,uiBoundary),context,{filename:'logic.js'});
load('v89-fairness.js');
load('v810-depth.js');
load('v811-aqua-priority.js');

const excludedModels=new Set([
  'NR-FVF45S3','GR-Y550FK','GR-Y460FK','GR-Y550FZ','GR-Y510FZ','GR-Y460FZ'
]);

const defaults={
  family:2,
  maxWidth:999,
  maxDepth:999,
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

const scenarios=[
  {name:'1人・省スペース',answers:{family:1,maxWidth:500,maxDepth:650,budget:120000}},
  {name:'2人・幅60cm・冷凍多め',answers:{family:2,maxWidth:600,maxDepth:700,budget:160000,freezerUse:5}},
  {name:'3人・自動製氷必須',answers:{family:3,maxWidth:650,maxDepth:700,budget:220000,autoIce:'must'}},
  {name:'3人・真ん中野菜室重視',answers:{family:3,maxWidth:650,maxDepth:720,budget:260000,vegetablePriority:5,vegetablePos:'middle'}},
  {name:'4人・幅65cm・大容量',answers:{family:4,maxWidth:650,maxDepth:750,budget:300000,freezerUse:4}},
  {name:'4人・スマホ必須',answers:{family:4,maxWidth:700,maxDepth:750,budget:360000,smartphone:'must'}},
  {name:'2人・奥行65cm制約',answers:{family:2,maxWidth:650,maxDepth:650,budget:200000}},
  {name:'3人・奥行未確定',answers:{family:3,maxWidth:650,maxDepth:999,budget:240000}},
];

function seriesKey(p){ return [p.maker,p.capacity,p.width,p.doors].join('|'); }
function depthState(p){ return vm.runInContext(`window.fridgeDepthState(products.find(x=>x.model===${JSON.stringify(p.model)}))`,context); }

function runScenario(scenario){
  Object.assign(answers,defaults,scenario.answers);
  const profile=vm.runInContext('window.capacityProfile(answers.family)',context);
  const candidates=vm.runInContext('getCandidates(doorPref())',context);
  const picks=[...(candidates.regular||[]),...(candidates.featurePick?[candidates.featurePick]:[])];

  assert.ok(candidates.regular.length<=3,`${scenario.name}: regular candidates exceed 3`);
  assert.ok(picks.length<=4,`${scenario.name}: total candidates exceed 4`);
  assert.ok(picks.length>0,`${scenario.name}: expected at least one candidate`);

  const regularSeries=candidates.regular.map(seriesKey);
  assert.equal(new Set(regularSeries).size,regularSeries.length,`${scenario.name}: duplicate regular series`);

  for(const p of picks){
    assert.ok(!excludedModels.has(p.model),`${scenario.name}: excluded model ${p.model} resurfaced`);
    assert.equal(vm.runInContext(`hardFilter(products.find(x=>x.model===${JSON.stringify(p.model)}),doorPref())`,context),true,
      `${scenario.name}: ${p.model} violates hardFilter`);
    assert.ok(p.capacity>=profile.hardMin&&p.capacity<=profile.hardMax,
      `${scenario.name}: ${p.model} capacity ${p.capacity} outside ${profile.hardMin}-${profile.hardMax}`);
    assert.ok(p.width<=answers.maxWidth,`${scenario.name}: ${p.model} width ${p.width} exceeds ${answers.maxWidth}`);
    if(answers.autoIce==='must') assert.equal(p.autoIce,true,`${scenario.name}: ${p.model} violates autoIce must`);
    if(answers.smartphone==='must') assert.equal(p.smartphone,true,`${scenario.name}: ${p.model} violates smartphone must`);

    const ds=depthState(p);
    if(answers.maxDepth!==999){
      assert.notEqual(ds.kind,'over',`${scenario.name}: ${p.model} exceeds maxDepth ${answers.maxDepth}`);
    }
  }

  if(answers.budget!==999999){
    for(const p of candidates.regular){
      assert.ok(p.price<=answers.budget+40000,
        `${scenario.name}: ${p.model} regular price ${p.price} exceeds budget+40k`);
    }
  }

  const eligibleInfo=vm.runInContext(`(()=>{
    const d=doorPref(); const profile=window.capacityProfile(answers.family);
    const all=products.filter(p=>hardFilter(p,d))
      .filter(p=>p.capacity>=profile.hardMin&&p.capacity<=profile.hardMax)
      .filter(p=>answers.budget===999999||p.price<=Number(answers.budget)+40000);
    return {nonAqua:all.filter(p=>p.maker!=='AQUA').length,aqua:all.filter(p=>p.maker==='AQUA').length,total:all.length};
  })()`,context);

  // AQUA is intentionally lowered, not excluded. Brand composition is therefore audited
  // as output rather than hard-coded; the dedicated AQUA regression locks the -10/-8 policy.
  const aquaRegular=candidates.regular.filter(p=>p.maker==='AQUA').length;

  return {
    name:scenario.name,
    profile:`${profile.hardMin}-${profile.hardMax}L`,
    regular:candidates.regular.map(p=>`${p.maker} ${p.model} (${p.score})`),
    feature:candidates.featurePick?`${candidates.featurePick.maker} ${candidates.featurePick.model}`:'-',
    eligible:eligibleInfo,
    aquaRegular,
  };
}

const reports=scenarios.map(runScenario);
console.log('Ranking scenario audit: PASS');
for(const r of reports){
  console.log(`\n[${r.name}] capacity=${r.profile} eligible=${r.eligible.total} nonAQUA=${r.eligible.nonAqua} AQUA=${r.eligible.aqua} AQUA-in-regular=${r.aquaRegular}`);
  r.regular.forEach((x,i)=>console.log(`  ${i+1}. ${x}`));
  console.log(`  feature: ${r.feature}`);
}
