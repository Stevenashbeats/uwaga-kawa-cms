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
    const paddingTop = 60; // padding górny
    const paddingBottom = 60; // padding dolny
    const safetyMargin = 40; // dodatkowy margines bezpieczeństwa
    
    // Dostępna wysokość z marginesami
    const availableHeight = containerHeight - paddingTop - paddingBottom - safetyMargin;
    
    // Pobierz rzeczywistą wysokość zawartości (przed skalowaniem)
    menuPreview.style.transform = 'scale(1)';
    menuPreview.style.height = 'auto';
    
    // Poczekaj na przeliczenie layoutu
    setTimeout(() => {
      const contentHeight = Math.max(
        menuPreview.scrollHeight,
        menuPreview.offsetHeight,
        menuPreview.getBoundingClientRect().height
      );
      
      console.log(`📏 Autoscale: available=${availableHeight}px, content=${contentHeight}px`);
      
      let newScale = 1;
      
      // ZAWSZE skaluj jeśli zawartość jest większa niż dostępna wysokość
      if (contentHeight > availableHeight) {
        // Oblicz skalę aby zmieścić zawartość
        newScale = availableHeight / contentHeight;
        // Dodatkowe zmniejszenie o 2% dla pewności
        newScale = newScale * 0.98;
        console.log(`🔽 Skalowanie do ${Math.round(newScale * 100)}%`);
      }
      
      // ZAWSZE zastosuj skalę
      currentScale = newScale;
      menuPreview.style.transformOrigin = 'top center';
      menuPreview.style.transform = `scale(${newScale})`;
      
      if (newScale < 1) {
        // Ustaw wysokość i ujemny margin aby zawartość nie wychodziła poza
        const scaledHeight = contentHeight * newScale;
        menuPreview.style.height = `${contentHeight}px`;
        menuPreview.style.marginBottom = `-${(contentHeight - scaledHeight)}px`;
      } else {
        menuPreview.style.height = 'auto';
        menuPreview.style.marginBottom = '0';
      }
      
      isScaling = false;
    }, 50);
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
