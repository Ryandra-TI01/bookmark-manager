# Product Requirement

## Nama Proyek

Bookmark Manager

## Objective

Aplikasi web untuk menyimpan, mengelola, dan menemukan kembali bookmark pribadi secara cepat dengan akses berbasis akun.

## Scope MVP

### Authentication

- user register
- user login
- user logout
- protected access ke dashboard

### Bookmark Management

- tambah bookmark
- edit bookmark
- hapus bookmark
- lihat daftar bookmark milik user

### Bookmark Organization

- assign tag ke bookmark
- create tag inline saat membuat atau mengedit bookmark
- edit tag yang sudah ada
- hapus tag yang sudah tidak dipakai
- filter bookmark berdasarkan tag

### Search

- search berdasarkan title
- search berdasarkan URL
- search dilakukan cepat di sisi client setelah data user dimuat

### UX Baseline

- loading state
- empty state
- error state
- toast feedback
- light mode dan dark mode

## Tech Stack

### Frontend

- React
- React Router
- Tailwind CSS
- komponen bergaya `shadcn/ui`

### Backend

- Supabase

### Database

- PostgreSQL

### Hosting

- Vercel
