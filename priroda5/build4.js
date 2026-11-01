// Build script to assemble pr4.html from steps4/*.html
const fs = require('fs');
const path = require('path');

const stepsDir = path.join(__dirname, 'steps4');

function readStep(filename) {
  return fs.readFileSync(path.join(stepsDir, filename), 'utf8').trim();
}

const html = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Практична робота №4 — Ознайомлення зі зразками гірських порід і мінералів | 5 клас</title>
  <!-- Modular CSS styles for PR4 -->
  <link rel="stylesheet" href="css/pr4-base.css">
  <link rel="stylesheet" href="css/pr4-sim.css">
  <link rel="stylesheet" href="css/pr4-workbook.css">
  <link rel="stylesheet" href="css/pr4-modals.css">
</head>
<body>

  <!-- Top Sticky Header -->
  <header>
    <div class="header-info" style="display:flex; flex-direction:row; align-items:center; gap:8px;">
      <a href="index.html" class="icon-btn" style="text-decoration:none; padding:4px 8px; font-size:12px;" title="До списку робіт">🏠 Меню</a>
      <h1 class="header-title">Практична робота № 4</h1>
    </div>
  </header>

  <div class="container">

    <!-- TAB 0: ВСТУП ТА ОБЛАДНАННЯ (ЕКО-РОЗМИНКА) -->
    <div class="tab-content active" id="tab-intro">
${readStep('step0-intro.html')}
    </div>

    <!-- TAB 1: ЗРАЗОК №1 (ГРАНІТ) -->
    <div class="tab-content" id="tab-granite">
${readStep('step1-granite.html')}
    </div>

    <!-- TAB 2: ЗРАЗОК №2 (КРЕЙДА) -->
    <div class="tab-content" id="tab-chalk">
${readStep('step2-chalk.html')}
    </div>

    <!-- TAB 3: ЗРАЗОК №3 (КАМ'ЯНЕ ВУГІЛЛЯ) -->
    <div class="tab-content" id="tab-coal">
${readStep('step3-coal.html')}
    </div>

    <!-- TAB 4: ПІДСУМКОВА ТАБЛИЦЯ ХАРАКТЕРИСТИК -->
    <div class="tab-content" id="tab-table">
${readStep('step4-table.html')}
    </div>

    <!-- TAB 5: ЗАГАЛЬНИЙ ВИСНОВОК ТА САМООЦІНКА -->
    <div class="tab-content" id="tab-summary">
${readStep('step5-summary.html')}
    </div>

  </div>

  <!-- Bottom Navigation Bar for Mobile -->
  <nav class="bottom-bar">
    <button class="btn btn-sm btn-secondary" id="btnPrevTab" onclick="navStep(-1)">⬅️ Попередня</button>
    <div style="font-size:13px; font-weight:800; color:var(--text-muted);" id="currentStepIndicator">Крок 1 з 6</div>
    <button class="btn btn-sm btn-accent" id="btnNextTab" onclick="navStep(1)">Наступна ➡️</button>
  </nav>

  <!-- Modals -->
${readStep('modals.html')}

  <!-- Modular Scripts for PR4 -->
  <script src="js/pr4-core.js"></script>
  <script src="js/pr4-rock.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'pr4.html'), html, 'utf8');
console.log('Successfully assembled pr4.html from modular steps4!');
