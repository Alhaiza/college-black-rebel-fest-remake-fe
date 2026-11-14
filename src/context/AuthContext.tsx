/**
 * ============================================================================
 * [AUTH CONTEXT PROVIDER] - src/context/AuthContext.tsx
 * ============================================================================
 * 
 * 1. KENAPA DIBUAT? (Why it exists):
 *    Di PHP native lama, status login disimpan di server session dan dibaca di setiap file via:
 *    `<?php if(isset($_SESSION["username"])) { echo $_SESSION["username"]; } ?>`
 *    Di React Single Page Application (SPA), seluruh komponen UI (Navbar, Halaman Pembelian, dll)
 *    membutuhkan satu sumber kebenaran (Single Source of Truth) untuk mengetahui apakah
 *    pengguna sedang login atau tidak, tanpa harus melakukan fetch ulang ke server terus-menerus.
 * 
 * 2. DESKRIPSI & FUNGSI (What it does):
 *    Context ini membungkus (wrap) seluruh aplikasi React. Saat pertama kali web dibuka:
 *    - Menjalankan useEffect untuk memanggil `GET /auth/me` ke backend.
 *    - Jika cookie JWT di browser masih valid, backend mengembalikan data user dan state `user` diisi.
 *    - Jika token expired atau belum login, state `user` diset `null`.
 *    - Menyediakan fungsi `login()` dan `logout()` yang dapat dipanggil dari halaman manapun.
 * 
 * 3. ALUR EKSEKUSI (Execution Flow):
 *    [STEP 1] -> Inisialisasi AuthContext dengan tipe `AuthContextType`.
 *    [STEP 2] -> Komponen `AuthProvider` mount -> jalankan `useEffect` (Cek sesi aktif).
 *    [STEP 3] -> Panggil `api.get("/auth/me")` dengan HttpOnly cookie otomatis terbawa.
 *    [STEP 4] -> Update state `user` dan ubah `loading = false`.
 *    [STEP 5] -> Sediakan custom hook `useAuth()` agar komponen anak bisa mengakses state user dengan mudah.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types";
import { api } from "../services/api";

// [STEP 1: KONTRAK TIPE STATE & FUNGSI AUTH]
interface AuthContextType {
  user: User | null;       // Objek pengguna (id, username, email, role) atau null jika guest
  loading: boolean;        // Status loading saat pertama kali memverifikasi sesi ke backend
  login: (token: string, user: User) => void; // Fungsi update state setelah form login berhasil
  logout: () => Promise<void>;               // Fungsi logout (memanggil endpoint logout backend)
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// [STEP 2: PROVIDER KOMPONEN]
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // [STEP 3: CEK SESI LOGIN SAAT WEBSITE PERTAMA KALI DIBUKA]
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Request ini otomatis membawa cookie JWT karena withCredentials: true di api.ts
        const res = await api.get("/auth/me");
        if (res.data.success) {
          setUser(res.data.data);
        }
      } catch (err) {
        // Jika token tidak ada atau expired, set user ke null
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // [STEP 4: FUNGSI HANDLER LOGIN]
  const login = (_token: string, userData: User) => {
    setUser(userData);
  };

  // [STEP 5: FUNGSI HANDLER LOGOUT]
  const logout = async () => {
    try {
      // Panggil backend untuk menghapus HttpOnly cookie
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// [STEP 6: CUSTOM HOOK MEMUDAHKAN PEMANGGILAN DI KOMPONEN LAIN]
// Contoh pakai di komponen lain: const { user, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
