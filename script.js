if (navigator.userAgent.includes("Line")) {
      const url = window.location.href;
      window.location.href = url + (url.includes('?') ? '&' : '?') + 'openExternalBrowser=1';
    }

/* ── Stars ── */
(function(){
  const c = document.getElementById('stars');
  const ctx = c.getContext('2d');
  let w, h, stars = [];

  function resize(){ w = c.width = window.innerWidth; h = c.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);

  const COLORS = ['rgba(244,114,182,', 'rgba(192,132,252,', 'rgba(125,211,252,', 'rgba(110,231,183,', 'rgba(255,255,255,'];

  for(let i=0;i<120;i++){
    stars.push({
      x: Math.random()*2000, y: Math.random()*1200,
      r: Math.random()*1.5+0.3,
      alpha: Math.random()*0.6+0.2,
      speed: Math.random()*0.008+0.002,
      color: COLORS[Math.floor(Math.random()*COLORS.length)]
    });
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    const t = Date.now()*0.001;
    stars.forEach(s=>{
      const a = s.alpha * (0.5 + 0.5*Math.sin(t*s.speed*60 + s.x));
      ctx.beginPath();
      ctx.arc(s.x % w, s.y % h, s.r, 0, Math.PI*2);
      ctx.fillStyle = s.color + a + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── Music ── */
/* Basic law slideshow */
const basicSlides = Array.from({ length: 11 }, (_, i) => `pictureassets/basic${i + 1}.png`);
let basicSlideIndex = 0;

function renderBasicSlide() {
  const img = document.getElementById('basicSlideImg');
  const count = document.getElementById('basicSlideCount');
  const progress = document.getElementById('basicSlideProgress');
  const dots = document.querySelectorAll('.slide-dot');
  if (!img || !count) return;
  img.src = basicSlides[basicSlideIndex];
  img.alt = `ภาพรวมกฎหมายพัสดุ หน้า ${basicSlideIndex + 1}`;
  count.textContent = `${basicSlideIndex + 1} / ${basicSlides.length}`;
  if (progress) progress.style.width = `${((basicSlideIndex + 1) / basicSlides.length) * 100}%`;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === basicSlideIndex));
}

function changeBasicSlide(step) {
  basicSlideIndex = (basicSlideIndex + step + basicSlides.length) % basicSlides.length;
  renderBasicSlide();
}

function goBasicSlide(index) {
  basicSlideIndex = index;
  renderBasicSlide();
}

(function initBasicSlides() {
  const dots = document.getElementById('basicSlideDots');
  const viewer = document.getElementById('basicSlideViewer');
  if (!dots || !viewer) return;
  dots.innerHTML = basicSlides.map((_, i) =>
    `<button class="slide-dot${i === 0 ? ' active' : ''}" type="button" onclick="goBasicSlide(${i})" aria-label="ไปหน้าที่ ${i + 1}"></button>`
  ).join('');

  let startX = 0;
  viewer.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive:true });
  viewer.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) changeBasicSlide(dx < 0 ? 1 : -1);
  }, { passive:true });
})();

/* Supply break game */
const supplyGame = {
  running: false,
  score: 0,
  time: 45,
  x: 50,
  dir: 0,
  touchActive: false,
  items: [],
  lastSpawn: 0,
  lastTick: 0,
  timer: 0,
  raf: 0
};
const supplyKeyboardStack = [];

function getSupplyKeyDir(key) {
  const lower = key.toLowerCase();
  if (key === 'ArrowLeft' || lower === 'a') return -1;
  if (key === 'ArrowRight' || lower === 'd') return 1;
  return 0;
}

/* Appeal knowledge slideshow */
const appealSlides = [
  ...Array.from({ length: 7 }, (_, i) => `appeal/${i + 1}a.png`),
  'appeal/a8.png',
  'appeal/a9.png'
];
let appealSlideIndex = 0;

function renderAppealSlide() {
  const img = document.getElementById('appealSlideImg');
  const count = document.getElementById('appealSlideCount');
  const progress = document.getElementById('appealSlideProgress');
  const dots = document.querySelectorAll('.appeal-slide-dot');
  if (!img || !count) return;
  img.src = appealSlides[appealSlideIndex];
  img.alt = `องค์ความรู้ด้านการอุทธรณ์ หน้า ${appealSlideIndex + 1}`;
  count.textContent = `${appealSlideIndex + 1} / ${appealSlides.length}`;
  if (progress) progress.style.width = `${((appealSlideIndex + 1) / appealSlides.length) * 100}%`;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === appealSlideIndex));
}

function changeAppealSlide(step) {
  appealSlideIndex = (appealSlideIndex + step + appealSlides.length) % appealSlides.length;
  renderAppealSlide();
}

function goAppealSlide(index) {
  appealSlideIndex = index;
  renderAppealSlide();
}

(function initAppealSlides() {
  const toggle = document.getElementById('appealToggle');
  const guide = document.getElementById('appealGuide');
  const dots = document.getElementById('appealSlideDots');
  const viewer = document.getElementById('appealSlideViewer');
  if (!toggle || !guide || !dots || !viewer) return;
  dots.innerHTML = appealSlides.map((_, i) =>
    `<button class="slide-dot appeal-slide-dot${i === 0 ? ' active' : ''}" type="button" onclick="goAppealSlide(${i})" aria-label="ไปหน้าที่ ${i + 1}"></button>`
  ).join('');
  renderAppealSlide();
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    guide.hidden = isOpen;
    if (!isOpen) guide.scrollIntoView({ behavior:'smooth', block:'nearest' });
  });
  let startX = 0;
  viewer.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive:true });
  viewer.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) changeAppealSlide(dx < 0 ? 1 : -1);
  }, { passive:true });
})();

function syncSupplyKeyboardDir() {
  const activeKey = supplyKeyboardStack[supplyKeyboardStack.length - 1];
  if (!activeKey) {
    holdSupplyDir(0);
    return;
  }
  holdSupplyDir(getSupplyKeyDir(activeKey));
}

function pressSupplyKey(key) {
  if (!getSupplyKeyDir(key)) return;
  const existing = supplyKeyboardStack.indexOf(key);
  if (existing !== -1) supplyKeyboardStack.splice(existing, 1);
  supplyKeyboardStack.push(key);
  syncSupplyKeyboardDir();
}

function releaseSupplyKey(key) {
  const existing = supplyKeyboardStack.indexOf(key);
  if (existing === -1) return;
  supplyKeyboardStack.splice(existing, 1);
  syncSupplyKeyboardDir();
}

function clearSupplyKeyboard() {
  supplyKeyboardStack.length = 0;
  syncSupplyKeyboardDir();
}

function setSupplyMessage(title, body, button = 'เริ่มเกม') {
  const msg = document.getElementById('supplyMessage');
  if (!msg) return;
  msg.innerHTML = `<strong>${title}</strong><span>${body}</span><button class="game-start" type="button" onclick="startSupplyGame()">${button}</button>`;
  msg.style.display = 'flex';
}

function holdSupplyDir(dir) {
  supplyGame.dir = dir;
}

function setSupplyXFromPoint(clientX) {
  const stage = document.getElementById('supplyGame');
  const basket = document.getElementById('supplyBasket');
  if (!stage || !basket) return;
  const rect = stage.getBoundingClientRect();
  const basketWidth = basket.offsetWidth || 92;
  const edgePad = (basketWidth / rect.width) * 50;
  const percent = ((clientX - rect.left) / rect.width) * 100;
  supplyGame.x = Math.max(edgePad, Math.min(100 - edgePad, percent));
  basket.style.left = `${supplyGame.x}%`;
}

function startSupplyGame() {
  const stage = document.getElementById('supplyGame');
  const msg = document.getElementById('supplyMessage');
  if (!stage || !msg) return;
  stage.focus();
  supplyGame.running = true;
  supplyGame.score = 0;
  supplyGame.time = 45;
  supplyGame.x = 50;
  clearSupplyKeyboard();
  supplyGame.touchActive = false;
  supplyGame.items.forEach(item => item.el.remove());
  supplyGame.items = [];
  supplyGame.lastSpawn = 0;
  supplyGame.lastTick = performance.now();
  document.getElementById('supplyScore').textContent = '0';
  document.getElementById('supplyTime').textContent = '45';
  msg.style.display = 'none';
  clearInterval(supplyGame.timer);
  supplyGame.timer = setInterval(() => {
    if (!supplyGame.running) return;
    supplyGame.time -= 1;
    document.getElementById('supplyTime').textContent = supplyGame.time;
    if (supplyGame.time <= 0) endSupplyGame();
  }, 1000);
  cancelAnimationFrame(supplyGame.raf);
  supplyGame.raf = requestAnimationFrame(updateSupplyGame);
}

function spawnSupplyItem(stage) {
  const good = Math.random() > 0.24;
  const el = document.createElement('div');
  el.className = `fall-item ${good ? 'fall-good' : 'fall-bad'}`;
  el.textContent = good ? '✓' : '!';
  const maxX = Math.max(0, stage.clientWidth - 46);
  const item = {
    el,
    good,
    x: Math.random() * maxX,
    y: -55,
    speed: 120 + Math.random() * 95 + Math.max(0, 45 - supplyGame.time) * 2
  };
  el.style.transform = `translate(${item.x}px, ${item.y}px)`;
  stage.appendChild(el);
  supplyGame.items.push(item);
}

function updateSupplyGame(now) {
  if (!supplyGame.running) return;
  const stage = document.getElementById('supplyGame');
  const basket = document.getElementById('supplyBasket');
  if (!stage || !basket) return;
  const dt = Math.min(0.032, (now - supplyGame.lastTick) / 1000 || 0);
  supplyGame.lastTick = now;

  if (!supplyGame.touchActive) {
    supplyGame.x = Math.max(7, Math.min(93, supplyGame.x + supplyGame.dir * dt * 58));
  }
  basket.style.left = `${supplyGame.x}%`;

  if (now - supplyGame.lastSpawn > 720) {
    spawnSupplyItem(stage);
    supplyGame.lastSpawn = now;
  }

  const basketBox = basket.getBoundingClientRect();
  supplyGame.items = supplyGame.items.filter(item => {
    item.y += item.speed * dt;
    item.el.style.transform = `translate(${item.x}px, ${item.y}px)`;
    const box = item.el.getBoundingClientRect();
    const hit = box.left < basketBox.right && box.right > basketBox.left && box.bottom > basketBox.top && box.top < basketBox.bottom;
    if (hit) {
      supplyGame.score += item.good ? 10 : -15;
      document.getElementById('supplyScore').textContent = supplyGame.score;
      item.el.remove();
      return false;
    }
    if (item.y > stage.clientHeight + 60) {
      if (item.good) {
        supplyGame.score -= 5;
        document.getElementById('supplyScore').textContent = supplyGame.score;
      }
      item.el.remove();
      return false;
    }
    return true;
  });

  supplyGame.raf = requestAnimationFrame(updateSupplyGame);
}

function endSupplyGame() {
  supplyGame.running = false;
  clearInterval(supplyGame.timer);
  cancelAnimationFrame(supplyGame.raf);
  supplyGame.items.forEach(item => item.el.remove());
  supplyGame.items = [];
  const verdict = supplyGame.score >= 180 ? 'มือไวมาก' : supplyGame.score >= 90 ? 'ผ่านงานพัสดุวันนี้' : 'พักอีกตา';
  setSupplyMessage(verdict, `คะแนนรวม ${supplyGame.score} แต้ม`, 'เล่นอีกครั้ง');
}

document.addEventListener('keydown', e => {
  pressSupplyKey(e.key);
  const active = document.activeElement;
  const gameFocused = active && (active.id === 'supplyGame' || active.closest?.('.game-wrap'));
  if (e.code === 'Space' && gameFocused) {
    e.preventDefault();
    if (!supplyGame.running) startSupplyGame();
  }
});
document.addEventListener('keyup', e => {
  releaseSupplyKey(e.key);
});
window.addEventListener('blur', clearSupplyKeyboard);

(function initSupplyTouchControls() {
  const stage = document.getElementById('supplyGame');
  const controls = document.querySelector('.game-mobile-controls');
  if (!stage) return;

  stage.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse') return;
    e.preventDefault();
    stage.focus();
    supplyGame.touchActive = true;
    holdSupplyDir(0);
    setSupplyXFromPoint(e.clientX);
    stage.setPointerCapture?.(e.pointerId);
  });

  stage.addEventListener('pointermove', e => {
    if (!supplyGame.touchActive || e.pointerType === 'mouse') return;
    e.preventDefault();
    setSupplyXFromPoint(e.clientX);
  });

  function releasePointer(e) {
    if (e.pointerType === 'mouse') return;
    supplyGame.touchActive = false;
    stage.releasePointerCapture?.(e.pointerId);
  }

  stage.addEventListener('pointerup', releasePointer);
  stage.addEventListener('pointercancel', releasePointer);

  controls?.querySelectorAll('button').forEach(button => {
    button.addEventListener('contextmenu', e => e.preventDefault());
  });
})();

const music     = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');
const musicBtn  = document.getElementById('musicBtn');
const playlist  = ['1.mp3','2.mp3','3.mp3','4.mp3','5.mp3','6.mp3',
                   '7.mp3','8.mp3','9.mp3','10.mp3','11.mp3','12.mp3'];
let cur = -1;

function rnd(){ let i; do{ i=Math.floor(Math.random()*playlist.length); }while(i===cur); return i; }
function load(i){ music.src = playlist[i]+'?v='+Math.random(); music.load(); }

cur = rnd(); load(cur);

function setOn(on){
  musicIcon.textContent = on ? '⏸️' : '🎵';
  on ? musicBtn.classList.add('on') : musicBtn.classList.remove('on');
}
function toggleMusic(){ music.paused ? music.play().then(()=>setOn(true)).catch(()=>nextSong()) : (music.pause(), setOn(false)); }
function nextSong(){ cur=rnd(); load(cur); music.play().then(()=>setOn(true)).catch(()=>{}); }
music.onended = nextSong;

Object.assign(window, {
  changeBasicSlide,
  goBasicSlide,
  holdSupplyDir,
  startSupplyGame,
  toggleMusic,
  nextSong
});
