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
                        fontFamily: "'Trebuchet MS', 'Gill Sans', Calibri, sans-serif",
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
                <button onClick={() => handleClick(s.id, true)} style={{
                  padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                  border: `1.5px solid ${isLocked && s.applies ? C.ok : ans === true && isWrong ? C.fail : C.border}`,
                  background: isLocked && s.applies ? C.conclBg : ans === true && isWrong ? C.failBg : "transparent",
                  color: isLocked && s.applies ? C.ok : ans === true && isWrong ? C.fail : C.muted,
                  cursor: isLocked ? "default" : "pointer",
                  fontFamily: "'Trebuchet MS', 'Gill Sans', Calibri, sans-serif",
                }}>Principle applies</button>
                <button onClick={() => handleClick(s.id, false)} style={{
                  padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                  border: `1.5px solid ${isLocked && !s.applies ? C.ok : ans === false && isWrong ? C.fail : C.border}`,
                  background: isLocked && !s.applies ? C.conclBg : ans === false && isWrong ? C.failBg : "transparent",
                  color: isLocked && !s.applies ? C.ok : ans === false && isWrong ? C.fail : C.muted,
                  cursor: isLocked ? "default" : "pointer",
                  fontFamily: "'Trebuchet MS', 'Gill Sans', Calibri, sans-serif",
                }}>Does not apply</button>
              </div>
              {isWrong && (
                <div style={{ marginTop: 8, padding: "8px 12px", background: C.failBg, border: `1px solid ${C.fail}44`, borderRadius: 8 }}>
                  <p style={{ margin: 0, fontSize: 13, color: C.fail, lineHeight: 1.5 }}><strong>Try again.</strong> Ask yourself: is someone appealing to a right as justification for their behaviour?</p>
                </div>
              )}
              {isLocked && (
                <div style={{ marginTop: 8, padding: "8px 12px", background: `${C.ok}0a`, border: `1px solid ${C.ok}44`, borderRadius: 8 }}>
                  <p style={{ margin: 0, fontSize: 13, color: C.text, lineHeight: 1.5 }}><strong style={{ color: C.ok }}>Correct!</strong> {s.fb}</p>
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
              The key test is: <strong style={{ color: C.prem }}>is someone using a right as an excuse?</strong> If yes, the principle applies. If the scenario is about something else entirely (moral conflicts, unintentional harm), it does not illustrate the principle. Now apply this to the real options.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function MatchVisual({ o }) {
  return (
    <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
      <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 12px" }}>Does this match the principle?</p>
      <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${C.prin}44` }}>
          <p style={{ fontSize: 11, color: C.prin, fontWeight: 700, margin: "0 0 8px" }}>THE PRINCIPLE REQUIRES</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 4, padding: "2px 6px", fontSize: 10, color: C.prem, fontWeight: 700 }}>RIGHT USED AS EXCUSE</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ background: C.failBg, border: `1px solid ${C.fail}`, borderRadius: 4, padding: "2px 6px", fontSize: 10, color: C.fail, fontWeight: 700 }}>RIGHT DOES NOT JUSTIFY</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 200, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${o.ok ? C.ok : C.fail}44` }}>
          <p style={{ fontSize: 11, color: o.ok ? C.ok : C.fail, fontWeight: 700, margin: "0 0 8px" }}>OPTION {o.letter}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ background: o.rightUsed ? C.premBg : C.failBg, border: `1px solid ${o.rightUsed ? C.prem : C.fail}`, borderRadius: 4, padding: "2px 6px", fontSize: 10, color: o.rightUsed ? C.prem : C.fail, fontWeight: 700 }}>
              {o.rightUsed ? "RIGHT USED AS EXCUSE" : "NO RIGHT INVOKED"}
            </span>
            {o.rightUsed ? <span style={{ fontSize: 12, color: C.ok }}>✓</span> : <span style={{ fontSize: 12, color: C.fail }}>✗</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ background: o.ok ? C.failBg : C.neutralBg, border: `1px solid ${o.ok ? C.fail : C.neutral}`, borderRadius: 4, padding: "2px 6px", fontSize: 10, color: o.ok ? C.fail : C.neutral, fontWeight: 700 }}>
              {o.ok ? "RIGHT DOES NOT JUSTIFY" : "DIFFERENT ISSUE"}
            </span>
            {o.ok ? <span style={{ fontSize: 12, color: C.ok }}>✓</span> : <span style={{ fontSize: 12, color: C.fail }}>✗</span>}
          </div>
        </div>
      </div>
      <div style={{ background: o.ok ? C.conclBg : C.failBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${o.ok ? C.ok : C.fail}` }}>
        <p style={{ margin: 0, fontSize: 12, color: o.ok ? C.ok : C.fail, lineHeight: 1.5, fontWeight: 600 }}>{o.principle}</p>
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
              <div style={{ padding: "10px 14px", background: o.ok ? C.conclBg : C.failBg, borderRadius: 8, fontSize: 13, color: o.ok ? C.concl : C.fail, lineHeight: 1.6, borderLeft: `3px solid ${o.ok ? C.ok : C.fail}` }}>
                {o.ok ? <span style={{ fontWeight: 700 }}>CORRECT: </span> : <span style={{ fontWeight: 700 }}>DOES NOT MATCH: </span>}
                {o.expl}
              </div>
              <div onClick={e => e.stopPropagation()}><MatchVisual o={o} /></div>
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
      const timers = [0, 1, 2, 3, 4].map(i =>
        setTimeout(() => setOptAnim(p => { const n = [...p]; n[i] = true; return n; }), i * 100)
      );
      return () => timers.forEach(clearTimeout);
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
            <span style={{ fontSize: 12, color: "#9b8ec9" }}>Applying Principles</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 34</p>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {stepsMeta.map(s => (
            <button key={s.id} onClick={() => setStep(s.id)} style={{
              flex: 1, minWidth: 0,
              background: step === s.id ? C.accent : step > s.id ? "rgba(108,92,231,0.15)" : "#1e2030",
              border: `1px solid ${step === s.id ? C.accent : step > s.id ? C.accent + "44" : C.border}`,
              borderRadius: 10, padding: "10px 6px", cursor: "pointer", transition: "all 0.3s",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              fontFamily: "'Trebuchet MS', 'Gill Sans', Calibri, sans-serif",
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
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>Read the passage carefully. <span style={{ color: C.vocab }}>Hover yellow terms</span> for definitions. This is an <strong style={{ color: C.white }}>Applying Principles</strong> question:</p>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}><em>"Which one of the following best illustrates the principle used in the above argument?"</em></div>
              <div style={{ marginTop: 12, background: "rgba(155,142,201,0.10)", border: "1px solid #9b8ec944", borderRadius: 10, padding: "12px 16px" }}>
                <p style={{ margin: 0, fontSize: 13, color: "#9b8ec9", lineHeight: 1.6 }}>
                  <strong>Applying Principles questions</strong> ask you to find another situation where the same general rule from the passage applies. Ignore the topic entirely. The correct answer will have the same condition and the same response as the principle in the passage.
                </p>
              </div>
            </div>
          </>
        )}

        {step === 1 && <PrincipleExtractor />}
        {step === 2 && <PracticeStep />}

        {step === 3 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}><em>"Which one of the following best illustrates the principle used in the above argument?"</em></div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span>
              <PassageAnnotated />
              <div style={{ marginTop: 12, display: "flex", gap: 10, fontSize: 11, color: C.muted }}>
                <span><span style={{ color: C.prin }}>■</span> Principle</span>
                <span><span style={{ color: C.ctx }}>■</span> Background</span>
                <span><span style={{ color: C.concl }}>■</span> Conclusion</span>
              </div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 20px", marginBottom: 18 }}><PrincipleCard mini /></div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 14 }}><p style={{ color: C.muted, fontSize: 14, margin: 0 }}><strong style={{ color: C.assum }}>Click each option</strong> to see whether it illustrates the principle:</p></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {opts.map((o, i) => (<OptionCard key={o.letter} o={o} expanded={expanded === o.letter} animate={optAnim[i]} onClick={() => setExpanded(p => p === o.letter ? null : o.letter)} />))}
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: 12, paddingBottom: 32 }}>
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{
            flex: 1, padding: "13px 20px", borderRadius: 10,
            border: `1px solid ${C.border}`,
            background: step === 0 ? C.card : "#1e2030",
            color: step === 0 ? C.muted : C.text,
            fontSize: 14, fontWeight: 600,
            cursor: step === 0 ? "not-allowed" : "pointer",
            opacity: step === 0 ? 0.4 : 1,
            fontFamily: "'Trebuchet MS', 'Gill Sans', Calibri, sans-serif",
          }}>← Previous</button>
          {step < 3 ? (<button onClick={() => setStep(step + 1)} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Next →</button>) : (<button onClick={() => window.dispatchEvent(new CustomEvent("walkthrough-complete"))} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.ok}, #2ecc71)`, color: C.white, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>✓ Back to Question Review</button>)}
        </div>
      </div>
    </div>
  );
}