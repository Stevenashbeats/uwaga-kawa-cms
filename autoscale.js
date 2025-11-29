// Automatyczne skalowanie zawartości do 1080x1920px
let currentScale = 1;
let isScaling = false;

function autoScaleContent() {
  // Sprawdź czy jesteśmy w trybie TV lub edytorze z podglądem
  const urlParams = new URLSearchParams(window.location.search);
  const isTVMode = urlParams.has('tv');
  const isEditor = !isTVMode; // Jeśli nie TV, to edytor
  
  // Autoscale działa WSZĘDZIE (TV i edytor)
  console.log(`🎯 Autoscale START: tryb=${isTVMode ? 'TV' : 'Edytor'}, timestamp=${Date.now()}`);
  
  const menuPreview = document.getElementById('menu-preview');
  const menuContainer = document.querySelector('.tv-screen .menu-container');
  
  if (!menuPreview || !menuContainer) {
    console.log('⏭️ Autoscale: pomijam - brak elementów');
    return;
  }
  
  if (isScaling) {
    console.log('⏭️ Autoscale: pomijam - już skaluje');
    return;
  }
  
  isScaling = true;
  
  // Płynne skalowanie w czasie rzeczywistym
  requestAnimationFrame(() => {
    // Usuń transition tymczasowo dla dokładnego pomiaru
    const oldTransition = menuPreview.style.transition;
    menuPreview.style.transition = 'none';
    
    // Resetuj transform do pomiaru
    menuPreview.style.transform = 'scale(1)';
    menuPreview.style.height = 'auto';
    menuPreview.style.marginBottom = '0';
    
    // Force reflow
    void menuPreview.offsetHeight;
    
    // Zmierz rzeczywistą wysokość
    const contentHeight = menuPreview.scrollHeight;
    const maxHeight = 1800; // 1920 - 60 (top) - 60 (bottom)
    
    console.log(`📏 Autoscale: maxHeight=${maxHeight}px, contentHeight=${contentHeight}px`);
    
    let newScale = 1;
    
    // Oblicz skalę z małym marginesem
    if (contentHeight > maxHeight) {
      newScale = (maxHeight / contentHeight) * 0.98; // 2% margines
      console.log(`🔽 Skalowanie do ${Math.round(newScale * 100)}%`);
    } else {
      console.log(`✅ Zawartość mieści się bez skalowania`);
    }
    
    // Przywróć transition dla płynności
    menuPreview.style.transition = oldTransition || 'transform 0.3s ease-out, opacity 0.3s ease-in-out';
    
    // Zastosuj transform
    currentScale = newScale;
    menuPreview.style.transform = `scale(${newScale})`;
    menuPreview.style.transformOrigin = 'top center';
    
    // Ustaw wysokość aby nie wychodziło poza
    if (newScale < 1) {
      const scaledHeight = contentHeight * newScale;
      menuPreview.style.height = `${contentHeight}px`;
      menuPreview.style.marginBottom = `-${Math.round(contentHeight - scaledHeight)}px`;
      console.log(`📐 height=${contentHeight}px, marginBottom=-${Math.round(contentHeight - scaledHeight)}px`);
    } else {
      menuPreview.style.height = 'auto';
      menuPreview.style.marginBottom = '0';
    }
    
    isScaling = false;
  });
}

// Uruchom autoscale po każdej zmianie - WSZĘDZIE (TV i edytor)
// Opóźnij aby window.renderPreview było zdefiniowane
setTimeout(() => {
  const originalRenderPreview = window.renderPreview;
  if (originalRenderPreview) {
    window.renderPreview = function() {
      originalRenderPreview();
      // Autoscale zawsze po renderze
      console.log('🎨 renderPreview wywołany - uruchamiam autoscale');
      setTimeout(autoScaleContent, 100);
    };
    console.log('✅ Autoscale podpięty do renderPreview');
  } else {
    console.warn('⚠️ window.renderPreview nie istnieje');
  }
}, 100);

// Uruchom przy załadowaniu
window.addEventListener('load', () => {
  // Opóźnienie aby DOM się wyrenderował
  setTimeout(autoScaleContent, 100);
  setTimeout(autoScaleContent, 500);
});
window.addEventListener('resize', autoScaleContent);

// Dodaj MutationObserver aby wykrywać zmiany w DOM - WSZĘDZIE
const observer = new MutationObserver(() => {
  // Autoscale przy każdej zmianie DOM
  setTimeout(autoScaleContent, 100);
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
