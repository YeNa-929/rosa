/* Original 8-bar battle loop, synthesized locally with Web Audio. */
'use strict';

const CourtAudio = (() => {
  const preference = 'wonderland-audio-enabled';
  const beat = 60/148;
  const step = beat/2;
  const melody = [
    [76,0,79,81,83,81,79,76], [74,76,79,0,81,79,76,74],
    [72,0,76,79,84,83,79,76], [74,0,78,81,86,81,78,74],
    [76,79,83,86,88,86,83,79], [74,79,81,83,86,83,81,79],
    [76,0,79,84,88,84,79,76], [74,78,81,86,83,81,78,0]
  ];
  const roots = [40,43,36,38,40,43,36,38];
  const chords = [[64,67,71],[62,67,71],[64,67,72],[62,66,69]];
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

  function sync(playing) {
    if (!enabled || !playing || context?.state !== 'running') {
      stop();
      return;
    }
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
      const bar = Math.floor(position/8);
      const eighth = position%8;
      const note = melody[bar][eighth];
      if (note) voice(music,note,next,step*.95,.055,'triangle');
      if (eighth%2===0) {
        voice(music,roots[bar]+(eighth===4 ? 7 : 0),next,step*1.65,.075,'triangle');
        voice(music,41,next,.13,.12,'sine',40);
      } else {
        for (const harmony of chords[bar%4]) voice(music,harmony,next,.13,.014,'triangle');
      }
      if (eighth===2 || eighth===6) voice(music,79,next,.075,.026,'square',150);
      position=(position+1)%64;
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
    else stop();
  }

  function effect(frequency = 600, duration = .07) {
    if (!enabled || context?.state !== 'running' || document.hidden) return;
    const note = 69 + 12*Math.log2(frequency/440);
    voice(context.destination,note,context.currentTime,duration,.036,'sine');
  }

  return { get enabled() { return enabled; }, unlock, toggle, sync, effect };
})();
