import { api } from '../../api/axios'

export const livekitService = {
  async requestToken({ interviewId, practiceSessionId, mode = 'interview', identity, roomName }) {
    const response = await api.post('/livekit/token', {
      interview_id: interviewId,
      practice_session_id: practiceSessionId,
      mode,
      identity,
      room_name: roomName,
    })
    return response.data
  },
}
