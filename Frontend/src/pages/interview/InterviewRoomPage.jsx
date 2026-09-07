// import { useCallback, useEffect, useRef, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Mic, MicOff, SkipForward, AlertCircle } from 'lucide-react'
// import { Button } from '../../components/ui/Button'
// import { BrandMark } from '../../components/brand/BrandLogo'
// import { Badge } from '../../components/ui/Badge'
// import { LoadingScreen } from '../../components/ui/Spinner'
// import { QuestionCard } from '../../components/interview/QuestionCard'
// import { TranscriptBox } from '../../components/interview/TranscriptBox'
// import { AnalysisPanel } from '../../components/interview/AnalysisPanel'
// import { ProgressBar } from '../../components/interview/ProgressBar'
// import { Timer } from '../../components/interview/Timer'
// import { useInterviewTimer } from '../../hooks/useInterviewTimer'
// import { interviewService } from '../../services/api/interviewService'
// import { livekitService } from '../../services/livekit/livekitService'
// import { AvatarProvider } from '../../components/avatar/AvatarProvider'
// import { AvatarContainer } from '../../components/avatar/AvatarContainer'
// import { AvatarControls } from '../../components/avatar/AvatarControls'
// import { AvatarStateManager } from '../../components/avatar/AvatarStateManager'

// import {
//   LiveKitRoom,
//   RoomAudioRenderer,
//   useRoomContext,
//   useLocalParticipant,
// } from '@livekit/components-react'

// const PHASES = {
//   INTRO: 'intro',
//   ASKING: 'asking',
//   RECORDING: 'recording',
//   TRANSCRIBING: 'transcribing',
//   ANALYZING: 'analyzing',
//   REVIEWED: 'reviewed',
//   COMPLETE: 'complete',
// }

// function VoiceStatus({ status }) {
//   const configs = {
//     idle: { label: 'Ready', color: 'bg-text-muted' },
//     listening: { label: 'Listening...', color: 'bg-success animate-pulse' },
//     speaking: { label: 'Speaking...', color: 'bg-brand-primary animate-pulse' },
//     thinking: { label: 'Thinking...', color: 'bg-accent-sky' },
//   }
//   const current = configs[status] || configs.idle
//   return (
//     <div className="flex items-center gap-2">
//       <span className={`w-2.5 h-2.5 rounded-full ${current.color}`} />
//       <span className="text-xs text-text-muted">{current.label}</span>
//     </div>
//   )
// }

// function InterviewRoomContent({ interviewId }) {
//   const [phase, setPhase] = useState(PHASES.INTRO)
//   const [interview, setInterview] = useState(null)
//   const [questions, setQuestions] = useState([])
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const [transcript, setTranscript] = useState([])
//   const [voiceStatus, setVoiceStatus] = useState('idle')
//   const [greeting, setGreeting] = useState('')
//   const [analysis, setAnalysis] = useState(null)
//   const [analysisLoading, setAnalysisLoading] = useState(false)
//   const [transcriptText, setTranscriptText] = useState('')
//   const [candidateName] = useState(() => sessionStorage.getItem('candidateName') || 'Candidate')
//   const [resumeAnalysis] = useState(() => {
//     try {
//       return JSON.parse(sessionStorage.getItem('resumeAnalysis') || 'null')
//     } catch {
//       return null
//     }
//   })

//   const videoRef = useRef(null)
//   const streamRef = useRef(null)
//   const introStarted = useRef(false)
  
//   const room = useRoomContext()
//   const { localParticipant } = useLocalParticipant()
//   const [muted, setMuted] = useState(false)

//   // Configure camera capture for local candidate preview
//   useEffect(() => {
//     const startCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: false,
//         })
//         streamRef.current = stream
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream
//           videoRef.current.onloadedmetadata = () => {
//             videoRef.current.play().catch((err) => console.log('Video play interrupted:', err))
//           }
//         }
//       } catch (err) {
//         console.error('Camera access error:', err)
//       }
//     }
//     startCamera()
//     return () => {
//       streamRef.current?.getTracks().forEach((track) => track.stop())
//     }
//   }, [])

//   // Listen to remote agent transcripts, speech-to-text, and active speaker events
//   useEffect(() => {
//     if (!room) return

//     const handleData = (payload) => {
//       try {
//         const text = new TextDecoder().decode(payload)
//         const data = JSON.parse(text)
//         if (data.type === 'transcript') {
//           setTranscript((prev) => [...prev, { speaker: data.speaker, text: data.text }])
//           if (data.speaker === 'ai') {
//             setVoiceStatus('speaking')
//           } else {
//             setVoiceStatus('listening')
//           }
//         }
//       } catch (err) {
//         const text = new TextDecoder().decode(payload)
//         setTranscript((prev) => [...prev, { speaker: 'ai', text }])
//       }
//     }

//     const handleTranscription = (transcripts, participant) => {
//       if (!transcripts) return
//       transcripts.forEach((segment) => {
//         const text = segment.text?.trim()
//         if (!text) return

//         const isAgent = participant
//           ? participant.identity?.toLowerCase().includes('agent') ||
//             participant.identity?.toLowerCase().includes('interviewer')
//           : false
//         const speaker = isAgent ? 'ai' : 'candidate'
//         const segmentId = segment.id || `${speaker}-current`

//         setTranscript((prev) => {
//           const index = prev.findIndex((t) => t.id === segmentId)
//           if (index !== -1) {
//             const updated = [...prev]
//             updated[index] = { ...updated[index], text, finalized: segment.final }
//             return updated
//           }

//           const last = prev[prev.length - 1]
//           if (last && last.speaker === speaker && !last.finalized) {
//             const updated = [...prev]
//             updated[updated.length - 1] = {
//               ...last,
//               id: segmentId,
//               text,
//               finalized: segment.final,
//             }
//             return updated
//           }

//           return [...prev, { id: segmentId, speaker, text, finalized: segment.final }]
//         })

//         if (isAgent) {
//           setVoiceStatus('speaking')
//         } else {
//           setVoiceStatus('listening')
//         }
//       })
//     }

//     const handleActiveSpeakers = (speakers) => {
//       if (!speakers || speakers.length === 0) {
//         setVoiceStatus('idle')
//         return
//       }
//       const hasAgent = speakers.some(
//         (s) =>
//           s.identity?.toLowerCase().includes('agent') ||
//           s.identity?.toLowerCase().includes('interviewer')
//       )
//       if (hasAgent) {
//         setVoiceStatus('speaking')
//       } else {
//         setVoiceStatus('listening')
//       }
//     }

//     room.on('dataReceived', handleData)
//     room.on('transcriptionReceived', handleTranscription)
//     room.on('activeSpeakersChanged', handleActiveSpeakers)

//     return () => {
//       room.off('dataReceived', handleData)
//       room.off('transcriptionReceived', handleTranscription)
//       room.off('activeSpeakersChanged', handleActiveSpeakers)
//     }
//   }, [room])

//   const onTimerComplete = useCallback(() => {
//     setVoiceStatus('idle')
//     setPhase(PHASES.COMPLETE)
//   }, [])

//   const { formatted, start, pause, seconds } = useInterviewTimer(600, onTimerComplete)

//   const askQuestion = useCallback((question) => {
//     setVoiceStatus('speaking')
//     setTranscript((prev) => [...prev, { speaker: 'ai', text: question.text }])
//     setTimeout(() => setVoiceStatus('idle'), 2500)
//   }, [])

//   const beginIntro = useCallback((loadedQuestions) => {
//     if (introStarted.current || loadedQuestions.length === 0) return
//     introStarted.current = true
//     start()
//     const introText = `Hello ${candidateName}. I am your AI Interviewer. Let's begin.`
//     setGreeting(introText)
//     setVoiceStatus('speaking')
//     setTranscript([{ speaker: 'ai', text: introText }])
//     setTimeout(() => {
//       setGreeting('')
//       setPhase(PHASES.ASKING)
//       askQuestion(loadedQuestions[0])
//     }, 3500)
//   }, [candidateName, start, askQuestion])

//   // Load interview details from Backend
//   useEffect(() => {
//     let isMounted = true
//     const loadInterview = async () => {
//       try {
//         const data = await interviewService.getInterviewById(interviewId)
//         if (!isMounted || !data) return

//         const baseQuestions = [...(data.questions || [])]
//         if (resumeAnalysis?.personalizedQuestion) {
//           baseQuestions.unshift({
//             id: 'resume-q',
//             text: resumeAnalysis.personalizedQuestion,
//             type: 'personalized',
//             difficulty: 'medium',
//           })
//         }

//         setInterview(data)
//         setQuestions(baseQuestions)
//         beginIntro(baseQuestions)
//       } catch (err) {
//         console.error('Unable to load interview', err)
//       }
//     }

//     loadInterview()
//     return () => {
//       isMounted = false
//     }
//   }, [interviewId, resumeAnalysis, beginIntro])

//   const handleStartRecording = () => {
//     setPhase(PHASES.RECORDING)
//     setVoiceStatus('listening')
//     // Unmute mic in LiveKit room
//     if (localParticipant) {
//       localParticipant.setMicrophoneEnabled(true)
//       setMuted(false)
//     }
//   }

//   const handleStopRecording = () => {
//     setPhase(PHASES.TRANSCRIBING)
//     setVoiceStatus('idle')
//     if (localParticipant) {
//       localParticipant.setMicrophoneEnabled(false)
//       setMuted(true)
//     }

//     setTimeout(() => {
//       setTranscript((prev) => {
//         const candidateEntries = prev.filter((t) => t.speaker === 'candidate')
//         const latestResponse = candidateEntries.length
//           ? candidateEntries[candidateEntries.length - 1].text
//           : 'Response recorded via voice stream.'

//         setTranscriptText(latestResponse)
//         setPhase(PHASES.ANALYZING)
//         runAnalysis(latestResponse)
//         return prev
//       })
//     }, 1200)
//   }

//   const runAnalysis = async (answerText) => {
//     setAnalysisLoading(true)
//     try {
//       const result = await interviewService.analyzeAnswer(interviewId, answerText)
//       setAnalysis(result)
//     } catch (err) {
//       console.error('Analysis failed', err)
//       setAnalysis([])
//     } finally {
//       setAnalysisLoading(false)
//       setPhase(PHASES.REVIEWED)
//     }
//   }

//   const handleNext = () => {
//     const avgScore = analysis
//       ? Math.round(analysis.reduce((s, d) => s + d.score, 0) / analysis.length)
//       : 70

//     if (currentIndex < questions.length - 1) {
//       const nextIndex = currentIndex + 1
//       setCurrentIndex(nextIndex)
//       setAnalysis(null)
//       setTranscriptText('')
//       setPhase(PHASES.ASKING)
//       askQuestion(questions[nextIndex])
//     } else {
//       const closingText = 'Thank you. Your interview is complete.'
//       setTranscript((prev) => [...prev, { speaker: 'ai', text: closingText }])
//       setGreeting(closingText)
//       setVoiceStatus('speaking')
//       setPhase(PHASES.COMPLETE)
//       pause()
//     }
//   }

//   const handleMuteToggle = () => {
//     if (localParticipant) {
//       const current = localParticipant.isMicrophoneEnabled
//       localParticipant.setMicrophoneEnabled(!current)
//       setMuted(current)
//     }
//   }

//   const questionProgress = questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0
//   const currentQuestion = questions[currentIndex]

//   return (
//     <div className="min-h-screen bg-bg-base flex flex-col">
//       <header className="border-b border-border-default bg-bg-card px-4 py-3">
//         <div className="max-w-6xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <BrandMark size="xs" rounded="md" />
//             <span className="text-sm font-medium text-text-primary">AI Interview</span>
//             <Badge variant="primary">Live</Badge>
//           </div>
//           <div className="flex items-center gap-4">
//             <VoiceStatus status={voiceStatus} />
//             <Timer formatted={formatted} warning={seconds < 120} />
//           </div>
//         </div>
//       </header>

//       <main className="flex-1 max-w-6xl mx-auto w-full p-4 lg:p-6 grid lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-1 flex flex-col items-center justify-start pt-4">
//           <AvatarProvider>
//             <AvatarStateManager voiceStatus={voiceStatus} analysisLoading={analysisLoading} />
//             <AvatarContainer />
//             <div className="mt-6 w-full space-y-3">
//               <ProgressBar value={questionProgress} showLabel />
//               <p className="text-xs text-text-muted text-center">
//                 Question {Math.min(currentIndex + 1, questions.length)} of {questions.length}
//               </p>
//             </div>

//             <div className="mt-6 w-full space-y-4">
//               <div className="rounded-4xl bg-bg-card p-4 border border-border-default">
//                 <h2 className="text-lg font-semibold text-text-primary mb-3">Live Candidate View</h2>
//                 <video ref={videoRef} autoPlay muted className="w-full h-60 rounded-3xl bg-black object-cover" />
//               </div>

//               <div className="rounded-4xl bg-bg-card p-4 border border-border-default w-full">
//                 <h2 className="text-lg font-semibold text-text-primary mb-3">Interviewer Controls</h2>
//                 <AvatarControls />
//               </div>
//             </div>
//           </AvatarProvider>
//         </div>

//         <div className="lg:col-span-2 space-y-4">
//           {phase !== PHASES.COMPLETE && currentQuestion && (
//             <QuestionCard
//               question={currentQuestion}
//               index={currentIndex}
//               total={questions.length}
//             />
//           )}

//           <TranscriptBox entries={transcript} />

//           {phase === PHASES.TRANSCRIBING && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-bg-brand/30 border border-brand-primary/20">
//               <p className="text-xs font-medium text-brand-primary mb-2">Speech to Text</p>
//               <div className="flex items-center gap-2">
//                 <div className="flex gap-1">
//                   {[0, 1, 2].map((i) => (
//                     <motion.div
//                       key={i}
//                       className="w-1.5 h-1.5 rounded-full bg-brand-primary"
//                       animate={{ opacity: [0.3, 1, 0.3] }}
//                       transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-sm text-text-muted">Transcribing your response...</span>
//               </div>
//             </motion.div>
//           )}

//           {transcriptText && phase !== PHASES.TRANSCRIBING && (
//             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-bg-subtle border border-border-default">
//               <p className="text-xs font-medium text-text-muted mb-2">Your Response (Transcribed)</p>
//               <p className="text-sm text-text-primary leading-relaxed">{transcriptText}</p>
//             </motion.div>
//           )}

//           {(phase === PHASES.ANALYZING || phase === PHASES.REVIEWED) && (
//             <AnalysisPanel dimensions={analysis || []} loading={analysisLoading} />
//           )}

//           {phase !== PHASES.COMPLETE && phase !== PHASES.INTRO && (
//             <div className="flex items-center justify-between p-4 bg-bg-card rounded-xl border border-border-default">
//               <Badge variant={
//                 phase === PHASES.RECORDING ? 'warning' :
//                 phase === PHASES.REVIEWED ? 'success' :
//                 phase === PHASES.ANALYZING ? 'primary' : 'default'
//               }>
//                 {phase === PHASES.ASKING && 'Ready to answer'}
//                 {phase === PHASES.RECORDING && 'Recording your answer...'}
//                 {phase === PHASES.TRANSCRIBING && 'Processing speech...'}
//                 {phase === PHASES.ANALYZING && 'AI analyzing response...'}
//                 {phase === PHASES.REVIEWED && 'Analysis complete'}
//               </Badge>
//               <div className="flex gap-2">
//                 <Button size="sm" variant={muted ? 'destructive' : 'secondary'} icon={muted ? MicOff : Mic} onClick={handleMuteToggle}>
//                   {muted ? 'Unmute' : 'Mute'}
//                 </Button>
//                 {phase === PHASES.ASKING && (
//                   <Button size="sm" icon={Mic} onClick={handleStartRecording}>
//                     Start Recording
//                   </Button>
//                 )}
//                 {phase === PHASES.RECORDING && (
//                   <Button size="sm" variant="danger" icon={MicOff} onClick={handleStopRecording}>
//                     Stop Recording
//                   </Button>
//                 )}
//                 {phase === PHASES.REVIEWED && (
//                   <Button size="sm" icon={SkipForward} onClick={handleNext}>
//                     {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
//                   </Button>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </main>

//       <AnimatePresence>
//         {phase === PHASES.COMPLETE && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-text-primary/50 flex items-center justify-center p-4 z-50"
//           >
//             <motion.div
//               initial={{ opacity: 0, y: 20, scale: 0.95 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               className="bg-bg-card rounded-2xl p-8 max-w-md text-center shadow-xl"
//             >
//               <div className="w-16 h-16 rounded-full bg-gradient-brand mx-auto mb-4 flex items-center justify-center">
//                 <span className="text-2xl">✓</span>
//               </div>
//               <h2 className="text-2xl font-bold text-text-primary mb-2">Interview Complete</h2>
//               <p className="text-text-muted mb-2 italic">&ldquo;Thank you. Your interview is complete.&rdquo;</p>
//               <p className="text-sm text-text-muted mb-6">
//                 Your responses have been submitted for evaluation. The recruiter will review your results shortly.
//               </p>
//               <Button onClick={() => { window.location.href = '/' }}>Return Home</Button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

// export default function InterviewRoomPage() {
//   const { id } = useParams()
//   const [token, setToken] = useState(null)
//   const [url, setUrl] = useState(null)
//   const [loadingToken, setLoadingToken] = useState(true)
//   const [error, setError] = useState(null)
//   const [candidateName] = useState(() => sessionStorage.getItem('candidateName') || 'Candidate')
  
//   useEffect(() => {
//     let isMounted = true
//     const initSession = async () => {
//       try {
//         setLoadingToken(true)
//         let sessionId = sessionStorage.getItem('sessionId')
//         if (!sessionId) {
//           const sessionData = await interviewService.createInterviewSession(id)
//           sessionId = sessionData.session_id
//           sessionStorage.setItem('sessionId', sessionId)
//         }
        
//         // Fetch room WebRTC connection credentials
//         const data = await livekitService.requestToken({
//           interviewId: id,
//           identity: candidateName,
//           roomName: sessionId,
//         })
        
//         if (isMounted) {
//           setToken(data.token)
//           setUrl(data.url)
//         }
//       } catch (err) {
//         console.error('Failed to initialize LiveKit session:', err)
//         if (isMounted) {
//           setError(err.message || 'Unable to connect to live interview room')
//         }
//       } finally {
//         if (isMounted) {
//           setLoadingToken(false)
//         }
//       }
//     }
    
//     initSession()
//     return () => {
//       isMounted = false
//     }
//   }, [id, candidateName])

//   if (loadingToken) {
//     return <LoadingScreen message="Initializing interview room..." />
//   }

//   if (error || !token || !url) {
//     return (
//       <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6 text-center">
//         <AlertCircle className="w-16 h-16 text-error mb-4" />
//         <h2 className="text-2xl font-bold text-text-primary mb-2">Connection Failed</h2>
//         <p className="text-text-muted mb-6 max-w-sm">
//           {error || 'Failed to establish connection credentials with LiveKit server.'}
//         </p>
//         <div className="flex gap-3">
//           <Button onClick={() => window.location.href = '/'}>Return Home</Button>
//           <Button onClick={() => window.location.reload()}>Retry</Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <LiveKitRoom
//       token={token}
//       serverUrl={url}
//       connect={true}
//       audio={true}
//       video={false}
//     >
//       <RoomAudioRenderer />
//       <InterviewRoomContent interviewId={id} />
//     </LiveKitRoom>
//   )
// }


import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, SkipForward, AlertCircle, Volume2, Monitor, MonitorOff } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { BrandMark } from '../../components/brand/BrandLogo'
import { Badge } from '../../components/ui/Badge'
import { LoadingScreen } from '../../components/ui/Spinner'
import { QuestionCard } from '../../components/interview/QuestionCard'
import { TranscriptBox } from '../../components/interview/TranscriptBox'
import { AnalysisPanel } from '../../components/interview/AnalysisPanel'
import { ProgressBar } from '../../components/interview/ProgressBar'
import { Timer } from '../../components/interview/Timer'
import { useInterviewTimer } from '../../hooks/useInterviewTimer'
import { interviewService } from '../../services/api/interviewService'
import { livekitService } from '../../services/livekit/livekitService'
import { AvatarProvider } from '../../components/avatar/AvatarProvider'
import { AvatarContainer } from '../../components/avatar/AvatarContainer'
import { AvatarControls } from '../../components/avatar/AvatarControls'
import { AvatarStateManager } from '../../components/avatar/AvatarStateManager'

import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoTrack,
  useRoomContext,
  useLocalParticipant,
  useTracks,
} from '@livekit/components-react'
import { Track } from 'livekit-client'

const PHASES = {
  INTRO: 'intro',
  ASKING: 'asking',
  RECORDING: 'recording',
  TRANSCRIBING: 'transcribing',
  ANALYZING: 'analyzing',
  REVIEWED: 'reviewed',
  COMPLETE: 'complete',
}

function VoiceStatus({ status }) {
  const configs = {
    idle: { label: 'Ready', color: 'bg-text-muted' },
    listening: { label: 'Listening...', color: 'bg-success animate-pulse' },
    speaking: { label: 'Speaking...', color: 'bg-brand-primary animate-pulse' },
    thinking: { label: 'Thinking...', color: 'bg-accent-sky' },
  }
  const current = configs[status] || configs.idle
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full ${current.color}`} />
      <span className="text-xs text-text-muted">{current.label}</span>
    </div>
  )
}

function InterviewRoomContent({ interviewId }) {
  const [phase, setPhase] = useState(PHASES.ASKING)
  const [interview, setInterview] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [transcript, setTranscript] = useState([])
  const [voiceStatus, setVoiceStatus] = useState('idle')
  const [analysis, setAnalysis] = useState(null)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [transcriptText, setTranscriptText] = useState('')
  const [audioUnlocked, setAudioUnlocked] = useState(true)

  const [candidateName] = useState(() => sessionStorage.getItem('candidateName') || 'Candidate')
  const [resumeAnalysis] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('resumeAnalysis') || 'null')
    } catch {
      return null
    }
  })

  const videoRef = useRef(null)
  const streamRef = useRef(null)
  
  const room = useRoomContext()
  const { localParticipant } = useLocalParticipant()
  const screenShareTracks = useTracks([
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ])
  const [muted, setMuted] = useState(false)
  const [screenShareEnabled, setScreenShareEnabled] = useState(false)

  const screenShareTrack = screenShareTracks.find(
    (trackRef) => trackRef.participant?.isLocal,
  )

  // 1. Local Camera Preview
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch((err) => console.log('Video play interrupted:', err))
          }
        }
      } catch (err) {
        console.error('Camera access error:', err)
      }
    }
    startCamera()
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  // 2. Track Audio & Active Speakers for Agent Speech State
  useEffect(() => {
    if (!room) return

    const handleTrackSubscribed = (track, publication, participant) => {
      if (track.kind === Track.Kind.Audio) {
        console.log('Subscribed to remote audio track from:', participant.identity)
        // Attach audio element if needed
        const element = track.attach()
        document.body.appendChild(element)
      }
    }

    const handleActiveSpeakers = (speakers) => {
      if (!speakers || speakers.length === 0) {
        setVoiceStatus('idle')
        return
      }
      const hasAgent = speakers.some(
        (s) =>
          s.identity?.toLowerCase().includes('agent') ||
          s.identity?.toLowerCase().includes('interviewer') ||
          s.identity?.startsWith('AW_')
      )
      if (hasAgent) {
        setVoiceStatus('speaking')
      } else {
        setVoiceStatus('listening')
      }
    }

    const handleTranscription = (transcripts, participant) => {
      if (!transcripts) return
      transcripts.forEach((segment) => {
        const text = segment.text?.trim()
        if (!text) return

        const isAgent = participant
          ? participant.identity?.toLowerCase().includes('agent') ||
            participant.identity?.toLowerCase().includes('interviewer') ||
            participant.identity?.startsWith('AW_')
          : false
        const speaker = isAgent ? 'ai' : 'candidate'
        const segmentId = segment.id || `${speaker}-${Date.now()}`

        setTranscript((prev) => {
          const index = prev.findIndex((t) => t.id === segmentId)
          if (index !== -1) {
            const updated = [...prev]
            updated[index] = { ...updated[index], text, finalized: segment.final }
            return updated
          }
          return [...prev, { id: segmentId, speaker, text, finalized: segment.final }]
        })

        setVoiceStatus(isAgent ? 'speaking' : 'listening')
      })
    }

    room.on('trackSubscribed', handleTrackSubscribed)
    room.on('activeSpeakersChanged', handleActiveSpeakers)
    room.on('transcriptionReceived', handleTranscription)

    return () => {
      room.off('trackSubscribed', handleTrackSubscribed)
      room.off('activeSpeakersChanged', handleActiveSpeakers)
      room.off('transcriptionReceived', handleTranscription)
    }
  }, [room])

  const onTimerComplete = useCallback(() => {
    setVoiceStatus('idle')
    setPhase(PHASES.COMPLETE)
  }, [])

  const { formatted, start, pause, seconds } = useInterviewTimer(600, onTimerComplete)

  // Load questions
  useEffect(() => {
    let isMounted = true
    const loadInterview = async () => {
      try {
        const data = await interviewService.getInterviewById(interviewId)
        if (!isMounted || !data) return

        const baseQuestions = [...(data.questions || [])]
        if (resumeAnalysis?.personalizedQuestion) {
          baseQuestions.unshift({
            id: 'resume-q',
            text: resumeAnalysis.personalizedQuestion,
            type: 'personalized',
            difficulty: 'medium',
          })
        }

        setInterview(data)
        setQuestions(baseQuestions)
        start()
      } catch (err) {
        console.error('Unable to load interview', err)
      }
    }

    loadInterview()
    return () => {
      isMounted = false
    }
  }, [interviewId, resumeAnalysis, start])

  const handleMuteToggle = () => {
    if (localParticipant) {
      const current = localParticipant.isMicrophoneEnabled
      localParticipant.setMicrophoneEnabled(!current)
      setMuted(current)
    }
  }

  const handleScreenShareToggle = async () => {
    if (!localParticipant) return

    try {
      const nextEnabled = !screenShareEnabled
      await localParticipant.setScreenShareEnabled(nextEnabled)
      setScreenShareEnabled(nextEnabled)
    } catch (err) {
      console.error('Screen share error:', err)
      setScreenShareEnabled(false)
    }
  }

  const questionProgress = questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0
  const currentQuestion = questions[currentIndex]

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <header className="border-b border-border-default bg-bg-card px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandMark size="xs" rounded="md" />
            <span className="text-sm font-medium text-text-primary">AI Interview</span>
            <Badge variant="primary">Live</Badge>
          </div>
          <div className="flex items-center gap-4">
            <VoiceStatus status={voiceStatus} />
            <Timer formatted={formatted} warning={seconds < 120} />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 lg:p-6">
        <AvatarProvider>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-4xl bg-bg-card p-4 border border-border-default">
                <h2 className="text-lg font-semibold text-text-primary mb-3">Live Candidate View</h2>
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-60 rounded-3xl bg-black object-cover" />
            </div>

            <div className="rounded-4xl bg-bg-card p-4 border border-border-default">
                <h2 className="text-lg font-semibold text-text-primary mb-3">Interviewer Controls</h2>
                <div className="mb-3 flex items-center justify-between rounded-xl bg-bg-subtle px-3 py-2">
                  <span className="text-sm text-text-muted">Current</span>
                  <span className="text-sm font-semibold text-text-primary capitalize">{voiceStatus}</span>
                </div>
                <div className="mb-3 flex flex-wrap gap-2 text-xs text-text-muted">
                  {['speaking', 'thinking', 'listening', 'idle'].map((status) => (
                    <span
                      key={status}
                      className={`rounded-full border px-2.5 py-1 capitalize ${
                        voiceStatus === status
                          ? 'border-brand-primary bg-bg-brand text-brand-primary'
                          : 'border-border-default'
                      }`}
                    >
                      {status}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant={muted ? 'destructive' : 'secondary'} icon={muted ? MicOff : Mic} onClick={handleMuteToggle} className="w-full">
                    {muted ? 'Unmute Mic' : 'Mute Mic'}
                  </Button>
                </div>
            </div>

            <div className="rounded-4xl bg-bg-card p-4 border border-border-default">
                <h2 className="text-lg font-semibold text-text-primary mb-3">Live Screen View</h2>
                <div className="relative overflow-hidden rounded-3xl bg-black aspect-video">
                  {screenShareTrack ? (
                    <VideoTrack
                      trackRef={screenShareTrack}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center px-6 text-center text-sm text-white/60">
                      Start screen sharing to show your live screen here.
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant={screenShareEnabled ? 'danger' : 'secondary'}
                  icon={screenShareEnabled ? MonitorOff : Monitor}
                  onClick={handleScreenShareToggle}
                  className="w-full mt-3"
                >
                  {screenShareEnabled ? 'Stop Screen Share' : 'Start Screen Share'}
                </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="flex flex-col items-center justify-start">
              <AvatarStateManager voiceStatus={voiceStatus} analysisLoading={analysisLoading} />
              <AvatarContainer />
              <div className="mt-6 w-full space-y-3">
                <ProgressBar value={questionProgress} showLabel />
                <p className="text-xs text-text-muted text-center">
                  Question {Math.min(currentIndex + 1, questions.length)} of {questions.length}
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-2 flex flex-col">
              {phase !== PHASES.COMPLETE && currentQuestion && (
                <QuestionCard
                  question={currentQuestion}
                  index={currentIndex}
                  total={questions.length}
                />
              )}

              <TranscriptBox entries={transcript} />
            </div>
          </div>
        </AvatarProvider>
      </main>
    </div>
  )
}

export default function InterviewRoomPage() {
  const { id } = useParams()
  const [token, setToken] = useState(null)
  const [url, setUrl] = useState(null)
  const [loadingToken, setLoadingToken] = useState(true)
  const [error, setError] = useState(null)
  const [candidateName] = useState(() => sessionStorage.getItem('candidateName') || 'Candidate')

  useEffect(() => {
    let isMounted = true
    const initSession = async () => {
      try {
        setLoadingToken(true)
        let sessionId = sessionStorage.getItem('sessionId')
        if (!sessionId) {
          const sessionData = await interviewService.createInterviewSession(id)
          sessionId = sessionData.session_id
          sessionStorage.setItem('sessionId', sessionId)
        }

        const data = await livekitService.requestToken({
          interviewId: id,
          identity: candidateName,
          roomName: sessionId,
        })

        if (isMounted) {
          setToken(data.token)
          setUrl(data.url)
        }
      } catch (err) {
        console.error('Failed to initialize LiveKit session:', err)
        if (isMounted) {
          setError(err.message || 'Unable to connect to live interview room')
        }
      } finally {
        if (isMounted) {
          setLoadingToken(false)
        }
      }
    }

    initSession()
    return () => {
      isMounted = false
    }
  }, [id, candidateName])

  if (loadingToken) {
    return <LoadingScreen message="Initializing interview room..." />
  }

  if (error || !token || !url) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-error mb-4" />
        <h2 className="text-2xl font-bold text-text-primary mb-2">Connection Failed</h2>
        <p className="text-text-muted mb-6 max-w-sm">
          {error || 'Failed to establish connection credentials with LiveKit server.'}
        </p>
        <div className="flex gap-3">
          <Button onClick={() => window.location.href = '/'}>Return Home</Button>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={url}
      connect={true}
      audio={true}
      video={false}
    >
      <RoomAudioRenderer />
      <InterviewRoomContent interviewId={id} />
    </LiveKitRoom>
  )
}