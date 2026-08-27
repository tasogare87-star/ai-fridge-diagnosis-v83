function doorPref(){
  const s={"右開き":0,"左開き":0,"フレンチドア":0,"左右付け替え":0};
  const why=[];
  const hardBlock=[];

  // v8.5: 幅65cm級以上が設置できる場合はフレンチドアを優先。
  // 片側だけを大きく振らずに開閉でき、左右どちらからもアクセスしやすいため、売場提案の第一軸にする。
  if(answers.maxWidth>=650 || answers.maxWidth===999){
    s['フレンチドア']+=24;
    why.push('幅65cm級の設置が可能なため、左右どちらからもアクセスしやすく扉の振り幅を抑えやすいフレンチドアを優先しています。');
  }

  // 壁際でも約100°開けられる前提。壁側ヒンジの片開きも除外しない。
  if(answers.wallSide==='left'){
    s['右開き']+=16;
    s['左右付け替え']+=12;
    s['フレンチドア']+=10;
    s['左開き']+=2;
    why.push('左側に壁がありますが、約100°開けられる前提のため左開きも除外しません。壁から逃げる右開きには軽く加点しています。');
  }
  if(answers.wallSide==='right'){
    s['左開き']+=16;
    s['左右付け替え']+=12;
    s['フレンチドア']+=10;
    s['右開き']+=2;
    why.push('右側に壁がありますが、約100°開けられる前提のため右開きも除外しません。壁から逃げる左開きには軽く加点しています。');
  }
  if(answers.wallSide==='both'){
    s['フレンチドア']+=18;
    s['左右付け替え']+=14;
    s['右開き']+=5;
    s['左開き']+=5;
    why.push('左右に壁・家具があります。約100°の開閉が確保できる片開きは候補に残しつつ、扉の振り幅が小さいフレンチドアをやや優先します。');
  }
  if(answers.wallSide==='none' || answers.wallSide==='unknown'){
    why.push('強い壁制約はないため、動線と使い勝手を中心に比較しています。');
  }

  if(answers.kitchenSide==='left'){
    s['右開き']+=18;
    s['左右付け替え']+=10;
    s['フレンチドア']+=6;
    why.push('シンク・調理台が左側なので、食材を左方向へ運びやすい開き方を加点しています。');
  }
  if(answers.kitchenSide==='right'){
    s['左開き']+=18;
    s['左右付け替え']+=10;
    s['フレンチドア']+=6;
    why.push('シンク・調理台が右側なので、食材を右方向へ運びやすい開き方を加点しています。');
  }

  if(answers.approachSide==='left'){
    s['右開き']+=8;
    s['左右付け替え']+=4;
  }
  if(answers.approachSide==='right'){
    s['左開き']+=8;
    s['左右付け替え']+=4;
  }
  if(answers.approachSide==='center'){
    s['フレンチドア']+=5;
  }

  return {scores:s,ranked:Object.entries(s).sort((a,b)=>b[1]-a[1]),why,hardBlock};
}

function hardFilter(p,d){
  if(p.status!=="発売中")return false;
  if(p.width>answers.maxWidth)return false;
  if(answers.autoIce==='must'&&p.autoIce!==true)return false;
  if(answers.smartphone==='must'&&p.smartphone!==true)return false;
  if(d.hardBlock.includes(p.doorType))return false;
  return true;
}
function normalize(v,min,max){return max===min ? .5 : (v-min)/(max-min)}
function productScore(p,d,pool){
  let score=0,target=targetCapacity(answers.family);

  // 1. 設置・容量・使い方を主評価。価格だけでは上位にならない配点。
  if(p.capacity>=target)score+=26; else score-=Math.min(32,(target-p.capacity)*.20);
  const fVals=pool.map(x=>x.freezerTotal).filter(Number.isFinite),fMin=Math.min(...fVals),fMax=Math.max(...fVals);
  score+=normalize(p.freezerTotal,fMin,fMax)*(answers.freezerUse*7);
  if(Number.isFinite(p.vegetable)){
    const vVals=pool.map(x=>x.vegetable).filter(Number.isFinite),vMin=Math.min(...vVals),vMax=Math.max(...vVals);
    score+=normalize(p.vegetable,vMin,vMax)*(answers.vegetablePriority*4);
  }
  if(answers.vegetablePos==='middle'&&p.vegetablePos==='真ん中')score+=14;
  if(answers.vegetablePos==='middle'&&p.vegetablePos==='下段')score-=6;
  if(answers.vegetablePos==='lower'&&p.vegetablePos==='下段')score+=7;
  const eVals=pool.map(x=>x.energy).filter(Number.isFinite),eMin=Math.min(...eVals),eMax=Math.max(...eVals);
  score+=(1-normalize(p.energy,eMin,eMax))*(answers.energy*6);
  score+=(d.scores[p.doorType]||0);
  if(p.doorType==='フレンチドア') score+=18; // 設置可能な候補の中ではフレンチドアを優先

  // 2. 予算は重要条件として残すが、順位を決め過ぎない。
  if(answers.budget!==999999){
    const budgetRatio=p.price/answers.budget;
    if(budgetRatio<=1.00)score+=8;
    else if(budgetRatio<=1.10)score+=3;
    else if(budgetRatio<=1.20)score-=6;
    else if(budgetRatio<=1.35)score-=16;
    else if(budgetRatio<=1.50)score-=24;
    else score-=34;
  }
  if(answers.autoIce==='prefer'&&p.autoIce)score+=7;
  if(answers.smartphone==='prefer'&&p.smartphone===true)score+=8;
  if(answers.smartphone==='no'&&p.smartphone===false)score+=2;

  // 3. 売場戦略補正。三菱・Panasonic・日立・東芝は、戦略メーカー同士の価格差が大きくない場合に優先。
  if(strategicMakers.includes(p.maker)){
    const strategicPool=pool.filter(x=>strategicMakers.includes(x.maker));
    const referencePrice=Math.min(...(strategicPool.length?strategicPool:pool).map(x=>x.price));
    const gap=p.price-referencePrice;
    const ratio=referencePrice>0?p.price/referencePrice:99;
    let strategyBonus=0;
    const budgetAllowsStrategy = answers.budget===999999 || p.price<=answers.budget*1.20;
    if(budgetAllowsStrategy){
      if(gap<=30000 || ratio<=1.15) strategyBonus+=16;
      else if(gap<=50000 || ratio<=1.25) strategyBonus+=9;
      else if(gap<=80000 || ratio<=1.35) strategyBonus+=4;
      if(answers.budget!==999999 && p.price<=answers.budget*1.10) strategyBonus+=4;
    }
    score+=strategyBonus;
  }

  // 4. AQUAは価格メリットだけで上位に来ないよう明確に抑制。
  //    適合候補としては残すが、戦略メーカー・他社の適合機がある場合は順位制御を行う。
  if(p.maker==='AQUA') score-=28;

  return Math.round(score);
}
function getCandidates(d){
  let pool=products.filter(p=>hardFilter(p,d));
  if(pool.length===0)pool=products.filter(p=>p.status==='発売中' && p.width<=answers.maxWidth);
  const scored=pool.map(p=>({...p,score:productScore(p,d,pool)})).sort((a,b)=>b.score-a.score);
  const nonAqua=scored.filter(p=>p.maker!=='AQUA');
  const aqua=scored.filter(p=>p.maker==='AQUA');

  // 通常候補は3機種。AQUAは他社適合機が十分ある場合は通常上位3枠から外す。
  let regular=[];
  if(nonAqua.length>=3) regular=nonAqua.slice(0,3);
  else if(nonAqua.length>=1) regular=[...nonAqua,...aqua].slice(0,3);
  else regular=scored.slice(0,3);

  // 4つ目は診断順位とは別軸の「機能充実おすすめ」。
  // 設置幅・必須条件は守り、通常3候補と重複させず、代表付加機能・スマホ・6ドア・フレンチ等で評価。
  const used=new Set(regular.map(p=>p.model));
  let premiumPool=scored.filter(p=>!used.has(p.model) && p.maker!=='AQUA');
  if(premiumPool.length===0) premiumPool=scored.filter(p=>!used.has(p.model));
  const featurePick=premiumPool
    .map(p=>({...p,featureScore:featureRichnessScore(p),_featurePick:true}))
    .sort((a,b)=>b.featureScore-a.featureScore || b.score-a.score)[0] || null;

  return {regular,featurePick};
}
function matchRows(p,d){
  const arr=[],target=targetCapacity(answers.family);
  arr.push([p.capacity>=target,`容量 ${p.capacity}L（基準 ${target}L以上）`]);
  if(answers.freezerUse>=4)arr.push([p.freezerTotal>=110,`冷凍室合計 ${p.freezerTotal}L`]);
  if(answers.vegetablePriority>=4&&p.vegetable!==null)arr.push([p.vegetable>=90,`野菜室 ${p.vegetable}L`]);
  if(answers.vegetablePos==='middle')arr.push([p.vegetablePos==='真ん中',`野菜室位置：${p.vegetablePos||'確認項目なし'}`]);
  if(answers.autoIce==='must'||answers.autoIce==='prefer')arr.push([p.autoIce===true,`自動製氷：${p.autoIce?'有':'無'}`]);
  if(answers.smartphone==='must'||answers.smartphone==='prefer'){
    if(p.smartphone===null)arr.push([null,'スマホ対応：今回の確認情報では判定保留']);
    else arr.push([p.smartphone===true,`スマホ対応：${p.smartphone?'有':'無'}`]);
  }
  arr.push([true,`年間消費電力量 ${p.energy}kWh/年`]);
  arr.push([(d.scores[p.doorType]||0)>=10,`ドア方式：${p.doorType}`]);
  return arr;
}
function yen(n){return n.toLocaleString('ja-JP')+'円'}

function resultSvg(d){
  const leftWall = answers.wallSide==='left' || answers.wallSide==='both';
  const rightWall = answers.wallSide==='right' || answers.wallSide==='both';
  const kitchenLeft = answers.kitchenSide==='left';
  const kitchenRight = answers.kitchenSide==='right';
  const rec = d.ranked[0][0];
  const leftDoor = rec==='左開き';
  const rightDoor = rec==='右開き';
  const french = rec==='フレンチドア';
  const flex = rec==='左右付け替え';

  let doorGraphic='';
  if(rightDoor){
    doorGraphic=`<line x1="268" y1="128" x2="168" y2="128" stroke="#cfcfcf" stroke-width="3" stroke-dasharray="6 5"/>
      <line x1="268" y1="128" x2="287" y2="238" stroke="#ff9200" stroke-width="11" stroke-linecap="round"/>
      <circle cx="268" cy="128" r="7" fill="#ff9200"/>
      <path d="M238 128 A32 32 0 0 1 299 158" fill="none" stroke="#2f9e55" stroke-width="4"/>
      <text x="304" y="151" font-size="13" font-weight="900" fill="#1c763d">約100°</text>`;
  }else if(leftDoor){
    doorGraphic=`<line x1="152" y1="128" x2="252" y2="128" stroke="#cfcfcf" stroke-width="3" stroke-dasharray="6 5"/>
      <line x1="152" y1="128" x2="133" y2="238" stroke="#397bff" stroke-width="11" stroke-linecap="round"/>
      <circle cx="152" cy="128" r="7" fill="#397bff"/>
      <path d="M182 128 A32 32 0 0 0 121 158" fill="none" stroke="#2f9e55" stroke-width="4"/>
      <text x="76" y="151" font-size="13" font-weight="900" fill="#1c763d">約100°</text>`;
  }else if(french){
    doorGraphic=`<line x1="210" y1="128" x2="164" y2="128" stroke="#cfcfcf" stroke-width="3" stroke-dasharray="5 5"/>
      <line x1="210" y1="128" x2="178" y2="205" stroke="#397bff" stroke-width="9" stroke-linecap="round"/>
      <line x1="210" y1="128" x2="242" y2="205" stroke="#ff9200" stroke-width="9" stroke-linecap="round"/>
      <text x="210" y="226" text-anchor="middle" font-size="12" font-weight="900" fill="#1c763d">小さい振り幅で両側へ開閉</text>`;
  }else if(flex){
    doorGraphic=`<line x1="152" y1="128" x2="133" y2="226" stroke="#397bff" stroke-width="8" stroke-linecap="round"/>
      <line x1="268" y1="128" x2="287" y2="226" stroke="#ff9200" stroke-width="8" stroke-linecap="round" opacity=".75"/>
      <text x="210" y="238" text-anchor="middle" font-size="12" font-weight="900" fill="#1c763d">設置後に左右を選べるタイプ</text>`;
  }

  return `<div class="svg-wrap"><svg viewBox="0 0 420 285" width="100%" height="285" aria-hidden="true">
    <text x="210" y="24" text-anchor="middle" font-size="16" font-weight="900" fill="#8d3300">あなたの設置・開閉イメージ（上から見た図）</text>
    ${leftWall?'<rect x="24" y="48" width="34" height="190" rx="9" fill="#d9d9d9"/><text x="41" y="42" text-anchor="middle" font-size="12" font-weight="800" fill="#6a6a6a">左壁</text>':''}
    ${rightWall?'<rect x="362" y="48" width="34" height="190" rx="9" fill="#d9d9d9"/><text x="379" y="42" text-anchor="middle" font-size="12" font-weight="800" fill="#6a6a6a">右壁</text>':''}
    <rect x="152" y="70" width="116" height="58" rx="12" fill="#ffffff" stroke="#e4b38b" stroke-width="2"/>
    <rect x="162" y="80" width="96" height="38" rx="8" fill="#fff8f2" stroke="#f1d0b7"/>
    <text x="210" y="103" text-anchor="middle" font-size="14" font-weight="900" fill="#8d3300">冷蔵庫</text>
    ${doorGraphic}
    ${kitchenLeft?'<rect x="24" y="248" width="122" height="30" rx="10" fill="#dce9ff" stroke="#9abfff"/><text x="85" y="267" text-anchor="middle" font-size="11" font-weight="800" fill="#1b4cb5">左：シンク・調理台</text>':''}
    ${kitchenRight?'<rect x="274" y="248" width="122" height="30" rx="10" fill="#dce9ff" stroke="#9abfff"/><text x="335" y="267" text-anchor="middle" font-size="11" font-weight="800" fill="#1b4cb5">右：シンク・調理台</text>':''}
    <rect x="154" y="248" width="112" height="30" rx="15" fill="#eaf8ee" stroke="#9fd3ad"/>
    <text x="210" y="267" text-anchor="middle" font-size="11" font-weight="900" fill="#19723b">約100°開閉を許容</text>
  </svg></div>`;
}

function showResult(){
  const d=doorPref();
  const candidateSet=getCandidates(d);
  const list=[...candidateSet.regular, ...(candidateSet.featurePick?[candidateSet.featurePick]:[])];
  const target=targetCapacity(answers.family);
  const mustText=[answers.autoIce==='must'?'自動製氷 必須':null,answers.smartphone==='must'?'スマホ連携 必須':null].filter(Boolean).join(' / ')||'必須機能なし';
  intro.classList.add('hidden');
  quiz.classList.add('hidden');
  result.classList.remove('hidden');
  result.innerHTML=`
    <span class="badge">診断結果</span>
    <div class="type">あなたに合う冷蔵庫候補</div>
    <div class="sub">設置条件と使い方から<strong>おすすめ3機種</strong>を選び、さらに<strong>便利機能を重視する方向けの1機種</strong>をご提案します。設置できる場合はフレンチドアを優先しています。</div>
    <div class="summary-grid">
      <div class="summary"><div class="k">おすすめ容量</div><div class="v">${target}L以上</div></div>
      <div class="summary"><div class="k">置ける横幅</div><div class="v">${answers.maxWidth===999?'未確定':answers.maxWidth+'mm以下'}</div></div>
      <div class="summary"><div class="k">おすすめドア</div><div class="v">${d.ranked[0][0]}</div></div>
      <div class="summary"><div class="k">こだわり条件</div><div class="v">${mustText}</div></div>
    </div>
    <div class="result-layout">
      <div>
        <div class="doorbox">
          <div class="rank">あなたのキッチンに合いやすいドア</div>
          <div class="door-rec">${d.ranked[0][0]} がおすすめ</div><div class="angle-badge">壁際でも約100°開けば許容</div>
          <div class="sub">${d.why.join(' ')}</div>
          <div style="margin-top:10px">${d.ranked.map((x,i)=>`<span class="chip" style="margin:3px">${i+1}. ${x[0]}</span>`).join('')}</div>
        </div>
        <div class="points">
          <div class="point">約100°ルール<br><span class="sub">壁際でも開閉できれば片開きを許容</span></div>
          <div class="point">生活動線<br><span class="sub">シンク・調理台へ向かう方向を反映</span></div>
          <div class="point">商品比較<br><span class="sub">容量・冷凍・野菜・省エネを比較</span></div>
        </div>
      </div>
      <div>
        <div class="visualbox">
          <div class="rank">設置イメージ</div>
          ${resultSvg(d)}
          <div class="small-note">※ 約100°は本診断上の許容前提です。実機の引き出し・ドアポケットの使い勝手、必要開閉角度、壁からの逃げ寸はメーカー据付条件で最終確認してください。</div>
        </div>
      </div>
    </div>
    <h2>おすすめ候補</h2>
    <div class="customer-note"><strong>候補の見方：</strong>1〜3は設置・容量・使い方のバランスで選んだ候補です。別枠の「機能重視」は、鮮度保存・時短・スマホ連携などの便利機能が充実した機種です。</div>
    <div class="cards">${list.map((p,i)=>{const matches=matchRows(p,d);const isFeature=!!p._featurePick;const highlights=productFeatureHighlights(p);return `<article class="card ${isFeature?'feature-pick-card':''}"><div class="rank">${isFeature?`機能を重視する方におすすめ`:`おすすめ候補 ${i+1}`}</div><div class="maker">${p.maker}</div>${isFeature?'<span class="feature-badge">便利機能が充実</span>':''}<div class="model">${p.model}</div><span class="chip">${p.doorType}</span><div class="price">参考価格（登録時） ${yen(p.price)}</div><div class="status">${p.status} / 商品情報 ${checkedAt}</div><div class="specgrid"><div class="spec"><div class="k">総容量</div><div class="v">${p.capacity}L</div></div><div class="spec"><div class="k">本体幅</div><div class="v">${p.width}mm</div></div><div class="spec"><div class="k">冷凍室合計</div><div class="v">${p.freezerTotal}L</div></div><div class="spec"><div class="k">野菜室</div><div class="v">${p.vegetable===null?'確認項目外':p.vegetable+'L / '+p.vegetablePos}</div></div><div class="spec"><div class="k">年間消費電力量</div><div class="v">${p.energy}kWh/年</div></div><div class="spec"><div class="k">自動製氷</div><div class="v">${p.autoIce?'有':'無'}</div></div><div class="spec"><div class="k">スマホ連携</div><div class="v">${p.smartphone===null?'判定保留':p.smartphone?'有':'無'}</div></div><div class="spec"><div class="k">ドア数</div><div class="v">${p.doors}ドア</div></div></div><ul class="matchlist">${matches.map(([ok,text])=>`<li class="${ok===true?'ok':ok===false?'ng':'neutral'}">${ok===true?'✓':ok===false?'△':'－'} ${text}</li>`).join('')}</ul><div class="feature-highlight"><div class="feature-highlight-title">この機種ならではの便利機能</div><div class="feature-tags">${highlights.map(x=>`<span class="feature-tag">${x}</span>`).join('')}</div></div><ul class="features">${p.features.map(x=>`<li>${x}</li>`).join('')}</ul>${(()=>{const story=productStory(p);return story?`<div class="product-story"><div class="strong-box"><div class="story-title">このメーカー・機種の強み</div><ul class="story-list">${story.strong.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="policy-box"><div class="story-title">メーカーの考え方</div><p class="policy-text">${story.policy}</p><div class="official-source"><a href="${story.official}" target="_blank" rel="noopener">メーカー公式サイトで確認</a></div></div></div>`:''})()}<div class="source"><a href="${p.source}" target="_blank" rel="noopener">商品情報を見る（ヨドバシ.com）</a></div></article>`}).join('')}</div>
    <div class="customer-caution"><strong>ご購入前の最終確認：</strong>価格・在庫・納期・搬入経路・設置寸法・扉の開き方は変わる場合があります。候補が決まったら、店頭スタッフと一緒に最終確認してください。</div>
    <details class="staff-details">
      <summary>スタッフ向け情報</summary>
      <div class="staff-inner">
        <div class="staff"><strong>接客引継ぎメモ</strong><br>「お客様条件では、設置できる場合は<strong>フレンチドアを優先</strong>し、容量${target}L以上を基準に通常候補を3機種へ絞っています。別枠で、独自保存・鮮度・時短・スマホ連携などの<strong>付加機能が充実したおすすめ機種</strong>を表示しています。壁際でも約100°開けられる片開きは候補に残し、実機で最終確認してください。」</div>
        <div class="strategy-note"><strong>内部ロジック：</strong>設置・容量条件を満たす場合はフレンチドアを優先。価格差が大きくない場合は三菱電機・Panasonic・日立・東芝を優先し、AQUAは他社適合機が十分ある場合に通常上位3候補から外します。</div>
        <div class="warning"><strong>データ運用：</strong>本ファイルは ${checkedAt} 時点の確認スナップショットです。価格・在庫・販売状態は変動します。確認できない項目は推測せず「判定保留」としています。</div>
      </div>
    </details>
    <div class="sharebox"><div class="qr-placeholder" aria-label="共有QRコードは公開URL確定後に生成"><strong>共有URL</strong><br><span>このページのURLを自動取得</span></div><div><div class="share-title">家族に診断ページを共有</div><div class="sub">このページを家族のスマートフォンにも送れます。</div><div class="share-url js-share-url">公開中のURLを自動取得します</div><div class="share-actions"><button class="btn secondary" type="button" onclick="shareApp()">共有する</button><button class="btn secondary" type="button" onclick="copyShareUrl()">URLをコピー</button></div></div></div>
    <div class="actions"><button class="btn primary" onclick="editAnswers()">条件を変えて再診断</button><button class="btn secondary" onclick="restart()">最初から</button><button class="btn secondary" onclick="window.print()">結果を印刷・保存</button></div>
  `;
}


function refreshShareUrlDisplay(){
  const u=shareUrl || 'このページをChrome / Safariで開いた後、アドレスバーのURLを共有してください';
  document.querySelectorAll('.js-share-url').forEach(el=>{el.textContent=u;});
}
refreshShareUrlDisplay();

function copyShareUrl(){
  if(navigator.clipboard && window.isSecureContext){
    navigator.clipboard.writeText(shareUrl).then(()=>alert('共有URLをコピーしました。')).catch(()=>prompt('このURLをコピーしてください',shareUrl));
  }else{
    prompt('このURLをコピーしてください',shareUrl);
  }
}
async function shareApp(){
  if(navigator.share){
    try{const payload={title:'AI冷蔵庫診断',text:'設置スペースや使い方から、冷蔵庫のおすすめ候補を確認できる診断です。'};if(shareUrl)payload.url=shareUrl;await navigator.share(payload);return;}catch(e){if(e && e.name==='AbortError')return;}
  }
  copyShareUrl();
}

function restart(){
  index=0;
  editingFromResult=false;
  Object.keys(answers).forEach(k=>delete answers[k]);
  result.classList.add('hidden');
  quiz.classList.add('hidden');
  intro.classList.remove('hidden');
  bar.style.width='0';
  try{history.pushState({fridgeApp:true,screen:'intro'},'');}catch(e){}
  window.scrollTo({top:0,behavior:'smooth'});
}

startBtn.addEventListener('click',()=>{
  editingFromResult=false;
  showQuizAt(0,{push:true,editing:false});
});
prevBtn.addEventListener('click',goPrevQuestion);
prevTopBtn.addEventListener('click',goPrevQuestion);
nextBtn.addEventListener('click',goNextQuestion);
toIntroBtn.addEventListener('click',()=>backToIntro({push:true}));

// ブラウザ/スマホの「戻る」でも、アプリ内の前画面へ戻れるようにする。
try{
  history.replaceState({fridgeApp:true,screen:'intro'},'');
  window.addEventListener('popstate',(e)=>{
    const st=e.state;
    if(!st || !st.fridgeApp) return;
    if(st.screen==='intro'){
      intro.classList.remove('hidden'); quiz.classList.add('hidden'); result.classList.add('hidden'); editingFromResult=false;
    }else if(st.screen==='quiz'){
      index=Math.max(0,Math.min(questions.length-1,Number(st.index)||0));
      intro.classList.add('hidden'); result.classList.add('hidden'); quiz.classList.remove('hidden'); renderQuestion();
    }else if(st.screen==='result'){
      showResult();
    }
    window.scrollTo({top:0,behavior:'auto'});
  });
}catch(e){}

renderIntroSvgs();