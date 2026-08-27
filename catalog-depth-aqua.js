// Verified AQUA installation-depth metadata for all standard diagnosis models.
// Source policy: manufacturer official product/specification pages only.
(function(){
  const verifiedAt='2026-08-28';
  const rules=[
    ['AQR-TZA52A',{depth:635,installDepth:635,source:'https://aqua-has.com/product/tza52a/'}],
    ['AQR-TZ52A',{depth:635,installDepth:635,source:'https://aqua-has.com/product/tz52a/'}],
    ['AQR-TZ42A',{depth:635,installDepth:635,source:'https://aqua-has.com/product/tz42a/'}],
    ['AQR-TXA50A',{depth:667,installDepth:670,source:'https://aqua-has.com/product/txa50a/'}],
    ['AQR-TX51A',{depth:667,installDepth:670,source:'https://aqua-has.com/product/tx51a/'}],
    ['AQR-36A',{depth:685,installDepth:702.5,source:'https://aqua-has.com/product/36a/'}],
    ['AQR-S26A',{depth:685,installDepth:701,source:'https://aqua-has.com/product/s26a/'}],
    ['AQR-26A',{depth:685,installDepth:701,source:'https://aqua-has.com/product/26a/'}],
    ['AQR-23A',{depth:601,installDepth:601,source:'https://aqua-has.com/product/23a/'}],
    ['AQR-SBS48A',{depth:667,installDepth:697,source:'https://aqua-has.com/product/sbs48a/'}],
    ['AQR-VZA45A',{depth:715,installDepth:720,source:'https://aqua-has.com/product/vza45a/'}],
    ['AQR-V46A',{depth:715,installDepth:720,source:'https://aqua-has.com/product/v46a/'}],
    ['AQR-V43A',{depth:715,installDepth:720,source:'https://aqua-has.com/product/v43a/'}],
    ['AQR-S40A',{depth:600,installDepth:600,source:'https://aqua-has.com/product/s40a/'}],
    ['AQR-S31A',{depth:600,installDepth:600,source:'https://aqua-has.com/product/s31a/'}],
    ['AQR-31A',{depth:600,installDepth:600,source:'https://aqua-has.com/product/31a/'}],
    ['AQR-S36A',{depth:685,installDepth:702.5,source:'https://aqua-has.com/product/s36a/'}],
    ['AQR-14A',{depth:568,installDepth:568,source:'https://aqua-has.com/product/14a/'}],
    ['AQR-17A',{depth:601,installDepth:601,source:'https://aqua-has.com/product/17a/'}],
    ['AQR-20A',{depth:601,installDepth:601,source:'https://aqua-has.com/product/20a/'}],
    ['AQR-16A',{depth:600,installDepth:600,source:'https://aqua-has.com/product/16a/'}]
  ];

  function metadataFor(model){
    const hit=rules.find(([prefix])=>String(model||'').startsWith(prefix));
    return hit?hit[1]:null;
  }

  products.forEach(p=>{
    if(p.maker!=='AQUA') return;
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
  window.__aquaDepthCoverage={
    installVerified:products.filter(p=>p.maker==='AQUA'&&Number.isFinite(p.installDepth)).length,
    total:products.filter(p=>p.maker==='AQUA').length,
    verifiedAt
  };
})();
