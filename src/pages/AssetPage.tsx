import { useOutletContext } from 'react-router-dom';
import AssetDetail from '@/components/AssetDetail';
import { usePermissions } from '@/contexts/AuthContext';

interface LayoutContext {
  currentLocation: 'MCI_SPAIN' | 'MCI_LATAM' | null;
}

const AssetPage = () => {
  const { currentLocation } = useOutletContext<LayoutContext>();
  const { canWriteAssets } = usePermissions(currentLocation);

  return <AssetDetail canWriteAssets={canWriteAssets} />;
};

export default AssetPage;
