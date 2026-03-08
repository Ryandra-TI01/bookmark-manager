import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

import { getSupabaseClient } from '@/lib/supabase'
import type { RegisterResult } from '@/types/models'

export const authService = {
  async getSession() {
    const { data, error } = await getSupabaseClient().auth.getSession()

    if (error) {
      throw error
    }

    return data.session
  },
  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return getSupabaseClient().auth.onAuthStateChange(callback)
  },
  async signIn(email: string, password: string) {
    const { data, error } = await getSupabaseClient().auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    return data.session
  },
  async signUp(email: string, password: string): Promise<RegisterResult> {
    const { data, error } = await getSupabaseClient().auth.signUp({
      email,
      password,
    })

    if (error) {
      throw error
    }

    return {
      session: data.session,
      requiresEmailConfirmation: data.session === null,
    }
  },
  async signOut() {
    const { error } = await getSupabaseClient().auth.signOut()

    if (error) {
      throw error
    }
  },
}
