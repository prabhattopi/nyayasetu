import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export async function GET() {
  try {
// lib/langgraph/nodes.ts (Top of the file)

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001", // FIX: Updated to the newest 2026 unified model
  apiKey: process.env.GEMINI_API_KEY,
});
    // Sample data: A few distinct laws from the BNS and IPC for testing
    const sampleLaws = [
      { content: "BNS Section 63: Rape. Punishment shall not be less than ten years, extending to life imprisonment, and fine.", metadata: { category: "Criminal", topic: "Rape" } },
      { content: "BNS Section 303: Theft. Whoever dishonestly takes movable property without consent commits theft. Punishment extends to 3 years or fine.", metadata: { category: "Property", topic: "Theft" } },
      { content: "BNS Section 111: Organised Crime. Continuing unlawful activity by a syndicate. Punishment ranges from 5 years to life, or death if it results in murder.", metadata: { category: "Organised Crime", topic: "Syndicate" } },
      { content: "BNS Section 318: Cheating/Fraud. Deceiving someone to deliver property. Punishment up to 3 years. If property is delivered, up to 7 years.", metadata: { category: "Financial", topic: "Fraud" } },
      { content: "BNS Section 293: Cyber Crime & Identity Theft. Using another's electronic signature or password fraudulently. Punishment up to 3 years and fine.", metadata: { category: "Cyber", topic: "Identity Theft" } },
      { content: "BNS Section 44: Right of Private Defense. Nothing is an offence which is done in the exercise of the right of private defense of body or property.", metadata: { category: "Rights", topic: "Self Defense" } },
      { content: "Consumer Protection Act, Section 2(9): Consumer Rights. The right to be protected against marketing of goods that are hazardous to life and property; the right to be informed about quality, quantity, and price.", metadata: { category: "Civil", topic: "Consumer Rights" } },
      { content: "BNS Section 115: Voluntarily causing hurt. Whoever does any act with the intention of causing bodily pain, disease or infirmity to any person. Punishment up to 1 year.", metadata: { category: "Criminal", topic: "Assault" } },
      { content: "Information Technology Act, Section 66E: Violation of Privacy. Intentionally capturing or publishing images of a private area of any person without consent. Punishment up to 3 years.", metadata: { category: "Cyber", topic: "Privacy" } },
      { content: "BNS Section 80: Dowry Death. Where the death of a woman is caused by burns or bodily injury within seven years of marriage and she was subjected to cruelty for dowry. Minimum 7 years imprisonment.", metadata: { category: "Criminal", topic: "Dowry" } }
    ];

    console.log("Embedding and uploading seed data...");

    for (const law of sampleLaws) {
      // 1. Generate the vector embedding for the text
      const vector = await embeddings.embedQuery(law.content);
      
      // 2. Insert into Supabase
      const { error } = await supabase.from('legal_documents').insert({
        content: law.content,
        metadata: law.metadata,
        embedding: vector,
      });

      if (error) throw error;
    }

    return NextResponse.json({ success: true, message: "Legal database successfully seeded with vector data!" });

  } catch (error: any) {
    console.error("Seed Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}