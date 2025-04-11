
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Asset, getTrashedAssets, restoreAsset, permanentlyDeleteAsset } from '@/lib/db';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
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
  Undo2,
  Trash2,
  Cable
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

const TrashPage = () => {
  const [trashedAssets, setTrashedAssets] = useState<Asset[]>([]);
  
  useEffect(() => {
    loadTrashedAssets();
  }, []);
  
  const loadTrashedAssets = () => {
    const assets = getTrashedAssets();
    setTrashedAssets(assets);
  };
  
  const handleRestore = (id: string) => {
    restoreAsset(id);
    loadTrashedAssets();
    
    toast({
      title: "Activo restaurado",
      description: "El activo ha sido restaurado exitosamente.",
    });
  };
  
  const handleDelete = (id: string) => {
    permanentlyDeleteAsset(id);
    loadTrashedAssets();
    
    toast({
      title: "Activo eliminado permanentemente",
      description: "El activo ha sido eliminado permanentemente.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Papelera</h1>
      </div>

      {trashedAssets.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <Trash2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">La papelera está vacía</h3>
          <p className="mt-1 text-gray-500">Los activos eliminados aparecerán aquí</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Asignado A</TableHead>
                <TableHead>Eliminado el</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trashedAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getAssetIcon(asset.type)}
                      <span>{typeLabels[asset.type]}</span>
                    </div>
                  </TableCell>
                  <TableCell>{asset.model || '-'}</TableCell>
                  <TableCell>{asset.assignedTo || '-'}</TableCell>
                  <TableCell>{asset.lastUpdated}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRestore(asset.id)}
                      className="inline-flex items-center"
                    >
                      <Undo2 className="h-4 w-4 mr-1" />
                      Restaurar
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar permanentemente?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. El activo será eliminado permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(asset.id)}>
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TrashPage;
