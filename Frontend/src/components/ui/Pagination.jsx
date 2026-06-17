import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/cn'
import { Button } from './Button'

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        icon={ChevronLeft}
      />
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            'w-8 h-8 text-sm rounded-md transition-colors',
            page === currentPage
              ? 'bg-brand-primary text-white'
              : 'text-text-muted hover:bg-bg-subtle',
          )}
        >
          {page}
        </button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        icon={ChevronRight}
      />
    </div>
  )
}
