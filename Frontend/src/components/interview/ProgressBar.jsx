import { cn } from '../../utils/cn'

export function ProgressBar({ value, max = 100, className, showLabel }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-text-muted mb-1.5">
          <span>Progress</span>
          <span>{Math.round(percent)}%</span>
        </div>
      )}
      <div className="h-2 bg-bg-subtle rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-brand rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
