"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileText, HelpCircle, Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { legalModules } from "@/lib/data/curriculum";

export default function ModuleDetail({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Unwrap the Next.js 15 Promise
  const resolvedParams = use(params);
  
  // 2. Load the dynamic data based on the safely unwrapped slug
  const moduleData = legalModules.find(m => m.id === resolvedParams.slug);
  
  // 3. Set up our interactive learning state
  const [activeStep, setActiveStep] = useState(0); 
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  if (!moduleData) {
    return <div className="p-8 text-center text-xl text-muted-foreground">Module not found.</div>;
  }

  // Calculate dynamic progress percentage
  const totalSteps = moduleData.lessons.length + 1; // Lessons + 1 Quiz
  const progressPercentage = Math.round((completedSteps.length / totalSteps) * 100);

  const handleLessonComplete = () => {
    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps([...completedSteps, activeStep]);
    }
    setActiveStep(activeStep + 1);
  };

  const calculateScore = () => {
    let correct = 0;
    moduleData.quiz.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) correct++;
    });
    return (correct / moduleData.quiz.questions.length) * 100;
  };

  const handleQuizSubmit = () => {
    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps([...completedSteps, activeStep]);
    }
    setShowResults(true);
  };

  const isQuizStep = activeStep === moduleData.lessons.length;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] p-4 md:p-8">
      {/* Header & Dynamic Progress Bar */}
      <div className="flex flex-col gap-4 border-b pb-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/modules">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{moduleData.title}</h1>
            <p className="text-muted-foreground">{moduleData.description}</p>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground text-right">{progressPercentage}% Mastered</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full overflow-hidden">
        {/* Left Sidebar: Curriculum Navigation */}
        <div className="md:col-span-4 lg:col-span-3 space-y-4 overflow-y-auto pr-2 pb-8">
          <h3 className="font-semibold text-lg border-b pb-2">Curriculum</h3>
          <div className="space-y-2">
            {moduleData.lessons.map((lesson, idx) => (
              <div 
                key={lesson.id}
                onClick={() => setActiveStep(idx)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  activeStep === idx ? "bg-primary/10 border-primary" : "bg-card hover:bg-muted border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className={`h-4 w-4 ${activeStep === idx ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${activeStep === idx ? "text-primary" : "text-foreground"}`}>
                    {lesson.title}
                  </span>
                </div>
                {completedSteps.includes(idx) && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </div>
            ))}
            
            {/* The Final Quiz Tab */}
            <div 
                onClick={() => setActiveStep(moduleData.lessons.length)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all mt-4 ${
                  activeStep === moduleData.lessons.length ? "bg-amber-500/10 border-amber-500" : "bg-card hover:bg-muted border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className={`h-4 w-4 ${activeStep === moduleData.lessons.length ? "text-amber-500" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${activeStep === moduleData.lessons.length ? "text-amber-500" : "text-foreground"}`}>
                    Final Diagnostic Quiz
                  </span>
                </div>
                {completedSteps.includes(moduleData.lessons.length) && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </div>
          </div>
        </div>

        {/* Right Area: Interactive Content & Quiz Rendering */}
        <div className="md:col-span-8 lg:col-span-9 overflow-y-auto pb-12">
          
          {/* RENDER LESSON */}
          {!isQuizStep && moduleData.lessons[activeStep] && (
            <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <div className="max-w-3xl mx-auto prose prose-invert">
                <h1 className="text-3xl font-bold mb-6 text-foreground">{moduleData.lessons[activeStep].title}</h1>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  {moduleData.lessons[activeStep].content}
                </p>
                <div className="flex justify-end pt-6 border-t mt-8">
                  <Button onClick={handleLessonComplete} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                    Complete & Continue <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* RENDER QUIZ */}
          {isQuizStep && !showResults && (
            <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-2 text-foreground">{moduleData.quiz.title}</h1>
                <p className="text-muted-foreground mb-8">Test your knowledge to earn XP and master this module.</p>
                
                <div className="space-y-8">
                  {moduleData.quiz.questions.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-4 bg-background p-6 rounded-lg border">
                      <h3 className="text-lg font-medium">{qIdx + 1}. {q.question}</h3>
                      <div className="grid gap-3">
                        {q.options.map((opt, oIdx) => (
                          <div 
                            key={oIdx}
                            onClick={() => setQuizAnswers({...quizAnswers, [qIdx]: oIdx})}
                            className={`p-4 rounded-md border cursor-pointer transition-colors ${
                              quizAnswers[qIdx] === oIdx ? "bg-primary/20 border-primary text-primary font-medium" : "bg-card hover:bg-muted"
                            }`}
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-6 mt-8">
                  <Button 
                    onClick={handleQuizSubmit} 
                    disabled={Object.keys(quizAnswers).length !== moduleData.quiz.questions.length}
                    className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Submit Answers <CheckCircle2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* RENDER QUIZ RESULTS */}
          {isQuizStep && showResults && (
            <div className="max-w-3xl mx-auto space-y-6 animate-in zoom-in-95">
              <div className={`p-8 rounded-xl border flex flex-col items-center justify-center text-center ${
                calculateScore() >= 60 ? "bg-green-500/10 border-green-500" : "bg-destructive/10 border-destructive"
              }`}>
                {calculateScore() >= 60 ? (
                  <>
                    <Trophy className="h-16 w-16 text-green-500 mb-4" />
                    <h2 className="text-3xl font-bold text-green-500 mb-2">Module Conquered!</h2>
                    <p className="text-lg text-foreground">You scored {calculateScore()}%. Phenomenal work.</p>
                    <Button className="mt-6 bg-green-600 hover:bg-green-700 text-white">Claim +50 XP</Button>
                  </>
                ) : (
                  <>
                    <HelpCircle className="h-16 w-16 text-destructive mb-4" />
                    <h2 className="text-3xl font-bold text-destructive mb-2">Keep Practicing</h2>
                    <p className="text-lg text-foreground">You scored {calculateScore()}%. You need 60% to pass.</p>
                    <Button variant="outline" className="mt-6" onClick={() => setShowResults(false)}>Try Again</Button>
                  </>
                )}
              </div>

              {/* Show the correct answers and feedback */}
              <div className="space-y-4">
                {moduleData.quiz.questions.map((q, qIdx) => (
                  <div key={qIdx} className={`p-4 rounded-lg border ${quizAnswers[qIdx] === q.correct ? "border-green-500/50" : "border-destructive/50"}`}>
                    <p className="font-medium mb-2">{q.question}</p>
                    <p className="text-sm text-muted-foreground mb-1">Your answer: <span className={quizAnswers[qIdx] === q.correct ? "text-green-500" : "text-destructive"}>{q.options[quizAnswers[qIdx]]}</span></p>
                    <p className="text-sm font-medium text-foreground bg-muted p-2 rounded mt-2">{q.feedback}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}