import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu } from 'lucide-react'
import { DashboardSidebar } from './DashboardSidebar'

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-bg-base">
      <aside className="hidden lg:flex w-64 flex-col bg-bg-card border-r border-border-default fixed h-full z-30">
        <DashboardSidebar />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-text-primary/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed left-0 top-0 w-72 h-full bg-bg-card z-50 lg:hidden shadow-xl"
            >
              <DashboardSidebar mobile onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 lg:px-8 py-4 bg-bg-card/80 backdrop-blur-md border-b border-border-default">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-text-tertiary">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-text-primary capitalize">
                {location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/profile" className="text-sm text-text-muted hover:text-text-primary hidden sm:block">
              Profile
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
