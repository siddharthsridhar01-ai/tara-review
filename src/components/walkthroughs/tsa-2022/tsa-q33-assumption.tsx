import { useState, useEffect } from "react";

const C = {
  bg: "#0f1117", card: "#1a1d27", border: "#2a2d3a",
  accent: "#6c5ce7", accentLight: "#a29bfe",
  concl: "#55efc4", conclBg: "rgba(85,239,196,0.10)",
  prem: "#74b9ff", premBg: "rgba(116,185,255,0.10)",
  inter: "#a29bfe", interBg: "rgba(162,155,254,0.10)",
  assum: "#fdcb6e", assumBg: "rgba(253,203,110,0.12)",
  ok: "#55efc4", fail: "#ff7675", failBg: "rgba(255,118,117,0.10)",
  flaw: "#fd79a8", flawBg: "rgba(253,121,168,0.10)",
  x: "#fd79a8", xBg: "rgba(253,121,168,0.12)",
  y: "#a29bfe", yBg: "rgba(162,155,254,0.12)",
  weaken: "#fd79a8", weakenBg: "rgba(253,121,168,0.10)",
  strengthen: "#55efc4", strengthenBg: "rgba(85,239,196,0.10)",
  neutral: "#636e72", neutralBg: "rgba(99,110,114,0.10)",
  prin: "#a29bfe", prinBg: "rgba(162,155,254,0.10)",
  tooFar: "#fd79a8", tooFarBg: "rgba(253,121,168,0.10)",
  offTopic: "#e17055", offTopicBg: "rgba(225,112,85,0.10)",
  ctx: "#c09875", ctxBg: "rgba(192,152,117,0.10)",
  vocab: "#ffeaa7", text: "#e2e2e8", muted: "#8b8d9a", white: "#fff",
};

const stepsMeta = [
  { id: 0, label: "Read", title: "Read the Passage" },
  { id: 1, label: "Conclusion", title: "Find the Conclusion" },
  { id: 2, label: "Evidence", title: "Identify the Evidence" },
  { id: 3, label: "Options", title: "Evaluate Each Option" },
];

const vocabDefs = {
  "regional inequality": "Differences in wealth, income, or living standards between different areas within the same country.",
  disparity: "A noticeable and often unfair difference between two or more things.",
  infrastructure: "The basic physical systems and structures that a society needs to function, such as roads, railways, bridges, and utilities.",
  suspended: "Temporarily stopped or put on hold, usually with the possibility of being resumed later.",
  "journey times": "The amount of time it takes to travel from one place to another by a particular mode of transport.",
};

const phrases = [
  { id: "p1", text: "The UK has one of the world's highest levels of regional inequality, according to a recent report.", isConclusion: false },
  { id: "p2", text: "Of the 30 nations studied, only 2 had higher levels of inequality.", isConclusion: false },
  { id: "p3", text: "The main disparity is between those living in the poorer north and the wealthier south of the country.", isConclusion: false },
  { id: "p4", text: "To address this, the government has been working on a large infrastructure project, HS2, which will improve transport links between cities in the north and south.", isConclusion: false },
  { id: "p5", text: "However, the report warns that this project will only benefit the large cities, as journey times to areas outside those cities will continue to be affected by poor local transport infrastructure.", isConclusion: false },
  { id: "p6", text: "The project will do nothing to benefit those living in smaller towns and villages in the north of the country, and so should be suspended immediately.", isConclusion: true },
];

const dragSentences = [
  { id: "d1", text: "The UK has one of the world's highest levels of regional inequality, with the main disparity between the poorer north and the wealthier south.", isEvidence: false, feedback: "This is background context describing the problem. It sets the scene but doesn't directly support why HS2 should be suspended." },
  { id: "d2", text: "The government has been working on HS2 to improve transport links between cities in the north and south.", isEvidence: false, feedback: "This describes what HS2 is and its intended purpose. It's context about the project, not evidence for suspending it." },
  { id: "d3", text: "The project will only benefit large cities, as journey times to areas outside those cities will continue to be affected by poor local transport infrastructure.", isEvidence: true },
  { id: "d4", text: "Of the 30 nations studied, only 2 had higher levels of inequality than the UK.", isEvidence: false, feedback: "This quantifies how severe the inequality is. It supports the existence of a problem, but doesn't directly explain why HS2 should be suspended." },
];

function Vocab({ term, children }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline" }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ borderBottom: `2px dashed ${C.vocab}`, cursor: "help", color: C.vocab }}>{children || term}</span>
      {show && (
        <span style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "#2d3047", border: `1px solid ${C.vocab}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.vocab, width: 260, zIndex: 100, lineHeight: 1.5, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", pointerEvents: "none" }}>
          <span style={{ fontWeight: 700, display: "block", marginBottom: 4 }}>Definition</span>
          {vocabDefs[term]}
        </span>
      )}
    </span>
  );
}

function SmallArrow({ color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "3px 0" }}>
      <div style={{ width: 2, height: 12, background: color + "66" }} />
      <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `6px solid ${color}88` }} />
    </div>
  );
}

function PassageRaw() {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>
        The UK has one of the world's highest levels of <Vocab term="regional inequality">regional inequality</Vocab>, according to a recent report. Of the 30 nations studied, only 2 had higher levels of inequality. The main <Vocab term="disparity">disparity</Vocab> is between those living in the poorer north and the wealthier south of the country. To address this, the government has been working on a large <Vocab term="infrastructure">infrastructure</Vocab> project, HS2, which will improve transport links between cities in the north and south. However, the report warns that this project will only benefit the large cities, as <Vocab term="journey times">journey times</Vocab> to areas outside those cities will continue to be affected by poor local transport infrastructure. The project will do nothing to benefit those living in smaller towns and villages in the north of the country, and so should be <Vocab term="suspended">suspended</Vocab> immediately.
      </p>
    </div>
  );
}

function PassageFull({ evidenceHighlighted }) {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>
        {"The UK has one of the world's highest levels of regional inequality, according to a recent report. Of the 30 nations studied, only 2 had higher levels of inequality. The main disparity is between those living in the poorer north and the wealthier south of the country. To address this, the government has been working on a large infrastructure project, HS2, which will improve transport links between cities in the north and south. "}
        <span style={{ color: evidenceHighlighted ? C.prem : "inherit", backgroundColor: evidenceHighlighted ? C.premBg : "transparent", padding: evidenceHighlighted ? "2px 4px" : 0, borderRadius: 3, borderBottom: evidenceHighlighted ? `2px solid ${C.prem}` : "none", transition: "all 0.4s" }}>
          However, the report warns that this project will only benefit the large cities, as journey times to areas outside those cities will continue to be affected by poor local transport infrastructure.
        </span>
        {" "}
        <span style={{ color: C.concl, backgroundColor: C.conclBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.concl}` }}>
          The project will do nothing to benefit those living in smaller towns and villages in the north of the country, and so should be suspended immediately.
        </span>
      </p>
    </div>
  );
}

function MiniChain({ ok }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, margin: "10px 0" }}>
      <div style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 8, padding: "8px 12px", width: "100%", boxSizing: "border-box" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.prem }}>EVIDENCE</span>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: C.text, lineHeight: 1.4 }}>HS2 will only benefit large cities, not smaller towns and villages</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "3px 0" }}>
        <div style={{ width: 2, height: 8, background: ok ? C.concl + "66" : C.fail + "66", transition: "background 0.5s" }} />
        <span style={{ fontSize: 9, fontWeight: 700, color: ok ? C.concl : C.fail, transition: "color 0.5s" }}>{ok ? "IMPLIES" : "DOES NOT IMPLY"}</span>
        <div style={{ width: 2, height: 8, background: ok ? C.concl + "66" : C.fail + "66", transition: "background 0.5s" }} />
        <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `6px solid ${ok ? C.concl + "88" : C.fail + "88"}`, transition: "border-top-color 0.5s" }} />
      </div>
      <div style={{ background: ok ? C.conclBg : C.failBg, border: `1px solid ${ok ? C.concl : C.fail}`, borderRadius: 8, padding: "8px 12px", width: "100%", boxSizing: "border-box", position: "relative", transition: "all 0.5s" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: ok ? C.concl : C.fail, transition: "color 0.5s" }}>CONCLUSION</span>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: ok ? C.text : C.fail, lineHeight: 1.4, transition: "color 0.5s" }}>HS2 should be suspended immediately</p>
        {!ok && <span style={{ position: "absolute", top: 6, right: 10, fontSize: 14, color: C.fail, fontWeight: 700 }}>✗</span>}
      </div>
    </div>
  );
}

function ConclusionFinder({ onFound }) {
  const [hovId, setHovId] = useState(null);
  const [wrongId, setWrongId] = useState(null);
  const [found, setFound] = useState(false);

  const handleClick = (p) => {
    if (found) return;
    if (p.isConclusion) {
      setFound(true);
      setWrongId(null);
      onFound();
    } else {
      setWrongId(p.id);
    }
  };

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
          <span style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.concl, fontWeight: 700, whiteSpace: "nowrap" }}>STEP 1</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Find the <strong style={{ color: C.concl }}>main conclusion</strong>. What is the author ultimately arguing should happen?</p>
        </div>
        <div style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 10, padding: "14px 18px", fontSize: 13, color: C.concl, lineHeight: 1.6 }}><strong>Hint:</strong> Look for a phrase that makes a recommendation or call to action. The word "so" often signals a conclusion.</div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>Passage</span>
          <span style={{ fontSize: 11, color: C.muted }}> · click on the sentence you think is the conclusion</span>
        </div>
        <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
          {phrases.map(p => {
            const isH = hovId === p.id && !found;
            const isW = wrongId === p.id;
            const isF = found && p.isConclusion;
            return (
              <p key={p.id} style={{ margin: "0 0 10px", cursor: found ? "default" : "pointer" }}
                onMouseEnter={() => !found && setHovId(p.id)}
                onMouseLeave={() => !found && setHovId(null)}
                onClick={() => handleClick(p)}>
                <span style={{
                  borderBottom: isF ? `2px solid ${C.concl}` : isH ? `2px solid ${C.muted}` : "2px solid transparent",
                  backgroundColor: isF ? C.conclBg : "transparent",
                  color: isF ? C.concl : isW ? C.fail : "inherit",
                  padding: isF ? "2px 4px" : 0,
                  borderRadius: 3,
                  transition: "all 0.3s"
                }}>{p.text}</span>
              </p>
            );
          })}
        </div>
        {(wrongId || found) && (
          <div style={{ background: found ? `${C.concl}0a` : C.failBg, border: `1px solid ${found ? C.concl + "44" : C.fail + "44"}`, borderRadius: 10, padding: "12px 16px", marginTop: 4 }}>
            {found ? (
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ background: `${C.concl}22`, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "3px 10px", fontSize: 11, color: C.concl, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>CONCLUSION</span>
                <p style={{ margin: 0, fontSize: 13.5, color: C.text, lineHeight: 1.65 }}><strong style={{ color: C.ok }}>Correct!</strong> The author concludes that HS2 "should be suspended immediately." Notice the signal word "so": everything before it is building a case, and this is the final recommendation.</p>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: C.white }}>Try again. Look for a sentence that makes a recommendation about what should happen to the project. Which sentence uses the word "so" to draw a final point?</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EvidenceBuilder() {
  const [draggingId, setDraggingId] = useState(null);
  const [placedIds, setPlacedIds] = useState([]);
  const [wrongFeedback, setWrongFeedback] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const allDone = dragSentences.filter(s => s.isEvidence).every(s => placedIds.includes(s.id));

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const id = e.dataTransfer.getData("text/plain");
    const s = dragSentences.find(x => x.id === id);
    if (!s) return;
    if (s.isEvidence) {
      setPlacedIds(p => [...p, id]);
      setWrongFeedback(null);
    } else {
      setWrongFeedback({ id, text: s.feedback });
    }
    setDraggingId(null);
  };

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.prem, fontWeight: 700, whiteSpace: "nowrap" }}>STEP 2</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Drag the <strong style={{ color: C.prem }}>key evidence</strong> into the box below. What specific claim does the author use to justify suspending HS2?</p>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span>
        <PassageFull evidenceHighlighted={allDone} />
        <div style={{ marginTop: 12, display: "flex", gap: 10, fontSize: 11, color: C.muted }}>
          <span><span style={{ color: C.concl }}>■</span> Conclusion</span>
          {allDone && <span><span style={{ color: C.prem }}>■</span> Evidence</span>}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 12 }}>Passage sentences</span>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {dragSentences.map(s => {
            const placed = placedIds.includes(s.id);
            return (
              <div key={s.id} draggable={!placed}
                onDragStart={e => { e.dataTransfer.setData("text/plain", s.id); setDraggingId(s.id); }}
                style={{
                  background: placed ? C.premBg : "#1e2030",
                  border: `1.5px solid ${placed ? C.prem : C.border}`,
                  borderRadius: 8, padding: "10px 14px",
                  cursor: placed ? "default" : "grab",
                  opacity: draggingId === s.id ? 0.4 : placed ? 0.5 : 1,
                  transition: "all 0.3s", fontSize: 13, color: placed ? C.prem : C.text,
                  lineHeight: 1.6, position: "relative"
                }}>
                {placed && <span style={{ position: "absolute", top: 6, right: 10, fontSize: 10, color: C.ok, fontWeight: 700 }}>PLACED</span>}
                {s.text}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Reasoning chain</span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
            style={{
              width: "100%", minHeight: 70, boxSizing: "border-box",
              background: allDone ? C.premBg : dragOver ? "rgba(116,185,255,0.08)" : "#151722",
              border: `2px ${allDone ? "solid" : "dashed"} ${allDone ? C.prem : dragOver ? C.prem : C.border}`,
              borderRadius: 10, padding: "12px 16px", transition: "all 0.3s"
            }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: allDone ? C.prem : C.muted }}>EVIDENCE</span>
            {placedIds.length === 0 && !dragOver && <p style={{ margin: "6px 0 0", fontSize: 13, color: C.muted, fontStyle: "italic" }}>Drag a sentence here</p>}
            {dragOver && placedIds.length === 0 && <p style={{ margin: "6px 0 0", fontSize: 13, color: C.prem }}>Drop here</p>}
            {placedIds.map(id => { const s = dragSentences.find(x => x.id === id); return <p key={id} style={{ margin: "6px 0 0", fontSize: 13, color: C.prem, lineHeight: 1.5 }}>{s.text}</p>; })}
          </div>

          {wrongFeedback && (
            <div style={{ width: "100%", background: C.failBg, border: `1px solid ${C.fail}44`, borderRadius: 10, padding: "10px 16px", marginTop: 8, boxSizing: "border-box" }}>
              <p style={{ margin: 0, fontSize: 13, color: C.white, lineHeight: 1.6 }}><strong style={{ color: C.fail }}>Try again.</strong> {wrongFeedback.text}</p>
            </div>
          )}

          {allDone && (
            <div style={{ width: "100%", background: C.conclBg, border: `1px solid ${C.concl}44`, borderRadius: 10, padding: "10px 16px", marginTop: 8, boxSizing: "border-box" }}>
              <p style={{ margin: 0, fontSize: 13, color: C.text, lineHeight: 1.6 }}><strong style={{ color: C.concl }}>Correct!</strong> The key evidence is that HS2 will only benefit large cities, leaving smaller towns and villages unaffected.</p>
            </div>
          )}

          {allDone && (
            <div style={{ width: "100%", background: C.assumBg, border: `1px solid ${C.assum}44`, borderRadius: 10, padding: "12px 16px", marginTop: 10, boxSizing: "border-box" }}>
              <span style={{ background: `${C.assum}22`, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.assum, fontWeight: 700 }}>THE ARGUMENT IN A NUTSHELL</span>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                <span style={{ color: C.prem }}>HS2 will only benefit large cities, not smaller towns and villages</span> → <span style={{ color: C.concl }}>therefore HS2 should be suspended immediately.</span>
              </p>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: C.assum, lineHeight: 1.6 }}>
                But wait: the argument jumps from "only large cities benefit" to "suspend the whole project." What is the author assuming about the value of those large-city benefits? Could they alone be enough to justify the project?
              </p>
            </div>
          )}

          <SmallArrow color={allDone ? C.prem : C.muted} />

          <div style={{ background: C.conclBg, border: `1.5px solid ${C.concl}`, borderRadius: 10, padding: "10px 16px", width: "100%", boxSizing: "border-box" }}>
            <span style={{ background: `${C.concl}22`, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.concl, fontWeight: 700 }}>CONCLUSION (from Step 1)</span>
            <p style={{ margin: "6px 0 0", fontSize: 13.5, color: C.concl, lineHeight: 1.5 }}>The project should be suspended immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualC() {
  const [relaxed, setRelaxed] = useState(false);
  return (
    <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>What happens when we relax this assumption?</p>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <button onClick={() => setRelaxed(false)} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${!relaxed ? C.ok : C.border}`, background: !relaxed ? "rgba(85,239,196,0.1)" : "transparent", cursor: "pointer", transition: "all 0.3s" }}>
          <span style={{ fontSize: 12, color: !relaxed ? C.ok : C.muted, fontWeight: 600 }}>Assumption holds</span>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: !relaxed ? C.text : C.muted, lineHeight: 1.4 }}>Large-city benefits are <strong>not enough</strong> to justify HS2</p>
        </button>
        <button onClick={() => setRelaxed(true)} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${relaxed ? C.fail : C.border}`, background: relaxed ? C.failBg : "transparent", cursor: "pointer", transition: "all 0.3s" }}>
          <span style={{ fontSize: 12, color: relaxed ? C.fail : C.muted, fontWeight: 600 }}>Assumption relaxed</span>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: relaxed ? C.text : C.muted, lineHeight: 1.4 }}>Large-city benefits <strong>are sufficient</strong> to justify HS2</p>
        </button>
      </div>
      <MiniChain ok={!relaxed} />
      {relaxed && (
        <div style={{ marginTop: 10 }}>
          <div style={{ background: "#1e2030", borderRadius: 8, padding: 12, marginBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 12, color: C.text, lineHeight: 1.6 }}>
              <strong style={{ color: C.prem }}>Scenario:</strong> HS2 connects Manchester and Birmingham to London, creating thousands of jobs and billions in economic growth for those cities. The economic boost to these major northern cities is so large that it significantly reduces regional inequality on its own, even without helping smaller towns directly.
            </p>
          </div>
          <div style={{ background: C.assumBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${C.assum}` }}>
            <p style={{ margin: 0, fontSize: 12, color: C.assum, lineHeight: 1.6 }}>
              If the benefits to large cities <strong style={{ color: C.fail }}>are sufficient to justify the project</strong>, then the fact that smaller towns don't directly benefit is no reason to suspend it. The conclusion that HS2 "should be suspended immediately" no longer follows. The argument only works if you assume those large-city benefits aren't enough on their own.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function VisualA() {
  return (
    <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>Is this what the argument assumes?</p>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.prem}44` }}>
          <p style={{ fontSize: 11, color: C.prem, fontWeight: 700, margin: "0 0 6px" }}>THE ARGUMENT</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>HS2 should be suspended because it <span style={{ color: C.prem, fontWeight: 700 }}>doesn't help smaller towns</span></p>
        </div>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.fail}44` }}>
          <p style={{ fontSize: 11, color: C.fail, fontWeight: 700, margin: "0 0 6px" }}>OPTION A</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>There is <span style={{ color: C.fail, fontWeight: 700 }}>no need</span> for large northern cities to have quicker links to the south</p>
        </div>
      </div>
      <div style={{ marginTop: 10, background: C.assumBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${C.assum}` }}>
        <p style={{ margin: 0, fontSize: 12, color: C.assum, lineHeight: 1.5 }}>This is too strong. The argument doesn't deny that <span style={{ color: C.prem, fontWeight: 700 }}>large cities might benefit</span> from better links. It simply argues that benefiting large cities alone <span style={{ color: C.fail, fontWeight: 700 }}>isn't enough</span> to justify the project. There's a difference between "no need at all" and "not sufficient on its own."</p>
      </div>
    </div>
  );
}

function VisualB() {
  return (
    <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>Does the argument depend on transport being the only method?</p>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.prem}44` }}>
          <p style={{ fontSize: 11, color: C.prem, fontWeight: 700, margin: "0 0 6px" }}>THE ARGUMENT</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>HS2 should be suspended because <span style={{ color: C.prem, fontWeight: 700 }}>this specific project</span> doesn't help smaller towns</p>
        </div>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.fail}44` }}>
          <p style={{ fontSize: 11, color: C.fail, fontWeight: 700, margin: "0 0 6px" }}>OPTION B</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Transport links are <span style={{ color: C.fail, fontWeight: 700 }}>the method</span> by which inequality has to be addressed</p>
        </div>
      </div>
      <div style={{ marginTop: 10, background: C.assumBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${C.assum}` }}>
        <p style={{ margin: 0, fontSize: 12, color: C.assum, lineHeight: 1.5 }}>The argument is about whether <span style={{ color: C.prem, fontWeight: 700 }}>this particular project</span> deserves to continue. It doesn't need to assume that transport is the only way to address inequality. There could be other methods too. The argument simply says this project isn't doing enough, not that transport is the only solution.</p>
      </div>
    </div>
  );
}

function VisualD() {
  return (
    <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>Is inequality being a problem actually assumed or stated?</p>
      <div style={{ background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.fail}44` }}>
        <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>The passage explicitly describes regional inequality as something that needs to be addressed: "To address this, the government has been working on..." This means the idea that inequality is a problem is <span style={{ color: C.fail, fontWeight: 700 }}>stated in the passage</span>, not a hidden assumption. An assumption must be <span style={{ color: C.prem, fontWeight: 700 }}>unstated but necessary</span> for the argument to work. If it's already said, it's a premise, not an assumption.</p>
      </div>
    </div>
  );
}

function VisualE() {
  return (
    <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>Is this relevant to the argument at all?</p>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.prem}44` }}>
          <p style={{ fontSize: 11, color: C.prem, fontWeight: 700, margin: "0 0 6px" }}>THE ARGUMENT</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>About whether <span style={{ color: C.prem, fontWeight: 700 }}>HS2 should be suspended</span> because it doesn't benefit smaller towns</p>
        </div>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.fail}44` }}>
          <p style={{ fontSize: 11, color: C.fail, fontWeight: 700, margin: "0 0 6px" }}>OPTION E</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>About whether people <span style={{ color: C.fail, fontWeight: 700 }}>enjoy commuting</span></p>
        </div>
      </div>
      <div style={{ marginTop: 10, background: C.assumBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${C.assum}` }}>
        <p style={{ margin: 0, fontSize: 12, color: C.assum, lineHeight: 1.5 }}>The argument is about <span style={{ color: C.prem, fontWeight: 700 }}>regional inequality and infrastructure investment</span>. How people feel about commuting is <span style={{ color: C.fail, fontWeight: 700 }}>completely off-topic</span>. The passage mentions journey times as a measure of connectivity, not as something tied to commuter enjoyment. This option introduces an irrelevant subject.</p>
      </div>
    </div>
  );
}

const questionOptions = [
  { letter: "A", text: "There is no need for larger cities in the north of England to have quicker links to the south.", verdict: "incorrect", explanation: "This is too extreme. The argument doesn't claim there is no need for better links to large cities. It claims that benefiting only large cities isn't enough to justify the project. 'No need at all' is much stronger than what the argument requires.", Visual: VisualA },
  { letter: "B", text: "Improving transport links is the method by which regional inequality has to be addressed.", verdict: "incorrect", explanation: "The argument doesn't need to assume that transport is the only way to tackle inequality. It's focused narrowly on whether this specific project is worthwhile, not on the broader question of which methods should be used.", Visual: VisualB },
  { letter: "C", text: "The benefits to large cities are not sufficient to justify the project.", verdict: "correct", explanation: "This is the hidden assumption. The argument says HS2 only benefits large cities, then concludes it should be suspended. But that leap only works if you assume that benefiting large cities alone isn't good enough. If the large-city benefits were substantial enough on their own, the project could still be worthwhile even without helping smaller towns. Toggle below to see the argument break.", Visual: VisualC },
  { letter: "D", text: "The level of regional inequality in the country is a problem that needs to be solved.", verdict: "incorrect", explanation: "This isn't hidden. The passage states it openly by describing inequality levels and the government's efforts 'to address this.' Something that is explicitly stated in the passage cannot be an underlying assumption.", Visual: VisualD },
  { letter: "E", text: "People generally do not enjoy a lengthy commute to work.", verdict: "incorrect", explanation: "The argument is about infrastructure investment and regional inequality, not about people's feelings towards commuting. This is completely off-topic and plays no role in the reasoning.", Visual: VisualE },
];

function OptionCard({ opt, expanded, onClick, animate, Visual }) {
  const ok = opt.verdict === "correct";
  const bc = expanded ? (ok ? C.ok : C.fail) : C.border;
  return (
    <div style={{
      background: expanded ? (ok ? C.conclBg : C.failBg) : "#1e2030",
      border: `1.5px solid ${bc}`, borderRadius: 12, padding: "14px 18px",
      cursor: "pointer", transition: "all 0.3s",
      opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(12px)"
    }} onClick={onClick}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{
          background: expanded ? (ok ? C.ok : C.fail) : C.accent,
          borderRadius: 6, width: 28, height: 28, display: "flex",
          alignItems: "center", justifyContent: "center", fontSize: 13,
          fontWeight: 700, color: C.white, flexShrink: 0, transition: "all 0.3s"
        }}>{expanded ? (ok ? "✓" : "✗") : opt.letter}</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.6 }}>{opt.text}</p>
          {expanded && (
            <>
              <div style={{
                marginTop: 10, padding: "10px 14px",
                background: ok ? C.conclBg : C.failBg,
                borderRadius: 8, fontSize: 13,
                color: ok ? C.concl : C.fail,
                lineHeight: 1.6, borderLeft: `3px solid ${ok ? C.ok : C.fail}`
              }}>
                {ok && <span style={{ fontWeight: 700 }}>CORRECT: </span>}{opt.explanation}
              </div>
              {Visual && <div onClick={e => e.stopPropagation()}><Visual /></div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [optAnim, setOptAnim] = useState([false, false, false, false, false]);

  useEffect(() => {
    if (step === 3) {
      [0, 1, 2, 3, 4].forEach(i => {
        setTimeout(() => setOptAnim(p => { const n = [...p]; n[i] = true; return n; }), i * 100);
      });
    } else {
      setOptAnim([false, false, false, false, false]);
      setExpanded(null);
    }
  }, [step]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif", letterSpacing: 0.2, padding: "24px 16px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: 1 }}>TARA</span>
            <span style={{ fontSize: 12, color: C.muted }}>Critical Thinking</span>
            <span style={{ fontSize: 12, color: C.muted }}>·</span>
            <span style={{ fontSize: 12, color: C.assum }}>Identifying an Assumption</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 33</p>
        </div>

        {/* Step Nav */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {stepsMeta.map(s => (
            <button key={s.id} onClick={() => setStep(s.id)} style={{
              flex: 1, minWidth: 0,
              background: step === s.id ? C.accent : step > s.id ? "rgba(108,92,231,0.15)" : "#1e2030",
              border: `1px solid ${step === s.id ? C.accent : step > s.id ? C.accent + "44" : C.border}`,
              borderRadius: 10, padding: "10px 6px", cursor: "pointer", transition: "all 0.3s",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted, lineHeight: 1 }}>{s.id + 1}</span>
              <span style={{ fontSize: 11, fontWeight: step === s.id ? 700 : 500, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted, whiteSpace: "nowrap" }}>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Step Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ background: C.accent, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.white }}>{step + 1}</span>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.white, margin: 0 }}>{stepsMeta[step].title}</h2>
        </div>

        {/* Step 0: Read */}
        {step === 0 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span>
              <PassageRaw />
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>Read the passage carefully. <span style={{ color: C.vocab }}>Hover yellow terms</span> for definitions. This is an <strong style={{ color: C.white }}>Identifying an Assumption</strong> question:</p>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}>
                <em>"Which one of the following is an underlying assumption of the above argument?"</em>
              </div>
              <div style={{ marginTop: 12, background: C.assumBg, border: `1px solid ${C.assum}44`, borderRadius: 10, padding: "12px 16px" }}>
                <p style={{ margin: 0, fontSize: 13, color: C.assum, lineHeight: 1.6 }}><strong>Assumption questions</strong> ask you to find the hidden, unstated belief that holds the argument together. The author takes this for granted without saying it. If the assumption turns out to be false, the conclusion no longer follows from the evidence.</p>
              </div>
            </div>
          </>
        )}

        {/* Step 1: Conclusion */}
        {step === 1 && <ConclusionFinder onFound={() => {}} />}

        {/* Step 2: Evidence */}
        {step === 2 && <EvidenceBuilder />}

        {/* Step 3: Options */}
        {step === 3 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}>
                <em>"Which one of the following is an underlying assumption of the above argument?"</em>
              </div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span>
              <PassageFull evidenceHighlighted={true} />
              <div style={{ marginTop: 12, display: "flex", gap: 10, fontSize: 11, color: C.muted }}>
                <span><span style={{ color: C.prem }}>■</span> Evidence</span>
                <span><span style={{ color: C.concl }}>■</span> Conclusion</span>
              </div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 14 }}>
              <p style={{ color: C.muted, fontSize: 14, margin: 0 }}><strong style={{ color: C.assum }}>Click each option</strong> to see why it's right or wrong:</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {questionOptions.map((opt, i) => (
                <OptionCard key={opt.letter} opt={opt} expanded={expanded === opt.letter} animate={optAnim[i]} Visual={opt.Visual}
                  onClick={() => setExpanded(p => p === opt.letter ? null : opt.letter)} />
              ))}
            </div>
          </>
        )}

        {/* Nav Buttons */}
        <div style={{ display: "flex", gap: 12, paddingBottom: 32 }}>
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{
            flex: 1, padding: "13px 20px", borderRadius: 10, border: `1px solid ${C.border}`,
            background: step === 0 ? C.card : "#1e2030",
            color: step === 0 ? C.muted : C.text, fontSize: 14, fontWeight: 600,
            cursor: step === 0 ? "not-allowed" : "pointer", opacity: step === 0 ? 0.4 : 1
          }}>← Previous</button>
          <button onClick={() => setStep(Math.min(3, step + 1))} disabled={step === 3} style={{
            flex: 1, padding: "13px 20px", borderRadius: 10, border: "none",
            background: step === 3 ? "#1e2030" : `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
            color: step === 3 ? C.muted : C.white, fontSize: 14, fontWeight: 600,
            cursor: step === 3 ? "not-allowed" : "pointer", opacity: step === 3 ? 0.4 : 1
          }}>Next →</button>
        </div>
      </div>
    </div>
  );
}