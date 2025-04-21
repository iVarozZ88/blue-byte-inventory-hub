import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { useEffect } from "react";
import { seedInitialData } from "./lib/db";
import LoginGate from "@/components/LoginGate";

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
        <LoginGate>
          <BrowserRouter basename="/">
            <Routes>
              <Route path="/" element={<Layout />}>
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
        </LoginGate>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
