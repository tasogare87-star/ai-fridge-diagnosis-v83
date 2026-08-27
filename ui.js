const intro=document.getElementById('intro');
const quiz=document.getElementById('quiz');
const result=document.getElementById('result');
const qnum=document.getElementById('qnum');
const question=document.getElementById('question');
const hint=document.getElementById('hint');
const options=document.getElementById('options');
const bar=document.getElementById('bar');
const startBtn=document.getElementById('startBtn');
const prevBtn=document.getElementById('prevBtn');
const prevTopBtn=document.getElementById('prevTopBtn');
const nextBtn=document.getElementById('nextBtn');
const toIntroBtn=document.getElementById('toIntroBtn');
const selectionNote=document.getElementById('selectionNote');
const editBanner=document.getElementById('editBanner');
let index=0;
let editingFromResult=false;
let internalPop=false;
const answers={};

function svgBox(inner){
  return `<div class="svg-wrap"><svg viewBox="0 0 360 230" width="100%" height="230" aria-hidden="true">${inner}</svg></div>`;
}
function topFridge(x,y,w=86,d=62){
  return `<rect x="${x}" y="${y}" width="${w}" height="${d}" rx="10" fill="#ffffff" stroke="#d8a47d" stroke-width="2"/>
  <rect x="${x+8}" y="${y+8}" width="${w-16}" height="${d-16}" rx="7" fill="#fffaf6" stroke="#f1d0b7"/>
  <text x="${x+w/2}" y="${y+d/2+4}" text-anchor="middle" font-size="12" font-weight="900" fill="#8d3300">冷蔵庫</text>`;
}
function openDoor(hingeX,hingeY,side,color,label){
  const dir=side==='right'?1:-1;
  const endX=hingeX+dir*17;
  const endY=hingeY+96;
  const closedEndX=hingeX-dir*86;
  const sweep=side==='right'?1:0;
  const arcX=hingeX+dir*34;
  return `
    <line x1="${hingeX}" y1="${hingeY}" x2="${closedEndX}" y2="${hingeY}" stroke="#cfcfcf" stroke-width="3" stroke-dasharray="6 5"/>
    <line x1="${hingeX}" y1="${hingeY}" x2="${endX}" y2="${endY}" stroke="${color}" stroke-width="9" stroke-linecap="round"/>
    <circle cx="${hingeX}" cy="${hingeY}" r="6" fill="${color}"/>
    <path d="M ${hingeX-dir*28} ${hingeY} A 28 28 0 0 ${sweep} ${arcX} ${hingeY+26}" fill="none" stroke="#2f9e55" stroke-width="4"/>
    <text x="${hingeX+dir*39}" y="${hingeY+21}" text-anchor="middle" font-size="12" font-weight="900" fill="#1e7a3e">約100°</text>
    <text x="${hingeX+dir*15}" y="${endY+18}" text-anchor="middle" font-size="12" font-weight="900" fill="${color}">${label}</text>`;
}
function arrow(x1,y1,x2,y2,color="#ff9200",id="a"){
  return `<defs><marker id="arr-${id}" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${color}"/></marker></defs>
  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="5" stroke-linecap="round" marker-end="url(#arr-${id})"/>`;
}
function renderIntroSvgs(){
  document.getElementById('svg-front').innerHTML = svgBox(`
    <text x="180" y="20" text-anchor="middle" font-size="14" font-weight="900" fill="#8d3300">上から見たドアの開き方</text>
    ${topFridge(42,54,92,58)}
    ${openDoor(134,112,'right','#ff9200','右開き')}
    <text x="88" y="44" text-anchor="middle" font-size="12" font-weight="800" fill="#7a5a46">ヒンジは右側</text>
    ${topFridge(226,54,92,58)}
    ${openDoor(226,112,'left','#397bff','左開き')}
    <text x="272" y="44" text-anchor="middle" font-size="12" font-weight="800" fill="#7a5a46">ヒンジは左側</text>
    <text x="180" y="220" text-anchor="middle" font-size="11" font-weight="800" fill="#6d6d6d">点線＝閉じた状態 ／ 太線＝開いたドア</text>
  `);

  document.getElementById('svg-wall').innerHTML = svgBox(`
    <text x="180" y="20" text-anchor="middle" font-size="14" font-weight="900" fill="#8d3300">壁側ヒンジでも約100°なら候補に残す</text>
    <rect x="14" y="42" width="20" height="166" rx="7" fill="#d7d7d7"/>
    <text x="24" y="34" text-anchor="middle" font-size="11" font-weight="800" fill="#666">左壁</text>
    ${topFridge(44,62,96,58)}
    ${openDoor(44,120,'left','#397bff','左開きも許容')}
    <rect x="326" y="42" width="20" height="166" rx="7" fill="#d7d7d7"/>
    <text x="336" y="34" text-anchor="middle" font-size="11" font-weight="800" fill="#666">右壁</text>
    ${topFridge(220,62,96,58)}
    ${openDoor(316,120,'right','#ff9200','右開きも許容')}
    <rect x="128" y="184" width="104" height="30" rx="15" fill="#eaf8ee" stroke="#9fd3ad"/>
    <text x="180" y="203" text-anchor="middle" font-size="12" font-weight="900" fill="#19723b">約100°確保 → 許容</text>
  `);

  document.getElementById('svg-flow').innerHTML = svgBox(`
    <text x="180" y="20" text-anchor="middle" font-size="14" font-weight="900" fill="#8d3300">壁で除外せず、動線まで見て決める</text>
    <rect x="16" y="58" width="92" height="34" rx="10" fill="#dce9ff" stroke="#9abfff"/>
    <text x="62" y="79" text-anchor="middle" font-size="12" font-weight="900" fill="#1b4cb5">シンク・調理台</text>
    ${topFridge(137,54,86,58)}
    ${openDoor(223,112,'right','#ff9200','')}
    ${arrow(157,164,106,164,'#ff9200','flow-left')}
    <text x="110" y="184" text-anchor="middle" font-size="11" font-weight="900" fill="#8d3300">左へ運ぶ</text>
    <rect x="252" y="58" width="92" height="34" rx="10" fill="#dce9ff" stroke="#9abfff"/>
    <text x="298" y="79" text-anchor="middle" font-size="12" font-weight="900" fill="#1b4cb5">シンク・調理台</text>
    ${arrow(203,164,254,164,'#397bff','flow-right')}
    <text x="250" y="184" text-anchor="middle" font-size="11" font-weight="900" fill="#8d3300">右へ運ぶ</text>
    <text x="180" y="218" text-anchor="middle" font-size="11" font-weight="800" fill="#6d6d6d">壁条件＋普段立つ位置＋調理動線を総合評価</text>
  `);
}

function sameValue(a,b){ return String(a)===String(b); }
function answerLabel(q,value){
  const hit=q.options.find(([,v])=>sameValue(v,value));
  return hit?hit[0]:'';
}
function syncQuizHistory(replace=false){
  if(!history || !history.pushState) return;
  const state={fridgeApp:true,screen:'quiz',index};
  try{
    if(replace) history.replaceState(state,'');
    else history.pushState(state,'');
  }catch(e){}
}
function showQuizAt(targetIndex,{push=true,editing=editingFromResult}={}){
  index=Math.max(0,Math.min(questions.length-1,targetIndex));
  editingFromResult=editing;
  intro.classList.add('hidden');
  result.classList.add('hidden');
  quiz.classList.remove('hidden');
  renderQuestion();
  if(push) syncQuizHistory(false);
  window.scrollTo({top:0,behavior:'smooth'});
}
function renderQuestion(){
  const q=questions[index];
  const hasAnswer=Object.prototype.hasOwnProperty.call(answers,q.key);
  qnum.textContent=`質問 ${index+1} / ${questions.length}`;
  question.textContent=q.text;
  hint.textContent=q.hint;
  bar.style.width=`${((index+1)/questions.length)*100}%`;
  options.innerHTML="";
  editBanner.classList.toggle('hidden',!editingFromResult);

  q.options.forEach(([label,value])=>{
    const b=document.createElement('button');
    b.type='button';
    b.className='option'+(hasAnswer && sameValue(answers[q.key],value)?' selected':'');
    b.textContent=label;
    b.setAttribute('aria-pressed',hasAnswer && sameValue(answers[q.key],value)?'true':'false');
    b.addEventListener('click',()=>{
      answers[q.key]=value;
      renderQuestion();
    });
    options.appendChild(b);
  });

  prevBtn.disabled=index===0;
  prevTopBtn.disabled=index===0;
  nextBtn.disabled=!hasAnswer;
  nextBtn.textContent=index===questions.length-1?'おすすめを見る →':'次へ →';
  selectionNote.textContent=hasAnswer?`選択中：${answerLabel(q,answers[q.key])}`:'当てはまるものを1つ選んでください';
}
function goPrevQuestion(){
  if(index<=0) return;
  showQuizAt(index-1,{push:true,editing:editingFromResult});
}
function goNextQuestion(){
  const q=questions[index];
  if(!Object.prototype.hasOwnProperty.call(answers,q.key)) return;
  if(index<questions.length-1){
    showQuizAt(index+1,{push:true,editing:editingFromResult});
  }else{
    editingFromResult=false;
    showResult();
    try{history.pushState({fridgeApp:true,screen:'result'},'');}catch(e){}
    window.scrollTo({top:0,behavior:'smooth'});
  }
}
function backToIntro({push=true}={}){
  intro.classList.remove('hidden');
  quiz.classList.add('hidden');
  result.classList.add('hidden');
  editingFromResult=false;
  if(push){try{history.pushState({fridgeApp:true,screen:'intro'},'');}catch(e){}}
  window.scrollTo({top:0,behavior:'smooth'});
}
function editAnswers(){
  editingFromResult=true;
  showQuizAt(questions.length-1,{push:true,editing:true});
}
function targetCapacity(f){if(f<=1)return 150;if(f===2)return 300;if(f===3)return 400;if(f===4)return 450;return 500}
