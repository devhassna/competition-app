create table if not exists public.tasks (
  id bigint generated always as identity primary key,
  title text not null,
  done boolean not null default false,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "قراءة مهامي" on public.tasks
  for select using (auth.uid() = user_id);

create policy "إضافة مهامي" on public.tasks
  for insert with check (auth.uid() = user_id);

create policy "تعديل مهامي" on public.tasks
  for update using (auth.uid() = user_id);

create policy "حذف مهامي" on public.tasks
  for delete using (auth.uid() = user_id);
