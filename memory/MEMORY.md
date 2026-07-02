# Claude Code Memory Index

## Projects

- [rules-aldoforother](rules-aldoforother.md) — **READ FIRST** - User's mandatory rules
- [project-status-2026-07-01](project-status-2026-07-01.md) — Contains merge conflict, deployment info
- [critical-bugs-2026-07-02](critical-bugs-2026-07-02.md) — **ACTIVE** - Home page + POS page bugs
- [qa-checkpoint-2026-06-30](qa-checkpoint-2026-06-30.md) — QA testing checkpoint
- [ci-e2e-fix-2026-06-30](ci-e2e-fix-2026-06-30.md) — CI E2E fix
- [deploy-2026-07-01](deploy-2026-07-01.md) — Production deploy
- [audit-session-2026-07-02](audit-session-2026-07-02.md) — **ACTIVE** - Full audit session in progress

## CRITICAL: Before Starting Any Session

1. Read `memory/rules-aldoforother.md` FIRST - mandatory rules
2. Read `memory/critical-bugs-2026-07-02.md` for active issues
3. Check branch: `git branch` (should be on `main` or feature branch)
4. NEVER repeat work user has completed

## Current Session

**Active Audit:** `audit/full-repair-2026-07` branch
- Master plan: `docs/milestones/AUDIT-MASTER-PLAN.md`
- Checkpoints: `docs/milestones/CHECKPOINT-AUDIT-*.md`

### Baseline Metrics (TODO 0)
| Metric | Value |
|--------|-------|
| Build Time | 12.02s |
| dist/ Size | 8.9MB |
| Main Bundle | 777KB |
| Chart Vendor | 359KB |

### Orphan Assets Found (TODO 4)
- `public/hero-figure.png` (2.6MB) - NOT referenced in code
- `public/banner1.jpg` (1.4MB) - NOT used, only banner1.png used
- Total savings potential: ~4MB

### E2E Test Status
- critical-pages.spec.js: PASS ✅
- admin.spec.js: FAIL ❌ (auth issue)
- binter.spec.js: FAIL ❌ (auth issue)
- home.spec.js: FAIL ❌ (auth issue)
- insiden.spec.js: FAIL ❌ (auth issue)
- laporan.spec.js: FAIL ❌ (auth issue)

**Root Cause:** Test credentials not configured in GitHub Secrets
