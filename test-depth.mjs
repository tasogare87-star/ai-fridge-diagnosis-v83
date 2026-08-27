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
load('catalog-depth-toshiba.js');

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
const toshibaCoverage=JSON.parse(vm.runInContext('JSON.stringify(window.__toshibaDepthCoverage)',context));
assert.ok(coverage.verified>=100,`verified depth coverage should reach at least 100/152; got ${coverage.verified}`);
assert.ok(coverage.installVerified>=89,'installation-depth verified coverage should include all loaded Toshiba models');
assert.ok(coverage.bodyOnlyVerified>=10,'body-depth-only verified models should remain tracked separately');
assert.equal(toshibaCoverage.verified,32,'all 32 loaded Toshiba models must have official installation depth');
assert.equal(toshibaCoverage.total,32,'Toshiba production pool count must remain 32');

vm.runInContext('answers.maxDepth=650',context);
assert.equal(vm.runInContext("hardFilter(products.find(p=>p.model==='MR-MZ49N-H'),{})",context),false,'MR-MZ49N install depth 660 must fail a 650mm limit');
assert.equal(vm.runInContext("hardFilter(products.find(p=>p.model==='SJ-TD18R-W'),{})",context),true,'SJ-TD18R install depth 646 must fit a 650mm limit');
assert.equal(vm.runInContext("hardFilter(products.find(p=>p.model==='AQR-V43A(S)'),{})",context),false,'AQR-V43A install depth 720 must fail a 650mm limit');

vm.runInContext('answers.maxDepth=700',context);
assert.equal(vm.runInContext("hardFilter(products.find(p=>p.model==='NR-E47BR3-C'),{})",context),true,'NR-E47BR3 install depth 699 must fit a 700mm limit');
assert.equal(vm.runInContext("hardFilter(products.find(p=>p.model==='R-HWS47X N'),{})",context),false,'R-HWS47X minimum install depth 701 must fail a 700mm limit');

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

// Panasonic expansion.
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
assert.equal(pB18.install,645,'NR-B18C3 installation depth must include rear clearance and equal 645mm');

// SHARP current lineup.
const sMF55=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>String(p.model).startsWith('SJ-MF55R'))))",context));
assert.equal(sMF55.body,630,'SJ-MF55R body depth must be 630mm');
assert.equal(sMF55.install,637,'SJ-MF55R minimum installation depth must be 637mm');
const sX504=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>String(p.model).startsWith('SJ-X504R'))))",context));
assert.equal(sX504.install,704,'SJ-X504R minimum installation depth must be 704mm');
assert.equal(sX504.kind,'over','SJ-X504R must fail a 700mm limit');
const sPT32=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>String(p.model).startsWith('SJ-PT32R'))))",context));
assert.equal(sPT32.body,647,'SJ-PT32R body depth must be 647mm');
assert.equal(sPT32.install,675,'SJ-PT32R minimum installation depth must be 675mm');
assert.equal(sPT32.kind,'verified-fit','SJ-PT32R must fit a 700mm limit');
const sGD15=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>String(p.model).startsWith('SJ-GD15R'))))",context));
assert.equal(sGD15.install,646,'SJ-GD15R minimum installation depth must be 646mm');

// Toshiba current + audited retail sell-through lineup.
const tA640=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>String(p.model).startsWith('GR-A640XFS'))))",context));
assert.equal(tA640.body,745,'GR-A640XFS body depth must be 745mm');
assert.equal(tA640.install,748,'GR-A640XFS installation depth must be 748mm');
assert.equal(tA640.kind,'over','GR-A640XFS must fail a 700mm limit');
const tA490=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>String(p.model).startsWith('GR-A490XFS'))))",context));
assert.equal(tA490.install,632,'GR-A490XFS installation depth must be 632mm');
assert.equal(tA490.kind,'verified-fit','GR-A490XFS must fit a 700mm limit');
const tA500=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>String(p.model).startsWith('GR-A500GT'))))",context));
assert.equal(tA500.install,707,'GR-A500GT installation depth must be 707mm');
assert.equal(tA500.kind,'over','GR-A500GT must fail a 700mm limit');
const tY36=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>String(p.model).startsWith('GR-Y36SV'))))",context));
assert.equal(tY36.install,677,'GR-Y36SV installation depth must be 677mm');
const tY18=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>String(p.model).startsWith('GR-Y18BP'))))",context));
assert.equal(tY18.body,580,'GR-Y18BP body depth must be 580mm');
assert.equal(tY18.install,640,'GR-Y18BP installation depth must be 640mm');
const tY510=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>String(p.model).startsWith('GR-Y510FK'))))",context));
assert.equal(tY510.install,702,'GR-Y510FK sell-through model must now use official 702mm installation depth');

vm.runInContext("products.push({maker:'TEST',model:'DEPTH-UNKNOWN',status:'発売中',width:600})",context);
const unknownState=JSON.parse(vm.runInContext("JSON.stringify(window.fridgeDepthState(products.find(p=>p.model==='DEPTH-UNKNOWN')))",context));
assert.equal(unknownState.kind,'unknown','unverified depth must remain unknown');
assert.equal(vm.runInContext("hardFilter(products.find(p=>p.model==='DEPTH-UNKNOWN'),{})",context),true,'unknown depth must not be falsely rejected');

const rowText=vm.runInContext("matchRows(products.find(p=>p.model==='R-HWS47X N'),{})[1][1]",context);
assert.match(rowText,/701mm/,'result row must surface the verified installation depth');

console.log(`Depth installation regression: PASS (verified ${coverage.verified}/${coverage.total}, install ${coverage.installVerified}, body-only ${coverage.bodyOnlyVerified}; Toshiba ${toshibaCoverage.verified}/${toshibaCoverage.total})`);
