import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthForm } from '@/components/auth/auth-form'
import { AuthLayout } from '@/components/auth/auth-layout'
import { useAuth } from '@/hooks/use-auth'
import { routes } from '@/lib/routes'

export function RegisterPage() {
  const navigate = useNavigate()
  const { clearError, error, register } = useAuth()
  const [pending, setPending] = useState(false)
  const [notice, setNotice] = useState<{
    title: string
    description: string
    variant?: 'default' | 'success'
  } | null>(null)

  return (
    <AuthLayout
      description="Create an account to manage bookmarks, tags, and quick search in one place."
      title="Create your account"
    >
      <AuthForm
        error={error}
        mode="register"
        notice={notice}
        pending={pending}
        onSubmit={async ({ email, password }) => {
          setPending(true)
          clearError()
          setNotice(null)

          try {
            const result = await register(email, password)

            if (result.session) {
              navigate(routes.dashboard, { replace: true })
              return
            }

            setNotice({
              title: 'Check your inbox',
              description:
                'Your account was created. Confirm the email from Supabase before signing in.',
              variant: 'success',
            })
          } finally {
            setPending(false)
          }
        }}
      />
    </AuthLayout>
  )
}
