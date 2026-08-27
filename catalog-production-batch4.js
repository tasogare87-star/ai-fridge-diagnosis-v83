// v8.9 production catalog batch 4
// Verified 400L-class models across major makers.
(function(){
  const additions=[
    {
      maker:"Panasonic", model:"NR-E41RY3-C", status:"発売中", price:189800, capacity:410, width:600, doorType:"右開き", doors:5,
      freezerTotal:79, vegetable:78, vegetablePos:"下段", energy:251, autoIce:true, smartphone:false,
      features:["幅60cm・410L","霜つき抑制冷凍","奥まで見えるフルオープン","シャキシャキ野菜室"],
      source:"https://www.yodobashi.com/?word=NR-E41RY3-C", verifiedAt:"2026-08-28"
    },
    {
      maker:"Panasonic", model:"NR-E41RY3L-C", status:"発売中", price:189800, capacity:410, width:600, doorType:"左開き", doors:5,
      freezerTotal:79, vegetable:78, vegetablePos:"下段", energy:251, autoIce:true, smartphone:false,
      features:["左開き仕様","幅60cm・410L","霜つき抑制冷凍","シャキシャキ野菜室"],
      source:"https://www.yodobashi.com/?word=NR-E41RY3L-C", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-N40M-W", status:"発売中", price:129800, capacity:403, width:600, doorType:"右開き", doors:4,
      freezerTotal:91, vegetable:80, vegetablePos:null, energy:325, autoIce:true, smartphone:false,
      features:["幅60cm・403L","氷点下ストッカーA.I.","ワイドチルド","フリーアクセスデザイン"],
      source:"https://www.yodobashi.com/?word=MR-N40M-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"TOSHIBA", model:"GR-A41GXH-EW", status:"発売中", price:169800, capacity:411, width:600, doorType:"右開き", doors:5,
      freezerTotal:91, vegetable:92, vegetablePos:"真ん中", energy:315, autoIce:true, smartphone:false,
      features:["野菜室がまんなか","うるおいラップ野菜室","一気冷凍","幅60cm・411L"],
      source:"https://www.yodobashi.com/?word=GR-A41GXH%28EW%29", verifiedAt:"2026-08-28"
    },
    {
      maker:"TOSHIBA", model:"GR-A41GXHL-EW", status:"発売中", price:169800, capacity:411, width:600, doorType:"左開き", doors:5,
      freezerTotal:91, vegetable:92, vegetablePos:"真ん中", energy:315, autoIce:true, smartphone:false,
      features:["左開き仕様","野菜室がまんなか","うるおいラップ野菜室","一気冷凍"],
      source:"https://www.yodobashi.com/?word=GR-A41GXHL%28EW%29", verifiedAt:"2026-08-28"
    },
    {
      maker:"SHARP", model:"SJ-XW41R-W", status:"発売中", price:178000, capacity:408, width:600, doorType:"左右開き", doors:5,
      freezerTotal:99, vegetable:73, vegetablePos:"真ん中", energy:251, autoIce:true, smartphone:false,
      features:["オートクローズどっちもドア","プラズマクラスター","真ん中シャキット野菜室","おいそぎ冷凍"],
      source:"https://www.yodobashi.com/?word=SJ-XW41R-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"AQUA", model:"AQR-S40A-W", status:"発売中", price:127880, capacity:401, width:600, doorType:"右開き", doors:5,
      freezerTotal:84, vegetable:91, vegetablePos:"真ん中", energy:242, autoIce:true, smartphone:false,
      features:["奥行60cm薄型","真ん中野菜室","自動製氷","年間242kWh省エネ"],
      source:"https://www.yodobashi.com/?word=AQR-S40A%28W%29", verifiedAt:"2026-08-28"
    },
    {
      maker:"AQUA", model:"AQR-S40AL-W", status:"発売中", price:127880, capacity:401, width:600, doorType:"左開き", doors:5,
      freezerTotal:84, vegetable:91, vegetablePos:"真ん中", energy:242, autoIce:true, smartphone:false,
      features:["左開き仕様","奥行60cm薄型","真ん中野菜室","自動製氷"],
      source:"https://www.yodobashi.com/?word=AQR-S40AL%28W%29", verifiedAt:"2026-08-28"
    }
  ];
  additions.forEach(item=>{
    if(!products.some(p=>p.model===item.model)) products.push(item);
  });
})();