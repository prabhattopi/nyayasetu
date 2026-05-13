"use client";

import { useState, useEffect } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const mockProgressData = [
  { day: "Mon", iqScore: 105 },
  { day: "Tue", iqScore: 108 },
  { day: "Wed", iqScore: 106 },
  { day: "Thu", iqScore: 112 },
  { day: "Fri", iqScore: 118 },
  { day: "Sat", iqScore: 120 },
  { day: "Sun", iqScore: 124 },
];

export function AnalyticsChart() {
  // FIX: Add a mounted state to prevent SSR dimension mismatch
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  return (
    <Card className="col-span-full xl:col-span-2 border-primary/10 shadow-md">
      <CardHeader>
        <CardTitle>Legal IQ Progression</CardTitle>
        <CardDescription>
          Your knowledge growth over the last 7 days based on quiz performance and agent interactions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }} className="mt-4">
          {/* FIX: Only render the ResponsiveContainer after the browser has painted */}
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockProgressData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis 
                  dataKey="day" 
                  stroke="#888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#1a1a1a", 
                    borderColor: "#333",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                  itemStyle={{ color: "#3b82f6" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="iqScore" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "#1a1a1a", strokeWidth: 2 }} 
                  activeDot={{ r: 6, fill: "#3b82f6" }} 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-md">
              Loading analytics...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}