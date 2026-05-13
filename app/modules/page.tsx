import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Scale, Briefcase, HeartHandshake } from "lucide-react";

export default function ModulesPage() {
  const modules = [
    { id: "fundamental-rights", title: "Fundamental Rights", desc: "Understand your constitutional guarantees.", icon: Shield, progress: "10%" },
    { id: "bns-criminal-law", title: "Criminal Law (BNS)", desc: "Navigate the new Bharatiya Nyaya Sanhita.", icon: Scale, progress: "0%" },
    // ... add more as needed
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 pt-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Legal Modules</h2>
        <p className="text-muted-foreground">Select a category to begin your interactive coursework.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modules.map((mod) => (
          <Link href={`/modules/${mod.id}`} key={mod.id} className="block group">
            <Card className="flex flex-col h-full hover:border-primary transition-colors cursor-pointer bg-card/50">
              <CardHeader>
                <div className="p-3 bg-primary/10 w-max rounded-lg mb-3 group-hover:bg-primary/20 transition-colors">
                  <mod.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">{mod.title}</CardTitle>
                <CardDescription>{mod.desc}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                <span className="text-sm font-medium text-muted-foreground">{mod.progress} Completed</span>
                <Button variant={mod.progress === "100%" ? "secondary" : "default"} size="sm">
                  {mod.progress === "0%" ? "Start" : "Continue"}
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}