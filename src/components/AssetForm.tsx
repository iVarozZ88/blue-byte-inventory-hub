import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Asset, AssetType, AssetStatus, addAsset, updateAsset, formatDate } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface AssetFormProps {
  mode: 'create' | 'edit';
}

const assetTypes: { value: AssetType; label: string }[] = [
  { value: 'computer', label: 'Computer' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'monitor', label: 'Monitor' },
  { value: 'mouse', label: 'Mouse' },
  { value: 'keyboard', label: 'Keyboard' },
  { value: 'telephone', label: 'Telephone' },
  { value: 'mobile', label: 'Mobile Phone' },
  { value: 'scanner', label: 'Scanner' },
  { value: 'printer', label: 'Printer' },
  { value: 'cable', label: 'Cable' },
  { value: 'license', label: 'License' },
  { value: 'other', label: 'Other' },
];

const assetStatuses: { value: AssetStatus; label: string }[] = [
  { value: 'available', label: 'Available' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'maintenance', label: 'In Maintenance' },
  { value: 'retired', label: 'Retired' },
];

const AssetForm = ({ mode }: AssetFormProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [asset, setAsset] = useState<Partial<Asset & {
    operatingSystem?: string;
    rental?: string;
    deliveryNote?: string;
    teamviewerId?: string;
    phoneNumber?: string;
    pin?: string;
    puk?: string;
    imei1?: string;
    imei2?: string;
  }>>({
    name: '',
    type: 'computer',
    model: '',
    serialNumber: '',
    purchaseDate: formatDate(new Date()),
    status: 'available',
    assignedTo: '',
    notes: '',
    operatingSystem: '',
    rental: '',
    deliveryNote: '',
    teamviewerId: '',
    phoneNumber: '',
    pin: '',
    puk: '',
    imei1: '',
    imei2: ''
  });

  const [loading, setLoading] = useState<boolean>(mode === 'edit');
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  useEffect(() => {
    const loadAsset = async () => {
      if (mode === 'edit' && id) {
        try {
          const { getAssets } = await import('@/lib/db');
          const assets = await getAssets();
          const existingAsset = assets.find(a => a.id === id);
          
          if (existingAsset) {
            setAsset({
              ...existingAsset,
              ...(existingAsset.notes ? tryParseCustomFields(existingAsset.notes) : {})
            });
          } else {
            toast({
              title: "Asset not found",
              description: "The requested asset could not be found.",
              variant: "destructive",
            });
            navigate('/');
          }
        } catch (error) {
          console.error("Error loading asset:", error);
          toast({
            title: "Error",
            description: "Could not load asset information.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadAsset();
  }, [id, mode, navigate, toast]);

  const tryParseCustomFields = (notes: string) => {
    try {
      const parsedNotes = JSON.parse(notes);
      if (typeof parsedNotes === 'object') {
        if (parsedNotes.operatingSystem !== undefined) {
          return {
            operatingSystem: parsedNotes.operatingSystem || '',
            rental: parsedNotes.rental || '',
            deliveryNote: parsedNotes.deliveryNote || '',
            teamviewerId: parsedNotes.teamviewerId || '',
            notes: parsedNotes.generalNotes || ''
          };
        } else if (parsedNotes.phoneNumber !== undefined) {
          return {
            phoneNumber: parsedNotes.phoneNumber || '',
            pin: parsedNotes.pin || '',
            puk: parsedNotes.puk || '',
            imei1: parsedNotes.imei1 || '',
            imei2: parsedNotes.imei2 || '',
            notes: parsedNotes.generalNotes || ''
          };
        }
      }
    } catch (e) {
      // If parsing fails, it's just regular notes
    }
    return { notes };
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAsset(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setAsset(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!asset.name || !asset.type || !asset.status) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      let finalAsset = { ...asset };
      
      if (asset.type === 'computer' || asset.type === 'laptop') {
        const { operatingSystem, rental, deliveryNote, teamviewerId, notes, ...standardAsset } = asset;
        
        const customFields: Record<string, string> = {};
        if (operatingSystem) customFields.operatingSystem = operatingSystem;
        if (rental) customFields.rental = rental;
        if (deliveryNote) customFields.deliveryNote = deliveryNote;
        if (teamviewerId) customFields.teamviewerId = teamviewerId;
        if (notes) customFields.generalNotes = notes;
        
        const hasCustomFields = Object.keys(customFields).length > 0;
        finalAsset = {
          ...standardAsset,
          notes: hasCustomFields ? JSON.stringify(customFields) : notes || ''
        };
      } else if (asset.type === 'mobile') {
        const { phoneNumber, pin, puk, imei1, imei2, notes, ...standardAsset } = asset;
        
        const customFields: Record<string, string> = {};
        if (phoneNumber) customFields.phoneNumber = phoneNumber;
        if (pin) customFields.pin = pin;
        if (puk) customFields.puk = puk;
        if (imei1) customFields.imei1 = imei1;
        if (imei2) customFields.imei2 = imei2;
        if (notes) customFields.generalNotes = notes;
        
        const hasCustomFields = Object.keys(customFields).length > 0;
        finalAsset = {
          ...standardAsset,
          notes: hasCustomFields ? JSON.stringify(customFields) : notes || ''
        };
      }
      
      if (mode === 'create') {
        const newAsset = await addAsset(finalAsset as Omit<Asset, 'id' | 'lastUpdated'>);
        toast({
          title: "Asset created",
          description: `${newAsset.name} has been added to inventory.`,
        });
      } else if (mode === 'edit' && id) {
        const updatedAsset = await updateAsset({...(finalAsset as Asset), id});
        toast({
          title: "Asset updated",
          description: `${updatedAsset.name} has been updated.`,
        });
      }
      
      navigate('/');
    } catch (error) {
      console.error('Error saving asset:', error);
      toast({
        title: "Error saving asset",
        description: "There was a problem saving the asset information.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading asset information...</span>
      </div>
    );
  }

  const isComputerOrLaptop = asset.type === 'computer' || asset.type === 'laptop';
  const isMobilePhone = asset.type === 'mobile';

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Add New Asset' : 'Edit Asset'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Asset Name*</Label>
              <Input 
                id="name" 
                name="name" 
                value={asset.name} 
                onChange={handleInputChange}
                placeholder="e.g. Dell XPS 15"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Asset Type*</Label>
              <Select 
                name="type" 
                value={asset.type} 
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  {assetTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input 
                id="model" 
                name="model" 
                value={asset.model || ''} 
                onChange={handleInputChange}
                placeholder="e.g. XPS 15 9500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input 
                id="serialNumber" 
                name="serialNumber" 
                value={asset.serialNumber || ''} 
                onChange={handleInputChange}
                placeholder="e.g. SN12345678"
              />
            </div>
          </div>
          
          {isComputerOrLaptop && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="operatingSystem">Operating System</Label>
                  <Input 
                    id="operatingSystem" 
                    name="operatingSystem" 
                    value={asset.operatingSystem || ''} 
                    onChange={handleInputChange}
                    placeholder="e.g. Windows 10 Pro"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamviewerId">Teamviewer ID</Label>
                  <Input 
                    id="teamviewerId" 
                    name="teamviewerId" 
                    value={asset.teamviewerId || ''} 
                    onChange={handleInputChange}
                    placeholder="e.g. 123 456 789"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="rental">Rental</Label>
                  <Input 
                    id="rental" 
                    name="rental" 
                    value={asset.rental || ''} 
                    onChange={handleInputChange}
                    placeholder="e.g. Monthly rental"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryNote">Delivery Note</Label>
                  <Input 
                    id="deliveryNote" 
                    name="deliveryNote" 
                    value={asset.deliveryNote || ''} 
                    onChange={handleInputChange}
                    placeholder="e.g. DN-12345"
                  />
                </div>
              </div>
            </>
          )}

          {isMobilePhone && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input 
                    id="phoneNumber" 
                    name="phoneNumber" 
                    value={asset.phoneNumber || ''} 
                    onChange={handleInputChange}
                    placeholder="e.g. +34 612345678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pin">PIN</Label>
                  <Input 
                    id="pin" 
                    name="pin" 
                    value={asset.pin || ''} 
                    onChange={handleInputChange}
                    placeholder="e.g. 1234"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="puk">PUK</Label>
                  <Input 
                    id="puk" 
                    name="puk" 
                    value={asset.puk || ''} 
                    onChange={handleInputChange}
                    placeholder="e.g. 12345678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imei1">IMEI 1</Label>
                  <Input 
                    id="imei1" 
                    name="imei1" 
                    value={asset.imei1 || ''} 
                    onChange={handleInputChange}
                    placeholder="e.g. 123456789012345"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="imei2">IMEI 2</Label>
                  <Input 
                    id="imei2" 
                    name="imei2" 
                    value={asset.imei2 || ''} 
                    onChange={handleInputChange}
                    placeholder="e.g. 123456789012345"
                  />
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input 
                id="purchaseDate" 
                name="purchaseDate" 
                type="date" 
                value={asset.purchaseDate || ''} 
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status*</Label>
              <Select 
                name="status" 
                value={asset.status} 
                onValueChange={(value) => handleSelectChange('status', value as AssetStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {assetStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={asset.status === 'assigned' ? "block" : "hidden"}>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input 
                id="assignedTo" 
                name="assignedTo" 
                value={asset.assignedTo || ''} 
                onChange={handleInputChange}
                placeholder="e.g. John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              name="notes" 
              value={asset.notes || ''} 
              onChange={handleInputChange}
              placeholder="Additional information about this asset"
              rows={3}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'create' ? 'Adding Asset...' : 'Saving Changes...'}
              </>
            ) : (
              mode === 'create' ? 'Add Asset' : 'Save Changes'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AssetForm;
