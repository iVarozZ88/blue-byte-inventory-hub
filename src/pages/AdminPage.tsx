
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

// Password for admin access
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
      // Create a text file in Supabase Storage
      const fileName = `${newDocument.name}.txt`;
      
      // First ensure admin-docs bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'admin-docs')) {
        await supabase.storage.createBucket('admin-docs', {
          public: false
        });
      }
      
      const { error } = await supabase.storage
        .from('admin-docs')
        .upload(fileName, new Blob([newDocument.content], { type: 'text/plain' }));
      
      if (error) throw error;
      
      // Reset form
      setNewDocument({ name: '', content: '' });
      setShowNewDocument(false);
      
      toast({
        title: "Documento creado",
        description: `Se ha creado el documento "${fileName}".`
      });
    } catch (error) {
      console.error('Error creating document:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el documento.",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      // Ensure admin-docs bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'admin-docs')) {
        await supabase.storage.createBucket('admin-docs', {
          public: false
        });
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Upload file to Supabase Storage
        const { error } = await supabase.storage
          .from('admin-docs')
          .upload(file.name, file);
        
        if (error) throw error;
      }
      
      toast({
        title: "Archivos subidos",
        description: `Se subieron ${files.length} archivo(s) correctamente.`
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Error de subida",
        description: "No se pudieron subir los archivos.",
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
