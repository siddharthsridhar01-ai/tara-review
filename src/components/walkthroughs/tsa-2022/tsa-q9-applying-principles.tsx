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
  "duty": "A moral or legal obligation to do something. Here it refers to a responsibility that bicycle owners carry.",
  "maintained": "Kept in good condition through regular checking and repair. Proper maintenance prevents things from breaking or becoming unsafe.",
  "entitled": "Having a right to something. If you are entitled to compensation, you have a legal or moral claim to receive it.",
  "compensation": "Money or other benefits given to someone to make up for loss, injury, or suffering they have experienced.",
  "failure": "The neglect or omission of an expected or required action. Here it means not doing what was needed to keep the bicycle in proper condition.",
};

const phrases = [
  { id: "p1", text: "Bicycle owners have a duty to have their bicycles maintained properly.", role: "background" },
  { id: "p2", text: "This is to ensure the safety both of the rider and of other road users.", role: "background" },
  { id: "p3", text: "If an injury is caused to another person as a result of a failure to maintain a bicycle properly, then the injured person should be entitled to compensation from the owner of the bicycle.", role: "principle" },
];

const principleQs = [
  { id: "pq1", prompt: "What is the key condition in this principle? What must have happened for the principle to apply?",
    options: [
      { id: "a", text: "Someone was injured by using their own equipment carelessly", correct: false, fb: "The principle is about injury to another person, not the owner injuring themselves through their own carelessness." },
      { id: "b", text: "Someone was injured due to a failure to maintain equipment properly", correct: true, fb: "" },
      { id: "c", text: "Someone was injured by a manufacturing defect in the equipment", correct: false, fb: "The principle focuses on a failure to maintain, not a manufacturing defect. Maintenance is about upkeep by the owner, not how it was built." },
    ]},
  { id: "pq2", prompt: "Given that condition, what does the principle say should happen?",
    options: [
      { id: "a", text: "The injured person should receive compensation from the equipment owner", correct: true, fb: "" },
      { id: "b", text: "The equipment should be confiscated", correct: false, fb: "The principle says nothing about confiscation. It specifically addresses compensation for the injured person." },
      { id: "c", text: "The injured person should receive compensation from the manufacturer", correct: false, fb: "The principle places responsibility on the owner who failed to maintain, not on the manufacturer who built it." },
    ]},
];

const practiceScenarios = [
  { id: "s1", text: "A pedestrian is hit by a car whose brakes had not been serviced in years. The pedestrian argues the car owner should pay for their medical bills.", applies: true, fb: "The car owner failed to maintain the brakes (maintenance failure), and another person was injured as a result. The injured person seeks compensation from the owner. This matches both parts of the principle." },
  { id: "s2", text: "A runner trips on their own shoelace during a marathon and breaks their ankle. They argue the shoe manufacturer should compensate them.", applies: false, fb: "The runner injured themselves through their own carelessness, not because of someone else's failure to maintain equipment. Also, they blame the manufacturer rather than an owner who failed to maintain. Neither part of the principle is matched." },
  { id: "s3", text: "A tenant is injured when a staircase railing in their building collapses because the landlord never repaired the loose bolts. The tenant seeks compensation from the landlord.", applies: true, fb: "The landlord (owner) failed to maintain the railing properly, and another person (the tenant) was injured as a result. The injured person seeks compensation from the owner. Both parts of the principle are satisfied." },
];

const opts = [
  { letter: "A", text: "Skiers injured whilst skiing off the official ski run should be entitled to compensation from the manufacturer of the skis.", ok: false,
    maintenanceFail: false, injuredOther: false, fromOwner: false,
    condition: "Skier's own choice to go off-run", response: "Compensation from manufacturer",
    expl: "The skier chose to ski off the official run, so the injury results from their own risky behaviour, not from anyone's failure to maintain equipment. Additionally, compensation is sought from the manufacturer, not from an owner who failed to maintain something. Neither part of the principle matches." },
  { letter: "B", text: "A passenger on a train who is injured tripping over luggage not put in the luggage rack should be entitled to compensation from the train company.", ok: false,
    maintenanceFail: false, injuredOther: true, fromOwner: false,
    condition: "Luggage left on floor (not a maintenance failure)",  response: "Compensation from train company",
    expl: "The injury was caused by luggage not being stored properly, which is about passenger behaviour, not a failure to maintain equipment or property. The train company did not fail to maintain anything. The condition of the principle is not met." },
  { letter: "C", text: "A child injured while playing on a broken swing in a park should be entitled to compensation from the park owner.", ok: true,
    maintenanceFail: true, injuredOther: true, fromOwner: true,
    condition: "Broken swing (maintenance failure)", response: "Compensation from owner",
    expl: "The swing is broken, meaning the park owner failed to maintain it properly. A child (another person) was injured as a result. The injured person seeks compensation from the owner. Both the condition (failure to maintain) and the response (compensation from the owner) match the principle exactly." },
  { letter: "D", text: "A householder scalded when pouring water from a kettle should be entitled to compensation from the manufacturer of the kettle.", ok: false,
    maintenanceFail: false, injuredOther: false, fromOwner: false,
    condition: "Scalded while pouring (user error or design issue)", response: "Compensation from manufacturer",
    expl: "The householder injured themselves while using their own kettle. This is not about someone else's failure to maintain equipment. Also, compensation is sought from the manufacturer, not from an owner who failed to maintain. The principle does not apply." },
  { letter: "E", text: "People who eat too many biscuits and damage their health should be entitled to compensation from the shops which sold the biscuits.", ok: false,
    maintenanceFail: false, injuredOther: false, fromOwner: false,
    condition: "Eating too many biscuits (own choice)", response: "Compensation from shops",
    expl: "The damage is caused by the person's own excessive consumption, not by anyone's failure to maintain anything. The shops did not fail to maintain equipment. This is about personal responsibility for one's own choices, not about an owner's duty to maintain property." },
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
      <p style={{ margin: 0 }}>Bicycle owners have a <Vocab term="duty">duty</Vocab> to have their bicycles <Vocab term="maintained">maintained</Vocab> properly. This is to ensure the safety both of the rider and of other road users. If an injury is caused to another person as a result of a <Vocab term="failure">failure</Vocab> to maintain a bicycle properly, then the injured person should be <Vocab term="entitled">entitled</Vocab> to <Vocab term="compensation">compensation</Vocab> from the owner of the bicycle.</p>
    </div>
  );
}

function PassageAnnotated() {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>
        <span style={{ color: C.ctx, backgroundColor: C.ctxBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.ctx}` }}>Bicycle owners have a duty to have their bicycles maintained properly. This is to ensure the safety both of the rider and of other road users.</span>
        {" "}
        <span style={{ color: C.prin, backgroundColor: C.prinBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.prin}` }}>If an injury is caused to another person as a result of a failure to maintain a bicycle properly, then the injured person should be entitled to compensation from the owner of the bicycle.</span>
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
          <span style={{ fontSize: fs, color: C.prem, fontWeight: 600 }}>Injury caused by failure to maintain</span>
        </div>
        <span style={{ fontSize: 16, color: C.prin }}>→</span>
        <div style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "4px 10px" }}>
          <span style={{ fontSize: fs, color: C.concl, fontWeight: 600 }}>Injured person gets compensation from owner</span>
        </div>
      </div>
      {!mini && <p style={{ margin: "8px 0 0", fontSize: 12, color: C.muted, lineHeight: 1.5 }}>Both parts must match: the injury must result from a maintenance failure by the owner, and compensation must come from that owner.</p>}
    </div>
  );
}

function PrincipleExtractor() {
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [prinFound, setPrinFound] = useState(false);
  const [hovId, setHovId] = useState(null);
  const [wrongClick, setWrongClick] = useState(null);

  const clickPhase = !prinFound ? "principle" : "done";
  const stage = (feedback.pq1 === "correct" ? 1 : 0) + (feedback.pq2 === "correct" ? 1 : 0);
  const allDone = stage === 2;

  const handlePhraseClick = (p) => {
    if (clickPhase === "done") return;
    if (clickPhase === "principle" && p.role === "principle") { setPrinFound(true); setWrongClick(null); }
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
            {clickPhase === "principle" && <>Find the <strong style={{ color: C.prin }}>principle</strong>. This passage has no separate conclusion. It states background information and then a general rule. Click the phrase that expresses the "if... then..." rule.</>}
            {clickPhase === "done" && <><strong style={{ color: C.ok }}>Principle found.</strong> Now answer the questions below to break it down into its two parts.</>}
          </p>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>Passage</span>
          {clickPhase !== "done" && <span style={{ fontSize: 11, color: C.muted }}> · click the principle</span>}
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
        {prinFound && (
          <div style={{ marginTop: 12, display: "flex", gap: 10, fontSize: 11, color: C.muted }}>
            <span><span style={{ color: C.ctx }}>■</span> Background Context</span>
            <span><span style={{ color: C.prin }}>■</span> Principle</span>
          </div>
        )}
        {wrongClick && clickPhase !== "done" && (
          <div style={{ marginTop: 8, background: C.failBg, border: `1px solid ${C.fail}44`, borderRadius: 8, padding: "10px 14px" }}>
            <p style={{ margin: 0, fontSize: 13, color: C.fail }}>
              <strong>Try again.</strong> Look for the phrase that states a general "if... then..." rule about what should happen when something goes wrong.
            </p>
          </div>
        )}
        {prinFound && (
          <div style={{ marginTop: 8, background: `${C.prin}0a`, border: `1px solid ${C.prin}44`, borderRadius: 8, padding: "10px 14px" }}>
            <p style={{ margin: 0, fontSize: 13, color: C.text }}><strong style={{ color: C.prin }}>Correct!</strong> This is the principle: if injury results from a failure to maintain, the injured person should get compensation from the owner.</p>
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
              For "Applying Principles" questions, the correct answer must match <strong style={{ color: C.prin }}>both parts</strong> of the principle: the same <strong style={{ color: C.prem }}>condition</strong> (injury caused by failure to maintain) and the same <strong style={{ color: C.concl }}>response</strong> (compensation from the owner). If the injury was caused by something else, like a manufacturing defect or the person's own carelessness, the principle does not apply.
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
            Before seeing the real options, practice applying the principle. For each scenario below, decide: does the principle apply?
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
                  fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif",
                }}>Principle applies</button>
                <button onClick={() => handleClick(s.id, false)} style={{
                  padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                  border: `1.5px solid ${isLocked && !s.applies ? C.ok : ans === false && isWrong ? C.fail : C.border}`,
                  background: isLocked && !s.applies ? C.conclBg : ans === false && isWrong ? C.failBg : "transparent",
                  color: isLocked && !s.applies ? C.ok : ans === false && isWrong ? C.fail : C.muted,
                  cursor: isLocked ? "default" : "pointer",
                  fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif",
                }}>Does not apply</button>
              </div>
              {isWrong && (
                <div style={{ marginTop: 8, padding: "8px 12px", background: C.failBg, border: `1px solid ${C.fail}44`, borderRadius: 8 }}>
                  <p style={{ margin: 0, fontSize: 13, color: C.fail, lineHeight: 1.5 }}><strong>Try again.</strong> Check both parts: was the injury caused by a failure to maintain, and is compensation sought from the owner?</p>
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
              The key test is always two-part: <strong style={{ color: C.prem }}>was the injury caused by a failure to maintain?</strong> And <strong style={{ color: C.concl }}>is compensation sought from the owner responsible for maintaining?</strong> Both must be true. Now apply this to the real options.
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
            <span style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 4, padding: "2px 6px", fontSize: 10, color: C.prem, fontWeight: 700 }}>MAINTENANCE FAILURE</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 4, padding: "2px 6px", fontSize: 10, color: C.concl, fontWeight: 700 }}>ANOTHER PERSON INJURED</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 4, padding: "2px 6px", fontSize: 10, color: C.concl, fontWeight: 700 }}>COMPENSATION FROM OWNER</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 200, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${o.ok ? C.ok : C.fail}44` }}>
          <p style={{ fontSize: 11, color: o.ok ? C.ok : C.fail, fontWeight: 700, margin: "0 0 8px" }}>OPTION {o.letter}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ background: o.maintenanceFail ? C.premBg : C.failBg, border: `1px solid ${o.maintenanceFail ? C.prem : C.fail}`, borderRadius: 4, padding: "2px 6px", fontSize: 10, color: o.maintenanceFail ? C.prem : C.fail, fontWeight: 700 }}>
              {o.condition.toUpperCase()}
            </span>
            {o.maintenanceFail ? <span style={{ fontSize: 12, color: C.ok }}>✓</span> : <span style={{ fontSize: 12, color: C.fail }}>✗</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ background: o.injuredOther ? C.conclBg : C.failBg, border: `1px solid ${o.injuredOther ? C.concl : C.fail}`, borderRadius: 4, padding: "2px 6px", fontSize: 10, color: o.injuredOther ? C.concl : C.fail, fontWeight: 700 }}>
              {o.injuredOther ? "ANOTHER PERSON INJURED" : "SELF-INFLICTED / OWN CHOICE"}
            </span>
            {o.injuredOther ? <span style={{ fontSize: 12, color: C.ok }}>✓</span> : <span style={{ fontSize: 12, color: C.fail }}>✗</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ background: o.fromOwner ? C.conclBg : C.failBg, border: `1px solid ${o.fromOwner ? C.concl : C.fail}`, borderRadius: 4, padding: "2px 6px", fontSize: 10, color: o.fromOwner ? C.concl : C.fail, fontWeight: 700 }}>
              {o.response.toUpperCase()}
            </span>
            {o.fromOwner ? <span style={{ fontSize: 12, color: C.ok }}>✓</span> : <span style={{ fontSize: 12, color: C.fail }}>✗</span>}
          </div>
        </div>
      </div>
      <div style={{ background: o.ok ? C.conclBg : C.failBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${o.ok ? C.ok : C.fail}` }}>
        <p style={{ margin: 0, fontSize: 12, color: o.ok ? C.ok : C.fail, lineHeight: 1.5, fontWeight: 600 }}>
          {o.ok ? "All three parts match the principle." : "Does not match: " + (!o.maintenanceFail ? "no maintenance failure" : !o.injuredOther ? "self-inflicted injury" : "compensation not from owner") + "."}
        </p>
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
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif", letterSpacing: 0.2, padding: "24px 16px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, borderRadius: 8, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: 1 }}>TARA</span>
            <span style={{ fontSize: 12, color: C.muted }}>Critical Thinking</span>
            <span style={{ fontSize: 12, color: C.muted }}>·</span>
            <span style={{ fontSize: 12, color: "#9b8ec9" }}>Applying Principles</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: C.white, margin: "0 0 4px", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif", fontStyle: "italic", letterSpacing: 0.5 }}>Interactive Walkthrough</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 9</p>
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
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>Read the passage carefully. <span style={{ color: C.vocab }}>Hover yellow terms</span> for definitions. This is an <strong style={{ color: C.white }}>Applying Principles</strong> question:</p>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}><em>"Which one of the following best illustrates the principle used in the above argument?"</em></div>
              <div style={{ marginTop: 12, background: "rgba(155,142,201,0.10)", border: "1px solid #9b8ec944", borderRadius: 10, padding: "12px 16px" }}>
                <p style={{ margin: 0, fontSize: 13, color: "#9b8ec9", lineHeight: 1.6 }}>
                  <strong>Applying Principles questions</strong> give you a passage containing a general rule or principle, and ask you to find another situation where the same rule applies. Ignore the topic entirely. The correct answer will have the same condition and the same response as the principle in the passage.
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
                <span><span style={{ color: C.ctx }}>■</span> Background Context</span>
                <span><span style={{ color: C.prin }}>■</span> Principle</span>
              </div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 20px", marginBottom: 18 }}><PrincipleCard mini /></div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 14 }}><p style={{ color: C.muted, fontSize: 14, margin: 0 }}><strong style={{ color: C.assum }}>Click each option</strong> to see whether it matches the principle:</p></div>
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
            fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif",
          }}>← Previous</button>
          <button onClick={() => setStep(Math.min(3, step + 1))} disabled={step === 3} style={{
            flex: 1, padding: "13px 20px", borderRadius: 10, border: "none",
            background: step === 3 ? "#1e2030" : `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
            color: step === 3 ? C.muted : C.white,
            fontSize: 14, fontWeight: 600,
            cursor: step === 3 ? "not-allowed" : "pointer",
            opacity: step === 3 ? 0.4 : 1,
            fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif",
          }}>Next →</button>
        </div>
      </div>
    </div>
  );
}