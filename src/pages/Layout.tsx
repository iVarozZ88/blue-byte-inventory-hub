import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { usePermissions, type LocationValue } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

const Layout = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationValue | null>("MCI_SPAIN");
  const navigate = useNavigate();
  const { canWriteAssets, canManageUsers, isReadOnly } = usePermissions(currentLocation);

  const handleLocationSelect = (location: LocationValue) => {
    setCurrentLocation(location);
  };

  const handleAddAssetClick = () => {
    if (canWriteAssets) {
      navigate("/assets/new");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        onLocationSelect={handleLocationSelect}
        currentLocation={currentLocation}
        onAddAssetClick={handleAddAssetClick}
        canWriteAssets={canWriteAssets}
        canManageUsers={canManageUsers}
      />

      <main className="flex-1 ml-64 p-8">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold">
            {currentLocation
              ? `Inventario MCI ${currentLocation === "MCI_SPAIN" ? "(España)" : "(Rep. Dominicana)"}`
              : "Selecciona una ubicación"}
          </h1>
          {isReadOnly && (
            <Badge variant="secondary" className="text-amber-700 bg-amber-100">
              Solo lectura (MCI Spain)
            </Badge>
          )}
        </div>

        <Outlet context={{ currentLocation }} />
      </main>
    </div>
  );
};

export default Layout;
