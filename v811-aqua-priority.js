// v8.11: AQUA-only priority adjustment.
// Keep AQUA eligible when it fits installation / capacity / feature requirements,
// but rank it slightly below otherwise comparable brands.
(function(){
  const AQUA_REGULAR_PENALTY=10;
  const AQUA_FEATURE_PENALTY=8;
  const BUDGET_OVERAGE=40000;

  const baseProductScore=productScore;
  productScore=function(p,d,pool){
    const base=baseProductScore(p,d,pool);
    return Math.round(base-(p.maker==='AQUA'?AQUA_REGULAR_PENALTY:0));
  };

  function seriesKey(p){
    return [p.maker,p.capacity,p.width,p.doors].join('|');
  }
  function isStrategic(p){
    return Array.isArray(strategicMakers)&&strategicMakers.includes(p.maker);
  }
  function safeNormalize(v,values,invert=false){
    const nums=values.filter(Number.isFinite);
    if(!Number.isFinite(v)||!nums.length) return .5;
    const min=Math.min(...nums),max=Math.max(...nums);
    const x=max===min?.5:(v-min)/(max-min);
    return invert?1-x:x;
  }
  function featureScore(p,pool){
    let score=0;
    if(p.smartphone===true) score+=10;
    if(p.autoIce===true) score+=7;
    if(p.doorType==='左右開き') score+=6;
    else if(p.doorType==='フレンチドア') score+=5;
    else if(p.doorType==='左右付け替え') score+=3;
    if(p.doors>=6) score+=6;
    else if(p.doors>=5) score+=4;
    else if(p.doors>=3) score+=2;

    score+=safeNormalize(p.freezerTotal,pool.map(x=>x.freezerTotal))*8;
    score+=safeNormalize(p.energy,pool.map(x=>x.energy),true)*5;
    if(answers.autoIce==='prefer'&&p.autoIce===true) score+=5;
    if(answers.smartphone==='prefer'&&p.smartphone===true) score+=5;
    if(answers.vegetablePos==='middle'&&p.vegetablePos==='真ん中') score+=4;
    if(Array.isArray(p.features)) score+=Math.min(6,p.features.length*2);
    if(p.maker==='AQUA') score-=AQUA_FEATURE_PENALTY;
    return Math.round(score);
  }

  const baseGetCandidates=getCandidates;
  getCandidates=function(d){
    const result=baseGetCandidates(d);
    const profile=window.capacityProfile?window.capacityProfile(answers.family):null;
    if(!profile) return result;

    let pool=products.filter(p=>hardFilter(p,d));
    pool=pool.filter(p=>p.capacity>=profile.hardMin&&p.capacity<=profile.hardMax);
    if(!pool.length) return result;

    const scored=pool
      .map(p=>({...p,score:productScore(p,d,pool)}))
      .sort((a,b)=>b.score-a.score || (Number(isStrategic(b))-Number(isStrategic(a))) || a.price-b.price);

    const regular=result.regular||[];
    const selectedModels=new Set(regular.map(p=>p.model));
    const selectedSeries=new Set(regular.map(seriesKey));
    let featureSource=scored.filter(p=>!selectedModels.has(p.model)&&!selectedSeries.has(seriesKey(p)));

    const budgetSet=answers.budget!==999999&&Number.isFinite(Number(answers.budget));
    const budget=budgetSet?Number(answers.budget):null;
    const cap=budgetSet?budget+BUDGET_OVERAGE:null;
    if(budgetSet){
      const over=featureSource.filter(p=>p.price>cap);
      if(over.length) featureSource=over;
    }

    const featurePick=featureSource
      .map(p=>({...p,featureScore:featureScore(p,scored),_featurePick:true,_overBudgetCap:budgetSet&&p.price>cap}))
      .sort((a,b)=>b.featureScore-a.featureScore || b.score-a.score || (Number(isStrategic(b))-Number(isStrategic(a))) || a.price-b.price)[0] || null;

    result.featurePick=featurePick;
    if(window.__fridgeFairnessMeta){
      window.__fridgeFairnessMeta.featurePick=featurePick;
      window.__fridgeFairnessMeta.aquaPriority={regularPenalty:AQUA_REGULAR_PENALTY,featurePenalty:AQUA_FEATURE_PENALTY};
    }
    return result;
  };

  window.__aquaPriorityPolicy={
    maker:'AQUA',
    regularPenalty:AQUA_REGULAR_PENALTY,
    featurePenalty:AQUA_FEATURE_PENALTY,
    excluded:false
  };

  function syncCopy(){
    const result=document.getElementById('result');
    if(!result) return;
    const strategy=result.querySelector('.strategy-note');
    if(strategy){
      strategy.innerHTML='<strong>内部ロジック：</strong>設置・人数に合う容量・使い方・必須機能を優先し、通常候補は設定予算＋4万円以内から選定します。AQUAのみ売場運用上の優先度を一段下げ、通常順位と機能重視枠に軽い減点を適用します。AQUAも条件適合時は候補から除外しません。その他メーカーへの一律加点・減点は行いません。';
    }
    const customer=result.querySelector('.v89-fair-note');
    if(customer){
      customer.innerHTML='<strong>選定方針：</strong>設置条件・人数に合う容量・使い方・必須機能・予算を優先し、店舗の提案方針も加味して候補を比較しています。条件に合わない機種を無理に候補数合わせで表示しません。';
    }
  }

  const resultEl=document.getElementById('result');
  if(resultEl){
    new MutationObserver(syncCopy).observe(resultEl,{childList:true,subtree:true});
    syncCopy();
  }

  try{
    document.title='AI冷蔵庫診断 v8.11 - 幅＋奥行き設置対応';
    const badge=document.querySelector('header .badge');
    if(badge) badge.textContent='AI冷蔵庫診断 v8.11 / 幅＋奥行き設置対応';
  }catch(e){}
})();
