import { Mic, MicOff, Volume2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export function VoiceStatus({ status = 'idle' }) {
  const config = {
    idle: { icon: Mic, label: 'Ready', color: 'text-text-muted' },
    listening: { icon: Mic, label: 'Listening', color: 'text-success' },
    speaking: { icon: Volume2, label: 'AI Speaking', color: 'text-brand-primary' },
    muted: { icon: MicOff, label: 'Muted', color: 'text-error' },
  }

  const { icon: Icon, label, color } = config[status] || config.idle

  return (
    <div className={cn('inline-flex items-center gap-2 text-sm font-medium', color)}>
      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center bg-bg-subtle', status === 'listening' && 'animate-pulse')}>
        <Icon className="w-4 h-4" />
      </div>
      {label}
    </div>
  )
}
