import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <a href="/dashboard" className="text-xl font-extrabold tracking-tight text-slate-900">
          Gig<span className="text-[#00C9A7]">ova</span>
        </a>
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-sm text-slate-500 hover:text-slate-700">Back to dashboard</a>
          <form action="/auth/signout" method="post">
            <button className="text-sm text-slate-400 hover:text-slate-600">Sign out</button>
          </form>
        </div>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Your profile</h1>
        <p className="text-slate-500 text-sm mb-8">Set up your wallet to start receiving payouts</p>
        <ProfileForm profile={profile} />
      </div>
    </div>
  )
}
