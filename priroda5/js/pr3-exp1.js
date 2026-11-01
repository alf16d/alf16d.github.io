/* Experiment 1: Solubility of citric acid, starch, salt, baking soda, flour */

const exp1Data = {
  citric: {
    name: "Лимонна кислота",
    color: "#ffffff",
    powderColor: "#f8fafc",
    solubilityType: "Добре розчинна",
    description: "Дрібні прозорі кристалики легко розчиняються. Розчин кришталево чистий і прозорий.",
    isSoluble: true,
    cloudy: false,
    particlesCount: 45
  },
  starch: {
    name: "Крохмаль",
    color: "#ffffff",
    powderColor: "#ffffff",
    solubilityType: "Практично нерозчинний у холодній воді",
    description: "Утворює білу каламутну завись (суспензію). З часом частинки осідають на дно склянки.",
    isSoluble: false,
    cloudy: true,
    particlesCount: 90
  },
  salt: {
    name: "Кухонна сіль (NaCl)",
    color: "#ffffff",
    powderColor: "#f1f5f9",
    solubilityType: "Добре розчинна",
    description: "Кристали солі швидко розпадаються на іони і розчиняються. Розчин однорідний і прозорий.",
    isSoluble: true,
    cloudy: false,
    particlesCount: 50
  },
  soda: {
    name: "Харчова сода",
    color: "#ffffff",
    powderColor: "#f8fafc",
    solubilityType: "Помірно (малорозчинна)",
    description: "Розчиняється повільніше за сіль. При ретельному перемішуванні невелика кількість розчиняється повністю.",
    isSoluble: "moderate",
    cloudy: false,
    particlesCount: 55
  },
  flour: {
    name: "Борошно",
    color: "#fef9c3",
    powderColor: "#fef08a",
    solubilityType: "Практично нерозчинне",
    description: "Частинки білка та крохмалю не розчиняються. Утворюється каламутна суспензія, що осідає на дно.",
    isSoluble: false,
    cloudy: true,
    particlesCount: 110
  }
};

let activeSubstanceKey = "citric";
let exp1State = "empty"; // 'empty', 'added', 'stirring', 'dissolved', 'settled'
let exp1StirAngle = 0;
let exp1Microscope = false;
let exp1Particles = [];
let exp1AnimId = null;

function setSubstance(key) {
  activeSubstanceKey = key;
  document.querySelectorAll(".substance-pill").forEach(p => {
    p.classList.toggle("active", p.dataset.substance === key);
  });
  resetExp1();
}

function initExp1Particles() {
  exp1Particles = [];
  const count = exp1Data[activeSubstanceKey].particlesCount;
  for (let i = 0; i < count; i++) {
    exp1Particles.push({
      x: 0.35 + Math.random() * 0.3,
      y: 0.45 + Math.random() * 0.4,
      vx: (Math.random() - 0.5) * 0.003,
      vy: (Math.random() - 0.5) * 0.003,
      size: 1.5 + Math.random() * 2.5,
      alpha: 1
    });
  }
}

function addSubstance() {
  if (exp1State === "stirring") return;
  exp1State = "added";
  initExp1Particles();
  // Place particles falling down or at the bottom
  exp1Particles.forEach(p => {
    p.y = 0.78 + Math.random() * 0.08;
    p.x = 0.32 + Math.random() * 0.36;
  });
  updateExp1Status(`У склянку з водою додано ложечку речовини: <strong>${exp1Data[activeSubstanceKey].name}</strong>. Порошок на дні. Натисніть «🥄 Перемішати паличкою»!`);
  drawExp1();
}

function stirExp1() {
  if (exp1State === "empty") {
    addSubstance();
  }
  exp1State = "stirring";
  updateExp1Status(`Ретельно перемішуємо розчин скляною паличкою... 🌀`);
  
  let frames = 0;
  const maxFrames = 90;
  
  function animStir() {
    frames++;
    exp1StirAngle += 0.35;
    
    // Vortex motion
    exp1Particles.forEach(p => {
      p.x += (Math.random() - 0.5) * 0.02;
      p.y += (Math.random() - 0.5) * 0.015;
      if (p.x < 0.28) p.x = 0.28;
      if (p.x > 0.72) p.x = 0.72;
      if (p.y < 0.42) p.y = 0.42;
      if (p.y > 0.84) p.y = 0.84;
    });

    drawExp1();

    if (frames < maxFrames) {
      exp1AnimId = requestAnimationFrame(animStir);
    } else {
      finishStirring();
    }
  }
  
  if (exp1AnimId) cancelAnimationFrame(exp1AnimId);
  exp1AnimId = requestAnimationFrame(animStir);
}

function finishStirring() {
  exp1State = "dissolved";
  const sub = exp1Data[activeSubstanceKey];
  
  if (sub.isSoluble === true) {
    // Completely dissolved!
    updateExp1Status(`✨ <strong>${sub.name}</strong> повністю РОЗЧИНИЛАСЯ у воді! Утворився істинний прозорий однорідний розчин. Осаду немає.`);
  } else if (sub.isSoluble === "moderate") {
    updateExp1Status(`🔹 <strong>${sub.name}</strong> розчинилася частково (малорозчинна). Рідина майже прозора.`);
  } else {
    // Insoluble (cloudy suspension)
    updateExp1Status(`⚠️ <strong>${sub.name}</strong> НЕ РОЗЧИНЯЄТЬСЯ у воді! Утворилася біла каламутна суспензія (завись). Натисніть «⏳ Зачекати (відстоювання)»!`);
  }
  drawExp1();
}

function waitAndSettle() {
  if (exp1State === "empty") return;
  exp1State = "settled";
  const sub = exp1Data[activeSubstanceKey];
  
  if (!sub.isSoluble) {
    updateExp1Status(`⏳ Минуло 10 хвилин: частинки <strong>${sub.name}</strong> осіли на дно у вигляді щільного білого осаду! Це доводить, що речовина нерозчинна.`);
  } else {
    updateExp1Status(`⏳ Минуло 10 хвилин: розчин <strong>${sub.name}</strong> залишився кришталево чистим і прозорим, осад не випав.`);
  }
  drawExp1();
}

function toggleMicroscopeExp1() {
  exp1Microscope = !exp1Microscope;
  const btn = document.getElementById("btnMicroscopeExp1");
  if (btn) {
    btn.textContent = exp1Microscope ? "🔬 Сховати мікроскоп" : "🔬 Погляд у мікроскоп";
  }
  drawExp1();
}

function resetExp1() {
  if (exp1AnimId) cancelAnimationFrame(exp1AnimId);
  exp1State = "empty";
  exp1Particles = [];
  updateExp1Status(`Вибрано: <strong>${exp1Data[activeSubstanceKey].name}</strong>. Натисніть «🥄 Додати речовину», щоб розпочати дослід!`);
  drawExp1();
}

function updateExp1Status(html) {
  const el = document.getElementById("exp1Status");
  if (el) el.innerHTML = html;
}

// Rendering canvas
function drawExp1() {
  const canvas = document.getElementById("canvasExp1");
  if (!canvas) return;
  const { ctx, w, h } = getContextScaled(canvas, 230);

  ctx.clearRect(0, 0, w, h);

  // Background lab table gradient
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#f8fafc");
  grad.addColorStop(0.75, "#e2e8f0");
  grad.addColorStop(1, "#cbd5e1");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Table surface line
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(0, h * 0.88, w, h * 0.12);

  // Beaker dimensions
  const bx = w * 0.5;
  const bw = Math.min(w * 0.42, 170);
  const bh = h * 0.65;
  const by = h * 0.88 - bh;

  // Water level
  const waterTop = by + bh * 0.32;
  const waterH = bh * 0.68;

  const sub = exp1Data[activeSubstanceKey];

  // Draw Water inside beaker
  ctx.save();
  ctx.beginPath();
  ctx.rect(bx - bw / 2 + 3, waterTop, bw - 6, waterH);
  ctx.clip();

  // Water color based on state
  let waterBg = "#e0f2fe"; // clear water
  if (exp1State === "stirring" || exp1State === "dissolved") {
    if (sub.cloudy) {
      waterBg = "#f1f5f9"; // cloudy suspension
    } else if (sub.isSoluble === "moderate") {
      waterBg = "#f0fdf4";
    }
  } else if (exp1State === "settled") {
    if (sub.cloudy) {
      waterBg = "#e0f2fe"; // top clears up as particles settle
    }
  }

  ctx.fillStyle = waterBg;
  ctx.fillRect(bx - bw / 2, waterTop, bw, waterH);

  // Meniscus / surface curve
  ctx.beginPath();
  ctx.ellipse(bx, waterTop, bw / 2 - 4, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(186, 230, 253, 0.6)";
  ctx.fill();
  ctx.strokeStyle = "rgba(2, 132, 199, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // If cloudy, draw light haze
  if ((exp1State === "stirring" || exp1State === "dissolved") && sub.cloudy) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillRect(bx - bw / 2, waterTop, bw, waterH);
  }

  // Draw particles in beaker
  if (exp1State === "added") {
    // Mound at bottom
    ctx.beginPath();
    ctx.ellipse(bx, by + bh - 6, bw * 0.32, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = sub.powderColor;
    ctx.fill();
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.stroke();
  } else if (exp1State === "stirring") {
    // Swirling particles
    ctx.fillStyle = sub.powderColor;
    exp1Particles.forEach(p => {
      const px = bx - bw / 2 + (p.x * 2 - 0.5) * (bw / 2);
      const py = waterTop + (p.y - 0.4) * (waterH / 0.5);
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (exp1State === "dissolved") {
    if (!sub.isSoluble) {
      // Particles suspended in water
      ctx.fillStyle = "rgba(241, 245, 249, 0.9)";
      exp1Particles.forEach(p => {
        const px = bx - bw / 2 + (p.x * 2 - 0.5) * (bw / 2);
        const py = waterTop + (p.y - 0.4) * (waterH / 0.5);
        ctx.beginPath();
        ctx.arc(px, py, p.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  } else if (exp1State === "settled") {
    if (!sub.isSoluble) {
      // Thick sediment layer at bottom
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(bx - bw / 2 + 4, by + bh - 14, bw - 8, 12);
      ctx.beginPath();
      ctx.ellipse(bx, by + bh - 14, bw / 2 - 4, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#94a3b8";
      ctx.stroke();

      // Label "Осад"
      ctx.fillStyle = "#475569";
      ctx.font = "bold 11px system-ui";
      ctx.textAlign = "center";
      ctx.fillText("⬇️ Осад на дні", bx, by + bh - 20);
    }
  }

  ctx.restore();

  // Glass Beaker Outlines
  ctx.save();
  ctx.strokeStyle = "rgba(100, 116, 139, 0.7)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  // Spout on top left
  ctx.moveTo(bx - bw / 2 - 6, by);
  ctx.lineTo(bx - bw / 2, by + 6);
  ctx.lineTo(bx - bw / 2, by + bh - 8);
  ctx.quadraticCurveTo(bx - bw / 2, by + bh, bx - bw / 2 + 10, by + bh);
  ctx.lineTo(bx + bw / 2 - 10, by + bh);
  ctx.quadraticCurveTo(bx + bw / 2, by + bh, bx + bw / 2, by + bh - 8);
  ctx.lineTo(bx + bw / 2, by + 6);
  ctx.lineTo(bx + bw / 2 + 4, by);
  ctx.stroke();

  // Beaker scale marks (50ml, 100ml, 150ml)
  ctx.strokeStyle = "rgba(71, 85, 105, 0.45)";
  ctx.lineWidth = 1.5;
  ctx.fillStyle = "rgba(71, 85, 105, 0.6)";
  ctx.font = "9px system-ui";
  ctx.textAlign = "left";
  for (let m = 1; m <= 3; m++) {
    const markY = by + bh - m * (bh * 0.2);
    ctx.beginPath();
    ctx.moveTo(bx - bw / 2 + 4, markY);
    ctx.lineTo(bx - bw / 2 + 16, markY);
    ctx.stroke();
    ctx.fillText(`${m * 50} ml`, bx - bw / 2 + 18, markY + 3);
  }

  // Stirring rod if stirring
  if (exp1State === "stirring") {
    ctx.strokeStyle = "rgba(203, 213, 225, 0.85)";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    const rodTopX = bx + Math.sin(exp1StirAngle) * 20;
    const rodBotX = bx - Math.sin(exp1StirAngle) * 15;
    ctx.moveTo(rodTopX, by - 25);
    ctx.lineTo(rodBotX, by + bh - 15);
    ctx.stroke();
  }

  ctx.restore();

  // Beaker substance label tag
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1;
  const tagW = Math.min(bw - 20, 140);
  ctx.beginPath();
  ctx.roundRect(bx - tagW / 2, by + bh * 0.08, tagW, 26, 6);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 11px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(sub.name, bx, by + bh * 0.08 + 14);
  ctx.fillStyle = sub.isSoluble === true ? "#15803d" : (sub.isSoluble === "moderate" ? "#b45309" : "#b91c1c");
  ctx.font = "bold 9.5px system-ui";
  ctx.fillText(sub.solubilityType, bx, by + bh * 0.08 + 24);

  // Microscope window overlay
  if (exp1Microscope) {
    drawMicroscopeWindow(ctx, w * 0.82, h * 0.42, 60, sub);
  }
}

function drawMicroscopeWindow(ctx, cx, cy, radius, sub) {
  ctx.save();
  // Lens circle shadow & background
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#090d16";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#8b5cf6";
  ctx.stroke();

  ctx.clip();

  // Submicroscopic view
  if (sub.isSoluble === true) {
    // Water molecules (H2O: blue centers with 2 white ears) and dissolved ions (green/yellow)
    ctx.fillStyle = "#38bdf8";
    for (let i = 0; i < 14; i++) {
      const angle = i * 0.45;
      const r = 12 + (i % 3) * 16;
      const mx = cx + Math.cos(angle) * r;
      const my = cy + Math.sin(angle) * r;
      // Oxygen
      ctx.beginPath();
      ctx.arc(mx, my, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#38bdf8";
      ctx.fill();
      // Hydrogens
      ctx.beginPath();
      ctx.arc(mx - 3, my - 3, 2, 0, Math.PI * 2);
      ctx.arc(mx + 3, my - 3, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }
    // Dissolved Solute ions / molecules evenly spread
    ctx.fillStyle = "#4ade80";
    for (let j = 0; j < 6; j++) {
      const ang = j * 1.05 + 0.3;
      const r = 20 + (j % 2) * 22;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    ctx.fillStyle = "#8b5cf6";
    ctx.font = "bold 9.5px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("🔬 Молекули розчинені", cx, cy + radius + 12);
  } else {
    // Insoluble large clumps / starch grains
    ctx.fillStyle = "#475569";
    for (let i = 0; i < 8; i++) {
      const mx = cx + Math.cos(i) * 28;
      const my = cy + Math.sin(i) * 28;
      ctx.beginPath();
      ctx.arc(mx, my, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#38bdf8";
      ctx.fill();
    }

    // Huge insoluble cluster
    ctx.fillStyle = "#fef08a";
    ctx.beginPath();
    ctx.arc(cx - 8, cy - 6, 18, 0, Math.PI * 2);
    ctx.arc(cx + 12, cy + 8, 14, 0, Math.PI * 2);
    ctx.arc(cx + 2, cy - 14, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ca8a04";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
    ctx.fillStyle = "#8b5cf6";
    ctx.font = "bold 9.5px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("🔬 Нерозчинні зерна", cx, cy + radius + 12);
  }
}
