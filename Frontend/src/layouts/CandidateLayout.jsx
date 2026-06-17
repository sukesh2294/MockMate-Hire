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
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
