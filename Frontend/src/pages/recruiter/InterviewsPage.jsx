import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { interviewService } from '../../services/api/interviewService'
import { getRecommendationBadge } from '../../utils/scoreUtils'

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    interviewService.getInterviews().then(setInterviews).finally(() => setLoading(false))
  }, [])

  const filtered = interviews.filter((i) =>
    i.role.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Interviews</h2>
          <p className="text-sm text-text-muted mt-1">Manage and track all your AI screening interviews.</p>
        </div>
        <Link to="/recruiter/create-interview">
          <Button icon={Plus}>Create Interview</Button>
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <Input
          placeholder="Search by role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <SkeletonTable />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No interviews found"
          description="Create your first AI screening interview to get started."
          action={() => window.location.href = '/recruiter/create-interview'}
          actionLabel="Create Interview"
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Candidates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Avg Score</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((int) => {
              const badge = getRecommendationBadge(int.status)
              return (
                <TableRow key={int.id}>
                  <TableCell className="font-medium text-text-primary">{int.role}</TableCell>
                  <TableCell>{int.candidates}</TableCell>
                  <TableCell><Badge variant={badge.variant}>{badge.label}</Badge></TableCell>
                  <TableCell>{int.avgScore ? `${int.avgScore}%` : '—'}</TableCell>
                  <TableCell className="text-text-muted">{int.date}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
