import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { BookOpen, Flame, Trophy, ShieldAlert } from "lucide-react";

export default async function Home() {
  const user = await currentUser();

  if (!user) return null; 

  const firstName = user.firstName || "Citizen";

  // 1. Fetch current progress
  let { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!progress) {
    const { data: newProgress } = await supabase
      .from("user_progress")
      .insert([{ user_id: user.id, legal_iq: 100, current_streak: 0 }])
      .select()
      .single();
    
    progress = newProgress || { legal_iq: 100, current_streak: 0 };
  }

  // 2. Fetch history for the chart
  const { data: history } = await supabase
    .from("xp_history")
    .select("legal_iq, recorded_at")
    .eq("user_id", user.id)
    .order("recorded_at", { ascending: true })
    .limit(7); // We only need 7 days for the dashboard

  return (
    <div className="flex flex-col flex-1 items-start gap-6 p-4 sm:px-6 sm:py-4 md:gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {firstName}</h1>
        <p className="text-muted-foreground">Here is your daily legal learning summary.</p>
      </div>
      
      <div className="grid gap-4 w-full md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
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

      <div className="grid gap-4 w-full md:gap-8 lg:grid-cols-3">
        {/* 3. Pass the fetched history to our chart */}
        <AnalyticsChart data={history || []} currentIq={progress?.legal_iq} />

        <Card className="col-span-full lg:col-span-1 border-primary/10 shadow-md bg-card/50">
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