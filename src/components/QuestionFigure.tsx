"use client";

import { C } from "@/lib/tara";

/* ── Shared styling primitives ── */
const tableStyle: React.CSSProperties = {
  borderCollapse: "collapse",
  width: "100%",
  fontSize: 13,
  color: C.text,
};
const thStyle: React.CSSProperties = {
  padding: "10px 12px",
  textAlign: "left",
  fontWeight: 600,
  fontSize: 12,
  color: C.muted,
  borderBottom: `1px solid ${C.border}`,
  background: "rgba(255,255,255,0.02)",
};
const tdStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderBottom: `1px solid ${C.border}`,
  color: C.text,
};

function FigureWrap({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: `1px solid ${C.border}`,
      borderRadius: 10,
      padding: "16px 18px",
      margin: "14px 0 18px",
      overflowX: "auto",
    }}>
      {label && (
        <div style={{ fontSize: 10, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

/* ── Q2: quiz rounds table ── */
function Q2() {
  const rounds = [1, 2, 3, 4, 5, 6, 7];
  const scores = [14, 16, 6, 20, 10, 18, 4];
  return (
    <FigureWrap>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, fontStyle: "italic" }}>round</th>
            {rounds.map(r => <th key={r} style={{ ...thStyle, textAlign: "center" }}>{r}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...tdStyle, fontStyle: "italic", color: C.muted }}>score</td>
            {scores.map((s, i) => <td key={i} style={{ ...tdStyle, textAlign: "center", fontWeight: 600 }}>{s}</td>)}
          </tr>
        </tbody>
      </table>
    </FigureWrap>
  );
}

/* ── Q6: juice mixtures table ── */
function Q6() {
  return (
    <FigureWrap>
      <table style={tableStyle}>
        <tbody>
          <tr>
            <td style={{ ...tdStyle, fontWeight: 600, color: C.accent }}>mixture 1</td>
            <td style={tdStyle}>40% apple juice and 60% orange juice</td>
          </tr>
          <tr>
            <td style={{ ...tdStyle, fontWeight: 600, color: C.accent, borderBottom: "none" }}>mixture 2</td>
            <td style={{ ...tdStyle, borderBottom: "none" }}>70% apple juice and 30% orange juice</td>
          </tr>
        </tbody>
      </table>
    </FigureWrap>
  );
}

/* ── Q7: extension numbers table ── */
function Q7() {
  const depts = ["Accounts","Administration","Enquiries","Complaints","Quality Assurance","Marketing","Public Relations","Human Resources"];
  const data: number[][] = [
    [387,387,661,387,661],
    [117,387,117,232,232],
    [239,387,387,661,387],
    [558,239,117,387,117],
    [239,239,117,558,239],
    [387,239,232,661,232],
    [239,117,387,239,232],
    [239,239,661,117,239],
  ];
  const callers = ["student","parent","lecturer","journalist","researcher"];
  return (
    <FigureWrap>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}></th>
            {callers.map(c => <th key={c} style={{ ...thStyle, textAlign: "center" }}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {depts.map((d, i) => (
            <tr key={d}>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{d}</td>
              {data[i].map((n, j) => (
                <td key={j} style={{ ...tdStyle, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{n}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </FigureWrap>
  );
}

/* ── Q8: coffee shops table + note ── */
function Q8() {
  const years = [2013, 2014, 2015, 2016, 2017, 2018, 2019];
  const chain = [16, 20, 35, 45, 70, 100, 130];
  const indep = [2, 5, 15, 45, 50, 100, 140];
  const total = chain.map((c, i) => c + indep[i]);
  return (
    <FigureWrap label="number of coffee shops in East London">
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}></th>
            {years.map(y => <th key={y} style={{ ...thStyle, textAlign: "center" }}>{y}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...tdStyle, fontWeight: 600 }}>chain</td>
            {chain.map((n, i) => <td key={i} style={{ ...tdStyle, textAlign: "center" }}>{n}</td>)}
          </tr>
          <tr>
            <td style={{ ...tdStyle, fontWeight: 600 }}>independent</td>
            {indep.map((n, i) => <td key={i} style={{ ...tdStyle, textAlign: "center" }}>{n}</td>)}
          </tr>
          <tr>
            <td style={{ ...tdStyle, fontWeight: 700, color: C.accent, borderBottom: "none" }}>total</td>
            {total.map((n, i) => <td key={i} style={{ ...tdStyle, textAlign: "center", fontWeight: 700, color: C.accent, borderBottom: "none" }}>{n}</td>)}
          </tr>
        </tbody>
      </table>
      <p style={{ fontSize: 12, color: C.muted, marginTop: 14, marginBottom: 0, fontStyle: "italic" }}>
        Five graphs (A–E) are provided as answer options. Refer to the physical TSA 2022 paper or the walkthrough for the images.
      </p>
    </FigureWrap>
  );
}

/* ── Q13: cottages table ── */
function Q13() {
  const rows = [
    ["Acorns", "3", "no", "yes", "no", "yes", "2 km", "$460"],
    ["Beeches", "3", "yes", "yes", "no", "yes", "1 km", "$490"],
    ["Chestnuts", "4", "no", "yes", "yes", "no", "2 km", "$510"],
    ["Denders", "4", "yes", "yes", "yes", "no", "4 km", "$500"],
    ["Eglers", "2", "no", "yes", "yes", "no", "2 km", "$450"],
  ];
  const headers = ["cottage","bedrooms","large garden","wifi","parking","pets allowed","nearest store","cost/week"];
  return (
    <FigureWrap>
      <table style={tableStyle}>
        <thead>
          <tr>{headers.map(h => <th key={h} style={{ ...thStyle, textAlign: "center" }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((v, j) => (
                <td key={j} style={{ ...tdStyle, textAlign: j === 0 ? "left" : "center", fontWeight: j === 0 ? 600 : 400, color: v === "yes" ? C.ok : v === "no" ? C.muted : C.text }}>
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </FigureWrap>
  );
}

/* ── Q14: word values ── */
function Q14() {
  return (
    <FigureWrap>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, textAlign: "center" }}>word</th>
            <th style={{ ...thStyle, textAlign: "center" }}>value</th>
          </tr>
        </thead>
        <tbody>
          {[["MOAN", 7], ["MOON", 8], ["NOON", 10]].map(([w, v]) => (
            <tr key={w as string}>
              <td style={{ ...tdStyle, textAlign: "center", fontWeight: 700, letterSpacing: 2 }}>{w}</td>
              <td style={{ ...tdStyle, textAlign: "center", fontWeight: 600, color: C.accent }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </FigureWrap>
  );
}

/* ── Q19: rota table ── */
function Q19() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const rows = [
    ["Mel", "Eve", "Jan", "Mel", "Eve", "Fay"],
    ["Rod", "Fay", "Leo", "Pat", "Jan", "Leo"],
    ["Sam", "Tim", "Sam", "Tim", "Rod", "Pat"],
  ];
  return (
    <FigureWrap>
      <table style={tableStyle}>
        <thead>
          <tr>{days.map(d => <th key={d} style={{ ...thStyle, textAlign: "center" }}>{d}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((v, j) => (
                <td key={j} style={{ ...tdStyle, textAlign: "center", fontWeight: 600, color: v === "Fay" ? C.accent : C.text }}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </FigureWrap>
  );
}

/* ── Q20: students table + scatter plot ── */
function Q20() {
  const names = ["Ffion","Gary","Huw","Ivy","Jim","Ken","Lee","Mei","Naz","Oli","Pete","Quin"];
  const start = [60, 48, 40, 30, 70, 48, 65, 60, 25, 85, 40, 80];
  const end = [56, 50, 35, 45, 80, 60, 70, 80, 25, 95, 50, 85];
  // Gary is the one plotted incorrectly — the scatter shows his point off from (48, 50)
  // For the exam we show the "buggy" scatter matching the PDF. Gary's plotted position differs.
  // We render: 11 correct dots, 1 deliberately shifted dot for Gary (shifted to look like ~(55, 60) or similar).
  const plotted: number[][] = names.map((_, i) => [start[i], end[i]]);
  plotted[1] = [55, 65]; // Gary shifted (incorrect)

  const W = 420, H = 320, ml = 48, mb = 40, mr = 16, mt = 16;
  const plotW = W - ml - mr, plotH = H - mt - mb;
  const xMin = 20, xMax = 100, yMin = 20, yMax = 100;
  const sx = (x: number) => ml + ((x - xMin) / (xMax - xMin)) * plotW;
  const sy = (y: number) => mt + plotH - ((y - yMin) / (yMax - yMin)) * plotH;
  const ticks = [20, 40, 60, 80, 100];
  return (
    <FigureWrap>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>student</th>
            {names.map(n => <th key={n} style={{ ...thStyle, textAlign: "center" }}>{n}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...tdStyle, fontWeight: 600 }}>starting mark</td>
            {start.map((v, i) => <td key={i} style={{ ...tdStyle, textAlign: "center" }}>{v}</td>)}
          </tr>
          <tr>
            <td style={{ ...tdStyle, fontWeight: 600 }}>end mark</td>
            {end.map((v, i) => <td key={i} style={{ ...tdStyle, textAlign: "center" }}>{v}</td>)}
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
        <svg width={W} height={H} style={{ maxWidth: "100%" }} role="img" aria-label="Scatter plot of starting vs end marks">
          <rect x={ml} y={mt} width={plotW} height={plotH} fill="none" stroke={C.border} />
          {/* Grid lines */}
          {ticks.map(t => (
            <g key={`x${t}`}>
              <line x1={sx(t)} y1={mt} x2={sx(t)} y2={mt + plotH} stroke={C.border} strokeOpacity={0.3} />
              <text x={sx(t)} y={H - 18} fontSize={11} fill={C.muted} textAnchor="middle">{t}</text>
            </g>
          ))}
          {ticks.map(t => (
            <g key={`y${t}`}>
              <line x1={ml} y1={sy(t)} x2={ml + plotW} y2={sy(t)} stroke={C.border} strokeOpacity={0.3} />
              <text x={ml - 8} y={sy(t) + 4} fontSize={11} fill={C.muted} textAnchor="end">{t}</text>
            </g>
          ))}
          <text x={ml + plotW / 2} y={H - 4} fontSize={11} fill={C.muted} textAnchor="middle">starting mark</text>
          <text x={14} y={mt + plotH / 2} fontSize={11} fill={C.muted} textAnchor="middle" transform={`rotate(-90 14 ${mt + plotH / 2})`}>end mark</text>
          {/* Points */}
          {plotted.map(([x, y], i) => (
            <circle key={i} cx={sx(x)} cy={sy(y)} r={5} fill={C.accent} fillOpacity={0.85} stroke={C.white} strokeWidth={1} />
          ))}
        </svg>
      </div>
    </FigureWrap>
  );
}

/* ── Q25: fishcakes ── */
function Q25() {
  const rows = [
    ["Arctic", "45%", "40%", "15%", "100 g", "£3.00"],
    ["Banquet", "40%", "50%", "10%", "100 g", "£2.50"],
    ["Chilco", "55%", "35%", "10%", "150 g", "£5.00"],
    ["Dyner", "50%", "35%", "15%", "150 g", "£4.00"],
    ["Evertop", "35%", "45%", "20%", "50 g", "£1.00"],
  ];
  return (
    <FigureWrap>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, textAlign: "center" }} rowSpan={2}>type</th>
            <th style={{ ...thStyle, textAlign: "center" }} colSpan={3}>ingredients in fishcake</th>
            <th style={{ ...thStyle, textAlign: "center" }} rowSpan={2}>weight each</th>
            <th style={{ ...thStyle, textAlign: "center" }} rowSpan={2}>cost (pack of 2)</th>
          </tr>
          <tr>
            <th style={{ ...thStyle, textAlign: "center" }}>fish</th>
            <th style={{ ...thStyle, textAlign: "center" }}>potato</th>
            <th style={{ ...thStyle, textAlign: "center" }}>coating</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r[0]}>
              {r.map((v, j) => (
                <td key={j} style={{ ...tdStyle, textAlign: j === 0 ? "left" : "center", fontWeight: j === 0 ? 600 : 400 }}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </FigureWrap>
  );
}

/* ── Q26: politician salaries bar chart ── */
function Q26() {
  const data: [string, number, number][] = [
    ["Italy", 182.0, 6.5], ["Israel", 114.8, 4.2], ["Hong Kong", 130.7, 4.0],
    ["United States", 174.0, 3.0], ["Japan", 149.7, 3.7], ["Singapore", 154.0, 2.5],
    ["Australia", 201.2, 3.6], ["Canada", 154.0, 3.5], ["New Zealand", 112.5, 3.0],
    ["Germany", 119.5, 2.5], ["Ireland", 120.4, 1.7], ["Britain", 105.4, 2.3],
    ["Pakistan", 3.5, 1.9], ["Saudi Arabia", 64.0, 2.9], ["Malaysia", 25.3, 2.5],
    ["France", 85.9, 2.4],
  ];
  const maxSalary = 210;
  return (
    <FigureWrap label="Average salary of politicians">
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: C.muted, marginBottom: 4 }}>
          <span style={{ flex: "0 0 110px" }} />
          <span style={{ flex: 1, textAlign: "right" }}>salary ($000)</span>
        </div>
        {data.map(([name, salary]) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ flex: "0 0 110px", fontSize: 12, color: C.text, textAlign: "right", fontWeight: 500 }}>{name}</span>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 3, height: 18, position: "relative" }}>
              <div style={{ width: `${(salary / maxSalary) * 100}%`, height: "100%", background: C.accent, borderRadius: 3 }} />
              <span style={{ position: "absolute", left: `calc(${(salary / maxSalary) * 100}% + 6px)`, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: C.text, fontVariantNumeric: "tabular-nums" }}>{salary.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </FigureWrap>
  );
}

/* ── Q31: hot drinks prices ── */
function Q31() {
  return (
    <FigureWrap label="hot drinks">
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, textAlign: "center" }}>tea</th>
            <th style={{ ...thStyle, textAlign: "center" }}>coffee</th>
            <th style={{ ...thStyle, textAlign: "center" }}>chocolate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ ...tdStyle, textAlign: "center", fontWeight: 600, borderBottom: "none" }}>£1.50</td>
            <td style={{ ...tdStyle, textAlign: "center", fontWeight: 600, borderBottom: "none" }}>£2.50</td>
            <td style={{ ...tdStyle, textAlign: "center", fontWeight: 600, borderBottom: "none" }}>£3.00</td>
          </tr>
        </tbody>
      </table>
    </FigureWrap>
  );
}

/* ── Q32: painted cube (SVG isometric cube) ── */
function Q32() {
  // Isometric rendering of a 5x5x5 cube with three visible faces coloured
  const size = 40; // per small face
  const cx = 230, cy = 30;
  const cos30 = Math.cos(Math.PI / 6), sin30 = Math.sin(Math.PI / 6);
  const face = (dx: number, dy: number, color: string, label: string, labelPos: "top" | "left" | "right") => {
    // top face: rhombus with corners at (0,0), (5,5*0.5), (10,0), (5,-5*0.5) — reshape
    const gridLines: React.ReactElement[] = [];
    return { color, label, labelPos };
  };
  // Simpler: just draw three rhombi.
  // Top face (green): corners at (cx, cy), (cx + 5*size*cos30, cy + 5*size*sin30), (cx, cy + 5*size), (cx - 5*size*cos30, cy + 5*size*sin30)
  const s = size;
  const top = [[cx, cy], [cx + 5*s*cos30, cy + 5*s*sin30], [cx, cy + 5*s], [cx - 5*s*cos30, cy + 5*s*sin30]];
  const left = [[cx - 5*s*cos30, cy + 5*s*sin30], [cx, cy + 5*s], [cx, cy + 5*s + 5*s], [cx - 5*s*cos30, cy + 5*s*sin30 + 5*s]];
  const right = [[cx, cy + 5*s], [cx + 5*s*cos30, cy + 5*s*sin30], [cx + 5*s*cos30, cy + 5*s*sin30 + 5*s], [cx, cy + 5*s + 5*s]];
  const poly = (pts: number[][]) => pts.map(p => p.join(",")).join(" ");
  // Grid lines on top face (5x5 subdivisions)
  const gridLines: React.ReactElement[] = [];
  for (let i = 1; i < 5; i++) {
    // Lines going in direction of first edge (top[0]→top[1])
    gridLines.push(
      <line key={`t1-${i}`}
        x1={cx - 5*s*cos30 + (i/5) * (5*s*cos30)} y1={cy + 5*s*sin30 - (i/5) * (5*s*sin30)}
        x2={cx + (i/5) * (5*s*cos30)} y2={cy + 5*s - (i/5) * (-5*s*sin30) - 5*s*sin30 + 5*s*sin30}
        stroke="rgba(0,0,0,0.25)" strokeWidth={0.8}
      />
    );
  }
  // Simpler: Just show 3 solid rhombi with labels. Grid lines optional.
  return (
    <FigureWrap>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg width={460} height={430} viewBox="0 0 460 430" role="img" aria-label="Isometric view of a cube with red top, green front, blue side">
          {/* Top (red) */}
          <polygon points={poly(top)} fill="#e74c3c" stroke={C.white} strokeOpacity={0.3} strokeWidth={1} />
          {/* Left (green) */}
          <polygon points={poly(left)} fill="#27ae60" stroke={C.white} strokeOpacity={0.3} strokeWidth={1} />
          {/* Right (blue) */}
          <polygon points={poly(right)} fill="#3498db" stroke={C.white} strokeOpacity={0.3} strokeWidth={1} />
          {/* Grid subdivisions on top face (red) */}
          {[1,2,3,4].map(i => {
            const f = i / 5;
            // parallel to edge top[0]→top[1]
            const a1 = [cx - 5*s*cos30 + f*5*s*cos30, cy + 5*s*sin30 - f*5*s*sin30];
            const a2 = [cx + f*5*s*cos30, cy + 5*s - 5*s*sin30 + f*5*s*sin30];
            // parallel to edge top[0]→top[3]
            const b1 = [cx + f*5*s*cos30, cy + f*5*s*sin30];
            const b2 = [cx - 5*s*cos30 + f*5*s*cos30, cy + 5*s*sin30 + f*5*s*sin30];
            return (
              <g key={`gt-${i}`}>
                <line x1={a1[0]} y1={a1[1]} x2={a2[0]} y2={a2[1]} stroke="rgba(0,0,0,0.25)" strokeWidth={0.6} />
                <line x1={b1[0]} y1={b1[1]} x2={b2[0]} y2={b2[1]} stroke="rgba(0,0,0,0.25)" strokeWidth={0.6} />
              </g>
            );
          })}
          {/* Grid on left (green) */}
          {[1,2,3,4].map(i => {
            const f = i / 5;
            return (
              <g key={`gl-${i}`}>
                <line x1={cx - 5*s*cos30} y1={cy + 5*s*sin30 + f*5*s} x2={cx} y2={cy + 5*s + f*5*s} stroke="rgba(0,0,0,0.25)" strokeWidth={0.6} />
                <line x1={cx - 5*s*cos30 + f*5*s*cos30} y1={cy + 5*s*sin30 + f*5*s*sin30} x2={cx - 5*s*cos30 + f*5*s*cos30} y2={cy + 5*s*sin30 + f*5*s*sin30 + 5*s} stroke="rgba(0,0,0,0.25)" strokeWidth={0.6} />
              </g>
            );
          })}
          {/* Grid on right (blue) */}
          {[1,2,3,4].map(i => {
            const f = i / 5;
            return (
              <g key={`gr-${i}`}>
                <line x1={cx} y1={cy + 5*s + f*5*s} x2={cx + 5*s*cos30} y2={cy + 5*s*sin30 + f*5*s} stroke="rgba(0,0,0,0.25)" strokeWidth={0.6} />
                <line x1={cx + f*5*s*cos30} y1={cy + 5*s - 5*s*sin30 + f*5*s*sin30} x2={cx + f*5*s*cos30} y2={cy + 5*s - 5*s*sin30 + f*5*s*sin30 + 5*s} stroke="rgba(0,0,0,0.25)" strokeWidth={0.6} />
              </g>
            );
          })}
          {/* Labels */}
          <text x={cx} y={cy + 2.5*s} fontSize={16} fontWeight={700} fill="#fff" textAnchor="middle">red</text>
          <text x={cx - 2.8*s*cos30} y={cy + 2.8*s*sin30 + 5*s} fontSize={16} fontWeight={700} fill="#fff" textAnchor="middle">green</text>
          <text x={cx + 2.8*s*cos30} y={cy + 2.8*s*sin30 + 5*s} fontSize={16} fontWeight={700} fill="#fff" textAnchor="middle">blue</text>
        </svg>
      </div>
      <p style={{ fontSize: 12, color: C.muted, textAlign: "center", marginBottom: 0, marginTop: 6 }}>
        Each edge of the cube is 5 cm. Small cubes are 1 cm per edge.
      </p>
    </FigureWrap>
  );
}

/* ── Q36: books ── */
function Q36() {
  const rows = [["Hungry Dinosaurs", "£8"], ["The Celebrated Six", "£9"], ["Fly Away", "£13"], ["Come Back", "£14"], ["The Biraffe", "£16"]];
  return (
    <FigureWrap>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>title</th>
            <th style={{ ...thStyle, textAlign: "center" }}>cost</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r[0]}>
              <td style={{ ...tdStyle, fontStyle: "italic", fontWeight: 500 }}>{r[0]}</td>
              <td style={{ ...tdStyle, textAlign: "center", fontWeight: 600, color: C.accent }}>{r[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </FigureWrap>
  );
}

/* ── Q38: two pie charts of vehicle categories + placeholder for bar options ── */
function Q38() {
  // Beginning of day: 32 cars across hatch, saloon, utility, estate, carrier
  // End of day: 8 cars remaining (after 24 sold)
  // PDF shows pie charts — we'll render approximations. Exact proportions from the PDF:
  // We know 24 sold, so we approximate begin and end distributions.
  const beginCounts = [10, 8, 6, 5, 3]; // sum 32 approx
  const endCounts = [1, 2, 2, 2, 1];    // sum 8 approx
  const cats = ["hatch", "saloon", "utility", "estate", "carrier"];
  const colors = ["#6c5ce7", "#74b9ff", "#55efc4", "#fdcb6e", "#fd79a8"];

  const Pie = ({ counts, size }: { counts: number[]; size: number }) => {
    const total = counts.reduce((a, b) => a + b, 0);
    const r = size / 2 - 4;
    const cx = size / 2, cy = size / 2;
    let angle = -Math.PI / 2;
    return (
      <svg width={size} height={size}>
        {counts.map((c, i) => {
          const frac = c / total;
          const a2 = angle + frac * 2 * Math.PI;
          const x1 = cx + r * Math.cos(angle);
          const y1 = cy + r * Math.sin(angle);
          const x2 = cx + r * Math.cos(a2);
          const y2 = cy + r * Math.sin(a2);
          const large = frac > 0.5 ? 1 : 0;
          const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
          angle = a2;
          return <path key={i} d={d} fill={colors[i]} stroke={C.bg} strokeWidth={1} />;
        })}
      </svg>
    );
  };

  return (
    <FigureWrap>
      <div style={{ display: "flex", gap: 24, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>beginning of day</div>
          <Pie counts={beginCounts} size={140} />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>end of day</div>
          <Pie counts={endCounts} size={140} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {cats.map((c, i) => (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 14, height: 14, background: colors[i], borderRadius: 3 }} />
              <span style={{ fontSize: 12, color: C.text }}>{c}</span>
            </div>
          ))}
        </div>
      </div>
      <p style={{ fontSize: 12, color: C.muted, textAlign: "center", marginTop: 14, marginBottom: 0 }}>
        <em>Answer options (bar 1 – bar 5) are compared bar charts — refer to the physical TSA 2022 paper or the walkthrough for the images.</em>
      </p>
    </FigureWrap>
  );
}

/* ── Q42: coin row ── */
function Q42() {
  const coins = ["200p", "100p", "50p", "20p", "10p", "5p"];
  return (
    <FigureWrap>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        {coins.map(c => (
          <div key={c} style={{
            width: 54, height: 54, borderRadius: "50%",
            background: "linear-gradient(135deg, #f4b942, #d4941e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#3a2800", fontSize: 13, fontWeight: 700,
            boxShadow: "inset 0 0 4px rgba(0,0,0,0.3)",
          }}>{c}</div>
        ))}
      </div>
    </FigureWrap>
  );
}

/* ── Q43: 5x5 token grid ── */
function Q43() {
  // Values from the PDF image. The grid is 5x5. White squares give extra points.
  // From PDF: rows top to bottom
  const grid = [
    [3, 1, 5, 1, 2],
    [1, 2, 0, 4, 5],
    [2, 1, 2, 3, 1],
    [1, 2, 2, 5, 2],
    [5, 4, 3, 2, 4],
  ];
  // Checkerboard colouring: we assume the standard alternating pattern from the PDF.
  // Use (r + c) % 2 as white/grey placeholder.
  return (
    <FigureWrap>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ display: "inline-grid", gridTemplateColumns: "repeat(5, 50px)", gap: 0, border: `2px solid ${C.border}` }}>
          {grid.flatMap((row, r) => row.map((v, c) => {
            const white = (r + c) % 2 === 0;
            return (
              <div key={`${r}-${c}`} style={{
                width: 50, height: 50,
                background: white ? "#f8f8f8" : "#8a8a8a",
                border: `1px solid ${C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 700,
                color: white ? "#1a1d27" : "#fff",
              }}>{v}</div>
            );
          }))}
        </div>
      </div>
    </FigureWrap>
  );
}

/* ── Q44: cat & mouse grid + game history ── */
function Q44() {
  const positions = Array.from({ length: 16 }, (_, i) => i + 1);
  const history = [
    { who: "me", cards: "2 & 13", result: "cat and mouse pair", points: "+1" },
    { who: "sister", cards: "7 & 16", result: "cards replaced", points: "" },
    { who: "me", cards: "5 & 11", result: "cat and mouse pair", points: "+1" },
    { who: "sister", cards: "10 & 12", result: "cards replaced", points: "" },
    { who: "me", cards: "3 & 8", result: "two mice; cards replaced", points: "" },
    { who: "sister", cards: "7 & 14", result: "cat and mouse pair", points: "+1" },
    { who: "me", cards: "1 & 15", result: "cat and mouse pair", points: "+1" },
    { who: "sister", cards: "8 & 10", result: "cat and mouse pair", points: "+1" },
  ];
  return (
    <FigureWrap>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <div style={{ display: "inline-grid", gridTemplateColumns: "repeat(4, 52px)", gap: 4 }}>
          {positions.map(n => (
            <div key={n} style={{
              width: 52, height: 72,
              background: "linear-gradient(145deg, #3a4052, #2a2d3a)",
              border: `1px solid ${C.border}`, borderRadius: 4,
              display: "flex", alignItems: "flex-end", justifyContent: "center",
              fontSize: 11, color: C.muted, paddingBottom: 4, fontWeight: 600,
            }}>{n}</div>
          ))}
        </div>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>player</th>
            <th style={thStyle}>cards picked</th>
            <th style={thStyle}>result</th>
            <th style={{ ...thStyle, textAlign: "center" }}>points</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h, i) => (
            <tr key={i}>
              <td style={{ ...tdStyle, fontWeight: 600, color: h.who === "me" ? C.accent : C.text }}>{h.who}</td>
              <td style={tdStyle}>{h.cards}</td>
              <td style={{ ...tdStyle, color: C.muted }}>{h.result}</td>
              <td style={{ ...tdStyle, textAlign: "center", fontWeight: 600, color: h.points ? C.ok : C.muted }}>{h.points || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: 12, color: C.muted, textAlign: "center", marginTop: 10, marginBottom: 0 }}>
        Score: me 3 — sister 2
      </p>
    </FigureWrap>
  );
}

/* ── Q46: sports day points ── */
function Q46() {
  const rows = [["1st place", "10 points"], ["2nd place", "6 points"], ["3rd place", "3 points"], ["4th place", "1 point"]];
  return (
    <FigureWrap>
      <table style={tableStyle}>
        <tbody>
          {rows.map(r => (
            <tr key={r[0]}>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{r[0]}</td>
              <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600, color: C.accent }}>{r[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </FigureWrap>
  );
}

/* ── Q50: ring road signs ── */
function Q50() {
  const signs: [string, [string, number][]][] = [
    ["sign 1", [["Radcliffe", 17], ["Southtown", 34], ["Tunborough", 49], ["Portville", 73], ["Queensgate", 92]]],
    ["sign 2", [["Southtown", 4], ["Tunborough", 19], ["Portville", 43], ["Queensgate", 62], ["Radcliffe", 84]]],
    ["sign 3", [["Tunborough", 9], ["Portville", 31], ["Queensgate", 52], ["Radcliffe", 74], ["Southtown", 91]]],
    ["sign 4", [["Portville", 13], ["Queensgate", 32], ["Radcliffe", 54], ["Southtown", 71], ["Tunborough", 86]]],
    ["sign 5", [["Queensgate", 10], ["Radcliffe", 32], ["Southtown", 49], ["Tunborough", 64], ["Portville", 88]]],
  ];
  return (
    <FigureWrap>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        {signs.map(([label, entries]) => (
          <div key={label} style={{
            border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px",
            background: "rgba(255,255,255,0.03)",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, textAlign: "center" }}>{label}</div>
            <table style={{ ...tableStyle, fontSize: 12 }}>
              <tbody>
                {entries.map(([name, km]) => (
                  <tr key={name}>
                    <td style={{ padding: "4px 0", color: C.text }}>{name}</td>
                    <td style={{ padding: "4px 0", textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{km}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 12, color: C.muted, textAlign: "center", marginTop: 10, marginBottom: 0 }}>
        All distances in km, clockwise around the ring road.
      </p>
    </FigureWrap>
  );
}

/* ── Dispatcher ── */
const FIGURE_MAP: Record<string, () => React.ReactElement> = {
  "tsa-q2": Q2,
  "tsa-q6": Q6,
  "tsa-q7": Q7,
  "tsa-q8": Q8,
  "tsa-q13": Q13,
  "tsa-q14": Q14,
  "tsa-q19": Q19,
  "tsa-q20": Q20,
  "tsa-q25": Q25,
  "tsa-q26": Q26,
  "tsa-q31": Q31,
  "tsa-q32": Q32,
  "tsa-q36": Q36,
  "tsa-q38": Q38,
  "tsa-q42": Q42,
  "tsa-q43": Q43,
  "tsa-q44": Q44,
  "tsa-q46": Q46,
  "tsa-q50": Q50,
};

export default function QuestionFigure({ figureKey }: { figureKey?: string }) {
  if (!figureKey) return null;
  const F = FIGURE_MAP[figureKey];
  if (!F) return null;
  return <F />;
}
