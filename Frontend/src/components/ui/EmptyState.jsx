import { cn } from '../../utils/cn'
import { Button } from './Button'

export function EmptyState({ icon: Icon, title, description, action, actionLabel, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-bg-subtle flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-text-muted" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      {description && <p className="text-sm text-text-muted max-w-sm mb-6">{description}</p>}
      {action && actionLabel && (
        <Button onClick={action}>{actionLabel}</Button>
      )}
    </div>
  )
}
