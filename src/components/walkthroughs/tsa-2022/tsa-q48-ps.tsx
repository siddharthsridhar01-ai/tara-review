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
  { id: 1, label: "Setup", title: "Set Up the Equations" },
  { id: 2, label: "Solve", title: "Solve for Each Price" },
  { id: 3, label: "Verify", title: "Check with a Different Method" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

/* ── Solve Walkthrough ─────────────────────────────── */
function SolveWalkthrough() {
  const [revealed, setRevealed] = useState(0);

  const steps = [
    {
      label: "Write the three equations",
      why: "Let b = price of a bread roll, a = price of an apple, c = price of a chocolate bar. Translate each friend's purchase into an equation.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span>Hector: 3b + a = 3.50 ... (1)</span>
          <span>Lee: a + 4c = 8.00 ... (2)</span>
          <span>Olga: b + 2c = 3.50 ... (3)</span>
        </div>
      ),
      color: C.ps,
    },
    {
      label: "Express b from equation (3)",
      why: "Rearrange Olga's equation to isolate b.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span>b + 2c = 3.50</span>
          <span><strong>b = 3.50 − 2c</strong></span>
        </div>
      ),
      color: C.calc,
    },
    {
      label: "Substitute into equation (1)",
      why: "Replace b in Hector's equation with (3.50 − 2c).",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span>3(3.50 − 2c) + a = 3.50</span>
          <span>10.50 − 6c + a = 3.50</span>
          <span><strong>a = 6c − 7.00</strong> ... (4)</span>
        </div>
      ),
      color: C.calc,
    },
    {
      label: "Substitute into equation (2)",
      why: "Replace a in Lee's equation with (6c − 7.00).",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span>(6c − 7.00) + 4c = 8.00</span>
          <span>10c − 7.00 = 8.00</span>
          <span>10c = 15.00</span>
          <span><strong>c = $1.50</strong></span>
        </div>
      ),
      color: C.calc,
    },
    {
      label: "Find b and a",
      why: "Substitute c = 1.50 back to find the other prices.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span>b = 3.50 − 2(1.50) = 3.50 − 3.00 = <strong>$0.50</strong></span>
          <span>a = 6(1.50) − 7.00 = 9.00 − 7.00 = <strong>$2.00</strong></span>
        </div>
      ),
      color: C.calc,
    },
    {
      label: "Calculate the total",
      why: "We want 1 bread roll + 1 apple + 1 chocolate bar.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span>b + a + c = 0.50 + 2.00 + 1.50</span>
          <span><strong>= $4.00</strong></span>
        </div>
      ),
      conclusion: "The total cost is $4.00, which is option C.",
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

/* ── Verify: Interactive Price Calculator ─────────────────────────────── */
function VerifySection() {
  const [hInput, setHInput] = useState("");
  const [lInput, setLInput] = useState("");
  const [oInput, setOInput] = useState("");
  const [totalInput, setTotalInput] = useState("");
  const [hChecked, setHChecked] = useState(false);
  const [lChecked, setLChecked] = useState(false);
  const [oChecked, setOChecked] = useState(false);
  const [totalChecked, setTotalChecked] = useState(false);

  const b = 0.50, a = 2.00, c = 1.50;

  const checkH = () => { setHChecked(true); };
  const checkL = () => { setLChecked(true); };
  const checkO = () => { setOChecked(true); };
  const checkTotal = () => { setTotalChecked(true); };

  const hCorrect = parseFloat(hInput) === 3.50;
  const lCorrect = parseFloat(lInput) === 8.00;
  const oCorrect = parseFloat(oInput) === 3.50;
  const totalCorrect = parseFloat(totalInput) === 4.00;

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>TRY IT</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            We found b = $0.50, a = $2.00, c = $1.50. Verify these are correct by checking each friend's total, then compute the final answer.
          </p>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Known prices</span>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 8 }}>
          {[
            { name: "Bread Roll", val: "$0.50", col: "#ef6b6b" },
            { name: "Apple", val: "$2.00", col: "#5b8def" },
            { name: "Choc Bar", val: "$1.50", col: "#55efc4" },
          ].map(v => (
            <div key={v.name} style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 18px", textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: v.col, marginBottom: 4 }}>{v.name}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: mathFont }}>{v.val}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Verify each friend's total</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Hector */}
          <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px" }}>
            <p style={{ fontSize: 13, color: C.text, margin: "0 0 8px" }}>
              <strong style={{ color: "#ef6b6b" }}>Hector:</strong> 3 bread rolls + 1 apple = 3(0.50) + 2.00 = ?
            </p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: C.muted }}>$</span>
              <input
                type="text"
                value={hInput}
                onChange={e => { setHInput(e.target.value); setHChecked(false); }}
                placeholder="—"
                style={{
                  width: 70, padding: "6px 10px", borderRadius: 6, border: `1px solid ${hChecked ? (hCorrect ? C.ok : C.fail) : C.border}`,
                  background: "#0f1117", color: C.white, fontSize: 14, fontFamily: mathFont, outline: "none",
                }}
              />
              <button onClick={checkH} style={{
                padding: "6px 14px", borderRadius: 6, border: "none",
                background: C.accent, color: C.white, fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>Check</button>
              {hChecked && (
                <span style={{ fontSize: 12, fontWeight: 600, color: hCorrect ? C.ok : C.fail }}>
                  {hCorrect ? "Perfect!" : "Should be $3.50"}
                </span>
              )}
            </div>
          </div>

          {/* Lee */}
          <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px" }}>
            <p style={{ fontSize: 13, color: C.text, margin: "0 0 8px" }}>
              <strong style={{ color: "#5b8def" }}>Lee:</strong> 1 apple + 4 chocolate bars = 2.00 + 4(1.50) = ?
            </p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: C.muted }}>$</span>
              <input
                type="text"
                value={lInput}
                onChange={e => { setLInput(e.target.value); setLChecked(false); }}
                placeholder="—"
                style={{
                  width: 70, padding: "6px 10px", borderRadius: 6, border: `1px solid ${lChecked ? (lCorrect ? C.ok : C.fail) : C.border}`,
                  background: "#0f1117", color: C.white, fontSize: 14, fontFamily: mathFont, outline: "none",
                }}
              />
              <button onClick={checkL} style={{
                padding: "6px 14px", borderRadius: 6, border: "none",
                background: C.accent, color: C.white, fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>Check</button>
              {lChecked && (
                <span style={{ fontSize: 12, fontWeight: 600, color: lCorrect ? C.ok : C.fail }}>
                  {lCorrect ? "Perfect!" : "Should be $8.00"}
                </span>
              )}
            </div>
          </div>

          {/* Olga */}
          <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px" }}>
            <p style={{ fontSize: 13, color: C.text, margin: "0 0 8px" }}>
              <strong style={{ color: "#55efc4" }}>Olga:</strong> 1 bread roll + 2 chocolate bars = 0.50 + 2(1.50) = ?
            </p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: C.muted }}>$</span>
              <input
                type="text"
                value={oInput}
                onChange={e => { setOInput(e.target.value); setOChecked(false); }}
                placeholder="—"
                style={{
                  width: 70, padding: "6px 10px", borderRadius: 6, border: `1px solid ${oChecked ? (oCorrect ? C.ok : C.fail) : C.border}`,
                  background: "#0f1117", color: C.white, fontSize: 14, fontFamily: mathFont, outline: "none",
                }}
              />
              <button onClick={checkO} style={{
                padding: "6px 14px", borderRadius: 6, border: "none",
                background: C.accent, color: C.white, fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>Check</button>
              {oChecked && (
                <span style={{ fontSize: 12, fontWeight: 600, color: oCorrect ? C.ok : C.fail }}>
                  {oCorrect ? "Perfect!" : "Should be $3.50"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Your total</span>
        <p style={{ fontSize: 13, color: C.text, margin: "0 0 10px" }}>
          1 bread roll + 1 apple + 1 chocolate bar = ?
        </p>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: C.muted }}>$</span>
          <input
            type="text"
            value={totalInput}
            onChange={e => { setTotalInput(e.target.value); setTotalChecked(false); }}
            placeholder="—"
            style={{
              width: 70, padding: "6px 10px", borderRadius: 6, border: `1px solid ${totalChecked ? (totalCorrect ? C.ok : C.fail) : C.border}`,
              background: "#0f1117", color: C.white, fontSize: 14, fontFamily: mathFont, outline: "none",
            }}
          />
          <button onClick={checkTotal} style={{
            padding: "6px 14px", borderRadius: 6, border: "none",
            background: C.accent, color: C.white, fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>Check</button>
          {totalChecked && (
            <span style={{ fontSize: 12, fontWeight: 600, color: totalCorrect ? C.ok : C.fail }}>
              {totalCorrect ? "Perfect! The answer is $4.00." : "Try again. Add up 0.50 + 2.00 + 1.50."}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Option Card ─────────────────────────────── */
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
            <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, fontSize: 13, lineHeight: 1.6,
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
  { letter: "A", text: "$3.00", ok: false,
    expl: "Bread roll ($0.50) + apple ($2.00) + chocolate bar ($1.50) = $4.00, not $3.00." },
  { letter: "B", text: "$3.50", ok: false,
    expl: "$0.50 + $2.00 + $1.50 = $4.00, not $3.50. This happens to match Hector's and Olga's totals, but those were for different combinations of items." },
  { letter: "C", text: "$4.00", ok: true,
    expl: "Bread roll = $0.50, apple = $2.00, chocolate bar = $1.50. Total = $0.50 + $2.00 + $1.50 = $4.00." },
  { letter: "D", text: "$4.50", ok: false,
    expl: "$0.50 + $2.00 + $1.50 = $4.00, not $4.50." },
  { letter: "E", text: "$5.00", ok: false,
    expl: "$0.50 + $2.00 + $1.50 = $4.00, not $5.00." },
];

/* ═══════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════ */
export default function App() {
  const [step, setStep] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [optAnim, setOptAnim] = useState([false, false, false, false, false]);

  useEffect(() => {
    if (step === 4) {
      [0, 1, 2, 3, 4].forEach(i => {
        setTimeout(() => setOptAnim(p => { const n = [...p]; n[i] = true; return n; }), i * 100);
      });
    } else { setOptAnim([false, false, false, false, false]); setExpanded(null); }
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
            <span style={{ fontSize: 12, color: C.ps }}>Simultaneous Equations</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 48</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 48</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 10px" }}>
                My three friends bought food at the supermarket. When I asked them, they did not remember the prices of the items, only the final amount they paid.
              </p>
              <ul style={{ margin: "0 0 10px", paddingLeft: 20, listStyleType: "disc" }}>
                <li style={{ marginBottom: 4 }}>Hector paid $3.50 for 3 bread rolls and 1 apple.</li>
                <li style={{ marginBottom: 4 }}>Lee paid $8.00 for 1 apple and 4 chocolate bars.</li>
                <li style={{ marginBottom: 4 }}>Olga paid $3.50 for 1 bread roll and 2 chocolate bars.</li>
              </ul>
              <p style={{ margin: "0 0 10px" }}>
                I want to buy 1 bread roll, 1 apple and 1 chocolate bar.
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: C.assum }}>How much do I need to pay?</strong>
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>1. Define variables</span>
              <p style={{ fontSize: 13.5, color: C.text, lineHeight: 1.7, margin: "0 0 14px" }}>
                Let each item have an unknown price:
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {[
                  { name: "Bread Roll", var: "b", col: "#ef6b6b" },
                  { name: "Apple", var: "a", col: "#5b8def" },
                  { name: "Choc Bar", var: "c", col: "#55efc4" },
                ].map(v => (
                  <div key={v.name} style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 20px", textAlign: "center" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: v.col, marginBottom: 4 }}>{v.name}</div>
                    <div style={{ fontSize: 22, fontWeight: 600, color: C.text, fontFamily: mathFont }}>{v.var}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>2. Write the equations</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 12, color: "#ef6b6b", fontWeight: 700, minWidth: 55 }}>Hector</span>
                  <span style={{ fontSize: 14, color: C.text, fontFamily: mathFont }}>3b + a = 3.50</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 12, color: "#5b8def", fontWeight: 700, minWidth: 55 }}>Lee</span>
                  <span style={{ fontSize: 14, color: C.text, fontFamily: mathFont }}>a + 4c = 8.00</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 12, color: "#55efc4", fontWeight: 700, minWidth: 55 }}>Olga</span>
                  <span style={{ fontSize: 14, color: C.text, fontFamily: mathFont }}>b + 2c = 3.50</span>
                </div>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>3. What we need to find</span>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", textAlign: "center" }}>
                <span style={{ fontSize: 17, color: C.white, fontFamily: mathFont }}>b + a + c = ?</span>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  We have 3 equations and 3 unknowns. Use substitution: express one variable from one equation, substitute into the others, and solve step by step.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>KEY POINT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  Olga's equation is the simplest starting point because it has only two variables and small coefficients.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Solve */}
        {step === 2 && <SolveWalkthrough />}

        {/* Step 3: Verify */}
        {step === 3 && <VerifySection />}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>
                "I want to buy 1 bread roll, 1 apple and 1 chocolate bar. How much do I need to pay?"
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
    </div>
  );
}