-- ==============================================================================
-- College 19 - Supabase Database Security (Row Level Security - RLS)
-- Run this once in your Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. Enable Row Level Security on the 'colleges' table
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;

-- 2. Remove old policies if present (prevents conflicts)
DROP POLICY IF EXISTS "Allow public read access on colleges" ON colleges;
DROP POLICY IF EXISTS "Disallow public write on colleges" ON colleges;

-- 3. Create Public Read Policy:
-- All visitors and students can read colleges, courses, rankings, and cutoffs.
-- But public CANNOT insert, update, or delete colleges directly.
CREATE POLICY "Allow public read access on colleges"
ON colleges FOR SELECT
USING (true);

-- 4. Enable Row Level Security on the 'leads' table
-- This completely prevents competitors or strangers from reading student phone numbers/leads.
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing public read policies on leads (if any)
DROP POLICY IF EXISTS "Allow public read on leads" ON leads;

-- Note: All mutations (Add/Edit/Delete College and Lead Submission) are handled
-- securely by our Next.js backend API using the Service Role Key (supabaseAdmin),
-- which bypasses RLS safely on the server side.
