import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Asset, AssetType, AssetStatus, addAsset, updateAsset, formatDate } from '@/lib/db';
import { assetSchema, type AssetFormData } from '@/lib/assetSchema';
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
  canWriteAssets?: boolean;
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

const assetLocations: { value: 'MCI_SPAIN' | 'MCI_LATAM'; label: string }[] = [
  { value: 'MCI_SPAIN', label: 'España' },
  { value: 'MCI_LATAM', label: 'LATAM (Rep. Dominicana)' },
];

const defaultValues: AssetFormData = {
  name: '',
  type: 'computer',
  model: '',
  serialNumber: '',
  purchaseDate: formatDate(new Date()),
  status: 'available',
  assignedTo: '',
  location: 'MCI_SPAIN',
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
};

const AssetForm = ({ mode, canWriteAssets = true }: AssetFormProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues,
  });

  const [loading, setLoading] = useState<boolean>(mode === 'edit');
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  useEffect(() => {
    const loadAsset = async () => {
      if (mode === 'edit' && id) {
        try {
          const { getAssets } = await import('@/lib/db');
          // getAssets ahora acepta un filtro de ubicación, pero aquí queremos TODOS para encontrar por ID
          // Si tienes un getAssetById, sería mejor usarlo aquí.
          const assets = await getAssets(null); // Pasa null para obtener todos sin filtro de ubicación inicial
          const existingAsset = assets.find(a => a.id === id);
          
          if (existingAsset) {
            const customFields = existingAsset.notes ? tryParseCustomFields(existingAsset.notes) : {};
            form.reset({
              name: existingAsset.name,
              type: existingAsset.type,
              model: existingAsset.model ?? '',
              serialNumber: existingAsset.serialNumber ?? '',
              purchaseDate: existingAsset.purchaseDate ?? formatDate(new Date()),
              status: existingAsset.status,
              assignedTo: existingAsset.assignedTo ?? '',
              location: existingAsset.location ?? 'MCI_SPAIN',
              notes: (customFields as { notes?: string }).notes ?? existingAsset.notes ?? '',
              operatingSystem: (customFields as { operatingSystem?: string }).operatingSystem ?? '',
              rental: (customFields as { rental?: string }).rental ?? '',
              deliveryNote: (customFields as { deliveryNote?: string }).deliveryNote ?? '',
              teamviewerId: (customFields as { teamviewerId?: string }).teamviewerId ?? '',
              phoneNumber: (customFields as { phoneNumber?: string }).phoneNumber ?? '',
              pin: (customFields as { pin?: string }).pin ?? '',
              puk: (customFields as { puk?: string }).puk ?? '',
              imei1: (customFields as { imei1?: string }).imei1 ?? '',
              imei2: (customFields as { imei2?: string }).imei2 ?? '',
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
      } else {
        setLoading(false); // Si es modo 'create', no hay carga inicial
      }
    };
    
    loadAsset();
  }, [id, mode, navigate, toast, form]);

  const tryParseCustomFields = (notes: string) => {
    try {
      const parsedNotes = JSON.parse(notes);
      if (typeof parsedNotes === 'object') {
        // Asegúrate de que los campos específicos de cada tipo sean manejados
        // y que 'generalNotes' sea usado para el campo 'notes' principal
        const commonNotes = parsedNotes.generalNotes || '';
        if (parsedNotes.operatingSystem !== undefined) {
          return {
            operatingSystem: parsedNotes.operatingSystem || '',
            rental: parsedNotes.rental || '',
            deliveryNote: parsedNotes.deliveryNote || '',
            teamviewerId: parsedNotes.teamviewerId || '',
            notes: commonNotes // Usa generalNotes para el campo 'notes'
          };
        } else if (parsedNotes.phoneNumber !== undefined) {
          return {
            phoneNumber: parsedNotes.phoneNumber || '',
            pin: parsedNotes.pin || '',
            puk: parsedNotes.puk || '',
            imei1: parsedNotes.imei1 || '',
            imei2: parsedNotes.imei2 || '',
            notes: commonNotes // Usa generalNotes para el campo 'notes'
          };
        }
      }
    } catch (e) {
      // If parsing fails, it's just regular notes
    }
    return { notes }; // Si no es JSON o no coincide, devuelve las notas tal cual
  };

  const onSubmit = async (data: AssetFormData) => {
    if (!canWriteAssets) {
      toast({
        title: "Solo lectura",
        description: "No tienes permisos para modificar activos en esta ubicación.",
        variant: "destructive",
      });
      return;
    }
    try {
      setSubmitting(true);

      let finalAsset: Partial<Asset> = { ...data };
      
      // Manejo de campos personalizados y notas
      const customFields: Record<string, string> = {};
      // Siempre incluye las notas generales
      if (data.notes) customFields.generalNotes = data.notes;

      if (data.type === 'computer' || data.type === 'laptop') {
        if (data.operatingSystem) customFields.operatingSystem = data.operatingSystem;
        if (data.rental) customFields.rental = data.rental;
        if (data.deliveryNote) customFields.deliveryNote = data.deliveryNote;
        if (data.teamviewerId) customFields.teamviewerId = data.teamviewerId;
        
        // Excluye los campos específicos del objeto principal para no guardarlos directamente en la tabla
        const { operatingSystem, rental, deliveryNote, teamviewerId, phoneNumber, pin, puk, imei1, imei2, ...standardAsset } = data;
        finalAsset = {
          ...standardAsset,
          notes: Object.keys(customFields).length > 0 ? JSON.stringify(customFields) : '',
          location: data.location,
        } as Partial<Asset>;
      } else if (data.type === 'mobile') {
        if (data.phoneNumber) customFields.phoneNumber = data.phoneNumber;
        if (data.pin) customFields.pin = data.pin;
        if (data.puk) customFields.puk = data.puk;
        if (data.imei1) customFields.imei1 = data.imei1;
        if (data.imei2) customFields.imei2 = data.imei2;

        const { phoneNumber, pin, puk, imei1, imei2, operatingSystem, rental, deliveryNote, teamviewerId, ...standardAsset } = data;
        finalAsset = {
          ...standardAsset,
          notes: Object.keys(customFields).length > 0 ? JSON.stringify(customFields) : '',
          location: data.location,
        } as Partial<Asset>;
      } else {
        // Para otros tipos, solo serializamos las notas si existen
        const { operatingSystem, rental, deliveryNote, teamviewerId, phoneNumber, pin, puk, imei1, imei2, ...standardAsset } = data;
        finalAsset = {
          ...standardAsset,
          notes: data.notes || '',
          location: data.location,
        } as Partial<Asset>;
      }
      
      if (mode === 'create') {
        // Asegúrate de que addAsset reciba el tipo correcto
        const newAsset = await addAsset(finalAsset as Omit<Asset, 'id' | 'lastUpdated'>);
        toast({
          title: "Asset created",
          description: `${newAsset.name} has been added to inventory.`,
        });
      } else if (mode === 'edit' && id) {
        // Asegúrate de que updateAsset reciba el tipo correcto y el ID
        const updatedAsset = await updateAsset({...finalAsset as Asset, id});
        toast({
          title: "Asset updated",
          description: `${updatedAsset.name} has been updated.`,
        });
      }
      
      navigate('/'); // Redirigir al dashboard después de guardar
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

  const assetType = form.watch('type');
  const assetStatus = form.watch('status');
  const isComputerOrLaptop = assetType === 'computer' || assetType === 'laptop';
  const isMobilePhone = assetType === 'mobile';

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === 'create' ? 'Add New Asset' : 'Edit Asset'}</CardTitle>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Asset Name*</Label>
              <Input 
                id="name" 
                placeholder="e.g. Dell XPS 15"
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Asset Type*</Label>
              <Controller
                name="type"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
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
                )}
              />
              {form.formState.errors.type && (
                <p className="text-red-500 text-sm">{form.formState.errors.type.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input 
                id="model" 
                placeholder="e.g. XPS 15 9500"
                {...form.register('model')}
              />
              {form.formState.errors.model && (
                <p className="text-red-500 text-sm">{form.formState.errors.model.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input 
                id="serialNumber" 
                placeholder="e.g. SN12345678"
                {...form.register('serialNumber')}
              />
              {form.formState.errors.serialNumber && (
                <p className="text-red-500 text-sm">{form.formState.errors.serialNumber.message}</p>
              )}
            </div>
          </div>
          
          {isComputerOrLaptop && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="operatingSystem">Operating System</Label>
                  <Input 
                    id="operatingSystem" 
                    placeholder="e.g. Windows 10 Pro"
                    {...form.register('operatingSystem')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamviewerId">Teamviewer ID</Label>
                  <Input 
                    id="teamviewerId" 
                    placeholder="e.g. 123 456 789"
                    {...form.register('teamviewerId')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="rental">Rental</Label>
                  <Input 
                    id="rental" 
                    placeholder="e.g. Monthly rental"
                    {...form.register('rental')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryNote">Delivery Note</Label>
                  <Input 
                    id="deliveryNote" 
                    placeholder="e.g. DN-12345"
                    {...form.register('deliveryNote')}
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
                    placeholder="e.g. +34 612345678"
                    {...form.register('phoneNumber')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pin">PIN</Label>
                  <Input 
                    id="pin" 
                    placeholder="e.g. 1234"
                    {...form.register('pin')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="puk">PUK</Label>
                  <Input 
                    id="puk" 
                    placeholder="e.g. 12345678"
                    {...form.register('puk')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imei1">IMEI 1</Label>
                  <Input 
                    id="imei1" 
                    placeholder="e.g. 123456789012345"
                    {...form.register('imei1')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="imei2">IMEI 2</Label>
                  <Input 
                    id="imei2" 
                    placeholder="e.g. 123456789012345"
                    {...form.register('imei2')}
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
                type="date" 
                {...form.register('purchaseDate')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status*</Label>
              <Controller
                name="status"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(v) => field.onChange(v as AssetStatus)}>
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
                )}
              />
              {form.formState.errors.status && (
                <p className="text-red-500 text-sm">{form.formState.errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación*</Label>
              <Controller
                name="location"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Selecciona una ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      {assetLocations.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.location && (
                <p className="text-red-500 text-sm">{form.formState.errors.location.message}</p>
              )}
            </div>
          </div>

          <div className={assetStatus === 'assigned' ? "block" : "hidden"}>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input 
                id="assignedTo" 
                placeholder="e.g. John Doe"
                {...form.register('assignedTo')}
              />
              {form.formState.errors.assignedTo && (
                <p className="text-red-500 text-sm">{form.formState.errors.assignedTo.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              placeholder="Additional information about this asset"
              rows={3}
              {...form.register('notes')}
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
          <Button type="submit" disabled={submitting || !canWriteAssets}>
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
