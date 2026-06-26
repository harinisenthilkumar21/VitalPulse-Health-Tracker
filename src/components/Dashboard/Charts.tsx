import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';

interface ChartProps {
  data: any[];
  type: 'line' | 'area' | 'bar';
  dataKey: string;
  color: string;
  xAxisKey: string;
}

const Charts: React.FC<ChartProps> = ({ data, type, dataKey, color, xAxisKey }) => {

  // 🎨 Light UI colors
  const gridColor = "#e2e8f0";   // soft border
  const axisText = "#64748b";    // slate-500
  const tooltipBg = "#ffffff";

  const renderChart = () => {
    switch (type) {

      case 'area':
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.25}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />

            <XAxis 
              dataKey={xAxisKey} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: axisText, fontSize: 12 }} 
              dy={10}
            />

            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: axisText, fontSize: 12 }} 
            />

            <Tooltip 
              contentStyle={{ 
                backgroundColor: tooltipBg,
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08)'
              }} 
            />

            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              fillOpacity={1} 
              fill={`url(#color${dataKey})`} 
              strokeWidth={2.5}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />

            <XAxis 
              dataKey={xAxisKey} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: axisText, fontSize: 12 }} 
              dy={10}
            />

            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: axisText, fontSize: 12 }} 
            />

            <Tooltip 
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{ 
                backgroundColor: tooltipBg,
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08)'
              }} 
            />

            <Bar 
              dataKey={dataKey} 
              fill={color} 
              radius={[6, 6, 0, 0]} 
              barSize={30} 
            />
          </BarChart>
        );

      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />

            <XAxis 
              dataKey={xAxisKey} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: axisText, fontSize: 12 }} 
              dy={10}
            />

            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: axisText, fontSize: 12 }} 
            />

            <Tooltip 
              contentStyle={{ 
                backgroundColor: tooltipBg,
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.08)'
              }} 
            />

            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={3} 
              dot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="h-[300px] w-full bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default Charts;