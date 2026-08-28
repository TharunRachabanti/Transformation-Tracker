'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Zap, Shield, TrendingDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'

const FEATURES = [
  { icon: TrendingDown, label: 'Track weight loss', color: 'text-emerald-400' },
  { icon: Zap, label: 'Log workouts & meals', color: 'text-[#8CA488]' },
  { icon: Shield, label: 'Private & secure', color: 'text-violet-400' },
]

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/')
        router.refresh()
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccess('Account created! Check your inbox to confirm your email, then sign in.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      if (msg.includes('rate limit')) {
        setError('Too many attempts. Please wait a few minutes and try again.')
      } else if (msg.includes('Email not confirmed')) {
        setError('Please confirm your email before signing in. Check your inbox.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel — Decorative (desktop only) */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-[#050a1a]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(/auth-bg.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1535]/80 via-[#06102c]/70 to-[#0d0921]/80" />
        <div className="relative z-10 flex flex-col justify-center px-14 max-w-lg">
          {/* Logo */}
          <div className="mb-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#748C70] to-[#C2A878] flex items-center justify-center mb-5 shadow-lg shadow-[#748C70]/30">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white leading-tight">
              Transformation<br />Tracker
            </h1>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Your complete personal fitness system — where every rep, every meal, and every step counts.
            </p>
          </div>
          {/* Feature pills */}
          <div className="space-y-3">
            {FEATURES.map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <span className="text-slate-300 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0d1110] relative overflow-hidden">
        {/* Ambient background circles */}
        <div className="absolute top-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full bg-[#748C70]/6 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-60px] w-[250px] h-[250px] rounded-full bg-[#C2A878]/5 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[380px]"
        >
          {/* Mobile Logo */}
          <div className="flex flex-col items-center mb-8 md:hidden">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#748C70] to-[#C2A878] flex items-center justify-center mb-3 shadow-lg shadow-[#748C70]/30">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">Transformation Tracker</h1>
            <p className="text-slate-500 text-xs mt-1">Your personal transformation system</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-2xl bg-[#111611] p-1.5 mb-7 border border-[#232b21]">
            {['Sign In', 'Create Account'].map((tab, i) => (
              <button
                key={tab}
                onClick={() => { setIsLogin(i === 0); setError(''); setSuccess('') }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isLogin === (i === 0)
                    ? 'bg-gradient-to-r from-[#748C70] to-[#7b6bff] text-white shadow-md shadow-[#748C70]/20'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full bg-[#161c16] border border-[#232b21] hover:border-[#2f402c] focus:border-[#748C70]/60 focus:ring-2 focus:ring-[#748C70]/20 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-slate-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full bg-[#161c16] border border-[#232b21] hover:border-[#2f402c] focus:border-[#748C70]/60 focus:ring-2 focus:ring-[#748C70]/20 rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder:text-slate-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3"
              >
                <span className="text-red-400 text-xs mt-0.5">⚠</span>
                <p className="text-red-400 text-xs leading-relaxed">{error}</p>
              </motion.div>
            )}

            {/* Success */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 bg-emerald-500/8 border border-emerald-500/20 rounded-xl px-4 py-3"
              >
                <span className="text-emerald-400 text-xs mt-0.5">✓</span>
                <p className="text-emerald-400 text-xs leading-relaxed">{success}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#748C70] to-[#C2A878] hover:from-[#839c7f] hover:to-[#d1b787] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-[#748C70]/25 hover:shadow-[#748C70]/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 text-sm"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Free Account'}
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-600 mt-8 leading-relaxed">
            Personal fitness tracker · Your data is private<br />
            Not medical advice · Use for motivation only
          </p>
        </motion.div>
      </div>
    </div>
  )
}
