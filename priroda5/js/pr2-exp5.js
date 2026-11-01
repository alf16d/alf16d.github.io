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