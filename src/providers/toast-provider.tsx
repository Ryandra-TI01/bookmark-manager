import * as ToastPrimitives from '@radix-ui/react-toast'
import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { ToastContext } from '@/providers/toast-context'
import type { ToastPayload } from '@/types/models'

interface ToastItem extends ToastPayload {
  id: number
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const toast = useCallback((payload: ToastPayload) => {
    const id = window.setTimeout(() => undefined, 0)
    setItems((current) => [...current, { id, ...payload }])
  }, [])

  const removeItem = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      <ToastPrimitives.Provider swipeDirection="right">
        {children}
        {items.map((item) => (
          <ToastPrimitives.Root
            key={item.id}
            className={cn(
              'data-[state=open]:animate-in data-[state=closed]:animate-out',
              'fixed right-4 top-4 z-50 flex w-[min(360px,calc(100vw-2rem))] items-start gap-3 rounded-2xl border bg-card p-4 shadow-lg',
              item.variant === 'destructive' && 'border-destructive/30 bg-destructive text-destructive-foreground',
            )}
            duration={3500}
            open
            onOpenChange={(open) => {
              if (!open) {
                removeItem(item.id)
              }
            }}
          >
            <div className="grid flex-1 gap-1">
              <ToastPrimitives.Title className="text-sm font-semibold">
                {item.title}
              </ToastPrimitives.Title>
              {item.description ? (
                <ToastPrimitives.Description
                  className={cn(
                    'text-sm text-muted-foreground',
                    item.variant === 'destructive' && 'text-destructive-foreground/90',
                  )}
                >
                  {item.description}
                </ToastPrimitives.Description>
              ) : null}
            </div>
            <ToastPrimitives.Close
              className={cn(
                'rounded-full p-1 text-muted-foreground transition hover:bg-muted',
                item.variant === 'destructive' &&
                  'text-destructive-foreground/80 hover:bg-white/10',
              )}
              aria-label="Close notification"
            >
              <X className="size-4" />
            </ToastPrimitives.Close>
          </ToastPrimitives.Root>
        ))}
        <ToastPrimitives.Viewport className="fixed right-0 top-0 z-50 flex max-h-screen w-full flex-col p-4 outline-none sm:max-w-[420px]" />
      </ToastPrimitives.Provider>
      </ToastContext.Provider>
    )
}
