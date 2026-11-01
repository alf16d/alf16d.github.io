/* Core Navigation & Helpers for Practical Work #4 */

const pr4Tabs = ["tab-intro", "tab-granite", "tab-chalk", "tab-coal", "tab-table", "tab-summary"];
let currentTabIndex = 0;

const pr4UnlockedStars = new Set();
function unlockStarPR4(expNum) {
  pr4UnlockedStars.add(expNum);
}

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
    unlockStarPR4(expNum);
  } else {
    btn.classList.add("wrong");
    btn.innerHTML = btn.dataset.original + " ❌";
    btn.style.pointerEvents = "none";
  }
}

function goToTab(tabId) {
  const idx = pr4Tabs.indexOf(tabId);
  if (idx !== -1) currentTabIndex = idx;

  document.querySelectorAll(".tab-content").forEach(content => {
    content.classList.toggle("active", content.id === tabId);
  });

  const indicator = document.getElementById("currentStepIndicator");
  if (indicator) {
    indicator.textContent = `Крок ${currentTabIndex + 1} з ${pr4Tabs.length}`;
  }

  const btnPrev = document.getElementById("btnPrevTab");
  const btnNext = document.getElementById("btnNextTab");
  if (btnPrev) btnPrev.style.visibility = currentTabIndex === 0 ? "hidden" : "visible";
  if (btnNext) {
    btnNext.style.visibility = currentTabIndex === pr4Tabs.length - 1 ? "hidden" : "visible";
    btnNext.textContent = "Наступна ➡️";
  }

  window.scrollTo({ top: 0, behavior: "smooth" });

  requestAnimationFrame(() => {
    if (tabId === "tab-granite" && typeof drawRock === "function") drawRock("granite");
    if (tabId === "tab-chalk" && typeof drawRock === "function") drawRock("chalk");
    if (tabId === "tab-coal" && typeof drawRock === "function") drawRock("coal");
  });
}

function navStep(direction) {
  const nextIndex = currentTabIndex + direction;
  if (nextIndex >= 0 && nextIndex < pr4Tabs.length) {
    goToTab(pr4Tabs[nextIndex]);
  }
}

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

function toggleEquip(item) {
  item.classList.toggle("checked");
}

function selectSelfAssess(element, level) {
  document.querySelectorAll(".self-assess-item").forEach(el => el.classList.remove("selected"));
  element.classList.add("selected");
  const note = document.getElementById("selfAssessFeedback");
  if (note) {
    const messages = [
      "💪 Нічого страшного! Завдяки цьому практикуму ти розберешся у всіх гірських породах!",
      "👍 Добрий початок! З невеликою допомогою вчителя все виходить чудово!",
      "🌟 Дуже гарний результат! Властивості мінералів досліджено майже самостійно!",
      "🏆 Відмінно! Ти справжній юний геолог, усі гірські породи вивчено на 100%!"
    ];
    note.textContent = messages[level - 1] || "Оцінка збережена!";
    note.style.display = "block";
  }
}

window.addEventListener("resize", () => {
  const currentTab = pr4Tabs[currentTabIndex];
  if (currentTab === "tab-granite" && typeof drawRock === "function") drawRock("granite");
  if (currentTab === "tab-chalk" && typeof drawRock === "function") drawRock("chalk");
  if (currentTab === "tab-coal" && typeof drawRock === "function") drawRock("coal");
});

document.addEventListener("DOMContentLoaded", () => {
  goToTab("tab-intro");
});
