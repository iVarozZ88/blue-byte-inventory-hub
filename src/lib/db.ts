
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

// Convert Supabase asset to our Asset format
const mapSupabaseAsset = (asset: any): Asset => {
  return {
    id: asset.id,
    name: asset.name,
    type: asset.type,
    model: asset.model || undefined,
    serialNumber: asset.serial_number || undefined,
    purchaseDate: asset.purchase_date || undefined,
    status: asset.status,
    assignedTo: asset.assigned_to || undefined,
    notes: asset.notes || undefined,
    lastUpdated: asset.last_updated ? new Date(asset.last_updated).toISOString().split('T')[0] : formatDate()
  };
};

// Convert our Asset format to Supabase format
const mapToSupabaseAsset = (asset: Asset | Omit<Asset, 'id' | 'lastUpdated'>) => {
  return {
    name: asset.name,
    type: asset.type,
    model: asset.model || null,
    serial_number: asset.serialNumber || null,
    purchase_date: asset.purchaseDate || null,
    status: asset.status,
    assigned_to: asset.assignedTo || null,
    notes: asset.notes || null
  };
};

// Get all assets from Supabase
export const getAssets = async (): Promise<Asset[]> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .order('last_updated', { ascending: false });
    
    if (error) {
      console.error('Error loading assets from Supabase:', error);
      throw error;
    }
    
    return data.map(mapSupabaseAsset);
  } catch (error) {
    console.error('Error loading assets:', error);
    toast({
      title: "Error al cargar inventario",
      description: "Hubo un problema al cargar los datos del inventario.",
      variant: "destructive",
    });
    return [];
  }
};

// Get all trashed assets from Supabase
export const getTrashedAssets = async (): Promise<Asset[]> => {
  try {
    const { data, error } = await supabase
      .from('trashed_assets')
      .select('*')
      .order('deleted_at', { ascending: false });
    
    if (error) {
      console.error('Error loading trashed assets from Supabase:', error);
      throw error;
    }
    
    return data.map(mapSupabaseAsset);
  } catch (error) {
    console.error('Error loading trashed assets:', error);
    return [];
  }
};

// Add a new asset
export const addAsset = async (asset: Omit<Asset, 'id' | 'lastUpdated'>): Promise<Asset> => {
  try {
    const supabaseAsset = mapToSupabaseAsset(asset);
    
    const { data, error } = await supabase
      .from('assets')
      .insert(supabaseAsset)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding asset to Supabase:', error);
      throw error;
    }
    
    return mapSupabaseAsset(data);
  } catch (error) {
    console.error('Error adding asset:', error);
    toast({
      title: "Error al agregar activo",
      description: "Hubo un problema al guardar el activo en la base de datos.",
      variant: "destructive",
    });
    throw error;
  }
};

// Update an existing asset
export const updateAsset = async (asset: Asset): Promise<Asset> => {
  try {
    const supabaseAsset = mapToSupabaseAsset(asset);
    
    const { data, error } = await supabase
      .from('assets')
      .update(supabaseAsset)
      .eq('id', asset.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating asset in Supabase:', error);
      throw error;
    }
    
    return mapSupabaseAsset(data);
  } catch (error) {
    console.error('Error updating asset:', error);
    toast({
      title: "Error al actualizar activo",
      description: "Hubo un problema al actualizar el activo en la base de datos.",
      variant: "destructive",
    });
    throw error;
  }
};

// Delete an asset (move to trash)
export const deleteAsset = async (id: string): Promise<void> => {
  try {
    // First get the asset to be trashed
    const { data: assetData, error: getError } = await supabase
      .from('assets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (getError) {
      console.error('Error getting asset for deletion:', getError);
      throw getError;
    }
    
    // Insert into trashed_assets
    const { error: insertError } = await supabase
      .from('trashed_assets')
      .insert({
        id: assetData.id,
        name: assetData.name,
        type: assetData.type,
        model: assetData.model,
        serial_number: assetData.serial_number,
        purchase_date: assetData.purchase_date,
        status: assetData.status,
        assigned_to: assetData.assigned_to,
        notes: assetData.notes,
        last_updated: assetData.last_updated,
        created_at: assetData.created_at
      });
    
    if (insertError) {
      console.error('Error adding asset to trash:', insertError);
      throw insertError;
    }
    
    // Delete from assets
    const { error: deleteError } = await supabase
      .from('assets')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error('Error deleting asset:', deleteError);
      throw deleteError;
    }
    
    toast({
      title: "Activo eliminado",
      description: `El activo ha sido movido a la papelera.`,
    });
  } catch (error) {
    console.error('Error in deleteAsset:', error);
    toast({
      title: "Error al eliminar activo",
      description: "Hubo un problema al mover el activo a la papelera.",
      variant: "destructive",
    });
    throw error;
  }
};

// Permanently delete an asset from trash
export const permanentlyDeleteAsset = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('trashed_assets')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error permanently deleting asset:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in permanentlyDeleteAsset:', error);
    toast({
      title: "Error al eliminar activo",
      description: "Hubo un problema al eliminar permanentemente el activo.",
      variant: "destructive",
    });
    throw error;
  }
};

// Restore an asset from trash
export const restoreAsset = async (id: string): Promise<void> => {
  try {
    // Get asset from trash
    const { data: assetData, error: getError } = await supabase
      .from('trashed_assets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (getError) {
      console.error('Error getting trashed asset:', getError);
      throw getError;
    }
    
    // Insert into assets
    const { error: insertError } = await supabase
      .from('assets')
      .insert({
        id: assetData.id,
        name: assetData.name,
        type: assetData.type,
        model: assetData.model,
        serial_number: assetData.serial_number,
        purchase_date: assetData.purchase_date,
        status: assetData.status,
        assigned_to: assetData.assigned_to,
        notes: assetData.notes,
        created_at: assetData.created_at
      });
    
    if (insertError) {
      console.error('Error restoring asset:', insertError);
      throw insertError;
    }
    
    // Delete from trashed_assets
    const { error: deleteError } = await supabase
      .from('trashed_assets')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error('Error removing asset from trash:', deleteError);
      throw deleteError;
    }
    
    toast({
      title: "Activo restaurado",
      description: `El activo ha sido restaurado del inventario.`,
    });
  } catch (error) {
    console.error('Error in restoreAsset:', error);
    toast({
      title: "Error al restaurar activo",
      description: "Hubo un problema al restaurar el activo del inventario.",
      variant: "destructive",
    });
    throw error;
  }
};

// Get asset statistics
export const getAssetStatistics = async () => {
  try {
    const assets = await getAssets();
    
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
  } catch (error) {
    console.error('Error getting asset statistics:', error);
    return {
      total: 0,
      byStatus: {
        available: 0,
        assigned: 0,
        maintenance: 0,
        retired: 0,
      },
      byType: {
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
      },
      recentlyUpdated: []
    };
  }
};

// Get all unique users with assigned assets
export const getUsers = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('assigned_to')
      .not('assigned_to', 'is', null);
    
    if (error) {
      console.error('Error getting users:', error);
      throw error;
    }
    
    // Extract unique usernames and filter out empty strings
    const usersSet = new Set<string>();
    data.forEach(item => {
      if (item.assigned_to && item.assigned_to.trim() !== '') {
        usersSet.add(item.assigned_to.trim());
      }
    });
    
    return Array.from(usersSet).sort();
  } catch (error) {
    console.error('Error in getUsers:', error);
    return [];
  }
};

// Get all assets assigned to a specific user
export const getAssetsByUser = async (username: string): Promise<Asset[]> => {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('assigned_to', username)
      .eq('status', 'assigned');
    
    if (error) {
      console.error('Error getting assets by user:', error);
      throw error;
    }
    
    return data.map(mapSupabaseAsset);
  } catch (error) {
    console.error('Error in getAssetsByUser:', error);
    return [];
  }
};

// Function to seed initial data
export const seedInitialData = async () => {
  try {
    // Check if there are any assets already
    const { count, error: countError } = await supabase
      .from('assets')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking assets count:', countError);
      return;
    }
    
    // Only seed if no data exists
    if (count === 0) {
      const initialAssets = [
        {
          name: "Dell XPS 15",
          type: "laptop",
          model: "XPS 15 9500",
          serial_number: "SN12345678",
          purchase_date: "2022-06-15",
          status: "assigned",
          assigned_to: "Juan Pérez",
          notes: "Laptop para desarrollador"
        },
        {
          name: "HP EliteBook",
          type: "laptop",
          model: "EliteBook 840 G8",
          serial_number: "HP987654321",
          purchase_date: "2022-03-10",
          status: "available",
          notes: "Laptop de respaldo"
        },
        {
          name: "Dell UltraSharp",
          type: "monitor",
          model: "U2720Q",
          serial_number: "MON123456",
          purchase_date: "2022-06-15",
          status: "assigned",
          assigned_to: "María López",
          notes: "Monitor 4K de 27 pulgadas"
        },
        {
          name: "Logitech MX Master",
          type: "mouse",
          model: "MX Master 3",
          serial_number: "LG456789",
          purchase_date: "2022-01-20",
          status: "assigned",
          assigned_to: "Juan Pérez",
          notes: "Mouse inalámbrico"
        },
        {
          name: "Apple Magic Keyboard",
          type: "keyboard",
          model: "Magic Keyboard with Numeric Keypad",
          serial_number: "APP789012",
          purchase_date: "2022-02-15",
          status: "available",
          notes: "Teclado inalámbrico"
        },
        {
          name: "Cisco IP Phone",
          type: "telephone",
          model: "8841",
          serial_number: "CIS345678",
          purchase_date: "2021-11-05",
          status: "assigned",
          assigned_to: "Recepción",
          notes: "Teléfono de recepción"
        },
        {
          name: "iPhone 13",
          type: "mobile",
          model: "iPhone 13 Pro",
          serial_number: "IPH234567",
          purchase_date: "2022-09-25",
          status: "assigned",
          assigned_to: "María López",
          notes: "Teléfono de empresa"
        },
        {
          name: "Fujitsu ScanSnap",
          type: "scanner",
          model: "iX1600",
          serial_number: "FUJ567890",
          purchase_date: "2022-04-18",
          status: "available",
          notes: "Escáner de documentos"
        },
        {
          name: "HP LaserJet",
          type: "printer",
          model: "LaserJet Pro M404dn",
          serial_number: "HPP123456",
          purchase_date: "2022-05-12",
          status: "maintenance",
          notes: "Necesita reemplazo de tóner"
        },
        {
          name: "Dell Optiplex",
          type: "computer",
          model: "Optiplex 7090",
          serial_number: "OPT123456",
          purchase_date: "2021-12-10",
          status: "assigned",
          assigned_to: "Sala de Conferencias",
          notes: "PC para sala de reuniones"
        },
        {
          name: "Dell XPS Desktop",
          type: "computer",
          model: "XPS 8940",
          serial_number: "XPS987654",
          purchase_date: "2022-08-05",
          status: "retired",
          notes: "Hardware obsoleto"
        },
        {
          name: "LG UltraWide",
          type: "monitor",
          model: "34WN80C-B",
          serial_number: "LG345678",
          purchase_date: "2022-07-14",
          status: "assigned",
          assigned_to: "Equipo de Diseño",
          notes: "Monitor ultrawide para diseñadores"
        },
        {
          name: "Cable HDMI",
          type: "cable",
          model: "HDMI 2.0",
          serial_number: "HDM123456",
          purchase_date: "2022-01-15",
          status: "assigned",
          assigned_to: "Juan Pérez",
          notes: "Cable para conectar laptop a monitor"
        },
        {
          name: "Cable USB-C",
          type: "cable",
          model: "USB-C a USB-C",
          serial_number: "USBC789012",
          purchase_date: "2022-03-20",
          status: "assigned",
          assigned_to: "María López",
          notes: "Cable de carga rápida"
        },
        {
          name: "Cable Ethernet",
          type: "cable",
          model: "Cat6",
          serial_number: "ETH567890",
          purchase_date: "2022-02-10",
          status: "available",
          notes: "Cable de 3 metros"
        }
      ];

      // Insert each asset individually
      for (const asset of initialAssets) {
        const { error } = await supabase
          .from('assets')
          .insert(asset);
          
        if (error) {
          console.error('Error seeding asset:', error);
          // Continue with other assets even if one fails
        }
      }
      
      console.log('Initial data seeded successfully');
    }
  } catch (error) {
    console.error('Error in seedInitialData:', error);
  }
};
