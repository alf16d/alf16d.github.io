/* Core Navigation, High-DPI Canvas Helper, Quizzes & State for PR3 */

// Tabs in PR3
const pr3Tabs = ["tab-intro", "tab-exp1", "tab-exp2", "tab-exp3", "tab-exp4", "tab-summary"];
let currentTabIndex = 0;

// Quiz and achievements
const pr3UnlockedStars = new Set();
function unlockStarPR3(expNum) {
  pr3UnlockedStars.add(expNum);
}

// Mini-quiz validation helper
function checkQuiz(btn, isCorrect, expNum, feedbackText = "") {
  const container = btn.closest(".quiz-options");
  const parentQuiz = btn.closest(".mini-quiz");
  if (btn.classList.contains("correct") || btn.classList.contains("wrong")) return;
  if (container && container.querySelector(".quiz-btn.correct")) return;

  if (!btn.dataset.original) {
    btn.dataset.original = btn.innerHTML.trim();
  }

  const feedbackEl = parentQuiz ? parentQuiz.querySelector(".quiz-feedback") : null;

  if (isCorrect) {
    btn.classList.remove("wrong");
    btn.classList.add("correct");
    btn.innerHTML = btn.dataset.original + " ✅";
    if (container) {
      container.querySelectorAll(".quiz-btn").forEach(b => {
        if (b !== btn) {
          b.style.pointerEvents = "none";
          b.style.opacity = "0.45";
        }
      });
    }
    if (feedbackEl) {
      feedbackEl.style.display = "block";
      if (feedbackText) feedbackEl.innerHTML = "💡 " + feedbackText;
    }
    unlockStarPR3(expNum);
  } else {
    btn.classList.add("wrong");
    btn.innerHTML = btn.dataset.original + " ❌";
    btn.style.pointerEvents = "none";
  }
}

// Tab navigation
function goToTab(tabId) {
  const idx = pr3Tabs.indexOf(tabId);
  if (idx !== -1) currentTabIndex = idx;

  document.querySelectorAll(".tab-content").forEach(content => {
    content.classList.toggle("active", content.id === tabId);
  });

  const indicator = document.getElementById("currentStepIndicator");
  if (indicator) {
    indicator.textContent = `Крок ${currentTabIndex + 1} з ${pr3Tabs.length}`;
  }

  const btnPrev = document.getElementById("btnPrevTab");
  const btnNext = document.getElementById("btnNextTab");
  if (btnPrev) btnPrev.style.visibility = currentTabIndex === 0 ? "hidden" : "visible";
  if (btnNext) {
    btnNext.style.visibility = currentTabIndex === pr3Tabs.length - 1 ? "hidden" : "visible";
    btnNext.textContent = "Наступна ➡️";
  }

  window.scrollTo({ top: 0, behavior: "smooth" });

  requestAnimationFrame(() => {
    if (tabId === "tab-exp1" && typeof drawExp1 === "function") drawExp1();
    if (tabId === "tab-exp2" && typeof drawExp2 === "function") drawExp2();
    if (tabId === "tab-exp3" && typeof initExp3 === "function") initExp3();
    if (tabId === "tab-exp4" && typeof drawExp4 === "function") drawExp4();
  });
}

function navStep(direction) {
  const nextIndex = currentTabIndex + direction;
  if (nextIndex >= 0 && nextIndex < pr3Tabs.length) {
    goToTab(pr3Tabs[nextIndex]);
  }
}

// High-DPI canvas helper
function getContextScaled(canvas, defaultH = 220) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const cssW = rect.width > 50 ? rect.width : (window.innerWidth < 500 ? window.innerWidth - 16 : 580);
  const cssH = rect.height > 50 ? rect.height : defaultH;
  if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  return { ctx, w: cssW, h: cssH };
}

// Equipment Checklist toggle
function toggleEquip(item) {
  item.classList.toggle("checked");
}

// Self-assessment selection handler
function selectSelfAssess(element, level) {
  document.querySelectorAll(".self-assess-item").forEach(el => el.classList.remove("selected"));
  element.classList.add("selected");
  const note = document.getElementById("selfAssessFeedback");
  if (note) {
    const messages = [
      "💪 Нічого страшного! Завдяки цьому практикуму ти крок за кроком усе засвоїш!",
      "👍 Чудовий початок! З невеликими підказками в тебе все виходить як слід!",
      "🌟 Дуже добрий результат! Ти майже самостійно впорався з усіма завданнями!",
      "🏆 Відмінно! Ти справжній юний дослідник природи, матеріал засвоєно на всі 100%!"
    ];
    note.textContent = messages[level - 1] || "Оцінка збережена!";
    note.style.display = "block";
  }
}

// Window resize re-render
window.addEventListener("resize", () => {
  const currentTab = pr3Tabs[currentTabIndex];
  if (currentTab === "tab-exp1" && typeof drawExp1 === "function") drawExp1();
  if (currentTab === "tab-exp2" && typeof drawExp2 === "function") drawExp2();
  if (currentTab === "tab-exp3" && typeof initExp3 === "function") initExp3();
  if (currentTab === "tab-exp4" && typeof drawExp4 === "function") drawExp4();
});

document.addEventListener("DOMContentLoaded", () => {
  goToTab("tab-intro");
});
