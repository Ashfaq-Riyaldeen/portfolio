# Owner's Guide — Running Your Portfolio

Everything you need to manage your site, in one page. No coding required.

## The one big idea

Your site's content lives in a **database**, not in the code. You edit it in the
**admin panel**, and every save appears on the live site instantly — no rebuild,
no redeploy, no waiting.

- **Live site:** your Vercel URL (or `http://localhost:3000` when running locally)
- **Admin panel:** add `/admin` to the site URL
- Sign in with the email + password you created in Supabase.

## Daily tasks

### Add or edit a project
1. Admin → **Projects** → *Add project* (or the pencil icon on an existing one).
2. Fill the form. Two fields matter most:
   - **Slug** — the project's web address (`/projects/my-app`): lowercase,
     hyphens, must be unique.
   - **Published** — keep it OFF while drafting; visitors only see published
     projects. Featured projects get the large card.
3. Drag images into **Cover image** / **Gallery** — they upload and compress
   automatically.

### Write a blog post
Admin → **Blog** → *Add post*. Either write the post in the **Content** box
(HTML — wrap paragraphs in `<p>…</p>`) or leave it empty and paste a Medium /
Dev.to link in **External URL**. Keep **Published** off until it's ready.

### Update your profile / photo / resume
Admin → **Profile**. Drop your photo into *Profile photo* and your CV PDF into
*Resume* — the site's résumé button activates automatically once a PDF exists.

### Read your messages
Admin → **Messages**. Contact-form submissions land here. Click one to read it;
use **Reply by email** to answer from your own mail app.

### Show, hide, or reorder sections
Admin → **Sections**. Toggle any of the 20 sections on/off and drag to reorder,
then press *Save changes*. Hidden sections disappear from the site and the menu.

### Change the browser title / search description / share image
Admin → **Settings**. These feed Google results and social-media link previews.

## Field cheat-sheet

| You see | It means |
|---|---|
| A toggle switch | On = yes/visible. Off = no/hidden. |
| "Comma-separated" hint | Type items with commas: `React, Python, Docker` |
| "One per line" hint | Press Enter between items |
| Month picker left empty | Shows as **"Present"** on the site |
| *draft* chip in a list | Not visible to visitors — open it and switch **Published** on |

## When you change the CODE (not content)

Content changes are instant. Code/design changes deploy by pushing to GitHub:

```bash
git add -A
git commit -m "describe the change"
git push
```

Vercel rebuilds and ships it automatically in ~2 minutes.

## If something looks wrong

| Problem | Fix |
|---|---|
| Forgot the admin password | Supabase dashboard → Authentication → Users → your user → *Send password recovery* (or set a new password there directly). |
| Site shows old placeholder text | The database wasn't reachable when the page was built — check the four env vars on Vercel, then redeploy. |
| Contact form says "wait a minute" | Anti-spam cooldown: one message per visitor per minute. Normal. |
| Upload fails | Files must be reasonable (<50 MB); check you're still signed in to `/admin`. |
| Locked out / something broke badly | The site itself keeps working — it never depends on the admin panel being healthy. Ask Claude Code to investigate. |

## Your accounts (all free tier)

| Service | Does | Dashboard |
|---|---|---|
| **Supabase** | Database, login, file storage | supabase.com/dashboard |
| **Vercel** | Hosts the website | vercel.com/dashboard |
| **GitHub** | Stores the code | github.com/Ashfaq-Riyaldeen |
| **Resend** *(optional)* | Emails you when someone sends a message | resend.com |
