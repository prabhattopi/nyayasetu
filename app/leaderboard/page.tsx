import { supabase } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";

export const revalidate = 0; // Force Next.js to fetch fresh leaderboard data every time

export default async function LeaderboardPage() {
  // Fetch top 10 users ordered by highest Legal IQ
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
        <p className="text-muted-foreground">Top citizens ranked by Legal IQ. Ask questions to gain XP!</p>
      </div>

      <Card className="max-w-3xl border-primary/10 shadow-md bg-card/50">
        <CardHeader>
          <CardTitle>Top Scholars</CardTitle>
          <CardDescription>Real-time rankings based on AI interactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaders?.map((user, index) => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border bg-background">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 font-bold text-lg">
                    {index === 0 ? <Trophy className="text-yellow-500 h-6 w-6" /> : 
                     index === 1 ? <Medal className="text-gray-400 h-6 w-6" /> : 
                     index === 2 ? <Award className="text-amber-600 h-6 w-6" /> : 
                     <span className="text-muted-foreground">#{index + 1}</span>}
                  </div>
                  <div>
                    {/* Since we only store Clerk user_id, we mask it for privacy on the leaderboard */}
                    <p className="font-semibold text-foreground">Citizen-{user.user_id.slice(-5)}</p>
                    <p className="text-xs text-muted-foreground">Streak: {user.current_streak} Days</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-primary">{user.legal_iq} XP</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}