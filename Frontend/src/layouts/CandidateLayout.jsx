import { Outlet } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { BrandLogo } from '../components/brand/BrandLogo'

export function CandidateLayout() {
  return (
    <div className="min-h-screen bg-bg-base">
      <header className="sticky top-0 z-20 border-b border-border-default bg-bg-card/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <BrandLogo
            to="/candidate/dashboard"
            subtitle="Candidate Portal"
            nameClassName="text-sm"
          />
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-1 text-xs font-semibold">
              <a
                href="/candidate/dashboard"
                className="px-3 py-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-all"
              >
                Dashboard
              </a>
              <a
                href="/candidate/practice"
                className="px-3 py-1.5 rounded-lg text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 transition-all font-bold flex items-center gap-1"
              >
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                Practice Mode
              </a>
            </nav>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
