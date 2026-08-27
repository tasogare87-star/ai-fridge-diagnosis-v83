const checkedAt="2026-08-28 08:03 JST";
const shareUrl=(location.protocol === "http:" || location.protocol === "https:") ? location.href.split("#")[0] : "";
const strategicMakers=["MITSUBISHI ELECTRIC","Panasonic","HITACHI","TOSHIBA"];
const products=[
{maker:"Panasonic",model:"NR-E47BR3-C",status:"発売中",price:198000,capacity:468,width:600,doorType:"右開き",doors:5,freezerTotal:118,vegetable:95,vegetablePos:"真ん中",energy:270,autoIce:true,smartphone:false,features:["大容量冷凍室","100％全開構造","野菜室が真ん中"],source:"https://www.yodobashi.com/product/100000001009731808/"},
{maker:"Panasonic",model:"NR-E47BR3L-C",status:"発売中",price:198000,capacity:468,width:600,doorType:"左開き",doors:5,freezerTotal:118,vegetable:95,vegetablePos:"真ん中",energy:270,autoIce:true,smartphone:false,features:["左開き仕様","大容量冷凍室","野菜室が真ん中"],source:"https://www.yodobashi.com/product/100000001009731809/"},
{maker:"Panasonic",model:"NR-F55HY3-N",status:"発売中",price:287100,capacity:551,width:650,doorType:"フレンチドア",doors:6,freezerTotal:143,vegetable:114,vegetablePos:"下段",energy:266,autoIce:true,smartphone:true,features:["大容量冷凍室『コンパクトBIG』","100％フルオープン","スマホアプリ対応"],source:"https://www.yodobashi.com/product/100000001009765440/"},
{maker:"MITSUBISHI ELECTRIC",model:"MR-MZ49N-H",status:"発売中",price:330000,capacity:485,width:650,doorType:"フレンチドア",doors:6,freezerTotal:108,vegetable:92,vegetablePos:"真ん中",energy:269,autoIce:true,smartphone:true,features:["切れちゃう瞬冷凍A.I.","霜ガード","スマホアプリ対応"],source:"https://www.yodobashi.com/product/100000001009614046/"},
{maker:"HITACHI",model:"R-HWS47X N",status:"発売中",price:218000,capacity:470,width:600,doorType:"右開き",doors:5,freezerTotal:118,vegetable:87,vegetablePos:"下段",energy:269,autoIce:true,smartphone:null,features:["幅60cm・470L","冷凍室上段23L＋下段95L","自動製氷"],source:"https://www.yodobashi.com/product/100000001009296247/"},
{maker:"HITACHI",model:"R-HWS47XL N",status:"発売中",price:218000,capacity:470,width:600,doorType:"左開き",doors:5,freezerTotal:118,vegetable:87,vegetablePos:"下段",energy:269,autoIce:true,smartphone:null,features:["左開き仕様","幅60cm・470L","冷凍室合計118L"],source:"https://www.yodobashi.com/product/100000001009296249/"},
{maker:"TOSHIBA",model:"GR-Y510FK(EW)",status:"発売中",price:172710,capacity:509,width:650,doorType:"フレンチドア",doors:6,freezerTotal:117,vegetable:112,vegetablePos:"真ん中",energy:280,autoIce:true,smartphone:false,features:["野菜室がまんなか","摘みたて野菜室","自動製氷"],source:"https://www.yodobashi.com/product/100000001009458349/"},
{maker:"SHARP",model:"SJ-MF43R-H",status:"発売中",price:258000,capacity:429,width:650,doorType:"フレンチドア",doors:6,freezerTotal:88,vegetable:null,vegetablePos:null,energy:247,autoIce:true,smartphone:true,features:["プラズマクラスター","スマホアプリ対応","オートクローザー"],source:"https://www.yodobashi.com/product/100000001009625881/"},
{maker:"SHARP",model:"SJ-TD18R-W",status:"発売中",price:59800,capacity:179,width:495,doorType:"左右付け替え",doors:2,freezerTotal:58,vegetable:null,vegetablePos:null,energy:270,autoIce:false,smartphone:false,features:["つけかえどっちもドア","幅49.5cm","179Lパーソナルサイズ"],source:"https://www.yodobashi.com/product/100000001009510091/"},
{maker:"AQUA",model:"AQR-V43A(S)",status:"発売中",price:145850,capacity:433,width:595,doorType:"右開き",doors:4,freezerTotal:141,vegetable:79,vegetablePos:"真ん中",energy:267,autoIce:true,smartphone:false,features:["大容量冷凍室","見える野菜室","幅59.5cm"],source:"https://www.yodobashi.com/product/100000001009587288/"},
{maker:"AQUA",model:"AQR-V43AL(S)",status:"発売中",price:145850,capacity:433,width:595,doorType:"左開き",doors:4,freezerTotal:141,vegetable:79,vegetablePos:"真ん中",energy:267,autoIce:true,smartphone:false,features:["左開き仕様","大容量冷凍室","見える野菜室"],source:"https://www.yodobashi.com/product/100000001009587290/"}
];

const productKnowledge={
  "NR-E47BR3-C":{
    strong:[
      "幅60cmで468L。設置性と容量のバランスが取りやすい",
      "冷凍室合計118L＋霜つき抑制冷凍で、冷凍食品・作り置きに対応",
      "95Lの真ん中野菜室で、使用頻度の高い野菜を出し入れしやすい",
      "冷蔵室のうるおい冷却など、日常の使いやすさを重視した構成"
    ],
    policy:"パナソニックは、まとめ買い・収納・節電など『日々のくらしで役立つ使いやすさ』と、安心して長く使い続けられる品質を重視。機能を生活シーンに結び付けて選びやすくする設計思想が強みです。",
    official:"https://panasonic.jp/reizo/products/NR-E47BR3.html"
  },
  "NR-E47BR3L-C":{
    strong:[
      "左開き仕様。幅60cmで468Lの容量を確保",
      "冷凍室合計118L＋霜つき抑制冷凍で、冷凍食品・作り置きに対応",
      "95Lの真ん中野菜室で、使用頻度の高い野菜を出し入れしやすい",
      "左右条件が合えば、片開きならではのシンプルな使い勝手"
    ],
    policy:"パナソニックは、まとめ買い・収納・節電など『日々のくらしで役立つ使いやすさ』と、安心して長く使い続けられる品質を重視。機能を生活シーンに結び付けて選びやすくする設計思想が強みです。",
    official:"https://panasonic.jp/reizo/products/NR-E47BR3.html"
  },
  "NR-F55HY3-N":{
    strong:[
      "幅65cmで551L。設置スペースを抑えながら大容量を確保する『コンパクトBIG』",
      "112Lの大容量冷凍室と100％フルオープンで、まとめ買いを整理しやすい",
      "上段ケースの霜つき抑制冷凍は長期保存を意識した設計",
      "微凍結・AIエコナビ・クーリングアシストなど、保存から時短調理まで対応"
    ],
    policy:"パナソニックは、収納性・保存・時短・省エネを生活動線の中でまとめて使いやすくする方向性が明確。『大容量でも取り出しやすい』『長く安心して使える』ことを重視しています。",
    official:"https://panasonic.jp/reizo/products/NR-F55HY3.html"
  },
  "MR-MZ49N-H":{
    strong:[
      "幅65cm・奥行65cmで485L。キッチンに収めやすい『中だけひろびろ大容量』",
      "切れちゃう瞬冷凍A.I.で、解凍や小分けの手間を減らしやすい",
      "ひろびろ氷点下ストッカーD A.I.で、肉・魚を生のまま低温保存",
      "全室独立おまかせA.I.＋真ん中野菜室＋スマホ連携で、保存と使い勝手を細かく最適化"
    ],
    policy:"三菱電機は、断熱・収納技術で庫内容量を広げつつ、食材ごとに最適な温度帯を使い分ける独自保存技術を重視。まとめ買いした食材を『保存する』だけでなく、解凍なしで日常的に使いやすくする時短発想が特徴です。",
    official:"https://www.mitsubishielectric.co.jp/home/reizouko/product/mr-mz49n/"
  },
  "R-HWS47X N":{
    strong:[
      "幅60cmで470L。省スペースとファミリー容量のバランスが良い",
      "まるごとチルド＋特鮮氷温ルームで、冷蔵室の食品保存を使い分けやすい",
      "ひろin冷凍プラスの3段ケースで、冷凍食品を整理しながら収納しやすい",
      "冷蔵室独立冷却システムで省エネにも配慮"
    ],
    policy:"日立は、冷蔵室・冷凍室を『食品を入れやすく、見つけやすく、鮮度を保ちやすい』構成にしつつ、独立冷却などで省エネも両立する設計を重視。毎日の食品管理をシンプルにする方向性が強みです。",
    official:"https://kadenfan.hitachi.co.jp/rei/lineup/rhws47x/"
  },
  "R-HWS47XL N":{
    strong:[
      "左開き仕様。幅60cmで470Lのファミリー容量",
      "まるごとチルド＋特鮮氷温ルームで、冷蔵室の食品保存を使い分けやすい",
      "ひろin冷凍プラスの3段ケースで、冷凍食品を整理しながら収納しやすい",
      "冷蔵室独立冷却システムで省エネにも配慮"
    ],
    policy:"日立は、冷蔵・冷凍それぞれの保存品質と整理のしやすさを両立し、毎日の食品管理をシンプルにする方向性が強み。鮮度保持と使いやすさを生活動線に落とし込む設計を重視しています。",
    official:"https://kadenfan.hitachi.co.jp/rei/lineup/rhws47x/"
  },
  "GR-Y510FK(EW)":{
    strong:[
      "509Lの大容量と、出し入れしやすい『野菜室がまんなか』を両立",
      "新鮮 摘みたて野菜室で、低温高湿度冷気とエチレン分解により野菜の鮮度保持を重視",
      "速鮮チルド・解凍モードなど、保存から調理前の時短までつなげやすい",
      "選べる節電モード、自動製氷、切り替え冷凍など日常運用の幅が広い"
    ],
    policy:"東芝は『野菜の鮮度と取り出しやすさ』を中心に、冷蔵・チルド・冷凍を使い分けやすくする設計が特徴。真ん中野菜室を軸に、食材管理のしやすさと日々の調理動線を重視するメーカーです。",
    official:"https://www.toshiba-lifestyle.com/jp/refrigerators/gr-y510fk/"
  }
};

function productStory(p){
  return productKnowledge[p.model]||null;
}

const featureHighlights={
  "NR-E47BR3-C":["霜つき抑制冷凍","うるおい冷却","真ん中野菜室","100％全開構造"],
  "NR-E47BR3L-C":["霜つき抑制冷凍","うるおい冷却","真ん中野菜室","左開き仕様"],
  "NR-F55HY3-N":["サクッと切れる微凍結","AIエコナビ","クーリングアシスト","霜つき抑制冷凍"],
  "MR-MZ49N-H":["切れちゃう瞬冷凍A.I.","ひろびろ氷点下ストッカーD A.I.","全室独立おまかせA.I.","スマホ連携"],
  "R-HWS47X N":["まるごとチルド","特鮮氷温ルーム","ひろin冷凍プラス","冷蔵室独立冷却システム"],
  "R-HWS47XL N":["まるごとチルド","特鮮氷温ルーム","ひろin冷凍プラス","冷蔵室独立冷却システム"],
  "GR-Y510FK(EW)":["新鮮 摘みたて野菜室","速鮮チルド＆解凍モード","切り替え冷凍","選べる節電モード"]
};
function productFeatureHighlights(p){
  return featureHighlights[p.model] || p.features || [];
}
function featureRichnessScore(p){
  let score=0;
  const story=productStory(p);
  const highlights=productFeatureHighlights(p);
  if(strategicMakers.includes(p.maker)) score+=18;
  if(p.doorType==='フレンチドア') score+=16;
  if(p.smartphone===true) score+=10;
  if(p.autoIce===true) score+=5;
  if(p.doors>=6) score+=7;
  if(story) score+=Math.min(20,story.strong.length*5);
  score+=Math.min(24,highlights.length*6);
  return score;
}

const questions=[
{key:"maxWidth",text:"冷蔵庫を置ける横幅はどれくらいですか？",hint:"分からない場合は「まだ分からない」で大丈夫です。放熱スペースや搬入経路は購入前に店頭で確認します。",options:[["50cmまで",500],["60cmまで",600],["65cmまで",650],["70cmまで",700],["まだ分からない",999]]},
{key:"wallSide",text:"冷蔵庫の横に壁・柱・背の高い家具はありますか？",hint:"冷蔵庫を正面から見て答えてください。壁があっても約100°開けられる場合は候補に残します。",options:[["左側", "left"],["右側","right"],["両側","both"],["特にない","none"],["分からない","unknown"]]},
{key:"kitchenSide",text:"シンク・調理台は冷蔵庫のどちら側にありますか？",hint:"冷蔵庫から食材を取り出したあと、普段どちらへ動くかをイメージしてください。",options:[["左側","left"],["右側","right"],["正面・少し離れている","front"],["分からない","unknown"]]},
{key:"approachSide",text:"冷蔵庫を開けるとき、どこに立つことが多そうですか？",hint:"分からなければ「中央」または「分からない」で大丈夫です。開けやすい向きの参考にします。",options:[["左寄り","left"],["右寄り","right"],["中央","center"],["分からない","unknown"]]},
{key:"family",text:"何人でお使いになりますか？",hint:"人数をもとに、容量が小さすぎない機種を優先します。",options:[["1人",1],["2人",2],["3人",3],["4人",4],["5人以上",5]]},
{key:"budget",text:"ご予算はどのくらいですか？",hint:"価格は変動するため、目安として使います。予算だけでおすすめ順位は決めません。",options:[["10万円まで",100000],["15万円程度",150000],["20万円程度",200000],["25万円程度",250000],["30万円程度",300000],["まだ決めていない",999999]]},
{key:"freezerUse",text:"冷凍食品・作り置き・まとめ買いは多いですか？",hint:"よく使うほど、冷凍室が広い機種を優先します。",options:[["ほとんど使わない",1],["少なめ",2],["ふつう",3],["多め",4],["かなり多い",5]]},
{key:"vegetablePriority",text:"野菜室はどのくらい重視しますか？",hint:"野菜をよく買う方は「重視」以上がおすすめです。野菜室の広さと使いやすさを比較します。",options:[["あまり重視しない",1],["少し",2],["ふつう",3],["重視する",4],["かなり重視する",5]]},
{key:"vegetablePos",text:"野菜室は真ん中にある方が使いやすいですか？",hint:"野菜をよく使い、かがむ回数を減らしたい方は「真ん中が良い」を選んでください。",options:[["真ん中が良い","middle"],["下段でもよい","lower"],["どちらでもよい","either"]]},
{key:"autoIce",text:"自動製氷は必要ですか？",hint:"「必須」を選ぶと、自動製氷がない機種は候補から外します。",options:[["必須","must"],["あればうれしい","prefer"],["不要","no"],["どちらでもよい","either"]]},
{key:"smartphone",text:"スマホアプリ連携は必要ですか？",hint:"「必須」を選ぶと、対応を確認できている機種だけを候補にします。",options:[["必須","must"],["あればうれしい","prefer"],["不要","no"],["どちらでもよい","either"]]},
{key:"energy",text:"電気代・省エネをどのくらい重視しますか？",hint:"省エネを重視するほど、年間消費電力量が少ない機種を優先します。",options:[["本体価格を優先",1],["やや価格を優先",2],["バランス重視",3],["省エネ重視",4],["かなり省エネ重視",5]]}
];