-- Fix critical security vulnerability in orders table RLS policies
-- Current policy allows anyone to view all orders (Using Expression: true)
-- This exposes sensitive customer data including emails, amounts, and payment details

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view orders by email" ON public.orders;

-- Create a secure policy that only allows users to view orders with their own email
-- This prevents users from accessing other customers' order information
CREATE POLICY "Users can only view their own orders by email" 
ON public.orders 
FOR SELECT 
USING (
  -- Only allow access to orders if the user provides the correct email
  -- This requires the application to filter by email in the query
  auth.email() = email OR 
  -- Allow if email is passed as a parameter and matches
  email = current_setting('request.jwt.claims', true)::json->>'email'
);

-- Alternative: Create a more restrictive policy that requires authentication
-- Uncomment the following if you want to require authentication for all order access:

-- CREATE POLICY "Authenticated users can view orders by email match" 
-- ON public.orders 
-- FOR SELECT 
-- TO authenticated
-- USING (auth.email() = email);

-- Add a policy to allow users to update their own orders (for order status updates)
CREATE POLICY "Users can update their own orders"
ON public.orders
FOR UPDATE
USING (auth.email() = email)
WITH CHECK (auth.email() = email);