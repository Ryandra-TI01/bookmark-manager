import type { HTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

function Alert({
  className,
  variant = 'default',
  ...props
}: HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'destructive' | 'success' }) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-2xl border px-4 py-3 text-sm',
        variant === 'default' && 'border-border bg-muted/50 text-foreground',
        variant === 'destructive' &&
          'border-destructive/30 bg-destructive/10 text-destructive',
        variant === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-900',
        className,
      )}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h4 className={cn('font-semibold', className)} {...props} />
}

function AlertDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('mt-1 text-sm leading-6', className)} {...props} />
}

export { Alert, AlertTitle, AlertDescription }
