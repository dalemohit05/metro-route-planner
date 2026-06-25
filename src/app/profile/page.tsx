'use client';

import { useState, useEffect, useTransition } from 'react';
import { motion } from 'framer-motion';
import { signOut, updateProfile } from '@/lib/actions/auth';
import { createClient } from '@/lib/supabase/client';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

interface ProfileData {
  full_name: string | null;
  role: string | null;
}

interface BookingRow {
  id: string;
  fare: number;
  distance: number | null;
  travel_time: number | null;
  journey_date: string;
  status: string;
  created_at: string;
}

interface FavoriteRow {
  id: string;
  nickname: string | null;
  source_station_id: string | null;
  destination_station_id: string | null;
}

export default function ProfilePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userCreatedAt, setUserCreatedAt] = useState('');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);

  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserEmail(user.email || '');
      setUserCreatedAt(user.created_at);

      const [{ data: profileData }, { data: bookingData }, { data: favoriteData }] = await Promise.all([
        supabase.from('profiles').select('full_name, role').eq('id', user.id).single(),
        supabase.from('bookings').select('id, fare, distance, travel_time, journey_date, status, created_at')
          .eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
        supabase.from('favorites').select('id, nickname, source_station_id, destination_station_id')
          .eq('user_id', user.id),
      ]);

      setProfile(profileData);
      setNameInput(profileData?.full_name || '');
      setBookings(bookingData || []);
      setFavorites(favoriteData || []);
      setLoading(false);
    }
    load();
  }, [supabase]);

  function handleSaveName() {
    setSaveMessage('');
    const formData = new FormData();
    formData.append('fullName', nameInput);

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) {
        setSaveMessage(result.error);
      } else {
        setProfile((p) => (p ? { ...p, full_name: nameInput } : p));
        setEditing(false);
        setSaveMessage('Saved!');
        setTimeout(() => setSaveMessage(''), 2000);
      }
    });
  }

  const totalBookings = bookings.length;

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </main>
    );
  }

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
              {(profile?.full_name || userEmail || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
                    className="rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveName}
                      disabled={isPending}
                      style={{ background: 'var(--accent-indigo)', color: 'white', borderRadius: '8px', fontSize: '12px', padding: '6px 14px', fontWeight: 600 }}
                    >
                      {isPending ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => { setEditing(false); setNameInput(profile?.full_name || ''); }}
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', borderRadius: '8px', fontSize: '12px', padding: '6px 14px' }}
                    >
                      Cancel
                    </button>
                  </div>
                  {saveMessage && (
                    <span style={{ color: saveMessage === 'Saved!' ? 'var(--accent-green)' : 'var(--accent-red)' }} className="text-xs">
                      {saveMessage}
                    </span>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {profile?.full_name || 'User'}
                    </h1>
                    <button
                      onClick={() => setEditing(true)}
                      style={{ color: 'var(--accent-indigo)' }}
                      className="text-xs hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm">{userEmail}</p>
                  <div style={{
                    background: profile?.role === 'admin' ? 'color-mix(in srgb, var(--accent-amber) 12%, transparent)' : 'color-mix(in srgb, var(--accent-indigo) 12%, transparent)',
                    border: profile?.role === 'admin' ? '1px solid color-mix(in srgb, var(--accent-amber) 25%, transparent)' : '1px solid color-mix(in srgb, var(--accent-indigo) 25%, transparent)',
                    color: profile?.role === 'admin' ? 'var(--accent-amber)' : 'var(--accent-indigo)',
                    borderRadius: '6px', padding: '2px 10px', fontSize: '11px', display: 'inline-block', marginTop: '6px', textTransform: 'capitalize'
                  }}>
                    {profile?.role || 'user'}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div style={{ background: 'var(--bg-stat)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{totalBookings}</div>
              <div style={{ color: 'var(--text-muted)' }} className="text-sm mt-1">Total Bookings</div>
            </div>
            <div style={{ background: 'var(--bg-stat)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {userCreatedAt ? new Date(userCreatedAt).toLocaleDateString() : '—'}
              </div>
              <div style={{ color: 'var(--text-muted)' }} className="text-sm mt-1">Member Since</div>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <span>🎨</span> Theme Settings
          </h3>
          <div className="flex items-center justify-between">
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Choose your appearance preference</p>
            <ThemeToggle />
          </div>
        </div>

        {/* Travel History */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <span>🕓</span> Travel History
          </h3>
          {bookings.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {bookings.map((b) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px' }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{b.journey_date}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {b.distance ?? '—'} km · {b.travel_time ?? '—'} min
                    </div>
                  </div>
                  <div className="text-right">
                    <div style={{ color: 'var(--accent-green)' }} className="font-semibold text-sm">Rs. {b.fare}</div>
                    <div style={{ color: 'var(--text-muted)' }} className="text-xs capitalize">{b.status}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p style={{ color: 'var(--text-muted)' }} className="text-sm mb-2">No journeys booked yet</p>
              <a href="/booking" style={{ color: 'var(--accent-indigo)' }} className="text-sm font-medium hover:underline">
                Book your first ticket →
              </a>
            </div>
          )}
        </div>

        {/* Saved Routes */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '20px', marginBottom: '16px' }}>
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <span>⭐</span> Saved Routes
          </h3>
          {favorites.length > 0 ? (
            <div className="space-y-3">
              {favorites.map((f) => (
                <div key={f.id}
                  style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px' }}>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {f.nickname || 'Saved Route'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p style={{ color: 'var(--text-muted)' }} className="text-sm">
                No saved routes yet. Save your favorite journeys from the planner for quick access.
              </p>
            </div>
          )}
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
