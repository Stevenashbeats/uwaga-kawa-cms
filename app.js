// Flaga niezapisanych zmian
let hasUnsavedChanges = false;

// Oznacz że są niezapisane zmiany
function markAsUnsaved() {
  hasUnsavedChanges = true;
  const statusEl = document.querySelector('.save-info');
  const saveBtn = document.getElementById('save-btn');
  
  if (statusEl) {
    statusEl.textContent = '⚠️ Masz niezapisane zmiany';
    statusEl.style.color = '#ff9800';
  }
  
  if (saveBtn) {
    saveBtn.style.animation = 'pulse 1s infinite';
  }
}

// Oznacz jako zapisane
function markAsSaved() {
  hasUnsavedChanges = false;
  const statusEl = document.querySelector('.save-info');
  const saveBtn = document.getElementById('save-btn');
  
  if (statusEl) {
    statusEl.textContent = '✓ Wszystkie zmiany zapisane';
    statusEl.style.color = '#4CAF50';
    
    setTimeout(() => {
      statusEl.textContent = 'Kliknij "Zapisz zmiany" aby zapisać do bazy danych';
      statusEl.style.color = '#666';
    }, 3000);
  }
  
  if (saveBtn) {
    saveBtn.style.animation = 'none';
  }
}

// Stan aplikacji - Multi-TV
let appState = {
  currentTvId: "tv1",
  tvs: {
    tv1: {
      id: "tv1",
      name: "TV 1 - Napoje",
      venueName: "UWAGA KAWA",
      venueSubtitle: "",
      owner: "kawa",
      sections: [
        {
          id: "kawa",
          title: "KAWA",
          note: "*dodatkowe espresso, mleko roślinne, syrop + 2 zł",
          items: [
            { name: "ESPRESSO / DOPPIO", description: "", price: "6 / 8" },
            { name: "ESPRESSO MACCHIATO", description: "", price: "9" },
            { name: "AMERICANO / Z MLEKIEM", description: "hot / cold", price: "8 / 10" },
            { name: "CAPPUCCINO", description: "hot / cold", price: "14" },
            { name: "FLAT WHITE", description: "hot / cold", price: "15" },
            { name: "CAFFE LATTE", description: "hot / cold", price: "16" },
            { name: "AFFOGATO", description: "", price: "13" },
            { name: "IRISH COFFEE", description: "", price: "24" },
            { name: "ESPRESSO TONIC", description: "", price: "15" }
          ]
        },
        {
          id: "inne",
          title: "INNE NAPOJE",
          note: "",
          items: [
            { name: "HERBATA SZKLANKA / DZBANEK", description: "300 / 750 ml", price: "12 / 15" },
            { name: "HERBATA ZIMOWA", description: "300 ml", price: "20" },
            { name: "MATCHA LATTE", description: "hot / cold", price: "18" },
            { name: "KAKAO MIĘTOWE", description: "", price: "20" },
            { name: "NAPAR IMBIROWO POMARAŃCZOWY", description: "", price: "20" },
            { name: "LEMONIADA WŁASNEJ ROBOTY", description: "", price: "?" },
            { name: "SMOOTHIE", description: "jabłko, pomarańcza, grejpfrut", price: "18" }
          ]
        }
      ]
    },
    tv2: {
      id: "tv2",
      name: "TV 2 - Jedzenie",
      venueName: "UWAGA KAWA",
      venueSubtitle: "",
      owner: "kawa",
      sections: [
        {
          id: "oferta",
          title: "OFERTA PORANNA",
          note: "",
          items: [
            { name: "AUTORSKIE KANAPKI", description: "", price: "10 / 20" },
            { name: "WRAPY", description: "", price: "10 / 20" },
            { name: "BOWL", description: "", price: "18" }
          ]
        },
        {
          id: "slodkosci",
          title: "SŁODKOŚCI",
          note: "",
          items: [
            { name: "CYNAMONKA", description: "", price: "10" },
            { name: "DROŻDŻÓWKA", description: "", price: "10" },
            { name: "CIASTO DOMOWE NA CIEPŁO", description: "GAŁKA LODÓW + 7 ZŁ", price: "10" },
            { name: "LAVA CAKE", description: "PODAWANE Z MUSEM MALINOWYM, GAŁKA LODÓW + 7 ZŁ", price: "10" },
            { name: "NEW YORK CHEESECAKE", description: "", price: "10" },
            { name: "LODY Z GORĄCYMI MALINAMI", description: "", price: "10" }
          ]
        },
        {
          id: "zupy",
          title: "ZUPY OD GODZ. 12",
          note: "",
          items: [
            { name: "ŻUREK", description: "JAJKO + 2 ZŁ, PIECZYWO + 1 ZŁ", price: "15 / 20" },
            { name: "ZUPA KREM", description: "", price: "13 / 18" }
          ]
        },
        {
          id: "wieczorne",
          title: "WIECZORNE MENU OD GODZ. 15",
          note: "",
          items: [
            { name: "PIZZA RZYMSKA NA KAWAŁKI", description: "", price: "15 / 20" },
            { name: "ZAPIEKANKI FIRMOWE", description: "", price: "13 / 18" },
            { name: "QUESADILLA VEGE", description: "", price: "15" }
          ]
        }
      ]
    }
  }
};

// Pomocnicze funkcje
function getCurrentTv() {
  const tv = appState.tvs[appState.currentTvId];
  if (!tv) {
    console.error('❌ getCurrentTv() zwraca undefined!');
    console.error('currentTvId:', appState.currentTvId);
    console.error('Dostępne TV:', Object.keys(appState.tvs));
  }
  return tv;
}

function setCurrentTv(tvId) {
  appState.currentTvId = tvId;
  renderEditor();
  renderPreview();
  updateTvSelector();
}

// Eksportuj appState globalnie dla tv-links.js
window.appState = appState;

// Elementy DOM
const sectionsContainer = document.getElementById("sections-container");
const menuPreview = document.getElementById("menu-preview");
const tvSelector = document.getElementById("tv-selector");
const addTvBtn = document.getElementById("add-tv-btn");
const renameTvBtn = document.getElementById("rename-tv-btn");
const deleteTvBtn = document.getElementById("delete-tv-btn");
const venueNameInput = document.getElementById("venue-name");
const venueSubtitleInput = document.getElementById("venue-subtitle");
const addSectionBtn = document.getElementById("add-section-btn");
const saveBtn = document.getElementById("save-btn");
const generateLinkBtn = document.getElementById("generate-link-btn");
const shareLinkInput = document.getElementById("share-link");
const copyLinkBtn = document.getElementById("copy-link-btn");
const previewArea = document.getElementById("preview-area");

// Inicjalizacja
async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const isTVMode = urlParams.has('tv');
  
  if (isTVMode) {
    // Tryb TV - załaduj stan z API
    document.body.classList.add('tv-mode');
    await loadStateFromURL();
  } else {
    // Tryb edytora - załaduj dane użytkownika
    await loadUserData();
    renderEditor();
    attachGlobalListeners();
    renderPreview();
    
    // Auto-reset zoom po załadowaniu (opóźnienie aby DOM się wyrenderował)
    setTimeout(() => {
      if (typeof centerPreview === 'function') {
        console.log('🔄 Wykonuję auto-reset zoom...');
        centerPreview();
        if (typeof updateZoomLevel === 'function') {
          updateZoomLevel();
        }
      }
    }, 500);
  }
}

// Załaduj dane użytkownika z API
async function loadUserData() {
  if (!window.authManager || !authManager.isLoggedIn()) {
    return;
  }
  
  try {
    // Pobierz listę TV z API
    const tvs = await authManager.apiRequest('/tvs');
    console.log('✅ Pobrano TV z API:', tvs);
    
    if (tvs && tvs.length > 0) {
      // Konwertuj array na object dla kompatybilności
      const tvsObject = {};
      for (const tv of tvs) {
        console.log(`📺 Ładowanie szczegółów TV: ${tv.id}`);
        // Pobierz szczegóły TV z sekcjami i pozycjami
        const tvDetails = await authManager.apiRequest(`/tvs/${tv.id}`);
        console.log(`✅ Szczegóły TV ${tv.id}:`, tvDetails);
        tvsObject[tv.id] = {
          id: tvDetails.id,
          name: tvDetails.name,
          venueName: tvDetails.venue_name,
          venueSubtitle: tvDetails.venue_subtitle || '',
          owner: authManager.getCurrentUser(),
          sections: tvDetails.sections.map(section => ({
            id: section.id,
            title: section.title,
            note: section.note || '',
            items: section.items.map(item => ({
              id: item.id,  // WAŻNE: musimy mieć ID dla edycji
              name: item.name,
              description: item.description || '',
              price: item.price || ''
            }))
          }))
        };
      }
      
      appState.tvs = tvsObject;
      appState.currentTvId = tvs[0].id;
      console.log('✅ Załadowano appState:', appState);
    } else {
      console.log('⚠️ Brak TV - tworzenie domyślnego');
      // Brak TV - utwórz domyślny
      await createDefaultTV();
    }
    
    console.log('🎨 Renderowanie edytora i podglądu...');
    renderEditor();
    renderPreview();
    
    // Generuj linki dla TV
    if (typeof window.generateTVLinks === 'function') {
      console.log('🔗 Generowanie linków TV...');
      window.generateTVLinks();
    }
    
    console.log('✅ Aplikacja załadowana!');
  } catch (error) {
    console.error('❌ Błąd wczytywania danych:', error);
    alert('Błąd wczytywania danych z serwera: ' + error.message);
  }
}

// Utwórz domyślny TV dla nowego użytkownika
async function createDefaultTV() {
  try {
    const displayName = authManager.getDisplayName();
    const tv = await authManager.apiRequest('/tvs', {
      method: 'POST',
      body: JSON.stringify({
        name: `TV ${displayName}`,
        venueName: displayName,
        venueSubtitle: ''
      })
    });
    
    appState.tvs = {
      [tv.id]: {
        id: tv.id,
        name: tv.name,
        venueName: tv.venue_name,
        venueSubtitle: tv.venue_subtitle || '',
        owner: authManager.getCurrentUser(),
        sections: []
      }
    };
    appState.currentTvId = tv.id;
  } catch (error) {
    console.error('Błąd tworzenia TV:', error);
  }
}

// Inicjalizuj domyślne dane dla użytkownika
function initializeUserData() {
  if (!window.authManager || !authManager.isLoggedIn()) {
    return;
  }
  
  const currentUser = authManager.getCurrentUser();
  const userTVs = authManager.getUserTVs();
  
  // Utwórz domyślne TV dla użytkownika
  const newTvs = {};
  
  if (currentUser === 'kawa') {
    // Użytkownik kawa ma istniejące TV1 i TV2
    newTvs.tv1 = appState.tvs.tv1;
    newTvs.tv2 = appState.tvs.tv2;
    appState.currentTvId = 'tv1';
  } else if (currentUser === 'norblin') {
    // Nowy użytkownik norblin
    newTvs.tv_norblin = {
      id: 'tv_norblin',
      name: 'TV Norblin',
      venueName: 'Norblin',
      venueSubtitle: '',
      owner: 'norblin',
      sections: []
    };
    appState.currentTvId = 'tv_norblin';
  } else if (currentUser === 'piwna') {
    // Nowy użytkownik piwna - UWAGA PIWO
    newTvs.tv_piwna = {
      id: 'tv_piwna',
      name: 'TV Piwna - Przekąski',
      venueName: 'UWAGA PIWO',
      venueSubtitle: 'POLISH CRAFT BEER',
      owner: 'piwna',
      sections: [
        {
          id: 'pizza',
          title: 'PIZZA',
          note: 'MARGHERITTA, CAPRICCIOSA, PEPPERONI',
          items: [
            { name: 'PIZZA', description: '', price: '35-42' }
          ]
        },
        {
          id: 'fries',
          title: 'FRIES',
          note: 'FRYTKI, BATAT, ZAKRĘCONE',
          items: [
            { name: 'FRIES', description: '', price: '10-17' }
          ]
        },
        {
          id: 'onion',
          title: 'ONION RINGS',
          note: 'KRĄŻKI CEBULOWE',
          items: [
            { name: 'ONION RINGS', description: '', price: '14' }
          ]
        },
        {
          id: 'wings',
          title: 'BUGGALO WINGS',
          note: 'SKRZYDEŁKA Z KURCZAKA',
          items: [
            { name: 'BUGGALO WINGS', description: '', price: '20' }
          ]
        },
        {
          id: 'kielbasa',
          title: 'KIEŁBASA',
          note: 'POLISH SAUSAGE / POLSKA KIEŁBASA',
          items: [
            { name: 'KIEŁBASA', description: '', price: '14' }
          ]
        },
        {
          id: 'grissini',
          title: 'GRISSINI',
          note: 'PALUCHY SEROWE / BREAD STICKS WITH CHEESE',
          items: [
            { name: 'GRISSINI', description: '', price: '14' }
          ]
        }
      ]
    };
    appState.currentTvId = 'tv_piwna';
  }
  
  appState.tvs = newTvs;
  saveUserData();
}

// Zapisz dane użytkownika - teraz przez API
// Każda akcja zapisuje bezpośrednio przez API, więc ta funkcja jest pusta
function saveUserData() {
  // Deprecated - używamy bezpośrednich wywołań API
  // Zostawione dla kompatybilności wstecznej
}

// Eksportuj funkcję do użycia w auth.js
window.loadUserData = loadUserData;

// Wczytaj stan z URL - TRYB TV (publiczny, bez autoryzacji)
async function loadStateFromURL() {
  const params = new URLSearchParams(window.location.search);
  const tvid = params.get("tvid");
  
  if (!tvid) {
    console.error("❌ Brak tvid w URL!");
    return;
  }

  try {
    console.log(`📺 Tryb TV - ładowanie danych dla TV: ${tvid}`);
    
    // Określ API URL
    const apiUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
      ? 'http://localhost:8787/api'
      : 'https://uwaga-kawa-cms.nashpillow.workers.dev/api';
    
    // Pobierz szczegóły TV z API (publiczny endpoint)
    const response = await fetch(`${apiUrl}/tvs/${tvid}/public`);
    if (!response.ok) {
      throw new Error('Nie można załadować danych TV');
    }
    const tvDetails = await response.json();
    console.log('✅ Dane TV załadowane:', tvDetails);
    
    // Ustaw appState
    appState.tvs = {
      [tvid]: {
        id: tvDetails.id,
        name: tvDetails.name,
        venueName: tvDetails.venue_name || '',
        venueSubtitle: tvDetails.venue_subtitle || '',
        sections: tvDetails.sections.map(section => ({
          id: section.id,
          title: section.title,
          note: section.note || '',
          items: section.items.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description || '',
            price: item.price || ''
          }))
        }))
      }
    };
    appState.currentTvId = tvid;
    
    // Eksportuj do window
    window.appState = appState;
    
    console.log('✅ AppState ustawiony dla trybu TV');
    console.log('📊 appState:', appState);
    console.log('📺 currentTv:', getCurrentTv());
    console.log('🎨 menuPreview element:', menuPreview);
    
    renderPreview();
    console.log('✅ renderPreview() zakończone');
    
    // Sprawdzaj zmiany co 2 sekundy
    let lastDataHash = JSON.stringify(tvDetails.sections);
    
    setInterval(async () => {
      try {
        console.log('🔄 Sprawdzam aktualizacje...');
        // Określ API URL
        const apiUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
          ? 'http://localhost:8787/api'
          : 'https://uwaga-kawa-cms.nashpillow.workers.dev/api';
        
        // Pobierz nowe dane
        const response = await fetch(`${apiUrl}/tvs/${tvid}/public`);
        if (!response.ok) {
          console.error('❌ Błąd pobierania danych:', response.status);
          return;
        }
        
        const tvDetails = await response.json();
        const newDataHash = JSON.stringify(tvDetails.sections);
        
        // Jeśli dane się zmieniły, odśwież
        if (newDataHash !== lastDataHash) {
          console.log('📝 Wykryto zmiany - odświeżam widok');
          console.log('Old hash:', lastDataHash.substring(0, 50) + '...');
          console.log('New hash:', newDataHash.substring(0, 50) + '...');
          lastDataHash = newDataHash;
          
          // Aktualizuj dane
          appState.tvs[tvid].venueName = tvDetails.venue_name || '';
          appState.tvs[tvid].venueSubtitle = tvDetails.venue_subtitle || '';
          appState.tvs[tvid].sections = tvDetails.sections.map(section => ({
            id: section.id,
            title: section.title,
            note: section.note || '',
            items: section.items.map(item => ({
              id: item.id,
              name: item.name,
              description: item.description || '',
              price: item.price || ''
            }))
          }));
          
          window.appState = appState;
          
          // Dodaj fade efekt
          const preview = document.getElementById('menu-preview');
          if (preview) {
            preview.style.opacity = '0';
            setTimeout(() => {
              renderPreview();
              preview.style.opacity = '1';
              // Wywołaj autoscale po renderze
              if (typeof autoScaleContent === 'function') {
                setTimeout(autoScaleContent, 200);
              }
            }, 150);
          } else {
            renderPreview();
            // Wywołaj autoscale po renderze
            if (typeof autoScaleContent === 'function') {
              setTimeout(autoScaleContent, 200);
            }
          }
        }
      } catch (e) {
        console.error('❌ Błąd odświeżania:', e);
      }
    }, 2000);
    
  } catch (e) {
    console.error("❌ Błąd ładowania danych TV:", e);
  }
}

// Zapisz stan do URL
function saveStateToURL() {
  const encoded = btoa(encodeURIComponent(JSON.stringify(appState)));
  const url = new URL(window.location.href);
  url.searchParams.set("d", encoded);
  return url.toString();
}

// Pobierz aktualny stan z formularza
function getStateFromForm() {
  return appState;
}

// Zakoduj stan do stringa
function encodeState(state) {
  return btoa(encodeURIComponent(JSON.stringify(state)));
}

// Renderuj edytor
function renderEditor() {
  const currentTv = getCurrentTv();
  if (!currentTv) {
    console.error('❌ renderEditor: brak currentTv');
    return;
  }
  
  // Aktualizuj selector TV
  updateTvSelector();
  
  if (venueNameInput) venueNameInput.value = currentTv.venueName || '';
  if (venueSubtitleInput) venueSubtitleInput.value = currentTv.venueSubtitle || '';

  sectionsContainer.innerHTML = "";
  currentTv.sections.forEach((section, sectionIndex) => {
    const card = createSectionCard(section, sectionIndex);
    sectionsContainer.appendChild(card);
  });
}

// Utwórz kartę sekcji
function createSectionCard(section, sectionIndex) {
  const card = document.createElement("div");
  card.className = "section-card";

  const header = document.createElement("div");
  header.className = "section-card-header";

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = section.title;
  titleInput.addEventListener("input", (e) => {
    const newTitle = e.target.value;
    getCurrentTv().sections[sectionIndex].title = newTitle;
    renderPreview();
    markAsUnsaved();
  });

  const actions = document.createElement("div");
  actions.className = "section-actions";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "icon-btn";
  deleteBtn.textContent = "🗑️";
  deleteBtn.title = "Usuń sekcję";
  deleteBtn.addEventListener("click", async () => {
    if (!confirm(`Czy na pewno chcesz usunąć sekcję "${section.title}"?`)) {
      return;
    }

    try {
      await authManager.apiRequest(`/sections/${section.id}`, {
        method: 'DELETE'
      });

      getCurrentTv().sections.splice(sectionIndex, 1);
      renderEditor();
      renderPreview();
    } catch (error) {
      console.error('Błąd usuwania sekcji:', error);
      alert('Błąd usuwania sekcji: ' + error.message);
    }
  });

  actions.appendChild(deleteBtn);
  header.appendChild(titleInput);
  header.appendChild(actions);
  card.appendChild(header);

  // Notatka sekcji
  const noteField = document.createElement("div");
  noteField.className = "field";
  const noteLabel = document.createElement("label");
  noteLabel.textContent = "Notatka (opcjonalna)";
  const noteInput = document.createElement("input");
  noteInput.type = "text";
  noteInput.value = section.note || "";
  noteInput.placeholder = "np. *dodatkowe espresso + 2 zł";
  noteInput.addEventListener("input", (e) => {
    const newNote = e.target.value;
    getCurrentTv().sections[sectionIndex].note = newNote;
    renderPreview();
    markAsUnsaved();
  });
  noteField.appendChild(noteLabel);
  noteField.appendChild(noteInput);
  card.appendChild(noteField);

  // Lista pozycji
  const itemsList = document.createElement("div");
  itemsList.className = "items-list";

  section.items.forEach((item, itemIndex) => {
    const itemRow = createItemRow(item, sectionIndex, itemIndex);
    itemsList.appendChild(itemRow);
  });

  card.appendChild(itemsList);

  // Przycisk dodaj pozycję
  const addItemBtn = document.createElement("button");
  addItemBtn.className = "add-btn";
  addItemBtn.textContent = "+ Dodaj pozycję";
  addItemBtn.addEventListener("click", async () => {
    console.log('🆕 Kliknięto Dodaj pozycję');
    console.log('📋 Sekcja:', section);
    
    try {
      console.log(`📤 Wysyłam POST /api/sections/${section.id}/items`);
      
      // Utwórz pozycję w API
      const item = await authManager.apiRequest(`/sections/${section.id}/items`, {
        method: 'POST',
        body: JSON.stringify({
          name: "Nowa pozycja",
          description: "",
          price: ""
        })
      });

      console.log('✅ Pozycja utworzona w API:', item);

      // Dodaj do lokalnego state
      getCurrentTv().sections[sectionIndex].items.push({
        id: item.id,
        name: item.name,
        description: item.description || "",
        price: item.price || ""
      });

      console.log('✅ Pozycja dodana do lokalnego state');
      console.log('📊 Aktualna liczba pozycji w sekcji:', getCurrentTv().sections[sectionIndex].items.length);

      renderEditor();
      renderPreview();
      
      console.log('✅ Pozycja zapisana i wyrenderowana!');
      alert('✅ Pozycja została dodana!');
    } catch (error) {
      console.error('❌ Błąd dodawania pozycji:', error);
      alert('❌ Błąd dodawania pozycji: ' + error.message);
    }
  });
  card.appendChild(addItemBtn);

  return card;
}

// Utwórz wiersz pozycji
function createItemRow(item, sectionIndex, itemIndex) {
  const row = document.createElement("div");
  row.className = "item-row";

  const inputs = document.createElement("div");
  inputs.className = "item-inputs";

  const nameInput = document.createElement("input");
  nameInput.className = "item-name";
  nameInput.type = "text";
  nameInput.placeholder = "Nazwa pozycji";
  nameInput.value = item.name;
  nameInput.addEventListener("input", (e) => {
    const newName = e.target.value;
    getCurrentTv().sections[sectionIndex].items[itemIndex].name = newName;
    renderPreview();
    markAsUnsaved();
  });

  const descInput = document.createElement("input");
  descInput.className = "item-desc";
  descInput.type = "text";
  descInput.placeholder = "Opis (opcjonalny)";
  descInput.value = item.description;
  descInput.addEventListener("input", (e) => {
    const newDesc = e.target.value;
    getCurrentTv().sections[sectionIndex].items[itemIndex].description = newDesc;
    renderPreview();
    markAsUnsaved();
  });

  inputs.appendChild(nameInput);
  inputs.appendChild(descInput);

  const priceInput = document.createElement("input");
  priceInput.className = "item-price-input";
  priceInput.type = "text";
  priceInput.placeholder = "Cena";
  priceInput.value = item.price;
  priceInput.addEventListener("input", (e) => {
    const newPrice = e.target.value;
    getCurrentTv().sections[sectionIndex].items[itemIndex].price = newPrice;
    renderPreview();
    markAsUnsaved();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "icon-btn";
  deleteBtn.textContent = "✕";
  deleteBtn.title = "Usuń pozycję";
  deleteBtn.addEventListener("click", async () => {
    try {
      await authManager.apiRequest(`/items/${item.id}`, {
        method: 'DELETE'
      });

      getCurrentTv().sections[sectionIndex].items.splice(itemIndex, 1);
      renderEditor();
      renderPreview();
    } catch (error) {
      console.error('Błąd usuwania pozycji:', error);
      alert('Błąd usuwania pozycji: ' + error.message);
    }
  });

  row.appendChild(inputs);
  row.appendChild(priceInput);
  row.appendChild(deleteBtn);

  return row;
}

// Renderuj podgląd
function renderPreview() {
  const currentTv = getCurrentTv();
  if (!currentTv) {
    console.error('❌ renderPreview: brak currentTv');
    return;
  }
  
  console.log('🎨 renderPreview - currentTv:', currentTv);
  console.log('📊 Liczba sekcji:', currentTv.sections?.length || 0);
  if (currentTv.sections && currentTv.sections.length > 0) {
    console.log('📊 Liczba pozycji w pierwszej sekcji:', currentTv.sections[0].items?.length || 0);
  }
  
  menuPreview.innerHTML = "";

  // Header z logo
  const header = document.createElement("div");
  header.className = "menu-header";

  const logo = document.createElement("div");
  logo.className = "menu-logo";
  const logoImg = document.createElement("img");
  logoImg.src = "pictures/LogoKawa.svg";
  logoImg.alt = currentTv.venueName;
  logo.appendChild(logoImg);

  const subtitle = document.createElement("div");
  subtitle.className = "menu-subtitle";
  subtitle.textContent = currentTv.venueSubtitle;

  header.appendChild(logo);
  if (currentTv.venueSubtitle) {
    header.appendChild(subtitle);
  }
  menuPreview.appendChild(header);

  // Sprawdź theme
  const theme = window.authManager ? authManager.getTheme() : 'kawa';

  if (theme === 'piwna') {
    // Dla theme piwna: tytuł główny + wszystkie sekcje w jednym boxie
    const mainTitle = document.createElement("div");
    mainTitle.className = "section-title piwna-main-title";
    mainTitle.textContent = "PRZEKĄSKI I JEDZENIE";
    menuPreview.appendChild(mainTitle);
    
    const mainBox = document.createElement("div");
    mainBox.className = "section-box piwna-main-box";
    
    currentTv.sections.forEach((section, index) => {
      const title = document.createElement("div");
      title.className = "section-title piwna-item-title";
      title.textContent = section.title;
      mainBox.appendChild(title);

      section.items.forEach((item) => {
        if (!item.name && !item.price) return;

        const itemEl = document.createElement("div");
        itemEl.className = "menu-item";

        const info = document.createElement("div");
        info.className = "item-info";

        const name = document.createElement("div");
        name.className = "item-name";
        name.textContent = item.name || "Nazwa pozycji";
        info.appendChild(name);

        if (section.note) {
          const desc = document.createElement("div");
          desc.className = "item-description";
          desc.textContent = section.note;
          info.appendChild(desc);
        }

        const price = document.createElement("div");
        price.className = "item-price";
        price.textContent = item.price || "-";

        itemEl.appendChild(info);
        itemEl.appendChild(price);
        mainBox.appendChild(itemEl);
      });
    });
    
    menuPreview.appendChild(mainBox);
  } else {
    // Dla innych theme: standardowe renderowanie
    currentTv.sections.forEach((section) => {
      const sectionEl = document.createElement("div");
      sectionEl.className = "menu-section";

      const title = document.createElement("div");
      title.className = "section-title";
      title.textContent = section.title;
      sectionEl.appendChild(title);

      const box = document.createElement("div");
      box.className = "section-box";

      section.items.forEach((item) => {
        if (!item.name && !item.price) return;

        const itemEl = document.createElement("div");
        itemEl.className = "menu-item";

        const info = document.createElement("div");
        info.className = "item-info";

        const name = document.createElement("div");
        name.className = "item-name";
        name.textContent = item.name || "Nazwa pozycji";
        info.appendChild(name);

        if (item.description) {
          const desc = document.createElement("div");
          desc.className = "item-description";
          desc.textContent = item.description;
          info.appendChild(desc);
        }

        const price = document.createElement("div");
        price.className = "item-price";
        price.textContent = item.price || "-";

        itemEl.appendChild(info);
        itemEl.appendChild(price);
        box.appendChild(itemEl);
      });

      if (section.note) {
        const note = document.createElement("div");
        note.className = "section-note";
        note.textContent = section.note;
        box.appendChild(note);
      }

      sectionEl.appendChild(box);
      menuPreview.appendChild(sectionEl);
    });
  }
}

// Zapisz wszystkie zmiany do API
async function saveAllChanges() {
  const currentTv = getCurrentTv();
  if (!currentTv) {
    alert('❌ Brak aktywnego TV');
    return;
  }

  console.log('💾 Rozpoczynam zapisywanie wszystkich zmian...');
  const statusEl = document.querySelector('.save-info');
  if (statusEl) {
    statusEl.textContent = '⏳ Zapisywanie...';
    statusEl.style.color = '#2196F3';
  }

  try {
    // Zapisz nazwę lokalu i podtytuł
    console.log(`📤 Zapisuję dane TV: ${currentTv.name}`);
    await authManager.apiRequest(`/tvs/${currentTv.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: currentTv.name,
        venueName: currentTv.venueName || "",
        venueSubtitle: currentTv.venueSubtitle || ""
      })
    });
    
    // Zapisz każdą sekcję i jej pozycje
    for (const section of currentTv.sections) {
      console.log(`📤 Zapisuję sekcję: ${section.title}`);
      
      // Aktualizuj sekcję
      await authManager.apiRequest(`/sections/${section.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: section.title,
          note: section.note || ""
        })
      });

      // Zapisz wszystkie pozycje w sekcji
      for (const item of section.items) {
        console.log(`  📤 Zapisuję pozycję: ${item.name}`);
        
        await authManager.apiRequest(`/items/${item.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: item.name,
            description: item.description || "",
            price: item.price || ""
          })
        });
      }
    }

    console.log('✅ Wszystkie zmiany zapisane!');
    markAsSaved();
    
    // Odśwież linki TV
    if (typeof window.generateTVLinks === 'function') {
      console.log('🔗 Odświeżanie linków TV...');
      window.generateTVLinks();
    }
    
    alert('✅ Wszystkie zmiany zostały zapisane do bazy danych!\n\nTelewizory odświeżą się automatycznie w ciągu 2 sekund.');
  } catch (error) {
    console.error('❌ Błąd zapisywania:', error);
    if (statusEl) {
      statusEl.textContent = '❌ Błąd zapisu!';
      statusEl.style.color = '#e74c3c';
    }
    alert('❌ Błąd zapisywania: ' + error.message);
  }
}

// Globalne listenery
function attachGlobalListeners() {
  console.log('🔧 Podpinanie event listenerów...');
  
  if (!addSectionBtn) {
    console.error('❌ addSectionBtn nie istnieje!');
    return;
  }
  
  venueNameInput.addEventListener("input", (e) => {
    getCurrentTv().venueName = e.target.value;
    renderPreview();
    markAsUnsaved();
  });

  venueSubtitleInput.addEventListener("input", (e) => {
    getCurrentTv().venueSubtitle = e.target.value;
    renderPreview();
    markAsUnsaved();
  });

  // Przycisk Zapisz
  if (saveBtn) {
    saveBtn.addEventListener("click", async () => {
      if (!hasUnsavedChanges) {
        alert('ℹ️ Brak zmian do zapisania');
        return;
      }
      await saveAllChanges();
    });
  }

  addSectionBtn.addEventListener("click", async () => {
    console.log('🆕 Kliknięto Dodaj sekcję');
    const currentTv = getCurrentTv();
    console.log('📺 Current TV:', currentTv);
    
    if (!currentTv) {
      console.error('❌ Brak currentTv!');
      return;
    }

    try {
      console.log(`📤 Wysyłam POST /api/tvs/${currentTv.id}/sections`);
      
      // Utwórz sekcję w API
      const section = await authManager.apiRequest(`/tvs/${currentTv.id}/sections`, {
        method: 'POST',
        body: JSON.stringify({
          title: "NOWA SEKCJA",
          note: ""
        })
      });

      console.log('✅ Sekcja utworzona w API:', section);

      // Dodaj do lokalnego state
      currentTv.sections.push({
        id: section.id,
        title: section.title,
        note: section.note || "",
        items: []
      });

      console.log('✅ Sekcja dodana do lokalnego state');
      console.log('📊 Aktualna liczba sekcji:', currentTv.sections.length);

      renderEditor();
      renderPreview();
      
      console.log('✅ Sekcja zapisana i wyrenderowana!');
      alert('✅ Sekcja została dodana!');
    } catch (error) {
      console.error('❌ Błąd dodawania sekcji:', error);
      alert('❌ Błąd dodawania sekcji: ' + error.message);
    }
  });

  generateLinkBtn.addEventListener("click", () => {
    const currentTv = getCurrentTv();
    if (!currentTv) {
      alert('❌ Brak aktywnego TV');
      return;
    }
    
    // Pobierz token z localStorage
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('❌ Brak tokenu autoryzacji');
      return;
    }
    
    // Generuj link z tvid i tokenem
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("tv", "1");
    url.searchParams.set("tvid", currentTv.id);
    url.searchParams.set("token", token);
    
    shareLinkInput.value = url.toString();
    copyLinkBtn.disabled = false;
    shareLinkInput.select();
    
    console.log('📺 Wygenerowano link TV:', url.toString());
  });

  copyLinkBtn.addEventListener("click", () => {
    shareLinkInput.select();
    document.execCommand("copy");
    copyLinkBtn.textContent = "✓ Skopiowano!";
    setTimeout(() => {
      copyLinkBtn.textContent = "📋 Kopiuj";
    }, 2000);
  });


  // TV Selector
  tvSelector.addEventListener("change", (e) => {
    setCurrentTv(e.target.value);
  });

  // Dodaj nowy TV
  addTvBtn.addEventListener("click", async () => {
    const name = prompt("Nazwa nowego telewizora:", `TV ${Object.keys(appState.tvs).length + 1}`);
    if (!name) return;

    try {
      const displayName = authManager.getDisplayName();
      const tv = await authManager.apiRequest('/tvs', {
        method: 'POST',
        body: JSON.stringify({
          name: name,
          venueName: displayName,
          venueSubtitle: getCurrentTv()?.venueSubtitle || ''
        })
      });

      // Dodaj do lokalnego state
      appState.tvs[tv.id] = {
        id: tv.id,
        name: tv.name,
        venueName: tv.venue_name,
        venueSubtitle: tv.venue_subtitle || '',
        owner: authManager.getCurrentUser(),
        sections: []
      };

      // Przełącz na nowy TV
      setCurrentTv(tv.id);
      updateTvSelector();
      alert('Telewizor został dodany!');
    } catch (error) {
      console.error('Błąd dodawania TV:', error);
      alert('Błąd dodawania telewizora: ' + error.message);
    }
  });

  // Zmień nazwę TV
  renameTvBtn.addEventListener("click", async () => {
    const currentTv = getCurrentTv();
    if (!currentTv) return;

    const newName = prompt("Nowa nazwa telewizora:", currentTv.name);
    if (!newName || newName === currentTv.name) return;

    try {
      await authManager.apiRequest(`/tvs/${currentTv.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: newName,
          venueName: currentTv.venueName,
          venueSubtitle: currentTv.venueSubtitle
        })
      });

      // Zaktualizuj lokalny state
      currentTv.name = newName;
      updateTvSelector();
      alert('Nazwa została zmieniona!');
    } catch (error) {
      console.error('Błąd zmiany nazwy:', error);
      alert('Błąd zmiany nazwy: ' + error.message);
    }
  });

  // Usuń TV
  deleteTvBtn.addEventListener("click", async () => {
    const currentTv = getCurrentTv();
    if (!currentTv) return;

    if (Object.keys(appState.tvs).length === 1) {
      alert('Nie możesz usunąć ostatniego telewizora!');
      return;
    }

    if (!confirm(`Czy na pewno chcesz usunąć telewizor "${currentTv.name}"?\n\nTa operacja jest nieodwracalna!`)) {
      return;
    }

    try {
      await authManager.apiRequest(`/tvs/${currentTv.id}`, {
        method: 'DELETE'
      });

      // Usuń z lokalnego state
      delete appState.tvs[currentTv.id];

      // Przełącz na pierwszy dostępny TV
      const firstTvId = Object.keys(appState.tvs)[0];
      setCurrentTv(firstTvId);
      updateTvSelector();
      alert('Telewizor został usunięty!');
    } catch (error) {
      console.error('Błąd usuwania TV:', error);
      alert('Błąd usuwania telewizora: ' + error.message);
    }
  });
}

// Aktualizuj selector TV
function updateTvSelector() {
  if (!tvSelector) return;
  
  tvSelector.innerHTML = '';
  Object.values(appState.tvs).forEach(tv => {
    const option = document.createElement('option');
    option.value = tv.id;
    option.textContent = tv.name;
    option.selected = tv.id === appState.currentTvId;
    tvSelector.appendChild(option);
  });
}

// Start - init() będzie wywołane z multi-tv-functions.js po załadowaniu wszystkich funkcji
// init();

// Eksportuj funkcje
window.init = init;
window.renderPreview = renderPreview;
window.saveUserData = saveUserData;
