function openQrModal() {
      const modal = document.getElementById('qrModal');
      const qrImg = document.getElementById('qrImage');
      const urlText = document.getElementById('currentUrlText');

      // Use target pr2 URL if on root or current page
      let targetUrl = window.location.href;
      if (!targetUrl.includes('pr2.html')) {
        targetUrl = targetUrl.replace(/index\.html$/, '') + 'pr2.html';
      }

      urlText.textContent = targetUrl;
      // Generate clean QR code via fast dynamic API
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=8&data=${encodeURIComponent(targetUrl)}`;
      modal.classList.add('open');
    }

    function closeQrModal() {
      document.getElementById('qrModal').classList.remove('open');
    }

    // Close modal on click outside
    document.getElementById('qrModal').addEventListener('click', (e) => {
      if (e.target.id === 'qrModal') closeQrModal();
    });
