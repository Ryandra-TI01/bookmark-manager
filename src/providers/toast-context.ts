import { createContext } from 'react'

import type { ToastPayload } from '@/types/models'

export interface ToastContextValue {
  toast: (payload: ToastPayload) => void
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined)
