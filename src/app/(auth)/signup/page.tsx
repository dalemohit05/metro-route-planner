'use client';

import { useState } from 'react';
import { signUp } from '@/lib/actions/auth';
import Link from 'next/link';

export default function SignupPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    const result = await signUp(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md border border-gray-800">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">🚇 Metro Planner</h1>
          <p className="text-gray-400 mt-2">Create your account</p>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="text-gray-300 text-sm font-medium block mb-1">
              Full Name
            </label>
            <input
              name="fullName"
              type="text"
              required
              placeholder="Mohit Dale"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-300 text-sm font-medium block mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="mohit@example.com"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-300 text-sm font-medium block mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="Min 6 characters"
              minLength={6}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-400 text-sm bg-red-950 border border-red-800 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}