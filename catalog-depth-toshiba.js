// Verified Toshiba installation-depth metadata.
// Source policy: manufacturer official specification pages only.
(function(){
  const verifiedAt='2026-08-28';
  const rules=[
    ['GR-A640XFS',{depth:745,installDepth:748,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-a640xfs/spec/'}],
    ['GR-A600FH',{depth:745,installDepth:748,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-a600fh/spec/'}],
    ['GR-A600XFS',{depth:699,installDepth:702,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-a600xfs/spec/'}],
    ['GR-A590WFS',{depth:699,installDepth:702,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-a590wfs/spec/'}],
    ['GR-A590WF',{depth:699,installDepth:702,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-a590wf/spec/'}],
    ['GR-A550FZ',{depth:699,installDepth:702,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-a550fz/spec/'}],
    ['GR-A550FH',{depth:699,installDepth:702,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-a550fh/spec/'}],
    ['GR-A540XFS',{depth:650,installDepth:653,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-a540xfs/spec/'}],
    ['GR-A540WFS',{depth:650,installDepth:653,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-a540wfs/spec/'}],
    ['GR-A540WF',{depth:650,installDepth:653,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-a540wf/spec/'}],
    ['GR-A510FH',{depth:699,installDepth:702,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-a510fh/spec/'}],
    ['GR-A510FZ',{depth:699,installDepth:702,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-a510fz/spec/'}],
    ['GR-A500GT',{depth:704,installDepth:707,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-a500gt/spec/'}],
    ['GR-A490XFS',{depth:629,installDepth:632,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-a490xfs/spec/'}],
    ['GR-A470GSH',{depth:704,installDepth:707,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-a470gsh/spec/'}],
    ['GR-A460FH',{depth:649,installDepth:652,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-a460fh/spec/'}],
    ['GR-A460FZ',{depth:649,installDepth:652,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-a460fz/spec/'}],
    ['GR-A450GT',{depth:649,installDepth:652,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-a450gt/spec/'}],
    ['GR-A41GXH',{depth:692,installDepth:698,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-a41gxh/spec/'}],
    ['GR-Y36SV',{depth:665,installDepth:677,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-y36sv/spec/'}],
    ['GR-Y36SC',{depth:665,installDepth:681,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-y36sc/spec/'}],
    ['GR-Y33SC',{depth:665,installDepth:681,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-y33sc/spec/'}],
    ['GR-Y29SC',{depth:665,installDepth:681,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-y29sc/spec/'}],
    ['GR-Y18BP',{depth:580,installDepth:640,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-y18bp/spec/'}],
    ['GR-Y16BP',{depth:580,installDepth:640,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-y16bp/spec/'}],
    // Retail sell-through models remain eligible only while their separate Yodobashi sale-state audit is valid.
    ['GR-Y600FK',{depth:745,installDepth:748,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-y600fk/spec/'}],
    ['GR-Y510FK',{depth:699,installDepth:702,source:'https://www.toshiba-lifestyle.com/jp/refrigerators/gr-y510fk/spec/'}]
  ];

  function metadataFor(model){
    const hit=rules.find(([prefix])=>String(model||'').startsWith(prefix));
    return hit?hit[1]:null;
  }

  products.forEach(p=>{
    if(p.maker!=='TOSHIBA') return;
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
  window.__toshibaDepthCoverage={
    verified:products.filter(p=>p.maker==='TOSHIBA'&&Number.isFinite(p.installDepth)).length,
    total:products.filter(p=>p.maker==='TOSHIBA').length,
    verifiedAt
  };
})();
