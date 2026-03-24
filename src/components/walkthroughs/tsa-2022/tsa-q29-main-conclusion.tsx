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
  progressive: "Favouring new ideas and methods, especially in education or politics. Here it refers to a modern, reform-minded approach to teaching.",
  collaborative: "Involving people working together as a group to achieve something, rather than individually.",
  extrovert: "A person whose personality is characterised by being outgoing, sociable, and energised by interaction with others.",
  introverts: "People who tend to be more reserved and feel most comfortable in quiet, low-stimulation environments. They often prefer solitary activities.",
  gregarious: "Fond of company; sociable and enjoying being with other people.",
  foster: "To encourage or promote the development of something.",
  undermine: "To gradually weaken or damage something, making it less effective or secure.",
};

const phrases = [
  { id: "p1", text: "'Progressive' teaching methods, used in schools for the last 40 or 50 years, put an emphasis on collaborative ways of learning.", isConclusion: false },
  { id: "p2", text: "It is time to reconsider the idea that this constitutes best practice in the classroom.", isConclusion: true },
  { id: "p3", text: "Collaborative learning appeals to those with extrovert personalities, but much less so to introverts.", isConclusion: false },
  { id: "p4", text: "Extroverts are people with an outgoing or gregarious personality, who enjoy group projects and plenty of stimulation, whereas introverts prefer to work on their own and in a quiet place.", isConclusion: false },
  { id: "p5", text: "Modern classroom environments embrace extroverted behaviour, through fast-paced lessons and social learning activities.", isConclusion: false },
  { id: "p6", text: "These can foster an appealing classroom environment, of course, but over-emphasising them can undermine the learning of students who are inward-thinking and easily drained by constant interactions with others.", isConclusion: false },
];

const roleClassifications = [
  { id: "p1", text: "'Progressive' teaching methods, used in schools for the last 40 or 50 years, put an emphasis on collaborative ways of learning.", role: "background", roleLabel: "BACKGROUND CONTEXT", roleColor: C.ctx, roleBg: C.ctxBg, explanation: "This sets the scene by describing what progressive teaching methods involve. It introduces the topic, but it doesn't give a reason why collaborative learning should be reconsidered." },
  { id: "p3", text: "Collaborative learning appeals to those with extrovert personalities, but much less so to introverts.", role: "evidence", roleLabel: "SUPPORTING EVIDENCE", roleColor: C.prem, roleBg: C.premBg, explanation: "This is the first piece of evidence. It identifies a problem with collaborative learning: it suits extroverts but not introverts. This directly supports the conclusion that we need to reconsider whether it is best practice." },
  { id: "p4", text: "Extroverts are people with an outgoing or gregarious personality, who enjoy group projects and plenty of stimulation, whereas introverts prefer to work on their own and in a quiet place.", role: "background", roleLabel: "BACKGROUND CONTEXT", roleColor: C.ctx, roleBg: C.ctxBg, explanation: "This defines the terms 'extrovert' and 'introvert.' It provides helpful context for the reader but doesn't itself give a reason to reconsider collaborative learning." },
  { id: "p5", text: "Modern classroom environments embrace extroverted behaviour, through fast-paced lessons and social learning activities.", role: "evidence", roleLabel: "SUPPORTING EVIDENCE", roleColor: C.prem, roleBg: C.premBg, explanation: "This supports the conclusion by showing that current classrooms are already biased towards extroverted behaviour. It strengthens the case that the status quo needs reconsidering." },
  { id: "p6", text: "These can foster an appealing classroom environment, of course, but over-emphasising them can undermine the learning of students who are inward-thinking and easily drained by constant interactions with others.", role: "evidence", roleLabel: "SUPPORTING EVIDENCE", roleColor: C.prem, roleBg: C.premBg, explanation: "This is key evidence explaining the actual harm: over-emphasis on social learning can undermine introverts' learning. This is the strongest reason given for why we should reconsider collaborative learning as best practice." },
];

const roleOptions = [
  { value: "background", label: "Background Context", color: C.ctx },
  { value: "evidence", label: "Supporting Evidence", color: C.prem },
];

const opts = [
  { letter: "A", text: "Progressive teaching methods put an emphasis on collaborative learning.", ok: false,
    roleTag: "BACKGROUND CONTEXT", roleColor: C.ctx,
    expl: "As you classified in Step 2, this is background context. It describes what progressive methods involve, but it is not a claim the author is arguing for. It merely sets the scene for the argument that follows." },
  { letter: "B", text: "The idea that collaborative learning is best classroom practice needs to be reconsidered.", ok: true,
    roleTag: "MAIN CONCLUSION", roleColor: C.concl,
    expl: "This directly paraphrases the main conclusion. The author's central point is a call to reconsider collaborative learning as best practice. Every other sentence in the passage, whether background or evidence, exists to support this one overarching claim. The phrase 'It is time to reconsider' is a clear signal that the author is making a recommendation." },
  { letter: "C", text: "Collaborative learning appeals to extroverts, but much less so to those with introvert personalities.", ok: false,
    roleTag: "SUPPORTING EVIDENCE", roleColor: C.prem,
    expl: "As you classified in Step 2, this is supporting evidence. It identifies a problem (the extrovert/introvert divide) that supports the broader call to reconsider, but it is not itself the main conclusion." },
  { letter: "D", text: "Extroverts and introverts learn best in very different ways.", ok: false,
    roleTag: "NOT STATED", roleColor: C.fail,
    expl: "The passage describes the preferences of extroverts and introverts, but never claims they 'learn best' in different ways. This goes beyond what the passage says and introduces a claim the author does not make." },
  { letter: "E", text: "Over-emphasising fast-paced lessons and social learning undermines the learning of introverts.", ok: false,
    roleTag: "SUPPORTING EVIDENCE", roleColor: C.prem,
    expl: "As you classified in Step 2, this is supporting evidence. It describes a specific harmful consequence that helps build the case, but it is not the broadest, most central claim. The main conclusion is the call to reconsider, which this evidence supports." },
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
      <p style={{ margin: 0 }}>'<Vocab term="progressive">Progressive</Vocab>' teaching methods, used in schools for the last 40 or 50 years, put an emphasis on <Vocab term="collaborative">collaborative</Vocab> ways of learning. It is time to reconsider the idea that this constitutes best practice in the classroom. Collaborative learning appeals to those with <Vocab term="extrovert">extrovert</Vocab> personalities, but much less so to <Vocab term="introverts">introverts</Vocab>. Extroverts are people with an outgoing or <Vocab term="gregarious">gregarious</Vocab> personality, who enjoy group projects and plenty of stimulation, whereas introverts prefer to work on their own and in a quiet place. Modern classroom environments embrace extroverted behaviour, through fast-paced lessons and social learning activities. These can <Vocab term="foster">foster</Vocab> an appealing classroom environment, of course, but over-emphasising them can <Vocab term="undermine">undermine</Vocab> the learning of students who are inward-thinking and easily drained by constant interactions with others.</p>
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
    { id: "p1", text: "'Progressive' teaching methods, used in schools for the last 40 or 50 years, put an emphasis on collaborative ways of learning." },
    { id: "p2", text: " It is time to reconsider the idea that this constitutes best practice in the classroom." },
    { id: "p3", text: " Collaborative learning appeals to those with extrovert personalities, but much less so to introverts." },
    { id: "p4", text: " Extroverts are people with an outgoing or gregarious personality, who enjoy group projects and plenty of stimulation, whereas introverts prefer to work on their own and in a quiet place." },
    { id: "p5", text: " Modern classroom environments embrace extroverted behaviour, through fast-paced lessons and social learning activities." },
    { id: "p6", text: " These can foster an appealing classroom environment, of course, but over-emphasising them can undermine the learning of students who are inward-thinking and easily drained by constant interactions with others." },
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
        <span style={{ color: C.ctx, backgroundColor: C.ctxBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.ctx}` }}>'Progressive' teaching methods, used in schools for the last 40 or 50 years, put an emphasis on collaborative ways of learning.</span>
        {" "}
        <span style={{ color: C.concl, backgroundColor: C.conclBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.concl}` }}>It is time to reconsider the idea that this constitutes best practice in the classroom.</span>
        {" "}
        <span style={{ color: C.prem, backgroundColor: C.premBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.prem}` }}>Collaborative learning appeals to those with extrovert personalities, but much less so to introverts.</span>
        {" "}
        <span style={{ color: C.ctx, backgroundColor: C.ctxBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.ctx}` }}>Extroverts are people with an outgoing or gregarious personality, who enjoy group projects and plenty of stimulation, whereas introverts prefer to work on their own and in a quiet place.</span>
        {" "}
        <span style={{ color: C.prem, backgroundColor: C.premBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.prem}` }}>Modern classroom environments embrace extroverted behaviour, through fast-paced lessons and social learning activities. These can foster an appealing classroom environment, of course, but over-emphasising them can undermine the learning of students who are inward-thinking and easily drained by constant interactions with others.</span>
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
        <div style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 10, padding: "14px 18px", fontSize: 13, color: C.concl, lineHeight: 1.6 }}><strong>Hint:</strong> Most of the passage discusses extroverts and introverts. But is that the author's central claim, or does it support something broader? Look for a sentence that makes a recommendation rather than stating a fact.</div>
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
                <p style={{ margin: 0, fontSize: 13.5, color: C.text, lineHeight: 1.65 }}><strong style={{ color: C.ok }}>Correct!</strong> "It is time to reconsider" is a clear signal that the author is making a recommendation. This is the broadest, most central claim. Everything else in the passage, from the description of extroverts and introverts to the problems with over-emphasis, exists to support this call for reconsideration.</p>
              </div>
            ) : (<p style={{ margin: 0, fontSize: 13, color: C.white }}>Try again. This sentence provides detail about the topic. Ask yourself: is the author using this to support a bigger point, or is this the biggest point itself?</p>)}
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
          <p style={{ margin: "0 0 6px" }}><strong style={{ color: C.ctx }}>Background context</strong>: sets the scene, provides definitions, or frames the topic. Doesn't directly prove the conclusion.</p>
          <p style={{ margin: 0 }}><strong style={{ color: C.prem }}>Supporting evidence</strong>: a fact, observation, or reason that directly builds the case for the conclusion.</p>
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
                  <p style={{ margin: 0, fontSize: 13, color: C.white, lineHeight: 1.6 }}>Try again. Ask yourself: does this phrase set the scene or define a term? Or does it give a reason that directly supports the call to reconsider collaborative learning?</p>
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
              Now you know the role of every phrase. In the options step, each wrong answer will match one of these roles: <strong style={{ color: C.ctx }}>background</strong> or <strong style={{ color: C.prem }}>evidence</strong>. The correct answer will always be the one that captures the <strong style={{ color: C.concl }}>broadest, most central claim</strong>, not a supporting fact, however important that fact may seem.
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
            <span style={{ fontSize: 12, color: C.concl }}>Identifying the Main Conclusion</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 29</p>
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
          {step < 3 ? (<button onClick={() => setStep(step + 1)} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Next →</button>) : (<button onClick={() => window.dispatchEvent(new CustomEvent("walkthrough-complete"))} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.ok}, #2ecc71)`, color: C.white, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>✓ Back to Question Review</button>)}
        </div>
      </div>
    </div>
  );
}