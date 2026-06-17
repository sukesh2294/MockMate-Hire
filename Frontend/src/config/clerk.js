const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable')
}

export const clerkConfig = {
  publishableKey: clerkPubKey,
  signInUrl: '/auth/login',
  signUpUrl: '/auth/signup',
  signInFallbackRedirectUrl: '/recruiter/dashboard',
  signUpFallbackRedirectUrl: '/recruiter/dashboard',
}
