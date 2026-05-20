import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 pt-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Account Settings</h2>
        <p className="text-muted-foreground">Manage your citizen profile and security preferences.</p>
      </div>
      
      <div className="flex justify-center w-full mt-4">
        <UserProfile 
          routing="hash" // <-- THE FIX: Tells Clerk to use hash URLs
          appearance={{
            elements: {
              card: "bg-card border border-border shadow-md",
              navbar: "border-r border-border",
              headerTitle: "text-foreground",
              headerSubtitle: "text-muted-foreground",
              profileSectionTitle: "text-foreground border-b border-border pb-2",
            }
          }}
        />
      </div>
    </div>
  );
}