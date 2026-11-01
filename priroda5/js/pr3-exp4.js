/* Experiment 4: Removing greasy stain: Water vs Acetone */

let stainState = {
  waterTested: false,
  acetoneTested: false,
  blotted: false
};

function testWaterStain() {
  stainState.waterTested = true;
  updateExp4Status(`💧 <strong>Спроба водою:</strong> Вода не розчиняє жир! Краплі просто лежать на поверхні або стікають, пляма залишилася жирною і помітною.`);
  drawExp4();
}

function testAcetoneStain() {
  stainState.acetoneTested = true;
  updateExp4Status(`🧴 <strong>Обробка ацетоном:</strong> Ацетон є органічним розчинником. Він миттєво розчиняє жирові молекули! Тепер натисніть «🧻 Промокнути серветкою»!`);
  drawExp4();
}

function blotStain() {
  if (!stainState.acetoneTested) {
    updateExp4Status(`⚠️ Спочатку нанесіть ацетон на пляму!`);
    return;
  }
  stainState.blotted = true;
  updateExp4Status(`✨ <strong>Успіх!</strong> Розчинений ацетоном жир перейшов на серветку, а ацетон швидко випарувався. Тканина повністю чиста!`);
  drawExp4();
}

function resetExp4() {
  stainState = { waterTested: false, acetoneTested: false, blotted: false };
  updateExp4Status(`Натисніть «💧 Нанести воду» та «🧴 Нанести ацетон», щоб порівняти дію двох рідин на жирні плями!`);
  drawExp4();
}

function updateExp4Status(html) {
  const el = document.getElementById("exp4Status");
  if (el) el.innerHTML = html;
}

function drawExp4() {
  const canvas = document.getElementById("canvasExp4");
  if (!canvas) return;
  const { ctx, w, h } = getContextScaled(canvas, 230);

  ctx.clearRect(0, 0, w, h);

  // Background
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#f8fafc");
  grad.addColorStop(1, "#e2e8f0");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Table surface
  ctx.fillStyle = "#cbd5e1";
  ctx.fillRect(0, h * 0.85, w, h * 0.15);

  // Two Swatches of Cloth
  const swatchW = Math.min(w * 0.42, 170);
  const swatchH = h * 0.62;
  const swatchY = h * 0.18;

  const leftX = w * 0.28 - swatchW / 2;
  const rightX = w * 0.72 - swatchW / 2;

  // 1. Left Swatch: WATER TEST
  drawFabricSwatch(ctx, leftX, swatchY, swatchW, swatchH, "1. Спроба водою (H₂O)");
  // Greasy stain on left swatch (always present, not dissolved)
  drawGreaseStain(ctx, leftX + swatchW / 2, swatchY + swatchH / 2, 28, 1);

  if (stainState.waterTested) {
    // Water droplets sitting on top, bead-like
    ctx.fillStyle = "rgba(56, 189, 248, 0.85)";
    ctx.strokeStyle = "#0284c7";
    ctx.lineWidth = 1.5;
    [
      { dx: -10, dy: -6, r: 6 },
      { dx: 8, dy: -2, r: 8 },
      { dx: -2, dy: 10, r: 7 }
    ].forEach(d => {
      ctx.beginPath();
      ctx.arc(leftX + swatchW / 2 + d.dx, swatchY + swatchH / 2 + d.dy, d.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    ctx.fillStyle = "#b91c1c";
    ctx.font = "bold 10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("❌ Не розчиняється!", leftX + swatchW / 2, swatchY + swatchH + 18);
  }

  // 2. Right Swatch: ACETONE TEST
  drawFabricSwatch(ctx, rightX, swatchY, swatchW, swatchH, "2. Спроба ацетоном");

  if (!stainState.acetoneTested) {
    // Original stain
    drawGreaseStain(ctx, rightX + swatchW / 2, swatchY + swatchH / 2, 28, 1);
  } else if (stainState.acetoneTested && !stainState.blotted) {
    // Dissolving/spreading stain
    drawGreaseStain(ctx, rightX + swatchW / 2, swatchY + swatchH / 2, 38, 0.35);
    // Acetone wet halo
    ctx.fillStyle = "rgba(224, 231, 255, 0.4)";
    ctx.beginPath();
    ctx.arc(rightX + swatchW / 2, swatchY + swatchH / 2, 44, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#4338ca";
    ctx.font = "bold 10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("🧴 Жир розчиняється!", rightX + swatchW / 2, swatchY + swatchH + 18);
  } else if (stainState.blotted) {
    // Completely Clean fabric!
    ctx.fillStyle = "#15803d";
    ctx.font = "bold 11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("✅ Пляма зникла!", rightX + swatchW / 2, swatchY + swatchH / 2 + 4);
    ctx.fillText("Тканина чиста!", rightX + swatchW / 2, swatchY + swatchH + 18);
  }
}

function drawFabricSwatch(ctx, x, y, w, h, label) {
  ctx.save();
  // Fabric texture
  ctx.fillStyle = "#fefefe";
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 8);
  ctx.fill();
  ctx.stroke();

  // Subtle woven weave pattern
  ctx.strokeStyle = "rgba(226, 232, 240, 0.7)";
  ctx.lineWidth = 1;
  for (let i = 8; i < w; i += 8) {
    ctx.beginPath();
    ctx.moveTo(x + i, y);
    ctx.lineTo(x + i, y + h);
    ctx.stroke();
  }
  for (let j = 8; j < h; j += 8) {
    ctx.beginPath();
    ctx.moveTo(x, y + j);
    ctx.lineTo(x + w, y + j);
    ctx.stroke();
  }

  // Label above swatch
  ctx.fillStyle = "#334155";
  ctx.font = "bold 11px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(label, x + w / 2, y - 6);

  ctx.restore();
}

function drawGreaseStain(ctx, cx, cy, radius, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  // Irregular organic stain
  const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius);
  grad.addColorStop(0, "#d97706");
  grad.addColorStop(0.6, "rgba(217, 119, 6, 0.75)");
  grad.addColorStop(1, "rgba(245, 158, 11, 0)");
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.ellipse(cx, cy, radius, radius * 0.75, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx - 6, cy + 4, radius * 0.6, radius * 0.5, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
