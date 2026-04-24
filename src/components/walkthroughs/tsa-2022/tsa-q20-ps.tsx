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
  { id: 2, label: "Solve", title: "Find the Incorrect Point" },
  { id: 3, label: "Verify", title: "Check Each Student" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

const STUDENTS = ["Ffion", "Gary", "Huw", "Ivy", "Jim", "Ken", "Lee", "Mei", "Naz", "Oli", "Pete", "Quin"];
const START_MARKS = [60, 48, 40, 30, 70, 48, 65, 60, 25, 85, 40, 80];
const END_MARKS = [56, 50, 35, 45, 80, 60, 70, 80, 25, 95, 50, 85];

// Points as plotted on the scatter graph (reading from screenshot)
// Most are correct, but Gary is plotted at (48, 80) instead of (48, 50)
const PLOTTED_POINTS = [
  { x: 60, y: 56 },  // Ffion
  { x: 48, y: 80 },  // Gary (INCORRECT - should be y=50)
  { x: 40, y: 35 },  // Huw
  { x: 30, y: 45 },  // Ivy
  { x: 70, y: 80 },  // Jim
  { x: 48, y: 60 },  // Ken
  { x: 65, y: 70 },  // Lee
  { x: 60, y: 80 },  // Mei — wait, let me re-read
  { x: 25, y: 25 },  // Naz
  { x: 85, y: 95 },  // Oli
  { x: 40, y: 50 },  // Pete
  { x: 80, y: 85 },  // Quin
];

function ScatterGraph({ showLabels = false, highlightStudent = null, showCorrection = false, size = 340 }) {
  const margin = { top: 20, right: 20, bottom: 35, left: 40 };
  const w = size;
  const h = size;
  const plotW = w - margin.left - margin.right;
  const plotH = h - margin.top - margin.bottom;

  const toX = (v) => margin.left + ((v - 20) / 80) * plotW;
  const toY = (v) => margin.top + plotH - ((v - 20) / 80) * plotH;

  const gridLines = [20, 30, 40, 50, 60, 70, 80, 90, 100];

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      {/* Grid */}
      {gridLines.map(v => (
        <g key={`grid-${v}`}>
          <line x1={toX(v)} y1={margin.top} x2={toX(v)} y2={margin.top + plotH} stroke={C.border} strokeWidth={0.5} />
          <line x1={margin.left} y1={toY(v)} x2={margin.left + plotW} y2={toY(v)} stroke={C.border} strokeWidth={0.5} />
        </g>
      ))}

      {/* Axes */}
      <line x1={margin.left} y1={margin.top + plotH} x2={margin.left + plotW} y2={margin.top + plotH} stroke={C.muted} strokeWidth={1} />
      <line x1={margin.left} y1={margin.top} x2={margin.left} y2={margin.top + plotH} stroke={C.muted} strokeWidth={1} />

      {/* Axis labels */}
      {[20, 40, 60, 80, 100].map(v => (
        <g key={`ax-${v}`}>
          <text x={toX(v)} y={margin.top + plotH + 16} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily="'Gill Sans', sans-serif">{v}</text>
          <text x={margin.left - 8} y={toY(v) + 3} textAnchor="end" fill={C.muted} fontSize={9} fontFamily="'Gill Sans', sans-serif">{v}</text>
        </g>
      ))}

      {/* Axis titles */}
      <text x={margin.left + plotW / 2} y={h - 2} textAnchor="middle" fill={C.muted} fontSize={10} fontFamily="'Gill Sans', sans-serif">starting mark</text>
      <text x={10} y={margin.top + plotH / 2} textAnchor="middle" fill={C.muted} fontSize={10} fontFamily="'Gill Sans', sans-serif" transform={`rotate(-90, 10, ${margin.top + plotH / 2})`}>end mark</text>

      {/* Points */}
      {PLOTTED_POINTS.map((p, i) => {
        const isHighlighted = highlightStudent === i;
        const isGary = i === 1;
        const fillColor = isHighlighted
          ? (isGary ? C.fail : C.ok)
          : showLabels ? C.accentLight : C.text;

        return (
          <g key={i}>
            <circle
              cx={toX(p.x)}
              cy={toY(p.y)}
              r={isHighlighted ? 6 : 4.5}
              fill={fillColor}
              stroke={isHighlighted ? C.white : "none"}
              strokeWidth={isHighlighted ? 1.5 : 0}
              opacity={highlightStudent !== null && !isHighlighted ? 0.3 : 1}
            />
            {showLabels && (
              <text
                x={toX(p.x) + 7}
                y={toY(p.y) - 7}
                fill={isHighlighted ? fillColor : C.muted}
                fontSize={8}
                fontWeight={isHighlighted ? 700 : 500}
                fontFamily="'Gill Sans', sans-serif"
              >
                {STUDENTS[i]}
              </text>
            )}
          </g>
        );
      })}

      {/* Show correction arrow for Gary */}
      {showCorrection && (
        <g>
          <line
            x1={toX(48)}
            y1={toY(80)}
            x2={toX(48)}
            y2={toY(50)}
            stroke={C.ok}
            strokeWidth={1.5}
            strokeDasharray="4 3"
            markerEnd="url(#arrowhead)"
          />
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={C.ok} />
            </marker>
          </defs>
          <circle cx={toX(48)} cy={toY(50)} r={5} fill="none" stroke={C.ok} strokeWidth={1.5} strokeDasharray="3 2" />
          <text x={toX(48) + 10} y={toY(50) + 4} fill={C.ok} fontSize={8} fontWeight={700} fontFamily="'Gill Sans', sans-serif">
            Correct: (48, 50)
          </text>
          <text x={toX(48) + 10} y={toY(80) + 4} fill={C.fail} fontSize={8} fontWeight={700} fontFamily="'Gill Sans', sans-serif">
            Plotted: (48, 80)
          </text>
        </g>
      )}
    </svg>
  );
}

function DataTable({ highlightStudent = null }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12, fontFamily: "'Gill Sans', sans-serif" }}>
        <thead>
          <tr>
            <th style={{ padding: "8px 6px", borderBottom: `1px solid ${C.border}`, color: C.muted, fontStyle: "italic", textAlign: "left", fontSize: 11 }}>student</th>
            {STUDENTS.map((s, i) => (
              <th key={s} style={{
                padding: "8px 4px", borderBottom: `1px solid ${C.border}`,
                color: highlightStudent === i ? (i === 1 ? C.fail : C.ok) : C.text,
                fontWeight: highlightStudent === i ? 700 : 600,
                textAlign: "center", fontSize: 11,
                background: highlightStudent === i ? (i === 1 ? C.failBg : C.conclBg) : "transparent",
                borderRadius: highlightStudent === i ? 4 : 0,
              }}>{s}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "8px 6px", borderBottom: `1px solid ${C.border}`, color: C.muted, fontStyle: "italic", fontSize: 11 }}>starting mark</td>
            {START_MARKS.map((m, i) => (
              <td key={i} style={{
                padding: "8px 4px", borderBottom: `1px solid ${C.border}`, textAlign: "center",
                color: highlightStudent === i ? C.white : C.text,
                fontWeight: highlightStudent === i ? 700 : 400,
                background: highlightStudent === i ? (i === 1 ? C.failBg : C.conclBg) : "transparent",
              }}>{m}</td>
            ))}
          </tr>
          <tr>
            <td style={{ padding: "8px 6px", color: C.muted, fontStyle: "italic", fontSize: 11 }}>end mark</td>
            {END_MARKS.map((m, i) => (
              <td key={i} style={{
                padding: "8px 4px", textAlign: "center",
                color: highlightStudent === i ? C.white : C.text,
                fontWeight: highlightStudent === i ? 700 : 400,
                background: highlightStudent === i ? (i === 1 ? C.failBg : C.conclBg) : "transparent",
              }}>{m}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function AlgebraWalkthrough() {
  const [revealed, setRevealed] = useState(0);

  const steps = [
    {
      label: "Focus on the options",
      why: "We only need to check the five students listed as options: Ffion, Gary, Huw, Ken, and Mei. For each, compare their table coordinates with what is plotted on the scatter graph.",
      math: <span>Check: (starting mark, end mark) vs plotted point</span>,
      color: C.ps,
    },
    {
      label: "Check Ffion",
      why: "From the table, Ffion has starting mark 60 and end mark 56. On the scatter graph, there is a point at approximately (60, 56).",
      math: <span>Ffion: (60, 56) in table, (60, 56) on graph <strong style={{ color: C.ok }}>✓</strong></span>,
      color: C.calc,
    },
    {
      label: "Check Gary",
      why: "From the table, Gary has starting mark 48 and end mark 50. On the scatter graph, the point at x = 48 appears to be plotted at y = 80, not y = 50. That is 30 marks too high.",
      math: <span>Gary: (48, 50) in table, but (48, <strong style={{ color: C.fail }}>80</strong>) on graph <strong style={{ color: C.fail }}>✗</strong></span>,
      color: C.fail,
    },
    {
      label: "Confirm the others",
      why: "For completeness: Huw should be (40, 35) and is plotted correctly. Ken should be (48, 60) and is plotted correctly. Mei should be (60, 80) and is plotted correctly.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span>Huw: (40, 35) table vs (40, 35) graph <strong style={{ color: C.ok }}>✓</strong></span>
          <span>Ken: (48, 60) table vs (48, 60) graph <strong style={{ color: C.ok }}>✓</strong></span>
          <span>Mei: (60, 80) table vs (60, 80) graph <strong style={{ color: C.ok }}>✓</strong></span>
        </div>
      ),
      color: C.calc,
    },
    {
      label: "Conclusion",
      why: "Only Gary's point does not match the table data. His end mark is 50 but it has been plotted at 80.",
      math: <span>Gary is incorrectly plotted: end mark <strong style={{ color: C.ok }}>50</strong> shown as <strong style={{ color: C.fail }}>80</strong></span>,
      conclusion: "The answer is B, Gary. His point is plotted 30 marks too high on the end mark axis.",
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

      {revealed >= steps.length - 1 && (
        <div style={{ marginTop: 12 }}>
          <ScatterGraph showLabels={true} highlightStudent={1} showCorrection={true} size={360} />
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

function StudentExplorer() {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(new Set());

  const optionStudents = [
    { idx: 0, name: "Ffion", letter: "A" },
    { idx: 1, name: "Gary", letter: "B" },
    { idx: 2, name: "Huw", letter: "C" },
    { idx: 5, name: "Ken", letter: "D" },
    { idx: 7, name: "Mei", letter: "E" },
  ];

  const handleSelect = (studentIdx) => {
    setSelected(studentIdx);
    setChecked(prev => new Set(prev).add(studentIdx));
  };

  const current = selected !== null ? optionStudents.find(s => s.idx === selected) : null;

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Select a student to check</span>

        <div style={{ display: "flex", gap: 8 }}>
          {optionStudents.map((s) => {
            const isSelected = selected === s.idx;
            const wasDone = checked.has(s.idx);
            const isIncorrect = s.idx === 1;
            const isCorrectlyPlotted = !isIncorrect;

            return (
              <button key={s.idx} onClick={() => handleSelect(s.idx)} style={{
                flex: 1, padding: "12px 4px", borderRadius: 10, cursor: "pointer",
                border: `2px solid ${isSelected ? C.accent : wasDone ? (isIncorrect ? C.fail + "66" : C.ok + "66") : C.border}`,
                background: isSelected ? C.accent + "15" : C.card,
                transition: "all 0.2s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? C.accent : wasDone ? (isIncorrect ? C.fail : C.ok) : C.text }}>{s.name}</span>
                <span style={{ fontSize: 10, color: wasDone ? (isIncorrect ? C.fail : C.ok) : C.muted + "66", fontWeight: 600 }}>
                  {wasDone ? (isIncorrect ? "Mismatch!" : "Matches ✓") : "\u2014"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {current && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{current.name}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>Option {current.letter}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12, color: C.muted, minWidth: 120 }}>Table data:</span>
              <span style={{ fontSize: 14, color: C.text, fontFamily: mathFont }}>
                starting = <strong>{START_MARKS[current.idx]}</strong>, end = <strong>{END_MARKS[current.idx]}</strong>
              </span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12, color: C.muted, minWidth: 120 }}>Plotted point:</span>
              <span style={{ fontSize: 14, color: C.text, fontFamily: mathFont }}>
                x = <strong>{PLOTTED_POINTS[current.idx].x}</strong>, y = <strong>{PLOTTED_POINTS[current.idx].y}</strong>
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}`, textAlign: "center" }}>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>Starting mark match?</div>
              <span style={{ fontSize: 16, fontWeight: 700, color: START_MARKS[current.idx] === PLOTTED_POINTS[current.idx].x ? C.ok : C.fail }}>
                {START_MARKS[current.idx]} vs {PLOTTED_POINTS[current.idx].x} {START_MARKS[current.idx] === PLOTTED_POINTS[current.idx].x ? "✓" : "✗"}
              </span>
            </div>
            <div style={{ flex: 1, padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}`, textAlign: "center" }}>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>End mark match?</div>
              <span style={{ fontSize: 16, fontWeight: 700, color: END_MARKS[current.idx] === PLOTTED_POINTS[current.idx].y ? C.ok : C.fail }}>
                {END_MARKS[current.idx]} vs {PLOTTED_POINTS[current.idx].y} {END_MARKS[current.idx] === PLOTTED_POINTS[current.idx].y ? "✓" : "✗"}
              </span>
            </div>
          </div>

          {(() => {
            const xMatch = START_MARKS[current.idx] === PLOTTED_POINTS[current.idx].x;
            const yMatch = END_MARKS[current.idx] === PLOTTED_POINTS[current.idx].y;
            const allMatch = xMatch && yMatch;
            return (
              <div style={{
                padding: "10px 14px", borderRadius: 8,
                background: allMatch ? C.conclBg : C.failBg,
                border: `1px solid ${allMatch ? C.ok + "44" : C.fail + "44"}`,
              }}>
                <p style={{ margin: 0, fontSize: 13, color: allMatch ? C.ok : C.fail, lineHeight: 1.6 }}>
                  {allMatch ? (
                    <><strong>Correctly plotted.</strong> Both coordinates match the table values. {current.name} is not the answer.</>
                  ) : (
                    <><strong>Incorrectly plotted!</strong> The end mark in the table is {END_MARKS[current.idx]}, but it is plotted at {PLOTTED_POINTS[current.idx].y}. That is a difference of {Math.abs(END_MARKS[current.idx] - PLOTTED_POINTS[current.idx].y)}.</>
                  )}
                </p>
              </div>
            );
          })()}

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <ScatterGraph showLabels={true} highlightStudent={current.idx} showCorrection={current.idx === 1} size={300} />
          </div>
        </div>
      )}

      {checked.size >= 2 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>
            Summary ({checked.size} of 5 checked)
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {optionStudents.map((s) => {
              if (!checked.has(s.idx)) return null;
              const isIncorrect = s.idx === 1;
              return (
                <div key={s.idx} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isIncorrect ? C.fail : C.ok, minWidth: 60 }}>{s.name}</span>
                  <span style={{ flex: 1, fontSize: 12, color: C.muted }}>
                    Table: ({START_MARKS[s.idx]}, {END_MARKS[s.idx]}) · Plotted: ({PLOTTED_POINTS[s.idx].x}, {PLOTTED_POINTS[s.idx].y})
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: isIncorrect ? C.fail : C.ok }}>
                    {isIncorrect ? "INCORRECT ✗" : "Correct ✓"}
                  </span>
                </div>
              );
            })}
          </div>

          {checked.size === 5 && (
            <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44` }}>
              <p style={{ margin: 0, fontSize: 13, color: C.ok, lineHeight: 1.6 }}>
                <strong>Perfect!</strong> Only Gary's point is incorrectly plotted. The answer is B.
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
  { letter: "A", text: "Ffion", ok: false,
    expl: "Ffion's table values are (60, 56). The scatter graph shows a point at (60, 56). This is plotted correctly." },
  { letter: "B", text: "Gary", ok: true,
    expl: "Gary's table values are (48, 50), but the scatter graph shows his point at (48, 80). The end mark is plotted 30 too high. This is the incorrectly plotted point." },
  { letter: "C", text: "Huw", ok: false,
    expl: "Huw's table values are (40, 35). The scatter graph shows a point at (40, 35). This is plotted correctly." },
  { letter: "D", text: "Ken", ok: false,
    expl: "Ken's table values are (48, 60). The scatter graph shows a point at (48, 60). This is plotted correctly." },
  { letter: "E", text: "Mei", ok: false,
    expl: "Mei's table values are (60, 80). The scatter graph shows a point at (60, 80). This is plotted correctly." },
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
            <span style={{ fontSize: 12, color: C.ps }}>Data Interpretation</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 20</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 20</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 10px" }}>
                Students studying geography at college were tested at the start of the year and at the end of the year. Their marks are shown in the following table.
              </p>
            </div>

            {/* Data table */}
            <div style={{ background: "#1e2030", borderRadius: 10, padding: "14px 12px", marginBottom: 16, overflowX: "auto" }}>
              <DataTable />
            </div>

            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text, marginBottom: 14 }}>
              <p style={{ margin: "0 0 10px" }}>
                The following scatter graph shows the marks for the 12 students, but one of the points has been incorrectly plotted.
              </p>
            </div>

            {/* Scatter graph */}
            <div style={{ background: "#1e2030", borderRadius: 10, padding: "14px 12px", marginBottom: 16, display: "flex", justifyContent: "center" }}>
              <ScatterGraph size={360} />
            </div>

            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: 0 }}>
                <strong style={{ color: C.assum }}>Which student has a mark that is incorrectly plotted on the scatter graph?</strong>
              </p>
            </div>

            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { letter: "A", text: "Ffion" },
                { letter: "B", text: "Gary" },
                { letter: "C", text: "Huw" },
                { letter: "D", text: "Ken" },
                { letter: "E", text: "Mei" },
              ].map(o => (
                <div key={o.letter} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                  <span style={{ background: C.accent + "33", borderRadius: 5, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.accent }}>{o.letter}</span>
                  <span style={{ fontSize: 14, color: C.text }}>{o.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>What we know</span>
              <p style={{ fontSize: 13.5, color: C.text, lineHeight: 1.7, margin: "0 0 14px" }}>
                We have 12 students with starting and end marks. Each student corresponds to one point on the scatter graph, where x = starting mark and y = end mark.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>1</span>
                  <span style={{ fontSize: 13, color: C.text }}>Each student should appear at the point (starting mark, end mark) on the scatter graph.</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>2</span>
                  <span style={{ fontSize: 13, color: C.text }}>One point is incorrectly plotted. We only need to check the five students listed as answer options.</span>
                </div>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  For each option student, read their starting mark and end mark from the table. Then check whether a point exists at those exact coordinates on the scatter graph.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Students to check</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { name: "Ffion", s: 60, e: 56 },
                  { name: "Gary", s: 48, e: 50 },
                  { name: "Huw", s: 40, e: 35 },
                  { name: "Ken", s: 48, e: 60 },
                  { name: "Mei", s: 60, e: 80 },
                ].map((st, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text, minWidth: 50 }}>{st.name}</span>
                    <span style={{ fontSize: 13, color: C.muted, fontFamily: mathFont }}>
                      Expected point: ({st.s}, {st.e})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.calcBg, border: `1px solid ${C.calc}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.calc, fontWeight: 700, whiteSpace: "nowrap" }}>WATCH OUT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  Note that Gary and Ken share the same starting mark of 48, and Ffion and Mei share the same starting mark of 60. Be careful to match each point to the correct student by checking both coordinates.
                </p>
              </div>
            </div>

            {/* Table and graph for reference */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Reference data</span>
              <div style={{ background: "#1e2030", borderRadius: 10, padding: "14px 12px", marginBottom: 14, overflowX: "auto" }}>
                <DataTable />
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ScatterGraph showLabels={true} size={340} />
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
                  Click each student to compare their table values against the plotted point. The scatter graph highlights the selected student.
                </p>
              </div>
            </div>
            <StudentExplorer />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>
                "Which student has a mark that is incorrectly plotted on the scatter graph?"
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>The incorrect point</span>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ScatterGraph showLabels={true} highlightStudent={1} showCorrection={true} size={360} />
              </div>
              <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44`, textAlign: "center" }}>
                <span style={{ fontSize: 13.5, color: C.ok, fontWeight: 600 }}>
                  Gary's point is plotted at (48, 80) instead of (48, 50).
                </span>
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