# Supabase setup

## 1. Create the database

In the Supabase dashboard, open **SQL Editor** and run these files in order:

1. `schema.sql`
2. `seed.sql`

The schema creates the content tables, admin-role profile, RLS rules, and the public `content-images` Storage bucket. The seed file inserts the starter parts and articles without duplicating existing names/titles.

## 2. Create the admin account

Create the account in **Authentication > Users** with email and password. Confirm the email if email confirmation is enabled. New accounts start with the `user` role.

Run this in **SQL Editor**, replacing the placeholder with the admin email:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id
  from auth.users
  where email = 'YOUR_ADMIN_EMAIL'
);
```

The app checks this profile role after password sign-in. Do not put a password or service-role/secret key in SQL files or frontend code.

## 3. Configure Vercel

In the Vercel project, open **Settings > Environment Variables** and add these variables for Production (and Preview if needed):

- `SUPABASE_URL`: the project base URL, such as `https://project-ref.supabase.co`. Do not add `/rest/v1`.
- `SUPABASE_ANON_KEY`: the `sb_publishable_...` key.

Redeploy after saving the environment variables. The publishable key is designed for frontend use; the database RLS policies are the security boundary. Never use a secret or service-role key in Vercel frontend variables.

## 4. Configure Auth redirects

In Supabase, open **Authentication > URL Configuration**. Set the Site URL to the Vercel site's origin and add these redirect URLs:

- `https://YOUR-VERCEL-DOMAIN/admin.html`
- `http://localhost:5173/admin.html`

Password recovery redirects to `/admin.html`, so include that route in the allow list.

## Local development

The local `.env` file is gitignored. Use these variable names there, then restart Vite after changing them:

```dotenv
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=sb_publishable_replace_me
```
