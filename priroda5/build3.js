// Build script to assemble pr3.html from steps3/*.html
const fs = require('fs');
const path = require('path');

const stepsDir = path.join(__dirname, 'steps3');

function readStep(filename) {
  return fs.readFileSync(path.join(stepsDir, filename), 'utf8').trim();
}

const html = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Практична робота №3 — Досліджуємо розчинність деяких речовин | 5 клас</title>
  <!-- Modular CSS styles for PR3 -->
  <link rel="stylesheet" href="css/pr3-base.css">
  <link rel="stylesheet" href="css/pr3-sim.css">
  <link rel="stylesheet" href="css/pr3-workbook.css">
  <link rel="stylesheet" href="css/pr3-modals.css">
</head>
<body>

  <!-- Top Sticky Header -->
  <header>
    <div class="header-info" style="display:flex; flex-direction:row; align-items:center; gap:8px;">
      <a href="index.html" class="icon-btn" style="text-decoration:none; padding:4px 8px; font-size:12px;" title="До списку робіт">🏠 Меню</a>
      <h1 class="header-title">Практична робота № 3</h1>
    </div>
  </header>

  <div class="container">

    <!-- TAB 0: ВСТУП ТА ОБЛАДНАННЯ -->
    <div class="tab-content active" id="tab-intro">
${readStep('step0-intro.html')}
    </div>

    <!-- TAB 1: ЗАВДАННЯ №1 (РОЗЧИННІСТЬ РЕЧОВИН) -->
    <div class="tab-content" id="tab-exp1">
${readStep('step1-exp1.html')}
    </div>

    <!-- TAB 2: ЗАВДАННЯ №2 (ГРАФІК РОЗЧИННОСТІ) -->
    <div class="tab-content" id="tab-exp2">
${readStep('step2-exp2.html')}
    </div>

    <!-- TAB 3: ЗАВДАННЯ №3 (ПОВІТРЯ ЯК РОЗЧИН) -->
    <div class="tab-content" id="tab-exp3">
${readStep('step3-exp3.html')}
    </div>

    <!-- TAB 4: ЗАВДАННЯ №4 (ПЛЯМА ТА АЦЕТОН) -->
    <div class="tab-content" id="tab-exp4">
${readStep('step4-exp4.html')}
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

  <!-- Modular Scripts for PR3 -->
  <script src="js/pr3-core.js"></script>
  <script src="js/pr3-modals.js"></script>
  <script src="js/pr3-exp1.js"></script>
  <script src="js/pr3-exp2.js"></script>
  <script src="js/pr3-exp3.js"></script>
  <script src="js/pr3-exp4.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'pr3.html'), html, 'utf8');
console.log('Successfully assembled pr3.html from modular steps3!');
