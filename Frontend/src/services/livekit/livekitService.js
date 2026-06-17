import { api } from '../../api/axios'

export const livekitService = {
  async requestToken({ interviewId, identity, roomName }) {
    const response = await api.post('/livekit/token', {
      interview_id: interviewId,
      identity,
      room_name: roomName,
    })
    return response.data
  },
}
