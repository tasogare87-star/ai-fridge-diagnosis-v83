// v8.12: explain why each refrigerator was selected without changing ranking logic.
(function(){
  function pushUnique(list,text){if(text&&!list.includes(text))list.push(text);}
  function capacityProfileSafe(){try{return window.capacityProfile?window.capacityProfile(answers.family):null;}catch(e){return null;}}
  function depthStateSafe(p){try{return window.fridgeDepthState?window.fridgeDepthState(p):null;}catch(e){return null;}}

  function installationReason(p){
    const widthSet=Number(answers.maxWidth)!==999&&Number.isFinite(Number(answers.maxWidth));
    const ds=depthStateSafe(p);
    if(widthSet&&ds&&ds.kind==='verified-fit') return `本体幅${p.width}mm・最小設置奥行き${ds.install}mmが設定範囲内`;
    if(widthSet&&ds&&ds.kind==='body-only') return `本体幅${p.width}mm・本体奥行き${ds.body}mmは範囲内。放熱・配線余裕は最終確認`;
    if(widthSet&&p.width<=Number(answers.maxWidth)) return `本体幅${p.width}mmで、設置幅${answers.maxWidth}mm以内`;
    if(ds&&ds.kind==='verified-fit') return `最小設置奥行き${ds.install}mmで、設定上限${ds.limit}mm以内`;
    if(ds&&ds.kind==='unset'&&ds.install!==null) return `最小設置奥行き${ds.install}mmをメーカー公式値で確認済み`;
    if(ds&&ds.body!==null) return `本体奥行き${ds.body}mmをメーカー公式値で確認済み`;
    return null;
  }

  function selectionReasons(p,d,isFeature){
    const reasons=[];
    const profile=capacityProfileSafe();
    const target=typeof targetCapacity==='function'?targetCapacity(answers.family):(profile?profile.hardMin:null);

    // User-declared must / preference conditions come first.
    if(answers.autoIce==='must'&&p.autoIce===true) pushUnique(reasons,'必須条件の自動製氷に対応');
    if(answers.smartphone==='must'&&p.smartphone===true) pushUnique(reasons,'必須条件のスマホ連携に対応');
    if(answers.vegetablePos==='middle'&&p.vegetablePos==='真ん中') pushUnique(reasons,'希望している「真ん中野菜室」に一致');
    if(Number(answers.freezerUse)>=4&&Number.isFinite(p.freezerTotal)) pushUnique(reasons,`冷凍室合計${p.freezerTotal}Lで、冷凍を多く使う条件に適合`);
    if(answers.autoIce==='prefer'&&p.autoIce===true) pushUnique(reasons,'希望している自動製氷に対応');
    if(answers.smartphone==='prefer'&&p.smartphone===true) pushUnique(reasons,'希望しているスマホ連携に対応');

    if(isFeature){
      const highlights=typeof productFeatureHighlights==='function'?productFeatureHighlights(p):[];
      if(Array.isArray(highlights)&&highlights.length) pushUnique(reasons,`「${highlights[0]}」など付加機能を評価`);
      else if(p.smartphone===true) pushUnique(reasons,'スマホ連携を備えた機能充実モデル');
      else if(p.autoIce===true) pushUnique(reasons,'自動製氷を備えた機能充実モデル');
    }

    // Installation is summarized as one reason so it does not crowd out usage preferences.
    pushUnique(reasons,installationReason(p));

    if(Number.isFinite(target)&&p.capacity>=target) pushUnique(reasons,`${answers.family}人の目安${target}L以上を満たす${p.capacity}L`);
    else if(profile&&p.capacity>=profile.hardMin) pushUnique(reasons,`${answers.family}人の容量条件${profile.hardMin}L以上を満たす${p.capacity}L`);

    if(Number(answers.budget)!==999999&&Number.isFinite(Number(answers.budget))){
      const budget=Number(answers.budget);
      if(p.price<=budget) pushUnique(reasons,`登録価格${yen(p.price)}で設定予算内`);
      else if(!isFeature&&p.price<=budget+40000) pushUnique(reasons,`登録価格${yen(p.price)}で通常候補の予算許容範囲内`);
    }

    if(d&&Array.isArray(d.ranked)&&d.ranked.length){
      const first=d.ranked[0][0];
      if(p.doorType===first) pushUnique(reasons,`診断したおすすめドア「${first}」に一致`);
      else if(p.doorType==='フレンチドア'&&p.width>=600) pushUnique(reasons,'設置条件内で使いやすいフレンチドア');
    }

    if(reasons.length<2&&Number.isFinite(p.freezerTotal)) pushUnique(reasons,`冷凍室合計${p.freezerTotal}Lを確保`);
    if(reasons.length<2&&p.autoIce===true) pushUnique(reasons,'自動製氷に対応');
    if(reasons.length<2) pushUnique(reasons,'設置・容量・使い方の総合スコアで上位');
    return reasons.slice(0,3);
  }
  window.fridgeSelectionReasons=selectionReasons;

  function decorateSelectionReasons(){
    const result=document.getElementById('result');
    if(!result||result.classList.contains('hidden'))return;
    const d=doorPref();
    const candidateSet=getCandidates(d);
    const picks=[...(candidateSet.regular||[]),...(candidateSet.featurePick?[candidateSet.featurePick]:[])];
    const cards=[...result.querySelectorAll('.cards .card')];
    cards.forEach((card,i)=>{
      if(card.querySelector('.selection-reasons'))return;
      const p=picks[i]; if(!p)return;
      const reasons=selectionReasons(p,d,!!p._featurePick);
      const box=document.createElement('div');
      box.className='selection-reasons';
      box.innerHTML=`<div class="selection-reasons-title">この機種が選ばれた理由</div><ul>${reasons.map(x=>`<li>${x}</li>`).join('')}</ul>`;
      const spec=card.querySelector('.specgrid');
      if(spec)spec.parentNode.insertBefore(box,spec);else card.appendChild(box);
    });
  }

  function installStyles(){
    if(document.getElementById('v812-selection-reasons-style'))return;
    const style=document.createElement('style');
    style.id='v812-selection-reasons-style';
    style.textContent=`
      .selection-reasons{margin:14px 0;padding:14px 16px;border-radius:14px;background:#f4f8ff;border:1px solid #cadcff}
      .selection-reasons-title{font-weight:900;margin-bottom:8px;color:#173f7a}
      .selection-reasons ul{margin:0;padding-left:1.25rem;display:grid;gap:5px;line-height:1.55}
      .selection-reasons li{margin:0}
    `;
    document.head.appendChild(style);
  }

  const baseShowResult=showResult;
  showResult=function(){baseShowResult();decorateSelectionReasons();};

  try{
    document.title='AI冷蔵庫診断 v8.12 - 選定理由表示対応';
    const badge=document.querySelector('header .badge');
    if(badge)badge.textContent='AI冷蔵庫診断 v8.12 / 幅＋奥行き＋選定理由';
    installStyles();
  }catch(e){}
})();
