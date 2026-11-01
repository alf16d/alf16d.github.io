/* Modals: Notebook scans and video */
const scanModal = document.getElementById("scanModal");
const modalScanImg = document.getElementById("modalScanImg");
const btnScanModal = document.getElementById("btnScanModal");
if (btnScanModal) {
  btnScanModal.addEventListener("click", () => {
    scanModal.classList.add("open");
  });
}
function closeScanModal() {
  if (scanModal) scanModal.classList.remove("open");
}
function showScanPage(pg) {
  if (modalScanImg) modalScanImg.src = pg === 17 ? "page_17.jpg" : "page_18.jpg";
}

const videoModal = document.getElementById("videoModal");
const videoPlayer = document.getElementById("videoPlayer");
const btnVideoModal = document.getElementById("btnVideoModal");
if (btnVideoModal) {
  btnVideoModal.addEventListener("click", () => {
    videoModal.classList.add("open");
  });
}
function closeVideoModal() {
  if (videoModal) videoModal.classList.remove("open");
  if (videoPlayer) videoPlayer.pause();
}
