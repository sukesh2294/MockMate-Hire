import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, Play, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { candidateInterviews } from '../../services/mockData'

const statusConfig = {
  pending: { label: 'Pending', variant: 'warning', icon: AlertCircle },
  scheduled: { label: 'Scheduled', variant: 'primary', icon: Calendar },
  completed: { label: 'Completed', variant: 'success', icon: CheckCircle },
}

export default function CandidateDashboardPage() {
  const pendingCount = candidateInterviews.filter((i) => i.status !== 'completed').length
  const completedCount = candidateInterviews.filter((i) => i.status === 'completed').length

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Badge variant="primary" className="mb-3">Candidate</Badge>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Your Interviews</h1>
        <p className="text-text-tertiary">
          Attend AI interviews and track your screening status in one place.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <p className="text-sm text-text-muted mb-1">Upcoming</p>
          <p className="text-3xl font-bold text-text-primary">{pendingCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-text-muted mb-1">Completed</p>
          <p className="text-3xl font-bold text-text-primary">{completedCount}</p>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Interview List</h2>
        {candidateInterviews.map((interview, index) => {
          const status = statusConfig[interview.status]
          const StatusIcon = status.icon
          const canStart = interview.status !== 'completed'

          return (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle>{interview.role}</CardTitle>
                    <Badge variant={status.variant}>
                      <StatusIcon className="w-3 h-3 mr-1 inline" />
                      {status.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-text-muted">{interview.company}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-text-tertiary">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {interview.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {interview.duration}
                    </span>
                  </div>
                </div>

                {canStart ? (
                  <Link to={`/candidate/${interview.id}`}>
                    <Button icon={Play}>{interview.status === 'pending' ? 'Start Interview' : 'Continue'}</Button>
                  </Link>
                ) : (
                  <Badge variant="success">Score: {interview.score}%</Badge>
                )}
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
