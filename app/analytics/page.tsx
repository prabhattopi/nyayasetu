import { currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase/client";
import { AdvancedAnalytics } from "@/components/dashboard/AdvancedAnalytics";

export default async function AnalyticsPage() {
  const user = await currentUser();
  const firstName = user?.firstName || "Citizen";

  // Fetch the user's current stats
  const { data: progress } = await supabase
    .from("user_progress")
    .select("legal_iq, current_streak")
    .eq("user_id", user?.id)
    .single();

  // Fetch historical data for the charts (if empty, we will handle it in the component)
  const { data: history } = await supabase
    .from("xp_history")
    .select("legal_iq, recorded_at")
    .eq("user_id", user?.id)
    .order("recorded_at", { ascending: true })
    .limit(30);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{firstName}'s Performance Analytics</h2>
          <p className="text-muted-foreground">
            Current Legal IQ: <span className="font-bold text-primary">{progress?.legal_iq || 100} XP</span> | 
            Streak: <span className="font-bold text-orange-500">{progress?.current_streak || 0} Days</span>
          </p>
        </div>
      </div>
      
      <div className="w-full">
        {/* Pass the real historical data down to your chart component */}
        <AdvancedAnalytics realData={history || []} currentIq={progress?.legal_iq || 100} />
      </div>
    </div>
  );
}