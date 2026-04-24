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
  { id: 1, label: "Setup", title: "Identify Key Constraints" },
  { id: 2, label: "Solve", title: "Test Each Candidate" },
  { id: 3, label: "Verify", title: "Check All Options" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ROTA = [
  ["Mel", "Eve", "Jan", "Mel", "Eve", "Fay"],
  ["Rod", "Fay", "Leo", "Pat", "Jan", "Leo"],
  ["Sam", "Tim", "Sam", "Tim", "Rod", "Pat"],
];

function getVolunteersOnDay(dayIdx) {
  return [ROTA[0][dayIdx], ROTA[1][dayIdx], ROTA[2][dayIdx]];
}

function getDaysForVolunteer(name) {
  const days = [];
  for (let d = 0; d < 6; d++) {
    for (let r = 0; r < 3; r++) {
      if (ROTA[r][d] === name) days.push(d);
    }
  }
  return days;
}

function RotaTable({ highlightCells, highlightColor }) {
  return (
    <div style={{ overflowX: "auto", marginBottom: 8 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {DAYS.map(d => (
              <th key={d} style={{ padding: "8px 6px", textAlign: "center", color: C.muted, fontSize: 11, fontWeight: 600, borderBottom: `1px solid ${C.border}`, fontStyle: "italic" }}>{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROTA.map((row, r) => (
            <tr key={r}>
              {row.map((name, d) => {
                const hl = highlightCells && highlightCells.some(c => c[0] === r && c[1] === d);
                const col = hl ? (highlightColor || C.assum) : C.text;
                return (
                  <td key={d} style={{
                    padding: "7px 6px", textAlign: "center",
                    borderBottom: `1px solid ${C.border}22`,
                    color: col,
                    fontWeight: hl ? 700 : 400,
                    background: hl ? (col + "12") : "transparent",
                    borderRadius: hl ? 4 : 0,
                  }}>{name}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DeductionWalkthrough() {
  const [revealed, setRevealed] = useState(0);

  const steps = [
    {
      label: "Identify Fay's current schedule",
      why: "Fay is currently on duty Tuesday and Saturday. She wants to swap her Tuesday duty to be on Monday or Thursday instead.",
      math: <span>Fay: <strong style={{ color: C.assum }}>Tuesday</strong> + Saturday. Swap Tuesday for <strong style={{ color: C.ps }}>Monday</strong> or <strong style={{ color: C.ps }}>Thursday</strong>.</span>,
      color: C.ps,
    },
    {
      label: "Monday candidates: Mel, Rod, Sam",
      why: "For each, if they take Fay's Tuesday and Fay takes their Monday, we must check: (1) no consecutive evenings for either, (2) no pair of volunteers on duty together twice.",
      math: <span>Monday crew: Mel, Rod, Sam. Check each swap with Fay.</span>,
      color: C.ps,
    },
    {
      label: "Test Mel (Monday)",
      why: "Mel's days are Monday and Thursday. If Mel swaps Monday for Tuesday, Mel would have Tuesday and Thursday, which are not consecutive. Good so far. But check pairings: on Tuesday, Mel would be with Eve and Tim. On Thursday, Mel is with Pat and Tim. Mel and Tim would be together on both Tuesday and Thursday. This violates the rule.",
      math: <span>Mel: Tue + Thu. Tim on Tue and Thu → <strong style={{ color: C.fail }}>Mel-Tim paired twice</strong>. Fails.</span>,
      color: C.fail,
    },
    {
      label: "Test Rod (Monday)",
      why: "Rod's days are Monday and Friday. If Rod swaps Monday for Tuesday, Rod would have Tuesday and Friday, which are not consecutive. Check pairings: on Tuesday, Rod would be with Eve and Tim. On Friday, Rod is with Eve and Jan. Rod and Eve would be together on both Tuesday and Friday. This violates the rule.",
      math: <span>Rod: Tue + Fri. Eve on Tue and Fri → <strong style={{ color: C.fail }}>Rod-Eve paired twice</strong>. Fails.</span>,
      color: C.fail,
    },
    {
      label: "Test Sam (Monday)",
      why: "Sam's days are Monday and Wednesday. If Sam swaps Monday for Tuesday, Sam would have Tuesday and Wednesday, which are consecutive. This violates the first rule.",
      math: <span>Sam: Tue + Wed → <strong style={{ color: C.fail }}>consecutive evenings</strong>. Fails.</span>,
      color: C.fail,
    },
    {
      label: "Thursday candidates: Mel, Pat, Tim",
      why: "No Monday swap works. Now test Thursday. If a Thursday volunteer swaps to Tuesday, check the same two conditions.",
      math: <span>Thursday crew: Mel, Pat, Tim. Check each swap with Fay.</span>,
      color: C.ps,
    },
    {
      label: "Test Mel (Thursday)",
      why: "Mel's days are Monday and Thursday. If Mel swaps Thursday for Tuesday, Mel would have Monday and Tuesday, which are consecutive. Fails.",
      math: <span>Mel: Mon + Tue → <strong style={{ color: C.fail }}>consecutive evenings</strong>. Fails.</span>,
      color: C.fail,
    },
    {
      label: "Test Tim (Thursday)",
      why: "Tim's days are Tuesday and Thursday. If Tim swaps Thursday for Tuesday, Tim would still need two different days. But Tim is already on Tuesday. Swapping Tim's Thursday for Fay's Tuesday means Tim would have Tuesday and Tuesday? No: Tim gives up Thursday and takes Tuesday from Fay. Tim already has Tuesday, so Tim would have two Tuesdays. This does not make sense. Tim would need to swap his Thursday slot, getting Fay's Tuesday. But Tim is already on Tuesday. So Tim would appear twice on Tuesday. This is not valid.",
      math: <span>Tim already on Tuesday → <strong style={{ color: C.fail }}>cannot take another Tuesday slot</strong>. Fails.</span>,
      color: C.fail,
    },
    {
      label: "Test Pat (Thursday)",
      why: "Pat's days are Thursday and Saturday. If Pat swaps Thursday for Tuesday, Pat would have Tuesday and Saturday, which are not consecutive. Check pairings: on Tuesday, Pat would be with Eve and Tim. On Saturday, Pat is with Fay and Leo. No pair of volunteers appears together twice. All conditions are satisfied.",
      math: <span>Pat: Tue + Sat. No consecutive days ✓ No repeated pairings ✓</span>,
      conclusion: "Pat is the only volunteer Fay can swap with. The answer is B.",
      color: C.ok,
    },
  ];

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 16 }}>Step-by-step deduction</span>

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
                  padding: "12px 18px", fontSize: 14, color: C.white, fontFamily: mathFont,
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

function SwapChecker() {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(new Set());

  const candidates = [
    { name: "Mel", fromDay: "Monday", fromDayIdx: 0 },
    { name: "Rod", fromDay: "Monday", fromDayIdx: 0 },
    { name: "Sam", fromDay: "Monday", fromDayIdx: 0 },
    { name: "Mel", fromDay: "Thursday", fromDayIdx: 3 },
    { name: "Pat", fromDay: "Thursday", fromDayIdx: 3 },
    { name: "Tim", fromDay: "Thursday", fromDayIdx: 3 },
  ];

  function analyzeSwap(candidate) {
    const { name, fromDay, fromDayIdx } = candidate;
    const fayTuesdayIdx = 1;
    const faySaturdayIdx = 5;

    const personDays = getDaysForVolunteer(name);
    const otherDay = personDays.find(d => d !== fromDayIdx);

    if (name === "Tim" && fromDayIdx === 3) {
      if (personDays.includes(fayTuesdayIdx)) {
        return {
          ok: false,
          reason: `Tim is already on duty Tuesday. Taking Fay's Tuesday slot would mean Tim appears on Tuesday twice, which is not valid.`,
          consec: false,
          pairIssue: null,
          alreadyOnDay: true,
        };
      }
    }

    if (otherDay === undefined) {
      return { ok: false, reason: "Cannot determine schedule.", consec: false, pairIssue: null };
    }

    const newPersonDays = [fayTuesdayIdx, otherDay].sort((a, b) => a - b);
    const isConsec = Math.abs(newPersonDays[0] - newPersonDays[1]) === 1;

    if (isConsec) {
      return {
        ok: false,
        reason: `${name} would have ${DAYS[newPersonDays[0]]} and ${DAYS[newPersonDays[1]]}, which are consecutive evenings. This violates the first rule.`,
        consec: true,
        pairIssue: null,
      };
    }

    const newRota = ROTA.map(row => [...row]);
    for (let r = 0; r < 3; r++) {
      if (newRota[r][fromDayIdx] === name) newRota[r][fromDayIdx] = "Fay";
      if (newRota[r][fayTuesdayIdx] === "Fay") newRota[r][fayTuesdayIdx] = name;
    }

    const pairCount = {};
    for (let d = 0; d < 6; d++) {
      const crew = [newRota[0][d], newRota[1][d], newRota[2][d]];
      for (let a = 0; a < 3; a++) {
        for (let b = a + 1; b < 3; b++) {
          const pair = [crew[a], crew[b]].sort().join("-");
          if (!pairCount[pair]) pairCount[pair] = [];
          pairCount[pair].push(DAYS[d]);
        }
      }
    }

    for (const pair in pairCount) {
      if (pairCount[pair].length > 1) {
        return {
          ok: false,
          reason: `${pair.replace("-", " and ")} would be on duty together on both ${pairCount[pair][0]} and ${pairCount[pair][1]}. This violates the second rule.`,
          consec: false,
          pairIssue: pair,
        };
      }
    }

    const fayNewDays = [fromDayIdx, faySaturdayIdx];
    const fayConsec = Math.abs(fayNewDays[0] - fayNewDays[1]) === 1;
    if (fayConsec) {
      return {
        ok: false,
        reason: `Fay would have ${DAYS[fayNewDays[0]]} and ${DAYS[fayNewDays[1]]}, which are consecutive. This violates the first rule.`,
        consec: true,
        pairIssue: null,
      };
    }

    return {
      ok: true,
      reason: `All conditions are satisfied. ${name} moves to Tuesday, Fay moves to ${fromDay}. No consecutive evenings, no repeated pairings.`,
      consec: false,
      pairIssue: null,
    };
  }

  const handleSelect = (idx) => {
    setSelected(idx);
    setChecked(prev => new Set(prev).add(idx));
  };

  const current = selected !== null ? candidates[selected] : null;
  const analysis = current ? analyzeSwap(current) : null;

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Select a swap to test</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 8 }}>
          <div style={{ gridColumn: "1 / -1", fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Monday volunteers</div>
          {candidates.slice(0, 3).map((c, idx) => {
            const isSelected = selected === idx;
            const wasDone = checked.has(idx);
            const a = wasDone ? analyzeSwap(c) : null;
            const isOk = a && a.ok;
            const isBad = a && !a.ok;
            return (
              <button key={idx} onClick={() => handleSelect(idx)} style={{
                padding: "12px 4px", borderRadius: 10, cursor: "pointer",
                border: `2px solid ${isSelected ? C.accent : isOk ? C.ok + "66" : isBad ? C.fail + "33" : C.border}`,
                background: isSelected ? C.accent + "15" : isOk ? C.ok + "08" : C.card,
                transition: "all 0.2s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? C.accent : isOk ? C.ok : C.text }}>{c.name}</span>
                <span style={{ fontSize: 10, color: isOk ? C.ok : isBad ? C.fail : C.muted + "66", fontWeight: 600 }}>
                  {wasDone ? (isOk ? "Perfect!" : "Fails") : "\u2014"}
                </span>
              </button>
            );
          })}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          <div style={{ gridColumn: "1 / -1", fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 8 }}>Thursday volunteers</div>
          {candidates.slice(3).map((c, idx) => {
            const realIdx = idx + 3;
            const isSelected = selected === realIdx;
            const wasDone = checked.has(realIdx);
            const a = wasDone ? analyzeSwap(c) : null;
            const isOk = a && a.ok;
            const isBad = a && !a.ok;
            return (
              <button key={realIdx} onClick={() => handleSelect(realIdx)} style={{
                padding: "12px 4px", borderRadius: 10, cursor: "pointer",
                border: `2px solid ${isSelected ? C.accent : isOk ? C.ok + "66" : isBad ? C.fail + "33" : C.border}`,
                background: isSelected ? C.accent + "15" : isOk ? C.ok + "08" : C.card,
                transition: "all 0.2s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? C.accent : isOk ? C.ok : C.text }}>{c.name}</span>
                <span style={{ fontSize: 10, color: isOk ? C.ok : isBad ? C.fail : C.muted + "66", fontWeight: 600 }}>
                  {wasDone ? (isOk ? "Perfect!" : "Fails") : "\u2014"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {current && analysis && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18, animation: "fadeSlideIn 0.3s ease-out" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Swap Fay ↔ {current.name} ({current.fromDay})</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12, color: C.muted, minWidth: 100 }}>Fay moves to</span>
              <span style={{ fontSize: 13, color: C.ps, fontWeight: 600 }}>{current.fromDay}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12, color: C.muted, minWidth: 100 }}>{current.name} moves to</span>
              <span style={{ fontSize: 13, color: C.ps, fontWeight: 600 }}>Tuesday</span>
            </div>
          </div>

          <div style={{
            padding: "10px 14px", borderRadius: 8,
            background: analysis.ok ? C.conclBg : C.failBg,
            border: `1px solid ${analysis.ok ? C.ok + "44" : C.fail + "44"}`,
          }}>
            <p style={{ margin: 0, fontSize: 13, color: analysis.ok ? C.ok : C.fail, lineHeight: 1.6 }}>
              {analysis.ok ? <strong>All conditions met. </strong> : <strong>Rule violated. </strong>}
              {analysis.reason}
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
  { letter: "A", text: "Mel", ok: false, expl: "If Fay swaps with Mel on Monday, Mel would have Tuesday and Thursday. But Mel and Tim would both be on duty Tuesday and Thursday, violating the no-repeat-pairing rule. If Fay swaps with Mel on Thursday, Mel would have Monday and Tuesday, which are consecutive." },
  { letter: "B", text: "Pat", ok: true, expl: "Pat is on Thursday and Saturday. Swapping Pat's Thursday for Fay's Tuesday gives Pat Tuesday and Saturday (not consecutive). No pair of volunteers ends up on duty together twice. All conditions are met." },
  { letter: "C", text: "Rod", ok: false, expl: "Rod is on Monday and Friday. Swapping Rod's Monday for Fay's Tuesday gives Rod Tuesday and Friday (not consecutive). But Rod and Eve would both be on duty Tuesday and Friday, violating the no-repeat-pairing rule." },
  { letter: "D", text: "Sam", ok: false, expl: "Sam is on Monday and Wednesday. Swapping Sam's Monday for Fay's Tuesday gives Sam Tuesday and Wednesday, which are consecutive evenings. This violates the first rule." },
  { letter: "E", text: "Tim", ok: false, expl: "Tim is already on duty Tuesday. He cannot take Fay's Tuesday slot because he is already scheduled for that evening." },
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

  const fayHighlight = [];
  for (let r = 0; r < 3; r++) {
    for (let d = 0; d < 6; d++) {
      if (ROTA[r][d] === "Fay") fayHighlight.push([r, d]);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif", letterSpacing: 0.2, padding: "24px 16px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: 1 }}>TARA</span>
            <span style={{ fontSize: 12, color: C.muted }}>Problem Solving</span>
            <span style={{ fontSize: 12, color: C.muted }}>·</span>
            <span style={{ fontSize: 12, color: C.ps }}>Scheduling & Logic</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 19</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 19</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 10px" }}>
                A youth club is open six evenings every week. There are nine volunteers who run the club. Each evening three of the volunteers are on duty.
              </p>
              <p style={{ margin: "0 0 10px" }}>
                When the rota is drawn up for any week, the following conditions must be met:
              </p>
              <ul style={{ margin: "0 0 10px", paddingLeft: 24 }}>
                <li style={{ marginBottom: 6 }}>Each volunteer has two evenings of duty, but never two consecutive evenings.</li>
                <li>No two volunteers are on duty together twice in the same week.</li>
              </ul>
              <p style={{ margin: "0 0 14px" }}>
                Next week's rota has just been published, as follows:
              </p>
            </div>

            <RotaTable />

            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text, marginTop: 14 }}>
              <p style={{ margin: "0 0 10px" }}>
                Fay wants to swap her Tuesday duty with one of the others to be on duty on Monday or Thursday instead.
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: C.assum }}>Who is the only volunteer on the rota for Monday or Thursday that Fay could swap with if the conditions described above are still to be met?</strong>
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
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0, marginTop: 2 }}>1</span>
                  <span style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>Fay is currently on <strong style={{ color: C.assum }}>Tuesday</strong> and <strong style={{ color: C.assum }}>Saturday</strong>. She wants to give up Tuesday and move to Monday or Thursday.</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0, marginTop: 2 }}>2</span>
                  <span style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>Monday volunteers: <strong>Mel, Rod, Sam</strong>. Thursday volunteers: <strong>Mel, Pat, Tim</strong>. These are the five candidates (Mel appears on both days).</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0, marginTop: 2 }}>3</span>
                  <span style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>For each swap, both volunteers' new schedules must satisfy: no consecutive evenings, and no pair of volunteers on duty together twice in the week.</span>
                </div>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Current rota (Fay highlighted)</span>
              <RotaTable highlightCells={fayHighlight} highlightColor={C.assum} />
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  Test each Monday and Thursday volunteer systematically. For each swap, first check if either volunteer would have consecutive evenings. If that passes, check whether any pair of volunteers ends up on duty together twice.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.calcBg, border: `1px solid ${C.calc}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.calc, fontWeight: 700, whiteSpace: "nowrap" }}>WATCH OUT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  You must check both conditions for both the volunteer being swapped and Fay herself. A swap that works for one person might break a rule for the other.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Each volunteer's current days</span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {["Mel", "Eve", "Jan", "Fay", "Rod", "Sam", "Leo", "Pat", "Tim"].map(name => {
                  const days = getDaysForVolunteer(name);
                  const isFay = name === "Fay";
                  return (
                    <div key={name} style={{
                      padding: "8px 12px", borderRadius: 8,
                      background: isFay ? C.assumBg : "#1e2030",
                      border: `1px solid ${isFay ? C.assum + "44" : C.border}`,
                      textAlign: "center",
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isFay ? C.assum : C.text, marginBottom: 4 }}>{name}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{days.map(d => DAYS[d].slice(0, 3)).join(", ")}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Step 2: Solve */}
        {step === 2 && <DeductionWalkthrough />}

        {/* Step 3: Verify */}
        {step === 3 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>TRY IT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  Click each Monday and Thursday volunteer to test whether swapping them with Fay satisfies both conditions. Try to find the one that works.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Current rota for reference</span>
              <RotaTable />
            </div>

            <SwapChecker />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>
                "Who is the only volunteer on the rota for Monday or Thursday that Fay could swap with if the conditions described above are still to be met?"
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Elimination summary</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { name: "Mel (Mon)", reason: "Mel+Tim paired twice (Tue & Thu)", fail: true },
                  { name: "Rod (Mon)", reason: "Rod+Eve paired twice (Tue & Fri)", fail: true },
                  { name: "Sam (Mon)", reason: "Sam would have Tue+Wed (consecutive)", fail: true },
                  { name: "Mel (Thu)", reason: "Mel would have Mon+Tue (consecutive)", fail: true },
                  { name: "Tim (Thu)", reason: "Tim already on Tuesday", fail: true },
                  { name: "Pat (Thu)", reason: "Pat gets Tue+Sat, no violations", fail: false },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 14px", borderRadius: 8,
                    background: item.fail ? C.failBg : C.conclBg,
                    border: `1px solid ${item.fail ? C.fail + "33" : C.ok + "44"}`,
                  }}>
                    <span style={{ fontSize: 14, color: item.fail ? C.fail : C.ok, fontWeight: 700, flexShrink: 0 }}>{item.fail ? "✗" : "✓"}</span>
                    <span style={{ fontSize: 13, color: C.text, minWidth: 80 }}><strong>{item.name}</strong></span>
                    <span style={{ fontSize: 12, color: item.fail ? C.fail : C.ok }}>{item.reason}</span>
                  </div>
                ))}
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