// v8.9 production catalog batch 2
// Additional verified Yodobashi-listed models. Loaded after catalog-production-extension.js.
(function(){
  const additions=[
    {
      maker:"TOSHIBA",
      model:"GR-Y33SC-WU",
      status:"発売中",
      price:138000,
      capacity:326,
      width:600,
      doorType:"右開き",
      doors:3,
      freezerTotal:82,
      vegetable:70,
      vegetablePos:"真ん中",
      energy:325,
      autoIce:true,
      smartphone:false,
      features:["真ん中野菜室","82L・3段冷凍室","かってに氷","選べる節電モード"],
      source:"https://www.yodobashi.com/product/100000001009458339/",
      verifiedAt:"2026-08-28"
    }
  ];

  additions.forEach(item=>{
    if(!products.some(p=>p.model===item.model)) products.push(item);
  });
})();