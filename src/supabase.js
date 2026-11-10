import { createClient } from '@supabase/supabase-js'

// المفاتيح تُقرأ من ملف .env  (انسخي .env.example إلى .env وضعي مفاتيحك)
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  key || 'placeholder-key'
)

// يساعد على معرفة هل وضعتِ المفاتيح أم لا
export const supabaseConfigured = Boolean(url && key)
