import { Clock } from 'lucide-react'
import { cn } from '../../utils/cn'

export function Timer({ formatted, warning, className }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-sm font-medium',
        warning
          ? 'border-error/30 bg-error/5 text-error'
          : 'border-border-default bg-bg-card text-text-primary',
        className,
      )}
    >
      <Clock className="w-4 h-4" />
      {formatted}
    </div>
  )
}
