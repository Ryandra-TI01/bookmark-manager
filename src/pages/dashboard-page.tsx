import { useDeferredValue, useEffect, useState } from 'react'
import { BookmarkPlus, LogOut, Search, Tags } from 'lucide-react'

import { BookmarkCard } from '@/components/bookmarks/bookmark-card'
import { BookmarkFormDialog } from '@/components/bookmarks/bookmark-form-dialog'
import { DeleteBookmarkDialog } from '@/components/bookmarks/delete-bookmark-dialog'
import { AppShell } from '@/components/layout/app-shell'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/hooks/use-auth'
import { useToast } from '@/hooks/use-toast'
import { bookmarkService } from '@/services/bookmarks'
import { getErrorMessage, sortBookmarksByUpdatedAt } from '@/lib/utils'
import type { Bookmark, BookmarkFormValues, Tag } from '@/types/models'

export function DashboardPage() {
  const { logout, user } = useAuth()
  const { toast } = useToast()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTagId, setSelectedTagId] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [bookmarkToDelete, setBookmarkToDelete] = useState<Bookmark | null>(null)
  const [pendingAction, setPendingAction] = useState<'save' | 'delete' | 'logout' | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const deferredSearch = useDeferredValue(searchQuery)

  useEffect(() => {
    let isMounted = true

    const loadDashboard = async () => {
      setStatus('loading')
      setError(null)

      try {
        const [bookmarkRows, tagRows] = await Promise.all([
          bookmarkService.listBookmarks(),
          bookmarkService.listTags(),
        ])

        if (!isMounted) {
          return
        }

        setBookmarks(sortBookmarksByUpdatedAt(bookmarkRows))
        setTags(tagRows)
        setStatus('ready')
      } catch (loadError) {
        if (!isMounted) {
          return
        }

        setError(getErrorMessage(loadError))
        setStatus('error')
      }
    }

    void loadDashboard()

    return () => {
      isMounted = false
    }
  }, [reloadKey, user?.id])

  const selectedTag = tags.find((tag) => tag.id === selectedTagId) ?? null
  const visibleBookmarks = bookmarks.filter((bookmark) => {
    const query = deferredSearch.trim().toLocaleLowerCase()
    const matchesQuery =
      !query ||
      bookmark.title.toLocaleLowerCase().includes(query) ||
      bookmark.url.toLocaleLowerCase().includes(query)
    const matchesTag =
      selectedTagId === 'all' ||
      bookmark.tags.some((tag) => tag.id === selectedTagId)

    return matchesQuery && matchesTag
  })

  const upsertBookmark = (nextBookmark: Bookmark) => {
    setBookmarks((current) =>
      sortBookmarksByUpdatedAt([
        nextBookmark,
        ...current.filter((bookmark) => bookmark.id !== nextBookmark.id),
      ]),
    )
    setTags((current) => {
      const nextMap = new Map(current.map((tag) => [tag.id, tag]))

      for (const tag of nextBookmark.tags) {
        nextMap.set(tag.id, tag)
      }

      return [...nextMap.values()].sort((left, right) => left.name.localeCompare(right.name))
    })
  }

  const handleSave = async (values: BookmarkFormValues) => {
    setPendingAction('save')

    try {
      const savedBookmark = editingBookmark
        ? await bookmarkService.updateBookmark(editingBookmark.id, values)
        : await bookmarkService.createBookmark(values)

      upsertBookmark(savedBookmark)
      setFormOpen(false)
      setEditingBookmark(null)
      toast({
        title: editingBookmark ? 'Bookmark updated' : 'Bookmark created',
        description: savedBookmark.title,
      })
    } catch (saveError) {
      toast({
        title: 'Unable to save bookmark',
        description: getErrorMessage(saveError),
        variant: 'destructive',
      })
    } finally {
      setPendingAction(null)
    }
  }

  const handleDelete = async () => {
    if (!bookmarkToDelete) {
      return
    }

    setPendingAction('delete')

    try {
      await bookmarkService.deleteBookmark(bookmarkToDelete.id)
      setBookmarks((current) =>
        current.filter((bookmark) => bookmark.id !== bookmarkToDelete.id),
      )
      setDeleteOpen(false)
      toast({
        title: 'Bookmark deleted',
        description: bookmarkToDelete.title,
      })
      setBookmarkToDelete(null)
    } catch (deleteError) {
      toast({
        title: 'Unable to delete bookmark',
        description: getErrorMessage(deleteError),
        variant: 'destructive',
      })
    } finally {
      setPendingAction(null)
    }
  }

  const handleLogout = async () => {
    setPendingAction('logout')

    try {
      await logout()
      toast({
        title: 'Logged out',
        description: 'Your session has been closed.',
      })
    } catch (logoutError) {
      toast({
        title: 'Unable to log out',
        description: getErrorMessage(logoutError),
        variant: 'destructive',
      })
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <AppShell className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <Card className="overflow-hidden border-none bg-[linear-gradient(135deg,rgba(15,23,42,0.97),rgba(28,36,49,0.92))] text-slate-100 shadow-[0_30px_90px_-48px_rgba(15,23,42,0.7)] dark:bg-[linear-gradient(135deg,rgba(6,12,24,0.98),rgba(17,24,39,0.95))]">
          <CardContent className="flex flex-col gap-8 p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <Badge
                  className="w-fit border-white/10 bg-white/10 px-3 py-1 text-slate-100"
                  variant="outline"
                >
                  Private Dashboard
                </Badge>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Bookmark command center
                  </h1>
                  <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                    Search instantly, organize with reusable tags, and keep your personal
                    links behind authenticated access.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start">
                <ThemeToggle className="border-white/10 bg-white/10 text-slate-100 hover:bg-white/15" />
                <Button
                  className="border-white/10 bg-white/10 text-slate-100 hover:bg-white/15"
                  disabled={pendingAction === 'logout'}
                  variant="outline"
                  onClick={() => void handleLogout()}
                >
                  {pendingAction === 'logout' ? <Spinner /> : <LogOut className="size-4" />}
                  Log out
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="border-white/10 bg-white/10 pl-11 text-slate-100 placeholder:text-slate-400"
                  placeholder="Search by title or URL"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
              <Button
                className="bg-amber-400 text-slate-950 hover:bg-amber-300"
                onClick={() => {
                  setEditingBookmark(null)
                  setFormOpen(true)
                }}
              >
                <BookmarkPlus className="size-4" />
                Add bookmark
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardContent className="grid gap-4 p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Signed in as</p>
              <p className="text-base font-semibold text-foreground">{user?.email}</p>
            </div>
            <Separator />
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Tags className="size-4" />
                Filter by tag
              </div>
              <Select value={selectedTagId} onValueChange={setSelectedTagId}>
                <SelectTrigger aria-label="Filter bookmarks by tag">
                  <SelectValue placeholder="All tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tags</SelectItem>
                  {tags.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[1.25rem] border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Bookmarks</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">{bookmarks.length}</p>
              </div>
              <div className="rounded-[1.25rem] border border-border bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Tags</p>
                <p className="mt-2 text-3xl font-semibold text-foreground">{tags.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {selectedTag ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Active filter:</span>
          <Badge>{selectedTag.name}</Badge>
        </div>
      ) : null}

      {status === 'loading' ? (
        <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-border bg-card/70">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Spinner />
            Loading bookmarks
          </div>
        </div>
      ) : null}

      {status === 'error' ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load your dashboard</AlertTitle>
          <AlertDescription className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setReloadKey((current) => current + 1)}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {status === 'ready' && !visibleBookmarks.length ? (
        <Card className="border-dashed border-border/80 bg-card/60">
          <CardContent className="grid min-h-[220px] place-items-center gap-3 p-8 text-center">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                {bookmarks.length
                  ? 'No bookmarks match this search.'
                  : 'Your bookmark vault is empty.'}
              </h2>
              <p className="max-w-lg text-sm leading-7 text-muted-foreground">
                {bookmarks.length
                  ? 'Adjust the search term or clear the tag filter to see more results.'
                  : 'Start by adding your first bookmark and assign tags you can reuse later.'}
              </p>
            </div>
            {!bookmarks.length ? (
              <Button
                onClick={() => {
                  setEditingBookmark(null)
                  setFormOpen(true)
                }}
              >
                <BookmarkPlus className="size-4" />
                Add your first bookmark
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {status === 'ready' && visibleBookmarks.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onDelete={(nextBookmark) => {
                setBookmarkToDelete(nextBookmark)
                setDeleteOpen(true)
              }}
              onEdit={(nextBookmark) => {
                setEditingBookmark(nextBookmark)
                setFormOpen(true)
              }}
            />
          ))}
        </section>
      ) : null}

      <BookmarkFormDialog
        availableTags={tags}
        bookmark={editingBookmark}
        key={editingBookmark?.id ?? (formOpen ? 'new-open' : 'new-closed')}
        open={formOpen}
        pending={pendingAction === 'save'}
        onOpenChange={(open) => {
          setFormOpen(open)

          if (!open) {
            setEditingBookmark(null)
          }
        }}
        onSubmit={handleSave}
      />

      <DeleteBookmarkDialog
        bookmark={bookmarkToDelete}
        open={deleteOpen}
        pending={pendingAction === 'delete'}
        onConfirm={handleDelete}
        onOpenChange={(open) => {
          setDeleteOpen(open)

          if (!open) {
            setBookmarkToDelete(null)
          }
        }}
      />
    </AppShell>
  )
}
