import { createServerSupabaseClient } from '@/lib/supabase/server';
import { signOut } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <main className="min-h-screen text-white"
      style={{ background: 'radial-gradient(ellipse at 20% 0%, #0d1b3e 0%, #020817 60%)' }}>

      {/* Header */}
      <header style={{ background: 'rgba(8,12,28,0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }} className="px-6 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }} className="flex items-center justify-center">🚇</div>
            <div>
              <div className="text-white font-bold text-sm">SD Metro</div>
              <div className="text-xs" style={{ color: '#6366f1' }}>Smart Route Planning</div>
            </div>
          </div>
          <form action={signOut}>
            <button type="submit"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', fontSize: '13px', padding: '6px 14px', cursor: 'pointer' }}>
              Logout
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Welcome */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
          <h2 className="text-xl font-semibold text-white mb-1">Welcome back! 👋</h2>
          <p className="text-gray-400 text-sm">
            Logged in as <span className="text-blue-400">{user.email}</span>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <a href="/planner"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)', borderRadius: '16px', padding: '24px', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}>
            <div className="text-3xl mb-3">🗺️</div>
            <div className="text-white font-semibold text-lg">Plan Route</div>
            <div className="text-blue-200 text-sm mt-1">Find shortest path</div>
          </a>

          <a href="/booking"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}>
            <div className="text-3xl mb-3">🎫</div>
            <div className="text-white font-semibold text-lg">Book Ticket</div>
            <div className="text-gray-400 text-sm mt-1">Book your journey</div>
          </a>

          <a href="/profile"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}>
            <div className="text-3xl mb-3">👤</div>
            <div className="text-white font-semibold text-lg">Profile</div>
            <div className="text-gray-400 text-sm mt-1">View your account</div>
          </a>

          <a href="/map"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}>
            <div className="text-3xl mb-3">🌐</div>
            <div className="text-white font-semibold text-lg">Metro Map</div>
            <div className="text-gray-400 text-sm mt-1">Interactive metro map</div>
          </a>

          <a href="/admin"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}>
            <div className="text-3xl mb-3">👑</div>
            <div className="text-white font-semibold text-lg">Admin Panel</div>
            <div className="text-gray-400 text-sm mt-1">Manage system</div>
          </a>

        </div>
      </div>
    </main>
  );
}