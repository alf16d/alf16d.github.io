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
