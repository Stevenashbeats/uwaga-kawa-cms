# Instrukcja publikacji na Cloudflare Pages

## Metoda 1: Przez Dashboard Cloudflare (Zalecana)

### Krok 1: Utwórz konto Cloudflare
1. Wejdź na https://dash.cloudflare.com/sign-up
2. Zarejestruj się (darmowe konto)

### Krok 2: Połącz z GitHub
1. Wejdź na https://dash.cloudflare.com/
2. Kliknij **Pages** w menu bocznym
3. Kliknij **Create a project**
4. Wybierz **Connect to Git**
5. Autoryzuj Cloudflare do dostępu do GitHub

### Krok 3: Wypchnij kod na GitHub
```bash
# Utwórz nowe repozytorium na GitHub (przez przeglądarkę)
# Następnie:
git remote add origin https://github.com/TWOJA_NAZWA/uwaga-kawa-cms.git
git branch -M main
git push -u origin main
```

### Krok 4: Deploy na Cloudflare Pages
1. W Cloudflare Pages wybierz swoje repozytorium
2. Konfiguracja:
   - **Project name**: `uwaga-kawa-cms`
   - **Production branch**: `main`
   - **Build command**: (zostaw puste - to statyczna strona)
   - **Build output directory**: `/`
3. Kliknij **Save and Deploy**

### Krok 5: Gotowe!
- Twoja strona będzie dostępna pod: `https://uwaga-kawa-cms.pages.dev`
- Każdy push na `main` automatycznie aktualizuje stronę

---

## Metoda 2: Przez Wrangler CLI

### Wymagania
- Node.js 20.18.1 lub nowszy
- Konto Cloudflare

### Instalacja Wrangler
```bash
npm install -g wrangler
# lub użyj npx (bez instalacji)
```

### Logowanie
```bash
npx wrangler login
```

### Deploy
```bash
npx wrangler pages deploy . --project-name=uwaga-kawa-cms
```

### Aktualizacja
```bash
# Po każdej zmianie:
npx wrangler pages deploy . --project-name=uwaga-kawa-cms
```

---

## Metoda 3: Drag & Drop (Najszybsza)

1. Wejdź na https://dash.cloudflare.com/
2. Kliknij **Pages** → **Create a project**
3. Wybierz **Upload assets**
4. Przeciągnij cały folder projektu
5. Gotowe!

**Uwaga**: Ta metoda nie ma automatycznych aktualizacji. Musisz ręcznie przesyłać pliki przy każdej zmianie.

---

## Własna domena (opcjonalnie)

1. W Cloudflare Pages kliknij na swój projekt
2. Przejdź do **Custom domains**
3. Kliknij **Set up a custom domain**
4. Wpisz swoją domenę (np. `menu.uwagakawa.pl`)
5. Postępuj zgodnie z instrukcjami (dodaj rekord DNS)

---

## Wsparcie

Jeśli masz problemy:
- Dokumentacja: https://developers.cloudflare.com/pages/
- Discord: https://discord.cloudflare.com
