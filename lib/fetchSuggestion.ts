import { Board } from "@/typing";
import { formatTodoForAI } from "./formatTodoForAI";
export const fetchSuggestion = async (board: Board) => {
  const todos = formatTodoForAI(board);

  const res = await fetch("/api/generateSummary", {
    method: "POST",
    headers: {
      "Content-Type": "applicaton/json",
    },
    body: JSON.stringify({ todos }),
  }); 

  
  const GPTdata = await res.json();
  const { content } = GPTdata;
  return content;
};
