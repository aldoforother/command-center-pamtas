# COMPONENT BIBLE — Foundation Components

**Date:** 2026-06-28
**Version:** 1.1.0
**Branch:** `feature/ui-evolution-v1`

---

## TABLE OF CONTENTS

1. [Overview](#overview)
2. [Design Tokens Used](#design-tokens-used)
3. [Motion Bible Compliance](#motion-bible-compliance)
4. [Button](#button)
5. [Input](#input)
6. [Select](#select)
7. [Textarea](#textarea)
8. [Checkbox](#checkbox)
9. [Radio](#radio)
10. [Switch](#switch)
11. [Badge](#badge)
12. [Card](#card)
13. [Panel](#panel)
14. [Divider](#divider)
15. [Tooltip](#tooltip)
16. [Usage Guidelines](#usage-guidelines)
17. [Navigation Components](#navigation-components)
    - [Sidebar](#sidebar)
    - [TopBar](#topbar)
    - [Tabs](#tabs)
    - [Breadcrumb](#breadcrumb)
    - [Dropdown](#dropdown)
    - [ContextMenu](#contextmenu)

---

## OVERVIEW

Foundation components adalah reusable UI components yang dibangun di atas Design System Foundation v2.0. Semua komponen menggunakan CSS custom properties (tokens) untuk konsistensi visual dan motion tokens sesuai Motion Bible spec.

**Principles:**
- Semantic props dengan sensible defaults
- Full ARIA support untuk accessibility
- Reduced motion support
- Consistent sizing scale (sm/md/lg)
- CSS tokens untuk semua visual properties

---

## DESIGN TOKENS USED

### Surface Tokens
```css
--surface-base         /* #030305 */
--surface-primary      /* #080B10 */
--surface-secondary    /* #0C1015 */
--surface-tertiary     /* #101420 */
--surface-interactive  /* #141825 */
--surface-muted        /* #181D28 */
```

### Border Tokens
```css
--border-subtle   /* rgba(255,255,255,0.06) */
--border-default  /* rgba(255,255,255,0.10) */
--border-strong   /* rgba(255,255,255,0.16) */
--border-focus    /* rgba(0,255,136,0.6) */
--border-danger   /* rgba(255,59,59,0.6) */
```

### Text Tokens
```css
--text-primary    /* #FFFFFF */
--text-secondary  /* #B4BAC8 */
--text-tertiary   /* #6B748C */
--text-disabled   /* #3D4456 */
```

### Semantic Tokens
```css
--accent-primary, --accent-muted, --accent-hover
--color-success, --color-success-subtle
--color-warning, --color-warning-subtle
--color-danger, --color-danger-subtle
--color-info, --color-info-subtle
--color-purple, --color-purple-subtle
--color-pink, --color-pink-subtle
--color-orange, --color-orange-subtle
--color-gray, --color-gray-subtle
```

### Shadow Tokens
```css
--shadow-none, --shadow-xs, --shadow-sm, --shadow-md, --shadow-lg
--shadow-glow, --shadow-glow-sm, --shadow-glow-lg
--shadow-glow-danger, --shadow-glow-warning, --shadow-glow-info
```

### Radius Tokens
```css
--radius-none, --radius-sm, --radius-badge
--radius-md, --radius-lg, --radius-xl
--radius-2xl, --radius-full
```

---

## MOTION BIBLE COMPLIANCE

### Timing Tokens
```css
--duration-instant  /* 50ms  - press feedback */
--duration-fast     /* 100ms - hover, focus */
--duration-normal   /* 150ms - standard transitions */
--duration-smooth   /* 200ms - component transitions */
--duration-slow     /* 300ms - dramatic reveals */
--duration-page     /* 400ms - navigation */
```

### Easing Tokens
```css
--ease-out      /* cubic-bezier(0.16, 1, 0.3, 1) - enter, hover */
--ease-in-out   /* cubic-bezier(0.65, 0, 0.35, 1) - pulse, breathing */
--ease-linear   /* linear - loaders */
--ease-bounce   /* cubic-bezier(0.34, 1.56, 0.64, 1) - celebration */
--ease-sharp    /* cubic-bezier(0.7, 0, 0.84, 0) - exit, close */
```

### Motion Specs by Component

| Component | Hover | Focus | Active/Press | Loading |
|-----------|-------|-------|--------------|---------|
| Button | 100ms | 100ms | 50ms (scale 0.98) | spinner |
| Input | 100ms | 150ms | - | - |
| Select | 100ms | 150ms | - | - |
| Checkbox | 100ms | 100ms | - | - |
| Radio | 100ms | 100ms | - | - |
| Switch | 100ms | 100ms | 200ms toggle | - |
| Card | 150ms lift | - | 50ms (scale 0.99) | - |
| Panel | - | - | 150ms (collapsible) | - |
| Tooltip | 400ms delay | 100ms | - | - |

---

## BUTTON

**File:** `src/components/ui/Button.jsx`

### Variants

| Variant | Purpose | Use Case |
|---------|---------|----------|
| `primary` | Primary action | Main CTAs |
| `secondary` | Secondary action | Alternative actions |
| `ghost` | Tertiary action | Subtle actions |
| `danger` | Destructive action | Delete, remove |
| `outline` | Neutral action | Less prominent actions |

### Sizes

| Size | Height | Font Size | Use Case |
|------|--------|-----------|----------|
| `sm` | 32px | 11px | Compact UI, tables |
| `md` | 40px | 12px | Default |
| `lg` | 48px | 13px | Primary CTAs, touch |

### Props

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  ariaLabel?: string
  ariaDescribedBy?: string
  onClick?: (e: MouseEvent) => void
  type?: 'button' | 'submit' | 'reset'
}
```

### Usage

```tsx
import { Button } from '../components/ui/Button'

// Basic
<Button>Simpan</Button>

// With variant
<Button variant="danger">Hapus</Button>

// With icon
<Button icon={<PlusIcon />} variant="primary">
  Tambah Baru
</Button>

// Loading state
<Button loading={isSubmitting}>Memproses...</Button>

// Icon button
<IconButton icon={<SettingsIcon />} aria-label="Pengaturan" />
```

### Motion Spec

- **Hover:** 100ms, bg/border/shadow transition, `ease-out`
- **Active:** 50ms, scale(0.98), `ease-out`
- **Focus:** focus-visible ring 3px offset

---

## INPUT

**File:** `src/components/ui/Input.jsx`

### Sizes

| Size | Height | Font Size |
|------|--------|-----------|
| `sm` | 32px | 11px |
| `md` | 36px | 12px |
| `lg` | 44px | 13px |

### Props

```tsx
interface InputProps {
  label?: string
  error?: string
  helper?: string
  hint?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  clearable?: boolean
  onClear?: () => void
  required?: boolean
  type?: string
  placeholder?: string
}
```

### Usage

```tsx
import { Input } from '../components/ui/Input'

// Basic
<Input label="Nama" placeholder="Masukkan nama" />

// With validation
<Input
  label="Email"
  type="email"
  error={errors.email}
  required
/>

// With icon
<Input
  label="Search"
  icon={<SearchIcon />}
  iconPosition="left"
  placeholder="Cari..."
/>

// Clearable
<Input
  label="Tags"
  value={tags}
  clearable
  onClear={() => setTags('')}
/>
```

### Motion Spec

- **Focus:** 150ms border color transition, `ease-out`
- **Focus ring:** 3px offset, accent color with 10% opacity

---

## SELECT

**File:** `src/components/ui/Select.jsx`

### Sizes

| Size | Height | Font Size |
|------|--------|-----------|
| `sm` | 32px | 11px |
| `md` | 36px | 12px |
| `lg` | 44px | 13px |

### Props

```tsx
interface SelectProps {
  label?: string
  error?: string
  helper?: string
  options: Array<{ label: string; value: string; disabled?: boolean }>
  placeholder?: string
  disabled?: boolean
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
}
```

### Usage

```tsx
import { Select } from '../components/ui/Select'

const options = [
  { label: 'Indonesia', value: 'id' },
  { label: 'Malaysia', value: 'my' },
  { label: 'Singapura', value: 'sg' },
]

<Select
  label="Negara"
  options={options}
  placeholder="Pilih negara"
  error={errors.country}
/>
```

### Motion Spec

- **Focus:** 150ms border color transition
- **Chevron:** inherits focus color

---

## TEXTAREA

**File:** `src/components/ui/Textarea.jsx`

### Sizes

| Size | Min Height | Font Size |
|------|------------|-----------|
| `sm` | 80px | 11px |
| `md` | 100px | 12px |
| `lg` | 120px | 13px |

### Props

```tsx
interface TextareaProps {
  label?: string
  error?: string
  helper?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  autoResize?: boolean
  maxLength?: number
  showCount?: boolean
}
```

### Usage

```tsx
import { Textarea } from '../components/ui/Textarea'

// Basic
<Textarea label="Keterangan" placeholder="Masukkan keterangan" />

// With character count
<Textarea
  label="Deskripsi"
  maxLength={500}
  showCount
/>

// Auto-resize
<Textarea
  label="Catatan"
  autoResize
/>
```

---

## CHECKBOX

**File:** `src/components/ui/Checkbox.jsx`

### Sizes

| Size | Box | Icon | Gap |
|------|-----|------|-----|
| `sm` | 14px | 10px | 6px |
| `md` | 16px | 12px | 8px |
| `lg` | 18px | 14px | 10px |

### Props

```tsx
interface CheckboxProps {
  label?: string
  checked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  error?: string
  size?: 'sm' | 'md' | 'lg'
  onChange?: (e: ChangeEvent) => void
}
```

### Usage

```tsx
import { Checkbox, CheckboxGroup } from '../components/ui/Checkbox'

// Basic
<Checkbox
  label="Saya setuju dengan syarat dan ketentuan"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>

// Indeterminate
<Checkbox
  label="Pilih semua"
  indeterminate={isIndeterminate}
  checked={allChecked}
  onChange={handleSelectAll}
/>

// Group
<CheckboxGroup
  label="Hobi"
  options={[
    { label: 'Olahraga', value: 'sports' },
    { label: 'Musik', value: 'music' },
    { label: 'Membaca', value: 'reading' },
  ]}
  value={selectedHobbies}
  onChange={setSelectedHobbies}
/>
```

### Motion Spec

- **Check animation:** 150ms scale-in with check icon
- **Hover:** 100ms border color transition

---

## RADIO

**File:** `src/components/ui/Radio.jsx`

### Sizes

| Size | Box | Dot | Gap |
|------|-----|-----|-----|
| `sm` | 14px | 6px | 6px |
| `md` | 16px | 8px | 8px |
| `lg` | 18px | 10px | 10px |

### Props

```tsx
interface RadioProps {
  label?: string
  checked?: boolean
  disabled?: boolean
  error?: string
  size?: 'sm' | 'md' | 'lg'
  name?: string
  value?: string
  onChange?: (e: ChangeEvent) => void
}
```

### Usage

```tsx
import { Radio, RadioGroup } from '../components/ui/Radio'

// Group
<RadioGroup
  label="Prioritas"
  name="priority"
  value={priority}
  onChange={setPriority}
  options={[
    { label: 'Tinggi', value: 'high' },
    { label: 'Sedang', value: 'medium' },
    { label: 'Rendah', value: 'low' },
  ]}
/>
```

### Motion Spec

- **Select animation:** 150ms dot scale-in
- **Hover:** 100ms border color transition

---

## SWITCH

**File:** `src/components/ui/Switch.jsx`

### Sizes

| Size | Width | Height | Thumb |
|------|-------|--------|-------|
| `sm` | 32px | 18px | 12px |
| `md` | 40px | 22px | 16px |
| `lg` | 48px | 26px | 20px |

### Props

```tsx
interface SwitchProps {
  label?: string
  checked?: boolean
  disabled?: boolean
  error?: string
  size?: 'sm' | 'md' | 'lg'
  onChange?: (e: ChangeEvent) => void
}
```

### Usage

```tsx
import { Switch, SwitchGroup } from '../components/ui/Switch'

// Basic
<Switch
  label="Aktifkan notifikasi"
  checked={notifications}
  onChange={(e) => setNotifications(e.target.checked)}
/>

// Group
<SwitchGroup
  label="Pengaturan Tampilan"
  items={[
    { key: 'darkMode', label: 'Mode Gelap' },
    { key: 'compact', label: 'Tampilan Kompak' },
    { key: 'animations', label: 'Animasi' },
  ]}
  value={settings}
  onChange={setSettings}
/>
```

### Motion Spec

- **Toggle animation:** 200ms thumb translate, `ease-out`
- **Track color:** 200ms background transition

---

## BADGE

**File:** `src/components/ui/Badge.jsx`

### Variants

| Variant | Color | Use Case |
|---------|-------|----------|
| `default` | Gray | Neutral status |
| `success` | Green | Success, active |
| `warning` | Amber | Warning, pending |
| `danger` | Red | Error, critical |
| `info` | Blue | Info, neutral |
| `accent` | Phosphor Green | Accent highlight |
| `purple` | Purple | Special category |
| `orange` | Orange | Alert category |
| `pink` | Pink | Special category |
| `gray` | Gray | Muted status |

### Props

```tsx
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'purple' | 'orange' | 'pink' | 'gray'
  dot?: boolean
  pulse?: boolean
}
```

### Usage

```tsx
import { Badge, StatusDot, BadgeGroup } from '../components/ui/Badge'

// Basic
<Badge variant="success">Aktif</Badge>

// With dot indicator
<Badge variant="danger" dot pulse>
  Critical
</Badge>

// Status dot
<StatusDot status="active" size="md" pulse />

// Group
<BadgeGroup
  badges={[
    { key: 1, label: 'Baru', variant: 'info' },
    { key: 2, label: 'Pending', variant: 'warning' },
    { key: 3, label: 'Selesai', variant: 'success' },
  ]}
/>
```

### Motion Spec

- **Dot pulse:** 2s `ease-in-out` infinite (statusPulse keyframe)

---

## CARD

**File:** `src/components/ui/Card.jsx`

### Variants

| Variant | Background | Border | Shadow |
|---------|------------|--------|--------|
| `surface` | primary | subtle | none |
| `elevated` | secondary | default | md |
| `interactive` | primary | default | none (lift on hover) |
| `metric` | primary | none | none |

### Sub-components

- `CardHeader` - Header with icon, title, badge, actions
- `CardContent` - Content wrapper
- `CardFooter` - Footer with actions
- `StatCard` - Metric display card

### Props

```tsx
interface CardProps {
  variant?: 'surface' | 'elevated' | 'interactive' | 'metric'
  padding?: boolean
  hoverable?: boolean
  onClick?: () => void
}
```

### Usage

```tsx
import { Card, CardHeader, CardContent, CardFooter, StatCard } from '../components/ui/Card'

// Basic card
<Card variant="surface">
  <CardHeader title="Statistik" icon={<ChartIcon />} />
  <CardContent>
    <p>Content here</p>
  </CardContent>
  <CardFooter>
    <Button size="sm">Lihat Detail</Button>
  </CardFooter>
</Card>

// Stat card
<StatCard
  label="Total Personel"
  value="128"
  trend="+12%"
  trendDirection="up"
  icon={<UsersIcon />}
/>
```

### Motion Spec

- **Hover:** 150ms bg/border/shadow lift, `ease-out`
- **Press:** 50ms scale(0.99), `ease-out`

---

## PANEL

**File:** `src/components/ui/Panel.jsx`

### Variants

| Variant | Background | Border |
|---------|------------|--------|
| `default` | primary | subtle |
| `elevated` | secondary | default |
| `flush` | transparent | transparent |

### Sub-components

- `PanelHeader` - Header with icon, title, subtitle, badge, actions
- `PanelContent` - Scrollable content area
- `PanelFooter` - Footer with actions
- `PanelSection` - Collapsible section

### Props

```tsx
interface PanelProps {
  variant?: 'default' | 'elevated' | 'flush'
  padding?: boolean
}
```

### Usage

```tsx
import { Panel, PanelHeader, PanelContent, PanelSection } from '../components/ui/Panel'

<Panel variant="elevated">
  <PanelHeader
    title="Detail Pos"
    subtitle="Batasan"
    icon={<MapPinIcon />}
  />
  <PanelContent>
    <PanelSection title="Informasi Umum">
      <p>Content here</p>
    </PanelSection>
    <PanelSection title="Personel" collapsible defaultOpen={false}>
      <p>Collapsible content</p>
    </PanelSection>
  </PanelContent>
</Panel>
```

### Motion Spec

- **Collapsible:** 150ms height transition, `ease-out`

---

## DIVIDER

**File:** `src/components/ui/Divider.jsx`

### Variants

| Variant | Color |
|---------|-------|
| `subtle` | border-subtle |
| `default` | border-default |
| `strong` | border-strong |

### Props

```tsx
interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'subtle' | 'default' | 'strong'
  label?: string
}
```

### Usage

```tsx
import { Divider, SpaceDivider } from '../components/ui/Divider'

// Basic
<Divider />

// With label
<Divider label="atau" />

// Vertical
<Divider orientation="vertical" />

// Space divider (with padding)
<SpaceDivider label="Section" />
```

---

## TOOLTIP

**File:** `src/components/ui/Tooltip.jsx`

### Positions

| Position | Placement | Arrow Direction |
|----------|-----------|-----------------|
| `top` | below | pointing up |
| `bottom` | above | pointing down |
| `left` | right | pointing left |
| `right` | left | pointing right |

### Props

```tsx
interface TooltipProps {
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  disabled?: boolean
}
```

### Usage

```tsx
import { Tooltip } from '../components/ui/Tooltip'

<Tooltip content="Informasi tambahan" position="top">
  <button>Hover saya</button>
</Tooltip>

// With longer delay
<Tooltip content="Help text" delay={600}>
  <IconButton icon={<HelpIcon />} />
</Tooltip>
```

### Motion Spec

- **Appear delay:** 400ms
- **Enter animation:** 100ms fade-in, `ease-out`
- **Hide:** instant (no delay)

---

## USAGE GUIDELINES

### Import Pattern

```tsx
// Recommended: named imports
import { Button, Input, Badge } from '../components/ui'

// Or individual imports
import { Button } from '../components/ui/Button'
```

### Sizing Consistency

| Element | Recommended Size |
|---------|-----------------|
| Forms | md (36-44px height) |
| Tables | sm (32px height) |
| Primary CTAs | lg (48px height) |
| Icon buttons | md (40px) |
| Dense UI | sm (32px) |

### Accessibility Checklist

- [ ] All form inputs have labels
- [ ] Error messages linked with `aria-describedby`
- [ ] Required fields marked with `aria-required`
- [ ] Loading states use `aria-busy`
- [ ] Icon-only buttons have `aria-label`
- [ ] Interactive cards have clear focus states

### Performance Tips

- Use `forwardRef` for refs to native elements
- Memoize callbacks with `useCallback` when passing to components
- Use `disabled` prop instead of conditional rendering for layout stability

---

## FILE STRUCTURE

```
src/components/ui/
├── Button.jsx       ✅ Primary button with variants
├── Input.jsx        ✅ Form input with validation
├── Select.jsx       ✅ Dropdown select
├── Textarea.jsx     ✅ Multi-line text input
├── Checkbox.jsx      ✅ Checkbox with group
├── Radio.jsx         ✅ Radio with group
├── Switch.jsx        ✅ Toggle switch with group
├── Badge.jsx         ✅ Status badges + StatusDot
├── Card.jsx          ✅ Card + StatCard
├── Panel.jsx         ✅ Panel with sections
├── Divider.jsx       ✅ Divider + SpaceDivider
├── Tooltip.jsx       ✅ Contextual tooltip
├── Tabs.jsx          ✅ Tab navigation
├── Breadcrumb.jsx    ✅ Breadcrumb navigation (NEW)
├── Dropdown.jsx      ✅ Dropdown menu
├── ContextMenu.jsx   ✅ Context menu (NEW)
├── Modal.jsx         ✅ Modal dialog
├── Toast.jsx         ✅ Toast notifications
├── ConfirmDialog.jsx ✅ Confirmation dialog
├── Table.jsx         ✅ Data table
├── LoadingSpinner.jsx ✅ Spinner + Skeleton
├── EmptyState.jsx    ✅ Empty state
├── PageErrorBoundary.jsx ✅ Error boundary
├── PhotoGallery.jsx  ✅ Photo gallery
├── StatChip.jsx      ✅ Compact stat display
├── ReportTable.jsx   ✅ Report table
└── index.js          ✅ Barrel export
```

---

## NAVIGATION COMPONENTS

### Sidebar

**File:** `src/components/layout/Sidebar.jsx`

### Props

```tsx
interface SidebarProps {
  id?: string
}
```

### Motion Spec

- **Width transition:** 200ms ease-out
- **NavItem hover:** 100ms ease-out
- **POS Item hover:** 100ms ease-out

---

### TopBar

**File:** `src/components/layout/TopBar.jsx`

### Motion Spec

- **Button hover:** 100ms ease-out
- **Focus ring:** 100ms ease-out

---

### Tabs

**File:** `src/components/ui/Tabs.jsx`

#### Props

```tsx
interface TabsProps {
  tabs: Array<{
    value: string
    label: string
    content: ReactNode
    icon?: ReactNode
    badge?: number
  }>
  defaultTab?: string
  onChange?: (tab) => void
}
```

#### Usage

```tsx
import { Tabs } from '../components/ui'

<Tabs
  tabs={[
    { value: 'info', label: 'Informasi', content: <InfoPanel /> },
    { value: 'demografi', label: 'Demografi', content: <DemografiPanel /> },
    { value: 'tokoh', label: 'Tokoh', badge: 5, content: <TokohPanel /> },
  ]}
  defaultTab="info"
  onChange={(tab) => console.log(tab.value)}
/>
```

#### Keyboard Navigation

- Arrow keys: Navigate between tabs
- Home: Jump to first tab
- End: Jump to last tab

#### Motion Spec

- **Tab hover:** 100ms ease-out
- **Active indicator:** 150ms ease-out
- **Content fade-in:** 150ms ease-out

---

### Breadcrumb

**File:** `src/components/ui/Breadcrumb.jsx`

#### Props

```tsx
interface BreadcrumbProps {
  items: Array<{
    href?: string
    label: string
    icon?: ReactNode
    type?: 'link' | 'text' | 'ellipsis'
  }>
  separator?: ReactNode | string
  maxItems?: number
}
```

#### Usage

```tsx
import { Breadcrumb } from '../components/ui'

<Breadcrumb
  items={[
    { href: '/', label: 'Home' },
    { href: '/pos', label: 'POS' },
    { label: 'POS-01 Batasan' },
  ]}
  separator="/"
  maxItems={5}
/>
```

---

### Dropdown

**File:** `src/components/ui/Dropdown.jsx`

#### Props

```tsx
interface DropdownProps {
  trigger: ReactNode
  items: Array<{
    id?: string | number
    label: string
    onClick?: () => void
    icon?: ReactNode
    danger?: boolean
    disabled?: boolean
    shortcut?: string
    divider?: boolean
  }>
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  disabled?: boolean
}
```

#### Usage

```tsx
import { Dropdown } from '../components/ui'

<Dropdown
  trigger={<Button>Menu</Button>}
  items={[
    { label: 'Edit', onClick: () => {}, shortcut: '⌘E' },
    { label: 'Duplicate', onClick: () => {} },
    { divider: true },
    { label: 'Hapus', onClick: () => {}, danger: true },
  ]}
  position="bottom-left"
/>
```

#### Keyboard Navigation

- Escape: Close menu
- Arrow keys: Navigate items
- Enter: Select item

#### Motion Spec

- **Menu appear:** 150ms scale-in ease-out
- **Item stagger:** 20ms per item
- **Item hover:** 100ms ease-out

---

### ContextMenu

**File:** `src/components/ui/ContextMenu.jsx`

#### Props

```tsx
interface ContextMenuProps {
  children: ReactNode
  items: Array<{
    id?: string | number
    label: string
    onClick?: () => void
    icon?: ReactNode
    danger?: boolean
    disabled?: boolean
    shortcut?: string
    divider?: boolean
  }>
}
```

#### Usage

```tsx
import { ContextMenu, ContextMenuItem, ContextMenuDivider } from '../components/ui'

<ContextMenu
  items={[
    ContextMenuItem({ label: 'Edit', onClick: handleEdit }),
    ContextMenuItem({ label: 'Duplicate', onClick: handleDuplicate }),
    ContextMenuDivider(),
    ContextMenuItem({ label: 'Hapus', onClick: handleDelete, danger: true }),
  ]}
>
  <Card>Right-click me</Card>
</ContextMenu>
```

#### useContextMenu Hook

```tsx
import { useContextMenu } from '../components/ui'

function MyComponent() {
  const { isOpen, show, hide, toggle, ContextMenuContent } = useContextMenu(items)

  return (
    <>
      <div onContextMenu={show}>Right-click me</div>
      <ContextMenuContent />
    </>
  )
}
```

---

*End of Component Bible v1.1.0*
*Project: Command Center PAMTAS - Yonkav 8/NSW Ta 2026*