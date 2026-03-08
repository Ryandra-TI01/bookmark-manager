import { useState } from 'react'
import { Check, PencilLine, Tags, Trash2, X } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { normalizeTagName } from '@/lib/utils'
import type { Tag } from '@/types/models'

interface TagManagerDialogProps {
  open: boolean
  pending: boolean
  tags: Tag[]
  onOpenChange: (open: boolean) => void
  onRename: (tagId: string, name: string) => Promise<void>
  onDelete: (tag: Tag) => Promise<void>
}

export function TagManagerDialog({
  open,
  pending,
  tags,
  onOpenChange,
  onRename,
  onDelete,
}: TagManagerDialogProps) {
  const [editingTagId, setEditingTagId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null)

  const startEditing = (tag: Tag) => {
    setEditingTagId(tag.id)
    setDraftName(tag.name)
    setError(null)
  }

  const stopEditing = () => {
    setEditingTagId(null)
    setDraftName('')
    setError(null)
  }

  const submitRename = async () => {
    if (!editingTagId) {
      return
    }

    const nextName = normalizeTagName(draftName)

    if (!nextName) {
      setError('Tag name is required.')
      return
    }

    const hasDuplicate = tags.some(
      (tag) =>
        tag.id !== editingTagId &&
        tag.name.toLocaleLowerCase() === nextName.toLocaleLowerCase(),
    )

    if (hasDuplicate) {
      setError(`Tag "${nextName}" already exists.`)
      return
    }

    await onRename(editingTagId, nextName)
    stopEditing()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="gap-0 p-0">
          <DialogHeader className="border-b border-border/70 px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
            <DialogTitle className="flex items-center gap-2">
              <Tags className="size-5" />
              Manage tags
            </DialogTitle>
            <DialogDescription className="max-w-[46ch] leading-6">
              Rename or delete existing tags. Deleting a tag also removes it from linked
              bookmarks.
            </DialogDescription>
          </DialogHeader>

          <div className="grid max-h-[calc(100dvh-13rem)] gap-0 overflow-y-auto px-4 py-4 sm:max-h-[calc(100dvh-15rem)] sm:px-6 sm:py-5">
            {!tags.length ? (
              <div className="grid min-h-40 place-items-center rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center">
                <div className="space-y-2">
                  <p className="font-medium text-foreground">No tags available yet.</p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Create tags from the bookmark form first, then manage them here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-3">
                {tags.map((tag, index) => {
                  const isEditing = editingTagId === tag.id

                  return (
                    <div key={tag.id} className="grid gap-3">
                      {index > 0 ? <Separator /> : null}
                      <div className="flex flex-col gap-3 py-1 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex-1">
                          {isEditing ? (
                            <div className="grid gap-2">
                              <Input
                                autoFocus
                                value={draftName}
                                onChange={(event) => setDraftName(event.target.value)}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter') {
                                    event.preventDefault()
                                    void submitRename()
                                  }

                                  if (event.key === 'Escape') {
                                    event.preventDefault()
                                    stopEditing()
                                  }
                                }}
                              />
                              {error ? (
                                <p className="text-sm text-destructive">{error}</p>
                              ) : null}
                            </div>
                          ) : (
                            <div className="flex min-w-0 items-center gap-2">
                              <Badge className="max-w-full" variant="outline">
                                <span className="truncate">{tag.name}</span>
                              </Badge>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                          {isEditing ? (
                            <>
                              <Button
                                className="w-full sm:w-auto"
                                disabled={pending}
                                size="sm"
                                type="button"
                                variant="secondary"
                                onClick={() => void submitRename()}
                              >
                                <Check className="size-4" />
                                Save
                              </Button>
                              <Button
                                className="w-full sm:w-auto"
                                disabled={pending}
                                size="sm"
                                type="button"
                                variant="ghost"
                                onClick={stopEditing}
                              >
                                <X className="size-4" />
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                className="w-full sm:w-auto"
                                disabled={pending}
                                size="sm"
                                type="button"
                                variant="outline"
                                onClick={() => startEditing(tag)}
                              >
                                <PencilLine className="size-4" />
                                Edit
                              </Button>
                              <Button
                                className="w-full sm:w-auto"
                                disabled={pending}
                                size="sm"
                                type="button"
                                variant="outline"
                                onClick={() => setTagToDelete(tag)}
                              >
                                <Trash2 className="size-4" />
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-border/70 px-4 py-4 sm:px-6">
            <Button className="w-full sm:w-auto" type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(tagToDelete)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setTagToDelete(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete tag</AlertDialogTitle>
            <AlertDialogDescription>
              {tagToDelete
                ? `Delete "${tagToDelete.name}" from your workspace? This also removes it from related bookmarks.`
                : 'Delete this tag from your workspace?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={pending}
              onClick={() => {
                if (!tagToDelete) {
                  return
                }

                void onDelete(tagToDelete).then(() => {
                  setTagToDelete(null)
                })
              }}
            >
              Delete tag
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
