## Authentication

```ts
supabase.auth.signInWithPassword({
  email,
  password,
})
```

```ts
supabase.auth.signUp({
  email,
  password,
})
```

## Bookmark Query

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

## Bookmark Insert

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

## Tag Query

```ts
supabase
  .from("tags")
  .select("id, name")
  .eq("user_id", user.id)
  .order("name", { ascending: true })
```

## Bookmark Delete

```ts
supabase
  .from("bookmarks")
  .delete()
  .eq("id", bookmarkId)
```
