import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { BookOpen, Flame, Trophy, ShieldAlert } from "lucide-react";

// In Next.js 16 App Router, we can make our pages async to fetch data directly on the server!
export default async function Home() {
  // 1. Securely get the authenticated user's ID
  const { userId } = await auth();

  if (!userId) {
    return null; // The proxy will catch this and redirect, but this is a failsafe
  }

  // 2. Fetch their progress from Supabase
  let { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .single();

  // 3. If they are a brand new user, initialize their stats!
  if (!progress) {
    const { data: newProgress, error } = await supabase
      .from("user_progress")
      .insert([{ user_id: userId, legal_iq: 100, current_streak: 0 }])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating user stats:", error);
    }
    progress = newProgress || { legal_iq: 100, current_streak: 0 };
  }

  return (
    <div className="flex flex-col flex-1 items-start gap-6 p-4 sm:px-6 sm:py-4 md:gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, Citizen</h1>
        <p className="text-muted-foreground">Here is your daily legal learning summary.</p>
      </div>
      
      {/* Top Gamification Stats - NOW DYNAMIC! */}
      <div className="grid gap-4 w-full md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {/* Injecting real database numbers */}
            <div className="text-2xl font-bold">{progress?.current_streak} Days</div>
            <p className="text-xs text-muted-foreground mt-1">Complete a quiz to increase this!</p>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Legal IQ Score</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {/* Injecting real database numbers */}
            <div className="text-2xl font-bold">{progress?.legal_iq} XP</div>
            <p className="text-xs text-muted-foreground mt-1">Keep chatting with the AI to level up.</p>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modules Mastered</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 / 15</div>
            <p className="text-xs text-muted-foreground mt-1">Start your first module today.</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics and Recent Activity */}
      <div className="grid gap-4 w-full md:gap-8 lg:grid-cols-3">
        {/* We leave the chart mock data for now, but it's ready to accept real arrays! */}
        <AnalyticsChart />

        <Card className="col-span-full lg:col-span-1 border-primary/10 shadow-md">
          <CardHeader>
            <CardTitle>Focus Areas</CardTitle>
            <CardDescription>Topics that need your attention.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-start gap-4 rounded-md border p-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 text-destructive" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">BNS vs IPC Differences</p>
                  <p className="text-sm text-muted-foreground">Take the diagnostic test.</p>
                </div>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}