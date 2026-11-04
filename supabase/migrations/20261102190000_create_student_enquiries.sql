create extension if not exists pgcrypto;

create table if not exists public.student_enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  mobile_number text not null,
  whatsapp_number text,
  preferred_branch text not null,
  membership_type text not null,
  joining_date date,
  study_purpose text not null,
  preferred_timing text not null,
  additional_message text,
  consent boolean not null default false,
  enquiry_status text not null default 'New'
);

create index if not exists student_enquiries_mobile_created_at_idx
  on public.student_enquiries (mobile_number, created_at desc);

alter table public.student_enquiries enable row level security;

-- Enquiries are read and written only by the server-side service-role client.
-- No anonymous or authenticated client policy is required.
