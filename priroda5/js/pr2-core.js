/* Core Navigation, Step Indicator, Quizzes, High-DPI Canvas Setup */

// Achievements tracking
const unlockedStars = new Set();
function unlockStar(expNum) {
  if (!unlockedStars.has(expNum)) {
    unlockedStars.add(expNum);
  }
}

// Mini-quiz validation
function checkQuiz(btn, isCorrect, expNum) {
  const container = btn.closest(".quiz-options");
  if (btn.classList.contains("correct") || btn.classList.contains("wrong")) return;
  if (container && container.querySelector(".quiz-btn.correct")) return;

  if (!btn.dataset.original) {
    btn.dataset.original = btn.innerHTML.trim();
  }

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
    unlockStar(expNum);
  } else {
    btn.classList.add("wrong");
    btn.innerHTML = btn.dataset.original + " ❌";
    btn.style.pointerEvents = "none";
  }
}

// Navigation & Tabs
const tabs = ["tab-intro", "tab-exp1", "tab-exp2", "tab-exp3", "tab-exp4", "tab-exp5", "tab-summary"];
let currentTabIndex = 0;

function goToTab(tabId) {
  const idx = tabs.indexOf(tabId);
  if (idx !== -1) currentTabIndex = idx;

  // Update contents
  document.querySelectorAll(".tab-content").forEach(content => {
    content.classList.toggle("active", content.id === tabId);
  });

  // Update bottom indicator
  document.getElementById("currentStepIndicator").textContent = `Крок ${currentTabIndex + 1} з ${tabs.length}`;
  document.getElementById("btnPrevTab").style.visibility = currentTabIndex === 0 ? "hidden" : "visible";
  document.getElementById("btnNextTab").style.visibility = currentTabIndex === tabs.length - 1 ? "hidden" : "visible";
  document.getElementById("btnNextTab").textContent = "Наступна ➡️";

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Redraw canvases with proper sizes
  requestAnimationFrame(() => {
    if (tabId === "tab-exp1" && typeof drawExp1 === "function") drawExp1();
    if (tabId === "tab-exp2" && typeof initExp2 === "function") initExp2();
    if (tabId === "tab-exp3" && typeof initExp3 === "function") initExp3();
    if (tabId === "tab-exp4" && typeof drawExp4 === "function") drawExp4();
    if (tabId === "tab-exp5" && typeof drawExp5 === "function") drawExp5();
  });
}

function navStep(direction) {
  const nextIndex = currentTabIndex + direction;
  if (nextIndex >= 0 && nextIndex < tabs.length) {
    goToTab(tabs[nextIndex]);
  }
}

// Equipment checklist dummy handler
function toggleEquip(item) {}

/* HELPER: High-DPI Canvas Setup */
function getContextScaled(canvas, defaultH = 205) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const cssW = rect.width > 50 ? rect.width : (window.innerWidth < 500 ? window.innerWidth - 10 : 580);
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

// Window resize & load handlers
window.addEventListener("resize", () => {
  if (typeof drawExp1 === "function") drawExp1();
  if (typeof drawExp2 === "function") drawExp2();
  if (typeof drawExp3 === "function") drawExp3();
  if (typeof drawExp4 === "function") drawExp4();
  if (typeof drawExp5 === "function") drawExp5();
});

window.addEventListener("load", () => {
  if (typeof drawExp1 === "function") drawExp1();
  if (typeof initExp2 === "function") initExp2();
  if (typeof initExp3 === "function") initExp3();
  if (typeof drawExp4 === "function") drawExp4();
  if (typeof drawExp5 === "function") drawExp5();
});
