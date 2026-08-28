'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check, User, Scale, Target, Dumbbell, Droplets, ChevronDown } from 'lucide-react'
import { saveOnboardingProfile } from './actions'

// ── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  name: string
  age: string
  heightCm: string
  startingWeight: string
  targetWeight: string
  calorieTarget: string
  proteinTarget: string
  waterTargetL: string
  stepTarget: string
  gymDays: number
}

// ── Step Config ───────────────────────────────────────────────────────────────
const STEPS = [
  { id: 'welcome', title: 'Welcome!', subtitle: "Let's set up your profile", icon: User },
  { id: 'body', title: 'Body Stats', subtitle: 'Tell us about yourself', icon: Scale },
  { id: 'goals', title: 'Your Goals', subtitle: 'Where do you want to be?', icon: Target },
  { id: 'targets', title: 'Daily Targets', subtitle: 'Customize your daily plan', icon: Droplets },
  { id: 'fitness', title: 'Fitness Routine', subtitle: 'Your gym schedule', icon: Dumbbell },
]

// ── Helpers ──────────────────────────────────────────────────────────────────
function calcRecommendedCalories(weightKg: number, heightCm: number, age: number) {
  // Mifflin-St Jeor (Male, moderate activity as default)
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5
  return Math.round(bmr * 1.55 * 0.85) // 15% deficit
}

function calcRecommendedProtein(weightKg: number) {
  return Math.round(weightKg * 2.0)
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormData>({
    name: '',
    age: '',
    heightCm: '',
    startingWeight: '',
    targetWeight: '',
    calorieTarget: '',
    proteinTarget: '',
    waterTargetL: '3.5',
    stepTarget: '10000',
    gymDays: 4,
  })

  const update = (field: keyof FormData, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  // Auto-calculate targets when moving from body/goals step
  function autoCalc() {
    const weight = parseFloat(form.startingWeight)
    const height = parseFloat(form.heightCm)
    const age = parseInt(form.age) || 25
    if (!form.calorieTarget && weight > 0 && height > 0) {
      update('calorieTarget', String(calcRecommendedCalories(weight, height, age)))
    }
    if (!form.proteinTarget && weight > 0) {
      update('proteinTarget', String(calcRecommendedProtein(weight)))
    }
  }

  function next() {
    if (step === 2) autoCalc()
    if (step < STEPS.length - 1) setStep((s) => s + 1)
  }

  function back() {
    if (step > 0) setStep((s) => s - 1)
  }

  function skip() {
    router.push('/')
  }

  function finish() {
    setError('')
    startTransition(async () => {
      try {
        await saveOnboardingProfile({
          name: form.name,
          startingWeight: parseFloat(form.startingWeight) || 80,
          targetWeight: parseFloat(form.targetWeight) || 70,
          heightCm: parseFloat(form.heightCm) || 175,
          calorieTarget: parseInt(form.calorieTarget) || 2000,
          proteinTargetG: parseInt(form.proteinTarget) || 150,
          waterTargetMl: Math.round(parseFloat(form.waterTargetL) * 1000) || 3500,
          stepTarget: parseInt(form.stepTarget) || 10000,
          gymDaysPerWeek: form.gymDays,
        })
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      }
    })
  }

  const isLast = step === STEPS.length - 1

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Ambient blobs */}
      <div className="fixed top-[-120px] right-[-80px] w-[400px] h-[400px] rounded-full bg-[#4f7cff]/6 blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-100px] left-[-60px] w-[300px] h-[300px] rounded-full bg-[#9b6dff]/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-3">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className={`flex-1 h-1 rounded-full mx-0.5 transition-all duration-500 ${
                  i <= step ? 'bg-gradient-to-r from-[#4f7cff] to-[#9b6dff]' : 'bg-[#1a2550]'
                }`}
              />
            ))}
          </div>
          <p className="text-[10px] text-slate-600 text-center">Step {step + 1} of {STEPS.length}</p>
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="rounded-3xl p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(17,28,65,0.95) 0%, rgba(10,16,38,0.98) 100%)',
              border: '1px solid rgba(79,124,255,0.12)',
            }}
          >
            {/* Step Header */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #4f7cff, #9b6dff)' }}
              >
                {(() => {
                  const Icon = STEPS[step].icon
                  return <Icon className="w-5 h-5 text-white" />
                })()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{STEPS[step].title}</h2>
                <p className="text-xs text-slate-500">{STEPS[step].subtitle}</p>
              </div>
            </div>

            {/* Step Content */}
            {step === 0 && <StepWelcome form={form} update={update} />}
            {step === 1 && <StepBody form={form} update={update} />}
            {step === 2 && <StepGoals form={form} update={update} />}
            {step === 3 && <StepTargets form={form} update={update} />}
            {step === 4 && <StepFitness form={form} update={update} />}

            {error && (
              <p className="mt-4 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                {error}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-5">
          {step > 0 ? (
            <button
              onClick={back}
              className="w-11 h-11 rounded-xl bg-[#0e1630] border border-[#1a2550] text-slate-400 hover:text-white hover:border-[#2a3a72] transition-all flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={skip}
              className="flex-1 h-11 rounded-xl bg-[#0e1630] border border-[#1a2550] text-slate-500 hover:text-slate-300 hover:border-[#2a3a72] transition-all text-sm font-medium"
            >
              Skip for now
            </button>
          )}

          <button
            onClick={isLast ? finish : next}
            disabled={isPending}
            className="flex-1 h-11 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm text-white transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #4f7cff, #9b6dff)',
              boxShadow: '0 4px 20px rgba(79, 124, 255, 0.25)',
            }}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : isLast ? (
              <><Check className="w-4 h-4" /> Start My Journey</>
            ) : (
              <>Continue <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>

        {!isLast && step !== 0 && (
          <button onClick={skip} className="w-full text-center text-xs text-slate-600 hover:text-slate-400 transition-colors mt-4 py-2">
            Skip setup, I'll configure later
          </button>
        )}
      </div>
    </div>
  )
}

// ── Step Components ───────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">{children}</label>
}

function Input({ value, onChange, placeholder, type = 'text', suffix }: {
  value: string; onChange: (v: string) => void; placeholder: string; type?: string; suffix?: string
}) {
  return (
    <div className="relative">
      <input
        type={type}
        inputMode={type === 'number' ? 'decimal' : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0c1528] border border-[#1a2550] hover:border-[#2a3a72] focus:border-[#4f7cff]/60 focus:ring-2 focus:ring-[#4f7cff]/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-all"
        style={{ paddingRight: suffix ? '3.5rem' : undefined }}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none">{suffix}</span>
      )}
    </div>
  )
}

function StepWelcome({ form, update }: { form: FormData; update: (f: keyof FormData, v: string | number) => void }) {
  return (
    <div className="space-y-5">
      <div className="bg-[#4f7cff]/8 border border-[#4f7cff]/15 rounded-2xl p-4 text-center">
        <div className="text-4xl mb-3">🚀</div>
        <p className="text-sm text-slate-300 leading-relaxed">
          You're starting something incredible. Let's take 2 minutes to personalize your Transformation Tracker so every number you see is <span className="text-[#4f7cff] font-semibold">real and meaningful</span>.
        </p>
      </div>
      <div>
        <FieldLabel>Your First Name</FieldLabel>
        <Input
          value={form.name}
          onChange={(v) => update('name', v)}
          placeholder="e.g. Tharun"
        />
      </div>
      <div>
        <FieldLabel>Age</FieldLabel>
        <Input
          type="number"
          value={form.age}
          onChange={(v) => update('age', v)}
          placeholder="e.g. 25"
          suffix="yrs"
        />
      </div>
    </div>
  )
}

function StepBody({ form, update }: { form: FormData; update: (f: keyof FormData, v: string | number) => void }) {
  return (
    <div className="space-y-4">
      <div className="bg-[#0c1528]/60 border border-[#1a2550] rounded-2xl p-4">
        <p className="text-xs text-slate-400 leading-relaxed">
          Your current measurements help us calculate your calorie and protein targets precisely. You can always update these later in Settings.
        </p>
      </div>
      <div>
        <FieldLabel>Current (Starting) Weight</FieldLabel>
        <Input
          type="number"
          value={form.startingWeight}
          onChange={(v) => update('startingWeight', v)}
          placeholder="e.g. 96"
          suffix="kg"
        />
      </div>
      <div>
        <FieldLabel>Height</FieldLabel>
        <Input
          type="number"
          value={form.heightCm}
          onChange={(v) => update('heightCm', v)}
          placeholder="e.g. 175"
          suffix="cm"
        />
      </div>
      <p className="text-[10px] text-slate-600">All data stays private and is only visible to you.</p>
    </div>
  )
}

function StepGoals({ form, update }: { form: FormData; update: (f: keyof FormData, v: string | number) => void }) {
  const diff = parseFloat(form.startingWeight) - parseFloat(form.targetWeight)
  const weeks = diff > 0 ? Math.ceil(diff / 0.5) : null

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>Target (Goal) Weight</FieldLabel>
        <Input
          type="number"
          value={form.targetWeight}
          onChange={(v) => update('targetWeight', v)}
          placeholder="e.g. 81"
          suffix="kg"
        />
      </div>

      {weeks && weeks > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl px-4 py-3"
        >
          <p className="text-xs text-emerald-400 font-medium">
            🎯 At a healthy pace of 0.5 kg/week, you could reach your goal in approximately{' '}
            <span className="font-bold">{weeks} weeks</span>.
          </p>
        </motion.div>
      )}

      <div className="bg-[#4f7cff]/6 border border-[#4f7cff]/12 rounded-2xl p-4 space-y-2">
        <p className="text-[10px] text-[#60a5fa] font-semibold uppercase tracking-wide">Healthy Rate</p>
        <p className="text-xs text-slate-400 leading-relaxed">
          We recommend a target of losing <span className="text-white font-medium">0.3–0.7 kg per week</span>. This preserves muscle while burning fat — and is sustainable long-term.
        </p>
      </div>
    </div>
  )
}

function StepTargets({ form, update }: { form: FormData; update: (f: keyof FormData, v: string | number) => void }) {
  return (
    <div className="space-y-4">
      <div className="bg-[#0c1528]/60 border border-[#1a2550] rounded-2xl p-3">
        <p className="text-xs text-slate-400">
          💡 We auto-calculated recommended values based on your stats. Feel free to adjust them to match your actual plan.
        </p>
      </div>

      <div>
        <FieldLabel>Daily Calorie Target</FieldLabel>
        <Input
          type="number"
          value={form.calorieTarget}
          onChange={(v) => update('calorieTarget', v)}
          placeholder="e.g. 2300"
          suffix="kcal"
        />
      </div>
      <div>
        <FieldLabel>Daily Protein Target</FieldLabel>
        <Input
          type="number"
          value={form.proteinTarget}
          onChange={(v) => update('proteinTarget', v)}
          placeholder="e.g. 160"
          suffix="g"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel>Daily Water</FieldLabel>
          <Input
            type="number"
            value={form.waterTargetL}
            onChange={(v) => update('waterTargetL', v)}
            placeholder="3.5"
            suffix="L"
          />
        </div>
        <div>
          <FieldLabel>Daily Steps</FieldLabel>
          <Input
            type="number"
            value={form.stepTarget}
            onChange={(v) => update('stepTarget', v)}
            placeholder="10000"
          />
        </div>
      </div>
    </div>
  )
}

function StepFitness({ form, update }: { form: FormData; update: (f: keyof FormData, v: string | number) => void }) {
  const summary = [
    { label: 'Name', value: form.name || '—' },
    { label: 'Starting Weight', value: form.startingWeight ? `${form.startingWeight} kg` : '—' },
    { label: 'Goal Weight', value: form.targetWeight ? `${form.targetWeight} kg` : '—' },
    { label: 'Calorie Target', value: form.calorieTarget ? `${form.calorieTarget} kcal` : '—' },
    { label: 'Protein Target', value: form.proteinTarget ? `${form.proteinTarget} g` : '—' },
    { label: 'Water Target', value: `${form.waterTargetL} L` },
    { label: 'Step Goal', value: parseInt(form.stepTarget).toLocaleString() },
    { label: 'Gym Days/Week', value: form.gymDays },
  ]

  return (
    <div className="space-y-4">
      <div>
        <FieldLabel>How many days per week do you train?</FieldLabel>
        <div className="grid grid-cols-5 gap-2">
          {[2, 3, 4, 5, 6].map((d) => (
            <button
              key={d}
              onClick={() => update('gymDays', d)}
              className={`py-3 rounded-xl text-sm font-bold transition-all ${
                form.gymDays === d
                  ? 'text-white border border-[#4f7cff]/40'
                  : 'bg-[#0c1528] border border-[#1a2550] text-slate-500 hover:text-slate-300 hover:border-[#2a3a72]'
              }`}
              style={form.gymDays === d ? {
                background: 'linear-gradient(135deg, rgba(79,124,255,0.2), rgba(155,109,255,0.15))',
              } : undefined}
            >
              {d}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-600 mt-1.5 text-center">{form.gymDays} days per week selected</p>
      </div>

      {/* Summary Review */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(79,124,255,0.12)' }}>
        <div className="px-4 py-3 bg-[#4f7cff]/8 border-b border-[#4f7cff]/12">
          <p className="text-[10px] text-[#60a5fa] font-semibold uppercase tracking-wide">Review Your Profile</p>
        </div>
        <div className="divide-y divide-[#1a2550]">
          {summary.map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center px-4 py-2.5">
              <span className="text-xs text-slate-500">{label}</span>
              <span className="text-xs font-semibold text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
