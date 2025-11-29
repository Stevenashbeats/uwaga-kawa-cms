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
  
  // WYŁĄCZONE - użytkownik ma pełną kontrolę przez ustawienia fontów
  console.log('⏭️ Autoscale wyłączony - użyj ustawień fontów w edytorze');
  isScaling = false;
  return;
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
const menuPreviewElement = document.getElementById('menu-preview');
if (menuPreviewElement) {
  observer.observe(menuPreviewElement, { 
    childList: true, 
    subtree: true,
    characterData: true 
  });
}
