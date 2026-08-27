// v8.9 production catalog batch 5
// Verified 450-499L models across Panasonic, Mitsubishi Electric, Hitachi, Toshiba, SHARP and AQUA.
(function(){
  const additions=[
    {
      maker:"Panasonic", model:"NR-F49EY3-S", status:"発売中", price:237600, capacity:490, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:127, vegetable:104, vegetablePos:"下段", energy:279, autoIce:true, smartphone:false,
      features:["幅65cm・490L","新鮮凍結ルーム26L＋冷凍室101L","104L野菜室","奥行65cm"],
      source:"https://www.yodobashi.com/?word=NR-F49EY3-S", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-WZ50N-W", status:"発売中", price:308000, capacity:495, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:117, vegetable:91, vegetablePos:"下段", energy:262, autoIce:true, smartphone:true,
      features:["切れちゃう瞬冷凍A.I.","ひろびろ氷点下ストッカーD A.I.","できちゃうV冷凍＋","スマホアプリ対応"],
      source:"https://www.yodobashi.com/?word=MR-WZ50N-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"HITACHI", model:"R-HWC49Y-N", status:"発売中", price:278000, capacity:485, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:121, vegetable:91, vegetablePos:"下段", energy:262, autoIce:true, smartphone:true,
      features:["まるごとチルド","特鮮氷温ルーム","まんなか3段大容量冷凍","スマートフォン連携"],
      source:"https://www.yodobashi.com/?word=R-HWC49Y-N", verifiedAt:"2026-08-28"
    },
    {
      maker:"TOSHIBA", model:"GR-A450GT-TH", status:"発売中", price:224270, capacity:452, width:600, doorType:"右開き", doors:5,
      freezerTotal:114, vegetable:90, vegetablePos:"真ん中", energy:261, autoIce:true, smartphone:true,
      features:["幅60cm・452L","もっと潤う摘みたて野菜室","おいしさ持続上質冷凍","IoLIFEアプリ対応"],
      source:"https://www.yodobashi.com/?word=GR-A450GT%28TH%29", verifiedAt:"2026-08-28"
    },
    {
      maker:"TOSHIBA", model:"GR-A460FH-EW", status:"発売中", price:181660, capacity:462, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:104, vegetable:103, vegetablePos:"真ん中", energy:264, autoIce:true, smartphone:false,
      features:["野菜室がまんなか","新鮮 摘みたて野菜室","速鮮チルド＆解凍モード","幅65cm・462L"],
      source:"https://www.yodobashi.com/?word=GR-A460FH%28EW%29", verifiedAt:"2026-08-28"
    },
    {
      maker:"SHARP", model:"SJ-XW46R-H", status:"発売中", price:198000, capacity:455, width:600, doorType:"左右開き", doors:5,
      freezerTotal:113, vegetable:80, vegetablePos:"真ん中", energy:267, autoIce:true, smartphone:false,
      features:["オートクローズどっちもドア","113L大容量冷凍室","真ん中野菜室","プラズマクラスター"],
      source:"https://www.yodobashi.com/?word=SJ-XW46R-H", verifiedAt:"2026-08-28"
    },
    {
      maker:"AQUA", model:"AQR-VZA45A-W", status:"発売中", price:169530, capacity:452, width:595, doorType:"右開き", doors:4,
      freezerTotal:141, vegetable:79, vegetablePos:null, energy:259, autoIce:true, smartphone:false,
      features:["幅59.5cm・452L","上段61L＋下段80Lの大容量冷凍室","旬鮮野菜室","洗える製氷ユニット"],
      source:"https://www.yodobashi.com/?word=AQR-VZA45A-W", verifiedAt:"2026-08-28"
    }
  ];
  additions.forEach(item=>{
    if(!products.some(p=>p.model===item.model)) products.push(item);
  });
})();