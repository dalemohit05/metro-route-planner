import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// This function creates a Supabase client for use on the server (server components, API routes)
// It needs access to cookies for authentication sessions
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component — cookies can't be set, that's okay
          }
        },
      },
    }
  );
}