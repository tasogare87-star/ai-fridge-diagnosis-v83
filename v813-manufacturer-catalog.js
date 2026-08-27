// v8.13: add manufacturer official catalog links to result cards without changing ranking logic.
(function(){
  const catalogs={
    'Panasonic':'https://panasonic.jp/catalog.html',
    'MITSUBISHI ELECTRIC':'https://www.mitsubishielectric.co.jp/ldg/wink/ssl/webCatalogTop.do',
    'HITACHI':'https://kadenfan.hitachi.co.jp/catalog/',
    'TOSHIBA':'https://www.toshiba-lifestyle.com/jp/support/catalog/',
    'SHARP':'https://cgi.jp.sharp/catalog/',
    'AQUA':'https://aqua-has.com/support/catalog/'
  };
  window.fridgeManufacturerCatalogs=Object.freeze({...catalogs});

  function installStyles(){
    if(document.getElementById('v813-manufacturer-catalog-style')) return;
    const style=document.createElement('style');
    style.id='v813-manufacturer-catalog-style';
    style.textContent=`
      .manufacturer-catalog{margin-top:12px}
      .manufacturer-catalog a{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;box-sizing:border-box;padding:12px 14px;border-radius:12px;border:1px solid #d4a16f;background:#fffaf4;color:#8d3300;font-weight:900;text-decoration:none;line-height:1.4}
      .manufacturer-catalog a:active{transform:translateY(1px)}
      .manufacturer-catalog-note{margin-top:5px;text-align:center;font-size:12px;color:#786b62;line-height:1.45}
    `;
    document.head.appendChild(style);
  }

  function decorateManufacturerCatalogLinks(){
    const result=document.getElementById('result');
    if(!result || result.classList.contains('hidden')) return;
    const cards=[...result.querySelectorAll('.cards .card')];
    cards.forEach(card=>{
      if(card.querySelector('.manufacturer-catalog')) return;
      const makerNode=card.querySelector('.maker');
      const maker=makerNode?makerNode.textContent.trim():'';
      const href=catalogs[maker];
      if(!href) return;
      const box=document.createElement('div');
      box.className='manufacturer-catalog';
      box.innerHTML=`<a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${maker}のメーカー公式カタログを開く">メーカー公式カタログを見る ↗</a><div class="manufacturer-catalog-note">メーカー公式の冷蔵庫カタログ／WEBカタログを別タブで開きます</div>`;
      const seller=card.querySelector('.source');
      if(seller && seller.parentNode) seller.parentNode.insertBefore(box,seller);
      else card.appendChild(box);
    });
  }
  window.decorateManufacturerCatalogLinks=decorateManufacturerCatalogLinks;

  const baseShowResult=showResult;
  showResult=function(){
    baseShowResult();
    decorateManufacturerCatalogLinks();
  };

  try{
    document.title='AI冷蔵庫診断 v8.13 - メーカー公式カタログ対応';
    const badge=document.querySelector('header .badge');
    if(badge) badge.textContent='AI冷蔵庫診断 v8.13 / 幅＋奥行き＋選定理由＋公式カタログ';
    installStyles();
  }catch(e){}
})();
