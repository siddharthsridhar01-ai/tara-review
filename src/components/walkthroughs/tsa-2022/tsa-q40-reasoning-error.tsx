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
  "apocalyptic": "Describing a catastrophic, world-ending event or outcome.",
  "scaremongering": "The spreading of frightening or exaggerated reports to cause public alarm.",
  "poses": "Presents or constitutes (a threat, problem, or danger).",
  "eliminated": "Completely removed or got rid of.",
  "mankind": "The human race as a whole; all human beings collectively.",
};

const phrases = [
  { id: "p1", text: "Should we be worried about Artificial Intelligence (AI)?", isConclusion: false },
  { id: "p2", text: "On the one hand, there are big names that have expressed major concern. Elon Musk, Bill Gates and Stephen Hawking have all argued that AI poses the single biggest threat to mankind's existence.", isConclusion: false },
  { id: "p3", text: "At the same time there are people such as Mark Zuckerberg (Facebook CEO) and leading AI researcher Andrew Ng, who reject this view as scaremongering, and insist that the risks behind AI can be eliminated by following a few simple rules.", isConclusion: false },
  { id: "p4", text: "Clearly they cannot both be right, meaning that the truth must lie somewhere in the middle: AI cannot be without risks, but nor can it be the apocalyptic threat some say it is.", isConclusion: true },
];

const spotQs = [
  { id: "sq1", prompt: "The author notes that one side says AI is extremely dangerous, and the other says the risks can be eliminated. What does the author conclude from this disagreement?",
    options: [
      { id: "a", text: "One side must be completely wrong", correct: false, fb: "The author doesn't pick either side as wrong. Instead, they try to find a middle position between the two views." },
      { id: "b", text: "The truth must lie somewhere in the middle", correct: true, fb: "" },
      { id: "c", text: "We need more evidence before deciding", correct: false, fb: "The author doesn't call for more evidence. They jump straight to a middle-ground conclusion based solely on the fact that the two sides disagree." },
    ]},
  { id: "sq2", prompt: "The author's reasoning depends on one key claim: 'they cannot both be right.' Does this actually mean neither side is fully right?",
    options: [
      { id: "a", text: "Yes. If they disagree, neither can be completely correct", correct: false, fb: "Think more carefully. If two people disagree, it's possible that one of them is entirely correct and the other entirely wrong. Disagreement alone doesn't prove both are partially wrong." },
      { id: "b", text: "No. One side could be entirely right and the other entirely wrong", correct: true, fb: "" },
      { id: "c", text: "It depends on who has more expertise", correct: false, fb: "The logical point here is about what follows from disagreement itself, not about who is more qualified. The flaw is in the structure of the reasoning." },
    ]},
  { id: "sq3", prompt: "So what is the flaw in this argument?",
    options: [
      { id: "a", text: "It appeals to famous people instead of evidence", correct: false, fb: "While the passage does mention famous people, the author's own conclusion isn't based on their fame. The flaw is in how the author handles the disagreement between the two sides." },
      { id: "b", text: "It assumes that because both sides can't be right, the truth must be in between", correct: true, fb: "" },
      { id: "c", text: "It ignores the possibility that AI might not be developed at all", correct: false, fb: "Whether AI will be developed is a separate question. The flaw is specifically about the logical jump from 'they disagree' to 'the truth is in the middle.'" },
    ]},
];

const opts = [
  { letter: "A", text: "Just because people are household names, it does not mean they have the relevant expertise, or that their views are worth taking seriously.", ok: false, flawType: "Irrelevant (authority)",
    expl: "This criticises the use of famous names as evidence, which is a fair general point. But the author's own conclusion doesn't actually rely on the authority of these individuals. The author uses the disagreement itself (not the fame of those involved) to reach a middle-ground position. The real flaw is in how the author handles that disagreement." },
  { letter: "B", text: "It relies on the views of people who are likely to be biased in relation to AI.", ok: false, flawType: "Irrelevant (bias)",
    expl: "While Zuckerberg and Ng do have professional stakes in AI, the author's conclusion is not built on trusting one side over the other. The author explicitly tries to split the difference. The flaw is not about bias but about the false assumption that disagreement implies a middle ground." },
  { letter: "C", text: "It fails to consider whether the development of AI is indeed a genuine possibility.", ok: false, flawType: "Irrelevant (scope)",
    expl: "AI development is already well underway. This is not a serious gap in the argument. The passage is about the risks of AI, not whether AI will exist. The flaw lies in the logical structure of how the author derives the conclusion from the disagreement." },
  { letter: "D", text: "The fact that both sides in the dispute can't be right doesn't mean that neither of them is.", ok: true, flawType: "False middle ground",
    expl: "This is the flaw. The author reasons: Side A and Side B disagree, so they can't both be right, so the truth must be in between. But 'they can't both be right' is perfectly compatible with one side being entirely right and the other entirely wrong. The author wrongly assumes that disagreement between two extreme positions means the answer must be a compromise. This is sometimes called the 'false middle ground' or 'argument to moderation' fallacy." },
  { letter: "E", text: "It does not state what the rules around AI should actually be.", ok: false, flawType: "Irrelevant (detail)",
    expl: "The author is not trying to propose specific AI regulations. The argument is about whether AI is dangerous. Not spelling out rules is not a flaw in this particular line of reasoning. The real error is the logical jump from 'they disagree' to 'the truth is somewhere in between.'" },
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
      <p style={{ margin: 0 }}>
        Should we be worried about Artificial Intelligence (AI)? On the one hand, there are big names that have expressed major concern. Elon Musk, Bill Gates and Stephen Hawking have all argued that AI <Vocab term="poses">poses</Vocab> the single biggest threat to <Vocab term="mankind">mankind's</Vocab> existence. At the same time there are people such as Mark Zuckerberg (Facebook CEO) and leading AI researcher Andrew Ng, who reject this view as <Vocab term="scaremongering">scaremongering</Vocab>, and insist that the risks behind AI can be <Vocab term="eliminated">eliminated</Vocab> by following a few simple rules. Clearly they cannot both be right, meaning that the truth must lie somewhere in the middle: AI cannot be without risks, but nor can it be the <Vocab term="apocalyptic">apocalyptic</Vocab> threat some say it is.
      </p>
    </div>
  );
}

function PassageAnnotated() {
  return (
    <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
      <p style={{ margin: 0 }}>
        {"Should we be worried about Artificial Intelligence (AI)? "}
        <span style={{ color: C.prem, backgroundColor: C.premBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.prem}` }}>On the one hand, there are big names that have expressed major concern. Elon Musk, Bill Gates and Stephen Hawking have all argued that AI poses the single biggest threat to mankind's existence.</span>
        {" "}
        <span style={{ color: C.prem, backgroundColor: C.premBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.prem}` }}>At the same time there are people such as Mark Zuckerberg (Facebook CEO) and leading AI researcher Andrew Ng, who reject this view as scaremongering, and insist that the risks behind AI can be eliminated by following a few simple rules.</span>
        {" "}
        <span style={{ color: C.concl, backgroundColor: C.conclBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.concl}` }}>Clearly they cannot both be right, meaning that the truth must lie somewhere in the middle: AI cannot be without risks, but nor can it be the apocalyptic threat some say it is.</span>
      </p>
      <div style={{ marginTop: 14, background: C.flawBg, border: `1px solid ${C.flaw}44`, borderRadius: 10, padding: "12px 16px" }}>
        <span style={{ background: `${C.flaw}22`, border: `1px solid ${C.flaw}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.flaw, fontWeight: 700 }}>THE LOGICAL LEAP</span>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>
          The evidence presents <strong style={{ color: C.prem }}>two opposing views</strong>: one group says AI is extremely dangerous, the other says risks can be eliminated. The conclusion jumps to <strong style={{ color: C.concl }}>a middle ground</strong>: the truth "must lie somewhere in the middle." But just because two sides disagree doesn't mean neither is fully correct. One side could be entirely right.
        </p>
      </div>
    </div>
  );
}

function ConclusionFinder({ onFound }) {
  const [hovId, setHovId] = useState(null);
  const [wrongId, setWrongId] = useState(null);
  const [found, setFound] = useState(false);
  const handleClick = (p) => { if (found) return; if (p.isConclusion) { setFound(true); setWrongId(null); onFound(); } else { setWrongId(p.id); } };
  return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
          <span style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: C.concl, fontWeight: 700, whiteSpace: "nowrap" }}>STEP 1</span>
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>First, find the <strong style={{ color: C.concl }}>conclusion</strong>. Before we can spot a flaw, we need to know what the argument is actually claiming.</p>
        </div>
        <div style={{ background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 10, padding: "14px 18px", fontSize: 13, color: C.concl, lineHeight: 1.6 }}><strong>Hint:</strong> The conclusion is the author's own position on the AI debate. Look for where the author stops presenting other people's views and states their own verdict.</div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}><span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>Passage</span><span style={{ fontSize: 11, color: C.muted }}> · click on the sentence you think is the conclusion</span></div>
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
                <span style={{ background: `${C.concl}22`, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "3px 10px", fontSize: 11, color: C.concl, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0 }}>CONCLUSION</span>
                <p style={{ margin: 0, fontSize: 13.5, color: C.text, lineHeight: 1.65 }}><strong style={{ color: C.ok }}>Correct!</strong> "Clearly" signals the author's own verdict. Notice the structure: the author presents two opposing views, then concludes that "the truth must lie somewhere in the middle." This is the claim we need to examine for flaws.</p>
              </div>
            ) : (<p style={{ margin: 0, fontSize: 13, color: C.white }}>Try again. This sentence presents someone else's view, not the author's own conclusion. Look for where the author draws their own verdict from the disagreement.</p>)}
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
          <p style={{ color: C.text, fontSize: 14, lineHeight: 1.7, margin: 0 }}>The argument uses two opposing views to support a middle-ground conclusion. But is this reasoning valid? Let's examine the <strong style={{ color: C.prem }}>structure of the evidence</strong> and the <strong style={{ color: C.concl }}>logic of the conclusion</strong>.</p>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span>
        <div style={{ fontSize: 15.5, lineHeight: 2, color: C.text }}>
          <p style={{ margin: 0 }}>
            {"Should we be worried about Artificial Intelligence (AI)? "}
            <span style={{ color: C.prem, backgroundColor: C.premBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.prem}` }}>On the one hand, there are big names that have expressed major concern. Elon Musk, Bill Gates and Stephen Hawking have all argued that AI poses the single biggest threat to mankind's existence.</span>
            {" "}
            <span style={{ color: C.prem, backgroundColor: C.premBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.prem}` }}>At the same time there are people such as Mark Zuckerberg (Facebook CEO) and leading AI researcher Andrew Ng, who reject this view as scaremongering, and insist that the risks behind AI can be eliminated by following a few simple rules.</span>
            {" "}
            <span style={{ color: C.concl, backgroundColor: C.conclBg, padding: "2px 4px", borderRadius: 3, borderBottom: `2px solid ${C.concl}` }}>Clearly they cannot both be right, meaning that the truth must lie somewhere in the middle: AI cannot be without risks, but nor can it be the apocalyptic threat some say it is.</span>
          </p>
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 10, fontSize: 11, color: C.muted }}><span><span style={{ color: C.prem }}>■</span> Evidence (opposing views)</span><span><span style={{ color: C.concl }}>■</span> Conclusion</span></div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px", marginBottom: 18 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>The reasoning chain</span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 10, width: "100%" }}>
            <div style={{ flex: 1, background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 8, padding: "10px 14px" }}>
              <span style={{ background: `${C.prem}22`, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.prem, fontWeight: 700 }}>VIEW A</span>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: C.text, lineHeight: 1.5 }}>AI is the <strong style={{ color: C.prem }}>"single biggest threat"</strong> to mankind</p>
              <span style={{ display: "inline-block", marginTop: 6, background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 4, padding: "2px 8px", fontSize: 10, color: C.prem, fontWeight: 600 }}>EXTREME DANGER</span>
            </div>
            <div style={{ flex: 1, background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 8, padding: "10px 14px" }}>
              <span style={{ background: `${C.prem}22`, border: `1px solid ${C.prem}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.prem, fontWeight: 700 }}>VIEW B</span>
              <p style={{ margin: "6px 0 0", fontSize: 13, color: C.text, lineHeight: 1.5 }}>Risks can be <strong style={{ color: C.prem }}>"eliminated"</strong> with simple rules</p>
              <span style={{ display: "inline-block", marginTop: 6, background: C.premBg, border: `1px solid ${C.prem}`, borderRadius: 4, padding: "2px 8px", fontSize: 10, color: C.prem, fontWeight: 600 }}>MINIMAL RISK</span>
            </div>
          </div>
          <SmallArrow color={C.flaw} />
          <div style={{ background: C.flawBg, border: `2px dashed ${C.flaw}`, borderRadius: 10, padding: "10px 14px", width: "100%", boxSizing: "border-box", textAlign: "center" }}>
            <span style={{ fontSize: 12, color: C.flaw, fontWeight: 700 }}>LOGICAL LEAP</span>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: C.text, lineHeight: 1.5 }}>"They can't both be right" → "the truth must be in between"</p>
          </div>
          <SmallArrow color={C.concl} />
          <div style={{ background: C.conclBg, border: `1.5px solid ${C.concl}`, borderRadius: 10, padding: "10px 14px", width: "100%", boxSizing: "border-box" }}>
            <span style={{ background: `${C.concl}22`, border: `1px solid ${C.concl}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.concl, fontWeight: 700 }}>CONCLUSION</span>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: C.concl, lineHeight: 1.5 }}>The truth <strong>"must lie somewhere in the middle"</strong>: some risk, but not apocalyptic</p>
            <span style={{ display: "inline-block", marginTop: 6, background: C.conclBg, border: `1px solid ${C.concl}`, borderRadius: 4, padding: "2px 8px", fontSize: 10, color: C.concl, fontWeight: 600 }}>FALSE MIDDLE GROUND</span>
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
            <p style={{ margin: "8px 0 0", fontSize: 13, color: C.text, lineHeight: 1.6 }}>This type of error is called the <strong style={{ color: C.flaw }}>false middle ground</strong> (or "argument to moderation"). It occurs when someone assumes that because two opposing positions exist, the truth must lie between them. But disagreement alone tells us nothing about where the truth lies. One side could be entirely correct. Watch for arguments that present two extremes and then claim "the answer must be somewhere in between" without any independent reason for that claim.</p>
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
              <div style={{ marginBottom: 8 }}><span style={{ background: o.ok ? `${C.concl}22` : C.failBg, border: `1px solid ${o.ok ? C.concl : C.fail}`, borderRadius: 6, padding: "2px 8px", fontSize: 10, color: o.ok ? C.concl : C.fail, fontWeight: 700 }}>{o.flawType}</span></div>
              <div style={{ padding: "10px 14px", background: o.ok ? C.conclBg : C.failBg, borderRadius: 8, fontSize: 13, color: o.ok ? C.concl : C.fail, lineHeight: 1.6, borderLeft: `3px solid ${o.ok ? C.ok : C.fail}` }}>
                {o.ok && <span style={{ fontWeight: 700 }}>CORRECT: </span>}{o.expl}
              </div>
              {o.ok && (
                <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
                  <p style={{ fontSize: 12, color: C.assum, fontWeight: 600, margin: "0 0 10px" }}>Why this is a false middle ground</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1, background: C.premBg, borderRadius: 8, padding: 12, border: `1px solid ${C.prem}` }}>
                      <p style={{ fontSize: 11, color: C.prem, fontWeight: 700, margin: "0 0 6px" }}>WHAT'S ESTABLISHED</p>
                      <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: "0 0 4px" }}>Two sides disagree</p>
                      <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: "0 0 4px" }}>They can't both be right</p>
                      <span style={{ display: "inline-block", marginTop: 6, background: `${C.prem}22`, border: `1px solid ${C.prem}`, borderRadius: 4, padding: "2px 6px", fontSize: 9, color: C.prem, fontWeight: 700 }}>VALID SO FAR</span>
                    </div>
                    <div style={{ flex: 1, background: C.flawBg, borderRadius: 8, padding: 12, border: `1px solid ${C.flaw}` }}>
                      <p style={{ fontSize: 11, color: C.flaw, fontWeight: 700, margin: "0 0 6px" }}>WHAT'S ASSUMED</p>
                      <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: "0 0 4px" }}>Neither side is fully right</p>
                      <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: "0 0 4px" }}>Truth must be in between</p>
                      <span style={{ display: "inline-block", marginTop: 6, background: `${C.flaw}22`, border: `1px solid ${C.flaw}`, borderRadius: 4, padding: "2px 6px", fontSize: 9, color: C.flaw, fontWeight: 700 }}>DOES NOT FOLLOW</span>
                    </div>
                  </div>
                </div>
              )}
              {!o.ok && (
                <div style={{ background: "#151722", borderRadius: 10, padding: 16, marginTop: 10 }}>
                  <p style={{ fontSize: 12, color: C.muted, fontWeight: 600, margin: "0 0 10px" }}>Why this misses the point</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1, background: C.premBg, borderRadius: 8, padding: 12, border: `1px solid ${C.prem}` }}>
                      <p style={{ fontSize: 11, color: C.prem, fontWeight: 700, margin: "0 0 6px" }}>THE ARGUMENT'S FOCUS</p>
                      <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>Two sides disagree, so the truth must be in the middle</p>
                    </div>
                    <div style={{ flex: 1, background: C.failBg, borderRadius: 8, padding: 12, border: `1px solid ${C.fail}` }}>
                      <p style={{ fontSize: 11, color: C.fail, fontWeight: 700, margin: "0 0 6px" }}>THIS OPTION'S FOCUS</p>
                      <p style={{ fontSize: 12, color: C.text, lineHeight: 1.5, margin: 0 }}>{o.letter === "A" ? "Whether famous people have relevant expertise" : o.letter === "B" ? "Whether the people cited are biased about AI" : o.letter === "C" ? "Whether AI development is a real possibility" : "Whether specific AI rules are provided"}</p>
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
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>TSA 2022 · Question 40</p>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {stepsMeta.map(s => (<button key={s.id} onClick={() => setStep(s.id)} style={{ flex: 1, minWidth: 0, background: step === s.id ? C.accent : step > s.id ? "rgba(108,92,231,0.15)" : "#1e2030", border: `1px solid ${step === s.id ? C.accent : step > s.id ? C.accent + "44" : C.border}`, borderRadius: 10, padding: "10px 6px", cursor: "pointer", transition: "all 0.3s", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontFamily: "'Gill Sans', 'Trebuchet MS', Calibri, sans-serif" }}><span style={{ fontSize: 14, fontWeight: 700, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted, lineHeight: 1 }}>{s.id + 1}</span><span style={{ fontSize: 11, fontWeight: step === s.id ? 700 : 500, color: step === s.id ? C.white : step > s.id ? C.accentLight : C.muted, whiteSpace: "nowrap" }}>{s.label}</span></button>))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><span style={{ background: C.accent, borderRadius: 6, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: C.white }}>{step + 1}</span><h2 style={{ fontSize: 17, fontWeight: 700, color: C.white, margin: 0 }}>{stepsMeta[step].title}</h2></div>

        {step === 0 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}><span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span><PassageRaw /></div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 18 }}>
              <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" }}>Read the passage carefully. <span style={{ color: C.vocab }}>Hover yellow terms</span> for definitions. This is a <strong style={{ color: C.white }}>Detecting Reasoning Errors</strong> question:</p>
              <div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}><em>"Which one of the following best illustrates the flaw in the above argument?"</em></div>
              <div style={{ marginTop: 12, background: C.flawBg, border: `1px solid ${C.flaw}44`, borderRadius: 10, padding: "12px 16px" }}><p style={{ margin: 0, fontSize: 13, color: C.flaw, lineHeight: 1.6 }}><strong>Reasoning Error questions</strong> ask you to find the logical mistake in an argument that might sound convincing. Your job is to identify exactly where the reasoning goes wrong: the point where the conclusion stops following from the evidence.</p></div>
            </div>
          </>
        )}

        {step === 1 && <ConclusionFinder onFound={() => {}} />}
        {step === 2 && <SpotTheFlawStep />}

        {step === 3 && (
          <>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}><span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Question</span><div style={{ background: "#252839", border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px", fontSize: 14, color: C.white, lineHeight: 1.6 }}><em>"Which one of the following best illustrates the flaw in the above argument?"</em></div></div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "22px 24px", marginBottom: 18 }}><span style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Passage</span><PassageAnnotated /><div style={{ marginTop: 12, display: "flex", gap: 10, fontSize: 11, color: C.muted }}><span><span style={{ color: C.prem }}>■</span> Evidence (opposing views)</span><span><span style={{ color: C.concl }}>■</span> Conclusion</span></div></div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 24px", marginBottom: 14 }}><p style={{ color: C.muted, fontSize: 14, margin: 0 }}><strong style={{ color: C.assum }}>Click each option</strong> to see why it's right or wrong:</p></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {opts.map((o, i) => (<OptionCard key={o.letter} o={o} expanded={expanded === o.letter} animate={optAnim[i]} onClick={() => setExpanded(p => p === o.letter ? null : o.letter)} />))}
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