
import { useOutletContext } from 'react-router-dom';
import UserDetail from '@/components/UserDetail';
import type { LocationValue } from '@/contexts/AuthContext';

const UserDetailPage = () => {
  const { currentLocation } = useOutletContext<{ currentLocation: LocationValue | null }>();
  return <UserDetail currentLocation={currentLocation} />;
};

export default UserDetailPage;
