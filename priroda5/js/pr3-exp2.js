/* Experiment 2: Interactive Solubility Graph and Analysis */

let currentExp2Temp = 40;
let highlightedCurve = "all"; // 'all', 'sugar', 'salt', 'kno3'

// Mathematical models for curves in range 0..100 °C
function getSolubility(substance, temp) {
  const t = Math.max(0, Math.min(100, temp));
  switch (substance) {
    case "sugar": // 180 at 0, 238 at 40, ~300+ at 65
      return 180 + 1.25 * t + 0.007 * t * t;
    case "kno3": // 13.3 at 0, 31.6 at 20, 63.9 at 40, 110 at 60, 246 at 100
      return 13.3 + 0.8 * t + 0.0155 * t * t;
    case "nano3": // 73 at 0, 104 at 40, 180 at 100
      return 73 + 0.77 * t + 0.003 * t * t;
    case "nabr": // ~90 to 115
      return 90 + 0.25 * t;
    case "kbr": // ~54 to 104
      return 54 + 0.5 * t;
    case "kcl": // 28 to 56
      return 28 + 0.28 * t;
    case "nacl": // 35.7 to 39.8 (nearly constant!)
      return 35.7 + 0.041 * t;
    case "ce2so4": // 20 down to ~2
      return Math.max(2, 20 - 0.22 * t + 0.0005 * t * t);
    default:
      return 0;
  }
}

const curvesList = [
  { id: "sugar", name: "Цукор C₁₂H₂₂O₁₁", color: "#06b6d4", width: 3 },
  { id: "kno3", name: "KNO₃ (селітра)", color: "#3b82f6", width: 2.2 },
  { id: "nano3", name: "NaNO₃", color: "#60a5fa", width: 1.8 },
  { id: "nabr", name: "NaBr", color: "#14b8a6", width: 1.6 },
  { id: "kbr", name: "KBr", color: "#64748b", width: 1.5 },
  { id: "kcl", name: "KCl", color: "#94a3b8", width: 1.5 },
  { id: "nacl", name: "Кухонна сіль NaCl", color: "#1e3a8a", width: 3.2 },
  { id: "ce2so4", name: "Ce₂(SO₄)₃", color: "#f43f5e", width: 1.8 }
];

function updateExp2Temp(val) {
  currentExp2Temp = parseInt(val, 10);
  const label = document.getElementById("tempExp2Val");
  if (label) label.textContent = currentExp2Temp + " °C";

  updateSolubilityStatus();
  drawExp2();
}

function highlightExp2Curve(curveId) {
  highlightedCurve = curveId;
  if (curveId === "sugar") {
    currentExp2Temp = 40;
    const slider = document.getElementById("tempExp2Slider");
    if (slider) slider.value = 40;
    const label = document.getElementById("tempExp2Val");
    if (label) label.textContent = "40 °C";
    updateExp2Status(`🍬 <strong>Цукор:</strong> при 0 °C розчиняється <strong>180 г</strong>, а при 40 °C — <strong>${Math.round(getSolubility("sugar", 40))} г</strong>. 180 × 2 = 360 г, отже розчинність <em>НЕ подвоїлася</em>!`);
  } else if (curveId === "salt") {
    updateExp2Status(`🧂 <strong>Кухонна сіль NaCl:</strong> при 0 °C — <strong>36 г</strong>, при 100 °C — <strong>40 г</strong>. Лінія майже горизонтальна! Розчинність практично не залежить від температури.`);
  } else {
    updateSolubilityStatus();
  }
  drawExp2();
}

function updateSolubilityStatus() {
  const sugarVal = Math.round(getSolubility("sugar", currentExp2Temp));
  const saltVal = getSolubility("nacl", currentExp2Temp).toFixed(1);
  const kno3Val = Math.round(getSolubility("kno3", currentExp2Temp));

  updateExp2Status(
    `🌡️ При <strong>${currentExp2Temp} °C</strong> у 100 г води розчиняється: ` +
    `<span style="color:#0891b2;">Цукру: <strong>${sugarVal} г</strong></span>, ` +
    `<span style="color:#1e3a8a;">Кухонної солі NaCl: <strong>${saltVal} г</strong></span>, ` +
    `<span style="color:#2563eb;">KNO₃: <strong>${kno3Val} г</strong></span>`
  );
}

function updateExp2Status(html) {
  const el = document.getElementById("exp2Status");
  if (el) el.innerHTML = html;
}

function drawExp2() {
  const canvas = document.getElementById("canvasExp2");
  if (!canvas) return;
  const { ctx, w, h } = getContextScaled(canvas, 250);

  ctx.clearRect(0, 0, w, h);

  // Margins for axes
  const padL = 42;
  const padR = 20;
  const padT = 24;
  const padB = 32;

  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(padL, padT, plotW, plotH);

  // Coordinate transforms
  function toX(temp) {
    return padL + (temp / 100) * plotW;
  }
  function toY(grams) {
    return padT + plotH - (grams / 300) * plotH;
  }

  // Draw Grid Lines (Y: 0, 20, 60, 100, 140, 180, 220, 260, 300)
  const yTicks = [0, 20, 60, 100, 140, 180, 220, 260, 300];
  ctx.strokeStyle = "#f1f5f9";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#64748b";
  ctx.font = "9.5px system-ui";
  ctx.textAlign = "right";

  yTicks.forEach(val => {
    const yPos = toY(val);
    ctx.beginPath();
    ctx.moveTo(padL, yPos);
    ctx.lineTo(padL + plotW, yPos);
    ctx.stroke();

    ctx.fillText(val, padL - 5, yPos + 3.5);
  });

  // Draw Grid Lines (X: 0, 20, 40, 60, 80, 100)
  const xTicks = [0, 20, 40, 60, 80, 100];
  ctx.textAlign = "center";
  xTicks.forEach(tVal => {
    const xPos = toX(tVal);
    ctx.beginPath();
    ctx.moveTo(xPos, padT);
    ctx.lineTo(xPos, padT + plotH);
    ctx.stroke();

    ctx.fillText(tVal, xPos, padT + plotH + 14);
  });

  // Axes labels
  ctx.fillStyle = "#0284c7";
  ctx.font = "bold 10px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("Температура °C ➡️", padL + plotW / 2, padT + plotH + 26);

  ctx.save();
  ctx.translate(11, padT + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.font = "bold 9px system-ui";
  ctx.fillText("Розчинність (г на 100 г H₂O) ➡️", 0, 0);
  ctx.restore();

  // Draw Curves
  curvesList.forEach(c => {
    const isFocus = (highlightedCurve === "all" || highlightedCurve === c.id);
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = isFocus ? c.width : 1;
    ctx.strokeStyle = isFocus ? c.color : "rgba(203, 213, 225, 0.6)";

    let started = false;
    for (let t = 0; t <= 100; t += 2) {
      const g = getSolubility(c.id, t);
      if (g <= 300) {
        const x = toX(t);
        const y = toY(g);
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
    }
    ctx.stroke();

    // Curve label near right end
    if (isFocus) {
      const endT = c.id === "sugar" ? 62 : (c.id === "ce2so4" ? 90 : 96);
      const endG = getSolubility(c.id, endT);
      const lx = toX(endT);
      const ly = toY(endG);

      ctx.fillStyle = c.color;
      ctx.font = "bold 9px system-ui";
      ctx.textAlign = (c.id === "sugar" || c.id === "ce2so4") ? "left" : "right";
      ctx.fillText(c.name, lx - 4, ly - 4);
    }

    ctx.restore();
  });

  // Temperature Cursor Line
  const curX = toX(currentExp2Temp);
  ctx.save();
  ctx.strokeStyle = "#e11d48";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(curX, padT);
  ctx.lineTo(curX, padT + plotH);
  ctx.stroke();
  ctx.restore();

  // Highlight points of intersection on cursor
  [
    { id: "sugar", color: "#06b6d4" },
    { id: "nacl", color: "#1e3a8a" },
    { id: "kno3", color: "#3b82f6" }
  ].forEach(pt => {
    const val = getSolubility(pt.id, currentExp2Temp);
    if (val <= 300) {
      const py = toY(val);
      ctx.beginPath();
      ctx.arc(curX, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = pt.color;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();
    }
  });

  // Border of plot area
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(padL, padT, plotW, plotH);
}

// Test question logic for PR3
function checkTestPR3(btn, option) {
  const container = document.getElementById("testOptionsPR3");
  if (!container) return;
  const buttons = container.querySelectorAll(".quiz-btn");
  if (container.querySelector(".quiz-btn.correct")) return;

  const feedback = document.getElementById("testFeedbackPR3");

  if (option === "В") {
    btn.classList.add("correct");
    btn.innerHTML = btn.innerHTML + " ✅ (ПРАВИЛЬНО!)";
    buttons.forEach(b => {
      if (b !== btn) {
        b.style.pointerEvents = "none";
        b.style.opacity = "0.45";
      }
    });
    if (feedback) {
      feedback.style.display = "block";
      feedback.className = "answer-box";
      feedback.innerHTML = `
        🎉 <strong>Чудово! Варіант В — правильна відповідь!</strong><br>
        • <strong>Твердження І (Хибне):</strong> За графіком при 0 °C у 100 г води розчиняється ~180 г цукру. При 40 °C — близько 240 г. Щоб розчинність подвоїлася, мало б бути 360 г, а цього немає!<br>
        • <strong>Твердження ІІ (Правильне):</strong> Лінія кухонної солі (NaCl) на графіку практично горизонтальна (від 36 г при 0 °C до 40 г при 100 °C), тобто її розчинність майже не змінюється при нагріванні.
      `;
    }
    unlockStarPR3(2);
  } else {
    btn.classList.add("wrong");
    btn.innerHTML = btn.innerHTML + " ❌";
    btn.style.pointerEvents = "none";
    if (feedback) {
      feedback.style.display = "block";
      feedback.className = "tip-box warning";
      feedback.innerHTML = `⚠️ Не зовсім так! Поглянь на графік цукру: при 0 °C — 180 г, а при 40 °C — близько 240 г (не 360 г, отже твердження І хибне). А лінія солі NaCl майже не змінюється! Спробуй інший варіант.`;
    }
  }
}
