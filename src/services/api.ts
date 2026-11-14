/**
 * ============================================================================
 * [AXIOS HTTP API CLIENT] - src/services/api.ts
 * ============================================================================
 * Konsep untuk Developer PHP:
 * Di arsitektur PHP monolitik lama, setiap kali user mengklik tombol atau form,
 * browser melakukan reload halaman penuh (full page submit) ke URL action target.
 * 
 * Di arsitektur Single Page Application (SPA) React modern:
 * Halaman tidak pernah me-reload. Browser berkomunikasi dengan backend
 * secara asinkron (AJAX / REST) menggunakan library HTTP Client (Axios).
 */

// [STEP 1: IMPORT AXIOS LIBRARY]
import axios from "axios";

/**
 * [STEP 2: MEMBUAT INSTANCE AXIOS DENGAN KONFIGURASI GLOBAL]
 * Daripada menuliskan URL lengkap dan konfigurasi header berulang-ulang di setiap komponen,
 * kita membuat satu client instance terpusat.
 */
export const api = axios.create({
  // 2.1. baseURL: URL root endpoint Backend Express kita.
  // Membaca dari environment variable Vite (VITE_API_URL) jika ada, atau default ke port 5000.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",

  // 2.2. withCredentials: TRUE (SANGAT KRUSIAL!)
  // Memerintahkan browser untuk selalu menyertakan cookies (termasuk JWT HttpOnly)
  // pada setiap request lintas-port (CORS) antara port 5173 (React) dan port 5000 (Express).
  // Tanpa ini, backend tidak akan pernah mengenali session login user.
  withCredentials: true,

  // 2.3. Default Content-Type: Memberitahu backend bahwa payload yang dikirim adalah JSON
  headers: {
    "Content-Type": "application/json",
  },
});
