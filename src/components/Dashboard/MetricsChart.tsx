
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

interface MetricsChartProps {
  title: string;
  data: any[];
  dataKey: string;
  stroke?: string;
  fillOpacity?: number;
  yAxisLabel?: string;
}

export default function MetricsChart({
  title,
  data,
  dataKey,
  stroke = "#3B82F6",
  fillOpacity = 0.2,
  yAxisLabel
}: MetricsChartProps) {
  const [chartData, setChartData] = useState(data);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prevData => {
        // Get last timestamp and value
        const lastItem = prevData[prevData.length - 1];
        const lastTimestamp = new Date(lastItem.time);
        const lastValue = lastItem.value;
        
        // Generate new timestamp (30s later)
        const newTimestamp = new Date(lastTimestamp.getTime() + 30000);
        
        // Generate new value with slight fluctuation
        const fluctuation = Math.random() * 0.2 - 0.1; // -10% to +10%
        const newValue = lastValue * (1 + fluctuation);
        
        // Format new time
        const formattedTime = newTimestamp.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        // Add new item and remove oldest if more than 20 points
        const newData = [...prevData, { time: formattedTime, value: newValue }];
        if (newData.length > 20) {
          return newData.slice(1);
        }
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={stroke} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time"
                tick={{ fill: '#94A3B8', fontSize: 10 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={{ stroke: '#334155' }}
                minTickGap={15}
              />
              <YAxis 
                tick={{ fill: '#94A3B8', fontSize: 10 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={{ stroke: '#334155' }}
                label={{ 
                  value: yAxisLabel, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#94A3B8', fontSize: 10 }
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid #334155',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#94A3B8' }}
                labelStyle={{ color: '#F8FAFC' }}
              />
              <Line 
                type="monotone"
                dataKey="value"
                stroke={stroke}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                isAnimationActive={true}
                animationDuration={300}
                fill={`url(#gradient-${dataKey})`}
                fillOpacity={fillOpacity}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
