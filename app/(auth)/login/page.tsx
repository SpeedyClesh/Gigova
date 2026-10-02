'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FDFB] via-[#FFFBEB] to-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Gig<span className="text-[#00C9A7]">ova</span>
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Welcome back — sign in to continue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Sign in</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00C9A7] text-sm text-slate-900 placeholder-slate-400 transition-colors bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00C9A7] text-sm text-slate-900 placeholder-slate-400 transition-colors bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00C9A7] hover:bg-[#00A88C] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <Link href="#" className="text-sm text-slate-400 hover:text-slate-600">
              Forgot password?
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#00C9A7] font-semibold hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}
