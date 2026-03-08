import type { ReactNode } from 'react'
import { Bookmark, Compass, ShieldCheck } from 'lucide-react'

import { ThemeToggle } from '@/components/layout/theme-toggle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function AuthLayout({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden overflow-hidden bg-[linear-gradient(180deg,rgba(15,23,42,0.97),rgba(28,36,49,0.92))] px-10 py-12 text-slate-100 dark:bg-[linear-gradient(180deg,rgba(4,10,22,0.98),rgba(15,23,42,0.94))] lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(14,165,233,0.18),_transparent_28%)]" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.24em] text-amber-200/90">
            <div className="rounded-2xl bg-white/10 p-3">
              <Bookmark className="size-5" />
            </div>
            Bookmark Manager
          </div>
          <ThemeToggle className="border-white/10 bg-white/10 text-white hover:bg-white/15" />
        </div>

        <div className="relative max-w-xl space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-200">
            <ShieldCheck className="size-4" />
            Private link vault
          </span>
          <h1 className="text-5xl font-semibold leading-tight tracking-tight">
            Save less noise. Recover the links that matter faster.
          </h1>
          <p className="text-lg leading-8 text-slate-300">
            A calm personal workspace for bookmarks, tags, and fast retrieval with a
            polished light and dark interface.
          </p>
          <Separator className="bg-white/10" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <Compass className="size-5 text-amber-200" />
              <p className="mt-4 text-sm font-medium text-slate-100">Focused retrieval</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Search title and URL instantly once your workspace is loaded.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <Bookmark className="size-5 text-cyan-200" />
              <p className="mt-4 text-sm font-medium text-slate-100">Reusable tags</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Organize references with normalized tags you can filter in a click.
              </p>
            </div>
          </div>
        </div>

        <p className="relative text-sm text-slate-400">
          Built for private bookmarking with Supabase authentication and row-level access
          control.
        </p>
      </section>

      <section className="relative flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="absolute right-4 top-4 lg:hidden">
          <ThemeToggle />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.12),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_24%)] dark:bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.1),_transparent_22%)]" />
        <Card className="relative w-full max-w-lg border-border/70 bg-card/80 shadow-[0_32px_90px_-48px_rgba(15,23,42,0.7)]">
          <CardHeader className="space-y-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground lg:hidden">
              <Bookmark className="size-3.5" />
              Bookmark Manager
            </div>
            <div className="space-y-2">
              <CardTitle>{title}</CardTitle>
              <CardDescription className="max-w-md leading-7">{description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </section>
    </div>
  )
}
