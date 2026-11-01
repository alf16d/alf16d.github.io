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
