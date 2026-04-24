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
  { id: 1, label: "Setup", title: "Identify the Criteria" },
  { id: 2, label: "Solve", title: "Evaluate Each Cottage" },
  { id: 3, label: "Verify", title: "Check Each Option" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

const cottages = [
  { name: "Acorns", bedrooms: 3, garden: "no", wifi: "yes", parking: "no", pets: "yes", distance: "2 km", distNum: 2, cost: "$460", costNum: 460 },
  { name: "Beeches", bedrooms: 3, garden: "yes", wifi: "yes", parking: "no", pets: "yes", distance: "1 km", distNum: 1, cost: "$490", costNum: 490 },
  { name: "Chestnuts", bedrooms: 4, garden: "no", wifi: "yes", parking: "yes", pets: "no", distance: "2 km", distNum: 2, cost: "$510", costNum: 510 },
  { name: "Denders", bedrooms: 4, garden: "yes", wifi: "yes", parking: "yes", pets: "no", distance: "4 km", distNum: 4, cost: "$500", costNum: 500 },
  { name: "Eglers", bedrooms: 2, garden: "no", wifi: "yes", parking: "yes", pets: "no", distance: "2 km", distNum: 2, cost: "$450", costNum: 450 },
];

const wishes = ["large garden", "wifi", "parking", "within 3 km of a store"];

function getWishCount(c) {
  let count = 0;
  if (c.garden === "yes") count++;
  if (c.wifi === "yes") count++;
  if (c.parking === "yes") count++;
  if (c.distNum <= 3) count++;
  return count;
}

function CottageTable({ highlightRow, showWishCount, showEligible }) {
  const headers = ["cottage", "number of bedrooms", "large garden", "wifi", "parking", "pets allowed", "distance to nearest store", "cost per week"];
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: "8px 6px", textAlign: "left", color: C.muted, fontSize: 11, fontWeight: 600, borderBottom: `1px solid ${C.border}`, fontStyle: i === 0 ? "italic" : "normal", whiteSpace: "nowrap" }}>{h}</th>
            ))}
            {showWishCount && <th style={{ padding: "8px 6px", textAlign: "center", color: C.assum, fontSize: 11, fontWeight: 600, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>wishes met</th>}
            {showEligible && <th style={{ padding: "8px 6px", textAlign: "center", color: C.ok, fontSize: 11, fontWeight: 600, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" }}>eligible?</th>}
          </tr>
        </thead>
        <tbody>
          {cottages.map((c, i) => {
            const isHL = highlightRow === i;
            const wc = getWishCount(c);
            const has3bed = c.bedrooms >= 3;
            const eligible = has3bed && wc >= 3;
            return (
              <tr key={i} style={{ background: isHL ? C.accent + "12" : "transparent" }}>
                <td style={{ padding: "7px 6px", borderBottom: `1px solid ${C.border}22`, color: C.text, fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: "7px 6px", borderBottom: `1px solid ${C.border}22`, color: C.text, textAlign: "center" }}>{c.bedrooms}</td>
                <td style={{ padding: "7px 6px", borderBottom: `1px solid ${C.border}22`, color: c.garden === "yes" ? C.ok : C.muted }}>{c.garden}</td>
                <td style={{ padding: "7px 6px", borderBottom: `1px solid ${C.border}22`, color: c.wifi === "yes" ? C.ok : C.muted }}>{c.wifi}</td>
                <td style={{ padding: "7px 6px", borderBottom: `1px solid ${C.border}22`, color: c.parking === "yes" ? C.ok : C.muted }}>{c.parking}</td>
                <td style={{ padding: "7px 6px", borderBottom: `1px solid ${C.border}22`, color: c.pets === "yes" ? C.ok : C.muted }}>{c.pets}</td>
                <td style={{ padding: "7px 6px", borderBottom: `1px solid ${C.border}22`, color: c.distNum <= 3 ? C.ok : C.fail }}>{c.distance}</td>
                <td style={{ padding: "7px 6px", borderBottom: `1px solid ${C.border}22`, color: C.text }}>{c.cost}</td>
                {showWishCount && <td style={{ padding: "7px 6px", borderBottom: `1px solid ${C.border}22`, textAlign: "center", color: wc >= 3 ? C.ok : C.fail, fontWeight: 700 }}>{wc}/4</td>}
                {showEligible && <td style={{ padding: "7px 6px", borderBottom: `1px solid ${C.border}22`, textAlign: "center", color: eligible ? C.ok : C.fail, fontWeight: 700 }}>{eligible ? "✓" : "✗"}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SolveWalkthrough() {
  const [revealed, setRevealed] = useState(0);

  const steps = [
    {
      label: "Apply the must-have: at least 3 bedrooms",
      why: "The cottage must have at least three bedrooms. This is non-negotiable.",
      math: (
        <div style={{ textAlign: "left", fontSize: 14 }}>
          <div style={{ color: C.ok, marginBottom: 4 }}>Acorns: 3 bedrooms ✓</div>
          <div style={{ color: C.ok, marginBottom: 4 }}>Beeches: 3 bedrooms ✓</div>
          <div style={{ color: C.ok, marginBottom: 4 }}>Chestnuts: 4 bedrooms ✓</div>
          <div style={{ color: C.ok, marginBottom: 4 }}>Denders: 4 bedrooms ✓</div>
          <div style={{ color: C.fail }}>Eglers: 2 bedrooms ✗ (eliminated)</div>
        </div>
      ),
      color: C.ps,
    },
    {
      label: "Count the other wishes for each remaining cottage",
      why: "The four other wishes are: large garden, wifi, parking, within 3 km of a store. The cottage needs at least 3 of these 4.",
      math: (
        <div style={{ textAlign: "left", fontSize: 14 }}>
          <div style={{ marginBottom: 6 }}><strong style={{ color: C.text }}>Acorns:</strong> <span style={{ color: C.fail }}>no garden</span>, <span style={{ color: C.ok }}>wifi</span>, <span style={{ color: C.fail }}>no parking</span>, <span style={{ color: C.ok }}>2 km ≤ 3</span> = <strong style={{ color: C.fail }}>2/4</strong></div>
          <div style={{ marginBottom: 6 }}><strong style={{ color: C.text }}>Beeches:</strong> <span style={{ color: C.ok }}>garden</span>, <span style={{ color: C.ok }}>wifi</span>, <span style={{ color: C.fail }}>no parking</span>, <span style={{ color: C.ok }}>1 km ≤ 3</span> = <strong style={{ color: C.ok }}>3/4</strong></div>
          <div style={{ marginBottom: 6 }}><strong style={{ color: C.text }}>Chestnuts:</strong> <span style={{ color: C.fail }}>no garden</span>, <span style={{ color: C.ok }}>wifi</span>, <span style={{ color: C.ok }}>parking</span>, <span style={{ color: C.ok }}>2 km ≤ 3</span> = <strong style={{ color: C.ok }}>3/4</strong></div>
          <div><strong style={{ color: C.text }}>Denders:</strong> <span style={{ color: C.ok }}>garden</span>, <span style={{ color: C.ok }}>wifi</span>, <span style={{ color: C.ok }}>parking</span>, <span style={{ color: C.fail }}>4 km > 3</span> = <strong style={{ color: C.ok }}>3/4</strong></div>
        </div>
      ),
      color: C.assum,
    },
    {
      label: "Eliminate cottages that fail the wish threshold",
      why: "Acorns only meets 2 of the 4 other wishes, which is fewer than 3. It is eliminated.",
      math: (
        <div style={{ textAlign: "left", fontSize: 14 }}>
          <div style={{ color: C.fail, marginBottom: 4 }}>Acorns: 2/4 wishes ✗ (eliminated)</div>
          <div style={{ color: C.ok, marginBottom: 4 }}>Beeches: 3/4 wishes ✓ (suitable)</div>
          <div style={{ color: C.ok, marginBottom: 4 }}>Chestnuts: 3/4 wishes ✓ (suitable)</div>
          <div style={{ color: C.ok }}>Denders: 3/4 wishes ✓ (suitable)</div>
        </div>
      ),
      color: C.ps,
    },
    {
      label: "Choose the cheapest among suitable cottages",
      why: "Three cottages are suitable. When more than one cottage qualifies, they choose the cheapest.",
      math: (
        <div style={{ textAlign: "left", fontSize: 14 }}>
          <div style={{ marginBottom: 4 }}><strong style={{ color: C.ok }}>Beeches: $490</strong></div>
          <div style={{ marginBottom: 4, color: C.muted }}>Denders: $500</div>
          <div style={{ color: C.muted }}>Chestnuts: $510</div>
        </div>
      ),
      conclusion: "Beeches is the cheapest suitable cottage at $490. The answer is B.",
      color: C.ok,
    },
  ];

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 16 }}>Step-by-step evaluation</span>

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
                  padding: "12px 18px", color: C.white, lineHeight: 1.8,
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

function CottageChecker() {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(new Set());

  const cottageChecks = cottages.map((c, idx) => {
    const has3bed = c.bedrooms >= 3;
    const wc = getWishCount(c);
    const eligible = has3bed && wc >= 3;
    const wishDetails = [
      { wish: "Large garden", met: c.garden === "yes" },
      { wish: "Wifi", met: c.wifi === "yes" },
      { wish: "Parking", met: c.parking === "yes" },
      { wish: "Within 3 km", met: c.distNum <= 3 },
    ];
    return { ...c, idx, has3bed, wc, eligible, wishDetails };
  });

  const handleSelect = (idx) => {
    setSelected(idx);
    setChecked(prev => new Set(prev).add(idx));
  };

  const current = selected !== null ? cottageChecks[selected] : null;

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Select a cottage to evaluate</span>
        <div style={{ display: "flex", gap: 8 }}>
          {cottageChecks.map((cc, idx) => {
            const isSelected = selected === idx;
            const wasDone = checked.has(idx);
            const isOk = cc.eligible && wasDone;
            const isBad = !cc.eligible && wasDone;
            return (
              <button key={idx} onClick={() => handleSelect(idx)} style={{
                flex: 1, padding: "12px 4px", borderRadius: 10, cursor: "pointer",
                border: `2px solid ${isSelected ? C.accent : isOk ? C.ok + "66" : isBad ? C.fail + "33" : C.border}`,
                background: isSelected ? C.accent + "15" : isOk ? C.ok + "08" : C.card,
                transition: "all 0.2s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? C.accent : isOk ? C.ok : C.text }}>{cc.name}</span>
                <span style={{ fontSize: 10, color: isOk ? C.ok : isBad ? C.fail : C.muted + "66", fontWeight: 600 }}>
                  {wasDone ? (cc.eligible ? "Suitable ✓" : "Not suitable") : "\u2014"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {current && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18, animation: "fadeSlideIn 0.3s ease-out" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{current.name}</span>
            <span style={{ fontSize: 12, color: C.muted }}>({current.cost}/week)</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12, color: C.muted, minWidth: 140 }}>Bedrooms (need ≥ 3)</span>
              <span style={{ fontSize: 13, color: current.has3bed ? C.ok : C.fail, fontWeight: 600 }}>
                {current.bedrooms} {current.has3bed ? "✓" : "✗ ELIMINATED"}
              </span>
            </div>
            {current.wishDetails.map((w, wi) => (
              <div key={wi} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 12, color: C.muted, minWidth: 140 }}>{w.wish}</span>
                <span style={{ fontSize: 13, color: w.met ? C.ok : C.fail, fontWeight: 600 }}>
                  {w.met ? "Yes ✓" : "No ✗"}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, padding: "8px 12px", borderRadius: 8, background: C.calcBg, border: `1px solid ${C.calc}44` }}>
            <span style={{ fontSize: 12, color: C.calc, fontWeight: 600 }}>Other wishes met: {current.wc}/4</span>
          </div>

          <div style={{
            padding: "10px 14px", borderRadius: 8,
            background: current.eligible ? C.conclBg : C.failBg,
            border: `1px solid ${current.eligible ? C.ok + "44" : C.fail + "44"}`,
          }}>
            <p style={{ margin: 0, fontSize: 13, color: current.eligible ? C.ok : C.fail, lineHeight: 1.6 }}>
              {!current.has3bed ? (
                <><strong>Not suitable. </strong>{current.name} only has {current.bedrooms} bedroom{current.bedrooms !== 1 ? "s" : ""}, which fails the mandatory requirement of at least 3.</>
              ) : current.eligible ? (
                <><strong>Perfect! </strong>{current.name} has at least 3 bedrooms and meets {current.wc} of the 4 other wishes, so it qualifies.</>
              ) : (
                <><strong>Not suitable. </strong>{current.name} has enough bedrooms but only meets {current.wc} of the 4 other wishes. It needs at least 3.</>
              )}
            </p>
          </div>
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
  { letter: "A", text: "Acorns", ok: false, expl: "Acorns has 3 bedrooms (passes the must-have), but only meets 2 of the 4 other wishes (wifi, within 3 km). It needs at least 3, so it is not suitable." },
  { letter: "B", text: "Beeches", ok: true, expl: "Beeches has 3 bedrooms and meets 3 of the 4 other wishes (large garden, wifi, within 3 km). It is suitable, and at $490/week it is the cheapest of the three qualifying cottages." },
  { letter: "C", text: "Chestnuts", ok: false, expl: "Chestnuts has 4 bedrooms and meets 3 of the 4 other wishes (wifi, parking, within 3 km). It qualifies, but at $510/week it is more expensive than Beeches ($490)." },
  { letter: "D", text: "Denders", ok: false, expl: "Denders has 4 bedrooms and meets 3 of the 4 other wishes (large garden, wifi, parking). It qualifies, but at $500/week it is more expensive than Beeches ($490)." },
  { letter: "E", text: "Eglers", ok: false, expl: "Eglers has only 2 bedrooms, which fails the mandatory requirement of at least 3. It is immediately eliminated." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Table Reading & Logic</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 13</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 13</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 12px" }}>
                Kate and Tek are choosing a cottage to rent for their family holiday. They have searched online and reduced their choice to five cottages. The facilities offered by these cottages are shown in the following table.
              </p>
            </div>

            <CottageTable />

            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text, marginTop: 16 }}>
              <p style={{ margin: "0 0 10px" }}>
                Ideally, Kate and Tek would like a cottage with at least three bedrooms, a large garden, wifi, parking, and they would like to be within 3 km of a store. They realise that it is unlikely that all their wishes will be met, so they decide to compromise. They insist that the cottage must have at least three bedrooms, but they will be happy if at least three of their other wishes are satisfied. If more than one cottage is suitable, then they will choose the one that is the cheapest to rent.
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: C.assum }}>Which cottage will Kate and Tek choose?</strong>
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>What we are given</span>

              <CottageTable />

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>1</span>
                  <span style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}><strong style={{ color: C.fail }}>Must-have:</strong> at least three bedrooms. This is non-negotiable.</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>2</span>
                  <span style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}><strong style={{ color: C.assum }}>Other wishes (need ≥ 3 of 4):</strong> large garden, wifi, parking, within 3 km of a store.</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>3</span>
                  <span style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}><strong style={{ color: C.ok }}>Tiebreaker:</strong> if more than one cottage qualifies, choose the cheapest.</span>
                </div>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  First filter by the mandatory requirement (bedrooms), then count how many of the four other wishes each remaining cottage satisfies. Finally, pick the cheapest among those that meet the threshold.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.calcBg, border: `1px solid ${C.calc}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.calc, fontWeight: 700, whiteSpace: "nowrap" }}>WATCH OUT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  "Pets allowed" is not one of their wishes. Do not count it. The four other wishes are: large garden, wifi, parking, and distance within 3 km.
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
                  Click each cottage to check whether it meets the mandatory bedroom requirement and at least 3 of the 4 other wishes.
                </p>
              </div>
            </div>

            <CottageChecker />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>
                "Which cottage will Kate and Tek choose?"
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Summary</span>
              <CottageTable showWishCount={true} showEligible={true} />
              <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, fontSize: 13.5, color: C.ok, fontWeight: 600, lineHeight: 1.5 }}>
                Three cottages qualify: Beeches ($490), Denders ($500), Chestnuts ($510). Beeches is the cheapest.
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