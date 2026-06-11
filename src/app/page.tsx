import { createServerSupabaseClient } from '@/lib/supabase/server';

export default async function HomePage() {
  let connected = false;

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('_test').select('*').limit(1);

    // All these mean connection works — table just doesn't exist yet
    if (
      !error ||
      error.code === '42P01' ||
      error.code === 'PGRST116' ||
      error.message.includes('schema cache')
    ) {
      connected = true;
    }
  } catch (e) {
    connected = false;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
      <h1 className="text-4xl font-bold text-blue-400">
        🚇 Metro Route Planner
      </h1>
      <p className="mt-4 text-lg">
        Supabase:{' '}
        <span className={connected ? 'text-green-400' : 'text-red-400'}>
          {connected ? '✅ Connected!' : '❌ Not connected'}
        </span>
      </p>
    </main>
  );
}