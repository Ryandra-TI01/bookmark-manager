# Bookmark Manager

Production-ready MVP for private bookmark management with React, shadcn-style UI components, and Supabase.

## Features

- email/password authentication
- protected dashboard
- create, edit, delete bookmarks
- normalized tag system with inline tag creation
- instant client-side search by title or URL
- tag filtering
- loading, empty, and error states

## Stack

- React 19
- React Router
- Tailwind CSS + shadcn-style component structure
- Supabase Auth + Postgres
- Vitest + Testing Library

## Setup

1. Install dependencies:
   `npm install`
2. Copy environment values from `.env.example` and set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Apply the SQL in [supabase/schema.sql](/home/ryand/bookmark-manager/supabase/schema.sql) to your Supabase project.
4. Start the app:
   `npm run dev`

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm test`

Docs are available in [docs/README.md](/home/ryand/bookmark-manager/docs/README.md).
