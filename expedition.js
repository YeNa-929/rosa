/* Original familiars, recipes and adversaries for Zunda Expedition. */
'use strict';

const ZundaExpedition = (() => {
  const recipes = [
    [118,119,'잎새 랩터','frost','#88f4ae',30,1.60,140],
    [118,122,'홍옥 스라소니','execute','#ff9c78',42,1.25,143],
    [118,123,'자전 나비','chain','#deb9ff',35,1.33,150],
    [118,114,'달그늘 여우','burst','#ffd0bb',44,1.12,140],
    [118,120,'유성 족제비','pierce','#95ddff',36,1.45,153],
    [119,122,'가시 사슴','pierce','#e5ee9c',50,1.00,155],
    [119,123,'난초 마도묘','burst','#eaa7f6',44,1.10,151],
    [119,114,'비취 백로','chain','#a0eddc',39,1.34,157],
    [119,120,'청록 기갑수','frost','#8cebf0',38,1.28,165],
    [122,123,'황혼 살쾡이','execute','#ffadbf',52,.98,149],
    [122,114,'여명 사자','burst','#ffc17c',54,.94,149],
    [122,120,'섬광 매','pierce','#a8c4ff',53,.96,178],
    [123,114,'빙화 정령','frost','#c4d9ff',40,1.27,154],
    [123,120,'뇌운 해파리','chain','#c0b1ff',48,1.08,176],
    [114,120,'백야 용린','burst','#f5e9ae',59,.92,163],
    [6,16,'새벽의 수호룡','burst','#ffe299',125,1.05,174],
    [7,17,'노을의 불사조','execute','#ff997d',132,1.00,180],
    [8,19,'폭풍의 천공수','chain','#d1bdff',118,1.16,184],
    [9,18,'극지의 설월호','frost','#bfecff',115,1.22,176],
    [10,20,'혜성의 갑각수','pierce','#d0ebff',145,.95,190],
    [12,14,'잎바다의 고래','chain','#a4f8cc',114,1.13,189],
    [118,103,"달토끼 정찰기","frost","#ceecff",38,1.56,142],
    [119,103,"은빛 뿔사슴","chain","#e2f9c5",51,1.12,161],
    [122,105,"태양 도깨비","burst","#ffb371",63,1.02,146],
    [114,105,"금강 불곰","pierce","#ffdf92",67,0.96,151],
    [119,117,"청동 바람개비","pierce","#c4f5ae",44,1.38,165],
    [120,117,"기계 해오라기","chain","#9cddfc",57,1.04,184],
    [122,121,"그림자 카라칼","execute","#c7b8ff",51,1.32,147],
    [123,121,"밤안개 흑표","frost","#b9b5f3",43,1.39,153],
    [118,111,"콩알 혜성","burst","#f4aabd",45,1.39,143],
    [114,111,"박명 나방","execute","#efb6e8",61,1.06,157],
    [103,105,"백월 망치수","pierce","#ffdcba",69,0.98,160],
    [117,121,"회오리 비룡","chain","#80efd7",58,1.17,173],
    [121,111,"월식 사신새","execute","#eea8ce",64,1.1,171],
    [103,111,"눈꽃 박쥐","frost","#bce8fb",49,1.43,148],
    [32,40,"동짓달의 순록","burst","#b9ffed",130,1.11,181],
    [34,37,"용광로의 봉황","chain","#ffbb97",145,1.04,187],
    [38,44,"월하의 맹수","execute","#eaaef1",147,1.09,182],
    [36,42,"은하의 날개수","pierce","#bee9ff",155,1,194],
    [33,45,"빙하의 종달새","frost","#b9e4ff",121,1.28,174],
    [118,105,"혈월 키메라","chain","#ff9ca4",38,1,150],
    [119,105,"석화의 뿔짐승","execute","#ffd899",42,1.13,156],
    [122,103,"별불 나방","burst","#8bd9f7",46,1.26,162],
    [123,103,"겨울의 맹위","pierce","#b1b6ff",50,1.39,168],
    [4,104,"청철의 폭풍","frost","#adf0c4",54,1.52,174],
    [120,105,"황금 미노타우로스","chain","#ff9ca4",58,1,150],
    [114,103,"여명의 발굽수","execute","#ffd899",62,1.13,156],
    [123,105,"야행의 추적자","burst","#8bd9f7",66,1.26,162],
    [118,117,"산호의 맹약","pierce","#b1b6ff",38,1.39,168],
    [118,121,"푸른 천룡","frost","#adf0c4",42,1.52,174],
    [119,111,"태양의 화룡","chain","#ff9ca4",46,1,150],
    [0,111,"빙설의 방패","execute","#ffd899",50,1.13,156],
    [119,121,"화산의 수호수","burst","#8bd9f7",54,1.26,162],
    [122,117,"절대영도의 파장","pierce","#b1b6ff",58,1.39,168],
    [114,117,"별뿔 제왕","frost","#adf0c4",62,1.52,174],
    [4,115,"발화의 날개","chain","#ff9ca4",66,1,150],
    [120,103,"황혼의 고대수","execute","#ffd899",38,1.13,156],
    [27,117,"철벽의 날개","burst","#8bd9f7",42,1.26,162],
    [105,117,"비취 스펙터","pierce","#b1b6ff",46,1.39,168],
    [123,117,"황금 행운묘","frost","#adf0c4",50,1.52,174],
    [30,120,"황야의 왕익","chain","#ff9ca4",54,1,150],
    [114,121,"일곱 머리 군주","execute","#ffd899",58,1.13,156],
    [122,111,"숲의 파수꾼","burst","#8bd9f7",62,1.26,162],
    [123,111,"철벽 거신","pierce","#b1b6ff",66,1.39,168]
  ];
  const effects = {
    frost:'서리 · 이동 속도 감소',execute:'마무리 · 체력 낮은 적에 추가 피해',
    chain:'연쇄 · 인접 적 2명에 피해',burst:'폭발 · 주변 적에 광역 피해',
    pierce:'관통 · 방어력 무시'
  };

  const opponents = {
    mender:  {name:'비취 회복병',hp:.92,speed:.92,armor:.10,color:'#b3ff91',shape:0,art:11},
    scout:   {name:'심연 추적병',hp:1,speed:1,armor:0,color:'#ffb39d',shape:0,portrait:'tracker'},
    runner:  {name:'잔광 돌격병',hp:.62,speed:1.65,armor:0,color:'#ff8e91',shape:1,portrait:'raider'},
    shell:   {name:'흑철 방패병',hp:1.33,speed:.79,armor:.38,color:'#ffba73',shape:2,portrait:'shield'},
    wraith:  {name:'공허 망령',hp:1.19,speed:1.12,armor:.14,color:'#c4a7ff',shape:3},
    bastion: {name:'철갑 거신',hp:1,speed:.88,armor:.30,color:'#ffc66e',shape:2},
    herald:  {name:'자색 폭풍룡',hp:1.10,speed:1.08,armor:.15,color:'#dba4ff',shape:3},
    eclipse: {name:'일식의 군주',hp:1.23,speed:1,armor:.21,color:'#ff9d87',shape:4},
    sentinel:{name:'월광 감시자',hp:1.15,speed:1.08,armor:.23,color:'#9febff',shape:3}
  };

  function kind(wave, spawned, boss) {
    if(boss) return ['bastion','herald','eclipse','sentinel'][(wave/4-1)%4];
    if(wave>=5 && spawned%6===4) return 'mender';
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
  const dragonArt = {
    21:'dawn-guardian',43:'storm-wyvern',60:'azure-dragon',61:'solar-drake'
  };
  const forms = recipes.map(([first,second,name,effect,color,dmg,rate,range],i) => {
    const type=i<21 ? i+6 : i+11;
    const dragon=dragonArt[type];
    return {
      type,hue:dragon ? 0 : ([0,20,-35,72,135,-80,165][Math.floor(i/9)] ?? 95),
      first,second,name,effect,color,dmg,rate,range,projectile:360+(i%4)*25,skill:effects[effect],
      ...(dragon && {portrait:'assets/dragons/'+dragon+'.webp',silhouette:'dragon'})
    };
  });

  const retiredResults = new Set(['발화의 날개','철벽의 날개','황야의 왕익','빙설의 방패','청철의 폭풍']);
  const humanRecruits = [
    {type:136,name:'방패병 마렌',effect:'burst',color:'#c2dca3',dmg:26,rate:1.02,range:136,art:'maren'},
    {type:137,name:'연금술사 베른',effect:'frost',color:'#b9f1ab',dmg:19,rate:1.28,range:149,art:'bern'},
    {type:138,name:'검객 리아',effect:'execute',color:'#a6e1fa',dmg:28,rate:1.08,range:136,art:'ria'},
    {type:139,name:'사막 궁수 자이드',effect:'pierce',color:'#f8ce92',dmg:24,rate:1.13,range:155,art:'zaid'}
  ].map(unit=>({...unit,silhouette:'hero',skill:effects[unit.effect],portrait:'assets/humans/'+unit.art+'.webp'}));
  const humanChampions = [
    {type:140,first:136,second:104,name:'성채 기사 아델',effect:'burst',color:'#ffdb98',dmg:92,rate:1.02,range:160,art:'adel'},
    {type:141,first:137,second:116,name:'별빛 공학자 오르반',effect:'chain',color:'#a7c2ff',dmg:86,rate:1.13,range:177,art:'orvan'},
    {type:142,first:138,second:112,name:'홍련 무희 세나',effect:'execute',color:'#ff9b9b',dmg:99,rate:1.12,range:154,art:'sena'},
    {type:143,first:139,second:106,name:'태양 창사 이리아',effect:'pierce',color:'#f3bf91',dmg:105,rate:.96,range:178,art:'iria'}
  ].map(unit=>({...unit,hue:0,silhouette:'hero',projectile:390,skill:effects[unit.effect],portrait:'assets/humans/'+unit.art+'.webp'}));
  const humanTypes = new Set([
    0,1,2,3,4,5,27,28,29,30,31,100,101,102,104,106,108,112,113,115,116,
    124,125,126,127,128,129,130,131,132,133,134,135,
    ...humanRecruits.map(unit=>unit.type),...humanChampions.map(unit=>unit.type)
  ]);
  const fusionKind=type=>humanTypes.has(type) ? 'human' : 'monster';
  const retiredRecruits=new Set([107,109,110]);

  const specialties = {
    seria:{family:128,gear:{name:'여명검',stat:'splashDamage',step:.08,detail:'강화마다 폭발 피해 +8%p'},skill:'새벽 폭발 · 주변 적에게 공격력의 62% 피해',splashRadius:86,splashDamage:.62},
    rune:{family:129,gear:{name:'은설 지팡이',stat:'slowDuration',step:.45,detail:'강화마다 빙결 지속 +0.45초'},skill:'빙결 주문 · 3.2초 동안 적 이동 속도 65% 감소',slowDuration:3.2,slowFactor:.35},
    tessa:{family:130,gear:{name:'뇌광궁',stat:'splashDamage',step:.10,detail:'강화마다 연쇄 피해 +10%p'},skill:'연쇄 사격 · 가장 가까운 적 최대 3명에게 추가 피해',chainCount:3},
    kaela:{family:131,gear:{name:'월흔도',stat:'armorBonus',step:.10,detail:'강화마다 장갑 적 추가 피해 +10%p'},skill:'갑옷 가르기 · 방어 무시, 장갑 적에게 피해 25% 증가',armorBonus:1.25}
  };
  const heroines = [
    {type:124,first:1,second:4,name:'새벽검 로사',effect:'burst',color:'#ffaf80',dmg:134,rate:1.06,range:178,slug:'seria'},
    {type:125,first:3,second:116,name:'서리술사 프패',effect:'frost',color:'#bceaff',dmg:116,rate:1.23,range:182,slug:'rune'},
    {type:126,first:29,second:106,name:'뇌전궁 소설가',effect:'chain',color:'#91f5ca',dmg:124,rate:1.08,range:191,slug:'tessa'},
    {type:127,first:30,second:104,name:'월식검 빰',effect:'pierce',color:'#dfb4ff',dmg:146,rate:.98,range:185,slug:'kaela'}
  ];
  const finalForms=heroines.map(hero=>({
    ...hero,...specialties[hero.slug],hue:0,silhouette:'hero',projectile:410,
    portrait:'assets/heroines/'+hero.slug+'.webp',
    attack:'assets/heroines/'+hero.slug+'-attack.webp'
  }));

  const rookies = [
    {type:128,name:'여행자 로사',effect:'burst',dmg:26,rate:.92,range:137,slug:'seria'},
    {type:129,name:'견습술사 프패',effect:'frost',dmg:16,rate:1.38,range:143,slug:'rune'},
    {type:130,name:'정찰궁 소설가',effect:'chain',dmg:19,rate:1.06,range:162,slug:'tessa'},
    {type:131,name:'수련검 빰',effect:'pierce',dmg:28,rate:.99,range:129,slug:'kaela'}
  ].map((rookie,i)=>({
    ...rookie,...specialties[rookie.slug],color:heroines[i].color,silhouette:'hero',
    portrait:'assets/heroines/'+rookie.slug+'-starter.webp'
  }));
  const middleForms = [
    {type:132,first:128,second:1,name:'여명 기사 로사',dmg:67,rate:.98,range:157},
    {type:133,first:129,second:3,name:'빙정술사 프패',dmg:54,rate:1.36,range:163},
    {type:134,first:130,second:29,name:'번개궁 소설가',dmg:61,rate:1.09,range:177},
    {type:135,first:131,second:30,name:'초승검 빰',dmg:74,rate:.99,range:151}
  ].map(form=>{
    const base=rookies.find(rookie=>rookie.type===form.first);
    return {...base,...form,hue:0,projectile:390,portrait:'assets/heroines/'+base.slug+'-vanguard.webp'};
  });
  forms.push(...finalForms,...middleForms,...humanChampions);
  const fusionRecipes = [
    ...forms.filter(form=>!retiredResults.has(form.name)),
    ...finalForms.flatMap(form=>[
      {...form,first:form.family},
      {...form,first:middleForms.find(middle=>middle.family===form.family).type}
    ])
  ];

  const image = src => { const sprite=new Image(); sprite.src=src; return sprite; };
  const beastSrc = index => 'assets/beasts/'+String(index).padStart(2,'0')+'.webp';
  const enemyKeys=Object.keys(opponents);
  const backgrounds=['canyon','rift','citadel','moonwell'].map(name=>image('assets/fields/'+name+'.webp'));
  function images() {
    return {
      familiars:Object.fromEntries(forms.map((f,i)=>[f.type,f.portrait ?? beastSrc(7+(i%9))])),
      enemies:Object.fromEntries(Object.entries(opponents).map(([key,o])=>[
        key,{art:image(o.portrait ? 'assets/enemies/'+o.portrait+'.webp' : beastSrc(o.art ?? enemyKeys.indexOf(key)-1)), fallback:makeSprite(o.color,o.shape,true,['bastion','herald','eclipse','sentinel'].includes(key))}
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
    for(const [size,color] of [[30,p.top+'bd'],[27,p.light+'70'],[24,p.top+'d8'],[21,p.road+'b0']]) {
      g.strokeStyle=color;
      g.lineWidth=size;
      g.stroke();
    }
    g.setLineDash([2,9]);
    g.lineCap='butt';
    g.lineWidth=18;
    g.strokeStyle=p.top+'70';
    g.stroke();
    g.lineWidth=1.3;
    g.strokeStyle=p.light+'b0';
    g.setLineDash([4,14]);
    g.stroke();
    g.setLineDash([]);

    const [exitX,exitY]=path.at(-1);
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
  return {forms,fusionRecipes,rookies,humanRecruits,fusionKind,retiredRecruits,opponents,kind,images,region,terrain};
})();
