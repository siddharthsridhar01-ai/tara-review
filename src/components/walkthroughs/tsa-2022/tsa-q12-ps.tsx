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
  { id: 1, label: "Setup", title: "Identify the Key Information" },
  { id: 2, label: "Solve", title: "Calculate Cost per Day" },
  { id: 3, label: "Verify", title: "Check with Different Approach" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

function AlgebraWalkthrough() {
  const [revealed, setRevealed] = useState(0);

  const steps = [
    {
      label: "Normal shampoo: cost per day",
      why: "The normal shampoo costs 196p for 40 days. Divide cost by number of days.",
      math: <span>196 ÷ 40 = <strong style={{ color: C.ps }}>4.9p per day</strong></span>,
      color: C.ps,
    },
    {
      label: "New brand: find the cost",
      why: "The new brand is 36p cheaper than £1.96 (196p).",
      math: <span>196 - 36 = <strong style={{ color: C.calc }}>160p</strong></span>,
      color: C.calc,
    },
    {
      label: "New brand: cost per day",
      why: "The new brand costs 160p and lasts only 25 days. Divide cost by number of days.",
      math: <span>160 ÷ 25 = <strong style={{ color: C.calc }}>6.4p per day</strong></span>,
      color: C.calc,
    },
    {
      label: "Find the difference",
      why: "The question asks by how many pence per day the normal shampoo is better value. Subtract the normal cost per day from the new brand cost per day.",
      math: <span>6.4 - 4.9 = <strong style={{ color: C.ok }}>1.5p per day</strong></span>,
      conclusion: "The normal shampoo is 1.5p per day better value. The answer is A.",
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
                {s.math && (
                  <div style={{
                    background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10,
                    padding: "12px 18px", fontSize: 17, color: C.white, fontFamily: mathFont,
                    textAlign: "center", letterSpacing: 0.5, lineHeight: 1.8,
                  }}>{s.math}</div>
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

function VerifyExplorer() {
  const [normalCost, setNormalCost] = useState("");
  const [newCost, setNewCost] = useState("");
  const [normalCPD, setNormalCPD] = useState("");
  const [newCPD, setNewCPD] = useState("");
  const [diff, setDiff] = useState("");
  const [checks, setChecks] = useState({ normalCost: null, newCost: null, normalCPD: null, newCPD: null, diff: null });

  const checkNormalCost = () => {
    setChecks(p => ({ ...p, normalCost: normalCost.trim() === "196" }));
  };
  const checkNewCost = () => {
    setChecks(p => ({ ...p, newCost: newCost.trim() === "160" }));
  };
  const checkNormalCPD = () => {
    setChecks(p => ({ ...p, normalCPD: normalCPD.trim() === "4.9" }));
  };
  const checkNewCPD = () => {
    setChecks(p => ({ ...p, newCPD: newCPD.trim() === "6.4" }));
  };
  const checkDiff = () => {
    setChecks(p => ({ ...p, diff: diff.trim() === "1.5" }));
  };

  const allCorrect = checks.normalCost === true && checks.newCost === true && checks.normalCPD === true && checks.newCPD === true && checks.diff === true;

  const inputStyle = (check) => ({
    width: 70, padding: "8px 10px", borderRadius: 8, fontSize: 14, fontWeight: 600, textAlign: "center" as const,
    background: "#1e2030", color: C.white,
    border: `2px solid ${check === null ? C.border : check ? C.ok : C.fail}`,
    outline: "none", fontFamily: mathFont,
  });

  const checkBtnStyle = {
    padding: "8px 14px", borderRadius: 8, border: "none",
    background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
    color: C.white, fontSize: 12, fontWeight: 600, cursor: "pointer",
  };

  const resultBadge = (check) => {
    if (check === null) return null;
    return (
      <span style={{
        fontSize: 12, fontWeight: 700,
        color: check ? C.ok : C.fail,
        marginLeft: 8,
      }}>{check ? "Perfect!" : "Try again"}</span>
    );
  };

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 18 }}>
          <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>TRY IT</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            Work through each calculation yourself. Enter your answers below and check them.
          </p>
        </div>

        {/* Step 1: Normal cost in pence */}
        <div style={{ marginBottom: 16, padding: "14px 16px", borderRadius: 10, background: "#1e2030", border: `1px solid ${C.border}` }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
            <strong style={{ color: C.text }}>1.</strong> The normal shampoo costs £1.96. What is this in pence?
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input value={normalCost} onChange={e => setNormalCost(e.target.value)} placeholder="..." style={inputStyle(checks.normalCost)} />
            <span style={{ fontSize: 13, color: C.muted }}>pence</span>
            <button onClick={checkNormalCost} style={checkBtnStyle}>Check</button>
            {resultBadge(checks.normalCost)}
          </div>
        </div>

        {/* Step 2: New brand cost */}
        <div style={{ marginBottom: 16, padding: "14px 16px", borderRadius: 10, background: "#1e2030", border: `1px solid ${C.border}` }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
            <strong style={{ color: C.text }}>2.</strong> The new brand is 36p cheaper. What does it cost in pence?
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input value={newCost} onChange={e => setNewCost(e.target.value)} placeholder="..." style={inputStyle(checks.newCost)} />
            <span style={{ fontSize: 13, color: C.muted }}>pence</span>
            <button onClick={checkNewCost} style={checkBtnStyle}>Check</button>
            {resultBadge(checks.newCost)}
          </div>
        </div>

        {/* Step 3: Normal cost per day */}
        <div style={{ marginBottom: 16, padding: "14px 16px", borderRadius: 10, background: "#1e2030", border: `1px solid ${C.border}` }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
            <strong style={{ color: C.text }}>3.</strong> Normal shampoo lasts 40 days. What is the cost per day?
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input value={normalCPD} onChange={e => setNormalCPD(e.target.value)} placeholder="..." style={inputStyle(checks.normalCPD)} />
            <span style={{ fontSize: 13, color: C.muted }}>p/day</span>
            <button onClick={checkNormalCPD} style={checkBtnStyle}>Check</button>
            {resultBadge(checks.normalCPD)}
          </div>
        </div>

        {/* Step 4: New brand cost per day */}
        <div style={{ marginBottom: 16, padding: "14px 16px", borderRadius: 10, background: "#1e2030", border: `1px solid ${C.border}` }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
            <strong style={{ color: C.text }}>4.</strong> New brand lasts 25 days. What is the cost per day?
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input value={newCPD} onChange={e => setNewCPD(e.target.value)} placeholder="..." style={inputStyle(checks.newCPD)} />
            <span style={{ fontSize: 13, color: C.muted }}>p/day</span>
            <button onClick={checkNewCPD} style={checkBtnStyle}>Check</button>
            {resultBadge(checks.newCPD)}
          </div>
        </div>

        {/* Step 5: Difference */}
        <div style={{ marginBottom: 16, padding: "14px 16px", borderRadius: 10, background: "#1e2030", border: `1px solid ${C.border}` }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
            <strong style={{ color: C.text }}>5.</strong> By how many pence per day is the normal shampoo better value?
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input value={diff} onChange={e => setDiff(e.target.value)} placeholder="..." style={inputStyle(checks.diff)} />
            <span style={{ fontSize: 13, color: C.muted }}>p/day</span>
            <button onClick={checkDiff} style={checkBtnStyle}>Check</button>
            {resultBadge(checks.diff)}
          </div>
        </div>

        {allCorrect && (
          <div style={{
            marginTop: 14, padding: "10px 14px", borderRadius: 8,
            background: C.conclBg, border: `1px solid ${C.ok}44`,
          }}>
            <p style={{ margin: 0, fontSize: 13, color: C.ok, lineHeight: 1.6 }}>
              <strong>Perfect!</strong> You have confirmed the answer independently. The normal shampoo is 1.5p per day better value than the new brand.
            </p>
          </div>
        )}
      </div>

      {/* Visual comparison bar */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Cost per day comparison</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { name: "Normal shampoo", cpd: 4.9, color: C.ok },
            { name: "New brand", cpd: 6.4, color: C.fail },
          ].map(s => {
            const maxVal = 8;
            const pct = (s.cpd / maxVal) * 100;
            return (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: s.color, minWidth: 120, textAlign: "right" }}>{s.name}</span>
                <div style={{ flex: 1, height: 28, borderRadius: 6, background: C.border + "44", position: "relative", overflow: "hidden" }}>
                  <div style={{
                    width: `${pct}%`, height: "100%", borderRadius: 6,
                    background: `linear-gradient(90deg, ${s.color}66, ${s.color})`,
                    transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8,
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#0f1117" }}>{s.cpd}p/day</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: C.muted }}>Difference:</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.ok }}>1.5p per day</span>
          <span style={{ fontSize: 12, color: C.muted }}>(lower is better)</span>
        </div>
      </div>
    </div>
  );
}

function OptionCard({ o, expanded, animate, onClick }: { o: any, expanded: boolean, animate: boolean, onClick: () => void }) {
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
  { letter: "A", text: "1.5", ok: true, expl: "Normal shampoo costs 196p / 40 days = 4.9p per day. New brand costs 160p / 25 days = 6.4p per day. Difference: 6.4 - 4.9 = 1.5p per day." },
  { letter: "B", text: "2.4", ok: false, expl: "This would require the new brand to cost 7.3p per day (4.9 + 2.4), which does not match 160 / 25 = 6.4p per day." },
  { letter: "C", text: "4.9", ok: false, expl: "4.9p is the cost per day of the normal shampoo, not the difference between the two brands." },
  { letter: "D", text: "6.4", ok: false, expl: "6.4p is the cost per day of the new brand, not the difference between the two brands." },
  { letter: "E", text: "9.5", ok: false, expl: "This might come from incorrectly comparing cost per ml rather than cost per day, or from a calculation error." },
];

export default function App() {
  const [step, setStep] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
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
            <span style={{ fontSize: 12, color: C.ps }}>Value for Money</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 12</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 12</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 14px" }}>
                The shampoo that I normally buy costs £1.96 for a 500 ml bottle and always lasts for 40 days.
              </p>
              <p style={{ margin: "0 0 14px" }}>
                Last month I decided to try a new brand that is 36p cheaper and contains 550 ml. However, because of the amount that I have had to use to wash my hair properly, it has run out after only 25 days.
              </p>
              <p style={{ margin: 0 }}>
                <span style={{ background: C.assumBg, borderRadius: 4, padding: "2px 6px", color: C.assum, fontWeight: 600 }}>Based upon my experience, by how many pence per day is my normal shampoo better value than the new brand?</span>
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>1. Extract the data</span>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
                  <thead>
                    <tr>
                      {["", "Cost", "Volume", "Lasts"].map(h => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: "center", color: C.muted, fontSize: 11, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "10px 14px", fontWeight: 700, color: C.ps, borderBottom: `1px solid ${C.border}` }}>Normal shampoo</td>
                      <td style={{ padding: "10px 14px", textAlign: "center", color: C.text, borderBottom: `1px solid ${C.border}` }}>£1.96 (196p)</td>
                      <td style={{ padding: "10px 14px", textAlign: "center", color: C.text, borderBottom: `1px solid ${C.border}` }}>500 ml</td>
                      <td style={{ padding: "10px 14px", textAlign: "center", color: C.text, borderBottom: `1px solid ${C.border}` }}>40 days</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "10px 14px", fontWeight: 700, color: C.calc, borderBottom: `1px solid ${C.border}` }}>New brand</td>
                      <td style={{ padding: "10px 14px", textAlign: "center", color: C.text, borderBottom: `1px solid ${C.border}` }}>36p cheaper = 160p</td>
                      <td style={{ padding: "10px 14px", textAlign: "center", color: C.text, borderBottom: `1px solid ${C.border}` }}>550 ml</td>
                      <td style={{ padding: "10px 14px", textAlign: "center", color: C.text, borderBottom: `1px solid ${C.border}` }}>25 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>2. Identify the metric</span>
              <p style={{ fontSize: 13.5, color: C.text, lineHeight: 1.7, margin: "0 0 12px" }}>
                The question asks for the difference in <strong style={{ color: C.white }}>pence per day</strong>. The bottle volume (500 ml vs 550 ml) is irrelevant because we already know how many days each bottle lasts. We just need: cost in pence divided by days.
              </p>
              <div style={{
                background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10,
                padding: "12px 18px", fontSize: 17, color: C.white, fontFamily: mathFont,
                textAlign: "center", letterSpacing: 0.5, lineHeight: 1.8,
              }}>
                cost per day = total cost in pence ÷ number of days
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>WATCH OUT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  Do not be distracted by the bottle sizes. The 550 ml bottle sounds like better value because it is bigger and cheaper, but it ran out much faster. The question is about cost per day of use, not cost per ml.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.calcBg, border: `1px solid ${C.calc}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.calc, fontWeight: 700, whiteSpace: "nowrap" }}>METHOD</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  Calculate cost per day for each shampoo, then subtract to find the difference.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Solve */}
        {step === 2 && <AlgebraWalkthrough />}

        {/* Step 3: Verify */}
        {step === 3 && <VerifyExplorer />}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>
                "Based upon my experience, by how many pence per day is my normal shampoo better value than the new brand?"
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Summary of calculation</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.ps, minWidth: 130, textAlign: "right" }}>Normal shampoo</span>
                  <div style={{ flex: 1, height: 28, borderRadius: 6, background: C.border + "44", position: "relative", overflow: "hidden" }}>
                    <div style={{
                      width: `${(4.9 / 8) * 100}%`, height: "100%", borderRadius: 6,
                      background: `linear-gradient(90deg, ${C.ok}66, ${C.ok})`,
                      display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8,
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#0f1117" }}>4.9p/day</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.calc, minWidth: 130, textAlign: "right" }}>New brand</span>
                  <div style={{ flex: 1, height: 28, borderRadius: 6, background: C.border + "44", position: "relative", overflow: "hidden" }}>
                    <div style={{
                      width: `${(6.4 / 8) * 100}%`, height: "100%", borderRadius: 6,
                      background: `linear-gradient(90deg, ${C.fail}66, ${C.fail})`,
                      display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8,
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#0f1117" }}>6.4p/day</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44` }}>
                <p style={{ margin: 0, fontSize: 13, color: C.ok, lineHeight: 1.6 }}>
                  <strong>Difference: 6.4 - 4.9 = 1.5p per day.</strong> The normal shampoo is better value by 1.5 pence per day.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 14 }}>
              <p style={{ color: C.muted, fontSize: 14, margin: 0 }}><strong style={{ color: C.assum }}>Click each option</strong> to see the explanation:</p>
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