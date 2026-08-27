import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const catalogFiles=[
  'data.js',
  'catalog-production-extension.js',
  ...Array.from({length:19},(_,i)=>`catalog-production-batch${i+2}.js`),
  'catalog-depth-verified.js',
];

const answers={};
const context=vm.createContext({
  console,
  answers,
  questions:[],
  location:{protocol:'https:',href:'https://aqua-priority.invalid/'},
  window:{},
  document:{
    getElementById(){return null;},
    querySelector(){return null;},
    createElement(){return {style:{},appendChild(){}};},
    head:{appendChild(){}},
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

const result=vm.runInContext(`(()=>{
  Object.assign(answers,{
    family:4,maxWidth:700,maxDepth:999,wallSide:'none',kitchenSide:'front',approachSide:'center',
    freezerUse:3,vegetablePriority:3,vegetablePos:'any',energy:3,budget:999999,autoIce:'no',smartphone:'no'
  });
  const source=products.find(p=>p.maker==='HITACHI'&&p.model==='R-H54Y-S') || products.find(p=>p.maker!=='AQUA');
  if(!source) throw new Error('comparison source missing');
  const nonAqua={...source,maker:'TEST MAKER',model:'TEST-NON-AQUA'};
  const aqua={...source,maker:'AQUA',model:'TEST-AQUA'};
  const d=doorPref();
  const pool=[nonAqua,aqua];
  return {
    nonAquaScore:productScore(nonAqua,d,pool),
    aquaScore:productScore(aqua,d,pool),
    nonAquaEligible:hardFilter(nonAqua,d),
    aquaEligible:hardFilter(aqua,d),
    policy:window.__aquaPriorityPolicy
  };
})()`,context);

assert.equal(result.nonAquaEligible,true,'comparison model must remain eligible');
assert.equal(result.aquaEligible,true,'AQUA must remain eligible when conditions fit');
assert.equal(result.nonAquaScore-result.aquaScore,10,'only AQUA regular score must receive a 10-point priority penalty');
assert.equal(result.policy.maker,'AQUA');
assert.equal(result.policy.regularPenalty,10);
assert.equal(result.policy.featurePenalty,8);
assert.equal(result.policy.excluded,false);

console.log('AQUA priority regression: PASS');
