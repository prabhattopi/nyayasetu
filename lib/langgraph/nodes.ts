import { ChatGroq } from "@langchain/groq";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { StateType } from "./state";
import { supabase } from "../supabase/client";

// Initialize our blazing-fast Groq model
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  modelName: "llama3-8b-8192", 
  temperature: 0, // Keep it strictly factual for legal data
});

/**
 * NODE 1: The Retriever
 * Searches Supabase for relevant legal documents.
 */
export async function retrieve(state: StateType): Promise<Partial<StateType>> {
  console.log("---RETRIEVING LEGAL CONTEXT---");
  const { question, iterations } = state;

  // Note: In production, you will convert the `question` into a vector embedding here 
  // before calling Supabase. For now, we mock the vector search response structure.
  
  // Example Supabase RPC call (assuming you generated an embedding for the question):
  // const { data } = await supabase.rpc('match_legal_documents', {
  //   query_embedding: your_generated_vector, match_threshold: 0.7, match_count: 3
  // });
  
  const mockRetrievedContext = "Section 378 of IPC: Theft. Whoever, intending to take dishonestly any moveable property out of the possession of any person without that person’s consent, moves that property in order to such taking, is said to commit theft.";

  return {
    context: mockRetrievedContext, // In reality, map `data` to a string
    iterations: iterations + 1,
  };
}

/**
 * NODE 2: The Grader
 * Evaluates if the retrieved context is actually relevant to the question.
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

  // Parse the JSON output from the LLM
  try {
    const output = JSON.parse(response.content as string);
    return { isRelevant: output.isRelevant };
  } catch (e) {
    return { isRelevant: false }; // Failsafe
  }
}

/**
 * NODE 3: The Generator
 * Synthesizes the final answer using ONLY the verified context.
 */
export async function generate(state: StateType): Promise<Partial<StateType>> {
  console.log("---GENERATING FINAL RESPONSE---");
  const { question, context, messages } = state;

  const systemPrompt = `You are NyayaSetu, an AI Legal Assistant for Indian citizens. 
  Answer the user's question based strictly on the following context. 
  Do not hallucinate. If the context does not contain the answer, say "I cannot provide a legal opinion on this based on the verified statutes."
  Explain the law in simple, easy-to-understand terms.`;

  const response = await llm.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(`Context: ${context}\n\nUser Question: ${question}`),
  ]);

  return {
    messages: [response],
  };
}