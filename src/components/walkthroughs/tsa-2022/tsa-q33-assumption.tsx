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
        {step < 3 ? (<button onClick={() => setStep(step + 1)} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Next →</button>) : (<button onClick={() => window.dispatchEvent(new CustomEvent("walkthrough-complete"))} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.ok}, #2ecc71)`, color: C.white, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>✓ Back to Question Review</button>)}
        </div>
      </div>
    </div>
  );
}