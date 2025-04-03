
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  predicted?: number;
}

interface StockChartProps {
  data: StockData[];
  title?: string;
  showPredicted?: boolean;
}

const StockChart = ({ data, title = "Stock Price History", showPredicted = false }: StockChartProps) => {
  // Format date for cleaner display
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <Card className="bg-app-dark border-muted">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3E7BFA" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3E7BFA" stopOpacity={0} />
                </linearGradient>
                {showPredicted && (
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                )}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fill: '#A0AEC0' }} 
                axisLine={{ stroke: '#2D3748' }}
              />
              <YAxis 
                tick={{ fill: '#A0AEC0' }} 
                axisLine={{ stroke: '#2D3748' }}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1F2C', border: '1px solid #2D3748' }}
                labelStyle={{ color: '#A0AEC0' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="close" 
                stroke="#3E7BFA" 
                fillOpacity={1}
                fill="url(#colorClose)" 
                name="Close Price"
              />
              {showPredicted && (
                <Area 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#10B981" 
                  fillOpacity={1}
                  fill="url(#colorPredicted)" 
                  name="Predicted Price"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockChart;
