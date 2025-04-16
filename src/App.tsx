
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./pages/Layout";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import AssetsListPage from "./pages/AssetsListPage";
import AssetPage from "./pages/AssetPage";
import NewAssetPage from "./pages/NewAssetPage";
import EditAssetPage from "./pages/EditAssetPage";
import UsersListPage from "./pages/UsersListPage";
import UserDetailPage from "./pages/UserDetailPage";
import TrashPage from "./pages/TrashPage";
import AdminPage from "./pages/AdminPage";
import LicenseAssignmentsPage from "./pages/LicenseAssignmentsPage";
import { useEffect } from "react";
import { seedInitialData } from "./lib/db";

const queryClient = new QueryClient();

const App = () => {
  // Initialize the database with seed data if empty
  useEffect(() => {
    seedInitialData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Index />} />
                <Route path="assets" element={<AssetsListPage />} />
                <Route path="assets/new" element={<NewAssetPage />} />
                <Route path="assets/:type" element={<AssetsListPage />} />
                <Route path="assets/id/:id" element={<AssetPage />} />
                <Route path="assets/id/:id/edit" element={<EditAssetPage />} />
                <Route path="assets/license/:id/assignments" element={<LicenseAssignmentsPage />} />
                <Route path="users" element={<UsersListPage />} />
                <Route path="users/:username" element={<UserDetailPage />} />
                <Route path="trash" element={<TrashPage />} />
                <Route path="admin" element={<AdminPage />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
