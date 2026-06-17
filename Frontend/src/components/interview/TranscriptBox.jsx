import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardTitle } from '../ui/Card'

export function TranscriptBox({ entries = [] }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries])

  return (
    <Card className="h-full flex flex-col">
      <CardTitle className="mb-4">Live Transcript</CardTitle>
      <div className="flex-1 overflow-y-auto space-y-3 max-h-[300px] pr-2">
        <AnimatePresence>
          {entries.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-8">
              Transcript will appear here as the interview progresses...
            </p>
          ) : (
            entries.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: entry.speaker === 'ai' ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex ${entry.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                    entry.speaker === 'ai'
                      ? 'bg-bg-brand text-text-primary'
                      : 'bg-bg-subtle text-text-secondary'
                  }`}
                >
                  <span className="text-xs font-medium text-text-muted block mb-0.5">
                    {entry.speaker === 'ai' ? 'AI Interviewer' : 'You'}
                  </span>
                  {entry.text}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </Card>
  )
}
