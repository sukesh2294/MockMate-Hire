import { api } from '../../api/axios'

export const interviewService = {
  async getInterviews() {
    const response = await api.get('/interviews')
    return response.data
  },

  async getInterviewById(id) {
    const response = await api.get(`/interviews/${id}`)
    return response.data
  },

  async createInterview(data) {
    const response = await api.post('/interviews', data)
    return response.data
  },

  async createInterviewSession(id) {
    const response = await api.post(`/interviews/${id}/sessions`)
    return response.data
  },

  async analyzeAnswer(id, answerText) {
    const response = await api.post(`/interviews/${id}/analysis`, { answer_text: answerText })
    return response.data
  },

  async getDashboardStats() {
    const response = await api.get('/interviews/dashboard/stats')
    return response.data
  },

  async getInterviewActivity() {
    const response = await api.get('/interviews/dashboard/activity')
    return response.data
  },

  async getCandidatePerformance() {
    const response = await api.get('/interviews/dashboard/performance')
    return response.data
  },

  async getRecentInterviews() {
    const response = await api.get('/interviews/dashboard/recent-interviews')
    return response.data
  },

  async getRecentCandidates() {
    const response = await api.get('/interviews/dashboard/recent-candidates')
    return response.data
  },

  async getInterviewCandidates() {
    const response = await api.get('/interviews/dashboard/interview-candidates')
    return response.data
  },

  async getCandidateRanking() {
    const response = await api.get('/interviews/dashboard/ranking')
    return response.data
  },
}
