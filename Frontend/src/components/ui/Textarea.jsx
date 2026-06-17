import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export const Textarea = forwardRef(function Textarea(
  { className, label, error, rows = 4, id, ...props },
  ref,
) {
  const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-tertiary">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={cn(
          'w-full rounded-lg border bg-bg-card px-3 py-2.5 text-sm text-text-primary resize-y',
          'placeholder:text-text-muted transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary',
          error ? 'border-error' : 'border-border-default hover:border-border-strong',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
})
