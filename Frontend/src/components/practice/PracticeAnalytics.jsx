import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Target, Award, AlertCircle, CheckCircle2, Calendar, ShieldCheck } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Spinner } from '../ui/Spinner'
import { practiceService } from '../../services/api/practiceService'

export function PracticeAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const data = await practiceService.getPracticeAnalytics()
      setAnalytics(data)
    } catch (err) {
      console.error('Failed to fetch practice analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!analytics) return null

  const {
    overall_readiness = 70,
    sessions_completed = 0,
    questions_answered = 0,
    weak_areas = [],
    strong_areas = [],
    topic_scores = {},
    recent_sessions = [],
  } = analytics

  return (
    <div className="space-y-6">
      {/* Top Readiness Score & Key Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Readiness Gauge Card */}
        <Card className="md:col-span-1 bg-gradient-to-br from-brand-primary/10 via-bg-card to-bg-surface border-brand-primary/20 flex flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Overall Readiness</span>
              <ShieldCheck className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-text-primary">{overall_readiness}%</span>
              <span className="text-xs text-success font-medium flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" /> Interview Ready
              </span>
            </div>
            <p className="text-xs text-text-tertiary mt-2">
              Calculated based on technical accuracy, keyword coverage, and practice frequency.
            </p>
          </div>

          <div className="w-full h-2.5 bg-bg-subtle rounded-full overflow-hidden mt-6">
            <div
              className="h-full bg-gradient-to-r from-brand-primary to-accent-sky rounded-full transition-all duration-700"
              style={{ width: `${overall_readiness}%` }}
            />
          </div>
        </Card>

        {/* Practice Stats Summary */}
        <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
          <Card className="flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-tertiary font-medium">Completed Sessions</span>
              <Target className="w-4 h-4 text-accent-sky" />
            </div>
            <p className="text-3xl font-extrabold text-text-primary mt-2">{sessions_completed}</p>
            <p className="text-xs text-text-tertiary mt-1">Mock Interview Attempts</p>
          </Card>

          <Card className="flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-tertiary font-medium">Questions Answered</span>
              <Award className="w-4 h-4 text-success" />
            </div>
            <p className="text-3xl font-extrabold text-text-primary mt-2">{questions_answered}</p>
            <p className="text-xs text-text-tertiary mt-1">Evaluated by AI Engine</p>
          </Card>

          {/* Weak vs Strong Summary */}
          <Card className="sm:col-span-2 p-4 bg-bg-surface border-border-default space-y-3">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-success flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Strong Domains
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {strong_areas.map((sa, i) => (
                    <Badge key={i} variant="success" className="text-[10px]">
                      {sa}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-warning flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Focus Areas
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {weak_areas.map((wa, i) => (
                    <Badge key={i} variant="warning" className="text-[10px]">
                      {wa}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Domain Proficiency Breakdown */}
      <Card className="space-y-4">
        <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
          <Target className="w-4 h-4 text-brand-primary" /> Topic Proficiency Breakdown
        </h3>

        <div className="space-y-3 pt-2">
          {Object.entries(topic_scores).map(([top, val]) => (
            <div key={top} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-text-primary">{top}</span>
                <span className="text-text-secondary">{val}%</span>
              </div>
              <div className="w-full h-2 bg-bg-subtle rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    val >= 75 ? 'bg-success' : val >= 60 ? 'bg-brand-primary' : 'bg-warning'
                  }`}
                  style={{ width: `${val}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Practice Sessions */}
      {recent_sessions.length > 0 && (
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-text-primary">Recent Practice Sessions</h3>

          <div className="space-y-2.5">
            {recent_sessions.map((sess) => (
              <div
                key={sess.session_id}
                className="p-3.5 rounded-xl bg-bg-surface border border-border-default flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-text-primary">{sess.topic}</span>
                  <div className="flex items-center gap-2 text-text-tertiary text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(sess.created_at).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{sess.difficulty}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={sess.overall_score >= 7 ? 'success' : 'warning'}>
                    Score: {sess.overall_score ? `${sess.overall_score} / 10` : 'In Progress'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
