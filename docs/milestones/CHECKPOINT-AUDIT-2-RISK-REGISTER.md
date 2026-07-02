# CHECKPOINT-AUDIT-2-RISK-REGISTER

**Date:** 2026-07-02
**TODO:** TODO 2 — Audit Kelemahan Sistem (Weakness & Risk Register)
**Branch:** `audit/full-repair-2026-07`
**Status:** COMPLETED ✅

---

## Summary

Comprehensive weakness audit completed. Identified critical security and reliability issues requiring immediate attention.

---

## RISK REGISTER

| # | Kelemahan | Tingkat Risiko | Dampak Operasional | Rekomendasi |
|---|-----------|----------------|-------------------|-------------|
| R1 | **RLS tidak enforcement role** - Viewer bisa CRUD data operational | **Critical** | Viewer bisa modify/DELETE insiden, binter, tokoh | Tambah role-based RLS policies |
| R2 | **Auth 10s timeout bypass** - Auth bisa ter-bypass saat slow network | **High** | User bisa lihat konten sebelum auth selesai | Hapus timeout, tunggu auth konfirmasi |
| R3 | **Realtime no retry** - Koneksi realtime putus tanpa reconnect | **High** | Dashboard tampil data basi tanpa indikasi | Tambah exponential backoff retry |
| R4 | **GlobalErrorBoundary cryptic** - Error message tidak jelas untuk user | **Medium** | User tidak tahu apa yang出错 | Tambah error codes + recovery suggestions |
| R5 | **Client-side auth only** - ProtectedRoute bisa dibypass via direct API | **High** | Attacker bisa akses admin API langsung | Tambah server-side role verification |
| R6 | **No monitoring/alerting** - Tidak ada error tracking external | **Medium** | Admin tidak tahu sistem проблема sebelum user komplain | Integrasi Sentry atau similar |
| R7 | **clearCache() dead code** - Function tidak melakukan apa-apa | **Low** | Confusion, potensials isolate bug | Remove dead code calls |
| R8 | **Parallel getAll() calls** - PosDetailPage fire 3 query sekaligus | **Low** | Tidak efisien, potensi race condition | Batch queries atau use Supabase join |
| R9 | **No offline mode** - Supabase down = blank page | **High** | Tidak ada graceful degradation | Tambah offline indicator + cached data fallback |
| R10 | **Toast error feedback varied** - Error handling inconsistently implemented | **Medium** | User tidak selalu dapat feedback saat error | Standardize error toast pattern |

---

## DETAILED FINDINGS

### R1: RLS Role Enforcement (CRITICAL)

**Location:** `supabase/rls_policies.sql`

**Issue:**
```sql
-- Current: Semua authenticated user bisa CRUD
CREATE POLICY "Authenticated users can read" ON kerawanan FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert" ON kerawanan FOR INSERT TO authenticated WITH CHECK (true);
```

**Impact:** Viewer role can INSERT/UPDATE/DELETE all operational data (kerawanan, binter, tokoh, patroli, demografi)

**Recommendation:**
```sql
-- Should be: Hanya operator/admin bisa write
CREATE POLICY "Operator/Admin write kerawanan"
  ON kerawanan FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'operator')
  );
```

---

### R2: Auth 10s Timeout Bypass (HIGH)

**Location:** `src/context/AuthContext.jsx:13-16`

**Issue:**
```javascript
const timeoutId = setTimeout(() => {
  console.warn('[AuthContext] getSession timeout - proceeding without auth')
  setLoading(false)  // Bypasses auth!
}, 10000)
```

**Impact:** On slow network, app renders protected content before auth confirms, potentially exposing data to unauthenticated users

**Recommendation:** Remove timeout fallback entirely, or show "Verifying credentials..." spinner until auth resolves

---

### R3: Realtime No Retry Logic (HIGH)

**Location:** `src/hooks/useRealtime.js:38-45`

**Issue:**
```javascript
.subscribe((status) => {
  if (status === 'SUBSCRIBED') {
    // OK
  }
  if (status === 'CHANNEL_ERROR') {
    console.error(`[useRealtime] Channel error: ${channelName}`)
    // NO RETRY - silently stops receiving events
  }
})
```

**Impact:** Realtime stops silently on transient disconnect. Dashboard shows stale data without indication.

**Recommendation:** Add exponential backoff:
```javascript
const MAX_RETRIES = 5;
const retryWithBackoff = async (attempt = 0) => {
  if (attempt >= MAX_RETRIES) return;
  await new Promise(r => setTimeout(r, Math.min(1000 * 2 ** attempt, 30000)));
  // Reconnect logic
};
```

---

### R4: GlobalErrorBoundary Cryptic Errors (MEDIUM)

**Location:** `src/App.jsx:37-92`

**Issue:**
```javascript
<p>{this.state.error?.message || 'Unknown error'}</p>
// Shows raw error like "TypeError: Cannot read property 'x' of undefined"
```

**Impact:** Users see technical error messages they can't act on

**Recommendation:** Add error codes and user-friendly messages:
```javascript
const ERROR_MESSAGES = {
  'SUPABASE_OFFLINE': 'Koneksi ke server terputus. Periksa internet Anda.',
  'AUTH_FAILED': 'Sesi Anda berakhir. Silakan login ulang.',
  'DATA_FETCH': 'Gagal mengambil data. Coba beberapa saat lagi.',
  'DEFAULT': 'Terjadi kesalahan yang tidak diketahui.'
};
```

---

### R5: Client-Side Auth Only (HIGH)

**Location:** `src/components/auth/ProtectedRoute.jsx`

**Issue:**
```javascript
if (requireAdmin && !isAdmin) {
  return <Navigate to="/" replace />
}
// NO server-side verification
```

**Impact:** Sophisticated attacker can bypass ProtectedRoute via direct Supabase API calls

**Recommendation:** Add server-side verification via Edge Function or middleware

---

### R6: No External Monitoring (MEDIUM)

**Issue:** No error tracking service (Sentry, LogRocket, etc.)

**Impact:** Admin only knows system has problems when users complain

**Recommendation:** Integrate Sentry for error tracking and performance monitoring

---

### R7: clearCache() Dead Code (LOW)

**Location:** All service files

**Issue:** Function is a no-op remnant from Apps Script migration

**Recommendation:** Remove all `clearCache()` calls

---

### R8: Parallel getAll() Calls (LOW)

**Location:** `src/pages/PosDetailPage.jsx`

**Issue:** 3 simultaneous fetch calls on page load

**Recommendation:** Use Supabase join or batch queries

---

### R9: No Offline Mode (HIGH)

**Issue:** Supabase down = blank page or loading forever

**Impact:** Mission-critical dashboard has no graceful degradation

**Recommendation:**
1. Show clear "Offline" indicator
2. Implement service worker for offline caching
3. Show last-known-good data with timestamp

---

### R10: Inconsistent Error Toast (MEDIUM)

**Issue:** Error handling varies across pages and services

**Recommendation:** Standardize with shared error handler:
```javascript
const showError = (context, message) => toast.error(message, { context });
```

---

## FILES ANALYZED

| File | Findings |
|------|----------|
| `src/hooks/useRealtime.js` | No retry, silent failure |
| `src/context/AuthContext.jsx` | 10s timeout bypass, no token refresh monitoring |
| `src/App.jsx` | GlobalErrorBoundary exists, but cryptic messages |
| `src/components/auth/ProtectedRoute.jsx` | Client-side only, no server verification |
| `supabase/rls_policies.sql` | No role-based RLS enforcement |

---

## VERIFICATION

```
npm run build: PASS ✅
```

---

## PRIORITY ACTIONS FOR NEXT SESSION

| Priority | Action | Estimated Effort |
|----------|--------|------------------|
| P0 | Add role-based RLS policies | 2-3 hours |
| P0 | Remove Auth 10s timeout | 30 minutes |
| P1 | Add realtime retry logic | 1-2 hours |
| P1 | Add server-side auth verification | 2-3 hours |
| P2 | Improve error messages | 1 hour |
| P2 | Integrate Sentry | 1-2 hours |
| P3 | Remove clearCache() dead code | 30 minutes |
| P3 | Optimize parallel queries | 1 hour |

---

## NEXT STEPS (TODO 3)

**TODO 3:** Audit Semua Button/Elemen Interaktif
- Update `docs/DASHBOARD-BUTTON-INVENTORY.md`
- Tiap button: aksi benar, loading/disabled state, konfirmasi delete
- Aksesibilitas: touch target, aria-label, keyboard nav
- Konsistensi hover/focus/active state

---

*Checkpoint Created: 2026-07-02*
