import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Upload, FolderPlus, FilePlus2 } from 'lucide-react';

const ADMIN_PASSWORD = 'Inventory@@12345@';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDialog, setShowDialog] = useState(true);
  const [password, setPassword] = useState('');
  const [showNewDocument, setShowNewDocument] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: '',
    content: ''
  });

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowDialog(false);
      toast({
        title: "Acceso concedido",
        description: "Has iniciado sesión como administrador.",
      });
    } else {
      toast({
        title: "Acceso denegado",
        description: "La contraseña es incorrecta. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const ensureBucketExists = async () => {
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      if (error) {
        console.error('Error listing buckets:', error);
        throw error;
      }
      
      if (!buckets?.find(bucket => bucket.name === "admin-docs")) {
        const { error: createError } = await supabase.storage.createBucket("admin-docs", { 
          public: true
        });
        
        if (createError) {
          if (!createError.message.includes('duplicate')) {
            console.error('Error creating bucket:', createError);
            throw createError;
          }
        } else {
          await setPublicBucketPolicy();
        }
      }
    } catch (error) {
      console.error('Error ensuring bucket exists:', error);
      throw error;
    }
  };

  const setPublicBucketPolicy = async () => {
    try {
      const { error: policyError } = await supabase.storage
        .from('admin-docs')
        .createSignedUrl('policy.txt', 60);
      
      if (policyError && !policyError.message.includes('does not exist')) {
        console.error('Error setting bucket policy:', policyError);
      }
    } catch (error) {
      console.error('Error setting public policy:', error);
    }
  };

  const handleAddDocument = async () => {
    if (!newDocument.name) {
      toast({
        title: "Error",
        description: "El documento debe tener un nombre",
        variant: "destructive"
      });
      return;
    }

    try {
      await ensureBucketExists();
      const fileName = `${newDocument.name}.txt`;

      try {
        const { data: existingFile } = await supabase.storage
          .from("admin-docs")
          .getPublicUrl(fileName);
          
        if (existingFile?.publicUrl) {
          toast({
            title: "Archivo existente",
            description: `Ya hay un documento llamado "${fileName}". Usa otro nombre.`,
            variant: "destructive"
          });
          return;
        }
      } catch (error) {
        console.log('File does not exist yet, proceeding with upload');
      }

      const blob = new Blob([newDocument.content], { type: "text/plain" });
      const { error: uploadError } = await supabase.storage
        .from("admin-docs")
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      setNewDocument({ name: '', content: '' });
      setShowNewDocument(false);
      toast({
        title: "Documento creado",
        description: `Se ha creado el documento "${fileName}".`
      });
    } catch (error: any) {
      console.error('Error creating document:', error);
      toast({
        title: "Error",
        description: error?.message || "No se pudo crear el documento. Verifica los permisos de acceso.",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    let successCount = 0;
    
    try {
      await ensureBucketExists();
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          const { data: existingFile } = await supabase.storage
            .from("admin-docs")
            .getPublicUrl(file.name);
            
          if (existingFile?.publicUrl) {
            toast({
              title: "Archivo existente",
              description: `Ya existe un archivo llamado "${file.name}", omitiendo.`,
              variant: "destructive"
            });
            continue;
          }
        } catch (error) {
          console.log('File does not exist yet, proceeding with upload');
        }

        const { error: uploadError } = await supabase.storage
          .from("admin-docs")
          .upload(file.name, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) {
          console.error('Upload error for file:', file.name, uploadError);
          toast({
            title: "Error al subir",
            description: `No se pudo subir "${file.name}": ${uploadError.message}`,
            variant: "destructive"
          });
          continue;
        }
        
        successCount++;
      }
      
      if (successCount > 0) {
        toast({
          title: "Archivos subidos",
          description: `Se subieron ${successCount} archivo(s) correctamente.`
        });
      }
    } catch (error: any) {
      console.error('Error uploading files:', error);
      toast({
        title: "Error de subida",
        description: error?.message || "No se pudieron subir los archivos.",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Área de administrador</DialogTitle>
            <DialogDescription>
              Por favor, ingrese la contraseña de administrador para continuar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handlePasswordSubmit}>Ingresar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Panel de Administrador</h1>
        <Button variant="outline" onClick={() => setShowDialog(true)}>
          Cerrar Sesión
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Crear documento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {showNewDocument ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doc-title">Título</Label>
                  <Input 
                    id="doc-title" 
                    value={newDocument.name}
                    onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doc-content">Contenido</Label>
                  <textarea 
                    id="doc-content"
                    value={newDocument.content}
                    onChange={(e) => setNewDocument({...newDocument, content: e.target.value})}
                    className="w-full min-h-[200px] p-2 border rounded-md"
                  />
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setShowNewDocument(false)}>Cancelar</Button>
                  <Button onClick={handleAddDocument}>Guardar</Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Crear nuevo documento</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Crea un nuevo documento de texto.
                </p>
                <Button onClick={() => setShowNewDocument(true)}>
                  <FilePlus2 className="mr-2 h-4 w-4" />
                  Nuevo documento
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Subir archivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg">
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Subir archivos</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Arrastra y suelta archivos o haz clic para seleccionarlos.
              </p>
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                Seleccionar archivos
              </Button>
              <input 
                id="file-upload"
                type="file" 
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
