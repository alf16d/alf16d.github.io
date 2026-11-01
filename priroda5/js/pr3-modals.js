/* Modals: Notebook scans (page 22, 23) and video for PR3 */

const scanModal = document.getElementById("scanModal");
const modalScanImg = document.getElementById("modalScanImg");
const btnScanModal = document.getElementById("btnScanModal");

if (btnScanModal) {
  btnScanModal.addEventListener("click", () => {
    if (scanModal) scanModal.classList.add("open");
  });
}

function closeScanModal() {
  if (scanModal) scanModal.classList.remove("open");
}

function showScanPage(pg) {
  if (modalScanImg) {
    modalScanImg.src = pg === 23 ? "page_23.jpg" : "page_22.jpg";
    document.querySelectorAll(".scan-page-btn").forEach(b => {
      b.classList.toggle("btn-primary", b.dataset.page == pg);
      b.classList.toggle("btn-secondary", b.dataset.page != pg);
    });
  }
}

const videoModal = document.getElementById("videoModal");
const videoPlayer = document.getElementById("videoPlayer");
const btnVideoModal = document.getElementById("btnVideoModal");

if (btnVideoModal) {
  btnVideoModal.addEventListener("click", () => {
    if (videoModal) videoModal.classList.add("open");
  });
}

function closeVideoModal() {
  if (videoModal) videoModal.classList.remove("open");
  if (videoPlayer) videoPlayer.pause();
}
