import { createContext } from 'react'
import type { Session } from '@supabase/supabase-js'

import type { AuthState, RegisterResult } from '@/types/models'

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<RegisterResult>
  logout: () => Promise<void>
  clearError: () => void
}

export const defaultAuthState: AuthState = {
  status: 'loading',
  session: null,
  user: null,
  error: null,
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function buildAuthState(session: Session | null, error: string | null): AuthState {
  return {
    status: session ? 'authenticated' : 'unauthenticated',
    session,
    user: session?.user ?? null,
    error,
  }
}
