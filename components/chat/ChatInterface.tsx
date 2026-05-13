"use client";

import { useState } from "react";
import { Send, Scale, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Namaste. I am NyayaSetu, your virtual legal assistant. How can I help you understand Indian law today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    const userMsg: Message = { role: "user", content: currentInput };
    
    // FIX 1: Only append the user message once before fetching
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          // Send history UP TO the current message (excluding the one we just added to UI state, 
          // or we can send the whole thing depending on how the backend parses it. 
          // Our backend appends the new message itself, so send the previous state.)
          history: messages, 
        }),
      });

      const data = await res.json();
      
      // FIX 2: Append ONLY the assistant's response to the current state
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response || "I encountered an error." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, the network failed to connect to the legal knowledge base." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto shadow-lg border-primary/20 bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-muted/30">
        <div className="p-2 bg-primary/10 rounded-full">
          <Scale className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-lg text-foreground">NyayaSetu AI</h2>
          <p className="text-xs text-muted-foreground">Powered by Agentic RAG</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-4 py-3 text-sm ${
              msg.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted text-foreground border border-border"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-4 py-3 text-sm bg-muted text-foreground border border-border">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing legal statutes...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-4 border-t flex gap-2 bg-background rounded-b-xl">
        <Input
          placeholder="e.g., What is the punishment for theft under the new BNS?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 bg-muted/50 focus-visible:ring-primary"
        />
        <Button type="submit" disabled={isLoading || !input.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </Card>
  );
}