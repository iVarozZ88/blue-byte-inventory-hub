
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Asset, AssetType, AssetStatus } from '@/lib/db';
import { Badge } from '@/components/ui/badge';
import { 
  Computer, 
  Laptop, 
  Monitor, 
  Mouse, 
  Keyboard, 
  Phone, 
  Smartphone, 
  Printer, 
  ScanLine,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentlyUpdatedTableProps {
  assets: Asset[];
}

const getAssetIcon = (type: AssetType) => {
  switch (type) {
    case 'computer': return <Computer size={16} />;
    case 'laptop': return <Laptop size={16} />;
    case 'monitor': return <Monitor size={16} />;
    case 'mouse': return <Mouse size={16} />;
    case 'keyboard': return <Keyboard size={16} />;
    case 'telephone': return <Phone size={16} />;
    case 'mobile': return <Smartphone size={16} />;
    case 'scanner': return <ScanLine size={16} />;
    case 'printer': return <Printer size={16} />;
    default: return <HelpCircle size={16} />;
  }
};

const getStatusBadge = (status: AssetStatus) => {
  switch (status) {
    case 'available':
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Available</Badge>;
    case 'assigned':
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Assigned</Badge>;
    case 'maintenance':
      return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Maintenance</Badge>;
    case 'retired':
      return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Retired</Badge>;
  }
};

const RecentlyUpdatedTable = ({ assets }: RecentlyUpdatedTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              No assets found
            </TableCell>
          </TableRow>
        ) : (
          assets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="font-medium">
                <Link to={`/assets/${asset.id}`} className="flex items-center gap-2 hover:underline">
                  {asset.name}
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getAssetIcon(asset.type)}
                  <span className="capitalize">{asset.type}</span>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(asset.status)}</TableCell>
              <TableCell>{asset.assignedTo || '-'}</TableCell>
              <TableCell>{asset.lastUpdated}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default RecentlyUpdatedTable;
