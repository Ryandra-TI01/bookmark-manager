import { Link } from 'react-router-dom'
import { useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'

interface AuthFormProps {
  mode: 'login' | 'register'
  error?: string | null
  notice?: {
    title: string
    description: string
    variant?: 'default' | 'success'
  } | null
  pending: boolean
  onSubmit: (values: { email: string; password: string }) => Promise<void>
}

export function AuthForm({ mode, error, notice, pending, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)

  const submitLabel = mode === 'login' ? 'Log in' : 'Create account'
  const secondaryHref = mode === 'login' ? '/register' : '/login'
  const secondaryLabel =
    mode === 'login' ? 'Need an account? Register' : 'Already have an account? Log in'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim() || !password.trim()) {
      setFieldError('Email and password are required.')
      return
    }

    if (password.trim().length < 8) {
      setFieldError('Password must be at least 8 characters.')
      return
    }

    setFieldError(null)
    await onSubmit({ email: email.trim(), password: password.trim() })
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Authentication failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {notice ? (
        <Alert variant={notice.variant === 'success' ? 'success' : 'default'}>
          <AlertTitle>{notice.title}</AlertTitle>
          <AlertDescription>{notice.description}</AlertDescription>
        </Alert>
      ) : null}

      {fieldError ? (
        <Alert variant="destructive">
          <AlertTitle>Invalid form input</AlertTitle>
          <AlertDescription>{fieldError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor={`${mode}-email`}>Email</Label>
        <Input
          id={`${mode}-email`}
          autoComplete="email"
          placeholder="you@example.com"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${mode}-password`}>Password</Label>
        <Input
          id={`${mode}-password`}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          placeholder="Minimum 8 characters"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <Button className="mt-2 w-full" disabled={pending} type="submit">
        {pending ? <Spinner /> : null}
        {submitLabel}
      </Button>

      <Button asChild className="w-full" variant="ghost">
        <Link to={secondaryHref}>{secondaryLabel}</Link>
      </Button>
    </form>
  )
}
