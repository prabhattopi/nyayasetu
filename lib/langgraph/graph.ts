import { StateGraph, END, START } from "@langchain/langgraph";
import { AgentState } from "./state";
import { retrieve, gradeDocuments, generate } from "./nodes";

// Build the Graph
const workflow = new StateGraph(AgentState)
  .addNode("retrieve", retrieve)
  .addNode("gradeDocuments", gradeDocuments)
  .addNode("generate", generate)
  
  // Define the linear flow
  .addEdge(START, "retrieve")
  .addEdge("retrieve", "gradeDocuments")
  // FIX: Always route to generate. If the grader failed, the generate 
  // node will gracefully output the "No statutes found" fallback message.
  .addEdge("gradeDocuments", "generate") 
  .addEdge("generate", END);

// Compile the graph into an executable agent
export const nyayaSetuAgent = workflow.compile();