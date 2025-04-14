
import { useState } from 'react';
import { Calendar, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRange } from '@/lib/dateUtils';
import { format } from 'date-fns';

interface DateRangeSelectorProps {
  onSelectDateRange: (range: DateRange, startDate?: Date, endDate?: Date) => void;
}

const DateRangeSelector = ({ onSelectDateRange }: DateRangeSelectorProps) => {
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleDateRangeChange = (value: string) => {
    const range = value as DateRange;
    setDateRange(range);
    
    if (range !== 'custom') {
      setStartDate(undefined);
      setEndDate(undefined);
      onSelectDateRange(range);
    } else if (startDate) {
      onSelectDateRange(range, startDate, endDate);
    }
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date);
    if (date && dateRange === 'custom') {
      onSelectDateRange('custom', date, endDate);
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    if (startDate && date && dateRange === 'custom') {
      onSelectDateRange('custom', startDate, date);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Select value={dateRange} onValueChange={handleDateRangeChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccionar rango de fechas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los registros</SelectItem>
          <SelectItem value="last-month">Último mes</SelectItem>
          <SelectItem value="last-three-months">Últimos 3 meses</SelectItem>
          <SelectItem value="last-six-months">Últimos 6 meses</SelectItem>
          <SelectItem value="last-year">Último año</SelectItem>
          <SelectItem value="custom">Rango personalizado</SelectItem>
        </SelectContent>
      </Select>

      {dateRange === 'custom' && (
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Desde:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {startDate ? (
                    format(startDate, 'dd/MM/yyyy')
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateSelect}
                  disabled={(date) => date > new Date() || (endDate ? date > endDate : false)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Hasta:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={!startDate}
                >
                  {endDate ? (
                    format(endDate, 'dd/MM/yyyy')
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateSelect}
                  disabled={(date) => date > new Date() || (startDate ? date < startDate : false)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;
