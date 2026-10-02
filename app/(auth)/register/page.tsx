'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Role = 'worker' | 'client'

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [role, setRole] = useState<Role>('worker')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
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
          <p className="text-slate-500 mt-1 text-sm">Create your free account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

          {/* Step 1 — Choose Role */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">I want to...</h2>
              <p className="text-slate-500 text-sm mb-6">Choose how you&apos;ll use Gigova</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setRole('worker')}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    role === 'worker'
                      ? 'border-[#00C9A7] bg-[#F0FDFB]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-3">💰</div>
                  <div className="font-bold text-slate-900 text-sm">Earn money</div>
                  <div className="text-xs text-slate-500 mt-1">Complete tasks, get paid</div>
                </button>

                <button
                  onClick={() => setRole('client')}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${
                    role === 'client'
                      ? 'border-[#F59E0B] bg-[#FFFBEB]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-3">📋</div>
                  <div className="font-bold text-slate-900 text-sm">Post tasks</div>
                  <div className="text-xs text-slate-500 mt-1">Hire global workers</div>
                </button>
              </div>

              <div className={`rounded-xl p-4 mb-6 text-sm ${
                role === 'worker'
                  ? 'bg-[#F0FDFB] border border-[#00C9A7]/20'
                  : 'bg-[#FFFBEB] border border-[#F59E0B]/20'
              }`}>
                {role === 'worker' ? (
                  <ul className="space-y-1 text-slate-600">
                    <li>✓ Free to join — no deposits ever</li>
                    <li>✓ Withdraw from just $2</li>
                    <li>✓ Earn USDC, USDT, tokens & NFTs</li>
                    <li>✓ Work from anywhere, anytime</li>
                  </ul>
                ) : (
                  <ul className="space-y-1 text-slate-600">
                    <li>✓ Access thousands of motivated workers</li>
                    <li>✓ Pay only for verified completions</li>
                    <li>✓ Budget held in escrow until done</li>
                    <li>✓ Web3 & traditional brands welcome</li>
                  </ul>
                )}
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-[#00C9A7] hover:bg-[#00A88C] text-white font-bold py-3 rounded-xl transition-colors"
              >
                Continue as {role === 'worker' ? 'Worker' : 'Client'}
              </button>
            </div>
          )}

          {/* Step 2 — Fill Details */}
          {step === 2 && (
            <div>
              <button
                onClick={() => setStep(1)}
                className="text-slate-400 hover:text-slate-600 text-sm mb-4 flex items-center gap-1"
              >
                ← Back
              </button>

              <h2 className="text-xl font-bold text-slate-900 mb-2">
                {role === 'worker' ? '💰 Worker account' : '📋 Client account'}
              </h2>
              <p className="text-slate-500 text-sm mb-6">Fill in your details to get started</p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00C9A7] text-sm text-slate-900 placeholder-slate-400 transition-colors bg-white"
                  />
                </div>

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
                    placeholder="Min. 8 characters"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00C9A7] text-sm text-slate-900 placeholder-slate-400 transition-colors bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00C9A7] hover:bg-[#00A88C] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>

              <p className="text-xs text-slate-400 text-center mt-4">
                By signing up you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#00C9A7] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
