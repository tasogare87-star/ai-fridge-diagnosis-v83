import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function trackedNode(initial=''){
  return {
    _innerHTML:initial,
    writes:0,
    get innerHTML(){return this._innerHTML;},
    set innerHTML(value){this.writes+=1;this._innerHTML=String(value);}
  };
}

function testUiGuidanceObserver(){
  const strategy=trackedNode('');
  const result={querySelector(selector){return selector==='.strategy-note'?strategy:null;}};
  let observerCallback=null;
  class FakeMutationObserver{constructor(cb){observerCallback=cb;} observe(){} disconnect(){}}
  const context=vm.createContext({
    document:{getElementById(id){return id==='result'?result:null;}},
    MutationObserver:FakeMutationObserver,
    console
  });
  vm.runInContext(fs.readFileSync('v89-ui-guidance.js','utf8'),context,{filename:'v89-ui-guidance.js'});
  assert.equal(strategy.writes,1,'v89 initial sync should write once');
  for(let i=0;i<10;i++) observerCallback();
  assert.equal(strategy.writes,1,'v89 observer must be idempotent');
}

function testAquaObserver(){
  const strategy=trackedNode('');
  const customer=trackedNode('');
  const result={
    querySelector(selector){
      if(selector==='.strategy-note') return strategy;
      if(selector==='.v89-fair-note') return customer;
      return null;
    }
  };
  let observerCallback=null;
  class FakeMutationObserver{constructor(cb){observerCallback=cb;} observe(){} disconnect(){}}
  const windowObj={capacityProfile:null,__fridgeFairnessMeta:null};
  const context=vm.createContext({
    document:{
      title:'',
      getElementById(id){return id==='result'?result:null;},
      querySelector(){return null;}
    },
    MutationObserver:FakeMutationObserver,
    productScore:()=>100,
    getCandidates:()=>({regular:[],featurePick:null}),
    hardFilter:()=>true,
    products:[],
    answers:{family:1,budget:999999},
    strategicMakers:[],
    window:windowObj,
    console
  });
  windowObj.window=windowObj;
  vm.runInContext(fs.readFileSync('v811-aqua-priority.js','utf8'),context,{filename:'v811-aqua-priority.js'});
  assert.equal(typeof observerCallback,'function','v811 observer callback must be registered');
  assert.equal(strategy.writes,1,'v811 initial strategy sync should write once');
  assert.equal(customer.writes,1,'v811 initial customer sync should write once');
  assert.match(strategy.innerHTML,/AQUAも条件適合時は候補から除外しません/);

  for(let i=0;i<20;i++) observerCallback();
  assert.equal(strategy.writes,1,'v811 strategy observer must not loop on identical HTML');
  assert.equal(customer.writes,1,'v811 customer observer must not loop on identical HTML');

  strategy._innerHTML='<strong>古い表示</strong>';
  customer._innerHTML='<strong>古い表示</strong>';
  observerCallback();
  assert.equal(strategy.writes,2,'v811 should repair stale strategy copy once');
  assert.equal(customer.writes,2,'v811 should repair stale customer copy once');
  observerCallback();
  assert.equal(strategy.writes,2,'v811 repaired strategy must remain stable');
  assert.equal(customer.writes,2,'v811 repaired customer copy must remain stable');
}

testUiGuidanceObserver();
testAquaObserver();
console.log('Result MutationObserver regression: PASS (all result observers idempotent)');
