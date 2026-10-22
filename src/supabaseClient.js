import { createClient } from '@supabase/supabase-js'

// Supabase project keys. These live in a local .env file (not committed)
// and in Vercel > Settings > Environment Variables for the live site.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// If the keys are missing, export null instead of crashing so the app
// can show a friendly "login not set up yet" message.
export const supabase = url && key ? createClient(url, key) : null
export const authReady = !!supabase
