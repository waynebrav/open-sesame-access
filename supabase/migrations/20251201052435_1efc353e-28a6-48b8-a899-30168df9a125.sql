-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  preferences JSONB DEFAULT '{"frequency": "weekly", "categories": []}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- FAQ Table
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Product Comparisons Table
CREATE TABLE IF NOT EXISTS public.product_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_ids UUID[] NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Live Support Tickets Table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT,
  assigned_to UUID REFERENCES public.admins(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Support Ticket Messages Table
CREATE TABLE IF NOT EXISTS public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin')),
  sender_id UUID,
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Customer Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_role TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  testimonial TEXT NOT NULL,
  avatar_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Newsletter Policies
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own subscription"
  ON public.newsletter_subscribers FOR SELECT
  USING (true);

-- FAQ Policies
CREATE POLICY "Published FAQs are viewable by everyone"
  ON public.faqs FOR SELECT
  USING (is_published = true);

-- Product Comparison Policies
CREATE POLICY "Users can manage their own comparisons"
  ON public.product_comparisons FOR ALL
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Support Ticket Policies
CREATE POLICY "Users can view their own tickets"
  ON public.support_tickets FOR SELECT
  USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can create tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own tickets"
  ON public.support_tickets FOR UPDATE
  USING (auth.uid() = user_id);

-- Support Message Policies
CREATE POLICY "Users can view messages for their tickets"
  ON public.support_messages FOR SELECT
  USING (
    ticket_id IN (
      SELECT id FROM public.support_tickets 
      WHERE user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages to their tickets"
  ON public.support_messages FOR INSERT
  WITH CHECK (
    ticket_id IN (
      SELECT id FROM public.support_tickets 
      WHERE user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Testimonial Policies
CREATE POLICY "Published testimonials are viewable by everyone"
  ON public.testimonials FOR SELECT
  USING (is_published = true);

CREATE POLICY "Users can create testimonials"
  ON public.testimonials FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Insert sample FAQs
INSERT INTO public.faqs (category, question, answer, sort_order, is_published) VALUES
('Orders', 'How do I track my order?', 'You can track your order by logging into your account and visiting the Order History page. Each order has a tracking number that you can use to see real-time updates on your shipment.', 1, true),
('Orders', 'Can I cancel or modify my order?', 'Orders can be cancelled or modified within 2 hours of placement. After that, the order enters processing and cannot be changed. Please contact support immediately if you need to make changes.', 2, true),
('Shipping', 'What are the shipping costs?', 'Shipping costs vary based on your location and order size. Standard shipping is free for orders over $100. Express shipping is available at checkout for an additional fee.', 3, true),
('Shipping', 'How long does delivery take?', 'Standard delivery takes 3-5 business days. Express delivery takes 1-2 business days. International orders may take 7-14 business days depending on customs.', 4, true),
('Returns', 'What is your return policy?', 'We offer a 30-day return policy for unused items in original packaging. Refunds are processed within 7 business days of receiving the returned item. Return shipping costs are the customer''s responsibility unless the item is defective.', 5, true),
('Returns', 'How do I initiate a return?', 'Log into your account, go to Order History, select the order, and click "Request Return". Follow the instructions to print your return label and ship the item back to us.', 6, true),
('Payment', 'What payment methods do you accept?', 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, M-Pesa, Apple Pay, and Google Pay. We also support cryptocurrency payments through Coinbase.', 7, true),
('Payment', 'Is my payment information secure?', 'Yes, we use industry-standard encryption and secure payment gateways. We never store your complete credit card information on our servers. All transactions are PCI-DSS compliant.', 8, true),
('Products', 'Do you offer warranty on products?', 'All products come with a standard 1-year manufacturer warranty. Extended warranty options are available at checkout. Please see our Warranty Information page for complete details.', 9, true),
('Products', 'Are your products authentic?', 'Yes, all our products are 100% authentic and sourced directly from manufacturers or authorized distributors. We guarantee authenticity on every purchase.', 10, true),
('Account', 'How do I reset my password?', 'Click "Forgot Password" on the login page and enter your email address. You''ll receive a password reset link within a few minutes. Check your spam folder if you don''t see it.', 11, true),
('Account', 'Can I change my email address?', 'Yes, you can update your email address in your Account Settings. You''ll need to verify the new email address before the change takes effect.', 12, true);

-- Create function to update newsletter subscriber timestamp
CREATE OR REPLACE FUNCTION update_newsletter_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for newsletter subscribers
CREATE TRIGGER update_newsletter_timestamp
  BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_updated_at();

-- Create function to update FAQ timestamp
CREATE OR REPLACE FUNCTION update_faq_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for FAQs
CREATE TRIGGER update_faq_timestamp
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_faq_updated_at();