// v8.9: keep staff-facing explanation aligned with the active fairness logic.
(function(){
  const result=document.getElementById('result');
  if(!result) return;

  const fairnessHtml='<strong>内部ロジック：</strong>設置・人数に合う容量・使い方・必須機能を優先し、通常候補は設定予算＋4万円以内から選定します。AQUAは候補から除外せず、販売戦略上の優先度のみ下げています。その他メーカーはメーカー名だけで一律の加点・減点をせず、条件とスコアを中心に比較します。';

  function syncFairnessCopy(){
    // v8.11以降はAQUA優先度レイヤーが同じstrategy-noteの正式な所有者。
    // ここで書き戻すと2つのMutationObserverが文面を奪い合うため、v8.11が有効なら何もしない。
    if(typeof window!=='undefined' && window.__aquaPriorityPolicy) return;
    const note=result.querySelector('.strategy-note');
    if(!note) return;
    if(note.innerHTML!==fairnessHtml) note.innerHTML=fairnessHtml;
  }

  const observer=new MutationObserver(syncFairnessCopy);
  observer.observe(result,{childList:true,subtree:true});
  syncFairnessCopy();
})();
