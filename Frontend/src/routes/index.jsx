import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ClerkRootLayout } from '../layouts/ClerkRootLayout'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { CandidateLayout } from '../layouts/CandidateLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { LazyPage } from './LazyPage'
import { AuthRedirect } from './AuthRedirect'
import {
  LandingPage,
  LoginPage,
  SignupPage,
  DashboardPage,
  InterviewsPage,
  CreateInterviewPage,
  CandidatesPage,
  CandidatePortalPage,
  CandidateDashboardPage,
  InterviewRoomPage,
  ReportsPage,
  ProfilePage,
  SettingsPage,
  NotFoundPage,
} from './lazyPages'

export const router = createBrowserRouter([
  {
    element: <ClerkRootLayout />,
    children: [
      {
        path: '/',
        element: <LazyPage><LandingPage /></LazyPage>,
      },
      // Splat routes required for Clerk multi-step auth (e.g. /auth/login/factor-one)
      {
        path: '/auth/login/*',
        element: <LazyPage><LoginPage /></LazyPage>,
      },
      {
        path: '/auth/signup/*',
        element: <LazyPage><SignupPage /></LazyPage>,
      },
      {
        path: '/login',
        element: <AuthRedirect to="/auth/login" />,
      },
      {
        path: '/login/*',
        element: <AuthRedirect to="/auth/login" />,
      },
      {
        path: '/signup',
        element: <AuthRedirect to="/auth/signup" />,
      },
      {
        path: '/signup/*',
        element: <AuthRedirect to="/auth/signup" />,
      },
      {
        path: '/candidate/:id',
        element: <LazyPage><CandidatePortalPage /></LazyPage>,
      },
      {
        path: '/interview/:id',
        element: <LazyPage><InterviewRoomPage /></LazyPage>,
      },
      {
        element: (
          <ProtectedRoute allowedRoles={[ 'candidate' ]}>
            <CandidateLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: '/candidate/dashboard',
            element: <LazyPage><CandidateDashboardPage /></LazyPage>,
          },
        ],
      },
      {
        element: (
          <ProtectedRoute allowedRoles={[ 'recruiter' ]}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: '/recruiter/dashboard',
            element: <LazyPage><DashboardPage /></LazyPage>,
          },
          {
            path: '/recruiter/interviews',
            element: <LazyPage><InterviewsPage /></LazyPage>,
          },
          {
            path: '/recruiter/create-interview',
            element: <LazyPage><CreateInterviewPage /></LazyPage>,
          },
          {
            path: '/recruiter/candidates',
            element: <LazyPage><CandidatesPage /></LazyPage>,
          },
          {
            path: '/reports/:candidateId',
            element: <LazyPage><ReportsPage /></LazyPage>,
          },
          {
            path: '/profile',
            element: <LazyPage><ProfilePage /></LazyPage>,
          },
          {
            path: '/settings',
            element: <LazyPage><SettingsPage /></LazyPage>,
          },
        ],
      },
      {
        path: '/not-found',
        element: <LazyPage><NotFoundPage /></LazyPage>,
      },
      {
        path: '*',
        element: <Navigate to="/not-found" replace />,
      },
    ],
  },
])
