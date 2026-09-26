-- SÀNA STYLE registration setup
-- Run this in Supabase SQL Editor AFTER creating the registrations table and payment-receipts bucket.
-- This version also enforces the 19 October 2026 registration deadline at the database level.

-- Recreate the public insert policy so submissions stop after the deadline.
drop policy if exists "Allow public registration" on public.registrations;
create policy "Allow public registration"
on public.registrations
for insert
to anon
with check (
  now() < timestamptz '2026-10-20 00:00:00+01'
  and length(trim(full_name)) >= 2
  and length(trim(whatsapp)) >= 10
  and payment_status = 'receipt_submitted'
);

-- Allow the website to upload receipt files to the PRIVATE bucket.
-- Students can upload but cannot list or download receipts through the public website.
drop policy if exists "Allow public receipt uploads" on storage.objects;
create policy "Allow public receipt uploads"
on storage.objects
for insert
to anon
with check (bucket_id = 'payment-receipts');

-- Allow the website to remove an orphaned receipt if the registration row fails.
drop policy if exists "Allow public receipt cleanup" on storage.objects;
create policy "Allow public receipt cleanup"
on storage.objects
for delete
to anon
using (bucket_id = 'payment-receipts');
