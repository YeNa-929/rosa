(()=>{'use strict';
const $=id=>document.getElementById(id), canvas=$('board'),g=canvas.getContext('2d');
const roster=[
 {name:'흰 토끼',color:'#d4e5ef',dmg:12,rate:1.6,range:112,projectile:360,skill:'빠른 연속 공격'},
 {name:'앨리스',color:'#f7d87b',dmg:22,rate:1.05,range:130,projectile:350,skill:'균형 잡힌 공격'},
 {name:'체셔 고양이',color:'#d8a0f3',dmg:16,rate:1.25,range:125,projectile:380,skill:'일정 확률로 치명타'},
 {name:'모자 장수',color:'#92e1b9',dmg:26,rate:.82,range:146,projectile:310,skill:'적을 느리게 하는 찻잔'},
 {name:'하트 여왕',color:'#ff8194',dmg:47,rate:.65,range:155,projectile:430,skill:'주변 적에게 범위 피해'},
 {name:'흰 왕',color:'#a9d7ff',dmg:80,rate:.48,range:172,projectile:450,skill:'강력한 관통 공격'}
];
const expedition = document.body.hasAttribute('data-expedition');
const cast = [
  {type:0,name:'즌다몬',slug:'zundamon',color:'#adec8b'},
  {type:1,name:'도호쿠 즌코',slug:'zunko',color:'#d7f290'},
  {type:2,name:'도호쿠 키리탄',slug:'kiritan',color:'#ffb481'},
  {type:3,name:'시코쿠 메탄',slug:'metan',color:'#eca9ee'},
  {type:4,name:'도호쿠 이타코',slug:'itako',color:'#f3b3b8'},
  {type:5,name:'큐슈 소라',slug:'sora',color:'#b9e6ff'},
  {type:27,name:'주고쿠 우사기',slug:'usagi',color:'#cfecff',dmg:15,rate:1.48,range:138,effect:'frost',skill:'서리 화살 · 적 이동 속도 감소'},
  {type:28,name:'오에도 찬코',slug:'chanko',color:'#ffc77c',dmg:34,rate:.82,range:135,effect:'burst',skill:'충격파 · 주변 적에 광역 피해'},
  {type:29,name:'주부 츠루기',slug:'tsurugi',color:'#acdfab',dmg:26,rate:1.03,range:155,effect:'pierce',skill:'일섬 · 장갑 무시'},
  {type:30,name:'간사이 시노비',slug:'shinobi',color:'#c9bbff',dmg:20,rate:1.42,range:141,effect:'execute',skill:'기습 · 체력이 낮은 적에 추가 피해'},
  {type:31,name:'안코몬',slug:'ankomon',color:'#f1a3c4',dmg:24,rate:1.07,range:151,effect:'chain',skill:'단팥 번개 · 인접한 적 두 명 타격'}
].concat([{"type":100,"name":"밤의 뱀파이어","tile":3,"effect":"pierce","color":"#8bd9f7","dmg":18,"rate":0.87,"range":134,"skill":"장갑 무시"},{"type":101,"name":"흑요석 메두사","tile":8,"effect":"frost","color":"#b1b6ff","dmg":21,"rate":1.04,"range":141,"skill":"적 이동 속도 감소"},{"type":102,"name":"반딧불 요정","tile":13,"effect":"chain","color":"#adf0c4","dmg":24,"rate":1.21,"range":148,"skill":"인접 적 연쇄 타격"},{"type":103,"name":"서리 웬디고","tile":16,"effect":"execute","color":"#ff9ca4","dmg":27,"rate":1.38,"range":155,"skill":"약해진 적 추가 피해"},{"type":104,"name":"청철 기사","tile":18,"effect":"burst","color":"#ffd899","dmg":30,"rate":0.87,"range":162,"skill":"범위 폭발"},{"type":105,"name":"황소 투사","tile":21,"effect":"pierce","color":"#8bd9f7","dmg":33,"rate":1.04,"range":134,"skill":"장갑 무시"},{"type":106,"name":"초원의 궁기병","tile":22,"effect":"frost","color":"#b1b6ff","dmg":18,"rate":1.21,"range":141,"skill":"적 이동 속도 감소"},{"type":107,"name":"달빛 늑대인간","tile":25,"effect":"chain","color":"#adf0c4","dmg":21,"rate":1.38,"range":148,"skill":"인접 적 연쇄 타격"},{"type":108,"name":"산호 인어","tile":28,"effect":"execute","color":"#ff9ca4","dmg":24,"rate":0.87,"range":155,"skill":"약해진 적 추가 피해"},{"type":109,"name":"푸른 비룡","tile":32,"effect":"burst","color":"#ffd899","dmg":27,"rate":1.04,"range":162,"skill":"범위 폭발"},{"type":110,"name":"불꽃 용","tile":34,"effect":"pierce","color":"#8bd9f7","dmg":30,"rate":1.21,"range":134,"skill":"장갑 무시"},{"type":111,"name":"빙설 거인","tile":44,"effect":"frost","color":"#b1b6ff","dmg":33,"rate":1.38,"range":141,"skill":"적 이동 속도 감소"},{"type":112,"name":"불꽃 정령","tile":46,"effect":"chain","color":"#adf0c4","dmg":18,"rate":0.87,"range":148,"skill":"인접 적 연쇄 타격"},{"type":113,"name":"빙결 정령","tile":50,"effect":"execute","color":"#ff9ca4","dmg":21,"rate":1.04,"range":155,"skill":"약해진 적 추가 피해"},{"type":114,"name":"별뿔 유니콘","tile":52,"effect":"burst","color":"#ffd899","dmg":24,"rate":1.21,"range":162,"skill":"범위 폭발"},{"type":115,"name":"화염 요정","tile":56,"effect":"pierce","color":"#8bd9f7","dmg":27,"rate":1.38,"range":134,"skill":"장갑 무시"},{"type":116,"name":"황혼 마법사","tile":66,"effect":"frost","color":"#b1b6ff","dmg":30,"rate":0.87,"range":141,"skill":"적 이동 속도 감소"},{"type":117,"name":"석상 가고일","tile":70,"effect":"chain","color":"#adf0c4","dmg":33,"rate":1.04,"range":148,"skill":"인접 적 연쇄 타격"},{"type":118,"name":"비취 슬라임","tile":85,"effect":"execute","color":"#ff9ca4","dmg":18,"rate":1.21,"range":155,"skill":"약해진 적 추가 피해"},{"type":119,"name":"황금 고양이","tile":95,"effect":"burst","color":"#ffd899","dmg":21,"rate":1.38,"range":162,"skill":"범위 폭발"},{"type":120,"name":"황야 그리핀","tile":105,"effect":"pierce","color":"#8bd9f7","dmg":24,"rate":0.87,"range":134,"skill":"장갑 무시"},{"type":121,"name":"맹독 히드라","tile":111,"effect":"frost","color":"#b1b6ff","dmg":27,"rate":1.04,"range":141,"skill":"적 이동 속도 감소"},{"type":122,"name":"숲의 올빼미곰","tile":118,"effect":"chain","color":"#adf0c4","dmg":30,"rate":1.21,"range":148,"skill":"인접 적 연쇄 타격"},{"type":123,"name":"철의 골렘","tile":129,"effect":"execute","color":"#ff9ca4","dmg":33,"rate":1.38,"range":155,"skill":"약해진 적 추가 피해"}]);
if(expedition) {
  cast.unshift(...ZundaExpedition.rookies);
  cast.push(...ZundaExpedition.humanRecruits);
}
const recruitPool=expedition ? cast.filter(unit=>!ZundaExpedition.retiredRecruits.has(unit.type)) : cast;
const recruitableTypes=new Set(recruitPool.map(unit=>unit.type));
const expansionArt = expedition ? ZundaExpedition.images() : null;
const castByType = new Map(cast.map(character=>[character.type,character]));
if(expedition) {
  for(const {type,slug,tile,...character} of cast) roster[type]={projectile:380,...roster[type],...character};
  for(const form of ZundaExpedition.forms) roster[form.type]=form;
}
const portraits = roster.map((_,i) => {
  if(!expedition) return CourtArt.portrait(i);
  const character=castByType.get(i);
  return character ? (character.portrait ?? (character.slug ? 'assets/cast/'+character.slug+'.webp' : 'assets/allies/'+character.tile+'.webp')) : expansionArt.familiars[i];
});
const expeditionSprites = expedition ? portraits.map((src,i) => {
  if(!src) return null;
  const image=new Image();
  image.src=src;
  return image;
}) : [];
const attackSprites = expedition ? new Map([...cast.filter(c=>c.tile || c.attack), ...ZundaExpedition.forms.filter(form=>form.attack)].map(c=>{
  const image=new Image();
  image.src=c.attack ?? 'assets/attacks/'+c.tile+'.webp';
  return [c.type,image];
})) : new Map();
const bossInterval = expedition ? 4 : 5;
const finalWave = 32;
const rosterLimit = expedition ? 12 : 18;
const storageLimit=expedition?40:rosterLimit;
let reserveView=false;
const mergeCount = expedition ? 2 : 3;
let selectedUnit = null;
let deploymentPads=[], preferredDeploymentSlots=[];
let cancelFormationDrag=()=>{};
let command=null, slowField=null;
let battleStarted=false, fieldImpact=0;
let bossWarningWave=0;

const keepPhase = phase => expedition && ['draft','reward'].includes(phase) ? phase : 'wave';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let combatScaleX=1, combatScaleY=1;
const combatDistance=(x,y)=>Math.hypot(x/combatScaleX,y/combatScaleY);
let terrain, path, lengths, pathLength, rosterKey, rosterOver, nextRefresh = 0, spellFlash = 0;
const SAVE=expedition ? 'zunda-expedition-v1' : 'wonderland-defense-v2';let state, lastStored=null, saveConflict=false, mobs=[],bullets=[],particles=[],visualTime=0,toastTimer=0,annTimer=0,last=performance.now(),W=400,H=420,uid=1,autosummonTimer=0,saveTimer=0;
const fresh=()=>({wave:1,gems:14,weaponStones:0,gold:60,life:25,upgrade:0,units:[],spawned:0,phase:expedition?'draft':'wave',spawnTimer:.9,breakTimer:0,speed:1,paused:false,auto:false,spellCD:0,kills:0,gameover:false,cleared:false,offers:[],power:0,tempo:0,elite:false,bossFocus:false,targetPriority:'lead',tactics:2,shield:0,expansions:0,shopOffers:[],shopCount:0,contract:'none',gear:{}});
function restore() {
  const defaults=fresh();
  try {
    lastStored=localStorage.getItem(SAVE);
    const saved=JSON.parse(lastStored||'null');
    if(!saved || !Number.isFinite(saved.wave) || !Array.isArray(saved.units)) return defaults;
    const {encounter,...progress}=saved;
    const result={...defaults,...progress,spawned:0,phase:keepPhase(saved.phase),spawnTimer:.8,breakTimer:0,
      paused:saved.gameover===true||saved.life===0,gameover:saved.gameover===true||saved.life===0};
    if(expedition) {
      const completed=Math.max(0,Math.min(finalWave,Math.trunc(saved.wave)-1+Number(saved.phase==='reward' || saved.cleared===true)));
      result.weaponStones=Number.isSafeInteger(saved.weaponStones) ? Math.max(0,saved.weaponStones) :
        completed+Math.floor(completed/bossInterval);
    }
    if(expedition) result.shopOffers=Array.isArray(saved.shopOffers) ? saved.shopOffers.filter(type=>recruitableTypes.has(type)) : [];
    if(expedition) result.gear=Object.fromEntries(ZundaExpedition.rookies.map(({family})=>{
      const rank=saved.gear?.[family];
      return [family,Number.isInteger(rank) ? Math.max(0,Math.min(2,rank)) : 0];
    }));
    result.units=saved.units.slice(0,storageLimit).filter(u=>roster[u.type]&&u.tier>=1&&u.tier<=4).map(u=>({
      type:u.type,tier:u.tier,slot:u.slot,reserve:expedition&&u.reserve===true,id:uid++,
      cool:Number.isFinite(u.cool)?Math.max(0,u.cool):Math.random()
    }));
    if(!expedition || !encounter || result.phase!=='wave' || result.gameover ||
       !Array.isArray(encounter.enemies) || !Array.isArray(encounter.shots)) return result;
    result.spawned=encounter.spawned;
    result.spawnTimer=encounter.spawnTimer;
    mobs=encounter.enemies.flatMap(enemy=>{
      const model=ZundaExpedition.opponents[enemy.kind];
      if(!model || !Number.isFinite(enemy.t) || enemy.hp<=0) return [];
      const {warded,wardFloor,breakTime,rearm,secondWard,...active}=enemy;
      return [{...active,model,x:0,y:0,flash:0,healUntil:0}];
    });
    const targets=new Map(mobs.map(enemy=>[enemy.id,enemy]));
    bullets=encounter.shots.flatMap(shot=>targets.has(shot.targetId) && roster[shot.type]
      ? [{...shot,target:targets.get(shot.targetId),x:shot.x*W,y:shot.y*H}] : []);
    slowField=encounter.zone ? {...encounter.zone,x:encounter.zone.x*W,y:encounter.zone.y*H} : null;
    uid=Math.max(uid,1+Math.max(0,...mobs.map(enemy=>enemy.id)));
    return result;
  } catch {
    mobs=[];bullets=[];slowField=null;
    return defaults;
  }
}
state=restore();
if(expedition && state.cleared && state.wave===16) {
  state.wave=17;
  state.gameover=false;
  state.cleared=false;
  state.paused=false;
}
if(expedition && state.bossFocus) state.targetPriority='boss';
const capacity=()=>expedition ? Math.min(rosterLimit,8+state.expansions*2) : rosterLimit;
const deployedCount=()=>state.units.filter(u=>!u.reserve).length;
if(expedition && deployedCount()>capacity()) state.expansions=Math.min(2,Math.ceil((deployedCount()-8)/2));
function persist() {
  try {
    if(expedition && localStorage.getItem(SAVE)!==lastStored) {
      if(!saveConflict) {
        saveConflict=true;
        cancelFormationDrag();
        state.paused=true;
        $('modal').close();
        $('saveNotice').hidden=false;
        for(const panel of $('game').children) if(panel!==$('saveNotice')) panel.inert=true;
        $('reloadSave').focus();
      }
      return;
    }
    const encounter=expedition && state.phase==='wave' && !state.gameover ? {
      spawned:state.spawned,spawnTimer:state.spawnTimer,
      enemies:mobs.filter(enemy=>enemy.hp>0).map(({model,x,y,flash,healUntil,...enemy})=>enemy),
      shots:bullets.filter(shot=>!shot.dead && shot.target.hp>0).map(({target,x,y,...shot})=>({
        ...shot,targetId:target.id,x:x/W,y:y/H
      })),
      zone:slowField ? {...slowField,x:slowField.x/W,y:slowField.y/H} : null
    } : undefined;
    const serialized=JSON.stringify({...state,encounter,
      units:state.units.map(({type,tier,slot,reserve,cool})=>({type,tier,slot,reserve,cool})),
      spawned:0,phase:keepPhase(state.phase),spawnTimer:.8,breakTimer:0,paused:false});
    localStorage.setItem(SAVE,serialized);
    lastStored=serialized;
  } catch {}
}
const beep = CourtAudio.effect;
function announce(t){$('announcement').textContent=t;$('announcement').style.opacity=1;annTimer=1.7;beep(800)}
function toast(t){$('toast').textContent=t;$('toast').style.opacity=1;toastTimer=1.9}
const regionRoutes = [[[-0.08,0.15],[0.89,0.15],[0.89,0.87],[0.1,0.87],[0.1,0.34],[0.71,0.34],[0.71,0.7],[0.31,0.7],[0.31,0.5],[0.53,0.5]],[[1.08,0.19],[0.12,0.19],[0.12,0.88],[0.91,0.88],[0.91,0.36],[0.3,0.36],[0.3,0.72],[0.73,0.72],[0.73,0.53],[0.51,0.53]],[[-0.08,0.18],[0.9,0.18],[0.9,0.89],[0.09,0.89],[0.09,0.39],[0.68,0.39],[0.68,0.73],[0.3,0.73],[0.3,0.55],[0.5,0.55]],[[1.08,0.16],[0.1,0.16],[0.1,0.89],[0.9,0.89],[0.9,0.33],[0.29,0.33],[0.29,0.7],[0.7,0.7],[0.7,0.5],[0.48,0.5]]];
const battlefieldY=y=>.105+y*.895;
const regionPads = regionRoutes.map(route=>{
  const pads=[];
  for(let row=0;row<7;row++) {
    for(let col=0;col<7;col++) {
      const x=.14+col*.12,y=.22+row*.10;
      const distance=Math.min(...route.slice(1).map(([bx,by],i)=>{
        const [ax,ay]=route[i];
        const dx=(bx-ax)*320,dy=(by-ay)*270;
        const qx=(x-ax)*320,qy=(y-ay)*270;
        const t=Math.max(0,Math.min(1,(qx*dx+qy*dy)/(dx*dx+dy*dy)));
        return Math.hypot(qx-dx*t,qy-dy*t);
      }));
      if(distance>=16) pads.push({x,y:battlefieldY(y),distance});
    }
  }
  pads.sort((a,b)=>a.distance-b.distance);
  // Append the entrance row so existing saved slot IDs keep their positions.
  const fromRight=route[0][0]>1;
  const y=battlefieldY(route[0][1])-.08;
  for(const [index,x] of [.16,.30,.44,.58].entries()) pads.push({x:fromRight ? 1-x : x,y,entrance:true,label:'입구 '+(index+1)});
  return pads;
});
function reconcileSlots(atEntrance=false) {
  if(!expedition || deploymentPads.length===0) return;
  const strongestByFamily=new Map();
  for(const unit of state.units) {
    const family=roster[unit.type].family;
    if(unit.reserve || family===undefined) continue;
    const current=strongestByFamily.get(family);
    if(current && combatPower(current)>=combatPower(unit)) unit.reserve=true;
    else {
      if(current) current.reserve=true;
      strongestByFamily.set(family,unit);
    }
  }
  const used=new Set();
  let remaining=capacity();
  for(const unit of state.units) {
    if(!unit.reserve && remaining--<=0) unit.reserve=true;
    if(unit.reserve) {unit.slot=undefined;continue;}
    if(atEntrance) unit.moveFrom=null;
    if(atEntrance || !Number.isInteger(unit.slot) || !deploymentPads[unit.slot] || used.has(unit.slot)) unit.slot=undefined;
    else used.add(unit.slot);
  }
  for(const unit of state.units) {
    if(unit.reserve || unit.slot!==undefined) continue;
    unit.slot=preferredDeploymentSlots.find(slot=>!used.has(slot));
    used.add(unit.slot);
  }
  if(!state.units.some(unit=>unit.id===selectedUnit)) selectedUnit=null;
}
function boardPixelRatio() {
  const ratio=devicePixelRatio || 1;
  if(!expedition) return Math.min(ratio,2);
  return Math.min(ratio,2.5,Math.sqrt(5000000/(W*H)));
}
function resize() {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const scaleX = rect.width / W, scaleY = rect.height / H;
  W = rect.width;
  H = rect.height;
  // Keep combat distances and route progress independent of the display aspect ratio.
  if(expedition) {combatScaleX=W/390;combatScaleY=H/320;}
  const d=boardPixelRatio();
  canvas.width = Math.round(W * d);
  canvas.height = Math.round(H * d);
  g.setTransform(d, 0, 0, d, 0, 0);
  path = [[-22,H*.18],[W*.17,H*.18],[W*.17,H*.47],[W*.79,H*.47],
          [W*.79,H*.78],[W*.19,H*.78],[W*.19,H+30]];
  if(expedition) {
    const region=Math.floor((state.wave-1)/4)%regionRoutes.length;
    const reverse=state.wave>16;
    path=regionRoutes[region].map(([x,y])=>[(reverse?1-x:x)*W,battlefieldY(y)*H]);
    deploymentPads=reverse ? regionPads[region].map(pad=>({...pad,x:1-pad.x})) : regionPads[region];
    const [startX,startY]=path[0];
    const distance=pad=>Math.hypot(pad.x*W-startX,pad.y*H-startY);
    preferredDeploymentSlots=deploymentPads.map((pad,slot)=>({pad,slot}))
      .sort((a,b)=>Number(!!b.pad.entrance)-Number(!!a.pad.entrance) || distance(a.pad)-distance(b.pad))
      .map(({slot})=>slot);
    reconcileSlots();
    renderPads();
  }
  lengths = path.slice(1).map(([x,y], i) => combatDistance(x-path[i][0], y-path[i][1]));
  pathLength = lengths.reduce((sum, value) => sum + value, 0);
  paintTerrain(d);
  if(slowField) {slowField.x*=scaleX;slowField.y*=scaleY;}
  for (const m of mobs) [m.x,m.y] = at(m.t);
  for(const unit of state.units) if(unit.moveFrom) {unit.moveFrom.x*=scaleX;unit.moveFrom.y*=scaleY;}
  for (const item of [...bullets, ...particles]) {
    item.x *= scaleX;
    item.y *= scaleY;
  }
}
function paintTerrain(d=boardPixelRatio()) {
  terrain=expedition ? ZundaExpedition.terrain(W,H,path,d,state.wave,()=>paintTerrain()) : CourtArt.terrain(W,H,path,d);
  if(expedition) $('regionName').textContent=ZundaExpedition.region(state.wave).name+(state.wave>16?' · 심층':'');
}
new ResizeObserver(resize).observe(canvas);
resize();

function at(t) {
  let distance = t * pathLength;
  for (let i = 0; i < lengths.length; i++) {
    if (distance <= lengths[i]) {
      const ratio = distance / lengths[i];
      const [x,y] = path[i], [nextX,nextY] = path[i+1];
      return [x+(nextX-x)*ratio,y+(nextY-y)*ratio];
    }
    distance -= lengths[i];
  }
  return path.at(-1);
}

function unitPos(i) {
  if(expedition) {
    const pad=deploymentPads[state.units[i].slot] ?? deploymentPads[i];
    return {x:W*pad.x,y:H*pad.y};
  }
  const row = Math.floor(i/6);
  return {x: W * ((row === 2 ? .095 : .295) + (i%6)*.121),
          y: H * [.286,.382,.624][row]};
}

function recruit(type) {
  const family=roster[type].family;
  const alreadyDeployed=family!==undefined && state.units.some(unit=>!unit.reserve && roster[unit.type].family===family);
  state.units.push({id:uid++,type,tier:1,reserve:expedition && (alreadyDeployed || deployedCount()>=capacity()),cool:0,born:visualTime});
}
const choosing = () => state.phase==='draft'||state.phase==='reward';
function showChoices() {
  const buttons=ZundaExpedition.rookies.map(unit=>`<button data-choice="${unit.type}" style="--starter-accent:${unit.color}"><img src="${portraits[unit.type]}" alt=""><b>${unit.name}</b><small>기본형 · ${unit.skill}<span class="starter-weapon">전용 무기 ${unit.gear.name}</span></small></button>`).join('');
  showModal(`<h2>첫 동료를 선택하세요</h2><p>네 명 중 한 명과 원정을 시작하세요. 고유 능력은 상위 조합 후에도 이어집니다.</p><div class="choices starter-choices">${buttons}</div>`);
  $('modal').classList.add('starter-screen');
  $('close').hidden=true;
  const choices=$('modalBody').querySelectorAll('[data-choice]');
  for(const button of choices) button.onclick=()=>{
    if(state.phase!=='draft') return;
    recruit(Number(button.dataset.choice));
    battleStarted=true;
    state.phase='wave';
    state.spawnTimer=.9;
    $('modal').classList.remove('starter-screen');
    $('close').hidden=false;
    closeModal();
    refresh();
    persist();
  };
  choices[0]?.focus();
}
const sectorRules={
  none:{speed:1,armor:0,gems:0,gold:0},
  standard:{title:'안정 전개',detail:'생명 4 회복 · 매 웨이브 보석 +1',speed:1,armor:0,gems:1,gold:0},
  rush:{title:'가속 전선',detail:'적 이동 +18% · 매 웨이브 보석 +4',speed:1.18,armor:0,gems:4,gold:0},
  armor:{title:'철갑 전선',detail:'적 장갑 +12%p · 매 웨이브 골드 +55',speed:1,armor:.12,gems:0,gold:55}
};
function advanceExpeditionWave() {
  cancelFormationDrag();
  const previous=ZundaExpedition.region(state.wave);
  state.wave++;
  state.shopCount=0;
  state.tactics=2;
  state.shield=0;
  state.phase='wave';
  state.offers=[];
  state.spawned=0;
  state.spawnTimer=.9;
  command=null;
  slowField=null;
  if(previous!==ZundaExpedition.region(state.wave) || state.wave===17) resize();
  selectedUnit=null;
  reconcileSlots(true);
  renderPads();
}
function continueWithSupplies(gems=0,gold=0,stones=0) {
  const wave=state.wave;
  const healed=Math.max(0,Math.min(25-state.life,2));
  state.gems++;
  state.gold+=10;
  state.life=Math.min(25,state.life+2);
  state.power+=.07;
  state.tempo+=.05;
  advanceExpeditionWave();
  reportWaveSupplies(wave,gems+1,gold+10,stones,healed);
}
function reportWaveSupplies(wave,gems,gold,stones,healed=0) {
  $('waveSupply').textContent=wave+'웨이브 보급 · 보석 +'+gems+' · 골드 +'+gold+(stones ? ' · 연마석 +'+stones : '')+(healed ? ' · 생명 +'+healed : '');
}
function clearWave() {
  const bonus=expedition ? sectorRules[state.contract] : null;
  const gems=5+(state.elite?7:0)+(bonus?.gems??0);
  const gold=15+state.wave*4+(bonus?.gold??0);
  state.gems+=gems;
  state.gold+=gold;
  const stones=expedition ? (state.wave%bossInterval===0 ? 2 : 1) : 0;
  state.weaponStones+=stones;
  state.elite=false;
  if(!expedition) {
    state.phase='break';
    state.breakTimer=3;
    announce('웨이브 클리어! 보석 +5');
  } else if(state.wave===finalWave) {
    state.cleared=true;
    end();
    return;
  } else {
    if(state.wave%bossInterval===0) state.contract='none';
    continueWithSupplies(gems,gold,stones);
  }
  persist();
}
function prioritizes(candidate,current) {
  if(!current) return true;
  if(state.targetPriority==='boss' && candidate.boss!==current.boss) return candidate.boss;
  if(state.targetPriority==='support' && (candidate.kind==='mender')!==(current.kind==='mender')) return candidate.kind==='mender';
  return candidate.t>current.t;
}
function spawn() {
  const boss=state.wave%bossInterval===0 && state.spawned===waveTotal()-1;
  const kind=expedition ? ZundaExpedition.kind(state.wave,state.spawned,boss) : null;
  const model=kind ? ZundaExpedition.opponents[kind] : null;
  const base=expedition ? (boss?760:70) : (boss?550:65);
  const growth=expedition ? Math.pow(1.262,Math.min(15,state.wave-1))*Math.pow(1.145,Math.max(0,state.wave-16)) : Math.pow(1.24,state.wave-1);
  const rules=expedition ? sectorRules[state.contract] : null;
  // Leave 20+ unchanged; taper the early multiplier so wave 20 still grows over wave 19.
  const earlyPressure=expedition && state.wave<20
    ? 1+Math.min((state.wave-1)*.03,.18,.09+(19-state.wave)*.025)
    : 1;
  const pressure=expedition ? Math.min(.42,Math.max(0,state.wave-4)*.015) : 0;
  const bossPressure=expedition && boss ? 1.22 : 1;
  const hp=base*growth*(state.elite?1.4:1)*(model?.hp ?? 1)*earlyPressure*(1+pressure)*bossPressure;
  const m={id:uid++,t:0,hp,max:hp,boss,kind,model,armor:(model?.armor??0)+(rules?.armor??0),slow:0,slowFactor:1,
    step:0,lastStep:0,facing:1,healTimer:1.1,
    speed:(expedition ? (boss?.026:.047) : (boss?.032:.061))*(1+Math.min(state.wave,40)*.007)*(model?.speed ?? 1)*(rules?.speed??1)*(1+pressure*.2),x:0,y:0};
  [m.x,m.y]=at(0);
  mobs.push(m);
  state.spawned++;
  if(boss) announce((model?.name ?? '하트 군단의 보스')+' 등장!');
}
function waveTotal(wave=state.wave){return expedition ? Math.min(14+wave*2+(wave>=5&&wave%4===1?5:0),78) : Math.min(12+wave*2,65)}
function drawRecruit(roll) {
  const owned=[...new Set(state.units.map(u=>u.type).filter(type=>recruitableTypes.has(type)))];
  if(owned.length && roll<.36) return owned[Math.floor(Math.random()*owned.length)];
  return recruitPool[Math.floor(Math.random()*recruitPool.length)].type;
}
function summon(silent=false) {
  if(state.gems<2) {if(!silent) toast('💎 보석이 부족합니다');return false;}
  if(state.units.length>=storageLimit) {if(!silent) toast('편성이 가득 찼습니다');return false;}
  state.gems-=2;
  const r=Math.random(), type=expedition ? drawRecruit(r) : r<.26?0:r<.48?1:r<.69?2:r<.85?3:r<.96?4:5;
  recruit(type);
  refresh();
  if(expedition) {
    const unit=state.units.at(-1);
    $('autoRecruitFeed').textContent=(silent?'자동 소환 · ':'영입 · ')+roster[type].name+' · '+(unit.reserve?'대기 편성':'출전 편성');
  }
  if(!silent) {
    persist();
    beep(720);
    if(!expedition) toast(roster[type].name+' 영입!');
  }
  return true;
}
function mergeCompanions(materials,anchor) {
  const ids=new Set(materials.map(unit=>unit.id));
  const type=!expedition && anchor.tier===3 && anchor.type<5 ? anchor.type+1 : anchor.type;
  const merged={id:uid++,type,tier:anchor.tier+1,slot:anchor.slot,reserve:anchor.reserve,cool:0,born:visualTime};
  state.units=state.units.filter(unit=>!ids.has(unit.id));
  state.units.push(merged);
  selectedUnit=null;
  announce(roster[type].name+' ★'+merged.tier+' 합성 성공!');
  refresh();
  persist();
  return merged;
}
function merge() {
  const groups={};
  for(const unit of state.units) (groups[unit.type+'-'+unit.tier]??=[]).push(unit);
  const group=Object.values(groups).filter(items=>items.length>=mergeCount && items[0].tier<4)
    .sort((a,b)=>b[0].tier-a[0].tier)[0];
  if(!group) {toast('동일 캐릭터와 등급이 필요합니다');return;}
  mergeCompanions(group.slice(0,mergeCount),group[0]);
}
function mergePartner(unit) {
  if(unit.tier>=4) return null;
  return state.units.find(other=>other!==unit && other.type===unit.type && other.tier===unit.tier && other.reserve) ??
    state.units.find(other=>other!==unit && other.type===unit.type && other.tier===unit.tier) ?? null;
}
function upgrade(){const cost=30+state.upgrade*25;if(state.gold<cost){toast('🪙 골드가 부족합니다');return}state.gold-=cost;state.upgrade++;announce('⚔ 공격력 +'+(expedition&&state.upgrade>8?12:25)+'%p');refresh();persist()}
function spell(){if(state.spellCD>0){toast('마법 재사용 대기 중');return}state.spellCD=24;spellFlash=.75;mobs.forEach(m=>{if(m.hp<=0)return;damageMob(m,90+state.wave*11,'#9bd7ff',.65,25);m.slow=4;m.slowFactor=.35});announce('🌀 원더랜드 시간 정지!');beep(400,.3);refresh()}
function refresh() {
  const s = state;
  updateCommand();
  reconcileSlots();
  $('wave').textContent = s.wave;
  $('gems').textContent = s.gems;
  if(expedition) $('weaponStones').textContent=s.weaponStones;
  $('gold').textContent = s.gold;
  $('life').textContent = s.life;
  $('count').textContent = expedition ? deployedCount()+' / '+capacity() : s.units.length+' / '+capacity();
  $('upgradeCost').textContent = '골드 ' + (30+s.upgrade*25);
  $('speed').textContent = s.speed + '배속';
  $('pause').textContent = s.paused ? '계속' : '일시정지';
  $('pause').setAttribute('aria-pressed', s.paused);
  $('auto').setAttribute('aria-pressed', s.auto);
  $('autoStatus').textContent = s.auto ? 'ON' : 'OFF';
  if(!expedition) $('spellCost').textContent=s.spellCD>0 ? Math.ceil(s.spellCD)+'초' : '준비 완료';
  $('roundflag').textContent = s.gameover ? (s.cleared?'원정 성공':'방어 실패') : s.paused ? '일시정지' :
    s.phase === 'break' ? '다음 웨이브 · ' + Math.ceil(s.breakTimer) + '초' : s.elite ? '정예 전투 · '+s.spawned+'/'+waveTotal() : expedition ? '전투 · '+s.spawned+'/'+waveTotal() : '전투 중';
  $('summon').disabled = s.gameover || s.gems < 2 || s.units.length >= storageLimit;
  $('upgrade').disabled = s.gameover || s.gold < 30+s.upgrade*25;
  if(!expedition) $('spell').disabled=s.gameover || s.spellCD>0;
  $('pause').disabled = s.gameover;
  $('auto').disabled = s.gameover;

  const boss = mobs.find(m => m.boss && m.hp > 0);
  $('bosslabel').textContent = boss ? (boss.model?.name ?? '하트 군단') + ' · ' + Math.ceil(boss.hp) + ' / ' + Math.ceil(boss.max)
    : '다음 보스 · 웨이브 ' + (Math.floor((s.wave-1)/bossInterval)*bossInterval + bossInterval + (s.wave%bossInterval===0 && s.spawned===waveTotal() ? bossInterval : 0));
  if(expedition) $('boss').classList.toggle('boss-active',!!boss);
  $('bossbar').style.width = boss ? boss.hp/boss.max*100 + '%' : '0%';

  const key = s.units.map(u => u.id+'-'+u.type+'-'+u.tier+'-'+(u.slot??'')+'-'+Number(u.reserve)).join(',')+'|'+selectedUnit+'|'+capacity()+'|'+reserveView;
  if (key === rosterKey && s.gameover === rosterOver) return;
  rosterKey = key;
  rosterOver = s.gameover;
  if(expedition) {
    $('market').disabled=s.gameover;
    $('recipes').disabled=s.gameover;
    $('focus').disabled=s.gameover;
    renderFormation();
    renderPads();
    return;
  }
  const grouped = {};
  s.units.forEach(u => { (grouped[u.type+'-'+u.tier] ??= {u,n:0}).n++; });
  $('merge').disabled = s.gameover || !Object.values(grouped).some(({u,n}) => n>=mergeCount && u.tier<4);
  $('cards').innerHTML = Object.values(grouped).map(({u,n}) => `<div class="unitcard" style="--unit:${roster[u.type].color}"><img alt="" referrerpolicy="no-referrer" src="${portraits[u.type]}"><span>${roster[u.type].name}</span><strong>★${u.tier} ×${n}</strong></div>`).join('')
    || '<div class="unitcard empty">보석 2개로 첫 수호자를 소환하세요</div>';
}

function end(){state.gameover=true;state.paused=true;refresh();persist();$('game').classList.toggle('over',!state.cleared);showModal(`<h2>${state.cleared?'원정 성공!':expedition?'원정 종료':'원더랜드 함락'}</h2><p>${state.wave} 웨이브까지 방어했습니다.</p><p>처치한 적: ${state.kills} · 강화 레벨: ${state.upgrade}</p><button id="retry" class="danger">다시 도전</button>`);$('retry').onclick=restart}
function restart() {
  if(saveConflict) {location.reload();return;}
  if(confirm('진행 상황을 초기화하고 새로 시작할까요?')) resetRun();
}
function resetRun() {
  state=fresh();reserveView=false;selectedUnit=null;command=null;slowField=null;
  if(expedition) {syncFocus();resize();$('autoRecruitFeed').textContent='';$('waveSupply').textContent='';}
  mobs=[];bullets=[];particles=[];fieldImpact=0;bossWarningWave=0;
  uid=1;rosterKey=undefined;spellFlash=0;autosummonTimer=0;saveTimer=0;
  $('game').classList.remove('over');
  $('modal').close();
  refresh();
  persist();
  if(!saveConflict) {
    if(expedition) showChoices();
    else announce('새로운 모험 시작!');
  }
}
let modalBack=null;
const blockingPanel=()=>$('modal').matches(':modal');
function showModal(html) {
  cancelFormationDrag();
  modalBack=null;
  $('modal').classList.remove('starter-screen');
  $('close').hidden = false;
  $('modalBody').innerHTML = html;
  $('modalBody').querySelector('h2').id = 'modalTitle';
  const panel=$('modal');
  const live=expedition && battleStarted && !choosing() && !state.gameover;
  if(panel.open && blockingPanel()===live) panel.close();
  panel.classList.toggle('live-panel',live);
  if(!panel.open) {
    if(live) panel.show();
    else panel.showModal();
  }
}
function closeModal() { if(!choosing()) $('modal').close(); }
if(expedition) $('modal').addEventListener('cancel',event=>{
  if(modalBack || choosing() || $('modal').classList.contains('title-screen')) event.preventDefault();
  if(modalBack) modalBack();
});
$('close').onclick=()=>modalBack ? modalBack() : closeModal();
$('summon').onclick=()=>summon();$('upgrade').onclick=upgrade;
$('speed').onclick=()=>{state.speed=state.speed===1?2:state.speed===2?3:1;refresh()};$('pause').onclick=()=>{if(saveConflict){location.reload();return;}state.paused=!state.paused;refresh()};$('auto').onclick=()=>{state.auto=!state.auto;refresh();persist()};
if(!expedition) {$('spell').onclick=spell;$('reset').onclick=restart;$('merge').onclick=merge;}
function syncSoundButton() {
  $('sound').textContent = CourtAudio.enabled ? '♫' : '♪';
  $('sound').setAttribute('aria-pressed',CourtAudio.enabled);
  $('sound').title = CourtAudio.enabled ? '음악과 효과음 끄기' : '음악과 효과음 켜기';
}
$('sound').onclick = () => { CourtAudio.toggle(); syncSoundButton(); };
$('game').addEventListener('click', event => {
  if (event.target.closest('button') && !event.target.closest('#sound')) CourtAudio.unlock();
}, {capture:true});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) CourtAudio.sync(false);
});
addEventListener('pagehide',persist);
if(expedition) addEventListener('storage',event=>{
  if(event.key===SAVE && event.newValue!==lastStored) persist();
});
$('help').onclick=()=>showModal('<h2>♠ 게임 방법</h2><p>수호자를 무작위로 소환해 미로를 지나가는 적을 막으세요.</p><ul><li>🎲 소환: 보석 2개 소모</li><li>✨ 합성: 동일 캐릭터와 등급 3개 → 상위 등급 1개</li><li>⚔ 강화: 모든 수호자 공격력 상승</li><li>🌀 마법: 모든 적 피해 + 4초 둔화</li><li>👑 5웨이브마다 보스 등장</li><li>❤️ 적이 출구에 도달하면 생명 감소</li></ul><p>진행 상황은 이 브라우저에만 자동 저장됩니다. 게임 버튼을 처음 누르면 음악을 재생하며, 상단 음표 버튼으로 끌 수 있습니다.</p>');
function showCodex() { showModal((expedition?'<h2>원정대 도감</h2>':'<h2>📖 원더랜드 도감</h2>')+roster.map((t,i)=>`<div class="entry"><img referrerpolicy="no-referrer" src="${portraits[i]}" alt=""><div><b>${t.name}</b><small>공격 ${t.dmg} · 사거리 ${t.range} · ${t.skill}</small></div></div>`).join('')+(expedition?'':'<p>루이스 캐럴의 1865년 소설에서 모티프를 얻은 독립 제작 게임입니다.</p>')); }
if(!expedition) $('codex').onclick=showCodex;
function damageMob(m, damage, color, life = .27, radius = 17) {
  if (m.hp <= 0) return;
  m.hp-=damage;
  m.flash = visualTime + .13;
  particles.push({x:m.x,y:m.y,life,duration:life,radius,color});
  if (m.hp > 0) {
    if(m.model && m.boss && !m.enraged && m.hp<=m.max*.5) {
      m.enraged=true;
      if(m.kind!=='herald') m.armor+=.18;
      if(m.kind!=='bastion') m.speed*=1.38;
      announce(m.model.name+(m.kind==='bastion'?' · 방어 강화':m.kind==='herald'?' · 가속':' · 방어 강화 및 가속'));
    }
    return;
  }
  state.gold += m.boss ? 110 : 5 + Math.floor(state.wave/bossInterval);
  state.kills++;
  if (Math.random()<.22 || m.boss) state.gems += m.boss ? 6 : 1;
  particles.push({x:m.x,y:m.y,life:.48,duration:.48,radius:30,color:'#ffd68f'});
  if (m.boss) announce((m.model?.name ?? '하트 군단')+' 격파!');
}

function hit(m, damage, source) {
  if (m.hp <= 0) return;
  const unit=roster[source.type], effect=unit.effect;
  const rank=state.gear?.[unit.family] ?? 0;
  const gear=unit.gear;
  const trait=(name,fallback)=>(unit[name] ?? fallback)+(gear?.stat===name ? rank*gear.step : 0);
  if(unit.armorBonus && m.armor>0) damage*=trait('armorBonus',1);
  const afterArmor=(mob,amount)=>effect==='pierce' ? amount : amount*(1-mob.armor);
  if(effect==='execute' && m.hp <= m.max*.4) damage*=1.75;
  damageMob(m,afterArmor(m,damage),source.color);
  if((effect==='frost' || source.type===3) && m.hp>0) {
    const factor=unit.slowFactor ?? (source.type===3 ? .55 : .51);
    if(m.slow<=0 || factor<=m.slowFactor) {
      m.slow=trait('slowDuration',source.type===3 ? 2.5 : 2.9);
      m.slowFactor=factor;
    }
  }
  if(effect==='chain' || effect==='burst') {
    const radius=unit.splashRadius ?? (effect==='chain' ? 95 : 74);
    const distance=other=>combatDistance(other.x-m.x,other.y-m.y);
    const neighbors=mobs.filter(other=>other!==m && other.hp>0 && distance(other)<radius);
    if(unit.chainCount) neighbors.sort((a,b)=>distance(a)-distance(b));
    const targets=effect==='chain' ? neighbors.slice(0,unit.chainCount ?? 2) : neighbors;
    for(const other of targets) damageMob(other,afterArmor(other,damage*trait('splashDamage',.43)),source.color);
  }
  if (source.type === 4) {
    for (const other of mobs) {
      if (other !== m && combatDistance(other.x-m.x,other.y-m.y)<52) {
        damageMob(other,damage*.35,source.color);
      }
    }
  }
}

function updateCommand() {
  if(!expedition) return;
  $('tacticsCount').textContent=state.tactics+' / 2'+(state.shield ? ' · 방어막 '+state.shield : '');
  $('tactics').disabled=state.gameover || state.tactics===0;
  $('tactics').setAttribute('aria-pressed',command!==null);
  $('aimHint').hidden=!command;
  $('aimHint').textContent=command==='bomb'?'포격할 위치를 누르세요':'감속 지대를 놓을 위치를 누르세요';
}
function openCommands() {
  if(state.gameover || saveConflict || choosing() || state.tactics===0) return;
  if(command) { command=null;updateCommand();return; }
  showModal(`<h2>전술 지령</h2><p>웨이브마다 포인트 2개를 받습니다. 전술마다 1개를 사용합니다.</p><div class="market-grid"><button data-order="bomb">집중 포격 · 지정 위치에 광역 피해</button><button data-order="slow">결빙 지대 · 지정 위치에 4초 감속</button><button data-order="shield" ${state.shield?'disabled':''}>방어막 · 다음 일반 돌파 1회 방어</button></div>`);
}
function selectCommand(name) {
  if(state.gameover || choosing() || state.tactics===0) return;
  if(name==='shield' && !state.shield) {
    state.tactics--;
    state.shield=1;
    announce('출구에 방어막을 설치했습니다');
    persist();
  } else if(name==='bomb'||name==='slow') {
    command=name;
    selectedUnit=null;
  }
  closeModal();
  refresh();
}
function fireCommand(event) {
  if(!command || state.paused || choosing() || state.gameover || $('modal').open || state.tactics<=0) return;
  const rect=canvas.getBoundingClientRect();
  const x=event.clientX-rect.left, y=event.clientY-rect.top;
  state.tactics--;
  if(command==='bomb') {
    for(const enemy of mobs) {
      if(enemy.hp>0 && combatDistance(enemy.x-x,enemy.y-y)<87) damageMob(enemy,enemy.max*.28,'#ffc180',.46,32);
    }
    particles.push({x,y,life:.67,duration:.67,radius:87,color:'#ffc180',area:true});
    fieldImpact=.23;
    beep(180,.16);
  } else {
    slowField={x,y,time:4};
    beep(410,.14);
  }
  command=null;
  updateCommand();
  persist();
}
function supportPulse(m,dt) {
  if(m.kind!=='mender') return;
  m.healTimer-=dt;
  if(m.healTimer>0) return;
  m.healTimer=2.1;
  let healed=false;
  for(const other of mobs) {
    if(other===m || other.hp<=0 || other.hp>=other.max || other.boss || other.kind==='mender' ||
        (other.healUntil??0)>visualTime || combatDistance(m.x-other.x,m.y-other.y)>83) continue;
    other.hp=Math.min(other.max,other.hp+other.max*.18);
    other.healUntil=visualTime+1.5;
    healed=true;
  }
  if(healed) particles.push({x:m.x,y:m.y,life:.43,duration:.43,radius:83,color:'#b3ff91',area:true});
}
function moveEnemy(m,dt) {
  supportPulse(m,dt);
  const oldX=m.x,oldY=m.y;
  const fieldSlow=slowField && combatDistance(m.x-slowField.x,m.y-slowField.y)<81 ? .43 : 1;
  m.t+=m.speed*Math.min(m.slowFactor,fieldSlow)*dt;
  [m.x,m.y]=at(m.t);
  if(!m.model) return;
  if(Math.abs(m.x-oldX)>.1) m.facing=Math.sign(m.x-oldX);
  m.step+=Math.min(20,Math.hypot(m.x-oldX,m.y-oldY))/(m.boss?17:11);
  const footfall=Math.floor(m.step);
  if(footfall!==m.lastStep && !reducedMotion.matches) {
    m.lastStep=footfall;
    particles.push({x:m.x-m.facing*8,y:m.y+7,life:.25,duration:.25,radius:m.boss?15:9,color:m.model.color,dust:true});
  }
}

function unitAttackDamage(unit) {
  const upgrade=expedition ? .25*Math.min(8,state.upgrade)+.12*Math.max(0,state.upgrade-8) : state.upgrade*.25;
  return roster[unit.type].dmg*Math.pow(expedition ? 1.98 : 2.15,unit.tier-1)*(1+upgrade+state.power);
}
function unitAttackRate(unit) {
  return roster[unit.type].rate*(1+(unit.tier-1)*.1+state.tempo);
}

function update(dt){toastTimer-=dt;annTimer-=dt;if(toastTimer<=0)$('toast').style.opacity=0;if(annTimer<=0)$('announcement').style.opacity=0;
if(!path||state.paused||saveConflict||state.gameover||choosing()||blockingPanel())return;
visualTime += dt;
spellFlash = Math.max(0, spellFlash-dt);
fieldImpact=Math.max(0,fieldImpact-dt/state.speed);
if(slowField && (slowField.time-=dt)<=0) slowField=null;
if(!expedition) state.spellCD=Math.max(0,state.spellCD-dt);
autosummonTimer-=dt;if(state.auto&&autosummonTimer<=0){summon(true);autosummonTimer=.6}
if(state.phase==='wave'){state.spawnTimer-=dt;if(state.spawned<waveTotal()&&state.spawnTimer<=0){
  const waitingForBoss=expedition && state.wave%bossInterval===0 && state.spawned===waveTotal()-1;
  if(waitingForBoss && bossWarningWave!==state.wave) {
    bossWarningWave=state.wave;
    state.spawnTimer=1.25*state.speed;
    announce('경고 · '+ZundaExpedition.opponents[ZundaExpedition.kind(state.wave,state.spawned,true)].name+' 접근 중');
    CourtAudio.bossWarning();
  } else { spawn();state.spawnTimer=expedition && state.wave>=5 && state.spawned%5!==0 ? Math.max(.21,.64-state.wave*.014) : Math.max(.26,.78-state.wave*.013)}}if(state.spawned===waveTotal()&&mobs.length===0){clearWave();return}}
else{state.breakTimer-=dt;if(state.breakTimer<=0){state.wave++;state.spawned=0;state.spawnTimer=.5;state.phase='wave';announce('🌙 WAVE '+state.wave);persist()}}
for(const m of mobs){if(m.hp<=0)continue;if(m.slow>0){m.slow-=dt;if(m.slow<=0)m.slowFactor=1}moveEnemy(m,dt);if(m.t>=1){m.hp=-1;const loss=m.boss?(expedition ? state.life : 5):1;if(expedition && !m.boss && state.shield>0){state.shield--;announce('방어막이 돌파를 막았습니다');}else state.life-=loss;if(state.life<=0){state.life=0;end();return}}}
for(let i=0;i<state.units.length;i++){const u=state.units[i];if(u.reserve)continue;const t=roster[u.type],p=unitPos(i);u.cool-=dt;if(u.cool>0)continue;let target=null;for(const m of mobs){if(m.hp<=0)continue;if(combatDistance(m.x-p.x,m.y-p.y)<t.range*(1+(u.tier-1)*.08)&&prioritizes(m,target))target=m}if(target){u.fired=visualTime;u.aim=Math.atan2(target.y-p.y,target.x-p.x);const damage=unitAttackDamage(u)*(u.type===2&&Math.random()<.25?2.5:1);bullets.push({x:p.x,y:p.y,target,damage,color:t.color,type:u.type,speed:t.projectile});u.cool=1/unitAttackRate(u)}}
for(const b of bullets){if(b.target.hp<=0){b.dead=true;continue}const dx=b.target.x-b.x,dy=b.target.y-b.y,d=combatDistance(dx,dy);if(d<=Math.max(13,b.speed*dt)){hit(b.target,b.damage,b);b.dead=true}else{const step=Math.min(d,b.speed*dt);b.x+=dx/d*step;b.y+=dy/d*step}}
bullets=bullets.filter(b=>!b.dead);mobs=mobs.filter(m=>m.hp>0);particles.forEach(p=>p.life-=dt);particles=particles.filter(p=>p.life>0);
saveTimer+=dt;if(saveTimer>12){saveTimer=0;persist()}}
let guardianBounds=[];
function drawGuardians(motion) {
  const silhouettes=[];
  state.units.forEach((u, i) => {
    if(u.reserve) return;
    let {x,y} = unitPos(i);
    if(motion && u.moveFrom) {
      const progress=Math.min(1,(visualTime-u.moveFrom.time)/.32);
      x=u.moveFrom.x+(x-u.moveFrom.x)*progress;
      y=u.moveFrom.y+(y-u.moveFrom.y)*progress;
      if(progress>=1) u.moveFrom=null;
    }
    const unit=roster[u.type], color=unit.color;
    const size=expedition ? Math.min(W*.106,H*.127,56) : Math.min(W*.111,H*.119,49);
    const attackAge=visualTime-(u.fired ?? -1);
    const shot = Math.max(0,1-attackAge/.27);
    const arrival = Math.max(0, 1-(visualTime-(u.born ?? -1))/.4);
    const kick = motion && shot ? -Math.sin(shot*Math.PI)*7 : 0;
    if(u.id===selectedUnit) {
      g.beginPath();
      const range=unit.range*(1+(u.tier-1)*.08);
      g.ellipse(x,y,range*combatScaleX,range*combatScaleY,0,0,Math.PI*2);
      g.fillStyle=color+'11';
      g.fill();
      g.strokeStyle=color+'60';
      g.lineWidth=1;
      g.stroke();
    }
    g.beginPath();
    g.ellipse(x,y+size*.29,size*.42,size*.18,0,0,Math.PI*2);
    g.fillStyle = '#161829';
    g.fill();
    g.strokeStyle = color;
    g.lineWidth = u.id===selectedUnit ? 3 : u.tier>1 ? 1.5 : 1;
    g.stroke();
    if (arrival && motion) {
      g.globalAlpha = arrival;
      g.beginPath();
      g.ellipse(x,y+size*.24,size*(.52-arrival*.22),size*.22,0,0,Math.PI*2);
      g.stroke();
      g.globalAlpha = 1;
    }
    const idle = motion ? Math.sin(visualTime*3+i)*1.2 - 7*arrival : 0;
    const spriteX=x-(kick ? Math.cos(u.aim)*kick : 0);
    const spriteY=y+idle-(kick ? Math.sin(u.aim)*kick : 0);
    const action=attackSprites.get(u.type);
    const strike=motion && shot>0 && action?.complete && action.naturalWidth>0;
    const image=strike ? action : expeditionSprites[u.type];
    if(!expedition) {
      g.drawImage(CourtArt.sprites[u.type],spriteX-size/2,spriteY-size*.68,size,size);
    } else if(image && (image.width && !('complete' in image) || image.complete && image.naturalWidth)) {
      const sourceWidth=image.naturalWidth || image.width, sourceHeight=image.naturalHeight || image.height;
      const silhouette=roster[u.type].silhouette;
      const maxWidth=silhouette==='dragon' ? 1.65 : silhouette==='hero' && !strike ? 1.12 : 1.38;
      const maxHeight=silhouette==='hero' ? 1.49 : silhouette==='dragon' ? 1.30 : 1.38;
      const scale=size*Math.min(maxHeight/sourceHeight,maxWidth/sourceWidth);
      const width=sourceWidth*scale, height=sourceHeight*scale;
      if(roster[u.type].hue) g.filter=`hue-rotate(${roster[u.type].hue}deg)`;
      g.save();
      g.translate(spriteX,spriteY+size*.42);
      if(strike && Math.cos(u.aim)<0) g.scale(-1,1);
      if(!strike && motion && shot) {
        const pulse=Math.sin(shot*Math.PI);
        const thrust=unit.effect==='pierce' || unit.effect==='execute';
        if(unit.effect==='frost' || unit.effect==='chain') g.translate(0,-size*.11*pulse);
        g.rotate(Math.cos(u.aim)*pulse*(thrust ? .23 : .13));
        g.scale(1+pulse*(thrust ? .18 : .10),1-pulse*.08);
      }
      g.drawImage(image,-width/2,-height,width,height);
      silhouettes.push({id:u.id,left:spriteX-width/2,right:spriteX+width/2,bottom:spriteY+size*.42,height});
      g.restore();
      g.filter='none';
    } else {
      g.fillStyle=color;
      g.font='bold 13px system-ui';
      g.textAlign='center';
      g.fillText(roster[u.type].name.split(' ').at(-1),x,y);
    }
    g.font = '9px system-ui';
    g.textAlign = 'center';
    g.fillStyle = '#ffe0a0';
    g.fillText('◆'.repeat(u.tier),x,y+size*.49);
  });
  return silhouettes;
}

function drawEnemies(motion, allySilhouettes) {
  for (const m of mobs) {
    if (m.hp <= 0) continue;
    const size=m.model
      ? (m.boss ? Math.min(W*.18,H*.26,m.enraged ? 88 : 73) : Math.min(W*.097,H*.13,43))
      : (m.boss ? 65 : 44);
    const walking=motion && m.model;
    const stride=walking ? Math.abs(Math.sin(m.step*Math.PI))*size*.064 : motion && !m.model ? Math.sin(visualTime*13+m.id)*2 : 0;
    g.fillStyle = '#151524ab';
    g.beginPath();
    g.ellipse(m.x,m.y+8,size*.33-stride*.7,5,0,0,Math.PI*2);
    g.fill();
    if(m.model || m.slow>0) {
      g.strokeStyle=m.slow>0 ? '#99e5ffc4' : '#ff667ac9';
      g.lineWidth=m.boss ? 2 : 1.3;
      g.stroke();
    }
    if (motion && m.flash>visualTime) g.filter = 'brightness(1.55)';
    const skin=m.model ? expansionArt.enemies[m.kind] : null;
    const sprite=skin ? (skin.art.complete && skin.art.naturalWidth ? skin.art : skin.fallback) : CourtArt.enemies[Number(m.boss)];
    const sw=sprite.naturalWidth || sprite.width, sh=sprite.naturalHeight || sprite.height;
    const scale=Math.min(size/sw,size/sh);
    if(m.model) {
      g.save();
      const left=m.x-sw*scale/2, right=m.x+sw*scale/2;
      const bottom=m.y+8-stride, top=bottom-sh*scale;
      if(allySilhouettes.some(ally=>left<ally.right && right>ally.left &&
          top<ally.bottom && bottom>ally.bottom-ally.height)) {
        g.globalAlpha=m.boss ? .64 : .48;
      }
      g.translate(m.x,bottom);
      g.scale(m.facing<0?-1:1,1);
      if(walking) {
        g.rotate(Math.sin(m.step*Math.PI)*.085);
        g.scale(1+stride*.018,1-stride*.009);
      }
      g.drawImage(sprite,-sw*scale/2,-sh*scale,sw*scale,sh*scale);
      g.restore();
    } else g.drawImage(sprite,m.x-sw*scale/2,m.y-sh*scale*.62+stride,sw*scale,sh*scale);
    g.filter = 'none';
    const width = m.boss ? 40 : 26;
    g.fillStyle = '#24202d';
    g.fillRect(m.x-width/2,m.y-(m.model?size*.94:size*.54)-5,width,5);
    g.fillStyle = m.model?.color ?? (m.boss ? '#ffb675' : '#99e1bc');
    g.fillRect(m.x-width/2+1,m.y-(m.model?size*.94:size*.54)-4,(width-2)*m.hp/m.max,3);
  }
}

function drawEffects(motion) {
  for (const b of bullets) {
    const angle = Math.atan2(b.target.y-b.y,b.target.x-b.x);
    g.save();
    g.translate(b.x,b.y);
    g.rotate(angle);
    const length = motion ? ([13,17,15,10,22,29][b.type] ?? 24) : 5;
    const glow = g.createLinearGradient(-length,0,4,0);
    glow.addColorStop(0,'transparent');
    glow.addColorStop(.65,b.color);
    glow.addColorStop(1,'#fff4d3');
    g.fillStyle = glow;
    g.beginPath();
    g.moveTo(-length,0);
    g.quadraticCurveTo(0,-7,5,0);
    g.quadraticCurveTo(0,7,-length,0);
    g.fill();
    g.restore();
  }
  if (!motion) return;
  if (spellFlash>0) {
    const progress = 1-spellFlash/.75;
    g.globalAlpha = .65*(1-progress);
    g.strokeStyle = '#bde9ff';
    g.lineWidth = 4;
    g.beginPath();
    g.arc(W/2,H/2,20+Math.hypot(W,H)*.6*progress,0,Math.PI*2);
    g.stroke();
  }
  for (const p of particles) {
    const progress = 1-p.life/p.duration;
    if(p.dust) {
      g.globalAlpha=(1-progress)*.40;
      g.fillStyle=p.color;
      for(let i=0;i<3;i++) {
        g.beginPath();
        g.arc(p.x+(i-1)*p.radius*progress,p.y-i*2-progress*5,1+i,0,Math.PI*2);
        g.fill();
      }
      continue;
    }
    g.globalAlpha = 1-progress;
    g.strokeStyle = p.color;
    g.fillStyle = p.color;
    g.lineWidth = 1.5;
    g.beginPath();
    const radius=3+p.radius*progress;
    g.ellipse(p.x,p.y,radius*(p.area ? combatScaleX : 1),radius*(p.area ? combatScaleY : 1),0,0,Math.PI*2);
    g.stroke();
    for (let i=0;i<6;i++) {
      const angle = i*Math.PI/3;
      const x = p.x+Math.cos(angle)*p.radius*progress*1.35;
      const y = p.y+Math.sin(angle)*p.radius*progress*1.35;
      g.fillRect(x-1,y-1,2,2);
    }
  }
  g.globalAlpha = 1;
}

function draw() {
  if (!terrain) return;
  g.drawImage(terrain,0,0,W,H);
  const motion = !reducedMotion.matches && !state.paused && !blockingPanel();
  if(slowField) {
    g.beginPath();
    g.ellipse(slowField.x,slowField.y,81*combatScaleX,81*combatScaleY,0,0,Math.PI*2);
    g.fillStyle='#80aaff33';g.fill();g.strokeStyle='#95d7ffc0';g.lineWidth=2;g.stroke();
  }
  guardianBounds=drawGuardians(motion);
  drawEnemies(motion,guardianBounds);
  drawEffects(motion);
  if(motion && fieldImpact>0) {
    g.fillStyle='rgba(255,202,155,'+(fieldImpact*.48)+')';
    g.fillRect(0,0,W,H);
  }
}

const battlePlaylist=['opening','harbor','rift','chase','deep','lantern'];

function frame(now) {
  const dt = Math.min(.055,(now-last)/1000);
  last = now;
  update(dt*state.speed);
  draw();
  const track=expedition && (mobs.some(enemy=>enemy.boss && enemy.hp>0)
    || (bossWarningWave===state.wave && state.spawned===waveTotal()-1)) ? 'boss'
    : expedition ? battlePlaylist[Math.floor((state.wave-1)/2)%battlePlaylist.length] : 'opening';
  CourtAudio.sync(!state.paused && !state.gameover && !blockingPanel() && !document.hidden,track);
  if (now >= nextRefresh) {
    refresh();
    nextRefresh = now + 125;
  }
  requestAnimationFrame(frame);
}

function combatPower(unit) {
  return unitAttackDamage(unit)*unitAttackRate(unit)*(unit.type===2 ? 1.375 : 1);
}
function autoDeploy() {
  if(state.gameover || saveConflict || choosing() || $('modal').open || !deploymentPads.length || !state.units.length) return;
  const ranked=state.units.map(unit=>({
    unit,
    power:combatPower(unit)
  })).sort((a,b)=>b.power-a.power || Number(a.unit.reserve)-Number(b.unit.reserve) ||
    roster[b.unit.type].range-roster[a.unit.type].range || a.unit.id-b.unit.id);
  const families=new Set();
  const picked=ranked.filter(({unit})=>{
    const family=roster[unit.type].family;
    if(family===undefined) return true;
    if(families.has(family)) return false;
    families.add(family);
    return true;
  }).slice(0,Math.min(capacity(),deploymentPads.length)).map(entry=>entry.unit);
  const strongest=new Set(picked);
  for(const unit of state.units) {
    if(strongest.has(unit)) continue;
    unit.reserve=true;
    unit.slot=undefined;
    unit.moveFrom=null;
  }
  const kept=new Set(picked.filter(unit=>!unit.reserve && deploymentPads[unit.slot]).map(unit=>unit.slot));
  const free=preferredDeploymentSlots.filter(slot=>!kept.has(slot));
  let moved=0;
  for(const unit of picked) {
    if(!unit.reserve && deploymentPads[unit.slot]) continue;
    unit.reserve=false;
    unit.slot=free.shift();
    unit.moveFrom=null;
    unit.born=visualTime;
    moved++;
  }
  selectedUnit=null;
  reserveView=false;
  toast('전투력 기준 '+picked.length+'명 출전'+(moved ? ' · '+moved+'명 새로 배치' : ' · 기존 편성 유지'));
  refresh();
  persist();
}
function renderFormation() {
  $('autoDeploy').disabled=state.gameover || !state.units.length;
  $('autoFuse').disabled=state.gameover || state.units.length<2;
  $('reserveTab').textContent=reserveView?'출전 보기':'대기 '+(state.units.length-deployedCount());
  $('reserveTab').setAttribute('aria-pressed',reserveView);
  $('cards').innerHTML=state.units.filter(u=>!!u.reserve===reserveView).map(u=>`<button class="unitcard formation-card" data-unit="${u.id}" aria-pressed="${u.id===selectedUnit}" style="--unit:${roster[u.type].color}" ${state.gameover?'disabled':''}><img alt="" draggable="false" referrerpolicy="no-referrer" src="${portraits[u.type]}" style="--portrait-hue:${roster[u.type].hue??0}deg"><span>${roster[u.type].name}</span><strong>${u.reserve?'대기':(deploymentPads[u.slot]?.label ?? (u.slot+1)+'번')} · ★${u.tier}</strong></button>`).join('')
    || '<div class="unitcard empty">'+(reserveView?'대기 중인 동료가 없습니다':'보석 2개로 동료를 영입하세요')+'</div>';
}
function renderPads() {
  const layer=$('placement');
  if(!layer) return;
  const active=selectedUnit!==null && !state.gameover;
  layer.hidden=!active;
  if(!active) return;
  const occupied=new Map(state.units.filter(unit=>!unit.reserve).map(unit=>[unit.slot,unit]));
  layer.innerHTML=deploymentPads.map(({x,y,label:padLabel},slot)=>{
    const unit=occupied.get(slot);
    const label=unit ? (unit.id===selectedUnit?'현재 위치':roster[unit.type].name+'과 위치 교체') : (padLabel ?? (slot+1)+'번')+' 빈 위치에 배치';
    return `<button type="button" class="deploy-pad ${unit?'occupied':''}" data-pad="${slot}" ${unit?`data-board-unit="${unit.id}"`:''} aria-label="${label}" aria-pressed="${unit?.id===selectedUnit}" style="left:${x*100}%;top:${y*100}%">${unit?'◆':'+'}</button>`;
  }).join('');
}
function moveFormation(slot,id=selectedUnit) {
  const unit=state.units.find(item=>item.id===id);
  if(!unit || !deploymentPads[slot] || state.gameover || saveConflict || choosing() || $('modal').open) return false;
  const other=state.units.find(item=>item.slot===slot && item!==unit);
  const family=roster[unit.type].family;
  if(unit.reserve && family!==undefined &&
     state.units.some(item=>!item.reserve && item!==other && roster[item.type].family===family)) {
    toast('같은 주인공이 이미 출전 중입니다. 그 동료가 있는 칸에 놓아 교체하세요');
    return false;
  }
  if(unit.reserve && !other && deployedCount()>=capacity()) {
    toast('출전 한도에 도달했습니다. 배치된 동료와 교체하세요');
    return false;
  }
  if(!unit.reserve) unit.moveFrom={...unitPos(state.units.indexOf(unit)),time:visualTime};
  if(other) {
    other.moveFrom={...unitPos(state.units.indexOf(other)),time:visualTime};
    other.slot=unit.slot;
    other.reserve=unit.reserve;
  }
  unit.slot=slot;
  unit.reserve=false;
  reserveView=false;
  selectedUnit=null;
  toast(other?'동료 위치를 교체했습니다':'빈 위치에 동료를 배치했습니다');
  refresh();
  persist();
  return true;
}
function guardianAt(clientX,clientY) {
  const rect=canvas.getBoundingClientRect();
  const x=clientX-rect.left, y=clientY-rect.top;
  for(let i=guardianBounds.length-1;i>=0;i--) {
    const {id,left,right,bottom,height}=guardianBounds[i];
    if(x>=left-3 && x<=right+3 && y>=bottom-height-3 && y<=bottom+5) return id;
  }
  return null;
}
function openUnitRecipes(id) {
  if(state.gameover || saveConflict || choosing() || !state.units.some(unit=>unit.id===id)) return;
  command=null;
  updateCommand();
  showUnitRecipes(id);
}
function installFormationDrag() {
  const stage=$('stage'), cards=$('cards'), layer=$('placement');
  const ghost=document.createElement('img');
  ghost.className='formation-drag-ghost';
  ghost.alt='';
  ghost.hidden=true;
  document.body.append(ghost);
  let drag=null, suppressClick=false;

  function start(event) {
    if(!event.isPrimary || event.button!==0) return;
    if(drag) finish(null,true);
    suppressClick=false;
    if(state.gameover || saveConflict || choosing() || $('modal').open) return;
    const surface=event.currentTarget;
    if(surface===stage && command) return;
    const card=event.target.closest('[data-unit], [data-board-unit]');
    const id=card ? Number(card.dataset.unit ?? card.dataset.boardUnit) :
      event.target===canvas ? guardianAt(event.clientX,event.clientY) : null;
    if(id===null || !state.units.some(unit=>unit.id===id)) return;
    drag={id,pointer:event.pointerId,x:event.clientX,y:event.clientY,surface,active:false,previous:selectedUnit};
  }

  function padAt(clientX,clientY) {
    const rect=canvas.getBoundingClientRect();
    if(clientX<rect.left || clientX>rect.right || clientY<rect.top || clientY>rect.bottom) return null;
    let slot=null, nearest=30;
    for(const [index,pad] of deploymentPads.entries()) {
      const distance=Math.hypot(clientX-(rect.left+pad.x*rect.width),clientY-(rect.top+pad.y*rect.height));
      if(distance<nearest) {nearest=distance;slot=index;}
    }
    return slot;
  }

  function move(event) {
    if(drag?.pointer!==event.pointerId) return;
    if(event.pointerType==='mouse' && !(event.buttons&1)) {
      finish(event,true);
      return;
    }
    if(!drag.active) {
      if(Math.hypot(event.clientX-drag.x,event.clientY-drag.y)<8) return;
      const unit=state.units.find(unit=>unit.id===drag.id);
      if(!unit || state.gameover || $('modal').open) {drag=null;return;}
      suppressClick=true;
      try {
        drag.surface.setPointerCapture(event.pointerId);
      } catch {
        finish(event,true);
        return;
      }
      drag.active=true;
      command=null;
      selectedUnit=unit.id;
      ghost.src=portraits[unit.type];
      ghost.style.setProperty('--portrait-hue',(roster[unit.type].hue??0)+'deg');
      ghost.hidden=false;
      layer.classList.add('dragging');
      refresh();
    }
    ghost.style.left=event.clientX+'px';
    ghost.style.top=event.clientY+'px';
    layer.querySelector('.drop-target')?.classList.remove('drop-target');
    const slot=padAt(event.clientX,event.clientY);
    if(slot!==null) layer.querySelector('[data-pad="'+slot+'"]')?.classList.add('drop-target');
  }

  function finish(event,canceled=false) {
    if(!drag || (event && drag.pointer!==event.pointerId)) return;
    const current=drag;
    drag=null;
    if(!current.active) return;
    if(current.surface.hasPointerCapture(current.pointer)) current.surface.releasePointerCapture(current.pointer);
    ghost.hidden=true;
    layer.classList.remove('dragging');
    layer.querySelector('.drop-target')?.classList.remove('drop-target');
    const slot=canceled ? null : padAt(event.clientX,event.clientY);
    const unit=state.units.find(unit=>unit.id===current.id);
    if(slot!==null && (unit?.reserve || unit?.slot!==slot) && moveFormation(slot,current.id)) return;
    selectedUnit=current.previous;
    refresh();
  }

  for(const surface of [stage,cards]) {
    surface.addEventListener('pointerdown',start);
    surface.addEventListener('lostpointercapture',event=>{
      if(event.target===surface) finish(event,true);
    });
    surface.addEventListener('click',event=>{
      if(!suppressClick || !event.detail) return;
      suppressClick=false;
      event.stopImmediatePropagation();
    },true);
  }
  window.addEventListener('pointermove',move);
  window.addEventListener('pointerup',event=>finish(event));
  window.addEventListener('pointercancel',event=>finish(event,true));
  cancelFormationDrag=()=>finish(null,true);
  window.addEventListener('blur',cancelFormationDrag);
  window.addEventListener('resize',cancelFormationDrag);
  window.addEventListener('pagehide',cancelFormationDrag);
  document.addEventListener('visibilitychange',()=>{if(document.hidden) cancelFormationDrag();});
}
function ingredients(recipe,unitId=null) {
  return [recipe.first,recipe.second].map(type=>{
    const chosen=state.units.find(unit=>unit.id===unitId && unit.type===type);
    return chosen ?? state.units.reduce((best,u)=>u.type===type && (!best || u.tier<best.tier) ? u : best,null);
  });
}
const fusionKindLabel=kind=>kind==='human' ? '인간형' : '몬스터';
function canUseRecipe(recipe) {
  if(!recipe) return false;
  const kind=ZundaExpedition.fusionKind(recipe.type);
  return ZundaExpedition.fusionKind(recipe.first)===kind && ZundaExpedition.fusionKind(recipe.second)===kind;
}
function autoFuse() {
  if(state.gameover || saveConflict || choosing() || $('modal').open) return;
  let best=null;
  for(const [index,recipe] of ZundaExpedition.fusionRecipes.entries()) {
    if(!canUseRecipe(recipe)) continue;
    const [first,second]=ingredients(recipe);
    if(!first || !second) continue;
    const power=combatPower({type:recipe.type,tier:Math.min(first.tier,second.tier)});
    const gain=power-combatPower(first)-combatPower(second);
    if(!best || gain>best.gain || (gain===best.gain && power>best.power)) best={index,gain,power};
  }
  if(best) fuse(best.index,{stayInBattle:true});
  else toast('현재 보유 동료로 조합할 수 있는 조합이 없습니다');
}
function fuse(index,{filter='all',search='',species='all',unitId=null,stayInBattle=false}={}) {
  const recipe=ZundaExpedition.fusionRecipes[index];
  if(!canUseRecipe(recipe) || state.gameover || saveConflict || choosing()) return;
  const [first,second]=ingredients(recipe,unitId);
  if(!first || !second) return;
  const anchor=first.reserve && !second.reserve ? second : first;
  const consumed=anchor===first ? second : first;
  const slot=state.units.indexOf(anchor);
  const evolvedId=uid++;
  state.units[slot]={id:evolvedId,type:recipe.type,slot:anchor.slot,reserve:anchor.reserve,tier:Math.min(first.tier,second.tier),cool:0,born:visualTime};
  state.units.splice(state.units.indexOf(consumed),1);
  selectedUnit=null;
  const result=recipe.name+' 탄생!';
  announce(result);
  refresh();
  persist();
  if(!saveConflict && !stayInBattle) {
    if(unitId===null) showRecipes({filter,search,species,result});
    else showUnitRecipes(evolvedId,result);
    $('recipeStatus').focus();
  }
}
function showRecipes({filter='all',search='',species='all',result=''}={}) {
  const rows=ZundaExpedition.fusionRecipes.map((recipe,index)=>{
    const owned=ingredients(recipe);
    return {recipe,index,owned,count:owned.filter(Boolean).length,kind:ZundaExpedition.fusionKind(recipe.type)};
  }).sort((a,b)=>b.count-a.count);
  const readyCount=rows.filter(row=>row.count===2).length;
  const nearCount=rows.filter(row=>row.count===1).length;
  const buttons=rows.map(({recipe,index,owned,count,kind})=>{
    const materials=[recipe.first,recipe.second].map((type,i)=>{
      const unit=owned[i];
      return '<small class="recipe-material '+(unit?'owned':'missing')+'">'+roster[type].name+
        (unit?' · 보유 ★'+unit.tier:' · 필요')+'</small>';
    }).join('');
    return `<button class="recipe" data-recipe="${index}" data-ready="${count===2}" data-owned="${count}" data-fusion-kind="${kind}"><img src="${portraits[recipe.type]}" alt="" style="--portrait-hue:${recipe.hue}deg"><span><b>${recipe.name}</b><small>${fusionKindLabel(kind)}</small>${materials}<small>${recipe.skill}</small></span><em>${count===2?'조합 가능':count===1?'1명 부족':'2명 부족'}</em></button>`;
  }).join('');
  showModal(`<h2>동료 조합표</h2><p>인간형끼리 조합하면 인간형, 몬스터끼리 조합하면 몬스터가 태어납니다.</p><p id="recipeStatus" role="status" tabindex="-1"></p><label class="recipe-filter">보기<select id="recipeFilter"><option value="all">전체 ${rows.length}</option><option value="ready">지금 조합 가능 ${readyCount}</option><option value="near">한 명만 더 필요 ${nearCount}</option></select></label><label class="recipe-filter">종류<select id="recipeSpecies"><option value="all">전체</option><option value="human">인간형</option><option value="monster">몬스터</option></select></label><label class="recipe-filter"><input id="recipeSearch" type="search" placeholder="동료 또는 재료 이름" aria-label="동료 또는 재료를 검색"></label><p id="recipeEmpty" hidden></p><div class="recipes">${buttons}</div>`);
  $('recipeStatus').textContent=(result ? result+' ' : '')+'지금 조합 가능 '+readyCount+'개 · 한 명만 더 필요 '+nearCount+'개';
  $('recipeFilter').value=filter;
  $('recipeSearch').value=search;
  $('recipeSpecies').value=species;
  const updateFilter=()=>{
    const query=$('recipeSearch').value.trim().toLocaleLowerCase();
    const mode=$('recipeFilter').value;
    const kind=$('recipeSpecies').value;
    const required={ready:'2',near:'1'}[mode];
    let shown=0;
    for(const button of $('modalBody').querySelectorAll('[data-recipe]')) {
      button.hidden=(kind!=='all' && kind!==button.dataset.fusionKind) || (required!==undefined && button.dataset.owned!==required) || !button.textContent.toLocaleLowerCase().includes(query);
      if(!button.hidden) shown++;
    }
    const empty=$('recipeEmpty');
    empty.hidden=shown>0;
    empty.textContent=query ? '검색 결과가 없습니다.' : '이 조건에 맞는 조합이 없습니다.';
  };
  $('recipeFilter').onchange=updateFilter;
  $('recipeSpecies').onchange=updateFilter;
  $('recipeSearch').oninput=updateFilter;
  updateFilter();
}
function fusionPortrait(type,status) {
  return `<div><img src="${portraits[type]}" alt="" style="--portrait-hue:${roster[type].hue??0}deg"><strong>${roster[type].name}</strong><small>${status}</small></div>`;
}
function renderUnitGrowth(unit) {
  const cost=trainingCost(unit);
  const next={...unit,tier:unit.tier+1};
  const canTrain=unit.tier<4;
  const increase=canTrain ? ' → '+Math.round(unitAttackDamage(next)) : '';
  const partner=mergePartner(unit);
  const stage=roster[unit.type].stage;
  return `<section class="unit-growth" aria-label="동료 성장">
    <div><strong>★${unit.tier} · 공격 ${Math.round(unitAttackDamage(unit))}${increase}</strong>
    ${stage ? `<small>진화 ${stage} / 5단계</small>` : ''}<small>초당 ${unitAttackRate(unit).toFixed(2)}회 · 사거리 ${Math.round(roster[unit.type].range*(1+(unit.tier-1)*.08))}</small><small>보유 보석 ◆ ${state.gems}</small></div>
    <div class="unit-training-actions"><button id="trainUnit" type="button" ${canTrain && state.gems>=cost?'':'disabled'}>${canTrain ? (state.gems>=cost?'별 훈련':'보석 부족')+' · ◆ '+cost : '훈련 완료'}</button>
      ${partner ? '<button id="mergeUnitStars" type="button">같은 동료 별 합성</button>' : ''}</div>
  </section>`;
}
function showUnitRecipes(unitId,result='') {
  const picked=state.units.find(unit=>unit.id===unitId);
  if(!picked) return;
  const rows=ZundaExpedition.fusionRecipes.flatMap((recipe,index)=>{
    if(recipe.first!==picked.type && recipe.second!==picked.type) return [];
    const owned=ingredients(recipe,unitId);
    return [{recipe,index,owned,ready:owned.every(Boolean)}];
  }).sort((a,b)=>Number(b.ready)-Number(a.ready));
  const {family,gear}=roster[picked.type];
  const weapon=gear ? renderUnitWeapon(family,gear) : '';
  const cards=rows.map(({recipe,index,owned,ready})=>{
    const status=unit=>unit ? (unit.id===unitId?'선택 · 있음':'있음')+' · ★'+unit.tier : '없음';
    return `<article class="unit-fusion-card">
      <div class="unit-fusion-pictures">
        ${fusionPortrait(recipe.first,status(owned[0]))}
        ${fusionPortrait(recipe.second,status(owned[1]))}
        ${fusionPortrait(recipe.type,(ready?'결과 · ★'+Math.min(...owned.map(unit=>unit.tier)):'조합 결과')+(recipe.stage?' · '+recipe.stage+'단계':''))}
      </div>
      <button type="button" data-unit-fuse="${index}" data-fusion-unit="${unitId}" ${ready?'':'disabled'}>조합하기</button>
    </article>`;
  }).join('');
  showModal(`<h2>${roster[picked.type].name} 조합·진화</h2><p id="recipeStatus" role="status" tabindex="-1">${result || (rows.length?'이 동료를 재료로 쓰는 조합입니다.':'이 동료의 추가 조합은 없습니다.')}</p>
    <div class="unit-fusion-actions"><button id="pickPlacement" type="button">${picked.reserve?'출전 위치 선택':'배치 칸 선택'}</button><button id="unitReserve" type="button">${picked.reserve?'대기열에서 내보내기':'대기열로 이동'}</button></div>
    ${renderUnitGrowth(picked)}${weapon}<div class="unit-fusion-list">${cards}</div>`);
  $('unitReserve').onclick=()=>benchUnit(unitId);
  const mergeButton=$('mergeUnitStars');
  if(mergeButton) mergeButton.onclick=()=>{
    if(state.gameover || saveConflict || choosing()) return;
    const partner=mergePartner(picked);
    if(!partner) return;
    const merged=mergeCompanions([picked,partner],picked.reserve && !partner.reserve ? partner : picked);
    if(saveConflict) return;
    showUnitRecipes(merged.id,roster[merged.type].name+' ★'+merged.tier+' 합성 완료!');
    $('recipeStatus').focus();
  };
  $('trainUnit').onclick=()=>{
    if(!trainUnit(picked)) return;
    refresh();
    persist();
    if(saveConflict) return;
    showUnitRecipes(unitId,roster[picked.type].name+' ★'+picked.tier+' 훈련 완료!');
    $('recipeStatus').focus();
  };
  if(gear) $('upgradeUnitWeapon').onclick=()=>{
    if(!upgradeGear(family)) return;
    refresh();
    persist();
    if(saveConflict) return;
    showUnitRecipes(unitId,gear.name+' +'+state.gear[family]+' 강화 완료!');
    $('recipeStatus').focus();
  };
  $('pickPlacement').onclick=()=>{
    closeModal();
    selectedUnit=unitId;
    refresh();
    $('placement').querySelector('[data-pad]')?.focus();
  };
  $('modal').scrollTop=0;
}
function showFusionPreview(index) {
  const recipe=ZundaExpedition.fusionRecipes[index];
  if(!canUseRecipe(recipe) || state.gameover) return;
  const context={filter:$('recipeFilter').value,search:$('recipeSearch').value,species:$('recipeSpecies').value};
  const owned=ingredients(recipe);
  const ready=owned.every(Boolean);
  const resultTier=ready ? Math.min(...owned.map(unit=>unit.tier)) : null;
  const materials=[recipe.first,recipe.second].map((type,i)=>
    fusionPortrait(type,owned[i] ? '사용할 재료 · ★'+owned[i].tier : '아직 보유하지 않음'));
  showModal(`<h2>조합 미리보기</h2><p>${fusionKindLabel(ZundaExpedition.fusionKind(recipe.type))} 재료 두 명</p><div class="fusion-materials">${materials.join('')}</div><p>조합 결과</p><div class="fusion-result">${fusionPortrait(recipe.type,resultTier ? '★'+resultTier : '재료를 모으면 조합 가능')}</div><div class="title-menu"><button id="confirmFusion" ${ready?'':'disabled'}>조합 확정</button><button id="backToRecipes">조합표로 돌아가기</button></div>`);
  modalBack=()=>showRecipes(context);
  $('backToRecipes').onclick=modalBack;
  $('confirmFusion').onclick=()=>fuse(index,context);
  $('backToRecipes').focus({preventScroll:true});
  $('modal').scrollTop=0;
}
function marketOffers() {
  const pool=recruitPool.map(character=>character.type);
  const team=[...new Set(state.units.map(unit=>unit.type))];
  const owned=team.filter(type=>recruitableTypes.has(type));
  const match=owned.length ? owned[Math.floor(Math.random()*owned.length)] : null;
  if(match!==null) pool.splice(pool.indexOf(match),1);
  const options=match===null ? [] : [match];
  const missing=new Set();
  for(const {first,second} of ZundaExpedition.fusionRecipes) {
    if(team.includes(first) && !team.includes(second) && pool.includes(second)) missing.add(second);
    if(team.includes(second) && !team.includes(first) && pool.includes(first)) missing.add(first);
  }
  if(missing.size) {
    const matching=Array.from(missing);
    const partner=matching[Math.floor(Math.random()*matching.length)];
    options.push(partner);
    pool.splice(pool.indexOf(partner),1);
  }
  while(options.length<3) options.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
  return options;
}
function trainingCost(unit) { return 3+unit.tier*3; }
function trainUnit(unit) {
  if(!unit || state.gameover || saveConflict || choosing() || unit.tier>=4 || state.gems<trainingCost(unit)) return false;
  state.gems-=trainingCost(unit);
  unit.tier++;
  return true;
}
function benchUnit(id,confirmed=false) {
  const unit=state.units.find(candidate=>candidate.id===id);
  if(!unit || state.gameover || saveConflict || choosing()) return;
  if(unit.reserve) {
    if(!confirmed) {
      showModal(`<h2>동료 내보내기</h2><p>${roster[unit.type].name}을(를) 대기열에서 내보내고 보석 1개를 받습니다.</p><div class="title-menu"><button id="cancelReleaseUnit">돌아가기</button><button id="releaseUnit" class="danger">내보내기</button></div>`);
      modalBack=() => showUnitRecipes(id);
      $('cancelReleaseUnit').onclick=modalBack;
      $('releaseUnit').onclick=()=>benchUnit(id,true);
      return;
    }
    state.units=state.units.filter(candidate=>candidate!==unit);
    state.gems++;
    toast('동료를 내보냈습니다 · 보석 +1');
  } else {
    unit.reserve=true;
    unit.slot=undefined;
    reserveView=true;
    toast('대기열로 이동했습니다');
  }
  selectedUnit=null;
  closeModal();
  refresh();
  persist();
}
const gearCost=[3,5];
const ownsGearFamily=family=>state.units.some(unit=>roster[unit.type].family===family);
function gearUpgrade(family) {
  const rank=state.gear[family] ?? 0;
  const cost=gearCost[rank];
  return {rank,cost,available:cost!==undefined && state.weaponStones>=cost};
}
function upgradeGear(family) {
  if(state.gameover || saveConflict || choosing() ||
     !ZundaExpedition.rookies.some(hero=>hero.family===family) || !ownsGearFamily(family)) return false;
  const {rank,cost,available}=gearUpgrade(family);
  if(!available) return false;
  state.weaponStones-=cost;
  state.gear[family]=rank+1;
  return true;
}
function renderUnitWeapon(family,gear) {
  const {rank,cost,available}=gearUpgrade(family);
  return `<section class="unit-weapon" aria-label="전용 무기">
    <div><strong>${gear.name} +${rank}</strong><small>${gear.detail}</small><small>보유 연마석 ${state.weaponStones}개</small></div>
    <button id="upgradeUnitWeapon" type="button" ${available?'':'disabled'}>${cost===undefined?'최대 강화':(available?'무기 강화':'연마석 부족')+' · '+cost+'개'}</button>
  </section>`;
}
function showMarket() {
  if(state.gameover) return;
  if(state.shopOffers.length===0) { state.shopOffers=marketOffers(); persist(); }
  const recruitCost=4+Math.min(3,state.shopCount);
  const expansionCost=7+state.expansions*3;
  const choices=state.shopOffers.map(type=>`<button class="market-recruit" data-market="recruit" data-type="${type}" ${state.units.length>=storageLimit || state.gems<recruitCost?'disabled':''}><img alt="" referrerpolicy="no-referrer" src="${portraits[type]}"><span>${roster[type].name} · ◆ ${recruitCost}</span></button>`).join('');
  showModal(`<h2>원정 보급소</h2><p>보유 보석 ◆ ${state.gems} · 출전 ${deployedCount()} / ${capacity()} · 보유 ${state.units.length} / ${storageLimit}</p><div class="market-grid">${choices}<button data-market="reroll" ${state.gems<2?'disabled':''}>영입 목록 갱신 · ◆ 2</button><button data-market="expand" ${capacity()>=rosterLimit || state.gems<expansionCost?'disabled':''}>편성 두 자리 확장 · ◆ ${expansionCost}</button></div>`);
}
function spend(action,type) {
  if(state.gameover || choosing()) return;
  if(action==='recruit') {
    const cost=4+Math.min(3,state.shopCount);
    if(state.gems<cost || state.units.length>=storageLimit || !state.shopOffers.includes(type) || !recruitableTypes.has(type)) return;
    state.gems-=cost;
    recruit(type);
    state.shopCount++;
    state.shopOffers=marketOffers();
  } else if(action==='reroll') {
    if(state.gems<2) return;
    state.gems-=2;
    state.shopOffers=marketOffers();
  } else if(action==='expand') {
    const cost=7+state.expansions*3;
    if(state.gems<cost || capacity()>=rosterLimit) return;
    state.gems-=cost;
    state.expansions++;
  } else return;
  refresh();
  persist();
  if(saveConflict) return;
  if(action==='recruit') toast(roster[type].name+' 영입 완료');
  showMarket();
}
const reconNotes={
  runner:'빠르게 이동합니다. 결빙 지대나 범위 공격을 준비하세요.',
  shell:'장갑이 높습니다. 관통 동료가 장갑을 무시합니다.',
  mender:'주변 적을 회복시킵니다. 회복병 우선으로 조준하세요.',
  scout:'기본 전열입니다.',wraith:'빠르게 움직이며 가벼운 장갑을 갖췄습니다.'
};
function showRecon() {
  const wave=Math.min(finalWave,state.wave+1);
  const count=waveTotal(wave);
  const groups={};
  for(let i=0;i<count;i++) {
    const boss=wave%bossInterval===0&&i===count-1;
    const kind=ZundaExpedition.kind(wave,i,boss);
    groups[kind]=(groups[kind]??0)+1;
  }
  const entries=Object.entries(groups).map(([kind,quantity])=>
    `<li><b>${ZundaExpedition.opponents[kind].name} ×${quantity}</b> · ${reconNotes[kind]??'체력이 줄면 공격 유형에 따라 방어력 또는 속도가 올라갑니다.'}</li>`).join('');
  showModal(`<h2>${wave}웨이브 정찰</h2><p>${count}마리 · ${ZundaExpedition.region(wave).name}</p><ul>${entries}</ul>`);
}
function syncFocus() {
  const focus=$('focus');
  focus.setAttribute('aria-pressed',state.targetPriority!=='lead');
  focus.textContent=({lead:'선두 우선',support:'회복병 우선',boss:'보스 우선'})[state.targetPriority];
}
syncSoundButton();
if(expedition) {
  $('recon').onclick=showRecon;
  $('reloadSave').onclick=()=>location.reload();
  $('tactics').onclick=openCommands;
  const screenButton=$('fullscreen');
  const display=document.body;
  const fitEnabled=()=>display.classList.contains('fit-screen');
  const viewport=window.visualViewport;
  const wideScreen=matchMedia('(min-width:568px) and (orientation:landscape)');
  function syncDirection() {
    const mobileDirection=matchMedia('(pointer:coarse)').matches && screen.orientation?.type;
    const landscape=wideScreen.matches && (!mobileDirection || mobileDirection.startsWith('landscape'));
    display.classList.toggle('landscape-layout',landscape);
  }
  syncDirection();
  screen.orientation?.addEventListener('change',syncDirection);
  wideScreen.addEventListener('change',syncDirection);
  function syncViewportLayout() {
    if(!fitEnabled()) return;
    display.style.setProperty('--fit-width',(viewport?.width ?? innerWidth)+'px');
    display.style.setProperty('--fit-height',(viewport?.height ?? innerHeight)+'px');
    display.style.setProperty('--fit-left',(viewport?.offsetLeft ?? 0)+'px');
    display.style.setProperty('--fit-top',(viewport?.offsetTop ?? 0)+'px');
  }
  function fitScreen(enabled) {
    display.classList.toggle('fit-screen',enabled);
    screenButton.setAttribute('aria-pressed',enabled);
    screenButton.setAttribute('aria-label',enabled?'전체 화면 종료':'전체 화면');
    syncViewportLayout();
  }
  syncViewportLayout();
  window.addEventListener('resize',syncViewportLayout);
  viewport?.addEventListener('resize',syncViewportLayout);
  viewport?.addEventListener('scroll',syncViewportLayout);
  document.addEventListener('fullscreenchange',syncViewportLayout);
  screenButton.onclick=async()=>{
    if(fitEnabled()) {
      fitScreen(false);
      try { if(document.fullscreenElement) await document.exitFullscreen(); } catch {}
      return;
    }
    if(!document.documentElement.requestFullscreen) {
      toast('이 브라우저에서는 전체 화면을 지원하지 않습니다');
      return;
    }
    fitScreen(true);
    try {
      await document.documentElement.requestFullscreen({navigationUI:'hide'});
    } catch {
      fitScreen(false);
      toast('브라우저에서 전체 화면을 허용하지 않았습니다');
      return;
    }
    if(!fitEnabled()) {
      try { if(document.fullscreenElement) await document.exitFullscreen(); } catch {}
      return;
    }
    syncViewportLayout();
  };
  installFormationDrag();
  canvas.addEventListener('click',event=>{
    if(command) fireCommand(event);
    else {
      const id=guardianAt(event.clientX,event.clientY);
      if(id!==null) openUnitRecipes(id);
    }
  });
  $('autoDeploy').onclick=autoDeploy;
  $('autoFuse').onclick=autoFuse;
  $('reserveTab').onclick=()=>{reserveView=!reserveView;selectedUnit=null;refresh();};
  $('placement').addEventListener('click',event=>{
    const button=event.target.closest('[data-pad]');
    if(button) moveFormation(Number(button.dataset.pad));
  });
  $('recipes').onclick=()=>showRecipes();
  $('backToTitle').onclick=()=>{
    persist();
    if(!saveConflict) showTitleScreen();
  };
  $('market').onclick=showMarket;
  $('modalBody').addEventListener('click',event=>{
    const button=event.target.closest('[data-recipe]');
    if(button) showFusionPreview(Number(button.dataset.recipe));
    const fusion=event.target.closest('[data-unit-fuse]');
    if(fusion) fuse(Number(fusion.dataset.unitFuse),{unitId:Number(fusion.dataset.fusionUnit)});
    const order=event.target.closest('[data-order]');
    if(order) selectCommand(order.dataset.order);
    const item=event.target.closest('[data-market]');
    if(item) spend(item.dataset.market,Number(item.dataset.type));
  });
  $('cards').addEventListener('click',event=>{
    const card=event.target.closest('[data-unit]');
    if(card) openUnitRecipes(Number(card.dataset.unit));
  });
  $('focus').onclick=()=>{state.targetPriority=({lead:'support',support:'boss',boss:'lead'})[state.targetPriority];state.bossFocus=state.targetPriority==='boss';syncFocus();persist();};
  $('help').onclick=()=>{
    showModal('<h2>원정 방법</h2><p>동료 카드나 전장 캐릭터를 눌러 별 훈련, 무기 강화, 같은 동료 별 합성과 조합·진화를 할 수 있습니다. 보급소에서는 동료를 골라 영입하거나 편성을 확장합니다. 전술 지령은 웨이브마다 포격·결빙·방어막에 쓸 포인트 2개를 줍니다. 회복병이 섞이면 회복병 우선을 켜세요. 전장의 동료나 카드를 드래그해 배치 칸으로 옮기세요. 동료가 있는 칸에 놓으면 자리를 교체합니다. 동료를 누르면 가능한 조합·진화를 확인할 수 있습니다. 4웨이브마다 보스가 등장합니다. 시간이 얼마 남지 않았을 때는 보너스 충격파가 발동합니다.</p><p>비영리 팬작품입니다. 캐릭터와 일러스트 권리는 도호쿠 즌코·즌다몬 프로젝트(SSS LLC.)에 있습니다.</p><p><a href="https://zunko.jp/guideline.html">공식 이용 가이드라인</a></p><button id="openExpeditionCodex" type="button">원정대 도감</button>');
    $('openExpeditionCodex').onclick=showCodex;
  };
  syncFocus();
}
function enterGame() {
  battleStarted=true;
  if(state.gameover) end();
  else if(expedition && state.phase==='reward') {
    if(state.wave%bossInterval===0) state.contract='none';
    continueWithSupplies();
    refresh();
    persist();
  } else if(choosing()) { refresh(); showChoices(); }
  else {
    refresh();
    announce(expedition?'로사 원정대 출발!':'달빛 장미 정원에 오신 것을 환영합니다');
  }
}

function showTitleScreen() {
  battleStarted=false;
  refresh();
  const dialog=$('modal');
  dialog.classList.add('title-screen');
  showModal('<img class="title-art" src="assets/title/four-companions.webp" alt=""><h2>로사 원정대</h2><p class="title-version">v'+release.version+'</p><div class="title-actions"><button id="startExpedition">게임 시작하기</button><button id="releaseHistory">업데이트 내역</button></div>');
  $('close').hidden=true;
  $('startExpedition').onclick=()=>{
    dialog.classList.remove('title-screen');
    if(lastStored!==null && (state.units.length || state.wave>1 || state.gameover)) showPlayOptions();
    else {dialog.close();enterGame();}
  };
  $('releaseHistory').onclick=showReleaseHistory;
  $('startExpedition').focus();
}

// Publish the next minor version with its notes. Keep past version strings unchanged.
const release = {
  version:'1.19',
  title:'가로 전장 복원',
  notes:['가로로 돌리면 전장 오른쪽에 조작 버튼이 표시됩니다.']
};
const releaseHistory = [
  release,
  {version:'1.18',title:'전체 화면 전장 너비 수정',
  notes:['동료 카드가 늘어나도 전장과 조작 버튼이 화면 안에 유지됩니다.']
  },
  {version:'1.17',title:'세로 전장과 새 전투 음악',
  notes:['가로 UI를 제거했습니다. 일반 전투 음악 여섯 곡이 두 웨이브마다 교대합니다.']
  },
  {version:'1.16',title:'세로 전체 화면 잘림 수정',
  notes:['실제 전체 화면에서 조작 후에도 세로 배치를 유지하고, 보이는 화면 너비와 높이를 모두 사용합니다.']
  },
  {version:'1.15',title:'모바일 화면 맞춤',notes:['모바일 화면 배치 문제를 점검했습니다.']},
  {version:'1.14',title:'전체 화면 방향 고정',notes:['전체 화면에 들어갈 때의 배치를 종료할 때까지 유지합니다.']},
  {version:'1.13',title:'전투 난이도 상향',notes:['중후반 적의 체력과 이동 속도, 보스 체력을 높였습니다.']},
  {version:'1.12',title:'끊김 없는 전투와 전체 화면',notes:['전투 메뉴를 열어도 전투가 계속되고, 돌진 저지와 무적 방패를 제거했습니다.']},
  {version:'1.11',title:'넓어진 전장과 한 줄 동료 메뉴',notes:['동료 버튼을 한 줄에 맞추고 전장과 렌더링 해상도를 개선했습니다.']},
  {version:'1.10',title:'입구 재배치, 자동 조합과 연마석',notes:['웨이브마다 입구로 다시 배치하고, 자동 조합은 한 번 누를 때 한 건을 실행합니다. 무기 강화에는 연마석을 쓰며, 주인공은 각각 한 명만 출전합니다. 드래그 중단도 처리합니다.']},
  {version:'1.9',title:'가로 모드',notes:['가로 화면에서 전장은 왼쪽, 동료와 조작 버튼은 오른쪽에 표시되며 화면을 돌려도 전투 진행과 배치가 유지됩니다.']},
  {version:'1.8',title:'동료 성장과 간결해진 전투 화면',notes:['동료 메뉴에 성장과 배치를 모으고, 네 주인공의 5단 진화와 전용 공격 자세를 추가했습니다. 신규 동료는 입구 위쪽에 먼저 배치됩니다.']},
  {version:'1.7',title:'전투력 기준 자동 배치',notes:['출전·대기 동료 중 전투력이 높은 순으로 배치합니다. 계속 출전하는 동료는 현재 자리를 유지합니다.']},
  {version:'1.6',title:'전장 드래그 배치와 동료 진화 메뉴',notes:['전장 동료를 드래그해 배치하고, 탭하면 조합·진화가 열립니다. 일반 웨이브 보급은 자동으로 받습니다.']},
  {version:'1.5',title:'인간형과 몬스터 조합',notes:['같은 유형끼리 조합하도록 정리하고 새 인간형 동료를 추가했습니다. 스타팅 동료 공격 자세와 자동 소환 결과 표시도 추가됐습니다.']},
  {version:'1.4',title:'주인공 진화와 전용 무기',notes:['네 주인공의 인간형 중간 진화와 전용 무기, 전체 화면 타이틀, 영입·조합 미리보기가 추가됐습니다.']},
  {version:'1.3',title:'네 명의 시작 동료와 새 조합표',notes:['첫 동료 네 명의 고유 공격과 재료 보유 여부를 보여주는 조합표가 추가됐습니다. 타이틀에 업데이트 내역과 저장된 원정 이어하기를 추가했습니다.']},
  {version:'1.2',title:'타이틀 화면과 기본형 동료',notes:['타이틀에서 게임 시작하기를 눌러 원정을 시작합니다. 로사, 프패, 소설가, 빰의 기본형과 상위 조합 경로가 추가됐습니다.']},
  {version:'1.1',title:'상위 조합 동료와 검붉은 군단',notes:['상위 조합 동료 네 명의 공격 모션과 아군 용 네 마리의 일러스트를 추가했습니다. 인간형 적은 아군과 겹칠 때 반투명해집니다.']},
  {version:'1.0',title:'전투 음악과 보스 경고',notes:['전투 음악 3곡과 보스 등장 경고음을 추가하고 2~19웨이브 적 체력을 조정했습니다.']}
];
function showTitlePage(html,back,inDialogButton='') {
  const dialog=$('modal');
  dialog.classList.remove('title-screen');
  showModal(html);
  modalBack=back;
  if(inDialogButton) $(inDialogButton).onclick=back;
  if(inDialogButton) $(inDialogButton).focus({preventScroll:true});
  dialog.scrollTop=0;
}
function showReleaseHistory() {
  showTitlePage('<h2>업데이트 내역</h2>'+
    releaseHistory.map(entry=>'<section class="release-entry"><h3><span class="release-version">v'+entry.version+'</span><span>'+entry.title+'</span></h3><ul>'+
      entry.notes.map(note=>'<li>'+note+'</li>').join('')+'</ul></section>').join('')+
    '<button id="closeReleaseHistory">타이틀로 돌아가기</button>',showTitleScreen,'closeReleaseHistory');
}
function showPlayOptions() {
  showTitlePage('<h2>원정 시작</h2><p>저장된 원정 · '+state.wave+'웨이브</p>'+
    '<div class="title-menu"><button id="continueExpedition">이전 게임 이어하기</button>'+
    '<button id="newExpedition">새 게임 시작</button></div>',showTitleScreen);
  $('continueExpedition').onclick=()=>{
    modalBack=null;
    $('modal').close();
    enterGame();
  };
  $('newExpedition').onclick=confirmNewExpedition;
  $('continueExpedition').focus();
}
function confirmNewExpedition() {
  showTitlePage('<h2>새 게임 시작</h2><p>기존 원정 진행을 지우고 첫 동료 선택부터 다시 시작합니다.</p>'+
    '<div class="title-menu"><button id="cancelNewExpedition">취소</button>'+
    '<button id="confirmNewExpedition" class="danger">기존 진행을 지우고 시작</button></div>',
    showPlayOptions,'cancelNewExpedition');
  $('confirmNewExpedition').onclick=()=>{
    modalBack=null;
    resetRun();
  };
}
const releaseKey='rosa-expedition-seen-release';
let seenRelease;
try { seenRelease=localStorage.getItem(releaseKey); } catch {}

if(expedition && seenRelease!==release.version) {
  refresh();
  $('modal').classList.add('release-intro');
  showModal('<h2>로사 원정대 업데이트</h2><p><span class="release-version">v'+release.version+'</span> <strong>'+release.title+'</strong></p><ul>'+
    release.notes.map(note=>'<li>'+note+'</li>').join('')+
    '</ul><button id="enterAfterUpdate">확인</button>');
  $('close').hidden=true;
  const finishRelease=()=>{
    try { localStorage.setItem(releaseKey,release.version); } catch {}
    $('modal').removeEventListener('cancel',cancelRelease);
    $('modal').classList.remove('release-intro');
    $('modal').close();
    showTitleScreen();
  };
  const cancelRelease=event=>{
    event.preventDefault();
    finishRelease();
  };
  $('modal').addEventListener('cancel',cancelRelease);
  $('enterAfterUpdate').onclick=finishRelease;
  $('enterAfterUpdate').focus();
} else if(expedition) showTitleScreen();
else enterGame();
requestAnimationFrame(frame);
})();
