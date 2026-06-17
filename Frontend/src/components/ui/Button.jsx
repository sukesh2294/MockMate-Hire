import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const variants = {
  primary: 'bg-brand-primary text-white hover:bg-brand-dark active:bg-brand-dark shadow-sm',
  secondary: 'bg-bg-card text-text-primary border border-border-default hover:bg-bg-subtle',
  ghost: 'text-text-tertiary hover:bg-bg-subtle hover:text-text-primary',
  danger: 'bg-error text-white hover:opacity-90',
  success: 'bg-success text-white hover:opacity-90',
  outline: 'border border-brand-primary text-brand-primary hover:bg-bg-brand',
}

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
}

export const Button = forwardRef(function Button(
  { className, variant = 'primary', size = 'md', loading, disabled, children, icon: Icon, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {Icon && !loading && <Icon className="w-4 h-4" />}
      {children}
    </button>
  )
})
