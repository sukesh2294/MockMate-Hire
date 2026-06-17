import { motion } from 'framer-motion'
import { Brain, TrendingUp } from 'lucide-react'
import { Card, CardTitle } from '../ui/Card'
import { ProgressBar } from './ProgressBar'

const scoreTextClass = {
  success: 'text-success',
  'accent-sky': 'text-accent-sky',
  warning: 'text-warning',
  info: 'text-info',
  error: 'text-error',
}

function getScoreTextClass(score) {
  if (score >= 90) return scoreTextClass.success
  if (score >= 75) return scoreTextClass['accent-sky']
  if (score >= 60) return scoreTextClass.warning
  if (score >= 40) return scoreTextClass.info
  return scoreTextClass.error
}

export function AnalysisPanel({ dimensions = [], overallScore, loading }) {
  if (loading) {
    return (
      <Card className="border-brand-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-5 h-5 text-brand-primary animate-pulse" />
          <CardTitle>AI Analysis</CardTitle>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-3 bg-bg-subtle rounded w-1/3 mb-2" />
              <div className="h-2 bg-bg-subtle rounded-full" />
            </div>
          ))}
          <p className="text-sm text-text-muted text-center pt-2">Evaluating your response...</p>
        </div>
      </Card>
    )
  }

  const avg = overallScore ?? Math.round(
    dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length,
  )

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-brand-primary/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-brand-primary" />
            <CardTitle>AI Analysis</CardTitle>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="font-semibold text-text-primary">{avg}/100</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
          {dimensions.map((dim, i) => (
            <motion.div
              key={dim.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-text-tertiary">{dim.label}</span>
                <span className={`font-semibold ${getScoreTextClass(dim.score)}`}>{dim.score}</span>
              </div>
              <ProgressBar value={dim.score} />
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
