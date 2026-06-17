import { cn } from '../../utils/cn'

const variants = {
  default: 'bg-bg-subtle text-text-tertiary border-border-default',
  primary: 'bg-bg-brand text-brand-primary border-brand-primary/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  error: 'bg-error/10 text-error border-error/20',
  info: 'bg-accent-sky/10 text-accent-sky border-accent-sky/20',
  premium: 'bg-premium/10 text-premium border-premium/20',
}

export function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
