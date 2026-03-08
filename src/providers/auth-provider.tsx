import { startTransition, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import {
  AuthContext,
  buildAuthState,
  defaultAuthState,
  type AuthContextValue,
} from '@/providers/auth-context'
import { authService } from '@/services/auth'
import { getErrorMessage } from '@/lib/utils'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState(defaultAuthState)

  useEffect(() => {
    let isMounted = true

    const bootstrap = async () => {
      try {
        const session = await authService.getSession()

        if (!isMounted) {
          return
        }

        startTransition(() => {
          setAuthState(buildAuthState(session, null))
        })
      } catch (error) {
        if (!isMounted) {
          return
        }

        startTransition(() => {
          setAuthState({
            status: 'unauthenticated',
            session: null,
            user: null,
            error: getErrorMessage(error),
          })
        })
      }
    }

    void bootstrap()

    const {
      data: { subscription },
    } = authService.onAuthStateChange((_event, session) => {
      startTransition(() => {
        setAuthState(buildAuthState(session, null))
      })
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      ...authState,
      clearError: () => {
        setAuthState((current) => ({ ...current, error: null }))
      },
      login: async (email: string, password: string) => {
        try {
          const session = await authService.signIn(email, password)

          startTransition(() => {
            setAuthState(buildAuthState(session, null))
          })
        } catch (error) {
          startTransition(() => {
            setAuthState((current) => ({
              ...current,
              error: getErrorMessage(error),
            }))
          })

          throw error
        }
      },
      register: async (email: string, password: string) => {
        try {
          const result = await authService.signUp(email, password)

          startTransition(() => {
            setAuthState(buildAuthState(result.session, null))
          })

          return result
        } catch (error) {
          startTransition(() => {
            setAuthState((current) => ({
              ...current,
              error: getErrorMessage(error),
            }))
          })

          throw error
        }
      },
      logout: async () => {
        try {
          await authService.signOut()

          startTransition(() => {
            setAuthState({
              status: 'unauthenticated',
              session: null,
              user: null,
              error: null,
            })
          })
        } catch (error) {
          startTransition(() => {
            setAuthState((current) => ({
              ...current,
              error: getErrorMessage(error),
            }))
          })

          throw error
        }
      },
    }),
    [authState],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
