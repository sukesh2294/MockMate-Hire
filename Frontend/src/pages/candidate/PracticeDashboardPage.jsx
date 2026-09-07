import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Code2, Server, Layout, Brain, Users, Play, HelpCircle, BarChart3, FileText } from 'lucide-react'
import { Card, CardTitle, CardDescription } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Spinner } from '../../components/ui/Spinner'
import { MockInterviewRoom } from '../../components/practice/MockInterviewRoom'
import { QuizFlashcards } from '../../components/practice/QuizFlashcards'
import { PracticeAnalytics } from '../../components/practice/PracticeAnalytics'
import { practiceService } from '../../services/api/practiceService'

const DOMAINS = [
  {
    id: 'Python Backend',
    name: 'Python Backend',
    icon: Server,
    desc: 'FastAPI, AsyncIO, SQLAlchemy, REST APIs, PostgreSQL, Redis',
    badge: 'High Demand',
  },
  {
    id: 'Frontend',
    name: 'Frontend Engineering',
    icon: Layout,
    desc: 'React.js, State Management, DOM Performance, Modern Web APIs',
    badge: 'Popular',
  },
  {
    id: 'System Design',
    name: 'System Design',
    icon: Code2,
    desc: 'Scalability, Load Balancers, Distributed DBs, Caching & Queues',
    badge: 'Advanced',
  },
  {
    id: 'DSA',
    name: 'Data Structures & Algo',
    icon: Brain,
    desc: 'Arrays, Trees, Graphs, Dynamic Programming, Complexity',
    badge: 'Core',
  },
  {
    id: 'HR',
    name: 'HR & Behavioral',
    icon: Users,
    desc: 'STAR framework, Leadership, Conflict Resolution, Problem Solving',
    badge: 'Essential',
  },
]

export default function PracticeDashboardPage() {
  const [selectedDomain, setSelectedDomain] = useState('Python Backend')
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [useResumeContext, setUseResumeContext] = useState(true)
  const [totalQuestions, setTotalQuestions] = useState(5)
  const [activeTab, setActiveTab] = useState('mock') // 'mock' | 'quizzes' | 'analytics'

  const [activeSession, setActiveSession] = useState(null)
  const [startingSession, setStartingSession] = useState(false)

  const handleStartSession = async () => {
    setStartingSession(true)
    try {
      const data = await practiceService.startPracticeSession({
        topic: selectedDomain,
        difficulty,
        use_resume_context: useResumeContext,
        total_questions: totalQuestions,
      })
      setActiveSession(data)
    } catch (err) {
      console.error('Failed to start practice session:', err)
      alert(err.message || 'Failed to initiate practice session.')
    } finally {
      setStartingSession(false)
    }
  }

  const handleSessionCompleted = () => {
    setActiveSession(null)
    setActiveTab('analytics')
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="primary">AI Practice Hub</Badge>
          <Badge variant="premium" className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Real-time Feedback
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          AI Interview Preparation & Practice Mode
        </h1>
        <p className="text-text-tertiary max-w-3xl">
          Practice interactive voice or text technical mock interviews, get instant 4-parameter scoring (Technical Accuracy, STAR Clarity, Keywords & Model Answers), take revision quizzes, and track your interview readiness.
        </p>
      </motion.div>

      {/* Navigation Tabs */}
      {!activeSession && (
        <div className="flex items-center gap-2 border-b border-border-default pb-3">
          <button
            onClick={() => setActiveTab('mock')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'mock'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'bg-bg-card hover:bg-bg-subtle text-text-tertiary border border-border-default'
              }`}
          >
            <Play className="w-4 h-4" /> Mock Interview Setup
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'quizzes'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'bg-bg-card hover:bg-bg-subtle text-text-tertiary border border-border-default'
              }`}
          >
            <HelpCircle className="w-4 h-4" /> Quizzes & Flashcards
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === 'analytics'
                ? 'bg-brand-primary text-white shadow-sm'
                : 'bg-bg-card hover:bg-bg-subtle text-text-tertiary border border-border-default'
              }`}
          >
            <BarChart3 className="w-4 h-4" /> Performance Analytics
          </button>
        </div>
      )}

      {/* Tab 1: Mock Interview Setup & Active Session */}
      {activeTab === 'mock' && (
        <>
          {activeSession ? (
            <MockInterviewRoom
              sessionData={activeSession}
              onSessionCompleted={handleSessionCompleted}
            />
          ) : (
            <div className="space-y-6">
              {/* Domain Selection Cards */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-text-primary">1. Select Target Domain</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DOMAINS.map((domain) => {
                    const Icon = domain.icon
                    const isSelected = selectedDomain === domain.id

                    return (
                      <Card
                        key={domain.id}
                        onClick={() => setSelectedDomain(domain.id)}
                        className={`p-5 cursor-pointer transition-all border ${isSelected
                            ? 'bg-brand-primary/10 border-brand-primary ring-2 ring-brand-primary/30 shadow-md'
                            : 'bg-bg-card hover:bg-bg-surface border-border-default'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`p-2.5 rounded-xl ${isSelected ? 'bg-brand-primary text-white' : 'bg-bg-subtle text-brand-primary'
                              }`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <Badge variant={isSelected ? 'primary' : 'default'}>{domain.badge}</Badge>
                        </div>
                        <CardTitle className="text-base">{domain.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">{domain.desc}</CardDescription>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Options Setup Grid */}
              <div className="grid sm:grid-cols-3 gap-4 p-6 rounded-2xl bg-bg-card border border-border-default">
                {/* Difficulty Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-primary uppercase tracking-wider block">
                    Difficulty Level
                  </label>
                  <div className="flex gap-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setDifficulty(diff)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${difficulty === diff
                            ? 'bg-brand-primary text-white border-brand-primary'
                            : 'bg-bg-surface text-text-secondary border-border-default hover:bg-bg-subtle'
                          }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Questions Count Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-primary uppercase tracking-wider block">
                    Session Length
                  </label>
                  <div className="flex gap-2">
                    {[3, 5, 10].map((count) => (
                      <button
                        key={count}
                        onClick={() => setTotalQuestions(count)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${totalQuestions === count
                            ? 'bg-brand-primary text-white border-brand-primary'
                            : 'bg-bg-surface text-text-secondary border-border-default hover:bg-bg-subtle'
                          }`}
                      >
                        {count} Questions
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resume Context Switch */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-primary uppercase tracking-wider block">
                    Resume Personalization
                  </label>
                  <button
                    onClick={() => setUseResumeContext(!useResumeContext)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-2 transition-all ${useResumeContext
                        ? 'bg-success/10 text-success border-success/30 font-semibold'
                        : 'bg-bg-surface text-text-muted border-border-default'
                      }`}
                  >
                    <FileText className="w-4 h-4" />
                    {useResumeContext ? 'Resume Targeted Active' : 'Generic Questions'}
                  </button>
                </div>
              </div>

              {/* Start Session CTA */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto px-8 cursor-pointer"
                  onClick={handleStartSession}
                  disabled={startingSession}
                >
                  {startingSession ? (
                    <>
                      <Spinner size="sm" className="mr-2" /> Generating Custom Interview...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" /> Launch Interactive Mock Session
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Tab 2: Quizzes & Flashcards */}
      {activeTab === 'quizzes' && (
        <QuizFlashcards selectedTopic={selectedDomain} />
      )}

      {/* Tab 3: Performance Analytics */}
      {activeTab === 'analytics' && (
        <PracticeAnalytics />
      )}
    </div>
  )
}
