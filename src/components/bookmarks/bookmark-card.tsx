import { ExternalLink, PencilLine, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatRelativeDate } from '@/lib/utils'
import type { Bookmark } from '@/types/models'

export function BookmarkCard({
  bookmark,
  onEdit,
  onDelete,
}: {
  bookmark: Bookmark
  onEdit: (bookmark: Bookmark) => void
  onDelete: (bookmark: Bookmark) => void
}) {
  return (
    <Card className="group border-border/70 bg-card/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-[0_28px_80px_-44px_rgba(15,23,42,0.7)]">
      <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <CardTitle className="text-lg leading-tight">{bookmark.title}</CardTitle>
          <a
            className="inline-flex items-center gap-2 text-sm text-primary transition hover:text-primary/80"
            href={bookmark.url}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink className="size-4" />
            <span className="break-all">{bookmark.url}</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" onClick={() => onEdit(bookmark)}>
            <PencilLine className="size-4" />
            <span className="sr-only">Edit bookmark</span>
          </Button>
          <Button size="icon" variant="outline" onClick={() => onDelete(bookmark)}>
            <Trash2 className="size-4" />
            <span className="sr-only">Delete bookmark</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-7 text-muted-foreground">
          {bookmark.description || 'No description added yet.'}
        </p>
        {bookmark.tags.length ? (
          <div className="flex flex-wrap gap-2">
            {bookmark.tags.map((tag) => (
              <Badge key={tag.id} variant="accent">
                {tag.name}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
      <Separator />
      <CardFooter className="justify-between pt-4 text-xs text-muted-foreground">
        <span>Updated {formatRelativeDate(bookmark.updatedAt)}</span>
        <span>{bookmark.tags.length} tag(s)</span>
      </CardFooter>
    </Card>
  )
}
