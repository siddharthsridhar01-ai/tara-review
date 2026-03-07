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
  "significance": "The quality of being important or meaningful, having a notable effect or influence.",
  "evaluate": "To judge or assess the quality, importance, or value of something carefully.",
  "assertive": "Confidently expressing one's opinions and standing up for one's position in a forceful but not aggressive way.",
  "cooperative": "Willing to work with others, showing a readiness to compromise and collaborate.",
  "showcasing": "Displaying or presenting something in a way that draws attention to its qualities or features.",
};

const phrases = [
  { id: "p1", text: "In recent years, televised debates between political candidates have taken on increasing significance in the elections held in various countries.", isConclusion: false },
  { id: "p2", text: "Meant to encourage public participation in elections and help voters evaluate the candidates seeking their support, these events are not much more than noisy distractions.", isConclusion: false },
  { id: "p3", text: "Rather than revealing more about positions and policies on important political issues, the debates put the spotlight squarely on candidates' social skills.", isConclusion: false },
  { id: "p4", text: "Accordingly, media coverage of the debates tends to focus on how well candidates engage with one another, those asking the questions, and any audience members in attendance.", isConclusion: false },
  { id: "p5", text: "But showcasing the ability – or inability – of candidates to demonstrate a desirable balance between being assertive and cooperative does little to help voters understand the leadership potential of those taking part.", isConclusion: true },
];

const dragSentences = [
  { id: "d1", text: "Televised debates have taken on increasing significance in elections held in various countries.", isEvidence: false, feedback: "This is background context about the growing importance of debates. It doesn't directly support the conclusion about social skills and leadership." },
  { id: "d2", text: "The debates put the spotlight squarely on candidates' social skills rather than positions and policies.", isEvidence: true },
  { id: "d3", text: "Media coverage tends to focus on how well candidates engage with one another and audience members.", isEvidence: true },
  { id: "d4", text: "These events are not much more than noisy distractions.", isEvidence: false, feedback: "This is itself an intermediate claim, not supporting evidence. It's the author's judgment about debates, not a factual observation that leads to the conclusion." },
];

function Vocab({ term, children }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline" }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ borderBottom: "2px dashed #ffeaa7", cursor: "help", color: "#ffeaa7" }}>{children || term}</span>
      {show && (
        <span style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "#2d3047", border: "1px solid #ffeaa7", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#ffeaa7", width: 260, zIndex: 100, lineHeight: 1.5, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", pointerEvents: "none" }}>
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
        In recent years, televised debates between political candidates have taken on increasing <Vocab term="significance">significance</Vocab> in the elections held in various countries. Meant to encourage public participation in elections and help voters <Vocab term="evaluate">evaluate</Vocab> the candidates seeking their support, these events are not much more than noisy distractions. Rather than revealing more about positions and policies on important political issues, the debates put the spotlight squarely on candidates' social skills. Accordingly, media coverage of the debates tends to focus on how well candidates engage with one another, those asking the questions, and any audience members in attendance. But <Vocab term="showcasing">showcasing</Vocab> the ability, or inability, of candidates to demonstrate a desirable balance between being <Vocab term="assertive">assertive</Vocab> and <Vocab term="cooperative">cooperative</Vocab> does little to help voters understand the leadership potential of those taking part.
      </p>
    </div>
  );
}

function PassageFull({ evidenceHighlighted }) {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>
        {"In recent years, televised debates between political candidates have taken on increasing significance in the elections held in various countries. Meant to encourage public participation in elections and help voters evaluate the candidates seeking their support, these events are not much more than noisy distractions. "}
        <span style={{ color: evidenceHighlighted ? C.prem : "inherit", backgroundColor: evidenceHighlighted ? C.premBg : "transparent", padding: evidenceHighlighted ? "2px 4px" : 0, borderRadius: 3, borderBottom: evidenceHighlighted ? `2px solid ${C.prem}` : "none", transition: "all 0.4s" }}>Rather than revealing more about positions and policies on important political issues, the debates put the spotlight squarely on candidates' social skills.</span>
        {" "}
        <span style={{ color: evidenceHighlighted ? C.prem : "inherit", backgroundColor: evidenceHighlighted ? C.premBg : "transparent", padding: evidenceHighlighted ? "2px 4px" : 0, borderRadius: 3, borderBottom: evidenceHighlighted ? `2px solid ${C.prem}` : "none", transition: "all 0.4s" }}>Accordingly, media coverage of the debates tends to focus on how well candidates engage with one another, those asking the questions, and any audience members in attendance.</span>
        {" But "}
        <span style={{ color: C.concl, backgroundColor: C.conclBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.concl}` }}>showcasing the ability, or inability, of candidates to demonstrate a desirable balance between being assertive and cooperative does little to help voters understand the leadership potential of those taking part.</span>
      </p>
    </div>
  );
}

function MiniChain({ ok }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, margin: "10px 0" }}>
      <div style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 8, padding: "8px 12px", width: "100%", boxSizing: "border-box" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.prem }}>EVIDENCE</span>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: C.text, lineHeight: 1.4 }}>Debates spotlight social skills; media focuses on candidate engagement</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "3px 0" }}>
        <div style={{ width: 2, height: 8, background: ok ? C.concl + "66" : C.fail + "66", transition: "background 0.5s" }} />
        <span style={{ fontSize: 9, fontWeight: 700, color: ok ? C.concl : C.fail, transition: "color 0.5s" }}>{ok ? "IMPLIES" : "DOES NOT IMPLY"}</span>
        <div style={{ width: 2, height: 8, background: ok ? C.concl + "66" : C.fail + "66", transition: "background 0.5s" }} />
        <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `6px solid ${ok ? C.concl + "88" : C.fail + "88"}`, transition: "border-top-color 0.5s" }} />
      </div>
      <div style={{ background: ok ? C.conclBg : C.failBg, border: `1px solid ${ok ? C.concl : C.fail}`, borderRadius: 8, padding: "8px 12px", width: "100%", boxSizing: "border-box", position: "relative", transition: "all 0.5s" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: ok ? C.concl : C.fail, transition: "color 0.5s" }}>CONCLUSION</span>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: ok ? C.text : C.fail, lineHeight: 1.4, transition: "color 0.5s" }}>Showcasing social skills does little to help voters understand leadership potential</p>
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
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Find the <strong style={{ color: C.concl }}>main conclusion</strong>. What is the author ultimately claiming about televised debates?</p>
        </div>
        <div style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 10, padding: "14px 18px", fontSize: 13, color: C.concl, lineHeight: 1.6 }}><strong>Hint:</strong> Look for the sentence that makes the strongest judgment about what debates actually achieve for voters. The word "but" often signals an important turn in the argument.</div>
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
                <p style={{ margin: 0, fontSize: 13.5, color: C.text, lineHeight: 1.65 }}><strong style={{ color: C.ok }}>Correct!</strong> The final sentence is the main conclusion. The author claims that showcasing social skills does little to reveal leadership potential. Everything else in the passage builds towards this judgment.</p>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: C.white }}>Try again. Look for the sentence that delivers the author's final verdict on what televised debates actually accomplish for voters.</p>
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
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Drag the <strong style={{ color: C.prem }}>key evidence</strong> into the box below. What observations does the author use to support the conclusion?</p>
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
                style={{ background: placed ? C.premBg : "#1e2030", border: `1.5px solid ${placed ? C.prem : C.border}`, borderRadius: 8, padding: "10px 14px", cursor: placed ? "default" : "grab", opacity: draggingId === s.id ? 0.4 : placed ? 0.5 : 1, transition: "all 0.3s", fontSize: 13, color: placed ? C.prem : C.text, lineHeight: 1.6, position: "relative" }}>
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
            style={{ width: "100%", minHeight: 70, boxSizing: "border-box", background: allDone ? C.premBg : dragOver ? "rgba(116,185,255,0.08)" : "#151722", border: `2px ${allDone ? "solid" : "dashed"} ${allDone ? C.prem : dragOver ? C.prem : C.border}`, borderRadius: 10, padding: "12px 16px", transition: "all 0.3s" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: allDone ? C.prem : C.muted }}>EVIDENCE</span>
            {placedIds.length === 0 && !dragOver && <p style={{ margin: "6px 0 0", fontSize: 13, color: C.muted, fontStyle: "italic" }}>Drag a sentence here</p>}
            {dragOver && placedIds.length === 0 && <p style={{ margin: "6px 0 0", fontSize: 13, color: C.prem }}>Drop here</p>}
            {placedIds.map(id => {
              const s = dragSentences.find(x => x.id === id);
              return <p key={id} style={{ margin: "6px 0 0", fontSize: 13, color: C.prem, lineHeight: 1.5 }}>{s.text}</p>;
            })}
          </div>
          {wrongFeedback && (
            <div style={{ width: "100%", background: C.failBg, border: `1px solid ${C.fail}44`, borderRadius: 10, padding: "10px 16px", marginTop: 8, boxSizing: "border-box" }}>
              <p style={{ margin: 0, fontSize: 13, color: C.white, lineHeight: 1.6 }}><strong style={{ color: C.fail }}>Try again.</strong> {wrongFeedback.text}</p>
            </div>
          )}
          {allDone && (
            <div style={{ width: "100%", background: C.conclBg, border: `1px solid ${C.concl}44`, borderRadius: 10, padding: "10px 16px", marginTop: 8, boxSizing: "border-box" }}>
              <p style={{ margin: 0, fontSize: 13, color: C.text, lineHeight: 1.6 }}><strong style={{ color: C.concl }}>Correct!</strong> These two observations establish that debates highlight social skills and that media coverage reinforces this focus on interpersonal engagement.</p>
            </div>
          )}
          {allDone && (
            <div style={{ width: "100%", background: C.assumBg, border: `1px solid ${C.assum}44`, borderRadius: 10, padding: "12px 16px", marginTop: 10, boxSizing: "border-box" }}>
              <span style={{ background: `${C.assum}22`, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.assum, fontWeight: 700 }}>THE ARGUMENT IN A NUTSHELL</span>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                <span style={{ color: C.prem }}>Debates spotlight social skills, and media focuses on candidate engagement</span> → <span style={{ color: C.concl }}>therefore showcasing social skills does little to help voters understand leadership potential.</span>
              </p>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: C.assum, lineHeight: 1.6 }}>
                Notice the gap: the author jumps from "debates focus on social skills" to "this doesn't help voters assess leadership." But what if social skills actually are a good indicator of leadership? The argument only works if social skills and leadership potential are not closely connected.
              </p>
            </div>
          )}
          <SmallArrow color={allDone ? C.prem : C.muted} />
          <div style={{ background: C.conclBg, border: `1.5px solid ${C.concl}`, borderRadius: 10, padding: "10px 16px", width: "100%", boxSizing: "border-box" }}>
            <span style={{ background: `${C.concl}22`, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.concl, fontWeight: 700 }}>CONCLUSION (from Step 1)</span>
            <p style={{ margin: "6px 0 0", fontSize: 13.5, color: C.concl, lineHeight: 1.5 }}>Showcasing social skills does little to help voters understand the leadership potential of those taking part.</p>
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
          <p style={{ margin: "4px 0 0", fontSize: 11, color: !relaxed ? C.text : C.muted, lineHeight: 1.4 }}>Social skills are <strong>not a good indicator</strong> of leadership</p>
        </button>
        <button onClick={() => setRelaxed(true)} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${relaxed ? C.fail : C.border}`, background: relaxed ? C.failBg : "transparent", cursor: "pointer", transition: "all 0.3s" }}>
          <span style={{ fontSize: 12, color: relaxed ? C.fail : C.muted, fontWeight: 600 }}>Assumption relaxed</span>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: relaxed ? C.text : C.muted, lineHeight: 1.4 }}>Social skills <strong>are an excellent indicator</strong> of leadership</p>
        </button>
      </div>
      <MiniChain ok={!relaxed} />
      {relaxed && (
        <div style={{ marginTop: 10 }}>
          <div style={{ background: "#1e2030", borderRadius: 8, padding: 12, marginBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 12, color: C.text, lineHeight: 1.6 }}>
              <strong style={{ color: C.prem }}>Scenario:</strong> Research shows that the ability to balance assertiveness with cooperation is the single strongest predictor of effective political leadership. Leaders who excel at engaging with diverse groups consistently outperform those who lack these interpersonal skills.
            </p>
          </div>
          <div style={{ background: C.assumBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${C.assum}` }}>
            <p style={{ margin: 0, fontSize: 12, color: C.assum, lineHeight: 1.6 }}>
              If social skills <strong style={{ color: C.fail }}>are actually a strong indicator of leadership potential</strong>, then showcasing them in debates would genuinely help voters assess candidates. The debates would be doing exactly what they should. The author's conclusion that they "do little to help" would collapse entirely.
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
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>Does the argument need this to be true?</p>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.prem}44` }}>
          <p style={{ fontSize: 11, color: C.prem, fontWeight: 700, margin: "0 0 6px" }}>THE ARGUMENT</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Debates <span style={{ color: C.prem, fontWeight: 700 }}>focus on social skills</span>, which doesn't help voters assess leadership</p>
        </div>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.fail}44` }}>
          <p style={{ fontSize: 11, color: C.fail, fontWeight: 700, margin: "0 0 6px" }}>OPTION A</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>There are <span style={{ color: C.fail, fontWeight: 700 }}>other ways</span> for voters to get information about candidates</p>
        </div>
      </div>
      <div style={{ marginTop: 10, background: C.assumBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${C.assum}` }}>
        <p style={{ margin: 0, fontSize: 12, color: C.assum, lineHeight: 1.5 }}>The argument criticises what debates <span style={{ color: C.prem, fontWeight: 700 }}>do reveal</span> (social skills). Whether voters have <span style={{ color: C.fail, fontWeight: 700 }}>alternative information sources</span> is a separate matter. Even if debates were the only source, the argument about their focus on social skills would still stand.</p>
      </div>
    </div>
  );
}

function VisualB() {
  return (
    <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>Does the argument depend on media financial motives?</p>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.prem}44` }}>
          <p style={{ fontSize: 11, color: C.prem, fontWeight: 700, margin: "0 0 6px" }}>THE ARGUMENT</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Debates showcase <span style={{ color: C.prem, fontWeight: 700 }}>social skills</span>, which doesn't help voters assess leadership</p>
        </div>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.fail}44` }}>
          <p style={{ fontSize: 11, color: C.fail, fontWeight: 700, margin: "0 0 6px" }}>OPTION B</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Media companies have a <span style={{ color: C.fail, fontWeight: 700 }}>financial interest</span> in promoting debates</p>
        </div>
      </div>
      <div style={{ marginTop: 10, background: C.assumBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${C.assum}` }}>
        <p style={{ margin: 0, fontSize: 12, color: C.assum, lineHeight: 1.5 }}>The argument is about <span style={{ color: C.prem, fontWeight: 700 }}>what debates reveal</span> to voters. It says nothing about <span style={{ color: C.fail, fontWeight: 700 }}>why media companies promote</span> them. Whether the media profits from debates or not, the argument about social skills versus leadership would remain unchanged.</p>
      </div>
    </div>
  );
}

function VisualD() {
  return (
    <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>Does the argument mention stereotypes?</p>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.prem}44` }}>
          <p style={{ fontSize: 11, color: C.prem, fontWeight: 700, margin: "0 0 6px" }}>THE ARGUMENT</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Debates focus on <span style={{ color: C.prem, fontWeight: 700 }}>social skills</span> rather than policy, which doesn't reveal leadership</p>
        </div>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.fail}44` }}>
          <p style={{ fontSize: 11, color: C.fail, fontWeight: 700, margin: "0 0 6px" }}>OPTION D</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Debates encourage reliance on <span style={{ color: C.fail, fontWeight: 700 }}>gender and other stereotypes</span></p>
        </div>
      </div>
      <div style={{ marginTop: 10, background: C.assumBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${C.assum}` }}>
        <p style={{ margin: 0, fontSize: 12, color: C.assum, lineHeight: 1.5 }}>The argument's concern is that debates highlight <span style={{ color: C.prem, fontWeight: 700 }}>social skills instead of policy</span>. Stereotypes based on gender or other factors are <span style={{ color: C.fail, fontWeight: 700 }}>never mentioned or implied</span>. This option introduces an entirely new criticism that goes beyond the scope of the passage.</p>
      </div>
    </div>
  );
}

function VisualE() {
  return (
    <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>Scope check: is the argument about who enters elections?</p>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.prem}44` }}>
          <p style={{ fontSize: 11, color: C.prem, fontWeight: 700, margin: "0 0 6px" }}>THE ARGUMENT</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Debates <span style={{ color: C.prem, fontWeight: 700 }}>don't help voters assess</span> candidates who are already running</p>
        </div>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.fail}44` }}>
          <p style={{ fontSize: 11, color: C.fail, fontWeight: 700, margin: "0 0 6px" }}>OPTION E</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Good candidates are <span style={{ color: C.fail, fontWeight: 700 }}>discouraged from entering</span> elections because of debate emphasis</p>
        </div>
      </div>
      <div style={{ marginTop: 10, background: C.assumBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${C.assum}` }}>
        <p style={{ margin: 0, fontSize: 12, color: C.assum, lineHeight: 1.5 }}>The argument is about <span style={{ color: C.prem, fontWeight: 700 }}>what voters learn from debates</span> about existing candidates. Whether some potential candidates <span style={{ color: C.fail, fontWeight: 700 }}>choose not to run</span> because of debate culture is a different issue entirely. The conclusion would hold even if every qualified person still ran.</p>
      </div>
    </div>
  );
}

const questionOptions = [
  { letter: "A", text: "There is no shortage of accessible means by which voters can gain relevant information about candidates.", verdict: "incorrect", explanation: "The argument critiques what debates reveal, not whether voters have other information sources. The reasoning is entirely about the mismatch between social skills and leadership insight. Alternative sources are never mentioned or required.", Visual: VisualA },
  { letter: "B", text: "Media companies have a financial interest in promoting televised debates.", verdict: "incorrect", explanation: "The argument is about what debates show voters, not about why media companies choose to broadcast them. The media's financial motives are completely outside the scope of this reasoning.", Visual: VisualB },
  { letter: "C", text: "Social skills are not a good indicator of leadership potential.", verdict: "correct", explanation: "This is the hidden assumption. The argument observes that debates showcase social skills, then concludes this doesn't help voters assess leadership. But this only works if social skills and leadership potential are not closely linked. If social skills were actually a strong indicator of leadership, then highlighting them would be genuinely useful for voters. Toggle below to see the argument break.", Visual: VisualC },
  { letter: "D", text: "The televised debates encourage voters to rely on gender and other stereotypes when evaluating candidates.", verdict: "incorrect", explanation: "The passage never mentions gender, stereotypes, or any form of bias. This introduces a completely new concern that is not part of the author's reasoning about social skills versus leadership potential.", Visual: VisualD },
  { letter: "E", text: "Some high-quality candidates are discouraged from entering elections because of the emphasis on televised debates.", verdict: "incorrect", explanation: "The argument focuses on what existing debates reveal to voters about the candidates who do participate. Whether some people are deterred from running is a separate concern that plays no role in the reasoning.", Visual: VisualE },
];

function OptionCard({ opt, expanded, onClick, animate, Visual }) {
  const ok = opt.verdict === "correct";
  const bc = expanded ? (ok ? C.ok : C.fail) : C.border;
  return (
    <div style={{
      background: expanded ? (ok ? C.conclBg : C.failBg) : "#1e2030",
      border: `1.5px solid ${bc}`,
      borderRadius: 12,
      padding: "14px 18px",
      cursor: "pointer",
      transition: "all 0.3s",
      opacity: animate ? 1 : 0,
      transform: animate ? "translateY(0)" : "translateY(12px)"
    }} onClick={onClick}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{
          background: expanded ? (ok ? C.ok : C.fail) : C.accent,
          borderRadius: 6, width: 28, height: 28,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: C.white, flexShrink: 0, transition: "all 0.3s"
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
                lineHeight: 1.6,
                borderLeft: `3px solid ${ok ? C.ok : C.fail}`
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
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 41</p>
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
                <OptionCard
                  key={opt.letter}
                  opt={opt}
                  expanded={expanded === opt.letter}
                  animate={optAnim[i]}
                  Visual={opt.Visual}
                  onClick={() => setExpanded(p => p === opt.letter ? null : opt.letter)}
                />
              ))}
            </div>
          </>
        )}

        {/* Nav Buttons */}
        <div style={{ display: "flex", gap: 12, paddingBottom: 32 }}>
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{
            flex: 1, padding: "13px 20px", borderRadius: 10,
            border: `1px solid ${C.border}`,
            background: step === 0 ? C.card : "#1e2030",
            color: step === 0 ? C.muted : C.text,
            fontSize: 14, fontWeight: 600,
            cursor: step === 0 ? "not-allowed" : "pointer",
            opacity: step === 0 ? 0.4 : 1
          }}>← Previous</button>
          <button onClick={() => setStep(Math.min(3, step + 1))} disabled={step === 3} style={{
            flex: 1, padding: "13px 20px", borderRadius: 10,
            border: "none",
            background: step === 3 ? "#1e2030" : `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
            color: step === 3 ? C.muted : C.white,
            fontSize: 14, fontWeight: 600,
            cursor: step === 3 ? "not-allowed" : "pointer",
            opacity: step === 3 ? 0.4 : 1
          }}>Next →</button>
        </div>
      </div>
    </div>
  );
}