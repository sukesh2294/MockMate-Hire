import { cn } from '../../utils/cn'

export function Card({ children, className, hover, padding = true, ...props }) {
  return (
    <div
      className={cn(
        'bg-bg-card rounded-xl border border-border-default shadow-sm',
        padding && 'p-6',
        hover && 'transition-shadow hover:shadow-md cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className }) {
  return <h3 className={cn('text-lg font-semibold text-text-primary', className)}>{children}</h3>
}

export function CardDescription({ children, className }) {
  return <p className={cn('text-sm text-text-muted mt-1', className)}>{children}</p>
}
