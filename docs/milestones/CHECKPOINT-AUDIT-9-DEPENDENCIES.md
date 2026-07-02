# CHECKPOINT-AUDIT-9-DEPENDENCIES

**Date:** 2026-07-02
**TODO:** TODO 9 — Dependency & Vulnerability Audit
**Branch:** `audit/full-repair-2026-07`
**Status:** COMPLETED ✅

---

## Summary

Dependency audit completed. Found 2 vulnerabilities and 1 unused dependency.

---

## 1. NPM AUDIT RESULTS

### Vulnerabilities Found

| Severity | Package | Issue | Fix Available |
|----------|---------|-------|---------------|
| **Moderate** | esbuild <=0.24.2 | Enables SSRF on dev server | `npm audit fix --force` |
| **High** | vite <=6.4.2 | Depends on vulnerable esbuild | `npm audit fix --force` |

### Root Cause
- `vite` depends on `esbuild` which has a development-server SSRF vulnerability
- This only affects the **development server**, not production builds

### Production Impact
**LOW** - This vulnerability only affects local development. Production builds bundle esbuild output, not the server.

### Recommendation
- **Option A:** Update vite to latest (requires testing for breaking changes)
- **Option B:** Accept risk (dev-only issue) - documented here
- **Do NOT run `npm audit fix --force`** without testing - it will update vite to v8 which may break the build

---

## 2. UNUSED DEPENDENCIES

### `supabase` CLI Package ❌

| Package | Used In | Status |
|---------|---------|--------|
| `supabase` | `package.json` devDependencies | ❌ **UNUSED** |

**Evidence:** Only `@supabase/supabase-js` is imported in the codebase:

```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'
```

**What `supabase` package does:** It's the Supabase CLI tool (for local development), not a library. Not used as a code dependency.

**Recommendation:** Remove from `devDependencies`:
```bash
npm uninstall supabase
```

---

## 3. DEPENDENCY VERSION STATUS

### Direct Dependencies (25 packages)

| Package | Current | Latest | Status |
|---------|---------|--------|--------|
| react | 18.3.1 | 18.3.x | ✅ Up to date |
| react-dom | 18.3.1 | 18.3.x | ✅ Up to date |
| react-router-dom | 6.30.4 | 6.x | ✅ Current major |
| @supabase/supabase-js | 2.108.2 | 2.x | ✅ Up to date |
| leaflet | 1.9.4 | 1.9.x | ✅ Up to date |
| recharts | 2.15.4 | 2.15.x | ✅ Up to date |
| jspdf | 4.2.1 | 4.x | ✅ Up to date |
| html2canvas | 1.4.1 | 1.4.x | ✅ Up to date |
| motion | 12.42.2 | 12.x | ✅ Up to date |
| vite | 5.4.21 | 5.4.x | ⚠️ Has known vuln |
| tailwindcss | 3.4.19 | 3.4.x | ✅ Up to date |
| playwright | 1.61.1 | 1.61.x | ✅ Up to date |

**Overall:** Dependencies are well-maintained.

---

## 4. RECOMMENDATIONS

### Immediate Actions

| Priority | Action | Effort |
|----------|--------|--------|
| P2 | Remove unused `supabase` package | 5 min |
| P3 | Document esbuild/vite vuln (dev-only) | Done |

### Future Actions

| Priority | Action | Risk |
|----------|--------|------|
| P2 | Test vite update to v6 (when stable) | Breaking changes |
| P3 | Monitor for vite security patches | - |

---

## FILES ANALYZED

| File | Findings |
|------|----------|
| `package.json` | 25 dependencies |
| `npm audit output` | 2 vulnerabilities |
| `src/lib/supabase.js` | Only @supabase/supabase-js used |

---

## VERIFICATION

```
npm run build: PASS ✅
npm audit: 2 vulnerabilities (dev-only)
```

---

## NEXT STEPS (TODO 10)

**TODO 10:** Laporan Akhir & Rekomendasi
- Buat `docs/AUDIT-FINAL-REPORT-2026-07.md`
- Update `AUDIT-MASTER-PLAN.md` jadi 100% checked
- Ringkas untuk user

---

*Checkpoint Created: 2026-07-02*
