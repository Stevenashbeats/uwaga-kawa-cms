-- Dodaj kolumny z ustawieniami fontów do tabeli tvs
ALTER TABLE tvs ADD COLUMN font_section_title INTEGER DEFAULT 48;
ALTER TABLE tvs ADD COLUMN font_item_name INTEGER DEFAULT 32;
ALTER TABLE tvs ADD COLUMN font_item_description INTEGER DEFAULT 18;
ALTER TABLE tvs ADD COLUMN font_item_price INTEGER DEFAULT 36;
ALTER TABLE tvs ADD COLUMN font_section_note INTEGER DEFAULT 16;

-- Aktualizuj istniejące TV z domyślnymi wartościami
UPDATE tvs SET 
  font_section_title = 48,
  font_item_name = 32,
  font_item_description = 18,
  font_item_price = 36,
  font_section_note = 16
WHERE font_section_title IS NULL;
