import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://qmltjekfuciwtnnkvjfi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtbHRqZWtmdWNpd3Rubmt2amZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MDUwNjMsImV4cCI6MjA3MTE4MTA2M30.IM2a58300rSKFhMFGF9-qKDXUBQQm7dJ9S-uk7o_g0E'

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
