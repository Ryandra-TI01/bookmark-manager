import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import {
  ThemeContext,
  type ResolvedTheme,
  type Theme,
} from '@/providers/theme-context'

const THEME_STORAGE_KEY = 'bookmark-manager-theme'

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'system'
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
      return storedTheme
    }

    return 'system'
  })
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(theme))

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (nextTheme: Theme) => {
      const nextResolvedTheme = resolveTheme(nextTheme)
      const root = document.documentElement

      root.classList.remove('light', 'dark')
      root.classList.add(nextResolvedTheme)
      root.style.colorScheme = nextResolvedTheme

      setResolvedTheme(nextResolvedTheme)
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    }

    applyTheme(theme)

    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        applyTheme('system')
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [resolvedTheme, theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
