// v8.9 production catalog extension
// Only models with Yodobashi listing/price evidence and manufacturer specs are added here.
(function(){
  const additions=[
    {
      maker:"Panasonic",
      model:"NR-B16C3-W",
      status:"発売中",
      price:68080,
      capacity:156,
      width:497,
      doorType:"右開き",
      doors:2,
      freezerTotal:60,
      vegetable:null,
      vegetablePos:null,
      energy:271,
      autoIce:false,
      smartphone:false,
      features:["60L大容量冷凍室","幅49.7cmのコンパクト設計","約19dBの静音設計"],
      source:"https://www.yodobashi.com/product/100000001009448941/",
      verifiedAt:"2026-08-28"
    },
    {
      maker:"MITSUBISHI ELECTRIC",
      model:"MR-P17M-W",
      status:"発売中",
      price:67620,
      capacity:168,
      width:480,
      doorType:"右開き",
      doors:2,
      freezerTotal:46,
      vegetable:null,
      vegetablePos:null,
      energy:304,
      autoIce:false,
      smartphone:false,
      features:["幅48cmのコンパクト設計","耐熱フルフラットトップテーブル","全段ガラスシェルフ"],
      source:"https://www.yodobashi.com/?word=MR-P17M-W",
      verifiedAt:"2026-08-28"
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