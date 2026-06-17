import { createContext, useContext, useMemo, useState } from 'react'

const AvatarContext = createContext(null)

export function AvatarProvider({ children }) {
  const [status, setStatus] = useState('idle')
  const [muted, setMuted] = useState(false)
  const [connected, setConnected] = useState(true)

  const value = useMemo(
    () => ({
      status,
      muted,
      connected,
      setStatus,
      setMuted,
      setConnected,
      toggleMute: () => setMuted((prev) => !prev),
      setIdle: () => setStatus('idle'),
      setListening: () => setStatus('listening'),
      setSpeaking: () => setStatus('speaking'),
      setThinking: () => setStatus('thinking'),
    }),
    [status, muted, connected],
  )

  return <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>
}

export function useAvatar() {
  const context = useContext(AvatarContext)
  if (!context) {
    throw new Error('useAvatar must be used inside AvatarProvider')
  }
  return context
}
