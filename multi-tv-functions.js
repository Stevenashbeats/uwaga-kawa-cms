// Funkcje dla multi-TV - nadpisują funkcje z app.js

// Renderuj edytor
window.renderEditor = function() {
  const currentTv = getCurrentTv();
  venueNameInput.value = currentTv.venueName;
  venueSubtitleInput.value = currentTv.venueSubtitle;

  sectionsContainer.innerHTML = "";
  currentTv.sections.forEach((section, sectionIndex) => {
    const card = createSectionCard(section, sectionIndex);
    sectionsContainer.appendChild(card);
  });
};

// Utwórz kartę sekcji
window.createSectionCard = function(section, sectionIndex) {
  const currentTv = getCurrentTv();
  const card = document.createElement("div");
  card.className = "section-card";

  const header = document.createElement("div");
  header.className = "section-card-header";

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = section.title;
  titleInput.addEventListener("input", (e) => {
    currentTv.sections[sectionIndex].title = e.target.value;
    renderPreview();
  });

  const actions = document.createElement("div");
  actions.className = "section-actions";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "icon-btn";
  deleteBtn.textContent = "🗑️";
  deleteBtn.title = "Usuń sekcję";
  deleteBtn.addEventListener("click", () => {
    currentTv.sections.splice(sectionIndex, 1);
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
    currentTv.sections[sectionIndex].note = e.target.value;
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
    currentTv.sections[sectionIndex].items.push({
      name: "",
      description: "",
      price: ""
    });
    renderEditor();
    renderPreview();
  });
  card.appendChild(addItemBtn);

  return card;
};

// Utwórz wiersz pozycji
window.createItemRow = function(item, sectionIndex, itemIndex) {
  const currentTv = getCurrentTv();
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
    currentTv.sections[sectionIndex].items[itemIndex].name = e.target.value;
    renderPreview();
  });

  const descInput = document.createElement("input");
  descInput.className = "item-desc";
  descInput.type = "text";
  descInput.placeholder = "Opis (opcjonalny)";
  descInput.value = item.description;
  descInput.addEventListener("input", (e) => {
    currentTv.sections[sectionIndex].items[itemIndex].description = e.target.value;
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
    currentTv.sections[sectionIndex].items[itemIndex].price = e.target.value;
    renderPreview();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "icon-btn";
  deleteBtn.textContent = "✕";
  deleteBtn.title = "Usuń pozycję";
  deleteBtn.addEventListener("click", () => {
    currentTv.sections[sectionIndex].items.splice(itemIndex, 1);
    renderEditor();
    renderPreview();
  });

  row.appendChild(inputs);
  row.appendChild(priceInput);
  row.appendChild(deleteBtn);

  return row;
};

// Renderuj podgląd
window.renderPreview = function() {
  const currentTv = getCurrentTv();
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

  // Sekcje
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
};

// Aktualizuj listenery
window.attachGlobalListeners = function() {
  venueNameInput.addEventListener("input", (e) => {
    getCurrentTv().venueName = e.target.value;
    renderPreview();
  });

  venueSubtitleInput.addEventListener("input", (e) => {
    getCurrentTv().venueSubtitle = e.target.value;
    renderPreview();
  });

  addSectionBtn.addEventListener("click", () => {
    getCurrentTv().sections.push({
      id: `section-${Date.now()}`,
      title: "NOWA SEKCJA",
      note: "",
      items: []
    });
    renderEditor();
    renderPreview();
  });

  generateLinkBtn.addEventListener("click", () => {
    const encoded = btoa(encodeURIComponent(JSON.stringify(appState)));
    const url = new URL(window.location.href);
    url.searchParams.set("d", encoded);
    url.searchParams.set("tv", "1");
    url.searchParams.set("tvid", appState.currentTvId);
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
};

// Selektor TV
function updateTvSelector() {
  const selector = document.getElementById("tv-selector");
  if (!selector) return;
  
  selector.innerHTML = "";
  
  Object.values(appState.tvs).forEach(tv => {
    const option = document.createElement("option");
    option.value = tv.id;
    option.textContent = tv.name;
    option.selected = tv.id === appState.currentTvId;
    selector.appendChild(option);
  });
}

// Inicjalizacja TV managera
window.addEventListener('DOMContentLoaded', () => {
  const tvSelector = document.getElementById("tv-selector");
  
  if (tvSelector) {
    updateTvSelector();
    
    tvSelector.addEventListener("change", (e) => {
      setCurrentTv(e.target.value);
    });
  }
});
