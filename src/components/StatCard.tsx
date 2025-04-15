
import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: ReactNode;
  onClick?: () => void;
}

const StatCard = ({ title, value, description, icon, onClick }: StatCardProps) => {
  return (
    <Card 
      className={`overflow-hidden ${onClick ? 'cursor-pointer hover:bg-accent/50 transition-colors' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="text-muted-foreground">{icon}</div>
        </div>
        <div className="mt-2">
          <p className="text-3xl font-bold">{value}</p>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
