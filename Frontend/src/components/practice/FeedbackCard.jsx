import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Sparkles, ChevronDown, ChevronUp, BookOpen, Key, Target } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

export function FeedbackCard({ evaluation }) {
  const [showModelAnswer, setShowModelAnswer] = useState(false)

  if (!evaluation) return null

  const {
    score,
    technical_accuracy,
    clarity_structure,
    keyword_match,
    matched_keywords = [],
    missing_keywords = [],
    positive_feedback,
    areas_of_improvement,
    suggested_answer,
  } = evaluation

  const getScoreVariant = (val) => {
    if (val >= 8) return 'success'
    if (val >= 6) return 'warning'
    return 'error'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="bg-gradient-to-br from-bg-card to-bg-subtle/50 border-brand-primary/20 shadow-md">
        {/* Top Summary Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-default">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-text-primary">Instant Evaluation</h4>
              <p className="text-xs text-text-tertiary">Real-time multi-parameter AI Feedback</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-text-tertiary uppercase font-medium block">Overall Score</span>
              <span className="text-2xl font-black text-brand-primary">{score} / 10</span>
            </div>
            <Badge variant={getScoreVariant(score)} className="text-xs px-3 py-1">
              {score >= 8 ? 'Excellent' : score >= 6 ? 'Good Practice' : 'Needs Work'}
            </Badge>
          </div>
        </div>

        {/* 4 Core Parameter Breakdown Grid */}
        <div className="grid sm:grid-cols-3 gap-4 my-6">
          {/* Parameter 1: Technical Accuracy */}
          <div className="p-4 rounded-xl bg-bg-surface border border-border-default space-y-1">
            <div className="flex items-center justify-between text-xs text-text-tertiary">
              <span className="flex items-center gap-1 font-medium text-text-secondary">
                <Target className="w-3.5 h-3.5 text-accent-sky" /> Technical Accuracy
              </span>
              <span className="font-bold text-text-primary">{technical_accuracy}%</span>
            </div>
            <div className="w-full h-2 bg-bg-subtle rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-accent-sky rounded-full transition-all duration-500"
                style={{ width: `${technical_accuracy}%` }}
              />
            </div>
          </div>

          {/* Parameter 2: Keyword Match */}
          <div className="p-4 rounded-xl bg-bg-surface border border-border-default space-y-1">
            <div className="flex items-center justify-between text-xs text-text-tertiary">
              <span className="flex items-center gap-1 font-medium text-text-secondary">
                <Key className="w-3.5 h-3.5 text-success" /> Concept Match
              </span>
              <span className="font-bold text-text-primary">{keyword_match}%</span>
            </div>
            <div className="w-full h-2 bg-bg-subtle rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-success rounded-full transition-all duration-500"
                style={{ width: `${keyword_match}%` }}
              />
            </div>
          </div>

          {/* Parameter 3: STAR Method Structure */}
          <div className="p-4 rounded-xl bg-bg-surface border border-border-default space-y-1 sm:col-span-1 col-span-full">
            <div className="flex items-center justify-between text-xs text-text-tertiary">
              <span className="flex items-center gap-1 font-medium text-text-secondary">
                <BookOpen className="w-3.5 h-3.5 text-warning" /> STAR Clarity
              </span>
              <Badge variant="info" className="text-[10px]">Framework</Badge>
            </div>
            <p className="text-xs text-text-secondary line-clamp-2 mt-1 leading-snug">
              {clarity_structure}
            </p>
          </div>
        </div>

        {/* Technical Keywords tags */}
        {(matched_keywords.length > 0 || missing_keywords.length > 0) && (
          <div className="p-4 rounded-xl bg-bg-surface/60 border border-border-default mb-6 space-y-3">
            <h5 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Keywords & Concepts</h5>
            <div className="flex flex-wrap items-center gap-2">
              {matched_keywords.map((kw, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-success/10 text-success border border-success/20">
                  <CheckCircle2 className="w-3 h-3" /> {kw}
                </span>
              ))}
              {missing_keywords.map((kw, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-warning/10 text-warning border border-warning/20">
                  <AlertTriangle className="w-3 h-3" /> Consider: {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Strengths & Improvements */}
        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-success/5 border border-success/20 space-y-1">
            <span className="font-semibold text-success flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Strong Highlights
            </span>
            <p className="text-text-secondary leading-relaxed">{positive_feedback}</p>
          </div>
          <div className="p-3.5 rounded-lg bg-warning/5 border border-warning/20 space-y-1">
            <span className="font-semibold text-warning flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" /> Recommended Tweaks
            </span>
            <p className="text-text-secondary leading-relaxed">{areas_of_improvement}</p>
          </div>
        </div>

        {/* Parameter 4: Suggested STAR Model Answer */}
        <div className="mt-6 pt-4 border-t border-border-default">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between text-xs text-brand-primary font-semibold hover:bg-brand-primary/5"
            onClick={() => setShowModelAnswer(!showModelAnswer)}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Suggested STAR Model Answer
            </span>
            {showModelAnswer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>

          <AnimatePresence>
            {showModelAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-4 rounded-xl bg-bg-surface border border-brand-primary/20 text-xs leading-relaxed text-text-primary whitespace-pre-line"
              >
                {suggested_answer}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  )
}
