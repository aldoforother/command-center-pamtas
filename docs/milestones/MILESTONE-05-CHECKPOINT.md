# MILESTONE 5 CHECKPOINT — DATA PAGES REDESIGN

**Date:** 2026-06-27
**Status:** IN PROGRESS ⚠️
**Branch:** `feature/ui-evolution-v1`

---

## OBJECTIVE

Redesign entire data pages with focus on:
- Table/List views
- Filters
- Search
- Detail panels
- Pagination
- Loading states
- Empty states
- Responsive design
- Motion animations

**Constraints:**
- Preserve all business logic
- No query changes
- No API changes

---

## TARGET PAGES

| Page | Status | Notes |
|------|--------|-------|
| Insiden | ⚠️ Partial | Header updated with CSS tokens |
| Binter | ⏳ Pending | Original state |
| PosDetail | ⏳ Pending | Original state |
| Kerawanan | ⏳ Pending | Original state |
| DataDemografi (laporan) | ⏳ Pending | Original state |
| Tokoh (laporan) | ⏳ Pending | Original state |
| Patroli (laporan) | ⏳ Pending | Original state |

---

## PROGRESS - INSIDENPAGE

### Completed Changes

**Header Section:**
- Background: `rgba(4,11,6,0.9)` → `var(--surface-primary)`
- Border: `rgba(0,255,136,0.15)` → `var(--border-subtle)`
- Title color: `rgba(200,214,229,0.85)` → `var(--color-danger)`
- Description: `rgba(200,214,229,0.3)` → `var(--text-tertiary)`
- StatChip colors: `#00ff88` → `var(--accent-primary)`
- StatChip danger: `#ff3333` → `var(--color-danger)`

### Pending Changes

**List Section (needs update):**
- List item backgrounds
- List item borders
- Hover states
- Selected states
- Text colors

**Detail Panel (needs update):**
- Panel backgrounds
- Border colors
- Text colors
- Row dividers

**Motion (needs implementation):**
- Stagger animations on list items
- Slide-in for detail panel
- Hover transitions

---

## CSS TOKENS REFERENCE

For data pages redesign:

### Surface Tokens
```css
var(--surface-base)     /* #030305 */
var(--surface-primary)  /* #080B10 */
var(--surface-secondary) /* #0C1015 */
var(--surface-tertiary)  /* #101420 */
```

### Border Tokens
```css
var(--border-subtle)   /* rgba(255,255,255,0.06) */
var(--border-default)   /* rgba(255,255,255,0.10) */
var(--border-strong)   /* rgba(255,255,255,0.16) */
var(--border-focus)    /* rgba(0,255,136,0.6) */
```

### Text Tokens
```css
var(--text-primary)    /* #FFFFFF */
var(--text-secondary)  /* #B4BAC8 */
var(--text-tertiary)   /* #6B748C */
var(--text-disabled)   /* #3D4456 */
```

### Semantic Tokens
```css
var(--accent-primary)     /* #00FF88 */
var(--color-danger)        /* #FF3B3B */
var(--color-danger-subtle) /* rgba(255,59,59,0.12) */
var(--color-warning)      /* #FFB020 */
var(--color-info)         /* #3B8BFF */
```

### Motion Tokens
```css
var(--duration-fast)    /* 100ms */
var(--duration-normal)   /* 150ms */
var(--duration-smooth)  /* 200ms */
--ease-out             /* cubic-bezier(0.16, 1, 0.3, 1) */
```

---

## PATTERN: DATA PAGE LAYOUT

```jsx
// Standard data page structure
<div className="flex flex-col h-full animate-fade-in">
  {/* Header with filters */}
  <Header
    title="Data Title"
    stats={[...]}
    filters={<Filters />}
  />

  {/* Content area */}
  <div className="flex flex-1 overflow-hidden">
    {/* List */}
    <List
      data={filtered}
      loading={<LoadingSpinner />}
      empty={<EmptyState />}
      onItemClick={setSelectedItem}
    />

    {/* Detail Panel (conditional) */}
    {selectedItem && (
      <DetailPanel
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    )}
  </div>
</div>
```

---

## LIST ITEM PATTERN

```jsx
<div
  className="hud-panel px-3 py-2.5 flex items-start gap-3 cursor-pointer transition-all duration-150 animate-fade-in"
  style={{
    borderLeftColor: status === 'active' ? 'var(--color-danger)' : 'var(--accent-primary)',
    borderLeftWidth: '2px',
    background: isSelected ? 'var(--accent-muted)' : 'var(--surface-primary)',
    borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)',
    animationDelay: `${Math.min(index * 20, 200)}ms`,
  }}
  onMouseEnter={e => {
    if (!isSelected) {
      e.currentTarget.style.background = 'var(--surface-secondary)';
      e.currentTarget.style.borderColor = 'var(--border-default)';
    }
  }}
  onMouseLeave={e => {
    if (!isSelected) {
      e.currentTarget.style.background = 'var(--surface-primary)';
      e.currentTarget.style.borderColor = 'var(--border-subtle)';
    }
  }}
  onClick={() => onSelect(item)}
>
  {/* Content */}
</div>
```

---

## DETAIL PANEL PATTERN

```jsx
<div
  className="w-1/2 border-l overflow-y-auto animate-slide-in-right"
  style={{
    borderColor: 'var(--border-subtle)',
    background: 'var(--surface-base)',
  }}
>
  {/* Header */}
  <div
    className="px-4 py-3 flex items-center justify-between"
    style={{
      background: 'var(--accent-muted)',
      borderBottom: '1px solid var(--border-subtle)',
    }}
  >
    <Title />
    <CloseButton />
  </div>

  {/* Content */}
  <div className="flex-1 overflow-y-auto p-4 space-y-3">
    <InfoCard />
    <ActionButton />
  </div>
</div>
```

---

## FILTER PATTERN

```jsx
<div className="flex flex-wrap items-center gap-2">
  <select className="hud-select text-[10px] w-40 transition-all duration-150">
    {/* options */}
  </select>

  <input
    className="hud-input text-[10px] w-40 transition-all duration-150"
    placeholder="Cari..."
  />

  {hasActiveFilter && (
    <button className="hud-btn text-[9px] px-2 transition-all duration-150">
      Reset
    </button>
  )}
</div>
```

---

## FILES CHANGED

| File | Status | Changes |
|------|--------|---------|
| `src/pages/InsidenPage.jsx` | ⚠️ Partial | Header section with CSS tokens |
| `src/index.css` | ✅ Done | Animation utilities added in Milestone 4 |

---

## VALIDATION CHECKLIST

| Check | Status |
|-------|--------|
| Build passes | ✅ PASS |
| Business logic unchanged | ✅ PASS |
| Queries unchanged | ✅ PASS |
| API calls unchanged | ✅ PASS |

---

## ROLLBACK INSTRUCTIONS

```bash
# Revert InsidenPage changes
git checkout HEAD -- src/pages/InsidenPage.jsx
```

---

## NEXT STEPS (TO CONTINUE)

1. **InsidenPage** - Complete list section updates
   - Update list item backgrounds and borders
   - Add stagger animations
   - Update detail panel styling

2. **BinterPage** - Apply same patterns
   - Header with CSS tokens
   - List items with hover states
   - Detail panel with slide animation

3. **KerawananPage** - Apply same patterns

4. **PosDetailPage** - Tab-based layout updates

5. **Laporan pages** - DataDemografiPage, TokohPage, PatroliPage

---

## CHECKPOINT SIGNATURE

```
Milestone 5: IN PROGRESS ⚠️

Pages Analyzed: 7
Pages Started: 1
├── InsidenPage: Partial (Header done) ⚠️
└── Others: Pending ⏳

Build Status: PASS
Business Logic: PRESERVED
```
