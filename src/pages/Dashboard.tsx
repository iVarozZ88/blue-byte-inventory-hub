
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  CheckCircle, 
  Users, 
  AlertTriangle,
  Loader2 
} from 'lucide-react';
import StatCard from '@/components/StatCard';
import AssetDistributionChart from '@/components/AssetDistributionChart';
import RecentlyUpdatedTable from '@/components/RecentlyUpdatedTable';
import { getAssetStatistics, seedInitialData } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const [stats, setStats] = useState({
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
      other: 0,
    },
    recentlyUpdated: [],
  });
  const [loading, setLoading] = useState(true);

  // Load or seed initial data if empty
  useEffect(() => {
    const loadStatistics = async () => {
      try {
        await seedInitialData();
        const statistics = await getAssetStatistics();
        setStats(statistics);
      } catch (error) {
        console.error("Error loading statistics:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStatistics();
  }, []);

  // Chart data transformations
  const typeChartData = Object.entries(stats.byType || {}).map(([type, count]) => ({
    name: type,
    value: count,
    color: getTypeColor(type)
  }));

  const statusChartData = Object.entries(stats.byStatus || {}).map(([status, count]) => ({
    name: status,
    value: count,
    color: getStatusColor(status)
  }));

  function getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      computer: '#4285F4',
      laptop: '#5E35B1',
      monitor: '#673AB7',
      mouse: '#9575CD',
      keyboard: '#BA68C8',
      telephone: '#EC407A',
      mobile: '#F06292',
      scanner: '#FF8A65',
      printer: '#FFB74D',
      cable: '#FF9E80',
      other: '#FFCC80'
    };
    return colors[type] || '#ccc';
  }

  function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      available: '#2ED8B6',
      assigned: '#4285F4',
      maintenance: '#FFB74D',
      retired: '#757575'
    };
    return colors[status] || '#ccc';
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Cargando estadísticas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your company's tech inventory</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Assets" 
          value={stats.total} 
          description="across all categories" 
          icon={<Package size={20} />} 
        />
        <StatCard 
          title="Available" 
          value={stats.byStatus.available} 
          description="ready for assignment" 
          icon={<CheckCircle size={20} />} 
        />
        <StatCard 
          title="Assigned" 
          value={stats.byStatus.assigned} 
          description="currently in use" 
          icon={<Users size={20} />} 
        />
        <StatCard 
          title="In Maintenance" 
          value={stats.byStatus.maintenance} 
          description="being repaired or serviced" 
          icon={<AlertTriangle size={20} />} 
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Asset Distribution by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <AssetDistributionChart data={typeChartData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Asset Status</CardTitle>
          </CardHeader>
          <CardContent>
            <AssetDistributionChart data={statusChartData} />
          </CardContent>
        </Card>
      </div>
      
      {/* Recently Updated Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recently Updated Assets</CardTitle>
          <Link to="/assets" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          <RecentlyUpdatedTable assets={stats.recentlyUpdated} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
