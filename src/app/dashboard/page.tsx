import { createServerSupabaseClient } from '@/lib/supabase/server';
import { signOut } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  // Get current logged in user
  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in, redirect to login
  if (!user) redirect('/login');

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-400">
            🚇 Metro Planner
          </h1>
          <form action={signOut}>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </form>
        </div>

        {/* Welcome Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-gray-400">
            Logged in as: <span className="text-blue-400">{user.email}</span>
          </p>
          <p className="text-green-400 mt-4 text-sm">
            ✅ Authentication is working perfectly!
          </p>
        </div>

      </div>
    </main>
  );
}