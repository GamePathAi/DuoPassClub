-- VOUCHER HARMONIZATION MIGRATION
-- This script adds the offer_id to the vouchers table to link it to the original experience.

BEGIN;

-- 1. Add the offer_id column to the vouchers table
ALTER TABLE public.vouchers
ADD COLUMN IF NOT EXISTS offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL;

-- 2. Create an index for the new column for performance
CREATE INDEX IF NOT EXISTS idx_vouchers_offer_id ON public.vouchers(offer_id);

-- 3. Update RLS policies to allow users to see vouchers linked to offers they purchased
-- The existing policies for users and merchants are likely sufficient, but we can re-assert them for clarity.

-- Users can view their own vouchers.
DROP POLICY IF EXISTS "Users can view their own vouchers" ON public.vouchers;
CREATE POLICY "Users can view their own vouchers" ON public.vouchers
  FOR SELECT USING (auth.uid() = user_id);

-- Merchants can view vouchers related to their offers.
DROP POLICY IF EXISTS "Merchants can view vouchers for their business" ON public.vouchers;
CREATE POLICY "Merchants can view vouchers for their business" ON public.vouchers
  FOR SELECT USING (auth.uid() = merchant_id);

-- Optional: A policy to ensure that when a voucher is created, it has a valid offer_id if the system requires it.
-- This depends on the application logic. For now, we'll allow it to be nullable.

-- Note on Data Migration:
-- This script does not perform data migration for existing vouchers.
-- A separate script would be needed to backfill the offer_id for existing vouchers
-- based on purchase history, if available in another table (e.g., activated_coupons or a payments table).

COMMIT;