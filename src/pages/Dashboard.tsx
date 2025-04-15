
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { getAssetStatistics, Asset } from '@/lib/db';
import StatCard from '@/components/StatCard';
import AssetDistributionChart, { ChartData } from '@/components/AssetDistributionChart';
import RecentlyUpdatedTable from '@/components/RecentlyUpdatedTable';
import { LayoutDashboard, Monitor, Laptop, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define the structure of our stats state
interface StatsState {
  total: number;
  byStatus: {
    available: number;
    assigned: number;
    maintenance: number;
    retired: number;
  };
  byType: {
    computer: number;
    laptop: number;
    monitor: number;
    mouse: number;
    keyboard: number;
    telephone: number;
    mobile: number;
    scanner: number;
    printer: number;
    cable: number;
    license: number;
    other: number;
    [key: string]: number; // Add index signature
  };
  recentlyUpdated: Asset[];
}

// Define chart colors
const TYPE_COLORS = {
  computer: '#0088FE',
  laptop: '#00C49F',
  monitor: '#FFBB28',
  mouse: '#FF8042',
  keyboard: '#E70B0B',
  telephone: '#D650D6',
  mobile: '#20DE06',
  scanner: '#f3FE0D',
  printer: '#FF9F7F',
  cable: '#F17CB0',
  license: '#B2B1CF',
  other: '#60ACFC'
};

const STATUS_COLORS = {
  available: '#4CAF50',
  assigned: '#2196F3',
  maintenance: '#FFC107',
  retired: '#F44336'
};

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState<StatsState>({
    total: 0,
    byStatus: {
      available: 0,
      assigned: 0,
      maintenance: 0,
      retired: 0,
    },
    byType: {
      computer: 0,
      laptop: 0,
      monitor: 0,
      mouse: 0,
      keyboard: 0,
      telephone: 0,
      mobile: 0,
      scanner: 0,
      printer: 0,
      cable: 0,
      license: 0,
      other: 0,
    },
    recentlyUpdated: [],
  });

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const statistics = await getAssetStatistics();
        setStats(statistics as StatsState);
      } catch (error) {
        console.error("Error loading statistics:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las estadísticas del inventario.",
          variant: "destructive",
        });
      }
    };

    loadStatistics();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total de Activos" 
          value={stats.total} 
          icon={<LayoutDashboard className="h-6 w-6" />}
          onClick={() => navigate('/assets')}
        />
        <StatCard 
          title="Monitores" 
          value={stats.byType.monitor} 
          icon={<Monitor className="h-6 w-6" />}
          onClick={() => navigate('/assets/monitor')}
        />
        <StatCard 
          title="Laptops" 
          value={stats.byType.laptop} 
          icon={<Laptop className="h-6 w-6" />}
          onClick={() => navigate('/assets/laptop')}
        />
        <StatCard 
          title="Licencias" 
          value={stats.byType.license} 
          icon={<FileText className="h-6 w-6" />}
          onClick={() => navigate('/assets/license')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Distribución por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <AssetDistributionChart 
              data={Object.entries(stats.byType).map(([name, value]) => ({ 
                name, 
                value,
                color: TYPE_COLORS[name as keyof typeof TYPE_COLORS] || '#CCCCCC'
              }))} 
            />
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Distribución por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <AssetDistributionChart 
              data={[
                { name: 'Disponible', value: stats.byStatus.available, color: STATUS_COLORS.available },
                { name: 'Asignado', value: stats.byStatus.assigned, color: STATUS_COLORS.assigned },
                { name: 'Mantenimiento', value: stats.byStatus.maintenance, color: STATUS_COLORS.maintenance },
                { name: 'Retirado', value: stats.byStatus.retired, color: STATUS_COLORS.retired },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activos actualizados recientemente</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentlyUpdatedTable assets={stats.recentlyUpdated} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
