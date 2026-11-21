/* Original battle scores, synthesized locally with Web Audio. */
'use strict';

const CourtAudio = (() => {
  const preference = 'wonderland-audio-enabled';
  const melody = [
    [76,0,79,81,83,81,79,76], [74,76,79,0,81,79,76,74],
    [72,0,76,79,84,83,79,76], [74,0,78,81,86,81,78,74],
    [76,79,83,86,88,86,83,79], [74,79,81,83,86,83,81,79],
    [76,0,79,84,88,84,79,76], [74,78,81,86,83,81,78,0]
  ];
  const roots = [40,43,36,38,40,43,36,38];
  const chords = [[64,67,71],[62,67,71],[64,67,72],[62,66,69]];
  const tracks = {
    opening:{bpm:148,melody,roots,chords,lead:'triangle'},
    rift:{bpm:160,lead:'square',
      melody:[[81,0,84,81,79,81,76,79],[77,81,84,88,84,81,79,77],[79,82,86,82,79,77,74,77],[76,80,83,86,83,80,76,0]],
      roots:[45,41,43,40],chords:[[69,72,76],[65,69,72],[67,70,74],[64,68,71]]},
    deep:{bpm:136,lead:'triangle',
      melody:[[74,81,77,84,81,86,84,81],[70,74,77,81,85,81,77,74],[72,79,76,83,79,84,83,79],[73,76,79,85,88,85,79,76]],
      roots:[38,34,36,33],chords:[[62,65,69],[58,62,65],[60,64,67],[61,64,67]]},
    harbor:{bpm:132,lead:'sine',beats:6,kicks:[0,3],bass:[0,3],stabs:[1,4],snare:[3],
      melody:[[74,0,78,81,0,78],[76,79,0,83,81,0],[78,0,81,86,85,81],[79,76,0,73,0,0]],
      roots:[38,40,35,33],chords:[[62,66,69],[64,67,71],[59,62,66],[61,64,69]]},
    chase:{bpm:166,lead:'square',kicks:[0,3,4,7],bass:[0,3,6],stabs:[2,5],snare:[2,6],
      melody:[[72,0,75,0,79,77,75,0],[70,74,0,77,0,82,77,74],[68,0,72,75,0,79,0,75],[67,71,74,0,77,74,71,0]],
      roots:[36,34,32,31],chords:[[60,63,67],[58,62,65],[56,60,63],[55,59,62]]},
    lantern:{bpm:112,lead:'triangle',kicks:[0,5],bass:[0,4,7],stabs:[0,5],snare:[4],
      melody:[[83,0,0,78,0,81,78,0],[79,0,74,0,0,78,0,0],[76,0,79,83,0,86,0,0],[81,0,0,78,76,0,74,0]],
      roots:[35,31,40,38],chords:[[62,66,71],[59,62,67],[64,67,71],[62,66,69]]},
    boss:{bpm:178,lead:'sawtooth',
      melody:[[62,62,74,0,65,62,68,67],[61,61,73,0,64,61,67,65],[62,65,74,77,74,68,67,65],[60,63,72,75,73,67,64,61]],
      roots:[38,37,38,36],chords:[[62,65,68],[61,64,67],[62,65,69],[60,63,67]]}
  };
  let activeTrack='opening', warning;
  let enabled = true;
  let context, music, next, position = 0, failed = false;
  try { enabled = localStorage.getItem(preference) !== 'off'; } catch {}

  function voice(destination, note, time, duration, level, type, slide) {
    const oscillator = context.createOscillator();
    const volume = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(440 * 2**((note-69)/12), time);
    if (slide) oscillator.frequency.exponentialRampToValueAtTime(slide, time+duration);
    volume.gain.setValueAtTime(.0001,time);
    volume.gain.linearRampToValueAtTime(level,time+.008);
    volume.gain.exponentialRampToValueAtTime(.0001,time+duration);
    oscillator.connect(volume);
    volume.connect(destination);
    oscillator.start(time);
    oscillator.stop(time+duration+.01);
  }

  function stop() {
    if (!music) return;
    const fading = music;
    fading.gain.setTargetAtTime(0,context.currentTime,.012);
    setTimeout(() => fading.disconnect(),90);
    music = undefined;
  }

  function sync(playing,track='opening') {
    if(track!==activeTrack) {
      stop();
      activeTrack=track;
      position=0;
    }
    if (!enabled || !playing || context?.state !== 'running') {
      stop();
      if(!playing || !enabled) silenceWarning();
      return;
    }
    const song=tracks[activeTrack];
    const step=30/song.bpm;
    const now = context.currentTime;
    if (!music) {
      music = context.createGain();
      music.gain.setValueAtTime(0,now);
      music.gain.linearRampToValueAtTime(.72,now+.04);
      music.connect(context.destination);
      next = now+.035;
    }
    if (next<now) next=now+.02;
    while (next<now+.11) {
      const beats=song.beats ?? 8;
      const bar=Math.floor(position/beats)%song.melody.length;
      const beat=position%beats;
      const answer=Math.floor(position/(beats*song.melody.length))%2===1;
      const note=song.melody[bar][beat];
      if(note) {
        voice(music,note,next,step*.95,.055,song.lead);
        if(answer && beat%3===0) voice(music,note-12,next+step*.48,step*.8,.025,'sine');
      }
      if((song.bass ?? [0,2,4,6]).includes(beat))
        voice(music,song.roots[bar]+(beat===4?7:0),next,step*1.65,.075,'triangle');
      if((song.kicks ?? [0,2,4,6]).includes(beat)) voice(music,41,next,.13,.12,'sine',40);
      if((song.stabs ?? [1,3,5,7]).includes(beat))
        for(const harmony of song.chords[bar%4]) voice(music,harmony,next,step*(song.stabs?1.8:.8),.014,'triangle');
      if((song.snare ?? [2,6]).includes(beat)) voice(music,79,next,.075,.026,'square',150);
      position=(position+1)%(2*song.melody.length*beats);
      next+=step;
    }
  }

  function unlock() {
    if (!enabled || failed) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) { failed = true; return; }
      context ??= new Audio();
      if (context.state !== 'running') context.resume().catch(() => {});
    } catch { failed = true; }
  }

  function toggle() {
    enabled = !enabled;
    try { localStorage.setItem(preference,enabled ? 'on' : 'off'); } catch {}
    if (enabled) unlock();
    else { stop(); silenceWarning(); }
  }

  function effect(frequency = 600, duration = .07) {
    if (!enabled || context?.state !== 'running' || document.hidden) return;
    const note = 69 + 12*Math.log2(frequency/440);
    voice(context.destination,note,context.currentTime,duration,.036,'sine');
  }

  function silenceWarning() {
    if(!warning) return;
    warning.disconnect();
    warning=undefined;
  }

  function bossWarning() {
    if(!enabled || context?.state!=='running' || document.hidden) return;
    silenceWarning();
    const bus=context.createGain();
    bus.connect(context.destination);
    warning=bus;
    const start=context.currentTime+.015;
    [0,.29,.58].forEach((delay,i)=>{
      voice(bus,i===2?50:43,start+delay,.22,.13,'triangle');
      voice(bus,i===2?65:54,start+delay,.18,.045,'sawtooth');
    });
    setTimeout(()=>{if(warning===bus)silenceWarning();},950);
  }

  return { get enabled() { return enabled; }, unlock, toggle, sync, effect, bossWarning };
})();
