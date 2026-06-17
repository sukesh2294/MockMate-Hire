import { useEffect } from 'react'
import { useAvatar } from './AvatarProvider'

export function AvatarStateManager({ voiceStatus, analysisLoading }) {
  const { setSpeaking, setListening, setThinking, setIdle } = useAvatar()

  useEffect(() => {
    if (analysisLoading) {
      setThinking()
      return
    }

    if (voiceStatus === 'speaking') {
      setSpeaking()
    } else if (voiceStatus === 'listening') {
      setListening()
    } else {
      setIdle()
    }
  }, [voiceStatus, analysisLoading, setIdle, setListening, setSpeaking, setThinking])

  return null
}
