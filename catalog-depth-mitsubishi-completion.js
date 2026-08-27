// Mitsubishi Electric depth completion for the remaining production models.
// All values are from Mitsubishi Electric WIN2K official specification tables.
(function(){
  const verifiedAt='2026-08-28';
  const rules=[
    ['MR-WXD70N',{depth:738,installDepth:748,source:'https://www.mitsubishielectric.co.jp/ldg/wink/ssl/sp/displayProductSpec.do?ccd=10201010&pid=357256'}],
    ['MR-MZ60N',{depth:738,installDepth:748,source:'https://www.mitsubishielectric.co.jp/ldg/wink/ssl/sp/displayProductSpec.do?ccd=10201010&pid=357232'}],
    ['MR-JM54N',{depth:699,installDepth:709,source:'https://www.mitsubishielectric.co.jp/ldg/wink/ssl/sp/displayProductSpec.do?ccd=10201010&pid=357284'}],
    ['MR-WZ50N',{depth:650,installDepth:660,source:'https://www.mitsubishielectric.co.jp/ldg/wink/ssl/sp/displayProductSpec.do?ccd=10201010&pid=357243'}],
    ['MR-JM49N',{depth:650,installDepth:660,source:'https://www.mitsubishielectric.co.jp/ldg/wink/ssl/sp/displayProductSpec.do?ccd=10201010&pid=357280'}],
    ['MR-WXD47LN',{depth:699,installDepth:709,source:'https://www.mitsubishielectric.co.jp/ldg/wink/ssl/sp/displayProductSpec.do?ccd=10201010&pid=357259'}],
    ['MR-MD45N',{depth:699,installDepth:709,source:'https://www.mitsubishielectric.co.jp/ldg/wink/ssl/sp/displayProductSpec.do?ccd=10201010&pid=357235'}],
    ['MR-N40M',{depth:699,installDepth:703,source:'https://www.mitsubishielectric.co.jp/ldg/wink/ssl/sp/displayProductSpec.do?ccd=10201010&pid=354340'}]
  ];

  function metadataFor(model){
    const hit=rules.find(([prefix])=>String(model||'').startsWith(prefix));
    return hit?hit[1]:null;
  }

  products.forEach(p=>{
    if(p.maker!=='MITSUBISHI ELECTRIC') return;
    const meta=metadataFor(p.model);
    if(!meta) return;
    p.depth=meta.depth;
    p.installDepth=meta.installDepth;
    p.depthVerifiedAt=verifiedAt;
    p.depthSource=meta.source;
  });

  const verified=products.filter(p=>Number.isFinite(p.depth)||Number.isFinite(p.installDepth)).length;
  const installVerified=products.filter(p=>Number.isFinite(p.installDepth)).length;
  const bodyOnlyVerified=products.filter(p=>Number.isFinite(p.depth)&&!Number.isFinite(p.installDepth)).length;
  window.__fridgeDepthCoverage={verified,installVerified,bodyOnlyVerified,total:products.length,verifiedAt};
  window.__mitsubishiDepthCoverage={
    verified:products.filter(p=>p.maker==='MITSUBISHI ELECTRIC'&&(Number.isFinite(p.depth)||Number.isFinite(p.installDepth))).length,
    installVerified:products.filter(p=>p.maker==='MITSUBISHI ELECTRIC'&&Number.isFinite(p.installDepth)).length,
    total:products.filter(p=>p.maker==='MITSUBISHI ELECTRIC').length,
    verifiedAt
  };
})();
