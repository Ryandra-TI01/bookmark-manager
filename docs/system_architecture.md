# System Architecture

User
 │
 ▼
React Application
 │
 ├ Browser Router
 ├ Auth Provider
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

Hosting
- Vercel

## Notes

- frontend fetches the current user's bookmarks and tags after authentication
- search and tag filtering happen in client state for fast interaction
- bookmark and tag writes go through a small service layer instead of raw UI queries
