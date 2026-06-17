import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRoomContext, VideoTrack } from '@livekit/components-react'
import { useAvatar } from './AvatarProvider'

const stateStyles = {
  idle: 'border-border-default bg-bg-card',
  listening: 'border-brand-primary bg-brand-primary/10',
  speaking: 'border-success bg-success/10',
  thinking: 'border-accent-sky bg-accent-sky/10',
}

export function AvatarContainer() {
  const { status, muted, connected } = useAvatar()
  const room = useRoomContext()
  const [agentVideoTrack, setAgentVideoTrack] = useState(null)

  useEffect(() => {
    if (!room) return

    const updateTracks = () => {
      // Find remote participants (the AI agent)
      const participants = Array.from(room.participants.values())
      const agent = participants.find((p) => p.identity.toLowerCase().includes('agent') || p.identity.toLowerCase().includes('interviewer'))
      
      if (agent) {
        const videoPublications = Array.from(agent.videoTracks.values())
        // Get the first subscribed/active video track
        const activePub = videoPublications.find((pub) => pub.track !== undefined)
        if (activePub && activePub.track) {
          setAgentVideoTrack(activePub.track)
        } else {
          setAgentVideoTrack(null)
        }
      } else {
        setAgentVideoTrack(null)
      }
    }

    // Run immediately and listen to track changes
    updateTracks()
    room.on('trackSubscribed', updateTracks)
    room.on('trackUnsubscribed', updateTracks)
    room.on('participantConnected', updateTracks)
    room.on('participantDisconnected', updateTracks)

    return () => {
      room.off('trackSubscribed', updateTracks)
      room.off('trackUnsubscribed', updateTracks)
      room.off('participantConnected', updateTracks)
      room.off('participantDisconnected', updateTracks)
    }
  }, [room])

  return (
    <div className="w-full max-w-sm rounded-[2rem] border p-6 shadow-xl bg-bg-card border-border-default">
      <div className={`relative overflow-hidden rounded-[1.75rem] border-2 h-72 ${stateStyles[status] || stateStyles.idle}`}>
        {agentVideoTrack ? (
          // Render LiveKit agent WebRTC video stream (Beyond Presence Avatar)
          <VideoTrack trackRef={agentVideoTrack} className="w-full h-full object-cover bg-black" />
        ) : (
          // Harmonious animated fallback if agent is not streaming video
          <motion.div
            animate={status === 'speaking' ? { scale: [1, 1.02, 1] } : status === 'thinking' ? { y: [0, -4, 0] } : { scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut', repeat: status === 'speaking' ? Infinity : 0 }}
            className="w-full h-full bg-gradient-to-br from-brand-primary via-purple-700 to-indigo-900 flex flex-col items-center justify-center relative"
          >
            {/* Pulsing wave animations */}
            {status === 'speaking' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  className="w-44 h-44 rounded-full bg-success/20 absolute"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0.1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="w-36 h-36 rounded-full bg-brand-primary/20 absolute"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                />
              </div>
            )}
            
            {status === 'listening' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  className="w-40 h-40 rounded-full bg-brand-primary/10 absolute border border-brand-primary/30"
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
            )}

            <div className="w-28 h-28 rounded-full bg-white/95 border border-white shadow-xl flex flex-col items-center justify-center text-brand-primary relative z-10">
              <span className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-brand-primary to-purple-600 bg-clip-text text-transparent">AI</span>
              {status === 'speaking' && (
                <div className="absolute bottom-4 flex gap-0.5">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-3 bg-brand-primary rounded-full"
                      animate={{ height: [4, 12, 4] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <span className="absolute bottom-4 text-xs font-semibold tracking-wider uppercase text-white/60">
              Beyond Presence
            </span>
          </motion.div>
        )}
      </div>

      <div className="mt-5 space-y-3 text-sm text-text-secondary">
        <div className="flex items-center justify-between">
          <span>Status</span>
          <span className="font-semibold text-text-primary capitalize">{status}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Connection</span>
          <span className={`font-semibold ${connected ? 'text-success' : 'text-error'}`}>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Microphone</span>
          <span className={`font-semibold ${muted ? 'text-error' : 'text-success'}`}>{muted ? 'Muted' : 'Live'}</span>
        </div>
      </div>
    </div>
  )
}
