import { cn } from '../../utils/cn'

export function Table({ children, className }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border-default">
      <table className={cn('w-full text-sm', className)}>{children}</table>
    </div>
  )
}

export function TableHeader({ children }) {
  return <thead className="bg-bg-subtle border-b border-border-default">{children}</thead>
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-border-default bg-bg-card">{children}</tbody>
}

export function TableRow({ children, className, onClick }) {
  return (
    <tr
      onClick={onClick}
      className={cn('transition-colors', onClick && 'cursor-pointer hover:bg-bg-subtle', className)}
    >
      {children}
    </tr>
  )
}

export function TableHead({ children, className }) {
  return (
    <th className={cn('px-4 py-3 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider', className)}>
      {children}
    </th>
  )
}

export function TableCell({ children, className }) {
  return <td className={cn('px-4 py-3.5 text-text-secondary', className)}>{children}</td>
}
