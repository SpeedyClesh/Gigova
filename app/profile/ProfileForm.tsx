'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Profile, PreferredChain } from '@/lib/types'

const CHAINS: { value: PreferredChain; label: string; symbol: string; note: string }[] = [
  { value: 'polygon_usdc', label: 'Polygon', symbol: 'USDC', note: 'Recommended — low fees, MetaMask' },
  { value: 'tron_usdt', label: 'TRON TRC-20', symbol: 'USDT', note: 'Lowest fees, Trust Wallet & Binance P2P' },
  { value: 'solana_usdc', label: 'Solana', symbol: 'USDC', note: 'Fast & cheap, best for NFT rewards' },
  { value: 'bnb_usdt', label: 'BNB Chain', symbol: 'USDT', note: 'Great for Binance users, P2P to Naira' },
  { value: 'base_usdc', label: 'Base', symbol: 'USDC', note: 'Coinbase L2 — for Web3 natives' },
]

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [fullName, setFullName] = useState(profile.full_name ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [chain, setChain] = useState<PreferredChain>(profile.preferred_chain ?? 'polygon_usdc')
  const [walletAddress, setWalletAddress] = useState(profile.wallet_address ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        bio,
        preferred_chain: chain,
        wallet_address: walletAddress,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">

      {/* Personal info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-900 mb-4">Personal information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00C9A7] text-sm text-slate-900 bg-white"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bio (optional)</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00C9A7] text-sm text-slate-900 bg-white resize-none"
              placeholder="Tell clients a bit about yourself..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-400 bg-slate-50 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Wallet setup */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="font-bold text-slate-900 mb-1">Withdrawal wallet</h2>
        <p className="text-slate-500 text-sm mb-4">Choose your preferred chain and paste your wallet address. This is where your earnings will be sent.</p>

        <div className="space-y-3 mb-4">
          {CHAINS.map(c => (
            <button
              key={c.value}
              type="button"
              onClick={() => setChain(c.value)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                chain === c.value
                  ? 'border-[#00C9A7] bg-[#F0FDFB]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900 text-sm">{c.label}</span>
                  <span className="ml-2 text-xs font-bold text-[#00C9A7] bg-[#E0FDF4] px-2 py-0.5 rounded-full">{c.symbol}</span>
                </div>
                {chain === c.value && (
                  <span className="text-[#00C9A7] text-xs font-bold">Selected ✓</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">{c.note}</p>
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Your wallet address
          </label>
          <input
            type="text"
            value={walletAddress}
            onChange={e => setWalletAddress(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#00C9A7] text-sm text-slate-900 bg-white font-mono"
            placeholder="Paste your wallet address here"
          />
          <p className="text-xs text-slate-400 mt-1">
            Make sure this is the correct address for the chain you selected. Double-check before saving.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3">
          ✓ Profile saved successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-[#00C9A7] hover:bg-[#00A88C] disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
      >
        {saving ? 'Saving...' : 'Save profile'}
      </button>
    </form>
  )
}
