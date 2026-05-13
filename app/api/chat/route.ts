import { NextRequest, NextResponse } from "next/server";
import { nyayaSetuAgent } from "@/lib/langgraph/graph";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth(); 
    const { message, history } = await req.json();

    if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });

    const formattedHistory = history.map((msg: any) => 
      msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
    );
    formattedHistory.push(new HumanMessage(message));

    const initialState = { messages: formattedHistory, question: message, iterations: 0 };
    const finalState = await nyayaSetuAgent.invoke(initialState);
    const aiResponse = finalState.messages[finalState.messages.length - 1];

    if (userId && finalState.isRelevant) {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: profile } = await supabase
        .from('user_progress')
        // FIX: You MUST include 'legal_iq' right here in the select string!
        .select('last_active, current_streak, legal_iq') 
        .eq('user_id', userId)
        .single();

      if (profile) {
        let newStreak = profile.current_streak;
        const lastActiveDate = profile.last_active?.split('T')[0];

        if (lastActiveDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          newStreak = (lastActiveDate === yesterdayStr) ? newStreak + 1 : 1;
        }

        await supabase
          .from('user_progress')
          .update({ 
            current_streak: newStreak, 
            last_active: new Date().toISOString(),
            legal_iq: profile.legal_iq + 5 
          })
          .eq('user_id', userId);
      }
    }

    return NextResponse.json({ response: aiResponse.content });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}