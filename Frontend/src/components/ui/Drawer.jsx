import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

export function Drawer({ open, onClose, title, children, side = 'right', className }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [open])

  const positions = {
    right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' }, className: 'right-0 top-0 h-full' },
    left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' }, className: 'left-0 top-0 h-full' },
  }

  const pos = positions[side]

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-text-primary/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={pos.initial}
            animate={pos.animate}
            exit={pos.exit}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn('absolute w-full max-w-md bg-bg-card shadow-xl border-border-default flex flex-col', pos.className, side === 'right' ? 'border-l' : 'border-r', className)}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
              <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
              <button onClick={onClose} className="text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
