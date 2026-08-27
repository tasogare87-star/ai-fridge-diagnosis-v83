// v8.9 production catalog batch 10
// Mitsubishi Electric models promoted after current Yodobashi sales evidence
// and manufacturer WIN2K specification verification on 2026-08-28.
(function(){
  const additions=[
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-WXD47LN-W", status:"発売中", price:297000, capacity:470, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:119, vegetable:98, vegetablePos:"下段", energy:256, autoIce:true, smartphone:true,
      features:["幅65cm・ロータイプ470L","切れちゃう瞬冷凍A.I.","できちゃうV冷凍＋","スマートフォン連携"],
      source:"https://www.yodobashi.com/?word=MR-WXD47LN-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-BD46N-W", status:"発売中", price:253000, capacity:455, width:600, doorType:"右開き", doors:5,
      freezerTotal:107, vegetable:87, vegetablePos:"下段", energy:250, autoIce:true, smartphone:true,
      features:["幅60cm・455L","冷凍室が真ん中","切れちゃう瞬冷凍A.I.","スマートフォン連携"],
      source:"https://www.yodobashi.com/?word=MR-BD46N-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-BD46NL-W", status:"発売中", price:253000, capacity:455, width:600, doorType:"左開き", doors:5,
      freezerTotal:107, vegetable:87, vegetablePos:"下段", energy:250, autoIce:true, smartphone:true,
      features:["左開き仕様","幅60cm・455L","冷凍室が真ん中","スマートフォン連携"],
      source:"https://www.yodobashi.com/?word=MR-BD46NL-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-MD45N-W", status:"発売中", price:293700, capacity:451, width:600, doorType:"右開き", doors:5,
      freezerTotal:103, vegetable:87, vegetablePos:"真ん中", energy:251, autoIce:true, smartphone:true,
      features:["幅60cm・451L","真ん中朝どれ野菜室","切れちゃう瞬冷凍A.I.","スマートフォン連携"],
      source:"https://www.yodobashi.com/?word=MR-MD45N-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-MD45NL-W", status:"発売中", price:293700, capacity:451, width:600, doorType:"左開き", doors:5,
      freezerTotal:103, vegetable:87, vegetablePos:"真ん中", energy:251, autoIce:true, smartphone:true,
      features:["左開き仕様","幅60cm・451L","真ん中朝どれ野菜室","スマートフォン連携"],
      source:"https://www.yodobashi.com/?word=MR-MD45NL-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-C33M-W", status:"発売中", price:89790, capacity:330, width:600, doorType:"右開き", doors:3,
      freezerTotal:80, vegetable:70, vegetablePos:"真ん中", energy:342, autoIce:false, smartphone:false,
      features:["330L・幅60cm","2段チルド","80Lビッグフリーザー","真ん中野菜室"],
      source:"https://www.yodobashi.com/?word=MR-C33M-W", verifiedAt:"2026-08-28"
    }
  ];
  additions.forEach(item=>{
    if(!products.some(p=>p.model===item.model)) products.push(item);
  });
})();
