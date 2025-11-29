// Automatyczne skalowanie zawartości do 1080x1920px
let currentScale = 1;
let isScaling = false;

function autoScaleContent() {
  // Sprawdź czy jesteśmy w trybie TV
  const urlParams = new URLSearchParams(window.location.search);
  const isTVMode = urlParams.has('tv');
  
  // Autoscale tylko w trybie TV
  if (!isTVMode) return;
  
  const menuPreview = document.getElementById('menu-preview');
  const menuContainer = document.querySelector('.tv-screen .menu-container');
  
  if (!menuPreview || !menuContainer || isScaling) return;
  
  isScaling = true;
  
  // Użyj requestAnimationFrame dla płynności
  requestAnimationFrame(() => {
    const containerHeight = 1920; // Pełna wysokość kontenera
    const contentHeight = menuPreview.scrollHeight;
    
    let newScale = 1;
    
    if (contentHeight > containerHeight) {
      // Oblicz nową skalę
      newScale = containerHeight / contentHeight;
    }
    
    // Zastosuj skalę tylko jeśli się zmieniła
    if (Math.abs(newScale - currentScale) > 0.001) {
      currentScale = newScale;
      menuPreview.style.transformOrigin = 'top center';
      menuPreview.style.transform = `scale(${newScale})`;
      
      if (newScale < 1) {
        const scaledHeight = contentHeight * newScale;
        menuPreview.style.height = `${contentHeight}px`;
        menuPreview.style.marginBottom = `${(contentHeight - scaledHeight)}px`;
      } else {
        menuPreview.style.height = 'auto';
        menuPreview.style.marginBottom = '0';
      }
    }
    
    isScaling = false;
  });
}

// Uruchom autoscale po każdej zmianie - TYLKO w trybie TV
const originalRenderPreview = window.renderPreview;
if (originalRenderPreview) {
  window.renderPreview = function() {
    originalRenderPreview();
    // Autoscale tylko w trybie TV
    const urlParams = new URLSearchParams(window.location.search);
    const isTVMode = urlParams.has('tv');
    if (isTVMode) {
      autoScaleContent();
    }
  };
}

// Uruchom przy załadowaniu
window.addEventListener('load', autoScaleContent);
window.addEventListener('resize', autoScaleContent);
