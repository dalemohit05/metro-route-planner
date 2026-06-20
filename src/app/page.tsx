import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Logo from '@/components/Logo';

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If logged in, go straight to dashboard
  if (user) {
    redirect('/dashboard');
  }

  // If not logged in, show landing page
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-white px-6"
      style={{ background: 'radial-gradient(ellipse at 20% 0%, #0d1b3e 0%, #020817 60%)' }}>

      <div className="text-center">
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" showTagline taglineLang="hi" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Smart Metro Travel for Pune
        </h1>
        <p className="text-gray-400 mb-10 max-w-md mx-auto">
          Find the fastest routes, estimate fares, and book metro tickets instantly across Pune Metro.
        </p>

        <div className="flex gap-4 justify-center">
          <a href="/login"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
            className="px-6 py-3 rounded-xl text-white font-semibold transition-all hover:scale-105">
            Login
          </a>
          <a href="/signup"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            className="px-6 py-3 rounded-xl text-white font-semibold transition-all hover:scale-105">
            Sign Up
          </a>
        </div>
      </div>
    </main>
  );
}
