import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import { ArrowLeft, ThumbsUp, ThumbsDown, Medal } from 'lucide-react'
import { Card, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ProgressBar } from '../../components/interview/ProgressBar'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import { LoadingScreen } from '../../components/ui/Spinner'
import { interviewService } from '../../services/api/interviewService'
import { candidateService } from '../../services/api/candidateService'
import { getRecommendationBadge, getScoreColor, getScoreLabel } from '../../utils/scoreUtils'

const scoreDimensions = [
  { key: 'technical', label: 'Technical Score' },
  { key: 'communication', label: 'Communication Score' },
  { key: 'confidence', label: 'Confidence Score' },
]

export default function ReportsPage() {
  const { candidateId } = useParams()
  const [report, setReport] = useState(null)
  const [ranking, setRanking] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      candidateService.getCandidateReport(candidateId),
      interviewService.getCandidateRanking(),
    ]).then(([r, rank]) => {
      setReport(r)
      setRanking(rank)
    }).finally(() => setLoading(false))
  }, [candidateId])

  if (loading) return <LoadingScreen message="Loading candidate report..." />
  if (!report) return null

  const rec = getRecommendationBadge(report.recommendation)
  const radialData = [{ name: 'Score', value: report.overallScore, fill: 'var(--color-brand-primary)' }]

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 flex-wrap">
        <Link to="/recruiter/candidates">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>Back</Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{report.name}</h2>
          <p className="text-sm text-text-muted">{report.role} &middot; {report.interviewDate}</p>
        </div>
        <Badge variant={rec.variant} className="ml-auto">{rec.label}</Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 flex flex-col items-center justify-center">
          <p className="text-sm text-text-muted mb-2">Overall Score</p>
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270}>
                <RadialBar background={{ fill: 'var(--color-bg-subtle)' }} dataKey="value" cornerRadius={8} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-text-primary">{report.overallScore}</span>
              <span className="text-sm text-text-muted">/ 100</span>
            </div>
          </div>
          <Badge variant={getScoreColor(report.overallScore) === 'success' ? 'success' : 'info'} className="mt-4">
            {getScoreLabel(report.overallScore)}
          </Badge>
        </Card>

        <Card className="lg:col-span-2">
          <CardTitle className="mb-6">Score Breakdown</CardTitle>
          <div className="space-y-5">
            {scoreDimensions.map((dim) => (
              <div key={dim.key}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-text-tertiary">{dim.label}</span>
                  <span className="font-semibold text-text-primary">{report.scores[dim.key]}/100</span>
                </div>
                <ProgressBar value={report.scores[dim.key]} />
              </div>
            ))}
          </div>
        </Card>
      </div>

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
              <TableRow key={r.id} className={r.id === candidateId ? 'bg-bg-brand/30' : ''}>
                <TableCell>
                  <span className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-xs font-bold ${
                    r.rank === 1 ? 'bg-warning/20 text-warning' : 'bg-bg-subtle text-text-tertiary'
                  }`}>
                    {r.rank}
                  </span>
                </TableCell>
                <TableCell>
                  <Link to={`/reports/${r.id}`} className={`font-medium hover:text-brand-primary ${
                    r.id === candidateId ? 'text-brand-primary' : 'text-text-primary'
                  }`}>
                    {r.name}
                  </Link>
                </TableCell>
                <TableCell className="font-semibold text-success">{r.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card>
        <CardTitle className="mb-6">Question-by-Question Performance</CardTitle>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={report.scoreHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-default)" />
            <XAxis dataKey="question" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
            <Tooltip contentStyle={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border-default)', borderRadius: 8 }} />
            <Bar dataKey="score" fill="var(--color-brand-primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="h-full border-success/20">
            <div className="flex items-center gap-2 mb-4">
              <ThumbsUp className="w-5 h-5 text-success" />
              <CardTitle>Feedback</CardTitle>
            </div>
            <ul className="space-y-2">
              {report.suggestions.map((s, i) => (
                <li key={i} className="text-sm text-text-secondary flex gap-2">
                  <span className="text-success shrink-0">•</span>{s}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full border-success/20">
            <div className="flex items-center gap-2 mb-4">
              <ThumbsUp className="w-5 h-5 text-success" />
              <CardTitle>Strengths</CardTitle>
            </div>
            <ul className="space-y-2">
              {report.strengths.map((s, i) => (
                <li key={i} className="text-sm text-text-secondary flex gap-2">
                  <span className="text-success shrink-0">+</span>{s}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full border-error/20">
            <div className="flex items-center gap-2 mb-4">
              <ThumbsDown className="w-5 h-5 text-error" />
              <CardTitle>Areas to Improve</CardTitle>
            </div>
            <ul className="space-y-2">
              {report.weaknesses.map((w, i) => (
                <li key={i} className="text-sm text-text-secondary flex gap-2">
                  <span className="text-error shrink-0">-</span>{w}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
