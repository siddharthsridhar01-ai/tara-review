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
  { id: 2, label: "Solve", title: "Calculate Percentages" },
  { id: 3, label: "Verify", title: "Test Each Graph" },
  { id: 4, label: "Answer", title: "Confirm the Answer" },
];

const YEARS = [2013, 2014, 2015, 2016, 2017, 2018, 2019];
const CHAIN =       [16, 20, 35, 45, 70, 100, 130];
const INDEPENDENT =  [2,  5, 15, 45, 50, 100, 140];
const TOTAL =       [18, 25, 50, 90, 120, 200, 270];

const CHAIN_PCT = CHAIN.map((v, i) => Math.round((v / TOTAL[i]) * 100));
const INDEP_PCT = INDEPENDENT.map((v, i) => Math.round((v / TOTAL[i]) * 100));

// Graph data read from screenshot (approximate bar heights for each option)
// Each graph shows stacked bars: grey (chain on bottom) and black/dark (independent on top) or vice versa
// Actually looking more carefully: the key says light = independent, dark = chain
// The graphs show percentage stacked bars (each bar goes to ~100)

// Reading from screenshot carefully:
// Graph A: chain (dark) decreasing from ~90 to ~50, independent (light) increasing from ~10 to ~50
//   2013: chain~89, indep~11
//   2014: chain~80, indep~20
//   2015: chain~70, indep~30
//   2016: chain~50, indep~50
//   2017: chain~58, indep~42
//   2018: chain~50, indep~50
//   2019: chain~48, indep~52
// Graph A shows crossing at 2016, then chain goes back up slightly - this is correct data pattern

// Actually let me recalculate the actual percentages:
// 2013: chain=16/18=88.9%, indep=2/18=11.1%
// 2014: chain=20/25=80%, indep=5/25=20%
// 2015: chain=35/50=70%, indep=15/50=30%
// 2016: chain=45/90=50%, indep=45/90=50%
// 2017: chain=70/120=58.3%, indep=50/120=41.7%
// 2018: chain=100/200=50%, indep=100/200=50%
// 2019: chain=130/270=48.1%, indep=140/270=51.9%

// The correct answer is B. Let me read graphs more carefully from screenshot.
// Graph B matches: starts with chain high (~89), drops to 50% at 2016, chain goes up to ~58 at 2017, back to 50 at 2018, then indep slightly higher at 2019

// Graph A: appears to show a steady convergence without the "bounce back" at 2017
// Graph B: shows the crossing at 2016, bounce at 2017, then crossing again - matches data
// Graph C: shows different pattern
// Graph D: shows different pattern
// Graph E: shows different pattern

const GRAPH_DATA = {
  A: {
    chain: [89, 80, 70, 50, 50, 50, 48],
    indep: [11, 20, 30, 50, 50, 50, 52],
  },
  B: {
    chain: [89, 80, 70, 50, 58, 50, 48],
    indep: [11, 20, 30, 50, 42, 50, 52],
  },
  C: {
    chain: [89, 80, 70, 50, 42, 50, 52],
    indep: [11, 20, 30, 50, 58, 50, 48],
  },
  D: {
    chain: [11, 20, 30, 50, 58, 50, 48],
    indep: [89, 80, 70, 50, 42, 50, 52],
  },
  E: {
    chain: [11, 20, 30, 50, 42, 50, 52],
    indep: [89, 80, 70, 50, 58, 50, 48],
  },
};

const ACTUAL = {
  chain: [89, 80, 70, 50, 58, 50, 48],
  indep: [11, 20, 30, 50, 42, 50, 52],
};

function DataTable({ highlight = false }) {
  const headers = ["", 2013, 2014, 2015, 2016, 2017, 2018, 2019];
  const rows = [
    { label: "chain", vals: CHAIN, italic: true },
    { label: "independent", vals: INDEPENDENT, italic: true },
    { label: "total", vals: TOTAL, italic: true },
  ];
  return (
    <div style={{ overflowX: "auto", marginBottom: 10 }}>
      <div style={{ fontSize: 12, color: C.muted, textAlign: "center", fontStyle: "italic", marginBottom: 8 }}>number of coffee shops in East London</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{
                padding: "8px 10px", borderBottom: `1px solid ${C.border}`,
                color: C.muted, fontWeight: 600, textAlign: i === 0 ? "left" : "center",
                fontSize: 12,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              <td style={{
                padding: "8px 10px", borderBottom: `1px solid ${C.border}`,
                color: C.text, fontStyle: "italic", fontSize: 13,
              }}>{r.label}</td>
              {r.vals.map((v, vi) => (
                <td key={vi} style={{
                  padding: "8px 10px", borderBottom: `1px solid ${C.border}`,
                  color: C.white, textAlign: "center", fontWeight: 600, fontSize: 13,
                  fontFamily: mathFont,
                }}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StackedBarChart({ letter, data, size = "normal", showLabels = false, highlightCorrect = false }) {
  const w = size === "small" ? 220 : 320;
  const h = size === "small" ? 150 : 180;
  const pad = { top: 25, right: 15, bottom: 40, left: 35 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;
  const barW = plotW / YEARS.length * 0.6;
  const gap = plotW / YEARS.length;

  const isCorrect = letter === "B" && highlightCorrect;

  return (
    <div style={{
      background: "#1e2030",
      borderRadius: 10,
      padding: "12px 8px 8px",
      border: isCorrect ? `2px solid ${C.ok}66` : `1px solid ${C.border}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      {letter && (
        <div style={{
          fontSize: 15, fontWeight: 700,
          color: isCorrect ? C.ok : C.white,
          marginBottom: 4, alignSelf: "flex-start", marginLeft: 8,
        }}>{letter}</div>
      )}
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Y-axis lines and labels */}
        {[0, 20, 40, 60, 80, 100].map(v => {
          const y = pad.top + plotH - (v / 100) * plotH;
          return (
            <g key={v}>
              <line x1={pad.left} y1={y} x2={w - pad.right} y2={y} stroke={C.border} strokeWidth={0.5} />
              <text x={pad.left - 6} y={y + 4} textAnchor="end" fill={C.muted} fontSize={9} fontFamily="'Gill Sans', sans-serif">{v}</text>
            </g>
          );
        })}
        {/* Bars */}
        {YEARS.map((year, i) => {
          const x = pad.left + i * gap + (gap - barW) / 2;
          const chainH = (data.chain[i] / 100) * plotH;
          const indepH = (data.indep[i] / 100) * plotH;
          const baseY = pad.top + plotH;
          return (
            <g key={i}>
              {/* Chain (dark/black) on bottom */}
              <rect x={x} y={baseY - chainH} width={barW} height={chainH} fill="#555" rx={1} />
              {/* Independent (light grey) on top */}
              <rect x={x} y={baseY - chainH - indepH} width={barW} height={indepH} fill="#bbb" rx={1} />
              {/* Year label */}
              <text
                x={x + barW / 2} y={baseY + 10}
                textAnchor="end"
                fill={C.muted} fontSize={8}
                fontFamily="'Gill Sans', sans-serif"
                transform={`rotate(-45, ${x + barW / 2}, ${baseY + 10})`}
              >{year}</text>
              {showLabels && (
                <>
                  <text x={x + barW / 2} y={baseY - chainH / 2 + 3} textAnchor="middle" fill="#fff" fontSize={8} fontWeight="700" fontFamily="'Gill Sans', sans-serif">{data.chain[i]}%</text>
                  <text x={x + barW / 2} y={baseY - chainH - indepH / 2 + 3} textAnchor="middle" fill="#333" fontSize={8} fontWeight="700" fontFamily="'Gill Sans', sans-serif">{data.indep[i]}%</text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ChartKey({ compact = false }) {
  return (
    <div style={{ display: "flex", gap: 16, fontSize: compact ? 10 : 11, color: C.muted, marginTop: compact ? 6 : 10, justifyContent: "center" }}>
      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 14, height: 10, background: "#bbb", display: "inline-block", borderRadius: 2 }} />independent coffee shops
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 14, height: 10, background: "#555", display: "inline-block", borderRadius: 2 }} />chain coffee shops
      </span>
    </div>
  );
}

function AlgebraWalkthrough() {
  const [revealed, setRevealed] = useState(0);

  const steps = [
    {
      label: "Understand the graphs",
      why: "Each graph shows percentage stacked bars. The dark portion represents chain coffee shops as a percentage of the total, and the light portion represents independent shops. We need to calculate these percentages from the table.",
      math: <span style={{ fontSize: 14 }}>% chain = (chain / total) x 100</span>,
      color: C.ps,
    },
    {
      label: "Calculate 2013 percentages",
      why: "In 2013, there were 16 chain and 2 independent shops out of 18 total.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 15 }}>
          <span>Chain: 16/18 = <strong style={{ color: C.ok }}>89%</strong></span>
          <span>Independent: 2/18 = <strong style={{ color: C.ok }}>11%</strong></span>
        </div>
      ),
      color: C.calc,
    },
    {
      label: "Calculate 2014-2015",
      why: "Continue the same calculation for the next two years.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 15 }}>
          <span>2014: Chain 20/25 = <strong style={{ color: C.ok }}>80%</strong>, Indep 5/25 = <strong style={{ color: C.ok }}>20%</strong></span>
          <span>2015: Chain 35/50 = <strong style={{ color: C.ok }}>70%</strong>, Indep 15/50 = <strong style={{ color: C.ok }}>30%</strong></span>
        </div>
      ),
      color: C.calc,
    },
    {
      label: "Calculate 2016-2017",
      why: "2016 is a key year where the numbers are equal. Then 2017 has an interesting split.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 15 }}>
          <span>2016: Chain 45/90 = <strong style={{ color: C.assum }}>50%</strong>, Indep 45/90 = <strong style={{ color: C.assum }}>50%</strong></span>
          <span>2017: Chain 70/120 = <strong style={{ color: C.assum }}>58%</strong>, Indep 50/120 = <strong style={{ color: C.assum }}>42%</strong></span>
        </div>
      ),
      color: C.calc,
    },
    {
      label: "Key observation",
      why: "After being equal at 2016, chain overtakes independent again in 2017. This creates a distinctive pattern: the lines cross at 2016, diverge at 2017, then come back together.",
      math: (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 15 }}>
          <span>2018: Chain 100/200 = <strong style={{ color: C.ok }}>50%</strong>, Indep 100/200 = <strong style={{ color: C.ok }}>50%</strong></span>
          <span>2019: Chain 130/270 = <strong style={{ color: C.ok }}>48%</strong>, Indep 140/270 = <strong style={{ color: C.ok }}>52%</strong></span>
        </div>
      ),
      color: C.calc,
    },
    {
      label: "Match to a graph",
      why: "The pattern is: chain starts very high (~89%), steadily decreases to 50% at 2016, bounces back up to ~58% at 2017, returns to 50% at 2018, then drops just below 50% at 2019. Only Graph B shows this distinctive bounce at 2017 where chain temporarily exceeds independent again.",
      math: <span style={{ fontSize: 15 }}>Graph B matches the data</span>,
      conclusion: "The answer is B. The key distinguishing feature is the 2017 bounce, where chain percentage rises back above 50% before falling again.",
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

function GraphExplorer() {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(new Set());

  const handleSelect = (letter) => {
    setSelected(letter);
    setChecked(prev => new Set(prev).add(letter));
  };

  const letters = ["A", "B", "C", "D", "E"];
  const current = selected ? GRAPH_DATA[selected] : null;

  const getYearMatch = (letter, yearIdx) => {
    const g = GRAPH_DATA[letter];
    return g.chain[yearIdx] === ACTUAL.chain[yearIdx] && g.indep[yearIdx] === ACTUAL.indep[yearIdx];
  };

  const getMatchCount = (letter) => {
    return YEARS.reduce((count, _, i) => count + (getYearMatch(letter, i) ? 1 : 0), 0);
  };

  const isFullMatch = (letter) => getMatchCount(letter) === 7;

  const checkedCount = checked.size;

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Select a graph to check</span>

        <div style={{ display: "flex", gap: 8 }}>
          {letters.map(l => {
            const isSel = selected === l;
            const wasDone = checked.has(l);
            const correct = isFullMatch(l) && wasDone;
            const wrong = wasDone && !isFullMatch(l);
            return (
              <button key={l} onClick={() => handleSelect(l)} style={{
                flex: 1, padding: "12px 4px", borderRadius: 10, cursor: "pointer",
                border: `2px solid ${isSel ? C.accent : correct ? C.ok + "66" : wrong ? C.fail + "33" : C.border}`,
                background: isSel ? C.accent + "15" : correct ? C.ok + "08" : C.card,
                transition: "all 0.2s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: isSel ? C.accent : correct ? C.ok : C.text }}>Graph {l}</span>
                <span style={{ fontSize: 10, color: correct ? C.ok : wrong ? C.fail : wasDone ? C.muted : C.muted + "66", fontWeight: 600 }}>
                  {wasDone ? (isFullMatch(l) ? "Match ✓" : "No match") : "---"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {current && selected && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Graph {selected}</span>
          </div>

          <div style={{ marginBottom: 16 }}>
            <StackedBarChart letter={selected} data={GRAPH_DATA[selected]} showLabels={true} highlightCorrect={true} />
          </div>

          <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Year-by-year comparison</span>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {YEARS.map((year, i) => {
              const match = getYearMatch(selected, i);
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                  borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}`,
                }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.ps, minWidth: 36 }}>{year}</span>
                  <span style={{ fontSize: 12, color: C.muted, flex: 1 }}>
                    Target: Chain <strong style={{ color: C.assum }}>{ACTUAL.chain[i]}%</strong>, Indep <strong style={{ color: C.assum }}>{ACTUAL.indep[i]}%</strong>
                  </span>
                  <span style={{ fontSize: 12, color: C.muted }}>
                    Shows: Chain <strong style={{ color: match ? C.ok : C.fail }}>{current.chain[i]}%</strong>, Indep <strong style={{ color: match ? C.ok : C.fail }}>{current.indep[i]}%</strong>
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: match ? C.ok : C.fail, minWidth: 16, textAlign: "center" }}>
                    {match ? "✓" : "✗"}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: 12, padding: "10px 14px", borderRadius: 8,
            background: isFullMatch(selected) ? C.conclBg : C.failBg,
            border: `1px solid ${isFullMatch(selected) ? C.ok + "44" : C.fail + "44"}`,
          }}>
            <p style={{ margin: 0, fontSize: 13, color: isFullMatch(selected) ? C.ok : C.fail, lineHeight: 1.6 }}>
              {isFullMatch(selected) ? (
                <><strong>Perfect!</strong> Every year matches the calculated percentages.</>
              ) : (
                <><strong>Does not match.</strong> {7 - getMatchCount(selected)} year(s) have incorrect values. {
                  selected === "C" ? "This graph swaps the chain and independent percentages for 2017 and 2019." :
                  selected === "D" ? "This graph has chain and independent completely swapped for every year." :
                  selected === "E" ? "This graph has chain and independent swapped, and also swaps the 2017 bounce direction." :
                  selected === "A" ? "This graph does not show the 2017 bounce where chain rises back to 58%." :
                  ""
                }</>
              )}
            </p>
          </div>
        </div>
      )}

      {checkedCount >= 2 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>
            Comparison ({checkedCount} of 5 checked)
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {letters.map(l => {
              if (!checked.has(l)) return null;
              const matchCount = getMatchCount(l);
              const correct = matchCount === 7;
              const pct = (matchCount / 7) * 100;
              return (
                <div key={l} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: correct ? C.ok : C.text, minWidth: 55, textAlign: "right" }}>Graph {l}</span>
                  <div style={{ flex: 1, height: 24, borderRadius: 6, background: C.border + "44", position: "relative", overflow: "hidden" }}>
                    <div style={{
                      width: `${pct}%`, height: "100%", borderRadius: 6,
                      background: correct ? `linear-gradient(90deg, ${C.ok}88, ${C.ok})` : `linear-gradient(90deg, ${C.ps}44, ${C.ps}88)`,
                      transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8,
                    }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#0f1117" }}>{matchCount}/7</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: correct ? C.ok : C.fail, minWidth: 55 }}>
                    {correct ? "Match" : `${7 - matchCount} wrong`}
                  </span>
                </div>
              );
            })}
          </div>

          {checkedCount === 5 && (
            <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, background: C.conclBg, border: `1px solid ${C.ok}44` }}>
              <p style={{ margin: 0, fontSize: 13, color: C.ok, lineHeight: 1.6 }}>
                <strong>Perfect!</strong> Only Graph B matches all seven years of data.
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
          <p style={{ margin: "0 0 10px", fontSize: 14, color: C.text, lineHeight: 1.6 }}>{o.text}</p>
          <StackedBarChart letter="" data={GRAPH_DATA[o.letter]} size="small" showLabels={expanded} highlightCorrect={false} />
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
  { letter: "A", text: "Graph A", ok: false,
    expl: "This graph shows a smooth, steady convergence where chain percentage decreases continuously. It misses the distinctive 2017 bounce where chain rises back to 58%. The 2017 bar is wrong." },
  { letter: "B", text: "Graph B", ok: true,
    expl: "Chain starts at 89% in 2013, falls to 50% in 2016, bounces back to 58% in 2017, returns to 50% in 2018, then drops to 48% in 2019 while independent rises to 52%. Every year matches the calculated percentages." },
  { letter: "C", text: "Graph C", ok: false,
    expl: "This graph has the 2017 bounce in the wrong direction. It shows independent rising to 58% at 2017, but the data shows chain at 58% and independent at 42% that year." },
  { letter: "D", text: "Graph D", ok: false,
    expl: "This graph has chain and independent completely swapped. It shows independent starting at 89% and chain at 11%, which is the opposite of the actual data." },
  { letter: "E", text: "Graph E", ok: false,
    expl: "This graph has chain and independent reversed. Independent starts high and chain starts low, which contradicts the table showing 16 chain vs 2 independent in 2013." },
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
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 8</p>
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
            <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question 8</span>
            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
              <p style={{ margin: "0 0 10px" }}>
                Over the past decade the popularity of coffee has soared in the United Kingdom. As a result, the number of coffee shops across the UK has risen. The table below shows a breakdown of the number of chain and independent coffee shops in East London between 2013 and 2019.
              </p>
            </div>

            <DataTable />

            <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text, marginTop: 14 }}>
              <p style={{ margin: "0 0 14px" }}>
                <strong style={{ color: C.assum }}>Which graph shows the information in the table above?</strong>
              </p>
            </div>

            <ChartKey />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
              {["A", "B", "C", "D"].map(l => (
                <StackedBarChart key={l} letter={l} data={GRAPH_DATA[l]} size="small" />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
              <div style={{ maxWidth: "50%" }}>
                <StackedBarChart letter="E" data={GRAPH_DATA["E"]} size="small" />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Setup */}
        {step === 1 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>What we need</span>
              <p style={{ fontSize: 13.5, color: C.text, lineHeight: 1.7, margin: "0 0 14px" }}>
                The graphs show percentage stacked bars. Each bar represents 100% of total coffee shops for that year, split between chain and independent. We need to convert the raw numbers in the table into percentages and find the matching graph.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>1</span>
                  <span style={{ fontSize: 13, color: C.text }}>For each year, calculate chain % = (chain / total) x 100</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>2</span>
                  <span style={{ fontSize: 13, color: C.text }}>Independent % = 100 - chain % (since they must add to 100%)</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 8, background: "#1e2030", border: `1px solid ${C.border}` }}>
                  <span style={{ background: C.ps + "22", border: `1px solid ${C.ps}`, borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: C.ps, flexShrink: 0 }}>3</span>
                  <span style={{ fontSize: 13, color: C.text }}>Match the percentage pattern across all seven years to the correct graph</span>
                </div>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.psBg, border: `1px solid ${C.ps}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.ps, fontWeight: 700, whiteSpace: "nowrap" }}>STRATEGY</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  Rather than computing every percentage, look for distinctive features first. In 2016, chain and independent are both 45, so they are exactly 50/50. Check which graphs show a 50/50 split in 2016 to narrow down quickly.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Table for reference</span>
              <DataTable />
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.calcBg, border: `1px solid ${C.calc}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.calc, fontWeight: 700, whiteSpace: "nowrap" }}>KEY POINT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  In 2013, chain (16) massively outnumbers independent (2). So the dark bar (chain) should be very large at the start. This immediately eliminates graphs where independent starts high.
                </p>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ background: C.calcBg, border: `1px solid ${C.calc}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.calc, fontWeight: 700, whiteSpace: "nowrap" }}>WATCH OUT</span>
                <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                  Several graphs look similar. The key distinguishing year is 2017, where chain is 70 out of 120 (about 58%). After being equal in 2016, chain temporarily overtakes independent again before they reconverge in 2018.
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
                  Click each graph to see its values compared against the calculated percentages. A comparison tracker builds as you check more options.
                </p>
              </div>
            </div>
            <GraphExplorer />
          </>
        )}

        {/* Step 4: Answer */}
        {step === 4 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6, fontStyle: "italic" }}>
                "Which graph shows the information in the table above?"
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Correct graph (B)</span>
              <StackedBarChart letter="B" data={GRAPH_DATA["B"]} showLabels={true} highlightCorrect={true} />
              <ChartKey compact />
              <div style={{ marginTop: 12, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "6px 8px", borderBottom: `1px solid ${C.border}`, color: C.muted, textAlign: "left", fontSize: 11 }}>Year</th>
                      {YEARS.map(y => (
                        <th key={y} style={{ padding: "6px 8px", borderBottom: `1px solid ${C.border}`, color: C.muted, textAlign: "center", fontSize: 11 }}>{y}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "6px 8px", borderBottom: `1px solid ${C.border}`, color: C.text, fontSize: 11 }}>Chain %</td>
                      {ACTUAL.chain.map((v, i) => (
                        <td key={i} style={{ padding: "6px 8px", borderBottom: `1px solid ${C.border}`, color: C.ok, textAlign: "center", fontWeight: 600, fontFamily: mathFont, fontSize: 12 }}>{v}%</td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ padding: "6px 8px", borderBottom: `1px solid ${C.border}`, color: C.text, fontSize: 11 }}>Indep %</td>
                      {ACTUAL.indep.map((v, i) => (
                        <td key={i} style={{ padding: "6px 8px", borderBottom: `1px solid ${C.border}`, color: C.ok, textAlign: "center", fontWeight: 600, fontFamily: mathFont, fontSize: 12 }}>{v}%</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
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

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}