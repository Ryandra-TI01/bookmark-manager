import { Spinner } from '@/components/ui/spinner'

export function LoadingScreen({ label = 'Loading application' }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3 text-sm text-muted-foreground shadow-sm">
        <Spinner className="size-4" />
        <span>{label}</span>
      </div>
    </div>
  )
}
