import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Overview</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 Days</div>
            <p className="text-xs text-muted-foreground">+1 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Legal IQ Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">Top 15% of users</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-4">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>Your performance across different legal modules.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-dashed border-2 rounded-md m-4">
            <span className="text-muted-foreground">Recharts Analytics will go here in Phase 4</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}