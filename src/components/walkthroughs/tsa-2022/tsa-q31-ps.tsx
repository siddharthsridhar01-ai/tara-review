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
  { id: 2, label: "Solve", title: "Maximise the Number of Drinks" },
  { id: 3, label: "Verify", title: "Test Each Option" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

function PriceTable({ showPrices = true }) {
  return (
    <div style={{ margin: "14px 0", display: "inline-block" }}>
      <table style={{ borderCollapse: "collapse", fontSize: 14, color: C.text }}>
        <thead>
          <tr>
            <th colSpan={3} style={{ padding: "8px 16px", border: `1px solid ${C.border}`, background: "#1e2030", textAlign: "center", fontStyle: "italic", fontWeight: 600, color: C.white }}>hot drinks</th>
          </tr>
          <tr>
            <th style={{ padding: "8px 16px", border: `1px solid ${C.border}`, background: "#1e2030", textAlign: "center", fontStyle: "italic", color: C.muted }}>tea</th>
            <th style={{ padding: "8px 16px", border: `1px solid ${C.border}`, background: "#1e2030", textAlign: "center", fontStyle: "italic", color: C.muted }}>coffee</th>
            <th style={{ padding: "8px 16px", border: `1px solid ${C.border}`, background: "#1e2030", textAlign: "center", fontStyle: "italic", color: C.muted }}>chocolate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "8px 16px", border: `1px solid ${C.border}`, textAlign: "center", fontFamily: mathFont, color: showPrices ? C.assum : C.text, fontWeight: showPrices ? 600 : 400 }}>£1.50</td>
            <td style={{ padding: "8px 16px", border: `1px solid ${C.border}`, textAlign: "center", fontFamily: mathFont, color: showPrices ? C.assum : C.text, fontWeight: showPrices ? 600 : 400 }}>£2.50</td>
            <td style={{ padding: "8px 16px", border: `1px solid ${C.border}`, textAlign: "center", fontFamily: mathFont, color: showPrices ? C.assum : C.text, fontWeight: showPrices ? 600 : 400 }}>£3.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function SolveWalkthrough() {
  const [revealed, setRevealed] = useState(0);

  const steps = [
    {
      label: "Set up variables",
      why: "Let p be the number of teas (which equals the number of coffees). She must buy at least 1 chocolate. Let c be the number of chocolates (c >= 1).",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 16 }}>
          <span>Total cost: 1.50p + 2.50p + 3.00c = 32.00</span>
          <span>Simplify: 4p + 3c = 32</span>
        </div>
      ),
      after: "We combined the tea and coffee costs: £1.50 + £2.50 = £4.00 per pair.",
      color: C.ps,
    },
    {
      label: "Maximise total drinks",
      why: "Total drinks = p + p + c = 2p + c. To maximise this, we want p as large as possible (since each unit of p adds 2 drinks for £4, while each chocolate adds 1 drink for £3).",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 16 }}>
          <span>From 4p + 3c = 32, rearrange: c = (32 - 4p) / 3</span>
          <span>We need c to be a positive whole number, so (32 - 4p) must be divisible by 3 and positive.</span>
        </div>
      ),
      color: C.calc,
    },
    {
      label: "Find valid values of p",
      why: "Test values of p from high to low. We need 32 - 4p to be a positive multiple of 3.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 15 }}>
          <span>p = 7: 32 - 28 = 4. Not divisible by 3. ✗</span>
          <span>p = 6: 32 - 24 = 8. Not divisible by 3. ✗</span>
          <span style={{ color: C.ok, fontWeight: 600 }}>p = 5: 32 - 20 = 12. 12 / 3 = 4. c = 4. ✓</span>
        </div>
      ),
      after: "With p = 5, we get c = 4. Both constraints are satisfied: p >= 1, c >= 1.",
      color: C.calc,
    },
    {
      label: "Count total drinks",
      why: "With p = 5 teas, p = 5 coffees, and c = 4 chocolates:",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 16 }}>
          <span>Total = 5 + 5 + 4 = <strong style={{ color: C.ok }}>14</strong></span>
          <span style={{ fontSize: 14 }}>Check: 5 × £1.50 + 5 × £2.50 + 4 × £3.00</span>
          <span style={{ fontSize: 14 }}>= £7.50 + £12.50 + £12.00 = £32.00 ✓</span>
        </div>
      ),
      conclusion: "The maximum number of hot drinks is 14. The answer is E.",
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

function OptionExplorer() {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(new Set());

  const options = [
    {
      label: "A", value: 9, total: 9,
      desc: "To get 9 drinks with equal teas and coffees: try p teas, p coffees, and (9 - 2p) chocolates.",
      details: [
        { p: 1, c: 7, cost: "1.50 + 2.50 + 21.00 = 25.00", match: false },
        { p: 2, c: 5, cost: "3.00 + 5.00 + 15.00 = 23.00", match: false },
        { p: 3, c: 3, cost: "4.50 + 7.50 + 9.00 = 21.00", match: false },
        { p: 4, c: 1, cost: "6.00 + 10.00 + 3.00 = 19.00", match: false },
      ],
      possible: false,
      reason: "9 drinks cannot cost £32.00 with any valid split. The maximum cost for 9 drinks is £25.00."
    },
    {
      label: "B", value: 10, total: 10,
      desc: "Try p teas, p coffees, (10 - 2p) chocolates.",
      details: [
        { p: 1, c: 8, cost: "1.50 + 2.50 + 24.00 = 28.00", match: false },
        { p: 2, c: 6, cost: "3.00 + 5.00 + 18.00 = 26.00", match: false },
        { p: 3, c: 4, cost: "4.50 + 7.50 + 12.00 = 24.00", match: false },
        { p: 4, c: 2, cost: "6.00 + 10.00 + 6.00 = 22.00", match: false },
        { p: 5, c: 0, cost: "Needs at least 1 chocolate", match: false },
      ],
      possible: false,
      reason: "10 drinks cannot cost £32.00. None of the splits reach £32."
    },
    {
      label: "C", value: 12, total: 12,
      desc: "Try p teas, p coffees, (12 - 2p) chocolates.",
      details: [
        { p: 2, c: 8, cost: "3.00 + 5.00 + 24.00 = 32.00", match: true },
      ],
      possible: true,
      reason: "Perfect! 2 teas + 2 coffees + 8 chocolates = 12 drinks for exactly £32.00."
    },
    {
      label: "D", value: 13, total: 13,
      desc: "Try p teas, p coffees, (13 - 2p) chocolates.",
      details: [
        { p: 3, c: 7, cost: "4.50 + 7.50 + 21.00 = 33.00", match: false },
        { p: 4, c: 5, cost: "6.00 + 10.00 + 15.00 = 31.00", match: false },
      ],
      possible: false,
      reason: "13 drinks cannot hit exactly £32.00. The costs jump from £31 to £33."
    },
    {
      label: "E", value: 14, total: 14,
      desc: "Try p teas, p coffees, (14 - 2p) chocolates.",
      details: [
        { p: 5, c: 4, cost: "7.50 + 12.50 + 12.00 = 32.00", match: true },
      ],
      possible: true,
      reason: "Perfect! 5 teas + 5 coffees + 4 chocolates = 14 drinks for exactly £32.00."
    },
  ];

  const handleSelect = (idx) => {
    setSelected(idx);
    setChecked(prev => new Set(prev).add(idx));
  };

  const current = selected !== null ? options[selected] : null;

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Test each answer option</span>
        <div style={{ display: "flex", gap: 8 }}>
          {options.map((opt, idx) => {
            const isSelected = selected === idx;
            const wasDone = checked.has(idx);
            const isPossible = opt.possible && wasDone;
            const isImpossible = !opt.possible && wasDone;
            return (
              <button key={idx} onClick={() => handleSelect(idx)} style={{
                flex: 1, padding: "14px 4px", borderRadius: 10, cursor: "pointer",
                border: `2px solid ${isSelected ? C.accent : isPossible ? C.ok + "66" : isImpossible ? C.fail + "66" : C.border}`,
                background: isSelected ? C.accent + "15" : isImpossible ? C.fail + "08" : C.card,
                transition: "all 0.2s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
                <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{opt.label}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: isSelected ? C.accent : isImpossible ? C.fail : C.text, fontFamily: mathFont }}>{opt.value}</span>
                <span style={{ fontSize: 10, color: isPossible ? C.ok : isImpossible ? C.fail : C.muted + "66", fontWeight: 600 }}>
                  {wasDone ? (opt.possible ? "Possible ✓" : "Not £32 ✗") : "—"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {current && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: current.possible ? C.ok : C.fail, fontFamily: mathFont }}>{current.value} drinks</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: current.possible ? C.ok : C.fail }}>
              {current.possible ? "Can cost £32" : "Cannot cost £32"}
            </span>
          </div>

          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, margin: "0 0 12px" }}>{current.desc}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {current.details.map((d, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8,
                background: "#1e2030", border: `1px solid ${d.match ? C.ok + "44" : C.border}`,
              }}>
                <span style={{ fontSize: 13, color: C.text, fontFamily: mathFont, flex: 1 }}>
                  {d.p !== undefined ? `p=${d.p}, c=${d.c}: ${d.cost}` : d.cost}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: d.match ? C.ok : C.fail }}>
                  {d.match ? "= £32 ✓" : "✗"}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            padding: "10px 14px", borderRadius: 8, marginTop: 10,
            background: current.possible ? C.conclBg : C.failBg,
            border: `1px solid ${current.possible ? C.ok : C.fail}44`,
          }}>
            <p style={{ margin: 0, fontSize: 13, color: current.possible ? C.ok : C.fail, lineHeight: 1.6 }}>
              {current.reason}
            </p>
          </div>

          {current.possible && current.value === 14 && (
            <div style={{
              padding: "10px 14px", borderRadius: 8, marginTop: 10,
              background: C.conclBg, border: `1px solid ${C.ok}44`,
            }}>
              <p style={{ margin: 0, fontSize: 13, color: C.ok, lineHeight: 1.6, fontWeight: 600 }}>
                14 is the largest option that works, so the maximum number of drinks is 14.
              </p>
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
  { letter: "A", text: "9", ok: false, expl: "With the constraint that teas = coffees and at least 1 of each, 9 drinks cannot cost £32.00. The most expensive 9-drink combination (1 tea, 1 coffee, 7 chocolates) is only £25.00." },
  { letter: "B", text: "10", ok: false, expl: "No valid split of 10 drinks reaches £32.00. For example, 4 teas + 4 coffees + 2 chocolates = £22.00, and 1 tea + 1 coffee + 8 chocolates = £28.00." },
  { letter: "C", text: "12", ok: false, expl: "12 drinks is possible (2 teas + 2 coffees + 8 chocolates = £32.00), but it is not the maximum." },
  { letter: "D", text: "13", ok: false, expl: "No valid split of 13 drinks totals £32.00. With p teas and p coffees, 4p + 3(13 - 2p) = 39 - 2p, which equals 32 when p = 3.5, not a whole number." },
  { letter: "E", text: "14", ok: true, expl: "5 teas + 5 coffees + 4 chocolates = £7.50 + £12.50 + £12.00 = £32.00 exactly. This is the maximum achievable number of drinks." },
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
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 31</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 31</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 10px" }}>The table shows the cost of hot drinks in a local cafe.</p>
            </div>

            <PriceTable showPrices={false} />

            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "14px 0 10px" }}>Belle bought a number of hot drinks, including at least one of each tea, coffee and chocolate. She was charged £32.00.</p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: C.assum }}>If she bought the same number of teas as coffees, what was the maximum number of hot drinks that Belle could have bought for the £32.00?</strong>
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>What we know</span>

              <PriceTable showPrices={true} />

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>1</span>
                  <span style={{ fontSize: 13, color: C.text }}>At least one of each drink type (tea, coffee, chocolate)</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>2</span>
                  <span style={{ fontSize: 13, color: C.text }}>Number of teas = number of coffees (call this <span style={{ fontFamily: mathFont, color: C.assum }}>p</span>)</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>3</span>
                  <span style={{ fontSize: 13, color: C.text }}>Total cost = £32.00. We want to maximise the total number of drinks.</span>
                </div>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  Each pair of tea + coffee costs £1.50 + £2.50 = £4.00 and adds 2 drinks. Each chocolate costs £3.00 and adds 1 drink. To maximise drinks, we prefer tea/coffee pairs (2 drinks per £4) over chocolates (1 drink per £3). So we try the largest possible value of p first.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.calcBg, border: `1px solid ${C.calc}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.calc, fontWeight: 700, whiteSpace: "nowrap" }}>KEY POINT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  The cost equation is <span style={{ fontFamily: mathFont }}>4p + 3c = 32</span>, where <span style={{ fontFamily: mathFont }}>p</span> is the number of teas (and coffees) and <span style={{ fontFamily: mathFont }}>c</span> is the number of chocolates. Both <span style={{ fontFamily: mathFont }}>p</span> and <span style={{ fontFamily: mathFont }}>c</span> must be positive integers.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.calcBg, border: `1px solid ${C.calc}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.calc, fontWeight: 700, whiteSpace: "nowrap" }}>METHOD</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  Rearranging gives <span style={{ fontFamily: mathFont }}>c = (32 - 4p) / 3</span>. We need <span style={{ fontFamily: mathFont }}>32 - 4p</span> to be a positive multiple of 3. Test values of p from high to low until we find one that works.
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
                  Click each answer option to check whether that many drinks can cost exactly £32.00 with equal numbers of teas and coffees. Can you find the maximum?
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
                "If she bought the same number of teas as coffees, what was the maximum number of hot drinks that Belle could have bought for the £32.00?"
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Valid combinations for £32.00</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { p: 2, c: 8, total: 12, cost: "£3.00 + £5.00 + £24.00 = £32.00" },
                  { p: 5, c: 4, total: 14, cost: "£7.50 + £12.50 + £12.00 = £32.00" },
                  { p: 8, c: 0, total: 16, cost: "Needs c >= 1, invalid" },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 8,
                    background: "#1e2030", border: `1px solid ${row.c >= 1 ? (row.total === 14 ? C.ok + "44" : C.border) : C.fail + "33"}`,
                  }}>
                    <span style={{ fontSize: 13, color: C.text, fontFamily: mathFont, flex: 1 }}>
                      p = {row.p}, c = {row.c}: {row.cost}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: row.c >= 1 ? (row.total === 14 ? C.ok : C.text) : C.fail }}>
                      {row.c >= 1 ? `${row.total} drinks` : "Invalid"}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44` }}>
                <p style={{ margin: 0, fontSize: 13, color: C.ok, lineHeight: 1.6, fontWeight: 600 }}>
                  The maximum valid total is 14 drinks (p = 5, c = 4).
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