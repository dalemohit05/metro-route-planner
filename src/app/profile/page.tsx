import { createServerSupabaseClient } from '@/lib/supabase/server';
import { signOut } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { count: totalBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>

      {/* Header */}
      <header style={{ background: 'var(--bg-header)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-subtle)' }} className="px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <a href="/dashboard" style={{ color: 'var(--text-secondary)' }} className="text-sm hover:opacity-80 transition-opacity">
              Dashboard
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Profile Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '28px', marginBottom: '16px' }}>
          <div className="flex items-center gap-4 mb-6">
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0, color: 'white' }}>
              {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {profile?.full_name || 'User'}
              </h1>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm">{user.email}</p>
              <div style={{
                background: profile?.role === 'admin' ? 'color-mix(in srgb, var(--accent-amber) 12%, transparent)' : 'color-mix(in srgb, var(--accent-indigo) 12%, transparent)',
                border: profile?.role === 'admin' ? '1px solid color-mix(in srgb, var(--accent-amber) 25%, transparent)' : '1px solid color-mix(in srgb, var(--accent-indigo) 25%, transparent)',
                color: profile?.role === 'admin' ? 'var(--accent-amber)' : 'var(--accent-indigo)',
                borderRadius: '6px', padding: '2px 10px', fontSize: '11px', display: 'inline-block', marginTop: '6px', textTransform: 'capitalize'
              }}>
                {profile?.role || 'user'}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div style={{ background: 'var(--bg-stat)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{totalBookings || 0}</div>
              <div style={{ color: 'var(--text-muted)' }} className="text-sm mt-1">Total Bookings</div>
            </div>
            <div style={{ background: 'var(--bg-stat)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {new Date(user.created_at).toLocaleDateString()}
              </div>
              <div style={{ color: 'var(--text-muted)' }} className="text-sm mt-1">Member Since</div>
            </div>
          </div>

          {/* Account Info */}
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
            <h3 style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase tracking-wider font-semibold mb-3">Account Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }} className="text-sm">Email</span>
                <span style={{ color: 'var(--text-primary)' }} className="text-sm">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }} className="text-sm">Name</span>
                <span style={{ color: 'var(--text-primary)' }} className="text-sm">{profile?.full_name || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }} className="text-sm">Role</span>
                <span style={{ color: 'var(--text-primary)' }} className="text-sm capitalize">{profile?.role || 'user'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <a href="/booking"
            style={{ flex: 1, background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-indigo-dim))', borderRadius: '12px', color: 'white', fontWeight: '600', fontSize: '13px', padding: '13px', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
            Book Ticket
          </a>
          <form action={signOut} style={{ flex: 1 }}>
            <button type="submit"
              style={{ width: '100%', background: 'color-mix(in srgb, var(--accent-red) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-red) 25%, transparent)', borderRadius: '12px', color: 'var(--accent-red)', fontWeight: '600', fontSize: '13px', padding: '13px', cursor: 'pointer' }}>
              Logout
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
