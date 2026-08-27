// v8.9 production catalog batch 8
// Fill verified capacity-band gaps for Mitsubishi Electric and Hitachi.
(function(){
  const additions=[
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-CX27M-W", status:"発売中", price:99870, capacity:272, width:540, doorType:"右開き", doors:3,
      freezerTotal:70, vegetable:60, vegetablePos:"真ん中", energy:313, autoIce:false, smartphone:false,
      features:["272L・幅54cm","氷点下ストッカー","真ん中野菜室","インバーター省エネ"],
      source:"https://www.yodobashi.com/?word=MR-CX27M-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"HITACHI", model:"R-27X-N", status:"発売中", price:84800, capacity:265, width:540, doorType:"右開き", doors:3,
      freezerTotal:66, vegetable:63, vegetablePos:"真ん中", energy:323, autoIce:false, smartphone:false,
      features:["265L・幅54cm","真ん中野菜室","チルドルーム","手動製氷"],
      source:"https://www.yodobashi.com/?word=R-27X%20N", verifiedAt:"2026-08-28"
    },
    {
      maker:"HITACHI", model:"R-K40T-S", status:"発売中", price:168110, capacity:401, width:600, doorType:"右開き", doors:5,
      freezerTotal:94, vegetable:75, vegetablePos:"下段", energy:273, autoIce:true, smartphone:false,
      features:["401L・幅60cm","まんなか冷凍","新鮮スリープ野菜室","氷温ルーム"],
      source:"https://www.yodobashi.com/?word=R-K40T%28S%29", verifiedAt:"2026-08-28"
    },
    {
      maker:"HITACHI", model:"R-K40TL-S", status:"発売中", price:169810, capacity:401, width:600, doorType:"左開き", doors:5,
      freezerTotal:94, vegetable:75, vegetablePos:"下段", energy:273, autoIce:true, smartphone:false,
      features:["左開き仕様","401L・幅60cm","まんなか冷凍","新鮮スリープ野菜室"],
      source:"https://www.yodobashi.com/?word=R-K40TL%28S%29", verifiedAt:"2026-08-28"
    }
  ];
  additions.forEach(item=>{
    if(!products.some(p=>p.model===item.model)) products.push(item);
  });
})();