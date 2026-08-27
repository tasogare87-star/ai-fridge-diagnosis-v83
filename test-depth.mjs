import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context=vm.createContext({
  console,
  location:{protocol:'https:',href:'https://depth-regression.invalid/'},
  window:{},
  answers:{maxWidth:999,maxDepth:999},
  document:{
    head:{appendChild(){}},
    getElementById(){return null;},
    querySelector(){return null;},
    createElement(){return {id:'',className:'',innerHTML:'',textContent:'',classList:{contains(){return false;}}};}
  }
});

function load(file){
  vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
}

const catalogFiles=[
  'data.js',
  'catalog-production-extension.js',
  ...Array.from({length:19},(_,i)=>`catalog-production-batch${i+2}.js`),
];
for(const file of catalogFiles) load(file);
load('catalog-depth-verified.js');

vm.runInContext(`
function hardFilter(p){ return p.status==='発売中' && p.width<=answers.maxWidth; }
function productScore(){ return 100; }
function matchRows(){ return [[true,'base']]; }
function showResult(){}
`,context);

load('v810-depth.js');

const depthQuestionIndex=vm.runInContext("questions.findIndex(q=>q.key==='maxDepth')",context);
assert.equal(depthQuestionIndex,1,'depth question must follow width question');

const depthQuestion=JSON.parse(vm.runInContext("JSON.stringify(questions.find(q=>q.key==='maxDepth'))",context));
assert.equal(depthQuestion.options.at(-1)[1],999,'depth question must support unknown');

const coverage=JSON.parse(vm.runInContext('JSON.stringify(window.__fridgeDepthCoverage)',context));
assert.ok(coverage.verified>=50,`verified depth coverage should include Panasonic + Mitsubishi expansion; got ${coverage.verified}`);
assert.ok(coverage.installVerified>=35,'installation-depth verified coverage should expand materially');
assert.ok(coverage.bodyOnlyVerified>=5,'body-depth-only verified models should be tracked separately');

vm.runInContext('answers.maxDepth=650',context);
assert.equal(vm.runInContext("hardFilter(products.find(p=>p.model==='MR-MZ49N-H'),{})",context),false,'MR-MZ49N install depth 660 must fail a 650mm limit');
assert.equal(vm.runInContext("hardFilter(products.find(p=>p.model==='SJ-TD18R-W'),{})",context),true,'SJ-TD18R install depth 646 must fit a 650mm limit');
assert.equal(vm.runInContext("hardFilter(products.find(p=>p.model==='AQR-V43A(S)'),{})",context),false,'AQR-V43A install depth 720 must fail a 650mm limit');

vm.runInContext('answers.maxDepth=700',context);
assert.equal(vm.runInContext("hardFilter(products.find(p=>p.model==='NR-E47BR3-C'),{})",context),true,'NR-E47BR3 install depth 699 must fit a 700mm limit');
assert.equal(vm.runInContext("hardFilter(products.find(p=>p.model==='R-HWS47X N'),{})",context),false,'R-HWS47X minimum install depth 701 must fail a 700mm limit');

const bodyOnlyState=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>p.model==='GR-Y510FK(EW)')))",context));
assert.equal(bodyOnlyState.kind,'body-only','body-depth-only models must remain a caution state, not verified-fit');

// Mitsubishi expansion.
const wz61Model=vm.runInContext("products.find(p=>String(p.model).startsWith('MR-WZ61N'))?.model || null",context);
assert.ok(wz61Model,'MR-WZ61N must exist in the production catalog');
const wz61State=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>String(p.model).startsWith('MR-WZ61N'))))",context));
assert.equal(wz61State.install,748,'MR-WZ61N official installation depth must be 748mm');
assert.equal(wz61State.kind,'over','MR-WZ61N must fail a 700mm depth limit');

const cx37=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>String(p.model).startsWith('MR-CX37M'))))",context));
assert.equal(cx37.install,660,'MR-CX37M official installation depth must be 660mm');
assert.equal(cx37.kind,'verified-fit','MR-CX37M must fit a 700mm depth limit');

const mz54=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>String(p.model).startsWith('MR-MZ54N'))))",context));
assert.equal(mz54.body,699,'MR-MZ54N official body depth must be 699mm');
assert.equal(mz54.kind,'body-only','MR-MZ54N body-only evidence must not be promoted to verified installation fit');

// Panasonic expansion: test several materially different installation depths.
const pF65=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>String(p.model).startsWith('NR-F65WX3'))))",context));
assert.equal(pF65.install,745,'NR-F65WX3 installation depth must be 745mm');
assert.equal(pF65.kind,'over','NR-F65WX3 must fail a 700mm depth limit');

const pE45=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>String(p.model).startsWith('NR-E45RY3'))))",context));
assert.equal(pE45.install,648,'NR-E45RY3 installation depth must be 648mm');
assert.equal(pE45.kind,'verified-fit','NR-E45RY3 must fit a 700mm depth limit');

const pC33=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>String(p.model).startsWith('NR-C33JS2'))))",context));
assert.equal(pC33.install,600,'NR-C33JS2 installation depth must be 600mm');

const pB18=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>String(p.model).startsWith('NR-B18C3'))))",context));
assert.equal(pB18.body,595,'NR-B18C3 body depth must be 595mm');
assert.equal(pB18.install,645,'NR-B18C3 installation depth must include 50mm rear clearance and equal 645mm');

vm.runInContext("products.push({maker:'TEST',model:'DEPTH-UNKNOWN',status:'発売中',width:600})",context);
const unknownState=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>p.model==='DEPTH-UNKNOWN')))",context));
assert.equal(unknownState.kind,'unknown','unverified depth must remain unknown');
assert.equal(vm.runInContext("hardFilter(products.find(p=>p.model==='DEPTH-UNKNOWN'),{})",context),true,'unknown depth must not be falsely rejected');

const rowText=vm.runInContext("matchRows(products.find(p=>p.model==='R-HWS47X N'),{})[1][1]",context);
assert.match(rowText,/701mm/,'result row must surface the verified installation depth');

console.log(`Depth installation regression: PASS (verified ${coverage.verified}/${coverage.total}, install ${coverage.installVerified}, body-only ${coverage.bodyOnlyVerified})`);
