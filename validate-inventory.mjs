import assert from 'node:assert/strict';
import fs from 'node:fs';

const inventoryFiles=fs.readdirSync('.')
  .filter(name=>/^catalog-inventory-.*\.json$/.test(name))
  .sort();

assert.ok(inventoryFiles.length>=6,'expected manufacturer inventory JSON files');

const inventories=new Map();
for(const file of inventoryFiles){
  const raw=fs.readFileSync(file,'utf8');
  assert.ok(!raw.includes('staged-not-live'),`${file}: stale staged-not-live state must not remain after production deployment`);
  assert.ok(!raw.includes('build rate limit'),`${file}: stale build-rate-limit wording must not remain after production deployment`);
  assert.ok(!raw.includes('not yet confirmed live'),`${file}: stale not-yet-live wording must not remain after production deployment`);
  inventories.set(file,JSON.parse(raw));
}

function countStatus(inv,status){
  return (inv.models||[]).filter(x=>x.inventoryStatus===status).length;
}

const pan=inventories.get('catalog-inventory-panasonic.json');
assert.ok(pan,'Panasonic inventory missing');
assert.equal(countStatus(pan,'production'),27,'Panasonic production inventory must be 27');
assert.equal(countStatus(pan,'pending-yodobashi-check'),0,'Panasonic pending inventory must remain zero after explicit exclusion');
assert.equal(pan.summary?.productionLive,27,'Panasonic summary productionLive must be 27');
assert.equal(pan.summary?.pendingYodobashiCheck,0,'Panasonic pending summary must be zero');
assert.equal(pan.summary?.excludedCurrentProducts,1,'Panasonic excluded current products must be 1');
assert.ok(!(pan.models||[]).some(x=>x.model==='NR-FVF45S3'),'NR-FVF45S3 must not remain in diagnosis/pending models');
const fvf=(pan.excludedCurrentProducts||[]).find(x=>x.model==='NR-FVF45S3');
assert.equal(fvf?.inventoryStatus,'excluded','NR-FVF45S3 must remain explicitly excluded');
assert.equal(fvf?.excludedAt,'2026-08-28','NR-FVF45S3 exclusion date must be recorded');
assert.ok(fvf?.reason,'NR-FVF45S3 exclusion must retain a reason');

const sharp=inventories.get('catalog-inventory-sharp.json');
assert.ok(sharp,'SHARP inventory missing');
assert.equal(countStatus(sharp,'production-live'),18,'SHARP current R-generation must be 18/18 production-live');
assert.equal(sharp.summary?.productionLive,18,'SHARP summary productionLive must be 18');
const x373=(sharp.legacyRetailDisposition||[]).find(x=>x.model==='SJ-X373P');
assert.equal(x373?.inventoryStatus,'removed-no-yodobashi','SJ-X373P removal must be recorded as live, not staged');

const aqua=inventories.get('catalog-inventory-aqua.json');
assert.ok(aqua,'AQUA inventory missing');
assert.equal(countStatus(aqua,'production-live'),27,'AQUA standard lineup must be 27/27 production-live');
assert.equal(aqua.summary?.productionLive,27,'AQUA summary productionLive must be 27');
assert.equal(aqua.summary?.pendingYodobashiCheck,0,'AQUA pending count must remain zero');

const toshiba=inventories.get('catalog-inventory-toshiba.json');
assert.ok(toshiba,'Toshiba inventory missing');
assert.equal((toshiba.retailSellThrough||[]).length,2,'Toshiba live sell-through inventory must remain 2');
assert.equal((toshiba.retailSellThroughAudit||[]).length,0,'Toshiba sell-through audit inventory must remain zero after explicit exclusion');
assert.equal((toshiba.excludedRetailSellThrough||[]).length,5,'Toshiba excluded sell-through inventory must remain 5');
assert.equal(toshiba.summary?.retailSellThroughLive,2,'Toshiba sell-through live summary must be 2');
assert.equal(toshiba.summary?.retailSellThroughAudit,0,'Toshiba sell-through audit summary must be zero');
assert.equal(toshiba.summary?.excludedRetailSellThrough,5,'Toshiba excluded sell-through summary must be 5');
const expectedExcluded=['GR-Y550FK','GR-Y460FK','GR-Y550FZ','GR-Y510FZ','GR-Y460FZ'];
const excludedModels=(toshiba.excludedRetailSellThrough||[]).map(x=>x.model).sort();
assert.deepEqual(excludedModels,[...expectedExcluded].sort(),'Toshiba explicit exclusion set must remain unchanged');
for(const item of toshiba.excludedRetailSellThrough||[]){
  assert.equal(item.inventoryStatus,'excluded-retail-sell-through',`${item.model}: must remain explicitly excluded`);
  assert.equal(item.excludedAt,'2026-08-28',`${item.model}: exclusion date must be recorded`);
  assert.ok(item.reason,`${item.model}: exclusion must retain a reason`);
}

console.log(`Inventory validation: PASS (${inventoryFiles.length} files; Panasonic 27 live + 1 excluded; SHARP 18 live; AQUA 27 live; Toshiba sell-through 2 live + 5 excluded)`);
