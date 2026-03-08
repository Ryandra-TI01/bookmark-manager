# UI Pages

## 1. Login Page

Komponen utama:

- email input
- password input
- login button
- link ke register page
- auth error feedback
- theme toggle

State penting:

- submit loading
- invalid credential state

## 2. Register Page

Komponen utama:

- email input
- password input
- register button
- link ke login page
- success notice bila perlu verifikasi email
- theme toggle

State penting:

- submit loading
- validation error
- waiting email confirmation state

## 3. Dashboard Page

Komponen utama:

- hero/header dashboard
- search input
- add bookmark button
- theme toggle
- logout button
- tag filter select
- bookmark statistics
- bookmark list grid

State penting:

- dashboard loading
- empty state saat belum ada bookmark
- empty state saat hasil search/filter kosong
- error state dengan retry action

## 4. Bookmark Form Dialog

Digunakan untuk add dan edit bookmark.

Field:

- title
- URL
- description
- tags

Interaksi:

- inline add tag
- pilih tag yang sudah ada
- remove tag terpilih
- save
- cancel

## 5. Delete Confirmation Dialog

Digunakan sebelum bookmark dihapus permanen.

Komponen:

- title
- description
- cancel button
- confirm delete button

## 6. Bookmark Card

Konten utama:

- title
- URL
- description
- tag badges
- updated timestamp
- edit button
- delete button
