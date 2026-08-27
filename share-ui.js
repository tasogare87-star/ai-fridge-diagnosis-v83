// v8.6: 共有エリアをスマホ向けに簡潔化
(function(){
  const stableUrl='https://ai-fridge-diagnosis-v83.vercel.app/';
  const style=document.createElement('style');
  style.textContent=`
    .sharebox.share-compact{display:grid;grid-template-columns:132px 1fr;gap:18px;align-items:center;padding:20px;margin-top:24px}
    .share-qr-wrap{display:flex;flex-direction:column;align-items:center;gap:6px}
    .share-qr{width:120px;height:120px;display:block;background:#fff;border:1px solid #e8e2dc;border-radius:12px;padding:7px;box-sizing:border-box}
    .share-qr-note{font-size:11px;line-height:1.4;color:#756d66;text-align:center}
    .share-compact .share-title{margin:0 0 5px;font-size:20px;line-height:1.35}
    .share-compact .share-copy{font-size:14px;line-height:1.65;color:#665f59;margin-bottom:12px}
    .share-compact .share-actions{display:flex;flex-wrap:wrap;gap:8px}
    .share-compact .share-actions .btn{min-height:46px;padding:10px 16px}
    .share-compact .share-url-mini{margin-top:10px;font-size:11px;color:#81776e;overflow-wrap:anywhere}
    @media(max-width:600px){
      .sharebox.share-compact{grid-template-columns:92px 1fr;gap:13px;padding:16px}
      .share-qr{width:88px;height:88px;padding:5px;border-radius:9px}
      .share-qr-note{font-size:9px}
      .share-compact .share-title{font-size:17px}
      .share-compact .share-copy{font-size:13px;line-height:1.55;margin-bottom:10px}
      .share-compact .share-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px}
      .share-compact .share-actions .btn{width:100%;min-width:0;padding:9px 7px;font-size:13px}
      .share-compact .share-url-mini{display:none}
    }
  `;
  document.head.appendChild(style);

  function simplifyShare(){
    const box=document.querySelector('#result .sharebox');
    if(!box || box.dataset.compactShare==='1') return;
    box.classList.add('share-compact');
    box.innerHTML=`
      <div class="share-qr-wrap">
        <img class="share-qr" src="share-qr.svg" alt="AI冷蔵庫診断の共有QRコード">
        <div class="share-qr-note">別のスマホで読み取る</div>
      </div>
      <div>
        <div class="share-title">家族に診断ページを共有</div>
        <div class="share-copy">同じ診断ページを家族のスマートフォンでも開けます。</div>
        <div class="share-actions">
          <button class="btn secondary" type="button" onclick="shareApp()">共有する</button>
          <button class="btn secondary" type="button" onclick="copyShareUrl()">URLをコピー</button>
        </div>
        <div class="share-url-mini">${stableUrl}</div>
      </div>`;
    box.dataset.compactShare='1';
  }

  const result=document.getElementById('result');
  if(result) new MutationObserver(simplifyShare).observe(result,{childList:true,subtree:true});
  simplifyShare();
})();