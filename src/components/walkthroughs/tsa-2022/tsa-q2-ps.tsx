import { useState, useEffect } from "react";

const C = {
  bg: "#0f1117", card: "#1a1d27", border: "#2a2d3a",
  accent: "#6c5ce7", accentLight: "#a29bfe",
  concl: "#55efc4", conclBg: "rgba(85,239,196,0.10)",
  prem: "#74b9ff", premBg: "rgba(116,185,255,0.10)",
  ok: "#55efc4", fail: "#ff7675", failBg: "rgba(255,118,117,0.10)",
  assum: "#fdcb6e", assumBg: "rgba(253,203,110,0.12)",
  text: "#e2e2e8", muted: "#8b8d9a", white: "#fff",
  ps: "#74b9ff", psBg: "rgba(116,185,255,0.10)",
  calc: "#fdcb6e", calcBg: "rgba(253,203,110,0.10)",
};

const mathFont = "'Cambria Math', 'Latin Modern Math', 'STIX Two Math', Georgia, serif";

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Question" },
  { id: 1, label: "Setup", title: "Understand the Rules" },
  { id: 2, label: "Solve", title: "Test Each Round Systematically" },
  { id: 3, label: "Verify", title: "Try It Yourself" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

const scores = [14, 16, 6, 20, 10, 18, 4];
const baseTotal = scores.reduce((a, b) => a + b, 0); // 88

function computeTotal(chosenRound) {
  // chosenRound is 1-indexed (2 through 6)
  const idx = chosenRound - 1;
  let total = 0;
  for (let i = 0; i < 7; i++) {
    if (i === idx) {
      total += scores[i] * 3;
    } else if (i === idx - 1 || i === idx + 1) {
      total += scores[i] * 2;
    } else {
      total += scores[i];
    }
  }
  return total;
}

function ScoreTable({ highlightRound, showMultipliers }) {
  const rounds = [1, 2, 3, 4, 5, 6, 7];
  const idx = highlightRound ? highlightRound - 1 : -1;

  return (
    <div style={{ overflowX: "auto", marginBottom: 8 }}>
      <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 400 }}>
        <thead>
          <tr>
            <td style={{ padding: "8px 12px", fontSize: 13, color: C.muted, fontStyle: "italic", borderBottom: `1px solid ${C.border}` }}>round</td>
            {rounds.map(r => (
              <td key={r} style={{
                padding: "8px 12px", fontSize: 14, fontWeight: 700, textAlign: "center",
                color: highlightRound && (r === highlightRound) ? C.ok : highlightRound && (r === highlightRound - 1 || r === highlightRound + 1) ? C.ps : C.text,
                borderBottom: `1px solid ${C.border}`,
                background: highlightRound && r === highlightRound ? C.conclBg : highlightRound && (r === highlightRound - 1 || r === highlightRound + 1) ? C.psBg : "transparent",
              }}>{r}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "8px 12px", fontSize: 13, color: C.muted, fontStyle: "italic" }}>score</td>
            {scores.map((s, i) => (
              <td key={i} style={{
                padding: "8px 12px", fontSize: 14, fontWeight: 700, textAlign: "center",
                color: highlightRound && (i === idx) ? C.ok : highlightRound && (i === idx - 1 || i === idx + 1) ? C.ps : C.text,
                background: highlightRound && i === idx ? C.conclBg : highlightRound && (i === idx - 1 || i === idx + 1) ? C.psBg : "transparent",
              }}>{s}</td>
            ))}
          </tr>
          {showMultipliers && highlightRound && (
            <tr>
              <td style={{ padding: "6px 12px", fontSize: 11, color: C.muted }}>multiplier</td>
              {scores.map((_, i) => {
                let mult = 1;
                if (i === idx) mult = 3;
                else if (i === idx - 1 || i === idx + 1) mult = 2;
                return (
                  <td key={i} style={{
                    padding: "6px 12px", fontSize: 12, fontWeight: 700, textAlign: "center",
                    color: mult === 3 ? C.ok : mult === 2 ? C.ps : C.muted,
                  }}>{mult === 1 ? "" : "x" + mult}</td>
                );
              })}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function AlgebraWalkthrough() {
  const [revealed, setRevealed] = useState(0);

  const steps = [
    {
      label: "Sum the base scores",
      why: "First, add up all seven round scores without any multipliers.",
      math: <span>14 + 16 + 6 + 20 + 10 + 18 + 4 = <strong>88</strong></span>,
      after: "The base total is 88. The final score of 136 means the bonuses add 136 - 88 = 48 extra points.",
      color: C.ps,
    },
    {
      label: "Express the bonus from choosing round r",
      why: "If you triple round r, you add 2 times that score. If you double the rounds before and after, you add 1 times each of those scores. So the bonus is:",
      math: <span style={{ fontFamily: mathFont }}>bonus = 2 x score(r) + score(r-1) + score(r+1)</span>,
      after: "We need this bonus to equal exactly 48.",
      color: C.calc,
    },
    {
      label: "Test round 2 (option A)",
      why: "Triple round 2 (score 16), double rounds 1 and 3.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span>bonus = 2 x 16 + 14 + 6 = 32 + 20 = <strong style={{ color: C.fail }}>52</strong></span>
          <span style={{ color: C.fail, fontSize: 14 }}>52 does not equal 48. Not this round.</span>
        </div>
      ),
      color: C.fail,
    },
    {
      label: "Test round 3 (option B)",
      why: "Triple round 3 (score 6), double rounds 2 and 4.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span>bonus = 2 x 6 + 16 + 20 = 12 + 36 = <strong style={{ color: C.ok }}>48</strong></span>
          <span style={{ color: C.ok, fontSize: 14 }}>48 equals 48. This works!</span>
        </div>
      ),
      color: C.ok,
    },
    {
      label: "Confirm the total",
      why: "Let us verify: with round 3 tripled, rounds 2 and 4 doubled, all others unchanged.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span>14 + (16 x 2) + (6 x 3) + (20 x 2) + 10 + 18 + 4</span>
          <span>= 14 + 32 + 18 + 40 + 10 + 18 + 4</span>
          <span>= <strong style={{ color: C.ok }}>136</strong> ✓</span>
        </div>
      ),
      conclusion: "The winning team chose to triple round 3. The answer is B.",
      color: C.ok,
    },
  ];

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 16 }}>Step-by-step solution</span>

      {steps.map((s, i) => {
        if (i > revealed) return null;
        return (
          <div key={i} style={{ marginBottom: 20, animation: "fadeSlideIn 0.4s ease-out" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                background: s.color + "22", border: `2px solid ${s.color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: s.color,
              }}>{i + 1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: s.color, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.why}</p>
                <div style={{
                  background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10,
                  padding: "12px 18px", fontSize: 17, color: C.white, fontFamily: mathFont,
                  textAlign: "center", letterSpacing: 0.5, lineHeight: 1.8,
                }}>{s.math}</div>
                {s.after && (
                  <p style={{ margin: "8px 0 0", fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{s.after}</p>
                )}
                {s.conclusion && (
                  <div style={{
                    marginTop: 10, padding: "10px 14px", borderRadius: 8,
                    background: C.conclBg, border: `1px solid ${C.ok}44`,
                    fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5,
                  }}>{s.conclusion}</div>
                )}
              </div>
            </div>
            {i < revealed && i < steps.length - 1 && (
              <div style={{ marginLeft: 14, width: 2, height: 12, background: C.border }} />
            )}
          </div>
        );
      })}

      {revealed < steps.length - 1 && (
        <button onClick={() => setRevealed(p => p + 1)} style={{
          marginTop: 4, padding: "11px 22px", borderRadius: 10, border: "none",
          background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
          color: C.white, fontSize: 13, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8, marginLeft: 42,
          boxShadow: "0 4px 16px rgba(108,92,231,0.25)",
        }}>Reveal next step →</button>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function RoundExplorer() {
  const [selected, setSelected] = useState(null);
  const roundOptions = [2, 3, 4, 5, 6];

  const getBreakdown = (chosenRound) => {
    const idx = chosenRound - 1;
    let parts = [];
    let total = 0;
    for (let i = 0; i < 7; i++) {
      let mult = 1;
      if (i === idx) mult = 3;
      else if (i === idx - 1 || i === idx + 1) mult = 2;
      const val = scores[i] * mult;
      total += val;
      parts.push({ round: i + 1, base: scores[i], mult, result: val });
    }
    return { parts, total };
  };

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>TRY IT</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            Select which round to triple and see the resulting total. Which choice gives a final score of exactly <strong style={{ color: C.ok }}>136</strong>?
          </p>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Choose a round to triple</span>

        <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
          {roundOptions.map(r => {
            const isSelected = selected === r;
            const total = computeTotal(r);
            const isCorrect = total === 136;
            return (
              <button key={r} onClick={() => setSelected(r)} style={{
                padding: "10px 20px", borderRadius: 10, cursor: "pointer",
                border: `2px solid ${isSelected ? (isCorrect ? C.ok : C.fail) : C.border}`,
                background: isSelected ? (isCorrect ? C.conclBg : C.failBg) : "#1e2030",
                color: isSelected ? (isCorrect ? C.ok : C.fail) : C.text,
                fontSize: 14, fontWeight: 700, transition: "all 0.2s",
              }}>Round {r}</button>
            );
          })}
        </div>

        {selected && (() => {
          const { parts, total } = getBreakdown(selected);
          const isCorrect = total === 136;
          return (
            <div style={{ animation: "fadeSlideIn 0.3s ease-out" }}>
              <ScoreTable highlightRound={selected} showMultipliers={true} />

              <div style={{ marginTop: 14, overflowX: "auto" }}>
                <div style={{
                  background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10,
                  padding: "14px 18px", fontFamily: mathFont, fontSize: 15, color: C.white,
                  lineHeight: 2, textAlign: "center",
                }}>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4 }}>
                    {parts.map((p, i) => (
                      <span key={i}>
                        {i > 0 && <span style={{ color: C.muted }}> + </span>}
                        {p.mult > 1 ? (
                          <span style={{ color: p.mult === 3 ? C.ok : C.ps }}>
                            {p.base} x {p.mult}
                          </span>
                        ) : (
                          <span>{p.base}</span>
                        )}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <span style={{ color: C.muted }}>= </span>
                    {parts.map((p, i) => (
                      <span key={i}>
                        {i > 0 && <span style={{ color: C.muted }}> + </span>}
                        <span style={{ color: p.mult > 1 ? (p.mult === 3 ? C.ok : C.ps) : C.text }}>{p.result}</span>
                      </span>
                    ))}
                    <span style={{ color: C.muted }}> = </span>
                    <strong style={{ color: isCorrect ? C.ok : C.fail, fontSize: 18 }}>{total}</strong>
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: 12, padding: "10px 14px", borderRadius: 8,
                background: isCorrect ? C.conclBg : C.failBg,
                border: `1px solid ${isCorrect ? C.ok + "44" : C.fail + "44"}`,
              }}>
                <p style={{ margin: 0, fontSize: 13, color: isCorrect ? C.ok : C.fail, lineHeight: 1.6 }}>
                  {isCorrect ? (
                    <span><strong>Perfect!</strong> Tripling round {selected} gives exactly 136. This is the correct choice.</span>
                  ) : (
                    <span>Total is {total}, which is {total > 136 ? "too high" : "too low"} by {Math.abs(total - 136)}. The target is 136.</span>
                  )}
                </p>
              </div>
            </div>
          );
        })()}

        {!selected && (
          <div style={{ textAlign: "center", padding: "20px 0", color: C.muted, fontSize: 13 }}>
            Select a round above to see the calculation.
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function OptionCard({ o, expanded, animate, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: C.card, border: `1px solid ${expanded ? (o.ok ? C.ok + "66" : C.fail + "66") : C.border}`,
      borderRadius: 12, padding: "14px 18px", cursor: "pointer", transition: "all 0.3s",
      opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(12px)",
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{
          background: expanded ? (o.ok ? C.ok : C.fail) : C.accent,
          borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: C.white, flexShrink: 0,
        }}>{expanded ? (o.ok ? "✓" : "✗") : o.letter}</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.6 }}>{o.text}</p>
          {expanded && (
            <div style={{
              marginTop: 10, padding: "10px 14px", borderRadius: 8, fontSize: 13, lineHeight: 1.6,
              background: o.ok ? C.conclBg : C.failBg, color: o.ok ? C.ok : C.fail,
              borderLeft: `3px solid ${o.ok ? C.ok : C.fail}`,
            }}>
              {o.ok ? <span style={{ fontWeight: 700 }}>CORRECT: </span> : <span style={{ fontWeight: 700 }}>INCORRECT: </span>}
              {o.expl}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const opts = [
  { letter: "A", text: "round 2", ok: false, expl: "Tripling round 2 gives: 14 x 2 + 16 x 3 + 6 x 2 + 20 + 10 + 18 + 4 = 28 + 48 + 12 + 52 = 140. This overshoots the target of 136." },
  { letter: "B", text: "round 3", ok: true, expl: "Tripling round 3 gives: 14 + 16 x 2 + 6 x 3 + 20 x 2 + 10 + 18 + 4 = 14 + 32 + 18 + 40 + 10 + 18 + 4 = 136. This matches exactly." },
  { letter: "C", text: "round 4", ok: false, expl: "Tripling round 4 gives: 14 + 16 + 6 x 2 + 20 x 3 + 10 x 2 + 18 + 4 = 14 + 16 + 12 + 60 + 20 + 18 + 4 = 144. This is too high by 8." },
  { letter: "D", text: "round 5", ok: false, expl: "Tripling round 5 gives: 14 + 16 + 6 + 20 x 2 + 10 x 3 + 18 x 2 + 4 = 14 + 16 + 6 + 40 + 30 + 36 + 4 = 146. This is too high by 10." },
  { letter: "E", text: "round 6", ok: false, expl: "Tripling round 6 gives: 14 + 16 + 6 + 20 + 10 x 2 + 18 x 3 + 4 x 2 = 14 + 16 + 6 + 20 + 20 + 54 + 8 = 138. This is too high by 2." },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [optAnim, setOptAnim] = useState([false, false, false, false, false]);

  useEffect(() => {
    if (step === 4) {
      [0, 1, 2, 3, 4].forEach(i => {
        setTimeout(() => setOptAnim(p => { const n = [...p]; n[i] = true; return n; }), i * 100);
      });
    } else {
      setOptAnim([false, false, false, false, false]);
      setExpanded(null);
    }
  }, [step]);

  const lastStep = stepsMeta.length - 1;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif", letterSpacing: 0.2, padding: "24px 16px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: 1 }}>TARA</span>
            <span style={{ fontSize: 12, color: C.muted }}>Problem Solving</span>
            <span style={{ fontSize: 12, color: C.muted }}>·</span>
            <span style={{ fontSize: 12, color: C.ps }}>Systematic Testing</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 2</p>
        </div>

        {/* Step nav */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {stepsMeta.map(s => (
            <button key={s.id} onClick={() => setStep(s.id)} style={{
              flex: 1, minWidth: 0,
              background: step === s.id ? C.accent : step > s.id ? "rgba(108,92,231,0.15)" : "#1e2030",
              border: `1px solid ${step === s.id ? C.accent : step > s.id ? C.accent + "44" : C.border}`,
              borderRadius: 10, padding: "10px 4px", cursor: "pointer", transition: "all 0.3s",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted, lineHeight: 1 }}>{s.id + 1}</span>
              <span style={{ fontSize: 10, fontWeight: step === s.id ? 700 : 500, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted, whiteSpace: "nowrap" }}>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Step title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ background: C.accent, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.white }}>{step + 1}</span>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.white, margin: 0 }}>{stepsMeta[step].title}</h2>
        </div>

        {/* Step 0: Read */}
        {step === 0 && (
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 2</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 14px" }}>
                A quiz consists of 7 rounds, each of which contains 20 questions. Each question is worth one point. At the end of the quiz, but before any of the answers or scores are revealed, each team is allowed to select one of the rounds and the score for that round is tripled. In addition, the scores for the rounds immediately before and after the chosen round are doubled. The winning team at last week's quiz had the following scores in each of the rounds.
              </p>

              <div style={{ overflowX: "auto", marginBottom: 14 }}>
                <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 400 }}>
                  <thead>
                    <tr>
                      <td style={{ padding: "8px 12px", fontSize: 13, color: C.muted, fontStyle: "italic", borderBottom: `1px solid ${C.border}` }}>round</td>
                      {[1, 2, 3, 4, 5, 6, 7].map(r => (
                        <td key={r} style={{ padding: "8px 12px", fontSize: 14, fontWeight: 700, textAlign: "center", color: C.text, borderBottom: `1px solid ${C.border}` }}>{r}</td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "8px 12px", fontSize: 13, color: C.muted, fontStyle: "italic" }}>score</td>
                      {scores.map((s, i) => (
                        <td key={i} style={{ padding: "8px 12px", fontSize: 14, fontWeight: 700, textAlign: "center", color: C.text }}>{s}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <p style={{ margin: "0 0 10px" }}>
                The winning team's final score was 136.
              </p>
              <p style={{ margin: 0 }}>
                <span style={{ color: C.assum, fontWeight: 600 }}>Which round did the winning team choose to have the score tripled?</span>
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>What we know</span>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>1</span>
                  <span style={{ fontSize: 13, color: C.text }}>Seven rounds with scores: 14, 16, 6, 20, 10, 18, 4</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>2</span>
                  <span style={{ fontSize: 13, color: C.text }}>The chosen round's score is tripled (x3)</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>3</span>
                  <span style={{ fontSize: 13, color: C.text }}>The rounds immediately before and after the chosen round are doubled (x2)</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>4</span>
                  <span style={{ fontSize: 13, color: C.text }}>The final score was 136. We need to find which round was tripled.</span>
                </div>
              </div>

              <ScoreTable />
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  First calculate the base total (no bonuses). Then work out how many extra points the bonuses must contribute. Finally, test each option to see which round produces the right bonus.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.calcBg, border: `1px solid ${C.calc}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.calc, fontWeight: 700, whiteSpace: "nowrap" }}>KEY POINT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  The options only include rounds 2 through 6. This makes sense: round 1 has no "before" round, and round 7 has no "after" round, so the question only offers middle rounds as choices.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.calcBg, border: `1px solid ${C.calc}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.calc, fontWeight: 700, whiteSpace: "nowrap" }}>METHOD</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  If we choose round r, the bonus is: 2 x score(r) + score(r-1) + score(r+1). The tripled round contributes 2 extra copies of its score, and each doubled neighbour contributes 1 extra copy. We need this bonus to equal 136 - 88 = 48.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Solve */}
        {step === 2 && <AlgebraWalkthrough />}

        {/* Step 3: Verify */}
        {step === 3 && <RoundExplorer />}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>
                "Which round did the winning team choose to have the score tripled?"
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Summary of all options</span>
              <div style={{ overflowX: "auto" }}>
                <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 360 }}>
                  <thead>
                    <tr>
                      <td style={{ padding: "8px 12px", fontSize: 12, color: C.muted, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>Round tripled</td>
                      <td style={{ padding: "8px 12px", fontSize: 12, color: C.muted, fontWeight: 600, borderBottom: `1px solid ${C.border}`, textAlign: "center" }}>Bonus</td>
                      <td style={{ padding: "8px 12px", fontSize: 12, color: C.muted, fontWeight: 600, borderBottom: `1px solid ${C.border}`, textAlign: "center" }}>Total</td>
                      <td style={{ padding: "8px 12px", fontSize: 12, color: C.muted, fontWeight: 600, borderBottom: `1px solid ${C.border}`, textAlign: "center" }}>Match?</td>
                    </tr>
                  </thead>
                  <tbody>
                    {[2, 3, 4, 5, 6].map(r => {
                      const total = computeTotal(r);
                      const bonus = total - 88;
                      const match = total === 136;
                      return (
                        <tr key={r}>
                          <td style={{ padding: "8px 12px", fontSize: 14, color: C.text }}>Round {r}</td>
                          <td style={{ padding: "8px 12px", fontSize: 14, color: C.text, textAlign: "center", fontFamily: mathFont }}>{bonus}</td>
                          <td style={{ padding: "8px 12px", fontSize: 14, fontWeight: 700, textAlign: "center", color: match ? C.ok : C.text, fontFamily: mathFont }}>{total}</td>
                          <td style={{ padding: "8px 12px", fontSize: 14, fontWeight: 700, textAlign: "center", color: match ? C.ok : C.fail }}>{match ? "✓" : "✗"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 14 }}>
              <p style={{ color: C.muted, fontSize: 14, margin: 0 }}><strong style={{ color: C.assum }}>Click each option</strong> to see the reasoning:</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {opts.map((o, i) => (
                <OptionCard key={o.letter} o={o} expanded={expanded === o.letter} animate={optAnim[i]} onClick={() => setExpanded(p => p === o.letter ? null : o.letter)} />
              ))}
            </div>
          </>
        )}

        {/* Nav buttons */}
        <div style={{ display: "flex", gap: 12, paddingBottom: 32 }}>
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{
            flex: 1, padding: "13px 20px", borderRadius: 10, border: `1px solid ${C.border}`,
            background: step === 0 ? C.card : "#1e2030",
            color: step === 0 ? C.muted : C.text, fontSize: 14, fontWeight: 600,
            cursor: step === 0 ? "not-allowed" : "pointer", opacity: step === 0 ? 0.4 : 1,
          }}>← Previous</button>
          {step < lastStep ? (
            <button onClick={() => setStep(step + 1)} style={{
              flex: 1, padding: "13px 20px", borderRadius: 10, border: "none",
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
              color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>Next →</button>
          ) : (
            <button onClick={() => {}} style={{
              flex: 1, padding: "13px 20px", borderRadius: 10, border: "none",
              background: `linear-gradient(135deg, ${C.ok}, #2ecc71)`,
              color: C.white, fontSize: 14, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>✓ Back to Question Review</button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}