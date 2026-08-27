// v8.9 production catalog batch 17
// Panasonic left-door current model staged after current Yodobashi sales evidence
// and Panasonic official specification verification on 2026-08-28.
(function(){
  const additions=[
    {maker:"Panasonic",model:"NR-C33JS2L-C",status:"発売中",price:168300,capacity:326,width:600,doorType:"左開き",doors:3,freezerTotal:72,vegetable:81,vegetablePos:"真ん中",energy:322,autoIce:true,smartphone:false,features:["326L・幅60cm・奥行60cm・左開き","81L真ん中野菜室","72L冷凍室","ナノイーX・自動製氷"],source:"https://www.yodobashi.com/?word=NR-C33JS2L-C",verifiedAt:"2026-08-28"}
  ];
  additions.forEach(item=>{if(!products.some(p=>p.model===item.model)) products.push(item);});
})();
