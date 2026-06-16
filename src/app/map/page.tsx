'use client';

import dynamic from 'next/dynamic';

const MetroMap3D = dynamic(() => import('@/components/MetroMap3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full flex items-center justify-center bg-gray-950 text-white" style={{ height: '600px' }}>
      <div className="text-center">
        <div className="text-4xl mb-4">🚇</div>
        <p className="text-gray-400">Loading 3D Metro Map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-400">3D Metro Map</h1>
        <div className="flex gap-4 text-sm">
          <a href="/planner" className="text-gray-400 hover:text-white">Planner</a>
          <a href="/booking" className="text-gray-400 hover:text-white">Book</a>
          <a href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</a>
        </div>
      </div>
      <MetroMap3D />
    </main>
  );
}