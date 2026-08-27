// v8.9 production catalog batch 13
// Toshiba current models promoted after current Yodobashi sales evidence and
// manufacturer specification verification on 2026-08-28.
(function(){
  const additions=[
    {
      maker:"TOSHIBA", model:"GR-A640XFS-TW", status:"発売中", price:367330, capacity:643, width:685, doorType:"フレンチドア", doors:6,
      freezerTotal:160, vegetable:129, vegetablePos:"真ん中", energy:296, autoIce:true, smartphone:true,
      features:["643L・幅68.5cm", "もっと潤う摘みたて野菜室", "3段冷凍室", "IoLIFE対応"],
      source:"https://www.yodobashi.com/?word=GR-A640XFS", verifiedAt:"2026-08-28"
    },
    {
      maker:"TOSHIBA", model:"GR-A540XFS-TW", status:"発売中", price:327010, capacity:543, width:685, doorType:"フレンチドア", doors:6,
      freezerTotal:132, vegetable:110, vegetablePos:"真ん中", energy:280, autoIce:true, smartphone:true,
      features:["543L・幅68.5cm", "もっと潤う摘みたて野菜室", "Deliチルド/氷結晶チルド", "IoLIFE対応"],
      source:"https://www.yodobashi.com/?word=GR-A540XFS", verifiedAt:"2026-08-28"
    },
    {
      maker:"TOSHIBA", model:"GR-A590WF-UC", status:"発売中", price:278000, capacity:586, width:685, doorType:"フレンチドア", doors:6,
      freezerTotal:159, vegetable:106, vegetablePos:"下段", energy:294, autoIce:true, smartphone:true,
      features:["586L・幅68.5cm", "まんなか大容量3段冷凍室", "おいしさ持続上質冷凍＋", "IoLIFE対応"],
      source:"https://www.yodobashi.com/?word=GR-A590WF", verifiedAt:"2026-08-28"
    },
    {
      maker:"TOSHIBA", model:"GR-A500GT-TH", status:"発売中", price:232100, capacity:501, width:600, doorType:"右開き", doors:5,
      freezerTotal:129, vegetable:98, vegetablePos:"真ん中", energy:279, autoIce:true, smartphone:true,
      features:["501L・幅60cm", "野菜室がまんなか", "3段冷凍室", "IoLIFE対応"],
      source:"https://www.yodobashi.com/?word=GR-A500GT", verifiedAt:"2026-08-28"
    },
    {
      maker:"TOSHIBA", model:"GR-A500GTL-TH", status:"発売中", price:232100, capacity:501, width:600, doorType:"左開き", doors:5,
      freezerTotal:129, vegetable:98, vegetablePos:"真ん中", energy:279, autoIce:true, smartphone:true,
      features:["501L・幅60cm・左開き", "野菜室がまんなか", "3段冷凍室", "IoLIFE対応"],
      source:"https://www.yodobashi.com/?word=GR-A500GTL", verifiedAt:"2026-08-28"
    },
    {
      maker:"TOSHIBA", model:"GR-A470GSHL-EW", status:"発売中", price:183530, capacity:465, width:600, doorType:"左開き", doors:5,
      freezerTotal:107, vegetable:103, vegetablePos:"真ん中", energy:265, autoIce:true, smartphone:false,
      features:["465L・幅60cm・左開き", "野菜室がまんなか", "速鮮チルド/解凍モード", "切り替え冷凍室"],
      source:"https://www.yodobashi.com/?word=GR-A470GSHL", verifiedAt:"2026-08-28"
    },
    {
      maker:"TOSHIBA", model:"GR-Y36SV-UC", status:"発売中", price:128000, capacity:356, width:600, doorType:"右開き", doors:3,
      freezerTotal:82, vegetable:70, vegetablePos:"真ん中", energy:330, autoIce:true, smartphone:false,
      features:["356L・幅60cm", "野菜室がまんなか", "3段冷凍室", "速鮮チルド/解凍モード"],
      source:"https://www.yodobashi.com/?word=GR-Y36SV", verifiedAt:"2026-08-28"
    },
    {
      maker:"TOSHIBA", model:"GR-Y36SVL-UC", status:"発売中", price:128000, capacity:356, width:600, doorType:"左開き", doors:3,
      freezerTotal:82, vegetable:70, vegetablePos:"真ん中", energy:330, autoIce:true, smartphone:false,
      features:["356L・幅60cm・左開き", "野菜室がまんなか", "3段冷凍室", "速鮮チルド/解凍モード"],
      source:"https://www.yodobashi.com/?word=GR-Y36SVL", verifiedAt:"2026-08-28"
    }
  ];
  additions.forEach(item=>{
    if(!products.some(p=>p.model===item.model)) products.push(item);
  });
})();
