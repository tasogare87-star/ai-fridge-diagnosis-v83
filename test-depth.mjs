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

load('data.js');
load('catalog-production-batch20.js');
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
assert.equal(coverage.verified,12,'initial verified depth metadata count');

vm.runInContext('answers.maxDepth=650',context);
assert.equal(vm.runInContext("hardFilter(products.find(p=>p.model==='MR-MZ49N-H'),{})",context),false,'MR-MZ49N install depth 660 must fail a 650mm limit');
assert.equal(vm.runInContext("hardFilter(products.find(p=>p.model==='SJ-TD18R-W'),{})",context),true,'SJ-TD18R install depth 646 must fit a 650mm limit');
assert.equal(vm.runInContext("hardFilter(products.find(p=>p.model==='AQR-V43A(S)'),{})",context),false,'AQR-V43A install depth 720 must fail a 650mm limit');

vm.runInContext('answers.maxDepth=700',context);
assert.equal(vm.runInContext("hardFilter(products.find(p=>p.model==='NR-E47BR3-C'),{})",context),true,'NR-E47BR3 install depth 699 must fit a 700mm limit');
assert.equal(vm.runInContext("hardFilter(products.find(p=>p.model==='R-HWS47X N'),{})",context),false,'R-HWS47X minimum install depth 701 must fail a 700mm limit');

const bodyOnlyState=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>p.model==='GR-Y510FK(EW)')))",context));
assert.equal(bodyOnlyState.kind,'body-only','body-depth-only models must remain a caution state, not verified-fit');

vm.runInContext("products.push({maker:'TEST',model:'DEPTH-UNKNOWN',status:'発売中',width:600})",context);
const unknownState=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>p.model==='DEPTH-UNKNOWN')))",context));
assert.equal(unknownState.kind,'unknown','unverified depth must remain unknown');
assert.equal(vm.runInContext("hardFilter(products.find(p=>p.model==='DEPTH-UNKNOWN'),{})",context),true,'unknown depth must not be falsely rejected');

const rowText=vm.runInContext("matchRows(products.find(p=>p.model==='R-HWS47X N'),{})[1][1]",context);
assert.match(rowText,/701mm/,'result row must surface the verified installation depth');

console.log('Depth installation regression: PASS');
