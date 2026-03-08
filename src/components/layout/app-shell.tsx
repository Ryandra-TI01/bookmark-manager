import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function AppShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.16),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.14),_transparent_24%),linear-gradient(180deg,_var(--background),_color-mix(in_oklch,var(--background),black_2%))] dark:bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.12),_transparent_22%),linear-gradient(180deg,_var(--background),_color-mix(in_oklch,var(--background),black_8%))]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.04] dark:opacity-[0.07]" />
      <div
        className={cn(
          'relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
