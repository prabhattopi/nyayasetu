"use client";

import { useState, useEffect } from "react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Accept the real data from the database
interface AdvancedAnalyticsProps {
  realData?: { legal_iq: number; recorded_at: string }[];
  currentIq?: number;
}

const topicMasteryData = [
  { topic: "Criminal (BNS)", score: 85 },
  { topic: "Const. Rights", score: 65 },
  { topic: "Cyber Crime", score: 40 },
  { topic: "Property Law", score: 55 },
  { topic: "Family Law", score: 30 },
];

export function AdvancedAnalytics({ realData = [], currentIq = 100 }: AdvancedAnalyticsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [timeFilter, setTimeFilter] = useState<"7d" | "30d">("7d");

  useEffect(() => setIsMounted(true), []);

  // Format the raw DB data into what the chart expects
  const processedData = realData.length > 0 
    ? realData.map((row) => ({
        day: new Date(row.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        iqScore: row.legal_iq,
      }))
    // Fallback if the user is brand new and has no history yet
    : Array.from({ length: 7 }, (_, i) => ({ day: `Day ${i + 1}`, iqScore: currentIq }));

  // Slice the data based on the selected filter
  const chartData = timeFilter === "7d" ? processedData.slice(-7) : processedData.slice(-30);

  if (!isMounted) return <div className="h-[400px] w-full animate-pulse bg-muted rounded-xl"></div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      {/* Primary XP Growth Chart */}
      <Card className="col-span-full lg:col-span-4 border-primary/10 shadow-md bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Knowledge Growth</CardTitle>
            <CardDescription>Your Legal IQ trajectory over time.</CardDescription>
          </div>
          <div className="flex bg-muted rounded-lg p-1">
            <Button variant={timeFilter === "7d" ? "default" : "ghost"} size="sm" onClick={() => setTimeFilter("7d")}>7D</Button>
            <Button variant={timeFilter === "30d" ? "default" : "ghost"} size="sm" onClick={() => setTimeFilter("30d")}>30D</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 350 }} className="mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="day" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", borderColor: "#333", borderRadius: "8px", color: "#fff" }} />
                <Area type="monotone" dataKey="iqScore" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIq)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Topic Mastery Bar Chart */}
      <Card className="col-span-full lg:col-span-3 border-primary/10 shadow-md bg-card/50">
        <CardHeader>
          <CardTitle>Topic Mastery</CardTitle>
          <CardDescription>Accuracy across different legal domains.</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 350 }} className="mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicMasteryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#333" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="topic" type="category" stroke="#888" fontSize={12} tickLine={false} axisLine={false} width={100} />
                <Tooltip cursor={{fill: '#2a2a2a'}} contentStyle={{ backgroundColor: "#1a1a1a", borderColor: "#333", borderRadius: "8px", color: "#fff" }} />
                <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}