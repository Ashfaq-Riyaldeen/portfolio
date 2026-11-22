# Restore live portfolio editing

The public site currently displays its bundled content because the database is
missing the project categories column. The Sections editor also needs its database
save function. Running the repair below resolves both issues and synchronizes the
current portfolio data, including the three revised highlights.

## Run this file

1. Sign into [your project's Supabase SQL Editor](https://supabase.com/dashboard/project/wojbmuunzyditwoulxbf/sql/new).
   Use your Supabase dashboard account. A portfolio `/admin` login is a separate account.
2. Open [repair-admin-20261122.sql](./repair-admin-20261122.sql) in your local editor.
   Select and copy the **entire file**.
3. Create a **New query** in Supabase, paste the SQL, and click **Run**. These are the
   [official SQL Editor steps](https://supabase.com/docs/guides/database/functions).
   If Supabase flags the targeted updates/deletes for review, inspect them before
   proceeding: they retire the named sample records and obsolete highlight cards.
4. The final result should show:

   | Field | Expected result |
   |---|---|
   | `site_title` | `Ashfaq Riyaldeen` |
   | `published_projects` | `20` (or more if you added other published projects) |
   | `highlights` | `20+` Projects & Research, `3.77/4.0` CGPA, `1+ years` Experience |
   | `section_saving_ready` | `true` |
   | `repair_applied` | `true` |

5. Reload [the admin panel](https://ashfaq-riyaldeen.vercel.app/admin). It should now
   report **Connected to live content** and show the current records. Allow up to
   60 seconds for existing public page caches to expire after this direct SQL change.
   Subsequent admin saves invalidate that cache immediately.
6. Verify one reversible edit, such as adding a full stop to the profile tagline.
   Save, reload the public page, then restore the original tagline and save again.
   In **Sections**, reorder two sections, save, and check the homepage and footer;
   restore the original order afterward. Check that your message inbox remains intact.

If a query fails, stop and keep the error text. The repair runs inside one
transaction, so a failure does not leave partially updated content. Do not run the
older content-refresh migration afterward; it can overwrite later admin edits.

## What the repair preserves

The script snapshots the affected content tables directly from the database before
changing content, including unpublished projects and posts. The snapshot is kept
in `portfolio_maintenance.repairs`; anonymous visitors and signed-in portfolio
users cannot read that schema. This is a content snapshot, not a full infrastructure
backup. It never copies passwords or auth users.

Accounts, messages, storage objects, unrelated drafts, and the existing accent
color are preserved. Existing project uploads remain attached to matching records.
The profile photo is deliberately set to the new photo already used on the public
site. Matching records keep their IDs, including drafts with a matching project slug.

A completion marker makes repeated repair runs skip content changes. Your later
admin edits will not be reset by accidentally running the file again.

## Recovery only

[rollback-admin-20261122.sql](./rollback-admin-20261122.sql) is **not** a setup step.
Run it only if you intentionally need to restore the content captured by this
repair. It keeps the compatible additive schema and refuses automatic recovery if
any affected content changed after the repair, protecting newer edits. The snapshot
remains available for manual recovery. The original repair does not automatically
reapply after a rollback.

## Developer checks

`npm run admin:prepare` regenerates the repair and recovery scripts from the current
curated content and existing section-save SQL. It does not connect to Supabase.
Once a repair has been applied, future data changes must use a new revision rather
than changing the applied repair's completion marker.

The SQL is tested against a local PGlite PostgreSQL engine, with no live writes:

```powershell
$env:PGLITE_MODULE = '.portfolio-preview/sql-check/node_modules/@electric-sql/pglite/dist/index.js'
node --experimental-strip-types tests/admin-repair.test.mjs
```

The engine and initial fixture are local test prerequisites, not application
dependencies. Set `PGLITE_MODULE` and `CONTENT_TEST_SNAPSHOT` to alternative local
paths if needed. Tests cover the old schema, an empty database, matching private
drafts, uploads, messages/accounts, backup permissions, atomic layout saves, repeat
runs after admin edits, injected failure, and rollback.
