# Bookmark Manager

Bookmark Manager adalah aplikasi web untuk menyimpan, mencari, dan mengelola bookmark pribadi berbasis akun. Aplikasi ini memakai React di frontend dan Supabase untuk autentikasi serta database.

## Fitur

- autentikasi email/password
- protected route untuk dashboard
- tambah, ubah, dan hapus bookmark
- tag ter-normalisasi dengan inline tag creation
- pencarian instan berdasarkan title atau URL
- filter bookmark berdasarkan tag
- light mode dan dark mode
- loading state, empty state, error state, dan toast feedback

## Stack

- React 19
- React Router
- Tailwind CSS + komponen bergaya `shadcn/ui`
- Supabase Auth + PostgreSQL
- Vitest + Testing Library

## Struktur Halaman

- `/login`
- `/register`
- `/dashboard`

Detail halaman dan interaksi UI tersedia di [docs/ui_pages.md](/docs/ui_pages.md).

## Setup Lokal

1. Install dependency:
   `npm install`
2. Siapkan environment file berdasarkan [`.env.example`](/.env.example)
3. Isi variabel berikut:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Jalankan SQL schema dari [supabase/schema.sql](/supabase/schema.sql) di project Supabase
5. Pastikan provider email/password aktif di Supabase Auth
6. Jalankan app:
   `npm run dev`

## Scripts

- `npm run dev`: jalankan development server
- `npm run build`: build production
- `npm run lint`: cek linting
- `npm test`: jalankan test
- `npm run test:watch`: jalankan test mode watch

## Dokumentasi

Dokumentasi proyek dirangkum di [docs/README.md](/docs/README.md).
