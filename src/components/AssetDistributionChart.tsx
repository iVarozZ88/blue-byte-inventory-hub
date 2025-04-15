
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface AssetDistributionChartProps {
  data: ChartData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 shadow rounded border">
        <p className="font-medium">{`${data.name}: ${data.value}`}</p>
      </div>
    );
  }
  return null;
};

// Default color palette for chart items
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DF0',
  '#FF6E6E', '#4BC0C0', '#9966FF', '#FF9F7F', '#F17CB0',
  '#B2B1CF', '#60ACFC'
];

const AssetDistributionChart = ({ data }: AssetDistributionChartProps) => {
  // Filter out zero values
  const chartData = data.filter(item => item.value > 0);
  
  // Make sure each item has a color assigned
  const processedData = chartData.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length]
  }));
  
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={processedData}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetDistributionChart;
