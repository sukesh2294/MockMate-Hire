export const dashboardStats = {
  totalInterviews: 12,
  candidatesScreened: 28,
  averageScore: 81,
  recommendedCandidates: 3,
  trends: {
    interviews: 12,
    screened: 8,
    score: 5,
    recommended: 15,
  },
}

export const interviewActivity = [
  { month: 'Jan', interviews: 2, completed: 1 },
  { month: 'Feb', interviews: 3, completed: 2 },
  { month: 'Mar', interviews: 4, completed: 3 },
  { month: 'Apr', interviews: 5, completed: 4 },
  { month: 'May', interviews: 8, completed: 6 },
  { month: 'Jun', interviews: 12, completed: 10 },
]

export const candidatePerformance = [
  { category: 'Technical', score: 85 },
  { category: 'Communication', score: 90 },
  { category: 'Confidence', score: 80 },
  { category: 'Fluency', score: 88 },
  { category: 'Clarity', score: 86 },
]

export const recentInterviews = [
  { id: 'int-001', role: 'Frontend Developer', candidates: 3, status: 'active', date: '2026-06-07', avgScore: 81 },
  { id: 'int-002', role: 'Backend Engineer', candidates: 5, status: 'completed', date: '2026-06-03', avgScore: 74 },
  { id: 'int-003', role: 'Full Stack Developer', candidates: 8, status: 'active', date: '2026-06-01', avgScore: 78 },
]

export const interviewCandidates = [
  { id: 'cand-rahul', name: 'Rahul', role: 'Frontend Developer', status: 'pending', score: 76, date: '2026-06-07' },
  { id: 'cand-aman', name: 'Aman', role: 'Frontend Developer', status: 'completed', score: 81, date: '2026-06-06' },
  { id: 'cand-priya', name: 'Priya', role: 'Frontend Developer', status: 'completed', score: 79, date: '2026-06-05' },
]

export const candidateRanking = [
  { rank: 1, id: 'cand-sukesh', name: 'Sukesh', score: 86 },
  { rank: 2, id: 'cand-aman', name: 'Aman', score: 81 },
  { rank: 3, id: 'cand-rahul', name: 'Rahul', score: 76 },
]

export const recentCandidates = [
  { id: 'cand-sukesh', name: 'Sukesh Kumar', role: 'Frontend Developer', score: 86, status: 'recommended', date: '2026-06-07' },
  { id: 'cand-aman', name: 'Aman', role: 'Frontend Developer', score: 81, status: 'recommended', date: '2026-06-06' },
  { id: 'cand-priya', name: 'Priya', role: 'Frontend Developer', score: 79, status: 'review', date: '2026-06-05' },
  { id: 'cand-rahul', name: 'Rahul', role: 'Frontend Developer', score: 76, status: 'review', date: '2026-06-07' },
]

export const allInterviews = [
  ...recentInterviews,
  { id: 'int-004', role: 'React Developer', candidates: 4, status: 'draft', date: '2026-05-28', avgScore: null },
]

export const allCandidates = [
  ...recentCandidates,
  { id: 'cand-006', name: 'Neha Sharma', role: 'UI Developer', score: 72, status: 'maybe', date: '2026-05-30' },
]

export const candidateReport = {
  id: 'cand-sukesh',
  name: 'Sukesh Kumar',
  role: 'Frontend Developer',
  interviewDate: '2026-06-07',
  overallScore: 86,
  scores: {
    technical: 85,
    communication: 90,
    confidence: 80,
  },
  recommendation: 'recommended',
  strengths: [
    'Strong communication skills',
    'Good React knowledge',
    'Clear and structured answers',
  ],
  weaknesses: [
    'Improve system design concepts',
    'Could deepen knowledge of performance optimization',
  ],
  suggestions: [
    'Strong communication',
    'Good React knowledge',
    'Improve system design concepts',
  ],
  scoreHistory: [
    { question: 'Q1', score: 82 },
    { question: 'Q2', score: 88 },
    { question: 'Q3', score: 90 },
    { question: 'Q4', score: 84 },
    { question: 'Q5', score: 86 },
  ],
}

export const candidateReports = {
  'cand-sukesh': candidateReport,
  'cand-aman': {
    ...candidateReport,
    id: 'cand-aman',
    name: 'Aman',
    overallScore: 81,
    scores: { technical: 78, communication: 85, confidence: 75 },
    recommendation: 'recommended',
  },
  'cand-rahul': {
    ...candidateReport,
    id: 'cand-rahul',
    name: 'Rahul',
    overallScore: 76,
    scores: { technical: 72, communication: 80, confidence: 70 },
    recommendation: 'review',
  },
  'cand-priya': {
    ...candidateReport,
    id: 'cand-priya',
    name: 'Priya',
    overallScore: 79,
    scores: { technical: 76, communication: 82, confidence: 74 },
    recommendation: 'review',
  },
}

export const defaultInterviewQuestions = [
  { id: 1, text: 'Tell me about yourself', type: 'behavioral', difficulty: 'easy' },
  { id: 2, text: 'What is React?', type: 'technical', difficulty: 'easy' },
  { id: 3, text: 'Difference between State and Props?', type: 'technical', difficulty: 'medium' },
  { id: 4, text: 'What is Virtual DOM?', type: 'technical', difficulty: 'medium' },
  { id: 5, text: 'Explain useEffect Hook', type: 'technical', difficulty: 'hard' },
]

export const adaptiveQuestions = {
  easy: [
    { id: 'e1', text: 'What is a Component in React?', type: 'technical', difficulty: 'easy' },
    { id: 'e2', text: 'What is JSX?', type: 'technical', difficulty: 'easy' },
  ],
  medium: [
    { id: 'm1', text: 'Explain React Lifecycle methods', type: 'technical', difficulty: 'medium' },
    { id: 'm2', text: 'How does React reconciliation work?', type: 'technical', difficulty: 'medium' },
  ],
  hard: [
    { id: 'h1', text: 'Explain React Lifecycle and when to use each phase', type: 'technical', difficulty: 'hard' },
    { id: 'h2', text: 'Design a scalable state management architecture for a large React app', type: 'system_design', difficulty: 'hard' },
  ],
}

export const interviewQuestions = defaultInterviewQuestions

export const resumeAnalysisMock = {
  insight: 'Resume me React likha hai',
  personalizedQuestion: 'I noticed React experience on your resume. Can you explain how you have used React Hooks in your projects?',
  skills: ['React', 'JavaScript', 'HTML/CSS', 'Hooks'],
}

export const speechToTextMock = {
  tellMeAboutYourself:
    'Hello, my name is Sukesh Kumar. I am a frontend developer with experience in React, JavaScript, and building responsive web applications. I enjoy solving UI challenges and writing clean, maintainable code.',
  whatIsReact:
    'React is a JavaScript library for building user interfaces. It uses a component-based architecture and a virtual DOM for efficient rendering.',
  weakAnswer:
    'React is used for making websites. It has components.',
}

export const analysisDimensions = [
  { key: 'communication', label: 'Communication', score: 88 },
  { key: 'grammar', label: 'Grammar', score: 85 },
  { key: 'fluency', label: 'Fluency', score: 90 },
  { key: 'clarity', label: 'Clarity', score: 87 },
  { key: 'technical', label: 'Technical', score: 82 },
  { key: 'correctness', label: 'Correctness', score: 84 },
  { key: 'depth', label: 'Depth', score: 78 },
  { key: 'confidence', label: 'Confidence', score: 80 },
  { key: 'speakingSpeed', label: 'Speaking Speed', score: 86 },
  { key: 'hesitation', label: 'Hesitation', score: 92 },
]

export const candidateInterviews = [
  {
    id: 'int-001',
    role: 'Frontend Developer',
    company: 'TechFlow',
    status: 'pending',
    date: '2026-06-07',
    duration: '30 min',
  },
  {
    id: 'int-002',
    role: 'React Developer',
    company: 'NovaLabs',
    status: 'scheduled',
    date: '2026-06-10',
    duration: '25 min',
  },
  {
    id: 'int-003',
    role: 'UI Engineer',
    company: 'ScaleUp Inc',
    status: 'completed',
    date: '2026-06-01',
    duration: '35 min',
    score: 86,
  },
]

export const landingFeatures = [
  { title: 'AI Avatar Interviews', description: 'Conduct natural, conversational screening interviews with lifelike AI avatars that adapt to candidate responses.', icon: 'Bot' },
  { title: 'Instant Evaluation', description: 'Get comprehensive candidate scores across technical, communication, and behavioral dimensions in real-time.', icon: 'Zap' },
  { title: 'Smart Scheduling', description: 'Generate shareable interview links and let candidates complete screenings on their own schedule.', icon: 'Calendar' },
  { title: 'Analytics Dashboard', description: 'Track hiring pipeline metrics, compare candidates, and make data-driven hiring decisions.', icon: 'BarChart3' },
  { title: 'Resume-Aware Questions', description: 'AI reads candidate resumes and asks personalized follow-up questions based on their experience.', icon: 'FileText' },
  { title: 'Team Collaboration', description: 'Share reports, leave notes, and align your hiring team with structured candidate evaluations.', icon: 'Users' },
]

export const howItWorks = [
  { step: 1, title: 'Create Interview', description: 'Define the role, experience level, and interview parameters. Our AI generates tailored questions.' },
  { step: 2, title: 'Share Link', description: 'Send candidates a unique interview link. They complete the screening at their convenience.' },
  { step: 3, title: 'AI Conducts Interview', description: 'Our AI avatar guides candidates through questions, probing deeper based on their responses.' },
  { step: 4, title: 'Review Results', description: 'Receive detailed scores, transcripts, and hiring recommendations within minutes.' },
]

export const testimonials = [
  { quote: 'MockMate cut our screening time by 70%. We now focus final interviews only on top candidates.', author: 'Rachel Kim', role: 'VP of Engineering', company: 'TechFlow' },
  { quote: 'The AI evaluations are remarkably consistent. Our hiring managers trust the scores.', author: 'David Martinez', role: 'Head of Talent', company: 'ScaleUp Inc' },
  { quote: 'Candidates love the flexibility. Completion rates went from 45% to 89% after switching.', author: 'Priya Sharma', role: 'Recruiting Lead', company: 'NovaLabs' },
]

export const faqs = [
  { question: 'How accurate are the AI evaluations?', answer: 'Our AI is calibrated against thousands of expert-reviewed interviews and achieves 92% agreement with senior hiring managers on candidate rankings.' },
  { question: 'Can candidates cheat during AI interviews?', answer: 'We employ proctoring signals including browser monitoring, response pattern analysis, and optional camera verification to ensure interview integrity.' },
  { question: 'What roles does MockMate support?', answer: 'We support technical, product, design, and general business roles with customizable question templates for each.' },
  { question: 'How long does a typical screening take?', answer: 'Most screenings take 10-45 minutes depending on role complexity and the number of questions configured.' },
  { question: 'Is candidate data secure?', answer: 'Yes. We are SOC 2 compliant with end-to-end encryption for all interview recordings and transcripts.' },
]
