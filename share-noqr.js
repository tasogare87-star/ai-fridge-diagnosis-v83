// v8.7: QRコードを使わず、共有ボタンとURLコピーだけに簡略化
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .sharebox.share-compact.share-noqr{display:block!important;padding:18px!important;text-align:center}
    .sharebox.share-noqr .share-qr-wrap{display:none!important}
    .sharebox.share-noqr>div:last-child{width:100%}
    .sharebox.share-noqr .share-actions{max-width:460px;margin:12px auto 0}
    .sharebox.share-noqr .share-copy{margin-left:auto;margin-right:auto;max-width:520px}
    @media(max-width:600px){
      .sharebox.share-compact.share-noqr{padding:16px!important}
      .sharebox.share-noqr .share-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%}
    }
  `;
  document.head.appendChild(style);

  function removeQr(){
    const box=document.querySelector('#result .sharebox');
    if(!box) return;
    box.classList.add('share-noqr');
    const qr=box.querySelector('.share-qr-wrap');
    if(qr) qr.remove();
    const copy=box.querySelector('.share-copy');
    if(copy) copy.textContent='この診断ページを家族やご一緒に選ぶ方へ送れます。';
  }

  const result=document.getElementById('result');
  if(result) new MutationObserver(removeQr).observe(result,{childList:true,subtree:true});
  removeQr();
})();