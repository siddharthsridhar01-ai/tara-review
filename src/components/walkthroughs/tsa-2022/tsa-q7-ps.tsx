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
  { id: 1, label: "Setup", title: "Identify What We Need" },
  { id: 2, label: "Solve", title: "Find the Extensions Fran Never Needs" },
  { id: 3, label: "Verify", title: "Check Each Extension" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

const departments = [
  "Accounts", "Administration", "Enquiries", "Complaints",
  "Quality Assurance", "Marketing", "Public Relations", "Human Resources"
];

const headers = ["student", "parent", "lecturer", "journalist", "researcher"];

const tableData = [
  [387, 387, 661, 387, 661],
  [117, 387, 117, 232, 232],
  [239, 387, 387, 661, 387],
  [558, 239, 117, 387, 117],
  [239, 239, 117, 558, 239],
  [387, 239, 232, 661, 232],
  [239, 117, 387, 239, 232],
  [239, 239, 661, 117, 239],
];

const lecturerCol = tableData.map(row => row[2]);
// lecturer extensions: 661, 117, 387, 117, 117, 232, 387, 661
// unique: 661, 117, 387, 232
// all extensions: 117, 232, 239, 387, 558, 661
// never needed: 239, 558 => 2

function ExtensionTable({ highlightCol, highlightCells }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ padding: "8px 10px", textAlign: "left", color: C.muted, fontSize: 11, fontWeight: 600, borderBottom: `1px solid ${C.border}`, background: C.card }}></th>
            {headers.map((h, i) => (
              <th key={h} style={{
                padding: "8px 10px", textAlign: "center", fontSize: 11, fontWeight: 600,
                borderBottom: `1px solid ${C.border}`,
                color: highlightCol === i ? C.assum : C.muted,
                background: highlightCol === i ? C.assumBg : C.card,
                fontStyle: "italic",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {departments.map((dept, r) => (
            <tr key={dept}>
              <td style={{ padding: "7px 10px", borderBottom: `1px solid ${C.border}22`, color: C.text, fontSize: 13, fontWeight: 500 }}>{dept}</td>
              {tableData[r].map((val, c) => {
                const isHighlightCol = highlightCol === c;
                const cellKey = `${r}-${c}`;
                const cellHighlight = highlightCells && highlightCells[cellKey];
                return (
                  <td key={c} style={{
                    padding: "7px 10px", borderBottom: `1px solid ${C.border}22`,
                    textAlign: "center", fontFamily: mathFont, fontSize: 14,
                    color: cellHighlight ? cellHighlight : isHighlightCol ? C.white : C.text,
                    background: isHighlightCol ? C.assumBg : "transparent",
                    fontWeight: isHighlightCol ? 600 : 400,
                  }}>{val}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SolveWalkthrough() {
  const [revealed, setRevealed] = useState(0);

  const steps = [
    {
      label: "Identify Fran's column",
      why: "Fran is a lecturer, so we look at the \"lecturer\" column to find which extension numbers she uses.",
      math: <span>Lecturer column: 661, 117, 387, 117, 117, 232, 387, 661</span>,
      color: C.ps,
    },
    {
      label: "List the unique extensions Fran uses",
      why: "Collecting the distinct values from the lecturer column gives us the set of numbers Fran actually needs.",
      math: <span>Fran uses: <strong style={{ color: C.ok }}>117</strong>, <strong style={{ color: C.ok }}>232</strong>, <strong style={{ color: C.ok }}>387</strong>, <strong style={{ color: C.ok }}>661</strong></span>,
      color: C.ps,
    },
    {
      label: "List all extension numbers in the table",
      why: "Looking across the entire table, the extension numbers that appear are: 117, 232, 239, 387, 558, 661. That gives us 6 distinct numbers in total.",
      math: <span>All extensions: 117, 232, <strong style={{ color: C.fail }}>239</strong>, 387, <strong style={{ color: C.fail }}>558</strong>, 661</span>,
      color: C.calc,
    },
    {
      label: "Find which are never needed",
      why: "Comparing the full set to Fran's set: 239 and 558 never appear in the lecturer column. So 2 extension numbers are never needed by Fran.",
      math: <span>Never needed: <strong style={{ color: C.fail }}>239</strong> and <strong style={{ color: C.fail }}>558</strong></span>,
      conclusion: "The answer is C: 2 extension numbers are never needed by Fran.",
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

function ExtensionChecker() {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(new Set());

  const allExtensions = [117, 232, 239, 387, 558, 661];
  const franExtensions = new Set([661, 117, 387, 117, 117, 232, 387, 661]);
  // Fran uses: 117, 232, 387, 661

  const extInfo = allExtensions.map(ext => {
    const needed = franExtensions.has(ext);
    const depts = [];
    departments.forEach((d, r) => {
      if (tableData[r][2] === ext) depts.push(d);
    });
    return { ext, needed, depts };
  });

  const handleSelect = (idx) => {
    setSelected(idx);
    setChecked(prev => new Set(prev).add(idx));
  };

  const current = selected !== null ? extInfo[selected] : null;

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Click each extension to check if Fran needs it</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {extInfo.map((info, idx) => {
            const isSelected = selected === idx;
            const wasDone = checked.has(idx);
            const isOk = info.needed && wasDone;
            const isBad = !info.needed && wasDone;
            return (
              <button key={idx} onClick={() => handleSelect(idx)} style={{
                flex: 1, minWidth: 70, padding: "12px 4px", borderRadius: 10, cursor: "pointer",
                border: `2px solid ${isSelected ? C.accent : isOk ? C.ok + "66" : isBad ? C.fail + "33" : C.border}`,
                background: isSelected ? C.accent + "15" : isOk ? C.ok + "08" : isBad ? C.fail + "08" : C.card,
                transition: "all 0.2s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: isSelected ? C.accent : isOk ? C.ok : isBad ? C.fail : C.text, fontFamily: mathFont }}>{info.ext}</span>
                <span style={{ fontSize: 10, color: isOk ? C.ok : isBad ? C.fail : C.muted + "66", fontWeight: 600 }}>
                  {wasDone ? (info.needed ? "Needed ✓" : "Never needed ✗") : "—"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {current && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18, animation: "fadeSlideIn 0.3s ease-out" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: mathFont }}>{current.ext}</span>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6,
              background: current.needed ? C.conclBg : C.failBg,
              color: current.needed ? C.ok : C.fail,
              border: `1px solid ${current.needed ? C.ok + "44" : C.fail + "44"}`,
            }}>{current.needed ? "NEEDED" : "NEVER NEEDED"}</span>
          </div>

          {current.needed ? (
            <div>
              <p style={{ fontSize: 13, color: C.muted, margin: "0 0 10px", lineHeight: 1.6 }}>
                Extension {current.ext} appears in the lecturer column for:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {current.depts.map(d => (
                  <div key={d} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 13, color: C.ok, fontWeight: 600 }}>✓</span>
                    <span style={{ fontSize: 13, color: C.text }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              padding: "10px 14px", borderRadius: 8,
              background: C.failBg, border: `1px solid ${C.fail}44`,
            }}>
              <p style={{ margin: 0, fontSize: 13, color: C.fail, lineHeight: 1.6 }}>
                Extension {current.ext} does not appear anywhere in the lecturer column. Fran never needs to dial this number.
              </p>
            </div>
          )}
        </div>
      )}

      {checked.size === 6 && (
        <div style={{
          background: C.conclBg, border: `1px solid ${C.ok}44`, borderRadius: 14,
          padding: "16px 24px", marginBottom: 18,
        }}>
          <p style={{ margin: 0, fontSize: 14, color: C.ok, fontWeight: 600, lineHeight: 1.6 }}>
            Perfect! Extensions 239 and 558 are never needed by Fran. That is 2 extensions, confirming option C.
          </p>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
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
  { letter: "A", text: "0", ok: false, expl: "This would mean Fran uses all 6 extension numbers. However, 239 and 558 never appear in the lecturer column, so this is wrong." },
  { letter: "B", text: "1", ok: false, expl: "There are 2 extensions (239 and 558) that Fran never needs, not just 1." },
  { letter: "C", text: "2", ok: true, expl: "The lecturer column contains only 117, 232, 387, and 661. The extensions 239 and 558 never appear, so exactly 2 are never needed." },
  { letter: "D", text: "3", ok: false, expl: "Only 2 extensions are missing from the lecturer column, not 3. Fran uses 4 of the 6 distinct extension numbers." },
  { letter: "E", text: "4", ok: false, expl: "Fran uses 4 distinct extensions (117, 232, 387, 661), which means only 2 are unused, not 4." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Table Reading</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 7</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 7</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 14px" }}>
                The extension numbers needed to contact eight different departments in a university depend on whether the caller is calling as a student, parent, lecturer, journalist or researcher. The appropriate numbers are shown below.
              </p>
            </div>

            <ExtensionTable />

            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text, marginTop: 14 }}>
              <p style={{ margin: "0 0 10px" }}>
                Fran is a lecturer and regularly needs to contact all of the departments in the university.
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: C.assum }}>How many of the extension numbers are never needed by Fran?</strong>
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>What we are given</span>
              <p style={{ fontSize: 13.5, color: C.text, lineHeight: 1.7, margin: "0 0 14px" }}>
                Fran is a lecturer who contacts all 8 departments. We need to find how many of the extension numbers in the table she never has to use.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>1</span>
                  <span style={{ fontSize: 13, color: C.text }}>Look at the "lecturer" column only, since Fran always calls as a lecturer</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>2</span>
                  <span style={{ fontSize: 13, color: C.text }}>Identify all distinct extension numbers across the entire table</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>3</span>
                  <span style={{ fontSize: 13, color: C.text }}>Count how many of those numbers do not appear in the lecturer column</span>
                </div>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Table with lecturer column highlighted</span>
              <ExtensionTable highlightCol={2} />
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  First scan the lecturer column to find which extensions Fran uses. Then compare against all extensions in the table to find which ones she never needs.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.calcBg, border: `1px solid ${C.calc}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.calc, fontWeight: 700, whiteSpace: "nowrap" }}>WATCH OUT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  The question asks about extension numbers that are "never needed," not departments. Multiple departments may share the same extension number. We need to consider all 6 distinct numbers that appear in the table.
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
                  Click each extension number below to check whether it appears in the lecturer column. See which ones Fran never needs.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Reference table (lecturer column highlighted)</span>
              <ExtensionTable highlightCol={2} />
            </div>

            <ExtensionChecker />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>
                "How many of the extension numbers are never needed by Fran?"
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Summary</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 13, color: C.muted, minWidth: 120 }}>All extensions:</span>
                  <span style={{ fontSize: 14, color: C.text, fontFamily: mathFont }}>117, 232, 239, 387, 558, 661</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 13, color: C.muted, minWidth: 120 }}>Fran uses:</span>
                  <span style={{ fontSize: 14, color: C.ok, fontWeight: 600, fontFamily: mathFont }}>117, 232, 387, 661</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 8, background: C.failBg, border: `1px solid ${C.fail}44` }}>
                  <span style={{ fontSize: 13, color: C.muted, minWidth: 120 }}>Never needed:</span>
                  <span style={{ fontSize: 14, color: C.fail, fontWeight: 600, fontFamily: mathFont }}>239, 558</span>
                  <span style={{ fontSize: 13, color: C.fail, fontWeight: 600 }}>(2 numbers)</span>
                </div>
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