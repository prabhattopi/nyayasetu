"use client";

import { useState, useEffect } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MiniChartProps {
  data?: { legal_iq: number; recorded_at: string }[];
  currentIq?: number;
}

export function AnalyticsChart({ data = [], currentIq = 100 }: MiniChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Format data for the last 7 days
  const chartData = data.length > 0
    ? data.map((row) => ({
        day: new Date(row.recorded_at).toLocaleDateString('en-US', { weekday: 'short' }), // e.g. "Mon", "Tue"
        iqScore: row.legal_iq,
      })).slice(-7)
    : Array.from({ length: 7 }, (_, i) => ({ day: `Day ${i+1}`, iqScore: currentIq }));

  return (
    <Card className="col-span-full xl:col-span-2 border-primary/10 shadow-md bg-card/50">
      <CardHeader>
        <CardTitle>Legal IQ Progression</CardTitle>
        <CardDescription>
          Your knowledge growth over the last 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }} className="mt-4">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="day" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1a1a1a", borderColor: "#333", borderRadius: "8px", color: "#fff" }}
                  itemStyle={{ color: "#3b82f6" }}
                />
                <Line type="monotone" dataKey="iqScore" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#1a1a1a", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#3b82f6" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-md animate-pulse">
              Loading analytics...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}