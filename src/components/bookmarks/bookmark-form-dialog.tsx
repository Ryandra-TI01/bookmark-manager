import { useState } from 'react'
import { Plus, X } from 'lucide-react'

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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { isValidHttpUrl, normalizeTagName, dedupeTagNames } from '@/lib/utils'
import type { Bookmark, BookmarkFormValues, Tag } from '@/types/models'

interface BookmarkFormDialogProps {
  open: boolean
  pending: boolean
  bookmark?: Bookmark | null
  availableTags: Tag[]
  onOpenChange: (open: boolean) => void
  onSubmit: (values: BookmarkFormValues) => Promise<void>
}

interface FormErrors {
  title?: string
  url?: string
  tags?: string
}

const emptyValues: BookmarkFormValues = {
  title: '',
  url: '',
  description: '',
  tagNames: [],
}

function getInitialValues(bookmark?: Bookmark | null): BookmarkFormValues {
  if (!bookmark) {
    return emptyValues
  }

  return {
    title: bookmark.title,
    url: bookmark.url,
    description: bookmark.description,
    tagNames: bookmark.tags.map((tag) => tag.name),
  }
}

export function BookmarkFormDialog({
  open,
  pending,
  bookmark,
  availableTags,
  onOpenChange,
  onSubmit,
}: BookmarkFormDialogProps) {
  const [values, setValues] = useState<BookmarkFormValues>(() => getInitialValues(bookmark))
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  const addTag = (value: string) => {
    const normalized = normalizeTagName(value)

    if (!normalized) {
      return
    }

    if (values.tagNames.some((tagName) => tagName.toLocaleLowerCase() === normalized.toLocaleLowerCase())) {
      setErrors((current) => ({
        ...current,
        tags: 'Duplicate tags are not allowed.',
      }))
      return
    }

    const canonical = availableTags.find(
      (tag) => tag.name.toLocaleLowerCase() === normalized.toLocaleLowerCase(),
    )

    setValues((current) => ({
      ...current,
      tagNames: [...current.tagNames, canonical?.name ?? normalized],
    }))
    setTagInput('')
    setErrors((current) => ({ ...current, tags: undefined }))
  }

  const removeTag = (tagName: string) => {
    setValues((current) => ({
      ...current,
      tagNames: current.tagNames.filter((value) => value !== tagName),
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors: FormErrors = {}

    if (!values.title.trim()) {
      nextErrors.title = 'Title is required.'
    }

    if (!values.url.trim()) {
      nextErrors.url = 'URL is required.'
    } else if (!isValidHttpUrl(values.url.trim())) {
      nextErrors.url = 'Use a valid http or https URL.'
    }

    const nextTagNames = dedupeTagNames(values.tagNames)

    if (nextTagNames.length !== values.tagNames.length) {
      nextErrors.tags = 'Duplicate tags are not allowed.'
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    setErrors({})

    await onSubmit({
      title: values.title.trim(),
      url: values.url.trim(),
      description: values.description.trim(),
      tagNames: nextTagNames,
    })
  }

  const availableSuggestions = availableTags.filter(
    (tag) =>
      !values.tagNames.some(
        (selected) => selected.toLocaleLowerCase() === tag.name.toLocaleLowerCase(),
      ),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bookmark ? 'Edit bookmark' : 'Add bookmark'}</DialogTitle>
          <DialogDescription>
            Save title, URL, description, and tags in one place.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="bookmark-title">Title</Label>
            <Input
              id="bookmark-title"
              placeholder="Design systems handbook"
              value={values.title}
              onChange={(event) =>
                setValues((current) => ({ ...current, title: event.target.value }))
              }
            />
            {errors.title ? <p className="text-sm text-destructive">{errors.title}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bookmark-url">URL</Label>
            <Input
              id="bookmark-url"
              placeholder="https://example.com"
              type="url"
              value={values.url}
              onChange={(event) =>
                setValues((current) => ({ ...current, url: event.target.value }))
              }
            />
            {errors.url ? <p className="text-sm text-destructive">{errors.url}</p> : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bookmark-description">Description</Label>
            <Textarea
              id="bookmark-description"
              placeholder="Why this link matters and what you want to find later."
              value={values.description}
              onChange={(event) =>
                setValues((current) => ({ ...current, description: event.target.value }))
              }
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="bookmark-tags">Tags</Label>
            <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-muted/30 p-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="bookmark-tags"
                  placeholder="Add a tag and press enter"
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      addTag(tagInput)
                    }
                  }}
                />
                <Button
                  className="sm:w-auto"
                  type="button"
                  variant="secondary"
                  onClick={() => addTag(tagInput)}
                >
                  <Plus className="size-4" />
                  Add tag
                </Button>
              </div>

              {values.tagNames.length ? (
                <div className="flex flex-wrap gap-2">
                  {values.tagNames.map((tagName) => (
                    <Badge
                      key={tagName}
                      className="gap-1 rounded-full bg-card px-3 py-1 text-sm"
                      variant="outline"
                    >
                      {tagName}
                      <button
                        className="rounded-full text-muted-foreground transition hover:text-foreground"
                        type="button"
                        onClick={() => removeTag(tagName)}
                      >
                        <X className="size-3.5" />
                        <span className="sr-only">Remove {tagName}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No tags selected yet.</p>
              )}

              {availableSuggestions.length ? (
                <div className="flex flex-wrap gap-2">
                  {availableSuggestions.map((tag) => (
                    <Button
                      key={tag.id}
                      size="sm"
                      type="button"
                      variant="outline"
                      onClick={() => addTag(tag.name)}
                    >
                      {tag.name}
                    </Button>
                  ))}
                </div>
              ) : null}
            </div>
            {errors.tags ? <p className="text-sm text-destructive">{errors.tags}</p> : null}
          </div>

          <DialogFooter>
            <Button disabled={pending} type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button disabled={pending} type="submit">
              {bookmark ? 'Save changes' : 'Save bookmark'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
