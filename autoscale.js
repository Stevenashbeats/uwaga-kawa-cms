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
    
    // Pobierz rzeczywistą wysokość zawartości
    const contentHeight = Math.max(
      menuPreview.scrollHeight,
      menuPreview.offsetHeight,
      menuPreview.getBoundingClientRect().height
    );
    
    console.log(`📏 Autoscale: container=${containerHeight}px, content=${contentHeight}px`);
    
    let newScale = 1;
    
    // Zawsze skaluj jeśli zawartość jest większa, z małym marginesem bezpieczeństwa
    const availableHeight = containerHeight - 120; // 60px padding góra + dół
    if (contentHeight > availableHeight) {
      // Oblicz nową skalę z marginesem
      newScale = availableHeight / contentHeight;
      console.log(`🔽 Skalowanie do ${Math.round(newScale * 100)}%`);
    }
    
    // Zastosuj skalę tylko jeśli się zmieniła
    if (Math.abs(newScale - currentScale) > 0.001) {
      currentScale = newScale;
      menuPreview.style.transformOrigin = 'top center';
      menuPreview.style.transform = `scale(${newScale})`;
      
      if (newScale < 1) {
        const scaledHeight = contentHeight * newScale;
        menuPreview.style.height = `${contentHeight}px`;
        menuPreview.style.marginBottom = `-${(contentHeight - scaledHeight)}px`;
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
window.addEventListener('load', () => {
  // Opóźnienie aby DOM się wyrenderował
  setTimeout(autoScaleContent, 100);
  setTimeout(autoScaleContent, 500);
});
window.addEventListener('resize', autoScaleContent);

// Dodaj MutationObserver aby wykrywać zmiany w DOM
const observer = new MutationObserver(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const isTVMode = urlParams.has('tv');
  if (isTVMode) {
    setTimeout(autoScaleContent, 100);
  }
});

// Obserwuj zmiany w menu-preview
const menuPreview = document.getElementById('menu-preview');
if (menuPreview) {
  observer.observe(menuPreview, { 
    childList: true, 
    subtree: true,
    characterData: true 
  });
}
