# Supabase keep-alive

The workflow at `.github/workflows/supabase-keepalive.yml` makes one read-only
request to the `phonebook_records` REST endpoint every day. It uses the
publishable key and does not insert dummy records.

## One-time GitHub setup

1. Open the repository on GitHub.
2. Go to **Settings → Secrets and variables → Actions**.
3. Select **New repository secret**.
4. Set the name to `SUPABASE_PUBLISHABLE_KEY`.
5. Paste the Supabase publishable key as the value and save it.
6. Open **Actions → Supabase keep-alive → Run workflow** once to test it.

The workflow is scheduled for 09:15 Asia/Bangkok every day. GitHub may start a
scheduled job a little later because scheduled workflows use a shared queue.
