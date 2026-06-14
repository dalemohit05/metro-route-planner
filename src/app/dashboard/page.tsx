import { createServerSupabaseClient } from '@/lib/supabase/server';
import { signOut } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-400">🚇 Metro Planner</h1>
          <form action={signOut}>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </form>
        </div>

        {/* Welcome */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-1">Welcome back! 👋</h2>
          <p className="text-gray-400">
            Logged in as <span className="text-blue-400">{user.email}</span>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/planner"
            className="bg-blue-600 hover:bg-blue-700 rounded-2xl p-6 transition-colors">
            <div className="text-3xl mb-2">🗺️</div>
            <div className="font-semibold text-lg">Plan Route</div>
            <div className="text-blue-200 text-sm">Find shortest path</div>
          </a>
          <a href="/booking"
            className="bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-2xl p-6 transition-colors">
            <div className="text-3xl mb-2">🎫</div>
            <div className="font-semibold text-lg">Book Ticket</div>
            <div className="text-gray-400 text-sm">Coming in Phase 7</div>
          </a>
          <a href="/profile"
            className="bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-2xl p-6 transition-colors">
            <div className="text-3xl mb-2">👤</div>
            <div className="font-semibold text-lg">Profile</div>
            <div className="text-gray-400 text-sm">Coming soon</div>
          </a>
        </div>

      </div>
    </main>
  );
}