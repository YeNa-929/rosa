/* Original familiars, recipes and adversaries for Zunda Expedition. */
'use strict';

const ZundaExpedition = (() => {
  const recipes = [
    [0,1,'잎새 랩터','frost','#88f4ae',30,1.60,140],
    [0,2,'홍옥 스라소니','execute','#ff9c78',42,1.25,143],
    [0,3,'자전 나비','chain','#deb9ff',35,1.33,150],
    [0,4,'달그늘 여우','burst','#ffd0bb',44,1.12,140],
    [0,5,'유성 족제비','pierce','#95ddff',36,1.45,153],
    [1,2,'가시 사슴','pierce','#e5ee9c',50,1.00,155],
    [1,3,'난초 마도묘','burst','#eaa7f6',44,1.10,151],
    [1,4,'비취 백로','chain','#a0eddc',39,1.34,157],
    [1,5,'청록 기갑수','frost','#8cebf0',38,1.28,165],
    [2,3,'황혼 살쾡이','execute','#ffadbf',52,.98,149],
    [2,4,'여명 사자','burst','#ffc17c',54,.94,149],
    [2,5,'섬광 매','pierce','#a8c4ff',53,.96,178],
    [3,4,'빙화 정령','frost','#c4d9ff',40,1.27,154],
    [3,5,'뇌운 해파리','chain','#c0b1ff',48,1.08,176],
    [4,5,'백야 용린','burst','#f5e9ae',59,.92,163],
    [6,16,'새벽의 수호룡','burst','#ffe299',125,1.05,174],
    [7,17,'노을의 불사조','execute','#ff997d',132,1.00,180],
    [8,19,'폭풍의 천공수','chain','#d1bdff',118,1.16,184],
    [9,18,'극지의 설월호','frost','#bfecff',115,1.22,176],
    [10,20,'혜성의 성기사','pierce','#d0ebff',145,.95,190],
    [12,14,'잎바다의 고래','chain','#a4f8cc',114,1.13,189],
    [0,27,"달토끼 정찰기","frost","#ceecff",38,1.56,142],
    [1,27,"은빛 뿔사슴","chain","#e2f9c5",51,1.12,161],
    [2,28,"태양 도깨비","burst","#ffb371",63,1.02,146],
    [4,28,"금강 불곰","pierce","#ffdf92",67,0.96,151],
    [1,29,"청동 바람개비","pierce","#c4f5ae",44,1.38,165],
    [5,29,"기계 해오라기","chain","#9cddfc",57,1.04,184],
    [2,30,"그림자 카라칼","execute","#c7b8ff",51,1.32,147],
    [3,30,"밤안개 흑표","frost","#b9b5f3",43,1.39,153],
    [0,31,"콩알 혜성","burst","#f4aabd",45,1.39,143],
    [4,31,"박명 나방","execute","#efb6e8",61,1.06,157],
    [27,28,"백월 망치수","pierce","#ffdcba",69,0.98,160],
    [29,30,"회오리 비룡","chain","#80efd7",58,1.17,173],
    [30,31,"월식 사신새","execute","#eea8ce",64,1.1,171],
    [27,31,"눈꽃 박쥐","frost","#bce8fb",49,1.43,148],
    [32,40,"동짓달의 순록","burst","#b9ffed",130,1.11,181],
    [34,37,"용광로의 봉황","chain","#ffbb97",145,1.04,187],
    [38,44,"월하의 맹수","execute","#eaaef1",147,1.09,182],
    [36,42,"은하의 선도자","pierce","#bee9ff",155,1,194],
    [33,45,"빙하의 종달새","frost","#b9e4ff",121,1.28,174],
    [0,100,"혈월 키메라","chain","#ff9ca4",38,1,150],
    [1,101,"석화의 창기병","execute","#ffd899",42,1.13,156],
    [2,102,"별불 실프","burst","#8bd9f7",46,1.26,162],
    [3,103,"겨울의 맹위","pierce","#b1b6ff",50,1.39,168],
    [4,104,"청철의 폭풍","frost","#adf0c4",54,1.52,174],
    [5,105,"황금 미노타우로스","chain","#ff9ca4",58,1,150],
    [27,106,"여명의 기마대","execute","#ffd899",62,1.13,156],
    [28,107,"야행의 추적자","burst","#8bd9f7",66,1.26,162],
    [29,108,"산호의 맹약","pierce","#b1b6ff",38,1.39,168],
    [30,109,"푸른 천룡","frost","#adf0c4",42,1.52,174],
    [31,110,"태양의 화룡","chain","#ff9ca4",46,1,150],
    [0,111,"빙설의 방패","execute","#ffd899",50,1.13,156],
    [1,112,"화산의 수호수","burst","#8bd9f7",54,1.26,162],
    [2,113,"절대영도의 파장","pierce","#b1b6ff",58,1.39,168],
    [3,114,"별뿔 제왕","frost","#adf0c4",62,1.52,174],
    [4,115,"발화의 날개","chain","#ff9ca4",66,1,150],
    [5,116,"황혼의 대현자","execute","#ffd899",38,1.13,156],
    [27,117,"철벽의 날개","burst","#8bd9f7",42,1.26,162],
    [28,118,"비취 스펙터","pierce","#b1b6ff",46,1.39,168],
    [29,119,"황금 행운묘","frost","#adf0c4",50,1.52,174],
    [30,120,"황야의 왕익","chain","#ff9ca4",54,1,150],
    [31,121,"일곱 머리 군주","execute","#ffd899",58,1.13,156],
    [0,122,"숲의 파수꾼","burst","#8bd9f7",62,1.26,162],
    [1,123,"철벽 거신","pierce","#b1b6ff",66,1.39,168]
  ];
  const effects = {
    frost:'서리 · 이동 속도 감소',execute:'마무리 · 체력 낮은 적에 추가 피해',
    chain:'연쇄 · 인접 적 2명에 피해',burst:'폭발 · 주변 적에 광역 피해',
    pierce:'관통 · 방어력 무시'
  };

  const opponents = {
    scout:   {name:'심연 추적자',hp:1,speed:1,armor:0,color:'#79edca',shape:0},
    runner:  {name:'잔광 사냥꾼',hp:.62,speed:1.65,armor:0,color:'#ff8cb8',shape:1},
    shell:   {name:'흑철 파수꾼',hp:1.33,speed:.79,armor:.38,color:'#ffba73',shape:2},
    wraith:  {name:'공허 망령',hp:1.19,speed:1.12,armor:.14,color:'#c4a7ff',shape:3},
    bastion: {name:'철갑 거신',hp:1,speed:.88,armor:.30,color:'#ffc66e',shape:2},
    herald:  {name:'자색 폭풍룡',hp:1.10,speed:1.08,armor:.15,color:'#dba4ff',shape:3},
    eclipse: {name:'일식의 군주',hp:1.23,speed:1,armor:.21,color:'#ff9d87',shape:4},
    sentinel:{name:'월광 감시자',hp:1.15,speed:1.08,armor:.23,color:'#9febff',shape:3}
  };

  function kind(wave, spawned, boss) {
    if(boss) return ['bastion','herald','eclipse','sentinel'][(wave/4-1)%4];
    if(wave>16 && spawned%3===2) return 'wraith';
    if(wave>=7 && spawned%5===3) return 'wraith';
    if(wave>=3 && spawned%4===2) return 'shell';
    if(wave>=2 && spawned%3===1) return 'runner';
    return 'scout';
  }

  function polygon(g, points, fill, stroke = false) {
    g.beginPath();
    points.forEach(([x,y],i)=>i ? g.lineTo(x,y) : g.moveTo(x,y));
    g.closePath();
    g.fillStyle=fill;
    g.fill();
    if(stroke) g.stroke();
  }

  function makeSprite(color, shape, enemy, crown) {
    const canvas=document.createElement('canvas');
    canvas.width=112;
    canvas.height=112;
    const g=canvas.getContext('2d');
    g.translate(56,56);
    const haze=g.createRadialGradient(0,0,6,0,0,51);
    haze.addColorStop(0,color+'88');
    haze.addColorStop(1,color+'00');
    g.fillStyle=haze;
    g.fillRect(-55,-55,110,110);
    g.lineWidth=crown ? 2.5 : 1.7;
    g.strokeStyle=color;
    g.lineJoin='round';
    const wings=[
      [[-8,-12],[-44,-32],[-32,3],[-39,22],[-12,13]],
      [[-7,-8],[-45,-10],[-30,2],[-46,13],[-9,18]],
      [[-10,-15],[-42,-20],[-43,16],[-26,31],[-11,22]],
      [[-7,-14],[-45,-30],[-33,-8],[-46,2],[-23,22],[-10,15]],
      [[-7,-16],[-42,-37],[-35,-7],[-47,13],[-26,8],[-15,20]]
    ][shape];
    for(const side of [-1,1]) {
      polygon(g,wings.map(([x,y])=>[x*side,y]),enemy?'#19182d':'#20444a',true);
      polygon(g,[[-13*side,-9],[-34*side,-15],[-23*side,5],[-31*side,12],[-15*side,8]],color+'88');
    }
    const plating=g.createLinearGradient(-23,-27,24,34);
    plating.addColorStop(0,enemy?'#43506d':'#498a82');
    plating.addColorStop(.55,enemy?'#1c1936':'#182c47');
    plating.addColorStop(1,'#120e23');
    polygon(g,[[0,-33],[22,-18],[25,7],[12,27],[0,34],[-12,27],[-25,7],[-22,-18]],plating,true);
    polygon(g,[[-18,-16],[-6,-21],[0,-16],[6,-21],[18,-16],[11,-9],[0,-12],[-11,-9]],color);
    polygon(g,[[0,-6],[11,7],[0,23],[-11,7]],color,true);
    polygon(g,[[0,-2],[5,7],[0,15],[-5,7]],'#fff6dd');
    if(crown) {
      polygon(g,[[-22,-24],[-25,-44],[-10,-35],[0,-51],[10,-35],[25,-44],[22,-24],[0,-30]],'#272138',true);
      polygon(g,[[0,-43],[7,-36],[0,-30],[-7,-36]],color);
    }
    return canvas;
  }
  const forms = recipes.map(([first,second,name,effect,color,dmg,rate,range],i) => ({
    type:i<21 ? i+6 : i+11,hue:[0,20,-35,72,135,-80,165][Math.floor(i/9)] ?? 95,first,second,name,effect,color,dmg,rate,range,projectile:360+(i%4)*25,skill:effects[effect]
  }));

  const image = src => { const sprite=new Image(); sprite.src=src; return sprite; };
  const beastSrc = index => 'assets/beasts/'+String(index).padStart(2,'0')+'.webp';
  const enemyKeys=Object.keys(opponents);
  const backgrounds=['canyon','rift','citadel','moonwell'].map(name=>image('assets/fields/'+name+'.webp'));
  function images() {
    return {
      familiars:Object.fromEntries(forms.map((f,i)=>[f.type,beastSrc(7+(i%9))])),
      enemies:Object.fromEntries(Object.entries(opponents).map(([key,o])=>[
        key,{art:image(beastSrc(enemyKeys.indexOf(key))), fallback:makeSprite(o.color,o.shape,true,['bastion','herald','eclipse','sentinel'].includes(key))}
      ]))
    };
  }
  const regions = [
    {name:'별등불 협곡',top:'#131a32',land:'#283e54',edge:'#617c8e',road:'#3b4c65',light:'#95caf1',stone:'#456278'},
    {name:'보랏빛 균열',top:'#21152f',land:'#442855',edge:'#916ba2',road:'#513958',light:'#e4a2ff',stone:'#73477d'},
    {name:'일식 성채',top:'#291822',land:'#543640',edge:'#a57469',road:'#60454c',light:'#ffbe88',stone:'#87554f'},
    {name:'월광의 샘',top:'#101f38',land:'#2a5368',edge:'#558f9f',road:'#41657a',light:'#9ef7f4',stone:'#51798c'}
  ];
  function region(wave) { return regions[Math.floor((wave-1)/4)%regions.length]; }

  function terrain(width,height,path,dpr,wave,onLoad) {
    const canvas=document.createElement('canvas');
    canvas.width=Math.round(width*dpr);
    canvas.height=Math.round(height*dpr);
    const g=canvas.getContext('2d');
    g.scale(dpr,dpr);
    const p=region(wave);
    const background=backgrounds[regions.indexOf(p)];
    const painted=background.complete && background.naturalWidth>0;
    if(!background.complete) background.onload=onLoad;
    const floor=g.createRadialGradient(width*.5,height*.4,10,width*.5,height*.48,Math.max(width,height)*.75);
    floor.addColorStop(0,p.land);
    floor.addColorStop(1,p.top);
    g.fillStyle=floor;
    g.fillRect(0,0,width,height);
    if(painted) {
      g.drawImage(background,0,0,width,height);
      g.fillStyle='#080e2640';
      g.fillRect(0,0,width,height);
    }
    let seed=317;
    const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
    for(let i=0;i<(painted?58:185);i++) {
      const x=random()*width,y=random()*height;
      const r=2+random()*9;
      if(!painted && i%4===0 && (x<width*.11 || x>width*.86 || y>height*.81 || y<height*.13)) {
        polygon(g,[[x-r,y+4],[x-r*.35,y-r*1.5],[x+1,y-r*2.2],[x+r,y-4],[x+r*.65,y+6]],p.stone);
        polygon(g,[[x+1,y-r*2.2],[x+r,y-4],[x+r*.65,y+6],[x+1,y+2]],p.top);
        g.fillStyle=p.light+'a6';
        g.fillRect(x,y-r,1.5,3.5);
      } else {
        g.fillStyle=i%7===0 ? p.light+'6d' : p.edge+'42';
        g.fillRect(x,y,i%7===0 ? 2 : r*.65,1);
      }
    }
    g.lineCap='round';
    g.lineJoin='round';
    g.beginPath();
    path.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));
    for(const [size,color] of [[42,p.top+'bd'],[36,p.light+'70'],[33,p.top+'d8'],[28,p.road+'b0']]) {
      g.strokeStyle=color;
      g.lineWidth=size;
      g.stroke();
    }
    g.setLineDash([2,9]);
    g.lineCap='butt';
    g.lineWidth=24;
    g.strokeStyle=p.top+'70';
    g.stroke();
    g.lineWidth=1.3;
    g.strokeStyle=p.light+'b0';
    g.setLineDash([4,14]);
    g.stroke();
    g.setLineDash([]);

    const [exitX]=path.at(-2);
    const exitY=height-12;
    for(const side of [-1,1]) {
      const x=exitX+side*16;
      polygon(g,[[x-6,exitY+13],[x-7,exitY-14],[x,exitY-24],[x+7,exitY-14],[x+6,exitY+13]],p.stone);
      polygon(g,[[x,exitY-23],[x+4,exitY-17],[x,exitY-11],[x-4,exitY-17]],p.light);
    }
    g.beginPath();
    g.ellipse(exitX,exitY+2,12,5,0,0,Math.PI*2);
    g.fillStyle=p.light+'80';
    g.fill();
    return canvas;
  }
  return {forms,opponents,kind,images,region,terrain};
})();
