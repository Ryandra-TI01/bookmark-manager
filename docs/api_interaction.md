# API Interaction

Dokumen ini merangkum pola interaksi frontend dengan Supabase pada implementasi saat ini.

## 1. Authentication

### Login

```ts
supabase.auth.signInWithPassword({
  email,
  password,
})
```

### Register

```ts
supabase.auth.signUp({
  email,
  password,
})
```

### Logout

```ts
supabase.auth.signOut()
```

## 2. Dashboard Initial Load

Saat user sudah login, frontend memuat bookmark dan tag secara paralel.

### Fetch bookmarks

```ts
supabase
  .from("bookmarks")
  .select(`
    id,
    title,
    url,
    description,
    created_at,
    updated_at,
    bookmark_tags (
      tag:tags (
        id,
        name
      )
    )
  `)
  .order("updated_at", { ascending: false })
```

### Fetch tags

```ts
supabase
  .from("tags")
  .select("id, name")
  .eq("user_id", user.id)
  .order("name", { ascending: true })
```

## 3. Create Bookmark

Langkah umum:

1. insert row ke `bookmarks`
2. pastikan tag yang dibutuhkan tersedia di tabel `tags`
3. insert relasi ke `bookmark_tags`

### Insert bookmark

```ts
supabase
  .from("bookmarks")
  .insert({
    title,
    url,
    description,
    user_id,
  })
```

## 4. Update Bookmark

Langkah umum:

1. update row di `bookmarks`
2. sinkronkan tag terpilih
3. hapus relasi lama di `bookmark_tags`
4. insert relasi baru yang aktif

## 5. Update Tag

Langkah umum:

1. validasi nama tag baru
2. cek duplikasi nama tag per user
3. update row di tabel `tags`
4. sinkronkan nama tag di state client

## 6. Delete Tag

Langkah umum:

1. hapus row di tabel `tags`
2. relasi di `bookmark_tags` ikut terhapus lewat foreign key cascade
3. state bookmark di client ikut dibersihkan dari tag tersebut

## 7. Delete Bookmark

```ts
supabase
  .from("bookmarks")
  .delete()
  .eq("id", bookmarkId)
```

## 8. Search dan Filter

- search title dan URL dilakukan di client setelah data dimuat
- filter tag juga dilakukan di client menggunakan data bookmark yang sudah tersedia
- query ulang ke server dipakai untuk fetch awal atau retry load
