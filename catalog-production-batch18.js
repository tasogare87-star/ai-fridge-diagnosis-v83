// v8.9 production catalog batch 18
// Retail sell-through audit corrections verified on 2026-08-28.
// - Add Toshiba GR-Y600FK while fresh Yodobashi retail evidence remains.
// - Remove SHARP SJ-X373P because fresh retail evidence no longer shows Yodobashi as an active seller.
(function(){
  const removals=new Set(["SJ-X373P-N"]);
  for(let i=products.length-1;i>=0;i--){
    if(removals.has(products[i].model)) products.splice(i,1);
  }

  const additions=[
    {
      maker:"TOSHIBA", model:"GR-Y600FK-EW", status:"発売中（売り切り在庫）", price:168000, capacity:601, width:685, doorType:"フレンチドア", doors:6,
      freezerTotal:142, vegetable:132, vegetablePos:"真ん中", energy:311, autoIce:true, smartphone:false,
      features:["601L・幅68.5cm", "新鮮 摘みたて野菜室", "速鮮チルド＆解凍モード", "生産終了後のヨドバシ販売継続を確認"],
      source:"https://www.yodobashi.com/?word=GR-Y600FK", verifiedAt:"2026-08-28"
    }
  ];
  additions.forEach(item=>{if(!products.some(p=>p.model===item.model)) products.push(item);});
})();
