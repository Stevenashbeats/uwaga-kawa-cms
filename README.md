# uwaga kawa menu editor

System zarządzania menu kawiarni zoptymalizowany pod wyświetlanie na telewizorach pionowych **1080x1920px**.  
**Obsługuje wiele telewizorów** - możesz tworzyć osobne menu dla różnych TV (np. napoje, jedzenie).

## 🚀 Jak używać

### 1. Zarządzanie telewizorami
- **Wybierz telewizor** - lista rozwijana na górze edytora
- **Dodaj nowy TV** - przycisk `+`
- **Zmień nazwę** - przycisk `✏️`
- **Usuń TV** - przycisk `🗑️`
- Domyślnie: TV 1 (Napoje), TV 2 (Jedzenie)

### 2. Edycja menu
- Wybierz telewizor z listy
- Edytuj nazwę lokalu, podtytuł
- Dodawaj/usuwaj sekcje menu
- Dodawaj/usuwaj pozycje w sekcjach
- Edytuj nazwy, opisy i ceny

### 3. Generowanie linku dla TV
- Wybierz telewizor, który chcesz udostępnić
- Kliknij **"📺 Generuj link dla TV (1080x1920)"**
- Skopiuj wygenerowany link
- Link zawiera parametr `?tv=1` - ukrywa panel edytora
- Link zawiera parametr `?tvid=...` - ID wybranego telewizora
- Link zawiera parametr `?d=...` - zakodowane menu

### 4. Wyświetlanie na TV
- Otwórz wygenerowany link na telewizorze
- Menu wyświetli się w formacie **1080x1920px** (pionowy)
- Bez panelu edytora - tylko czyste menu
- Tło z obrazka `pictures/back_tv1.png`
- Logo z pliku `pictures/LogoKawa.svg`

## 📐 Specyfikacja techniczna

- **Format:** 1080x1920px (9:16, pionowy)
- **Czcionka:** Evogria (z folderu `font/`)
- **Tło:** `pictures/back_tv1.png`
- **Logo:** `pictures/LogoKawa.svg`
- **Sekcje:** Przezroczyste z czarną ramką
- **Ceny:** Czarne, pogrubione, bez obramówki

## 📁 Struktura plików

```
windsurf-project-4/
├── index.html          # Główny plik HTML
├── style.css           # Style CSS
├── app.js              # Logika JavaScript
├── font/               # Czcionki
│   ├── Evogria.otf
│   └── Evogria Italic.otf
└── pictures/           # Grafiki
    ├── back_tv1.png    # Tło
    └── LogoKawa.svg    # Logo
```

## 🎨 Tryby wyświetlania

### Tryb edytora (domyślny)
```
http://localhost/index.html
```
- Panel edytora po lewej
- Podgląd po prawej

### Tryb TV (tylko menu)
```
http://localhost/index.html?tv=1&d=...
```
- Tylko menu, bez edytora
- Format 1080x1920px
- Gotowe do wyświetlenia na TV

## 💡 Wskazówki

1. **Edycja na komputerze** - używaj trybu edytora
2. **Wyświetlanie na TV** - używaj wygenerowanego linku z `?tv=1`
3. **Backup menu** - zapisz wygenerowany link jako backup
4. **Aktualizacja** - edytuj w trybie edytora, wygeneruj nowy link
