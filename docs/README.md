# Project Documentation

Folder `docs/` berisi ringkasan requirement, UI, arsitektur, dan interaksi data untuk Bookmark Manager.

## Daftar Dokumen

- [product_requirement.md](/docs/product_requirement.md)
  Ringkasan objective, scope MVP, dan fitur utama.
- [ui_pages.md](/docs/ui_pages.md)
  Struktur halaman, komponen penting, dan state UX yang perlu ditangani.
- [api_interaction.md](/docs/api_interaction.md)
  Pola interaksi Supabase untuk auth, bookmark, dan tag.
- [database_schema.md](/docs/database_schema.md)
  Struktur tabel, relasi, dan aturan keamanan data.
- [system_architecture.md](/docs/system_architecture.md)
  Gambaran arsitektur aplikasi dari UI sampai backend.
- [schema.sql](/supabase/schema.sql)
  SQL source of truth untuk tabel, index, trigger, dan RLS policy.

## Urutan Baca yang Disarankan

1. [product_requirement.md](/docs/product_requirement.md)
2. [ui_pages.md](/docs/ui_pages.md)
3. [system_architecture.md](/docs/system_architecture.md)
4. [database_schema.md](/docs/database_schema.md)
5. [api_interaction.md](/docs/api_interaction.md)

## Catatan

- Dokumen di folder ini sudah disinkronkan dengan implementasi repo saat ini.
- Jika schema database berubah, update [database_schema.md](/docs/database_schema.md) dan [schema.sql](/supabase/schema.sql) bersamaan.
