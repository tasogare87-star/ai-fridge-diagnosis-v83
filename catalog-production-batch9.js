// v8.9 production catalog batch 9
// Panasonic current-series gap fill from official lineup + current Yodobashi sales evidence.
// Color-only variants are collapsed; meaningful left/right variants remain separate.
(function(){
  const additions=[
    {
      maker:"Panasonic", model:"NR-F52BR3", status:"発売中", price:217800, capacity:515, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:132, vegetable:104, vegetablePos:"真ん中", energy:286, autoIce:true, smartphone:false,
      features:["515L・幅65cm","野菜室が真ん中","103L冷凍室＋29L上段冷凍室","霜つき抑制冷凍"],
      source:"https://www.yodobashi.com/?word=NR-F52BR3", verifiedAt:"2026-08-28"
    },
    {
      maker:"Panasonic", model:"NR-F50HY3", status:"発売中", price:267300, capacity:501, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:129, vegetable:104, vegetablePos:"下段", energy:258, autoIce:true, smartphone:true,
      features:["501L・幅65cm・奥行65cm","霜つき抑制冷凍","クーリングアシストルーム","KitchenPocketアプリ対応"],
      source:"https://www.yodobashi.com/?word=NR-F50HY3", verifiedAt:"2026-08-28"
    },
    {
      maker:"Panasonic", model:"NR-F45HY3", status:"発売中", price:247500, capacity:450, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:129, vegetable:104, vegetablePos:"下段", energy:261, autoIce:true, smartphone:false,
      features:["450L・幅65cm・奥行65cm","霜つき抑制冷凍","クーリングアシストルーム","高さ172cm"],
      source:"https://www.yodobashi.com/?word=NR-F45HY3", verifiedAt:"2026-08-28"
    },
    {
      maker:"Panasonic", model:"NR-F54EY3", status:"発売中", price:257400, capacity:542, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:141, vegetable:114, vegetablePos:"下段", energy:296, autoIce:true, smartphone:false,
      features:["542L・幅65cm","112L冷凍室＋29L新鮮凍結ルーム","霜つき抑制冷凍","シャキシャキ野菜室"],
      source:"https://www.yodobashi.com/?word=NR-F54EY3", verifiedAt:"2026-08-28"
    },
    {
      maker:"Panasonic", model:"NR-E45RY3", status:"発売中", price:220000, capacity:450, width:600, doorType:"右開き", doors:5,
      freezerTotal:111, vegetable:90, vegetablePos:"下段", energy:266, autoIce:true, smartphone:false,
      features:["450L・幅60cm","93L冷凍室＋18L新鮮凍結ルーム","霜つき抑制冷凍","奥行64.8cm"],
      source:"https://www.yodobashi.com/?word=NR-E45RY3", verifiedAt:"2026-08-28"
    },
    {
      maker:"Panasonic", model:"NR-E45RY3L", status:"発売中", price:220000, capacity:450, width:600, doorType:"左開き", doors:5,
      freezerTotal:111, vegetable:90, vegetablePos:"下段", energy:266, autoIce:true, smartphone:false,
      features:["左開き仕様","450L・幅60cm","93L冷凍室＋18L新鮮凍結ルーム","奥行64.8cm"],
      source:"https://www.yodobashi.com/?word=NR-E45RY3L", verifiedAt:"2026-08-28"
    },
    {
      maker:"Panasonic", model:"NR-C37WS2", status:"発売中", price:188100, capacity:365, width:600, doorType:"右開き", doors:3,
      freezerTotal:72, vegetable:81, vegetablePos:"真ん中", energy:330, autoIce:true, smartphone:false,
      features:["365L・奥行60cm","フルフラットガラスドア","真ん中野菜室","ナノイーX"],
      source:"https://www.yodobashi.com/?word=NR-C37WS2", verifiedAt:"2026-08-28"
    },
    {
      maker:"Panasonic", model:"NR-C37WS2L", status:"発売中", price:188100, capacity:365, width:600, doorType:"左開き", doors:3,
      freezerTotal:72, vegetable:81, vegetablePos:"真ん中", energy:330, autoIce:true, smartphone:false,
      features:["左開き仕様","365L・奥行60cm","フルフラットガラスドア","真ん中野菜室"],
      source:"https://www.yodobashi.com/?word=NR-C37WS2L", verifiedAt:"2026-08-28"
    },
    {
      maker:"Panasonic", model:"NR-C33JS2", status:"発売中", price:168300, capacity:326, width:600, doorType:"右開き", doors:3,
      freezerTotal:72, vegetable:81, vegetablePos:"真ん中", energy:322, autoIce:true, smartphone:false,
      features:["326L・奥行60cm","ナノイーX","真ん中野菜室","奥まで見えるフルオープン"],
      source:"https://www.yodobashi.com/?word=NR-C33JS2", verifiedAt:"2026-08-28"
    },
    {
      maker:"Panasonic", model:"NR-C28BC3-W", status:"発売中", price:99990, capacity:284, width:541, doorType:"右開き", doors:3,
      freezerTotal:67, vegetable:71, vegetablePos:"真ん中", energy:314, autoIce:false, smartphone:false,
      features:["284L・幅54.1cm","真ん中野菜室","67L冷凍室","奥行62.5cm"],
      source:"https://www.yodobashi.com/?word=NR-C28BC3-W", verifiedAt:"2026-08-28"
    }
  ];
  additions.forEach(item=>{
    if(!products.some(p=>p.model===item.model)) products.push(item);
  });
})();