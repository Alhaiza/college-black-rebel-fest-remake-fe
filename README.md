# 🎸 Black Rebel Fest 2022 (BRF22) - Frontend SPA

Aplikasi web antarmuka pengguna (Frontend Single Page Application) untuk **Black Rebel Fest 2022**, dibangun menggunakan **React 19, Vite, TypeScript, dan Tailwind CSS**.

---

## 🎯 Mengapa Dibuat & Masalah yang Diselesaikan

1. **Menggantikan Full Page Reload**: Di PHP lama, setiap klik link memuat ulang seluruh dokumen HTML (`index.php?lineup`, `tiket.php`). Di React SPA, navigasi instan tanpa refresh halaman menggunakan `react-router-dom`.
2. **Desain Modern Responsif**: Menggantikan Bootstrap CDN versi campur aduk dengan utility-first **Tailwind CSS v4** bertema gelap (*Dark Zinc & Amber Glow*) khas festival rock/metal.
3. **Penyimpanan State & Cache Terpusat**: Menggunakan `@tanstack/react-query` untuk mengelola data jadwal konser dan inventaris tiket secara otomatis (caching, background refetching, loading states).
4. **Digital E-Ticket Barcode**: Menghasilkan **QR Code SVG** yang bisa langsung dipindai pada hari-H festival untuk penukaran gelang (*wristband*).

---

## 📁 Struktur Folder Frontend

```text
src/
├── components/
│   └── layout/
│       └── Navbar.tsx           # Navigasi sticky blur, deteksi session user aktif
├── context/
│   └── AuthContext.tsx          # Provider global autentikasi (user, login, logout)
├── pages/
│   ├── HomePage.tsx             # Halaman utama festival hero & teaser
│   ├── LineupPage.tsx           # Jadwal artis interaktif berdasar filter Day 1, 2, 3
│   ├── TicketPurchasePage.tsx   # Katalog tiket, kuota live, kuantitas, & tombol checkout
│   ├── MyTicketsPage.tsx        # Halaman e-ticket yang menampilkan voucher & QR Code
│   ├── LoginPage.tsx            # Form login pengguna
│   └── RegisterPage.tsx         # Form registrasi pengguna baru
├── services/
│   └── api.ts                   # Instance Axios terpusat dengan withCredentials: true
├── types/
│   └── index.ts                 # Definisi type data User, TicketTier, Order, Lineup
├── App.tsx                      # Routing & Provider Hierarchy (QueryClient, AuthProvider)
├── index.css                    # Setup Tailwind CSS & styling global
└── main.tsx                     # Entry point React DOM render
```

---

## ⚡ Alur Eksekusi Data (Execution Flow)

```text
User Membuka Web di Browser
       │
       ▼
[main.tsx] -> Mount root DOM
       │
       ▼
[App.tsx] -> QueryClientProvider -> AuthProvider (Cek /auth/me via HttpOnly cookie)
       │
       ▼
[Navbar.tsx] -> Menampilkan nama user jika login, atau tombol 'Sign In' jika tamu
       │
       ▼
[Pages] (HomePage / LineupPage / TicketsPage)
       │
       ▼
[services/api.ts] (Axios) -> Mengirim HTTP Request ke Backend (http://localhost:5000/api/v1)
       │
       ▼
[State Update] -> Data ditampilkan ke layar dengan komponen reaktif Tailwind
```

---

## 🛠️ Cara Menjalankan Frontend

### 1. Prasyarat
- Node.js (v20+ LTS)
- pnpm (atau npm)
- Backend API sudah berjalan di `http://localhost:5000`

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Jalankan Aplikasi
```bash
pnpm run dev
```
Buka browser Anda di: `http://localhost:5173`

### 4. Build Production
```bash
pnpm run build
```
Hasil build akan tersimpan di folder `dist/` siap untuk di-deploy ke Vercel, Netlify, atau Cloudflare Pages.
