import { dedupeTagNames } from '@/lib/utils'
import { getSupabaseClient } from '@/lib/supabase'
import type { Bookmark, BookmarkFormValues, Tag } from '@/types/models'

const BOOKMARK_SELECT = `
  id,
  title,
  url,
  description,
  created_at,
  updated_at,
  bookmark_tags (
    tag:tags (
      id,
      name
    )
  )
`

interface BookmarkRow {
  id: string
  title: string
  url: string
  description: string | null
  created_at: string
  updated_at: string
  bookmark_tags: Array<{
    tag: Tag | Tag[] | null
  }> | null
}

async function getCurrentUserId() {
  const { data, error } = await getSupabaseClient().auth.getUser()

  if (error) {
    throw error
  }

  if (!data.user) {
    throw new Error('User session was not found.')
  }

  return data.user.id
}

function mapBookmark(row: BookmarkRow): Bookmark {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    description: row.description ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    tags:
      row.bookmark_tags
        ?.flatMap((relation) => {
          if (Array.isArray(relation.tag)) {
            return relation.tag
          }

          return relation.tag ? [relation.tag] : []
        })
        .sort((left, right) => left.name.localeCompare(right.name)) ?? [],
  }
}

async function getBookmarkById(bookmarkId: string) {
  const { data, error } = await getSupabaseClient()
    .from('bookmarks')
    .select(BOOKMARK_SELECT)
    .eq('id', bookmarkId)
    .single()

  if (error) {
    throw error
  }

  return mapBookmark(data as unknown as BookmarkRow)
}

async function ensureTagIds(tagNames: string[], userId: string) {
  const nextTagNames = dedupeTagNames(tagNames)

  if (!nextTagNames.length) {
    return []
  }

  const client = getSupabaseClient()
  const { data: existingTags, error: tagsError } = await client
    .from('tags')
    .select('id, name')
    .eq('user_id', userId)
    .order('name', { ascending: true })

  if (tagsError) {
    throw tagsError
  }

  const tagMap = new Map(
    (existingTags ?? []).map((tag) => [tag.name.toLocaleLowerCase(), tag]),
  )
  const missingTagNames = nextTagNames.filter(
    (tagName) => !tagMap.has(tagName.toLocaleLowerCase()),
  )

  if (missingTagNames.length) {
    const { data: insertedTags, error: insertError } = await client
      .from('tags')
      .insert(
        missingTagNames.map((name) => ({
          user_id: userId,
          name,
        })),
      )
      .select('id, name')

    if (insertError) {
      throw insertError
    }

    for (const tag of insertedTags ?? []) {
      tagMap.set(tag.name.toLocaleLowerCase(), tag)
    }
  }

  return nextTagNames.map((tagName) => {
    const match = tagMap.get(tagName.toLocaleLowerCase())

    if (!match) {
      throw new Error(`Unable to resolve tag "${tagName}".`)
    }

    return match.id
  })
}

async function syncBookmarkTags(bookmarkId: string, tagIds: string[]) {
  const client = getSupabaseClient()
  const { error: deleteError } = await client
    .from('bookmark_tags')
    .delete()
    .eq('bookmark_id', bookmarkId)

  if (deleteError) {
    throw deleteError
  }

  if (!tagIds.length) {
    return
  }

  const { error: insertError } = await client
    .from('bookmark_tags')
    .insert(tagIds.map((tagId) => ({ bookmark_id: bookmarkId, tag_id: tagId })))

  if (insertError) {
    throw insertError
  }
}

export const bookmarkService = {
  async listBookmarks() {
    const { data, error } = await getSupabaseClient()
      .from('bookmarks')
      .select(BOOKMARK_SELECT)
      .order('updated_at', { ascending: false })

    if (error) {
      throw error
    }

    return ((data ?? []) as unknown as BookmarkRow[]).map(mapBookmark)
  },
  async listTags() {
    const userId = await getCurrentUserId()
    const { data, error } = await getSupabaseClient()
      .from('tags')
      .select('id, name')
      .eq('user_id', userId)
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    return (data ?? []) as Tag[]
  },
  async createBookmark(values: BookmarkFormValues) {
    const userId = await getCurrentUserId()
    const timestamp = new Date().toISOString()
    const { data, error } = await getSupabaseClient()
      .from('bookmarks')
      .insert({
        user_id: userId,
        title: values.title.trim(),
        url: values.url.trim(),
        description: values.description.trim() || null,
        updated_at: timestamp,
      })
      .select('id')
      .single()

    if (error) {
      throw error
    }

    const tagIds = await ensureTagIds(values.tagNames, userId)
    await syncBookmarkTags(data.id, tagIds)
    return getBookmarkById(data.id)
  },
  async updateBookmark(bookmarkId: string, values: BookmarkFormValues) {
    const userId = await getCurrentUserId()
    const { error } = await getSupabaseClient()
      .from('bookmarks')
      .update({
        title: values.title.trim(),
        url: values.url.trim(),
        description: values.description.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookmarkId)

    if (error) {
      throw error
    }

    const tagIds = await ensureTagIds(values.tagNames, userId)
    await syncBookmarkTags(bookmarkId, tagIds)
    return getBookmarkById(bookmarkId)
  },
  async deleteBookmark(bookmarkId: string) {
    const { error } = await getSupabaseClient()
      .from('bookmarks')
      .delete()
      .eq('id', bookmarkId)

    if (error) {
      throw error
    }
  },
}
