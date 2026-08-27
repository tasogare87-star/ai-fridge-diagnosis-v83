import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html=fs.readFileSync('index.html','utf8');
for(const id of ['intro','quiz','result','startBtn','qnum','question','hint','options','bar','prevBtn','prevTopBtn','nextBtn','toIntroBtn','selectionNote','editBanner']){
  assert.match(html,new RegExp(`id=["']${id}["']`),`index.html must contain #${id}`);
}

const orderedScripts=[
  'data.js','catalog-production-batch20.js','catalog-depth-verified.js','catalog-depth-toshiba.js',
  'catalog-depth-hitachi.js','catalog-depth-aqua.js','catalog-depth-mitsubishi-completion.js',
  'ui.js','logic.js','v88-core.js','v89-fairness.js','v89-ui-guidance.js','v810-depth.js','v811-aqua-priority.js'
];
let last=-1;
for(const script of orderedScripts){
  const pos=html.indexOf(`src="${script}"`);
  assert.ok(pos>last,`${script} must be loaded in production order`);
  last=pos;
}

class FakeClassList{
  constructor(initial=[]){this.values=new Set(initial);}
  add(...names){for(const n of names)this.values.add(n);}
  remove(...names){for(const n of names)this.values.delete(n);}
  contains(name){return this.values.has(name);}
  toggle(name,force){
    if(force===true){this.values.add(name);return true;}
    if(force===false){this.values.delete(name);return false;}
    if(this.values.has(name)){this.values.delete(name);return false;}
    this.values.add(name);return true;
  }
}

class FakeElement{
  constructor(id='',classes=[]){
    this.id=id;
    this._innerHTML='';
    this.textContent='';
    this.className='';
    this.type='';
    this.disabled=false;
    this.style={};
    this.children=[];
    this.listeners=new Map();
    this.attributes=new Map();
    this.classList=new FakeClassList(classes);
    this.parentNode={insertBefore(){}};
  }
  set innerHTML(value){this._innerHTML=String(value);if(value==='')this.children=[];}
  get innerHTML(){return this._innerHTML;}
  appendChild(child){this.children.push(child);child.parentNode=this;return child;}
  addEventListener(type,fn){
    if(!this.listeners.has(type))this.listeners.set(type,[]);
    this.listeners.get(type).push(fn);
  }
  click(){for(const fn of this.listeners.get('click')||[])fn({currentTarget:this,target:this});}
  setAttribute(name,value){this.attributes.set(name,String(value));}
  getAttribute(name){return this.attributes.get(name)??null;}
  querySelector(){return null;}
  querySelectorAll(){return [];}
}

const ids=['intro','quiz','result','qnum','question','hint','options','bar','startBtn','prevBtn','prevTopBtn','nextBtn','toIntroBtn','selectionNote','editBanner','svg-front','svg-wall','svg-flow'];
const elements=Object.fromEntries(ids.map(id=>[id,new FakeElement(id,(id==='quiz'||id==='result')?['hidden']:[])]));
const head=new FakeElement('head');
const document={
  title:'',
  head,
  getElementById(id){return elements[id]||null;},
  querySelector(){return null;},
  querySelectorAll(){return [];},
  createElement(tag){return new FakeElement(tag);}
};
const history={pushState(){},replaceState(){}};
const windowObj={scrollTo(){},print(){}};
const context=vm.createContext({
  console,
  location:{protocol:'https:',href:'https://ui-flow.invalid/'},
  window:windowObj,
  document,
  history,
  MutationObserver:class{constructor(cb){this.cb=cb;}observe(){}disconnect(){}},
  navigator:{},
  setTimeout,
  clearTimeout,
});
windowObj.window=windowObj;
windowObj.document=document;
windowObj.history=history;

function load(file){vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});}

const catalogFiles=[
  'data.js','catalog-production-extension.js',
  ...Array.from({length:19},(_,i)=>`catalog-production-batch${i+2}.js`),
  'catalog-depth-verified.js','catalog-depth-toshiba.js','catalog-depth-hitachi.js','catalog-depth-aqua.js','catalog-depth-mitsubishi-completion.js'
];
for(const file of catalogFiles)load(file);
load('ui.js');

const logicSource=fs.readFileSync('logic.js','utf8');
const uiBoundary=logicSource.indexOf('\nfunction refreshShareUrlDisplay');
assert.ok(uiBoundary>0,'logic.js pure-logic boundary must exist');
vm.runInContext(logicSource.slice(0,uiBoundary),context,{filename:'logic.js'});
load('v88-core.js');
load('v89-fairness.js');
load('v89-ui-guidance.js');
load('v810-depth.js');
load('v811-aqua-priority.js');

assert.equal(vm.runInContext("questions[0].key",context),'maxWidth','width must remain the first question');
assert.equal(vm.runInContext("questions[1].key",context),'maxDepth','depth must be the second question');
assert.equal(vm.runInContext("questions.filter(q=>q.key==='maxDepth').length",context),1,'depth question must not be duplicated');

vm.runInContext('showQuizAt(0,{push:false})',context);
assert.equal(elements.intro.classList.contains('hidden'),true,'starting diagnosis must hide intro');
assert.equal(elements.quiz.classList.contains('hidden'),false,'starting diagnosis must show quiz');
assert.match(elements.qnum.textContent,/質問 1 \/ /,'first question number must render');
assert.ok(elements.options.children.length>0,'width choices must render');
assert.equal(elements.nextBtn.disabled,true,'next must remain disabled before width selection');

const widthChoice=vm.runInContext("questions[0].options.findIndex(([,v])=>v===700)",context);
assert.ok(widthChoice>=0,'700mm width choice must exist');
elements.options.children[widthChoice].click();
assert.equal(elements.nextBtn.disabled,false,'selecting width must enable next');
vm.runInContext('goNextQuestion()',context);
assert.equal(vm.runInContext('index',context),1,'next must advance to the second question');
assert.equal(vm.runInContext('questions[index].key',context),'maxDepth','second screen must ask installation depth');
assert.match(elements.question.textContent,/奥行き/,'depth question copy must be visible');

const depthChoice=vm.runInContext("questions[1].options.findIndex(([,v])=>v===700)",context);
assert.ok(depthChoice>=0,'700mm depth choice must exist');
elements.options.children[depthChoice].click();
assert.equal(vm.runInContext('answers.maxDepth',context),700,'depth answer must persist');

vm.runInContext(`Object.assign(answers,{
  family:4,maxWidth:700,maxDepth:700,wallSide:'none',kitchenSide:'center',approachSide:'center',
  freezerUse:3,vegetablePriority:3,vegetablePos:'any',energy:3,budget:999999,autoIce:'no',smartphone:'no'
})`,context);
vm.runInContext('showResult()',context);

assert.equal(elements.quiz.classList.contains('hidden'),true,'result must hide quiz');
assert.equal(elements.result.classList.contains('hidden'),false,'result must be visible');
assert.match(elements.result.innerHTML,/診断結果/,'result heading must render');
assert.match(elements.result.innerHTML,/奥行き/,'result cards must surface depth information');
assert.match(elements.result.innerHTML,/mm/,'result must display depth dimensions in millimeters');

const excluded=['NR-FVF45S3','GR-Y550FK','GR-Y460FK','GR-Y550FZ','GR-Y510FZ','GR-Y460FZ'];
for(const model of excluded){
  assert.doesNotMatch(elements.result.innerHTML,new RegExp(model),`${model} must never appear in diagnosis result`);
}

const coverage=vm.runInContext('window.__fridgeDepthCoverage',context);
assert.equal(coverage.verified,152,'UI flow must load official depth metadata for all 152 production models');
const aquaPolicy=vm.runInContext('window.__aquaPriorityPolicy',context);
assert.equal(aquaPolicy.regularPenalty,10,'AQUA regular priority adjustment must remain 10 points');
assert.equal(aquaPolicy.featurePenalty,8,'AQUA feature priority adjustment must remain 8 points');
assert.equal(aquaPolicy.excluded,false,'AQUA must remain eligible, not excluded');

console.log('UI flow regression: PASS (width -> depth -> result; exclusions locked)');
