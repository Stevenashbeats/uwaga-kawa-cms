-- Dodaj kolumny font_scale i logo_scale do tabeli tvs
ALTER TABLE tvs ADD COLUMN font_scale INTEGER DEFAULT 100;
ALTER TABLE tvs ADD COLUMN logo_scale INTEGER DEFAULT 100;
