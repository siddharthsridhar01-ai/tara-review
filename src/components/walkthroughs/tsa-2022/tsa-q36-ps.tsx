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
  { id: 2, label: "Solve", title: "Calculate the Spending Split" },
  { id: 3, label: "Verify", title: "Check Each Assignment" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

const books = [
  { title: "Hungry Dinosaurs", cost: 8 },
  { title: "The Celebrated Six", cost: 9 },
  { title: "Fly Away", cost: 13 },
  { title: "Come Back", cost: 14 },
  { title: "The Biraffe", cost: 16 },
];

const children = [
  { name: "Miya", hours: 7, ratio: 7 },
  { name: "Harriet", hours: 10, ratio: 10 },
  { name: "Mehran", hours: 3, ratio: 3 },
];

function BookTable({ highlight }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", maxWidth: 340, borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ padding: "8px 12px", textAlign: "left", color: C.muted, fontSize: 11, fontWeight: 600, borderBottom: `1px solid ${C.border}`, fontStyle: "italic" }}>title</th>
            <th style={{ padding: "8px 12px", textAlign: "center", color: C.muted, fontSize: 11, fontWeight: 600, borderBottom: `1px solid ${C.border}`, fontStyle: "italic" }}>cost</th>
          </tr>
        </thead>
        <tbody>
          {books.map(b => {
            const hl = highlight && highlight.includes(b.title);
            return (
              <tr key={b.title}>
                <td style={{ padding: "8px 12px", fontWeight: 600, color: hl ? C.ok : C.text, borderBottom: `1px solid ${C.border}` }}>{b.title}</td>
                <td style={{ padding: "8px 12px", textAlign: "center", color: hl ? C.ok : C.text, fontWeight: hl ? 700 : 400, borderBottom: `1px solid ${C.border}` }}>£{b.cost}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AlgebraWalkthrough() {
  const [revealed, setRevealed] = useState(0);

  const steps = [
    {
      label: "Calculate weekly reading hours",
      why: "Miya reads 1 hour/day, every day: 7 hours. Harriet reads 1 hour/day Mon to Thu (4 hours) and 2 hours/day Fri to Sun (6 hours): 10 hours. Mehran reads 0 on weekdays and 1.5 hours on Saturday and Sunday: 3 hours.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Miya: 7 × 1 = <strong style={{ color: C.ps }}>7 hours</strong></span>
          <span>Harriet: 4 × 1 + 3 × 2 = <strong style={{ color: C.ps }}>10 hours</strong></span>
          <span>Mehran: 2 × 1.5 = <strong style={{ color: C.ps }}>3 hours</strong></span>
        </div>
      ),
      color: C.ps,
    },
    {
      label: "Find the spending ratio",
      why: "The ratio of reading hours is 7 : 10 : 3. The total is 20 parts. Grandma spent £60, so each part is worth £3.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Ratio: 7 : 10 : 3 (total = 20)</span>
          <span>£60 / 20 = £3 per part</span>
          <span>Miya: 7 × £3 = <strong style={{ color: C.ps }}>£21</strong></span>
          <span>Harriet: 10 × £3 = <strong style={{ color: C.ps }}>£30</strong></span>
          <span>Mehran: 3 × £3 = <strong style={{ color: C.ps }}>£9</strong></span>
        </div>
      ),
      color: C.calc,
    },
    {
      label: "Assign books to match the spending",
      why: "We need combinations of books that sum to the right amount for each child. Mehran gets £9, so he must get The Celebrated Six (£9). Harriet gets £30, so she needs Come Back (£14) + The Biraffe (£16) = £30. Miya gets £21, so she needs Hungry Dinosaurs (£8) + Fly Away (£13) = £21.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Mehran (£9): The Celebrated Six (£9) ✓</span>
          <span>Harriet (£30): Come Back + The Biraffe = £14 + £16 = £30 ✓</span>
          <span>Miya (£21): Hungry Dinosaurs + Fly Away = £8 + £13 = £21 ✓</span>
        </div>
      ),
      color: C.calc,
    },
    {
      label: "Check the options",
      why: "Miya was given Hungry Dinosaurs and Fly Away. Looking at the options, option E states 'Miya was given Hungry Dinosaurs', which matches our assignment.",
      math: null,
      conclusion: "Miya was given 'Hungry Dinosaurs'. The answer is E.",
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
                    padding: "12px 18px", fontSize: 15, color: C.white, fontFamily: mathFont,
                    letterSpacing: 0.5, lineHeight: 1.8,
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

function ChildExplorer() {
  const [selected, setSelected] = useState(null);
  const [explored, setExplored] = useState(new Set());

  const assignments = {
    Miya: { spend: 21, books: ["Hungry Dinosaurs", "Fly Away"], costs: [8, 13] },
    Harriet: { spend: 30, books: ["Come Back", "The Biraffe"], costs: [14, 16] },
    Mehran: { spend: 9, books: ["The Celebrated Six"], costs: [9] },
  };

  const handleSelect = (name) => {
    setSelected(name);
    setExplored(prev => new Set(prev).add(name));
  };

  const current = selected ? assignments[selected] : null;

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Select a child to see their book assignment</span>

        <div style={{ display: "flex", gap: 8 }}>
          {children.map(c => {
            const isSelected = selected === c.name;
            const wasDone = explored.has(c.name);
            return (
              <button key={c.name} onClick={() => handleSelect(c.name)} style={{
                flex: 1, padding: "14px 8px", borderRadius: 10, cursor: "pointer",
                border: `2px solid ${isSelected ? C.accent : wasDone ? C.muted + "44" : C.border}`,
                background: isSelected ? C.accent + "15" : C.card,
                transition: "all 0.2s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: isSelected ? C.accent : C.text }}>{c.name}</span>
                <span style={{ fontSize: 11, color: C.muted }}>{c.hours} hrs/week</span>
                <span style={{ fontSize: 11, color: wasDone ? C.ps : C.muted + "66", fontWeight: 600 }}>
                  {wasDone ? `£${assignments[c.name].spend}` : "\u2014"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {current && selected && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18, animation: "fadeSlideIn 0.4s ease-out" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{selected}</span>
            <span style={{ fontSize: 12, color: C.muted }}>Budget: £{current.spend}</span>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", height: 32, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}` }}>
              {children.map(c => {
                const pct = (c.ratio / 20) * 100;
                const isCurrent = c.name === selected;
                return (
                  <div key={c.name} style={{
                    width: `${pct}%`,
                    background: isCurrent ? "rgba(116,185,255,0.6)" : "rgba(139,141,154,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700, color: isCurrent ? "#0f1117" : C.muted,
                    transition: "all 0.3s",
                  }}>
                    {c.name}: {c.ratio}/20
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 4, textAlign: "center" }}>
              Share of £60 budget by reading ratio (7 : 10 : 3)
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12, color: C.muted }}>Reading hours per week</span>
              <span style={{ fontSize: 14, color: C.text, fontWeight: 600, marginLeft: 12 }}>
                {children.find(c => c.name === selected).hours} hours
              </span>
            </div>
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12, color: C.muted }}>Ratio share</span>
              <span style={{ fontSize: 14, color: C.text, fontWeight: 600, marginLeft: 12 }}>
                {children.find(c => c.name === selected).ratio} / 20 of £60 = <strong style={{ color: C.ps }}>£{current.spend}</strong>
              </span>
            </div>
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12, color: C.muted }}>Books assigned</span>
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                {current.books.map((b, i) => (
                  <span key={b} style={{ fontSize: 14, color: C.ok, fontWeight: 600 }}>
                    {b} (£{current.costs[i]})
                  </span>
                ))}
              </div>
            </div>
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12, color: C.muted }}>Total cost check</span>
              <span style={{ fontSize: 14, color: C.text, fontWeight: 600, marginLeft: 12 }}>
                {current.costs.map(c => `£${c}`).join(" + ")} = <strong style={{ color: current.costs.reduce((a, b) => a + b, 0) === current.spend ? C.ok : C.fail }}>£{current.costs.reduce((a, b) => a + b, 0)}</strong>
                {current.costs.reduce((a, b) => a + b, 0) === current.spend ? " ✓" : " ✗"}
              </span>
            </div>
          </div>
        </div>
      )}

      {explored.size === 3 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
          <div style={{ padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44` }}>
            <p style={{ margin: 0, fontSize: 13, color: C.ok, lineHeight: 1.6 }}>
              <strong>Perfect!</strong> All three assignments add up correctly. Miya gets Hungry Dinosaurs (£8) and Fly Away (£13) = £21. Harriet gets Come Back (£14) and The Biraffe (£16) = £30. Mehran gets The Celebrated Six (£9). Total: £60.
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

function SpendingBar() {
  const colors = { Miya: "#74b9ff", Harriet: "#a29bfe", Mehran: "#fdcb6e" };
  const spends = { Miya: 21, Harriet: 30, Mehran: 9 };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {Object.entries(spends).map(([name, spend]) => {
        const pct = (spend / 30) * 100;
        return (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: colors[name], minWidth: 60, textAlign: "right" }}>{name}</span>
            <div style={{ flex: 1, height: 24, borderRadius: 6, background: C.border + "44", position: "relative", overflow: "hidden" }}>
              <div style={{
                width: `${pct}%`, height: "100%", borderRadius: 6,
                background: `linear-gradient(90deg, ${colors[name]}66, ${colors[name]})`,
                transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8,
              }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#0f1117" }}>£{spend}</span>
              </div>
            </div>
          </div>
        );
      })}
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
  { letter: "A", text: "Harriet was given 'The Celebrated Six'.", ok: false, expl: "The Celebrated Six costs £9. Harriet's budget is £30, which requires Come Back (£14) + The Biraffe (£16). The Celebrated Six goes to Mehran." },
  { letter: "B", text: "Harriet was given 'Fly Away'.", ok: false, expl: "Fly Away costs £13. Adding it to any other book does not reach Harriet's £30 budget using the remaining books. Fly Away goes to Miya (£8 + £13 = £21)." },
  { letter: "C", text: "Mehran was given 'The Biraffe'.", ok: false, expl: "The Biraffe costs £16. Mehran's budget is only £9, so he cannot receive a £16 book. The Biraffe goes to Harriet." },
  { letter: "D", text: "Miya was given 'Come Back'.", ok: false, expl: "Come Back costs £14. Miya's budget is £21, so she would need a £7 book to pair with it, but no such book exists. Come Back goes to Harriet." },
  { letter: "E", text: "Miya was given 'Hungry Dinosaurs'.", ok: true, expl: "Miya's budget is £21. Hungry Dinosaurs (£8) + Fly Away (£13) = £21. This is the only valid combination for Miya, confirming she receives Hungry Dinosaurs." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Proportional Reasoning</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 36</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 36</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 14px" }}>
                Grandma has spent £60 on five books which she is intending to give to her three grandchildren, Miya, Harriet and Mehran. She is going to give the books in a way that relates the cost to the time they normally spend reading (i.e. spend the most on the child who reads the most). Miya reads for an hour a day. Harriet reads for an hour a day on Monday to Thursday and 2 hours a day on Friday to Sunday. Mehran doesn't read on weekdays but does an hour and a half on each of Saturday and Sunday. The details of the books are shown in the table below.
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
              <BookTable />
            </div>

            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 10px" }}><strong style={{ color: C.assum }}>Which one of the following statements is true?</strong></p>
              <div style={{ paddingLeft: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                <p style={{ margin: 0 }}><strong>A</strong>  Harriet was given 'The Celebrated Six'.</p>
                <p style={{ margin: 0 }}><strong>B</strong>  Harriet was given 'Fly Away'.</p>
                <p style={{ margin: 0 }}><strong>C</strong>  Mehran was given 'The Biraffe'.</p>
                <p style={{ margin: 0 }}><strong>D</strong>  Miya was given 'Come Back'.</p>
                <p style={{ margin: 0 }}><strong>E</strong>  Miya was given 'Hungry Dinosaurs'.</p>
              </div>
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
                  Work out each child's weekly reading hours, then split the £60 budget proportionally. Finally, find book combinations that match each child's share.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>1. Reading schedules</span>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
                  <thead>
                    <tr>
                      {["Child", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Total"].map(h => (
                        <th key={h} style={{ padding: "8px 8px", textAlign: "center", color: C.muted, fontSize: 11, fontWeight: 600, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "8px 8px", fontWeight: 700, color: C.text, borderBottom: `1px solid ${C.border}` }}>Miya</td>
                      {[1,1,1,1,1,1,1].map((v,i) => (
                        <td key={i} style={{ padding: "8px 8px", textAlign: "center", color: C.text, borderBottom: `1px solid ${C.border}` }}>{v}</td>
                      ))}
                      <td style={{ padding: "8px 8px", textAlign: "center", color: C.ps, fontWeight: 700, borderBottom: `1px solid ${C.border}` }}>7</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px 8px", fontWeight: 700, color: C.text, borderBottom: `1px solid ${C.border}` }}>Harriet</td>
                      {[1,1,1,1,2,2,2].map((v,i) => (
                        <td key={i} style={{ padding: "8px 8px", textAlign: "center", color: C.text, borderBottom: `1px solid ${C.border}` }}>{v}</td>
                      ))}
                      <td style={{ padding: "8px 8px", textAlign: "center", color: C.ps, fontWeight: 700, borderBottom: `1px solid ${C.border}` }}>10</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px 8px", fontWeight: 700, color: C.text, borderBottom: `1px solid ${C.border}` }}>Mehran</td>
                      {[0,0,0,0,0,1.5,1.5].map((v,i) => (
                        <td key={i} style={{ padding: "8px 8px", textAlign: "center", color: v === 0 ? C.muted : C.text, borderBottom: `1px solid ${C.border}` }}>{v}</td>
                      ))}
                      <td style={{ padding: "8px 8px", textAlign: "center", color: C.ps, fontWeight: 700, borderBottom: `1px solid ${C.border}` }}>3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>2. Book prices</span>
              <BookTable />
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.assumBg, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.assum, fontWeight: 700, whiteSpace: "nowrap" }}>KEY POINT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  The reading ratio is 7 : 10 : 3, which sums to 20. Since £60 / 20 = £3 per part, we can find each child's budget without a calculator. Then we need to find which books add up to each budget.
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
                  Click each child to see which books they receive and verify the cost adds up to their share of the £60 budget.
                </p>
              </div>
            </div>
            <ChildExplorer />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>
                "Which one of the following statements is true?"
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Spending breakdown</span>
              <SpendingBar />
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", gap: 8, fontSize: 12, color: C.text }}>
                  <span style={{ fontWeight: 700, color: "#74b9ff", minWidth: 60 }}>Miya</span>
                  <span>£21: Hungry Dinosaurs (£8) + Fly Away (£13)</span>
                </div>
                <div style={{ display: "flex", gap: 8, fontSize: 12, color: C.text }}>
                  <span style={{ fontWeight: 700, color: "#a29bfe", minWidth: 60 }}>Harriet</span>
                  <span>£30: Come Back (£14) + The Biraffe (£16)</span>
                </div>
                <div style={{ display: "flex", gap: 8, fontSize: 12, color: C.text }}>
                  <span style={{ fontWeight: 700, color: "#fdcb6e", minWidth: 60 }}>Mehran</span>
                  <span>£9: The Celebrated Six (£9)</span>
                </div>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 14 }}>
              <p style={{ color: C.muted, fontSize: 14, margin: 0 }}><strong style={{ color: C.assum }}>Click each option</strong> to see why it is correct or incorrect:</p>
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