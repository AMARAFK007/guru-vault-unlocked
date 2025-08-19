-- Supabase Edge Function for Payment Webhooks
-- This should be deployed as a Supabase Edge Function

-- First, let's create a webhook logs table for debugging
CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL,
  event_type TEXT,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to handle Gumroad webhooks
CREATE OR REPLACE FUNCTION handle_gumroad_webhook(webhook_payload JSONB)
RETURNS JSONB AS $$
DECLARE
  order_record RECORD;
  sale_data JSONB;
BEGIN
  -- Extract sale data from Gumroad webhook
  sale_data := webhook_payload->'sale';
  
  -- Log the webhook
  INSERT INTO public.webhook_logs (provider, event_type, payload)
  VALUES ('gumroad', 'sale', webhook_payload);
  
  -- Find the order by email
  SELECT * INTO order_record 
  FROM public.orders 
  WHERE email = (sale_data->>'email')::TEXT
    AND payment_provider = 'gumroad'
    AND status = 'pending'
  ORDER BY created_at DESC 
  LIMIT 1;
  
  IF order_record.id IS NOT NULL THEN
    -- Update order status
    UPDATE public.orders 
    SET 
      status = 'completed',
      payment_id = (sale_data->>'id')::TEXT,
      metadata = sale_data,
      updated_at = NOW()
    WHERE id = order_record.id;
    
    -- Grant access to all courses for completed orders
    INSERT INTO public.user_courses (user_id, course_id, order_id)
    SELECT 
      order_record.user_id,
      c.id,
      order_record.id
    FROM public.courses c
    WHERE c.is_active = TRUE
    ON CONFLICT DO NOTHING;
    
    RETURN jsonb_build_object('success', true, 'order_id', order_record.id);
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'Order not found');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle Cryptomus webhooks
CREATE OR REPLACE FUNCTION handle_cryptomus_webhook(webhook_payload JSONB)
RETURNS JSONB AS $$
DECLARE
  order_record RECORD;
  payment_data JSONB;
  order_id_from_webhook TEXT;
BEGIN
  -- Extract payment data from Cryptomus webhook
  payment_data := webhook_payload;
  order_id_from_webhook := (payment_data->>'order_id')::TEXT;
  
  -- Log the webhook
  INSERT INTO public.webhook_logs (provider, event_type, payload)
  VALUES ('cryptomus', 'payment', webhook_payload);
  
  -- Find the order by order_id or email
  SELECT * INTO order_record 
  FROM public.orders 
  WHERE payment_provider = 'cryptomus'
    AND status = 'pending'
    AND (
      metadata->>'order_id' = order_id_from_webhook
      OR email = (payment_data->>'email')::TEXT
    )
  ORDER BY created_at DESC 
  LIMIT 1;
  
  IF order_record.id IS NOT NULL THEN
    -- Check if payment is successful
    IF (payment_data->>'status')::TEXT = 'paid' THEN
      -- Update order status
      UPDATE public.orders 
      SET 
        status = 'completed',
        payment_id = (payment_data->>'uuid')::TEXT,
        metadata = payment_data,
        updated_at = NOW()
      WHERE id = order_record.id;
      
      -- Grant access to all courses for completed orders
      INSERT INTO public.user_courses (user_id, course_id, order_id)
      SELECT 
        order_record.user_id,
        c.id,
        order_record.id
      FROM public.courses c
      WHERE c.is_active = TRUE
      ON CONFLICT DO NOTHING;
      
      RETURN jsonb_build_object('success', true, 'order_id', order_record.id);
    ELSE
      -- Payment failed or pending
      UPDATE public.orders 
      SET 
        status = CASE 
          WHEN (payment_data->>'status')::TEXT = 'failed' THEN 'failed'
          ELSE 'pending'
        END,
        payment_id = (payment_data->>'uuid')::TEXT,
        metadata = payment_data,
        updated_at = NOW()
      WHERE id = order_record.id;
      
      RETURN jsonb_build_object('success', true, 'status', payment_data->>'status');
    END IF;
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'Order not found');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on webhook_logs
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage webhook logs" ON public.webhook_logs FOR ALL USING (true);
