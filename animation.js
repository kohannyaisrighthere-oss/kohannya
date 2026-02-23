const messages = [
  "Історія кохання починається...",
  "Наші серця б'ються одночасно",
  "Моя лінія життя перетинається з твоєю",
  "Ти мій місяць",
  "Ти моє сонце",
  "Ти мої зірки",
  "Я уже близько..."
];

const raccoonVideos = [
  'videos/beggining.mp4',
  'videos/sync.mp4',
  'videos/lines.mp4',
  'videos/moon.mp4',
  'videos/sun.mp4',
  'videos/stars.mp4',
  'videos/heart.mp4'
];

const positions = [
  { top: "30%", left: "10%" },
  { top: "38%", left: "10%" },
  { top: "50%", left: "10%" },
  { top: "60%", left: "0%"  },
  { top: "50%", left: "10%" },
  { top: "65%", left: "15%" },
  { top: "30%", left: "10%" }
];

const positionsMobile = [
  { left: "10%", top: "10%" },
  { left: "10%", top: "15%" },
  { left: "20%", top: "30%" },
  { left: "20%", top: "10%" },
  { left: "30%", top: "50%" },
  { left: "50%", top: "60%" },
  { left: "40%", top: "10%" }
];

const backgrounds = [
  'videos/bg1.mp4',
  'videos/bg2.mp4',
  'videos/bg3.mp4',
  'videos/bg4.mp4',
  'videos/bg5.mp4',
  'videos/bg6.mp4',
  'videos/bg7.mp4'
];

const TOTAL_PAGES = 7;
const LAST_INDEX  = 6;

let clickCount = 0;

const pagesContainer = document.getElementById('pagesContainer');

document.body.style.overflow = 'hidden';

function smoothScrollTo(target, duration) {
  const start     = window.pageYOffset;
  const end       = target.offsetTop;
  const distance  = end - start;
  const startTime = performance.now();

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, start + distance * progress);
    if (elapsed < duration) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function createPage(index) {
  const page = document.createElement('div');
  page.className = 'page soft-in';

  const bg = document.createElement('div');
  bg.className = 'page-bg';
  bg.innerHTML = `<video autoplay muted playsinline loop class="bg-video">
    <source src="${backgrounds[index]}" type="video/mp4" />
  </video>`;
  page.appendChild(bg);

  const container = document.createElement('div');
  container.className = 'container';

  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressBar.innerHTML = `<div class="progress-fill" style="width:${(index / LAST_INDEX) * 100}%;"></div>`;
  container.appendChild(progressBar);

  const message = document.createElement('div');
  message.className = 'romantic-message';
  message.textContent = messages[index];
  Object.assign(message.style, positionsMobile[index] || {});
  container.appendChild(message);

  const raccoonContainer = document.createElement('div');
  raccoonContainer.className = 'raccoon-container';
  raccoonContainer.dataset.clicked = 'false';
  Object.assign(raccoonContainer.style, positions[index] || {});

  const raccoon = document.createElement('div');
  raccoon.className = 'raccoon heartbeat';
  raccoon.innerHTML = `<video autoplay muted playsinline loop style="width:100%;height:100%;object-fit:cover;">
    <source src="${raccoonVideos[index]}" type="video/mp4" />
  </video>`;

  const speed = 5.5 - (Math.min(index, LAST_INDEX) / LAST_INDEX) * (5.5 - 0.6);
  raccoon.style.setProperty('--heartbeat-speed', `${speed.toFixed(2)}s`);

  raccoonContainer.appendChild(raccoon);
  container.appendChild(raccoonContainer);
  page.appendChild(container);
  return page;
}

function attachEvents(page) {
  const raccoonContainer = page.querySelector('.raccoon-container');

  function handleClick(e) {
    e.preventDefault();
    if (raccoonContainer.dataset.clicked === 'true') return;
    raccoonContainer.dataset.clicked = 'true';
    if (clickCount < TOTAL_PAGES) handleInteraction(e, raccoonContainer);
  }

  raccoonContainer.addEventListener('click', handleClick);
  raccoonContainer.addEventListener('touchstart', handleClick, { passive: false });
}

function handleInteraction(event, container) {
  clickCount++;
  animateClick(container, event);

  if (clickCount < TOTAL_PAGES) {
    const nextPage = createPage(clickCount);
    pagesContainer.appendChild(nextPage);
    smoothScrollTo(nextPage, 1000);
    attachEvents(nextPage);
  } else {
    setTimeout(showFinalScreen, 1200);
  }
}

function animateClick(container, event) {
  const raccoon = container.querySelector('.raccoon');
  raccoon.classList.add('epic');
  setTimeout(() => raccoon.classList.remove('epic'), 1000);
  spawnHearts(event, container);
}

function spawnHearts(event, container) {
  const rect = container.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  for (let i = 0; i < 5; i++) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = `${x}px`;
    heart.style.top  = `${y}px`;
    heart.style.animation = `float ${1.5 + i * 0.3}s linear forwards`;
    container.appendChild(heart);
    setTimeout(() => heart.remove(), (1.5 + i * 0.3) * 1000);
  }
}

function showFinalScreen() {
  const overlay = document.createElement('div');
  overlay.id = 'finalPage';

  const texts = [
    { content: "Ох",                                    visible: true  },
    { content: "Це так мило! Ти заповнила моє серце",   visible: false },
    { content: "Я кохаю тебе",                          visible: false },
    { content: "А ти мене?",                            visible: false }
  ];

  const textEls = texts.map(({ content, visible }) => {
    const el = document.createElement('div');
    el.className = 'epic-text';
    el.textContent = content;
    if (!visible) el.style.display = 'none';
    overlay.appendChild(el);
    return el;
  });

  const [t1, t2, t3, t4] = textEls;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.id = 'buttonsContainer';

  ['Sì', 'Oui', 'Yes', 'Так'].forEach(label => {
    const btn = document.createElement('button');
    btn.className = 'answer-button';
    btn.textContent = label;
    btn.addEventListener('click', showFarewell);
    buttonsContainer.appendChild(btn);
  });

  overlay.appendChild(buttonsContainer);
  document.body.appendChild(overlay);

  function show(el, delay) {
    setTimeout(() => {
      el.style.display = 'block';
      el.style.animation = 'textReveal 1.5s ease forwards';
    }, delay);
  }

  function hide(el, delay) {
    setTimeout(() => {
      el.style.animation = 'fadeOut 0.5s ease forwards';
      setTimeout(() => { el.style.display = 'none'; el.style.animation = ''; }, 500);
    }, delay);
  }

  show(t1, 500);
  show(t2, 2000);  hide(t2, 4000);
  show(t3, 4500);
  show(t4, 6500);

  setTimeout(() => {
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.animation = 'textReveal 1.5s ease forwards';
  }, 8500);

  function showFarewell() {
    if (showFarewell.fired) return;   // ← guard: run once only
    showFarewell.fired = true;

    // Disable all buttons immediately so further taps do nothing
    buttonsContainer.querySelectorAll('.answer-button').forEach(b => {
      b.disabled = true;
      b.style.pointerEvents = 'none';
    });

    buttonsContainer.style.transition = 'opacity 0.6s ease';
    buttonsContainer.style.opacity = '0';
    setTimeout(() => buttonsContainer.remove(), 700);

    textEls.forEach(el => {
      el.style.transition = 'opacity 0.6s ease';
      el.style.opacity = '0';
      setTimeout(() => { el.style.display = 'none'; }, 700);
    });

    setTimeout(() => {
      const blurLayer = document.createElement('div');
      blurLayer.id = 'farewell-blur';
      overlay.appendChild(blurLayer);

      const farewell = document.createElement('div');
      farewell.id = 'farewell-text';
      overlay.appendChild(farewell);

      [
        { text: 'Так',               size: '5.5rem', delay: 500  },
        { text: 'Завжди і назавжди', size: '2.2rem', delay: 2200 },
        { text: 'Твій єнот',         size: '1.7rem', delay: 4000 }
      ].forEach(({ text, size, delay }) => {
        const el = document.createElement('div');
        el.className = 'farewell-line';
        el.textContent = text;
        el.style.fontSize = size;
        farewell.appendChild(el);
        setTimeout(() => {
          el.style.animation = 'farewellReveal 1.8s cubic-bezier(0.2,0,0.3,1) forwards';
        }, delay);
      });

      setTimeout(() => {
        const blackout = document.createElement('div');
        blackout.id = 'final-blackout';
        document.body.appendChild(blackout);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          blackout.style.opacity = '1';
        }));
      }, 13000);

    }, 800);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const firstPage = createPage(0);
  pagesContainer.appendChild(firstPage);
  attachEvents(firstPage);
});
