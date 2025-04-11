
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Asset, AssetType, getAssets } from '@/lib/db';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Computer, 
  Laptop, 
  Monitor, 
  Mouse, 
  Keyboard, 
  Phone, 
  Smartphone, 
  Printer, 
  ScanLine,
  HelpCircle,
  Search,
  PlusCircle
} from 'lucide-react';

const typeLabels: Record<AssetType, string> = {
  computer: 'Computadoras',
  laptop: 'Portátiles',
  monitor: 'Monitores',
  mouse: 'Ratones',
  keyboard: 'Teclados',
  telephone: 'Teléfonos',
  mobile: 'Móviles',
  scanner: 'Escáneres',
  printer: 'Impresoras',
  other: 'Otros Dispositivos'
};

const getAssetIcon = (type: AssetType) => {
  switch (type) {
    case 'computer': return <Computer size={16} />;
    case 'laptop': return <Laptop size={16} />;
    case 'monitor': return <Monitor size={16} />;
    case 'mouse': return <Mouse size={16} />;
    case 'keyboard': return <Keyboard size={16} />;
    case 'telephone': return <Phone size={16} />;
    case 'mobile': return <Smartphone size={16} />;
    case 'scanner': return <ScanLine size={16} />;
    case 'printer': return <Printer size={16} />;
    default: return <HelpCircle size={16} />;
  }
};

const AssetsList = () => {
  const { type } = useParams<{ type: AssetType }>();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const allAssets = getAssets();
    
    // Filter by type if specified
    const typeFilteredAssets = type 
      ? allAssets.filter(asset => asset.type === type) 
      : allAssets;
      
    setAssets(typeFilteredAssets);
    applyFilters(typeFilteredAssets, searchTerm, statusFilter);
  }, [type]);

  const applyFilters = (assetList: Asset[], search: string, status: string) => {
    let filtered = assetList;
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(searchLower) ||
        (asset.model && asset.model.toLowerCase().includes(searchLower)) ||
        (asset.serialNumber && asset.serialNumber.toLowerCase().includes(searchLower)) ||
        (asset.assignedTo && asset.assignedTo.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply status filter
    if (status !== 'all') {
      filtered = filtered.filter(asset => asset.status === status);
    }
    
    setFilteredAssets(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(assets, value, statusFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    applyFilters(assets, searchTerm, value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">
          {type ? typeLabels[type as AssetType] : 'Todos los Activos'}
        </h1>
        
        <Button asChild>
          <Link to="/assets/new" className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Agregar Activo</span>
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar activos..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Estados</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="assigned">Asignado</SelectItem>
            <SelectItem value="maintenance">Mantenimiento</SelectItem>
            <SelectItem value="retired">Retirado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              {!type && <TableHead>Tipo</TableHead>}
              <TableHead>Modelo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Asignado A</TableHead>
              <TableHead>Última Actualización</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={type ? 5 : 6} className="text-center py-8">
                  No se encontraron activos
                </TableCell>
              </TableRow>
            ) : (
              filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">
                    <Link to={`/assets/id/${asset.id}`} className="hover:underline">
                      {asset.name}
                    </Link>
                  </TableCell>
                  {!type && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getAssetIcon(asset.type)}
                        <span className="capitalize">{typeLabels[asset.type]}</span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell>{asset.model || '-'}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`
                        ${asset.status === 'available' && 'bg-green-50 text-green-600 border-green-200'}
                        ${asset.status === 'assigned' && 'bg-blue-50 text-blue-600 border-blue-200'}
                        ${asset.status === 'maintenance' && 'bg-amber-50 text-amber-600 border-amber-200'}
                        ${asset.status === 'retired' && 'bg-gray-50 text-gray-600 border-gray-200'}
                      `}
                    >
                      {asset.status === 'available' && 'Disponible'}
                      {asset.status === 'assigned' && 'Asignado'}
                      {asset.status === 'maintenance' && 'Mantenimiento'}
                      {asset.status === 'retired' && 'Retirado'}
                    </Badge>
                  </TableCell>
                  <TableCell>{asset.assignedTo || '-'}</TableCell>
                  <TableCell>{asset.lastUpdated}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AssetsList;
