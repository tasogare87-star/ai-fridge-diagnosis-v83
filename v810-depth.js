// v8.10: installation depth support
(function(){
  const UNKNOWN=999;

  function depthInfo(p){
    return {
      body:Number.isFinite(p.depth)?p.depth:null,
      install:Number.isFinite(p.installDepth)?p.installDepth:null
    };
  }
  function depthLimit(){
    const n=Number(answers.maxDepth);
    return Number.isFinite(n)?n:UNKNOWN;
  }
  function depthState(p){
    const limit=depthLimit();
    const info=depthInfo(p);
    if(limit===UNKNOWN) return {kind:'unset',...info,limit};
    if(info.install!==null) return {kind:info.install<=limit?'verified-fit':'over',...info,limit};
    if(info.body!==null){
      if(info.body>limit) return {kind:'over',...info,limit};
      return {kind:'body-only',...info,limit};
    }
    return {kind:'unknown',...info,limit};
  }
  window.fridgeDepthInfo=depthInfo;
  window.fridgeDepthState=depthState;

  if(Array.isArray(questions) && !questions.some(q=>q.key==='maxDepth')){
    const widthIndex=questions.findIndex(q=>q.key==='maxWidth');
    const q={
      key:'maxDepth',
      text:'壁から通路側まで、冷蔵庫に使える奥行きはどれくらいですか？',
      hint:'壁から冷蔵庫前面側までの設置可能寸法です。コンセント・巾木・放熱スペースを含めて余裕を見てください。扉や引き出しを開いたときの最大奥行きは別途確認します。',
      options:[['60cmまで',600],['65cmまで',650],['70cmまで',700],['75cmまで',750],['80cmまで',800],['まだ分からない',999]]
    };
    questions.splice(widthIndex>=0?widthIndex+1:0,0,q);
  }

  const baseHardFilter=hardFilter;
  hardFilter=function(p,d){
    if(!baseHardFilter(p,d)) return false;
    const state=depthState(p);
    // Verified installation depth, or body depth alone, can prove that a model is too deep.
    // A body depth that fits does NOT prove installation clearance, so it remains a check item.
    if(state.kind==='over') return false;
    return true;
  };

  const baseProductScore=productScore;
  productScore=function(p,d,pool){
    let score=baseProductScore(p,d,pool);
    const state=depthState(p);
    if(state.kind==='verified-fit') score+=6;
    else if(state.kind==='body-only') score+=1;
    else if(state.kind==='unknown') score-=6;
    return Math.round(score);
  };

  const baseMatchRows=matchRows;
  matchRows=function(p,d){
    const rows=baseMatchRows(p,d);
    const state=depthState(p);
    let row;
    if(state.kind==='unset'){
      if(state.install!==null) row=[true,`最小設置奥行き ${state.install}mm`];
      else if(state.body!==null) row=[null,`本体奥行き ${state.body}mm（設置余裕は機種別確認）`];
      else row=[null,'奥行き：購入前に要確認'];
    }else if(state.kind==='verified-fit'){
      row=[true,`最小設置奥行き ${state.install}mm（上限 ${state.limit}mm）`];
    }else if(state.kind==='body-only'){
      row=[null,`本体奥行き ${state.body}mm（上限 ${state.limit}mm／放熱・配線余裕は要確認）`];
    }else if(state.kind==='over'){
      const actual=state.install!==null?state.install:state.body;
      row=[false,`奥行き ${actual}mm（上限 ${state.limit}mmを超過）`];
    }else{
      row=[null,`奥行き未確認（設置上限 ${state.limit}mm／店頭で最終確認）`];
    }
    rows.splice(1,0,row);
    return rows;
  };

  function installIntroGuide(){
    const intro=document.getElementById('intro');
    if(!intro || intro.querySelector('.depth-install-guide')) return;
    const actions=intro.querySelector('.flow-actions');
    if(!actions) return;
    const guide=document.createElement('div');
    guide.className='depth-install-guide';
    guide.innerHTML=`
      <div class="depth-guide-copy">
        <span class="mini-badge">設置寸法の確認</span>
        <h3>横幅だけでなく「奥行き」も確認します</h3>
        <p><strong>壁から通路側まで使える奥行き</strong>を測ります。冷蔵庫本体が収まるだけでは不十分で、コンセント・巾木・放熱に必要な余裕は機種ごとに異なります。</p>
        <p class="depth-guide-caution">※ 扉・冷凍室・野菜室を開いたときの最大奥行きは「設置奥行き」と別です。最終候補では店頭で寸法図を確認します。</p>
      </div>
      <div class="depth-guide-svg" aria-hidden="true">
        <svg viewBox="0 0 360 180" width="100%" height="180">
          <rect x="18" y="22" width="22" height="132" rx="6" fill="#d8d8d8"/>
          <text x="29" y="16" text-anchor="middle" font-size="11" font-weight="800" fill="#666">壁</text>
          <rect x="68" y="44" width="132" height="86" rx="10" fill="#fffaf6" stroke="#d8a47d" stroke-width="2"/>
          <text x="134" y="91" text-anchor="middle" font-size="14" font-weight="900" fill="#8d3300">冷蔵庫</text>
          <line x1="40" y1="146" x2="238" y2="146" stroke="#397bff" stroke-width="4"/>
          <path d="M40 146 l12 -7 v14 z" fill="#397bff"/><path d="M238 146 l-12 -7 v14 z" fill="#397bff"/>
          <text x="139" y="169" text-anchor="middle" font-size="12" font-weight="900" fill="#1b4cb5">壁 → 前面側の使える奥行き</text>
          <rect x="40" y="58" width="28" height="58" rx="5" fill="#eaf8ee" stroke="#9fd3ad"/>
          <text x="54" y="82" text-anchor="middle" font-size="10" font-weight="800" fill="#19723b">配線</text>
          <text x="54" y="98" text-anchor="middle" font-size="10" font-weight="800" fill="#19723b">放熱</text>
          <line x1="200" y1="87" x2="324" y2="87" stroke="#ff9200" stroke-width="5" stroke-dasharray="8 6"/>
          <text x="263" y="76" text-anchor="middle" font-size="11" font-weight="900" fill="#8d3300">扉・引出し開放は別確認</text>
        </svg>
      </div>`;
    actions.parentNode.insertBefore(guide,actions);

    const h2=intro.querySelector('h2');
    if(h2) h2.textContent='設置寸法とドアの向きを先に確認';
  }

  function installStyles(){
    if(document.getElementById('v810-depth-style')) return;
    const style=document.createElement('style');
    style.id='v810-depth-style';
    style.textContent=`
      .depth-install-guide{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(260px,.75fr);gap:18px;align-items:center;margin:20px 0;padding:18px;border:1px solid #d8e6ff;border-radius:16px;background:#f7fbff}
      .depth-install-guide h3{margin:8px 0 10px;font-size:1.05rem}
      .depth-install-guide p{margin:7px 0;line-height:1.65}
      .depth-guide-caution{font-size:.88rem;color:#5d6470}
      .depth-guide-svg{min-width:0}
      .depth-result-note{margin:14px 0;padding:14px 16px;border-radius:12px;background:#fff8e8;border:1px solid #f0d49c;line-height:1.6}
      @media(max-width:760px){.depth-install-guide{grid-template-columns:1fr}.depth-guide-svg{order:-1}}
    `;
    document.head.appendChild(style);
  }

  function applyResultDepth(){
    const result=document.getElementById('result');
    if(!result || result.classList.contains('hidden')) return;
    const grid=result.querySelector('.summary-grid');
    if(grid && !grid.querySelector('.v810-depth-summary')){
      const item=document.createElement('div');
      item.className='summary v810-depth-summary';
      item.innerHTML=`<div class="k">置ける奥行き</div><div class="v">${depthLimit()===UNKNOWN?'未確定':depthLimit()+'mm以下'}</div>`;
      grid.appendChild(item);
    }
    const layout=result.querySelector('.result-layout');
    if(layout && !result.querySelector('.depth-result-note')){
      const note=document.createElement('div');
      note.className='depth-result-note';
      const coverage=window.__fridgeDepthCoverage;
      const coverageText=coverage?`現在、メーカー公式で奥行き確認済み ${coverage.verified}/${coverage.total}機種。`:'';
      note.innerHTML=`<strong>奥行きの見方：</strong>確認済み機種は最小必要設置奥行きを優先して判定します。本体奥行きだけ確認できる機種は、放熱・配線余裕を含めて最終確認が必要です。未確認機種を「設置可」とは断定しません。 ${coverageText}`;
      layout.parentNode.insertBefore(note,layout);
    }
  }

  const baseShowResult=showResult;
  showResult=function(){
    baseShowResult();
    applyResultDepth();
  };

  try{
    document.title='AI冷蔵庫診断 v8.10 - 幅＋奥行き設置対応';
    const badge=document.querySelector('header .badge');
    if(badge) badge.textContent='AI冷蔵庫診断 v8.10 / 幅＋奥行き設置対応';
    installStyles();
    installIntroGuide();
  }catch(e){}
})();
