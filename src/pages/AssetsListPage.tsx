
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AssetsList from '@/components/AssetsList';
import { Asset, getAssets, AssetType } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const AssetsListPage = () => {
  const { type } = useParams<{ type: AssetType }>();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    total: number;
    available: number;
    assigned: number;
    maintenance: number;
    retired: number;
  }>({
    total: 0,
    available: 0,
    assigned: 0,
    maintenance: 0,
    retired: 0
  });

  useEffect(() => {
    const loadAssets = async () => {
      setLoading(true);
      try {
        const allAssets = await getAssets();
        
        // Filter by type if specified
        const filteredAssets = type 
          ? allAssets.filter(asset => asset.type === type) 
          : allAssets;
        
        setAssets(filteredAssets);
        
        // Calculate stats
        const newStats = {
          total: filteredAssets.length,
          available: filteredAssets.filter(a => a.status === 'available').length,
          assigned: filteredAssets.filter(a => a.status === 'assigned').length,
          maintenance: filteredAssets.filter(a => a.status === 'maintenance').length,
          retired: filteredAssets.filter(a => a.status === 'retired').length
        };
        
        setStats(newStats);
      } catch (error) {
        console.error('Error loading assets:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAssets();
  }, [type]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Cargando activos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
        <div className="bg-white rounded-md p-3 shadow-sm border">
          <div className="text-sm text-muted-foreground">Total</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white rounded-md p-3 shadow-sm border">
          <div className="text-sm text-muted-foreground">Disponibles</div>
          <div className="text-2xl font-bold text-green-600">{stats.available}</div>
        </div>
        <div className="bg-white rounded-md p-3 shadow-sm border">
          <div className="text-sm text-muted-foreground">Asignados</div>
          <div className="text-2xl font-bold text-blue-600">{stats.assigned}</div>
        </div>
        <div className="bg-white rounded-md p-3 shadow-sm border">
          <div className="text-sm text-muted-foreground">Mantenimiento</div>
          <div className="text-2xl font-bold text-amber-600">{stats.maintenance}</div>
        </div>
        <div className="bg-white rounded-md p-3 shadow-sm border">
          <div className="text-sm text-muted-foreground">Retirados</div>
          <div className="text-2xl font-bold text-gray-600">{stats.retired}</div>
        </div>
      </div>
      
      <AssetsList preFilteredAssets={assets} />
    </div>
  );
};

export default AssetsListPage;
