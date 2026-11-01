// Simple script to reassemble pr2.html from steps/*.html
const fs = require('fs');
const path = require('path');

const stepsDir = path.join(__dirname, 'steps');

function readStep(filename) {
  return fs.readFileSync(path.join(stepsDir, filename), 'utf8').trim();
}

const html = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Практична робота №2 — Спостереження явищ дифузії та випаровування | 5 клас</title>
  <!-- Modular CSS styles -->
  <link rel="stylesheet" href="css/pr2-base.css">
  <link rel="stylesheet" href="css/pr2-sim.css">
  <link rel="stylesheet" href="css/pr2-workbook.css">
  <link rel="stylesheet" href="css/pr2-modals.css">
</head>
<body>

  <!-- Top Sticky Header -->
  <header>
    <div class="header-info" style="display:flex; flex-direction:row; align-items:center; gap:8px;">
      <a href="index.html" class="icon-btn" style="text-decoration:none; padding:4px 8px; font-size:12px;" title="До списку робіт">🏠 Меню</a>
      <h1 class="header-title">Практична робота № 2</h1>
    </div>
  </header>

  <div class="container">

    <!-- TAB 0: ВСТУП ТА ОБЛАДНАННЯ -->
    <div class="tab-content active" id="tab-intro">
${readStep('step0-intro.html')}
    </div>

    <!-- TAB 1: ЗАВДАННЯ №1 (ВОДА vs СПИРТ) -->
    <div class="tab-content" id="tab-exp1">
${readStep('step1-exp1.html')}
    </div>

    <!-- TAB 2: ЗАВДАННЯ №2 (МАНДАРИНКА В КЛАСІ) -->
    <div class="tab-content" id="tab-exp2">
${readStep('step2-exp2.html')}
    </div>

    <!-- TAB 3: ЗАВДАННЯ №3 (ЧАЙ У ХОЛОДНІЙ І ГАРЯЧІЙ ВОДІ) -->
    <div class="tab-content" id="tab-exp3">
${readStep('step3-exp3.html')}
    </div>

    <!-- TAB 4: ЗАВДАННЯ №4 (ОХОЛОДЖЕННЯ ВОДИ В РІЗНИХ ПОСУДИНАХ) -->
    <div class="tab-content" id="tab-exp4">
${readStep('step4-exp4.html')}
    </div>

    <!-- TAB 5: ЗАВДАННЯ №5 (ПЛАСТИЛІН - ДИФУЗІЯ У ТВЕРДИХ ТІЛАХ) -->
    <div class="tab-content" id="tab-exp5">
${readStep('step5-exp5.html')}
    </div>

    <!-- TAB 6: ЗАГАЛЬНИЙ ВИСНОВОК РОБОТИ -->
    <div class="tab-content" id="tab-summary">
${readStep('step6-summary.html')}
    </div>

  </div>

  <!-- Bottom Navigation Bar for Mobile -->
  <nav class="bottom-bar">
    <button class="btn btn-sm btn-secondary" id="btnPrevTab" onclick="navStep(-1)">⬅️ Попередня</button>
    <div style="font-size:13px; font-weight:800; color:var(--text-muted);" id="currentStepIndicator">Крок 1 з 7</div>
    <button class="btn btn-sm btn-accent" id="btnNextTab" onclick="navStep(1)">Наступна ➡️</button>
  </nav>

  <!-- Modals -->
${readStep('modals.html')}

  <!-- Modular Scripts -->
  <script src="js/pr2-core.js"></script>
  <script src="js/pr2-modals.js"></script>
  <script src="js/pr2-exp1.js"></script>
  <script src="js/pr2-exp2.js"></script>
  <script src="js/pr2-exp3.js"></script>
  <script src="js/pr2-exp4.js"></script>
  <script src="js/pr2-exp5.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'pr2.html'), html, 'utf8');
console.log('Successfully assembled pr2.html from modular steps!');
