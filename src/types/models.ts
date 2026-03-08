import type { Session, User } from '@supabase/supabase-js'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface Tag {
  id: string
  name: string
}

export interface Bookmark {
  id: string
  title: string
  url: string
  description: string
  createdAt: string
  updatedAt: string
  tags: Tag[]
}

export interface BookmarkFormValues {
  title: string
  url: string
  description: string
  tagNames: string[]
}

export interface AuthState {
  status: AuthStatus
  session: Session | null
  user: User | null
  error: string | null
}

export interface RegisterResult {
  session: Session | null
  requiresEmailConfirmation: boolean
}

export interface ToastPayload {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}
