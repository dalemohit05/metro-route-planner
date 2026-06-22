import { createServerSupabaseClient } from '@/lib/supabase/server';
import { signOut } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>

      {/* Header */}
      <header
        style={{ background: 'var(--bg-header)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-subtle)' }}
        className="px-6 py-4 sticky top-0 z-50"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <form action={signOut}>
              <button
                type="submit"
                style={{ background: 'color-mix(in srgb, var(--accent-red) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-red) 25%, transparent)', borderRadius: '8px', color: 'var(--accent-red-dim)', fontSize: '13px', padding: '6px 14px', cursor: 'pointer' }}
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Welcome */}
        <div
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}
        >
          <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Welcome back! 👋</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Logged in as <span style={{ color: 'var(--accent-indigo)' }}>{user.email}</span>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <a href="/planner"
            style={{ background: 'linear-gradient(135deg, var(--accent-indigo-dim), var(--accent-indigo))', borderRadius: '16px', padding: '24px', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}>
            <div className="text-3xl mb-3">🗺️</div>
            <div className="text-white font-semibold text-lg">Plan Route</div>
            <div style={{ color: 'rgba(255,255,255,0.8)' }} className="text-sm mt-1">Find shortest path</div>
          </a>

          <a href="/booking"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}>
            <div className="text-3xl mb-3">🎫</div>
            <div className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Book Ticket</div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Book your journey</div>
          </a>

          <a href="/profile"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}>
            <div className="text-3xl mb-3">👤</div>
            <div className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Profile</div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>View your account</div>
          </a>

          <a href="/map"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}>
            <div className="text-3xl mb-3">🌐</div>
            <div className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Metro Map</div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Interactive metro map</div>
          </a>

          <a href="/admin"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '24px', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}>
            <div className="text-3xl mb-3">👑</div>
            <div className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Admin Panel</div>
            <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Manage system</div>
          </a>

        </div>
      </div>
    </main>
  );
}
