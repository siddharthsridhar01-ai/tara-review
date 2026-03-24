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
  { id: 1, label: "Argument", title: "Map the Argument" },
  { id: 2, label: "Direction", title: "What Would Weaken This?" },
  { id: 3, label: "Options", title: "Evaluate Each Option" },
];

const vocabDefs = {
  "special educational needs and disabilities": "A broad legal term covering learning difficulties, developmental conditions, and physical disabilities that require additional educational support.",
  "proportion": "The fraction or percentage of a whole group that shares a particular characteristic.",
  "evade": "To escape or avoid something, especially a duty or responsibility, often by clever or dishonest means.",
  "equality of opportunity": "The principle that every person should have the same chance to succeed, regardless of personal circumstances or background.",
  "statistic": "A numerical fact or piece of data obtained from a study or survey of a larger set of information.",
};

const phrases = [
  { id: "p1", text: "Recent figures issued by the UK Department of Education have revealed that the proportion of students with special educational needs and disabilities (SEND) who have reached the expected level of educational achievement by the time they leave secondary school is lower than that of the population as a whole.", role: "evidence" },
  { id: "p2", text: "The Government cannot evade responsibility for this disappointing statistic.", role: "conclusion" },
  { id: "p3", text: "By not providing the funds required by schools who have students with these needs, the Government has failed to ensure the right of such students to equality of opportunity.", role: "evidence" },
];

const dragSentences = [
  { id: "d1", text: "SEND students achieve at lower rates than the general population.", isEvidence: true },
  { id: "d2", text: "The Government is responsible for this disappointing statistic.", isEvidence: false, feedback: "This IS the conclusion. It's what the evidence is trying to prove, not the evidence itself." },
  { id: "d3", text: "The Government has not provided the funds schools need for SEND students.", isEvidence: true },
];

const directionQs = [
  { id: "dq1", prompt: "The argument assumes that the reason SEND students underachieve is a lack of government funding. A piece of evidence that WEAKENS this argument would...",
    options: [
      { id: "a", text: "Show that funding is not the only or main factor behind the achievement gap", correct: true, fb: "" },
      { id: "b", text: "Show that even more SEND students are underachieving", correct: false, fb: "That would actually reinforce the problem the argument describes. We need something that undermines the explanation, not the problem itself." },
      { id: "c", text: "Show that the Government has increased education spending overall", correct: false, fb: "Overall spending doesn't address SEND-specific funding. The argument is specifically about funds required by schools with SEND students." },
    ]},
  { id: "dq2", prompt: "What kind of evidence would most directly show that funding is not the key factor?",
    options: [
      { id: "a", text: "Evidence that SEND students face inherent limitations that funding cannot overcome", correct: true, fb: "" },
      { id: "b", text: "Evidence that other countries spend less on education", correct: false, fb: "Comparing to other countries doesn't address whether funding is what determines SEND achievement in the UK." },
      { id: "c", text: "Evidence that teachers are poorly trained", correct: false, fb: "Poor teacher training could actually support the argument that the Government is failing SEND students. It doesn't weaken it." },
    ]},
];

const opts = [
  { letter: "A", text: "Some students with SEND have problems with reading and writing but have good ability to understand and reason.", ok: false,
    impact: "No effect", impactColor: C.neutral, impactBg: C.neutralBg,
    expl: "This tells us about the profile of some SEND students but doesn't address why they underachieve. Having good reasoning ability but poor reading and writing actually suggests these students could benefit from extra support, which is consistent with the argument that more funding would help. It doesn't challenge the link between funding and outcomes." },
  { letter: "B", text: "Some students with SEND require a quiet environment to help them to concentrate on what they are doing.", ok: false,
    impact: "No effect", impactColor: C.neutral, impactBg: C.neutralBg,
    expl: "Needing a quiet environment is exactly the kind of accommodation that funding could provide. This actually supports the argument: with adequate funding, schools could create quiet spaces. It reinforces rather than weakens the claim that government funding is what's needed." },
  { letter: "C", text: "Some students with SEND require content and tasks from lessons to be explained to them in simpler language.", ok: false,
    impact: "No effect", impactColor: C.neutral, impactBg: C.neutralBg,
    expl: "Needing simpler explanations is an accommodation that teaching assistants or specialist staff could provide. This is precisely the kind of support that funding would enable. Like option B, it reinforces the argument rather than weakening it." },
  { letter: "D", text: "Some students with SEND have physical problems which require the provision of a wheelchair or other aids.", ok: false,
    impact: "No effect", impactColor: C.neutral, impactBg: C.neutralBg,
    expl: "Physical aids like wheelchairs are another form of support that funding could provide. This doesn't challenge the argument at all. It simply describes a type of need that money could address, which is exactly what the argument claims the Government should fund." },
  { letter: "E", text: "Some students with SEND have conditions which limit their ability to understand and to reason.", ok: true,
    impact: "Weakens", impactColor: C.weaken, impactBg: C.weakenBg,
    expl: "This directly attacks the hidden assumption. The argument assumes that with enough funding, SEND students could achieve at the same level as others. But if some SEND students have conditions that inherently limit their cognitive ability, then no amount of funding could fully close the achievement gap. The lower achievement rate might not be the Government's fault at all. It could simply reflect the nature of the conditions themselves. This gives the Government a valid defence: the statistic is not necessarily 'disappointing' in the way the argument implies." },
];

function Vocab({ term, children }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline" }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ borderBottom: `2px dashed ${C.vocab}`, cursor: "help", color: C.vocab }}>{children || term}</span>
      {show && (<span style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "#2d3047", border: `1px solid ${C.vocab}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.vocab, width: 260, zIndex: 100, lineHeight: 1.5, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", pointerEvents: "none" }}><span style={{ fontWeight: 700, display: "block", marginBottom: 4 }}>Definition</span>{vocabDefs[term]}</span>)}
    </span>
  );
}

function SmallArrow({ color }) {
  return (<div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "3px 0" }}><div style={{ width: 2, height: 12, background: color + "66" }} /><div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `6px solid ${color}88` }} /></div>);
}

function PassageRaw() {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>Recent figures issued by the UK Department of Education have revealed that the <Vocab term="proportion">proportion</Vocab> of students with <Vocab term="special educational needs and disabilities">special educational needs and disabilities (SEND)</Vocab> who have reached the expected level of educational achievement by the time they leave secondary school is lower than that of the population as a whole. The Government cannot <Vocab term="evade">evade</Vocab> responsibility for this disappointing <Vocab term="statistic">statistic</Vocab>. By not providing the funds required by schools who have students with these needs, the Government has failed to ensure the right of such students to <Vocab term="equality of opportunity">equality of opportunity</Vocab>.</p>
    </div>
  );
}

function PassageAnnotated() {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>
        <span style={{ color: C.prem, backgroundColor: C.premBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.prem}` }}>Recent figures issued by the UK Department of Education have revealed that the proportion of students with special educational needs and disabilities (SEND) who have reached the expected level of educational achievement by the time they leave secondary school is lower than that of the population as a whole.</span>
        {" "}
        <span style={{ color: C.concl, backgroundColor: C.conclBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.concl}` }}>The Government cannot evade responsibility for this disappointing statistic.</span>
        {" "}
        <span style={{ color: C.prem, backgroundColor: C.premBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.prem}` }}>By not providing the funds required by schools who have students with these needs, the Government has failed to ensure the right of such students to equality of opportunity.</span>
      </p>
    </div>
  );
}

function ArgumentMapper() {
  const [conclFound, setConclFound] = useState(false);
  const [hovId, setHovId] = useState(null);
  const [wrongClick, setWrongClick] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [placedIds, setPlacedIds] = useState([]);
  const [wrongDrag, setWrongDrag] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const allEvPlaced = dragSentences.filter(s => s.isEvidence).every(s => placedIds.includes(s.id));

  const handlePhraseClick = (p) => {
    if (conclFound) return;
    if (p.role === "conclusion") { setConclFound(true); setWrongClick(null); }
    else { setWrongClick(p.id); }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const id = e.dataTransfer.getData("text/plain");
    const s = dragSentences.find(x => x.id === id);
    if (!s) return;
    if (s.isEvidence) { setPlacedIds(p => [...p, id]); setWrongDrag(null); }
    else { setWrongDrag({ id, text: s.feedback }); }
    setDraggingId(null);
  };

  const getColor = (p) => {
    if (conclFound && p.role === "conclusion") return { c: C.concl, bg: C.conclBg };
    if (allEvPlaced && p.role === "evidence") return { c: C.prem, bg: C.premBg };
    return null;
  };

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.concl, fontWeight: 700, whiteSpace: "nowrap" }}>STEP 1</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            {!conclFound ? <>Find the <strong style={{ color: C.concl }}>conclusion</strong>. What is the author ultimately claiming?</> :
            !allEvPlaced ? <><strong style={{ color: C.ok }}>Conclusion found.</strong> Now drag the <strong style={{ color: C.prem }}>key evidence</strong> into the box below.</> :
            <><strong style={{ color: C.ok }}>Argument mapped.</strong> Review the argument structure and the hidden assumption below.</>}
          </p>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>Passage</span>
          {!conclFound && <span style={{ fontSize: 11, color: C.muted }}> · click the conclusion</span>}
        </div>
        <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
          {phrases.map((p) => {
            const cl = getColor(p);
            const isH = hovId === p.id && !conclFound;
            const isW = wrongClick === p.id;
            return (
              <span key={p.id} style={{ cursor: conclFound ? "default" : "pointer" }}
                onMouseEnter={() => !conclFound && setHovId(p.id)}
                onMouseLeave={() => setHovId(null)}
                onClick={() => handlePhraseClick(p)}>
                <span style={{
                  color: cl ? cl.c : isW ? C.fail : "inherit",
                  backgroundColor: cl ? cl.bg : "transparent",
                  padding: cl ? "2px 4px" : 0, borderRadius: 3,
                  borderBottom: cl ? `2px solid ${cl.c}` : isH ? `2px solid ${C.muted}` : "none",
                  transition: "all 0.3s",
                }}>{p.text}</span>{" "}
              </span>
            );
          })}
        </div>
        {(conclFound || allEvPlaced) && (
          <div style={{ marginTop: 12, display: "flex", gap: 10, fontSize: 11, color: C.muted }}>
            <span><span style={{ color: C.concl }}>■</span> Conclusion</span>
            {allEvPlaced && <span><span style={{ color: C.prem }}>■</span> Evidence</span>}
          </div>
        )}
        {wrongClick && !conclFound && (
          <div style={{ marginTop: 8, background: C.failBg, border: `1px solid ${C.fail}44`, borderRadius: 8, padding: "10px 14px" }}>
            <p style={{ margin: 0, fontSize: 13, color: C.fail }}><strong>Try again.</strong> Which phrase states the main point the author is trying to prove? Look for the short, strong claim about who is to blame.</p>
          </div>
        )}
        {conclFound && !allEvPlaced && !wrongClick && (
          <div style={{ marginTop: 8, background: `${C.concl}0a`, border: `1px solid ${C.concl}44`, borderRadius: 8, padding: "10px 14px" }}>
            <p style={{ margin: 0, fontSize: 13, color: C.text }}><strong style={{ color: C.ok }}>Correct!</strong> "The Government cannot evade responsibility" is the main conclusion: it assigns blame. The rest of the passage provides evidence for why. Now identify the evidence.</p>
          </div>
        )}
      </div>

      {conclFound && !allEvPlaced && (
        <>
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
                style={{ width: "100%", minHeight: 70, boxSizing: "border-box", background: dragOver ? "rgba(116,185,255,0.08)" : "#151722", border: `2px dashed ${dragOver ? C.prem : C.border}`, borderRadius: 10, padding: "12px 16px", transition: "all 0.3s" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.muted }}>EVIDENCE</span>
                {placedIds.length === 0 && !dragOver && <p style={{ margin: "6px 0 0", fontSize: 13, color: C.muted, fontStyle: "italic" }}>Drag a sentence here</p>}
                {dragOver && placedIds.length === 0 && <p style={{ margin: "6px 0 0", fontSize: 13, color: C.prem }}>Drop here</p>}
                {placedIds.map(id => { const s = dragSentences.find(x => x.id === id); return <p key={id} style={{ margin: "6px 0 0", fontSize: 13, color: C.prem, lineHeight: 1.5 }}>{s.text}</p>; })}
              </div>
              {wrongDrag && (
                <div style={{ width: "100%", background: C.failBg, border: `1px solid ${C.fail}44`, borderRadius: 10, padding: "10px 16px", marginTop: 8, boxSizing: "border-box" }}>
                  <p style={{ margin: 0, fontSize: 13, color: C.white, lineHeight: 1.6 }}><strong style={{ color: C.fail }}>Try again.</strong> {wrongDrag.text}</p>
                </div>
              )}
              <SmallArrow color={C.prem} />
              <div style={{ background: C.conclBg, border: `1.5px solid ${C.concl}`, borderRadius: 10, padding: "10px 16px", width: "100%", boxSizing: "border-box" }}>
                <span style={{ background: `${C.concl}22`, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.concl, fontWeight: 700 }}>CONCLUSION</span>
                <p style={{ margin: "6px 0 0", fontSize: 13, color: C.concl, lineHeight: 1.5 }}>The Government cannot evade responsibility for this disappointing statistic.</p>
              </div>
            </div>
          </div>
        </>
      )}

      {allEvPlaced && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px", marginBottom: 18 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Reasoning chain</span>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ background: C.premBg, border: `1.5px solid ${C.prem}`, borderRadius: 10, padding: "10px 16px", width: "100%", boxSizing: "border-box" }}>
              <span style={{ background: `${C.prem}22`, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.prem, fontWeight: 700 }}>EVIDENCE</span>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: C.text, lineHeight: 1.5 }}>SEND students achieve at lower rates than the general population + the Government has not provided the funds schools need for SEND students</p>
            </div>
            <SmallArrow color={C.assum} />
            <div style={{ background: C.assumBg, border: `2px dashed ${C.assum}`, borderRadius: 10, padding: "10px 16px", width: "100%", boxSizing: "border-box", textAlign: "center" }}>
              <span style={{ fontSize: 12, color: C.assum, fontWeight: 700 }}>HIDDEN ASSUMPTION</span>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: C.text, lineHeight: 1.5 }}>The lower achievement is <strong style={{ color: C.assum }}>caused by</strong> lack of funding. With adequate funding, SEND students could reach the same expected level.</p>
            </div>
            <SmallArrow color={C.concl} />
            <div style={{ background: C.conclBg, border: `1.5px solid ${C.concl}`, borderRadius: 10, padding: "10px 16px", width: "100%", boxSizing: "border-box" }}>
              <span style={{ background: `${C.concl}22`, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.concl, fontWeight: 700 }}>CONCLUSION</span>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: C.concl, lineHeight: 1.5 }}>The Government cannot evade responsibility for this disappointing statistic.</p>
            </div>
          </div>

          <div style={{ marginTop: 14, background: C.assumBg, border: `1px solid ${C.assum}44`, borderRadius: 10, padding: "12px 16px" }}>
            <span style={{ background: `${C.assum}22`, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.assum, fontWeight: 700 }}>THE ARGUMENT IN A NUTSHELL</span>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
              <span style={{ color: C.prem }}>SEND students underachieve and the Government hasn't funded schools properly</span> → <span style={{ color: C.assum }}>assumes funding is what would close the gap</span> → <span style={{ color: C.concl }}>therefore the Government is to blame.</span>
            </p>
          </div>

          <div style={{ marginTop: 12, background: C.weakenBg, border: `1px solid ${C.weaken}44`, borderRadius: 10, padding: "12px 16px" }}>
            <span style={{ background: `${C.weaken}22`, border: `1px solid ${C.weaken}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.weaken, fontWeight: 700 }}>KEY SKILL</span>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
              To <strong style={{ color: C.weaken }}>weaken</strong> this argument, you need evidence that attacks the <strong style={{ color: C.assum }}>hidden assumption</strong>. Show that the achievement gap is not simply caused by lack of funding: that some SEND students may face inherent limitations that no amount of funding could fully overcome.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function DirectionStep() {
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const stage = (feedback.dq1 === "correct" ? 1 : 0) + (feedback.dq2 === "correct" ? 1 : 0);
  const allDone = stage === 2;

  const handleClick = (qId, optId) => {
    if (feedback[qId] === "correct") return;
    const q = directionQs.find(x => x.id === qId);
    const o = q.options.find(x => x.id === optId);
    setAnswers(p => ({ ...p, [qId]: optId }));
    setFeedback(p => ({ ...p, [qId]: o.correct ? "correct" : "wrong" }));
  };

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.weakenBg, border: `1px solid ${C.weaken}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.weaken, fontWeight: 700, whiteSpace: "nowrap" }}>STEP 2</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            Before seeing the real options, think about what kind of evidence would <strong style={{ color: C.weaken }}>weaken</strong> this argument.
          </p>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 20px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "4px 10px" }}>
            <span style={{ fontSize: 12, color: C.prem, fontWeight: 600 }}>SEND underachieve + no funding</span>
          </div>
          <span style={{ fontSize: 14, color: C.muted }}>→</span>
          <div style={{ background: C.assumBg, border: `1px dashed ${C.assum}`, borderRadius: 6, padding: "4px 10px" }}>
            <span style={{ fontSize: 12, color: C.assum, fontWeight: 600 }}>Funding = solution</span>
          </div>
          <span style={{ fontSize: 14, color: C.muted }}>→</span>
          <div style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "4px 10px" }}>
            <span style={{ fontSize: 12, color: C.concl, fontWeight: 600 }}>Government to blame</span>
          </div>
          <span style={{ fontSize: 14, color: C.muted }}>←</span>
          <div style={{ background: C.weakenBg, border: `1px dashed ${C.weaken}`, borderRadius: 6, padding: "4px 10px" }}>
            <span style={{ fontSize: 12, color: C.weaken, fontWeight: 600 }}>Attack here</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 }}>
        {directionQs.map((q, idx) => {
          const fb = feedback[q.id];
          const isC = fb === "correct";
          const prevDone = idx === 0 || feedback[directionQs[idx - 1].id] === "correct";
          if (!prevDone) return null;
          return (
            <div key={q.id} style={{ background: C.card, border: `1px solid ${isC ? C.ok + "44" : C.border}`, borderRadius: 14, padding: "16px 20px" }}>
              <p style={{ margin: "0 0 10px", fontSize: 14, color: C.text, lineHeight: 1.6 }}>
                <span style={{ color: C.muted, fontSize: 12, marginRight: 8 }}>{idx + 1}.</span>{q.prompt}
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {q.options.map(o => {
                  const sel = answers[q.id] === o.id;
                  const thisC = isC && o.correct;
                  const thisW = sel && !o.correct && fb === "wrong";
                  return (
                    <button key={o.id} onClick={() => handleClick(q.id, o.id)} style={{
                      padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                      border: `1.5px solid ${thisC ? C.ok : thisW ? C.fail : C.border}`,
                      background: thisC ? C.conclBg : thisW ? C.failBg : "transparent",
                      color: thisC ? C.ok : thisW ? C.fail : C.muted,
                      cursor: isC ? "default" : "pointer", opacity: isC && !thisC ? 0.3 : 1,
                    }}>{o.text}</button>
                  );
                })}
              </div>
              {fb === "wrong" && (
                <div style={{ marginTop: 8, padding: "8px 12px", background: C.failBg, border: `1px solid ${C.fail}44`, borderRadius: 8 }}>
                  <p style={{ margin: 0, fontSize: 13, color: C.fail, lineHeight: 1.5 }}>
                    <strong>Try again.</strong> {q.options.find(o => answers[q.id] === o.id)?.fb}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allDone && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
          <div style={{ background: C.assumBg, border: `1px solid ${C.assum}44`, borderRadius: 10, padding: "12px 16px" }}>
            <span style={{ background: `${C.assum}22`, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.assum, fontWeight: 700 }}>PATTERN</span>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
              For weaken questions, always find the <strong style={{ color: C.assum }}>hidden assumption</strong> first. The correct answer will introduce a fact that makes that assumption less likely to be true. Here, any evidence that the achievement gap is caused by something other than funding, something inherent to the conditions themselves, would weaken the claim that the Government is responsible.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ImpactVisual({ o }) {
  const ic = o.impactColor;
  return (
    <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 12px" }}>Impact on the argument</p>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        <div style={{ background: C.assumBg, border: `1px dashed ${C.assum}`, borderRadius: 8, padding: "8px 12px", width: "100%", boxSizing: "border-box", textAlign: "center" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.assum }}>HIDDEN ASSUMPTION</span>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: C.text, lineHeight: 1.4 }}>Funding would close the achievement gap for SEND students</p>
        </div>
        <div style={{ padding: "4px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 2, height: 8, background: ic + "66" }} />
          <span style={{ fontSize: 9, fontWeight: 700, color: ic }}>{o.impact === "Weakens" ? "ATTACKED BY" : "NOT AFFECTED BY"}</span>
          <div style={{ width: 2, height: 8, background: ic + "66" }} />
          <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `6px solid ${ic}88` }} />
        </div>
        <div style={{ background: o.impactBg, border: `1.5px solid ${ic}`, borderRadius: 8, padding: "8px 12px", width: "100%", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ background: `${ic}22`, border: `1px solid ${ic}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: ic, fontWeight: 700 }}>{o.impact.toUpperCase()}</span>
            <span style={{ fontSize: 11, color: C.text }}>Option {o.letter}</span>
          </div>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: C.muted, lineHeight: 1.4 }}>{o.text}</p>
        </div>
      </div>
    </div>
  );
}

function OptionCard({ o, expanded, onClick, animate, isTrickiest }) {
  const bc = expanded ? (o.ok ? C.ok : C.fail) : C.border;
  return (
    <div style={{ background: expanded ? (o.ok ? C.conclBg : C.failBg) : "#1e2030", border: `1.5px solid ${bc}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", transition: "all 0.3s", opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(12px)" }} onClick={onClick}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ background: expanded ? (o.ok ? C.ok : C.fail) : C.accent, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.white, flexShrink: 0 }}>{expanded ? (o.ok ? "✓" : "✗") : o.letter}</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.6 }}>{o.text}</p>
          {expanded && (
            <div style={{ marginTop: 10 }}>
              <div style={{ marginBottom: 8, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ background: `${o.impactColor}22`, border: `1px solid ${o.impactColor}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: o.impactColor, fontWeight: 700 }}>{o.impact.toUpperCase()}</span>
                {isTrickiest && !o.ok && (
                  <span style={{ background: `${C.assum}22`, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.assum, fontWeight: 700 }}>TRICKIEST DISTRACTOR</span>
                )}
              </div>
              <div style={{ padding: "10px 14px", background: o.ok ? C.conclBg : C.failBg, borderRadius: 8, fontSize: 13, color: o.ok ? C.concl : C.fail, lineHeight: 1.6, borderLeft: `3px solid ${o.ok ? C.ok : C.fail}` }}>
                {o.ok ? <span style={{ fontWeight: 700 }}>CORRECT: </span> : <span style={{ fontWeight: 700 }}>DOES NOT WEAKEN: </span>}
                {o.expl}
              </div>
              {!o.ok && (
                <div style={{ marginTop: 10, padding: "10px 14px", background: "#151722", borderRadius: 8, fontSize: 13, lineHeight: 1.6 }}>
                  <p style={{ margin: 0, color: C.text }}>
                    <strong style={{ color: C.prem, fontWeight: 700 }}>The argument says:</strong> lack of funding causes the achievement gap.{" "}
                    <strong style={{ color: C.fail, fontWeight: 700 }}>This option says:</strong> {o.letter === "A" ? "some SEND students have mixed abilities. This describes their profile but doesn't explain why funding wouldn't help." : o.letter === "B" ? "some SEND students need quiet environments. This is exactly the kind of support funding could provide." : o.letter === "C" ? "some SEND students need simpler explanations. This is a support need that funding for teaching assistants could address." : "some SEND students need wheelchairs. Physical aids are precisely what funding is meant to cover."}
                  </p>
                </div>
              )}
              <div onClick={e => e.stopPropagation()}><ImpactVisual o={o} /></div>
            </div>
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
    if (step === 3) { [0,1,2,3,4].forEach(i => { setTimeout(() => setOptAnim(p => { const n = [...p]; n[i] = true; return n; }), i * 100); }); }
    else { setOptAnim([false, false, false, false, false]); setExpanded(null); }
  }, [step]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Trebuchet MS', 'Gill Sans', Calibri, sans-serif", letterSpacing: 0.2, padding: "24px 16px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: 1 }}>TARA</span>
            <span style={{ fontSize: 12, color: C.muted }}>Critical Thinking</span>
            <span style={{ fontSize: 12, color: C.muted }}>·</span>
            <span style={{ fontSize: 12, color: C.fail }}>Weakening an Argument</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 23</p>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {stepsMeta.map(s => (<button key={s.id} onClick={() => setStep(s.id)} style={{ flex: 1, minWidth: 0, background: step === s.id ? C.accent : step > s.id ? "rgba(108,92,231,0.15)" : "#1e2030", border: `1px solid ${step === s.id ? C.accent : step > s.id ? C.accent + "44" : C.border}`, borderRadius: 10, padding: "10px 6px", cursor: "pointer", transition: "all 0.3s", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}><span style={{ fontSize: 14, fontWeight: 700, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted, lineHeight: 1 }}>{s.id + 1}</span><span style={{ fontSize: 11, fontWeight: step === s.id ? 700 : 500, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted, whiteSpace: "nowrap" }}>{s.label}</span></button>))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><span style={{ background: C.accent, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.white }}>{step + 1}</span><h2 style={{ fontSize: 17, fontWeight: 700, color: C.white, margin: 0 }}>{stepsMeta[step].title}</h2></div>

        {step === 0 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}><span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span><PassageRaw /></div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>Read the passage carefully. <span style={{ color: C.vocab }}>Hover yellow terms</span> for definitions. This is a <strong style={{ color: C.white }}>Weakening an Argument</strong> question:</p>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}><em>"Which one of the following, if true, most weakens the above argument?"</em></div>
              <div style={{ marginTop: 12, background: C.failBg, border: `1px solid ${C.fail}44`, borderRadius: 10, padding: "12px 16px" }}>
                <p style={{ margin: 0, fontSize: 13, color: C.fail, lineHeight: 1.6 }}>
                  <strong>Weaken questions</strong> ask you to find a new piece of information that, if true, would most undermine the argument's reasoning. The correct answer targets the gap between the evidence and the conclusion, making the conclusion less likely to follow.
                </p>
              </div>
            </div>
          </>
        )}

        {step === 1 && <ArgumentMapper />}
        {step === 2 && <DirectionStep />}

        {step === 3 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}><span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span><PassageAnnotated /><div style={{ marginTop: 12, display: "flex", gap: 10, fontSize: 11, color: C.muted }}><span><span style={{ color: C.prem }}>■</span> Evidence</span><span><span style={{ color: C.concl }}>■</span> Conclusion</span></div></div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}><span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span><div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}><em>"Which one of the following, if true, most weakens the above argument?"</em></div></div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 20px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>ASSUMPTION:</span>
                <div style={{ background: C.assumBg, border: `1px dashed ${C.assum}`, borderRadius: 6, padding: "4px 10px" }}>
                  <span style={{ fontSize: 12, color: C.assum, fontWeight: 600 }}>Funding would close the SEND achievement gap</span>
                </div>
              </div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 14 }}><p style={{ color: C.muted, fontSize: 14, margin: 0 }}><strong style={{ color: C.assum }}>Click each option</strong> to assess its impact on the argument:</p></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {opts.map((o, i) => (<OptionCard key={o.letter} o={o} expanded={expanded === o.letter} animate={optAnim[i]} isTrickiest={o.letter === "A"} onClick={() => setExpanded(p => p === o.letter ? null : o.letter)} />))}
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