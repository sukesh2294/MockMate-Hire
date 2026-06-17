import { cn } from '../../utils/cn'

export function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn('flex gap-1 p-1 bg-bg-subtle rounded-lg', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all',
            activeTab === tab.id
              ? 'bg-bg-card text-text-primary shadow-sm'
              : 'text-text-muted hover:text-text-secondary',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
