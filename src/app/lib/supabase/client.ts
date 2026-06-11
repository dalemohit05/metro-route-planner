import { createBrowserClient } from '@supabase/ssr';

// This function creates a Supabase client for use in the browser (client components)
// It reads the URL and key from your .env.local file
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}