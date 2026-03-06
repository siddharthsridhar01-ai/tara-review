export const C = {
  bg: "#0f1117",
  card: "#1a1d27",
  border: "#2a2d3a",
  accent: "#6c5ce7",
  accentLight: "#a29bfe",
  concl: "#55efc4",
  conclBg: "rgba(85,239,196,0.10)",
  prem: "#74b9ff",
  premBg: "rgba(116,185,255,0.10)",
  assum: "#fdcb6e",
  assumBg: "rgba(253,203,110,0.12)",
  ok: "#55efc4",
  fail: "#ff7675",
  failBg: "rgba(255,118,117,0.10)",
  flaw: "#fd79a8",
  flawBg: "rgba(253,121,168,0.10)",
  ctx: "#c09875",
  ctxBg: "rgba(192,152,117,0.10)",
  vocab: "#ffeaa7",
  text: "#e2e2e8",
  muted: "#8b8d9a",
  white: "#fff",
};

export const typeColors: Record<string, string> = {
  "Main Conclusion": "#55efc4",
  "Drawing a Conclusion": "#74b9ff",
  "Assumption": "#fdcb6e",
  "Reasoning Error": "#fd79a8",
  "Matching Arguments": "#a29bfe",
  "Applying Principles": "#9b8ec9",
  "Weaken": "#ff7675",
  "Strengthen": "#00b894",
};

export interface Question {
  displayNum: number;
  tsaNum: number;
  type: string;
  text: string;
  correctAnswer: string;
  options: string[];
  hasWalkthrough: boolean;
}

export function getResult(q: Question, answers: Record<number, string>): "correct" | "incorrect" | "unanswered" {
  const sa = answers[q.displayNum];
  if (!sa) return "unanswered";
  return sa === q.correctAnswer ? "correct" : "incorrect";
}