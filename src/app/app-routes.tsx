import { lazy, Suspense, type ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { LoadingScreen } from '@/components/layout/loading-screen'
import { useAuth } from '@/hooks/use-auth'
import { routes } from '@/lib/routes'

const DashboardPage = lazy(async () =>
  import('@/pages/dashboard-page').then((module) => ({
    default: module.DashboardPage,
  })),
)
const LoginPage = lazy(async () =>
  import('@/pages/login-page').then((module) => ({
    default: module.LoginPage,
  })),
)
const RegisterPage = lazy(async () =>
  import('@/pages/register-page').then((module) => ({
    default: module.RegisterPage,
  })),
)

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth()

  if (status === 'loading') {
    return <LoadingScreen label="Restoring your session" />
  }

  if (status === 'unauthenticated') {
    return <Navigate replace to={routes.login} />
  }

  return <>{children}</>
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth()

  if (status === 'loading') {
    return <LoadingScreen label="Checking authentication" />
  }

  if (status === 'authenticated') {
    return <Navigate replace to={routes.dashboard} />
  }

  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen label="Loading page" />}>
      <Routes>
        <Route
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
          path={routes.login}
        />
        <Route
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
          path={routes.register}
        />
        <Route
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
          path={routes.dashboard}
        />
        <Route path="*" element={<Navigate replace to={routes.dashboard} />} />
      </Routes>
    </Suspense>
  )
}
