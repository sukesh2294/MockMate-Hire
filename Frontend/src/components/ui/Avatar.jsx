import { cn } from '../../utils/cn'

const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-lg' }

export function Avatar({ name, src, size = 'md', className }) {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full bg-bg-brand text-brand-primary font-semibold flex items-center justify-center',
        sizes[size],
        className,
      )}
    >
      {initials || '?'}
    </div>
  )
}
