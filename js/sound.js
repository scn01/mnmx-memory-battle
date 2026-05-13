//  MNMX MEMORY BATTLE — sound.js
//  Web Audio API sound effects (no assets)

const Sound = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Resume if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function play(fn) {
    try { fn(getCtx()); } catch (_) {}
  }

  // Short soft click - card flip
  function flip() {
    play(ctx => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sine';
      o.frequency.setValueAtTime(520, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.08);
      g.gain.setValueAtTime(0.18, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      o.start(); o.stop(ctx.currentTime + 0.1);
    });
  }

  // Bright two-tone chime - match
  function match() {
    play(ctx => {
      [[660, 0], [880, 0.1]].forEach(([freq, delay]) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'triangle';
        o.frequency.value = freq;
        const t = ctx.currentTime + delay;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.22, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        o.start(t); o.stop(t + 0.35);
      });
    });
  }

  // Low dull thud - mismatch
  function mismatch() {
    play(ctx => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(180, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.18);
      g.gain.setValueAtTime(0.12, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      o.start(); o.stop(ctx.currentTime + 0.2);
    });
  }

  // Ascending fanfare - streak (fired at 3, 4, 5+ combos)
  function streak(count) {
    play(ctx => {
      const notes = [523, 659, 784, 1047];
      const play_count = Math.min(count, notes.length);
      for (let i = 0; i < play_count; i++) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'triangle';
        o.frequency.value = notes[i];
        const t = ctx.currentTime + i * 0.08;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.2, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        o.start(t); o.stop(t + 0.3);
      }
    });
  }

  // Victory jingle - 5 ascending notes
  function win() {
    play(ctx => {
      [523, 659, 784, 1047, 1319].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'triangle';
        o.frequency.value = freq;
        const t = ctx.currentTime + i * 0.11;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.18, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        o.start(t); o.stop(t + 0.4);
      });
    });
  }

  // Descending sad tones — loss
  function lose() {
    play(ctx => {
      [392, 330, 262].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.value = freq;
        const t = ctx.currentTime + i * 0.16;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.18, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        o.start(t); o.stop(t + 0.5);
      });
    });
  }

  // Neutral draw tone
  function draw() {
    play(ctx => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sine';
      o.frequency.setValueAtTime(440, ctx.currentTime);
      o.frequency.setValueAtTime(440, ctx.currentTime + 0.15);
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      o.start(); o.stop(ctx.currentTime + 0.5);
    });
  }

  // Soft hint chime
  function hint() {
    play(ctx => {
      [440, 554].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.value = freq;
        const t = ctx.currentTime + i * 0.09;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.14, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        o.start(t); o.stop(t + 0.3);
      });
    });
  }

  return { flip, match, mismatch, streak, win, lose, draw, hint };
})();
