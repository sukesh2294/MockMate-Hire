import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { Button } from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-bg-subtle flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-8 h-8 text-text-muted" />
        </div>
        <h1 className="text-6xl font-bold text-text-primary mb-2">404</h1>
        <h2 className="text-xl font-semibold text-text-primary mb-3">Page not found</h2>
        <p className="text-text-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/"><Button>Go Home</Button></Link>
          <Link to="/recruiter/dashboard"><Button variant="secondary">Dashboard</Button></Link>
        </div>
      </div>
    </div>
  )
}
