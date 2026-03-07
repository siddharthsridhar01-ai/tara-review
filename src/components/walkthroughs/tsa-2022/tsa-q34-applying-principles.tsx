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
  { id: 1, label: "Principle", title: "Extract the Principle" },
  { id: 2, label: "Practice", title: "Apply the Principle" },
  { id: 3, label: "Options", title: "Evaluate Each Option" },
];

const vocabDefs = {
  mimicking: "Imitating or copying someone's actions, manner, or appearance, often in a mocking way.",
  justification: "A reason or set of reasons given to show that something is right or reasonable.",
  morals: "Standards of behaviour or beliefs about what is right and wrong that guide a person's actions.",
  ought: "Used to indicate duty, correctness, or what is advisable. Similar to 'should.'",
};

const phrases = [
  { id: "p1", text: "A right is not an excuse.", role: "principle" },
  { id: "p2", text: "The fact that you have a right to do something cannot count as justification for doing it.", role: "principle" },
  { id: "p3", text: "I may have a right to walk along behind someone in the street, mimicking their walk. Does that mean I ought to go around doing this?", role: "background" },
  { id: "p4", text: "In fact, when deciding how to act, it isn't really rights we should be turning to in order to guide our decisions, but morals.", role: "conclusion" },
  { id: "p5", text: "You should not be asking: do I have a right to do this? Instead you should be asking: is it right that I should do this?", role: "conclusion" },
];

const principleQs = [
  { id: "pq1", prompt: "What does the passage say about having a right to do something?",
    options: [
      { id: "a", text: "Having a right to do something is a good enough reason to do it", correct: false, fb: "The passage explicitly says a right is NOT an excuse and cannot count as justification." },
      { id: "b", text: "Having a right to do something does not justify doing it", correct: true, fb: "" },
      { id: "c", text: "People do not actually have any rights", correct: false, fb: "The passage does not deny that rights exist. It says rights alone cannot justify actions." },
    ]},
  { id: "pq2", prompt: "Instead of relying on rights, what should guide our decisions according to the passage?",
    options: [
      { id: "a", text: "The law and legal rules", correct: false, fb: "The passage does not mention law. It contrasts rights with morals." },
      { id: "b", text: "What other people think of us", correct: false, fb: "The passage says nothing about other people's opinions. It points to morals as the guide." },
      { id: "c", text: "Whether the action is morally right", correct: true, fb: "" },
    ]},
];

const practiceScenarios = [
  { id: "s1", text: "A journalist publishes private photos of a celebrity and defends this by saying press freedom gives them the right to publish whatever they want.", applies: true, fb: "The journalist is using a right (press freedom) as justification for their action. The principle says having a right does not justify doing something. You should ask whether it is morally right to publish private photos." },
  { id: "s2", text: "A doctor refuses to perform a procedure they believe is harmful to the patient, even though the patient has requested it.", applies: false, fb: "This is about a moral judgment, not about someone defending an action by appealing to a right. The doctor is already guided by morals rather than rights, so the principle is not being illustrated here." },
  { id: "s3", text: "A neighbour plays extremely loud music late at night and, when confronted, says they have a right to enjoy music in their own home.", applies: true, fb: "The neighbour is using a right (to enjoy their property) as a defence for an action that is inconsiderate. The principle says having a right cannot count as justification. The question should be whether it is right to disturb others." },
];

const opts = [
  { letter: "A", text: "A person who fails to carry out a friend's dying wishes because they feel there is something morally wrong in the request has nevertheless failed to fulfil their moral duty.", ok: false,
    rightUsed: false, moralFocus: true, principle: "Moral conflict, not rights-as-excuse",
    expl: "This is about a conflict between two moral duties (honouring a friend's wishes vs. doing what feels morally right). Nobody is using a right to justify their behaviour. The passage's principle is specifically about people who appeal to rights as an excuse." },
  { letter: "B", text: "A person who drives dangerously without considering the dangers and ends up hurting someone else is morally blameworthy even if they had no intention to do so.", ok: false,
    rightUsed: false, moralFocus: true, principle: "Moral blame without intent, not rights-as-excuse",
    expl: "This is about whether moral blame requires intention. The dangerous driver is not defending their action by saying they had a right to drive. The passage's principle is about people who use rights to justify actions, not about unintentional harm." },
  { letter: "C", text: "A person who rejoices when a colleague goes through a hard time at work is still behaving badly, even if that person had previously caused them harm.", ok: false,
    rightUsed: false, moralFocus: true, principle: "Bad behaviour despite provocation, not rights-as-excuse",
    expl: "This is about whether past harm justifies taking pleasure in someone else's suffering. The person is not appealing to any right. They might feel entitled to their reaction, but the argument is about moral behaviour after provocation, not about rights being used as justification." },
  { letter: "D", text: "A person who upsets someone else by criticising their appearance cannot simply defend their action on grounds of freedom of speech.", ok: true,
    rightUsed: true, moralFocus: true, principle: "Right used as excuse → not justified",
    expl: "This is a perfect match. Someone does something hurtful (criticising appearance) and defends it by appealing to a right (freedom of speech). The principle says having a right to do something cannot count as justification for doing it. The person should ask whether it is right to criticise someone's appearance, not whether they have the right to." },
  { letter: "E", text: "A person who listens to their heart rather than their head when faced with a personal dilemma will not make the right decision.", ok: false,
    rightUsed: false, moralFocus: false, principle: "Heart vs. head, not rights-as-excuse",
    expl: "This is about the conflict between emotion and reason in decision-making. It has nothing to do with someone using a right as an excuse for their behaviour. The passage's principle is specifically about the inadequacy of rights as justification." },
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
      <p style={{ margin: 0 }}>A right is not an excuse. The fact that you have a right to do something cannot count as <Vocab term="justification">justification</Vocab> for doing it. I may have a right to walk along behind someone in the street, <Vocab term="mimicking">mimicking</Vocab> their walk. Does that mean I <Vocab term="ought">ought</Vocab> to go around doing this? In fact, when deciding how to act, it isn't really rights we should be turning to in order to guide our decisions, but <Vocab term="morals">morals</Vocab>. You should not be asking: do I have a right to do this? Instead you should be asking: is it right that I should do this?</p>
    </div>
  );
}

function PassageAnnotated() {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>
        <span style={{ color: C.prin, backgroundColor: C.prinBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.prin}` }}>A right is not an excuse. The fact that you have a right to do something cannot count as justification for doing it.</span>
        {" "}
        <span style={{ color: C.ctx, backgroundColor: C.ctxBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.ctx}` }}>I may have a right to walk along behind someone in the street, mimicking their walk. Does that mean I ought to go around doing this?</span>
        {" "}
        <span style={{ color: C.concl, backgroundColor: C.conclBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.concl}` }}>In fact, when deciding how to act, it isn't really rights we should be turning to in order to guide our decisions, but morals. You should not be asking: do I have a right to do this? Instead you should be asking: is it right that I should do this?</span>
      </p>
    </div>
  );
}

function PrincipleCard({ mini }) {
  const fs = mini ? 11 : 13;
  const pad = mini ? "8px 12px" : "14px 18px";
  return (
    <div style={{ background: C.prinBg, border: `1.5px solid ${C.prin}`, borderRadius: 10, padding: pad }}>
      <span style={{ background: `${C.prin}22`, border: `1px solid ${C.prin}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.prin, fontWeight: 700 }}>THE PRINCIPLE</span>
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <div style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "4px 10px" }}>
          <span style={{ fontSize: fs, color: C.prem, fontWeight: 600 }}>Having a right to do something</span>
        </div>
        <span style={{ fontSize: 16, color: C.prin }}>→</span>
        <div style={{ background: C.failBg, border: `1px solid ${C.fail}`, borderRadius: 6, padding: "4px 10px" }}>
          <span style={{ fontSize: fs, color: C.fail, fontWeight: 600 }}>Does NOT justify doing it</span>
        </div>
      </div>
      <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <div style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "4px 10px" }}>
          <span style={{ fontSize: fs, color: C.concl, fontWeight: 600 }}>Use morals, not rights, to guide actions</span>
        </div>
      </div>
      {!mini && <p style={{ margin: "8px 0 0", fontSize: 12, color: C.muted, lineHeight: 1.5 }}>The correct answer must show someone appealing to a right as justification, and illustrate that this is insufficient.</p>}
    </div>
  );
}

function PrincipleExtractor() {
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [conclFound, setConclFound] = useState(false);
  const [prinFound, setPrinFound] = useState(false);
  const [hovId, setHovId] = useState(null);
  const [wrongClick, setWrongClick] = useState(null);

  const clickPhase = !conclFound ? "conclusion" : !prinFound ? "principle" : "done";
  const stage = (feedback.pq1 === "correct" ? 1 : 0) + (feedback.pq2 === "correct" ? 1 : 0);
  const allDone = stage === 2;

  const handlePhraseClick = (p) => {
    if (clickPhase === "done") return;
    if (clickPhase === "conclusion" && (p.role === "conclusion")) { setConclFound(true); setWrongClick(null); }
    else if (clickPhase === "principle" && p.role === "principle") { setPrinFound(true); setWrongClick(null); }
    else { setWrongClick(p.id); }
  };

  const handleQ = (qId, optId) => {
    if (feedback[qId] === "correct") return;
    const q = principleQs.find(x => x.id === qId);
    const o = q.options.find(x => x.id === optId);
    setAnswers(p => ({ ...p, [qId]: optId }));
    setFeedback(p => ({ ...p, [qId]: o.correct ? "correct" : "wrong" }));
  };

  const getColor = (p) => {
    if (conclFound && p.role === "conclusion") return { c: C.concl, bg: C.conclBg };
    if (prinFound && p.role === "principle") return { c: C.prin, bg: C.prinBg };
    if (prinFound && p.role === "background") return { c: C.ctx, bg: C.ctxBg };
    return null;
  };

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
          <span style={{ background: C.prinBg, border: `1px solid ${C.prin}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.prin, fontWeight: 700, whiteSpace: "nowrap" }}>STEP 1</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            {clickPhase === "conclusion" && <>First, find the <strong style={{ color: C.concl }}>conclusion</strong>. What is the passage ultimately telling us we should do?</>}
            {clickPhase === "principle" && <><strong style={{ color: C.ok }}>Conclusion found.</strong> Now find the <strong style={{ color: C.prin }}>principle</strong>. What is the core claim about rights and justification?</>}
            {clickPhase === "done" && <><strong style={{ color: C.ok }}>Both found.</strong> Now answer the questions below to build the principle.</>}
          </p>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>Passage</span>
          {clickPhase !== "done" && <span style={{ fontSize: 11, color: C.muted }}> · click the {clickPhase === "conclusion" ? "conclusion" : "principle"}</span>}
        </div>
        <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
          {phrases.map((p) => {
            const cl = getColor(p);
            const isH = hovId === p.id && clickPhase !== "done";
            const isW = wrongClick === p.id;
            return (
              <span key={p.id} style={{ cursor: clickPhase === "done" ? "default" : "pointer" }}
                onMouseEnter={() => clickPhase !== "done" && setHovId(p.id)}
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
        {(conclFound || prinFound) && (
          <div style={{ marginTop: 12, display: "flex", gap: 10, fontSize: 11, color: C.muted }}>
            {prinFound && <span><span style={{ color: C.prin }}>■</span> Principle</span>}
            {prinFound && <span><span style={{ color: C.ctx }}>■</span> Background</span>}
            {conclFound && <span><span style={{ color: C.concl }}>■</span> Conclusion</span>}
          </div>
        )}
        {wrongClick && clickPhase !== "done" && (
          <div style={{ marginTop: 8, background: C.failBg, border: `1px solid ${C.fail}44`, borderRadius: 8, padding: "10px 14px" }}>
            <p style={{ margin: 0, fontSize: 13, color: C.fail }}>
              <strong>Try again.</strong> {clickPhase === "conclusion" ? "Look for the phrases that tell you what you should actually be doing when deciding how to act." : "Look for the phrases that make a claim about what rights can and cannot do."}
            </p>
          </div>
        )}
        {conclFound && !prinFound && !wrongClick && (
          <div style={{ marginTop: 8, background: `${C.concl}0a`, border: `1px solid ${C.concl}44`, borderRadius: 8, padding: "10px 14px" }}>
            <p style={{ margin: 0, fontSize: 13, color: C.text }}><strong style={{ color: C.ok }}>Correct!</strong> The conclusion tells us to use morals, not rights, to guide our decisions. Now find the principle that supports this.</p>
          </div>
        )}
        {prinFound && (
          <div style={{ marginTop: 8, background: `${C.prin}0a`, border: `1px solid ${C.prin}44`, borderRadius: 8, padding: "10px 14px" }}>
            <p style={{ margin: 0, fontSize: 13, color: C.text }}><strong style={{ color: C.prin }}>Correct!</strong> The principle is that having a right to do something cannot count as justification for doing it.</p>
          </div>
        )}
      </div>

      {prinFound && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 18 }}>
          {principleQs.map((q, idx) => {
            const fb = feedback[q.id];
            const isC = fb === "correct";
            const prevDone = idx === 0 || feedback[principleQs[idx - 1].id] === "correct";
            if (!prevDone) return null;
            return (
              <div key={q.id} style={{ background: C.card, border: `1px solid ${isC ? C.prin + "44" : C.border}`, borderRadius: 14, padding: "16px 20px" }}>
                <p style={{ margin: "0 0 10px", fontSize: 14, color: C.text, lineHeight: 1.6 }}>
                  <span style={{ color: C.muted, fontSize: 12, marginRight: 8 }}>{idx + 1}.</span>{q.prompt}
                </p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {q.options.map(o => {
                    const sel = answers[q.id] === o.id;
                    const thisC = isC && o.correct;
                    const thisW = sel && !o.correct && fb === "wrong";
                    return (
                      <button key={o.id} onClick={() => handleQ(q.id, o.id)} style={{
                        padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                        border: `1.5px solid ${thisC ? C.prin : thisW ? C.fail : C.border}`,
                        background: thisC ? C.prinBg : thisW ? C.failBg : "transparent",
                        color: thisC ? C.prin : thisW ? C.fail : C.muted,
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
      )}

      {allDone && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 24px", marginBottom: 18 }}>
          <PrincipleCard />
          <div style={{ marginTop: 14, background: C.assumBg, border: `1px solid ${C.assum}44`, borderRadius: 10, padding: "12px 16px" }}>
            <span style={{ background: `${C.assum}22`, border: `1px solid ${C.assum}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.assum, fontWeight: 700 }}>KEY SKILL</span>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
              For "Applying Principles" questions, the correct answer must match <strong style={{ color: C.prin }}>both parts</strong> of the principle: someone must be <strong style={{ color: C.prem }}>appealing to a right</strong> as justification, and the answer must show that this <strong style={{ color: C.fail }}>does not justify</strong> the action. If no right is being used as an excuse, the principle is not being illustrated.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function PracticeStep() {
  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState({});
  const allDone = practiceScenarios.every(s => locked[s.id]);

  const handleClick = (sId, val) => {
    if (locked[sId]) return;
    const s = practiceScenarios.find(x => x.id === sId);
    setAnswers(p => ({ ...p, [sId]: val }));
    if (val === s.applies) setLocked(p => ({ ...p, [sId]: true }));
  };

  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ background: C.prinBg, border: `1px solid ${C.prin}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.prin, fontWeight: 700, whiteSpace: "nowrap" }}>STEP 2</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
            Before seeing the real options, practice applying the principle. For each scenario below, decide: does it illustrate the principle?
          </p>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 20px", marginBottom: 18 }}>
        <PrincipleCard mini />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
        {practiceScenarios.map((s, i) => {
          const ans = answers[s.id];
          const isLocked = locked[s.id];
          const isWrong = ans !== undefined && ans !== s.applies && !isLocked;
          return (
            <div key={s.id} style={{ background: C.card, border: `1px solid ${isLocked ? C.ok + "44" : C.border}`, borderRadius: 14, padding: "16px 20px" }}>
              <p style={{ margin: "0 0 12px", fontSize: 14, color: C.text, lineHeight: 1.6 }}>
                <span style={{ color: C.muted, fontSize: 12, marginRight: 8 }}>Scenario {i + 1}</span>{s.text}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {step < 3 ? (<button onClick={() => setStep(step + 1)} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Next →</button>) : (<button onClick={() => window.dispatchEvent(new CustomEvent("walkthrough-complete"))} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.ok}, #2ecc71)`, color: C.white, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>✓ Back to Question Review</button>)}
        </div>
      </div>
    </div>
  );
}