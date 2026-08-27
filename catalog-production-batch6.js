// v8.9 production catalog batch 6
// Verified 500-599L models across Panasonic, Mitsubishi Electric, Hitachi, Toshiba, SHARP and AQUA.
(function(){
  const additions=[
    {
      maker:"Panasonic", model:"NR-F55WX3-K", status:"発売中", price:316800, capacity:551, width:685, doorType:"フレンチドア", doors:6,
      freezerTotal:132, vegetable:115, vegetablePos:"下段", energy:252, autoIce:true, smartphone:true,
      features:["奥まで見えるフルオープン","霜つき抑制冷凍","サクッと切れる微凍結","KitchenPocketアプリ対応"],
      source:"https://www.yodobashi.com/?word=NR-F55WX3-K", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-MZ54N-W", status:"発売中", price:352000, capacity:540, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:120, vegetable:103, vegetablePos:"真ん中", energy:274, autoIce:true, smartphone:true,
      features:["切れちゃう瞬冷凍A.I.","ひろびろ氷点下ストッカーD A.I.","真ん中朝どれ野菜室","スマホアプリ対応"],
      source:"https://www.yodobashi.com/?word=MR-MZ54N-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"HITACHI", model:"R-HWC54Y-N", status:"発売中", price:285440, capacity:540, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:137, vegetable:103, vegetablePos:"下段", energy:263, autoIce:true, smartphone:true,
      features:["まるごとチルド","特鮮氷温ルーム","まんなか3段大容量冷凍","スマートフォン連携"],
      source:"https://www.yodobashi.com/?word=R-HWC54Y-N", verifiedAt:"2026-08-28"
    },
    {
      maker:"TOSHIBA", model:"GR-A510FH-EW", status:"発売中", price:177170, capacity:509, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:117, vegetable:112, vegetablePos:"真ん中", energy:280, autoIce:true, smartphone:false,
      features:["野菜室がまんなか","新鮮 摘みたて野菜室","速鮮チルド＆解凍モード","幅65cm・509L"],
      source:"https://www.yodobashi.com/?word=GR-A510FH%28EW%29", verifiedAt:"2026-08-28"
    },
    {
      maker:"SHARP", model:"SJ-MF51R-W", status:"発売中", price:308000, capacity:505, width:685, doorType:"フレンチドア", doors:6,
      freezerTotal:129, vegetable:90, vegetablePos:"真ん中", energy:270, autoIce:true, smartphone:true,
      features:["奥行63cm薄型設計","ピラーレスフレンチドア","雪下シャキット野菜室 鶴","COCORO HOME AI"],
      source:"https://www.yodobashi.com/?word=SJ-MF51R-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"AQUA", model:"AQR-TZ52A-T", status:"発売中", price:230020, capacity:518, width:830, doorType:"フレンチドア", doors:4,
      freezerTotal:182, vegetable:26, vegetablePos:null, energy:295, autoIce:true, smartphone:true,
      features:["奥行63.5cm薄型設計","182L大容量6ボックス冷凍室","ツインLED野菜ルーム","Haismartアプリ対応"],
      source:"https://www.yodobashi.com/?word=AQR-TZ52A-T", verifiedAt:"2026-08-28"
    }
  ];
  additions.forEach(item=>{
    if(!products.some(p=>p.model===item.model)) products.push(item);
  });
})();