import { useEffect } from 'react';
import { useOutletContext, useNavigate, useParams } from 'react-router-dom';
import AssetForm from '@/components/AssetForm';
import { usePermissions } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface LayoutContext {
  currentLocation: 'MCI_SPAIN' | 'MCI_LATAM' | null;
}

const EditAssetPage = () => {
  const { currentLocation } = useOutletContext<LayoutContext>();
  const { canWriteAssets } = usePermissions(currentLocation);
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    if (!canWriteAssets) {
      toast({
        title: "Solo lectura (MCI Spain)",
        description: "No tienes permisos para editar activos en esta sede.",
        variant: "destructive",
      });
      navigate(id ? `/assets/id/${id}` : '/');
    }
  }, [canWriteAssets, navigate, id, toast]);

  return <AssetForm mode="edit" canWriteAssets={canWriteAssets} />;
};

export default EditAssetPage;
