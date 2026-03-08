import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

export function normalizeTagName(value: string) {
  return value
    .trim()
    .replace(/\s+/g, ' ')
}

export function dedupeTagNames(values: string[]) {
  const seen = new Set<string>()
  const result: string[] = []

  for (const value of values) {
    const normalized = normalizeTagName(value)

    if (!normalized) {
      continue
    }

    const key = normalized.toLocaleLowerCase()

    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    result.push(normalized)
  }

  return result
}

export function isValidHttpUrl(value: string) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}

export function sortBookmarksByUpdatedAt<T extends { updatedAt: string }>(bookmarks: T[]) {
  return [...bookmarks].sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt),
  )
}
