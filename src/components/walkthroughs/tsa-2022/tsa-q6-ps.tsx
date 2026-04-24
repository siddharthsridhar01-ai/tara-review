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
  { id: 1, label: "Setup", title: "Identify What We Know" },
  { id: 2, label: "Solve", title: "Find the Amount of Mixture 2" },
  { id: 3, label: "Verify", title: "Test Each Option" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

function MixtureBar({ apple, orange, label, width, showLabels }) {
  return (
    <div style={{ marginBottom: 8 }}>
      {label && <span style={{ fontSize: 12, color: C.muted, marginBottom: 4, display: "block" }}>{label}</span>}
      <div style={{ display: "flex", height: 28, borderRadius: 6, overflow: "hidden", border: `1px solid ${C.border}`, width: width || "100%" }}>
        <div style={{ width: `${apple}%`, background: "rgba(116,185,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#0f1117" }}>
          {showLabels && `${apple}% apple`}
        </div>
        <div style={{ width: `${orange}%`, background: "rgba(253,203,110,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#0f1117" }}>
          {showLabels && `${orange}% orange`}
        </div>
      </div>
    </div>
  );
}

function AlgebraWalkthrough() {
  const [revealed, setRevealed] = useState(0);

  const steps = [
    {
      label: "Set up variables",
      why: "Let x be the volume of mixture 2 (in litres). Then the volume of mixture 1 is (6 - x) litres, since the total must be 6 litres.",
      math: <span>mixture 1 = (6 - x) litres, mixture 2 = x litres</span>,
      color: C.ps,
    },
    {
      label: "Write the apple juice equation",
      why: "The final mixture must be 50% apple juice, so it needs 3 litres of apple juice in total. Mixture 1 contributes 40% apple juice and mixture 2 contributes 70% apple juice.",
      math: <span>0.4(6 - x) + 0.7x = 3</span>,
      color: C.calc,
    },
    {
      label: "Expand and simplify",
      why: "Multiply out: 0.4 × 6 = 2.4 and 0.4 × x = 0.4x. So we get 2.4 - 0.4x + 0.7x = 3, which simplifies to 2.4 + 0.3x = 3.",
      math: <span>2.4 + 0.3x = 3</span>,
      color: C.calc,
    },
    {
      label: "Solve for x",
      why: "Subtract 2.4 from both sides: 0.3x = 0.6. Divide both sides by 0.3: x = 2.",
      math: <span>0.3x = 0.6, so x = 2</span>,
      color: C.calc,
    },
    {
      label: "Conclusion",
      why: "Rob needs 2 litres of mixture 2 (and therefore 4 litres of mixture 1) to make 6 litres of 50/50 juice.",
      math: null,
      conclusion: "Rob needs 2 litres of mixture 2. The answer is B.",
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

function OptionExplorer() {
  const [selected, setSelected] = useState(null);

  const options = [
    { letter: "A", litres: 1, label: "1 litre" },
    { letter: "B", litres: 2, label: "2 litres" },
    { letter: "C", litres: 3, label: "3 litres" },
    { letter: "D", litres: 4, label: "4 litres" },
    { letter: "E", litres: 5, label: "5 litres" },
  ];

  const calcResult = (mix2Litres) => {
    const mix1Litres = 6 - mix2Litres;
    const appleFromMix1 = 0.4 * mix1Litres;
    const orangeFromMix1 = 0.6 * mix1Litres;
    const appleFromMix2 = 0.7 * mix2Litres;
    const orangeFromMix2 = 0.3 * mix2Litres;
    const totalApple = appleFromMix1 + appleFromMix2;
    const totalOrange = orangeFromMix1 + orangeFromMix2;
    const applePct = (totalApple / 6) * 100;
    const orangePct = (totalOrange / 6) * 100;
    return { mix1Litres, appleFromMix1, orangeFromMix1, appleFromMix2, orangeFromMix2, totalApple, totalOrange, applePct, orangePct };
  };

  const current = selected !== null ? options.find(o => o.letter === selected) : null;
  const result = current ? calcResult(current.litres) : null;

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>How much mixture 2?</span>
        <div style={{ display: "flex", gap: 8 }}>
          {options.map(o => {
            const isSelected = selected === o.letter;
            const r = calcResult(o.litres);
            const isCorrect = Math.abs(r.applePct - 50) < 0.01;
            const wasTried = selected !== null;
            return (
              <button key={o.letter} onClick={() => setSelected(o.letter)} style={{
                flex: 1, padding: "12px 4px", borderRadius: 10, cursor: "pointer",
                border: `2px solid ${isSelected ? C.accent : C.border}`,
                background: isSelected ? C.accent + "15" : C.card,
                transition: "all 0.2s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: isSelected ? C.accent : C.text }}>{o.letter}</span>
                <span style={{ fontSize: 10, color: isSelected ? C.accentLight : C.muted, fontWeight: 600 }}>
                  {o.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {current && result && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18, animation: "fadeSlideIn 0.4s ease-out" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Testing: {current.litres} litre{current.litres !== 1 ? "s" : ""} of mixture 2</span>
            <span style={{ fontSize: 12, color: C.muted }}>{result.mix1Litres} litre{result.mix1Litres !== 1 ? "s" : ""} of mixture 1</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12, color: C.muted, minWidth: 160 }}>Apple from mixture 1</span>
              <span style={{ fontSize: 13, color: C.text }}>40% × {result.mix1Litres}L = <strong style={{ color: C.ps }}>{result.appleFromMix1.toFixed(1)}L</strong></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12, color: C.muted, minWidth: 160 }}>Apple from mixture 2</span>
              <span style={{ fontSize: 13, color: C.text }}>70% × {current.litres}L = <strong style={{ color: C.ps }}>{result.appleFromMix2.toFixed(1)}L</strong></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12, color: C.muted, minWidth: 160 }}>Total apple juice</span>
              <span style={{ fontSize: 13, color: C.text }}>{result.appleFromMix1.toFixed(1)}L + {result.appleFromMix2.toFixed(1)}L = <strong style={{ color: Math.abs(result.applePct - 50) < 0.01 ? C.ok : C.fail }}>{result.totalApple.toFixed(1)}L</strong></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12, color: C.muted, minWidth: 160 }}>Total orange juice</span>
              <span style={{ fontSize: 13, color: C.text }}>{result.orangeFromMix1.toFixed(1)}L + {result.orangeFromMix2.toFixed(1)}L = <strong style={{ color: Math.abs(result.orangePct - 50) < 0.01 ? C.ok : C.fail }}>{result.totalOrange.toFixed(1)}L</strong></span>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: C.muted, marginBottom: 6, display: "block" }}>Resulting mixture composition</span>
            <MixtureBar apple={Math.round(result.applePct)} orange={Math.round(result.orangePct)} showLabels={true} />
          </div>

          {Math.abs(result.applePct - 50) < 0.01 ? (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44` }}>
              <p style={{ margin: 0, fontSize: 13, color: C.ok, lineHeight: 1.6 }}>
                <strong>Perfect!</strong> This gives exactly 50% apple and 50% orange. {current.litres} litres of mixture 2 is correct.
              </p>
            </div>
          ) : (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: C.failBg, border: `1px solid ${C.fail}44` }}>
              <p style={{ margin: 0, fontSize: 13, color: C.fail, lineHeight: 1.6 }}>
                This gives {result.applePct.toFixed(0)}% apple and {result.orangePct.toFixed(0)}% orange. Not a 50/50 split. Try another option.
              </p>
            </div>
          )}
        </div>
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
  { letter: "A", text: "1 litre", ok: false, expl: "With 1L of mixture 2 and 5L of mixture 1: apple = 0.4(5) + 0.7(1) = 2.0 + 0.7 = 2.7L. That is 45% apple, not 50%." },
  { letter: "B", text: "2 litres", ok: true, expl: "With 2L of mixture 2 and 4L of mixture 1: apple = 0.4(4) + 0.7(2) = 1.6 + 1.4 = 3.0L. That is exactly 50% apple and 50% orange." },
  { letter: "C", text: "3 litres", ok: false, expl: "With 3L of mixture 2 and 3L of mixture 1: apple = 0.4(3) + 0.7(3) = 1.2 + 2.1 = 3.3L. That is 55% apple, not 50%." },
  { letter: "D", text: "4 litres", ok: false, expl: "With 4L of mixture 2 and 2L of mixture 1: apple = 0.4(2) + 0.7(4) = 0.8 + 2.8 = 3.6L. That is 60% apple, not 50%." },
  { letter: "E", text: "5 litres", ok: false, expl: "With 5L of mixture 2 and 1L of mixture 1: apple = 0.4(1) + 0.7(5) = 0.4 + 3.5 = 3.9L. That is 65% apple, not 50%." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Mixtures & Ratios</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 6</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 6</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 14px" }}>
                Rob has two different mixtures of apple juice and orange juice.
              </p>
              <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 20px", marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 40, marginBottom: 6 }}>
                  <span style={{ minWidth: 80, fontWeight: 600 }}>mixture 1</span>
                  <span>40% apple juice and 60% orange juice</span>
                </div>
                <div style={{ display: "flex", gap: 40 }}>
                  <span style={{ minWidth: 80, fontWeight: 600 }}>mixture 2</span>
                  <span>70% apple juice and 30% orange juice</span>
                </div>
              </div>
              <p style={{ margin: "0 0 14px" }}>
                Rob wants to use these two mixtures to make 6 litres of a juice mixture which is 50% apple juice and 50% orange juice.
              </p>
              <p style={{ margin: 0 }}>
                <span style={{ color: C.assum, fontWeight: 600 }}>How much of mixture 2 does Rob need to use?</span>
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  This is a mixture problem. We need to combine two mixtures with different concentrations to achieve a target concentration. We can set up a simple linear equation.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>1. What we are given</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 13, color: C.text, minWidth: 100, fontWeight: 600 }}>Mixture 1:</span>
                  <MixtureBar apple={40} orange={60} showLabels={true} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 13, color: C.text, minWidth: 100, fontWeight: 600 }}>Mixture 2:</span>
                  <MixtureBar apple={70} orange={30} showLabels={true} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 13, color: C.ok, minWidth: 100, fontWeight: 600 }}>Target:</span>
                  <MixtureBar apple={50} orange={50} showLabels={true} />
                </div>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>2. Key constraints</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}`, fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                  Total volume: <strong style={{ color: C.white }}>6 litres</strong>
                </div>
                <div style={{ padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}`, fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                  Target apple juice: <strong style={{ color: C.white }}>50% of 6L = 3 litres</strong>
                </div>
                <div style={{ padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}`, fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                  If mixture 2 = x litres, then mixture 1 = <strong style={{ color: C.white }}>(6 - x) litres</strong>
                </div>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>KEY POINT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  Mixture 1 has less apple (40%) than the target (50%), while mixture 2 has more apple (70%). The target sits between the two, so we need to find the right balance.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Solve */}
        {step === 2 && <AlgebraWalkthrough />}

        {/* Step 3: Verify */}
        {step === 3 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>TRY IT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  Select each option to see what mixture it produces. Only one gives exactly 50% apple and 50% orange.
                </p>
              </div>
            </div>
            <OptionExplorer />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>
                "How much of mixture 2 does Rob need to use?"
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Solution summary</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}`, fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                  Mixture 2 = <strong style={{ color: C.ok }}>2 litres</strong> (70% apple, 30% orange)
                </div>
                <div style={{ padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}`, fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                  Mixture 1 = <strong style={{ color: C.white }}>4 litres</strong> (40% apple, 60% orange)
                </div>
                <div style={{ padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}`, fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                  Apple: 0.4 × 4 + 0.7 × 2 = 1.6 + 1.4 = <strong style={{ color: C.ok }}>3.0L (50%)</strong>
                </div>
                <div style={{ padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}`, fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                  Orange: 0.6 × 4 + 0.3 × 2 = 2.4 + 0.6 = <strong style={{ color: C.ok }}>3.0L (50%)</strong>
                </div>
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