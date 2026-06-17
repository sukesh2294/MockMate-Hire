import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Link as LinkIcon, Sparkles, Database, ChevronRight } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Card, CardTitle, CardDescription } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { useToast } from '../../hooks/useToast'
import { interviewService } from '../../services/api/interviewService'

const experienceOptions = [
  { value: 'fresher', label: 'Fresher (0-1 years)' },
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior (6-10 years)' },
  { value: 'lead', label: 'Lead / Principal (10+ years)' },
]

const durationOptions = [
  { value: '10', label: '10 minutes' },
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '60 minutes' },
]

const STEPS = ['Configure', 'AI Questions', 'Share Link']

export default function CreateInterviewPage() {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues: {
      jobRole: 'Frontend Developer',
      experienceLevel: 'fresher',
      duration: '10',
      questionCount: '5',
    },
  })
  const { addToast } = useToast()
  const [step, setStep] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [questions, setQuestions] = useState(null)
  const [generated, setGenerated] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const onGenerateInterview = async (data) => {
    setGenerating(true)
    try {
      const payload = {
        title: `${data.jobRole} AI Screening`,
        role: data.jobRole,
        experience_level: data.experienceLevel,
        duration_minutes: Number(data.duration),
        question_count: Number(data.questionCount),
      }
      const result = await interviewService.createInterview(payload)
      setQuestions(result.questions)
      setGenerated(result)
      setStep(2)
      addToast('Interview created successfully and AI questions generated!', 'success')
    } catch (error) {
      addToast(error.message || 'Failed to create interview', 'error')
    } finally {
      setGenerating(false)
    }
  }

  const onGenerateLink = () => {
    if (generated) {
      setStep(2)
    }
  }

  const copyLink = () => {
    const link = `${window.location.origin}/candidate/${generated.id}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    addToast('Link copied to clipboard', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Create Interview</h2>
        <p className="text-sm text-text-muted mt-1">Configure your AI screening interview and generate a shareable link.</p>
      </div>

      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              i <= step ? 'bg-brand-primary text-white' : 'bg-bg-subtle text-text-muted'
            }`}>
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">{i + 1}</span>
              {label}
            </div>
            {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-text-muted" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <Card>
              <form onSubmit={handleSubmit(onGenerateInterview)} className="space-y-5">
                <Input
                  label="Job Role"
                  placeholder="e.g. Frontend Developer"
                  error={errors.jobRole?.message}
                  {...register('jobRole', { required: 'Job role is required' })}
                />

                <Select
                  label="Experience Level"
                  options={experienceOptions}
                  placeholder="Select experience level"
                  error={errors.experienceLevel?.message}
                  {...register('experienceLevel', { required: 'Experience level is required' })}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Select
                    label="Interview Duration"
                    options={durationOptions}
                    placeholder="Select duration"
                    error={errors.duration?.message}
                    {...register('duration', { required: 'Duration is required' })}
                  />
                  <Input
                    label="Number of Questions"
                    type="number"
                    min={3}
                    max={20}
                    placeholder="5"
                    error={errors.questionCount?.message}
                    {...register('questionCount', {
                      required: 'Required',
                      min: { value: 3, message: 'Min 3' },
                      max: { value: 20, message: 'Max 20' },
                    })}
                  />
                </div>

                <Button type="submit" loading={generating} icon={Sparkles} className="w-full sm:w-auto">
                  Generate Interview
                </Button>
              </form>
            </Card>
          </motion.div>
        )}

        {step === 1 && questions && (
          <motion.div key="questions" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
            <Card className="border-brand-primary/30 bg-bg-brand/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <CardTitle>AI Generated Questions</CardTitle>
                  <CardDescription>
                    {questions.length} questions for {generated?.role || 'AI Interview'}
                  </CardDescription>
                </div>
                <Badge variant="success" className="flex items-center gap-1">
                  <Database className="w-3 h-3" /> Saved
                </Badge>
              </div>

              <ol className="space-y-3">
                {questions.map((q, i) => (
                  <motion.li
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-3 p-3 rounded-lg bg-bg-card border border-border-default"
                  >
                    <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center shrink-0 font-medium">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm text-text-primary">{q.text}</p>
                      <Badge variant="default" className="mt-1.5 capitalize">{q.type?.replace('_', ' ')}</Badge>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </Card>

            <Button onClick={onGenerateLink} loading={loading} icon={LinkIcon} className="w-full">
              Generate Interview Link
            </Button>
          </motion.div>
        )}

        {step === 2 && generated && (
          <motion.div key="link" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-brand-primary/30 bg-bg-brand/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <CardTitle>Interview Link Ready</CardTitle>
                  <CardDescription>Share this link with candidates to start screening.</CardDescription>
                </div>
                <Badge variant="success">Active</Badge>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Role</span>
                  <span className="font-medium text-text-primary">{generated.role}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Experience</span>
                  <span className="font-medium text-text-primary capitalize">{generated.experience_level}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Duration</span>
                  <span className="font-medium text-text-primary">{generated.duration_minutes} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Questions</span>
                  <span className="font-medium text-text-primary">{generated.questions?.length}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-bg-card rounded-lg border border-border-default mb-3">
                <LinkIcon className="w-4 h-4 text-text-muted shrink-0" />
                <code className="flex-1 text-sm text-brand-primary font-medium">{`${window.location.origin}/candidate/${generated.id}`}</code>
                <Button size="sm" variant="secondary" onClick={copyLink} icon={copied ? Check : Copy}>
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>

              <p className="text-xs text-text-muted">
                Candidate join link:{' '}
                <code className="text-brand-primary">{`${window.location.origin}/candidate/${generated.id}`}</code>
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
