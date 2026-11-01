/* === pr2-core.js === */
/* Core Navigation, Step Indicator, Quizzes, High-DPI Canvas Setup */

// Achievements tracking
const unlockedStars = new Set();
function unlockStar(expNum) {
  if (!unlockedStars.has(expNum)) {
    unlockedStars.add(expNum);
  }
}

// Mini-quiz validation
function checkQuiz(btn, isCorrect, expNum) {
  const container = btn.closest(".quiz-options");
  if (btn.classList.contains("correct") || btn.classList.contains("wrong")) return;
  if (container && container.querySelector(".quiz-btn.correct")) return;

  if (!btn.dataset.original) {
    btn.dataset.original = btn.innerHTML.trim();
  }

  if (isCorrect) {
    btn.classList.remove("wrong");
    btn.classList.add("correct");
    btn.innerHTML = btn.dataset.original + " ✅";
    if (container) {
      container.querySelectorAll(".quiz-btn").forEach(b => {
        if (b !== btn) {
          b.style.pointerEvents = "none";
          b.style.opacity = "0.45";
        }
      });
    }
    unlockStar(expNum);
  } else {
    btn.classList.add("wrong");
    btn.innerHTML = btn.dataset.original + " ❌";
    btn.style.pointerEvents = "none";
  }
}

// Navigation & Tabs
const tabs = ["tab-intro", "tab-exp1", "tab-exp2", "tab-exp3", "tab-exp4", "tab-exp5", "tab-summary"];
let currentTabIndex = 0;

function goToTab(tabId) {
  const idx = tabs.indexOf(tabId);
  if (idx !== -1) currentTabIndex = idx;

  // Update contents
  document.querySelectorAll(".tab-content").forEach(content => {
    content.classList.toggle("active", content.id === tabId);
  });

  // Update bottom indicator
  document.getElementById("currentStepIndicator").textContent = `Крок ${currentTabIndex + 1} з ${tabs.length}`;
  document.getElementById("btnPrevTab").style.visibility = currentTabIndex === 0 ? "hidden" : "visible";
  document.getElementById("btnNextTab").style.visibility = currentTabIndex === tabs.length - 1 ? "hidden" : "visible";
  document.getElementById("btnNextTab").textContent = "Наступна ➡️";

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Redraw canvases with proper sizes
  requestAnimationFrame(() => {
    if (tabId === "tab-exp1" && typeof drawExp1 === "function") drawExp1();
    if (tabId === "tab-exp2" && typeof initExp2 === "function") initExp2();
    if (tabId === "tab-exp3" && typeof initExp3 === "function") initExp3();
    if (tabId === "tab-exp4" && typeof drawExp4 === "function") drawExp4();
    if (tabId === "tab-exp5" && typeof drawExp5 === "function") drawExp5();
  });
}

function navStep(direction) {
  const nextIndex = currentTabIndex + direction;
  if (nextIndex >= 0 && nextIndex < tabs.length) {
    goToTab(tabs[nextIndex]);
  }
}

// Equipment checklist dummy handler
function toggleEquip(item) {}

/* HELPER: High-DPI Canvas Setup */
function getContextScaled(canvas, defaultH = 205) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const cssW = rect.width > 50 ? rect.width : (window.innerWidth < 500 ? window.innerWidth - 10 : 580);
  const cssH = rect.height > 50 ? rect.height : defaultH;
  if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  return { ctx, w: cssW, h: cssH };
}

// Window resize & load handlers
window.addEventListener("resize", () => {
  if (typeof drawExp1 === "function") drawExp1();
  if (typeof drawExp2 === "function") drawExp2();
  if (typeof drawExp3 === "function") drawExp3();
  if (typeof drawExp4 === "function") drawExp4();
  if (typeof drawExp5 === "function") drawExp5();
});

window.addEventListener("load", () => {
  if (typeof drawExp1 === "function") drawExp1();
  if (typeof initExp2 === "function") initExp2();
  if (typeof initExp3 === "function") initExp3();
  if (typeof drawExp4 === "function") drawExp4();
  if (typeof drawExp5 === "function") drawExp5();
});


/* === pr2-modals.js === */
/* Modals: Notebook scans and video */
const scanModal = document.getElementById("scanModal");
const modalScanImg = document.getElementById("modalScanImg");
const btnScanModal = document.getElementById("btnScanModal");
if (btnScanModal) {
  btnScanModal.addEventListener("click", () => {
    scanModal.classList.add("open");
  });
}
function closeScanModal() {
  if (scanModal) scanModal.classList.remove("open");
}
function showScanPage(pg) {
  if (modalScanImg) modalScanImg.src = pg === 17 ? "page_17.jpg" : "page_18.jpg";
}

const videoModal = document.getElementById("videoModal");
const videoPlayer = document.getElementById("videoPlayer");
const btnVideoModal = document.getElementById("btnVideoModal");
if (btnVideoModal) {
  btnVideoModal.addEventListener("click", () => {
    videoModal.classList.add("open");
  });
}
function closeVideoModal() {
  if (videoModal) videoModal.classList.remove("open");
  if (videoPlayer) videoPlayer.pause();
}


/* === pr2-exp1.js === */
    /* =========================================================================
       EXPERIMENT 1: СПИРТ vs ВОДА (CANVAS VISUALIZATION)
       ========================================================================= */
    const canvas1 = document.getElementById('canvasExp1');
    let exp1State = {
      wetted: false,
      microscope: false,
      waterWetness: 0,
      alcoholWetness: 0,
      particles: [],
      droplets: []
    };

    function drawExp1() {
      const { ctx, w, h } = getContextScaled(canvas1, 230);
      ctx.clearRect(0, 0, w, h);

      // Background Lab Table
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#f8fafc');
      grad.addColorStop(1, '#f1f5f9');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      if (exp1State.microscope) {
        drawExp1Microscope(ctx, w, h);
        return;
      }

      const p1x = w * 0.28;
      const p2x = w * 0.72;
      const py = h * 0.62;

      // 1. Draw Lab Plates with soft shadows
      [p1x, p2x].forEach((px, i) => {
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.06)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 4;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(px, py, 75, 28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner plate rim
        ctx.beginPath();
        ctx.ellipse(px, py, 60, 20, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#e2e8f0';
        ctx.stroke();
      });

      // 2. Fabric Swatches
      const fw = 70;
      const fh = 42;
      const fy = py - 20;

      // Cloth 1: Water
      const fx1 = p1x - fw/2;
      let wBg = '#f8fafc';
      let wBorder = '#cbd5e1';
      if (exp1State.wetted) {
        wBg = exp1State.waterWetness > 0.4 ? '#bae6fd' : '#e0f2fe';
        wBorder = '#38bdf8';
      }
      ctx.fillStyle = wBg;
      ctx.fillRect(fx1, fy, fw, fh);
      ctx.strokeStyle = wBorder;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(fx1, fy, fw, fh);

      // Weave pattern
      ctx.strokeStyle = exp1State.wetted && exp1State.waterWetness > 0.4 ? '#7dd3fc' : '#e2e8f0';
      ctx.lineWidth = 1;
      for (let x = fx1 + 8; x < fx1 + fw; x += 10) {
        ctx.beginPath(); ctx.moveTo(x, fy); ctx.lineTo(x, fy + fh); ctx.stroke();
      }

      // Cloth 2: Alcohol
      const fx2 = p2x - fw/2;
      let aBg = '#f8fafc';
      let aBorder = '#cbd5e1';
      if (exp1State.wetted) {
        aBg = exp1State.alcoholWetness > 0.1 ? '#f5d0fe' : '#ffffff';
        aBorder = exp1State.alcoholWetness > 0.1 ? '#c084fc' : '#cbd5e1';
      }
      ctx.fillStyle = aBg;
      ctx.fillRect(fx2, fy, fw, fh);
      ctx.strokeStyle = aBorder;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(fx2, fy, fw, fh);

      ctx.strokeStyle = exp1State.wetted && exp1State.alcoholWetness > 0.1 ? '#e879f9' : '#e2e8f0';
      for (let x = fx2 + 8; x < fx2 + fw; x += 10) {
        ctx.beginPath(); ctx.moveTo(x, fy); ctx.lineTo(x, fy + fh); ctx.stroke();
      }

      // 3. Titles & Badges
      ctx.textAlign = 'center';
      ctx.font = 'bold 13px system-ui';
      ctx.fillStyle = '#0369a1';
      ctx.fillText('💧 Тарілка 1: ВОДА', p1x, 26);
      ctx.font = '11px system-ui';
      ctx.fillStyle = '#64748b';
      ctx.fillText('(Густина й молекули H₂O)', p1x, 40);

      ctx.font = 'bold 13px system-ui';
      ctx.fillStyle = '#86198f';
      ctx.fillText('🧪 Тарілка 2: СПИРТ', p2x, 26);
      ctx.font = '11px system-ui';
      ctx.fillStyle = '#64748b';
      ctx.fillText('(Леткі молекули спирту)', p2x, 40);

      // 4. Moisture Meters (Mini-Bars)
      drawMoistureBar(ctx, p1x, py + 36, exp1State.waterWetness, '#0284c7', 'Вода');
      drawMoistureBar(ctx, p2x, py + 36, exp1State.alcoholWetness, '#9333ea', 'Спирт');

      // 5. Draw falling droplets
      exp1State.droplets.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.fill();
        d.y += 6;
      });
      exp1State.droplets = exp1State.droplets.filter(d => d.y < py - 10);

      // 6. Draw vapor molecules flying
      exp1State.particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        p.y -= p.speed;
        p.x += Math.sin(p.y * 0.08) * 0.8;
        p.alpha -= 0.015;
      });
      exp1State.particles = exp1State.particles.filter(p => p.alpha > 0);

      if (exp1State.particles.length > 0 || exp1State.droplets.length > 0) {
        requestAnimationFrame(drawExp1);
      }
    }

    function drawMoistureBar(ctx, x, y, val, color, label) {
      const bw = 90;
      const bh = 10;
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.roundRect(x - bw/2, y, bw, bh, 5);
      ctx.fill();

      if (val > 0) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x - bw/2, y, bw * val, bh, 5);
        ctx.fill();
      }

      ctx.font = 'bold 11px system-ui';
      ctx.fillStyle = '#334155';
      const pct = Math.round(val * 100);
      let desc = pct === 0 ? '✨ СУХИЙ (0%)' : (pct >= 90 ? '💦 Мокрий (100%)' : `💧 Вологий (${pct}%)`);
      ctx.fillText(desc, x, y + 24);
    }

    function drawExp1Microscope(ctx, w, h) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      const m1x = w * 0.28;
      const m2x = w * 0.72;
      const my = h * 0.52;
      const r = 58;

      // Circle 1: Water
      ctx.beginPath();
      ctx.arc(m1x, my, r, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Circle 2: Alcohol
      ctx.beginPath();
      ctx.arc(m2x, my, r, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#c084fc';
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.font = 'bold 12px system-ui';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('МОЛЕКУЛИ ВОДИ (H₂O)', m1x, 26);
      ctx.font = '10px system-ui';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Міцні водневі зв\'язки (тримаються купи)', m1x, 40);

      ctx.font = 'bold 12px system-ui';
      ctx.fillStyle = '#c084fc';
      ctx.fillText('МОЛЕКУЛИ СПИРТУ', m2x, 26);
      ctx.font = '10px system-ui';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Слабкі сили (легко вилітають у повітря)', m2x, 40);

      // Animate molecules inside
      const t = Date.now() * 0.003;
      // Water: tight cluster
      for (let i = 0; i < 9; i++) {
        const ang = (i / 9) * Math.PI * 2 + t * 0.3;
        const dist = 24 + Math.sin(t + i) * 6;
        const mx = m1x + Math.cos(ang) * dist;
        const my_ = my + Math.sin(ang) * dist;
        ctx.beginPath();
        ctx.arc(mx, my_, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
      }

      // Alcohol: flying freely outward
      for (let i = 0; i < 9; i++) {
        const ang = (i / 9) * Math.PI * 2 + t * 1.2;
        const dist = (i * 6 + t * 25) % (r - 10);
        const mx = m2x + Math.cos(ang) * dist;
        const my_ = my + Math.sin(ang) * dist;
        ctx.beginPath();
        ctx.arc(mx, my_, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#e879f9';
        ctx.fill();
      }

      ctx.font = '11px system-ui';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText('Натисніть «Погляд на молекули», щоб повернутися до тарілок', w/2, h - 12);

      if (exp1State.microscope) {
        requestAnimationFrame(drawExp1);
      }
    }

    function wetCloths() {
      exp1State.wetted = true;
      exp1State.waterWetness = 1.0;
      exp1State.alcoholWetness = 1.0;
      document.getElementById('clothStatus').innerHTML = '💧 <strong>Клаптики змочено!</strong> Спирт уже починає летіти у повітря швидше за воду.';

      // Drop droplets
      for (let i = 0; i < 8; i++) {
        exp1State.droplets.push({ x: canvas1.width * 0.14 + (Math.random() - 0.5) * 40, y: 30 + i * 8, color: '#38bdf8' });
        exp1State.droplets.push({ x: canvas1.width * 0.36 + (Math.random() - 0.5) * 40, y: 30 + i * 8, color: '#c084fc' });
      }

      // Spawn initial vapor
      for (let i = 0; i < 35; i++) {
        exp1State.particles.push({
          x: canvas1.width * 0.36 + (Math.random() - 0.5) * 50,
          y: 130,
          speed: 1.5 + Math.random() * 2,
          r: 2.5,
          color: '#c084fc',
          alpha: 0.9
        });
      }
      drawExp1();
    }

    function pass15MinExp1() {
      if (!exp1State.wetted) wetCloths();
      exp1State.waterWetness = 0.65; // Still very wet
      exp1State.alcoholWetness = 0.0;  // Completely dry!
      unlockStar(1);
      document.getElementById('clothStatus').innerHTML = '⏱️ <strong>Минуло 15 хв:</strong> Спирт висох на 100%! Вода все ще волога (65%).';

      // Big burst of evaporating alcohol
      for (let i = 0; i < 60; i++) {
        exp1State.particles.push({
          x: canvas1.width * 0.36 + (Math.random() - 0.5) * 60,
          y: 130,
          speed: 2 + Math.random() * 2.5,
          r: 3,
          color: '#e879f9',
          alpha: 0.95
        });
      }
      drawExp1();
    }

    function toggleMicroscopeExp1() {
      exp1State.microscope = !exp1State.microscope;
      document.getElementById('btnMicroscopeExp1').textContent = exp1State.microscope ? '🍽️ Звичайний вигляд' : '🔬 Погляд на молекули';
      drawExp1();
    }

    function resetExp1() {
      exp1State = { wetted: false, microscope: false, waterWetness: 0, alcoholWetness: 0, particles: [], droplets: [] };
      document.getElementById('btnMicroscopeExp1').textContent = '🔬 Погляд на молекули';
      document.getElementById('clothStatus').textContent = 'Натисніть «Змочити клаптики», щоб розпочати дослід!';
      drawExp1();
    }


/* === pr2-exp2.js === */
    /* =========================================================================
       EXPERIMENT 2: МАНДАРИН (CLASSROOM DIFFUSION)
       ========================================================================= */
    const canvas2 = document.getElementById('canvasExp2');
    let exp2State = {
      peeled: false,
      temp: 22,
      particles: [],
      airMolecules: [],
      animId: null
    };

    function initExp2() {
      if (exp2State.airMolecules.length === 0) {
        for (let i = 0; i < 40; i++) {
          exp2State.airMolecules.push({
            x: Math.random() * 550,
            y: Math.random() * 200,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6
          });
        }
      }
      drawExp2();
    }

    function drawExp2() {
      const { ctx, w, h } = getContextScaled(canvas2, 240);
      ctx.clearRect(0, 0, w, h);

      // Classroom Floor
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, w, h);

      // Student desks in rows
      const rows = [
        { label: 'Парта 1 (1.5 м)', y: 80, student: '👧 Оля', time: '3 сек' },
        { label: 'Парта 2 (4.0 м)', y: 140, student: '👦 Тарас', time: '8 сек' },
        { label: 'Парта 3 (7.0 м)', y: 195, student: '🧒 Артем', time: '16 сек' }
      ];

      // Teacher Desk (Left)
      const tx = w * 0.16;
      const ty = h * 0.5;

      // Draw Teacher Desk
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.roundRect(tx - 40, ty - 35, 80, 70, 10);
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.font = 'bold 11px system-ui';
      ctx.fillStyle = '#475569';
      ctx.fillText('Стіл вчителя', tx, ty - 18);

      // Mandarin icon
      ctx.font = '28px system-ui';
      ctx.fillText(exp2State.peeled ? '🍊' : '🟠', tx, ty + 16);

      // Background air molecules (nitrogen/oxygen)
      ctx.fillStyle = '#cbd5e1';
      const speedFactor = (exp2State.temp / 20);
      exp2State.airMolecules.forEach(m => {
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2, 0, Math.PI * 2);
        ctx.fill();
        m.x += m.vx * speedFactor;
        m.y += m.vy * speedFactor;
        if (m.x < 10 || m.x > w - 10) m.vx *= -1;
        if (m.y < 10 || m.y > h - 10) m.vy *= -1;
      });

      // Draw student desks
      const dx = w * 0.72;
      rows.forEach((r, idx) => {
        // Count nearby orange particles
        let nearCount = exp2State.particles.filter(p => Math.abs(p.y - r.y) < 28 && p.x > dx - 85).length;
        const reached = nearCount >= 6;

        ctx.fillStyle = reached ? '#ecfdf5' : '#ffffff';
        ctx.beginPath();
        ctx.roundRect(dx - 80, r.y - 18, 160, 36, 10);
        ctx.fill();
        ctx.strokeStyle = reached ? '#10b981' : '#cbd5e1';
        ctx.lineWidth = reached ? 2 : 1;
        ctx.stroke();

        ctx.font = reached ? 'bold 12px system-ui' : '11px system-ui';
        ctx.fillStyle = reached ? '#065f46' : '#334155';
        ctx.fillText(reached ? `👃 Відчули запах! (${r.student})` : `${r.student} • ${r.label}`, dx, r.y + 4);
      });

      // Draw aroma particles (diffusing orange spheres)
      exp2State.particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = '#f97316';
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        p.x += (p.vx + (Math.random() - 0.47) * 2.2) * speedFactor;
        p.y += (p.vy + (Math.random() - 0.5) * 2.2) * speedFactor;

        if (p.x < 5 || p.x > w - 5) p.vx *= -1;
        if (p.y < 5 || p.y > h - 5) p.vy *= -1;
      });

      if (exp2State.peeled && exp2State.particles.length < 220) {
        exp2State.particles.push({
          x: tx + 10,
          y: ty + 5 + (Math.random() - 0.5) * 15,
          vx: 1.0 + Math.random() * 2.0,
          vy: (Math.random() - 0.5) * 2.0,
          size: 2.5 + Math.random() * 2.5,
          alpha: 0.8 + Math.random() * 0.2
        });
      }

      if (exp2State.peeled) {
        exp2State.animId = requestAnimationFrame(drawExp2);
      }
    }

    function peelMandarin() {
      exp2State.peeled = true;
      unlockStar(2);
      document.getElementById('mandarinStatus').innerHTML = '🍊 <strong>Мандарин очищено!</strong> Молекули ефірних олій дифундують у повітрі від столу до парт.';
      if (!exp2State.animId) drawExp2();
    }

    function updateRoomTemp(val) {
      exp2State.temp = parseInt(val, 10);
      document.getElementById('roomTempVal').textContent = val + '°C';
      if (exp2State.temp >= 30) {
        document.getElementById('mandarinStatus').innerHTML = `🔥 При <strong>${val}°C</strong> дифузія стрімка: гаряче повітря прискорює молекули запаху!`;
      } else if (exp2State.temp <= 14) {
        document.getElementById('mandarinStatus').innerHTML = `❄️ При <strong>${val}°C</strong> молекули рухаються повільніше, дифузія затримується.`;
      }
    }

    function resetExp2() {
      if (exp2State.animId) cancelAnimationFrame(exp2State.animId);
      exp2State.peeled = false;
      exp2State.particles = [];
      exp2State.animId = null;
      document.getElementById('mandarinStatus').textContent = 'Клас провітрено. Натисніть «Очистити мандарин», щоб розпочати знову.';
      drawExp2();
    }


/* === pr2-exp3.js === */
    /* =========================================================================
       EXPERIMENT 3: ЧАЙ (ДИФУЗІЯ В РІДИНАХ ЗА T°)
       ========================================================================= */
    const canvas3 = document.getElementById('canvasExp3');
    let exp3State = {
      teaDropped: false,
      microscope: false,
      hotParticles: [],
      coldParticles: [],
      animId: null
    };

    function initExp3() {
      drawExp3();
    }

    function drawExp3() {
      const { ctx, w, h } = getContextScaled(canvas3, 240);
      ctx.clearRect(0, 0, w, h);

      if (exp3State.microscope) {
        drawMicroscopeView(ctx, w, h);
        if (exp3State.teaDropped) {
          exp3State.animId = requestAnimationFrame(drawExp3);
        }
        return;
      }

      const b1x = w * 0.28;
      const b2x = w * 0.72;
      const bw = 96;
      const bh = 130;
      const by = 60;

      // 1. Draw Glass Beakers with nice liquid gradients
      // Beaker 1: Cold (15°C)
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.roundRect(b1x - bw/2, by, bw, bh, [0, 0, 12, 12]);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Beaker 2: Hot (85°C)
      ctx.fillStyle = '#fee2e2';
      ctx.beginPath();
      ctx.roundRect(b2x - bw/2, by, bw, bh, [0, 0, 12, 12]);
      ctx.fill();
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Titles
      ctx.textAlign = 'center';
      ctx.font = 'bold 13px system-ui';
      ctx.fillStyle = '#0369a1';
      ctx.fillText('❄️ ХОЛОДНА ВОДА (15°C)', b1x, 32);

      ctx.fillStyle = '#b91c1c';
      ctx.fillText('♨️ ГАРЯЧА ВОДА (85°C)', b2x, 32);

      // Steam over hot beaker
      if (exp3State.teaDropped) {
        drawBillowingSteam(ctx, b2x, by - 6);
      }

      // Tea Bags & Particles
      if (exp3State.teaDropped) {
        // Tea Bags
        drawTeaBag(ctx, b1x, by + 12);
        drawTeaBag(ctx, b2x, by + 12);

        // Cold particles: stay mostly sluggish at the bottom
        exp3State.coldParticles.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = '#b45309';
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          p.y += p.vy;
          p.x += (Math.random() - 0.5) * 0.4;
          if (p.y > by + bh - 6) p.y = by + bh - 6;
        });

        // Hot particles: move rapidly, swirling up and filling whole beaker
        exp3State.hotParticles.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = '#78350f';
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < b2x - bw/2 + 6 || p.x > b2x + bw/2 - 6) p.vx *= -1;
          if (p.y < by + 6 || p.y > by + bh - 6) p.vy *= -1;
        });
        ctx.globalAlpha = 1.0;

        // Bottom status under beakers
        ctx.font = 'bold 11px system-ui';
        ctx.fillStyle = '#0369a1';
        ctx.fillText('Повільна дифузія (вода світла)', b1x, by + bh + 24);
        ctx.fillStyle = '#991b1b';
        ctx.fillText('Швидка дифузія (темний чай)', b2x, by + bh + 24);
      } else {
        ctx.font = '12px system-ui';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Пакетик ще не опущено', b1x, by + bh/2);
        ctx.fillText('Пакетик ще не опущено', b2x, by + bh/2);
      }

      if (exp3State.teaDropped) {
        exp3State.animId = requestAnimationFrame(drawExp3);
      }
    }

    function drawTeaBag(ctx, x, y) {
      // string
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 22, y - 24);
      ctx.stroke();

      // tag
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x - 28, y - 32, 12, 10);

      // bag
      ctx.fillStyle = '#d97706';
      ctx.fillRect(x - 14, y, 28, 34);
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 14, y, 28, 34);
    }

    function drawBillowingSteam(ctx, x, y) {
      const now = Date.now() * 0.003;
      ctx.fillStyle = 'rgba(226, 232, 240, 0.5)';
      for (let i = 0; i < 3; i++) {
        const sx = x + Math.sin(now + i * 2) * 14;
        const sy = y - (now * 12 + i * 15) % 35;
        ctx.beginPath();
        ctx.arc(sx, sy, 7 + i * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawMicroscopeView(ctx, w, h) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      const m1x = w * 0.28;
      const m2x = w * 0.72;
      const my = h * 0.55;
      const mr = 60;

      // Circle lens 1: Cold
      ctx.beginPath();
      ctx.arc(m1x, my, mr, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Circle lens 2: Hot
      ctx.beginPath();
      ctx.arc(m2x, my, mr, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();
      ctx.strokeStyle = '#f87171';
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Холодна (повільні частинки)', m1x, 26);

      ctx.fillStyle = '#f87171';
      ctx.fillText('Гаряча (шалений швидкий рух!)', m2x, 26);

      // Draw active bouncing molecules inside circles
      const now = Date.now() * 0.005;
      for (let i = 0; i < 16; i++) {
        // Cold (slow drift)
        const a1 = (i / 16) * Math.PI * 2 + now * 0.25;
        const d1 = (mr - 14) * Math.abs(Math.sin(i * 3 + now * 0.15));
        ctx.beginPath();
        ctx.arc(m1x + Math.cos(a1) * d1, my + Math.sin(a1) * d1, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#93c5fd';
        ctx.fill();

        // Hot (super fast bounce)
        const a2 = (i / 16) * Math.PI * 2 + now * 2.0;
        const d2 = (mr - 12) * Math.abs(Math.sin(i * 7 + now * 1.4));
        ctx.beginPath();
        ctx.arc(m2x + Math.cos(a2) * d2, my + Math.sin(a2) * d2, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fb923c';
        ctx.fill();
      }
    }

    function dropTeaBags() {
      exp3State.teaDropped = true;
      unlockStar(3);
      document.getElementById('teaStatus').innerHTML = '🍵 <strong>Пакетики опущено!</strong> У гарячій воді заварка миттєво дифундує по всій склянці.';

      const b1x = canvas3.width * 0.14;
      const b2x = canvas3.width * 0.36;
      const by = 60;

      exp3State.coldParticles = [];
      exp3State.hotParticles = [];

      for (let i = 0; i < 70; i++) {
        exp3State.coldParticles.push({
          x: b1x + (Math.random() - 0.5) * 25,
          y: by + 45 + Math.random() * 20,
          vy: 0.25 + Math.random() * 0.45,
          r: 2.5,
          alpha: 0.75
        });
      }

      for (let i = 0; i < 150; i++) {
        exp3State.hotParticles.push({
          x: b2x + (Math.random() - 0.5) * 35,
          y: by + 30 + Math.random() * 40,
          vx: (Math.random() - 0.5) * 3.8,
          vy: (Math.random() - 0.5) * 3.8,
          r: 3.0,
          alpha: 0.85
        });
      }

      drawExp3();
    }

    function toggleMicroscope() {
      exp3State.microscope = !exp3State.microscope;
      document.getElementById('btnMicroscope').textContent = exp3State.microscope ? '🥛 Звичайний вигляд' : '🔬 Мікроскоп частинок';
      drawExp3();
    }

    function resetExp3() {
      if (exp3State.animId) cancelAnimationFrame(exp3State.animId);
      exp3State.teaDropped = false;
      exp3State.microscope = false;
      exp3State.hotParticles = [];
      exp3State.coldParticles = [];
      exp3State.animId = null;
      document.getElementById('btnMicroscope').textContent = '🔬 Мікроскоп частинок';
      document.getElementById('teaStatus').textContent = 'Опусти чайні пакетики, щоб побачити забарвлення води!';
      drawExp3();
    }


/* === pr2-exp4.js === */
    /* =========================================================================
       EXPERIMENT 4: ПОСУДИНИ ТА ПЛОЩА ПОВЕРХНІ
       ========================================================================= */
    const canvas4 = document.getElementById('canvasExp4');
    let exp4State = {
      poured: false,
      after15m: false,
      tPetri: 20,
      tBeaker: 20,
      tFlask: 20
    };

    function drawExp4() {
      const { ctx, w, h } = getContextScaled(canvas4, 240);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, w, h);

      const v1x = w * 0.2;
      const v2x = w * 0.5;
      const v3x = w * 0.8;
      const baseY = 170;

      // 1. Petri Dish (Wide)
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.ellipse(v1x, baseY, 52, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 2. Beaker
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.roundRect(v2x - 28, baseY - 55, 56, 55, [0, 0, 6, 6]);
      ctx.fill();
      ctx.stroke();

      // 3. Flask (Erlenmeyer)
      ctx.beginPath();
      ctx.moveTo(v3x - 12, baseY - 70);
      ctx.lineTo(v3x + 12, baseY - 70);
      ctx.lineTo(v3x + 12, baseY - 48);
      ctx.lineTo(v3x + 36, baseY);
      ctx.lineTo(v3x - 36, baseY);
      ctx.lineTo(v3x - 12, baseY - 48);
      ctx.closePath();
      ctx.fillStyle = '#e2e8f0';
      ctx.fill();
      ctx.stroke();

      // Water inside vessels
      if (exp4State.poured) {
        // Water in Petri
        ctx.fillStyle = exp4State.after15m ? '#bae6fd' : '#f87171';
        ctx.beginPath();
        ctx.ellipse(v1x, baseY - 2, 48, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Water in Beaker
        ctx.fillStyle = exp4State.after15m ? '#fde68a' : '#f87171';
        ctx.fillRect(v2x - 26, baseY - 38, 52, 36);

        // Water in Flask
        ctx.fillStyle = exp4State.after15m ? '#fca5a5' : '#f87171';
        ctx.beginPath();
        ctx.moveTo(v3x - 25, baseY - 32);
        ctx.lineTo(v3x + 25, baseY - 32);
        ctx.lineTo(v3x + 34, baseY - 2);
        ctx.lineTo(v3x - 34, baseY - 2);
        ctx.closePath();
        ctx.fill();

        // Steam plumes
        if (!exp4State.after15m) {
          drawSteamPlume(ctx, v1x, baseY - 20, 8); // huge steam from wide surface!
          drawSteamPlume(ctx, v2x, baseY - 60, 4); // medium steam
          drawSteamPlume(ctx, v3x, baseY - 75, 1); // tiny steam from narrow neck
        }
      }

      // Titles & Temperatures
      ctx.textAlign = 'center';
      ctx.font = 'bold 12px system-ui';

      // 1. Petri
      ctx.fillStyle = '#0f172a';
      ctx.fillText('🥣 Чашка Петрі', v1x, 26);
      ctx.font = '10px system-ui';
      ctx.fillStyle = '#0369a1';
      ctx.fillText('Широка (S = 78 см²)', v1x, 40);
      drawTempBadge(ctx, v1x, baseY + 26, exp4State.tPetri, exp4State.poured);

      // 2. Beaker
      ctx.font = 'bold 12px system-ui';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('🥛 Хім. склянка', v2x, 26);
      ctx.font = '10px system-ui';
      ctx.fillStyle = '#0369a1';
      ctx.fillText('Середня (S = 20 см²)', v2x, 40);
      drawTempBadge(ctx, v2x, baseY + 26, exp4State.tBeaker, exp4State.poured);

      // 3. Flask
      ctx.font = 'bold 12px system-ui';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('🧪 Колба', v3x, 26);
      ctx.font = '10px system-ui';
      ctx.fillStyle = '#0369a1';
      ctx.fillText('Вузьке горло (S = 3 см²)', v3x, 40);
      drawTempBadge(ctx, v3x, baseY + 26, exp4State.tFlask, exp4State.poured);
    }

    function drawTempBadge(ctx, x, y, temp, poured) {
      if (!poured) {
        ctx.font = 'bold 13px system-ui';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('-- °C', x, y);
        return;
      }
      ctx.save();
      const col = temp > 50 ? '#dc2626' : (temp > 35 ? '#d97706' : '#0284c7');
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.roundRect(x - 30, y - 14, 60, 22, 6);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px system-ui';
      ctx.fillText(`${temp} °C`, x, y + 2);
      ctx.restore();
    }

    function drawSteamPlume(ctx, x, y, density) {
      ctx.fillStyle = 'rgba(203, 213, 225, 0.7)';
      for (let i = 0; i < density; i++) {
        const offX = (i - density/2) * 10;
        ctx.beginPath();
        ctx.arc(x + offX, y - 8 - Math.random() * 8, 8 + Math.random() * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function pourHotWaterExp4() {
      exp4State.poured = true;
      exp4State.after15m = false;
      exp4State.tPetri = 80;
      exp4State.tBeaker = 80;
      exp4State.tFlask = 80;
      document.getElementById('vesselStatus').innerHTML = '♨️ Гарячу воду 80°C налито. Спостерігай, як інтенсивно пара летить із широкої поверхні!';
      drawExp4();
    }

    function wait15mExp4() {
      if (!exp4State.poured) pourHotWaterExp4();
      exp4State.after15m = true;
      exp4State.tPetri = 28; // Cools rapidly!
      exp4State.tBeaker = 44; // Moderate
      exp4State.tFlask = 58; // Stays hot!
      unlockStar(4);
      document.getElementById('vesselStatus').innerHTML = '⏳ <strong>Минуло 15 хв:</strong> Чашка Петрі охолола до 28°C (найшвидше!), а колба зберегла 58°C.';
      drawExp4();
    }

    function resetExp4() {
      exp4State = { poured: false, after15m: false, tPetri: 20, tBeaker: 20, tFlask: 20 };
      document.getElementById('vesselStatus').textContent = 'Натисни «Налити гарячу воду», щоб розпочати вимірювання!';
      drawExp4();
    }


/* === pr2-exp5.js === */
    /* =========================================================================
       EXPERIMENT 5: ПЛАСТИЛІН (ДИФУЗІЯ У ТВЕРДИХ ТІЛАХ)
       ========================================================================= */
    const canvas5 = document.getElementById('canvasExp5');
    let exp5State = {
      joined: false,
      separated: false,
      kneaded: false
    };

    function drawExp5() {
      const { ctx, w, h } = getContextScaled(canvas5, 240);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.48;

      ctx.textAlign = 'center';

      if (exp5State.kneaded) {
        // Blended green clay with playful marble swirls
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.12)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, 45, 0, Math.PI * 2);
        ctx.fillStyle = '#16a34a';
        ctx.fill();
        ctx.restore();

        // Swirl lines
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, 26, 0.2, Math.PI * 1.4);
        ctx.stroke();

        ctx.font = 'bold 13px system-ui';
        ctx.fillStyle = '#15803d';
        ctx.fillText('🟢 Розім\'ятий пластилін: кольори змішалися в ЗЕЛЕНИЙ!', cx, cy + 72);
        ctx.font = '11px system-ui';
        ctx.fillStyle = '#64748b';
        ctx.fillText('Механічний рух і тепло долонь подолали опір кристалічної ґратки!', cx, cy + 90);
      } else if (!exp5State.joined) {
        // Two separate blocks: Blue and Yellow with 3D bevels
        drawClayBlock(ctx, cx - 110, cy - 25, 65, 50, '#2563eb', '#1d4ed8');
        drawClayBlock(ctx, cx + 45, cy - 25, 65, 50, '#eab308', '#ca8a04');

        ctx.font = 'bold 12px system-ui';
        ctx.fillStyle = '#1d4ed8';
        ctx.fillText('🟦 Синій шматочок', cx - 78, cy + 48);
        ctx.fillStyle = '#ca8a04';
        ctx.fillText('🟨 Жовтий шматочок', cx + 78, cy + 48);
      } else if (exp5State.joined && !exp5State.separated) {
        // Stacked together
        drawClayBlock(ctx, cx - 55, cy - 42, 110, 40, '#2563eb', '#1d4ed8');
        drawClayBlock(ctx, cx - 55, cy - 2, 110, 40, '#eab308', '#ca8a04');

        // Sharp boundary line
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 55, cy - 1);
        ctx.lineTo(cx + 55, cy - 1);
        ctx.stroke();

        ctx.font = 'bold 12px system-ui';
        ctx.fillStyle = '#0f172a';
        ctx.fillText('⏳ З\'єднані разом (йде час 15 хв...)', cx, cy + 62);
      } else if (exp5State.separated) {
        // Separated: boundary clean!
        drawClayBlock(ctx, cx - 100, cy - 25, 65, 50, '#2563eb', '#1d4ed8');
        drawClayBlock(ctx, cx + 35, cy - 25, 65, 50, '#eab308', '#ca8a04');

        ctx.font = 'bold 13px system-ui';
        ctx.fillStyle = '#dc2626';
        ctx.fillText('🚫 Кольори не змішалися!', cx, cy + 54);
        ctx.font = '11px system-ui';
        ctx.fillStyle = '#64748b';
        ctx.fillText('У твердих тілах дифузія за кімнатної T° майже нульова.', cx, cy + 72);
      }
    }

    function drawClayBlock(ctx, x, y, w, h, fillCol, strokeCol) {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.08)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;
      ctx.fillStyle = fillCol;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 8);
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = strokeCol;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    function joinClay() {
      exp5State.joined = true;
      exp5State.separated = false;
      exp5State.kneaded = false;
      document.getElementById('clayStatus').innerHTML = '🤝 Шматочки пластиліну з\'єднано! Зачекайте 15 хвилин.';
      drawExp5();
    }

    function separateClay() {
      if (!exp5State.joined) joinClay();
      exp5State.separated = true;
      exp5State.kneaded = false;
      unlockStar(5);
      document.getElementById('clayStatus').innerHTML = '✂️ <strong>Роз\'єднано через 15 хв:</strong> Кольори не змішалися! Межа чітка.';
      drawExp5();
    }

    function kneadClay() {
      exp5State.kneaded = true;
      exp5State.joined = true;
      exp5State.separated = false;
      unlockStar(5);
      document.getElementById('clayStatus').innerHTML = '🔥 <strong>Розім\'яли пальцями:</strong> Тепло рук і механічне змішування дали зелений колір!';
      drawExp5();
    }