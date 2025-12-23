-- RLS policies for Supabase (public schema)
-- Assumes auth.uid() matches public.users.id for authenticated clients.
-- Service role bypasses RLS and should be used by the backend.

-- =====================================================
-- ENABLE RLS
-- =====================================================

alter table public.users enable row level security;
alter table public.user_profiles enable row level security;
alter table public.workout_plans enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.workout_session_exercises enable row level security;
alter table public.workout_logs enable row level security;
alter table public.exercise_logs enable row level security;
alter table public.progress_metrics enable row level security;
alter table public.movement_patterns enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_progressions enable row level security;

-- =====================================================
-- PUBLIC READ-ONLY TABLES
-- =====================================================

create policy "Movement patterns are public read"
  on public.movement_patterns
  for select
  to anon, authenticated
  using (true);

create policy "Exercises are public read"
  on public.exercises
  for select
  to anon, authenticated
  using (true);

create policy "Exercise progressions are public read"
  on public.exercise_progressions
  for select
  to anon, authenticated
  using (true);

-- =====================================================
-- USER-OWNED TABLES
-- =====================================================

create policy "Users can view own record"
  on public.users
  for select
  to authenticated
  using (id = auth.uid());

create policy "Users can update own record"
  on public.users
  for update
  to authenticated
  using (id = auth.uid());

create policy "Profiles are user-owned"
  on public.user_profiles
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Profiles can be inserted by owner"
  on public.user_profiles
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Profiles can be updated by owner"
  on public.user_profiles
  for update
  to authenticated
  using (user_id = auth.uid());

create policy "Profiles can be deleted by owner"
  on public.user_profiles
  for delete
  to authenticated
  using (user_id = auth.uid());

create policy "Workout plans are user-owned"
  on public.workout_plans
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Workout plans can be inserted by owner"
  on public.workout_plans
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Workout plans can be updated by owner"
  on public.workout_plans
  for update
  to authenticated
  using (user_id = auth.uid());

create policy "Workout plans can be deleted by owner"
  on public.workout_plans
  for delete
  to authenticated
  using (user_id = auth.uid());

create policy "Workout sessions are user-owned"
  on public.workout_sessions
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Workout sessions can be inserted by owner"
  on public.workout_sessions
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Workout sessions can be updated by owner"
  on public.workout_sessions
  for update
  to authenticated
  using (user_id = auth.uid());

create policy "Workout sessions can be deleted by owner"
  on public.workout_sessions
  for delete
  to authenticated
  using (user_id = auth.uid());

create policy "Workout session exercises follow parent session ownership"
  on public.workout_session_exercises
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.workout_sessions ws
      where ws.id = workout_session_id
        and ws.user_id = auth.uid()
    )
  );

create policy "Workout session exercises can be inserted by owner"
  on public.workout_session_exercises
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.workout_sessions ws
      where ws.id = workout_session_id
        and ws.user_id = auth.uid()
    )
  );

create policy "Workout session exercises can be updated by owner"
  on public.workout_session_exercises
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.workout_sessions ws
      where ws.id = workout_session_id
        and ws.user_id = auth.uid()
    )
  );

create policy "Workout session exercises can be deleted by owner"
  on public.workout_session_exercises
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.workout_sessions ws
      where ws.id = workout_session_id
        and ws.user_id = auth.uid()
    )
  );

create policy "Workout logs are user-owned"
  on public.workout_logs
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Workout logs can be inserted by owner"
  on public.workout_logs
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Workout logs can be updated by owner"
  on public.workout_logs
  for update
  to authenticated
  using (user_id = auth.uid());

create policy "Workout logs can be deleted by owner"
  on public.workout_logs
  for delete
  to authenticated
  using (user_id = auth.uid());

create policy "Exercise logs follow workout log ownership"
  on public.exercise_logs
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.workout_logs wl
      where wl.id = workout_log_id
        and wl.user_id = auth.uid()
    )
  );

create policy "Exercise logs can be inserted by owner"
  on public.exercise_logs
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.workout_logs wl
      where wl.id = workout_log_id
        and wl.user_id = auth.uid()
    )
  );

create policy "Exercise logs can be updated by owner"
  on public.exercise_logs
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.workout_logs wl
      where wl.id = workout_log_id
        and wl.user_id = auth.uid()
    )
  );

create policy "Exercise logs can be deleted by owner"
  on public.exercise_logs
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.workout_logs wl
      where wl.id = workout_log_id
        and wl.user_id = auth.uid()
    )
  );

create policy "Progress metrics are user-owned"
  on public.progress_metrics
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Progress metrics can be inserted by owner"
  on public.progress_metrics
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Progress metrics can be updated by owner"
  on public.progress_metrics
  for update
  to authenticated
  using (user_id = auth.uid());

create policy "Progress metrics can be deleted by owner"
  on public.progress_metrics
  for delete
  to authenticated
  using (user_id = auth.uid());

-- =====================================================
-- PRIVILEGE GRANTS (SUPABASE ROLES)
-- =====================================================

grant usage on schema public to anon, authenticated;

grant select on public.movement_patterns to anon, authenticated;
grant select on public.exercises to anon, authenticated;
grant select on public.exercise_progressions to anon, authenticated;

grant select, update on public.users to authenticated;

grant select, insert, update, delete on public.user_profiles to authenticated;
grant select, insert, update, delete on public.workout_plans to authenticated;
grant select, insert, update, delete on public.workout_sessions to authenticated;
grant select, insert, update, delete on public.workout_session_exercises to authenticated;
grant select, insert, update, delete on public.workout_logs to authenticated;
grant select, insert, update, delete on public.exercise_logs to authenticated;
grant select, insert, update, delete on public.progress_metrics to authenticated;
