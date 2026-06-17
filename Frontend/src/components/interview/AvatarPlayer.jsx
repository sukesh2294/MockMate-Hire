import { motion } from 'framer-motion'
import { Bot, Mic } from 'lucide-react'
import { cn } from '../../utils/cn'

export function AvatarPlayer({ isSpeaking, isListening, greeting, className }) {
  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      <div className="relative">
        {isSpeaking && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-brand-primary/20"
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute -inset-2 rounded-full border-2 border-brand-primary/30"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </>
        )}
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-brand flex items-center justify-center shadow-lg overflow-hidden">
          <Bot className="w-16 h-16 md:w-20 md:h-20 text-white" />
          {isSpeaking && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-white/80 rounded-full"
                  animate={{ height: [4, 12, 6, 14, 4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          )}
        </div>
        {isListening && (
          <motion.div
            className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-success flex items-center justify-center border-4 border-bg-card"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <Mic className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </div>
      <p className="mt-4 text-sm font-medium text-text-tertiary">AI Interviewer</p>
      <p className="text-xs text-text-muted text-center max-w-[200px]">
        {isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Ready'}
      </p>
      {greeting && isSpeaking && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm text-text-secondary text-center max-w-xs italic"
        >
          &ldquo;{greeting}&rdquo;
        </motion.p>
      )}
    </div>
  )
}
