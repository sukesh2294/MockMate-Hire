import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Code, HelpCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Spinner } from '../ui/Spinner'
import { practiceService } from '../../services/api/practiceService'

export function QuizFlashcards({ selectedTopic = 'Python Backend' }) {
  const [topic, setTopic] = useState(selectedTopic)
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeQuizIndex, setActiveQuizIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setScore] = useState(0)

  const topics = ['Python Backend', 'Frontend', 'System Design', 'DSA', 'HR']

  useEffect(() => {
    fetchQuizzes(topic)
  }, [topic])

  const fetchQuizzes = async (top) => {
    setLoading(true)
    setSelectedOption(null)
    setActiveQuizIndex(0)
    setScore(0)

    try {
      const data = await practiceService.getQuizzes(top)
      setQuizzes(data.quizzes || [])
    } catch (err) {
      console.error('Failed to fetch quizzes:', err)
    } finally {
      setLoading(false)
    }
  }

  const currentQuiz = quizzes[activeQuizIndex]

  const handleSelectOption = (index) => {
    if (selectedOption !== null) return
    setSelectedOption(index)
    if (index === currentQuiz.correct_answer_index) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    if (activeQuizIndex < quizzes.length - 1) {
      setActiveQuizIndex((prev) => prev + 1)
      setSelectedOption(null)
    }
  }

  const handleRestart = () => {
    setActiveQuizIndex(0)
    setSelectedOption(null)
    setScore(0)
  }

  return (
    <div className="space-y-6">
      {/* Domain Selection Bar */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-border-default">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              topic === t
                ? 'bg-brand-primary text-white shadow-sm'
                : 'bg-bg-card hover:bg-bg-subtle text-text-tertiary border border-border-default'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : quizzes.length === 0 ? (
        <Card className="text-center py-8 text-text-tertiary">
          No quiz items available for {topic}. Select another domain.
        </Card>
      ) : (
        <Card className="space-y-6 bg-bg-card border-border-default">
          {/* Top header stats */}
          <div className="flex items-center justify-between pb-4 border-b border-border-default">
            <div className="flex items-center gap-2">
              <Badge variant="primary" className="text-xs">
                {currentQuiz.quiz_type === 'debug_snippet' ? (
                  <span className="flex items-center gap-1">
                    <Code className="w-3 h-3" /> Code Debugging
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" /> Technical MCQ
                  </span>
                )}
              </Badge>
              <span className="text-xs text-text-tertiary">
                Card {activeQuizIndex + 1} of {quizzes.length}
              </span>
            </div>

            <span className="text-xs font-bold text-brand-primary">
              Score: {score} / {quizzes.length}
            </span>
          </div>

          {/* Question & Snippet */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-text-primary">
              {currentQuiz.question}
            </h3>

            {currentQuiz.code_snippet && (
              <pre className="p-4 rounded-xl bg-bg-subtle/80 border border-border-default text-xs font-mono text-brand-primary overflow-x-auto">
                <code>{currentQuiz.code_snippet}</code>
              </pre>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQuiz.options.map((opt, idx) => {
              const isSelected = selectedOption === idx
              const isCorrect = idx === currentQuiz.correct_answer_index
              const isAnswered = selectedOption !== null

              let optionStyle = 'bg-bg-surface hover:bg-bg-subtle text-text-primary border-border-default'
              if (isAnswered) {
                if (isCorrect) {
                  optionStyle = 'bg-success/10 text-success border-success/30 font-semibold'
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-error/10 text-error border-error/30 font-semibold'
                } else {
                  optionStyle = 'bg-bg-surface text-text-muted opacity-60 border-border-default'
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between ${optionStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-error shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation reveal */}
          <AnimatePresence>
            {selectedOption !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/20 text-xs space-y-1 text-text-secondary"
              >
                <span className="font-bold text-brand-primary flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Explanation:
                </span>
                <p className="leading-relaxed">{currentQuiz.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border-default">
            <Button variant="ghost" size="sm" onClick={handleRestart} className="text-xs">
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Cards
            </Button>

            {activeQuizIndex < quizzes.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                disabled={selectedOption === null}
                onClick={handleNext}
              >
                Next Card <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            ) : (
              <Badge variant="success" className="px-3 py-1 text-xs">
                Completed! Final Score: {score} / {quizzes.length}
              </Badge>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
