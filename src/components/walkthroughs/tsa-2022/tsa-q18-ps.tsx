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
  { id: 1, label: "Setup", title: "Identify the Two Options" },
  { id: 2, label: "Solve", title: "Calculate Each Cost" },
  { id: 3, label: "Verify", title: "Check the Answer" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

function AlgebraWalkthrough() {
  const [revealed, setRevealed] = useState(0);

  const steps = [
    {
      label: "Option 1: Ferry",
      why: "Sean drives 38 miles to the terminal and takes the ferry with his car. The ferry ticket is $80 and fuel costs $1.50 per mile for the 38-mile drive.",
      math: (
        <span>
          Ferry cost = $80 + (38 × $1.50) = $80 + $57 = <strong style={{ color: C.ps }}>$137</strong>
        </span>
      ),
      color: C.ps,
    },
    {
      label: "Option 2: Plane + car transport",
      why: "Sean flies for $50 and the seaport company transports his car for $100. He still needs to drive 38 miles to the terminal, so fuel costs apply here too.",
      math: (
        <span>
          Plane cost = $50 + $100 + (38 × $1.50) = $150 + $57 = <strong style={{ color: C.calc }}>$207</strong>
        </span>
      ),
      color: C.calc,
    },
    {
      label: "Find the cheaper option",
      why: "Compare the two totals to identify which option is cheaper.",
      math: (
        <span>
          Ferry: <span style={{ color: C.ps }}>$137</span> &lt; Plane: <span style={{ color: C.calc }}>$207</span>
        </span>
      ),
      color: C.ps,
    },
    {
      label: "Calculate the saving",
      why: "The saving is the difference between the more expensive option and the cheaper option.",
      math: (
        <span>
          Saving = $207 − $137 = <strong style={{ color: C.ok }}>$70</strong>
        </span>
      ),
      conclusion: "Sean saves $70 by taking the ferry. The answer is D.",
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
                  padding: "12px 18px", fontSize: 18, color: C.white, fontFamily: mathFont,
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

function VerifyChecker() {
  const [ferryFuel, setFerryFuel] = useState(null);
  const [ferryTotal, setFerryTotal] = useState(null);
  const [planeFuel, setPlaneFuel] = useState(null);
  const [planeTotal, setPlaneTotal] = useState(null);
  const [saving, setSaving] = useState(null);

  const fuelOptions = [38, 50, 57, 76];
  const ferryTotalOptions = [117, 130, 137, 157];
  const planeTotalOptions = [150, 188, 207, 227];
  const savingOptions = [13, 20, 30, 70, 127];

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 18 }}>
          <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>TRY IT</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            Work through each calculation yourself. Select the correct value at each stage.
          </p>
        </div>

        {/* Step 1: Fuel cost */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: C.text, margin: "0 0 10px", lineHeight: 1.6 }}>
            <strong style={{ color: C.assum }}>Step 1:</strong> What is the fuel cost for driving 38 miles at $1.50 per mile?
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {fuelOptions.map(v => {
              const selected = ferryFuel === v;
              const correct = v === 57;
              const showResult = selected;
              return (
                <button key={v} onClick={() => setFerryFuel(v)} style={{
                  padding: "10px 18px", borderRadius: 10, cursor: "pointer",
                  border: `2px solid ${showResult ? (correct ? C.ok : C.fail) : selected ? C.accent : C.border}`,
                  background: showResult ? (correct ? C.ok + "15" : C.failBg) : C.card,
                  fontSize: 14, fontWeight: 600,
                  color: showResult ? (correct ? C.ok : C.fail) : C.text,
                  transition: "all 0.2s",
                }}>
                  ${v}
                </button>
              );
            })}
          </div>
          {ferryFuel !== null && (
            <p style={{ fontSize: 12, color: ferryFuel === 57 ? C.ok : C.fail, marginTop: 8, lineHeight: 1.5 }}>
              {ferryFuel === 57 ? "Perfect! 38 × $1.50 = $57." : `Not quite. 38 × $1.50 = $57, not $${ferryFuel}.`}
            </p>
          )}
        </div>

        {/* Step 2: Ferry total */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: C.text, margin: "0 0 10px", lineHeight: 1.6 }}>
            <strong style={{ color: C.ps }}>Step 2:</strong> What is the total cost for the ferry option? (Ferry ticket $80 + fuel)
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ferryTotalOptions.map(v => {
              const selected = ferryTotal === v;
              const correct = v === 137;
              const showResult = selected;
              return (
                <button key={v} onClick={() => setFerryTotal(v)} style={{
                  padding: "10px 18px", borderRadius: 10, cursor: "pointer",
                  border: `2px solid ${showResult ? (correct ? C.ok : C.fail) : selected ? C.accent : C.border}`,
                  background: showResult ? (correct ? C.ok + "15" : C.failBg) : C.card,
                  fontSize: 14, fontWeight: 600,
                  color: showResult ? (correct ? C.ok : C.fail) : C.text,
                  transition: "all 0.2s",
                }}>
                  ${v}
                </button>
              );
            })}
          </div>
          {ferryTotal !== null && (
            <p style={{ fontSize: 12, color: ferryTotal === 137 ? C.ok : C.fail, marginTop: 8, lineHeight: 1.5 }}>
              {ferryTotal === 137 ? "Perfect! $80 + $57 = $137." : `Not quite. $80 + $57 = $137, not $${ferryTotal}.`}
            </p>
          )}
        </div>

        {/* Step 3: Plane total */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: C.text, margin: "0 0 10px", lineHeight: 1.6 }}>
            <strong style={{ color: C.calc }}>Step 3:</strong> What is the total cost for the plane option? (Plane $50 + car transport $100 + fuel)
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {planeTotalOptions.map(v => {
              const selected = planeTotal === v;
              const correct = v === 207;
              const showResult = selected;
              return (
                <button key={v} onClick={() => setPlaneTotal(v)} style={{
                  padding: "10px 18px", borderRadius: 10, cursor: "pointer",
                  border: `2px solid ${showResult ? (correct ? C.ok : C.fail) : selected ? C.accent : C.border}`,
                  background: showResult ? (correct ? C.ok + "15" : C.failBg) : C.card,
                  fontSize: 14, fontWeight: 600,
                  color: showResult ? (correct ? C.ok : C.fail) : C.text,
                  transition: "all 0.2s",
                }}>
                  ${v}
                </button>
              );
            })}
          </div>
          {planeTotal !== null && (
            <p style={{ fontSize: 12, color: planeTotal === 207 ? C.ok : C.fail, marginTop: 8, lineHeight: 1.5 }}>
              {planeTotal === 207 ? "Perfect! $50 + $100 + $57 = $207." : `Not quite. $50 + $100 + $57 = $207, not $${planeTotal}.`}
            </p>
          )}
        </div>

        {/* Step 4: Saving */}
        <div style={{ marginBottom: 8 }}>
          <p style={{ fontSize: 13, color: C.text, margin: "0 0 10px", lineHeight: 1.6 }}>
            <strong style={{ color: C.ok }}>Step 4:</strong> How much does Sean save by taking the cheaper option?
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {savingOptions.map(v => {
              const selected = saving === v;
              const correct = v === 70;
              const showResult = selected;
              return (
                <button key={v} onClick={() => setSaving(v)} style={{
                  padding: "10px 18px", borderRadius: 10, cursor: "pointer",
                  border: `2px solid ${showResult ? (correct ? C.ok : C.fail) : selected ? C.accent : C.border}`,
                  background: showResult ? (correct ? C.ok + "15" : C.failBg) : C.card,
                  fontSize: 14, fontWeight: 600,
                  color: showResult ? (correct ? C.ok : C.fail) : C.text,
                  transition: "all 0.2s",
                }}>
                  ${v}
                </button>
              );
            })}
          </div>
          {saving !== null && (
            <div style={{
              marginTop: 10, padding: "10px 14px", borderRadius: 8,
              background: saving === 70 ? C.conclBg : C.failBg,
              border: `1px solid ${saving === 70 ? C.ok + "44" : C.fail + "44"}`,
              fontSize: 13, color: saving === 70 ? C.ok : C.fail, lineHeight: 1.5,
            }}>
              {saving === 70
                ? <span><strong>Perfect!</strong> $207 - $137 = $70. Sean saves $70 by taking the ferry.</span>
                : <span>Not quite. $207 - $137 = $70, not ${saving}.</span>
              }
            </div>
          )}
        </div>
      </div>

      {/* Summary comparison */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Cost comparison</span>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1, background: C.psBg, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.ps}33` }}>
            <div style={{ fontSize: 11, color: C.ps, fontWeight: 700, marginBottom: 8 }}>FERRY OPTION</div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 2 }}>
              Ferry ticket: <strong>$80</strong><br />
              Fuel (38 mi): <strong>$57</strong><br />
              <span style={{ borderTop: `1px solid ${C.border}`, display: "inline-block", paddingTop: 4, marginTop: 4 }}>
                Total: <strong style={{ color: C.ps, fontSize: 16 }}>$137</strong>
              </span>
            </div>
          </div>
          <div style={{ flex: 1, background: C.calcBg, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.calc}33` }}>
            <div style={{ fontSize: 11, color: C.calc, fontWeight: 700, marginBottom: 8 }}>PLANE OPTION</div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 2 }}>
              Plane ticket: <strong>$50</strong><br />
              Car transport: <strong>$100</strong><br />
              Fuel (38 mi): <strong>$57</strong><br />
              <span style={{ borderTop: `1px solid ${C.border}`, display: "inline-block", paddingTop: 4, marginTop: 4 }}>
                Total: <strong style={{ color: C.calc, fontSize: 16 }}>$207</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
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
  { letter: "A", text: "$13", ok: false, expl: "This is not the difference between the two options. Ferry costs $137 and plane costs $207, so the saving is $207 - $137 = $70." },
  { letter: "B", text: "$20", ok: false, expl: "This confuses the ticket price difference ($80 - $50 = $30) or another partial calculation. The full saving is $207 - $137 = $70." },
  { letter: "C", text: "$30", ok: false, expl: "This is the difference between the ferry ticket ($80) and the plane ticket ($50), but it ignores the $100 car transport cost and fuel." },
  { letter: "D", text: "$70", ok: true, expl: "The ferry option costs $80 + $57 = $137. The plane option costs $50 + $100 + $57 = $207. The saving is $207 - $137 = $70." },
  { letter: "E", text: "$127", ok: false, expl: "This might come from incorrectly doubling the fuel cost or another error. The correct saving is $207 - $137 = $70." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Travel Costs</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 18</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 18</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 12px" }}>
                Sean is taking his car to Sunny Island. He lives <strong>38 miles</strong> away from the mainland terminal where the seaport and airport are based. He has researched the travel costs and come up with two possible options. The ferry ticket (car and passenger) is <strong>$80</strong>. Alternatively, a plane ticket is <strong>$50</strong> and the seaport company will transport his car (port to port) for <strong>$100</strong>. Fuel costs are <strong>$1.50 per mile</strong>.
              </p>
              <p style={{ margin: 0, padding: "8px 14px", borderRadius: 8, background: C.assumBg, border: `1px solid ${C.assum}44` }}>
                <span style={{ color: C.assum, fontWeight: 600 }}>How much money will Sean save by taking the cheaper option?</span>
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>1. Identify the given information</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Distance to terminal", value: "38 miles", col: C.white },
                  { label: "Fuel cost", value: "$1.50 per mile", col: C.white },
                  { label: "Ferry ticket (car + passenger)", value: "$80", col: C.ps },
                  { label: "Plane ticket", value: "$50", col: C.calc },
                  { label: "Car transport (port to port)", value: "$100", col: C.calc },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 12, color: C.muted, minWidth: 200 }}>{r.label}</span>
                    <span style={{ fontSize: 13, color: r.col, fontWeight: 600 }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>2. The two options</span>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1, background: C.psBg, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.ps}33` }}>
                  <div style={{ fontSize: 12, color: C.ps, fontWeight: 700, marginBottom: 8 }}>OPTION 1: FERRY</div>
                  <div style={{ fontSize: 13, color: C.text, lineHeight: 1.8 }}>
                    Drive to terminal + ferry ticket<br />
                    Fuel + $80
                  </div>
                </div>
                <div style={{ flex: 1, background: C.calcBg, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.calc}33` }}>
                  <div style={{ fontSize: 12, color: C.calc, fontWeight: 700, marginBottom: 8 }}>OPTION 2: PLANE</div>
                  <div style={{ fontSize: 13, color: C.text, lineHeight: 1.8 }}>
                    Drive to terminal + plane + car transport<br />
                    Fuel + $50 + $100
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  Calculate the total cost for each option separately, including fuel for the 38-mile drive. Then find the difference to determine the saving.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>KEY POINT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  Both options require Sean to drive to the terminal, so fuel costs apply to both. The fuel cost is the same for each option since the distance is the same.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Solve */}
        {step === 2 && <AlgebraWalkthrough />}

        {/* Step 3: Verify */}
        {step === 3 && <VerifyChecker />}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>
                "How much money will Sean save by taking the cheaper option?"
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