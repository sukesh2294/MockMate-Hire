import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, Sparkles, ArrowRight, RefreshCw, CheckCircle, Volume2 } from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Textarea } from '../ui/Textarea'
import { Spinner } from '../ui/Spinner'
import { FeedbackCard } from './FeedbackCard'
import { practiceService } from '../../services/api/practiceService'
import { livekitService } from '../../services/livekit/livekitService'
import { AvatarProvider } from '../avatar/AvatarProvider'
import { AvatarContainer } from '../avatar/AvatarContainer'
import { AvatarStateManager } from '../avatar/AvatarStateManager'
import { LiveKitRoom, RoomAudioRenderer, useRoomContext } from '@livekit/components-react'

function PracticeRoomContent({ sessionData, onSessionCompleted }) {
  const { session_id, topic, difficulty, questions = [] } = sessionData || {}

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answerText, setAnswerText] = useState('')
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evaluations, setEvaluations] = useState({}) // map question index -> evaluation response
  const [speechSynthesisActive, setSpeechSynthesisActive] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState('idle')
  const room = useRoomContext()

  const currentQuestion = questions[currentIndex] || { question_text: 'Loading question...' }
  const currentEvaluation = evaluations[currentIndex]

  useEffect(() => {
    if (!room) return

    const handleActiveSpeakers = (speakers) => {
      const agentSpeaking = speakers?.some((speaker) => {
        const identity = speaker.identity?.toLowerCase() || ''
        return identity.includes('agent') || identity.includes('interviewer') || identity.startsWith('aw_')
      })
      setVoiceStatus(agentSpeaking ? 'speaking' : speakers?.length ? 'listening' : 'idle')
    }

    room.on('activeSpeakersChanged', handleActiveSpeakers)
    return () => room.off('activeSpeakersChanged', handleActiveSpeakers)
  }, [room])

  // Speak current question text aloud using browser SpeechSynthesis if supported
  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(currentQuestion.question_text)
      utterance.rate = 0.95
      utterance.pitch = 1.0
      setSpeechSynthesisActive(true)
      utterance.onend = () => setSpeechSynthesisActive(false)
      utterance.onerror = () => setSpeechSynthesisActive(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  // Handle Speech Recognition for voice mode if supported by browser
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser version. You can type your answer in text mode!')
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onstart = () => setIsRecording(true)
      recognition.onresult = (event) => {
        let transcript = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        setAnswerText((prev) => (prev ? prev + ' ' + transcript : transcript))
      }
      recognition.onerror = () => setIsRecording(false)
      recognition.onend = () => setIsRecording(false)

      recognition.start()
    } catch (e) {
      console.warn('Speech recognition error:', e)
      setIsRecording(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!answerText.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await practiceService.submitAnswer({
        session_id,
        question_text: currentQuestion.question_text,
        candidate_answer: answerText,
      })

      setEvaluations((prev) => ({
        ...prev,
        [currentIndex]: res,
      }))
    } catch (err) {
      console.error('Failed to submit answer:', err)
      alert(err.message || 'Failed to submit answer for evaluation.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setAnswerText('')
    } else {
      if (onSessionCompleted) onSessionCompleted()
    }
  }

  return (
    <div className="space-y-6">
      {/* Session Progress Header */}
      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-brand-primary/20 bg-bg-card">
        <div className="flex items-center gap-3">
          <Badge variant="primary" className="text-xs px-3 py-1">
            {topic}
          </Badge>
          <Badge variant="default" className="text-xs">
            {difficulty}
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-text-tertiary font-medium">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="w-36 h-2 bg-bg-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Main Question Card */}
      <Card className="space-y-6 bg-gradient-to-br from-bg-card via-bg-surface to-bg-subtle/30 border-border-default shadow-md">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Question #{currentIndex + 1}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-text-tertiary hover:text-brand-primary"
              onClick={speakQuestion}
            >
              <Volume2 className={`w-4 h-4 mr-1 ${speechSynthesisActive ? 'animate-bounce text-brand-primary' : ''}`} />
              Read Aloud
            </Button>
          </div>

          <h2 className="text-xl font-bold text-text-primary leading-snug">
            {currentQuestion.question_text}
          </h2>
        </div>

        {/* Answer Input Area */}
        {!currentEvaluation ? (
          <div className="space-y-4 pt-4 border-t border-border-default">
            {/* Input Mode Toggle */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-tertiary">Provide your response below via Text or Voice:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant={isVoiceActive ? 'primary' : 'outline'}
                  size="sm"
                  className="text-xs"
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                >
                  <Mic className="w-3.5 h-3.5 mr-1" />
                  {isVoiceActive ? 'Voice Mode Active' : 'Enable Voice Mode'}
                </Button>
              </div>
            </div>

            {/* Voice Waveform Indicator if Voice active */}
            {isVoiceActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/20 flex flex-col items-center justify-center space-y-3"
              >
                <div className="flex items-center justify-center gap-1.5 h-8">
                  {[...Array(9)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: isRecording ? [8, 28, 12, 32, 10][i % 5] : 8,
                      }}
                      transition={{
                        repeat: Infinity,
                        repeatType: 'reverse',
                        duration: 0.5 + (i % 3) * 0.2,
                      }}
                      className={`w-1.5 rounded-full ${isRecording ? 'bg-brand-primary' : 'bg-text-tertiary/40'}`}
                    />
                  ))}
                </div>
                <Button
                  variant={isRecording ? 'error' : 'primary'}
                  size="sm"
                  onClick={toggleRecording}
                >
                  {isRecording ? <MicOff className="w-4 h-4 mr-1.5" /> : <Mic className="w-4 h-4 mr-1.5" />}
                  {isRecording ? 'Stop Recording' : 'Start Speaking'}
                </Button>
              </motion.div>
            )}

            <Textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Type your structured answer here (Hint: Situation -> Task -> Action -> Result)..."
              rows={5}
              className="w-full text-sm font-sans"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-text-tertiary">
                {answerText.trim().split(/\s+/).filter(Boolean).length} words
              </span>

              <Button
                variant="primary"
                onClick={handleSubmitAnswer}
                disabled={!answerText.trim() || isSubmitting}
                className="px-6"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="mr-2" /> Evaluating with AI...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-1.5" /> Submit Answer for AI Feedback
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Render Instant Feedback Card */
          <div className="space-y-4 pt-4 border-t border-border-default">
            <FeedbackCard evaluation={currentEvaluation} />

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEvaluations((prev) => {
                    const next = { ...prev }
                    delete next[currentIndex]
                    return next
                  })
                }}
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry Question
              </Button>

              <Button variant="primary" onClick={handleNextQuestion}>
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next Question <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                ) : (
                  <>
                    Complete Practice Session <CheckCircle className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
      <div className="grid gap-4 md:grid-cols-[minmax(0,260px)_1fr]">
        <AvatarProvider>
          <AvatarStateManager voiceStatus={voiceStatus} analysisLoading={isSubmitting} />
          <AvatarContainer />
        </AvatarProvider>
        <div className="rounded-xl border border-border-default bg-bg-card p-4">
          <p className="text-sm font-semibold text-text-primary">AI interviewer is {voiceStatus}</p>
          <p className="mt-1 text-xs text-text-muted">LiveKit audio is connected for this practice session.</p>
        </div>
      </div>
    </div>
  )
}

export function MockInterviewRoom({ sessionData, onSessionCompleted }) {
  const [connection, setConnection] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const connectPracticeRoom = async () => {
      try {
        const identity = sessionStorage.getItem('candidateName') || 'Candidate'
        const data = await livekitService.requestToken({
          mode: 'practice',
          practiceSessionId: sessionData.session_id,
          identity,
          roomName: sessionData.session_id,
        })
        if (mounted) setConnection(data)
      } catch (err) {
        if (mounted) setError(err.message || 'Unable to connect to the practice room')
      }
    }
    connectPracticeRoom()
    return () => { mounted = false }
  }, [sessionData.session_id])

  if (error) return <Card className="text-error">{error}</Card>
  if (!connection) return <Card><Spinner size="sm" /> Connecting to AI interviewer...</Card>

  return (
    <LiveKitRoom token={connection.token} serverUrl={connection.url} connect audio video={false}>
      <RoomAudioRenderer />
      <PracticeRoomContent sessionData={sessionData} onSessionCompleted={onSessionCompleted} />
    </LiveKitRoom>
  )
}
