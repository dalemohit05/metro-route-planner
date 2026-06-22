'use client';

import { useState } from 'react';
import { signIn } from '@/lib/actions/auth';
import Link from 'next/link';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

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
    <main
      className="min-h-screen flex items-center justify-center relative"
      style={{ background: 'var(--bg-page)' }}
    >
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <ThemeToggle />
      </div>

      <div
        style={{ background: 'var(--bg-card)', backdropFilter: 'blur(20px)', border: '1px solid var(--border-subtle)' }}
        className="p-8 rounded-2xl w-full max-w-md"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Logo size="lg" showTagline taglineLang="hi" />
          <p style={{ color: 'var(--text-secondary)' }} className="mt-4 text-sm">Welcome back!</p>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-4">

          <div>
            <label style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium block mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
              className="w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div>
            <label style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium block mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="Your password"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
              className="w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {error && (
            <p
              style={{ background: 'color-mix(in srgb, var(--accent-red) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--accent-red) 25%, transparent)', color: 'var(--accent-red)' }}
              className="text-sm rounded-lg px-4 py-2"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-indigo-dim))' }}
            className="w-full text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ color: 'var(--text-secondary)' }} className="text-center mt-6 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: 'var(--accent-indigo)' }} className="hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
