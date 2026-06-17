import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Upload, Sparkles, CheckCircle } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Spinner } from '../ui/Spinner'

export function ResumeUpload({ onComplete, onAnalyze }) {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFile = (e) => {
    const selected = e.target.files?.[0]
    if (selected?.type === 'application/pdf') {
      setFile(selected)
      setAnalysis(null)
    }
  }

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    try {
      const result = await onAnalyze(file)
      setAnalysis(result)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardTitle className="mb-2">Upload Your Resume</CardTitle>
      <p className="text-sm text-text-muted mb-6">
        Our AI will read your resume and personalize interview questions based on your experience.
      </p>

      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-border-default rounded-xl p-10 text-center hover:border-brand-primary hover:bg-bg-brand/30 transition-colors cursor-pointer"
        >
          <Upload className="w-10 h-10 text-brand-primary mx-auto mb-3" />
          <p className="font-medium text-text-primary">Drop your PDF resume here</p>
          <p className="text-sm text-text-muted mt-1">or click to browse files</p>
          <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={handleFile} />
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-bg-subtle border border-border-default">
            <FileText className="w-8 h-8 text-brand-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-text-primary truncate">{file.name}</p>
              <p className="text-xs text-text-muted">{(file.size / 1024).toFixed(1)} KB · PDF</p>
            </div>
            <Badge variant="success">Uploaded</Badge>
          </div>

          {!analysis && !loading && (
            <Button onClick={handleAnalyze} className="w-full" icon={Sparkles}>
              Analyze Resume with AI
            </Button>
          )}
        </div>
      )}

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-6 rounded-xl bg-bg-brand/40 border border-brand-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <Spinner size="sm" />
            <span className="text-sm font-medium text-brand-primary">AI is reading your resume...</span>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-bg-subtle rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-brand-primary rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </div>
            <p className="text-xs text-text-muted">Extracting skills, experience, and keywords...</p>
          </div>
        </motion.div>
      )}

      {analysis && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
          <div className="p-4 rounded-xl bg-success/5 border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">Resume analyzed successfully</span>
            </div>
            <p className="text-sm text-text-secondary italic">&ldquo;{analysis.insight}&rdquo;</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {analysis.skills.map((skill) => (
              <Badge key={skill} variant="primary">{skill}</Badge>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-bg-brand/30 border border-brand-primary/20">
            <p className="text-xs font-medium text-brand-primary mb-1">Personalized Question Preview</p>
            <p className="text-sm text-text-primary">{analysis.personalizedQuestion}</p>
          </div>

          <Button onClick={() => onComplete(analysis)} className="w-full">
            Continue to Interview
          </Button>
        </motion.div>
      )}
    </Card>
  )
}
