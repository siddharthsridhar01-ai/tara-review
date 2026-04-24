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
  { id: 2, label: "Solve", title: "Find Letter Values" },
  { id: 3, label: "Verify", title: "Check With All Options" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

/* ── Solve Walkthrough ─────────────────────────────── */
function SolveWalkthrough() {
  const [revealed, setRevealed] = useState(0);

  const steps = [
    {
      label: "Compare MOAN and MOON",
      why: "Both words share M and O. MOAN has A where MOON has O. Subtracting gives:",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span>MOON - MOAN = 8 - 7 = 1</span>
          <span>(M + O + O + N) - (M + O + A + N) = 1</span>
          <span><strong>O - A = 1</strong></span>
        </div>
      ),
      color: C.ps,
    },
    {
      label: "Compare NOON and MOON",
      why: "Both words share two O's and N. NOON has N where MOON has M. Subtracting gives:",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span>NOON - MOON = 10 - 8 = 2</span>
          <span>(N + O + O + N) - (M + O + O + N) = 2</span>
          <span><strong>N - M = 2</strong></span>
        </div>
      ),
      color: C.ps,
    },
    {
      label: "Express ANNA in terms of known words",
      why: "ANNA = A + N + N + A = 2A + 2N. We can build this from our equations. From NOON: N + O + O + N = 10, so 2N + 2O = 10.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span>ANNA = 2A + 2N</span>
          <span>NOON = 2N + 2O = 10</span>
          <span>So 2N = 10 - 2O</span>
        </div>
      ),
      color: C.calc,
    },
    {
      label: "Use O - A = 1 to substitute",
      why: "From Step 1, O - A = 1, so A = O - 1. Therefore 2A = 2O - 2.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span>ANNA = 2A + 2N</span>
          <span>= (2O - 2) + (10 - 2O)</span>
          <span>= 2O - 2 + 10 - 2O</span>
          <span>= <strong>8</strong></span>
        </div>
      ),
      color: C.calc,
    },
    {
      label: "Conclude",
      why: "The 2O terms cancel perfectly, giving a definite answer regardless of the individual letter values.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ color: C.ok }}>ANNA = <strong>8</strong></span>
        </div>
      ),
      conclusion: "The value of the word ANNA is 8. The answer is C.",
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

/* ── Verify: Option Explorer ─────────────────────────────── */
function VerifyExplorer() {
  const [selectedVal, setSelectedVal] = useState(null);
  const [checked, setChecked] = useState({});

  const presets = [
    { label: "A = 0, N = 4", a: 0, n: 4 },
    { label: "A = 1, N = 3", a: 1, n: 3 },
    { label: "A = 2, N = 2", a: 2, n: 2 },
    { label: "A = 3, N = 1", a: 3, n: 1 },
  ];

  const options = [
    { letter: "A", value: 4 },
    { letter: "B", value: 6 },
    { letter: "C", value: 8 },
    { letter: "D", value: 10 },
    { letter: "E", value: 12 },
  ];

  const handleTest = (val) => {
    setSelectedVal(val);
    const anna = val;
    const isCorrect = anna === 8;
    setChecked(prev => ({ ...prev, [val]: isCorrect }));
  };

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Test each option value for ANNA</span>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: "0 0 14px" }}>
          We know ANNA = 2A + 2N. From the equations: O - A = 1 and NOON = 2N + 2O = 10. Click an option to check whether it is consistent.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {options.map((o) => {
            const wasChecked = checked[o.value] !== undefined;
            const isOk = checked[o.value];
            const isSelected = selectedVal === o.value;
            return (
              <button key={o.letter} onClick={() => handleTest(o.value)} style={{
                padding: "12px 16px", borderRadius: 10, cursor: "pointer", textAlign: "left",
                border: `2px solid ${isSelected ? C.accent : isOk === true ? C.ok + "66" : isOk === false ? C.fail + "33" : C.border}`,
                background: isSelected ? C.accent + "15" : isOk === true ? C.ok + "08" : C.card,
                transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? C.accent : isOk === true ? C.ok : isOk === false ? C.fail : C.muted, flexShrink: 0, width: 20 }}>{o.letter}</span>
                <span style={{ fontSize: 13, color: C.text, flex: 1 }}>ANNA = {o.value}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: isOk === true ? C.ok : isOk === false ? C.fail : C.muted + "66", flexShrink: 0 }}>
                  {wasChecked ? (isOk ? "Perfect! ✓" : "Incorrect ✗") : "—"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedVal !== null && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
          {selectedVal === 8 ? (
            <div style={{
              padding: "10px 14px", borderRadius: 8,
              background: C.conclBg, border: `1px solid ${C.ok}44`,
            }}>
              <p style={{ margin: 0, fontSize: 13, color: C.ok, lineHeight: 1.6 }}>
                <strong>Perfect!</strong> ANNA = 2A + 2N. Since 2A = 2O - 2 and 2N = 10 - 2O, we get ANNA = (2O - 2) + (10 - 2O) = 8. This works for any valid letter values. For example, if A = 1 and N = 3, then ANNA = 2(1) + 2(3) = 8. Checking: MOAN = M + 1 + 1 + 3 and MOON = M + 1 + 1 + 3 + 1, which gives the correct difference of 1.
              </p>
            </div>
          ) : (
            <div style={{
              padding: "10px 14px", borderRadius: 8,
              background: C.failBg, border: `1px solid ${C.fail}44`,
            }}>
              <p style={{ margin: 0, fontSize: 13, color: C.fail, lineHeight: 1.6 }}>
                <strong>Incorrect.</strong> ANNA = 2A + 2N. We showed that O - A = 1 (so A = O - 1) and 2N + 2O = 10 from NOON. Substituting: ANNA = 2(O - 1) + (10 - 2O) = 2O - 2 + 10 - 2O = 8, not {selectedVal}. The O terms always cancel, giving exactly 8.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Interactive: try your own values */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Try different letter assignments</span>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: "0 0 14px" }}>
          Click a valid (A, N) pair below and verify that ANNA always equals 8, regardless of the specific values chosen.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {presets.map((p, idx) => (
            <PresetButton key={idx} preset={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PresetButton({ preset }) {
  const [show, setShow] = useState(false);
  const { a, n } = preset;
  const o = a + 1;
  const m = 10 - 2 * o - n; // from MOAN: M + O + A + N = 7
  const moan = m + o + a + n;
  const moon = m + o + o + n;
  const noon = n + o + o + n;
  const anna = a + n + n + a;

  // Derive M from MOAN = 7: M = 7 - O - A - N
  const mVal = 7 - o - a - n;

  return (
    <div style={{ flex: "1 1 auto" }}>
      <button onClick={() => setShow(!show)} style={{
        padding: "10px 16px", borderRadius: 8, cursor: "pointer",
        border: `1px solid ${show ? C.accent : C.border}`,
        background: show ? C.accent + "15" : "#1e2030",
        color: show ? C.accent : C.text, fontSize: 13, fontWeight: 600,
        width: "100%",
      }}>{preset.label}</button>
      {show && (
        <div style={{ marginTop: 8, padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}`, fontSize: 12, color: C.text, lineHeight: 1.8 }}>
          <div>O = A + 1 = {o}, M = 7 - O - A - N = {mVal}</div>
          <div>MOAN = {mVal} + {o} + {a} + {n} = {moan} {moan === 7 ? "✓" : "✗"}</div>
          <div>MOON = {mVal} + {o} + {o} + {n} = {moon} {moon === 8 ? "✓" : "✗"}</div>
          <div>NOON = {n} + {o} + {o} + {n} = {noon} {noon === 10 ? "✓" : "✗"}</div>
          <div style={{ color: C.ok, fontWeight: 700, marginTop: 4 }}>ANNA = {a} + {n} + {n} + {a} = {anna}</div>
        </div>
      )}
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
  { letter: "A", text: "4", ok: false,
    expl: "ANNA = 2A + 2N. From our equations, this simplifies to 8, not 4. A value of 4 would require A + N = 2, but the constraints from the three words force ANNA = 8." },
  { letter: "B", text: "6", ok: false,
    expl: "ANNA = 2A + 2N = 2(O - 1) + (10 - 2O) = 8, not 6. There is no valid assignment of letter values consistent with the table that gives 6." },
  { letter: "C", text: "8", ok: true,
    expl: "From MOON - MOAN: O - A = 1. From NOON: 2N + 2O = 10. So ANNA = 2A + 2N = (2O - 2) + (10 - 2O) = 8. The answer is confirmed." },
  { letter: "D", text: "10", ok: false,
    expl: "ANNA = 2A + 2N = 8, not 10. A value of 10 would require A + N = 5, but substituting back violates the word value constraints." },
  { letter: "E", text: "12", ok: false,
    expl: "ANNA = 2A + 2N = 8, not 12. A value of 12 would require A + N = 6, which is inconsistent with the given word values." },
];

/* ── Table Component ─────────────────────────────── */
function WordTable() {
  return (
    <table style={{ borderCollapse: "collapse", margin: "14px 0", width: "100%", maxWidth: 300 }}>
      <thead>
        <tr>
          <th style={{ padding: "8px 16px", borderBottom: `2px solid ${C.border}`, fontSize: 14, color: C.muted, fontStyle: "italic", fontWeight: 500, textAlign: "left" }}>word</th>
          <th style={{ padding: "8px 16px", borderBottom: `2px solid ${C.border}`, fontSize: 14, color: C.muted, fontStyle: "italic", fontWeight: 500, textAlign: "center" }}>value</th>
        </tr>
      </thead>
      <tbody>
        {[["MOAN", 7], ["MOON", 8], ["NOON", 10]].map(([word, val]) => (
          <tr key={word}>
            <td style={{ padding: "8px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 14, color: C.text }}>{word}</td>
            <td style={{ padding: "8px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 14, color: C.text, textAlign: "center" }}>{val}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

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
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 14</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 14</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 10px" }}>
                Alex and Anita play a game where they need to form words from letters. The value of each letter is a whole number of points (which can be 0). Alex and Anita earn points by adding together the value of the letters in the words they form.
              </p>
              <p style={{ margin: "0 0 10px" }}>
                The value of the last three words they formed is shown in the table below.
              </p>
              <WordTable />
              <p style={{ margin: "0 0 10px" }}>
                Anita has just formed the word ANNA.
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: C.assum }}>What is the value of the word ANNA?</strong>
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>1. Identify the letters and equations</span>
              <p style={{ fontSize: 13.5, color: C.text, lineHeight: 1.7, margin: "0 0 14px" }}>
                The letters involved are M, O, A, and N. Each word gives us an equation for the sum of its letter values.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { word: "MOAN", eq: "M + O + A + N = 7", color: C.ps },
                  { word: "MOON", eq: "M + O + O + N = 8", color: C.ps },
                  { word: "NOON", eq: "N + O + O + N = 10", color: C.ps },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 12, color: r.color, fontWeight: 700, minWidth: 50 }}>{r.word}</span>
                    <span style={{ fontSize: 15, color: C.text, fontFamily: mathFont }}>{r.eq}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>2. What we need to find</span>
              <p style={{ fontSize: 13.5, color: C.text, lineHeight: 1.7, margin: "0 0 14px" }}>
                We need the value of ANNA:
              </p>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 18px", textAlign: "center" }}>
                <span style={{ fontSize: 17, fontWeight: 600, color: C.calc, fontFamily: mathFont }}>ANNA = A + N + N + A = 2A + 2N</span>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>3. Reference table</span>
              <WordTable />
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  We have 4 unknowns but only 3 equations, so we cannot find each letter individually. Instead, compare words pairwise to find relationships, then combine them to get 2A + 2N directly.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>KEY POINT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  We do not need to know every letter's value. We just need the combination 2A + 2N. Subtracting equations eliminates shared letters.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Solve */}
        {step === 2 && <SolveWalkthrough />}

        {/* Step 3: Verify */}
        {step === 3 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>TRY IT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  Test each answer option and explore different valid letter assignments to confirm that ANNA always equals 8.
                </p>
              </div>
            </div>

            <VerifyExplorer />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>
                "What is the value of the word ANNA?"
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