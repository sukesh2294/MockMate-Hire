import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

export const Select = forwardRef(function Select(
  { className, label, error, options = [], placeholder, id, ...props },
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
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          className={cn(
            'h-10 w-full appearance-none rounded-lg border bg-bg-card px-3 pr-10 text-sm text-text-primary',
            'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary',
            error ? 'border-error' : 'border-border-default hover:border-border-strong',
            className,
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
})
