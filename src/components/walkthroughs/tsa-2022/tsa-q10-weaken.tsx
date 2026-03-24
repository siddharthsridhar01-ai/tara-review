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
  "perpetuating": "Causing something (usually negative) to continue indefinitely. Making a situation or belief persist over time.",
  "enduring": "Lasting for a long time. Continuing to exist despite efforts to change or remove it.",
  "subsidy": "Money paid by a government to reduce the cost of a product or service, making it cheaper for people to use.",
  "division of labour": "The way tasks or work are split between different people or groups within a household, workplace, or society.",
  "devote": "To give time, effort, or resources entirely to a particular activity or purpose.",
};

const phrases = [
  { id: "p1", text: "Despite ranking top of gender equality lists, Sweden is like practically every other country in terms of having an unequal division of labour for unpaid housework.", role: "context" },
  { id: "p2", text: "Perpetuating stereotypes about who should be responsible for cleaning tasks, women still perform more domestic chores than their male partners.", role: "evidence" },
  { id: "p3", text: "To address this enduring sexism about 'women's work', Sweden has recently implemented a tax policy through which the government pays half of the bill when households employ a cleaner.", role: "evidence" },
  { id: "p4", text: "This policy has been a success: couples that hired a cleaner because of the subsidy report fewer arguments over housework, and the female partners have been able to devote a significant number of additional hours per month to their own paid employment.", role: "conclusion" },
];

const dragSentences = [
  { id: "d1", text: "Sweden has an unequal division of labour for unpaid housework, with women performing more domestic chores than men.", isEvidence: true },
  { id: "d2", text: "Sweden implemented a tax policy where the government pays half the bill when households employ a cleaner.", isEvidence: true },
  { id: "d3", text: "The policy has been a success: fewer arguments over housework and female partners devoting more hours to paid employment.", isEvidence: false, feedback: "This is the conclusion. It's the claim the author is making about the policy's success, not the evidence supporting it." },
];

const directionQs = [
  { id: "dq1", prompt: "The argument claims the cleaning subsidy policy is a 'success' because it reduces household arguments and frees women for paid work. But it was introduced to 'address enduring sexism about women's work.' A piece of evidence that WEAKENS this argument would...",
    options: [
      { id: "a", text: "Show that the policy actually reinforces the sexism it was meant to address", correct: true, fb: "" },
      { id: "b", text: "Show that more couples are using the subsidy than expected", correct: false, fb: "That would suggest the policy is popular, which if anything supports the claim of success. We need something that undermines the conclusion." },
      { id: "c", text: "Show that Sweden already had other gender equality policies", correct: false, fb: "The existence of other policies doesn't tell us whether this particular policy succeeds or fails at addressing sexism. We need to target the specific claim being made." },
    ]},
  { id: "dq2", prompt: "Why would showing that the policy reinforces the original problem be so damaging to the argument?",
    options: [
      { id: "a", text: "Because it proves the policy costs too much money", correct: false, fb: "Cost isn't the issue here. The argument is about whether the policy addresses sexism, not whether it's affordable." },
      { id: "b", text: "Because it shows the policy solves a surface symptom while making the underlying problem worse", correct: true, fb: "" },
      { id: "c", text: "Because it shows Swedish women don't want cleaners", correct: false, fb: "Whether women want cleaners isn't the point. The question is whether hiring cleaners actually addresses the sexism the policy was designed to fix." },
    ]},
];

const opts = [
  { letter: "A", text: "Swedish women do fewer hours of housework a week on average than women in many other countries.", ok: false,
    impact: "No effect", impactColor: C.neutral, impactBg: C.neutralBg,
    expl: "This compares Sweden to other countries, but the argument is about whether Sweden's specific subsidy policy addresses sexism within Sweden. Even if Swedish women do fewer hours than women elsewhere, that doesn't tell us whether this policy successfully tackles the unequal division of labour between Swedish men and women." },
  { letter: "B", text: "Many women enjoy doing housework.", ok: false,
    impact: "No effect", impactColor: C.neutral, impactBg: C.neutralBg,
    expl: "Whether some women enjoy housework is beside the point. The argument is about a policy designed to address the unequal division of domestic labour and the sexism behind it. Personal enjoyment of housework doesn't address whether the policy succeeds at reducing gender inequality." },
  { letter: "C", text: "Sweden has a long-standing policy of paid paternity leave for fathers of newborn children.", ok: false,
    impact: "No effect", impactColor: C.neutral, impactBg: C.neutralBg,
    expl: "This describes a separate Swedish policy. It tells us nothing about whether the cleaning subsidy specifically addresses sexism about 'women's work.' The existence of other equality-promoting policies is irrelevant to whether this particular policy is a success at what it claims to do." },
  { letter: "D", text: "Most of the cleaners hired because of the subsidy are women.", ok: true,
    impact: "Weakens", impactColor: C.weaken, impactBg: C.weakenBg,
    expl: "This is devastating to the argument. The policy was introduced to address 'enduring sexism about women's work.' But if most of the hired cleaners are women, the policy simply shifts the domestic labour from one group of women to another. It doesn't challenge the stereotype that cleaning is 'women's work' at all. It just outsources the sexism. The surface metrics look good (fewer arguments, more paid work hours), but the underlying problem of gendered domestic labour is perpetuated, not addressed." },
  { letter: "E", text: "The Swedish educational system has a long tradition of emphasising gender-neutral teaching methods.", ok: false,
    impact: "No effect", impactColor: C.neutral, impactBg: C.neutralBg,
    expl: "This is about Sweden's education system, not about the cleaning subsidy policy. It provides background about Sweden's broader equality efforts but doesn't tell us whether this specific policy succeeds or fails at addressing sexism in housework. It's entirely off-topic." },
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
  return (<div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "3px 0" }}><div style={{ width: 2, height: 12, background: color + "66" }} /><div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `6px solid ${color}88` }} /></div>);
}

function PassageRaw() {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>Despite ranking top of gender equality lists, Sweden is like practically every other country in terms of having an unequal <Vocab term="division of labour">division of labour</Vocab> for unpaid housework. <Vocab term="perpetuating">Perpetuating</Vocab> stereotypes about who should be responsible for cleaning tasks, women still perform more domestic chores than their male partners. To address this <Vocab term="enduring">enduring</Vocab> sexism about 'women's work', Sweden has recently implemented a tax policy through which the government pays half of the bill when households employ a cleaner. This policy has been a success: couples that hired a cleaner because of the <Vocab term="subsidy">subsidy</Vocab> report fewer arguments over housework, and the female partners have been able to <Vocab term="devote">devote</Vocab> a significant number of additional hours per month to their own paid employment.</p>
    </div>
  );
}

function PassageAnnotated() {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>
        <span style={{ color: C.ctx, backgroundColor: C.ctxBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.ctx}` }}>Despite ranking top of gender equality lists, Sweden is like practically every other country in terms of having an unequal division of labour for unpaid housework.</span>
        {" "}
        <span style={{ color: C.prem, backgroundColor: C.premBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.prem}` }}>Perpetuating stereotypes about who should be responsible for cleaning tasks, women still perform more domestic chores than their male partners. To address this enduring sexism about 'women's work', Sweden has recently implemented a tax policy through which the government pays half of the bill when households employ a cleaner.</span>
        {" "}
        <span style={{ color: C.concl, backgroundColor: C.conclBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.concl}` }}>This policy has been a success: couples that hired a cleaner because of the subsidy report fewer arguments over housework, and the female partners have been able to devote a significant number of additional hours per month to their own paid employment.</span>
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
    if (allEvPlaced && p.role === "context") return { c: C.ctx, bg: C.ctxBg };
    return null;
  };

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.concl, fontWeight: 700, whiteSpace: "nowrap" }}>STEP 1</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            {!conclFound ? <>Find the <strong style={{ color: C.concl }}>conclusion</strong>. What is the author ultimately claiming about the policy?</> :
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
            {allEvPlaced && <span><span style={{ color: C.ctx }}>■</span> Background Context</span>}
            {allEvPlaced && <span><span style={{ color: C.prem }}>■</span> Evidence</span>}
            <span><span style={{ color: C.concl }}>■</span> Conclusion</span>
          </div>
        )}
        {wrongClick && !conclFound && (
          <div style={{ marginTop: 8, background: C.failBg, border: `1px solid ${C.fail}44`, borderRadius: 8, padding: "10px 14px" }}>
            <p style={{ margin: 0, fontSize: 13, color: C.fail }}><strong>Try again.</strong> Which phrase states the author's overall verdict on the policy? Look for the sentence that makes a judgement about whether it worked.</p>
          </div>
        )}
        {conclFound && !allEvPlaced && !wrongClick && (
          <div style={{ marginTop: 8, background: `${C.concl}0a`, border: `1px solid ${C.concl}44`, borderRadius: 8, padding: "10px 14px" }}>
            <p style={{ margin: 0, fontSize: 13, color: C.text }}><strong style={{ color: C.ok }}>Correct!</strong> The author claims the policy "has been a success," citing fewer arguments and more paid work hours for women. Now identify the evidence that supports this claim.</p>
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
                <p style={{ margin: "6px 0 0", fontSize: 13, color: C.concl, lineHeight: 1.5 }}>The policy has been a success: fewer arguments over housework and women devoting more hours to paid employment.</p>
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
              <p style={{ margin: "6px 0 0", fontSize: 13, color: C.text, lineHeight: 1.5 }}>Women do more housework than men + Sweden introduced a cleaning subsidy to address this sexism</p>
            </div>
            <SmallArrow color={C.assum} />
            <div style={{ background: C.assumBg, border: `2px dashed ${C.assum}`, borderRadius: 10, padding: "10px 16px", width: "100%", boxSizing: "border-box", textAlign: "center" }}>
              <span style={{ fontSize: 12, color: C.assum, fontWeight: 700 }}>HIDDEN ASSUMPTION</span>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: C.text, lineHeight: 1.5 }}>Outsourcing cleaning to hired cleaners genuinely <strong style={{ color: C.assum }}>addresses the sexism</strong> about 'women's work,' rather than just relocating it.</p>
            </div>
            <SmallArrow color={C.concl} />
            <div style={{ background: C.conclBg, border: `1.5px solid ${C.concl}`, borderRadius: 10, padding: "10px 16px", width: "100%", boxSizing: "border-box" }}>
              <span style={{ background: `${C.concl}22`, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.concl, fontWeight: 700 }}>CONCLUSION</span>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: C.concl, lineHeight: 1.5 }}>The policy has been a success: fewer arguments, more paid work hours for women.</p>
            </div>
          </div>

          <div style={{ marginTop: 14, background: C.assumBg, border: `1px solid ${C.assum}44`, borderRadius: 10, padding: "12px 16px" }}>
            <span style={{ background: `${C.assum}22`, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.assum, fontWeight: 700 }}>THE ARGUMENT IN A NUTSHELL</span>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
              <span style={{ color: C.prem }}>Women do more housework, so Sweden subsidised hiring cleaners to tackle sexism</span> → <span style={{ color: C.assum }}>assumes outsourcing cleaning genuinely addresses the gender problem</span> → <span style={{ color: C.concl }}>therefore the policy is a success.</span>
            </p>
          </div>

          <div style={{ marginTop: 12, background: C.weakenBg, border: `1px solid ${C.weaken}44`, borderRadius: 10, padding: "12px 16px" }}>
            <span style={{ background: `${C.weaken}22`, border: `1px solid ${C.weaken}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.weaken, fontWeight: 700 }}>KEY SKILL</span>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
              To <strong style={{ color: C.weaken }}>weaken</strong> this argument, you need evidence that attacks the <strong style={{ color: C.assum }}>hidden assumption</strong>. Show that the policy doesn't truly address the sexism. Perhaps it just moves the 'women's work' problem somewhere else rather than solving it.
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
            <span style={{ fontSize: 12, color: C.prem, fontWeight: 600 }}>Subsidy to fix sexism</span>
          </div>
          <span style={{ fontSize: 14, color: C.muted }}>→</span>
          <div style={{ background: C.assumBg, border: `1px dashed ${C.assum}`, borderRadius: 6, padding: "4px 10px" }}>
            <span style={{ fontSize: 12, color: C.assum, fontWeight: 600 }}>Outsourcing = solving</span>
          </div>
          <span style={{ fontSize: 14, color: C.muted }}>→</span>
          <div style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "4px 10px" }}>
            <span style={{ fontSize: 12, color: C.concl, fontWeight: 600 }}>Policy is a success</span>
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
              For weaken questions, always find the <strong style={{ color: C.assum }}>hidden assumption</strong> first. The correct answer will introduce a fact that makes that assumption less likely to be true. Here, the argument assumes that hiring cleaners genuinely addresses sexism about 'women's work.' Any evidence showing the policy merely <em>relocates</em> rather than <em>resolves</em> the gendered labour problem would undermine this claim.
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
          <p style={{ margin: "4px 0 0", fontSize: 11, color: C.text, lineHeight: 1.4 }}>Outsourcing cleaning genuinely addresses sexism about 'women's work'</p>
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

function OptionCard({ o, expanded, onClick, animate }) {
  const bc = expanded ? (o.ok ? C.ok : C.fail) : C.border;
  return (
    <div style={{ background: expanded ? (o.ok ? C.conclBg : C.failBg) : "#1e2030", border: `1.5px solid ${bc}`, borderRadius: 12, padding: "14px 18px", cursor: "pointer", transition: "all 0.3s", opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(12px)" }} onClick={onClick}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ background: expanded ? (o.ok ? C.ok : C.fail) : C.accent, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.white, flexShrink: 0 }}>{expanded ? (o.ok ? "✓" : "✗") : o.letter}</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.6 }}>{o.text}</p>
          {expanded && (
            <div style={{ marginTop: 10 }}>
              <div style={{ marginBottom: 8 }}>
                <span style={{ background: `${o.impactColor}22`, border: `1px solid ${o.impactColor}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: o.impactColor, fontWeight: 700 }}>{o.impact.toUpperCase()}</span>
                {o.letter === "B" && <span style={{ background: `${C.weaken}22`, border: `1px solid ${C.weaken}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.weaken, fontWeight: 700, marginLeft: 6 }}>TRICKIEST DISTRACTOR</span>}
              </div>
              <div style={{ padding: "10px 14px", background: o.ok ? C.conclBg : C.failBg, borderRadius: 8, fontSize: 13, color: o.ok ? C.concl : C.fail, lineHeight: 1.6, borderLeft: `3px solid ${o.ok ? C.ok : C.fail}` }}>
                {o.ok ? <span style={{ fontWeight: 700 }}>CORRECT: </span> : <span style={{ fontWeight: 700 }}>DOES NOT WEAKEN: </span>}
                {o.expl}
              </div>
              {!o.ok && (
                <div style={{ marginTop: 10, padding: "10px 14px", background: "#151722", borderRadius: 8, display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: C.prem }}>Argument focuses on:</p>
                    <p style={{ margin: 0, fontSize: 12, color: C.text, lineHeight: 1.5 }}>
                      <strong style={{ color: C.prem, fontWeight: 700 }}>Whether the cleaning subsidy addresses sexism</strong> about the unequal division of domestic labour in Sweden.
                    </p>
                  </div>
                  <div style={{ width: 1, background: C.border }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: C.fail }}>This option talks about:</p>
                    <p style={{ margin: 0, fontSize: 12, color: C.text, lineHeight: 1.5 }}>
                      <strong style={{ color: C.fail, fontWeight: 700 }}>{o.letter === "A" ? "International comparisons of housework hours" : o.letter === "B" ? "Whether women personally enjoy housework" : o.letter === "C" ? "A completely separate Swedish policy" : "Sweden's educational traditions"}</strong>, which is irrelevant to the subsidy's success.
                    </p>
                  </div>
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
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 10</p>
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
                  <strong>Weaken questions</strong> ask you to find new information that, if true, would most undermine the argument's reasoning. Your job is to identify the gap between the evidence and the conclusion, then find the option that exploits that gap.
                </p>
              </div>
            </div>
          </>
        )}

        {step === 1 && <ArgumentMapper />}
        {step === 2 && <DirectionStep />}

        {step === 3 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}><span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span><div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}><em>"Which one of the following, if true, most weakens the above argument?"</em></div></div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}><span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span><PassageAnnotated /><div style={{ marginTop: 12, display: "flex", gap: 10, fontSize: 11, color: C.muted }}><span><span style={{ color: C.ctx }}>■</span> Background Context</span><span><span style={{ color: C.prem }}>■</span> Evidence</span><span><span style={{ color: C.concl }}>■</span> Conclusion</span></div></div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 20px", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>ASSUMPTION:</span>
                <div style={{ background: C.assumBg, border: `1px dashed ${C.assum}`, borderRadius: 6, padding: "4px 10px" }}>
                  <span style={{ fontSize: 12, color: C.assum, fontWeight: 600 }}>Outsourcing cleaning genuinely addresses sexism about 'women's work'</span>
                </div>
              </div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 14 }}><p style={{ color: C.muted, fontSize: 14, margin: 0 }}><strong style={{ color: C.assum }}>Click each option</strong> to assess its impact on the argument:</p></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {opts.map((o, i) => (<OptionCard key={o.letter} o={o} expanded={expanded === o.letter} animate={optAnim[i]} onClick={() => setExpanded(p => p === o.letter ? null : o.letter)} />))}
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