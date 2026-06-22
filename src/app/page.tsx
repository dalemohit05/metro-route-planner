import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If logged in, go straight to dashboard
  if (user) {
    redirect('/dashboard');
  }

  // If not logged in, show landing page
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}
    >
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <ThemeToggle />
      </div>

      <div className="text-center">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" showTagline taglineLang="hi" />
        </div>

        <h1
          className="text-3xl md:text-4xl font-bold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Smart Metro Travel for Pune
        </h1>
        <p
          className="mb-10 max-w-md mx-auto"
          style={{ color: 'var(--text-secondary)' }}
        >
          Find the fastest routes, estimate fares, and book metro tickets instantly across Pune Metro.
        </p>

        <div className="flex gap-4 justify-center">
          <a
            href="/login"
            style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-indigo-dim))' }}
            className="px-6 py-3 rounded-xl text-white font-semibold transition-all hover:scale-105"
          >
            Login
          </a>
          <a
            href="/signup"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
            className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
          >
            Sign Up
          </a>
        </div>
      </div>
    </main>
  );
}
