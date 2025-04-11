import { toast } from "@/components/ui/use-toast";

// Define asset types
export type AssetType = 
  | 'computer'
  | 'laptop'
  | 'monitor'
  | 'mouse'
  | 'keyboard'
  | 'telephone'
  | 'mobile'
  | 'scanner'
  | 'printer'
  | 'cable'
  | 'other';

// Define asset status
export type AssetStatus = 'available' | 'assigned' | 'maintenance' | 'retired';

// Define asset interface
export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  status: AssetStatus;
  assignedTo?: string;
  notes?: string;
  lastUpdated: string;
}

// Function to generate a UUID
export const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, 
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Function to format the current date as YYYY-MM-DD
export const formatDate = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0];
};

// Get all assets from localStorage
export const getAssets = (): Asset[] => {
  try {
    const assets = localStorage.getItem('techInventoryAssets');
    if (!assets) return [];
    return JSON.parse(assets);
  } catch (error) {
    console.error('Error loading assets from localStorage:', error);
    toast({
      title: "Error al cargar inventario",
      description: "Hubo un problema al cargar los datos del inventario.",
      variant: "destructive",
    });
    return [];
  }
};

// Save assets to localStorage
export const saveAssets = (assets: Asset[]): void => {
  try {
    localStorage.setItem('techInventoryAssets', JSON.stringify(assets));
  } catch (error) {
    console.error('Error saving assets to localStorage:', error);
    toast({
      title: "Error al guardar inventario",
      description: "Hubo un problema al guardar los datos del inventario.",
      variant: "destructive",
    });
  }
};

// Get all trashed assets from localStorage
export const getTrashedAssets = (): Asset[] => {
  try {
    const trashedAssets = localStorage.getItem('techInventoryTrashedAssets');
    if (!trashedAssets) return [];
    return JSON.parse(trashedAssets);
  } catch (error) {
    console.error('Error loading trashed assets from localStorage:', error);
    return [];
  }
};

// Save trashed assets to localStorage
export const saveTrashedAssets = (assets: Asset[]): void => {
  try {
    localStorage.setItem('techInventoryTrashedAssets', JSON.stringify(assets));
  } catch (error) {
    console.error('Error saving trashed assets to localStorage:', error);
  }
};

// Add a new asset
export const addAsset = (asset: Omit<Asset, 'id' | 'lastUpdated'>): Asset => {
  const newAsset: Asset = {
    ...asset,
    id: generateId(),
    lastUpdated: formatDate(),
  };
  
  const assets = getAssets();
  saveAssets([...assets, newAsset]);
  
  return newAsset;
};

// Update an existing asset
export const updateAsset = (asset: Asset): Asset => {
  const assets = getAssets();
  const updatedAsset = {
    ...asset,
    lastUpdated: formatDate(),
  };
  
  const updatedAssets = assets.map(a => 
    a.id === asset.id ? updatedAsset : a
  );
  
  saveAssets(updatedAssets);
  return updatedAsset;
};

// Delete an asset (move to trash)
export const deleteAsset = (id: string): void => {
  const assets = getAssets();
  const assetToTrash = assets.find(a => a.id === id);
  
  if (assetToTrash) {
    // Add to trash
    const trashedAssets = getTrashedAssets();
    saveTrashedAssets([...trashedAssets, assetToTrash]);
    
    // Remove from active assets
    const updatedAssets = assets.filter(a => a.id !== id);
    saveAssets(updatedAssets);
    
    toast({
      title: "Activo eliminado",
      description: `${assetToTrash.name} ha sido movido a la papelera.`,
    });
  }
};

// Permanently delete an asset from trash
export const permanentlyDeleteAsset = (id: string): void => {
  const trashedAssets = getTrashedAssets();
  const updatedTrashedAssets = trashedAssets.filter(a => a.id !== id);
  saveTrashedAssets(updatedTrashedAssets);
};

// Restore an asset from trash
export const restoreAsset = (id: string): void => {
  const trashedAssets = getTrashedAssets();
  const assetToRestore = trashedAssets.find(a => a.id === id);
  
  if (assetToRestore) {
    // Add back to active assets
    const assets = getAssets();
    const updatedAsset = {
      ...assetToRestore,
      lastUpdated: formatDate(),
    };
    saveAssets([...assets, updatedAsset]);
    
    // Remove from trash
    const updatedTrashedAssets = trashedAssets.filter(a => a.id !== id);
    saveTrashedAssets(updatedTrashedAssets);
    
    toast({
      title: "Activo restaurado",
      description: `${assetToRestore.name} ha sido restaurado del inventario.`,
    });
  }
};

// Get asset statistics
export const getAssetStatistics = () => {
  const assets = getAssets();
  
  // Count by status
  const statusCounts = {
    available: 0,
    assigned: 0,
    maintenance: 0,
    retired: 0,
  };
  
  // Count by type
  const typeCounts: Record<AssetType, number> = {
    computer: 0,
    laptop: 0,
    monitor: 0,
    mouse: 0,
    keyboard: 0,
    telephone: 0,
    mobile: 0,
    scanner: 0,
    printer: 0,
    cable: 0,
    other: 0,
  };
  
  assets.forEach(asset => {
    // Increment status count
    statusCounts[asset.status]++;
    
    // Increment type count
    typeCounts[asset.type]++;
  });
  
  return {
    total: assets.length,
    byStatus: statusCounts,
    byType: typeCounts,
    recentlyUpdated: assets
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 5)
  };
};

// Get all unique users with assigned assets
export const getUsers = (): string[] => {
  const assets = getAssets();
  
  // Get all users that have assets assigned
  const usersSet = new Set<string>();
  
  assets.forEach(asset => {
    if (asset.assignedTo && asset.assignedTo.trim() !== '') {
      usersSet.add(asset.assignedTo.trim());
    }
  });
  
  return Array.from(usersSet).sort();
};

// Get all assets assigned to a specific user
export const getAssetsByUser = (username: string): Asset[] => {
  const assets = getAssets();
  
  return assets.filter(asset => 
    asset.assignedTo === username && asset.status === 'assigned'
  );
};

// Function to seed initial data
export const seedInitialData = () => {
  // Only seed if no data exists
  if (getAssets().length === 0) {
    const initialAssets: Omit<Asset, 'id' | 'lastUpdated'>[] = [
      {
        name: "Dell XPS 15",
        type: "laptop",
        model: "XPS 15 9500",
        serialNumber: "SN12345678",
        purchaseDate: "2022-06-15",
        status: "assigned",
        assignedTo: "Juan Pérez",
        notes: "Laptop para desarrollador"
      },
      {
        name: "HP EliteBook",
        type: "laptop",
        model: "EliteBook 840 G8",
        serialNumber: "HP987654321",
        purchaseDate: "2022-03-10",
        status: "available",
        notes: "Laptop de respaldo"
      },
      {
        name: "Dell UltraSharp",
        type: "monitor",
        model: "U2720Q",
        serialNumber: "MON123456",
        purchaseDate: "2022-06-15",
        status: "assigned",
        assignedTo: "María López",
        notes: "Monitor 4K de 27 pulgadas"
      },
      {
        name: "Logitech MX Master",
        type: "mouse",
        model: "MX Master 3",
        serialNumber: "LG456789",
        purchaseDate: "2022-01-20",
        status: "assigned",
        assignedTo: "Juan Pérez",
        notes: "Mouse inalámbrico"
      },
      {
        name: "Apple Magic Keyboard",
        type: "keyboard",
        model: "Magic Keyboard with Numeric Keypad",
        serialNumber: "APP789012",
        purchaseDate: "2022-02-15",
        status: "available",
        notes: "Teclado inalámbrico"
      },
      {
        name: "Cisco IP Phone",
        type: "telephone",
        model: "8841",
        serialNumber: "CIS345678",
        purchaseDate: "2021-11-05",
        status: "assigned",
        assignedTo: "Recepción",
        notes: "Teléfono de recepción"
      },
      {
        name: "iPhone 13",
        type: "mobile",
        model: "iPhone 13 Pro",
        serialNumber: "IPH234567",
        purchaseDate: "2022-09-25",
        status: "assigned",
        assignedTo: "María López",
        notes: "Teléfono de empresa"
      },
      {
        name: "Fujitsu ScanSnap",
        type: "scanner",
        model: "iX1600",
        serialNumber: "FUJ567890",
        purchaseDate: "2022-04-18",
        status: "available",
        notes: "Escáner de documentos"
      },
      {
        name: "HP LaserJet",
        type: "printer",
        model: "LaserJet Pro M404dn",
        serialNumber: "HPP123456",
        purchaseDate: "2022-05-12",
        status: "maintenance",
        notes: "Necesita reemplazo de tóner"
      },
      {
        name: "Dell Optiplex",
        type: "computer",
        model: "Optiplex 7090",
        serialNumber: "OPT123456",
        purchaseDate: "2021-12-10",
        status: "assigned",
        assignedTo: "Sala de Conferencias",
        notes: "PC para sala de reuniones"
      },
      {
        name: "Dell XPS Desktop",
        type: "computer",
        model: "XPS 8940",
        serialNumber: "XPS987654",
        purchaseDate: "2022-08-05",
        status: "retired",
        notes: "Hardware obsoleto"
      },
      {
        name: "LG UltraWide",
        type: "monitor",
        model: "34WN80C-B",
        serialNumber: "LG345678",
        purchaseDate: "2022-07-14",
        status: "assigned",
        assignedTo: "Equipo de Diseño",
        notes: "Monitor ultrawide para diseñadores"
      },
      {
        name: "Cable HDMI",
        type: "cable",
        model: "HDMI 2.0",
        serialNumber: "HDM123456",
        purchaseDate: "2022-01-15",
        status: "assigned",
        assignedTo: "Juan Pérez",
        notes: "Cable para conectar laptop a monitor"
      },
      {
        name: "Cable USB-C",
        type: "cable",
        model: "USB-C a USB-C",
        serialNumber: "USBC789012",
        purchaseDate: "2022-03-20",
        status: "assigned",
        assignedTo: "María López",
        notes: "Cable de carga rápida"
      },
      {
        name: "Cable Ethernet",
        type: "cable",
        model: "Cat6",
        serialNumber: "ETH567890",
        purchaseDate: "2022-02-10",
        status: "available",
        notes: "Cable de 3 metros"
      }
    ];

    initialAssets.forEach(asset => addAsset(asset));
  }
};
