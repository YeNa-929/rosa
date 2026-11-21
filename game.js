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
  ['즌다몬','zundamon_s/zzm_zunmon037.png','#adec8b'],
  ['도호쿠 즌코','zun_s/zzm_z047.png','#d7f290'],
  ['도호쿠 키리탄','kiri_s/zzm_kiri_3038.png','#ffb481'],
  ['시코쿠 메탄','methane_s/zzm_met013.png','#eca9ee'],
  ['도호쿠 이타코','ita_s/zzm_ita_3035.png','#f3b3b8'],
  ['큐슈 소라','sora_s/zzm_sora_014.png','#b9e6ff']
];
if (expedition) roster.forEach((unit,i) => { [unit.name, , unit.color] = cast[i]; });
const expansionArt = expedition ? ZundaExpedition.images() : null;
if(expedition) roster.push(...ZundaExpedition.forms);
const portraits = roster.map((_,i) => {
  if(!expedition) return CourtArt.portrait(i);
  return i<cast.length ? 'https://zunko.jp/sozai/'+cast[i][1] : expansionArt.familiars[i-cast.length].toDataURL();
});
const expeditionSprites = expedition ? portraits.slice(0,cast.length).map(src => {
  const image = new Image();
  image.referrerPolicy = 'no-referrer';
  image.src = src;
  return image;
}).concat(expansionArt.familiars) : [];
const bossInterval = expedition ? 4 : 5;
const finalWave = 12;
const rosterLimit = expedition ? 12 : 18;
const mergeCount = expedition ? 2 : 3;
let selectedUnit = null;
const keepPhase = phase => expedition && ['draft','reward'].includes(phase) ? phase : 'wave';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let terrain, path, lengths, pathLength, rosterKey, rosterOver, nextRefresh = 0, spellFlash = 0;
const SAVE=expedition ? 'zunda-expedition-v1' : 'wonderland-defense-v2';let state, mobs=[],bullets=[],particles=[],visualTime=0,toastTimer=0,annTimer=0,last=performance.now(),W=400,H=420,uid=1,autosummonTimer=0,saveTimer=0;
const fresh=()=>({wave:1,gems:14,gold:60,life:25,upgrade:0,units:[],spawned:0,phase:expedition?'draft':'wave',spawnTimer:.9,breakTimer:0,speed:1,paused:false,auto:false,spellCD:0,kills:0,gameover:false,cleared:false,offers:[],power:0,tempo:0,elite:false,bossFocus:false,expansions:0,shopOffers:[],shopCount:0});
try{const s=JSON.parse(localStorage.getItem(SAVE)||'null');state=s&&Number.isFinite(s.wave)&&Array.isArray(s.units)?{...fresh(),...s,spawned:0,phase:keepPhase(s.phase),spawnTimer:.8,breakTimer:0,paused:s.gameover===true||s.life===0,gameover:s.gameover===true||s.life===0,units:s.units.slice(0,rosterLimit).filter(u=>roster[u.type]&&u.tier>=1&&u.tier<=4).map(u=>({type:u.type,tier:u.tier,id:uid++,cool:Math.random()}))}:fresh()}catch{state=fresh()}
const capacity=()=>expedition ? Math.min(rosterLimit,8+state.expansions*2) : rosterLimit;
if(expedition && state.units.length>capacity()) state.expansions=Math.ceil((state.units.length-8)/2);
function persist(){try{localStorage.setItem(SAVE,JSON.stringify({...state,units:state.units.map(({type,tier})=>({type,tier})),spawned:0,phase:keepPhase(state.phase),spawnTimer:.8,breakTimer:0,paused:false}))}catch{}}
const beep = CourtAudio.effect;
function announce(t){$('announcement').textContent=t;$('announcement').style.opacity=1;annTimer=1.7;beep(800)}
function toast(t){$('toast').textContent=t;$('toast').style.opacity=1;toastTimer=1.9}
function resize() {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const scaleX = rect.width / W, scaleY = rect.height / H;
  W = rect.width;
  H = rect.height;
  const d = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(W * d);
  canvas.height = Math.round(H * d);
  g.setTransform(d, 0, 0, d, 0, 0);
  path = [[-22,H*.18],[W*.17,H*.18],[W*.17,H*.47],[W*.79,H*.47],
          [W*.79,H*.78],[W*.19,H*.78],[W*.19,H+30]];
  lengths = path.slice(1).map(([x,y], i) => Math.hypot(x-path[i][0], y-path[i][1]));
  pathLength = lengths.reduce((sum, value) => sum + value, 0);
  paintTerrain(d);
  for (const m of mobs) [m.x,m.y] = at(m.t);
  for (const item of [...bullets, ...particles]) {
    item.x *= scaleX;
    item.y *= scaleY;
  }
}
function paintTerrain(d = Math.min(devicePixelRatio || 1,2)) {
  terrain=expedition ? ZundaExpedition.terrain(W,H,path,d,state.wave) : CourtArt.terrain(W,H,path,d);
  if(expedition) $('regionName').textContent=ZundaExpedition.region(state.wave).name;
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
  if(expedition) return {x:W*((i>=8?.14:.30)+(i%4)*.155),y:H*[.275,.377,.61][Math.floor(i/4)]};
  const row = Math.floor(i/6);
  return {x: W * ((row === 2 ? .095 : .295) + (i%6)*.121),
          y: H * [.286,.382,.624][row]};
}

const supplies = [
  ['훈련 일지','공격력 +18%',()=>{state.power+=.18}],
  ['응원 배지','공격 속도 +15%',()=>{state.tempo+=.15}],
  ['간식 꾸러미','생명 6 회복 · 보석 2개',()=>{state.life=Math.min(25,state.life+6);state.gems+=2}],
  ['보급 상자','골드 45 · 보석 4개',()=>{state.gold+=45;state.gems+=4}],
  ['정예 도전','다음 적 체력 +40% · 통과하면 보석 7개 추가',()=>{state.elite=true}],
  ['동료 지원','동료 한 명 영입 · 만석이면 보석 4개',()=>{
    if(state.units.length<capacity()) recruit(Math.floor(Math.random()*cast.length));
    else state.gems+=4;
  }]
];
function recruit(type) {
  state.units.push({id:uid++,type,tier:1,cool:0,born:visualTime});
}
const choosing = () => state.phase==='draft'||state.phase==='reward';
function showChoices() {
  const draft = state.phase==='draft';
  const options = draft ? [0,1,2] : state.offers;
  const buttons = options.map(i => {
    const title = draft ? roster[i].name : supplies[i][0];
    const detail = draft ? roster[i].skill : supplies[i][1];
    const art = draft ? `<img referrerpolicy="no-referrer" src="${portraits[i]}" alt="">` : '';
    return `<button data-choice="${i}">${art}<b>${title}</b><small>${detail}</small></button>`;
  });
  showModal(`<h2>${draft?'첫 동료를 선택하세요':'원정 보급품을 고르세요'}</h2><p>${draft?'동료를 영입하고 같은 동료·등급 두 명을 합쳐 12웨이브까지 돌파하세요.':state.wave+'웨이브 완료 · 다음 전투로 가져갈 보급품을 하나 고르세요.'}</p><div class="choices">${buttons.join('')}</div>`);
  $('close').hidden=true;
  const choices=$('modalBody').querySelectorAll('[data-choice]');
  for(const button of choices) button.onclick=()=>{
    if(!choosing()) return;
    const i=Number(button.dataset.choice);
    if(draft) recruit(i);
    else {
      const previous=ZundaExpedition.region(state.wave);
      supplies[i][2]();
      state.wave++;
      state.shopCount=0;
      if(previous!==ZundaExpedition.region(state.wave)) paintTerrain();
    }
    state.phase='wave';
    state.offers=[];
    state.spawned=0;
    state.spawnTimer=.9;
    $('close').hidden=false;
    closeModal();
    refresh();
    persist();
  };
  choices[0]?.focus();
}
function clearWave() {
  state.gems+=5+(state.elite?7:0);
  state.gold+=15+state.wave*4;
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
    state.phase='reward';
    const pool=supplies.map((_,i)=>i);
    state.offers=Array.from({length:3},()=>pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
    showChoices();
  }
  persist();
}
function prioritizes(candidate,current) {
  if(!current) return true;
  if(state.bossFocus && candidate.boss!==current.boss) return candidate.boss;
  return candidate.t>current.t;
}
function spawn() {
  const boss=state.wave%bossInterval===0 && state.spawned===waveTotal()-1;
  const kind=expedition ? ZundaExpedition.kind(state.wave,state.spawned,boss) : null;
  const model=kind ? ZundaExpedition.opponents[kind] : null;
  const hp=(boss?550:65)*Math.pow(1.24,state.wave-1)*(state.elite?1.4:1)*(model?.hp ?? 1);
  const m={id:uid++,t:0,hp,max:hp,boss,kind,model,armor:model?.armor ?? 0,slow:0,slowFactor:1,
    speed:(boss?.032:.061)*(1+Math.min(state.wave,40)*.007)*(model?.speed ?? 1),x:0,y:0};
  [m.x,m.y]=at(0);
  mobs.push(m);
  state.spawned++;
  if(boss) announce((model?.name ?? '하트 군단의 보스')+' 등장!');
}
function waveTotal(){return Math.min(12+state.wave*2,65)}
function summon(silent=false){if(state.gems<2){if(!silent)toast('💎 보석이 부족합니다');return false}if(state.units.length>=capacity()){if(!silent)toast('편성이 가득 찼습니다');return false}state.gems-=2;const r=Math.random(),type=r<.26?0:r<.48?1:r<.69?2:r<.85?3:r<.96?4:5;state.units.push({id:uid++,type,tier:1,cool:Math.random()*.7, born:visualTime});if(!silent){toast(roster[type].name+' 소환!');beep(720)}refresh();persist();return true}
function merge(){const groups={};state.units.forEach(u=>{const key=u.type+'-'+u.tier;(groups[key]??=[]).push(u)});const found=Object.values(groups).filter(a=>a.length>=mergeCount&&a[0].tier<4).sort((a,b)=>b[0].tier-a[0].tier)[0];if(!found){toast('동일 캐릭터와 등급이 필요합니다');return}const ids=new Set(found.slice(0,mergeCount).map(u=>u.id)),u=found[0];state.units=state.units.filter(x=>!ids.has(x.id));let type=u.type;if(!expedition&&u.tier===3&&type<5)type++;state.units.push({id:uid++,type,tier:u.tier+1,cool:0,born:visualTime});announce('✨ '+roster[type].name+' '+(u.tier+1)+'성 합성 성공!');refresh();persist()}
function upgrade(){const cost=30+state.upgrade*25;if(state.gold<cost){toast('🪙 골드가 부족합니다');return}state.gold-=cost;state.upgrade++;announce('⚔ 공격력 '+(state.upgrade*25)+'% 강화!');refresh();persist()}
function spell(){if(state.spellCD>0){toast('마법 재사용 대기 중');return}state.spellCD=24;spellFlash=.75;mobs.forEach(m=>{if(m.hp<=0)return;damageMob(m,90+state.wave*11,'#9bd7ff',.65,25);m.slow=4;m.slowFactor=.35});announce('🌀 원더랜드 시간 정지!');beep(400,.3);refresh()}
function refresh() {
  const s = state;
  $('wave').textContent = s.wave;
  $('gems').textContent = s.gems;
  $('gold').textContent = s.gold;
  $('life').textContent = s.life;
  $('count').textContent = s.units.length + ' / ' + capacity();
  $('upgradeCost').textContent = '골드 ' + (30+s.upgrade*25);
  $('speed').textContent = s.speed + '배속';
  $('pause').textContent = s.paused ? '계속' : '일시정지';
  $('pause').setAttribute('aria-pressed', s.paused);
  $('auto').setAttribute('aria-pressed', s.auto);
  $('autoStatus').textContent = s.auto ? 'ON' : 'OFF';
  $('spellCost').textContent = s.spellCD > 0 ? Math.ceil(s.spellCD)+'초' : '준비 완료';
  $('roundflag').textContent = s.gameover ? (s.cleared?'원정 성공':'방어 실패') : s.paused ? '일시정지' :
    s.phase === 'break' ? '다음 웨이브 · ' + Math.ceil(s.breakTimer) + '초' : s.elite ? '정예 전투 · '+s.spawned+'/'+waveTotal() : expedition ? '전투 · '+s.spawned+'/'+waveTotal() : '전투 중';
  $('summon').disabled = s.gameover || s.gems < 2 || s.units.length >= capacity();
  $('upgrade').disabled = s.gameover || s.gold < 30+s.upgrade*25;
  $('spell').disabled = s.gameover || s.spellCD > 0;
  $('pause').disabled = s.gameover;
  $('auto').disabled = s.gameover;

  const boss = mobs.find(m => m.boss && m.hp > 0);
  $('bosslabel').textContent = boss ? (boss.model?.name ?? '하트 군단') + ' · ' + Math.ceil(boss.hp) + ' / ' + Math.ceil(boss.max)
    : '다음 보스 · 웨이브 ' + (Math.floor((s.wave-1)/bossInterval)*bossInterval + bossInterval + (s.wave%bossInterval===0 && s.spawned===waveTotal() ? bossInterval : 0));
  $('bossbar').style.width = boss ? boss.hp/boss.max*100 + '%' : '0%';

  const key = s.units.map(u => u.id+'-'+u.type+'-'+u.tier).join(',')+'|'+selectedUnit+'|'+capacity();
  if (key === rosterKey && s.gameover === rosterOver) return;
  rosterKey = key;
  rosterOver = s.gameover;
  const grouped = {};
  s.units.forEach(u => { (grouped[u.type+'-'+u.tier] ??= {u,n:0}).n++; });
  $('merge').disabled = s.gameover || !Object.values(grouped).some(({u,n}) => n>=mergeCount && u.tier<4);
  if(expedition) {
    $('market').disabled=s.gameover;
    $('recipes').disabled=s.gameover;
    $('focus').disabled=s.gameover;
    renderFormation();
    return;
  }
  $('cards').innerHTML = Object.values(grouped).map(({u,n}) => `<div class="unitcard" style="--unit:${roster[u.type].color}"><img alt="" referrerpolicy="no-referrer" src="${portraits[u.type]}"><span>${roster[u.type].name}</span><strong>★${u.tier} ×${n}</strong></div>`).join('')
    || '<div class="unitcard empty">보석 2개로 첫 수호자를 소환하세요</div>';
}

function end(){state.gameover=true;state.paused=true;refresh();persist();$('game').classList.toggle('over',!state.cleared);showModal(`<h2>${state.cleared?'원정 성공!':expedition?'원정 종료':'원더랜드 함락'}</h2><p>${state.wave} 웨이브까지 방어했습니다.</p><p>처치한 적: ${state.kills} · 강화 레벨: ${state.upgrade}</p><button id="retry" class="danger">다시 도전</button>`);$('retry').onclick=restart}
function restart(){if(!confirm('진행 상황을 초기화하고 새로 시작할까요?'))return;state=fresh();selectedUnit=null;if(expedition){syncFocus();paintTerrain();}mobs=[];bullets=[];particles=[];uid=1;rosterKey=undefined;spellFlash=0;$('game').classList.remove('over');closeModal();refresh();persist();if(expedition)showChoices();else announce('새로운 모험 시작!')}
function showModal(html) {
  $('close').hidden = false;
  $('modalBody').innerHTML = html;
  $('modalBody').querySelector('h2').id = 'modalTitle';
  if (!$('modal').open) $('modal').showModal();
}
function closeModal() { if(!choosing()) $('modal').close(); }
if(expedition) $('modal').addEventListener('cancel',event=>{if(choosing())event.preventDefault();});
$('close').onclick = closeModal;
$('summon').onclick=()=>summon();$('merge').onclick=merge;$('upgrade').onclick=upgrade;$('spell').onclick=spell;
$('speed').onclick=()=>{state.speed=state.speed===1?2:state.speed===2?3:1;refresh()};$('pause').onclick=()=>{state.paused=!state.paused;refresh()};$('auto').onclick=()=>{state.auto=!state.auto;refresh();persist()};$('reset').onclick=restart;
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
$('help').onclick=()=>showModal('<h2>♠ 게임 방법</h2><p>수호자를 무작위로 소환해 미로를 지나가는 적을 막으세요.</p><ul><li>🎲 소환: 보석 2개 소모</li><li>✨ 합성: 동일 캐릭터와 등급 3개 → 상위 등급 1개</li><li>⚔ 강화: 모든 수호자 공격력 상승</li><li>🌀 마법: 모든 적 피해 + 4초 둔화</li><li>👑 5웨이브마다 보스 등장</li><li>❤️ 적이 출구에 도달하면 생명 감소</li></ul><p>진행 상황은 이 브라우저에만 자동 저장됩니다. 게임 버튼을 처음 누르면 음악을 재생하며, 상단 음표 버튼으로 끌 수 있습니다.</p>');
$('codex').onclick=()=>showModal((expedition?'<h2>원정대 도감</h2>':'<h2>📖 원더랜드 도감</h2>')+roster.map((t,i)=>`<div class="entry"><img referrerpolicy="no-referrer" src="${portraits[i]}" alt=""><div><b>${t.name}</b><small>공격 ${t.dmg} · 사거리 ${t.range} · ${t.skill}</small></div></div>`).join('')+(expedition?'':'<p>루이스 캐럴의 1865년 소설에서 모티프를 얻은 독립 제작 게임입니다.</p>'));
function damageMob(m, damage, color, life = .27, radius = 17) {
  if (m.hp <= 0) return;
  m.hp -= damage;
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
  const effect=roster[source.type].effect;
  const afterArmor=(mob,amount)=>effect==='pierce' ? amount : amount*(1-mob.armor);
  if(effect==='execute' && m.hp <= m.max*.4) damage*=1.75;
  damageMob(m,afterArmor(m,damage),source.color);
  if(effect==='frost' && m.hp>0) {
    m.slow=2.9;
    m.slowFactor=.51;
  }
  if(effect==='chain' || effect==='burst') {
    const radius=effect==='chain'?95:74;
    const neighbors=mobs.filter(other=>other!==m && other.hp>0 && Math.hypot(other.x-m.x,other.y-m.y)<radius);
    const targets=effect==='chain' ? neighbors.slice(0,2) : neighbors;
    for(const other of targets) damageMob(other,afterArmor(other,damage*.43),source.color);
  }
  if (source.type === 3) {
    m.slow = 2.5;
    m.slowFactor = .55;
  }
  if (source.type === 4) {
    for (const other of mobs) {
      if (other !== m && Math.hypot(other.x-m.x,other.y-m.y)<52) {
        damageMob(other,damage*.35,source.color);
      }
    }
  }
}

function update(dt){toastTimer-=dt;annTimer-=dt;if(toastTimer<=0)$('toast').style.opacity=0;if(annTimer<=0)$('announcement').style.opacity=0;
if(!path||state.paused||state.gameover||choosing()||$('modal').open)return;
visualTime += dt;
spellFlash = Math.max(0, spellFlash-dt);
state.spellCD=Math.max(0,state.spellCD-dt);autosummonTimer-=dt;if(state.auto&&autosummonTimer<=0){summon(true);autosummonTimer=.6}
if(state.phase==='wave'){state.spawnTimer-=dt;if(state.spawned<waveTotal()&&state.spawnTimer<=0){spawn();state.spawnTimer=Math.max(.26,.78-state.wave*.013)}if(state.spawned===waveTotal()&&mobs.length===0){clearWave();return}}
else{state.breakTimer-=dt;if(state.breakTimer<=0){state.wave++;state.spawned=0;state.spawnTimer=.5;state.phase='wave';announce('🌙 WAVE '+state.wave);persist()}}
for(const m of mobs){if(m.hp<=0)continue;if(m.slow>0){m.slow-=dt;if(m.slow<=0)m.slowFactor=1}m.t+=m.speed*m.slowFactor*dt;[m.x,m.y]=at(m.t);if(m.t>=1){m.hp=-1;state.life-=m.boss?(expedition ? state.life : 5):1;if(state.life<=0){state.life=0;end();return}}}
for(let i=0;i<state.units.length;i++){const u=state.units[i],t=roster[u.type],p=unitPos(i);u.cool-=dt;if(u.cool>0)continue;let target=null;for(const m of mobs){if(m.hp<=0)continue;if(Math.hypot(m.x-p.x,m.y-p.y)<t.range*(1+(u.tier-1)*.08)&&prioritizes(m,target))target=m}if(target){u.fired=visualTime;u.aim=Math.atan2(target.y-p.y,target.x-p.x);const damage=t.dmg*Math.pow(2.15,u.tier-1)*(1+state.upgrade*.25+state.power)*(u.type===2&&Math.random()<.25?2.5:1);bullets.push({x:p.x,y:p.y,target,damage,color:t.color,type:u.type,speed:t.projectile});u.cool=1/(t.rate*(1+(u.tier-1)*.1+state.tempo))}}
for(const b of bullets){if(b.target.hp<=0){b.dead=true;continue}const dx=b.target.x-b.x,dy=b.target.y-b.y,d=Math.hypot(dx,dy);if(d<=Math.max(13,b.speed*dt)){hit(b.target,b.damage,b);b.dead=true}else{const step=Math.min(d,b.speed*dt);b.x+=dx/d*step;b.y+=dy/d*step}}
bullets=bullets.filter(b=>!b.dead);mobs=mobs.filter(m=>m.hp>0);particles.forEach(p=>p.life-=dt);particles=particles.filter(p=>p.life>0);
saveTimer+=dt;if(saveTimer>12){saveTimer=0;persist()}}
function drawGuardians(motion) {
  state.units.forEach((u, i) => {
    const {x,y} = unitPos(i);
    const color = roster[u.type].color;
    const size = Math.min(W*.111, H*.119, 49);
    const shot = Math.max(0, 1-(visualTime-(u.fired ?? -1))/.2);
    const arrival = Math.max(0, 1-(visualTime-(u.born ?? -1))/.4);
    const kick = motion && shot ? shot*4 : 0;
    if(u.id===selectedUnit) {
      g.beginPath();
      g.arc(x,y,roster[u.type].range*(1+(u.tier-1)*.08),0,Math.PI*2);
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
    const image=expeditionSprites[u.type];
    if(!expedition) {
      g.drawImage(CourtArt.sprites[u.type],spriteX-size/2,spriteY-size*.68,size,size);
    } else if(image && (image.width && !('complete' in image) || image.complete && image.naturalWidth)) {
      const sourceWidth=image.naturalWidth || image.width, sourceHeight=image.naturalHeight || image.height;
      const scale=Math.min(size*1.18/sourceHeight,size*1.25/sourceWidth);
      const width=sourceWidth*scale, height=sourceHeight*scale;
      g.drawImage(image,spriteX-width/2,spriteY+size*.42-height,width,height);
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
}

function drawEnemies(motion) {
  for (const m of mobs) {
    if (m.hp <= 0) continue;
    const size = m.boss ? (m.model ? (m.enraged ? 83 : 72) : 65) : 44;
    const stride = motion ? Math.sin(visualTime*13+m.id)*2 : 0;
    g.fillStyle = '#151524ab';
    g.beginPath();
    g.ellipse(m.x,m.y+8,size*.29,5,0,0,Math.PI*2);
    g.fill();
    if (m.slow>0) {
      g.strokeStyle = '#99e5ffc4';
      g.lineWidth = 2;
      g.stroke();
    }
    if (motion && m.flash>visualTime) g.filter = 'brightness(1.55)';
    const sprite=m.model ? expansionArt.enemies[m.kind] : CourtArt.enemies[Number(m.boss)];
    g.drawImage(sprite,m.x-size/2,m.y-size*.65+stride,size,size);
    g.filter = 'none';
    const width = m.boss ? 40 : 26;
    g.fillStyle = '#24202d';
    g.fillRect(m.x-width/2,m.y-size*.54-5,width,5);
    g.fillStyle = m.model?.color ?? (m.boss ? '#ffb675' : '#99e1bc');
    g.fillRect(m.x-width/2+1,m.y-size*.54-4,(width-2)*m.hp/m.max,3);
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
    g.globalAlpha = 1-progress;
    g.strokeStyle = p.color;
    g.fillStyle = p.color;
    g.lineWidth = 1.5;
    g.beginPath();
    g.arc(p.x,p.y,3+p.radius*progress,0,Math.PI*2);
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
  const motion = !reducedMotion.matches && !state.paused && !$('modal').open;
  drawGuardians(motion);
  drawEnemies(motion);
  drawEffects(motion);
}

function frame(now) {
  const dt = Math.min(.055,(now-last)/1000);
  last = now;
  update(dt*state.speed);
  draw();
  CourtAudio.sync(!state.paused && !state.gameover && !$('modal').open && !document.hidden);
  if (now >= nextRefresh) {
    refresh();
    nextRefresh = now + 125;
  }
  requestAnimationFrame(frame);
}

function renderFormation() {
  $('cards').innerHTML=state.units.map((u,i)=>`<button class="unitcard formation-card" data-unit="${u.id}" aria-pressed="${u.id===selectedUnit}" style="--unit:${roster[u.type].color}" ${state.gameover?'disabled':''}><img alt="" referrerpolicy="no-referrer" src="${portraits[u.type]}"><span>${roster[u.type].name}</span><strong>${i+1}번 · ★${u.tier}</strong></button>`).join('')
    || '<div class="unitcard empty">보석 2개로 동료를 영입하세요</div>';
}
function selectFormation(id) {
  const index=state.units.findIndex(u=>u.id===id);
  if(index<0 || state.gameover) return;
  const from=state.units.findIndex(u=>u.id===selectedUnit);
  if(from>=0 && from!==index) {
    [state.units[from],state.units[index]]=[state.units[index],state.units[from]];
    selectedUnit=null;
    toast('동료 위치를 교체했습니다');
    persist();
  } else {
    selectedUnit=selectedUnit===id ? null : id;
    if(selectedUnit!==null) toast('교체할 다른 동료를 선택하세요');
  }
  refresh();
}
function ingredients(recipe) {
  return [recipe.first,recipe.second].map(type=>
    state.units.reduce((best,u)=>u.type===type && (!best || u.tier<best.tier) ? u : best,null));
}
function fuse(index) {
  const recipe=ZundaExpedition.forms[index];
  if(!recipe || state.gameover) return;
  const [first,second]=ingredients(recipe);
  if(!first || !second) return;
  const slot=state.units.indexOf(first);
  state.units[slot]={id:uid++,type:cast.length+index,tier:Math.min(first.tier,second.tier),cool:0,born:visualTime};
  state.units.splice(state.units.indexOf(second),1);
  selectedUnit=null;
  closeModal();
  announce(recipe.name+' 탄생!');
  refresh();
  persist();
}
function showRecipes() {
  const rows=ZundaExpedition.forms.map((recipe,index)=>{
    const ready=ingredients(recipe).every(Boolean);
    return {recipe,index,ready};
  }).sort((a,b)=>Number(b.ready)-Number(a.ready));
  const buttons=rows.map(({recipe,index,ready})=>`<button class="recipe" data-recipe="${index}" ${ready?'':'disabled'}><img src="${portraits[cast.length+index]}" alt=""><span><b>${recipe.name}</b><small>${roster[recipe.first].name} + ${roster[recipe.second].name}</small><small>${recipe.skill}</small></span><em>${ready?'조합':'재료 부족'}</em></button>`).join('');
  showModal('<h2>몬스터 조합표</h2><p>서로 다른 동료를 조합하면 두 재료 중 낮은 별 등급으로 태어납니다. 일반 합성은 같은 동료의 등급을 올립니다.</p><div class="recipes">'+buttons+'</div>');
}
function marketOffers() {
  const pool=cast.map((_,i)=>i);
  return Array.from({length:3},()=>pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
}
function trainingCost(unit) { return 3+unit.tier*3; }
function showMarket() {
  if(state.gameover) return;
  if(state.shopOffers.length===0) { state.shopOffers=marketOffers(); persist(); }
  const picked=state.units.find(u=>u.id===selectedUnit);
  const recruitCost=4+Math.min(3,state.shopCount);
  const expansionCost=7+state.expansions*3;
  const choices=state.shopOffers.map(type=>`<button class="market-recruit" data-market="recruit" data-type="${type}" ${state.units.length>=capacity() || state.gems<recruitCost?'disabled':''}><img alt="" referrerpolicy="no-referrer" src="${portraits[type]}"><span>${roster[type].name} · ◆ ${recruitCost}</span></button>`).join('');
  const train=picked && picked.tier<4 ? `<button data-market="train" ${state.gems<trainingCost(picked)?'disabled':''}>${roster[picked.type].name} 훈련 · ◆ ${trainingCost(picked)}</button>` : '<p>카드에서 동료를 한 명 선택하면 보석으로 4성까지 훈련할 수 있습니다.</p>';
  showModal(`<h2>원정 보급소</h2><p>보유 보석 ◆ ${state.gems} · 편성 ${state.units.length} / ${capacity()}</p><div class="market-grid">${choices}<button data-market="reroll" ${state.gems<2?'disabled':''}>영입 목록 갱신 · ◆ 2</button><button data-market="expand" ${capacity()>=rosterLimit || state.gems<expansionCost?'disabled':''}>편성 두 자리 확장 · ◆ ${expansionCost}</button>${train}<button data-market="charge" ${state.gems<4 || state.spellCD===0?'disabled':''}>간식 폭풍 즉시 충전 · ◆ 4</button></div>`);
}
function spend(action,type) {
  if(state.gameover || choosing()) return;
  const picked=state.units.find(u=>u.id===selectedUnit);
  if(action==='recruit') {
    const cost=4+Math.min(3,state.shopCount);
    if(state.gems<cost || state.units.length>=capacity() || !state.shopOffers.includes(type)) return;
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
  } else if(action==='train') {
    if(!picked || picked.tier>=4 || state.gems<trainingCost(picked)) return;
    state.gems-=trainingCost(picked);
    picked.tier++;
  } else if(action==='charge') {
    if(state.gems<4 || state.spellCD===0) return;
    state.gems-=4;
    state.spellCD=0;
    closeModal();
  } else return;
  refresh();
  persist();
  if(action!=='charge') showMarket();
}
function syncFocus() {
  const focus=$('focus');
  focus.setAttribute('aria-pressed',state.bossFocus);
  focus.textContent=state.bossFocus?'보스 우선':'선두 우선';
}
syncSoundButton();
if(expedition) {
  $('recipes').onclick=showRecipes;
  $('market').onclick=showMarket;
  $('modalBody').addEventListener('click',event=>{
    const button=event.target.closest('[data-recipe]');
    if(button) fuse(Number(button.dataset.recipe));
    const item=event.target.closest('[data-market]');
    if(item) spend(item.dataset.market,Number(item.dataset.type));
  });
  $('cards').addEventListener('click',event=>{
    const card=event.target.closest('[data-unit]');
    if(card) selectFormation(Number(card.dataset.unit));
  });
  $('focus').onclick=()=>{state.bossFocus=!state.bossFocus;syncFocus();persist();};
  $('help').onclick=()=>showModal('<h2>원정 방법</h2><p>동료를 영입하고, 같은 동료·등급 두 명을 합성하세요. 서로 다른 동료는 조합표에서 몬스터로 진화시키세요. 보급소에서 지정 영입, 편성 확장, 훈련을 할 수 있습니다. 동료 카드 두 장을 차례로 누르면 전장 위치가 바뀝니다. 4·8·12웨이브에는 반드시 저지해야 하는 보스가 등장합니다.</p><p>비영리 팬작품입니다. 캐릭터와 일러스트 권리는 도호쿠 즌코·즌다몬 프로젝트(SSS LLC.)에 있습니다.</p><p><a href="https://zunko.jp/guideline.html">공식 이용 가이드라인</a></p>');
  syncFocus();
}
if (state.gameover) end();
else if (choosing()) { refresh(); showChoices(); }
else {
  refresh();
  announce(expedition?'즌다 원정대 출발!':'달빛 장미 정원에 오신 것을 환영합니다');
}
requestAnimationFrame(frame);
})();
