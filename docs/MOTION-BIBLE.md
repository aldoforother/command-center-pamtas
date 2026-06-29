# COMMAND CENTER PAMTAS — MOTION BIBLE

**Version:** 1.0
**Date:** 2026-06-27
**Scope:** Entire Application Redesign

---

## TABLE OF CONTENTS

1. [Animation Philosophy](#1-animation-philosophy)
2. [Motion Hierarchy](#2-motion-hierarchy)
3. [Duration Scale](#3-duration-scale)
4. [Easing Curves](#4-easing-curves)
5. [Hover Behavior](#5-hover-behavior)
6. [Button Interactions](#6-button-interactions)
7. [Sidebar Animation](#7-sidebar-animation)
8. [Panel Animation](#8-panel-animation)
9. [Dashboard Animation](#9-dashboard-animation)
10. [Chart Animation](#10-chart-animation)
11. [Map Animation](#11-map-animation)
12. [Loading Animation](#12-loading-animation)
13. [Skeleton Animation](#13-skeleton-animation)
14. [Page Transition](#14-page-transition)
15. [Modal Transition](#15-modal-transition)
16. [Toast Animation](#16-toast-animation)
17. [Dropdown Animation](#17-dropdown-animation)
18. [Tooltip Animation](#18-tooltip-animation)
19. [Table Animation](#19-table-animation)
20. [Expandable Section](#20-expandable-section)
21. [Accordion](#21-accordion)
22. [Micro Interactions](#22-micro-interactions)
23. [Focus Animation](#23-focus-animation)
24. [Keyboard Interaction](#24-keyboard-interaction)
25. [Reduced Motion Rules](#25-reduced-motion-rules)
26. [When to Use Animation](#26-when-to-use-animation)
27. [When NOT to Use Animation](#27-when-not-to-use-animation)
28. [CSS Implementation Reference](#28-css-implementation-reference)

---

## 1. ANIMATION PHILOSOPHY

### Core Principles

Motion in Command Center PAMTAS serves **operational clarity**, not decoration.

| Principle | Application |
|-----------|-------------|
| **Purposeful** | Every animation communicates state change or hierarchy |
| **Subtle** | Never distracting from mission-critical data |
| **Fast** | Military precision — quick response, no delay |
| **Consistent** | Same behavior everywhere, predictable patterns |
| **Functional** | Motion guides attention to what matters |

### Animation Personality

- **Tactical**: Sharp, decisive transitions
- **Military-authentic**: Phospher green accents, radar-pulse motifs
- **Professional**: Serious without being sterile
- **Data-focused**: Visual hierarchy serves information architecture

---

## 2. MOTION HIERARCHY

### Layer Structure

```
┌─────────────────────────────────────────────────────────────┐
│ LEVEL 1: AMBIENT (Continuous)                               │
│ - Status pulses, scanlines, glitch effects                  │
│ - Always on, low cognitive load                            │
├─────────────────────────────────────────────────────────────┤
│ LEVEL 2: LAYOUT (Page-level)                              │
│ - Page transitions, panel slides                           │
│ - Triggered once per navigation                           │
├─────────────────────────────────────────────────────────────┤
│ LEVEL 3: COMPONENT (Element-level)                        │
│ - Button hovers, card reveals                             │
│ - Triggered on interaction                                │
├─────────────────────────────────────────────────────────────┤
│ LEVEL 4: FEEDBACK (Immediate)                              │
│ - Focus rings, loading spinners                           │
│ - Triggered continuously during processes                   │
└─────────────────────────────────────────────────────────────┘
```

### Z-Index Motion Layers

| Layer | Z-Index | Motion Type |
|-------|---------|-------------|
| Base content | 0 | Static |
| Panels | 10-20 | Slide, scale |
| Overlays | 100-200 | Fade, scale |
| Modal | 300-400 | Scale + fade |
| Toast | 500-600 | Slide + fade |
| Tooltip | 700 | Fade only |

---

## 3. DURATION SCALE

### Timing Tokens

```css
/* Instant — toggles, checkboxes */
--duration-instant: 50ms;

/* Fast — micro-interactions, focus */
--duration-fast: 100ms;

/* Normal — standard transitions */
--duration-normal: 150ms;

/* Smooth — component transitions */
--duration-smooth: 200ms;

/* Slow — dramatic reveals */
--duration-slow: 300ms;

/* Page — navigation transitions */
--duration-page: 400ms;
```

### Duration Guidelines

| Animation Type | Duration | Example |
|----------------|----------|---------|
| Instant feedback | 50ms | Checkbox toggle |
| Micro-interaction | 100ms | Hover color change |
| Standard transition | 150ms | Button state change |
| Component reveal | 200ms | Card fade-in |
| Panel entrance | 300ms | Sidebar slide |
| Page transition | 400ms | Full page load |

---

## 4. EASING CURVES

### Easing Tokens

```css
/* Spring-like for interactive elements */
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);

/* Balanced for state changes */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);

/* Linear for progress indicators */
--ease-linear: linear;

/* Bounce for celebration moments */
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Sharp for exit animations */
--ease-sharp: cubic-bezier(0.7, 0, 0.84, 0);

/* Elastic for attention */
--ease-elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);
```

### Easing Usage Map

| Animation | Easing | Rationale |
|-----------|--------|----------|
| Fade in | `--ease-out` | Natural deceleration |
| Slide in | `--ease-out` | Quick start, soft landing |
| Scale in | `--ease-out` | Smooth pop |
| Hover states | `--ease-out` | Responsive feel |
| Exit/Close | `--ease-sharp` | Quick dismissal |
| Loading | `--ease-linear` | Constant motion |
| Attention pulse | `--ease-in-out` | Rhythmic breathing |

---

## 5. HOVER BEHAVIOR

### Hover Duration

| Element Type | Duration | Properties |
|--------------|----------|-----------|
| Buttons | 150ms | background, border-color, color, box-shadow |
| Cards | 150ms | background, border-color, transform |
| Links | 100ms | color |
| Table rows | 150ms | background |
| Action icons | 150ms | color, background |

### Hover Pattern

```css
/* Standard hover transition */
.element {
  transition: all var(--duration-fast) var(--ease-out);
}

/* Hover state */
.element:hover {
  background: var(--surface-secondary);
  border-color: var(--accent-primary);
}

/* Leave state - smooth return */
.element {
  transition: all var(--duration-fast) var(--ease-out);
}
```

### Hover Color Hierarchy

```
Default → Hover → Active/Pressed
   ↓        ↓           ↓
Muted   Bright    Darker/Deeper
```

---

## 6. BUTTON INTERACTIONS

### Button States

| State | Duration | Visual Change |
|-------|----------|---------------|
| Default | — | Base styling |
| Hover | 150ms | Color shift, glow appears |
| Active/Pressed | 50ms | Scale(0.98), darker background |
| Disabled | — | 40% opacity, no pointer events |
| Loading | — | Spinner replaces content, disabled |

### Button Motion Spec

```css
/* Primary button hover */
.hud-btn:hover {
  background: rgba(0, 255, 136, 0.18);
  border-color: rgba(0, 255, 136, 0.7);
  box-shadow: var(--accent-glow);
}

/* Primary button active */
.hud-btn:active {
  transform: scale(0.98);
  background: rgba(0, 255, 136, 0.25);
}

/* Danger button hover */
.hud-btn-danger:hover {
  background: rgba(255, 51, 51, 0.18);
  border-color: rgba(255, 51, 51, 0.7);
  box-shadow: var(--shadow-glow-danger);
}
```

### Icon Button Motion

- Size: 32-36px touch target
- Hover: Background appears, icon color changes
- Active: Scale(0.95)
- Duration: 150ms

---

## 7. SIDEBAR ANIMATION

### Sidebar Properties

| Property | Value |
|----------|-------|
| Width | 240px (expanded), 64px (collapsed) |
| Transition | 200ms |
| Easing | `--ease-out` |
| Collapse animation | Width + icon rotation |

### Sidebar Motion

```css
.sidebar {
  transition: width var(--duration-smooth) var(--ease-out),
              transform var(--duration-smooth) var(--ease-out);
}

/* Collapsed state */
.sidebar.collapsed {
  width: 64px;
}

/* Menu items stagger on expand */
.sidebar-item {
  opacity: 0;
  transform: translateX(-8px);
  animation: slideInSidebar 200ms var(--ease-out) forwards;
}

.sidebar-item:nth-child(1) { animation-delay: 0ms; }
.sidebar-item:nth-child(2) { animation-delay: 50ms; }
.sidebar-item:nth-child(3) { animation-delay: 100ms; }
/* ... */
```

---

## 8. PANEL ANIMATION

### Panel Entrance

| Direction | Duration | Delay (stagger) | Easing |
|-----------|----------|------------------|--------|
| Fade in | 200ms | 0ms base | `--ease-out` |
| Slide from left | 300ms | 50ms | `--ease-out` |
| Slide from right | 300ms | 50ms | `--ease-out` |
| Slide from bottom | 200ms | 0ms | `--ease-out` |
| Scale in | 150ms | 0ms | `--ease-out` |

### Panel Keyframes

```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide in left */
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Slide in right */
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Scale in */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

### Stagger Utility Classes

```css
.stagger-1 { animation-delay: 50ms; }
.stagger-2 { animation-delay: 100ms; }
.stagger-3 { animation-delay: 150ms; }
.stagger-4 { animation-delay: 200ms; }
.stagger-5 { animation-delay: 250ms; }
```

---

## 9. DASHBOARD ANIMATION

### Overview Page Motion Flow

```
Page Load
    ↓
1. Background fade in (0ms)
    ↓
2. Metric cards fade in (0-200ms, stagger 30ms each)
    ↓
3. Map layer toggle bar slide up (200ms)
    ↓
4. Left panel slide in from left (200ms, delay 100ms)
    ↓
5. Right panel slide in from right (200ms, delay 100ms)
    ↓
6. Content animations (data updates, pulses)
```

### Metric Card Animation

| Phase | Animation | Duration |
|-------|-----------|----------|
| Enter | Fade in + subtle scale | 200ms |
| Hover | Border glow intensifies | 150ms |
| Update | Number morphs | 300ms |

### Real-time Update Animation

When data updates:
- Old value fades out (100ms)
- New value fades in (100ms)
- Accent pulse on change (danger = red pulse)

---

## 10. CHART ANIMATION

### Chart Entry Animation

| Chart Type | Duration | Easing | Effect |
|------------|----------|---------|--------|
| Bar chart | 500ms | `--ease-out` | Bars grow from bottom |
| Line chart | 600ms | `--ease-out` | Line draws from left |
| Pie chart | 500ms | `--ease-out` | Segments expand from center |
| Progress bar | 700ms | `--ease-out` | Width animates |

### Chart Hover Animation

| Element | Animation | Duration |
|---------|-----------|----------|
| Bar hover | Lighten + scale(1.02) | 150ms |
| Point hover | Scale(1.2) + tooltip appear | 100ms |
| Legend hover | Corresponding element highlights | 150ms |

---

## 11. MAP ANIMATION

### Map Motion Patterns

| Element | Animation | Duration |
|---------|-----------|----------|
| POS marker appear | Scale in + pulse ring | 300ms |
| Marker hover | Scale(1.2) + glow | 150ms |
| Popup open | Scale from marker | 200ms |
| Popup close | Scale to marker | 150ms |
| Layer toggle | Markers fade in/out | 200ms |
| Zoom | Native Leaflet smooth | 300ms |

### Status Pulse Animation

```css
/* Active threat pulse */
.status-dot-danger {
  animation: statusPulse 1s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}
```

---

## 12. LOADING ANIMATION

### Spinner Spec

| Property | Value |
|----------|-------|
| Size | 16px (sm), 24px (md), 32px (lg) |
| Border | 2px |
| Color | `var(--accent-primary)` |
| Animation | Rotate 360deg |
| Duration | 600ms per rotation |
| Easing | `--ease-linear` |

### Spinner Keyframe

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 600ms linear infinite;
}
```

### Button Loading State

When button is loading:
1. Content fades out (100ms)
2. Spinner fades in (100ms)
3. Button disabled (pointer-events: none)
4. On complete: spinner fades out, content fades in

---

## 13. SKELETON ANIMATION

### Skeleton Motion

| Property | Value |
|----------|-------|
| Animation | Pulse opacity |
| Duration | 1.5s |
| Easing | `--ease-in-out` |
| Range | opacity 0.4 → 0.8 |

### Skeleton Keyframe

```css
@keyframes shimmer {
  0% { opacity: 0.4; }
  50% { opacity: 0.7; }
  100% { opacity: 0.4; }
}

.skeleton {
  animation: shimmer 1.5s ease-in-out infinite;
}
```

### Skeleton Variants

```css
/* Row skeleton - for tables */
.skeleton-row {
  height: 40px;
  animation: shimmer 1.5s ease-in-out infinite;
}

/* Card skeleton - for content areas */
.skeleton-card {
  min-height: 120px;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

---

## 14. PAGE TRANSITION

### Page Enter Animation

```css
.page-enter {
  animation: fadeIn var(--duration-smooth) var(--ease-out);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Page Hierarchy

| Page Type | Animation | Duration |
|-----------|-----------|----------|
| Overview | Fade + map render | 200ms |
| List pages | Fade + list stagger | 200ms + 20ms/item |
| Detail pages | Fade in | 200ms |
| Modal pages | Scale + fade | 150ms |

---

## 15. MODAL TRANSITION

### Modal Enter

```css
.modal-overlay {
  animation: fadeInOverlay 200ms var(--ease-out);
}

.modal-content {
  animation: scaleIn 150ms var(--ease-out);
}

@keyframes fadeInOverlay {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

### Modal Exit

```css
.modal-overlay {
  animation: fadeOutOverlay 150ms var(--ease-sharp);
}

.modal-content {
  animation: scaleOut 150ms var(--ease-sharp);
}

@keyframes fadeOutOverlay {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes scaleOut {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.95); }
}
```

### Modal Timing

| Phase | Duration | Action |
|-------|----------|--------|
| Overlay appear | 200ms | Background fade in |
| Content appear | 150ms | Scale + fade in |
| Focus trap | Immediate | Keyboard accessible |
| Close click | 150ms | Scale + fade out |
| ESC key | 150ms | Same as close |

---

## 16. TOAST ANIMATION

### Toast Enter (from bottom)

```css
.toast-enter {
  animation: slideUp 200ms var(--ease-out);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Toast Exit

```css
.toast-exit {
  animation: fadeOut 150ms var(--ease-sharp);
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
```

### Toast Auto-dismiss

| Type | Duration | Animation |
|------|----------|-----------|
| Success | 3s visible | Slide up + fade out |
| Error | 5s visible | Slide up + fade out |
| Info | 3s visible | Slide up + fade out |

---

## 17. DROPDOWN ANIMATION

### Dropdown Enter

```css
.dropdown-menu {
  animation: scaleInY 150ms var(--ease-out);
  transform-origin: top center;
}

@keyframes scaleInY {
  from { opacity: 0; transform: scaleY(0.95); }
  to { opacity: 1; transform: scaleY(1); }
}
```

### Dropdown Item Stagger

```css
.dropdown-item:nth-child(1) { animation-delay: 0ms; }
.dropdown-item:nth-child(2) { animation-delay: 30ms; }
.dropdown-item:nth-child(3) { animation-delay: 60ms; }
.dropdown-item:nth-child(4) { animation-delay: 90ms; }
.dropdown-item:nth-child(5) { animation-delay: 120ms; }
/* Max 5 items animated */
```

---

## 18. TOOLTIP ANIMATION

### Tooltip Enter

```css
.tooltip {
  animation: fadeIn 100ms var(--ease-out);
  transition: opacity 100ms, visibility 100ms;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Tooltip Timing

| Property | Value |
|----------|-------|
| Delay appear | 400ms |
| Delay hide | 0ms |
| Duration | 100ms |
| Easing | `--ease-out` |

---

## 19. TABLE ANIMATION

### Table Row Animation

```css
.table-row {
  animation: fadeIn 150ms var(--ease-out);
  animation-fill-mode: both;
}

.table-row:nth-child(1) { animation-delay: 0ms; }
.table-row:nth-child(2) { animation-delay: 20ms; }
.table-row:nth-child(3) { animation-delay: 40ms; }
.table-row:nth-child(4) { animation-delay: 60ms; }
.table-row:nth-child(5) { animation-delay: 80ms; }
/* Stagger capped at 200ms total */
```

### Table Row Hover

```css
.table-row {
  transition: background var(--duration-fast) var(--ease-out);
}

.table-row:hover {
  background: var(--surface-secondary);
}
```

---

## 20. EXPANDABLE SECTION

### Expand Animation

```css
.expandable-content {
  animation: expandHeight 200ms var(--ease-out);
  overflow: hidden;
}

@keyframes expandHeight {
  from { height: 0; opacity: 0; }
  to { height: var(--content-height); opacity: 1; }
}
```

### Collapse Animation

```css
.collapsible-content {
  animation: collapseHeight 150ms var(--ease-sharp);
  overflow: hidden;
}

@keyframes collapseHeight {
  from { height: var(--content-height); opacity: 1; }
  to { height: 0; opacity: 0; }
}
```

---

## 21. ACCORDION

### Accordion Pattern

```css
.accordion-item {
  border-bottom: 1px solid var(--border-subtle);
}

.accordion-header {
  transition: background var(--duration-fast) var(--ease-out);
}

.accordion-header:hover {
  background: var(--hover-surface);
}

.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 200ms var(--ease-out);
}

.accordion-item.open .accordion-content {
  max-height: 500px; /* Or measured height */
}
```

---

## 22. MICRO INTERACTIONS

### Status Dot Pulse

```css
.status-dot {
  animation: statusPulse 2s ease-in-out infinite;
}

@keyframes statusPulse {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
    box-shadow: 0 0 6px rgba(0, 255, 136, 0.8);
  }
  50% { 
    opacity: 0.5; 
    transform: scale(0.85);
    box-shadow: 0 0 3px rgba(0, 255, 136, 0.4);
  }
}

/* Danger pulse - faster for critical */
.status-dot-danger {
  animation: statusPulse 1s ease-in-out infinite;
}
```

### Danger Pulse Alert

```css
.danger-pulse {
  animation: dangerPulse 1.5s ease-in-out infinite;
}

@keyframes dangerPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,51,51,0.3); }
  50% { box-shadow: 0 0 0 5px rgba(255,51,51,0); }
}
```

### Copy Success Flash

```css
.copy-flash {
  animation: flashSuccess 300ms var(--ease-out);
}

@keyframes flashSuccess {
  0% { background: var(--accent-muted); }
  50% { background: var(--accent-primary); }
  100% { background: var(--accent-muted); }
}
```

---

## 23. FOCUS ANIMATION

### Focus Ring

```css
:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--surface-base), 
              0 0 0 4px var(--accent-primary);
  transition: box-shadow var(--duration-fast) var(--ease-out);
}
```

### Focus Movement

When focus moves between elements:
- Previous focus ring fades out (100ms)
- New focus ring fades in (100ms)

---

## 24. KEYBOARD INTERACTION

### Tab Navigation

| Key | Action | Animation |
|-----|--------|-----------|
| Tab | Focus next element | Focus ring appears (100ms) |
| Shift+Tab | Focus previous | Focus ring appears (100ms) |
| Enter | Activate button | Scale(0.98) + action |
| Space | Toggle checkbox | Check animation |
| ESC | Close modal/dropdown | Exit animation (150ms) |

### Focus Trap (Modal)

When modal opens:
1. Save previously focused element
2. Move focus to modal content
3. Tab cycles within modal
4. Shift+Tab cycles within modal
5. ESC closes modal
6. Return focus to saved element

---

## 25. REDUCED MOTION RULES

### Prefers-Reduced-Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Motion Reduction Levels

| Level | Setting | Behavior |
|-------|---------|----------|
| Full | No preference | All animations |
| Reduced | prefers-reduced-motion | Instant transitions |
| None | Never animate | Disabled via CSS |

### Safe Animations (Always On)

Even with reduced motion, these remain:
- Loading indicators (essential feedback)
- Focus rings (accessibility requirement)
- Error states (critical communication)

---

## 26. WHEN TO USE ANIMATION

### ✅ USE Animation For:

| Context | Animation | Purpose |
|---------|-----------|---------|
| Page load | Fade in | Signal readiness |
| Panel entrance | Slide | Show spatial relationship |
| List items | Stagger | Orient user to structure |
| Button hover | Color shift | Confirm interactivity |
| Form validation | Border color | Immediate feedback |
| Data update | Number morph | Show change occurred |
| Modal open | Scale + fade | Focus attention |
| Toast appear | Slide up | Non-intrusive notification |
| Error state | Red pulse | Urgent attention |
| Success state | Green flash | Confirmation |
| Loading | Spinner | Ongoing process |
| Skeleton | Shimmer | Content loading |

### Animation Decision Tree

```
Is this state change important enough to animate?
│
├── Is it a page-level transition?
│   └── YES → Use fade/slide (200-300ms)
│
├── Is it user-initiated interaction?
│   └── YES → Use hover/press feedback (100-150ms)
│
├── Does it communicate status?
│   └── YES → Use pulse/flash (continuous or 1x)
│
├── Is it loading content?
│   └── YES → Use skeleton shimmer
│
└── NO → Don't animate
```

---

## 27. WHEN NOT TO USE ANIMATION

### ❌ DO NOT Use Animation For:

| Context | Reason | Alternative |
|---------|--------|-------------|
| Rapid data updates | Distracting | Occasional pulse only |
| Every single hover | Cognitive load | Key elements only |
| Decorative purposes | Performance cost | Remove entirely |
| Critical alerts | Delay recognition | Instant state change |
| Small touch targets | Imprecise | Static highlight |
| During active operations | Focus loss | Disable during ops mode |
| Print/PDF output | Irrelevant | Remove via @media print |

### Animation Anti-Patterns

1. **Excessive stagger** — More than 5 items with stagger = delay fatigue
2. **Slow transitions** — Over 400ms for simple state changes = laggy feel
3. **Competing animations** — Multiple elements animating simultaneously = chaos
4. **Bounce on critical data** — Playful easing on danger = inappropriate
5. **Infinite loops** — Except status indicators and loaders = distraction

---

## 28. CSS IMPLEMENTATION REFERENCE

### Animation Utilities

```css
/* ── Fade animations ──────────────── */
.animate-fade-in {
  animation: fadeIn var(--duration-smooth) var(--ease-out);
}

/* ── Slide animations ──────────────── */
.animate-slide-in-left {
  animation: slideInLeft var(--duration-slow) var(--ease-out);
}

.animate-slide-in-right {
  animation: slideInRight var(--duration-slow) var(--ease-out);
}

.animate-slide-up {
  animation: slideUp var(--duration-smooth) var(--ease-out);
}

/* ── Scale animations ──────────────── */
.animate-scale-in {
  animation: scaleIn var(--duration-normal) var(--ease-out);
}

/* ── Stagger delays ───────────────── */
.stagger-1 { animation-delay: 50ms; }
.stagger-2 { animation-delay: 100ms; }
.stagger-3 { animation-delay: 150ms; }
.stagger-4 { animation-delay: 200ms; }
.stagger-5 { animation-delay: 250ms; }

/* ── Continuous animations ─────────── */
.animate-pulse {
  animation: statusPulse 2s ease-in-out infinite;
}

.animate-spin {
  animation: spin 600ms linear infinite;
}

/* ── Reduced motion ───────────────── */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-slide-in-left,
  .animate-slide-in-right,
  .animate-scale-in {
    animation: none;
  }
}
```

### Keyframe Definitions

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## QUICK REFERENCE CARD

### Duration Cheat Sheet

| Speed | ms | Use Case |
|-------|-----|----------|
| ⚡ Instant | 50 | Toggles |
| ⚡ Fast | 100 | Hover color, focus |
| ⚡ Normal | 150 | Button states |
| ⚡ Smooth | 200 | Component transitions |
| ⚡ Slow | 300 | Panel slides |
| ⚡ Page | 400 | Full page |

### Easing Cheat Sheet

| Curve | Use |
|-------|-----|
| `ease-out` | Most animations |
| `ease-sharp` | Exit/close only |
| `ease-linear` | Spinners/loaders |
| `ease-in-out` | Pulse/breathing |

### Animation Checklist

- [ ] Purpose: Does this animation communicate something?
- [ ] Duration: Is it under 400ms for UI, 600ms for page?
- [ ] Easing: Is it `ease-out` for enter, `ease-sharp` for exit?
- [ ] Reduced motion: Does it respect `prefers-reduced-motion`?
- [ ] Performance: Does it use `transform` and `opacity` only?
- [ ] Accessibility: Does it not cause seizures or vestibular issues?

---

*End of Motion Bible*
