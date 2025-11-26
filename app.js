// Stan aplikacji - Multi-TV
let appState = {
  currentTvId: "tv1",
  tvs: {
    tv1: {
      id: "tv1",
      name: "TV 1 - Napoje",
      venueName: "UWAGA KAWA",
      venueSubtitle: "",
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
  return appState.tvs[appState.currentTvId];
}

function setCurrentTv(tvId) {
  appState.currentTvId = tvId;
  renderEditor();
  renderPreview();
  updateTvSelector();
}

// Elementy DOM
const sectionsContainer = document.getElementById("sections-container");
const menuPreview = document.getElementById("menu-preview");
const venueNameInput = document.getElementById("venue-name");
const venueSubtitleInput = document.getElementById("venue-subtitle");
const addSectionBtn = document.getElementById("add-section-btn");
const generateLinkBtn = document.getElementById("generate-link-btn");
const shareLinkInput = document.getElementById("share-link");
const copyLinkBtn = document.getElementById("copy-link-btn");
const toggleModeBtn = document.getElementById("toggle-mode-btn");
const previewArea = document.getElementById("preview-area");

// Inicjalizacja
function init() {
  const params = new URLSearchParams(window.location.search);
  const isTVMode = params.get("tv") === "1";
  
  if (isTVMode) {
    document.body.classList.add("tv-mode");
  }
  
  loadStateFromURL();
  
  if (!isTVMode) {
    renderEditor();
    attachGlobalListeners();
  }
  
  renderPreview();
}

// Wczytaj stan z URL
function loadStateFromURL() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("d");
  const tvid = params.get("tvid");
  
  if (encoded) {
    try {
      const decoded = JSON.parse(decodeURIComponent(atob(encoded)));
      appState = decoded;
      
      // Jeśli jest tvid, ustaw aktywny telewizor
      if (tvid && appState.tvs && appState.tvs[tvid]) {
        appState.currentTvId = tvid;
      }
    } catch (e) {
      console.error("Błąd dekodowania URL:", e);
    }
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
  venueNameInput.value = appState.venueName;
  venueSubtitleInput.value = appState.venueSubtitle;

  sectionsContainer.innerHTML = "";
  appState.sections.forEach((section, sectionIndex) => {
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
    appState.sections[sectionIndex].title = e.target.value;
    renderPreview();
  });

  const actions = document.createElement("div");
  actions.className = "section-actions";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "icon-btn";
  deleteBtn.textContent = "🗑️";
  deleteBtn.title = "Usuń sekcję";
  deleteBtn.addEventListener("click", () => {
    appState.sections.splice(sectionIndex, 1);
    renderEditor();
    renderPreview();
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
    appState.sections[sectionIndex].note = e.target.value;
    renderPreview();
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
  addItemBtn.addEventListener("click", () => {
    appState.sections[sectionIndex].items.push({
      name: "",
      description: "",
      price: ""
    });
    renderEditor();
    renderPreview();
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
    appState.sections[sectionIndex].items[itemIndex].name = e.target.value;
    renderPreview();
  });

  const descInput = document.createElement("input");
  descInput.className = "item-desc";
  descInput.type = "text";
  descInput.placeholder = "Opis (opcjonalny)";
  descInput.value = item.description;
  descInput.addEventListener("input", (e) => {
    appState.sections[sectionIndex].items[itemIndex].description = e.target.value;
    renderPreview();
  });

  inputs.appendChild(nameInput);
  inputs.appendChild(descInput);

  const priceInput = document.createElement("input");
  priceInput.className = "item-price-input";
  priceInput.type = "text";
  priceInput.placeholder = "Cena";
  priceInput.value = item.price;
  priceInput.addEventListener("input", (e) => {
    appState.sections[sectionIndex].items[itemIndex].price = e.target.value;
    renderPreview();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "icon-btn";
  deleteBtn.textContent = "✕";
  deleteBtn.title = "Usuń pozycję";
  deleteBtn.addEventListener("click", () => {
    appState.sections[sectionIndex].items.splice(itemIndex, 1);
    renderEditor();
    renderPreview();
  });

  row.appendChild(inputs);
  row.appendChild(priceInput);
  row.appendChild(deleteBtn);

  return row;
}

// Renderuj podgląd
function renderPreview() {
  menuPreview.innerHTML = "";

  // Header z logo
  const header = document.createElement("div");
  header.className = "menu-header";

  const logo = document.createElement("div");
  logo.className = "menu-logo";
  const logoImg = document.createElement("img");
  logoImg.src = "pictures/LogoKawa.svg";
  logoImg.alt = appState.venueName;
  logo.appendChild(logoImg);

  const subtitle = document.createElement("div");
  subtitle.className = "menu-subtitle";
  subtitle.textContent = appState.venueSubtitle;

  header.appendChild(logo);
  header.appendChild(subtitle);
  menuPreview.appendChild(header);

  // Sekcje
  appState.sections.forEach((section) => {
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

// Globalne listenery
function attachGlobalListeners() {
  venueNameInput.addEventListener("input", (e) => {
    appState.venueName = e.target.value;
    renderPreview();
  });

  venueSubtitleInput.addEventListener("input", (e) => {
    appState.venueSubtitle = e.target.value;
    renderPreview();
  });

  addSectionBtn.addEventListener("click", () => {
    appState.sections.push({
      id: `section-${Date.now()}`,
      title: "NOWA SEKCJA",
      note: "",
      items: []
    });
    renderEditor();
    renderPreview();
  });

  generateLinkBtn.addEventListener("click", () => {
    const state = getStateFromForm();
    const encoded = encodeState(state);
    const url = new URL(window.location.href);
    url.searchParams.set("d", encoded);
    url.searchParams.set("tv", "1");
    shareLinkInput.value = url.toString();
    copyLinkBtn.disabled = false;
    shareLinkInput.select();
  });

  copyLinkBtn.addEventListener("click", () => {
    shareLinkInput.select();
    document.execCommand("copy");
    copyLinkBtn.textContent = "✓ Skopiowano!";
    setTimeout(() => {
      copyLinkBtn.textContent = "📋 Kopiuj";
    }, 2000);
  });

  toggleModeBtn.addEventListener("click", () => {
    previewArea.classList.toggle("fullscreen");
    if (previewArea.classList.contains("fullscreen")) {
      toggleModeBtn.textContent = "✏️ Edytor";
    } else {
      toggleModeBtn.textContent = "👁️ Podgląd";
    }
  });
}

// Start
init();

// Eksportuj renderPreview dla autoscale
window.renderPreview = renderPreview;
