import { motion } from 'framer-motion'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'

export function QuestionCard({ question, index, total }) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-brand-primary/20">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="primary">Question {index + 1} of {total}</Badge>
          <Badge variant="default">{question.type?.replace('_', ' ')}</Badge>
        </div>
        <p className="text-lg text-text-primary leading-relaxed">{question.text}</p>
      </Card>
    </motion.div>
  )
}
