(function () {

  // ── WARM palette (top of page – sunrise/sunset) ─────────────
  const WARM = {
    top:  [26,  5,  51],   // deep purple
    mid1: [107, 26,  58],  // dark magenta
    mid2: [192, 57,  43],  // red-orange
    mid3: [232, 98,  42],  // orange
    mid4: [240, 165,  0],  // golden orange
    mid5: [247, 201, 72],  // gold
    mid6: [244, 162, 97],  // peach
    mid7: [231, 111, 81],  // coral
    mid8: [193,  68, 14],  // burnt orange
    bot:  [123,  26, 58],  // deep rose
  };

  // ── PINK MIDDLE (scroll ~40-60%) – ties into the artwork ────
  // Rich rose-pink twilight that matches the raccoon/cat images
  const PINK = {
    top:  [45,  10,  70],  // deep purple-violet
    mid1: [120,  25,  90], // dark orchid
    mid2: [180,  40, 100], // deep rose
    mid3: [210,  60, 120], // rose-pink
    mid4: [220,  80, 130], // warm pink
    mid5: [200,  70, 110], // medium rose
    mid6: [170,  55,  95], // muted rose
    mid7: [130,  45,  85], // dusty mauve
    mid8: [ 80,  25,  70], // deep mauve
    bot:  [ 40,  10,  55], // dark purple
  };

  // ── NIGHT palette (bottom – deep blue night sky) ─────────────
  const NIGHT = {
    top:  [  6,  10,  30], // near black-blue
    mid1: [ 11,  28,  55], // #0b1c37
    mid2: [ 18,  50,  78], // #12324e
    mid3: [ 25,  60,  95],
    mid4: [ 35,  75, 110],
    mid5: [ 57, 100, 127], // #39647f
    mid6: [ 45,  85, 118],
    mid7: [ 30,  65, 100],
    mid8: [ 18,  45,  75],
    bot:  [  8,  18,  42],
  };

  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpColor(ca, cb, t) {
    return [
      Math.round(lerp(ca[0], cb[0], t)),
      Math.round(lerp(ca[1], cb[1], t)),
      Math.round(lerp(ca[2], cb[2], t)),
    ];
  }
  function rgb(c) { return `rgb(${c[0]},${c[1]},${c[2]})`; }

  // Smooth step for nicer easing
  function smoothstep(t) { return t * t * (3 - 2 * t); }

  // ── Two-phase interpolation: WARM→PINK→NIGHT ────────────────
  function getPalette(t) {
    // Phase 1: 0.0 → 0.45  warm → pink
    // Phase 2: 0.45 → 1.0  pink → night
    if (t <= 0.45) {
      const s = smoothstep(t / 0.45);
      const result = {};
      Object.keys(WARM).forEach(k => {
        result[k] = lerpColor(WARM[k], PINK[k], s);
      });
      return result;
    } else {
      const s = smoothstep((t - 0.45) / 0.55);
      const result = {};
      Object.keys(PINK).forEach(k => {
        result[k] = lerpColor(PINK[k], NIGHT[k], s);
      });
      return result;
    }
  }

  function applyProgress(t) {
    const root = document.documentElement;
    const palette = getPalette(t);

    Object.keys(palette).forEach(k => {
      root.style.setProperty(`--sky-${k}`, rgb(palette[k]));
    });

    // Sun fades out early (gone by t=0.5)
    root.style.setProperty('--sun-opacity',
      String(Math.max(0, 1 - t * 2).toFixed(3)));

    // Moon fades in late (visible from t=0.5)
    root.style.setProperty('--star-opacity',
      String(Math.min(1, Math.max(0, (t - 0.45) * 2.2)).toFixed(3)));

    // Night stars
    document.querySelectorAll('.night-star').forEach(el => {
      const max  = parseFloat(el.dataset.maxOpacity || 0.9);
      // Stars start appearing at t=0.35 (during pink phase)
      const fade = Math.min(1, Math.max(0, (t - 0.35) / 0.4));
      el.style.opacity = String((fade * max).toFixed(3));
    });

    // Glass card night-mode class
    document.querySelectorAll('.glass-card').forEach(card => {
      card.classList.toggle('night-mode', t > 0.65);
    });

    // Bubble tint: gold → pink → blue-white
    document.querySelectorAll('.bubble').forEach(b => {
      let r, g, bl;
      if (t <= 0.45) {
        const s = t / 0.45;
        r  = Math.round(lerp(255, 255, s));
        g  = Math.round(lerp(220, 160, s));
        bl = Math.round(lerp(150, 200, s));
      } else {
        const s = (t - 0.45) / 0.55;
        r  = Math.round(lerp(255, 180, s));
        g  = Math.round(lerp(160, 210, s));
        bl = Math.round(lerp(200, 255, s));
      }
      b.style.background = `radial-gradient(circle at 35% 35%,
        rgba(255,255,255,0.55) 0%,
        rgba(${r},${g},${bl},0.15) 40%,
        rgba(${r},${g},${bl},0.08) 70%,
        transparent 100%)`;
    });
  }

  // ── Night stars ──────────────────────────────────────────────
  function createNightStars() {
    if (document.querySelector('.night-star')) return; // avoid duplicates
    for (let i = 0; i < 55; i++) {
      const el = document.createElement('div');
      el.className = 'night-star';
      const size  = 1 + Math.random() * 2.5;
      const maxOp = (0.4 + Math.random() * 0.55).toFixed(2);
      el.dataset.maxOpacity = maxOp;
      Object.assign(el.style, {
        width:             size + 'px',
        height:            size + 'px',
        left:              (Math.random() * 100) + '%',
        top:               (Math.random() * 90)  + '%',
        animationDuration: (2 + Math.random() * 4).toFixed(1) + 's',
        animationDelay:    '-' + (Math.random() * 4).toFixed(1) + 's',
        opacity:           '0',
      });
      document.body.appendChild(el);
    }
  }

  // ── Scroll handler ───────────────────────────────────────────
  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    // Transition starts at 10% scroll, complete at 90%
    const raw = (scrollTop / maxScroll - 0.10) / 0.80;
    const t   = Math.max(0, Math.min(1, raw));
    applyProgress(t);
  }

  // ── Init ─────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    createNightStars();
    applyProgress(0);
    window.addEventListener('scroll', onScroll, { passive: true });
  });

})();
