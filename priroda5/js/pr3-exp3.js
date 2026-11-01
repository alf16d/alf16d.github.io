/* Experiment 3: Air as a Gaseous Solution */

let airMolecules = [];
let airHighlight = "all"; // 'all', 'n2', 'o2', 'other'
let airAnimId = null;

function initExp3() {
  airMolecules = [];
  const total = 90;
  // 78% N2 (approx 70), 21% O2 (approx 19), 1% other (1-2)
  for (let i = 0; i < total; i++) {
    let type = "n2";
    if (i >= 70 && i < 89) type = "o2";
    else if (i >= 89) type = "other";

    airMolecules.push({
      type: type,
      x: 0.1 + Math.random() * 0.8,
      y: 0.15 + Math.random() * 0.7,
      vx: (Math.random() - 0.5) * 0.008,
      vy: (Math.random() - 0.5) * 0.008,
      angle: Math.random() * Math.PI * 2,
      vAngle: (Math.random() - 0.5) * 0.04
    });
  }

  if (airAnimId) cancelAnimationFrame(airAnimId);
  animateAir();
}

function highlightGas(gasType) {
  airHighlight = gasType;
  document.querySelectorAll(".gas-btn").forEach(b => {
    b.classList.toggle("btn-primary", b.dataset.gas === gasType);
    b.classList.toggle("btn-secondary", b.dataset.gas !== gasType);
  });

  const status = document.getElementById("airStatus");
  if (!status) return;

  if (gasType === "n2") {
    status.innerHTML = `🔵 <strong>Азот (N₂) — 78% [РОЗЧИННИК]:</strong> Його частка в повітрі найбільша. За правилом, та речовина, якої в суміші найбільше, вважається розчинником!`;
  } else if (gasType === "o2") {
    status.innerHTML = `🔴 <strong>Кисень (O₂) — 21% [РОЗЧИНЮВАНА РЕЧОВИНА]:</strong> Кисень рівномірно розподілений між молекулами азоту і є головною розчинюваною речовиною.`;
  } else if (gasType === "other") {
    status.innerHTML = `🟢 <strong>Вуглекислий газ, аргон, водяна пара — ~1% [РОЗЧИНЮВАНІ РЕЧОВИНИ]:</strong> Також є компонентами, розчиненими в азоті.`;
  } else {
    status.innerHTML = `✨ <strong>Повітря — це природний газовий розчин:</strong> Однорідна суміш без межі поділу, де розчинником є азот (78%), а розчинюваними — кисень та інші гази.`;
  }
}

function animateAir() {
  airMolecules.forEach(m => {
    m.x += m.vx;
    m.y += m.vy;
    m.angle += m.vAngle;

    if (m.x < 0.05 || m.x > 0.95) m.vx = -m.vx;
    if (m.y < 0.1 || m.y > 0.9) m.vy = -m.vy;
  });

  drawExp3();
  airAnimId = requestAnimationFrame(animateAir);
}

function drawExp3() {
  const canvas = document.getElementById("canvasExp3");
  if (!canvas) return;
  const { ctx, w, h } = getContextScaled(canvas, 230);

  ctx.clearRect(0, 0, w, h);

  // Background chamber
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#0f172a");
  grad.addColorStop(1, "#1e293b");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Glass chamber frame
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(w * 0.04, h * 0.08, w * 0.92, h * 0.84);

  // Chamber header badge
  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  ctx.fillRect(w * 0.1, h * 0.03, w * 0.8, 20);
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 11px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("🌬️ Молекулярна модель газового розчину повітря", w * 0.5, h * 0.03 + 14);

  // Draw molecules
  airMolecules.forEach(m => {
    const mx = m.x * w;
    const my = m.y * h;

    const isMatch = (airHighlight === "all" || airHighlight === m.type);
    const alpha = isMatch ? 1 : 0.18;

    ctx.save();
    ctx.translate(mx, my);
    ctx.rotate(m.angle);
    ctx.globalAlpha = alpha;

    if (m.type === "n2") {
      // Nitrogen: two connected blue spheres
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(-4, 0, 4.5, 0, Math.PI * 2);
      ctx.arc(4, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();

      if (airHighlight === "n2") {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    } else if (m.type === "o2") {
      // Oxygen: two connected bright red/coral spheres
      ctx.fillStyle = "#f43f5e";
      ctx.beginPath();
      ctx.arc(-4.5, 0, 5, 0, Math.PI * 2);
      ctx.arc(4.5, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      if (airHighlight === "o2") {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    } else {
      // Other (CO2 / Ar): 3 spheres or green dot
      ctx.fillStyle = "#4ade80";
      ctx.beginPath();
      ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });

  // Small atmospheric composition mini-legend on bottom
  const legY = h * 0.85;
  ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
  ctx.fillRect(w * 0.08, legY - 14, w * 0.84, 22);

  ctx.font = "bold 10px system-ui";
  ctx.textAlign = "center";

  ctx.fillStyle = "#38bdf8";
  ctx.fillText("🔵 Азот N₂ (78% — Розчинник)", w * 0.28, legY);

  ctx.fillStyle = "#f43f5e";
  ctx.fillText("🔴 Кисень O₂ (21%)", w * 0.62, legY);

  ctx.fillStyle = "#4ade80";
  ctx.fillText("🟢 Інші (1%)", w * 0.84, legY);
}
