# 🎸 Black Rebel Fest 2022 (BRF22) - Frontend SPA

Aplikasi web antarmuka pengguna (Frontend Single Page Application) untuk **Black Rebel Fest 2022**, dibangun menggunakan **React 19, Vite, TypeScript, dan Tailwind CSS**.

---

## 🎯 Mengapa Dibuat & Masalah yang Diselesaikan

1. **Menggantikan Full Page Reload**: Di PHP lama, setiap klik link memuat ulang seluruh dokumen HTML (`index.php?lineup`, `tiket.php`). Di React SPA, navigasi instan tanpa refresh halaman menggunakan `react-router-dom`.
2. **Desain Modern Responsif**: Menggantikan Bootstrap CDN versi campur aduk dengan utility-first **Tailwind CSS v4** bertema gelap (*Dark Zinc & Amber Glow*) khas festival rock/metal.
3. **Penyimpanan State & Cache Terpusat**: Menggunakan `@tanstack/react-query` untuk mengelola data jadwal konser dan inventaris tiket secara otomatis (caching, background refetching, loading states).
4. **Digital E-Ticket Barcode**: Menghasilkan **QR Code SVG** yang bisa langsung dipindai pada hari-H festival untuk penukaran gelang (*wristband*).
5. **Admin Dashboard Terproteksi**: Terdapat antarmuka panel festival khusus panitia (`/admin`) untuk memantau omzet, restock tiket, dan memindai QR code tiket di gerbang.

---

## 📁 Struktur Folder Frontend

```text
public/
└── img/                         # Aset foto artis lineup yang dimigrasi dari proyek lama
src/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx      # Sidebar shell dan navigasi panel admin
│   │   └── ProtectedAdminRoute.tsx # Route guard: khusus akun role === 'admin'
│   └── layout/
│       └── Navbar.tsx           # Navigasi sticky blur, mendeteksi user/admin aktif
├── context/
│   └── AuthContext.tsx          # Provider global autentikasi (user, login, logout)
├── pages/
│   ├── admin/
│   │   ├── AdminOverviewPage.tsx   # Dashboard analitik omzet & inventaris kuota
│   │   ├── AdminTiersPage.tsx      # Manajemen restock kuota & ubah harga tiket
│   │   ├── AdminOrdersPage.tsx     # Tabel audit transaksi semua penonton
│   │   └── AdminScannerPage.tsx    # Terminal QR scanner check-in di gerbang
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
Dockerfile                       # Multi-stage production container dengan Nginx
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
[Navbar.tsx] -> Menampilkan nama user & tombol 'Admin Panel' (jika akun admin)
       │
       ▼
[Pages] (HomePage / LineupPage / TicketsPage / Admin Dashboard)
       │
       ▼
[services/api.ts] (Axios) -> Mengirim HTTP Request ke Backend (withCredentials: true)
       │
       ▼
[State Update] -> Data ditampilkan ke layar dengan komponen reaktif Tailwind
```

---

## 🚀 Panduan Menjalankan Proyek

### 1. Menjalankan di Lokal (Development)
1. Salin `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   *Pastikan isinya mengarah ke API Backend lokal: `VITE_API_URL=http://localhost:5000/api/v1`.*
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Jalankan development server:
   ```bash
   pnpm run dev
   ```
   Buka browser di: `http://localhost:5173`.

---

## ☁️ Panduan Deploy Gratis ke Vercel

1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik tombol **Add New...** -> Pilih **Project**.
3. Import repository GitHub: `Alhaiza/college-black-rebel-fest-remake-fe`.
4. Pada halaman konfigurasi project:
   - **Framework Preset**: `Vite` (terdeteksi otomatis).
   - **Root Directory**: `./`.
   - **Build Command**: `pnpm run build`.
   - **Output Directory**: `dist`.
5. Buka bagian **Environment Variables**, tambahkan:
   - `VITE_API_URL` = `https://<your-backend-app>.vercel.app/api/v1`
6. Klik **Deploy**! Website festival Anda akan aktif dalam hitungan detik.
