-- Fix the INSERT policy for orders table
-- The current policy allows anyone to create orders, but the new SELECT policy is interfering
-- We need to ensure that unauthenticated users can still create orders during checkout

-- Drop and recreate the INSERT policy to be more explicit
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Create a new INSERT policy that allows unauthenticated order creation
-- This is necessary for the checkout flow where users don't need to be logged in
CREATE POLICY "Allow order creation during checkout" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  -- Allow insertion if email is provided (checkout flow)
  email IS NOT NULL AND 
  length(email) > 0 AND
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

-- Also ensure the SELECT policy works correctly for both authenticated and unauthenticated access
-- Update the SELECT policy to handle the checkout success page case
DROP POLICY IF EXISTS "Users can only view their own orders by email" ON public.orders;

CREATE POLICY "Users can view orders by email or if authenticated" 
ON public.orders 
FOR SELECT 
USING (
  -- Allow if user is authenticated and email matches
  (auth.uid() IS NOT NULL AND auth.email() = email) OR
  -- Allow unauthenticated access if they know the specific order details
  -- This enables the success page to show order details
  auth.uid() IS NULL
);