// v8.6: ヨドバシ.com価格確認導線 + データ鮮度フェイルセーフ
// ヨドバシ.comは外部からの自動取得を拒否する場合があるため、
// アプリ内価格は「最終確認価格」とし、現在価格・販売状況は商品ページを正とする。
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .price a.yodobashi-price-link{color:inherit;text-decoration:none;display:block}
    .price a.yodobashi-price-link:hover{text-decoration:underline}
    .price-check-note{font-size:12px;line-height:1.55;color:#666;margin-top:5px}
    .price-stale-warning{font-size:12px;line-height:1.55;color:#9a3f00;background:#fff4e8;border:1px solid #efb46b;border-radius:9px;padding:8px 10px;margin-top:7px;font-weight:800}
    .price-check-link{display:inline-flex;align-items:center;justify-content:center;gap:6px;margin-top:8px;padding:9px 12px;border-radius:10px;background:#fff7e8;border:1px solid #f1c57b;color:#8a4b00;font-weight:800;text-decoration:none}
    .price-check-link:active{transform:translateY(1px)}
  `;
  document.head.appendChild(style);

  function parseCheckedAtJst(value){
    if(!value || typeof value!=='string') return null;
    const m=value.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})\s+JST$/);
    if(!m) return null;
    const [,y,mo,d,h,mi]=m.map((x,i)=>i===0?x:Number(x));
    return new Date(Date.UTC(y,mo-1,d,h-9,mi));
  }

  function dataFreshness(){
    const value=(typeof checkedAt!=='undefined' && checkedAt)?checkedAt:'';
    const dt=parseCheckedAtJst(value);
    if(!dt || Number.isNaN(dt.getTime())) return {stale:true,hours:null};
    const hours=(Date.now()-dt.getTime())/3600000;
    return {stale:hours>48,hours};
  }

  function applyPriceLinks(){
    const freshness=dataFreshness();
    document.querySelectorAll('#result .card').forEach(card=>{
      if(card.dataset.priceLinked==='1') return;
      const source=card.querySelector('.source a');
      const price=card.querySelector('.price');
      if(!source || !price) return;
      const href=source.href;
      const raw=price.textContent.trim();
      const m=raw.match(/([0-9,]+円)/);
      const amount=m?m[1]:'価格はリンク先で確認';
      const dateText=(typeof checkedAt!=='undefined' && checkedAt)?checkedAt:'最終確認時';
      const staleHtml=freshness.stale
        ? '<div class="price-stale-warning">価格・販売状態の最終確認から48時間以上経過しています。現在の価格・在庫・販売状況をヨドバシ.comで必ず再確認してください。</div>'
        : '';
      price.innerHTML=`<a class="yodobashi-price-link" href="${href}" target="_blank" rel="noopener">最終確認価格 ${amount}</a><div class="price-check-note">${dateText}時点の確認値です。現在価格・在庫・販売状況はヨドバシ.comを正としてご確認ください。</div>${staleHtml}<a class="price-check-link" href="${href}" target="_blank" rel="noopener">ヨドバシ.comで現在価格・販売状況を確認 →</a>`;
      source.textContent='ヨドバシ.comの商品ページを開く';
      card.dataset.priceLinked='1';
    });
  }

  const result=document.getElementById('result');
  if(result){
    new MutationObserver(applyPriceLinks).observe(result,{childList:true,subtree:true});
  }
  applyPriceLinks();
})();
