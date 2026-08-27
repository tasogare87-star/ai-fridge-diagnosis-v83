import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

let writes=0;
const note={
  _innerHTML:'',
  get innerHTML(){return this._innerHTML;},
  set innerHTML(value){writes+=1;this._innerHTML=String(value);}
};
const result={
  querySelector(selector){return selector==='.strategy-note'?note:null;}
};
let observerCallback=null;
class FakeMutationObserver{
  constructor(cb){observerCallback=cb;}
  observe(){}
  disconnect(){}
}
const context=vm.createContext({
  document:{getElementById(id){return id==='result'?result:null;}},
  MutationObserver:FakeMutationObserver,
  console
});

const source=fs.readFileSync('v89-ui-guidance.js','utf8');
vm.runInContext(source,context,{filename:'v89-ui-guidance.js'});

assert.equal(typeof observerCallback,'function','MutationObserver callback must be registered');
assert.equal(writes,1,'initial sync should write staff guidance exactly once');
assert.match(note.innerHTML,/AQUAは候補から除外せず/,'staff guidance must match active AQUA policy');

for(let i=0;i<10;i++) observerCallback();
assert.equal(writes,1,'repeated observer callbacks must not rewrite identical HTML');

note._innerHTML='<strong>古い表示</strong>';
observerCallback();
assert.equal(writes,2,'stale guidance should be repaired once');
observerCallback();
assert.equal(writes,2,'repair must not trigger a rewrite loop');

console.log('Result MutationObserver regression: PASS (idempotent DOM sync)');
