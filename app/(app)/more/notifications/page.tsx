'use client'

import { useState } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { DEFAULT_REMINDERS } from '@/data/plans'

export default function NotificationsPage() {
  const [reminders, setReminders] = useState(DEFAULT_REMINDERS)

  function toggle(key: string) {
    setReminders((prev) => prev.map((r) => r.key === key ? { ...r, enabled: !r.enabled } : r))
  }

  const enabledCount = reminders.filter((r) => r.enabled).length

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        <p className="text-sm text-slate-400 mt-0.5">{enabledCount}/{reminders.length} reminders enabled</p>
      </div>

      <div className="glass rounded-2xl p-4 space-y-1">
        <p className="text-xs text-slate-500 mb-3">
          Note: Browser notifications require permission to be granted. Tap a toggle to enable/disable each reminder.
        </p>
        {reminders.map((reminder) => (
          <div key={reminder.key} className="flex items-center justify-between py-3 border-b border-slate-800/40 last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${reminder.enabled ? 'bg-blue-500/15' : 'bg-slate-800/40'}`}>
                {reminder.enabled
                  ? <Bell className="w-4 h-4 text-blue-400" />
                  : <BellOff className="w-4 h-4 text-slate-500" />
                }
              </div>
              <div>
                <p className={`text-sm font-medium ${reminder.enabled ? 'text-slate-200' : 'text-slate-500'}`}>
                  {reminder.time}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 max-w-[220px]">{reminder.message}</p>
              </div>
            </div>
            <button
              onClick={() => toggle(reminder.key)}
              className={`relative w-11 h-6 rounded-full transition-all ${reminder.enabled ? 'bg-blue-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-sm ${reminder.enabled ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-4 space-y-2">
        <h2 className="text-sm font-semibold text-white">Enable Browser Notifications</h2>
        <p className="text-xs text-slate-400">To receive notifications, you need to grant permission in your browser settings.</p>
        <button
          onClick={() => {
            if ('Notification' in window) {
              Notification.requestPermission()
            }
          }}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl text-sm transition-all"
        >
          Request Notification Permission
        </button>
      </div>
    </div>
  )
}
