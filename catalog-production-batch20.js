// v8.9 production catalog batch 20
// Complete Hitachi current refrigerator lineup after fresh Yodobashi sales evidence
// and manufacturer specification verification on 2026-08-28.
(function(){
  const additions=[
    {
      maker:"HITACHI", model:"R-H54Y-S", status:"発売中", price:219250, capacity:540, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:159, vegetable:103, vegetablePos:"下段", energy:295, autoIce:true, smartphone:false,
      features:["540L・幅65cm","まんなか3段大容量冷凍","特鮮氷温ルーム","まるごとチルド","うるおい野菜室"],
      source:"https://www.yodobashi.com/?word=R-H54Y", verifiedAt:"2026-08-28"
    }
  ];
  additions.forEach(item=>{
    if(!products.some(p=>p.model===item.model)) products.push(item);
  });
})();
