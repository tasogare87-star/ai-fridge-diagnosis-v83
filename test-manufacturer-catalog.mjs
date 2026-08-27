import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const expected={
  'Panasonic':'https://panasonic.jp/catalog.html',
  'MITSUBISHI ELECTRIC':'https://www.mitsubishielectric.co.jp/ldg/wink/ssl/webCatalogTop.do',
  'HITACHI':'https://kadenfan.hitachi.co.jp/catalog/',
  'TOSHIBA':'https://www.toshiba-lifestyle.com/jp/support/catalog/',
  'SHARP':'https://cgi.jp.sharp/catalog/',
  'AQUA':'https://aqua-has.com/support/catalog/'
};

function makeCard(maker){
  const card={maker,inserted:null};
  const seller={parentNode:{insertBefore(box){card.inserted=box;}}};
  card.querySelector=(selector)=>{
    if(selector==='.manufacturer-catalog') return card.inserted;
    if(selector==='.maker') return {textContent:maker};
    if(selector==='.source') return seller;
    return null;
  };
  card.appendChild=(box)=>{card.inserted=box;};
  return card;
}

const cards=Object.keys(expected).map(makeCard);
const result={
  classList:{contains(){return false;}},
  querySelectorAll(selector){return selector==='.cards .card'?cards:[];}
};
const head={appendChild(){}};
const badge={textContent:''};
let baseShowCalls=0;

const document={
  title:'',
  head,
  getElementById(id){
    if(id==='result') return result;
    if(id==='v813-manufacturer-catalog-style') return null;
    return null;
  },
  createElement(tag){return {tagName:tag.toUpperCase(),id:'',className:'',textContent:'',innerHTML:'',appendChild(){}};},
  querySelector(selector){return selector==='header .badge'?badge:null;}
};
const windowObj={};
const context=vm.createContext({
  document,
  window:windowObj,
  showResult(){baseShowCalls+=1;},
  console
});
windowObj.window=windowObj;

vm.runInContext(fs.readFileSync('v813-manufacturer-catalog.js','utf8'),context,{filename:'v813-manufacturer-catalog.js'});

assert.deepEqual(JSON.parse(JSON.stringify(windowObj.fridgeManufacturerCatalogs)),expected,'all six official catalog mappings must be exposed');
assert.match(document.title,/v8\.13/,'document title must be v8.13');
assert.match(badge.textContent,/公式カタログ/,'badge must mention official catalog support');

vm.runInContext('showResult()',context);
assert.equal(baseShowCalls,1,'v8.13 must preserve base result rendering');

for(const card of cards){
  assert.ok(card.inserted,`${card.maker}: catalog block must be inserted`);
  assert.equal(card.inserted.className,'manufacturer-catalog');
  assert.match(card.inserted.innerHTML,new RegExp(expected[card.maker].replace(/[.*+?^${}()|[\]\\]/g,'\\$&')),`${card.maker}: official URL must be used`);
  assert.match(card.inserted.innerHTML,/メーカー公式カタログを見る/);
  assert.match(card.inserted.innerHTML,/target="_blank"/);
  assert.match(card.inserted.innerHTML,/rel="noopener noreferrer"/);
}

vm.runInContext('window.decorateManufacturerCatalogLinks()',context);
for(const card of cards){
  assert.ok(card.inserted,'second decoration must keep existing block without duplication');
}

console.log('Manufacturer catalog links regression: PASS (6/6 official catalog mappings)');
