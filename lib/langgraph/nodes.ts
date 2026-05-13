import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { StateType } from "./state";
import { supabase } from "../supabase/client";

// The Inference Engine (Fast Generation)
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant", 
  temperature: 0, 
});

// lib/langgraph/nodes.ts (Top of the file)
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001", // FIX: Updated to the newest 2026 unified model
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * NODE 1: The Retriever
 * Converts the user's question to a vector, then searches Supabase.
 */
export async function retrieve(state: StateType): Promise<Partial<StateType>> {
  console.log("---RETRIEVING LEGAL CONTEXT FROM SUPABASE---");
  const { question, iterations } = state;

  try {
    // 1. Convert the user's question into a 768-dimensional vector
    const queryVector = await embeddings.embedQuery(question);

    // 2. Perform semantic search via our Supabase RPC function
    const { data, error } = await supabase.rpc('match_legal_documents', {
      query_embedding: queryVector,
      match_threshold: 0.5, // 50% similarity threshold
      match_count: 4        // Fetch top 4 most relevant chunks
    });

    if (error) throw error;

    // 3. Compile the retrieved documents into a single context string
    const retrievedContext = data && data.length > 0 
      ? data.map((doc: any) => `[Document ID: ${doc.id} | Metadata: ${JSON.stringify(doc.metadata)}]\n${doc.content}`).join("\n\n---\n\n")
      : "No relevant legal statutes found in the verified database.";

    return {
      context: retrievedContext,
      iterations: iterations + 1,
    };
  } catch (error) {
    console.error("Supabase Retrieval Error:", error);
    return {
      context: "Database connection failed. Proceed with caution.",
      iterations: iterations + 1,
    };
  }
}

/**
 * NODE 2: The Grader
 */
export async function gradeDocuments(state: StateType): Promise<Partial<StateType>> {
  console.log("---GRADING DOCUMENT RELEVANCE---");
  const { question, context } = state;

  const systemPrompt = `You are a strict legal grader. Assess if the provided legal context is relevant to the user's question.
  If it contains keywords, concepts, or sections related to the question, grade it as relevant.
  Respond ONLY with a JSON object containing a single key 'isRelevant' with a boolean value (true or false).`;

  const response = await llm.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(`Context: \n\n ${context} \n\n Question: ${question}`),
  ]);

  try {
    const output = JSON.parse(response.content as string);
    return { isRelevant: output.isRelevant };
  } catch (e) {
    return { isRelevant: false }; 
  }
}

/**
 * NODE 3: The Generator
 */
export async function generate(state: StateType): Promise<Partial<StateType>> {
  console.log("---GENERATING FINAL RESPONSE---");
  const { question, context } = state;

  const systemPrompt = `You are NyayaSetu, an AI Legal Assistant for Indian citizens. 
  Answer the user's question based strictly on the following context. 
  If the context says "No relevant legal statutes found", strictly reply: "I cannot provide a legal opinion as I could not find verified statutes regarding this in my database."
  Do not hallucinate facts outside the context. Explain the law in simple, easy-to-understand terms.`;

  const response = await llm.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(`Context: ${context}\n\nUser Question: ${question}`),
  ]);

  return {
    messages: [response],
  };
}