# Phonebook Supabase migrations

The feature migration in `migrations/202609150001_phonebook_features.sql` adds:

- soft delete with `deleted_at`;
- the `phonebook_change_log` audit table and trigger;
- Supabase Realtime publication for `phonebook_records`.

If the Supabase GitHub integration is configured to watch the `Phonebook`
directory, it can deploy the migration automatically. Otherwise, copy the SQL
file into Supabase Dashboard → SQL Editor and run it once.
