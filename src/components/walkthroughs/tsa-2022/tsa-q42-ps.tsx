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
  { id: 1, label: "Setup", title: "Identify the Approach" },
  { id: 2, label: "Solve", title: "Work Through Systematically" },
  { id: 3, label: "Verify", title: "Test Each Option" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

const COINS = [200, 100, 50, 20, 10, 5];

function SolveWalkthrough() {
  const [revealed, setRevealed] = useState(0);

  const steps = [
    {
      label: "Define variables",
      why: "Let the price of one bar of chocolate be P. We use six different coins over two days, always holding exactly two coins at a time.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 15 }}>
          <span>Day 1: Pay with coins A + B, buy 2 bars, get change C + D</span>
          <span>Day 2: Pay with coins C + D, buy 1 bar, get change E + F</span>
          <span>All six coins A, B, C, D, E, F are different</span>
        </div>
      ),
      color: C.ps,
    },
    {
      label: "Set up equations",
      why: "On Day 1, the cost of 2 bars equals the payment minus the change. On Day 2, the cost of 1 bar equals the payment minus the change.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 15 }}>
          <span>Day 1: A + B - (C + D) = 2P</span>
          <span>Day 2: C + D - (E + F) = P</span>
        </div>
      ),
      after: "From Day 2: P = (C + D) - (E + F). Substituting into Day 1: A + B - (C + D) = 2[(C + D) - (E + F)].",
      color: C.ps,
    },
    {
      label: "Derive the key relationship",
      why: "Rearranging: A + B - (C + D) = 2(C + D) - 2(E + F), so A + B + 2(E + F) = 3(C + D).",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 15 }}>
          <span>A + B + 2E + 2F = 3(C + D)</span>
          <span>Also: A + B = 2P + C + D and C + D = P + E + F</span>
        </div>
      ),
      after: "We need six different coins from {200, 100, 50, 20, 10, 5} and P must be positive.",
      color: C.calc,
    },
    {
      label: "Systematic search",
      why: "Try combinations where the initial two coins are the largest (to afford 2 bars plus change). Test: A=200, B=50 (total 250).",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 15 }}>
          <span>Try A=200, B=50, so A+B = 250</span>
          <span>Day 1: 250 - 2P = C + D</span>
          <span>Day 2: (C+D) - P = E + F</span>
          <span>So C + D = 250 - 2P, and E + F = 250 - 3P</span>
        </div>
      ),
      after: "We need C+D and E+F to each be sums of two different remaining coins from {100, 20, 10, 5}.",
      color: C.calc,
    },
    {
      label: "Find valid combinations",
      why: "Remaining coins: {100, 20, 10, 5}. Possible pairs and their sums:",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
          <span>100+20 = 120, 100+10 = 110, 100+5 = 105</span>
          <span>20+10 = 30, 20+5 = 25, 10+5 = 15</span>
          <span style={{ marginTop: 6 }}>Need C+D and E+F from these, using all 4 coins:</span>
          <span>Option 1: C+D=120, E+F=15 → P = (250-120)/2 = 65, check: 120-15=105 not equal to 65 ✗</span>
          <span>Option 2: C+D=110, E+F=25 → P = (250-110)/2 = 70, check: 110-25=85 not equal to 70 ✗</span>
          <span>Option 3: C+D=105, E+F=30 → P = (250-105)/2 = 72.5 ✗ (not whole)</span>
        </div>
      ),
      after: "A=200, B=50 doesn't work. Try other starting pairs.",
      color: C.calc,
    },
    {
      label: "Try A=200, B=20",
      why: "A+B = 220. Remaining coins: {100, 50, 10, 5}. Pairs: 100+50=150, 100+10=110, 100+5=105, 50+10=60, 50+5=55, 10+5=15.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
          <span>C+D = 220 - 2P, E+F = 220 - 3P</span>
          <span>Need two complementary pairs summing to all 4 remaining coins.</span>
          <span style={{ marginTop: 4 }}>Try C+D = 110 (100+10), E+F = 55 (50+5):</span>
          <span>P = (220 - 110)/2 = 55</span>
          <span>Check Day 2: C+D - (E+F) = 110 - 55 = 55 = P ✓</span>
          <span>Check: 220 - 3(55) = 220 - 165 = 55 = E+F ✓</span>
        </div>
      ),
      color: C.calc,
    },
    {
      label: "Confirm the solution",
      why: "All conditions are satisfied:",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
          <span>Start: 200p + 20p = 220p</span>
          <span>Day 1: Buy 2 bars at 55p each = 110p. Change = 110p (100p + 10p) ✓</span>
          <span>Day 2: Pay 100p + 10p = 110p. Buy 1 bar = 55p. Change = 55p (50p + 5p) ✓</span>
          <span>Six coins: 200, 20, 100, 10, 50, 5 — all different ✓</span>
        </div>
      ),
      conclusion: "The price of a bar of chocolate is 55p. The answer is D.",
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
                  padding: "12px 18px", fontSize: 15, color: C.white, fontFamily: mathFont,
                  letterSpacing: 0.3, lineHeight: 1.8,
                }}>{s.math}</div>
                {s.after && <p style={{ margin: "8px 0 0", fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{s.after}</p>}
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
  const [scenario, setScenario] = useState(null);
  const [checked, setChecked] = useState(new Set());

  const prices = [
    {
      value: 15, letter: "A",
      valid: false,
      explanation: "If P=15p, Day 1 costs 30p. Starting coins must sum to at least 30p plus a valid change pair. Day 1: pay with two coins, get 2 coins as change. Day 2: pay with those 2 coins, get 2 coins. Need all 6 coins different. Testing all starting pairs that cover 30p and leave valid change: no combination uses 6 different coins from {200, 100, 50, 20, 10, 5} that satisfies all constraints.",
      detail: null,
    },
    {
      value: 25, letter: "B",
      valid: false,
      explanation: "If P=25p, Day 1 costs 50p, Day 2 costs 25p. Need A+B - (C+D) = 50, C+D - (E+F) = 25, all 6 coins different. No valid assignment of 6 different coins from {200, 100, 50, 20, 10, 5} satisfies these simultaneously.",
      detail: null,
    },
    {
      value: 30, letter: "C",
      valid: false,
      explanation: "If P=30p, Day 1 costs 60p, Day 2 costs 30p. Need A+B - (C+D) = 60, C+D - (E+F) = 30. Testing all possible groupings of 6 different coins: no valid assignment works.",
      detail: null,
    },
    {
      value: 55, letter: "D",
      valid: true,
      explanation: "P=55p works perfectly.",
      detail: {
        start: "200p + 20p = 220p",
        day1: "Buy 2 bars (110p). Change: 220 - 110 = 110p = 100p + 10p",
        day2: "Pay 100p + 10p = 110p. Buy 1 bar (55p). Change: 110 - 55 = 55p = 50p + 5p",
        coins: "200, 20, 100, 10, 50, 5 — all different",
      },
    },
    {
      value: 60, letter: "E",
      valid: false,
      explanation: "If P=60p, Day 1 costs 120p, Day 2 costs 60p. Need A+B - (C+D) = 120, C+D - (E+F) = 60. No valid assignment of 6 different coins works. For example, A+B=200+100=300 gives C+D=180, but no pair of remaining coins sums to 180.",
      detail: null,
    },
  ];

  const handleSelect = (idx) => {
    setScenario(idx);
    setChecked(prev => new Set(prev).add(idx));
  };

  const current = scenario !== null ? prices[scenario] : null;

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Test each price option</span>
        <div style={{ display: "flex", gap: 8 }}>
          {prices.map((p, idx) => {
            const isSelected = scenario === idx;
            const wasDone = checked.has(idx);
            const isValid = p.valid && wasDone;
            const isInvalid = !p.valid && wasDone;
            return (
              <button key={idx} onClick={() => handleSelect(idx)} style={{
                flex: 1, padding: "14px 4px", borderRadius: 10, cursor: "pointer",
                border: `2px solid ${isSelected ? C.accent : isValid ? C.ok + "66" : isInvalid ? C.fail + "66" : C.border}`,
                background: isSelected ? C.accent + "15" : isInvalid ? C.fail + "08" : C.card,
                transition: "all 0.2s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: isSelected ? C.accent : isInvalid ? C.fail : C.text, fontFamily: mathFont }}>{p.value}p</span>
                <span style={{ fontSize: 10, color: isValid ? C.ok : isInvalid ? C.fail : C.muted + "66", fontWeight: 600 }}>
                  {wasDone ? (p.valid ? "Perfect!" : "No valid set ✗") : "—"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {current && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: current.valid ? C.ok : C.fail, fontFamily: mathFont }}>{current.value}p</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: current.valid ? C.ok : C.fail }}>
              {current.valid ? "Valid price" : "Cannot work"}
            </span>
          </div>

          {current.valid ? (
            <div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                <div style={{ padding: "8px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>START</span>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: C.text, fontFamily: mathFont }}>{current.detail.start}</p>
                </div>
                <div style={{ padding: "8px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>DAY 1</span>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: C.text, fontFamily: mathFont }}>{current.detail.day1}</p>
                </div>
                <div style={{ padding: "8px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>DAY 2</span>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: C.text, fontFamily: mathFont }}>{current.detail.day2}</p>
                </div>
              </div>
              <div style={{ padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44` }}>
                <p style={{ margin: 0, fontSize: 13, color: C.ok, lineHeight: 1.6 }}>
                  <strong>All 6 coins are different: {current.detail.coins} ✓</strong>
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: "0 0 10px" }}>
                {current.explanation}
              </p>
              <div style={{ padding: "10px 14px", borderRadius: 8, background: C.failBg, border: `1px solid ${C.fail}44` }}>
                <p style={{ margin: 0, fontSize: 13, color: C.fail, lineHeight: 1.6 }}>
                  No valid combination of 6 different coins satisfies all constraints for P = {current.value}p.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
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
  { letter: "A", text: "15p", ok: false, expl: "No valid set of 6 different coins from {200, 100, 50, 20, 10, 5} can satisfy all the purchase and change constraints with P = 15p." },
  { letter: "B", text: "25p", ok: false, expl: "No valid set of 6 different coins satisfies all constraints with P = 25p. The payment and change amounts don't split into valid coin pairs." },
  { letter: "C", text: "30p", ok: false, expl: "No valid set of 6 different coins satisfies all constraints with P = 30p." },
  { letter: "D", text: "55p", ok: true, expl: "Start with 200p + 20p (220p). Day 1: buy 2 bars for 110p, change is 100p + 10p (110p). Day 2: pay 100p + 10p (110p), buy 1 bar for 55p, change is 50p + 5p (55p). All six coins (200, 20, 100, 10, 50, 5) are different." },
  { letter: "E", text: "60p", ok: false, expl: "No valid set of 6 different coins satisfies all constraints with P = 60p. The required payment and change totals cannot be formed by pairs of remaining coins." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Systematic Testing</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 42</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 42</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 12px" }}>In my currency, there are six types of coin in circulation:</p>
            </div>

            {/* Coins display */}
            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 16, padding: "12px 18px", background: "#1e2030", borderRadius: 10 }}>
              {COINS.map(c => (
                <span key={c} style={{ fontSize: 16, fontWeight: 600, color: C.white, fontFamily: mathFont }}>{c}p</span>
              ))}
            </div>

            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 12px" }}>I start with two coins. I visit a shop and purchase two bars of chocolate and pay using the two coins. My change consists of two coins.</p>
              <p style={{ margin: "0 0 12px" }}>The next day I re-visit the shop and purchase another one bar of chocolate with that change. My new change, again, consists of two coins.</p>
              <p style={{ margin: "0 0 12px" }}>The six coins I possess during these two days are all different. I only have two coins at any particular time. The price of a bar of chocolate does not change.</p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: C.assum }}>What is the price of a bar of chocolate?</strong>
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>What we know</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>1</span>
                  <span style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>Six coin types: 200p, 100p, 50p, 20p, 10p, 5p. All six coins used over two days are different.</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>2</span>
                  <span style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>Day 1: Pay 2 coins, buy 2 bars, receive 2 coins change. Day 2: Pay those 2 coins, buy 1 bar, receive 2 coins change.</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>3</span>
                  <span style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>Let price of one bar = P. Then: (Pair 1) - 2P = (Pair 2), and (Pair 2) - P = (Pair 3).</span>
                </div>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  We need to partition all 6 different coins into 3 pairs (start, Day 1 change, Day 2 change) such that the differences match 2P and P respectively. We can either test the answer options directly, or systematically try starting pairs.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.calcBg, border: `1px solid ${C.calc}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.calc, fontWeight: 700, whiteSpace: "nowrap" }}>KEY POINT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  The starting pair must be the most valuable, since we spend money both days. The three pair sums decrease: Pair 1 {">"} Pair 2 {">"} Pair 3, with differences of 2P and P.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.calcBg, border: `1px solid ${C.calc}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.calc, fontWeight: 700, whiteSpace: "nowrap" }}>METHOD</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  For each way to split 6 coins into 3 ordered pairs, check if the sum differences are in a 2:1 ratio. Alternatively, test each answer option price to see which one allows a valid partition.
                </p>
              </div>
            </div>

            {/* All possible pair sums */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>All possible pair sums</span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                {[
                  [200, 100, 300], [200, 50, 250], [200, 20, 220],
                  [200, 10, 210], [200, 5, 205], [100, 50, 150],
                  [100, 20, 120], [100, 10, 110], [100, 5, 105],
                  [50, 20, 70], [50, 10, 60], [50, 5, 55],
                  [20, 10, 30], [20, 5, 25], [10, 5, 15],
                ].map(([a, b, s], i) => (
                  <div key={i} style={{ padding: "6px 10px", borderRadius: 6, background: "#1e2030", border: `1px solid ${C.border}`, fontSize: 12, color: C.text, fontFamily: mathFont, textAlign: "center" }}>
                    {a}+{b} = {s}
                  </div>
                ))}
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
                  Click each price option below to check whether it allows a valid partition of 6 different coins into 3 pairs satisfying all the purchase constraints.
                </p>
              </div>
            </div>
            <VerifyChecker />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>
                "What is the price of a bar of chocolate?"
              </div>
            </div>

            {/* Solution summary */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Solution summary</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.ps }}>START</span>
                  <span style={{ fontSize: 14, color: C.text, fontFamily: mathFont }}>200p + 20p = 220p</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 12, color: C.muted }}>Pay 110p for 2 bars</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.calc }}>DAY 1</span>
                  <span style={{ fontSize: 14, color: C.text, fontFamily: mathFont }}>Change: 100p + 10p = 110p</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 12, color: C.muted }}>Pay 110p for 1 bar</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.ok }}>DAY 2</span>
                  <span style={{ fontSize: 14, color: C.text, fontFamily: mathFont }}>Change: 50p + 5p = 55p</span>
                </div>
              </div>
              <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44` }}>
                <p style={{ margin: 0, fontSize: 14, color: C.ok, fontWeight: 600 }}>
                  Price per bar = 55p. All six coins (200, 100, 50, 20, 10, 5) are different.
                </p>
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