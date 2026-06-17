import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-error" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      {message && <p className="text-sm text-text-muted max-w-sm mb-6">{message}</p>}
      {onRetry && <Button onClick={onRetry} variant="secondary">Try Again</Button>}
    </div>
  )
}
