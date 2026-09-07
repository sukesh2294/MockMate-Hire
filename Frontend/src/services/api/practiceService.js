import { api } from '../../api/axios'

export const practiceService = {
  async startPracticeSession({ topic, difficulty, use_resume_context, total_questions }) {
    const response = await api.post('/practice/start', {
      topic,
      difficulty,
      use_resume_context,
      total_questions,
    })
    return response.data
  },

  async submitAnswer({ session_id, question_text, candidate_answer }) {
    const response = await api.post('/practice/evaluate', {
      session_id,
      question_text,
      candidate_answer,
    })
    return response.data
  },

  async getPracticeHistory() {
    const response = await api.get('/practice/history')
    return response.data
  },

  async getPracticeAnalytics() {
    const response = await api.get('/practice/analytics')
    return response.data
  },

  async getQuizzes(topic) {
    const response = await api.get('/practice/quizzes', {
      params: { topic },
    })
    return response.data
  },
}
