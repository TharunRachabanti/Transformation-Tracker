'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dumbbell, Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  async function handleBypass() {
    // For local dev, bypass Supabase entirely to avoid email rate limits
    document.cookie = "dev_bypass=true; path=/;"
    router.push('/')
    router.refresh()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
      }
      router.push('/')
      router.refresh()
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('rate limit')) {
        setError('Supabase free tier rate limit hit! Please use the Dev Bypass button below to continue testing the app.')
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-slate-950 to-violet-950/40 pointer-events-none" />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 mb-4 shadow-lg shadow-blue-500/25">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Transformation Tracker</h1>
          <p className="text-slate-400 text-sm mt-1">Your personal transformation system</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-6 shadow-xl border border-slate-800/60">
          <div className="flex rounded-xl bg-slate-800/50 p-1 mb-6">
            {['Login', 'Sign Up'].map((tab, i) => (
              <button
                key={tab}
                onClick={() => { setIsLogin(i === 0); setError('') }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  isLogin === (i === 0)
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
            <div className="relative pt-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-900 px-2 text-slate-400">or</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleBypass}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-3 rounded-xl transition-all border border-slate-700 shadow-lg flex items-center justify-center gap-2"
            >
              Skip Auth (Dev Bypass)
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-600 mt-6">
          Personal fitness tracker · Not medical advice
        </p>
      </div>
    </div>
  )
}
