// Verified Hitachi body-depth metadata.
// Hitachi's official store publishes external dimensions; unless a separate minimum installation depth
// has already been verified, these values remain body-only so the diagnosis requires final clearance confirmation.
(function(){
  const verifiedAt='2026-08-28';
  const rules=[
    ['R-WXC74X',{depth:738,source:'https://store.kadenfan.hitachi.co.jp/store/g/g191646/'}],
    ['R-GXCC67X',{depth:654,source:'https://kadenfan.hitachi.co.jp/rei/lineup/rgxcc67x/'}],
    ['R-GZC67X',{depth:654,source:'https://store.kadenfan.hitachi.co.jp/store/g/g191150/'}],
    ['R-HZC62Y',{depth:738,source:'https://store.kadenfan.hitachi.co.jp/store/g/g192206/'}],
    ['R-HWC62Y',{depth:740,source:'https://store.kadenfan.hitachi.co.jp/store/g/g192204/'}],
    ['R-HXCC62X',{depth:738,source:'https://store.kadenfan.hitachi.co.jp/store/g/g190751/'}],
    ['R-HZC54Y',{depth:699,source:'https://store.kadenfan.hitachi.co.jp/store/g/g192201/'}],
    ['R-HWC54Y',{depth:701,source:'https://store.kadenfan.hitachi.co.jp/store/g/g192200/'}],
    ['R-HXCC54X',{depth:699,source:'https://store.kadenfan.hitachi.co.jp/store/g/g191140/'}],
    ['R-H54Y',{depth:701,source:'https://store.kadenfan.hitachi.co.jp/store/g/g193329/'}],
    ['R-HWC49Y',{depth:651,source:'https://store.kadenfan.hitachi.co.jp/store/g/g192197/'}],
    ['R-H49Y',{depth:651,source:'https://store.kadenfan.hitachi.co.jp/store/g/g193328/'}],
    ['R-HWS47X',{depth:701,source:'https://kadenfan.hitachi.co.jp/rei/lineup/rhws47x/spec.html'}],
    ['R-K40T',{depth:672,source:'https://store.kadenfan.hitachi.co.jp/store/g/g188706/'}],
    ['R-V38X',{depth:665,source:'https://store.kadenfan.hitachi.co.jp/store/g/g191793/'}],
    ['R-V32X',{depth:655,source:'https://store.kadenfan.hitachi.co.jp/store/g/g191797/'}],
    ['R-27X',{depth:655,source:'https://store.kadenfan.hitachi.co.jp/store/g/g191792/'}]
  ];

  function metadataFor(model){
    const hit=rules.find(([prefix])=>String(model||'').startsWith(prefix));
    return hit?hit[1]:null;
  }

  products.forEach(p=>{
    if(p.maker!=='HITACHI') return;
    const meta=metadataFor(p.model);
    if(!meta) return;
    p.depth=meta.depth;
    // Never overwrite a separately verified minimum installation depth.
    p.depthVerifiedAt=verifiedAt;
    p.depthSource=meta.source;
  });

  const verified=products.filter(p=>Number.isFinite(p.depth)||Number.isFinite(p.installDepth)).length;
  const installVerified=products.filter(p=>Number.isFinite(p.installDepth)).length;
  const bodyOnlyVerified=products.filter(p=>Number.isFinite(p.depth)&&!Number.isFinite(p.installDepth)).length;
  window.__fridgeDepthCoverage={verified,installVerified,bodyOnlyVerified,total:products.length,verifiedAt};
  window.__hitachiDepthCoverage={
    bodyVerified:products.filter(p=>p.maker==='HITACHI'&&Number.isFinite(p.depth)).length,
    installVerified:products.filter(p=>p.maker==='HITACHI'&&Number.isFinite(p.installDepth)).length,
    total:products.filter(p=>p.maker==='HITACHI').length,
    verifiedAt
  };
})();
