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
const portraits = roster.map((_, type) => CourtArt.portrait(type));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let terrain, path, lengths, pathLength, rosterKey, rosterOver, nextRefresh = 0, spellFlash = 0;
const SAVE='wonderland-defense-v2';let state, mobs=[],bullets=[],particles=[],visualTime=0,toastTimer=0,annTimer=0,last=performance.now(),W=400,H=420,uid=1,autosummonTimer=0,saveTimer=0;
const fresh=()=>({wave:1,gems:14,gold:60,life:25,upgrade:0,units:[],spawned:0,phase:'wave',spawnTimer:.9,breakTimer:0,speed:1,paused:false,auto:false,spellCD:0,kills:0,gameover:false});
try{const s=JSON.parse(localStorage.getItem(SAVE)||'null');state=s&&Number.isFinite(s.wave)&&Array.isArray(s.units)?{...fresh(),...s,spawned:0,phase:'wave',spawnTimer:.8,breakTimer:0,paused:s.gameover===true||s.life===0,gameover:s.gameover===true||s.life===0,units:s.units.slice(0,18).filter(u=>roster[u.type]&&u.tier>=1&&u.tier<=4).map(u=>({type:u.type,tier:u.tier,id:uid++,cool:Math.random()}))}:fresh()}catch{state=fresh()}
function persist(){try{localStorage.setItem(SAVE,JSON.stringify({...state,units:state.units.map(({type,tier})=>({type,tier})),spawned:0,phase:'wave',spawnTimer:.8,breakTimer:0,paused:false}))}catch{}}
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
  terrain = CourtArt.terrain(W, H, path, d);
  for (const m of mobs) [m.x,m.y] = at(m.t);
  for (const item of [...bullets, ...particles]) {
    item.x *= scaleX;
    item.y *= scaleY;
  }
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
  const row = Math.floor(i/6);
  return {x: W * ((row === 2 ? .095 : .295) + (i%6)*.121),
          y: H * [.286,.382,.624][row]};
}

function spawn(){const boss=state.wave%5===0&&state.spawned===waveTotal()-1;const hp=(boss?550:65)*Math.pow(1.24,state.wave-1);const m={id:uid++,t:0,hp,max:hp,boss,slow:0,slowFactor:1,speed:(boss?.032:.061)*(1+Math.min(state.wave,40)*.007),x:0,y:0};[m.x,m.y]=at(0);mobs.push(m);state.spawned++;if(boss)announce('👑 하트 군단의 보스 등장!')}
function waveTotal(){return Math.min(12+state.wave*2,65)}
function summon(silent=false){if(state.gems<2){if(!silent)toast('💎 보석이 부족합니다');return false}if(state.units.length>=18){if(!silent)toast('수호자는 최대 18명입니다');return false}state.gems-=2;const r=Math.random(),type=r<.26?0:r<.48?1:r<.69?2:r<.85?3:r<.96?4:5;state.units.push({id:uid++,type,tier:1,cool:Math.random()*.7, born:visualTime});if(!silent){toast(roster[type].name+' 소환!');beep(720)}refresh();persist();return true}
function merge(){const groups={};state.units.forEach(u=>{const key=u.type+'-'+u.tier;(groups[key]??=[]).push(u)});const found=Object.values(groups).filter(a=>a.length>=3&&a[0].tier<4).sort((a,b)=>b[0].tier-a[0].tier)[0];if(!found){toast('동일 캐릭터·등급 3명이 필요합니다');return}const ids=new Set(found.slice(0,3).map(u=>u.id)),u=found[0];state.units=state.units.filter(x=>!ids.has(x.id));let type=u.type;if(u.tier===3&&type<5)type++;state.units.push({id:uid++,type,tier:u.tier+1,cool:0,born:visualTime});announce('✨ '+roster[type].name+' '+(u.tier+1)+'성 합성 성공!');refresh();persist()}
function upgrade(){const cost=30+state.upgrade*25;if(state.gold<cost){toast('🪙 골드가 부족합니다');return}state.gold-=cost;state.upgrade++;announce('⚔ 공격력 '+(state.upgrade*25)+'% 강화!');refresh();persist()}
function spell(){if(state.spellCD>0){toast('마법 재사용 대기 중');return}state.spellCD=24;spellFlash=.75;mobs.forEach(m=>{if(m.hp<=0)return;damageMob(m,90+state.wave*11,'#9bd7ff',.65,25);m.slow=4;m.slowFactor=.35});announce('🌀 원더랜드 시간 정지!');beep(400,.3);refresh()}
function refresh() {
  const s = state;
  $('wave').textContent = s.wave;
  $('gems').textContent = s.gems;
  $('gold').textContent = s.gold;
  $('life').textContent = s.life;
  $('count').textContent = s.units.length + ' / 18';
  $('upgradeCost').textContent = '골드 ' + (30+s.upgrade*25);
  $('speed').textContent = s.speed + '배속';
  $('pause').textContent = s.paused ? '계속' : '일시정지';
  $('pause').setAttribute('aria-pressed', s.paused);
  $('auto').setAttribute('aria-pressed', s.auto);
  $('autoStatus').textContent = s.auto ? 'ON' : 'OFF';
  $('spellCost').textContent = s.spellCD > 0 ? Math.ceil(s.spellCD)+'초' : '준비 완료';
  $('roundflag').textContent = s.gameover ? '방어 실패' : s.paused ? '일시정지' :
    s.phase === 'break' ? '다음 웨이브 · ' + Math.ceil(s.breakTimer) + '초' : '전투 중';
  $('summon').disabled = s.gameover || s.gems < 2 || s.units.length >= 18;
  $('upgrade').disabled = s.gameover || s.gold < 30+s.upgrade*25;
  $('spell').disabled = s.gameover || s.spellCD > 0;
  $('pause').disabled = s.gameover;
  $('auto').disabled = s.gameover;

  const boss = mobs.find(m => m.boss && m.hp > 0);
  $('bosslabel').textContent = boss ? '하트 군단 · ' + Math.ceil(boss.hp) + ' / ' + Math.ceil(boss.max)
    : '다음 보스 · 웨이브 ' + (Math.floor((s.wave-1)/5)*5 + 5 + (s.wave%5===0 && s.spawned===waveTotal() ? 5 : 0));
  $('bossbar').style.width = boss ? boss.hp/boss.max*100 + '%' : '0%';

  const key = s.units.map(u => u.type+'-'+u.tier).join(',');
  if (key === rosterKey && s.gameover === rosterOver) return;
  rosterKey = key;
  rosterOver = s.gameover;
  const grouped = {};
  s.units.forEach(u => { (grouped[u.type+'-'+u.tier] ??= {u,n:0}).n++; });
  $('merge').disabled = s.gameover || !Object.values(grouped).some(({u,n}) => n>=3 && u.tier<4);
  $('cards').innerHTML = Object.values(grouped).map(({u,n}) => `<div class="unitcard" style="--unit:${roster[u.type].color}"><img alt="" src="${portraits[u.type]}"><span>${roster[u.type].name}</span><strong>★${u.tier} ×${n}</strong></div>`).join('')
    || '<div class="unitcard empty">보석 2개로 첫 수호자를 소환하세요</div>';
}

function end(){state.gameover=true;state.paused=true;refresh();persist();$('game').classList.add('over');showModal(`<h2>💔 원더랜드 함락</h2><p>${state.wave} 웨이브까지 방어했습니다.</p><p>처치한 적: ${state.kills} · 강화 레벨: ${state.upgrade}</p><button id="retry" class="danger">다시 도전</button>`);$('retry').onclick=restart}
function restart(){if(!confirm('진행 상황을 초기화하고 새로 시작할까요?'))return;state=fresh();mobs=[];bullets=[];particles=[];uid=1;rosterKey=undefined;spellFlash=0;$('game').classList.remove('over');closeModal();refresh();persist();announce('🌙 새로운 모험 시작!')}
function showModal(html) {
  $('modalBody').innerHTML = html;
  $('modalBody').querySelector('h2').id = 'modalTitle';
  if (!$('modal').open) $('modal').showModal();
}
function closeModal() { $('modal').close(); }
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
$('codex').onclick=()=>showModal('<h2>📖 원더랜드 도감</h2>'+roster.map((t,i)=>`<div class="entry"><img src="${portraits[i]}" alt=""><div><b>${t.name}</b><small>공격 ${t.dmg} · 사거리 ${t.range} · ${t.skill}</small></div></div>`).join('')+'<p>루이스 캐럴의 1865년 소설에서 모티프를 얻은 독립 제작 게임입니다.</p>');
function damageMob(m, damage, color, life = .27, radius = 17) {
  if (m.hp <= 0) return;
  m.hp -= damage;
  m.flash = visualTime + .13;
  particles.push({x:m.x,y:m.y,life,duration:life,radius,color});
  if (m.hp > 0) return;
  state.gold += m.boss ? 110 : 5 + Math.floor(state.wave/5);
  state.kills++;
  if (Math.random()<.22 || m.boss) state.gems += m.boss ? 6 : 1;
  particles.push({x:m.x,y:m.y,life:.48,duration:.48,radius:30,color:'#ffd68f'});
  if (m.boss) announce('하트 군단 격파!');
}

function hit(m, damage, source) {
  if (m.hp <= 0) return;
  damageMob(m, damage, source.color);
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
if(!path||state.paused||state.gameover||$('modal').open)return;
visualTime += dt;
spellFlash = Math.max(0, spellFlash-dt);
state.spellCD=Math.max(0,state.spellCD-dt);autosummonTimer-=dt;if(state.auto&&autosummonTimer<=0){summon(true);autosummonTimer=.6}
if(state.phase==='wave'){state.spawnTimer-=dt;if(state.spawned<waveTotal()&&state.spawnTimer<=0){spawn();state.spawnTimer=Math.max(.26,.78-state.wave*.013)}if(state.spawned===waveTotal()&&mobs.length===0){state.phase='break';state.breakTimer=3;state.gems+=5;state.gold+=15+state.wave*4;announce('🎉 웨이브 클리어! 보석 +5');persist()}}
else{state.breakTimer-=dt;if(state.breakTimer<=0){state.wave++;state.spawned=0;state.spawnTimer=.5;state.phase='wave';announce('🌙 WAVE '+state.wave);persist()}}
for(const m of mobs){if(m.hp<=0)continue;if(m.slow>0){m.slow-=dt;if(m.slow<=0)m.slowFactor=1}m.t+=m.speed*m.slowFactor*dt;[m.x,m.y]=at(m.t);if(m.t>=1){m.hp=-1;state.life-=m.boss?5:1;if(state.life<=0){state.life=0;end();return}}}
for(let i=0;i<state.units.length;i++){const u=state.units[i],t=roster[u.type],p=unitPos(i);u.cool-=dt;if(u.cool>0)continue;let target=null;for(const m of mobs){if(m.hp<=0)continue;if(Math.hypot(m.x-p.x,m.y-p.y)<t.range*(1+(u.tier-1)*.08)&&(!target||m.t>target.t))target=m}if(target){u.fired=visualTime;u.aim=Math.atan2(target.y-p.y,target.x-p.x);const damage=t.dmg*Math.pow(2.15,u.tier-1)*(1+state.upgrade*.25)*(u.type===2&&Math.random()<.25?2.5:1);bullets.push({x:p.x,y:p.y,target,damage,color:t.color,type:u.type,speed:t.projectile});u.cool=1/(t.rate*(1+(u.tier-1)*.1))}}
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
    g.beginPath();
    g.ellipse(x,y+size*.29,size*.42,size*.18,0,0,Math.PI*2);
    g.fillStyle = '#161829';
    g.fill();
    g.strokeStyle = color;
    g.lineWidth = u.tier>1 ? 1.5 : 1;
    g.stroke();
    if (arrival && motion) {
      g.globalAlpha = arrival;
      g.beginPath();
      g.ellipse(x,y+size*.24,size*(.52-arrival*.22),size*.22,0,0,Math.PI*2);
      g.stroke();
      g.globalAlpha = 1;
    }
    const idle = motion ? Math.sin(visualTime*3+i)*1.2 - 7*arrival : 0;
    g.drawImage(CourtArt.sprites[u.type],x-size/2-(kick ? Math.cos(u.aim)*kick : 0),
      y-size*.68+idle-(kick ? Math.sin(u.aim)*kick : 0),size,size);
    g.font = '9px system-ui';
    g.textAlign = 'center';
    g.fillStyle = '#ffe0a0';
    g.fillText('◆'.repeat(u.tier),x,y+size*.49);
  });
}

function drawEnemies(motion) {
  for (const m of mobs) {
    if (m.hp <= 0) continue;
    const size = m.boss ? 65 : 44;
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
    g.drawImage(CourtArt.enemies[Number(m.boss)],m.x-size/2,m.y-size*.65+stride,size,size);
    g.filter = 'none';
    const width = m.boss ? 40 : 26;
    g.fillStyle = '#24202d';
    g.fillRect(m.x-width/2,m.y-size*.54-5,width,5);
    g.fillStyle = m.boss ? '#ffb675' : '#99e1bc';
    g.fillRect(m.x-width/2+1,m.y-size*.54-4,(width-2)*m.hp/m.max,3);
  }
}

function drawEffects(motion) {
  for (const b of bullets) {
    const angle = Math.atan2(b.target.y-b.y,b.target.x-b.x);
    g.save();
    g.translate(b.x,b.y);
    g.rotate(angle);
    const length = motion ? [13,17,15,10,22,29][b.type] : 5;
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

syncSoundButton();
if (state.gameover) end();
else {
  refresh();
  announce('달빛 장미 정원에 오신 것을 환영합니다');
}
requestAnimationFrame(frame);
})();
