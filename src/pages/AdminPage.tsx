
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
  Plus,
  FolderPlus,
  FilePlus2
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

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
  content: string;
  dateCreated: string;
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

  const handleAddFolder = () => {
    const newId = (folders.length + 1).toString();
    setFolders([...folders, {
      id: newId,
      name: `Nueva Carpeta ${newId}`,
      documents: []
    }]);
    setActiveFolder(newId);
  };

  const handleRenameFolder = (folderId: string, newName: string) => {
    setFolders(folders.map(folder => 
      folder.id === folderId 
        ? { ...folder, name: newName } 
        : folder
    ));
    setEditingFolder(null);
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolders(folders.filter(folder => folder.id !== folderId));
    if (activeFolder === folderId) {
      setActiveFolder(folders[0]?.id || '');
    }
  };

  const handleAddDocument = () => {
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

    const newDocId = (currentFolder.documents.length + 1).toString();
    const newDoc = {
      id: newDocId,
      name: newDocument.name,
      content: newDocument.content,
      dateCreated: new Date().toISOString().split('T')[0]
    };

    setFolders(folders.map(folder => 
      folder.id === activeFolder
        ? { ...folder, documents: [...folder.documents, newDoc] }
        : folder
    ));

    setNewDocument({ name: '', content: '' });
    setShowNewDocument(false);
  };

  const handleDeleteDocument = (documentId: string) => {
    setFolders(folders.map(folder => 
      folder.id === activeFolder
        ? { 
            ...folder, 
            documents: folder.documents.filter(doc => doc.id !== documentId) 
          }
        : folder
    ));
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
                  >
                    <Upload className="h-4 w-4" />
                    <span>Subir archivo</span>
                  </Button>
                </div>
              </div>

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
                          <p className="line-clamp-3 text-sm text-muted-foreground">
                            {doc.content}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full">Ver documento</Button>
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
