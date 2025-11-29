// Interaktywne kontrolki zoom i pan dla podglądu
let currentZoom = 0.45;
let panX = 0;
let panY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;

function initZoomControls() {
  const previewArea = document.querySelector('.preview-area');
  const tvScreen = document.querySelector('.tv-screen');
  
  if (!previewArea || !tvScreen) return;
  
  // Nie wyśrodkowuj automatycznie - app.js zrobi to po załadowaniu danych
  // centerPreview();
  
  // Zoom za pomocą scroll (Ctrl/Cmd + scroll lub pinch)
  previewArea.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      currentZoom = Math.max(0.1, Math.min(2, currentZoom + delta));
      
      updateTransform();
    }
  }, { passive: false });
  
  // Drag do przesuwania (jak magic mouse)
  previewArea.addEventListener('mousedown', (e) => {
    // Tylko jeśli nie kliknięto w edytor
    if (e.target.closest('.editor-sidebar')) return;
    
    isDragging = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
    previewArea.style.cursor = 'grabbing';
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    updateTransform();
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      previewArea.style.cursor = 'grab';
    }
  });
  
  // Dodaj cursor grab
  previewArea.style.cursor = 'grab';
  
  // Reset na double click
  previewArea.addEventListener('dblclick', (e) => {
    if (e.target.closest('.editor-sidebar')) return;
    centerPreview();
  });
}

function updateTransform() {
  const tvScreen = document.querySelector('.tv-screen');
  if (!tvScreen) return;
  
  tvScreen.style.transform = `translate(${panX}px, ${panY}px) scale(${currentZoom})`;
  tvScreen.style.transition = 'none';
}

function centerPreview() {
  const previewArea = document.querySelector('.preview-area');
  const tvScreen = document.querySelector('.tv-screen');
  
  if (!previewArea || !tvScreen) return;
  
  // Reset pozycji
  panX = 0;
  panY = 0;
  
  // Pobierz rzeczywiste wymiary obszaru podglądu
  const areaRect = previewArea.getBoundingClientRect();
  const areaWidth = areaRect.width;
  const areaHeight = areaRect.height;
  
  // Wymiary TV (1080x1920)
  const screenWidth = 1080;
  const screenHeight = 1920;
  
  // Oblicz zoom dla szerokości i wysokości z marginesem
  const marginX = 40; // 20px z każdej strony
  const marginY = 40; // 20px góra/dół
  
  const zoomX = (areaWidth - marginX) / screenWidth;
  const zoomY = (areaHeight - marginY) / screenHeight;
  
  // Wybierz mniejszy zoom aby zmieścić całość
  currentZoom = Math.min(zoomX, zoomY);
  
  // Ogranicz zoom do rozsądnych wartości (min 10%, max 100%)
  currentZoom = Math.max(0.1, Math.min(currentZoom, 1.0));
  
  console.log(`📐 Obliczony zoom: ${Math.round(currentZoom * 100)}% (obszar: ${Math.round(areaWidth)}x${Math.round(areaHeight)})`);
  
  tvScreen.style.transition = 'transform 0.3s ease';
  updateTransform();
  
  setTimeout(() => {
    tvScreen.style.transition = 'none';
  }, 300);
}

// Dodaj kontrolki UI
function addZoomUI() {
  const previewArea = document.querySelector('.preview-area');
  if (!previewArea) return;
  
  const controls = document.createElement('div');
  controls.className = 'zoom-controls';
  controls.innerHTML = `
    <button class="zoom-btn" id="zoom-in" title="Zoom in (Ctrl/Cmd + Scroll)">+</button>
    <button class="zoom-btn" id="zoom-out" title="Zoom out (Ctrl/Cmd + Scroll)">−</button>
    <button class="zoom-btn" id="zoom-reset" title="Reset (Double click)">⟲</button>
    <span class="zoom-level">${Math.round(currentZoom * 100)}%</span>
  `;
  
  previewArea.appendChild(controls);
  
  // Obsługa przycisków
  document.getElementById('zoom-in').addEventListener('click', () => {
    currentZoom = Math.min(2, currentZoom + 0.1);
    updateTransform();
    updateZoomLevel();
  });
  
  document.getElementById('zoom-out').addEventListener('click', () => {
    currentZoom = Math.max(0.1, currentZoom - 0.1);
    updateTransform();
    updateZoomLevel();
  });
  
  document.getElementById('zoom-reset').addEventListener('click', () => {
    centerPreview();
    updateZoomLevel();
  });
}

function updateZoomLevel() {
  const zoomLevel = document.querySelector('.zoom-level');
  if (zoomLevel) {
    zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
  }
}

// Inicjalizacja
window.addEventListener('DOMContentLoaded', () => {
  // Tylko w trybie edytora (nie TV)
  if (!document.body.classList.contains('tv-mode')) {
    initZoomControls();
    addZoomUI();
  }
});

// Re-center przy resize okna
window.addEventListener('resize', () => {
  if (!document.body.classList.contains('tv-mode')) {
    centerPreview();
    updateZoomLevel();
  }
});
