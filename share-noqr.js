// v8.8: QRコードを使わず、診断結果共有に一本化
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .sharebox.share-compact.share-noqr{display:block!important;padding:18px!important;text-align:center}
    .sharebox.share-noqr .share-qr-wrap{display:none!important}
    .sharebox.share-noqr>div:last-child{width:100%}
    .sharebox.share-noqr .share-actions{max-width:460px;margin:12px auto 0}
    .sharebox.share-noqr .share-copy{margin-left:auto;margin-right:auto;max-width:520px}
    .sharebox.share-noqr .share-url-mini{display:none!important}
    @media(max-width:600px){
      .sharebox.share-compact.share-noqr{padding:16px!important}
      .sharebox.share-noqr .share-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%}
    }
  `;
  document.head.appendChild(style);

  function removeQr(){
    const box=document.querySelector('#result .sharebox');
    if(!box) return;
    if(!box.classList.contains('share-compact')) return;
    if(box.dataset.noQrApplied==='1') return;
    box.dataset.noQrApplied='1';

    box.classList.add('share-noqr');
    const qr=box.querySelector('.share-qr-wrap');
    if(qr) qr.remove();

    const title=box.querySelector('.share-title');
    if(title) title.textContent='この診断結果を共有';

    const copy=box.querySelector('.share-copy');
    if(copy) copy.textContent='回答条件とおすすめ結果を、そのまま家族やご一緒に選ぶ方へ送れます。';

    const buttons=[...box.querySelectorAll('.share-actions button')];
    if(buttons[0]) buttons[0].textContent='診断結果を共有';
    if(buttons[1]) buttons[1].textContent='結果リンクをコピー';
  }

  const result=document.getElementById('result');
  if(result) new MutationObserver(removeQr).observe(result,{childList:true,subtree:true});
  removeQr();
})();