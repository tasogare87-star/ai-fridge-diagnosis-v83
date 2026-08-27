// v8.8: 容量目安・予算上限・診断結果共有
(function(){
  const BUDGET_OVERAGE=40000;

  // 家電量販店で一般的に使われる容量目安に近づける。
  // 人数×70L + 常備品100L + 予備70L。
  targetCapacity=function(f){
    const n=Math.max(1,Number(f)||1);
    return n*70+170;
  };

  const familyQuestion=Array.isArray(questions)?questions.find(q=>q.key==='family'):null;
  if(familyQuestion){
    familyQuestion.hint='家電量販店で一般的に使われる容量目安を基準にし、必要以上に大容量へ寄せずに候補を選びます。';
  }
  const budgetQuestion=Array.isArray(questions)?questions.find(q=>q.key==='budget'):null;
  if(budgetQuestion){
    budgetQuestion.hint='通常のおすすめ1〜3は、ご予算＋4万円以内を上限に選びます。それを超える機種は、機能重視の4機種目としてのみご提案します。';
  }

  // 通常1〜3は予算+4万円を超えない。超過候補は4枠目だけに使う。
  getCandidates=function(d){
    let pool=products.filter(p=>hardFilter(p,d));
    if(pool.length===0){
      pool=products.filter(p=>p.status==='発売中' && p.width<=answers.maxWidth);
    }

    const scored=pool
      .map(p=>({...p,score:productScore(p,d,pool)}))
      .sort((a,b)=>b.score-a.score);

    const budgetSet=answers.budget!==999999 && Number.isFinite(Number(answers.budget));
    const budget=budgetSet?Number(answers.budget):null;
    const cap=budgetSet?budget+BUDGET_OVERAGE:null;
    const regularEligible=budgetSet?scored.filter(p=>p.price<=cap):scored.slice();
    const overCap=budgetSet?scored.filter(p=>p.price>cap):[];

    const nonAqua=regularEligible.filter(p=>p.maker!=='AQUA');
    const aqua=regularEligible.filter(p=>p.maker==='AQUA');
    let regular=[];
    if(nonAqua.length>=3) regular=nonAqua.slice(0,3);
    else if(nonAqua.length>=1) regular=[...nonAqua,...aqua].slice(0,3);
    else regular=regularEligible.slice(0,3);

    const regularModels=new Set(regular.map(p=>p.model));
    let featureSource=overCap.length?overCap:scored.filter(p=>!regularModels.has(p.model));
    const nonAquaFeature=featureSource.filter(p=>p.maker!=='AQUA');
    if(nonAquaFeature.length) featureSource=nonAquaFeature;

    const featurePick=featureSource
      .map(p=>({...p,featureScore:featureRichnessScore(p),_featurePick:true,_overBudgetCap:budgetSet && p.price>cap}))
      .sort((a,b)=>b.featureScore-a.featureScore || b.score-a.score || a.price-b.price)[0] || null;

    window.__fridgeBudgetMeta={budgetSet,budget,cap,regularCount:regular.length,featurePick};
    return {regular,featurePick};
  };

  function buildResultShareUrl(){
    const u=new URL(location.origin+location.pathname);
    const payload={};
    for(const q of questions){
      if(!Object.prototype.hasOwnProperty.call(answers,q.key)) return location.origin+location.pathname;
      payload[q.key]=answers[q.key];
    }
    u.searchParams.set('result',JSON.stringify(payload));
    return u.toString();
  }

  copyShareUrl=function(){
    const resultUrl=buildResultShareUrl();
    if(navigator.clipboard && window.isSecureContext){
      navigator.clipboard.writeText(resultUrl)
        .then(()=>alert('診断結果リンクをコピーしました。'))
        .catch(()=>prompt('この診断結果リンクをコピーしてください',resultUrl));
    }else{
      prompt('この診断結果リンクをコピーしてください',resultUrl);
    }
  };

  shareApp=async function(){
    const resultUrl=buildResultShareUrl();
    const payload={
      title:'AI冷蔵庫診断結果',
      text:'冷蔵庫診断の結果を共有します。リンクを開くと同じ回答条件とおすすめ結果を確認できます。',
      url:resultUrl
    };
    if(navigator.share){
      try{
        await navigator.share(payload);
        return;
      }catch(e){
        if(e && e.name==='AbortError') return;
      }
    }
    copyShareUrl();
  };

  function restoreSharedResult(){
    let raw='';
    try{ raw=new URL(location.href).searchParams.get('result')||''; }catch(e){ return; }
    if(!raw) return;

    let parsed;
    try{ parsed=JSON.parse(raw); }catch(e){ return; }
    if(!parsed || typeof parsed!=='object') return;

    const restored={};
    for(const q of questions){
      const incoming=parsed[q.key];
      const option=q.options.find(([,v])=>String(v)===String(incoming));
      if(!option) return;
      restored[q.key]=option[1];
    }

    Object.keys(answers).forEach(k=>delete answers[k]);
    Object.assign(answers,restored);
    try{
      showResult();
      history.replaceState({fridgeApp:true,screen:'result'},'',location.href);
      window.scrollTo({top:0,behavior:'auto'});
    }catch(e){
      console.error('診断結果の復元に失敗しました',e);
    }
  }

  setTimeout(restoreSharedResult,0);
})();