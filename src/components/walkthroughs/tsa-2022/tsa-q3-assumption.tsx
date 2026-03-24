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
  "retail parks": "Large shopping areas on the edge of a town, typically containing several big stores with shared parking.",
  "outskirts": "The outer parts of a town or city, away from the centre.",
  "inevitably": "In a way that cannot be avoided or prevented. Certain to happen.",
  "consumer choice": "The range of different products and services available for people to buy.",
  "conducted": "Carried out or performed. Here it means the activity of shopping is done or carried out online.",
};

const phrases = [
  { id: "p1", text: "Whether known as the high street, main street, or market square, central shopping districts in many towns throughout the world are in danger of disappearing.", isConclusion: false },
  { id: "p2", text: "The decline in some downtown shopping areas began decades ago because of various social and economic trends, including an increase in the number of women working outside of the home and the development of large supermarkets and retail parks further out on the outskirts of towns.", isConclusion: false },
  { id: "p3", text: "While change is inevitably difficult, communities should not be fearful about the loss of their traditional shopping areas.", isConclusion: true },
  { id: "p4", text: "Shopping is increasingly conducted via the internet.", isConclusion: false },
  { id: "p5", text: "Compared to traditional ways of shopping, the online model offers savings in terms of time and other resources while also providing greater consumer choice.", isConclusion: false },
];

const dragSentences = [
  { id: "d1", text: "Central shopping districts in many towns are in danger of disappearing.", isEvidence: false, feedback: "This is background context describing the current situation. It sets the scene but doesn't directly support the conclusion about why communities shouldn't worry." },
  { id: "d2", text: "The decline began decades ago due to social and economic trends, including more women working and the development of retail parks.", isEvidence: false, feedback: "This explains the historical causes of the decline. It provides background but doesn't support the claim that communities shouldn't be fearful." },
  { id: "d3", text: "Shopping is increasingly conducted via the internet.", isEvidence: true },
  { id: "d4", text: "Online shopping offers savings in time and resources while providing greater consumer choice.", isEvidence: true },
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
        Whether known as the high street, main street, or market square, central shopping districts in many towns throughout the world are in danger of disappearing. The decline in some downtown shopping areas began decades ago because of various social and economic trends, including an increase in the number of women working outside of the home and the development of large supermarkets and <Vocab term="retail parks">retail parks</Vocab> further out on the <Vocab term="outskirts">outskirts</Vocab> of towns. While change is <Vocab term="inevitably">inevitably</Vocab> difficult, communities should not be fearful about the loss of their traditional shopping areas. Shopping is increasingly <Vocab term="conducted">conducted</Vocab> via the internet. Compared to traditional ways of shopping, the online model offers savings in terms of time and other resources while also providing greater <Vocab term="consumer choice">consumer choice</Vocab>.
      </p>
    </div>
  );
}

function PassageFull({ evidenceHighlighted }) {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>
        {"Whether known as the high street, main street, or market square, central shopping districts in many towns throughout the world are in danger of disappearing. The decline in some downtown shopping areas began decades ago because of various social and economic trends, including an increase in the number of women working outside of the home and the development of large supermarkets and retail parks further out on the outskirts of towns. "}
        <span style={{ color: C.concl, backgroundColor: C.conclBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.concl}` }}>While change is inevitably difficult, communities should not be fearful about the loss of their traditional shopping areas.</span>
        {" "}
        <span style={{ color: evidenceHighlighted ? C.prem : "inherit", backgroundColor: evidenceHighlighted ? C.premBg : "transparent", padding: evidenceHighlighted ? "2px 4px" : 0, borderRadius: 3, borderBottom: evidenceHighlighted ? `2px solid ${C.prem}` : "none", transition: "all 0.4s" }}>Shopping is increasingly conducted via the internet. Compared to traditional ways of shopping, the online model offers savings in terms of time and other resources while also providing greater consumer choice.</span>
      </p>
    </div>
  );
}

function MiniChain({ ok }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, margin: "10px 0" }}>
      <div style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 8, padding: "8px 12px", width: "100%", boxSizing: "border-box" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.prem }}>EVIDENCE</span>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: C.text, lineHeight: 1.4 }}>Online shopping offers time savings, resource savings, and greater consumer choice</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "3px 0" }}>
        <div style={{ width: 2, height: 8, background: ok ? C.concl + "66" : C.fail + "66", transition: "background 0.5s" }} />
        <span style={{ fontSize: 9, fontWeight: 700, color: ok ? C.concl : C.fail, transition: "color 0.5s" }}>{ok ? "IMPLIES" : "DOES NOT IMPLY"}</span>
        <div style={{ width: 2, height: 8, background: ok ? C.concl + "66" : C.fail + "66", transition: "background 0.5s" }} />
        <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `6px solid ${ok ? C.concl + "88" : C.fail + "88"}`, transition: "border-top-color 0.5s" }} />
      </div>
      <div style={{ background: ok ? C.conclBg : C.failBg, border: `1px solid ${ok ? C.concl : C.fail}`, borderRadius: 8, padding: "8px 12px", width: "100%", boxSizing: "border-box", position: "relative", transition: "all 0.5s" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: ok ? C.concl : C.fail, transition: "color 0.5s" }}>CONCLUSION</span>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: ok ? C.text : C.fail, lineHeight: 1.4, transition: "color 0.5s" }}>Communities should not be fearful about losing traditional shopping areas</p>
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
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Find the <strong style={{ color: C.concl }}>main conclusion</strong>. What is the author ultimately arguing communities should think about the decline of shopping areas?</p>
        </div>
        <div style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 10, padding: "14px 18px", fontSize: 13, color: C.concl, lineHeight: 1.6 }}><strong>Hint:</strong> Look for the sentence that tells you how people should feel. The author is making a recommendation, not just reporting facts.</div>
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
              <p key={p.id} style={{ margin: "0 0 10px", cursor: found ? "default" : "pointer" }} onMouseEnter={() => !found && setHovId(p.id)} onMouseLeave={() => !found && setHovId(null)} onClick={() => handleClick(p)}>
                <span style={{ borderBottom: isF ? `2px solid ${C.concl}` : isH ? `2px solid ${C.muted}` : "2px solid transparent", backgroundColor: isF ? C.conclBg : "transparent", color: isF ? C.concl : isW ? C.fail : "inherit", padding: isF ? "2px 4px" : 0, borderRadius: 3, transition: "all 0.3s" }}>{p.text}</span>
              </p>
            );
          })}
        </div>
        {(wrongId || found) && (
          <div style={{ background: found ? `${C.concl}0a` : C.failBg, border: `1px solid ${found ? C.concl + "44" : C.fail + "44"}`, borderRadius: 10, padding: "12px 16px", marginTop: 4 }}>
            {found ? (
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ background: `${C.concl}22`, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "3px 10px", fontSize: 11, color: C.concl, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>CONCLUSION</span>
                <p style={{ margin: 0, fontSize: 13.5, color: C.text, lineHeight: 1.65 }}><strong style={{ color: C.ok }}>Correct!</strong> "Communities should not be fearful about the loss of their traditional shopping areas" is the main conclusion. The author is telling us not to worry. But why not? That depends on the evidence that follows.</p>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: C.white }}>Try again. Look for the sentence where the author tells you what attitude to take. Which sentence makes a recommendation rather than stating a fact?</p>
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
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Drag the <strong style={{ color: C.prem }}>key evidence</strong> into the box below. What reasons does the author give for why communities shouldn't worry?</p>
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
            {placedIds.map(id => { const s = dragSentences.find(x => x.id === id); return <p key={id} style={{ margin: "6px 0 0", fontSize: 13, color: C.prem, lineHeight: 1.5 }}>{s.text}</p>; })}
          </div>
          {wrongFeedback && (
            <div style={{ width: "100%", background: C.failBg, border: `1px solid ${C.fail}44`, borderRadius: 10, padding: "10px 16px", marginTop: 8, boxSizing: "border-box" }}>
              <p style={{ margin: 0, fontSize: 13, color: C.white, lineHeight: 1.6 }}><strong style={{ color: C.fail }}>Try again.</strong> {wrongFeedback.text}</p>
            </div>
          )}
          {allDone && (
            <div style={{ width: "100%", background: C.conclBg, border: `1px solid ${C.concl}44`, borderRadius: 10, padding: "10px 16px", marginTop: 8, boxSizing: "border-box" }}>
              <p style={{ margin: 0, fontSize: 13, color: C.text, lineHeight: 1.6 }}><strong style={{ color: C.concl }}>Correct!</strong> The author's case rests on online shopping being a suitable replacement: it saves time, saves resources, and offers more choice.</p>
            </div>
          )}
          {allDone && (
            <div style={{ width: "100%", background: C.assumBg, border: `1px solid ${C.assum}44`, borderRadius: 10, padding: "12px 16px", marginTop: 10, boxSizing: "border-box" }}>
              <span style={{ background: `${C.assum}22`, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.assum, fontWeight: 700 }}>THE ARGUMENT IN A NUTSHELL</span>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                <span style={{ color: C.prem }}>Online shopping saves time, saves resources, and offers greater choice</span> → <span style={{ color: C.concl }}>therefore communities should not fear losing traditional shopping areas.</span>
              </p>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: C.assum, lineHeight: 1.6 }}>
                But notice the gap: the author only talks about the shopping function of high streets. What if traditional shopping areas serve purposes beyond just buying things? Community gathering, local identity, social interaction. The argument assumes these other purposes either don't exist or can be replaced.
              </p>
            </div>
          )}
          <SmallArrow color={allDone ? C.prem : C.muted} />
          <div style={{ background: C.conclBg, border: `1.5px solid ${C.concl}`, borderRadius: 10, padding: "10px 16px", width: "100%", boxSizing: "border-box" }}>
            <span style={{ background: `${C.concl}22`, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.concl, fontWeight: 700 }}>CONCLUSION (from Step 1)</span>
            <p style={{ margin: "6px 0 0", fontSize: 13.5, color: C.concl, lineHeight: 1.5 }}>Communities should not be fearful about the loss of their traditional shopping areas.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualE() {
  const [relaxed, setRelaxed] = useState(false);
  return (
    <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>What happens when we relax this assumption?</p>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <button onClick={() => setRelaxed(false)} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${!relaxed ? C.ok : C.border}`, background: !relaxed ? "rgba(85,239,196,0.1)" : "transparent", cursor: "pointer", transition: "all 0.3s" }}>
          <span style={{ fontSize: 12, color: !relaxed ? C.ok : C.muted, fontWeight: 600 }}>Assumption holds</span>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: !relaxed ? C.text : C.muted, lineHeight: 1.4 }}>Traditional shopping areas serve <strong>no important purpose</strong> beyond shopping</p>
        </button>
        <button onClick={() => setRelaxed(true)} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${relaxed ? C.fail : C.border}`, background: relaxed ? C.failBg : "transparent", cursor: "pointer", transition: "all 0.3s" }}>
          <span style={{ fontSize: 12, color: relaxed ? C.fail : C.muted, fontWeight: 600 }}>Assumption relaxed</span>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: relaxed ? C.text : C.muted, lineHeight: 1.4 }}>Traditional areas serve <strong>vital purposes</strong> that online shopping cannot replace</p>
        </button>
      </div>
      <MiniChain ok={!relaxed} />
      {relaxed && (
        <div style={{ marginTop: 10 }}>
          <div style={{ background: "#1e2030", borderRadius: 8, padding: 12, marginBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 12, color: C.text, lineHeight: 1.6 }}>
              <strong style={{ color: C.prem }}>Scenario:</strong> A town's high street is the only place where elderly residents socialise. The weekly market is a hub for community news and local identity. Small independent shops provide employment that can't be replaced by warehouse jobs. Losing the high street means losing the social fabric of the town.
            </p>
          </div>
          <div style={{ background: C.assumBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${C.assum}` }}>
            <p style={{ margin: 0, fontSize: 12, color: C.assum, lineHeight: 1.6 }}>
              If traditional shopping areas serve <strong style={{ color: C.fail }}>important purposes that online shopping cannot satisfy</strong>, like community, identity, and social connection, then communities absolutely should be fearful about losing them. The fact that online shopping is convenient for buying things becomes irrelevant. The conclusion collapses.
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
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>What is this option actually about?</p>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.prem}44` }}>
          <p style={{ fontSize: 11, color: C.prem, fontWeight: 700, margin: "0 0 6px" }}>THE ARGUMENT</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Communities <span style={{ color: C.prem, fontWeight: 700 }}>shouldn't fear</span> losing shopping areas because online shopping is a good alternative</p>
        </div>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.fail}44` }}>
          <p style={{ fontSize: 11, color: C.fail, fontWeight: 700, margin: "0 0 6px" }}>OPTION A</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Women do <span style={{ color: C.fail, fontWeight: 700 }}>less shopping</span> than before</p>
        </div>
      </div>
      <div style={{ marginTop: 10, background: C.assumBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${C.assum}` }}>
        <p style={{ margin: 0, fontSize: 12, color: C.assum, lineHeight: 1.5 }}>Women working more is mentioned as one <span style={{ color: C.prem, fontWeight: 700 }}>historical cause</span> of the decline, not as part of the reasoning for why communities shouldn't worry. Even if women shop just as much as before (using online shopping), the argument still works. This is <span style={{ color: C.fail, fontWeight: 700 }}>background context</span>, not a link the conclusion depends on.</p>
      </div>
    </div>
  );
}

function VisualB() {
  return (
    <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>Is wealth relevant to the argument?</p>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.prem}44` }}>
          <p style={{ fontSize: 11, color: C.prem, fontWeight: 700, margin: "0 0 6px" }}>THE ARGUMENT</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Online shopping is a <span style={{ color: C.prem, fontWeight: 700 }}>good enough replacement</span> for traditional shopping</p>
        </div>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.fail}44` }}>
          <p style={{ fontSize: 11, color: C.fail, fontWeight: 700, margin: "0 0 6px" }}>OPTION B</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Decline is <span style={{ color: C.fail, fontWeight: 700 }}>faster in wealthier places</span></p>
        </div>
      </div>
      <div style={{ marginTop: 10, background: C.assumBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${C.assum}` }}>
        <p style={{ margin: 0, fontSize: 12, color: C.assum, lineHeight: 1.5 }}>The argument never claims anything about where the decline is happening fastest. It makes a general claim about <span style={{ color: C.prem, fontWeight: 700 }}>all communities</span>. Whether wealthier places are losing shops faster is an interesting detail, but the conclusion doesn't depend on it. The argument works the same way regardless of <span style={{ color: C.fail, fontWeight: 700 }}>where</span> the decline is most severe.</p>
      </div>
    </div>
  );
}

function VisualC() {
  return (
    <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>What is this option actually about?</p>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.prem}44` }}>
          <p style={{ fontSize: 11, color: C.prem, fontWeight: 700, margin: "0 0 6px" }}>THE ARGUMENT</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Communities <span style={{ color: C.prem, fontWeight: 700 }}>shouldn't worry</span> because online shopping replaces what they're losing</p>
        </div>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.fail}44` }}>
          <p style={{ fontSize: 11, color: C.fail, fontWeight: 700, margin: "0 0 6px" }}>OPTION C</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>It is <span style={{ color: C.fail, fontWeight: 700 }}>difficult for governments</span> to stop the decline</p>
        </div>
      </div>
      <div style={{ marginTop: 10, background: C.assumBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${C.assum}` }}>
        <p style={{ margin: 0, fontSize: 12, color: C.assum, lineHeight: 1.5 }}>The argument says communities shouldn't <span style={{ color: C.prem, fontWeight: 700 }}>fear</span> the loss, not that the loss is <span style={{ color: C.fail, fontWeight: 700 }}>unstoppable</span>. These are different claims. Even if governments could easily reverse the decline, the author's point would still stand: the decline isn't something to worry about because alternatives exist. Government capability is a separate issue entirely.</p>
      </div>
    </div>
  );
}

function VisualD() {
  return (
    <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>Does the argument need supermarkets to survive?</p>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.prem}44` }}>
          <p style={{ fontSize: 11, color: C.prem, fontWeight: 700, margin: "0 0 6px" }}>THE ARGUMENT</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Don't worry about losing high streets because <span style={{ color: C.prem, fontWeight: 700 }}>online shopping</span> is a good alternative</p>
        </div>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.fail}44` }}>
          <p style={{ fontSize: 11, color: C.fail, fontWeight: 700, margin: "0 0 6px" }}>OPTION D</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Online shopping won't threaten <span style={{ color: C.fail, fontWeight: 700 }}>supermarkets on the outskirts</span></p>
        </div>
      </div>
      <div style={{ marginTop: 10, background: C.assumBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${C.assum}` }}>
        <p style={{ margin: 0, fontSize: 12, color: C.assum, lineHeight: 1.5 }}>Supermarkets on the outskirts are mentioned as one <span style={{ color: C.prem, fontWeight: 700 }}>historical cause</span> of the decline. But the argument for why communities shouldn't worry rests on <span style={{ color: C.prem, fontWeight: 700 }}>online shopping</span>, not on supermarkets continuing to thrive. Even if online shopping did threaten supermarkets too, the argument would still work: the conclusion is about fear of losing <span style={{ color: C.fail, fontWeight: 700 }}>traditional central shopping areas</span>, not about supermarkets.</p>
      </div>
    </div>
  );
}

function OptionCard({ opt, expanded, onClick, animate, Visual }) {
  const ok = opt.verdict === "correct";
  const bc = expanded ? (ok ? C.ok : C.fail) : C.border;
  return (
    <div style={{ background: expanded ? (ok ? C.conclBg : C.failBg) : "#1e2030", border: `1.5px solid ${bc}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", transition: "all 0.3s", opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(12px)" }} onClick={onClick}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ background: expanded ? (ok ? C.ok : C.fail) : C.accent, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.white, flexShrink: 0, transition: "all 0.3s" }}>{expanded ? (ok ? "✓" : "✗") : opt.letter}</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.6 }}>{opt.text}</p>
          {expanded && (
            <>
              <div style={{ marginTop: 10, padding: "10px 14px", background: ok ? C.conclBg : C.failBg, borderRadius: 8, fontSize: 13, color: ok ? C.concl : C.fail, lineHeight: 1.6, borderLeft: `3px solid ${ok ? C.ok : C.fail}` }}>
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

const questionOptions = [
  { letter: "A", text: "Women in many countries do less shopping than in previous decades.", verdict: "incorrect", explanation: "The argument mentions women working more as a historical cause of the decline, but the conclusion doesn't depend on how much shopping women do now. This is about why the decline happened, not about whether communities should worry.", Visual: VisualA },
  { letter: "B", text: "The decline in central shopping districts is happening more quickly in places with wealthier populations.", verdict: "incorrect", explanation: "The argument makes no claim about where the decline is happening fastest. The conclusion applies to communities in general. The speed of decline in wealthy vs. poor areas is irrelevant to whether online shopping is a good replacement.", Visual: VisualB },
  { letter: "C", text: "It is difficult for governments to try to stop the decline of central shopping areas.", verdict: "incorrect", explanation: "The argument says communities shouldn't fear the loss, not that the loss is inevitable or unstoppable. Even if governments could easily reverse the decline, the author's point about online shopping being a good alternative would still stand.", Visual: VisualC },
  { letter: "D", text: "The growth in online shopping will not threaten the profitability of large supermarkets on the outskirts of towns.", verdict: "incorrect", explanation: "Supermarkets are mentioned as one cause of the original decline, but the argument for not worrying is based on online shopping. Whether online shopping also threatens supermarkets is a separate issue that the conclusion doesn't depend on.", Visual: VisualD },
  { letter: "E", text: "Traditional shopping areas serve no important purpose that cannot be satisfied by alternative shopping methods.", verdict: "correct", explanation: "This is the hidden assumption. The author argues: online shopping saves time, saves resources, and offers more choice, so don't worry about losing high streets. But this only works if shopping is all that high streets are for. If they also serve as community hubs, social spaces, or sources of local identity, then online shopping can't replace what's being lost, and communities would have good reason to worry.", Visual: VisualE },
];

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
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Trebuchet MS', 'Gill Sans', Calibri, sans-serif", letterSpacing: 0.2, padding: "24px 16px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: 1 }}>TARA</span>
            <span style={{ fontSize: 12, color: C.muted }}>Critical Thinking</span>
            <span style={{ fontSize: 12, color: C.muted }}>·</span>
            <span style={{ fontSize: 12, color: C.assum }}>Identifying an Assumption</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 3</p>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {stepsMeta.map(s => (
            <button key={s.id} onClick={() => setStep(s.id)} style={{ flex: 1, minWidth: 0, background: step === s.id ? C.accent : step > s.id ? "rgba(108,92,231,0.15)" : "#1e2030", border: `1px solid ${step === s.id ? C.accent : step > s.id ? C.accent + "44" : C.border}`, borderRadius: 10, padding: "10px 6px", cursor: "pointer", transition: "all 0.3s", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted, lineHeight: 1 }}>{s.id + 1}</span>
              <span style={{ fontSize: 11, fontWeight: step === s.id ? 700 : 500, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted, whiteSpace: "nowrap" }}>{s.label}</span>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ background: C.accent, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.white }}>{step + 1}</span>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.white, margin: 0 }}>{stepsMeta[step].title}</h2>
        </div>

        {step === 0 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span>
              <PassageRaw />
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>Read the passage carefully. <span style={{ color: C.vocab }}>Hover yellow terms</span> for definitions. This is an <strong style={{ color: C.white }}>Identifying an Assumption</strong> question:</p>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}><em>"Which one of the following is an underlying assumption of the above argument?"</em></div>
              <div style={{ marginTop: 12, background: C.assumBg, border: `1px solid ${C.assum}44`, borderRadius: 10, padding: "12px 16px" }}>
                <p style={{ margin: 0, fontSize: 13, color: C.assum, lineHeight: 1.6 }}><strong>Assumption questions</strong> ask you to find the hidden, unstated belief that holds the argument together. The author takes this for granted without saying it. If the assumption turns out to be false, the conclusion no longer follows from the evidence.</p>
              </div>
            </div>
          </>
        )}

        {step === 1 && <ConclusionFinder onFound={() => {}} />}
        {step === 2 && <EvidenceBuilder />}

        {step === 3 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span>
              <PassageFull evidenceHighlighted={true} />
              <div style={{ marginTop: 12, display: "flex", gap: 10, fontSize: 11, color: C.muted }}>
                <span><span style={{ color: C.concl }}>■</span> Conclusion</span>
                <span><span style={{ color: C.prem }}>■</span> Evidence</span>
              </div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}><em>"Which one of the following is an underlying assumption of the above argument?"</em></div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 14 }}>
              <p style={{ color: C.muted, fontSize: 14, margin: 0 }}><strong style={{ color: C.assum }}>Click each option</strong> to see why it's right or wrong:</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {questionOptions.map((opt, i) => (
                <OptionCard key={opt.letter} opt={opt} expanded={expanded === opt.letter} animate={optAnim[i]} Visual={opt.Visual} onClick={() => setExpanded(p => p === opt.letter ? null : opt.letter)} />
              ))}
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: 12, paddingBottom: 32 }}>
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: `1px solid ${C.border}`, background: step === 0 ? C.card : "#1e2030", color: step === 0 ? C.muted : C.text, fontSize: 14, fontWeight: 600, cursor: step === 0 ? "not-allowed" : "pointer", opacity: step === 0 ? 0.4 : 1 }}>← Previous</button>
          {step < 3 ? (<button onClick={() => setStep(step + 1)} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Next →</button>) : (<button onClick={() => window.dispatchEvent(new CustomEvent("walkthrough-complete"))} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.ok}, #2ecc71)`, color: C.white, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>✓ Back to Question Review</button>)}
        </div>
      </div>
    </div>
  );
}