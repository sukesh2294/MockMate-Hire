// import { useQuery } from '@tanstack/react-query'
// import { useAuth } from '@clerk/clerk-react'
// import { api } from '../api/axios'

// export function useCurrentUser() {
//   const { getToken, isSignedIn } = useAuth()

//   return useQuery(
//     ['currentUser'],
//     async () => {
//       const token = await getToken()
//       if (token) {
//         const response = await api.get('/me')
//         return response.data
//       }
//       throw new Error('User is not authenticated')
//     },
//     {
//       enabled: isSignedIn,
//       retry: 1,
//       staleTime: 1000 * 60 * 2,
//     },
//   )
// }

import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { api } from '../api/axios'

export function useCurrentUser() {
  const { isLoaded, isSignedIn } = useAuth()

  return useQuery({
    queryKey: ['currentUser'],

    queryFn: async () => {
      const response = await api.get('/me')
      return response.data
    },

    enabled: isLoaded && isSignedIn,
    retry: 1,
    staleTime: 1000 * 60 * 2,
  })
}