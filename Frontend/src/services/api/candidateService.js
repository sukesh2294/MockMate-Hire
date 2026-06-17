import { api } from '../../api/axios'

export const candidateService = {
  async getCandidates() {
    const response = await api.get('/candidates')
    return response.data
  },

  async getCandidateReport(candidateId) {
    const response = await api.get(`/reports/${candidateId}`)
    return response.data
  },

  async uploadResume(file) {
    const form = new FormData()
    form.append('file', file)
    const response = await api.post('/candidates/me/resume', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
}
