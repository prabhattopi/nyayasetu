import { AdvancedAnalytics } from "@/components/dashboard/AdvancedAnalytics";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Performance Analytics</h2>
          <p className="text-muted-foreground">Filter your metrics to identify your strongest legal domains and areas for improvement.</p>
        </div>
      </div>
      
      <div className="w-full">
        <AdvancedAnalytics />
      </div>
    </div>
  );
}