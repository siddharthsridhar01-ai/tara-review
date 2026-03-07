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
  "broadcast": "A programme transmitted on television or radio to the public.",
  "diversity": "The inclusion of people from a range of different backgrounds, such as different races, ethnicities, genders, and cultures.",
  "minority ethnic": "Relating to a group of people who share a cultural or racial identity and make up a smaller proportion of the overall population.",
  "wake-up call": "An event or situation that alerts people to a problem and urges them to take action.",
  "mirrors": "Reflects or closely matches something else in composition or character.",
};

const phrases = [
  { id: "p1", text: "In a recent UK news broadcast, a white reporter appeared to mistake a Labour Member of Parliament (MP), who is Black, for another MP who is also Black.", isConclusion: false },
  { id: "p2", text: "This shows the dangers of a lack of diversity in workplaces.", isConclusion: false },
  { id: "p3", text: "It is not the first time that such a mistake has occurred: a week earlier the same television channel had mistakenly shown footage of LeBron James in their coverage of the death of his fellow basketball star Kobe Bryant.", isConclusion: false },
  { id: "p4", text: "A recent report showed that only 14.8% of that television channel's workforce were from a minority ethnic or racial background.", isConclusion: false },
  { id: "p5", text: "Media organisations in the UK should take this as a wake-up call, and take steps to ensure that the diversity of their workforce mirrors that of the wider population.", isConclusion: true },
];

const dragSentences = [
  { id: "d1", text: "A white reporter mistook one Black MP for another Black MP during a news broadcast.", isEvidence: true },
  { id: "d2", text: "The same channel had previously shown footage of LeBron James in coverage of Kobe Bryant's death.", isEvidence: true },
  { id: "d3", text: "Only 14.8% of the channel's workforce were from a minority ethnic or racial background.", isEvidence: true },
  { id: "d4", text: "This shows the dangers of a lack of diversity in workplaces.", isEvidence: false, feedback: "This is an intermediate claim the author draws from the examples. It is a reason supporting the final conclusion, but it is itself a claim, not raw evidence. Look for the concrete facts and data the author presents." },
];

function Vocab({ term, children }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline" }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ borderBottom: "2px dashed #ffeaa7", cursor: "help", color: "#ffeaa7" }}>{children || term}</span>
      {show && (<span style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "#2d3047", border: "1px solid #ffeaa7", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#ffeaa7", width: 260, zIndex: 100, lineHeight: 1.5, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", pointerEvents: "none" }}><span style={{ fontWeight: 700, display: "block", marginBottom: 4 }}>Definition</span>{vocabDefs[term]}</span>)}
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
        In a recent UK news <Vocab term="broadcast">broadcast</Vocab>, a white reporter appeared to mistake a Labour Member of Parliament (MP), who is Black, for another MP who is also Black. This shows the dangers of a lack of <Vocab term="diversity">diversity</Vocab> in workplaces. It is not the first time that such a mistake has occurred: a week earlier the same television channel had mistakenly shown footage of LeBron James in their coverage of the death of his fellow basketball star Kobe Bryant. A recent report showed that only 14.8% of that television channel's workforce were from a <Vocab term="minority ethnic">minority ethnic</Vocab> or racial background. Media organisations in the UK should take this as a <Vocab term="wake-up call">wake-up call</Vocab>, and take steps to ensure that the diversity of their workforce <Vocab term="mirrors">mirrors</Vocab> that of the wider population.
      </p>
    </div>
  );
}

function PassageFull({ evidenceHighlighted }) {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>
        <span style={{ color: evidenceHighlighted ? C.prem : "inherit", backgroundColor: evidenceHighlighted ? C.premBg : "transparent", padding: evidenceHighlighted ? "2px 4px" : 0, borderRadius: 3, borderBottom: evidenceHighlighted ? `2px solid ${C.prem}` : "none", transition: "all 0.4s" }}>In a recent UK news broadcast, a white reporter appeared to mistake a Labour Member of Parliament (MP), who is Black, for another MP who is also Black.</span>
        {" This shows the dangers of a lack of diversity in workplaces. "}
        <span style={{ color: evidenceHighlighted ? C.prem : "inherit", backgroundColor: evidenceHighlighted ? C.premBg : "transparent", padding: evidenceHighlighted ? "2px 4px" : 0, borderRadius: 3, borderBottom: evidenceHighlighted ? `2px solid ${C.prem}` : "none", transition: "all 0.4s" }}>It is not the first time that such a mistake has occurred: a week earlier the same television channel had mistakenly shown footage of LeBron James in their coverage of the death of his fellow basketball star Kobe Bryant.</span>
        {" "}
        <span style={{ color: evidenceHighlighted ? C.prem : "inherit", backgroundColor: evidenceHighlighted ? C.premBg : "transparent", padding: evidenceHighlighted ? "2px 4px" : 0, borderRadius: 3, borderBottom: evidenceHighlighted ? `2px solid ${C.prem}` : "none", transition: "all 0.4s" }}>A recent report showed that only 14.8% of that television channel's workforce were from a minority ethnic or racial background.</span>
        {" "}
        <span style={{ color: C.concl, backgroundColor: C.conclBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.concl}` }}>Media organisations in the UK should take this as a wake-up call, and take steps to ensure that the diversity of their workforce mirrors that of the wider population.</span>
      </p>
    </div>
  );
}

function MiniChain({ ok }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, margin: "10px 0" }}>
      <div style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 8, padding: "8px 12px", width: "100%", boxSizing: "border-box" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: C.prem }}>EVIDENCE</span>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: C.text, lineHeight: 1.4 }}>Mistakes confusing Black individuals occurred, and only 14.8% of the workforce are from minority backgrounds</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "3px 0" }}>
        <div style={{ width: 2, height: 8, background: ok ? C.concl + "66" : C.fail + "66", transition: "background 0.5s" }} />
        <span style={{ fontSize: 9, fontWeight: 700, color: ok ? C.concl : C.fail, transition: "color 0.5s" }}>{ok ? "IMPLIES" : "DOES NOT IMPLY"}</span>
        <div style={{ width: 2, height: 8, background: ok ? C.concl + "66" : C.fail + "66", transition: "background 0.5s" }} />
        <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `6px solid ${ok ? C.concl + "88" : C.fail + "88"}`, transition: "border-top-color 0.5s" }} />
      </div>
      <div style={{ background: ok ? C.conclBg : C.failBg, border: `1px solid ${ok ? C.concl : C.fail}`, borderRadius: 8, padding: "8px 12px", width: "100%", boxSizing: "border-box", position: "relative", transition: "all 0.5s" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: ok ? C.concl : C.fail, transition: "color 0.5s" }}>CONCLUSION</span>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: ok ? C.text : C.fail, lineHeight: 1.4, transition: "color 0.5s" }}>Media organisations should ensure workforce diversity mirrors the wider population</p>
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
    if (p.isConclusion) { setFound(true); setWrongId(null); onFound(); }
    else { setWrongId(p.id); }
  };

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
          <span style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.concl, fontWeight: 700, whiteSpace: "nowrap" }}>STEP 1</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Find the <strong style={{ color: C.concl }}>main conclusion</strong>. What is the author ultimately arguing that media organisations should do?</p>
        </div>
        <div style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 10, padding: "14px 18px", fontSize: 13, color: C.concl, lineHeight: 1.6 }}><strong>Hint:</strong> Look for the sentence that makes a recommendation. Which sentence tells someone what they ought to do, rather than simply describing what happened?</div>
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
                <p style={{ margin: 0, fontSize: 13.5, color: C.text, lineHeight: 1.65 }}><strong style={{ color: C.ok }}>Correct!</strong> The author's ultimate claim is that media organisations should diversify their workforces to match the wider population. Everything else in the passage is either an example of the problem or supporting data. This final sentence is the recommendation the whole argument builds towards.</p>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: C.white }}>Try again. That sentence provides supporting detail. Look for the sentence that makes a recommendation about what media organisations should do going forward.</p>
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
    e.preventDefault(); setDragOver(false);
    const id = e.dataTransfer.getData("text/plain");
    const s = dragSentences.find(x => x.id === id);
    if (!s) return;
    if (placedIds.includes(id)) return;
    if (s.isEvidence) { setPlacedIds(p => [...p, id]); setWrongFeedback(null); }
    else { setWrongFeedback({ id, text: s.feedback }); }
    setDraggingId(null);
  };

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.prem, fontWeight: 700, whiteSpace: "nowrap" }}>STEP 2</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Drag the <strong style={{ color: C.prem }}>key evidence</strong> into the box below. What concrete facts and data does the author use to build the case?</p>
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
            {placedIds.length === 0 && !dragOver && <p style={{ margin: "6px 0 0", fontSize: 13, color: C.muted, fontStyle: "italic" }}>Drag sentences here</p>}
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
              <p style={{ margin: 0, fontSize: 13, color: C.text, lineHeight: 1.6 }}><strong style={{ color: C.concl }}>Correct!</strong> These are the three concrete facts: two mix-up incidents and one workforce diversity statistic. The claim about "dangers of a lack of diversity" is an intermediate conclusion the author draws from these facts, not raw evidence itself.</p>
            </div>
          )}
          {allDone && (
            <div style={{ width: "100%", background: C.assumBg, border: `1px solid ${C.assum}44`, borderRadius: 10, padding: "12px 16px", marginTop: 10, boxSizing: "border-box" }}>
              <span style={{ background: `${C.assum}22`, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.assum, fontWeight: 700 }}>THE ARGUMENT IN A NUTSHELL</span>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                <span style={{ color: C.prem }}>Reporters confused Black individuals on air, and the channel's workforce lacks ethnic diversity</span> → <span style={{ color: C.concl }}>therefore media organisations should diversify their workforces to match the wider population.</span>
              </p>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: C.assum, lineHeight: 1.6 }}>
                Notice the gap: the argument links low workforce diversity to these mistakes, and then says increasing diversity would fix the problem. But does the argument ever prove that a more diverse workforce would actually prevent such errors? That connection is assumed, not stated.
              </p>
            </div>
          )}
          <SmallArrow color={allDone ? C.prem : C.muted} />
          <div style={{ background: C.conclBg, border: `1.5px solid ${C.concl}`, borderRadius: 10, padding: "10px 16px", width: "100%", boxSizing: "border-box" }}>
            <span style={{ background: `${C.concl}22`, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.concl, fontWeight: 700 }}>CONCLUSION (from Step 1)</span>
            <p style={{ margin: "6px 0 0", fontSize: 13.5, color: C.concl, lineHeight: 1.5 }}>Media organisations should ensure their workforce diversity mirrors the wider population.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualD() {
  const [relaxed, setRelaxed] = useState(false);
  return (
    <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>What happens when we relax this assumption?</p>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <button onClick={() => setRelaxed(false)} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${!relaxed ? C.ok : C.border}`, background: !relaxed ? "rgba(85,239,196,0.1)" : "transparent", cursor: "pointer", transition: "all 0.3s" }}>
          <span style={{ fontSize: 12, color: !relaxed ? C.ok : C.muted, fontWeight: 600 }}>Assumption holds</span>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: !relaxed ? C.text : C.muted, lineHeight: 1.4 }}>A more diverse workforce <strong>would help avoid</strong> these mistakes</p>
        </button>
        <button onClick={() => setRelaxed(true)} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${relaxed ? C.fail : C.border}`, background: relaxed ? C.failBg : "transparent", cursor: "pointer", transition: "all 0.3s" }}>
          <span style={{ fontSize: 12, color: relaxed ? C.fail : C.muted, fontWeight: 600 }}>Assumption relaxed</span>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: relaxed ? C.text : C.muted, lineHeight: 1.4 }}>Diversity <strong>makes no difference</strong> to these mistakes</p>
        </button>
      </div>
      <MiniChain ok={!relaxed} />
      {relaxed && (
        <div style={{ marginTop: 10 }}>
          <div style={{ background: "#1e2030", borderRadius: 8, padding: 12, marginBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 12, color: C.text, lineHeight: 1.6 }}>
              <strong style={{ color: C.prem }}>Scenario:</strong> Imagine the channel hires a fully diverse workforce that perfectly mirrors the wider population. But the same mistakes keep happening because the errors stem from individual carelessness, poor editorial processes, or time pressure in live broadcasting, not from the racial composition of the team. Diverse or not, rushed reporters still make errors.
            </p>
          </div>
          <div style={{ background: C.assumBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${C.assum}` }}>
            <p style={{ margin: 0, fontSize: 12, color: C.assum, lineHeight: 1.6 }}>
              If having a more diverse workforce <strong style={{ color: C.fail }}>would not actually prevent these mistakes</strong>, then there is no reason to conclude that media organisations should diversify specifically to address this problem. The recommendation loses its foundation. The whole argument depends on diversity being the solution.
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
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>Why is this too strong?</p>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.prem}44` }}>
          <p style={{ fontSize: 11, color: C.prem, fontWeight: 700, margin: "0 0 6px" }}>THE ARGUMENT</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>A <span style={{ color: C.prem, fontWeight: 700 }}>more diverse workforce</span> helps avoid mistakes like these</p>
        </div>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.fail}44` }}>
          <p style={{ fontSize: 11, color: C.fail, fontWeight: 700, margin: "0 0 6px" }}>OPTION A</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>A reporter <span style={{ color: C.fail, fontWeight: 700 }}>of the same race would not</span> have made the mistake</p>
        </div>
      </div>
      <div style={{ marginTop: 10, background: C.assumBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${C.assum}` }}>
        <p style={{ margin: 0, fontSize: 12, color: C.assum, lineHeight: 1.5 }}>Option A is far more specific than the argument requires. The argument only needs to assume that <span style={{ color: C.prem, fontWeight: 700 }}>diversity helps reduce errors</span>. It does not need to assume that <span style={{ color: C.fail, fontWeight: 700 }}>a same-race reporter would never make such a mistake</span>. That is too absolute. People of the same race can still confuse individuals. The argument is about institutional diversity improving outcomes, not guaranteeing perfection.</p>
      </div>
    </div>
  );
}

function VisualB() {
  return (
    <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>Does the argument depend on frequency?</p>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.prem}44` }}>
          <p style={{ fontSize: 11, color: C.prem, fontWeight: 700, margin: "0 0 6px" }}>THE ARGUMENT</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>These mistakes show diversity is needed. <span style={{ color: C.prem, fontWeight: 700 }}>Two specific examples</span> are cited.</p>
        </div>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.fail}44` }}>
          <p style={{ fontSize: 11, color: C.fail, fontWeight: 700, margin: "0 0 6px" }}>OPTION B</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Such mistakes are <span style={{ color: C.fail, fontWeight: 700 }}>common</span> in the media</p>
        </div>
      </div>
      <div style={{ marginTop: 10, background: C.assumBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${C.assum}` }}>
        <p style={{ margin: 0, fontSize: 12, color: C.assum, lineHeight: 1.5 }}>The argument cites <span style={{ color: C.prem, fontWeight: 700 }}>two specific incidents</span> as evidence. It does not need these to be common. Even if these were the only two cases ever, the author could still argue that diversity would help prevent them. The argument does not rely on frequency. It relies on the claim that diversity is the solution.</p>
      </div>
    </div>
  );
}

function VisualC() {
  return (
    <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>Is moral duty the hidden link?</p>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.prem}44` }}>
          <p style={{ fontSize: 11, color: C.prem, fontWeight: 700, margin: "0 0 6px" }}>THE ARGUMENT</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Diversity should be pursued because it <span style={{ color: C.prem, fontWeight: 700 }}>prevents practical errors</span></p>
        </div>
        <div style={{ flex: 1, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.fail}44` }}>
          <p style={{ fontSize: 11, color: C.fail, fontWeight: 700, margin: "0 0 6px" }}>OPTION C</p>
          <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Organisations have a <span style={{ color: C.fail, fontWeight: 700 }}>moral duty</span> to diversify</p>
        </div>
      </div>
      <div style={{ marginTop: 10, background: C.assumBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${C.assum}` }}>
        <p style={{ margin: 0, fontSize: 12, color: C.assum, lineHeight: 1.5 }}>The argument is <span style={{ color: C.prem, fontWeight: 700 }}>practical, not moral</span>. It says diversity should be pursued because mistakes are being made. Whether there is a separate moral obligation is irrelevant. The argument would work even without any moral duty: the practical benefit of avoiding embarrassing errors is the stated reason. Option C introduces a concept the argument does not rely on.</p>
      </div>
    </div>
  );
}

function VisualE() {
  return (
    <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>Scope check: does the argument claim this is unique to media?</p>
      <div style={{ background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.fail}44` }}>
        <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>The argument is specifically about <span style={{ color: C.prem, fontWeight: 700 }}>media organisations</span>. It makes no claim about whether similar errors happen in other workplaces. Even if identical mistakes occurred in hospitals, schools, or offices, the argument about media diversity would still stand. Whether the problem is <span style={{ color: C.fail, fontWeight: 700 }}>unique to media</span> or widespread is simply not relevant to the reasoning. The conclusion would be the same either way.</p>
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
  { letter: "A", text: "A reporter of the same racial background as the MPs would not have made this type of mistake.", verdict: "incorrect", explanation: "This is too strong. The argument assumes diversity helps reduce these errors, not that a same-race reporter would never make such a mistake. People of the same racial background can still confuse individuals. The argument is about the benefits of diverse teams, not about individual guarantees.", Visual: VisualA },
  { letter: "B", text: "Mistakes like the ones identified in the passage are common in the media.", verdict: "incorrect", explanation: "The argument cites two specific incidents as evidence. It does not need these mistakes to be common. The reasoning would work even if these were rare occurrences. The conclusion is about preventing errors through diversity, not about how widespread the problem is.", Visual: VisualB },
  { letter: "C", text: "Media organisations have a moral duty to ensure they have a diverse workforce.", verdict: "incorrect", explanation: "The argument is practical, not moral. It links diversity to preventing specific mistakes on air. Even without any moral obligation, the argument could still stand: diversity is recommended because it would reduce errors. Moral duty is a separate consideration the argument does not rely on.", Visual: VisualC },
  { letter: "D", text: "Having a more diverse workforce enables mistakes like these to be avoided.", verdict: "correct", explanation: "This is the hidden assumption. The argument sees two mix-up incidents and low workforce diversity, then concludes that media organisations should diversify. But this only works if diversity would actually help prevent such mistakes. If a more diverse workforce would make no difference to these errors, the whole recommendation falls apart. The argument takes for granted that diversity is the solution.", Visual: VisualD },
  { letter: "E", text: "Similar types of errors do not take place in any other workplace.", verdict: "incorrect", explanation: "The argument focuses on media organisations. Whether similar errors happen in other workplaces is irrelevant. The conclusion about media diversity would hold regardless of what happens elsewhere. This option introduces a comparison the argument never makes.", Visual: VisualE },
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
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif", letterSpacing: 0.2, padding: "24px 16px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: 1 }}>TARA</span>
            <span style={{ fontSize: 12, color: C.muted }}>Critical Thinking</span>
            <span style={{ fontSize: 12, color: C.muted }}>·</span>
            <span style={{ fontSize: 12, color: C.assum }}>Identifying an Assumption</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 14</p>
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
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}><em>"Which one of the following is an underlying assumption of the argument above?"</em></div>
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
                <span><span style={{ color: C.prem }}>■</span> Evidence</span>
                <span><span style={{ color: C.concl }}>■</span> Conclusion</span>
              </div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}><em>"Which one of the following is an underlying assumption of the argument above?"</em></div>
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
          <button onClick={() => setStep(Math.min(3, step + 1))} disabled={step === 3} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: step === 3 ? "#1e2030" : `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, color: step === 3 ? C.muted : C.white, fontSize: 14, fontWeight: 600, cursor: step === 3 ? "not-allowed" : "pointer", opacity: step === 3 ? 0.4 : 1 }}>Next →</button>
        </div>
      </div>
    </div>
  );
}
