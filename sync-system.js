// System synchronizacji danych między edytorem a telewizorami

// Zapisz stan do localStorage
function saveToLocalStorage() {
  try {
    localStorage.setItem('uwaga-kawa-menu-data', JSON.stringify(appState));
    localStorage.setItem('uwaga-kawa-last-update', Date.now().toString());
  } catch (e) {
    console.error('Błąd zapisu do localStorage:', e);
  }
}

// Wczytaj stan z localStorage
function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem('uwaga-kawa-menu-data');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Zachowaj currentTvId jeśli jest ustawiony z URL
      const currentTvId = appState.currentTvId;
      appState = parsed;
      if (currentTvId) {
        appState.currentTvId = currentTvId;
      }
      return true;
    }
  } catch (e) {
    console.error('Błąd odczytu z localStorage:', e);
  }
  return false;
}

// Nasłuchuj zmian w localStorage (synchronizacja między kartami)
window.addEventListener('storage', (e) => {
  if (e.key === 'uwaga-kawa-menu-data') {
    console.log('Wykryto zmianę danych - odświeżanie...');
    loadFromLocalStorage();
    
    const params = new URLSearchParams(window.location.search);
    const isTVMode = params.get("tv") === "1";
    
    if (isTVMode) {
      // Tryb TV - tylko odśwież podgląd
      if (typeof renderPreview === 'function') {
        renderPreview();
      }
    } else {
      // Tryb edytora - odśwież edytor i podgląd
      if (typeof renderEditor === 'function') {
        renderEditor();
      }
      if (typeof renderPreview === 'function') {
        renderPreview();
      }
      if (typeof updateTvSelector === 'function') {
        updateTvSelector();
      }
    }
  }
});

// Auto-save przy każdej zmianie
let saveTimeout;
function autoSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveToLocalStorage();
  }, 500); // Debounce 500ms
}

// Nadpisz funkcje renderowania, żeby zapisywały stan
const originalRenderPreview = window.renderPreview;
if (originalRenderPreview) {
  window.renderPreview = function() {
    originalRenderPreview();
    autoSave();
  };
}

// Generuj unikalne linki dla każdego TV
function generateTvLink(tvId) {
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set("tv", "1");
  url.searchParams.set("tvid", tvId);
  return url.toString();
}

// Inicjalizacja przy starcie
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const tvid = params.get("tvid");
  const isTVMode = params.get("tv") === "1";
  
  // Wczytaj z localStorage jeśli nie ma danych w URL
  if (!params.get("d")) {
    const loaded = loadFromLocalStorage();
    if (loaded && tvid && appState.tvs && appState.tvs[tvid]) {
      appState.currentTvId = tvid;
    }
  }
  
  // W trybie TV ustaw currentTvId z URL
  if (isTVMode && tvid && appState.tvs && appState.tvs[tvid]) {
    appState.currentTvId = tvid;
  }
  
  // Zapisz początkowy stan
  saveToLocalStorage();
});

// Eksportuj funkcje
window.saveToLocalStorage = saveToLocalStorage;
window.loadFromLocalStorage = loadFromLocalStorage;
window.generateTvLink = generateTvLink;
