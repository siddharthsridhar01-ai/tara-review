"use client";

import { useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import { C, typeColors, getResult } from "@/lib/tara";
import { papers } from "@/lib/papers";
import WalkthroughLoader from "@/components/walkthroughs/WalkthroughLoader";

const mockAnswers: Record<number, string> = {
  1: "A", 2: "C", 3: "E", 4: "C", 5: "B", 6: "D", 7: "A", 8: "C",
  9: "C", 10: "B", 11: "D", 12: "B", 13: "D", 14: "A", 15: "B", 16: "A",
  17: "D", 18: "C", 19: "D", 20: "A", 21: "D", 22: "E", 23: "B",
};

function parseAnswersFromURL(param: string | null): Record<number, string> | null {
  if (!param) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(param));
    if (typeof parsed === "object" && parsed !== null) {
      const result: Record<number, string> = {};
      for (const [k, v] of Object.entries(parsed)) {
        result[Number(k)] = String(v);
      }
      return result;
    }
  } catch {}
  return null;
}

export default function ReviewPage({ params }: { params: Promise<{ paperId: string }> }) {
  const { paperId } = use(params);
  const paper = papers[paperId];
  const searchParams = useSearchParams();

  const [view, setView] = useState<"summary" | "review">("summary");
  const [activeQ, setActiveQ] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(true);
  const [walkthroughOpen, setWalkthroughOpen] = useState<number | null>(null);

  const urlAnswers = parseAnswersFromURL(searchParams.get("answers"));
  const answers = urlAnswers || mockAnswers;
  const isFromExam = !!urlAnswers;

  if (!paper) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: C.fail, fontSize: 16, fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif" }}>Paper not found.</p>
      </div>
    );
  }

  const { questions, title, source } = paper;
  const total = questions.length;
  const correct = questions.filter(q => getResult(q, answers) === "correct").length;
  const incorrect = total - correct;
  const pct = Math.round((correct / total) * 100);

  const filteredQs = showAll ? questions : questions.filter(q => getResult(q, answers) === "incorrect");
  const currentQ = activeQ !== null ? questions.find(q => q.displayNum === activeQ) || null : null;

  const font = "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif";
  const headingFont = "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif";

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "TEXTAREA") return;
      if (view !== "review" || walkthroughOpen) return;

      const idx = filteredQs.findIndex(q => q.displayNum === activeQ);

      if (e.key === "ArrowLeft" && idx > 0) {
        e.preventDefault();
        setActiveQ(filteredQs[idx - 1].displayNum);
      } else if (e.key === "ArrowRight" && idx < filteredQs.length - 1) {
        e.preventDefault();
        setActiveQ(filteredQs[idx + 1].displayNum);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [view, activeQ, walkthroughOpen, filteredQs]);

  useEffect(() => {
    const handleComplete = () => setWalkthroughOpen(null);
    window.addEventListener("walkthrough-complete", handleComplete);
    return () => window.removeEventListener("walkthrough-complete", handleComplete);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: font, letterSpacing: 0.2 }}>

      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "16px 24px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: 1 }}>TARA</span>
            <span style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>Critical Thinking</span>
            <span style={{ fontSize: 12, color: C.muted }}>Practice Paper</span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {(["summary", "review"] as const).map(v => (
              <button key={v} onClick={() => { setView(v); setActiveQ(null); setWalkthroughOpen(null); }} style={{
                padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: view === v ? C.accent : "transparent",
                border: `1px solid ${view === v ? C.accent : C.border}`,
                color: view === v ? C.white : C.muted, cursor: "pointer", fontFamily: font,
                position: "relative",
              }}>
                {v === "summary" ? "Summary" : "Review"}
                {v === "review" && incorrect > 0 && (
                  <span style={{ position: "absolute", top: -6, right: -6, background: C.fail, borderRadius: 10, padding: "2px 6px", fontSize: 10, fontWeight: 700, color: C.white, minWidth: 16, textAlign: "center" }}>{incorrect}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>

        {view === "summary" && (
          <>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: C.white, margin: "0 0 6px", fontFamily: headingFont, fontStyle: "italic" }}>Your Results</h1>
            <p style={{ fontSize: 13, color: C.muted, margin: "0 0 16px" }}>{title} · {total} Questions</p>

            {!isFromExam && (
              <div style={{ background: "rgba(253,203,110,0.10)", border: "1px solid rgba(253,203,110,0.3)", borderRadius: 10, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#fdcb6e" }}>Demo mode — showing sample answers. Take the exam to see your real results.</span>
              </div>
            )}

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "28px 32px", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke={C.border} strokeWidth="6" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={C.ok} strokeWidth="6"
                      strokeDasharray={`${2 * Math.PI * 42 * pct / 100} ${2 * Math.PI * 42}`}
                      strokeLinecap="round" transform="rotate(-90 50 50)"
                      style={{ transition: "stroke-dasharray 0.8s ease" }} />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: C.white }}>{pct}%</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
                    <div><span style={{ fontSize: 28, fontWeight: 700, color: C.ok }}>{correct}</span><span style={{ fontSize: 13, color: C.muted, marginLeft: 6 }}>correct</span></div>
                    <div><span style={{ fontSize: 28, fontWeight: 700, color: C.fail }}>{incorrect}</span><span style={{ fontSize: 13, color: C.muted, marginLeft: 6 }}>incorrect</span></div>
                    <div><span style={{ fontSize: 28, fontWeight: 700, color: C.muted }}>{total}</span><span style={{ fontSize: 13, color: C.muted, marginLeft: 6 }}>total</span></div>
                  </div>
                  <div style={{ height: 8, background: C.border, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${C.ok}, ${C.concl})`, borderRadius: 4, transition: "width 0.8s ease" }} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 28px", marginBottom: 24 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 16 }}>Performance by Question Type</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {Object.entries(typeColors).map(([type, color]) => {
                  const qs = questions.filter(q => q.type === type);
                  if (qs.length === 0) return null;
                  const c = qs.filter(q => getResult(q, answers) === "correct").length;
                  const t = qs.length;
                  return (
                    <div key={type} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 13, color, fontWeight: 600, width: 170, flexShrink: 0 }}>{type}</span>
                      <div style={{ flex: 1, height: 6, background: C.border, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${(c / t) * 100}%`, background: color, borderRadius: 3, transition: "width 0.6s ease" }} />
                      </div>
                      <span style={{ fontSize: 12, color: C.muted, width: 40, textAlign: "right" }}>{c}/{t}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 28px" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 16 }}>All Questions</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {questions.map(q => {
                  const isCorrect = getResult(q, answers) === "correct";
                  return (
                    <button key={q.displayNum} onClick={() => { setView("review"); setActiveQ(q.displayNum); }} style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: isCorrect ? C.conclBg : C.failBg,
                      border: `1.5px solid ${isCorrect ? C.ok : C.fail}`,
                      color: isCorrect ? C.ok : C.fail,
                      fontSize: 13, fontWeight: 700, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: font,
                    }}>{q.displayNum}</button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {view === "review" && !walkthroughOpen && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>{activeQ ? `Question ${activeQ} of ${total}` : `${filteredQs.length} of ${total}`}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: C.muted }}>Show all questions</span>
                <button onClick={() => setShowAll(!showAll)} style={{
                  width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer",
                  background: showAll ? C.accent : C.border, position: "relative", transition: "background 0.3s",
                }}>
                  <div style={{ width: 16, height: 16, borderRadius: 8, background: C.white, position: "absolute", top: 3, left: showAll ? 21 : 3, transition: "left 0.3s" }} />
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 24 }}>
              {questions.map(q => {
                const isCorrect = getResult(q, answers) === "correct";
                const isActive = activeQ === q.displayNum;
                if (!showAll && isCorrect) return null;
                return (
                  <button key={q.displayNum} onClick={() => setActiveQ(q.displayNum)} style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: isActive ? (isCorrect ? C.ok : C.fail) : "transparent",
                    border: `1.5px solid ${isCorrect ? C.ok : C.fail}`,
                    color: isActive ? C.white : (isCorrect ? C.ok : C.fail),
                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: font,
                  }}>{q.displayNum}</button>
                );
              })}
            </div>

            {currentQ && (() => {
              const isCorrect = getResult(currentQ, answers) === "correct";
              const sa = answers[currentQ.displayNum];
              const tc = typeColors[currentQ.type] || C.muted;
              return (
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 28px", marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: C.white }}>Question {currentQ.displayNum}</span>
                      <span style={{
                        padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                        background: isCorrect ? C.conclBg : C.failBg,
                        border: `1px solid ${isCorrect ? C.ok : C.fail}`,
                        color: isCorrect ? C.ok : C.fail,
                      }}>{isCorrect ? "Correct" : "Incorrect"}</span>
                    </div>
                    <span style={{ fontSize: 12, color: tc, fontWeight: 600 }}>{currentQ.type}</span>
                  </div>

                  <p style={{ fontSize: 12, color: C.muted, margin: "0 0 16px" }}>{source} · Question {currentQ.tsaNum}</p>

                  {currentQ.passage && (
                    <div style={{
                      background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12,
                      padding: "18px 22px", margin: "0 0 18px",
                    }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Passage</span>
                      <p style={{ fontSize: 14, color: C.text, lineHeight: 1.8, margin: 0 }}>{currentQ.passage}</p>
                    </div>
                  )}

                  <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: "0 0 20px", fontWeight: 600 }}>{currentQ.text}</p>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
                    {currentQ.options.map(opt => {
                      const isStudentAnswer = sa === opt;
                      const isCorrectAnswer = currentQ.correctAnswer === opt;
                      const showAsWrong = isStudentAnswer && !isCorrect;
                      let borderColor = C.border;
                      let bg = "transparent";
                      let textColor = C.muted;
                      if (isCorrectAnswer) { borderColor = C.ok; bg = C.conclBg; textColor = C.ok; }
                      else if (showAsWrong) { borderColor = C.fail; bg = C.failBg; textColor = C.fail; }
                      return (
                        <div key={opt} style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "10px 14px", borderRadius: 10,
                          background: bg, border: `1.5px solid ${borderColor}`,
                        }}>
                          <span style={{
                            width: 26, height: 26, borderRadius: 7,
                            background: isCorrectAnswer ? C.ok : showAsWrong ? C.fail : C.border,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: 700, color: (isCorrectAnswer || showAsWrong) ? C.white : C.muted,
                            flexShrink: 0,
                          }}>{isCorrectAnswer ? "✓" : showAsWrong ? "✗" : opt}</span>
                          <span style={{ fontSize: 13, color: textColor, fontWeight: (isCorrectAnswer || showAsWrong) ? 600 : 400 }}>
                            Option {opt}
                            {isStudentAnswer && isCorrect && <span style={{ fontSize: 11, color: C.ok, marginLeft: 8 }}>Your answer</span>}
                            {isStudentAnswer && !isCorrect && <span style={{ fontSize: 11, color: C.fail, marginLeft: 8 }}>Your answer</span>}
                            {isCorrectAnswer && !isStudentAnswer && <span style={{ fontSize: 11, color: C.ok, marginLeft: 8 }}>Correct answer</span>}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {currentQ.hasWalkthrough && (
                    <button onClick={() => setWalkthroughOpen(currentQ.displayNum)} style={{
                      width: "100%", padding: "14px 20px", borderRadius: 12, border: "none",
                      background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
                      color: C.white, fontSize: 14, fontWeight: 700, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      fontFamily: font,
                    }}>
                      <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>TARA</span>
                      Interactive Walkthrough
                    </button>
                  )}
                </div>
              );
            })()}

            {currentQ && (() => {
              const idx = filteredQs.findIndex(q => q.displayNum === activeQ);
              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => idx > 0 && setActiveQ(filteredQs[idx - 1].displayNum)} disabled={idx <= 0} style={{
                    flex: 1, padding: "13px 20px", borderRadius: 10,
                    border: `1px solid ${C.border}`, background: "#1e2030",
                    color: C.text, fontSize: 14, fontWeight: 600, cursor: "pointer",
                    opacity: idx <= 0 ? 0.4 : 1, fontFamily: font,
                  }}>← Previous</button>
                  <button onClick={() => idx < filteredQs.length - 1 && setActiveQ(filteredQs[idx + 1].displayNum)} disabled={idx >= filteredQs.length - 1} style={{
                    flex: 1, padding: "13px 20px", borderRadius: 10, border: "none",
                    background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
                    color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer",
                    opacity: idx >= filteredQs.length - 1 ? 0.4 : 1, fontFamily: font,
                  }}>Next →</button>
                </div>
              );
            })()}

            {!currentQ && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "40px 28px", textAlign: "center" }}>
                <p style={{ fontSize: 15, color: C.muted, margin: 0 }}>Select a question above to review it</p>
              </div>
            )}
          </>
        )}

        {walkthroughOpen && (
          <div>
            <button onClick={() => setWalkthroughOpen(null)} style={{
              padding: "8px 16px", borderRadius: 8, border: `1px solid ${C.border}`,
              background: C.card, color: C.text, fontSize: 13, fontWeight: 600,
              cursor: "pointer", marginBottom: 20, display: "flex", alignItems: "center", gap: 6,
              fontFamily: font,
            }}>← Back to Review</button>
            <WalkthroughLoader paperId={paperId} displayNum={walkthroughOpen} />
          </div>
        )}
      </div>
    </div>
  );
}