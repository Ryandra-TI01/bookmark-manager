import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { DashboardPage } from '@/pages/dashboard-page'
import { bookmarkService } from '@/services/bookmarks'
import { renderWithProviders } from '@/test/test-utils'
import type { Bookmark, BookmarkFormValues, Tag } from '@/types/models'

vi.mock('@/services/bookmarks', () => ({
  bookmarkService: {
    listBookmarks: vi.fn(),
    listTags: vi.fn(),
    createBookmark: vi.fn(),
    updateBookmark: vi.fn(),
    deleteBookmark: vi.fn(),
  },
}))

const mockedBookmarkService = vi.mocked(bookmarkService)

const baseTags: Tag[] = [
  { id: 'tag-docs', name: 'Docs' },
  { id: 'tag-dev', name: 'Dev' },
]

const baseBookmarks: Bookmark[] = [
  {
    id: 'bookmark-1',
    title: 'React Docs',
    url: 'https://react.dev',
    description: 'Reference',
    createdAt: '2026-03-08T00:00:00.000Z',
    updatedAt: '2026-03-08T00:00:00.000Z',
    tags: [baseTags[0]],
  },
  {
    id: 'bookmark-2',
    title: 'TypeScript Handbook',
    url: 'https://typescriptlang.org',
    description: 'Guide',
    createdAt: '2026-03-08T00:00:00.000Z',
    updatedAt: '2026-03-07T00:00:00.000Z',
    tags: [baseTags[1]],
  },
]

describe('DashboardPage', () => {
  beforeEach(() => {
    mockedBookmarkService.listBookmarks.mockResolvedValue(baseBookmarks)
    mockedBookmarkService.listTags.mockResolvedValue(baseTags)
    mockedBookmarkService.createBookmark.mockReset()
    mockedBookmarkService.updateBookmark.mockReset()
    mockedBookmarkService.deleteBookmark.mockReset()
  })

  it('filters bookmarks by search query', async () => {
    const user = userEvent.setup()
    renderWithProviders(<DashboardPage />)

    expect(await screen.findByText('React Docs')).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText(/search by title or url/i), 'typescript')

    expect(screen.getByText('TypeScript Handbook')).toBeInTheDocument()
    expect(screen.queryByText('React Docs')).not.toBeInTheDocument()
  })

  it('creates a bookmark with inline tags', async () => {
    const user = userEvent.setup()
    mockedBookmarkService.createBookmark.mockImplementation(
      async (values: BookmarkFormValues) =>
        ({
          id: 'bookmark-3',
          title: values.title,
          url: values.url,
          description: values.description,
          createdAt: '2026-03-08T02:00:00.000Z',
          updatedAt: '2026-03-08T02:00:00.000Z',
          tags: values.tagNames.map((name, index) => ({ id: `tag-${index}`, name })),
        }) satisfies Bookmark,
    )

    renderWithProviders(<DashboardPage />)
    await screen.findByText('React Docs')

    await user.click(screen.getByRole('button', { name: /add bookmark/i }))
    await user.type(screen.getByLabelText(/title/i), 'Vite Guide')
    await user.type(screen.getByLabelText(/^url$/i), 'https://vite.dev')
    await user.type(screen.getByLabelText(/description/i), 'Build tooling')
    await user.type(screen.getByLabelText(/tags/i), 'Frontend')
    await user.keyboard('{Enter}')
    await user.click(screen.getByRole('button', { name: /save bookmark/i }))

    await waitFor(() => {
      expect(mockedBookmarkService.createBookmark).toHaveBeenCalledWith({
        title: 'Vite Guide',
        url: 'https://vite.dev',
        description: 'Build tooling',
        tagNames: ['Frontend'],
      })
    })

    expect(
      await screen.findByRole('heading', { name: 'Vite Guide' }),
    ).toBeInTheDocument()
  })

  it('deletes a bookmark after confirmation', async () => {
    const user = userEvent.setup()
    mockedBookmarkService.deleteBookmark.mockResolvedValue(undefined)

    renderWithProviders(<DashboardPage />)
    await screen.findByText('React Docs')

    await user.click(screen.getAllByRole('button', { name: /delete bookmark/i })[0])
    await user.click(screen.getByRole('button', { name: /^delete bookmark$/i }))

    await waitFor(() => {
      expect(mockedBookmarkService.deleteBookmark).toHaveBeenCalledWith('bookmark-1')
    })

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: 'React Docs' }),
      ).not.toBeInTheDocument()
    })
  })
})
