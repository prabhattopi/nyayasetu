import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { LiveLeaderboard } from "@/components/dashboard/LiveLeaderboard";

export const revalidate = 0; // Ensures we don't cache stale data on initial load

export default async function LeaderboardPage() {
  // 1. Fetch initial top 10 on the server for instant loading
  const { data: leaders } = await supabase
    .from('user_progress')
    .select('*')
    .order('legal_iq', { ascending: false })
    .limit(10);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 pt-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" /> Global Leaderboard
        </h2>
        <p className="text-muted-foreground">Top citizens ranked by Legal IQ. The board updates in real-time!</p>
      </div>

      <Card className="max-w-3xl border-primary/10 shadow-md bg-card/50">
        <CardHeader>
          <CardTitle>Top Scholars</CardTitle>
          <CardDescription>Live rankings. Earn XP in chat to climb the board.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 2. Pass the data to our client component to handle the magic */}
          <LiveLeaderboard initialLeaders={leaders || []} />
        </CardContent>
      </Card>
    </div>
  );
}