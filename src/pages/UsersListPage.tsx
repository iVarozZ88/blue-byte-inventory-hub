// src/pages/UsersListPage.tsx
import React from 'react';
import UsersList from '@/components/UsersList';
import { useOutletContext } from 'react-router-dom';

// Define la interfaz para el contexto que esperamos del Outlet
interface LayoutContext {
  currentLocation: 'spain' | 'latam' | null;
}

const UsersListPage: React.FC = () => {
  // Obtiene la ubicación actual del contexto del Outlet proporcionado por Layout
  const { currentLocation } = useOutletContext<LayoutContext>();

  // Renderiza el componente UsersList y le pasa la currentLocation como una prop
  return (
    <UsersList currentLocation={currentLocation} />
  );
};

export default UsersListPage;

