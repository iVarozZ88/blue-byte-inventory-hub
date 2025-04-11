
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
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="assets" element={<AssetsListPage />} />
              <Route path="assets/new" element={<NewAssetPage />} />
              <Route path="assets/:type" element={<AssetsListPage />} />
              <Route path="assets/id/:id" element={<AssetPage />} />
              <Route path="assets/id/:id/edit" element={<EditAssetPage />} />
              <Route path="users" element={<UsersListPage />} />
              <Route path="users/:username" element={<UserDetailPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
