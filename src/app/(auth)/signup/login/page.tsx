'use client';

import { useState } from 'react';
import { signIn } from '@/lib/actions/auth';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    const result = await signIn(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 20% 0%, #0d1b3e 0%, #020817 60%)' }}>
      <div style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.07)' }}
        className="p-8 rounded-2xl w-full max-w-md">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" showTagline taglineLang="hi" />
          <p className="text-gray-400 mt-4 text-sm">Welcome back!</p>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-4">

          <div>
            <label className="text-gray-400 text-sm font-medium block mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
              className="w-full text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm font-medium block mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="Your password"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
              className="w-full text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-950 border border-red-800 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
            className="w-full text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
