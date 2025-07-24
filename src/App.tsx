// ===============================
// App.tsx - Main Application Entry
//
// - Sets up global providers (theme, auth, query, tooltips)
// - Handles routing for all pages
// - Mounts global UI components (toasts, notifications, offline banner)
// ===============================
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Context Providers
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Components
import { LoadingScreen } from '@/components/LoadingScreen';
import { NotificationSystem } from '@/components/NotificationSystem';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Layout } from '@/components/Layout';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Notes } from './pages/Notes';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Groups } from './pages/Groups';
import { Analytics } from './pages/Analytics';
import NotFound from "./pages/NotFound";
import { OfflineBanner } from './components/OfflineBanner';

// ===============================
// Query Client Setup (React Query)
// ===============================
const queryClient = new QueryClient();

// ===============================
// Main App Component
// ===============================
const App = () => {
  // Initial loading splash (simulated)
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  return (
    // ===============================
    // Global Providers
    // ===============================
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <BrowserRouter>
              <div className="min-h-screen">
                {/* ===============================
                    Routing (Public & Protected)
                   =============================== */}
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
                  <Route path="/tasks" element={<ProtectedRoute><Layout><Tasks /></Layout></ProtectedRoute>} />
                  <Route path="/notes" element={<ProtectedRoute><Layout><Notes /></Layout></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
                  <Route path="/groups" element={<ProtectedRoute><Layout><Groups /></Layout></ProtectedRoute>} />
                  <Route path="/analytics" element={<ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>} />
                  {/* Root redirect */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  {/* 404 catch-all */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                {/* ===============================
                    Global UI Components
                   =============================== */}
                <OfflineBanner />
                <NotificationSystem />
                <Toaster />
                <Sonner />
              </div>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// ===============================
// Export Main App
// ===============================
export default App;
