
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
      title: "Error loading inventory",
      description: "There was a problem loading your inventory data.",
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
      title: "Error saving inventory",
      description: "There was a problem saving your inventory data.",
      variant: "destructive",
    });
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

// Delete an asset
export const deleteAsset = (id: string): void => {
  const assets = getAssets();
  const updatedAssets = assets.filter(a => a.id !== id);
  saveAssets(updatedAssets);
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
        assignedTo: "John Doe",
        notes: "Developer laptop"
      },
      {
        name: "HP EliteBook",
        type: "laptop",
        model: "EliteBook 840 G8",
        serialNumber: "HP987654321",
        purchaseDate: "2022-03-10",
        status: "available",
        notes: "Spare laptop"
      },
      {
        name: "Dell UltraSharp",
        type: "monitor",
        model: "U2720Q",
        serialNumber: "MON123456",
        purchaseDate: "2022-06-15",
        status: "assigned",
        assignedTo: "Jane Smith",
        notes: "27-inch 4K monitor"
      },
      {
        name: "Logitech MX Master",
        type: "mouse",
        model: "MX Master 3",
        serialNumber: "LG456789",
        purchaseDate: "2022-01-20",
        status: "assigned",
        assignedTo: "John Doe",
        notes: "Wireless mouse"
      },
      {
        name: "Apple Magic Keyboard",
        type: "keyboard",
        model: "Magic Keyboard with Numeric Keypad",
        serialNumber: "APP789012",
        purchaseDate: "2022-02-15",
        status: "available",
        notes: "Wireless keyboard"
      },
      {
        name: "Cisco IP Phone",
        type: "telephone",
        model: "8841",
        serialNumber: "CIS345678",
        purchaseDate: "2021-11-05",
        status: "assigned",
        assignedTo: "Reception Desk",
        notes: "Reception phone"
      },
      {
        name: "iPhone 13",
        type: "mobile",
        model: "iPhone 13 Pro",
        serialNumber: "IPH234567",
        purchaseDate: "2022-09-25",
        status: "assigned",
        assignedTo: "Jane Smith",
        notes: "Company phone"
      },
      {
        name: "Fujitsu ScanSnap",
        type: "scanner",
        model: "iX1600",
        serialNumber: "FUJ567890",
        purchaseDate: "2022-04-18",
        status: "available",
        notes: "Document scanner"
      },
      {
        name: "HP LaserJet",
        type: "printer",
        model: "LaserJet Pro M404dn",
        serialNumber: "HPP123456",
        purchaseDate: "2022-05-12",
        status: "maintenance",
        notes: "Needs toner replacement"
      },
      {
        name: "Dell Optiplex",
        type: "computer",
        model: "Optiplex 7090",
        serialNumber: "OPT123456",
        purchaseDate: "2021-12-10",
        status: "assigned",
        assignedTo: "Conference Room",
        notes: "Meeting room PC"
      },
      {
        name: "Dell XPS Desktop",
        type: "computer",
        model: "XPS 8940",
        serialNumber: "XPS987654",
        purchaseDate: "2022-08-05",
        status: "retired",
        notes: "Outdated hardware"
      },
      {
        name: "LG UltraWide",
        type: "monitor",
        model: "34WN80C-B",
        serialNumber: "LG345678",
        purchaseDate: "2022-07-14",
        status: "assigned",
        assignedTo: "Design Team",
        notes: "Ultrawide monitor for designers"
      }
    ];

    initialAssets.forEach(asset => addAsset(asset));
  }
};
