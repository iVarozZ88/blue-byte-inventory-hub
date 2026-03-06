import { useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import AssetForm from '@/components/AssetForm';
import { usePermissions } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface LayoutContext {
  currentLocation: 'MCI_SPAIN' | 'MCI_LATAM' | null;
}

const NewAssetPage = () => {
  const { currentLocation } = useOutletContext<LayoutContext>();
  const { canWriteAssets } = usePermissions(currentLocation);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!canWriteAssets) {
      toast({
        title: "Solo lectura (MCI Spain)",
        description: "No tienes permisos para crear activos en esta sede.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [canWriteAssets, navigate, toast]);

  return <AssetForm mode="create" canWriteAssets={canWriteAssets} />;
};

export default NewAssetPage;
