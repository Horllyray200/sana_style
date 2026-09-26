# SÀNA STYLE — 1-Week Intensive Registration Website

GitHub Pages-compatible registration website for SÀNA STYLE.

## Live registration flow

1. Student clicks **Secure my spot**.
2. Student sees the ₦30,000 OPay payment details.
3. Student enters full name, WhatsApp number and optional email.
4. Student uploads a PNG/JPG/WEBP/PDF payment receipt (max 10MB).
5. The receipt is uploaded to the **private** Supabase `payment-receipts` bucket.
6. The student registration is saved in the Supabase `registrations` table.
7. After successful submission, the student receives the WhatsApp group button.

## Free services used

- GitHub Pages — website hosting
- Supabase Free — registration database + private receipt storage
- WhatsApp — student group/contact

## Supabase setup

The website is configured with the SÀNA STYLE Supabase project URL and browser-safe anon/publishable key in `script.js`.

Before going live, make sure:

1. A `public.registrations` table exists with:
   - `id` UUID primary key/default `gen_random_uuid()`
   - `full_name` text
   - `whatsapp` text
   - `email` text
   - `receipt_path` text
   - `payment_status` text
   - `created_at` timestamptz default `now()`
2. A **private** Storage bucket named `payment-receipts` exists.
3. Run `SUPABASE_SETUP.sql` in Supabase SQL Editor. It adds the public upload/insert policies and enforces the 19 October 2026 deadline.

## Important security notes

- Never place a Supabase `service_role`/secret key in this website.
- The anon/public key is designed for browser use; database and storage permissions are controlled by Row Level Security policies.
- Payment receipts are stored in a private bucket. The public website does not create public download URLs.
- The website validates receipt file type and size in the browser. For stronger production hardening, additional server-side validation can be added later.

## Registration dates

Registration opens immediately and closes at **11:59 PM Nigeria time on 19 October 2026**. The frontend countdown and the database insert policy both enforce the deadline.
