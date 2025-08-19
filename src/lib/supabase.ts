import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qmltjekfuciwtnnkvjfi.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

if (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (you can generate these from Supabase CLI)
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  email: string
  payment_provider: 'gumroad' | 'cryptomus'
  payment_id: string
  amount: number
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

export interface Review {
  id: string
  user_id?: string
  email: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface Course {
  id: string
  name: string
  description: string
  category: string
  file_url?: string
  created_at: string
}
