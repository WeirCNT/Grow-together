import { createClient } from '@supabase/supabase-js'

const rawSupabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://placeholder.supabase.co'
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'placeholder-key'

// Normalize Supabase base URL: Strip any trailing /rest/v1, /auth/v1, or trailing slashes
const supabaseUrl = rawSupabaseUrl
  .trim()
  .replace(/\/(rest|auth)\/v1\/?$/i, '')
  .replace(/\/+$/, '')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
