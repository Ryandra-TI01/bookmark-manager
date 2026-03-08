import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import type { Session, User } from '@supabase/supabase-js'

import { AuthContext } from '@/providers/auth-context'
import { ToastProvider } from '@/providers/toast-provider'
import type { AuthStatus } from '@/types/models'

interface RenderOptions {
  route?: string
  auth?: {
    status?: AuthStatus
    session?: Session | null
    user?: User | null
    error?: string | null
  }
}

export function renderWithProviders(ui: ReactElement, options: RenderOptions = {}) {
  const authValue = {
    status: options.auth?.status ?? 'authenticated',
    session: options.auth?.session ?? null,
    user:
      options.auth?.user ??
      ({
        id: 'user-1',
        email: 'user@example.com',
      } as User),
    error: options.auth?.error ?? null,
    login: async () => undefined,
    register: async () => ({
      session: null,
      requiresEmailConfirmation: true,
    }),
    logout: async () => undefined,
    clearError: () => undefined,
  }

  return render(
    <ToastProvider>
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={[options.route ?? '/dashboard']}>{ui}</MemoryRouter>
      </AuthContext.Provider>
    </ToastProvider>,
  )
}
