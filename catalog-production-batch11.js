// v8.9 production catalog batch 11
// Completes the identified current Mitsubishi Electric refrigerator inventory
// after Yodobashi sales evidence and manufacturer specification verification.
(function(){
  const additions=[
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-WZ55N-W", status:"発売中", price:330000, capacity:547, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:128, vegetable:100, vegetablePos:"下段", energy:266, autoIce:true, smartphone:true,
      features:["冷凍室が真ん中","切れちゃう瞬冷凍A.I.","できちゃうV冷凍＋","スマートフォン連携"],
      source:"https://www.yodobashi.com/?word=MR-WZ55N-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-JW55N-W", status:"発売中", price:297000, capacity:547, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:128, vegetable:100, vegetablePos:"下段", energy:293, autoIce:true, smartphone:false,
      features:["冷凍室が真ん中","鋼板ドア","新鮮野菜室","できちゃうV冷凍＋"],
      source:"https://www.yodobashi.com/?word=MR-JW55N-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-JM54N-W", status:"発売中", price:319000, capacity:540, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:120, vegetable:103, vegetablePos:"真ん中", energy:288, autoIce:true, smartphone:false,
      features:["野菜室が真ん中","鋼板ドア","新鮮野菜室","できちゃうV冷凍＋"],
      source:"https://www.yodobashi.com/?word=MR-JM54N-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-GW52N-W", status:"発売中", price:248000, capacity:517, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:119, vegetable:98, vegetablePos:"下段", energy:282, autoIce:true, smartphone:false,
      features:["幅65cm・517L","真ん中冷凍室","89L冷凍室＋30L瞬冷凍室","自動製氷"],
      source:"https://www.yodobashi.com/?word=MR-GW52N-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-JW50N-W", status:"発売中", price:275000, capacity:495, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:117, vegetable:91, vegetablePos:"下段", energy:276, autoIce:true, smartphone:false,
      features:["冷凍室が真ん中","鋼板ドア","新鮮野菜室","できちゃうV冷凍＋"],
      source:"https://www.yodobashi.com/?word=MR-JW50N-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-JM49N-W", status:"発売中", price:297000, capacity:485, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:108, vegetable:92, vegetablePos:"真ん中", energy:269, autoIce:true, smartphone:false,
      features:["野菜室が真ん中","鋼板ドア","新鮮野菜室","できちゃうV冷凍＋"],
      source:"https://www.yodobashi.com/?word=MR-JM49N-W", verifiedAt:"2026-08-28"
    }
  ];
  additions.forEach(item=>{
    if(!products.some(p=>p.model===item.model)) products.push(item);
  });
})();
