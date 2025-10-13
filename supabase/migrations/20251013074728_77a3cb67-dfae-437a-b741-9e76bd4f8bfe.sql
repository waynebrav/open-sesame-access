-- Create payment providers configuration table
CREATE TABLE IF NOT EXISTS public.payment_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  requires_api_key BOOLEAN NOT NULL DEFAULT true,
  configuration JSONB DEFAULT '{}'::jsonb,
  supported_currencies TEXT[] DEFAULT ARRAY['USD', 'KES', 'EUR', 'GBP'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.payment_providers ENABLE ROW LEVEL SECURITY;

-- Admin can manage all providers
CREATE POLICY "Admins can manage payment providers"
  ON public.payment_providers
  FOR ALL
  USING (is_admin(auth.uid()));

-- Anyone can view active providers
CREATE POLICY "Anyone can view active providers"
  ON public.payment_providers
  FOR SELECT
  USING (is_active = true OR is_admin(auth.uid()));

-- Insert default payment providers
INSERT INTO public.payment_providers (name, code, description, requires_api_key, supported_currencies) VALUES
  ('Stripe', 'stripe', 'Credit/Debit cards, Apple Pay, Google Pay via Stripe', true, ARRAY['USD', 'EUR', 'GBP', 'KES']),
  ('Paddle', 'paddle', 'Software and SaaS payment platform', true, ARRAY['USD', 'EUR', 'GBP']),
  ('Coinbase Commerce', 'coinbase', 'Accept cryptocurrency payments', true, ARRAY['USD', 'BTC', 'ETH', 'USDC']),
  ('Google Pay', 'googlepay', 'Google Pay direct integration', true, ARRAY['USD', 'EUR', 'GBP']),
  ('Apple Pay', 'applepay', 'Apple Pay direct integration', true, ARRAY['USD', 'EUR', 'GBP']),
  ('Square', 'square', 'Point of sale and online payments', true, ARRAY['USD', 'CAD', 'GBP', 'AUD']),
  ('Razorpay', 'razorpay', 'Payment gateway for India', true, ARRAY['INR', 'USD']),
  ('Flutterwave', 'flutterwave', 'African payment gateway', true, ARRAY['KES', 'NGN', 'GHS', 'USD'])
ON CONFLICT (code) DO NOTHING;