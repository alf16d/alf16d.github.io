/* Interactive Rock & Mineral Inspection Engine (PR4) */

const rocksData = {
  granite: {
    name: "Граніт",
    type: "Магматична гірська порода",
    colorDesc: "Сірий, рожевий або червонуватий з чорними цятками",
    luster: "Скляний (слюда, кварц) та матовий",
    transparency: "Непрозорий",
    structure: "Щільна, тверда, зерниста",
    use: "Будівництво, бруківка, облицювання, пам'ятники, щебінь",
    baseColor: "#e2e8f0",
    minerals: [
      { name: "Польовий шпат", color: "#fca5a5", desc: "рожеві зерна" },
      { name: "Кварц", color: "#e2e8f0", desc: "склоподібні зерна" },
      { name: "Слюда", color: "#1e293b", desc: "чорні блискучі пластинки" }
    ]
  },
  chalk: {
    name: "Крейда",
    type: "Осадова гірська порода",
    colorDesc: "Білий",
    luster: "Матовий (без блиску)",
    transparency: "Непрозорий",
    structure: "М'яка, пухка, крихка",
    use: "Письмо на дошці, виробництво вапна, фарб, побілка",
    baseColor: "#ffffff",
    minerals: [
      { name: "Кальцит", color: "#ffffff", desc: "мікроскопічні рештки давніх морських водоростей" }
    ]
  },
  coal: {
    name: "Кам'яне вугілля",
    type: "Осадова горюча корисна копалина",
    colorDesc: "Чорний",
    luster: "Смолистий, скляний (напівметалічний)",
    transparency: "Непрозорий",
    structure: "Щільна, але крихка",
    use: "Паливо для ТЕС, опалення, виплавка металів, хімічна сировина",
    baseColor: "#18181b",
    minerals: [
      { name: "Вуглець (органічний)", color: "#09090b", desc: "скам'янілі рештки прадавніх рослин" }
    ]
  }
};

let magnifierEnabled = {
  granite: true,
  chalk: true,
  coal: true
};

function toggleMagnifier(rockKey) {
  magnifierEnabled[rockKey] = !magnifierEnabled[rockKey];
  const btn = document.getElementById("btnLoupe_" + rockKey);
  if (btn) {
    btn.textContent = magnifierEnabled[rockKey] ? "🔍 Сховати лупу" : "🔍 Дослідити під лупою";
  }
  drawRock(rockKey);
}

function drawRock(rockKey) {
  const canvasId = "canvasRock_" + rockKey;
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const { ctx, w, h } = getContextScaled(canvas, 230);

  ctx.clearRect(0, 0, w, h);

  // Background lab table
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#f8fafc");
  grad.addColorStop(0.75, "#e2e8f0");
  grad.addColorStop(1, "#cbd5e1");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Table mat
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1.5;
  const matW = Math.min(w * 0.78, 380);
  const matH = h * 0.75;
  const matX = (w - matW) / 2;
  const matY = (h - matH) / 2;
  ctx.beginPath();
  ctx.roundRect(matX, matY, matW, matH, 12);
  ctx.fill();
  ctx.stroke();

  // Draw rock specimen in the center
  const cx = w * 0.5;
  const cy = h * 0.5;
  const rx = Math.min(w * 0.22, 90);
  const ry = Math.min(h * 0.28, 65);

  const data = rocksData[rockKey];

  drawRockShape(ctx, cx, cy, rx, ry, rockKey);

  // If magnifier enabled, draw large magnifying lens overlay on top right
  if (magnifierEnabled[rockKey]) {
    drawLoupeLens(ctx, w * 0.78, h * 0.42, 60, rockKey);
  }
}

function drawRockShape(ctx, cx, cy, rx, ry, rockKey) {
  ctx.save();

  // Shadow
  ctx.beginPath();
  ctx.ellipse(cx, cy + ry * 0.85, rx * 1.05, ry * 0.35, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(100, 116, 139, 0.25)";
  ctx.fill();

  // Irregular rock silhouette
  ctx.beginPath();
  ctx.moveTo(cx - rx * 0.9, cy - ry * 0.2);
  ctx.quadraticCurveTo(cx - rx * 0.7, cy - ry * 0.9, cx - rx * 0.1, cy - ry * 0.85);
  ctx.quadraticCurveTo(cx + rx * 0.6, cy - ry * 0.8, cx + rx * 0.95, cy - ry * 0.3);
  ctx.quadraticCurveTo(cx + rx * 1.05, cy + ry * 0.4, cx + rx * 0.7, cy + ry * 0.85);
  ctx.quadraticCurveTo(cx + rx * 0.1, cy + ry * 0.95, cx - rx * 0.6, cy + ry * 0.8);
  ctx.quadraticCurveTo(cx - rx * 0.95, cy + ry * 0.5, cx - rx * 0.9, cy - ry * 0.2);
  ctx.closePath();

  if (rockKey === "granite") {
    ctx.fillStyle = "#cbd5e1";
    ctx.fill();
    ctx.clip();

    // Speckles: pink feldspar, quartz, black mica
    for (let i = 0; i < 180; i++) {
      const sx = cx - rx + (Math.sin(i * 3.7) * 0.5 + 0.5) * rx * 2;
      const sy = cy - ry + (Math.cos(i * 5.1) * 0.5 + 0.5) * ry * 2;
      const r = 2 + (i % 4) * 2;
      const colors = ["#fca5a5", "#f87171", "#e2e8f0", "#0f172a", "#334155"];
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (rockKey === "chalk") {
    // Pure soft white chalk with soft edge texture
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.clip();

    // Subtle chalk dust and cracks
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(cx - rx * 0.6 + i * 14, cy - ry * 0.4);
      ctx.lineTo(cx - rx * 0.5 + i * 14, cy + ry * 0.5);
      ctx.stroke();
    }
  } else if (rockKey === "coal") {
    // Deep black with lustrous facets
    ctx.fillStyle = "#18181b";
    ctx.fill();
    ctx.clip();

    // Glossy facets
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.beginPath();
    ctx.moveTo(cx - rx * 0.5, cy - ry * 0.4);
    ctx.lineTo(cx + rx * 0.2, cy - ry * 0.7);
    ctx.lineTo(cx, cy);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.beginPath();
    ctx.moveTo(cx + rx * 0.1, cy);
    ctx.lineTo(cx + rx * 0.7, cy + ry * 0.3);
    ctx.lineTo(cx + rx * 0.4, cy + ry * 0.7);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();

  // Rock edge border
  ctx.save();
  ctx.strokeStyle = rockKey === "coal" ? "#09090b" : "#94a3b8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - rx * 0.9, cy - ry * 0.2);
  ctx.quadraticCurveTo(cx - rx * 0.7, cy - ry * 0.9, cx - rx * 0.1, cy - ry * 0.85);
  ctx.quadraticCurveTo(cx + rx * 0.6, cy - ry * 0.8, cx + rx * 0.95, cy - ry * 0.3);
  ctx.quadraticCurveTo(cx + rx * 1.05, cy + ry * 0.4, cx + rx * 0.7, cy + ry * 0.85);
  ctx.quadraticCurveTo(cx + rx * 0.1, cy + ry * 0.95, cx - rx * 0.6, cy + ry * 0.8);
  ctx.quadraticCurveTo(cx - rx * 0.95, cy + ry * 0.5, cx - rx * 0.9, cy - ry * 0.2);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  // Name Label
  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 13px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(rocksData[rockKey].name, cx, cy + ry + 22);
}

function drawLoupeLens(ctx, lx, ly, radius, rockKey) {
  ctx.save();

  // Magnifier handle
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(lx + radius * 0.7, ly + radius * 0.7);
  ctx.lineTo(lx + radius * 1.35, ly + radius * 1.35);
  ctx.stroke();

  // Lens frame
  ctx.beginPath();
  ctx.arc(lx, ly, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.strokeStyle = "#0284c7";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.clip();

  // Magnified view inside
  if (rockKey === "granite") {
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(lx - radius, ly - radius, radius * 2, radius * 2);
    // Distinct mineral grains
    for (let i = 0; i < 40; i++) {
      const gx = lx - radius + (Math.sin(i * 2.3) * 0.5 + 0.5) * radius * 2;
      const gy = ly - radius + (Math.cos(i * 3.1) * 0.5 + 0.5) * radius * 2;
      const gr = 6 + (i % 4) * 4;
      const cols = ["#fca5a5", "#f87171", "#cbd5e1", "#0f172a"];
      ctx.fillStyle = cols[i % cols.length];
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    }
    // Lens reflection
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.beginPath();
    ctx.arc(lx - radius * 0.3, ly - radius * 0.3, radius * 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.fillStyle = "#0284c7";
    ctx.font = "bold 10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("🔍 Зерна 3 мінералів", lx, ly + radius + 14);
  } else if (rockKey === "chalk") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(lx - radius, ly - radius, radius * 2, radius * 2);
    ctx.fillStyle = "#e2e8f0";
    for (let i = 0; i < 50; i++) {
      const gx = lx - radius + (Math.sin(i * 2.7) * 0.5 + 0.5) * radius * 2;
      const gy = ly - radius + (Math.cos(i * 4.3) * 0.5 + 0.5) * radius * 2;
      ctx.beginPath();
      ctx.arc(gx, gy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.fillStyle = "#0284c7";
    ctx.font = "bold 10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("🔍 Дрібнозерниста маса", lx, ly + radius + 14);
  } else if (rockKey === "coal") {
    ctx.fillStyle = "#18181b";
    ctx.fillRect(lx - radius, ly - radius, radius * 2, radius * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.beginPath();
    ctx.moveTo(lx - radius * 0.8, ly - radius * 0.4);
    ctx.lineTo(lx + radius * 0.5, ly - radius * 0.8);
    ctx.lineTo(lx + radius * 0.2, ly + radius * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#0284c7";
    ctx.font = "bold 10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("🔍 Смолистий блиск", lx, ly + radius + 14);
  }
}
