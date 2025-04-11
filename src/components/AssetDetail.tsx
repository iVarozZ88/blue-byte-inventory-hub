
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Asset, getAssets, deleteAsset } from '@/lib/db';
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
  Trash
} from 'lucide-react';

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const assets = getAssets();
      const foundAsset = assets.find(a => a.id === id);
      
      if (foundAsset) {
        setAsset(foundAsset);
      } else {
        toast({
          title: "Asset not found",
          description: "The requested asset could not be found.",
          variant: "destructive",
        });
        navigate('/');
      }
      setLoading(false);
    }
  }, [id, navigate, toast]);

  const handleDeleteAsset = () => {
    try {
      if (id) {
        deleteAsset(id);
        toast({
          title: "Asset deleted",
          description: "The asset has been removed from inventory.",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: "Error deleting asset",
        description: "There was a problem deleting the asset.",
        variant: "destructive",
      });
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
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Available</Badge>;
      case 'assigned':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Assigned</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Maintenance</Badge>;
      case 'retired':
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Retired</Badge>;
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading asset information...</div>;
  }

  if (!asset) {
    return <div className="p-8 text-center">Asset not found</div>;
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
            <p className="text-sm text-muted-foreground">Model</p>
            <p className="font-medium">{asset.model || 'Not specified'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Serial Number</p>
            <p className="font-medium">{asset.serialNumber || 'Not specified'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Purchase Date</p>
            <p className="font-medium">{asset.purchaseDate || 'Not specified'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Assigned To</p>
            <p className="font-medium">{asset.assignedTo || 'Not assigned'}</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Notes</p>
          <div className="bg-muted p-3 rounded-md">
            <p>{asset.notes || 'No notes'}</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Last Updated</p>
          <p className="font-medium">{asset.lastUpdated}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate(`/assets/${id}/edit`)}
          >
            <Edit size={16} />
            <span>Edit</span>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash size={16} />
                <span>Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete asset</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{asset.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAsset}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AssetDetail;
