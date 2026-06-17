import axios from 'axios'

let tokenProvider = null

export const setAuthTokenProvider = (provider) => {
  tokenProvider = provider
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(async (config) => {
  if (tokenProvider) {
    try {
      const token = await tokenProvider()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      } else {
        return Promise.reject(new Error('Missing authentication token'))
      }
    } catch (error) {
      console.warn('Failed to attach auth token', error)
      return Promise.reject(error)
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.response?.data?.message || error.message || 'An error occurred'
    return Promise.reject(new Error(message))
  },
)
