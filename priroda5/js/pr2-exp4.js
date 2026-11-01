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
