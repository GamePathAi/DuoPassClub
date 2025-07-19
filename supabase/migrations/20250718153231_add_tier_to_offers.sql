-- Create the ENUM type for offer tiers
CREATE TYPE public.offer_tier AS ENUM ('Golden', 'Premium', 'Freemium');

-- Add the 'tier' column to the 'offers' table
ALTER TABLE public.offers
ADD COLUMN tier public.offer_tier NOT NULL DEFAULT 'Freemium';

-- Optional: Add a comment to the new column for clarity
COMMENT ON COLUMN public.offers.tier IS 'Categorizes offers into different access levels: Golden (exclusive), Premium (high-value), and Freemium (standard).';