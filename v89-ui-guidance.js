// v8.9: keep staff-facing explanation aligned with the active fairness logic.
(function(){
  const result=document.getElementById('result');
  if(!result) return;

  function syncFairnessCopy(){
    const note=result.querySelector('.strategy-note');
    if(!note) return;
    note.innerHTML='<strong>内部ロジック：</strong>設置・人数に合う容量・使い方・必須機能を優先し、通常候補は設定予算＋4万円以内から選定します。メーカー名だけで一律の加点・減点は行わず、条件とスコアが同等の場合のみ戦略メーカーをタイブレークとして扱います。AQUAを含む全メーカーを同じ適合条件で比較します。';
  }

  new MutationObserver(syncFairnessCopy).observe(result,{childList:true,subtree:true});
  syncFairnessCopy();
})();
