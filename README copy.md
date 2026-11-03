# Takdah Grace Academy — Official School Web Portal (Light Theme)

An authentic, high-performance, and responsive official website for **Takdah Grace Academy** located at **6th Mile, Naya Busty, Dist. Darjeeling, West Bengal**.

Built with a clean **Light Theme** reflecting the actual architecture and color palette of the school building:
* **Terracotta Brick Coral** (`#C2410C`) matching the 2-storey building exterior.
* **Forest Emerald Green** (`#047857`, `#064E3B`) matching the iconic roof signboard **"Grace Academy"**.
* **Warm Amber Gold** (`#D97706`, `#F59E0B`) matching the signboard lettering.
* **Crisp Pearl White & Slate** for optimal legibility and clean modern aesthetics.

---

## 🏫 Institutional Profile

* **School Name**: Takdah Grace Academy (TGA)
* **Classes**: Class Nursery to Class X (ICSE)
* **Location**: 6th Mile, Naya Busty, P.O. Takdah Cantonment, Dist. Darjeeling, West Bengal – 734222
* **Director**: Mr. Bhupen Dukpa
* **Principal**: Mr. Chandan Singh
* **Board Curriculum**: ICSE (CISCE, New Delhi)
* **Medium of Instruction**: English (with Nepali & Hindi language studies)
* **Real Building Photo**: Located at `images/grace-academy-campus.png`

---

## 🌟 Key Features

1. **Light Theme & Real Campus Image**:
   - Features the actual photo of the 2-storey terracotta building with the green **"Grace Academy"** signboard, front steps, and waiting shed.
   - High-contrast, clean layout with smooth typography and subtle shadows.

2. **Dynamic Client-Side Storage (`localStorage`) & Admin Tools**:
   - **Fee Structure Editor**: Real-time adjustment of tuition for Nursery, Primary, Middle, ICSE, Weekly/Full Boarding, Van Transport, Hot Lunch, and Coaching. Changes instantly propagate to the public Fee Calculator.
   - **Facilities Manager**: Add, edit, and delete campus facilities with custom photo uploads from your device or web links.
   - **Photo Gallery & Picture Uploader**: Upload campus photos with built-in client-side canvas compression (`~75KB`) to keep local storage light and fast.
   - **Admission Applications**: Persisted in the browser with tracking IDs (e.g., `TGA-2026-XXXX`), downloadable as an Excel-ready CSV.
   - **Parent Self-Service Tracker**: Real-time 4-step status lookup using reference code or phone number.
   - **Circulars & Calendar Management**: Post urgent notices and hill campus events directly from the Staff Portal.
   - **Full JSON Backup & Restore**: One-click download of all school records or restore anytime.

3. **Curriculum (Class Nursery to ICSE)**:
   - Early Years (Nursery, LKG, UKG)
   - Primary Section (Classes I to V)
   - Middle School (Classes VI to VIII)
   - ICSE Secondary (Classes IX & X)

---

## 📁 File Structure

```text
vanguard-horizon-academy/
│
├── index.html                  # Main light-theme landing page with all modals
├── README.md                   # Project documentation
│
├── images/
│   └── grace-academy-campus.png # Actual photograph of Grace Academy building
│
├── css/
│   └── custom.css              # Light theme styles, glassmorphism, animations
│
└── js/
    ├── data-store.js           # Local storage CRUD layer for applications, circulars, events
    ├── admin.js                # Staff management dashboard, tracking, CSV exporter
    ├── main.js                 # UI interactions, light theme tabs, INR fee calculator
    └── campus-map.js           # 6th Mile mountain campus vector blueprint
```


