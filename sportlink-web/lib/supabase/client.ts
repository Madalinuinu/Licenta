import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://vvaipdachdjxhmiqlzoj.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2YWlwZGFjaGRqeGhtaXFsem9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNzgyMzQsImV4cCI6MjA4NDY1NDIzNH0.KxiXkT31xmL2xYkrogMt8v7oTuTB7_NVUIEomTd4SN8'
  )
}
