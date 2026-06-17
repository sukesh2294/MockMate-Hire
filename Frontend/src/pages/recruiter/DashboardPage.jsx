import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts'
import {
  Video, Users, TrendingUp, Star, ArrowUpRight, ArrowDownRight,
  Plus, Trophy, Medal,
} from 'lucide-react'
import { Card, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import { SkeletonCard } from '../../components/ui/Skeleton'
import { interviewService } from '../../services/api/interviewService'
import { getRecommendationBadge } from '../../utils/scoreUtils'

const statConfig = [
  { key: 'totalInterviews', label: 'Total Interviews', icon: Video, trendKey: 'interviews' },
  { key: 'candidatesScreened', label: 'Candidates Screened', icon: Users, trendKey: 'screened' },
  { key: 'averageScore', label: 'Average Score', icon: TrendingUp, trendKey: 'score', suffix: '%' },
  { key: 'recommendedCandidates', label: 'Recommended', icon: Star, trendKey: 'recommended' },
]

const quickActions = [
  { to: '/recruiter/create-interview', label: 'Create Interview', icon: Plus, description: 'Set up a new AI screening' },
  { to: '/recruiter/candidates', label: 'View Candidates', icon: Users, description: 'Review all screened candidates' },
  { to: '/reports/cand-sukesh', label: 'Results Dashboard', icon: Trophy, description: 'View scores and rankings' },
]

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [activity, setActivity] = useState([])
  const [performance, setPerformance] = useState([])
  const [interviews, setInterviews] = useState([])
  const [candidates, setCandidates] = useState([])
  const [interviewCandidates, setInterviewCandidates] = useState([])
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      interviewService.getDashboardStats(),
      interviewService.getInterviewActivity(),
      interviewService.getCandidatePerformance(),
      interviewService.getRecentInterviews(),
      interviewService.getRecentCandidates(),
      interviewService.getInterviewCandidates(),
      interviewService.getCandidateRanking(),
    ]).then(([s, a, p, i, c, ic, r]) => {
      setStats(s)
      setActivity(a)
      setPerformance(p)
      setInterviews(i)
      setCandidates(c)
      setInterviewCandidates(ic)
      setRanking(r)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-3 gap-4">
        {quickActions.map((action, i) => {
          const Icon = action.icon
          return (
            <motion.div key={action.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={action.to}>
                <Card hover className="h-full">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-bg-brand flex items-center justify-center">
                      <Icon className="w-5 h-5 text-brand-primary" />
                    </div>
                    <h3 className="font-semibold text-text-primary">{action.label}</h3>
                  </div>
                  <p className="text-sm text-text-muted">{action.description}</p>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statConfig.map((s, i) => {
          const Icon = s.icon
          const trend = stats?.trends?.[s.trendKey] ?? 0
          const isPositive = trend > 0
          return (
            <motion.div key={s.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-bg-brand flex items-center justify-center">
                    <Icon className="w-4 h-4 text-brand-primary" />
                  </div>
                  <span className={`flex items-center text-xs font-medium ${isPositive ? 'text-success' : 'text-error'}`}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(trend)}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-text-primary">
                  {stats?.[s.key] ?? 0}{s.suffix || ''}
                </p>
                <p className="text-sm text-text-muted mt-1">{s.label}</p>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle className="mb-4">Candidate Status</CardTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interviewCandidates.map((c) => {
                const badge = getRecommendationBadge(c.status)
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-text-primary">{c.name}</TableCell>
                    <TableCell><Badge variant={badge.variant}>{badge.label}</Badge></TableCell>
                    <TableCell>
                      {c.status === 'completed' ? (
                        <Link to={`/reports/${c.id}`}>
                          <Button size="sm" variant="ghost">View Report</Button>
                        </Link>
                      ) : (
                        <span className="text-xs text-text-muted">Awaiting interview</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Medal className="w-5 h-5 text-warning" />
            <CardTitle>Candidate Ranking</CardTitle>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Candidate</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranking.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <span className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-xs font-bold ${
                      r.rank === 1 ? 'bg-warning/20 text-warning' :
                      r.rank === 2 ? 'bg-bg-subtle text-text-tertiary' :
                      'bg-bg-brand text-brand-primary'
                    }`}>
                      {r.rank}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link to={`/reports/${r.id}`} className="font-medium text-text-primary hover:text-brand-primary">
                      {r.name}
                    </Link>
                  </TableCell>
                  <TableCell className="font-semibold text-success">{r.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle className="mb-6">Interview Activity</CardTitle>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={activity}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-default)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border-default)', borderRadius: 8 }} />
              <Bar dataKey="interviews" fill="var(--color-brand-primary)" radius={[4, 4, 0, 0]} name="Scheduled" />
              <Bar dataKey="completed" fill="var(--color-accent-sky)" radius={[4, 4, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardTitle className="mb-6">Candidate Performance</CardTitle>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={performance}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-default)" />
              <XAxis dataKey="category" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border-default)', borderRadius: 8 }} />
              <Line type="monotone" dataKey="score" stroke="var(--color-brand-primary)" strokeWidth={2} dot={{ fill: 'var(--color-brand-primary)' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Recent Interviews</h3>
            <Link to="/recruiter/interviews" className="text-sm text-brand-primary hover:underline">View all</Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interviews.slice(0, 4).map((int) => {
                const badge = getRecommendationBadge(int.status)
                return (
                  <TableRow key={int.id}>
                    <TableCell className="font-medium text-text-primary">{int.role}</TableCell>
                    <TableCell><Badge variant={badge.variant}>{badge.label}</Badge></TableCell>
                    <TableCell>{int.avgScore ? `${int.avgScore}%` : '—'}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Recent Candidates</h3>
            <Link to="/recruiter/candidates" className="text-sm text-brand-primary hover:underline">View all</Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.slice(0, 4).map((c) => {
                const badge = getRecommendationBadge(c.status)
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Link to={`/reports/${c.id}`} className="font-medium text-text-primary hover:text-brand-primary">
                        {c.name}
                      </Link>
                    </TableCell>
                    <TableCell>{c.score}%</TableCell>
                    <TableCell><Badge variant={badge.variant}>{badge.label}</Badge></TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
