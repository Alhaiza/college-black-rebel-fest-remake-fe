import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/layout/Navbar";
import { HomePage } from "./pages/HomePage";
import { LineupPage } from "./pages/LineupPage";
import { TicketPurchasePage } from "./pages/TicketPurchasePage";
import { MyTicketsPage } from "./pages/MyTicketsPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center py-20 text-zinc-500">Checking auth...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/lineup" element={<LineupPage />} />
                <Route path="/tickets" element={<TicketPurchasePage />} />
                <Route
                  path="/my-tickets"
                  element={
                    <ProtectedRoute>
                      <MyTicketsPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </main>
            <footer className="py-8 border-t border-zinc-900 text-center text-xs text-zinc-600">
              © 2022 - 2026 Black Rebel Fest (BRF22). Remade with MERN Stack & Tailwind CSS.
            </footer>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
