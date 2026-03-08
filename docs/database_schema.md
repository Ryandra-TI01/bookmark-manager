# Database Schema

## Tables

### `bookmarks`

- `id`: `uuid` primary key
- `user_id`: `uuid` reference to `auth.users(id)`
- `title`: `text` not null
- `url`: `text` not null
- `description`: `text` nullable
- `created_at`: `timestamptz` default `now()`
- `updated_at`: `timestamptz` default `now()`

Relasi:

- dimiliki oleh satu user
- dapat memiliki banyak tag melalui `bookmark_tags`

### `tags`

- `id`: `uuid` primary key
- `user_id`: `uuid` reference to `auth.users(id)`
- `name`: `text` not null
- `created_at`: `timestamptz` default `now()`
- unique index on `(user_id, lower(name))`

Relasi:

- dimiliki oleh satu user
- dapat dipakai oleh banyak bookmark milik user yang sama

### `bookmark_tags`

- `bookmark_id`: `uuid` reference to `bookmarks(id)`
- `tag_id`: `uuid` reference to `tags(id)`
- composite primary key on `(bookmark_id, tag_id)`

Tujuan:

- tabel pivot untuk relasi many-to-many bookmark dan tag

## Security

- Row Level Security enabled for all three tables
- users can only read and write their own bookmarks
- users can only read and write their own tags
- users can only attach tags to bookmarks they own

SQL setup lives in [schema.sql](supabase/schema.sql).
