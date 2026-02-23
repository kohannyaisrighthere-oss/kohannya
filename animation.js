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
  progressBar.innerHTML = `<div class="progress-fill" style="width:${(index / (TOTAL_PAGES - 1)) * 100}%;"></div>`;
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

  const speed = 5.5 - (Math.min(index, TOTAL_PAGES - 1) / (TOTAL_PAGES - 1)) * (5.5 - 0.6);
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

  const [textOh, textFilled, textILove, textDoYouLoveMe] = textEls;

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

  show(textOh, 500);
  show(textFilled, 2000);  hide(textFilled, 4000);
  show(textILove, 4500);
  show(textDoYouLoveMe, 6500);

  setTimeout(() => {
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.animation = 'textReveal 1.5s ease forwards';
  }, 8500);

  function showFarewell() {
    if (showFarewell.fired) return;
    showFarewell.fired = true;
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

      const words = [
        { text: 'Так',               cls: 'word-1', size: '6.5rem', reveal: 500,   animDur: 4.5, breath: 5000  },
        { text: 'Завжди і назавжди', cls: 'word-2', size: '2.5rem', reveal: 5000,  animDur: 4.5, breath: 9500  },
        { text: 'Твій єнот',         cls: 'word-3', size: '2rem',   reveal: 10500, animDur: 3.5, breath: 14000 },
      ];

      words.forEach(({ text, cls, size, reveal, animDur, breath }) => {
        const el = document.createElement('div');
        el.className = `farewell-line ${cls}`;
        el.textContent = text;
        el.style.fontSize = size;
        farewell.appendChild(el);

        setTimeout(() => {
          el.style.animation = `epicWordReveal ${animDur}s cubic-bezier(0.16, 1, 0.3, 1) forwards`;
        }, reveal);

        setTimeout(() => {
          el.style.animation =
            'epicWordBreath 5s ease-in-out infinite, subtleBreath 8s ease-in-out infinite';
          el.style.opacity = '1';
        }, breath);
      });

      setTimeout(() => {
        const blackout = document.createElement('div');
        blackout.id = 'final-blackout';
        document.body.appendChild(blackout);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          blackout.style.opacity = '1';
        }));
      }, 21000);

    }, 900);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const firstPage = createPage(0);
  pagesContainer.appendChild(firstPage);
  attachEvents(firstPage);
});
