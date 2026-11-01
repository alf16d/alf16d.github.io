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
