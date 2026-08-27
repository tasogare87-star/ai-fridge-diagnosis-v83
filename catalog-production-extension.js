// v8.9 production catalog extension
// Only models with Yodobashi listing/price evidence and manufacturer specs are added here.
(function(){
  const additions=[
    {
      maker:"Panasonic", model:"NR-B16C3-W", status:"発売中", price:68080, capacity:156, width:497, doorType:"右開き", doors:2,
      freezerTotal:60, vegetable:null, vegetablePos:null, energy:271, autoIce:false, smartphone:false,
      features:["60L大容量冷凍室","幅49.7cmのコンパクト設計","約19dBの静音設計"], source:"https://www.yodobashi.com/product/100000001009448941/", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-P17M-W", status:"発売中", price:67620, capacity:168, width:480, doorType:"右開き", doors:2,
      freezerTotal:46, vegetable:null, vegetablePos:null, energy:304, autoIce:false, smartphone:false,
      features:["幅48cmのコンパクト設計","耐熱フルフラットトップテーブル","全段ガラスシェルフ"], source:"https://www.yodobashi.com/?word=MR-P17M-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"Panasonic", model:"NR-B253T-K", status:"発売中", price:64200, capacity:248, width:555, doorType:"右開き", doors:2,
      freezerTotal:62, vegetable:23, vegetablePos:null, energy:311, autoIce:false, smartphone:false,
      features:["62Lトップフリーザー","チルドルーム","冷蔵室内23L野菜ケース","幅55.5cm"], source:"https://www.yodobashi.com/?word=NR-B253T-K", verifiedAt:"2026-08-28"
    },
    {
      maker:"TOSHIBA", model:"GR-Y29SC-WU", status:"発売中", price:78510, capacity:294, width:600, doorType:"右開き", doors:3,
      freezerTotal:82, vegetable:70, vegetablePos:"真ん中", energy:319, autoIce:true, smartphone:false,
      features:["真ん中野菜室","82L・3段冷凍室","かってに氷","選べる節電モード"], source:"https://www.yodobashi.com/?word=GR-Y29SC-WU", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-CX30M-W", status:"発売中", price:124800, capacity:300, width:540, doorType:"右開き", doors:3,
      freezerTotal:70, vegetable:60, vegetablePos:"真ん中", energy:319, autoIce:true, smartphone:false,
      features:["氷点下ストッカー","70L冷凍室","真ん中野菜室","幅54cmスリム設計"], source:"https://www.yodobashi.com/?word=MR-CX30M-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"Panasonic", model:"NR-C33ES2-W", status:"発売中", price:128700, capacity:326, width:600, doorType:"右開き", doors:3,
      freezerTotal:72, vegetable:81, vegetablePos:"真ん中", energy:322, autoIce:true, smartphone:false,
      features:["真ん中野菜室","72L冷凍室","自動製氷","奥行60cm"], source:"https://www.yodobashi.com/?word=NR-C33ES2-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"Panasonic", model:"NR-C33ES2L-W", status:"発売中", price:128700, capacity:326, width:600, doorType:"左開き", doors:3,
      freezerTotal:72, vegetable:81, vegetablePos:"真ん中", energy:322, autoIce:true, smartphone:false,
      features:["左開き仕様","真ん中野菜室","72L冷凍室","自動製氷"], source:"https://www.yodobashi.com/community/product/100000001009189465/all/02/review.html", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-CX33M-W", status:"発売中", price:129800, capacity:330, width:600, doorType:"右開き", doors:3,
      freezerTotal:80, vegetable:70, vegetablePos:"真ん中", energy:325, autoIce:true, smartphone:false,
      features:["氷点下ストッカーD A.I.","80L冷凍室","真ん中野菜室","ロータイプ"], source:"https://www.yodobashi.com/?word=MR-CX33M-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-CX33ML-W", status:"発売中", price:129800, capacity:330, width:600, doorType:"左開き", doors:3,
      freezerTotal:80, vegetable:70, vegetablePos:"真ん中", energy:325, autoIce:true, smartphone:false,
      features:["左開き仕様","氷点下ストッカーD A.I.","80L冷凍室","真ん中野菜室"], source:"https://www.yodobashi.com/?word=MR-CX33ML-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"AQUA", model:"AQR-36A(DS)", status:"発売中", price:129700, capacity:362, width:600, doorType:"右開き", doors:4,
      freezerTotal:100, vegetable:78, vegetablePos:"下段", energy:303, autoIce:false, smartphone:false,
      features:["100Lまんなか2段冷凍室","クイック冷凍","段違い野菜バスケット","幅60cm"], source:"https://www.yodobashi.com/product/100000001009657265/", verifiedAt:"2026-08-28"
    },
    {
      maker:"Panasonic", model:"NR-C37ES2-W", status:"発売中", price:138600, capacity:365, width:600, doorType:"右開き", doors:3,
      freezerTotal:72, vegetable:81, vegetablePos:"真ん中", energy:330, autoIce:true, smartphone:false,
      features:["真ん中野菜室","72L冷凍室","自動製氷","奥行60cm"], source:"https://www.yodobashi.com/community/product/100000001009189459/4/review.html", verifiedAt:"2026-08-28"
    },
    {
      maker:"Panasonic", model:"NR-C37ES2L-W", status:"発売中", price:138600, capacity:365, width:600, doorType:"左開き", doors:3,
      freezerTotal:72, vegetable:81, vegetablePos:"真ん中", energy:330, autoIce:true, smartphone:false,
      features:["左開き仕様","真ん中野菜室","72L冷凍室","自動製氷"], source:"https://www.yodobashi.com/?word=NR-C37ES2L-W", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-CX37M-H", status:"発売中", price:134360, capacity:365, width:600, doorType:"右開き", doors:3,
      freezerTotal:80, vegetable:70, vegetablePos:"真ん中", energy:335, autoIce:true, smartphone:false,
      features:["氷点下ストッカーD A.I.","80L冷凍室","真ん中野菜室","幅60cm"], source:"https://www.yodobashi.com/product/100000001009082780/", verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC", model:"MR-CX37ML-W", status:"発売中", price:148000, capacity:365, width:600, doorType:"左開き", doors:3,
      freezerTotal:80, vegetable:70, vegetablePos:"真ん中", energy:335, autoIce:true, smartphone:false,
      features:["左開き仕様","氷点下ストッカーD A.I.","80L冷凍室","真ん中野菜室"], source:"https://www.yodobashi.com/product/100000001009082781/", verifiedAt:"2026-08-28"
    },
    {
      maker:"SHARP", model:"SJ-X373P-N", status:"発売中", price:140770, capacity:374, width:600, doorType:"左右開き", doors:3,
      freezerTotal:97, vegetable:70, vegetablePos:"真ん中", energy:354, autoIce:false, smartphone:false,
      features:["どっちもドア","97L大容量冷凍室","真ん中シャキット野菜室","3段＆段違いケース"], source:"https://www.yodobashi.com/product/100000001009361770/", verifiedAt:"2026-08-28"
    }
  ];

  additions.forEach(item=>{
    if(!products.some(p=>p.model===item.model)) products.push(item);
  });

  const sharp=products.find(p=>p.model==='SJ-TD18R-W');
  if(sharp){
    sharp.price=68610;
    sharp.verifiedAt="2026-08-28";
  }
})();