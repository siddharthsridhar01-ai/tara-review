import { Question } from "./tara";

export const papers: Record<string, { title: string; source: string; questions: Question[] }> = {
  "tsa-2022": {
    title: "Critical Thinking Practice",
    source: "TSA 2022",
    questions: [
      { displayNum: 1, tsaNum: 1, type: "Main Conclusion", text: "Which one of the following best expresses the main conclusion of the above argument?", correctAnswer: "A", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 2, tsaNum: 15, type: "Main Conclusion", text: "Which one of the following best expresses the main conclusion of the above argument?", correctAnswer: "C", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 3, tsaNum: 29, type: "Main Conclusion", text: "Which one of the following best expresses the main conclusion of the above argument?", correctAnswer: "B", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 4, tsaNum: 39, type: "Main Conclusion", text: "Which one of the following best expresses the main conclusion of the above argument?", correctAnswer: "C", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 5, tsaNum: 47, type: "Main Conclusion", text: "Which one of the following best expresses the main conclusion of the above argument?", correctAnswer: "B", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 6, tsaNum: 3, type: "Assumption", text: "Which one of the following is an underlying assumption of the above argument?", correctAnswer: "E", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 7, tsaNum: 22, type: "Assumption", text: "Which one of the following is an underlying assumption of the argument above?", correctAnswer: "D", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 8, tsaNum: 33, type: "Assumption", text: "Which one of the following is an underlying assumption of the above argument?", correctAnswer: "C", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 9, tsaNum: 41, type: "Assumption", text: "Which one of the following is an underlying assumption of the above argument?", correctAnswer: "C", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 10, tsaNum: 27, type: "Reasoning Error", text: "Which one of the following best illustrates the flaw in the above argument?", correctAnswer: "B", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 11, tsaNum: 40, type: "Reasoning Error", text: "Which one of the following best illustrates the flaw in the above argument?", correctAnswer: "D", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 12, tsaNum: 5, type: "Matching Arguments", text: "Which one of the following most closely parallels the reasoning used in the above argument?", correctAnswer: "E", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 13, tsaNum: 21, type: "Matching Arguments", text: "Which one of the following most closely parallels the reasoning used in the above argument?", correctAnswer: "D", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 14, tsaNum: 28, type: "Matching Arguments", text: "Which one of the following most closely parallels the reasoning used in the above argument?", correctAnswer: "A", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 15, tsaNum: 45, type: "Matching Arguments", text: "Which one of the following most closely parallels the reasoning used in the above argument?", correctAnswer: "B", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 16, tsaNum: 11, type: "Drawing a Conclusion", text: "Which one of the following can be drawn as a conclusion from the above passage?", correctAnswer: "A", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 17, tsaNum: 35, type: "Drawing a Conclusion", text: "Which one of the following can be drawn as a conclusion from the above passage?", correctAnswer: "D", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 18, tsaNum: 9, type: "Applying Principles", text: "Which one of the following best illustrates the principle used in the above argument?", correctAnswer: "C", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 19, tsaNum: 17, type: "Applying Principles", text: "Which one of the following best illustrates the principle used in the above argument?", correctAnswer: "D", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 20, tsaNum: 34, type: "Applying Principles", text: "Which one of the following best illustrates the principle used in the above argument?", correctAnswer: "D", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 21, tsaNum: 10, type: "Weaken", text: "Which one of the following, if true, most weakens the above argument?", correctAnswer: "D", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 22, tsaNum: 23, type: "Weaken", text: "Which one of the following, if true, most weakens the above argument?", correctAnswer: "E", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
      { displayNum: 23, tsaNum: 49, type: "Weaken", text: "Which one of the following, if true, most weakens the above argument?", correctAnswer: "B", options: ["A", "B", "C", "D", "E"], hasWalkthrough: true },
    ],
  },
};