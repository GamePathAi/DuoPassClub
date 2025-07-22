-- Add ALL missing columns to partner_registrations table to sync with production

ALTER TABLE public.partner_registrations
ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT false;

ALTER TABLE public.partner_registrations
ADD COLUMN IF NOT EXISTS privacy_accepted BOOLEAN DEFAULT false;

ALTER TABLE public.partner_registrations
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();