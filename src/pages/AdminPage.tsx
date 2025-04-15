
import { useState, useRef, ChangeEvent } from 'react';
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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  FileText, 
  Folder, 
  Upload, 
  Edit, 
  Trash2, 
  FolderPlus,
  FilePlus2,
  Download,
  File
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Password for admin access
const ADMIN_PASSWORD = 'Inventory@@12345@';

interface Folder {
  id: string;
  name: string;
  documents: Document[];
}

interface Document {
  id: string;
  name: string;
  content?: string;
  dateCreated: string;
  filePath?: string;
  fileType?: string;
  fileSize?: number;
}

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDialog, setShowDialog] = useState(true);
  const [password, setPassword] = useState('');
  const [folders, setFolders] = useState<Folder[]>([
    {
      id: '1',
      name: 'Documentación General',
      documents: [
        {
          id: '1',
          name: 'Guía de inventario',
          content: 'Esta es la guía oficial para gestionar el inventario.',
          dateCreated: new Date().toISOString().split('T')[0]
        }
      ]
    }
  ]);
  const [activeFolder, setActiveFolder] = useState<string>('1');
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewDocument, setShowNewDocument] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: '',
    content: ''
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePasswordSubmit = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowDialog(false);
      toast({
        title: "Acceso concedido",
        description: "Has iniciado sesión como administrador.",
      });
      loadFolderStructure();
    } else {
      toast({
        title: "Acceso denegado",
        description: "La contraseña es incorrecta. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });
    }
  };

  // Load folder structure from Supabase Storage
  const loadFolderStructure = async () => {
    try {
      // Check if the admin-docs bucket exists, if not create it
      const { data: buckets } = await supabase.storage.listBuckets();
      if (!buckets?.find(bucket => bucket.name === 'admin-docs')) {
        await createStorageBucket('admin-docs');
      }

      // List all folders (root-level objects that end with /)
      const { data: rootObjects } = await supabase.storage
        .from('admin-docs')
        .list();

      if (!rootObjects) {
        return;
      }

      // Process folders
      const foldersList: Folder[] = [];
      
      // Process root objects to identify folders (ends with /)
      const folderEntries = rootObjects.filter(item => item.name.endsWith('/'));
      const standaloneFiles = rootObjects.filter(item => !item.name.endsWith('/'));
      
      // Create a "root" folder for files not in any subfolder if needed
      if (standaloneFiles.length > 0) {
        const rootFolderDocuments = await loadFilesInFolder('');
        foldersList.push({
          id: 'root',
          name: 'Root',
          documents: rootFolderDocuments
        });
      }

      // For each folder, load its files
      for (const folder of folderEntries) {
        const folderName = folder.name.slice(0, -1); // Remove trailing slash
        const documents = await loadFilesInFolder(folder.name);
        
        foldersList.push({
          id: folderName,
          name: folderName,
          documents: documents
        });
      }
      
      if (foldersList.length > 0) {
        setFolders(foldersList);
        setActiveFolder(foldersList[0].id);
      } else {
        // Ensure we have at least the default folder
        const defaultFolder = {
          id: 'documentacion-general',
          name: 'Documentación General',
          documents: []
        };
        setFolders([defaultFolder]);
        setActiveFolder(defaultFolder.id);
        
        // Create the folder in storage
        await supabase.storage
          .from('admin-docs')
          .upload('Documentación General/', new Blob(['']));
      }
    } catch (error) {
      console.error('Error loading folder structure:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las carpetas.",
        variant: "destructive"
      });
    }
  };

  const loadFilesInFolder = async (folderPath: string): Promise<Document[]> => {
    try {
      const { data: files, error } = await supabase.storage
        .from('admin-docs')
        .list(folderPath);
      
      if (error) {
        throw error;
      }

      // Filter out "subfolders" (items ending with /)
      const actualFiles = files?.filter(file => !file.name.endsWith('/')) || [];
      
      // Transform files to Document format
      return actualFiles.map(file => ({
        id: file.id || file.name,
        name: file.name,
        filePath: folderPath + file.name,
        fileType: getFileType(file.name),
        fileSize: file.metadata?.size,
        dateCreated: new Date(file.created_at || Date.now()).toISOString().split('T')[0]
      }));
    } catch (error) {
      console.error(`Error loading files in ${folderPath}:`, error);
      return [];
    }
  };

  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const mimeTypes: Record<string, string> = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'txt': 'text/plain'
    };
    
    return mimeTypes[extension] || 'application/octet-stream';
  };

  const createStorageBucket = async (bucketName: string) => {
    try {
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: false
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error creating bucket:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el bucket de almacenamiento.",
        variant: "destructive"
      });
    }
  };

  const handleAddFolder = async () => {
    const folderName = `Nueva Carpeta ${folders.length + 1}`;
    const folderId = folderName.replace(/\s+/g, '-').toLowerCase();
    
    try {
      // Create folder in Supabase Storage (empty file with trailing slash)
      const { error } = await supabase.storage
        .from('admin-docs')
        .upload(`${folderName}/`, new Blob(['']));
      
      if (error) throw error;
      
      // Update local state
      setFolders([...folders, {
        id: folderId,
        name: folderName,
        documents: []
      }]);
      setActiveFolder(folderId);
      
      toast({
        title: "Carpeta creada",
        description: `Se ha creado la carpeta "${folderName}".`
      });
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la carpeta.",
        variant: "destructive"
      });
    }
  };

  const handleRenameFolder = async (folderId: string, newName: string) => {
    const oldFolder = folders.find(folder => folder.id === folderId);
    if (!oldFolder) return;
    
    try {
      // We can't rename folders in Supabase Storage directly
      // We need to copy all files to a new path and then delete the old ones
      const folderDocuments = oldFolder.documents;
      
      // For each file in the folder
      for (const doc of folderDocuments) {
        if (!doc.filePath) continue;
        
        // Get the file
        const { data: fileData } = await supabase.storage
          .from('admin-docs')
          .download(doc.filePath);
        
        if (!fileData) continue;
        
        // Create new path
        const newPath = doc.filePath.replace(oldFolder.name, newName);
        
        // Upload to new path
        await supabase.storage
          .from('admin-docs')
          .upload(newPath, fileData);
          
        // Delete old file
        await supabase.storage
          .from('admin-docs')
          .remove([doc.filePath]);
      }
      
      // Create new folder marker
      await supabase.storage
        .from('admin-docs')
        .upload(`${newName}/`, new Blob(['']));
        
      // Remove old folder marker
      await supabase.storage
        .from('admin-docs')
        .remove([`${oldFolder.name}/`]);
      
      // Update local state
      setFolders(folders.map(folder => 
        folder.id === folderId 
          ? { 
              ...folder, 
              name: newName,
              documents: folder.documents.map(doc => ({
                ...doc,
                filePath: doc.filePath?.replace(oldFolder.name, newName)
              }))
            }
          : folder
      ));
      
      setEditingFolder(null);
      
      toast({
        title: "Carpeta renombrada",
        description: `La carpeta se ha renombrado a "${newName}".`
      });
    } catch (error) {
      console.error('Error renaming folder:', error);
      toast({
        title: "Error",
        description: "No se pudo renombrar la carpeta.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    const folderToDelete = folders.find(folder => folder.id === folderId);
    if (!folderToDelete) return;
    
    try {
      // Delete all files in the folder
      for (const doc of folderToDelete.documents) {
        if (doc.filePath) {
          await supabase.storage
            .from('admin-docs')
            .remove([doc.filePath]);
        }
      }
      
      // Delete folder marker
      await supabase.storage
        .from('admin-docs')
        .remove([`${folderToDelete.name}/`]);
      
      // Update local state
      setFolders(folders.filter(folder => folder.id !== folderId));
      
      if (activeFolder === folderId) {
        setActiveFolder(folders[0]?.id || '');
      }
      
      toast({
        title: "Carpeta eliminada",
        description: `La carpeta "${folderToDelete.name}" ha sido eliminada.`
      });
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la carpeta.",
        variant: "destructive"
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

    const currentFolder = folders.find(f => f.id === activeFolder);
    if (!currentFolder) return;
    
    try {
      // Create a text file in Supabase Storage
      const fileName = `${newDocument.name}.txt`;
      const filePath = currentFolder.id === 'root' 
        ? fileName 
        : `${currentFolder.name}/${fileName}`;
      
      const { error } = await supabase.storage
        .from('admin-docs')
        .upload(filePath, new Blob([newDocument.content], { type: 'text/plain' }));
      
      if (error) throw error;
      
      // Update local state
      const newDoc: Document = {
        id: `${currentFolder.id}-${fileName}`,
        name: fileName,
        content: newDocument.content,
        filePath: filePath,
        fileType: 'text/plain',
        fileSize: newDocument.content.length,
        dateCreated: new Date().toISOString().split('T')[0]
      };
      
      setFolders(folders.map(folder => 
        folder.id === activeFolder
          ? { ...folder, documents: [...folder.documents, newDoc] }
          : folder
      ));

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

  const handleDeleteDocument = async (documentId: string) => {
    const currentFolder = folders.find(f => f.id === activeFolder);
    if (!currentFolder) return;
    
    const docToDelete = currentFolder.documents.find(doc => doc.id === documentId);
    if (!docToDelete || !docToDelete.filePath) return;
    
    try {
      // Delete file from Supabase Storage
      const { error } = await supabase.storage
        .from('admin-docs')
        .remove([docToDelete.filePath]);
      
      if (error) throw error;
      
      // Update local state
      setFolders(folders.map(folder => 
        folder.id === activeFolder
          ? { 
              ...folder, 
              documents: folder.documents.filter(doc => doc.id !== documentId) 
            }
          : folder
      ));
      
      toast({
        title: "Documento eliminado",
        description: `El documento "${docToDelete.name}" ha sido eliminado.`
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el documento.",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const currentFolder = folders.find(f => f.id === activeFolder);
    if (!currentFolder) return;
    
    setUploadProgress(0);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // Create file path based on current folder
        const filePath = currentFolder.id === 'root' 
          ? file.name 
          : `${currentFolder.name}/${file.name}`;
        
        // Upload file to Supabase Storage
        const { error } = await supabase.storage
          .from('admin-docs')
          .upload(filePath, file);
        
        if (error) throw error;
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
        
        // Add to local state
        const newDoc: Document = {
          id: `${currentFolder.id}-${file.name}`,
          name: file.name,
          filePath: filePath,
          fileType: file.type,
          fileSize: file.size,
          dateCreated: new Date().toISOString().split('T')[0]
        };
        
        setFolders(prev => 
          prev.map(folder => 
            folder.id === activeFolder
              ? { ...folder, documents: [...folder.documents, newDoc] }
              : folder
          )
        );
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        toast({
          title: "Error de subida",
          description: `No se pudo subir el archivo "${file.name}".`,
          variant: "destructive"
        });
      }
    }
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      title: "Archivos subidos",
      description: `Se subieron ${files.length} archivo(s) correctamente.`
    });
  };

  const handleDownloadFile = async (doc: Document) => {
    if (!doc.filePath) return;
    
    try {
      // Get public URL or download directly
      const { data, error } = await supabase.storage
        .from('admin-docs')
        .download(doc.filePath);
      
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "No se pudo descargar el archivo.",
        variant: "destructive"
      });
    }
  };

  const currentFolder = folders.find(f => f.id === activeFolder);

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Carpetas</h2>
            <Button variant="ghost" size="icon" onClick={handleAddFolder}>
              <FolderPlus className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-2">
            {folders.map((folder) => (
              <div 
                key={folder.id} 
                className={`flex items-center justify-between p-2 rounded-md ${activeFolder === folder.id ? 'bg-muted' : 'hover:bg-muted/50'}`}
              >
                <div 
                  className="flex items-center gap-2 cursor-pointer flex-grow"
                  onClick={() => setActiveFolder(folder.id)}
                >
                  <Folder className="h-5 w-5" />
                  {editingFolder === folder.id ? (
                    <Input
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onBlur={() => handleRenameFolder(folder.id, newFolderName)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleRenameFolder(folder.id, newFolderName);
                        }
                      }}
                      autoFocus
                      className="h-6 py-1"
                    />
                  ) : (
                    <span>{folder.name}</span>
                  )}
                </div>
                {!editingFolder && (
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => {
                        setEditingFolder(folder.id);
                        setNewFolderName(folder.name);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteFolder(folder.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          {currentFolder && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{currentFolder.name}</h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => setShowNewDocument(true)}
                  >
                    <FilePlus2 className="h-4 w-4" />
                    <span>Nuevo documento</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    <span>Subir archivo</span>
                  </Button>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              {showNewDocument && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nuevo documento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="ghost" onClick={() => setShowNewDocument(false)}>Cancelar</Button>
                    <Button onClick={handleAddDocument}>Guardar</Button>
                  </CardFooter>
                </Card>
              )}

              {!showNewDocument && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentFolder.documents.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-lg">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No hay documentos</h3>
                      <p className="text-sm text-muted-foreground">
                        Esta carpeta está vacía. Cree un nuevo documento o suba un archivo.
                      </p>
                    </div>
                  ) : (
                    currentFolder.documents.map((doc) => (
                      <Card key={doc.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{doc.name}</CardTitle>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteDocument(doc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <CardDescription>Creado: {doc.dateCreated}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <File className="h-4 w-4" />
                            <span>{doc.fileType || 'Texto'}</span>
                            {doc.fileSize && (
                              <span>({Math.round(doc.fileSize / 1024)} KB)</span>
                            )}
                          </div>
                          {doc.content && (
                            <p className="line-clamp-3 text-sm text-muted-foreground">
                              {doc.content}
                            </p>
                          )}
                        </CardContent>
                        <CardFooter>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleDownloadFile(doc)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
