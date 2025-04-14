
import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Asset } from '@/lib/db';
import { exportToPDF } from '@/lib/exportPDF';
import { exportToExcel } from '@/lib/exportExcel';
import { toast } from '@/components/ui/use-toast';
import DateRangeSelector from '@/components/DateRangeSelector';
import { DateRange, filterAssetsByDateRange } from '@/lib/dateUtils';

interface ExportDialogProps {
  assets: Asset[];
  title: string;
  triggerButton?: React.ReactNode;
}

const ExportDialog = ({ assets, title, triggerButton }: ExportDialogProps) => {
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>(assets);
  const [open, setOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>('all');

  const handleDateRangeSelect = (range: DateRange, startDate?: Date, endDate?: Date) => {
    setSelectedDateRange(range);
    const filtered = filterAssetsByDateRange(assets, range, startDate, endDate);
    setFilteredAssets(filtered);
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    try {
      let exportTitle = title;
      
      if (selectedDateRange !== 'all') {
        exportTitle += ` - ${getDateRangeLabel(selectedDateRange)}`;
      }
      
      if (format === 'pdf') {
        exportToPDF(filteredAssets, exportTitle);
      } else {
        exportToExcel(filteredAssets, exportTitle);
      }
      
      toast({
        title: "Exportación exitosa",
        description: `Se ha generado el archivo ${format.toUpperCase()} correctamente.`,
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Error exporting assets:', error);
      toast({
        title: "Error en la exportación",
        description: "Hubo un problema al generar el archivo.",
        variant: "destructive",
      });
    }
  };

  const getDateRangeLabel = (range: DateRange): string => {
    switch (range) {
      case 'last-month': return 'Último mes';
      case 'last-three-months': return 'Últimos 3 meses';
      case 'last-six-months': return 'Últimos 6 meses';
      case 'last-year': return 'Último año';
      case 'custom': return 'Rango personalizado';
      default: return 'Todos los registros';
    }
  };

  // Reset filtered assets when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setFilteredAssets(assets);
      setSelectedDateRange('all');
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            <span>Exportar</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar {title}</DialogTitle>
          <DialogDescription>
            Selecciona un rango de fechas y el formato de exportación
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <DateRangeSelector onSelectDateRange={handleDateRangeSelect} />
          
          <div className="mt-3 text-sm text-muted-foreground">
            {filteredAssets.length} {filteredAssets.length === 1 ? 'registro' : 'registros'} seleccionados
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleExport('excel')}
            disabled={filteredAssets.length === 0}
            className="w-full sm:w-auto"
          >
            Exportar como Excel
          </Button>
          <Button 
            onClick={() => handleExport('pdf')}
            disabled={filteredAssets.length === 0}
            className="w-full sm:w-auto"
          >
            Exportar como PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
