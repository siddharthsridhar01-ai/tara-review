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
  { id: 1, label: "Argument", title: "Find the Conclusion" },
  { id: 2, label: "The Flaw", title: "Spot the Weak Link" },
  { id: 3, label: "Options", title: "Evaluate Each Option" },
];

const vocabDefs = {
  franchise: "A licence or right granted by a government or company to an individual or group, allowing them to operate a specific service or business in a particular area.",
  punctuality: "The quality of arriving or happening at the expected or scheduled time. In rail contexts, this means trains departing and arriving on time.",
  "third quarter": "The third three-month period of a measured year. If the year starts in January, the third quarter covers July through September.",
  "defined limits": "Specific numerical thresholds or boundaries set by a governing body. Exceeding these limits triggers penalties.",
  "heavy fine": "A large financial penalty imposed as punishment for failing to meet required standards or regulations.",
};

const phrases = [
  { id: "p1", text: "Trains in the UK are operated by private companies approved by the government and awarded a franchise for which they must meet certain standards, for example on punctuality.", isConclusion: false },
  { id: "p2", text: "SuperRail, which operates the trains in one part of the country, has a poor record to date and has been warned that if it again exceeds the annual limits set by the government for late departures or arrivals, it will receive a heavy fine and will lose its franchise.", isConclusion: false },
  { id: "p3", text: "At the end of the third quarter, however, SuperRail's performance was within the defined limits.", isConclusion: false },
  { id: "p4", text: "So if the operator can maintain their performance in the final quarter, they will keep the franchise for another year.", isConclusion: true },
];

const spotQs = [
  {
    id: "sq1",
    prompt: "What specific condition does the passage mention for losing the franchise?",
    options: [
      { id: "a", text: "Exceeding the annual limits for late departures or arrivals", correct: true, fb: "" },
      { id: "b", text: "Any failure to meet government standards", correct: false, fb: "The passage specifically mentions the limits on late departures or arrivals as the stated condition. Look at what the warning says." },
      { id: "c", text: "Having a poor record over multiple years", correct: false, fb: "The poor record is background information. The specific condition tied to losing the franchise is about exceeding certain limits." },
    ]
  },
  {
    id: "sq2",
    prompt: "The conclusion assumes that meeting the punctuality limits is the ONLY condition for keeping the franchise. Is this justified by the passage?",
    options: [
      { id: "a", text: "Yes, the passage says punctuality is the only standard", correct: false, fb: "Read again carefully. The passage says franchises must meet 'certain standards, for example on punctuality.' The phrase 'for example' implies there are other standards too." },
      { id: "b", text: "No, the passage says punctuality is just one example of the standards required", correct: true, fb: "" },
      { id: "c", text: "Yes, because the government warning only mentions punctuality", correct: false, fb: "The warning mentions one specific condition, but that does not mean it is the only possible reason for losing a franchise. There could be other standards not mentioned in this particular warning." },
    ]
  },
  {
    id: "sq3",
    prompt: "So what is the flaw in the argument?",
    options: [
      { id: "a", text: "It assumes that meeting one stated condition is sufficient, ignoring that other conditions might also need to be met", correct: true, fb: "" },
      { id: "b", text: "It predicts the future based on past performance", correct: false, fb: "The argument uses 'if... then' conditional language, which is not inherently flawed. The real problem is about what conditions are necessary for keeping the franchise." },
      { id: "c", text: "It confuses a warning with a guarantee", correct: false, fb: "The argument does rely on the warning, but the core flaw is more specific: it treats one condition as if it were the only condition that matters." },
    ]
  },
];

const opts = [
  {
    letter: "A", text: "It draws a conclusion about what will happen from something that may or may not happen.", ok: false, flawType: "Not a flaw here",
    expl: "The argument uses conditional language: 'if the operator can maintain their performance.' It does not claim this will definitely happen. The 'if... then' structure is perfectly reasonable. The flaw lies elsewhere: in what the argument assumes is sufficient for keeping the franchise."
  },
  {
    letter: "B", text: "It assumes that there are no other reasons why a rail franchise might be lost.", ok: true, flawType: "Treating one condition as sufficient",
    expl: "This is the flaw. The passage tells us the franchise requires meeting 'certain standards, for example on punctuality.' The phrase 'for example' signals that punctuality is just one of several standards. The warning about late departures is one specific condition, but the argument concludes that meeting this single condition guarantees keeping the franchise. There could be other standards (safety, cleanliness, customer service) that SuperRail might fail, even if punctuality is fine."
  },
  {
    letter: "C", text: "It predicts what will happen in the future on the basis of what has happened to date.", ok: false, flawType: "Misreads the argument",
    expl: "The argument does not predict that SuperRail will maintain its performance. It says 'if' they maintain it. The conditional structure avoids making a prediction. The actual flaw is about assuming punctuality is the only relevant condition for keeping the franchise."
  },
  {
    letter: "D", text: "It denies the possibility that the company may exceed the limits and still keep the franchise.", ok: false, flawType: "Misidentifies the issue",
    expl: "This option focuses on whether exceeding limits could still allow keeping the franchise. But the argument's flaw goes the other direction: it assumes that not exceeding the punctuality limits is enough to keep it, ignoring other possible reasons for losing it. The argument's problem is about what is sufficient, not about what is necessary."
  },
  {
    letter: "E", text: "It concludes that the franchise will be kept but not that the fine will be avoided.", ok: false, flawType: "Irrelevant distinction",
    expl: "The passage states the fine and franchise loss come together ('it will receive a heavy fine and will lose its franchise'). If SuperRail keeps the franchise, it implicitly avoids both penalties. This is not where the reasoning breaks down. The real flaw is the assumption that punctuality alone determines whether the franchise is kept."
  },
];

function Vocab({ term, children }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline" }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ borderBottom: `2px dashed ${C.vocab}`, cursor: "help", color: C.vocab }}>{children || term}</span>
      {show && (
        <span style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "#2d3047", border: `1px solid ${C.vocab}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.vocab, width: 260, zIndex: 100, lineHeight: 1.5, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", pointerEvents: "none" }}>
          <span style={{ fontWeight: 700, display: "block", marginBottom: 4 }}>Definition</span>{vocabDefs[term]}
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
        Trains in the UK are operated by private companies approved by the government and awarded a <Vocab term="franchise">franchise</Vocab> for which they must meet certain standards, for example on <Vocab term="punctuality">punctuality</Vocab>. SuperRail, which operates the trains in one part of the country, has a poor record to date and has been warned that if it again exceeds the annual limits set by the government for late departures or arrivals, it will receive a <Vocab term="heavy fine">heavy fine</Vocab> and will lose its franchise. At the end of the <Vocab term="third quarter">third quarter</Vocab>, however, SuperRail's performance was within the <Vocab term="defined limits">defined limits</Vocab>. So if the operator can maintain their performance in the final quarter, they will keep the franchise for another year.
      </p>
    </div>
  );
}

function PassageAnnotated() {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>
        <span style={{ color: C.ctx, backgroundColor: C.ctxBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.ctx}` }}>Trains in the UK are operated by private companies approved by the government and awarded a franchise for which they must meet certain standards, for example on punctuality.</span>
        {" "}
        <span style={{ color: C.prem, backgroundColor: C.premBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.prem}` }}>SuperRail, which operates the trains in one part of the country, has a poor record to date and has been warned that if it again exceeds the annual limits set by the government for late departures or arrivals, it will receive a heavy fine and will lose its franchise.</span>
        {" "}
        <span style={{ color: C.prem, backgroundColor: C.premBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.prem}` }}>At the end of the third quarter, however, SuperRail's performance was within the defined limits.</span>
        {" "}
        <span style={{ color: C.concl, backgroundColor: C.conclBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.concl}` }}>So if the operator can maintain their performance in the final quarter, they will keep the franchise for another year.</span>
      </p>
      <div style={{ marginTop: 14, background: C.flawBg, border: `1px solid ${C.flaw}44`, borderRadius: 10, padding: "12px 16px" }}>
        <span style={{ background: `${C.flaw}22`, border: `1px solid ${C.flaw}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.flaw, fontWeight: 700 }}>THE LOGICAL LEAP</span>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
          The evidence tells us about <strong style={{ color: C.prem }}>one specific condition</strong>: the punctuality limits. But the passage itself mentions that franchises require meeting "certain standards, for example on punctuality." The conclusion <strong style={{ color: C.concl }}>assumes this one condition is the only one that matters</strong>, ignoring that there could be other reasons to lose a franchise.
        </p>
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
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>First, find the <strong style={{ color: C.concl }}>conclusion</strong>. Before we can spot a flaw, we need to know what the argument is actually claiming.</p>
        </div>
        <div style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 10, padding: "14px 18px", fontSize: 13, color: C.concl, lineHeight: 1.6 }}>
          <strong>Hint:</strong> Look for the sentence that draws everything together. What does the author conclude will happen based on the evidence presented?
        </div>
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
                <p style={{ margin: 0, fontSize: 13.5, color: C.text, lineHeight: 1.65 }}>
                  <strong style={{ color: C.ok }}>Correct!</strong> "So" signals the conclusion. The author claims that if SuperRail maintains its current performance on punctuality, it will keep the franchise. But is meeting this one condition really enough? Let's examine the reasoning more closely.
                </p>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: C.white }}>Try again. Look for the sentence that makes a claim or prediction based on the information given. Signal words like "so" or "therefore" often introduce the conclusion.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SpotTheFlawStep() {
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const stage = (feedback.sq1 === "correct" ? 1 : 0) + (feedback.sq2 === "correct" ? 1 : 0) + (feedback.sq3 === "correct" ? 1 : 0);
  const allDone = stage === 3;

  const handleClick = (qId, optId) => {
    if (feedback[qId] === "correct") return;
    const q = spotQs.find(x => x.id === qId);
    const o = q.options.find(x => x.id === optId);
    setAnswers(p => ({ ...p, [qId]: optId }));
    setFeedback(p => ({ ...p, [qId]: o.correct ? "correct" : "wrong" }));
  };

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.flawBg, border: `1px solid ${C.flaw}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.flaw, fontWeight: 700, whiteSpace: "nowrap" }}>STEP 2</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>The argument uses evidence to support its conclusion. But is the reasoning valid? Look at what the evidence actually establishes and what the conclusion assumes.</p>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span>
        <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
          <p style={{ margin: 0 }}>
            <span style={{ color: C.ctx, backgroundColor: C.ctxBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.ctx}` }}>Trains in the UK are operated by private companies approved by the government and awarded a franchise for which they must meet certain standards, <strong>for example</strong> on punctuality.</span>
            {" "}
            <span style={{ color: C.prem, backgroundColor: C.premBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.prem}` }}>SuperRail, which operates the trains in one part of the country, has a poor record to date and has been warned that if it again exceeds the annual limits set by the government for late departures or arrivals, it will receive a heavy fine and will lose its franchise.</span>
            {" "}
            <span style={{ color: C.prem, backgroundColor: C.premBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.prem}` }}>At the end of the third quarter, however, SuperRail's performance was within the defined limits.</span>
            {" "}
            <span style={{ color: C.concl, backgroundColor: C.conclBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.concl}` }}>So if the operator can maintain their performance in the final quarter, they will keep the franchise for another year.</span>
          </p>
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 10, fontSize: 11, color: C.muted }}>
          <span><span style={{ color: C.ctx }}>■</span> Background Context</span>
          <span><span style={{ color: C.prem }}>■</span> Evidence</span>
          <span><span style={{ color: C.concl }}>■</span> Conclusion</span>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>The reasoning chain</span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 8, padding: "10px 14px", width: "100%", boxSizing: "border-box" }}>
            <span style={{ background: `${C.prem}22`, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.prem, fontWeight: 700 }}>EVIDENCE</span>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: C.text, lineHeight: 1.5 }}>SuperRail was warned: exceed <strong style={{ color: C.prem }}>punctuality limits</strong> and lose the franchise. At end of Q3, performance was <strong style={{ color: C.prem }}>within the limits</strong>.</p>
            <span style={{ display: "inline-block", marginTop: 6, background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 4, padding: "2px 8px", fontSize: 10, color: C.prem, fontWeight: 600 }}>ONE SPECIFIC CONDITION</span>
          </div>
          <SmallArrow color={C.flaw} />
          <div style={{ background: C.flawBg, border: `2px dashed ${C.flaw}`, borderRadius: 10, padding: "10px 14px", width: "100%", boxSizing: "border-box", textAlign: "center" }}>
            <span style={{ fontSize: 12, color: C.flaw, fontWeight: 700 }}>LOGICAL LEAP</span>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: C.text, lineHeight: 1.5 }}>The argument assumes meeting this one condition is enough to keep the franchise, ignoring that there may be other requirements.</p>
          </div>
          <SmallArrow color={C.concl} />
          <div style={{ background: C.conclBg, border: `1.5px solid ${C.concl}`, borderRadius: 10, padding: "10px 14px", width: "100%", boxSizing: "border-box" }}>
            <span style={{ background: `${C.concl}22`, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.concl, fontWeight: 700 }}>CONCLUSION</span>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: C.concl, lineHeight: 1.5 }}>If they maintain performance, <strong>"they will keep the franchise"</strong></p>
            <span style={{ display: "inline-block", marginTop: 6, background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 4, padding: "2px 8px", fontSize: 10, color: C.concl, fontWeight: 600 }}>ASSUMES PUNCTUALITY IS SUFFICIENT</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 }}>
        {spotQs.map((q, idx) => {
          const fb = feedback[q.id];
          const isC = fb === "correct";
          const prevDone = idx === 0 || feedback[spotQs[idx - 1].id] === "correct";
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
                      fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif",
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
            <span style={{ background: `${C.assum}22`, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.assum, fontWeight: 700 }}>KEY SKILL</span>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
              This type of error is called <strong style={{ color: C.flaw }}>assuming one condition is sufficient when others may exist</strong>. The argument identifies one threat to the franchise (punctuality) and assumes that avoiding this single threat guarantees keeping it. But the passage itself hints there are "certain standards" (plural), with punctuality given only as an example. Watch for arguments that focus on one condition while ignoring the possibility of other relevant conditions.
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
    <div style={{
      background: expanded ? (o.ok ? C.conclBg : C.failBg) : "#1e2030",
      border: `1.5px solid ${bc}`, borderRadius: 12, padding: "14px 18px",
      cursor: "pointer", transition: "all 0.3s",
      opacity: animate ? 1 : 0, transform: animate ? "translateY(0)" : "translateY(12px)"
    }} onClick={onClick}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{
          background: expanded ? (o.ok ? C.ok : C.fail) : C.accent,
          borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: C.white, flexShrink: 0
        }}>{expanded ? (o.ok ? "✓" : "✗") : o.letter}</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, color: C.text, lineHeight: 1.6 }}>{o.text}</p>
          {expanded && (
            <div style={{ marginTop: 10 }}>
              <div style={{ marginBottom: 8 }}>
                <span style={{
                  background: o.ok ? `${C.concl}22` : C.failBg,
                  border: `1px solid ${o.ok ? C.concl : C.fail}`,
                  borderRadius: 6, padding: "2px 8px", fontSize: 10,
                  color: o.ok ? C.concl : C.fail, fontWeight: 700
                }}>{o.flawType}</span>
              </div>
              <div style={{
                padding: "10px 14px",
                background: o.ok ? C.conclBg : C.failBg,
                borderRadius: 8, fontSize: 13,
                color: o.ok ? C.concl : C.fail, lineHeight: 1.6,
                borderLeft: `3px solid ${o.ok ? C.ok : C.fail}`
              }}>
                {o.ok && <span style={{ fontWeight: 700 }}>CORRECT: </span>}{o.expl}
              </div>
              {o.ok && (
                <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
                  <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>The assumption exposed</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1, background: C.premBg, borderRadius: 8, padding: 12, border: `1px solid ${C.prem}` }}>
                      <p style={{ fontSize: 11, color: C.prem, fontWeight: 700, margin: "0 0 6px" }}>PASSAGE SAYS</p>
                      <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: "0 0 4px" }}>"certain standards"</p>
                      <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: "0 0 4px" }}>"for example on punctuality"</p>
                      <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Warning about one condition</p>
                      <span style={{ display: "inline-block", marginTop: 6, background: `${C.prem}22`, border: `1px solid ${C.prem}`, borderRadius: 4, padding: "2px 6px", fontSize: 9, color: C.prem, fontWeight: 700 }}>MULTIPLE STANDARDS EXIST</span>
                    </div>
                    <div style={{ flex: 1, background: C.conclBg, borderRadius: 8, padding: 12, border: `1px solid ${C.concl}` }}>
                      <p style={{ fontSize: 11, color: C.concl, fontWeight: 700, margin: "0 0 6px" }}>CONCLUSION ASSUMES</p>
                      <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: "0 0 4px" }}>Meet punctuality limits</p>
                      <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}> = keep the franchise</p>
                      <span style={{ display: "inline-block", marginTop: 6, background: `${C.concl}22`, border: `1px solid ${C.concl}`, borderRadius: 4, padding: "2px 6px", fontSize: 9, color: C.concl, fontWeight: 700 }}>ONLY ONE STANDARD MATTERS</span>
                    </div>
                  </div>
                </div>
              )}
              {!o.ok && (
                <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
                  <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, margin: "0 0 10px" }}>Why this misses the mark</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1, background: C.premBg, borderRadius: 8, padding: 12, border: `1px solid ${C.prem}` }}>
                      <p style={{ fontSize: 11, fontWeight: 700, margin: "0 0 6px", color: C.prem }}>THE ARGUMENT'S FOCUS</p>
                      <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Whether meeting <strong style={{ color: C.prem, fontWeight: 700 }}>punctuality limits alone</strong> is enough to guarantee keeping the franchise.</p>
                    </div>
                    <div style={{ flex: 1, background: C.failBg, borderRadius: 8, padding: 12, border: `1px solid ${C.fail}` }}>
                      <p style={{ fontSize: 11, fontWeight: 700, margin: "0 0 6px", color: C.fail }}>THIS OPTION'S FOCUS</p>
                      <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>
                        {o.letter === "A" && <><strong style={{ color: C.fail, fontWeight: 700 }}>Conditional language</strong>, which is actually fine in this argument.</>}
                        {o.letter === "C" && <><strong style={{ color: C.fail, fontWeight: 700 }}>Predicting from past data</strong>, which the argument avoids by using "if."</>}
                        {o.letter === "D" && <>Whether exceeding limits <strong style={{ color: C.fail, fontWeight: 700 }}>could still allow</strong> keeping the franchise.</>}
                        {o.letter === "E" && <>A <strong style={{ color: C.fail, fontWeight: 700 }}>distinction between fine and franchise</strong> that does not affect the reasoning.</>}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
            <span style={{ fontSize: 12, color: C.flaw }}>Detecting Reasoning Errors</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 27</p>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {stepsMeta.map(s => (
            <button key={s.id} onClick={() => setStep(s.id)} style={{
              flex: 1, minWidth: 0,
              background: step === s.id ? C.accent : step > s.id ? "rgba(108,92,231,0.15)" : "#1e2030",
              border: `1px solid ${step === s.id ? C.accent : step > s.id ? C.accent + "44" : C.border}`,
              borderRadius: 10, padding: "10px 6px", cursor: "pointer", transition: "all 0.3s",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif",
            }}>
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
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>Read the passage carefully. <span style={{ color: C.vocab }}>Hover yellow terms</span> for definitions. This is a <strong style={{ color: C.white }}>Detecting Reasoning Errors</strong> question:</p>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}>
                <em>"Which one of the following best illustrates the flaw in the above argument?"</em>
              </div>
              <div style={{ marginTop: 12, background: C.flawBg, border: `1px solid ${C.flaw}44`, borderRadius: 10, padding: "12px 16px" }}>
                <p style={{ margin: 0, fontSize: 13, color: C.flaw, lineHeight: 1.6 }}>
                  <strong>Reasoning Error questions</strong> ask you to find the logical mistake in an argument that might sound convincing. Your job is to identify exactly where the reasoning goes wrong: the point where the conclusion stops following from the evidence.
                </p>
              </div>
            </div>
          </>
        )}

        {step === 1 && <ConclusionFinder onFound={() => {}} />}
        {step === 2 && <SpotTheFlawStep />}

        {step === 3 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}>
                <em>"Which one of the following best illustrates the flaw in the above argument?"</em>
              </div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span>
              <PassageAnnotated />
              <div style={{ marginTop: 12, display: "flex", gap: 10, fontSize: 11, color: C.muted }}>
                <span><span style={{ color: C.ctx }}>■</span> Background Context</span>
                <span><span style={{ color: C.prem }}>■</span> Evidence</span>
                <span><span style={{ color: C.concl }}>■</span> Conclusion</span>
              </div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 14 }}>
              <p style={{ color: C.muted, fontSize: 14, margin: 0 }}><strong style={{ color: C.assum }}>Click each option</strong> to see why it's right or wrong:</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {opts.map((o, i) => (
                <OptionCard key={o.letter} o={o} expanded={expanded === o.letter} animate={optAnim[i]} onClick={() => setExpanded(p => p === o.letter ? null : o.letter)} />
              ))}
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: 12, paddingBottom: 32 }}>
          {step < 3 ? (<button onClick={() => setStep(step + 1)} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Next →</button>) : (<button onClick={() => window.dispatchEvent(new CustomEvent("walkthrough-complete"))} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.ok}, #2ecc71)`, color: C.white, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>✓ Back to Question Review</button>)}
        </div>
      </div>
    </div>
  );
}