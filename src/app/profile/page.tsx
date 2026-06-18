import { createServerSupabaseClient } from '@/lib/supabase/server';
import { signOut } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';

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
    <main className="min-h-screen text-white"
      style={{ background: 'radial-gradient(ellipse at 20% 0%, #0d1b3e 0%, #020817 60%)' }}>

      {/* Header */}
      <header style={{ background: 'rgba(8,12,28,0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }} className="px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }} className="flex items-center justify-center">🚇</div>
            <div>
              <div className="text-white font-bold text-sm">SD Metro</div>
              <div className="text-xs" style={{ color: '#6366f1' }}>My Profile</div>
            </div>
          </div>
          <a href="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">
            Dashboard
          </a>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Profile Card */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px', marginBottom: '16px' }}>
          <div className="flex items-center gap-4 mb-6">
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>
              {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {profile?.full_name || 'User'}
              </h1>
              <p className="text-gray-400 text-sm">{user.email}</p>
              <div style={{ background: profile?.role === 'admin' ? 'rgba(245,158,11,0.1)' : 'rgba(99,102,241,0.1)', border: profile?.role === 'admin' ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(99,102,241,0.2)', color: profile?.role === 'admin' ? '#f59e0b' : '#818cf8', borderRadius: '6px', padding: '2px 10px', fontSize: '11px', display: 'inline-block', marginTop: '6px', textTransform: 'capitalize' }}>
                {profile?.role || 'user'}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div className="text-2xl font-bold text-white">{totalBookings || 0}</div>
              <div className="text-gray-500 text-sm mt-1">Total Bookings</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div className="text-2xl font-bold text-white">
                {new Date(user.created_at).toLocaleDateString()}
              </div>
              <div className="text-gray-500 text-sm mt-1">Member Since</div>
            </div>
          </div>

          {/* Account Info */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
            <h3 className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-3">Account Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Email</span>
                <span className="text-white text-sm">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Name</span>
                <span className="text-white text-sm">{profile?.full_name || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Role</span>
                <span className="text-white text-sm capitalize">{profile?.role || 'user'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <a href="/booking"
            style={{ flex: 1, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: '12px', color: 'white', fontWeight: '600', fontSize: '13px', padding: '13px', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
            Book Ticket
          </a>
          <form action={signOut} style={{ flex: 1 }}>
            <button type="submit"
              style={{ width: '100%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', color: '#f87171', fontWeight: '600', fontSize: '13px', padding: '13px', cursor: 'pointer' }}>
              Logout
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}