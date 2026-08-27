// v8.6: 共有・印刷をAndroidでも扱いやすくする補助UI
(function(){
  const stableUrl='https://ai-fridge-diagnosis-v83.vercel.app/';
  const style=document.createElement('style');
  style.textContent=`
    .sharebox.share-compact{display:grid;grid-template-columns:164px 1fr;gap:18px;align-items:center;padding:20px;margin-top:24px}
    .share-qr-wrap{display:flex;flex-direction:column;align-items:center;gap:7px}
    .share-qr-link{display:block;line-height:0;border-radius:12px}
    .share-qr{width:152px;height:152px;display:block;background:#fff;border:1px solid #e8e2dc;border-radius:12px;padding:8px;box-sizing:border-box;image-rendering:pixelated}
    .share-qr-note{font-size:11px;line-height:1.4;color:#756d66;text-align:center}
    .share-direct-link{font-size:12px;font-weight:800;color:#9a4300;text-decoration:underline;text-underline-offset:3px}
    .share-compact .share-title{margin:0 0 5px;font-size:20px;line-height:1.35}
    .share-compact .share-copy{font-size:14px;line-height:1.65;color:#665f59;margin-bottom:12px}
    .share-compact .share-actions{display:flex;flex-wrap:wrap;gap:8px}
    .share-compact .share-actions .btn{min-height:46px;padding:10px 16px}
    .share-compact .share-url-mini{margin-top:10px;font-size:11px;color:#81776e;overflow-wrap:anywhere}
    @media(max-width:600px){
      .sharebox.share-compact{display:flex;flex-direction:column;gap:14px;padding:17px;text-align:center}
      .share-qr{width:144px;height:144px;padding:7px;border-radius:10px}
      .share-qr-note{font-size:10px}
      .share-compact .share-title{font-size:18px}
      .share-compact .share-copy{font-size:13px;line-height:1.55;margin-bottom:10px}
      .share-compact .share-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%}
      .share-compact .share-actions .btn{width:100%;min-width:0;padding:10px 8px;font-size:13px}
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
        <a class="share-qr-link" href="${stableUrl}" target="_blank" rel="noopener" aria-label="AI冷蔵庫診断を開く">
          <img class="share-qr" src="share-qr.svg" alt="AI冷蔵庫診断の共有QRコード">
        </a>
        <div class="share-qr-note">別のスマホで読み取る</div>
        <a class="share-direct-link" href="${stableUrl}" target="_blank" rel="noopener">QRが読めない場合はこちら</a>
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

  function esc(s){
    return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function openPrintView(){
    const source=document.getElementById('result');
    if(!source) return;
    const clone=source.cloneNode(true);
    clone.querySelectorAll('.sharebox,.actions').forEach(el=>el.remove());
    clone.querySelectorAll('details.staff-details').forEach(el=>el.remove());
    clone.querySelectorAll('a').forEach(a=>{a.setAttribute('target','_blank');a.setAttribute('rel','noopener');});

    const cssHref=new URL('styles.css',location.href).href;
    const title='AI冷蔵庫診断 結果';
    const html=`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><link rel="stylesheet" href="${cssHref}"><style>
      body{background:#fff!important;margin:0;padding:0;color:#332d28}
      .print-toolbar{position:sticky;top:0;z-index:9999;background:#fff;border-bottom:1px solid #ddd;padding:10px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
      .print-toolbar button{min-height:46px;border:1px solid #d7b394;border-radius:12px;background:#fff;padding:10px 16px;font-weight:800;font-size:15px}
      .print-toolbar .primary{background:#fff1e5;color:#8d3300}
      .print-help{max-width:900px;margin:10px auto 0;padding:0 16px;font-size:13px;line-height:1.6;color:#666;text-align:center}
      .print-wrap{max-width:1000px;margin:0 auto;padding:18px}
      #result{display:block!important}
      .cards{grid-template-columns:1fr 1fr!important}
      @media(max-width:700px){.cards{grid-template-columns:1fr!important}.print-wrap{padding:10px}}
      @media print{.print-toolbar,.print-help{display:none!important}.print-wrap{padding:0}.card{break-inside:avoid}.result-layout{break-inside:avoid}body{background:#fff!important}}
    </style></head><body>
      <div class="print-toolbar"><button class="primary" id="printNow">印刷・PDF保存</button><button id="closePrint">元の画面に戻る</button></div>
      <div class="print-help">印刷画面が開かない場合は、Chromeの右上「︙」から共有／印刷を選び、「PDFとして保存」を選択してください。</div>
      <div class="print-wrap">${clone.outerHTML}</div>
      <script>document.getElementById('printNow').addEventListener('click',function(){window.print();});document.getElementById('closePrint').addEventListener('click',function(){window.close();});<\/script>
    </body></html>`;

    let w=null;
    try{w=window.open('','_blank');}catch(e){}
    if(w){
      try{w.document.open();w.document.write(html);w.document.close();w.focus();return;}catch(e){}
    }
    try{window.print();}catch(e){alert('印刷画面を開けませんでした。Chrome右上の「︙」から共有／印刷を選んでください。');}
  }

  function enhancePrintButton(){
    const buttons=[...document.querySelectorAll('#result .actions button')];
    const btn=buttons.find(b=>b.textContent.includes('結果を印刷')||b.textContent.includes('印刷・保存'));
    if(!btn || btn.dataset.printEnhanced==='1') return;
    btn.removeAttribute('onclick');
    btn.textContent='印刷・PDF保存画面を開く';
    btn.addEventListener('click',openPrintView);
    btn.dataset.printEnhanced='1';
  }

  function applyEnhancements(){simplifyShare();enhancePrintButton();}
  const result=document.getElementById('result');
  if(result) new MutationObserver(applyEnhancements).observe(result,{childList:true,subtree:true});
  applyEnhancements();
})();