import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

/**
 * This defines the Graph State for NyayaSetu's Agentic Loop.
 * It tracks the user's question, retrieved legal context, and the AI's internal reasoning.
 */
export const AgentState = Annotation.Root({
  // The full chat history
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  // The current query being processed
  question: Annotation<string>({
    reducer: (x, y) => y, // Overwrite with the latest
    default: () => "",
  }),
  // The actual legal text retrieved from Supabase
  context: Annotation<string>({
    reducer: (x, y) => y,
    default: () => "",
  }),
  // Boolean flag set by the "Grader" node to determine if we need to search again
  isRelevant: Annotation<boolean>({
    reducer: (x, y) => y,
    default: () => true,
  }),
  // Failsafe to prevent infinite loops (e.g., stopping after 3 failed searches)
  iterations: Annotation<number>({
    reducer: (x, y) => x + y,
    default: () => 0,
  }),
});

export type StateType = typeof AgentState.State;