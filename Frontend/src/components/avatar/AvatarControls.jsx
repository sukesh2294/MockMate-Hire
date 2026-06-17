import { Mic, MicOff, RefreshCcw, Sparkles, Zap } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAvatar } from './AvatarProvider'

export function AvatarControls() {
  const { status, muted, toggleMute, setListening, setSpeaking, setThinking, setIdle } = useAvatar()

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button size="sm" variant={muted ? 'destructive' : 'secondary'} icon={muted ? MicOff : Mic} onClick={toggleMute}>
        {muted ? 'Unmute' : 'Mute'}
      </Button>
      <Button size="sm" icon={Sparkles} onClick={setSpeaking}>
        Speaking
      </Button>
      <Button size="sm" variant="outline" icon={Zap} onClick={setThinking}>
        Thinking
      </Button>
      <Button size="sm" variant="outline" icon={RefreshCcw} onClick={setIdle}>
        Idle
      </Button>
      <Button size="sm" variant="ghost" onClick={setListening}>
        Listen
      </Button>
      <div className="flex items-center justify-center rounded-xl border border-border-default bg-bg-card px-3 py-2 text-xs text-text-muted">
        Current: {status}
      </div>
    </div>
  )
}
