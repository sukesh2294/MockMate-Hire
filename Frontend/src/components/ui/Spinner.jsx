import { cn } from '../../utils/cn'

export function Spinner({ size = 'md', className }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div
      className={cn(
        'border-2 border-brand-primary border-t-transparent rounded-full animate-spin',
        sizes[size],
        className,
      )}
    />
  )
}

export function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  )
}
