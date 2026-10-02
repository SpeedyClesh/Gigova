import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, tier, total_earned, total_tasks_completed, reputation_score')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  if (profile.role === 'admin') redirect('/admin')
  if (profile.role === 'client') redirect('/dashboard/client')

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-extrabold tracking-tight">
          Gig<span className="text-[#00C9A7]">ova</span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">
            Welcome, {profile.full_name?.split(' ')[0] ?? 'Worker'}
          </span>
          <form action="/auth/signout" method="post">
            <button className="text-sm text-slate-400 hover:text-slate-600">
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="text-2xl font-bold text-slate-900">
              ${Number(profile.total_earned).toFixed(2)}
            </div>
            <div className="text-sm text-slate-500 mt-1">Total earned</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="text-2xl font-bold text-slate-900">
              {profile.total_tasks_completed}
            </div>
            <div className="text-sm text-slate-500 mt-1">Tasks completed</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="text-2xl font-bold text-[#00C9A7]">
              {profile.reputation_score}
            </div>
            <div className="text-sm text-slate-500 mt-1">Reputation score</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="text-2xl font-bold text-[#F59E0B] capitalize">
              {profile.tier}
            </div>
            <div className="text-sm text-slate-500 mt-1">Worker tier</div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <a
            href="/tasks"
            className="bg-[#0F1C3F] text-white rounded-2xl p-6 hover:bg-[#1a2f5e] transition-colors"
          >
            <div className="text-2xl mb-3">🎯</div>
            <div className="font-bold text-lg">Browse tasks</div>
            <div className="text-slate-400 text-sm mt-1">
              Find tasks to complete and earn
            </div>
          </a>
          <a
            href="/profile"
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#00C9A7] transition-colors"
          >
            <div className="text-2xl mb-3">⚙️</div>
            <div className="font-bold text-lg text-slate-900">Set up wallet</div>
            <div className="text-slate-500 text-sm mt-1">
              Add your withdrawal wallet address
            </div>
          </a>
        </div>

        {/* Getting started checklist */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4">Getting started</h2>
          <div className="space-y-3">
            {[
              { done: true, text: 'Create your account' },
              { done: false, text: 'Set up your withdrawal wallet' },
              { done: false, text: 'Complete your first task' },
              { done: false, text: 'Receive your first payout' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  item.done
                    ? 'bg-[#00C9A7] text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {item.done ? '✓' : i + 1}
                </div>
                <span className={`text-sm ${
                  item.done ? 'line-through text-slate-400' : 'text-slate-700'
                }`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
