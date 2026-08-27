// v8.7: 予算上限ルール
// 通常おすすめ1〜3は「設定予算 + 40,000円」以内。
// それを超える候補は通常枠へ混ぜず、4枠目の機能重視候補としてのみ提案する。
(function(){
  const BUDGET_OVERAGE=40000;

  const budgetQuestion=Array.isArray(questions)?questions.find(q=>q.key==='budget'):null;
  if(budgetQuestion){
    budgetQuestion.hint='通常のおすすめ3機種は、ご予算＋4万円以内を上限に選びます。それを超える機種は、機能重視の4機種目としてのみご提案します。';
  }

  getCandidates=function(d){
    let pool=products.filter(p=>hardFilter(p,d));
    if(pool.length===0) pool=products.filter(p=>p.status==='発売中' && p.width<=answers.maxWidth);

    const scored=pool
      .map(p=>({...p,score:productScore(p,d,pool)}))
      .sort((a,b)=>b.score-a.score);

    const budgetSet=answers.budget!==999999 && Number.isFinite(Number(answers.budget));
    const budget=budgetSet?Number(answers.budget):null;
    const cap=budgetSet?budget+BUDGET_OVERAGE:null;

    const regularEligible=budgetSet?scored.filter(p=>p.price<=cap):scored.slice();
    const overBudget=budgetSet?scored.filter(p=>p.price>cap):[];

    // 4枠目は、予算＋4万円を超える適合機があれば、その中から機能充実度を最優先で選ぶ。
    // 超過候補がない場合は、通常候補と重複しない範囲で全候補から機能重視機を選ぶ。
    let premiumSource=overBudget.length?overBudget:scored;
    const nonAquaPremium=premiumSource.filter(p=>p.maker!=='AQUA');
    if(nonAquaPremium.length) premiumSource=nonAquaPremium;

    const featurePick=premiumSource
      .map(p=>({...p,featureScore:featureRichnessScore(p),_featurePick:true,_overBudgetCap:budgetSet && p.price>cap}))
      .sort((a,b)=>b.featureScore-a.featureScore || b.score-a.score || a.price-b.price)[0] || null;

    const remaining=regularEligible.filter(p=>!featurePick || p.model!==featurePick.model);
    const nonAqua=remaining.filter(p=>p.maker!=='AQUA');
    const aqua=remaining.filter(p=>p.maker==='AQUA');

    let regular=[];
    if(nonAqua.length>=3) regular=nonAqua.slice(0,3);
    else if(nonAqua.length>=1) regular=[...nonAqua,...aqua].slice(0,3);
    else regular=remaining.slice(0,3);

    window.__fridgeBudgetMeta={budgetSet,budget,cap,regular,featurePick};
    return {regular,featurePick};
  };

  const originalShowResult=showResult;
  showResult=function(){
    originalShowResult();
    const meta=window.__fridgeBudgetMeta;
    if(!meta || !meta.budgetSet) return;

    const note=document.createElement('div');
    note.className='customer-note budget-rule-note';
    const count=meta.regular.length;
    note.innerHTML=`<strong>予算ルール：</strong>通常のおすすめは <strong>${yen(meta.budget)}＋4万円（上限 ${yen(meta.cap)}）以内</strong>から選定しています。${count<3?`条件に合う通常候補は${count}機種のため、上限を超える機種を無理に通常枠へ追加していません。`:''} 上限を超える機種は「機能充実の上位提案」でのみ表示します。`;
    const cards=document.querySelector('#result .cards');
    if(cards) cards.parentNode.insertBefore(note,cards);

    const cardEls=[...document.querySelectorAll('#result .card')];
    cardEls.forEach((card,i)=>{
      if(i<meta.regular.length){
        const badge=document.createElement('div');
        badge.className='budget-fit-badge';
        badge.textContent='予算＋4万円以内';
        const price=card.querySelector('.price');
        if(price) price.insertAdjacentElement('beforebegin',badge);
      }else if(meta.featurePick && meta.featurePick._overBudgetCap){
        const badge=document.createElement('div');
        badge.className='budget-premium-badge';
        badge.textContent='予算上限外・機能重視';
        const price=card.querySelector('.price');
        if(price) price.insertAdjacentElement('beforebegin',badge);
      }
    });
  };

  const style=document.createElement('style');
  style.textContent=`
    .budget-rule-note{margin:14px 0 18px}
    .budget-fit-badge,.budget-premium-badge{display:inline-flex;align-items:center;margin:10px 0 4px;padding:6px 10px;border-radius:999px;font-size:12px;font-weight:900}
    .budget-fit-badge{background:#eaf8ee;color:#19723b;border:1px solid #9fd3ad}
    .budget-premium-badge{background:#fff1e5;color:#9a4300;border:1px solid #efbd91}
  `;
  document.head.appendChild(style);
})();