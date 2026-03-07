"use client";

import { useState, useEffect, useCallback, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { papers } from "@/lib/papers";
import { C } from "@/lib/tara";

type ExamPhase = "intro" | "exam" | "review-screen" | "submitted";
type ThemeMode = "tara" | "vue";

const EXAM_DURATION_SECONDS = 23 * (90 / 50) * 60; // ~41.4 min, scaled from 90 min / 50 qs

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

/* ── Theme definitions ── */
const themes: Record<ThemeMode, Record<string, string>> = {
  tara: {
    bg: C.bg, card: C.card, border: C.border, text: C.text, muted: C.muted,
    white: C.white, accent: C.accent, accentLight: C.accentLight,
    ok: C.ok, fail: C.fail, headerBg: C.card,
    optionBg: "transparent", optionSelectedBg: "rgba(108,92,231,0.15)",
    optionBorder: C.border, optionSelectedBorder: C.accent,
    flagColor: "#fdcb6e", navBg: C.card,
    font: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif",
    headingFont: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
  },
  vue: {
    bg: "#f0f0f0", card: "#ffffff", border: "#d0d0d0", text: "#333333", muted: "#666666",
    white: "#ffffff", accent: "#0056b3", accentLight: "#3a7bd5",
    ok: "#28a745", fail: "#dc3545", headerBg: "#003366",
    optionBg: "#ffffff", optionSelectedBg: "#e8f0fe",
    optionBorder: "#cccccc", optionSelectedBorder: "#0056b3",
    flagColor: "#ff8c00", navBg: "#e8e8e8",
    font: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    headingFont: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
};

export default function ExamPage({ params }: { params: Promise<{ paperId: string }> }) {
  const { paperId } = use(params);
  const router = useRouter();
  const paper = papers[paperId];

  const [phase, setPhase] = useState<ExamPhase>("intro");
  const [mode, setMode] = useState<ThemeMode>("tara");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(Math.floor(EXAM_DURATION_SECONDS));
  const [timerVisible, setTimerVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const t = themes[mode];

  const startExam = useCallback(() => {
    setPhase("exam");
    setCurrentQ(0);
    setAnswers({});
    setFlagged(new Set());
    setTimeLeft(Math.floor(EXAM_DURATION_SECONDS));
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== "exam") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setPhase("review-screen");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  if (!paper) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: C.fail, fontSize: 16, fontFamily: t.font }}>Paper not found.</p>
      </div>
    );
  }

  const { questions, title, source } = paper;
  const total = questions.length;
  const q = questions[currentQ];

  const selectAnswer = (opt: string) => {
    setAnswers(prev => ({ ...prev, [q.displayNum]: opt }));
  };

  const toggleFlag = () => {
    setFlagged(prev => {
      const n = new Set(prev);
      if (n.has(currentQ)) n.delete(currentQ); else n.add(currentQ);
      return n;
    });
  };

  const goNext = () => { if (currentQ < total - 1) setCurrentQ(currentQ + 1); };
  const goPrev = () => { if (currentQ > 0) setCurrentQ(currentQ - 1); };

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = total - answeredCount;
  const isLowTime = timeLeft < 300;

  /* ── INTRO SCREEN ── */
  if (phase === "intro") {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: t.font, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 600, width: "100%", padding: "0 20px" }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "48px 40px", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: 1 }}>TARA</span>
              <span style={{ fontSize: 13, color: C.muted }}>Mock Exam</span>
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 700, color: C.white, margin: "0 0 8px", fontFamily: themes.tara.headingFont, fontStyle: "italic" }}>{title}</h1>
            <p style={{ fontSize: 14, color: C.muted, margin: "0 0 32px" }}>{source} · {total} Questions · {formatTime(Math.floor(EXAM_DURATION_SECONDS))}</p>

            <div style={{ marginBottom: 32 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 12 }}>Exam Mode</span>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                {([["tara", "TARA Mode"], ["vue", "Pearson VUE Mode"]] as const).map(([m, label]) => (
                  <button key={m} onClick={() => setMode(m)} style={{
                    padding: "12px 24px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                    background: mode === m ? C.accent : "transparent",
                    border: `1.5px solid ${mode === m ? C.accent : C.border}`,
                    color: mode === m ? C.white : C.muted,
                    cursor: "pointer", fontFamily: t.font, transition: "all 0.2s",
                  }}>{label}</button>
                ))}
              </div>
            </div>

            <div style={{ background: C.bg, borderRadius: 12, padding: "18px 22px", marginBottom: 32, textAlign: "left" }}>
              <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, margin: "0 0 8px" }}>
                <strong style={{ color: C.white }}>Instructions:</strong>
              </p>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: "0 0 6px" }}>
                · You have <strong style={{ color: C.white }}>{formatTime(Math.floor(EXAM_DURATION_SECONDS))}</strong> to complete {total} questions
              </p>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: "0 0 6px" }}>
                · Use the <strong style={{ color: "#fdcb6e" }}>flag</strong> button to mark questions for later review
              </p>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: "0 0 6px" }}>
                · Navigate with Previous / Next or click question numbers directly
              </p>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>
                · No penalties for incorrect answers — attempt all questions
              </p>
            </div>

            <button onClick={startExam} style={{
              padding: "16px 48px", borderRadius: 12, border: "none",
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
              color: C.white, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: t.font,
              letterSpacing: 0.5,
            }}>Begin Exam</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── ITEM REVIEW SCREEN ── */
  if (phase === "review-screen") {
    const headerColor = mode === "vue" ? t.headerBg : C.card;
    const headerText = mode === "vue" ? "#ffffff" : C.white;
    return (
      <div style={{ minHeight: "100vh", background: t.bg, fontFamily: t.font }}>
        <div style={{ background: headerColor, borderBottom: `1px solid ${t.border}`, padding: "12px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: headerText }}>Item Review</span>
            {timeLeft > 0 && <span style={{ fontSize: 14, fontWeight: 700, color: isLowTime ? t.fail : headerText, fontVariantNumeric: "tabular-nums" }}>Time: {formatTime(timeLeft)}</span>}
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: t.text, margin: "0 0 6px", fontFamily: t.headingFont }}>{title} — Review</h2>
          <p style={{ fontSize: 13, color: t.muted, margin: "0 0 24px" }}>
            {answeredCount} of {total} answered · {flagged.size} flagged · {unansweredCount} incomplete
          </p>

          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: mode === "vue" ? 4 : 16, overflow: "hidden", marginBottom: 24 }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 100px 80px", padding: "10px 16px", background: mode === "vue" ? "#e8e8e8" : C.bg, borderBottom: `1px solid ${t.border}`, fontSize: 11, fontWeight: 700, color: t.muted, letterSpacing: 0.5, textTransform: "uppercase" }}>
              <span>#</span><span>Status</span><span>Flagged</span><span>Action</span>
            </div>
            {/* Table rows */}
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              {questions.map((question, i) => {
                const answered = !!answers[question.displayNum];
                const isFlagged = flagged.has(i);
                return (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "60px 1fr 100px 80px", padding: "10px 16px",
                    borderBottom: `1px solid ${t.border}`, alignItems: "center",
                    background: !answered ? (mode === "vue" ? "#fff8f0" : "rgba(255,118,117,0.05)") : "transparent",
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{question.displayNum}</span>
                    <span style={{ fontSize: 12, color: answered ? t.ok : t.fail, fontWeight: 600 }}>
                      {answered ? `Answered (${answers[question.displayNum]})` : "Incomplete"}
                    </span>
                    <span style={{ fontSize: 14, color: isFlagged ? t.flagColor : t.muted }}>{isFlagged ? "⚑ Yes" : "—"}</span>
                    <button onClick={() => { setCurrentQ(i); setPhase("exam"); }} style={{
                      padding: "4px 12px", borderRadius: mode === "vue" ? 3 : 6, border: `1px solid ${t.border}`,
                      background: "transparent", color: t.accent, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: t.font,
                    }}>Review</button>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => setPhase("exam")} style={{
              padding: "12px 28px", borderRadius: mode === "vue" ? 4 : 10,
              border: `1px solid ${t.border}`, background: t.card,
              color: t.text, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: t.font,
            }}>← Back to Exam</button>
            <button onClick={() => {
              const flaggedIdxs = Array.from(flagged);
              if (flaggedIdxs.length > 0) { setCurrentQ(flaggedIdxs[0]); setPhase("exam"); }
            }} disabled={flagged.size === 0} style={{
              padding: "12px 28px", borderRadius: mode === "vue" ? 4 : 10,
              border: `1px solid ${t.border}`, background: t.card,
              color: flagged.size > 0 ? t.flagColor : t.muted,
              fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: t.font,
              opacity: flagged.size === 0 ? 0.5 : 1,
            }}>Review Flagged ({flagged.size})</button>
            <button onClick={() => {
              const firstUnanswered = questions.findIndex(q => !answers[q.displayNum]);
              if (firstUnanswered >= 0) { setCurrentQ(firstUnanswered); setPhase("exam"); }
            }} disabled={unansweredCount === 0} style={{
              padding: "12px 28px", borderRadius: mode === "vue" ? 4 : 10,
              border: `1px solid ${t.border}`, background: t.card,
              color: unansweredCount > 0 ? t.fail : t.muted,
              fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: t.font,
              opacity: unansweredCount === 0 ? 0.5 : 1,
            }}>Review Incomplete ({unansweredCount})</button>
            <button onClick={() => {
              if (timerRef.current) clearInterval(timerRef.current);
              setPhase("submitted");
            }} style={{
              padding: "12px 32px", borderRadius: mode === "vue" ? 4 : 10, border: "none",
              background: mode === "vue" ? t.accent : `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: t.font,
              marginLeft: "auto",
            }}>Submit Exam</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── SUBMITTED SCREEN ── */
  if (phase === "submitted") {
    const correct = questions.filter(q => answers[q.displayNum] === q.correctAnswer).length;
    const pct = Math.round((correct / total) * 100);
    return (
      <div style={{ minHeight: "100vh", background: C.bg, fontFamily: themes.tara.font, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 500, width: "100%", padding: "0 20px" }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "48px 40px", textAlign: "center" }}>
            <div style={{ width: 100, height: 100, margin: "0 auto 24px", position: "relative" }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke={C.border} strokeWidth="6" />
                <circle cx="50" cy="50" r="42" fill="none" stroke={pct >= 70 ? C.ok : pct >= 50 ? "#fdcb6e" : C.fail} strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 42 * pct / 100} ${2 * Math.PI * 42}`}
                  strokeLinecap="round" transform="rotate(-90 50 50)" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 24, fontWeight: 700, color: C.white }}>{pct}%</span>
              </div>
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 8px", fontFamily: themes.tara.headingFont, fontStyle: "italic" }}>Exam Complete</h2>
            <p style={{ fontSize: 14, color: C.muted, margin: "0 0 24px" }}>{source} · {correct}/{total} correct</p>

            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 32 }}>
              <div><span style={{ fontSize: 28, fontWeight: 700, color: C.ok }}>{correct}</span><span style={{ fontSize: 12, color: C.muted, marginLeft: 4 }}>correct</span></div>
              <div><span style={{ fontSize: 28, fontWeight: 700, color: C.fail }}>{total - correct}</span><span style={{ fontSize: 12, color: C.muted, marginLeft: 4 }}>incorrect</span></div>
            </div>

            <button onClick={() => router.push(`/practice/${paperId}/review`)} style={{
              width: "100%", padding: "14px 20px", borderRadius: 12, border: "none",
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
              color: C.white, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: themes.tara.font,
              marginBottom: 10,
            }}>View Detailed Review & Walkthroughs</button>

            <button onClick={() => { setPhase("intro"); setMode("tara"); }} style={{
              width: "100%", padding: "12px 20px", borderRadius: 10,
              border: `1px solid ${C.border}`, background: "transparent",
              color: C.muted, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: themes.tara.font,
            }}>Retake Exam</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── EXAM INTERFACE ── */
  const headerColor = mode === "vue" ? t.headerBg : C.card;
  const headerText = mode === "vue" ? "#ffffff" : C.white;

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: t.font }}>
      {/* ── Header bar ── */}
      <div style={{ background: headerColor, borderBottom: `1px solid ${t.border}`, padding: "0", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {mode === "tara" && <span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, borderRadius: 8, padding: "4px 10px", fontSize: 10, fontWeight: 700, color: C.white, letterSpacing: 1 }}>TARA</span>}
            <span style={{ fontSize: 13, fontWeight: 600, color: headerText }}>{title}</span>
            <span style={{ fontSize: 12, color: mode === "vue" ? "#aabbcc" : C.muted }}>{source}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 12, color: mode === "vue" ? "#aabbcc" : C.muted }}>{currentQ + 1} of {total}</span>
            <button onClick={() => setTimerVisible(!timerVisible)} style={{
              background: "transparent", border: "none", cursor: "pointer",
              fontSize: 14, color: isLowTime ? t.fail : headerText,
              fontWeight: 700, fontFamily: t.font, fontVariantNumeric: "tabular-nums",
            }}>
              {timerVisible ? formatTime(timeLeft) : "⏱ Show"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 20px", display: "flex", gap: 20 }}>
        {/* ── Left: Question nav panel ── */}
        <div style={{ width: 200, flexShrink: 0 }}>
          <div style={{
            background: t.card, border: `1px solid ${t.border}`,
            borderRadius: mode === "vue" ? 4 : 14, padding: "16px",
            position: "sticky", top: 60,
          }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: t.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Questions</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
              {questions.map((question, i) => {
                const answered = !!answers[question.displayNum];
                const isFlagged = flagged.has(i);
                const isCurrent = i === currentQ;
                let bg = "transparent";
                let border = t.border;
                let color = t.muted;
                if (isCurrent) { bg = t.accent; border = t.accent; color = "#fff"; }
                else if (answered) { bg = mode === "vue" ? "#e0e8f0" : "rgba(85,239,196,0.12)"; border = mode === "vue" ? "#90b0d0" : C.ok; color = t.text; }
                return (
                  <button key={i} onClick={() => setCurrentQ(i)} style={{
                    width: 32, height: 32, borderRadius: mode === "vue" ? 3 : 8,
                    background: bg, border: `1.5px solid ${border}`, color,
                    fontSize: 11, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: t.font, position: "relative",
                  }}>
                    {question.displayNum}
                    {isFlagged && <span style={{ position: "absolute", top: -3, right: -3, fontSize: 8, color: t.flagColor }}>⚑</span>}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 14, fontSize: 10, color: t.muted, display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: mode === "vue" ? "#e0e8f0" : "rgba(85,239,196,0.12)", border: `1px solid ${mode === "vue" ? "#90b0d0" : C.ok}`, display: "inline-block" }} />
                Answered ({answeredCount})
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: "transparent", border: `1px solid ${t.border}`, display: "inline-block" }} />
                Unanswered ({unansweredCount})
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: t.flagColor, fontSize: 12 }}>⚑</span>
                Flagged ({flagged.size})
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Question content ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Question card */}
          <div style={{
            background: t.card, border: `1px solid ${t.border}`,
            borderRadius: mode === "vue" ? 4 : 16, padding: mode === "vue" ? "24px 28px" : "28px 32px",
            marginBottom: 16,
          }}>
            {/* Question header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Question {currentQ + 1}</span>
                <span style={{ fontSize: 11, color: t.muted }}>({source} Q{q.tsaNum})</span>
              </div>
              <button onClick={toggleFlag} style={{
                padding: "5px 12px", borderRadius: mode === "vue" ? 3 : 8,
                border: `1px solid ${flagged.has(currentQ) ? t.flagColor : t.border}`,
                background: flagged.has(currentQ) ? (mode === "vue" ? "#fff3e0" : "rgba(253,203,110,0.12)") : "transparent",
                color: flagged.has(currentQ) ? t.flagColor : t.muted,
                fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: t.font,
                display: "flex", alignItems: "center", gap: 5,
              }}>
                ⚑ {flagged.has(currentQ) ? "Flagged" : "Flag"}
              </button>
            </div>

            {/* Passage */}
            {q.passage && (
              <div style={{
                background: mode === "vue" ? "#f8f9fa" : C.bg,
                border: `1px solid ${t.border}`, borderRadius: mode === "vue" ? 3 : 12,
                padding: "18px 22px", margin: "0 0 18px",
              }}>
                <p style={{ fontSize: 14, color: t.text, lineHeight: 1.85, margin: 0 }}>{q.passage}</p>
              </div>
            )}

            {/* Question text */}
            <p style={{ fontSize: 14, color: t.text, lineHeight: 1.7, margin: "0 0 20px", fontWeight: 600 }}>{q.text}</p>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {q.options.map(opt => {
                const isSelected = answers[q.displayNum] === opt;
                return (
                  <button key={opt} onClick={() => selectAnswer(opt)} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: mode === "vue" ? "12px 16px" : "12px 16px",
                    borderRadius: mode === "vue" ? 3 : 10,
                    background: isSelected ? t.optionSelectedBg : t.optionBg,
                    border: `1.5px solid ${isSelected ? t.optionSelectedBorder : t.optionBorder}`,
                    cursor: "pointer", fontFamily: t.font, textAlign: "left",
                    transition: "all 0.15s",
                    width: "100%",
                  }}>
                    <span style={{
                      width: mode === "vue" ? 20 : 28, height: mode === "vue" ? 20 : 28,
                      borderRadius: mode === "vue" ? "50%" : 7,
                      background: isSelected ? t.accent : (mode === "vue" ? "#f0f0f0" : C.border),
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700,
                      color: isSelected ? "#fff" : t.muted, flexShrink: 0,
                    }}>{mode === "vue" && isSelected ? "●" : opt}</span>
                    <span style={{ fontSize: 14, color: isSelected ? t.text : t.muted, fontWeight: isSelected ? 600 : 400 }}>
                      Option {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation buttons */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button onClick={goPrev} disabled={currentQ === 0} style={{
              padding: "12px 24px", borderRadius: mode === "vue" ? 4 : 10,
              border: `1px solid ${t.border}`, background: t.card,
              color: t.text, fontSize: 13, fontWeight: 600, cursor: "pointer",
              opacity: currentQ === 0 ? 0.4 : 1, fontFamily: t.font,
            }}>← Previous</button>

            {currentQ < total - 1 ? (
              <button onClick={goNext} style={{
                padding: "12px 24px", borderRadius: mode === "vue" ? 4 : 10, border: "none",
                background: mode === "vue" ? t.accent : `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
                color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: t.font,
              }}>Next →</button>
            ) : (
              <button onClick={() => setPhase("review-screen")} style={{
                padding: "12px 24px", borderRadius: mode === "vue" ? 4 : 10, border: "none",
                background: mode === "vue" ? t.accent : `linear-gradient(135deg, ${t.accent}, ${t.accentLight})`,
                color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: t.font,
              }}>Review & Submit</button>
            )}

            <button onClick={() => setPhase("review-screen")} style={{
              marginLeft: "auto",
              padding: "12px 20px", borderRadius: mode === "vue" ? 4 : 10,
              border: `1px solid ${t.border}`, background: t.card,
              color: t.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: t.font,
            }}>Item Review</button>
          </div>
        </div>
      </div>
    </div>
  );
}