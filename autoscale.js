// Automatyczne skalowanie zawartości do 720x1280px
function autoScaleContent() {
  const menuPreview = document.getElementById('menu-preview');
  const menuContainer = document.querySelector('.tv-screen .menu-container');
  
  if (!menuPreview || !menuContainer) return;
  
  // Resetuj transform
  menuPreview.style.transform = 'scale(1)';
  menuPreview.style.transformOrigin = 'top center';
  
  // Poczekaj na render
  setTimeout(() => {
    const containerHeight = 1280; // Pełna wysokość kontenera (720x1280)
    const contentHeight = menuPreview.scrollHeight;
    
    if (contentHeight > containerHeight) {
      // Oblicz skalę
      const scale = containerHeight / contentHeight;
      menuPreview.style.transform = `scale(${scale})`;
      
      // Dostosuj wysokość kontenera
      const scaledHeight = contentHeight * scale;
      menuPreview.style.height = `${contentHeight}px`;
      menuPreview.style.marginBottom = `${(contentHeight - scaledHeight)}px`;
    } else {
      menuPreview.style.transform = 'scale(1)';
      menuPreview.style.height = 'auto';
      menuPreview.style.marginBottom = '0';
    }
  }, 100);
}

// Uruchom autoscale po każdej zmianie
const originalRenderPreview = window.renderPreview;
if (originalRenderPreview) {
  window.renderPreview = function() {
    originalRenderPreview();
    autoScaleContent();
  };
}

// Uruchom przy załadowaniu
window.addEventListener('load', autoScaleContent);
window.addEventListener('resize', autoScaleContent);
