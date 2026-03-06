import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Index from "./pages/Index";
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
import DocumentacionPage from "./pages/DocumentacionPage";
import B2COMPage from "./pages/B2COMPage";
import { useEffect } from "react";
import { seedInitialData } from "./lib/db";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGate from "@/components/AuthGate";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    seedInitialData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <AuthGate>
            <BrowserRouter basename="/">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="assets" element={<AssetsListPage />} />
                <Route path="assets/new" element={<NewAssetPage />} />
                <Route path="assets/:type" element={<AssetsListPage />} />
                <Route path="assets/id/:id" element={<AssetPage />} />
                <Route path="assets/id/:id/edit" element={<EditAssetPage />} />
                <Route path="assets/license/:id/assignments" element={<LicenseAssignmentsPage />} />
                <Route path="users" element={<UsersListPage />} />
                <Route path="users/:username" element={<UserDetailPage />} />
                <Route path="trash" element={<TrashPage />} />
                <Route path="documentacion" element={<DocumentacionPage />} />
                <Route path="b2com" element={<B2COMPage />} />
                <Route path="admin" element={<AdminPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            </BrowserRouter>
          </AuthGate>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
