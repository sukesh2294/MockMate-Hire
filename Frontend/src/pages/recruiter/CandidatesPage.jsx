import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { Avatar } from '../../components/ui/Avatar'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { candidateService } from '../../services/api/candidateService'
import { getRecommendationBadge } from '../../utils/scoreUtils'

const scoreColorClass = {
  success: 'text-success',
  'accent-sky': 'text-accent-sky',
  warning: 'text-warning',
  info: 'text-info',
  error: 'text-error',
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    candidateService.getCandidates().then(setCandidates).finally(() => setLoading(false))
  }, [])

  const filtered = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Candidates</h2>
        <p className="text-sm text-text-muted mt-1">Review screened candidates and their evaluation results.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <Input
          placeholder="Search candidates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <SkeletonTable />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => {
              const badge = getRecommendationBadge(c.status)
              return (
                <TableRow key={c.id}>
                  <TableCell>
                    <Link to={`/reports/${c.id}`} className="flex items-center gap-3 hover:opacity-80">
                      <Avatar name={c.name} size="sm" />
                      <span className="font-medium text-text-primary">{c.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-text-muted">{c.role}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${scoreColorClass[c.score >= 75 ? 'success' : c.score >= 60 ? 'warning' : 'error']}`}>
                      {c.score}%
                    </span>
                  </TableCell>
                  <TableCell><Badge variant={badge.variant}>{badge.label}</Badge></TableCell>
                  <TableCell className="text-text-muted">{c.date}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
