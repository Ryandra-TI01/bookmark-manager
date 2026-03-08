# System Architecture

## High-Level Flow

User
 │
 ▼
React Application
 │
 ├ Browser Router
 ├ Theme Provider
 ├ Auth Provider
 ├ Toast Provider
 ├ Dashboard UI
 └ Bookmark + Tag Service Layer
 │
 ▼
Supabase Client SDK
 │
 ▼
Supabase Backend
 ├ Authentication
 ├ PostgreSQL Database
 │ ├ bookmarks
 │ ├ tags
 │ └ bookmark_tags
 └ Row Level Security

## Frontend Layers

### Routing

- `/login`
- `/register`
- `/dashboard`

### Providers

- `ThemeProvider` untuk light/dark/system mode
- `AuthProvider` untuk session state
- `ToastProvider` untuk feedback UI

### Service Layer

- auth service untuk login, register, logout, dan session restore
- bookmark service untuk list, create, update, delete bookmark
- tag resolution disinkronkan melalui bookmark service

## Data Flow

1. User login atau restore session
2. Dashboard memuat bookmark dan tag milik user
3. Search dan filter berjalan di client state
4. Mutasi bookmark tetap disimpan ke Supabase
5. RLS memastikan hanya data milik user yang dapat diakses

## Hosting

- frontend: Vite build output
- target deployment: Vercel
