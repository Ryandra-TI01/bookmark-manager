import { screen } from '@testing-library/react'

import { AppRoutes } from '@/app/app-routes'
import { renderWithProviders } from '@/test/test-utils'

describe('AppRoutes', () => {
  it('redirects unauthenticated users from the dashboard to login', async () => {
    renderWithProviders(<AppRoutes />, {
      route: '/dashboard',
      auth: {
        status: 'unauthenticated',
        user: null,
      },
    })

    expect(await screen.findByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
  })

  it('redirects authenticated users away from login to the dashboard', async () => {
    renderWithProviders(<AppRoutes />, {
      route: '/login',
      auth: {
        status: 'authenticated',
      },
    })

    expect(
      await screen.findByRole('heading', { name: /bookmark command center/i }),
    ).toBeInTheDocument()
  })
})
