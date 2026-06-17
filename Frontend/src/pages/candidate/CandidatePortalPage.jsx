import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Mic, Monitor, CheckCircle, XCircle, AlertTriangle, Play, ChevronRight } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card, CardTitle } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { BrandLogo } from '../../components/brand/BrandLogo'
import { ResumeUpload } from '../../components/interview/ResumeUpload'
import { useMediaPermissions } from '../../hooks/useMediaPermissions'
import { candidateService } from '../../services/api/candidateService'

const STEPS = ['Welcome', 'Permissions', 'Resume']

function PermissionItem({ icon: Icon, title, description, status, onRequest, actionLabel }) {
  const statusConfig = {
    pending: { badge: 'Pending', variant: 'default', icon: null },
    granted: { badge: 'Granted', variant: 'success', icon: CheckCircle },
    denied: { badge: 'Denied', variant: 'error', icon: XCircle },
  }
  const s = statusConfig[status]

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border border-border-default bg-bg-card">
      <div className="w-10 h-10 rounded-lg bg-bg-brand flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-brand-primary" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-text-primary">{title}</h4>
          <Badge variant={s.variant}>{s.badge}</Badge>
        </div>
        <p className="text-sm text-text-muted mb-3">{description}</p>
        {status === 'pending' && (
          <Button size="sm" variant="outline" onClick={onRequest}>{actionLabel}</Button>
        )}
        {status === 'denied' && (
          <p className="text-xs text-error">Please enable permissions in your browser settings and refresh.</p>
        )}
      </div>
      {s.icon && <s.icon className={`w-5 h-5 shrink-0 ${status === 'granted' ? 'text-success' : 'text-error'}`} />}
    </div>
  )
}

export default function CandidatePortalPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { camera, microphone, browserCompatible, requestCamera, requestMicrophone, allGranted } = useMediaPermissions()
  const [step, setStep] = useState(0)
  const [agreed, setAgreed] = useState(false)

  const handleResumeComplete = (result) => {
    const analysis = result.resume
    sessionStorage.setItem('candidateName', analysis.candidate_name || 'Sukesh')
    sessionStorage.setItem('resumeAnalysis', JSON.stringify(analysis))
    navigate(`/interview/${id}`)
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <header className="border-b border-border-default bg-bg-card">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <BrandLogo to="/" subtitle="Candidate Interview Portal" nameClassName="text-sm" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                i <= step ? 'bg-brand-primary text-white' : 'bg-bg-subtle text-text-muted'
              }`}>
                {i + 1}. {label}
              </div>
              {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-text-muted" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <Badge variant="primary" className="mb-4">Interview ID: {id?.toUpperCase()}</Badge>
              <h1 className="text-3xl font-bold text-text-primary mb-3">Welcome to AI Interview</h1>
              <p className="text-text-tertiary leading-relaxed mb-8">
                You&apos;re about to begin an AI-powered screening interview for a Frontend Developer role.
                Our AI interviewer will guide you through personalized questions based on your resume.
              </p>

              <Card className="mb-8">
                <CardTitle className="mb-4">What to Expect</CardTitle>
                <ul className="space-y-3 text-sm text-text-secondary">
                  <li className="flex gap-2"><span className="text-brand-primary font-bold">1.</span> Grant camera and microphone permissions</li>
                  <li className="flex gap-2"><span className="text-brand-primary font-bold">2.</span> Upload your resume for personalized questions</li>
                  <li className="flex gap-2"><span className="text-brand-primary font-bold">3.</span> Meet your AI interviewer and answer via voice</li>
                  <li className="flex gap-2"><span className="text-brand-primary font-bold">4.</span> Receive real-time evaluation and adaptive follow-ups</li>
                </ul>
              </Card>

              <Button size="lg" className="w-full" icon={Play} onClick={() => setStep(1)}>
                Start Interview
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="permissions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">Camera & Microphone</h2>
                <p className="text-sm text-text-muted">We need access to your camera and microphone for the interview.</p>
              </div>

              <div className="space-y-3">
                <PermissionItem
                  icon={Monitor}
                  title="Browser Compatibility"
                  description="Chrome, Firefox, Safari, or Edge with WebRTC support."
                  status={browserCompatible ? 'granted' : 'denied'}
                />
                <PermissionItem
                  icon={Camera}
                  title="Camera Permission"
                  description="Required for video verification during the interview."
                  status={camera.status}
                  onRequest={requestCamera}
                  actionLabel="Enable Camera"
                />
                <PermissionItem
                  icon={Mic}
                  title="Microphone Permission"
                  description="Required for voice responses and AI conversation."
                  status={microphone.status}
                  onRequest={requestMicrophone}
                  actionLabel="Enable Microphone"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-border-default text-brand-primary focus:ring-brand-primary"
                />
                <span className="text-sm text-text-secondary">
                  I agree to be recorded during this interview and understand my responses will be
                  evaluated by AI for hiring purposes.
                </span>
              </label>

              {!browserCompatible && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-error/10 text-error text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Your browser does not support required features. Please use a modern browser.
                </div>
              )}

              <Button
                size="lg"
                className="w-full"
                disabled={!allGranted || !agreed}
                onClick={() => setStep(2)}
              >
                Continue to Resume Upload
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="resume" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ResumeUpload
                onAnalyze={(file) => candidateService.uploadResume(file)}
                onComplete={handleResumeComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
