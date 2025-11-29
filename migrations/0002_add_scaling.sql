-- Migration: Add font_scale and logo_scale columns
-- Run with: npx wrangler d1 execute uwaga-kawa-db --remote --file=./migrations/0002_add_scaling.sql

-- Add font_scale column if it doesn't exist
ALTER TABLE tvs ADD COLUMN font_scale INTEGER DEFAULT 100;

-- Add logo_scale column if it doesn't exist
ALTER TABLE tvs ADD COLUMN logo_scale INTEGER DEFAULT 100;

-- Update existing rows to have default values
UPDATE tvs SET font_scale = 100 WHERE font_scale IS NULL;
UPDATE tvs SET logo_scale = 100 WHERE logo_scale IS NULL;
