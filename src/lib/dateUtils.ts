
import { Asset } from './db';

// Date range options for filtering
export type DateRange = 'all' | 'last-month' | 'last-three-months' | 'last-six-months' | 'last-year' | 'custom';

// Function to filter assets by date range
export const filterAssetsByDateRange = (assets: Asset[], dateRange: DateRange, customStartDate?: Date, customEndDate?: Date): Asset[] => {
  if (dateRange === 'all') {
    return assets;
  }

  const today = new Date();
  let startDate: Date;
  
  switch (dateRange) {
    case 'last-month':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      break;
    case 'last-three-months':
      startDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
      break;
    case 'last-six-months':
      startDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
      break;
    case 'last-year':
      startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
      break;
    case 'custom':
      if (!customStartDate) return assets;
      startDate = customStartDate;
      break;
    default:
      return assets;
  }

  return assets.filter(asset => {
    const assetDate = new Date(asset.lastUpdated);
    
    if (dateRange === 'custom' && customEndDate) {
      return assetDate >= startDate && assetDate <= customEndDate;
    }
    
    return assetDate >= startDate && assetDate <= today;
  });
};
