// Zarządzanie linkami dla telewizorów

window.addEventListener('DOMContentLoaded', () => {
  const tv1Link = document.getElementById('tv1-link');
  const tv2Link = document.getElementById('tv2-link');
  const copyTv1Btn = document.getElementById('copy-tv1-btn');
  const copyTv2Btn = document.getElementById('copy-tv2-btn');
  
  if (!tv1Link || !tv2Link) return;
  
  // Generuj linki
  function generateLinks() {
    const baseUrl = window.location.origin + window.location.pathname;
    
    tv1Link.value = `${baseUrl}?tv=1&tvid=tv1`;
    tv2Link.value = `${baseUrl}?tv=1&tvid=tv2`;
  }
  
  // Kopiuj link TV1
  if (copyTv1Btn) {
    copyTv1Btn.addEventListener('click', () => {
      tv1Link.select();
      document.execCommand('copy');
      copyTv1Btn.textContent = '✓';
      setTimeout(() => {
        copyTv1Btn.textContent = '📋';
      }, 2000);
    });
  }
  
  // Kopiuj link TV2
  if (copyTv2Btn) {
    copyTv2Btn.addEventListener('click', () => {
      tv2Link.select();
      document.execCommand('copy');
      copyTv2Btn.textContent = '✓';
      setTimeout(() => {
        copyTv2Btn.textContent = '📋';
      }, 2000);
    });
  }
  
  // Generuj linki przy starcie
  generateLinks();
});
