// v8.9: 公正性を優先した容量・候補選定ロジック
// 1) 人数に対して過大/過小な容量を通常候補から除外
// 2) 予算+4万円を通常候補の上限に維持
// 3) 戦略メーカーは同等評価時のタイブレークのみ
// 4) メーカー一律減点を行わず、条件適合度で比較
(function(){
  const BUDGET_OVERAGE=40000;

  // ヨドバシ.comの容量ガイドを基準に、通常提案の中心帯と許容上限を設定。
  // 1人: 100〜299L、2人: 約200〜499L、3人: 約400〜599L、4人以上: 約500L〜。
  // 中心帯は必要以上に大型へ寄らないよう狭め、冷凍・まとめ買いが多い場合だけ上側へ広げる。
  function baseCapacityProfile(family){
    const n=Math.max(1,Number(family)||1);
    if(n===1) return {min:150,max:249,hardMin:100,hardMax:299};
    if(n===2) return {min:300,max:399,hardMin:200,hardMax:499};
    if(n===3) return {min:400,max:499,hardMin:400,hardMax:599};
    if(n===4) return {min:500,max:599,hardMin:500,hardMax:699};
    return {min:550,max:699,hardMin:500,hardMax:799};
  }

  function capacityProfile(family){
    const p={...baseCapacityProfile(family)};
    const freezer=Number(answers.freezerUse)||3;
    if(freezer>=4){
      p.max=Math.min(p.hardMax,p.max+50);
    }
    if(freezer<=2 && Number(family)===2){
      p.min=250;
    }
    return p;
  }
  window.capacityProfile=capacityProfile;

  targetCapacity=function(f){return capacityProfile(f).min;};

  const familyQuestion=Array.isArray(questions)?questions.find(q=>q.key==='family'):null;
  if(familyQuestion){
    familyQuestion.hint='人数だけで大型機へ寄せず、ヨドバシ.comの容量目安を基準に、冷凍・まとめ買い量で少し広げて選びます。1人暮らしでは100〜299Lを許容範囲とし、通常は150〜249Lを中心に提案します。';
  }

  function safeNormalize(v,values,invert=false){
    const nums=values.filter(Number.isFinite);
    if(!Number.isFinite(v)||!nums.length) return .5;
    const min=Math.min(...nums),max=Math.max(...nums);
    const x=max===min?.5:(v-min)/(max-min);
    return invert?1-x:x;
  }

  function capacityFitScore(capacity,profile){
    if(capacity>=profile.min && capacity<=profile.max){
      const center=(profile.min+profile.max)/2;
      const half=Math.max(1,(profile.max-profile.min)/2);
      const closeness=Math.max(0,1-Math.abs(capacity-center)/half);
      return 42+closeness*8;
    }
    if(capacity<profile.min){
      return Math.max(0,38-(profile.min-capacity)*0.22);
    }
    return Math.max(0,38-(capacity-profile.max)*0.25);
  }

  function doorFitValue(p,d){
    if(p.doorType==='左右開き'){
      return Math.max(
        d.scores['右開き']||0,
        d.scores['左開き']||0,
        d.scores['左右付け替え']||0
      );
    }
    return d.scores[p.doorType]||0;
  }

  productScore=function(p,d,pool){
    const profile=capacityProfile(answers.family);
    let score=capacityFitScore(p.capacity,profile);

    const freezerVals=pool.map(x=>x.freezerTotal);
    score+=safeNormalize(p.freezerTotal,freezerVals)*(Number(answers.freezerUse)||3)*5;

    if(Number.isFinite(p.vegetable)){
      const vegVals=pool.map(x=>x.vegetable);
      score+=safeNormalize(p.vegetable,vegVals)*(Number(answers.vegetablePriority)||3)*3;
    }
    if(answers.vegetablePos==='middle'&&p.vegetablePos==='真ん中') score+=10;
    if(answers.vegetablePos==='middle'&&p.vegetablePos==='下段') score-=5;
    if(answers.vegetablePos==='lower'&&p.vegetablePos==='下段') score+=6;

    const energyVals=pool.map(x=>x.energy);
    score+=safeNormalize(p.energy,energyVals,true)*(Number(answers.energy)||3)*4;

    score+=Math.min(18,Math.max(0,doorFitValue(p,d)*0.55));

    if(answers.autoIce==='prefer'&&p.autoIce) score+=6;
    if(answers.smartphone==='prefer'&&p.smartphone===true) score+=6;
    if(answers.smartphone==='no'&&p.smartphone===false) score+=2;

    if(answers.budget!==999999){
      const budget=Number(answers.budget)||0;
      if(p.price<=budget) score+=6;
      else if(p.price<=budget+BUDGET_OVERAGE) score+=2;
    }

    // ブランド一律加点/減点は行わない。
    return Math.round(score);
  };

  function seriesKey(p){
    return [p.maker,p.capacity,p.width,p.doors].join('|');
  }
  function isStrategic(p){return Array.isArray(strategicMakers)&&strategicMakers.includes(p.maker);}

  function sortFair(list){
    return list.slice().sort((a,b)=>{
      const ds=b.score-a.score;
      if(ds!==0) return ds;
      // 完全同点時だけ戦略メーカーをタイブレークとして扱う。
      const st=Number(isStrategic(b))-Number(isStrategic(a));
      if(st!==0) return st;
      return a.price-b.price;
    });
  }

  function chooseRegular(list,maxCount=3){
    const selected=[];
    const usedMakers=new Set();
    const usedSeries=new Set();
    let remaining=sortFair(list);

    while(selected.length<maxCount && remaining.length){
      const top=remaining[0];
      const close=remaining.filter(x=>x.score>=top.score-3);
      let pick=close.find(x=>!usedMakers.has(x.maker)&&!usedSeries.has(seriesKey(x)))
        || close.find(x=>!usedSeries.has(seriesKey(x)))
        || top;
      selected.push(pick);
      usedMakers.add(pick.maker);
      usedSeries.add(seriesKey(pick));
      remaining=remaining.filter(x=>x.model!==pick.model && seriesKey(x)!==seriesKey(pick));
    }
    return selected;
  }

  // 4機種目もブランド名ではなく、実際の搭載機能・ユーザー嗜好との一致だけで評価する。
  function fairFeatureScore(p,pool){
    let score=0;
    if(p.smartphone===true) score+=10;
    if(p.autoIce===true) score+=7;
    if(p.doorType==='左右開き') score+=6;
    else if(p.doorType==='フレンチドア') score+=5;
    else if(p.doorType==='左右付け替え') score+=3;
    if(p.doors>=6) score+=6;
    else if(p.doors>=5) score+=4;
    else if(p.doors>=3) score+=2;

    const freezerVals=pool.map(x=>x.freezerTotal);
    score+=safeNormalize(p.freezerTotal,freezerVals)*8;
    const energyVals=pool.map(x=>x.energy);
    score+=safeNormalize(p.energy,energyVals,true)*5;

    if(answers.autoIce==='prefer'&&p.autoIce===true) score+=5;
    if(answers.smartphone==='prefer'&&p.smartphone===true) score+=5;
    if(answers.vegetablePos==='middle'&&p.vegetablePos==='真ん中') score+=4;
    if(Array.isArray(p.features)) score+=Math.min(6,p.features.length*2);
    return Math.round(score);
  }

  getCandidates=function(d){
    const profile=capacityProfile(answers.family);
    let pool=products.filter(p=>hardFilter(p,d));

    // 人数に対して明らかに過大/過小な商品は、通常候補・機能重視とも除外。
    pool=pool.filter(p=>p.capacity>=profile.hardMin && p.capacity<=profile.hardMax);

    if(!pool.length){
      window.__fridgeFairnessMeta={profile,budgetSet:false,budget:null,cap:null,regularCount:0,featurePick:null};
      return {regular:[],featurePick:null};
    }

    const scored=sortFair(pool.map(p=>({...p,score:productScore(p,d,pool)})));
    const budgetSet=answers.budget!==999999 && Number.isFinite(Number(answers.budget));
    const budget=budgetSet?Number(answers.budget):null;
    const cap=budgetSet?budget+BUDGET_OVERAGE:null;

    const regularEligible=budgetSet?scored.filter(p=>p.price<=cap):scored;
    const regular=chooseRegular(regularEligible,3);
    const selectedModels=new Set(regular.map(p=>p.model));
    const selectedSeries=new Set(regular.map(seriesKey));

    let featureSource=scored.filter(p=>!selectedModels.has(p.model)&&!selectedSeries.has(seriesKey(p)));
    if(budgetSet){
      const over=featureSource.filter(p=>p.price>cap);
      if(over.length) featureSource=over;
    }
    const featurePick=featureSource
      .map(p=>({...p,featureScore:fairFeatureScore(p,scored),_featurePick:true,_overBudgetCap:budgetSet&&p.price>cap}))
      .sort((a,b)=>b.featureScore-a.featureScore || b.score-a.score || (Number(isStrategic(b))-Number(isStrategic(a))) || a.price-b.price)[0] || null;

    window.__fridgeFairnessMeta={profile,budgetSet,budget,cap,regularCount:regular.length,featurePick};
    return {regular,featurePick};
  };

  // 「左右開き」は付け替え式ではなく、左右どちらからでも開けられる方式として適合表示する。
  const originalMatchRows=matchRows;
  matchRows=function(p,d){
    const rows=originalMatchRows(p,d);
    if(p.doorType==='左右開き'){
      const idx=rows.findIndex(row=>String(row[1]||'').startsWith('ドア方式：'));
      if(idx>=0) rows[idx]=[true,'ドア方式：左右開き'];
    }
    return rows;
  };

  function applyResultGuidance(){
    const result=document.getElementById('result');
    if(!result || result.classList.contains('hidden')) return;
    const meta=window.__fridgeFairnessMeta;
    if(!meta) return;

    const summaries=result.querySelectorAll('.summary-grid .summary');
    if(summaries[0] && !summaries[0].classList.contains('v89-capacity')){
      summaries[0].classList.add('v89-capacity');
      const v=summaries[0].querySelector('.v');
      if(v) v.textContent=`${meta.profile.min}〜${meta.profile.max}L目安`;
    }

    const cards=result.querySelector('.cards');
    if(cards && !result.querySelector('.v89-fair-note')){
      const note=document.createElement('div');
      note.className='customer-note v89-fair-note';
      let text=`容量は人数・使い方に合う範囲を優先し、通常候補は${meta.budgetSet?`${yen(meta.cap)}以内`: '予算未設定のため条件適合度順'}で選定しています。`;
      if(meta.regularCount<3) text+=` 条件に合う登録商品は${meta.regularCount}機種のため、大型機で無理に候補数を埋めていません。`;
      text+=' メーカー名だけで順位を決めず、条件がほぼ同等の場合のみ戦略メーカーを優先します。';
      note.innerHTML=`<strong>選定方針：</strong>${text}`;
      cards.parentNode.insertBefore(note,cards);
    }
  }

  const resultEl=document.getElementById('result');
  if(resultEl){
    new MutationObserver(()=>{
      if(resultEl.querySelector('.cards')) applyResultGuidance();
    }).observe(resultEl,{childList:true,subtree:true});
  }
})();