# DASHBOARD BUTTON INVENTORY
Generated: 2026-07-02
Updated: 2026-07-02 (v2)

---

## LOGIN PAGE (`/login`)
```
[LoginPage]
├── [Branding]
│   ├── text "NARASINGA OPERATION CENTER"
│   └── text "── OPERATOR ID" / "── ACCESS KEY"
│
└── [Form]
    ├── input[type="email"]
    ├── input[type="password"]
    └── button[type="submit"] "MASUK SISTEM"
```

---

## HOME PAGE (`/`)
```
[HomePage]
├── [Hero Banner]
│   ├── text "NARASINGA SIAGA"
│   ├── text "PERBATASAN TERJAGA"
│   ├── text "SATGAS PAMTAS RI-MLY YONKAV 8/NSW TA 2026"
│   └── img "Logo" (logo-satgas.png)
│
├── [HUD Stats] - 3x2 Grid Layout
│   ├── StatPanel "PERSONEL" (value)
│   ├── StatPanel "POS AKTIF" (value)
│   ├── StatPanel "INSIDEN" (value)
│   ├── ActionButton "OVERVIEW" (→ /overview)
│   ├── ActionButton "INSIDEN" (→ /insiden)
│   └── ActionButton "LAPORAN" (→ /laporan/kerawanan)
│
└── [Sidebar Navigation] - Collapsible (180px width)
    ├── NAVIGASI
    │   ├── a[href="/"] "Home"
    │   ├── a[href="/overview"] "Overview"
    │   ├── a[href="/insiden"] "Data Insiden" (badge: count)
    │   └── a[href="/binter"] "Program Binter"
    │
    ├── LAPORAN
    │   ├── a[href="/laporan/kerawanan"] "Grafik Insiden"
    │   ├── a[href="/laporan/binter"] "Timeline Binter"
    │   ├── a[href="/laporan/demografi"] "Data Demografi"
    │   └── a[href="/laporan/tokoh"] "Tokoh Wilayah"
    │
    ├── 17 POS SATGAS
    │   ├── a[href="/pos/KOTIS"] "KT - POS KOTIS"
    │   ├── a[href="/pos/AJ"] "AJ - Pos Aji Kuning"
    │   └── ... (all POS)
    │
    └── PENGATURAN
        ├── a[href="/panduan"] "Panduan Input"
        └── a[href="/admin"] "Pengaturan" (admin only)
```

---

## OVERVIEW PAGE (`/overview`)
```
[OverviewPage]
├── [Sidebar] (same as Home)
│
├── [MapContainer]
│   ├── [Leaflet Map]
│   │   ├── map markers (POS locations)
│   │   └── popup on marker click
│   ├── button[zoom in]
│   └── button[zoom out]
│
├── [MapLayerBar]
│   ├── button[toggle layers]
│   └── dropdown layer options
│
└── [Panel Container]
    ├── [KerawananPanel]
    │   └── button[expand/collapse]
    │
    └── [BinterPanel]
        └── button[expand/collapse]
```

---

## POS DETAIL PAGE (`/pos/:posId`)
```
[PosDetailPage]
├── [Header]
│   ├── button[Kembali] "← Kembali"
│   └── button[Cetak Laporan] "📄 Cetak / Simpan PDF"
│
├── [Info Pills]
│   ├── InfoPill "Komandan"
│   ├── InfoPill "Personel"
│   ├── InfoPill "Penduduk"
│   ├── InfoPill "Insiden"
│   └── InfoPill "Klasifikasi"
│
└── [Content Area]
    ├── [Tab Navigation] - Urutan Kiri ke Kanan:
    │   ├── button[role="tab"] "INFO POS"
    │   ├── button[role="tab"] "DEMOGRAFI"
    │   ├── button[role="tab"] "GEO-DEMO-KONSOS"
    │   ├── button[role="tab"] "TOKOH"
    │   ├── button[role="tab"] "BINTER"
    │   ├── button[role="tab"] "DATA INSIDEN"
    │   ├── button[role="tab"] "PATROLI"
    │   └── button[role="tab"] "DOKUMENTASI"
    │
    └── [Tab Content]
        ├── [INFO POS]
        │   ├── button[Edit Pos] "✎ Edit"
        │   └── map placeholder
        │
        ├── [DEMOGRAFI]
        │   ├── [DemografiTable]
        │   │   ├── button[Tambah Data]
        │   │   ├── button[Edit Row] (per row)
        │   │   └── button[Delete Row] (per row)
        │   └── [EditDemografiForm] (modal)
        │       ├── input fields
        │       ├── button[Batal]
        │       └── button[Simpan]
        │
        ├── [GEO-DEMO-KONSOS]
        │   └── [GeoDemoKonsos]
        │       ├── GeoJSON map
        │       └── Konsos data visualization
        │
        ├── [TOKOH]
        │   ├── [TokohList]
        │   │   ├── button[Tambah Tokoh]
        │   │   ├── button[Edit Tokoh] (per card)
        │   │   └── button[Hapus Tokoh] (per card)
        │   └── [TokohForm] (modal)
        │       ├── input fields
        │       ├── button[Batal]
        │       └── button[Simpan]
        │
        ├── [BINTER]
        │   ├── [BinterList]
        │   │   ├── button[Tambah Binter]
        │   │   ├── button[Edit Binter] (per row)
        │   │   └── button[Hapus Binter] (per row)
        │   └── [BinterForm] (modal)
        │       ├── input fields
        │       ├── button[Batal]
        │       └── button[Simpan]
        │
        ├── [DATA INSIDEN]
        │   ├── [KerawananList]
        │   │   ├── button[Tambah Insiden]
        │   │   ├── button[Edit Insiden] (per card)
        │   │   └── button[Hapus Insiden] (per card)
        │   └── [KerawananForm] (modal)
        │       ├── input fields
        │       ├── button[Batal]
        │       └── button[Simpan]
        │
        ├── [PATROLI]
        │   ├── [PatroliList]
        │   │   ├── button[Tambah Patroli]
        │   │   ├── button[Edit Patroli] (per row)
        │   │   └── button[Hapus Patroli] (per row)
        │   └── [PatroliForm] (modal)
        │       ├── input fields
        │       ├── button[Batal]
        │       └── button[Simpan]
        │
        └── [DOKUMENTASI]
            └── [PhotoGallery]
                └── Image grid with lightbox
```

---

## INSIDEN PAGE (`/insiden`)
```
[InsidenPage]
├── [Header]
│   └── button[Download PDF]
│
├── [Filter Controls]
│   ├── select[Status]
│   ├── select[Timeline]
│   ├── input[search]
│   └── button[Reset Filter]
│
├── [Insiden List]
│   ├── [InsidenCard] (per item)
│   │   ├── button[View Detail]
│   │   ├── button[Edit]
│   │   └── button[Delete]
│   └── ... (more cards)
│
└── [Add Insiden Button]
    └── button[Tambah Insiden]
```

---

## BINTER PAGE (`/binter`)
```
[BinterPage]
├── [Header]
│   ├── select[Timeline Filter]
│   ├── select[Jenis Binter]
│   ├── input[search]
│   └── button[Download PDF]
│
├── [Binter Timeline/Grid]
│   ├── [BinterCard] (per item)
│   │   ├── button[View Detail]
│   │   └── button[Edit]
│   └── ... (more cards)
│
└── [Add Binter Button]
    └── button[Tambah Binter]
```

---

## ADMIN PAGE (`/admin`)
```
[AdminPage]
├── [Header]
│   └── button[Tambah User]
│
├── [User Management]
│   ├── [User List]
│   │   ├── button[Edit User] (per row)
│   │   └── button[Delete User] (per row)
│   └── [User Form] (modal)
│       ├── input fields
│       ├── select[Role]
│       ├── button[Batal]
│       └── button[Simpan]
│
└── [Role Filter]
    ├── button[All]
    ├── button[Admin]
    ├── button[Operator]
    └── button[Viewer]
```

---

## PANDUAN PAGE (`/panduan`)
```
[PanduanPage]
├── [Tab Navigation]
│   ├── button[Data Pos]
│   ├── button[Demografi]
│   ├── button[Tokoh]
│   ├── button[Binter]
│   ├── button[Kerawanan]
│   └── button[Patroli]
│
└── [Content Area]
    └── SOP sections (read-only)
```

---

## LAPORAN KERAWANAN (`/laporan/kerawanan`)
```
[GrafikKerawananPage]
├── [Header]
│   └── button[Download PDF]
│
└── [Chart Area]
    └── Interactive charts (filterable)
```

---

## LAPORAN TOKOH (`/laporan/tokoh`)
```
[TokohWilayahPage]
├── [Header]
│   └── button[Download PDF]
│
├── [Filter]
│   └── select[Filter by Pos]
│
└── [Tokoh List Table]
    └── Read-only table
```

---

## LAPORAN DEMOGRAFI (`/laporan/demografi`)
```
[DataDemografiPage]
├── [Header]
│   └── button[Download PDF]
│
└── [Demografi Data]
    └── Read-only data tables
```

---

## LAPORAN POS (`/laporan/pos/:posId`)
```
[LaporanPosPage]
├── [Header]
│   ├── button[← Kembali ke Pos]
│   └── button[Cetak / Simpan PDF]
│
└── [Report Content]
    └── Print-ready report (read-only)
```

---

## MODAL COMPONENTS

### [Modal]
```
[Modal]
├── backdrop (click to close)
├── button[X] "✕" (close)
├── header
└── content slot
```

### [ConfirmDialog]
```
[ConfirmDialog]
├── backdrop
├── button[X] "✕"
├── title
├── message
├── button[Batal]
└── button[Konfirmasi]
```

### [Toast]
```
[Toast]
├── Toast container (fixed position)
└── Toast messages (auto-dismiss)
```

---

## TOPBAR (All Pages)
```
[TopBar]
├── button[sidebar toggle] (mobile)
├── span[NARASINGA]
├── span[date/time]
├── button[presentation mode]
├── button[fullscreen]
├── button[print]
└── button[logout]
```

---

## BUG REPORTING TEMPLATE

Untuk report bug, sebutkan:
1. Halaman (page URL)
2. Lokasi tombol (dari tree di atas)
3. Deskripsi masalah
4. Expected behavior
5. Actual behavior

---

*Generated: 2026-07-02*
*Updated: 2026-07-02 (v2 - Fixed POS Detail tabs structure)*
