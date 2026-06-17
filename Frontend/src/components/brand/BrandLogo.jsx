import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'
import mockMateIcon from '../../assets/MockMate_icon.jpeg'

export const BRAND_NAME = 'MockMate'

const markSizes = {
  xs: 'w-7 h-7',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
}

const roundedStyles = {
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
}

/** MockMate icon only */
export function BrandMark({ size = 'sm', rounded = 'lg', className }) {
  return (
    <div
      className={cn(
        markSizes[size],
        roundedStyles[rounded],
        'overflow-hidden shrink-0 bg-bg-subtle border border-border-default/50',
        className,
      )}
    >
      <img src={mockMateIcon} alt={BRAND_NAME} className="h-full w-full object-cover" />
    </div>
  )
}

/** Icon + optional name/subtitle; wraps in Link when `to` is set */
export function BrandLogo({
  size = 'sm',
  rounded = 'lg',
  showName = true,
  subtitle,
  to,
  className,
  nameClassName,
}) {
  const content = (
    <>
      <BrandMark size={size} rounded={rounded} />
      {showName && (
        <div className="min-w-0">
          <span className={cn('font-semibold text-text-primary', nameClassName)}>{BRAND_NAME}</span>
          {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
        </div>
      )}
    </>
  )

  const wrapperClass = cn('flex items-center gap-2.5', className)

  if (to) {
    return (
      <Link to={to} className={wrapperClass}>
        {content}
      </Link>
    )
  }

  return <div className={wrapperClass}>{content}</div>
}
