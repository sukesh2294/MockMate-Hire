import { Link, NavLink } from 'react-router-dom'
import { LayoutDashboard, Video, Users, BarChart3, Settings, Plus, X, FileText } from 'lucide-react'
import { cn } from '../utils/cn'
import { Button } from '../components/ui/Button'
import { BrandLogo } from '../components/brand/BrandLogo'

const navItems = [
  { to: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/recruiter/interviews', label: 'Interviews', icon: Video },
  { to: '/recruiter/candidates', label: 'Candidates', icon: Users },
  { to: '/reports/cand-sukesh', label: 'Results', icon: FileText },
  { to: '/recruiter/dashboard', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function DashboardSidebar({ mobile, onClose }) {
  return (
    <div className={cn('flex flex-col h-full', mobile && 'p-4')}>
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-border-default">
        <BrandLogo
          to={null}
          subtitle="Recruiter Portal"
          nameClassName="text-sm"
        />
        {mobile && (
          <button onClick={onClose} className="ml-auto text-text-muted">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={`${to}-${label}`}
            to={to.split('#')[0]}
            onClick={() => mobile && onClose?.()}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive && !to.includes('#')
                  ? 'bg-bg-brand text-brand-primary'
                  : 'text-text-tertiary hover:bg-bg-subtle hover:text-text-primary',
              )
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border-default">
        <Link to="/recruiter/create-interview">
          <Button className="w-full" icon={Plus}>New Interview</Button>
        </Link>
      </div>
    </div>
  )
}
