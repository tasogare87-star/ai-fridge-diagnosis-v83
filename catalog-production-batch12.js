// v8.9 production catalog batch 12
// Hitachi current models promoted after Yodobashi sales evidence and
// manufacturer specification verification on 2026-08-28.
(function(){
  const additions=[
    {
      maker:"HITACHI", model:"R-WXC74X-X", status:"発売中", price:420570, capacity:735, width:880, doorType:"フレンチドア", doors:6,
      freezerTotal:185, vegetable:137, vegetablePos:"下段", energy:310, autoIce:true, smartphone:true,
      features:["735L・幅88cm","らくうま！ひろin冷凍プラス","新鮮スリープ野菜室","日立冷蔵庫コンシェルジュアプリ"],
      source:"https://www.yodobashi.com/?word=R-WXC74X", verifiedAt:"2026-08-28"
    },
    {
      maker:"HITACHI", model:"R-GXCC67X-H", status:"発売中", price:418000, capacity:670, width:880, doorType:"フレンチドア", doors:6,
      freezerTotal:163, vegetable:124, vegetablePos:"下段", energy:316, autoIce:true, smartphone:true,
      features:["670L・奥行スリム65.4cm","らくうま！ひろin冷凍プラス","冷蔵庫カメラ","日立冷蔵庫コンシェルジュアプリ"],
      source:"https://www.yodobashi.com/?word=R-GXCC67X", verifiedAt:"2026-08-28"
    },
    {
      maker:"HITACHI", model:"R-GZC67X-XH", status:"発売中", price:503800, capacity:670, width:880, doorType:"フレンチドア", doors:6,
      freezerTotal:163, vegetable:124, vegetablePos:"下段", energy:316, autoIce:true, smartphone:true,
      features:["670L・奥行スリム65.4cm","真空氷温ルーム","らくうま！ひろin冷凍プラス","日立冷蔵庫コンシェルジュアプリ"],
      source:"https://www.yodobashi.com/?word=R-GZC67X", verifiedAt:"2026-08-28"
    },
    {
      maker:"HITACHI", model:"R-HZC62Y-XH", status:"発売中", price:378000, capacity:617, width:685, doorType:"フレンチドア", doors:6,
      freezerTotal:158, vegetable:118, vegetablePos:"下段", energy:267, autoIce:true, smartphone:true,
      features:["617L・幅68.5cm","真空氷温ルーム","デリシャス冷凍・霜ブロック","ハピネスアップ対応"],
      source:"https://www.yodobashi.com/?word=R-HZC62Y", verifiedAt:"2026-08-28"
    },
    {
      maker:"HITACHI", model:"R-HXCC62X-X", status:"発売中", price:371800, capacity:617, width:685, doorType:"フレンチドア", doors:6,
      freezerTotal:158, vegetable:118, vegetablePos:"下段", energy:267, autoIce:true, smartphone:true,
      features:["617L・幅68.5cm","冷蔵庫カメラ","らくうま！ひろin冷凍プラス","日立冷蔵庫コンシェルジュアプリ"],
      source:"https://www.yodobashi.com/?word=R-HXCC62X", verifiedAt:"2026-08-28"
    },
    {
      maker:"HITACHI", model:"R-HZC54Y-XH", status:"発売中", price:348000, capacity:540, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:137, vegetable:103, vegetablePos:"下段", energy:252, autoIce:true, smartphone:true,
      features:["540L・幅65cm","真空氷温ルーム","デリシャス冷凍・霜ブロック","ハピネスアップ対応"],
      source:"https://www.yodobashi.com/?word=R-HZC54Y", verifiedAt:"2026-08-28"
    },
    {
      maker:"HITACHI", model:"R-HXCC54X-X", status:"発売中", price:338800, capacity:540, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:137, vegetable:103, vegetablePos:"下段", energy:252, autoIce:true, smartphone:true,
      features:["540L・幅65cm","冷蔵庫カメラ","らくうま！ひろin冷凍プラス","日立冷蔵庫コンシェルジュアプリ"],
      source:"https://www.yodobashi.com/?word=R-HXCC54X", verifiedAt:"2026-08-28"
    },
    {
      maker:"HITACHI", model:"R-H49Y-S", status:"発売中", price:227530, capacity:485, width:650, doorType:"フレンチドア", doors:6,
      freezerTotal:121, vegetable:91, vegetablePos:"下段", energy:276, autoIce:true, smartphone:false,
      features:["485L・幅65cm","まんなか3段大容量冷凍","特鮮氷温ルーム","うるおい野菜室"],
      source:"https://www.yodobashi.com/?word=R-H49Y", verifiedAt:"2026-08-28"
    }
  ];
  additions.forEach(item=>{
    if(!products.some(p=>p.model===item.model)) products.push(item);
  });
})();
