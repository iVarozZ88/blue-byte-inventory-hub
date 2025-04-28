
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Asset, deleteAsset } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
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
  Edit,
  Trash,
  Loader2
} from 'lucide-react';

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [parsedNotes, setParsedNotes] = useState<{ generalNotes?: string; [key: string]: any } | null>(null);

  useEffect(() => {
    const loadAsset = async () => {
      if (id) {
        try {
          const assets = await getAssets();
          const foundAsset = assets.find(a => a.id === id);
          
          if (foundAsset) {
            setAsset(foundAsset);
            
            // Try to parse notes as JSON
            if (foundAsset.notes) {
              try {
                const parsed = JSON.parse(foundAsset.notes);
                if (typeof parsed === 'object') {
                  setParsedNotes(parsed);
                }
              } catch (e) {
                // Not JSON, use as-is
                setParsedNotes(null);
              }
            }
          } else {
            toast({
              title: "Activo no encontrado",
              description: "El activo solicitado no se pudo encontrar.",
              variant: "destructive",
            });
            navigate('/');
          }
        } catch (error) {
          console.error("Error loading asset:", error);
          toast({
            title: "Error",
            description: "No se pudo cargar la información del activo.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadAsset();
  }, [id, navigate, toast]);

  const handleDeleteAsset = async () => {
    try {
      if (id) {
        setIsDeleting(true);
        await deleteAsset(id);
        toast({
          title: "Activo eliminado",
          description: "El activo ha sido eliminado del inventario.",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: "Error al eliminar activo",
        description: "Hubo un problema al eliminar el activo.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getAssetIcon = () => {
    if (!asset) return <HelpCircle size={24} />;
    
    switch (asset.type) {
      case 'computer': return <Computer size={24} />;
      case 'laptop': return <Laptop size={24} />;
      case 'monitor': return <Monitor size={24} />;
      case 'mouse': return <Mouse size={24} />;
      case 'keyboard': return <Keyboard size={24} />;
      case 'telephone': return <Phone size={24} />;
      case 'mobile': return <Smartphone size={24} />;
      case 'scanner': return <ScanLine size={24} />;
      case 'printer': return <Printer size={24} />;
      default: return <HelpCircle size={24} />;
    }
  };

  const getStatusBadge = () => {
    if (!asset) return null;
    
    switch (asset.status) {
      case 'available':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Disponible</Badge>;
      case 'assigned':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Asignado</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Mantenimiento</Badge>;
      case 'retired':
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Retirado</Badge>;
    }
  };

  const getAssets = async () => {
    const { getAssets } = await import('@/lib/db');
    return getAssets();
  };

  const renderSpecificDetails = () => {
    if (!asset || !parsedNotes) return null;
    
    if (asset.type === 'computer' || asset.type === 'laptop') {
      return (
        <div className="space-y-6 mt-4">
          <h3 className="text-sm font-medium text-muted-foreground">Detalles adicionales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parsedNotes.operatingSystem && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Sistema Operativo</p>
                <p className="font-medium">{parsedNotes.operatingSystem}</p>
              </div>
            )}
            {parsedNotes.teamviewerId && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">ID de TeamViewer</p>
                <p className="font-medium">{parsedNotes.teamviewerId}</p>
              </div>
            )}
            {parsedNotes.rental && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Alquiler</p>
                <p className="font-medium">{parsedNotes.rental}</p>
              </div>
            )}
            {parsedNotes.deliveryNote && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nota de entrega</p>
                <p className="font-medium">{parsedNotes.deliveryNote}</p>
              </div>
            )}
          </div>
        </div>
      );
    } else if (asset.type === 'mobile') {
      return (
        <div className="space-y-6 mt-4">
          <h3 className="text-sm font-medium text-muted-foreground">Detalles del móvil</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parsedNotes.phoneNumber && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Número de teléfono</p>
                <p className="font-medium">{parsedNotes.phoneNumber}</p>
              </div>
            )}
            {parsedNotes.pin && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">PIN</p>
                <p className="font-medium">{parsedNotes.pin}</p>
              </div>
            )}
            {parsedNotes.puk && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">PUK</p>
                <p className="font-medium">{parsedNotes.puk}</p>
              </div>
            )}
            {parsedNotes.imei1 && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">IMEI 1</p>
                <p className="font-medium">{parsedNotes.imei1}</p>
              </div>
            )}
            {parsedNotes.imei2 && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">IMEI 2</p>
                <p className="font-medium">{parsedNotes.imei2}</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return null;
  };

  const getNotesContent = () => {
    if (!asset) return 'Sin notas';
    
    if (parsedNotes) {
      return parsedNotes.generalNotes || 'Sin notas';
    }
    
    return asset.notes || 'Sin notas';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Cargando información del activo...</span>
      </div>
    );
  }

  if (!asset) {
    return <div className="p-8 text-center">Activo no encontrado</div>;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-muted rounded-full p-2">
            {getAssetIcon()}
          </div>
          <div>
            <CardTitle>{asset.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm capitalize text-muted-foreground">{asset.type}</span>
              {getStatusBadge()}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Modelo</p>
            <p className="font-medium">{asset.model || 'No especificado'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Número de Serie</p>
            <p className="font-medium">{asset.serialNumber || 'No especificado'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Fecha de Compra</p>
            <p className="font-medium">{asset.purchaseDate || 'No especificada'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Asignado a</p>
            <p className="font-medium">{asset.assignedTo || 'No asignado'}</p>
          </div>
        </div>
        
        {renderSpecificDetails()}
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Notas</p>
          <div className="bg-muted p-3 rounded-md">
            <p className="whitespace-pre-wrap">{getNotesContent()}</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Última Actualización</p>
          <p className="font-medium">{asset.lastUpdated}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate(`/assets/id/${id}/edit`)}
          >
            <Edit size={16} />
            <span>Editar</span>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive"
                className="flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash size={16} />
                )}
                <span>Eliminar</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar activo</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Estás seguro de que quieres eliminar "{asset.name}"? Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAsset}>Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AssetDetail;
