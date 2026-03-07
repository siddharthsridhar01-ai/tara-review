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
  recycled: "Used again, or presented again without significant change. Here it means articles that repackage the same old stories rather than offering new reporting.",
  investigative: "Relating to detailed, in-depth research or examination. Investigative reporters dig deeply into stories to uncover hidden facts.",
  unearth: "To discover something hidden or previously unknown, often through careful searching or research.",
  unprepared: "Not ready or willing to do something. Here it means people are unwilling to pay for news content.",
};

const phrases = [
  { id: "p1", text: "People complain about the fact that newspapers are often full of recycled articles about celebrity gossip, but they forget that real news costs money – investigative reporters need to go out into the world and unearth new information.", role: "background" },
  { id: "p2", text: "The trouble is, those who complain are also unprepared to pay to read newspapers, expecting to get information for free online.", role: "background" },
  { id: "p3", text: "But what can people expect if they want to be able to read the news for free? As they say, you get what you pay for.", role: "background" },
  { id: "p4", text: "If you want something for free, then don't complain about the quality.", role: "principle" },
  { id: "p5", text: "This is as true of the news as of anything else.", role: "background" },
];

const principleQs = [
  { id: "pq1", prompt: "What is the key condition in this principle? What does the person choose to do?",
    options: [
      { id: "a", text: "They pay a high price for something", correct: false, fb: "The principle is about getting something for free, not paying a lot for it." },
      { id: "b", text: "They obtain something for free", correct: true, fb: "" },
      { id: "c", text: "They steal something illegally", correct: false, fb: "The passage is about freely available content, not theft. The principle focuses on the choice to get something without paying." },
    ]},
  { id: "pq2", prompt: "Given that condition, what does the principle say about complaining?",
    options: [
      { id: "a", text: "They have every right to complain about the quality", correct: false, fb: "The passage argues the opposite: if you choose the free option, you accept the quality that comes with it." },
      { id: "b", text: "They cannot complain about the quality", correct: true, fb: "" },
      { id: "c", text: "They should complain to someone else instead", correct: false, fb: "The principle doesn't redirect complaints. It says complaints about quality are not justified when you chose the free option." },
    ]},
];

const practiceScenarios = [
  { id: "s1", text: "A student downloads a free textbook PDF from the internet. The formatting is poor and some diagrams are missing. The student complains to their teacher about the quality.", applies: true, fb: "The student obtained the textbook for free. According to the principle, if you get something for free, you cannot complain about the quality. The principle applies." },
  { id: "s2", text: "A customer pays full price for a brand-new laptop. When they get home, the screen has a crack in it. The customer complains to the shop.", applies: false, fb: "The customer paid for the product. The principle only applies when something is obtained for free. A paying customer has every right to complain about quality." },
  { id: "s3", text: "A volunteer at a community event receives a free meal. The food is bland and undercooked. The volunteer complains to the organisers.", applies: true, fb: "The meal was free. The principle says if you get something for free, don't complain about the quality. It applies here regardless of how you feel about the food." },
];

const opts = [
  { letter: "A", text: "A person who is offered a free printer as a bonus when buying a new computer cannot complain if the computer is expensive.", ok: false,
    gotFree: true, complainAbout: "The price of the computer (which they paid for)",
    matchCondition: true, matchResponse: false,
    expl: "The person did get something free (the printer), but the complaint is about the price of the computer they paid for, not about the quality of the free item. The principle says you cannot complain about the quality of the free thing itself." },
  { letter: "B", text: "A person who gives as gifts items obtained for free cannot complain if friends and family criticise them for being selfish.", ok: false,
    gotFree: true, complainAbout: "Being called selfish (a social judgement)",
    matchCondition: true, matchResponse: false,
    expl: "The person got items for free, but the complaint is about being called selfish, not about the quality of the free items. The principle is specifically about quality, not about how others perceive your behaviour." },
  { letter: "C", text: "A person who finds a winning lottery ticket cannot complain if the owner of the ticket tries to claim the winnings.", ok: false,
    gotFree: false, complainAbout: "Losing the winnings to the rightful owner",
    matchCondition: false, matchResponse: false,
    expl: "This is about ownership and legal rights, not about quality. The person found something and someone else claims it. The principle is about not complaining about the quality of something you got for free." },
  { letter: "D", text: "A person who obtains free legal advice online cannot complain if the advice ends up being unhelpful.", ok: true,
    gotFree: true, complainAbout: "The quality of the free advice (unhelpful)",
    matchCondition: true, matchResponse: true,
    expl: "This matches perfectly. The person obtained something for free (legal advice online), and the complaint is about its quality (unhelpful). The principle says: if you get something for free, don't complain about the quality. Both the condition and the response match." },
  { letter: "E", text: "A person who buys an illegally copied film cannot complain if the picture is not as clear as they would like it to be.", ok: false,
    gotFree: false, complainAbout: "The quality of the film (picture clarity)",
    matchCondition: false, matchResponse: true,
    expl: "This is the trickiest distractor. The complaint IS about quality, which looks right. But the person bought the film. They paid money for it. The principle is specifically about getting something for free. Buying something illegally is not the same as getting it for free." },
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

function PassageRaw() {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>People complain about the fact that newspapers are often full of <Vocab term="recycled">recycled</Vocab> articles about celebrity gossip, but they forget that real news costs money – <Vocab term="investigative">investigative</Vocab> reporters need to go out into the world and <Vocab term="unearth">unearth</Vocab> new information. The trouble is, those who complain are also <Vocab term="unprepared">unprepared</Vocab> to pay to read newspapers, expecting to get information for free online. But what can people expect if they want to be able to read the news for free? As they say, you get what you pay for. If you want something for free, then don't complain about the quality. This is as true of the news as of anything else.</p>
    </div>
  );
}

function PassageAnnotated() {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>
        <span style={{ color: C.ctx, backgroundColor: C.ctxBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.ctx}` }}>People complain about the fact that newspapers are often full of recycled articles about celebrity gossip, but they forget that real news costs money – investigative reporters need to go out into the world and unearth new information. The trouble is, those who complain are also unprepared to pay to read newspapers, expecting to get information for free online. But what can people expect if they want to be able to read the news for free? As they say, you get what you pay for.</span>
        {" "}
        <span style={{ color: C.prin, backgroundColor: C.prinBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.prin}` }}>If you want something for free, then don't complain about the quality.</span>
        {" "}
        <span style={{ color: C.ctx, backgroundColor: C.ctxBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.ctx}` }}>This is as true of the news as of anything else.</span>
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
          <span style={{ fontSize: fs, color: C.prem, fontWeight: 600 }}>Something obtained for free</span>
        </div>
        <span style={{ fontSize: 16, color: C.prin }}>→</span>
        <div style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "4px 10px" }}>
          <span style={{ fontSize: fs, color: C.concl, fontWeight: 600 }}>Cannot complain about its quality</span>
        </div>
      </div>
      {!mini && <p style={{ margin: "8px 0 0", fontSize: 12, color: C.muted, lineHeight: 1.5 }}>Both parts must match: the item must be free, and the complaint must be about the quality of that free item.</p>}
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
    if (p.role === "principle") { setPrinFound(true); setWrongClick(null); }
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
            {clickPhase === "principle" && <>Find the <strong style={{ color: C.prin }}>principle</strong>. What general rule does the author state? Look for an "if... then..." statement that applies beyond just newspapers.</>}
            {clickPhase === "done" && <><strong style={{ color: C.ok }}>Principle found.</strong> Now answer the questions below to build the IF/THEN card.</>}
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
              <strong>Try again.</strong> That phrase gives context about the news situation. Look for the sentence that states a general rule about getting things for free.
            </p>
          </div>
        )}
        {prinFound && (
          <div style={{ marginTop: 8, background: `${C.prin}0a`, border: `1px solid ${C.prin}44`, borderRadius: 8, padding: "10px 14px" }}>
            <p style={{ margin: 0, fontSize: 13, color: C.text }}><strong style={{ color: C.prin }}>Correct!</strong> This is the general principle: if you want something for free, don't complain about the quality. Notice it applies to anything, not just news.</p>
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
              For "Applying Principles" questions, the correct answer must match <strong style={{ color: C.prin }}>both parts</strong> of the principle: the same <strong style={{ color: C.prem }}>condition</strong> (something obtained for free) and the same <strong style={{ color: C.concl }}>response</strong> (cannot complain about the quality of that free thing). If either part doesn't match, the option is wrong.
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
                {step < 3 ? (<button onClick={() => setStep(step + 1)} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Next →</button>) : (<button onClick={() => window.dispatchEvent(new CustomEvent("walkthrough-complete"))} style={{ flex: 1, padding: "13px 20px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${C.ok}, #2ecc71)`, color: C.white, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>✓ Back to Question Review</button>)}
        </div>
      </div>
    </div>
  );
}