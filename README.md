# Hectoro Fuel Gauge

A premium Next.js App Router fuel journal for an MG Hector Plus 2020 petrol. Visual system: cream **#FFFDF2**, black **#000000**, Aurora Silver, editorial serif display typography, restrained motion, responsive interactive charts.

## Features
- Dashboard KPIs: total litres, expenditure, weighted average ₹/L, fill count, odometer span, usable mileage intervals
- Interactive monthly spend/litres chart, pump-price history, odometer progress, and indicative short-interval km/L analysis
- Fuel journal search/sort, manual entry, CSV import preview, CSV/JSON export
- Long odometer intervals shown as unverified intervals in the recorded data, not proof refills were missed; mileage is not calculated across long intervals
- Supabase Auth + Row Level Security (RLS), so a public Netlify website does not make fuel records public

## Local development
1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and add your Supabase project URL and anon/publishable key.
4. Run `supabase/schema.sql` in the Supabase SQL Editor.
5. In Supabase Authentication, create your owner email/password user.
6. Run `npm run dev` and open http://localhost:3000.

## Netlify
Import this GitHub repository into Netlify. Build command: `npm run build`. Netlify Next.js plugin configuration is in `netlify.toml`. Add environment variables from `.env.example` in Netlify site settings; never commit secrets.

## Security
- Never turn off RLS or expose a Supabase service-role key in a browser environment.
- The public website has no public data queries. The server reads fuel rows only after Supabase Auth validates the owner session; RLS limits rows to the authenticated user's `user_id`.
- Create the Storage bucket for evidence as private and add owner-specific Storage policies before uploading receipt images.

## Current scope / limitations
- Manual fuel entry and CSV import review are implemented. PDF/image OCR and source image uploads are not implemented in this first version.
- Unauthenticated mode shows static seed/demo data, but does not persist edits. Once Supabase is configured and the owner signs in, fuel rows read from Supabase are persistent.
- The initial 13 historical records are available as demo seed values in `src/app/page.tsx`; they are not auto-inserted into Supabase. Review/import them after setup to populate your database.
- Mileage chart is an indicative odometer delta divided by the later fill litres; it is not a certified full-to-full economy calculation.
