
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Asset, getAssetsByUser } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  UserCircle,
  ArrowLeft,
  Cable
} from 'lucide-react';

const getAssetIcon = (type: string) => {
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
    case 'cable': return <Cable size={16} />;
    default: return <HelpCircle size={16} />;
  }
};

const typeLabels: Record<string, string> = {
  computer: 'Computadora',
  laptop: 'Portátil',
  monitor: 'Monitor',
  mouse: 'Ratón',
  keyboard: 'Teclado',
  telephone: 'Teléfono',
  mobile: 'Móvil',
  scanner: 'Escáner',
  printer: 'Impresora',
  cable: 'Cable',
  other: 'Otro'
};

const UserDetail = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (username) {
      const decodedUsername = decodeURIComponent(username);
      const userAssets = getAssetsByUser(decodedUsername);
      setAssets(userAssets);
      setLoading(false);
    }
  }, [username]);

  if (loading) {
    return <div className="p-8 text-center">Cargando datos del usuario...</div>;
  }

  if (!username) {
    return <div className="p-8 text-center">Usuario no encontrado</div>;
  }

  const decodedUsername = decodeURIComponent(username);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-muted rounded-full p-2">
            <UserCircle size={24} />
          </div>
          <div>
            <CardTitle>{decodedUsername}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {assets.length} {assets.length === 1 ? 'dispositivo asignado' : 'dispositivos asignados'}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {assets.length === 0 ? (
          <div className="text-center py-8">
            <p>No hay dispositivos asignados a este usuario.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Número de Serie</TableHead>
                <TableHead>Última Actualización</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">
                    <Link to={`/assets/id/${asset.id}`} className="hover:underline">
                      {asset.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getAssetIcon(asset.type)}
                      <span>{typeLabels[asset.type]}</span>
                    </div>
                  </TableCell>
                  <TableCell>{asset.model || '-'}</TableCell>
                  <TableCell>{asset.serialNumber || '-'}</TableCell>
                  <TableCell>{asset.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div className="flex justify-start">
          <Button 
            variant="outline" 
            onClick={() => navigate('/users')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Volver a la lista de usuarios</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserDetail;
