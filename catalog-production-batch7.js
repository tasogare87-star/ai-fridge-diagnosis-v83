// v8.9 production catalog batch 7
// Verified 600L+ models. AQUA currently has no verified model above 600L in the 2026 official lineup.
(function(){
  const additions=[
    {
      maker:"Panasonic", model:"NR-F60WX3-K", status:"発売中", price:336600, capacity:601, width:685, doorType:"フレンチドア", doors:6,
      freezerTotal:144, vegetable:125, vegetablePos:"下段", energy:259, autoIce:true, smartphone:true,
      features:["601L・幅68.5cm","霜つき抑制冷凍","クーリングアシストルーム","KitchenPocketアプリ対応"],
      source:"https://www.yodobashi.com/?word=NR-F60WX3-K", verifiedAt:"2026-08-28"
    },
    {
      maker:"Panasonic", model:"NR-F65WX3-K", status:"発売中", price:356400, capacity:650, width:750, doorType:"フレンチドア", doors:6,
      freezerTotal:156, vegetable:135, vegetablePos:"下段", energy:281, autoIce:true, smartphone:true,
      features:["650L・幅75cm","霜つき抑制冷凍","135L野菜室","KitchenPocketアプリ対応"],
      source:"https://www.yodobashi.com/?word=NR-F65WX3-K", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-MZ60N-W", status:"発売中", price:374000, capacity:602, width:685, doorType:"フレンチドア", doors:6,
      freezerTotal:139, vegetable:115, vegetablePos:"真ん中", energy:286, autoIce:true, smartphone:true,
      features:["602L・幅68.5cm","真ん中朝どれ野菜室","切れちゃう瞬冷凍A.I.","スマートフォン連携"],
      source:"https://www.yodobashi.com/?word=MR-MZ60N-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-WZ61N-W", status:"発売中", price:352000, capacity:608, width:685, doorType:"フレンチドア", doors:6,
      freezerTotal:144, vegetable:114, vegetablePos:"下段", energy:273, autoIce:true, smartphone:true,
      features:["608L・幅68.5cm","冷凍室が真ん中","切れちゃう瞬冷凍A.I.","スマートフォン連携"],
      source:"https://www.yodobashi.com/?word=MR-WZ61N-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-WXD70N-W", status:"発売中", price:374000, capacity:700, width:800, doorType:"フレンチドア", doors:6,
      freezerTotal:163, vegetable:134, vegetablePos:"下段", energy:310, autoIce:true, smartphone:true,
      features:["700L・幅80cm","全室独立おまかせA.I.","切れちゃう瞬冷凍A.I.","スマートフォン連携"],
      source:"https://www.yodobashi.com/?word=MR-WXD70N-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"HITACHI", model:"R-HWC62Y-N", status:"発売中", price:348000, capacity:617, width:685, doorType:"フレンチドア", doors:6,
      freezerTotal:158, vegetable:118, vegetablePos:"下段", energy:270, autoIce:true, smartphone:true,
      features:["617L・幅68.5cm","まんなか3段大容量冷凍","特鮮氷温ルーム","スマートフォン連携"],
      source:"https://www.yodobashi.com/?word=R-HWC62Y-N", verifiedAt:"2026-08-28"
    },
    {
      maker:"TOSHIBA", model:"GR-A600FH-EW", status:"発売中", price:227810, capacity:601, width:685, doorType:"フレンチドア", doors:6,
      freezerTotal:142, vegetable:132, vegetablePos:"真ん中", energy:311, autoIce:true, smartphone:false,
      features:["601L・幅68.5cm","132L真ん中野菜室","速鮮チルド＆解凍モード","大容量スタンダードモデル"],
      source:"https://www.yodobashi.com/?word=GR-A600FH%28EW%29", verifiedAt:"2026-08-28"
    },
    {
      maker:"SHARP", model:"SJ-MF61R-H", status:"発売中", price:336880, capacity:607, width:785, doorType:"フレンチドア", doors:6,
      freezerTotal:154, vegetable:110, vegetablePos:"真ん中", energy:290, autoIce:true, smartphone:true,
      features:["607L・奥行63cm薄型","ピラーレスフレンチドア","雪下シャキット野菜室","COCORO HOME AI"],
      source:"https://www.yodobashi.com/?word=SJ-MF61R-H", verifiedAt:"2026-08-28"
    }
  ];
  additions.forEach(item=>{
    if(!products.some(p=>p.model===item.model)) products.push(item);
  });
})();