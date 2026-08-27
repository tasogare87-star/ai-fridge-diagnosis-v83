// v8.10+ verified installation-depth metadata
// Only values confirmed from manufacturer specification / current product pages are added here.
// If only body depth is verified, installDepth is intentionally omitted so the UI keeps the model as "要確認" rather than declaring installation fit.
(function(){
  const verifiedAt='2026-08-28';
  const depthByModel={
    'NR-E47BR3-C':{depth:699,installDepth:699,source:'https://panasonic.jp/reizo/products/NR-E47BR3/spec.html'},
    'NR-E47BR3L-C':{depth:699,installDepth:699,source:'https://panasonic.jp/reizo/products/NR-E47BR3/spec.html'},
    'NR-F55HY3-N':{depth:699,installDepth:699,source:'https://panasonic.jp/reizo/products/NR-F55HY3/spec.html'},
    'MR-MZ49N-H':{depth:650,installDepth:660,source:'https://www.mitsubishielectric.co.jp/ldg/wink/ssl/sp/displayProductSpec.do?ccd=10201010&pid=357223'},
    'R-HWS47X N':{installDepth:701,source:'https://kadenfan.hitachi.co.jp/rei/lineup/rhws47x/spec.html'},
    'R-HWS47XL N':{installDepth:701,source:'https://kadenfan.hitachi.co.jp/rei/lineup/rhws47x/spec.html'},
    'R-H54Y-S':{installDepth:701,source:'https://kadenfan.hitachi.co.jp/rei/lineup/rh54y/spec.html'},
    'GR-Y510FK(EW)':{depth:699,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-y510fk/'},
    'SJ-MF43R-H':{depth:630,installDepth:637,source:'https://jp.sharp/reizo/products/sjmf43r/spec/'},
    'SJ-TD18R-W':{depth:600,installDepth:646,source:'https://jp.sharp/reizo/products/sjtd18r/spec/'},
    'AQR-V43A(S)':{depth:715,installDepth:720,source:'https://aqua-has.com/product/v43a/'},
    'AQR-V43AL(S)':{depth:715,installDepth:720,source:'https://aqua-has.com/product/v43a/'}
  };

  // Prefix rules are used only when all diagnostic variants under that base model share the same cabinet depth.
  // Left/right and collapsed color variants therefore inherit the same verified dimension without duplicating entries.
  const depthByPrefix=[
    ['MR-WZ61N',{depth:738,installDepth:748,source:'https://www.mitsubishielectric.co.jp/ldg/wink/ssl/sp/displayProductSpec.do?ccd=10201010&pid=357252'}],
    ['MR-WZ55N',{depth:699,installDepth:709,source:'https://www.mitsubishielectric.co.jp/ldg/wink/ssl/sp/displayProductSpec.do?ccd=10201010&pid=357247'}],
    ['MR-GW52N',{depth:699,installDepth:709,source:'https://www.mitsubishielectric.co.jp/ldg/wink/ssl/sp/displayProductSpec.do?ccd=10201010&pid=367332'}],
    ['MR-JW50N',{depth:650,installDepth:660,source:'https://www.mitsubishielectric.co.jp/ldg/wink/ssl/sp/displayProductSpec.do?ccd=10201010&pid=357271'}],
    ['MR-CX37M',{depth:656,installDepth:660,source:'https://www.mitsubishielectric.co.jp/ldg/wink/sp/displayProductSpec.do?pid=354331'}],

    // Current-product pages below verify body depth only. Installation clearance remains a final-check item.
    ['MR-MZ54N',{depth:699,source:'https://www.mitsubishielectric.co.jp/ldg/wink/ssl/displayProduct.do?ccd=10201010&pid=357227'}],
    ['MR-JW55N',{depth:699,source:'https://www.mitsubishielectric.co.jp/ldg/wink/ssl/displayProduct.do?pid=357275'}],
    ['MR-BD46N',{depth:699,source:'https://www.mitsubishielectric.co.jp/ldg/wink/ssl/displayProduct.do?ccd=10201010&pid=357263'}],
    ['MR-CX33M',{depth:656,source:'https://www.mitsubishielectric.co.jp/home/reizouko/product/'}],
    ['MR-C33M',{depth:656,source:'https://www.mitsubishielectric.co.jp/home/reizouko/product/'}],
    ['MR-CX30M',{depth:656,source:'https://www.mitsubishielectric.co.jp/home/reizouko/product/'}],
    ['MR-CX27M',{depth:656,source:'https://www.mitsubishielectric.co.jp/home/reizouko/product/'}],
    ['MR-P17M',{depth:595,source:'https://www.mitsubishielectric.co.jp/home/reizouko/product/'}],
    ['MR-P15M',{depth:595,source:'https://www.mitsubishielectric.co.jp/home/reizouko/product/'}]
  ];

  function prefixMeta(model){
    const hit=depthByPrefix.find(([prefix])=>String(model||'').startsWith(prefix));
    return hit?hit[1]:null;
  }

  let verified=0;
  let installVerified=0;
  let bodyOnlyVerified=0;
  products.forEach(p=>{
    const meta=depthByModel[p.model]||prefixMeta(p.model);
    if(!meta) return;
    if(Number.isFinite(meta.depth)) p.depth=meta.depth;
    if(Number.isFinite(meta.installDepth)) p.installDepth=meta.installDepth;
    p.depthVerifiedAt=verifiedAt;
    p.depthSource=meta.source;
    verified++;
    if(Number.isFinite(meta.installDepth)) installVerified++;
    else if(Number.isFinite(meta.depth)) bodyOnlyVerified++;
  });

  window.__fridgeDepthCoverage={verified,installVerified,bodyOnlyVerified,total:products.length,verifiedAt};
})();
