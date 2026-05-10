import { StateGraph, END, START } from "@langchain/langgraph";
import { AgentState, StateType } from "./state";
import { retrieve, gradeDocuments, generate } from "./nodes";

// Define the routing logic based on the Grader's output
function decideToGenerate(state: StateType) {
  console.log("---DECIDING NEXT STEP---");
  if (state.isRelevant) {
    return "generate";
  } else {
    // If not relevant, we end the loop. 
    // In a future update, we could route this to a "rewrite query" node!
    return END; 
  }
}

// Build the Graph
const workflow = new StateGraph(AgentState)
  // Add our nodes
  .addNode("retrieve", retrieve)
  .addNode("gradeDocuments", gradeDocuments)
  .addNode("generate", generate)
  
  // Define the flow
  .addEdge(START, "retrieve")
  .addEdge("retrieve", "gradeDocuments")
  
  // Add the conditional routing
  .addConditionalEdges(
    "gradeDocuments",
    decideToGenerate,
    {
      generate: "generate",
      [END]: END,
    }
  )
  
  // Finish the loop
  .addEdge("generate", END);

// Compile the graph into an executable agent
export const nyayaSetuAgent = workflow.compile();