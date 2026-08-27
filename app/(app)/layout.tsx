import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="container mx-auto max-w-2xl lg:max-w-4xl px-4 py-6 pb-24 lg:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  )
}
