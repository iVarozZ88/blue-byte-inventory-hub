// src/pages/Layout.tsx
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";

const Layout = () => {
  // Estado para almacenar la ubicación seleccionada.
  // Lo inicializamos en 'spain' para que al cargar la página ya haya una ubicación predeterminada.
  const [currentLocation, setCurrentLocation] = useState<'spain' | 'latam' | null>('spain');
  const navigate = useNavigate();

  // Función que se llama cuando se selecciona una ubicación en el Sidebar.
  const handleLocationSelect = (location: 'spain' | 'latam') => {
    setCurrentLocation(location);
    // Opcional: Podrías redirigir a una página principal al cambiar de ubicación
    // Por ejemplo, navegar a la raíz o a la página de usuarios para la nueva ubicación
    // navigate(`/users?location=${location}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Componente Sidebar - Se mantiene fijo */}
      <Sidebar
        onLocationSelect={handleLocationSelect} // Pasamos la función para seleccionar ubicación
        currentLocation={currentLocation} // Pasamos la ubicación actual para que el Sidebar la muestre
        onAddAssetClick={function (): void {
          throw new Error("Function not implemented.");
        } }      />

      {/* Área del Contenido Principal */}
      {/*
        ¡IMPORTANTE!
        Añadimos 'ml-64' (margin-left: 16rem) al main para desplazarlo hacia la derecha,
        compensando el ancho del sidebar fijo y evitando la superposición.
        El 'p-8' lo mantienes para el padding interno del contenido.
      */}
      <main className="flex-1 ml-64 p-8"> {/* Aquí se añade 'ml-64' */}
        {/* Título dinámico que muestra la ubicación seleccionada */}
        <h1 className="text-3xl font-bold mb-6">
          {currentLocation ? `Inventario MCI ${currentLocation === 'spain' ? '(España)' : '(República Dominicana)'}` : 'Selecciona una ubicación'}
        </h1>

        {/* Outlet es donde se renderizarán los componentes de las rutas anidadas.
            Usamos 'context' para pasar el 'currentLocation' a esos componentes. */}
        <Outlet context={{ currentLocation }} /> {/* Aquí se añade 'context' */}
      </main>
    </div>
  );
};

export default Layout;
