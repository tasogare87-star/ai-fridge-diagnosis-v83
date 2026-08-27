// v8.10 verified installation-depth metadata
// Only values confirmed from manufacturer specification pages are added here.
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

  let verified=0;
  products.forEach(p=>{
    const meta=depthByModel[p.model];
    if(!meta) return;
    if(Number.isFinite(meta.depth)) p.depth=meta.depth;
    if(Number.isFinite(meta.installDepth)) p.installDepth=meta.installDepth;
    p.depthVerifiedAt=verifiedAt;
    p.depthSource=meta.source;
    verified++;
  });

  window.__fridgeDepthCoverage={verified,total:products.length,verifiedAt};
})();
