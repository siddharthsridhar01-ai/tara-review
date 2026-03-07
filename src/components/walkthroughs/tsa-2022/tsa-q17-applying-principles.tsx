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
                  <p style={{ margin: 0, fontSize: 13, color: C.fail, lineHeight: 1.5 }}><strong>Try again.</strong> Check both parts: was the thing obtained for free, and is the complaint about the quality of that free thing?</p>
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
              Two tests every time: <strong style={{ color: C.prem }}>was the item free?</strong> And <strong style={{ color: C.concl }}>is the complaint about the quality of that free item?</strong> Both must be true. Now apply this to the real options.
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
            <span style={{ background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 4, padding: "2px 6px", fontSize: 10, color: C.prem, fontWeight: 700 }}>OBTAINED FOR FREE</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 4, padding: "2px 6px", fontSize: 10, color: C.concl, fontWeight: 700 }}>COMPLAINT ABOUT QUALITY</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 200, background: "#1e2030", borderRadius: 8, padding: 12, border: `1px solid ${o.ok ? C.ok : C.fail}44` }}>
          <p style={{ fontSize: 11, color: o.ok ? C.ok : C.fail, fontWeight: 700, margin: "0 0 8px" }}>OPTION {o.letter}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ background: o.gotFree ? C.premBg : C.failBg, border: `1px solid ${o.gotFree ? C.prem : C.fail}`, borderRadius: 4, padding: "2px 6px", fontSize: 10, color: o.gotFree ? C.prem : C.fail, fontWeight: 700 }}>
              {o.gotFree ? "GOT SOMETHING FREE" : "DID NOT GET FREE"}
            </span>
            {o.matchCondition ? <span style={{ fontSize: 12, color: C.ok }}>✓</span> : <span style={{ fontSize: 12, color: C.fail }}>✗</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ background: o.matchResponse ? C.conclBg : C.failBg, border: `1px solid ${o.matchResponse ? C.concl : C.fail}`, borderRadius: 4, padding: "2px 6px", fontSize: 10, color: o.matchResponse ? C.concl : C.fail, fontWeight: 700 }}>
              {o.complainAbout}
            </span>
            {o.matchResponse ? <span style={{ fontSize: 12, color: C.ok }}>✓</span> : <span style={{ fontSize: 12, color: C.fail }}>✗</span>}
          </div>
        </div>
      </div>
      <div style={{ background: o.ok ? C.conclBg : C.failBg, borderRadius: 8, padding: "8px 12px", borderLeft: `3px solid ${o.ok ? C.ok : C.fail}` }}>
        <p style={{ margin: 0, fontSize: 12, color: o.ok ? C.ok : C.fail, lineHeight: 1.5, fontWeight: 600 }}>
          {o.ok ? "Both condition and response match." : (o.matchCondition && !o.matchResponse ? "Condition matches, but the complaint is not about quality of the free item." : !o.matchCondition && o.matchResponse ? "Complaint is about quality, but the item was not free." : "Neither condition nor response matches.")}
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
              {o.letter === "E" && !o.ok && (
                <div style={{ marginTop: 8, background: C.assumBg, border: `1px solid ${C.assum}44`, borderRadius: 8, padding: "8px 12px" }}>
                  <p style={{ margin: 0, fontSize: 12, color: C.assum, lineHeight: 1.5 }}>
                    <strong>Trickiest distractor.</strong> The quality complaint matches, which is why this feels close. But "buys" means it was not free. Illegality is a red herring. The principle is purely about price, not legality.
                  </p>
                </div>
              )}
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
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question</p>
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
