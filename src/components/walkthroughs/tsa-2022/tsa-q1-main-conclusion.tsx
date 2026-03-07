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
  { id: 2, label: "Roles", title: "Classify the Other Phrases" },
  { id: 3, label: "Options", title: "Evaluate Each Option" },
];

const vocabDefs = {
  revered: "Deeply respected and admired, often with a sense of awe or devotion.",
  ornamentation: "Decorative items or embellishments added to make something more attractive.",
  aesthetic: "Relating to the appreciation of beauty or good taste, as opposed to practical function.",
  conductivity: "The ability of a material to allow electricity or heat to pass through it.",
  corrosion: "The gradual destruction of a material, usually metal, through chemical reactions with its environment such as moisture or air.",
};

const phrases = [
  { id: "p1", text: "Throughout history, gold has been revered and used for expensive jewellery and ornamentation.", isConclusion: false },
  { id: "p2", text: "But in the future, it will be prized for its practical uses rather than for its aesthetic appeal.", isConclusion: true },
  { id: "p3", text: "It wasn't until early in the last century that gold's electrical conductivity properties were discovered.", isConclusion: false },
  { id: "p4", text: "Solid state electronic devices use very low voltages and currents, which are easily interrupted by corrosion at the contact points.", isConclusion: false },
  { id: "p5", text: "Gold is such an efficient conductor that it can carry these tiny currents and remain free of corrosion, making the devices highly reliable.", isConclusion: false },
  { id: "p6", text: "A small amount of gold is used in almost every modern electronic device, and it is predicted that within ten years, more gold will be used in the production of electronics than in jewellery.", isConclusion: false },
];

const roleClassifications = [
  { id: "p1", text: "Throughout history, gold has been revered and used for expensive jewellery and ornamentation.", role: "background", roleLabel: "BACKGROUND CONTEXT", roleColor: C.ctx, roleBg: C.ctxBg, explanation: "This sets the scene by describing gold's historical role as decoration. It provides the 'before' that the conclusion contrasts with ('But in the future...'), but it doesn't provide any evidence for why the shift will happen." },
  { id: "p3", text: "It wasn't until early in the last century that gold's electrical conductivity properties were discovered.", role: "background", roleLabel: "BACKGROUND CONTEXT", roleColor: C.ctx, roleBg: C.ctxBg, explanation: "This is a historical fact explaining when gold's practical potential was first recognised. It provides timeline context but doesn't directly prove that gold will be prized for practical uses." },
  { id: "p4", text: "Solid state electronic devices use very low voltages and currents, which are easily interrupted by corrosion at the contact points.", role: "evidence", roleLabel: "SUPPORTING EVIDENCE", roleColor: C.prem, roleBg: C.premBg, explanation: "This establishes the problem that gold solves. It shows why gold's anti-corrosion properties are so valuable for electronics, directly supporting the claim that gold has important practical uses." },
  { id: "p5", text: "Gold is such an efficient conductor that it can carry these tiny currents and remain free of corrosion, making the devices highly reliable.", role: "evidence", roleLabel: "SUPPORTING EVIDENCE", roleColor: C.prem, roleBg: C.premBg, explanation: "This is key evidence explaining exactly why gold is practically valuable: it solves the corrosion problem in electronics. This directly supports the conclusion that gold will be prized for practical uses." },
  { id: "p6", text: "A small amount of gold is used in almost every modern electronic device, and it is predicted that within ten years, more gold will be used in the production of electronics than in jewellery.", role: "evidence", roleLabel: "SUPPORTING EVIDENCE", roleColor: C.prem, roleBg: C.premBg, explanation: "This shows the scale and trajectory of gold's practical use. The prediction that electronics will overtake jewellery directly supports the conclusion about gold's future value shifting from aesthetic to practical." },
];

const roleOptions = [
  { value: "background", label: "Background Context", color: C.ctx },
  { value: "evidence", label: "Supporting Evidence", color: C.prem },
];

const opts = [
  { letter: "A", text: "In the future gold will be prized for its practical uses rather than for its aesthetic appeal.", ok: true,
    roleTag: "MAIN CONCLUSION", roleColor: C.concl,
    expl: "This directly paraphrases the main conclusion. The entire passage builds towards this claim: gold's conductivity was discovered, it solves the corrosion problem in electronics, it's already in nearly every device, and production is predicted to overtake jewellery. All of this serves as evidence for this one central point about gold's future value." },
  { letter: "B", text: "It wasn't until early in the last century that gold's electrical conductivity properties were discovered.", ok: false,
    roleTag: "BACKGROUND CONTEXT", roleColor: C.ctx,
    expl: "As you classified in Step 2, this is background context. It's a historical fact about when a discovery was made. The main conclusion is about the future, not the past." },
  { letter: "C", text: "Gold is such an efficient conductor that it can carry tiny electrical currents and remain free of corrosion.", ok: false,
    roleTag: "SUPPORTING EVIDENCE", roleColor: C.prem,
    expl: "As you classified in Step 2, this is supporting evidence. It describes a physical property of gold that explains why it's useful, but the main conclusion is the broader claim about how gold will be valued, not a description of what gold can do." },
  { letter: "D", text: "A small amount of gold is used in almost every modern electronic device.", ok: false,
    roleTag: "SUPPORTING EVIDENCE", roleColor: C.prem,
    expl: "As you classified in Step 2, this is supporting evidence about gold's current usage. It helps build the case but describes what's happening now rather than making the broader future-looking claim." },
  { letter: "E", text: "Within ten years, more gold will be used in the production of electronics than in jewellery.", ok: false,
    roleTag: "SUPPORTING EVIDENCE", roleColor: C.prem,
    expl: "This is a prediction used as supporting evidence. It's attributed to others ('it is predicted') rather than being the author's own central claim. The main conclusion is the broader point that gold will be prized for practical over aesthetic value." },
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

function PassageRaw() {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>Throughout history, gold has been <Vocab term="revered">revered</Vocab> and used for expensive jewellery and <Vocab term="ornamentation">ornamentation</Vocab>. But in the future, it will be prized for its practical uses rather than for its <Vocab term="aesthetic">aesthetic</Vocab> appeal. It wasn't until early in the last century that gold's electrical <Vocab term="conductivity">conductivity</Vocab> properties were discovered. Solid state electronic devices use very low voltages and currents, which are easily interrupted by <Vocab term="corrosion">corrosion</Vocab> at the contact points. Gold is such an efficient conductor that it can carry these tiny currents and remain free of corrosion, making the devices highly reliable. A small amount of gold is used in almost every modern electronic device, and it is predicted that within ten years, more gold will be used in the production of electronics than in jewellery.</p>
    </div>
  );
}

function PassageWithRoles({ roles }) {
  const getColor = (id) => {
    if (id === "p2") return { c: C.concl, bg: C.conclBg };
    if (!roles[id]) return null;
    const cls = roleClassifications.find(x => x.id === id);
    if (!cls) return null;
    return { c: cls.roleColor, bg: cls.roleBg };
  };
  const sentences = [
    { id: "p1", text: "Throughout history, gold has been revered and used for expensive jewellery and ornamentation." },
    { id: "p2", text: " But in the future, it will be prized for its practical uses rather than for its aesthetic appeal." },
    { id: "p3", text: " It wasn't until early in the last century that gold's electrical conductivity properties were discovered." },
    { id: "p4", text: " Solid state electronic devices use very low voltages and currents, which are easily interrupted by corrosion at the contact points." },
    { id: "p5", text: " Gold is such an efficient conductor that it can carry these tiny currents and remain free of corrosion, making the devices highly reliable." },
    { id: "p6", text: " A small amount of gold is used in almost every modern electronic device, and it is predicted that within ten years, more gold will be used in the production of electronics than in jewellery." },
  ];
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>{sentences.map(s => {
        const cl = getColor(s.id);
        return <span key={s.id} style={{ color: cl ? cl.c : "inherit", backgroundColor: cl ? cl.bg : "transparent", padding: cl ? "2px 4px" : 0, borderRadius: 3, borderBottom: cl ? `2px solid ${cl.c}` : "none", transition: "all 0.4s" }}>{s.text}</span>;
      })}</p>
    </div>
  );
}

function PassageAnnotated() {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>
        <span style={{ color: C.ctx, backgroundColor: C.ctxBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.ctx}` }}>Throughout history, gold has been revered and used for expensive jewellery and ornamentation.</span>
        {" "}
        <span style={{ color: C.concl, backgroundColor: C.conclBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.concl}` }}>But in the future, it will be prized for its practical uses rather than for its aesthetic appeal.</span>
        {" "}
        <span style={{ color: C.ctx, backgroundColor: C.ctxBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.ctx}` }}>It wasn't until early in the last century that gold's electrical conductivity properties were discovered.</span>
        {" "}
        <span style={{ color: C.prem, backgroundColor: C.premBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.prem}` }}>Solid state electronic devices use very low voltages and currents, which are easily interrupted by corrosion at the contact points. Gold is such an efficient conductor that it can carry these tiny currents and remain free of corrosion, making the devices highly reliable. A small amount of gold is used in almost every modern electronic device, and it is predicted that within ten years, more gold will be used in the production of electronics than in jewellery.</span>
      </p>
    </div>
  );
}

function ConclusionFinder() {
  const [hovId, setHovId] = useState(null);
  const [wrongId, setWrongId] = useState(null);
  const [found, setFound] = useState(false);
  const handleClick = (p) => { if (found) return; if (p.isConclusion) { setFound(true); setWrongId(null); } else { setWrongId(p.id); } };
  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
          <span style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.concl, fontWeight: 700, whiteSpace: "nowrap" }}>STEP 1</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>Find the <strong style={{ color: C.concl }}>main conclusion</strong>. What is the author ultimately trying to convince you of?</p>
        </div>
        <div style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 10, padding: "14px 18px", fontSize: 13, color: C.concl, lineHeight: 1.6 }}><strong>Hint:</strong> The passage gives lots of technical detail about gold's properties and its use in electronics. But what broad claim does all this detail build towards? Look for the sentence that makes a claim about the future rather than stating a fact.</div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}><span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>Passage</span><span style={{ fontSize: 11, color: C.muted }}> · click on the sentence you think is the main conclusion</span></div>
        <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
          {phrases.map(p => {
            const isH = hovId === p.id && !found, isW = wrongId === p.id, isF = found && p.isConclusion;
            return (<p key={p.id} style={{ margin: "0 0 10px", cursor: found ? "default" : "pointer" }} onMouseEnter={() => !found && setHovId(p.id)} onMouseLeave={() => !found && setHovId(null)} onClick={() => handleClick(p)}><span style={{ borderBottom: isF ? `2px solid ${C.concl}` : isH ? `2px solid ${C.muted}` : "2px solid transparent", backgroundColor: isF ? C.conclBg : "transparent", color: isF ? C.concl : isW ? C.fail : "inherit", padding: isF ? "2px 4px" : 0, borderRadius: 3, transition: "all 0.3s" }}>{p.text}</span></p>);
          })}
        </div>
        {(wrongId || found) && (
          <div style={{ background: found ? `${C.concl}0a` : C.failBg, border: `1px solid ${found ? C.concl + "44" : C.fail + "44"}`, borderRadius: 10, padding: "12px 16px", marginTop: 4 }}>
            {found ? (
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ background: `${C.concl}22`, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "3px 10px", fontSize: 11, color: C.concl, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>MAIN CONCLUSION</span>
                <p style={{ margin: 0, fontSize: 13.5, color: C.text, lineHeight: 1.65 }}><strong style={{ color: C.ok }}>Correct!</strong> The word "But" signals a contrast with the past, and "in the future" tells us this is the author's forward-looking claim. Everything else in the passage exists to support this one central point.</p>
              </div>
            ) : (<p style={{ margin: 0, fontSize: 13, color: C.white }}>Try again. This sentence provides a specific fact or detail. Ask yourself: is this the broadest claim in the passage, or does it support a bigger point about how gold will be valued?</p>)}
          </div>
        )}
      </div>
    </div>
  );
}

function RoleClassifier() {
  const [assignments, setAssignments] = useState({});
  const [feedback, setFeedback] = useState({});
  const allDone = roleClassifications.every(r => feedback[r.id] === "correct");

  const handleAssign = (sId, value) => {
    if (feedback[sId] === "correct") return;
    const s = roleClassifications.find(r => r.id === sId);
    setAssignments(p => ({ ...p, [sId]: value }));
    setFeedback(p => ({ ...p, [sId]: value === s.role ? "correct" : "wrong" }));
  };

  const completedRoles = {};
  roleClassifications.forEach(r => { if (feedback[r.id] === "correct") completedRoles[r.id] = true; });
  const hasRole = (r) => roleClassifications.some(s => feedback[s.id] === "correct" && s.role === r);

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
          <span style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.prem, fontWeight: 700, whiteSpace: "nowrap" }}>STEP 2</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            Now classify each remaining phrase. Is it <strong style={{ color: C.ctx }}>background context</strong> or <strong style={{ color: C.prem }}>supporting evidence</strong>?
          </p>
        </div>
        <div style={{ background: "#1e2030", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 13, color: C.text, lineHeight: 1.8 }}>
          <p style={{ margin: "0 0 6px" }}><strong style={{ color: C.ctx }}>Background context</strong>: sets the scene, provides history, or frames the topic. Doesn't directly prove the conclusion.</p>
          <p style={{ margin: 0 }}><strong style={{ color: C.prem }}>Supporting evidence</strong>: a fact, data point, or reason that directly builds the case for the conclusion.</p>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span>
        <PassageWithRoles roles={completedRoles} />
        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap", fontSize: 11, color: C.muted }}>
          <span><span style={{ color: C.concl }}>■</span> Conclusion</span>
          {hasRole("background") && <span><span style={{ color: C.ctx }}>■</span> Background</span>}
          {hasRole("evidence") && <span><span style={{ color: C.prem }}>■</span> Evidence</span>}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
        {roleClassifications.map((s, idx) => {
          const fb = feedback[s.id];
          const isCorrect = fb === "correct";
          const isWrong = fb === "wrong";
          const bc = isCorrect ? s.roleColor : isWrong ? C.fail : C.border;
          return (
            <div key={s.id} style={{ background: C.card, border: `1.5px solid ${bc}`, borderRadius: 14, padding: "16px 20px", transition: "all 0.3s" }}>
              <p style={{ margin: "0 0 12px", fontSize: 14, color: isCorrect ? s.roleColor : C.text, lineHeight: 1.7, transition: "color 0.3s" }}>
                <span style={{ color: C.muted, fontSize: 12, marginRight: 8 }}>S{idx + 1}</span>{s.text}
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: isCorrect || isWrong ? 10 : 0 }}>
                {roleOptions.map(r => {
                  const sel = assignments[s.id] === r.value;
                  const locked = isCorrect;
                  const thisCorrect = isCorrect && r.value === s.role;
                  return (
                    <button key={r.value} onClick={() => !locked && handleAssign(s.id, r.value)} style={{
                      padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                      border: `1.5px solid ${thisCorrect ? r.color : sel && isWrong ? C.fail : sel ? r.color : C.border}`,
                      background: thisCorrect ? `${r.color}22` : sel && isWrong ? C.failBg : "transparent",
                      color: thisCorrect ? r.color : sel && isWrong ? C.fail : sel ? r.color : C.muted,
                      cursor: locked ? "default" : "pointer", transition: "all 0.3s",
                      opacity: locked && !thisCorrect ? 0.3 : 1,
                    }}>{r.label}</button>
                  );
                })}
              </div>
              {isCorrect && (
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", background: `${s.roleColor}0a`, border: `1px solid ${s.roleColor}44`, borderRadius: 10, padding: "10px 14px" }}>
                  <span style={{ background: `${s.roleColor}22`, border: `1px solid ${s.roleColor}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: s.roleColor, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>{s.roleLabel}</span>
                  <p style={{ margin: 0, fontSize: 13, color: C.text, lineHeight: 1.6 }}><strong style={{ color: C.ok }}>Correct!</strong> {s.explanation}</p>
                </div>
              )}
              {isWrong && !isCorrect && (
                <div style={{ background: C.failBg, border: `1px solid ${C.fail}44`, borderRadius: 10, padding: "10px 14px" }}>
                  <p style={{ margin: 0, fontSize: 13, color: C.white, lineHeight: 1.6 }}>Try again. Ask yourself: does this sentence set the scene or provide history? Or does it give a fact or reason that directly supports the conclusion?</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allDone && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
          <div style={{ background: C.assumBg, border: `1px solid ${C.assum}44`, borderRadius: 10, padding: "12px 16px" }}>
            <span style={{ background: `${C.assum}22`, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.assum, fontWeight: 700 }}>KEY SKILL</span>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
              Now you know the role of every sentence. In the options step, each wrong answer will match one of these roles: <strong style={{ color: C.ctx }}>background</strong> or <strong style={{ color: C.prem }}>evidence</strong>. The correct answer will always be the one that captures the <strong style={{ color: C.concl }}>broadest, most central claim</strong>, not a supporting fact, however important that fact may seem.
            </p>
          </div>
        </div>
      )}
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
                <span style={{ background: `${o.roleColor}22`, border: `1px solid ${o.roleColor}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: o.roleColor, fontWeight: 700 }}>{o.roleTag}</span>
              </div>
              <div style={{ padding: "10px 14px", background: o.ok ? C.conclBg : C.failBg, borderRadius: 8, fontSize: 13, color: o.ok ? C.concl : C.fail, lineHeight: 1.6, borderLeft: `3px solid ${o.ok ? C.ok : C.fail}` }}>
                {o.ok ? <span style={{ fontWeight: 700 }}>CORRECT: </span> : <span style={{ fontWeight: 700 }}>NOT THE CONCLUSION: </span>}
                {o.expl}
              </div>
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
    if (step === 3) { [0, 1, 2, 3, 4].forEach(i => { setTimeout(() => setOptAnim(p => { const n = [...p]; n[i] = true; return n; }), i * 100); }); }
    else { setOptAnim([false, false, false, false, false]); setExpanded(null); }
  }, [step]);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif", letterSpacing: 0.2, padding: "24px 16px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: 1 }}>TARA</span>
            <span style={{ fontSize: 12, color: C.muted }}>Critical Thinking</span>
            <span style={{ fontSize: 12, color: C.muted }}>·</span>
            <span style={{ fontSize: 12, color: C.concl }}>Identifying the Main Conclusion</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 1</p>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {stepsMeta.map(s => (<button key={s.id} onClick={() => setStep(s.id)} style={{ flex: 1, minWidth: 0, background: step === s.id ? C.accent : step > s.id ? "rgba(108,92,231,0.15)" : "#1e2030", border: `1px solid ${step === s.id ? C.accent : step > s.id ? C.accent + "44" : C.border}`, borderRadius: 10, padding: "10px 6px", cursor: "pointer", transition: "all 0.3s", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}><span style={{ fontSize: 14, fontWeight: 700, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted, lineHeight: 1 }}>{s.id + 1}</span><span style={{ fontSize: 11, fontWeight: step === s.id ? 700 : 500, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted, whiteSpace: "nowrap" }}>{s.label}</span></button>))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><span style={{ background: C.accent, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.white }}>{step + 1}</span><h2 style={{ fontSize: 17, fontWeight: 700, color: C.white, margin: 0 }}>{stepsMeta[step].title}</h2></div>

        {step === 0 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}><span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span><PassageRaw /></div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>Read the passage carefully. <span style={{ color: C.vocab }}>Hover yellow terms</span> for definitions. This is an <strong style={{ color: C.white }}>Identifying the Main Conclusion</strong> question:</p>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}><em>"Which one of the following best expresses the main conclusion of the above argument?"</em></div>
              <div style={{ marginTop: 12, background: C.conclBg, border: `1px solid ${C.concl}44`, borderRadius: 10, padding: "12px 16px" }}>
                <p style={{ margin: 0, fontSize: 13, color: C.concl, lineHeight: 1.6 }}><strong>Main Conclusion questions</strong> ask you to identify the author's central point: the one claim that everything else in the passage is trying to support. The correct answer won't be a piece of evidence or background. It will be the broadest, most overarching claim in the argument.</p>
              </div>
            </div>
          </>
        )}

        {step === 1 && <ConclusionFinder />}
        {step === 2 && <RoleClassifier />}

        {step === 3 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}><span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span><div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}><em>"Which one of the following best expresses the main conclusion of the above argument?"</em></div></div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}><span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span><PassageAnnotated /><div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap", fontSize: 11, color: C.muted }}><span><span style={{ color: C.concl }}>■</span> Conclusion</span><span><span style={{ color: C.prem }}>■</span> Evidence</span><span><span style={{ color: C.ctx }}>■</span> Background</span></div></div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 14 }}><p style={{ color: C.muted, fontSize: 14, margin: 0 }}><strong style={{ color: C.assum }}>Click each option</strong> to see why it's right or wrong:</p></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {opts.map((o, i) => (<OptionCard key={o.letter} o={o} expanded={expanded === o.letter} animate={optAnim[i]} onClick={() => setExpanded(p => p === o.letter ? null : o.letter)} />))}
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
