import Link from "next/link";
import { ArrowLeft, CheckCircle2, PlayCircle, FileText, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// In a real app, this data would come from Supabase.
const moduleData = {
  title: "Fundamental Rights (Part III)",
  description: "The bedrock of Indian democracy, guaranteeing civil liberties to all citizens.",
  lessons: [
    { id: 1, title: "Introduction to Part III", type: "video", duration: "5 min", completed: true },
    { id: 2, title: "Article 14: Equality before Law", type: "read", duration: "10 min", completed: false },
    { id: 3, title: "Article 19: The Six Freedoms", type: "read", duration: "15 min", completed: false },
    { id: 4, title: "Article 21: Protection of Life", type: "read", duration: "10 min", completed: false },
    { id: 5, title: "Knowledge Check", type: "quiz", duration: "10 Questions", completed: false },
  ]
};

export default function ModuleDetail({ params }: { params: { slug: string } }) {
  // If they click anything other than fundamental rights for now, show a coming soon placeholder
  if (params.slug !== "fundamental-rights") {
    return (
      <div className="flex items-center justify-center h-full">
        <h2 className="text-2xl font-bold text-muted-foreground">Module content coming soon...</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4 mb-6">
        <Link href="/modules">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{moduleData.title}</h1>
          <p className="text-muted-foreground">{moduleData.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full">
        {/* Left Sidebar: Curriculum Navigation */}
        <div className="md:col-span-4 lg:col-span-3 space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Curriculum</h3>
          <div className="space-y-2">
            {moduleData.lessons.map((lesson) => (
              <div 
                key={lesson.id} 
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  lesson.id === 2 ? "bg-primary/10 border-primary/30" : "bg-card hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-3">
                  {lesson.type === 'video' ? <PlayCircle className="h-4 w-4 text-muted-foreground" /> :
                   lesson.type === 'read' ? <FileText className="h-4 w-4 text-muted-foreground" /> :
                   <HelpCircle className="h-4 w-4 text-muted-foreground" />}
                  <span className={`text-sm font-medium ${lesson.id === 2 ? "text-primary" : "text-foreground"}`}>
                    {lesson.title}
                  </span>
                </div>
                {lesson.completed && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </div>
            ))}
          </div>
        </div>

        {/* Right Area: Actual Lesson Content (Mocking Lesson 2: Article 14) */}
        <div className="md:col-span-8 lg:col-span-9">
          <div className="bg-card border rounded-xl p-8 shadow-sm">
            <div className="max-w-3xl mx-auto prose prose-invert">
              <h1 className="text-3xl font-bold mb-6 text-foreground">Article 14: Equality before Law</h1>
              
              <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg mb-8 text-foreground">
                <p className="italic font-medium">
                  "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India."
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-foreground">Understanding the Two Concepts</h3>
              <ul className="space-y-4 text-muted-foreground mb-8">
                <li>
                  <strong className="text-foreground">1. Equality before the Law (Negative Concept):</strong> Originating from English Common Law, this means no man is above the law. Whether an official or an ordinary citizen, everyone is subject to the jurisdiction of ordinary courts.
                </li>
                <li>
                  <strong className="text-foreground">2. Equal Protection of Laws (Positive Concept):</strong> Originating from the US Constitution, this dictates that equals should be treated equally. It allows the State to classify individuals based on intelligible differentia (e.g., progressive taxation based on income).
                </li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">Real World Application</h3>
              <p className="text-muted-foreground mb-8">
                If the government passes a law stating that only people over 6 feet tall can apply for a government job, this violates Article 14 because the classification (height) has no rational nexus to the objective (doing a government job). However, setting an age requirement of 18+ is a valid, logical classification.
              </p>

              <div className="flex justify-end pt-6 border-t mt-8">
                <Button className="gap-2">
                  Complete & Continue <ArrowLeft className="h-4 w-4 rotate-180" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}