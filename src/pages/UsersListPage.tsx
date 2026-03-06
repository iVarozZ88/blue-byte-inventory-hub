import React, { useEffect } from 'react';
import UsersList from '@/components/UsersList';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { usePermissions } from '@/contexts/AuthContext';

interface LayoutContext {
  currentLocation: 'MCI_SPAIN' | 'MCI_LATAM' | null;
}

const UsersListPage: React.FC = () => {
  const { currentLocation } = useOutletContext<LayoutContext>();
  const { canManageUsers } = usePermissions(currentLocation);
  const navigate = useNavigate();

  useEffect(() => {
    if (!canManageUsers) navigate('/');
  }, [canManageUsers, navigate]);

  return <UsersList currentLocation={currentLocation} />;
};

export default UsersListPage;

