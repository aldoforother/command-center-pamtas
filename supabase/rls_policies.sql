-- ============================================================
-- RLS POLICIES — Command Center Pamtas
-- ROLE-BASED ACCESS CONTROL
-- Roles: admin, operator, viewer
--
-- Rules:
-- - Admin: Full access (CRUD) on all data
-- - Operator: CRUD on their assigned POS data only
-- - Viewer: Read-only (SELECT) on all data
--
-- Jalankan di Supabase SQL Editor (sekali, idempotent)
-- ============================================================

-- ── HELPER FUNCTIONS ────────────────────────────────────────

-- Get current user's role
CREATE OR REPLACE FUNCTION auth_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT auth_user_role() = 'admin';
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Check if current user is operator or admin (can write)
CREATE OR REPLACE FUNCTION can_write()
RETURNS BOOLEAN AS $$
  SELECT auth_user_role() IN ('admin', 'operator');
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Check if current user owns a specific POS (for operator)
CREATE OR REPLACE FUNCTION user_owns_pos(pos_id_param TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  IF is_admin() THEN RETURN TRUE; END IF;
  RETURN (SELECT pos_id FROM profiles WHERE id = auth.uid()) = pos_id_param;
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER STABLE;

-- ── DEMOGRAFI ─────────────────────────────────────────────
ALTER TABLE demografi ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_demografi" ON demografi;
DROP POLICY IF EXISTS "auth_select_demografi" ON demografi;
DROP POLICY IF EXISTS "admin_all_demografi" ON demografi;
DROP POLICY IF EXISTS "operator_insert_demografi" ON demografi;
DROP POLICY IF EXISTS "operator_update_demografi" ON demografi;
DROP POLICY IF EXISTS "operator_delete_demografi" ON demografi;

-- Anon can SELECT
CREATE POLICY "anon_select_demografi"
  ON demografi FOR SELECT TO anon USING (true);

-- Authenticated can SELECT (all roles)
CREATE POLICY "auth_select_demografi"
  ON demografi FOR SELECT TO authenticated USING (true);

-- Admin can do everything
CREATE POLICY "admin_all_demografi"
  ON demografi FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Operator can INSERT/UPDATE/DELETE (their POS data)
CREATE POLICY "operator_insert_demografi"
  ON demografi FOR INSERT TO authenticated
  WITH CHECK (
    can_write() AND (
      is_admin() OR
      user_owns_pos(pos_id)
    )
  );

CREATE POLICY "operator_update_demografi"
  ON demografi FOR UPDATE TO authenticated
  USING (
    can_write() AND (
      is_admin() OR
      user_owns_pos(pos_id)
    )
  );

CREATE POLICY "operator_delete_demografi"
  ON demografi FOR DELETE TO authenticated
  USING (
    can_write() AND (
      is_admin() OR
      user_owns_pos(pos_id)
    )
  );

-- ── POS ───────────────────────────────────────────────────
ALTER TABLE pos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_pos" ON pos;
DROP POLICY IF EXISTS "auth_select_pos" ON pos;
DROP POLICY IF EXISTS "admin_update_pos" ON pos;

CREATE POLICY "anon_select_pos"
  ON pos FOR SELECT TO anon USING (true);

CREATE POLICY "auth_select_pos"
  ON pos FOR SELECT TO authenticated USING (true);

-- Only admin can UPDATE POS (POS settings are critical)
CREATE POLICY "admin_update_pos"
  ON pos FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ── KERAWANAN ─────────────────────────────────────────────
ALTER TABLE kerawanan ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_kerawanan" ON kerawanan;
DROP POLICY IF EXISTS "auth_select_kerawanan" ON kerawanan;
DROP POLICY IF EXISTS "admin_all_kerawanan" ON kerawanan;
DROP POLICY IF EXISTS "operator_crud_kerawanan" ON kerawanan;

CREATE POLICY "anon_select_kerawanan"
  ON kerawanan FOR SELECT TO anon USING (true);

CREATE POLICY "auth_select_kerawanan"
  ON kerawanan FOR SELECT TO authenticated USING (true);

-- Admin can do everything
CREATE POLICY "admin_all_kerawanan"
  ON kerawanan FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Operator can CRUD (their POS data only)
CREATE POLICY "operator_crud_kerawanan"
  ON kerawanan FOR ALL TO authenticated
  USING (
    can_write() AND (
      is_admin() OR
      user_owns_pos(pos_id)
    )
  )
  WITH CHECK (
    can_write() AND (
      is_admin() OR
      user_owns_pos(pos_id)
    )
  );

-- ── BINTER ────────────────────────────────────────────────
ALTER TABLE binter ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_binter" ON binter;
DROP POLICY IF EXISTS "auth_select_binter" ON binter;
DROP POLICY IF EXISTS "admin_all_binter" ON binter;
DROP POLICY IF EXISTS "operator_crud_binter" ON binter;

CREATE POLICY "anon_select_binter"
  ON binter FOR SELECT TO anon USING (true);

CREATE POLICY "auth_select_binter"
  ON binter FOR SELECT TO authenticated USING (true);

CREATE POLICY "admin_all_binter"
  ON binter FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "operator_crud_binter"
  ON binter FOR ALL TO authenticated
  USING (
    can_write() AND (
      is_admin() OR
      user_owns_pos(pos_id)
    )
  )
  WITH CHECK (
    can_write() AND (
      is_admin() OR
      user_owns_pos(pos_id)
    )
  );

-- ── TOKOH ─────────────────────────────────────────────────
ALTER TABLE tokoh ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_tokoh" ON tokoh;
DROP POLICY IF EXISTS "auth_select_tokoh" ON tokoh;
DROP POLICY IF EXISTS "admin_all_tokoh" ON tokoh;
DROP POLICY IF EXISTS "operator_crud_tokoh" ON tokoh;

CREATE POLICY "anon_select_tokoh"
  ON tokoh FOR SELECT TO anon USING (true);

CREATE POLICY "auth_select_tokoh"
  ON tokoh FOR SELECT TO authenticated USING (true);

CREATE POLICY "admin_all_tokoh"
  ON tokoh FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "operator_crud_tokoh"
  ON tokoh FOR ALL TO authenticated
  USING (
    can_write() AND (
      is_admin() OR
      user_owns_pos(pos_id)
    )
  )
  WITH CHECK (
    can_write() AND (
      is_admin() OR
      user_owns_pos(pos_id)
    )
  );

-- ── PATROLI ───────────────────────────────────────────────
ALTER TABLE patroli ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_patroli" ON patroli;
DROP POLICY IF EXISTS "auth_select_patroli" ON patroli;
DROP POLICY IF EXISTS "admin_all_patroli" ON patroli;
DROP POLICY IF EXISTS "operator_crud_patroli" ON patroli;

CREATE POLICY "anon_select_patroli"
  ON patroli FOR SELECT TO anon USING (true);

CREATE POLICY "auth_select_patroli"
  ON patroli FOR SELECT TO authenticated USING (true);

CREATE POLICY "admin_all_patroli"
  ON patroli FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "operator_crud_patroli"
  ON patroli FOR ALL TO authenticated
  USING (
    can_write() AND (
      is_admin() OR
      user_owns_pos(pos_id)
    )
  )
  WITH CHECK (
    can_write() AND (
      is_admin() OR
      user_owns_pos(pos_id)
    )
  );

-- ── PROFILES ──────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_profiles" ON profiles;
DROP POLICY IF EXISTS "auth_select_own_profile" ON profiles;
DROP POLICY IF EXISTS "auth_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "admin_all_profiles" ON profiles;

-- Anon cannot see profiles
CREATE POLICY "anon_select_profiles"
  ON profiles FOR SELECT TO anon USING (false);

-- Authenticated users can view all profiles (needed for role checks via SECURITY DEFINER)
CREATE POLICY "auth_select_own_profile"
  ON profiles FOR SELECT TO authenticated USING (true);

-- Users can update their own profile (SECURITY DEFINER bypasses RLS for role check)
CREATE POLICY "auth_update_own_profile"
  ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() AND
    -- SECURITY DEFINER function bypasses RLS for this subquery
    (role = auth_user_role())
  );

-- Admin can manage all profiles
CREATE POLICY "admin_all_profiles"
  ON profiles FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ── INSIDEN ───────────────────────────────────────────────
ALTER TABLE insiden ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_insiden" ON insiden;
DROP POLICY IF EXISTS "auth_select_insiden" ON insiden;
DROP POLICY IF EXISTS "admin_all_insiden" ON insiden;
DROP POLICY IF EXISTS "operator_crud_insiden" ON insiden;

CREATE POLICY "anon_select_insiden"
  ON insiden FOR SELECT TO anon USING (true);

CREATE POLICY "auth_select_insiden"
  ON insiden FOR SELECT TO authenticated USING (true);

CREATE POLICY "admin_all_insiden"
  ON insiden FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "operator_crud_insiden"
  ON insiden FOR ALL TO authenticated
  USING (
    can_write() AND (
      is_admin() OR
      user_owns_pos(pos_id)
    )
  )
  WITH CHECK (
    can_write() AND (
      is_admin() OR
      user_owns_pos(pos_id)
    )
  );

-- ── Verifikasi ─────────────────────────────────────────────
SELECT
  schemaname,
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('demografi','pos','kerawanan','binter','tokoh','patroli','profiles')
ORDER BY tablename, policyname;
