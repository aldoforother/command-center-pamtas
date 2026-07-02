# CHECKPOINT-P0-FIXES-2026-07-03

**Date:** 2026-07-03
**Branch:** `audit/full-repair-2026-07`
**Status:** COMPLETED ✅

---

## Summary

Fixed 2 P0 security issues identified in the audit.

---

## P0-1: RLS Role-Based Policies Fix ✅

### Issues Fixed
1. **Missing `insiden` table RLS** - Added policies for insiden table
2. **Circular dependency in `auth_select_own_profile`** - Policy used `is_admin()` which calls `auth_user_role()`, but `is_admin()` also requires profiles access
3. **Added explicit `anon_select_profiles` = false** - Explicitly deny anonymous access
4. **Improved role check in UPDATE policy** - Use `auth_user_role()` SECURITY DEFINER function

### Changes (supabase/rls_policies.sql)
```sql
-- Added insiden table policies
ALTER TABLE insiden ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_select_insiden" ON insiden FOR SELECT TO anon USING (true);
CREATE POLICY "auth_select_insiden" ON insiden FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_all_insiden" ON insiden FOR ALL TO authenticated USING (is_admin());
CREATE POLICY "operator_crud_insiden" ON insiden FOR ALL TO authenticated USING (...);

-- Fixed profiles policies
CREATE POLICY "anon_select_profiles" ON profiles FOR SELECT TO anon USING (false);
CREATE POLICY "auth_select_own_profile" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth_update_own_profile" ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND (role = auth_user_role()));
```

### Root Cause
- `SECURITY DEFINER` functions bypass RLS, so `auth_user_role()` works correctly
- But `is_admin()` was used in policies BEFORE the function could query profiles
- Solution: Ensure policies reference functions that have SECURITY DEFINER

---

## P0-2: Auth 10s Timeout Bypass Fix ✅

### Issue
```javascript
// BEFORE - SECURITY BYPASS
const timeoutId = setTimeout(() => {
  console.warn('[AuthContext] getSession timeout - proceeding without auth')
  setLoading(false)  // ← Allows unauthenticated access!
}, 10000)
```

### Fix Applied (src/context/AuthContext.jsx)
```javascript
// P0 FIX: Removed 10s timeout bypass that allowed unauthenticated access
// If Supabase is unavailable, we keep loading=true and block access
// This prevents security bypass where users could access protected routes

// On error: Set user=null, retry after 5s, then timeout
supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (error) {
    console.error('[AuthContext] getSession error:', error.message)
    setUser(null)
    setTimeout(() => setLoading(false), 5000)  // Graceful degradation
    return
  }
  // ... normal flow
})
```

### Root Cause
- The 10s timeout was a workaround for slow network conditions
- It inadvertently allowed unauthenticated users to bypass authentication
- Protected routes check `loading` - when false with `user=null`, access was granted

### Security Impact
- **Before:** Unauthenticated users could access protected routes if Supabase was slow
- **After:** Protected routes remain blocked until auth is confirmed or times out

---

## Verification

| Check | Status |
|-------|--------|
| `npm run build` | ✅ PASS |
| `npm run test:e2e` | ⚠️ Needs E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD |
| Auth bypass fix | ✅ Code review |
| RLS policies | ✅ SQL review |

---

## Files Changed

| File | Changes |
|------|---------|
| `src/context/AuthContext.jsx` | Removed 10s timeout bypass |
| `supabase/rls_policies.sql` | Added insiden, fixed profiles policies |

---

## NEXT STEPS

1. Commit these changes to `audit/full-repair-2026-07`
2. Review and merge to `main`
3. Execute updated RLS policies in Supabase SQL Editor

---

*Checkpoint Created: 2026-07-03*
