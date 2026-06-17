import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { BrandLogo } from '../brand/BrandLogo'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#faq', label: 'FAQ' },
]

export function Navbar({ onActionClick = () => {} }) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-card/80 backdrop-blur-md border-b border-border-default">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <BrandLogo to="/" size="lg" rounded="full" />

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-text-tertiary hover:text-text-primary transition-colors">
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <SignedOut>
              <Button variant="ghost" size="sm" onClick={() => onActionClick('signin')}>Sign In</Button>
              <Button size="sm" onClick={() => onActionClick('starthiring')}>Start Hiring</Button>
            </SignedOut>
            <SignedIn>
              <Link to="/recruiter/dashboard"><Button variant="ghost" size="sm">Dashboard</Button></Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          <button className="md:hidden text-text-tertiary" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border-default bg-bg-card"
          >
            <div className="px-4 py-4 space-y-3">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-sm text-text-tertiary py-2">
                  {l.label}
                </a>
              ))}
              <SignedOut>
                <Button variant="ghost" className="w-full" onClick={() => { setOpen(false); onActionClick('signin') }}>Sign In</Button>
                <Button className="w-full" onClick={() => { setOpen(false); onActionClick('starthiring') }}>Start Hiring</Button>
              </SignedOut>
              <SignedIn>
                <Link to="/recruiter/dashboard" onClick={() => setOpen(false)}><Button className="w-full">Dashboard</Button></Link>
              </SignedIn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
