import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthForm } from '@/components/auth/auth-form'
import { AuthLayout } from '@/components/auth/auth-layout'
import { useAuth } from '@/hooks/use-auth'
import { routes } from '@/lib/routes'

export function LoginPage() {
  const navigate = useNavigate()
  const { clearError, error, login } = useAuth()
  const [pending, setPending] = useState(false)

  return (
    <AuthLayout
      description="Access your private bookmark dashboard with search and tags."
      title="Welcome back"
    >
      <AuthForm
        error={error}
        mode="login"
        pending={pending}
        onSubmit={async ({ email, password }) => {
          setPending(true)
          clearError()

          try {
            await login(email, password)
            navigate(routes.dashboard, { replace: true })
          } finally {
            setPending(false)
          }
        }}
      />
    </AuthLayout>
  )
}
